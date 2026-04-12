const db = require('../config/database');

/**
 * Admin Controller - Handles all business logic for the Dashboard
 */
const adminController = {

  // 1. Get Dashboard Stats (Role-Based)
    getDashboardStats: async (req, res) => {
        try {
            // 🕵️‍♂️ THE TRAP: Print exactly what is inside the token!
            console.log("=== TOKEN DATA ===");
            console.log(req.user);
            console.log("==================");

            const userId = req.user?.id || req.user?.userId || req.user?.user_id;
            const role = req.user?.role;

            // THE SHIELD: Stop the crash completely if no ID is found
            if (!userId && role !== 'admin') {
                console.log("❌ SHIELD ACTIVATED: No User ID found in token.");
                // Return fake 0 stats so the frontend doesn't break, instead of crashing the server
                return res.json({ 
                    success: true, 
                    stats: { revenue: 0, orders: 0 },
                    message: "Dashboard loaded, but token is missing User ID."
                });
            }

            let stats = {};

            if (role === 'admin') {
                // SUPER ADMIN: See everything
                const [[rev]] = await db.execute("SELECT SUM(total_amount) as revenue FROM orders WHERE status != 'cancelled'");
                const [[ord]] = await db.execute("SELECT COUNT(id) as orders FROM orders");
                const [[usr]] = await db.execute("SELECT COUNT(id) as users FROM users WHERE role = 'customer'");
                const [[kit]] = await db.execute("SELECT COUNT(id) as kitchens FROM kitchens WHERE is_active = 1");

                stats = {
                    revenue: rev.revenue || 0,
                    orders: ord.orders || 0,
                    users: usr.users || 0,
                    kitchens: kit.kitchens || 0
                };
            } else {
                // KITCHEN OWNER (Adi): See only his kitchen's stats
                const [[rev]] = await db.execute(`
                    SELECT SUM(o.total_amount) as revenue 
                    FROM orders o
                    JOIN order_items oi ON o.id = oi.order_id
                    JOIN menu_items mi ON oi.menu_item_id = mi.id
                    JOIN kitchens k ON mi.kitchen_id = k.id
                    WHERE k.owner_id = ? AND o.status != 'cancelled'
                `, [userId]);

                const [[ord]] = await db.execute(`
                    SELECT COUNT(DISTINCT o.id) as orders 
                    FROM orders o
                    JOIN order_items oi ON o.id = oi.order_id
                    JOIN menu_items mi ON oi.menu_item_id = mi.id
                    JOIN kitchens k ON mi.kitchen_id = k.id
                    WHERE k.owner_id = ?
                `, [userId]);

                stats = {
                    revenue: rev.revenue || 0,
                    orders: ord.orders || 0
                };
            }

            res.json({ success: true, stats });
        } catch (error) {
            console.error("Stats Error:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 2. Toggle Kitchen Status (Open/Closed)
    toggleKitchenStatus: async (req, res) => {
        try {
            const kitchenId = req.params.id;
            const { is_active } = req.body; // 1 for Open, 0 for Closed

            // Security: If not Super Admin, verify they own this kitchen
            if (req.user.role !== 'admin') {
                const [check] = await db.execute('SELECT id FROM kitchens WHERE id = ? AND owner_id = ?', [kitchenId, req.user.id]);
                if (check.length === 0) return res.status(403).json({ error: 'Not authorized to manage this kitchen' });
            }

            await db.execute('UPDATE kitchens SET is_active = ? WHERE id = ?', [is_active, kitchenId]);
            res.json({ success: true, message: `Kitchen is now ${is_active ? 'Open' : 'Closed'}` });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 3. Update Kitchen Details
    updateKitchenDetails: async (req, res) => {
        try {
            const kitchenId = req.params.id;
            const { name, description, cuisine_type, image_url, address } = req.body;

            await db.execute(
                'UPDATE kitchens SET name = ?, description = ?, cuisine_type = ?, image_url = ?, address = ? WHERE id = ?',
                [name, description, cuisine_type, image_url, address, kitchenId]
            );

            res.json({ success: true, message: 'Kitchen details updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 4. Menu Management: Add Item
    addMenuItem: async (req, res) => {
        try {
            const { kitchen_id, name, description, price, category, image_url } = req.body;
            const [result] = await db.execute(
                'INSERT INTO menu_items (kitchen_id, name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [kitchen_id, name, description, price, category, image_url]
            );
            res.json({ success: true, itemId: result.insertId });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Menu Management: Update Item
    updateMenuItem: async (req, res) => {
        try {
            const itemId = req.params.id;
            const { name, description, price, category, image_url } = req.body;
            
            await db.execute(
                'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
                [name, description, price, category, image_url, itemId]
            );
            res.json({ success: true, message: 'Menu item updated' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 5. Menu Management: Delete Item
    deleteMenuItem: async (req, res) => {
        try {
            const itemId = req.params.id;
            await db.execute('DELETE FROM menu_items WHERE id = ?', [itemId]);
            res.json({ success: true, message: 'Item deleted from menu' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 6. Get All Orders (Filterable)
    getAllOrders: async (req, res) => {
        try {
            // Safely grab the ID, just like we did for the dashboard stats
            const userId = req.user?.id || req.user?.userId || req.user?.user_id;
            const role = req.user?.role;
            
            // THE SHIELD: Stop the crash if no ID is found
            if (!userId && role !== 'admin') {
                console.log("❌ SHIELD ACTIVATED IN ORDERS: No User ID found.");
                return res.json({ success: true, orders: [] });
            }

            // We use GROUP_CONCAT to get the kitchen name(s) attached to the items in this order
            let query = `
                SELECT o.*, u.fullName as customer_name, GROUP_CONCAT(DISTINCT k.name) as kitchen_names
                FROM orders o 
                JOIN users u ON o.user_id = u.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
                LEFT JOIN kitchens k ON mi.kitchen_id = k.id
            `;
            let params = [];

            // If it's a kitchen owner, only show orders containing their food
            if (role !== 'admin') {
                query += ' WHERE k.owner_id = ?';
                params.push(userId);
            }

            query += ' GROUP BY o.id ORDER BY o.created_at DESC';
            const [orders] = await db.execute(query, params);
            res.json({ success: true, orders });
        } catch (error) {
            console.error("Orders Error:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 7. Update Order Status (The most important Admin action)
    updateOrderStatus: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body; // e.g., 'preparing', 'delivered'

            await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
            res.json({ success: true, message: `Order status updated to ${status}` });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = adminController;