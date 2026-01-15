const express = require('express');
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user addresses
router.get('/addresses', verifyToken, async (req, res) => {
    try {
        const [addresses] = await db.execute(
            'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [req.user.id]
        );

        res.json({
            success: true,
            addresses
        });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add user address
router.post('/addresses', verifyToken, async (req, res) => {
    try {
        const {
            address_type,
            address_line1,
            address_line2,
            city,
            state,
            pincode,
            landmark,
            is_default
        } = req.body;

        if (!address_line1 || !city || !state || !pincode) {
            return res.status(400).json({ error: 'Required address fields missing' });
        }

        // If this is set as default, unset other defaults
        if (is_default) {
            await db.execute(
                'UPDATE user_addresses SET is_default = 0 WHERE user_id = ?',
                [req.user.id]
            );
        }

        const [result] = await db.execute(`
            INSERT INTO user_addresses 
            (user_id, address_type, address_line1, address_line2, city, state, pincode, landmark, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            req.user.id, address_type || 'home', address_line1, address_line2,
            city, state, pincode, landmark, is_default || false
        ]);

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addressId: result.insertId
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user address
router.put('/addresses/:id', verifyToken, async (req, res) => {
    try {
        const addressId = req.params.id;
        const {
            address_type,
            address_line1,
            address_line2,
            city,
            state,
            pincode,
            landmark,
            is_default
        } = req.body;

        // Verify address belongs to user
        const [addresses] = await db.execute(
            'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, req.user.id]
        );

        if (addresses.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // If this is set as default, unset other defaults
        if (is_default) {
            await db.execute(
                'UPDATE user_addresses SET is_default = 0 WHERE user_id = ?',
                [req.user.id]
            );
        }

        await db.execute(`
            UPDATE user_addresses SET 
            address_type = ?, address_line1 = ?, address_line2 = ?, city = ?,
            state = ?, pincode = ?, landmark = ?, is_default = ?
            WHERE id = ? AND user_id = ?
        `, [
            address_type, address_line1, address_line2, city, state, pincode,
            landmark, is_default, addressId, req.user.id
        ]);

        res.json({
            success: true,
            message: 'Address updated successfully'
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete user address
router.delete('/addresses/:id', verifyToken, async (req, res) => {
    try {
        const addressId = req.params.id;

        await db.execute(
            'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, req.user.id]
        );

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;