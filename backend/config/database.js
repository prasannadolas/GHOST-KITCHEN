const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

// Check if we are running on Render (production)
const isProduction = process.env.NODE_ENV === 'production';

/**
 * DATABASE CONNECTION POOL
 * Priority 1: Use DB_URL (This is what we set in Render for TiDB)
 * Priority 2: Use individual env variables (For your local laptop)
 */
const pool = mysql.createPool({
    uri: process.env.DB_URL || undefined,
    
    // Only used if DB_URL is not present (Localhost)
    host: !process.env.DB_URL ? (process.env.DB_HOST || 'localhost') : undefined,
    user: !process.env.DB_URL ? (process.env.DB_USER || 'root') : undefined,
    password: !process.env.DB_URL ? (process.env.DB_PASSWORD || '') : undefined,
    database: !process.env.DB_URL ? (process.env.DB_NAME || 'ghost_kitchen') : undefined,
    port: !process.env.DB_URL ? (process.env.DB_PORT || 3306) : undefined,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
    // TiDB Cloud REQUIRES SSL. Local MySQL usually does not.
    ssl: isProduction || process.env.DB_URL ? { rejectUnauthorized: true } : false
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        
        // Extra check to see which database we are actually using
        const [rows] = await connection.query('SELECT DATABASE() as db');
        console.log(`📡 Connected to database: ${rows[0].db}`);
        
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed!');
        console.error(`Error Detail: ${error.message}`);
        
        if (isProduction) {
            console.error('PRO-TIP: Check if your DB_URL on Render includes the SSL parameter at the end.');
            process.exit(1);
        }
    }
};

testConnection();

module.exports = pool;