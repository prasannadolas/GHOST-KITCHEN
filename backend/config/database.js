const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Adjust path if your .env is in the root

// Create a connection pool instead of a single connection
// This handles multiple concurrent requests efficiently
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ghost_kitchen',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection immediately when the server starts
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully to:', process.env.DB_NAME || 'ghost_kitchen');
        connection.release(); // Always release the connection back to the pool
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error.message);
        // Do not kill the process in development, just warn
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

testConnection();

module.exports = pool;