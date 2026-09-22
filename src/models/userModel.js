import { pool } from '../config/db.js';

export async function findByEmail(email, username) {
    try {
        const res = await pool.query(
            'Select * FROM users WHERE email = $1 OR username = $2', 
            [email, username]);
        return res.rows[0];
    } 
    catch (err) {
        throw err;
    }
};

export async function accountCreate(username, email, password_hash) {
    try {
        const data = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, password_hash]);
        return data.rows[0];
    } catch (err) {
        throw err;
    }
};

export async function savePasswordResetToken(email, token, expireTime) {
    try {
        await pool.query(
            `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`,
            [token, expireTime, email]
        );
        return true;
    } catch (err) {
        throw err;
    }
}

export async function findByResetToken(token) {
    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()`,
            [token]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

export async function updatePassword(userId, hashedPassword) {
    try {
        await pool.query(
            `UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2`,
            [hashedPassword, userId]
        );
        return true;
    } catch (err) {
        throw err;
    }
}