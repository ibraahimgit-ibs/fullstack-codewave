import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to DB:', err)
  } else {
    console.log('Connected! Current time:', res.rows[0])
  }
});

export default pool;
