import { pool } from '../config/db.js';

const Snippets = { 
    findAll: async () => {
        try {
            const results = await pool.query('SELECT * FROM snippets ORDER BY created_at DESC');
            return results.rows;
        }
        catch (err) {
            throw err;
        }
    },
    getFavorites: async (userId) => {
        try {
            const result = await pool.query(`
                SELECT snippets.* FROM snippets 
                INNER JOIN user_favorites ON snippets.id = user_favorites.snippet_id
                WHERE user_favorites.user_id = $1
                ORDER BY user_favorites.created_at DESC;
            `, [userId]);
            return result.rows;
        }
        catch (err) {
            throw err;
        }
    },
    addFavorite: async (userId, snippetId) => {
        try {
            const result = await pool.query(`
                INSERT INTO user_favorites (user_id, snippet_id)
                VALUES ($1, $2)
                RETURNING *;
                `, [userId, snippetId]);
            return result.rows[0]
        } 
        catch (err) {
                throw err;
        }
    },
    removeFavorite: async (userId, snippetId) => {
        try {
            const result = await pool.query(`
                DELETE FROM user_favorites
                WHERE user_id = $1 AND snippet_id = $2;
                `, [userId, snippetId]);
            return result.rowCount > 0;
        } 
        catch (err) {
            throw err;
        }
    }
};

export default Snippets;