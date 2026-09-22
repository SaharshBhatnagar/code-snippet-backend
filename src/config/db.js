import { Pool } from 'pg';
import 'dotenv/config';
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
  ssl: {
    rejectUnauthorized: false
  }
});

async function connectDB() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the PostgreSQL database.');
        client.release();
    } catch (error) {
        console.log('Error connecting to the database:', error.message);
    }
};

export { pool, connectDB };