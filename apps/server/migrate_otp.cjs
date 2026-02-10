const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'afiliateecommerce'
  });

  try {
    console.log('Adding purpose column to otp table...');
    await pool.query("ALTER TABLE otp ADD COLUMN purpose ENUM('signup', 'login', 'forgot') NOT NULL DEFAULT 'login' AFTER otp_hash;");
    console.log('Migration successful!');
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log('Column already exists.');
    } else {
        console.error('Migration failed:', err.message);
    }
  } finally {
    await pool.end();
  }
}

migrate();
