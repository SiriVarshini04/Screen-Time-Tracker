const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // ✅ FIXED
  database: process.env.DB_NAME || 'screen_time_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Error connecting to MySQL db:', err.message);
  } else {
    console.log('✅ Connected to MySQL via connection pool.');
    conn.release();
  }
});

const promisePool = pool.promise();

module.exports = promisePool;