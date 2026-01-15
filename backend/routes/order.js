// backend/routes/order.js

const express = require('express');
const db = require('../config/database'); // Ensure you are using the correct path to your db config
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/user', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        // FIX #1: Changed 'oi.price' to 'oi.unit_price' to match your database schema.
        let query = `
            SELECT o.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', oi.id,
                           'name', mi.name,
                           'price', oi.unit_price,
                           'quantity', oi.quantity,
                           'image_url', mi.image_url
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.user_id = ?
        `;
        const params = [userId];

        if (status && status !== 'all') {
            query += ' AND o.status = ?';
            params.push(status);
        }

        query += ' GROUP BY o.id ORDER BY o.created_at DESC';

        const [orders] = await db.execute(query, params);

        // Parse items JSON if not null
        const formattedOrders = orders.map(order => ({
            ...order,
            items: order.items ? JSON.parse(`[${order.items}]`) : []
        }));

        res.json({
            success: true,
            orders: formattedOrders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all orders (Admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT o.*, u.fullName as customer_name, u.email as customer_email,
                   COUNT(oi.id) as item_count
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE 1=1
        `;
        const params = [];

        if (status && status !== 'all') {
            query += ' AND o.status = ?';
            params.push(status);
        }

        query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [orders] = await db.execute(query, params);

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create order
router.post('/', verifyToken, async (req, res) => {
    // Note: This is a simplified version. A real-world scenario would use a database transaction.
    try {
        const {
            items,
            delivery_address,
            delivery_phone,
            payment_method,
            special_instructions,
            scheduled_delivery
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order items are required' });
        }

        if (!delivery_address || !delivery_phone) {
            return res.status(400).json({ error: 'Delivery information is required' });
        }

        let subtotal = 0;
        const orderItemsData = [];

        for (const item of items) {
            const [menuItems] = await db.execute(
                'SELECT price FROM menu_items WHERE id = ? AND is_available = 1',
                [item.menu_item_id]
            );

            if (menuItems.length === 0) {
                return res.status(400).json({ error: `Menu item with ID ${item.menu_item_id} not found or unavailable` });
            }
            const unitPrice = menuItems[0].price;
            const itemTotal = unitPrice * item.quantity;
            subtotal += itemTotal;
            
            orderItemsData.push({
                menu_item_id: item.menu_item_id,
                quantity: item.quantity,
                unit_price: unitPrice,
                total_price: itemTotal
            });
        }

        const delivery_fee = 40.00;
        const gst_amount = subtotal * 0.05;
        const total_amount = subtotal + delivery_fee + gst_amount;

        const [orderResult] = await db.execute(`
            INSERT INTO orders 
            (user_id, total_amount, payment_method, delivery_address, delivery_phone,
             special_instructions, delivery_fee, gst_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            req.user.id,
            total_amount,
            payment_method,
            delivery_address,
            delivery_phone,
            special_instructions,
            delivery_fee,
            gst_amount,
        ]);

        const orderId = orderResult.insertId;

        // FIX #2: Changed the INSERT query to use 'unit_price' and 'total_price' columns.
        for (const item of orderItemsData) {
            await db.execute(
                'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.menu_item_id, item.quantity, item.unit_price, item.total_price]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: orderId,
                total_amount,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update order status
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await db.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get order details
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const orderId = req.params.id;
        const [orders] = await db.execute(`
            SELECT o.*, u.fullName as customer_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ? AND (o.user_id = ? OR ? = 'admin')
        `, [orderId, req.user.id, req.user.role]);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const [items] = await db.execute(`
            SELECT oi.*, mi.name, mi.image_url, k.name as kitchen_name
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            JOIN kitchens k ON mi.kitchen_id = k.id
            WHERE oi.order_id = ?
        `, [orderId]);

        res.json({
            success: true,
            order: {
                ...orders[0],
                items
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;