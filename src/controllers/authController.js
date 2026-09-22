import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';
import { findByEmail, accountCreate, savePasswordResetToken, findByResetToken, updatePassword } from '../models/userModel.js';

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const checkExistingUser = await findByEmail(email, username);

        if (checkExistingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await accountCreate(username, email, password_hash);

        return res.status(201).json({ message: "User registered successfully", user: newUser});
    } catch (err) {
        console.error("Auth Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const checkUser = await findByEmail(email, username);

        if (!checkUser) {
            return res.status(401).json({ error: "Unauthorized User, Invalid Credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, checkUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Unauthorized User, Invalid Credentials"});
        }

        const tokenData = {
            id: checkUser.id,
            username: checkUser.username
        };

        const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h'});
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 3600000
        });

        return res.status(200).json({ 
            message: "User Login Successfully", 
            userName: checkUser.username 
        });

    } catch (err) {
        console.error("Auth Error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export async function logoutUser(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.status(200).json({ message: "Logged out successfully" });
};

export async function verifySession(req, res) {
    return res.status(200).json({ 
        user: { 
            success: "Verified", 
            id: req.user.id, 
            username: req.user.username
         } 
    });
};

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email address is required." });
        }
        
        const checkUser = await findByEmail(email, '');
        if (!checkUser) {
            return res.status(404).json({ error: "No account found with this email." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expireTime = new Date(Date.now() + 3600000);

        await savePasswordResetToken(email, resetToken, expireTime);

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
        
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: '"Code Snippet Hub" <saharsh.cse@gmail.com>',
            to: email,
            subject: 'Code Snippet Hub - Secure Password Reset',
            text: `Hello ${checkUser.username},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4285F4;">Password Reset Request</h2>
                    <p>Hello <b>${checkUser.username}</b>,</p>
                    <p>We received a request to reset your password for your Code Snippet Hub account.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #34A853; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="font-size: 0.9em; color: #666;">
                        Or copy and paste this link into your browser:<br>
                        <a href="${resetLink}" style="color: #4285F4; word-break: break-all;">${resetLink}</a>
                    </p>
                    
                    <p style="background-color: #f5f8ff; padding: 15px; border-left: 4px solid #EA4335; margin-top: 30px; font-size: 0.85em;">
                        <b>Security Notice:</b> This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you have concerns.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        return res.status(500).json({ error: "Failed to send email. Check server configuration." });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: "Missing token or new password." });
        }

        const user = await findByResetToken(token);
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired password reset token." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await updatePassword(user.id, hashedPassword);

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({ error: "Server error while resetting password." });
    }
}