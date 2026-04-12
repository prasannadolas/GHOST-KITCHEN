const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// --- PROTECTION ---
// Every route below this line will automatically use the adminAuth guard.
// If the user isn't an admin, they can't even reach these functions.
router.use(adminAuth);

// --- DASHBOARD OVERVIEW ---
// Get stats like total sales, order counts, etc.
router.get('/stats', adminController.getDashboardStats);

// --- KITCHEN MANAGEMENT ---
// Toggle a kitchen's status (Open/Closed)
router.patch('/kitchens/:id/status', adminController.toggleKitchenStatus);
// Update kitchen details (description, image, etc.)
router.put('/kitchens/:id', adminController.updateKitchenDetails);

// --- MENU MANAGEMENT ---
// Add a new dish to a kitchen
router.post('/menu/add', adminController.addMenuItem);
// Update price or availability of a dish
router.put('/menu/:id', adminController.updateMenuItem);
// Delete a dish forever
router.delete('/menu/:id', adminController.deleteMenuItem);

// --- ORDER MANAGEMENT ---
// See all orders (or specific kitchen orders)
router.get('/orders', adminController.getAllOrders);
// Update status: Pending -> Preparing -> Delivered
router.patch('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;