const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const [users] = await db.execute(
            'SELECT id, fullName, email, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Verify admin role
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
};

// Verify kitchen owner role
const verifyKitchenOwner = (req, res, next) => {
    if (req.user.role !== 'kitchen_owner' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Kitchen owner role required.' });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyKitchenOwner
};