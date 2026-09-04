import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findByEmail, accountCreate } from '../models/userModel.js';

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
        success: "Verified", 
        id: req.user.id, 
        username: req.user.username
    });
};