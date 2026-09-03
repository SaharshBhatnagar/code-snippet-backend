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