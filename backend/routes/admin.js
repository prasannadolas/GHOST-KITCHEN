// in /routes/admin.js

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Import BOTH middleware functions
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// This route is protected. Only logged-in admins can access it.
// We apply the middleware in sequence: first verify the token, then verify the admin role.
router.get('/dashboard-stats', [verifyToken, verifyAdmin], async (req, res) => {
    try {
        // Since the middleware passed, we know the user is an admin.
        // You can now fetch admin-specific data.
        const [users] = await db.execute('SELECT COUNT(*) as userCount FROM users');
        const [orders] = await db.execute('SELECT COUNT(*) as orderCount FROM orders');

        res.json({
            success: true,
            stats: {
                totalUsers: users[0].userCount,
                totalOrders: orders[0].orderCount
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;