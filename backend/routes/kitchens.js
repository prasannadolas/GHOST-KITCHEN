const express = require('express');
const db = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all kitchens
router.get('/', async (req, res) => {
    try {
        const { search, cuisine, status } = req.query;
        
        let query = `
            SELECT k.*, 
                   COUNT(DISTINCT r.id) as review_count,
                   AVG(r.rating) as avg_rating
            FROM kitchens k
            LEFT JOIN reviews r ON k.id = r.kitchen_id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ' AND (k.name LIKE ? OR k.cuisine_type LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (cuisine) {
            query += ' AND k.cuisine_type LIKE ?';
            params.push(`%${cuisine}%`);
        }

        if (status) {
            query += ' AND k.is_active = ?';
            params.push(status === 'active' ? 1 : 0);
        }

        query += ' GROUP BY k.id ORDER BY k.created_at DESC';

        const [kitchens] = await db.execute(query, params);

        res.json({
            success: true,
            kitchens: kitchens.map(kitchen => ({
                ...kitchen,
                avg_rating: kitchen.avg_rating ? parseFloat(kitchen.avg_rating).toFixed(1) : '0.0',
                review_count: parseInt(kitchen.review_count) || 0
            }))
        });
    } catch (error) {
        console.error('Get kitchens error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single kitchen with menu
router.get('/:id', async (req, res) => {
    try {
        const kitchenId = req.params.id;

        // Get kitchen details
        const [kitchens] = await db.execute(
            'SELECT * FROM kitchens WHERE id = ?',
            [kitchenId]
        );

        if (kitchens.length === 0) {
            return res.status(404).json({ error: 'Kitchen not found' });
        }

        // Get menu items
        const [menuItems] = await db.execute(
            'SELECT * FROM menu_items WHERE kitchen_id = ? AND is_available = 1 ORDER BY category, name',
            [kitchenId]
        );

        // Get reviews
        const [reviews] = await db.execute(`
            SELECT r.*, u.fullName as customer_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.kitchen_id = ? 
            ORDER BY r.created_at DESC 
            LIMIT 10
        `, [kitchenId]);

        res.json({
            success: true,
            kitchen: kitchens[0],
            menuItems,
            reviews
        });
    } catch (error) {
        console.error('Get kitchen error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create kitchen (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const {
            name,
            description,
            cuisine_type,
            phone,
            email,
            address,
            image_url,
            opening_time,
            closing_time,
            delivery_fee,
            minimum_order
        } = req.body;

        if (!name || !cuisine_type || !phone || !email) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const [result] = await db.execute(`
            INSERT INTO kitchens 
            (name, description, cuisine_type, phone, email, address, image_url, 
             opening_time, closing_time, delivery_fee, minimum_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name, description, cuisine_type, phone, email, address, image_url,
            opening_time || '09:00:00', closing_time || '22:00:00',
            delivery_fee || 40.00, minimum_order || 150.00
        ]);

        res.status(201).json({
            success: true,
            message: 'Kitchen created successfully',
            kitchenId: result.insertId
        });
    } catch (error) {
        console.error('Create kitchen error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update kitchen
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const kitchenId = req.params.id;
        const {
            name,
            description,
            cuisine_type,
            phone,
            email,
            address,
            image_url,
            is_active,
            opening_time,
            closing_time,
            delivery_fee,
            minimum_order
        } = req.body;

        await db.execute(`
            UPDATE kitchens SET 
            name = ?, description = ?, cuisine_type = ?, phone = ?, email = ?,
            address = ?, image_url = ?, is_active = ?, opening_time = ?,
            closing_time = ?, delivery_fee = ?, minimum_order = ?
            WHERE id = ?
        `, [
            name, description, cuisine_type, phone, email, address, image_url,
            is_active, opening_time, closing_time, delivery_fee, minimum_order, kitchenId
        ]);

        res.json({
            success: true,
            message: 'Kitchen updated successfully'
        });
    } catch (error) {
        console.error('Update kitchen error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete kitchen
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const kitchenId = req.params.id;

        await db.execute('DELETE FROM kitchens WHERE id = ?', [kitchenId]);

        res.json({
            success: true,
            message: 'Kitchen deleted successfully'
        });
    } catch (error) {
        console.error('Delete kitchen error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;