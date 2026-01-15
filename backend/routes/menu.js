const express = require('express');
const db = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get menu items by kitchen
router.get('/kitchen/:kitchenId', async (req, res) => {
    try {
        const kitchenId = req.params.kitchenId;
        const { category } = req.query;

        let query = 'SELECT * FROM menu_items WHERE kitchen_id = ? AND is_available = 1';
        const params = [kitchenId];

        if (category && category !== 'all') {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY category, name';

        const [menuItems] = await db.execute(query, params);

        res.json({
            success: true,
            menuItems
        });
    } catch (error) {
        console.error('Get menu items error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all menu items (Admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const [menuItems] = await db.execute(`
            SELECT mi.*, k.name as kitchen_name
            FROM menu_items mi
            JOIN kitchens k ON mi.kitchen_id = k.id
            ORDER BY k.name, mi.category, mi.name
        `);

        res.json({
            success: true,
            menuItems
        });
    } catch (error) {
        console.error('Get admin menu items error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create menu item
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const {
            kitchen_id,
            name,
            description,
            price,
            category,
            image_url,
            is_vegetarian,
            is_vegan,
            spice_level,
            preparation_time
        } = req.body;

        if (!kitchen_id || !name || !price || !category) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const [result] = await db.execute(`
            INSERT INTO menu_items 
            (kitchen_id, name, description, price, category, image_url, 
             is_vegetarian, is_vegan, spice_level, preparation_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            kitchen_id, name, description, price, category, image_url,
            is_vegetarian || false, is_vegan || false, spice_level || 'mild',
            preparation_time || 15
        ]);

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            itemId: result.insertId
        });
    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update menu item
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const itemId = req.params.id;
        const {
            name,
            description,
            price,
            category,
            image_url,
            is_available,
            is_vegetarian,
            is_vegan,
            spice_level,
            preparation_time
        } = req.body;

        await db.execute(`
            UPDATE menu_items SET 
            name = ?, description = ?, price = ?, category = ?, image_url = ?,
            is_available = ?, is_vegetarian = ?, is_vegan = ?, spice_level = ?,
            preparation_time = ?
            WHERE id = ?
        `, [
            name, description, price, category, image_url, is_available,
            is_vegetarian, is_vegan, spice_level, preparation_time, itemId
        ]);

        res.json({
            success: true,
            message: 'Menu item updated successfully'
        });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete menu item
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const itemId = req.params.id;

        await db.execute('DELETE FROM menu_items WHERE id = ?', [itemId]);

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;