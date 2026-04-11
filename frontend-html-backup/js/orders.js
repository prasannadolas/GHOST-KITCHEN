// Orders JavaScript for Ghost Kitchen website
document.addEventListener('DOMContentLoaded', function () {
    
    // Initialize orders page
    initOrdersPage();
    
    function initOrdersPage() {
        checkLoginStatus();
        displayOrders();
        initOrderFiltering();
    }
    
    // --- Check if user is logged in ---
    function checkLoginStatus() {
        const userName = localStorage.getItem('userName');
        const loginRequired = document.getElementById('login-required');
        const ordersContainer = document.getElementById('orders-container');
        
        if (!userName) {
            if (loginRequired) loginRequired.classList.remove('hidden');
            if (ordersContainer) ordersContainer.classList.add('hidden');
        } else {
            if (loginRequired) loginRequired.classList.add('hidden');
            if (ordersContainer) ordersContainer.classList.remove('hidden');
        }
    }
    
    // --- Display Orders (Fetches from API for current user) ---
    function displayOrders() {
        // Load orders for the logged-in user from the API
        window.api.getUserOrders()
            .then(response => {
                if (response.success) {
                    const ordersList = document.getElementById('orders-list');
                    const emptyOrders = document.getElementById('empty-orders');
                    
                    if (!ordersList) return;
                    
                    if (response.orders.length === 0) {
                        ordersList.innerHTML = '';
                        if (emptyOrders) emptyOrders.classList.remove('hidden');
                        return;
                    }
                    
                    if (emptyOrders) emptyOrders.classList.add('hidden');

                    // Sort orders to show the most recent ones first
                    const sortedOrders = response.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    ordersList.innerHTML = sortedOrders.map(order => createOrderHTML(order)).join('');
                    
                    // Re-add event listeners for the new order elements
                    addOrderEventListeners();
                }
            })
            .catch(error => {
                console.error('Failed to load orders:', error);
                showNotification('Failed to load your orders', 'error');
            });
    }
    
    // --- Create Order HTML ---
    function createOrderHTML(order) {
        if (!order || !order.id || !Array.isArray(order.items)) {
            console.error('Skipping invalid order object received from API:', order);
            return ''; 
        }

        const statusColor = getStatusColor(order.status);
        const statusText = getStatusText(order.status);
        
        // --- UPDATED: Safer date formatting ---
        let orderDate = 'Date not available';
        if (order.createdAt) {
            const date = new Date(order.createdAt);
            if (!isNaN(date)) { // Check if the date is valid
                orderDate = date.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            }
        }
        
        const kitchenName = order.items?.[0]?.kitchen?.name || "Unknown Kitchen";
        
        const subtotal = order.subtotal ?? order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
        const deliveryFee = order.deliveryFee ?? 40;
        const gst = order.gst ?? subtotal * 0.05;
        const total = order.total ?? (subtotal + deliveryFee + gst);

        return `
            <div class="bg-gray-50 rounded-lg p-6 mb-4 order-item" data-status="${order.status}" data-order-id="${order.id}">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">Order #${order.id}</h3>
                        <p class="text-sm text-gray-600">From ${kitchenName}</p>
                        <p class="text-sm text-gray-600">${orderDate}</p>
                    </div>
                    <div class="mt-4 md:mt-0">
                        <span class="px-3 py-1 ${statusColor} text-sm font-medium rounded-full">${statusText}</span>
                    </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                    <div class="space-y-2 mb-4">
                        <p class="font-semibold text-gray-700 mb-2">Order Items:</p>
                        ${order.items.map(item => `
                            <div class="flex justify-between text-sm">
                                <span>${item.quantity || 0}x ${item.name || 'Unnamed Item'}</span>
                                <span>₹${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="space-y-2 border-t border-gray-200 pt-2 mb-4">
                        <div class="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Delivery Fee</span>
                            <span>₹${deliveryFee.toFixed(2)}</span>
                        </div>
                         <div class="flex justify-between text-sm">
                            <span>GST (5%)</span>
                            <span>₹${gst.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span class="text-orange-600">₹${total.toFixed(2)}</span>
                    </div>
                    
                    <div class="mt-4 flex flex-col sm:flex-row gap-3">
                        ${getOrderActions(order)}
                    </div>
                </div>
            </div>
        `;
    }
    
    // --- Get Status Color ---
    function getStatusColor(status) {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-800';
            case 'preparing': return 'bg-yellow-100 text-yellow-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    // --- Get Status Text ---
    function getStatusText(status) {
        switch (status) {
            case 'pending': return 'Pending';
            case 'preparing': return 'Preparing';
            case 'delivered': return 'Delivered';
            case 'cancelled': return 'Cancelled';
            default: return 'Unknown';
        }
    }
    
    // --- Get Order Actions ---
    function getOrderActions(order) {
        switch (order.status) {
            case 'pending':
                return `
                    <button class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition cancel-order" data-order-id="${order.id}">Cancel Order</button>
                    <button class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition contact-kitchen" data-order-id="${order.id}">Contact Kitchen</button>
                `;
            case 'preparing':
                return `
                    <button class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition track-order" data-order-id="${order.id}">Track Order</button>
                    <button class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition contact-kitchen" data-order-id="${order.id}">Contact Kitchen</button>
                `;
            case 'delivered':
                return `
                    <button class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition reorder" data-order-id="${order.id}">Reorder</button>
                    <button class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition rate-order" data-order-id="${order.id}">Rate Order</button>
                `;
            default:
                return '';
        }
    }
    
    // --- Order Filtering ---
    function initOrderFiltering() {
        const filterButtons = document.querySelectorAll('.order-filter');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const status = this.dataset.status;
                const orderItems = document.querySelectorAll('.order-item');
                
                filterButtons.forEach(btn => btn.classList.remove('border-orange-600', 'text-orange-600'));
                this.classList.add('border-orange-600', 'text-orange-600');
                
                orderItems.forEach(item => {
                    if (status === 'all' || item.dataset.status === status) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // --- Add Order Event Listeners ---
    function addOrderEventListeners() {
        document.querySelectorAll('.cancel-order').forEach(button => {
            button.addEventListener('click', (e) => cancelOrder(e.target.dataset.orderId));
        });
        document.querySelectorAll('.track-order').forEach(button => {
            button.addEventListener('click', (e) => trackOrder(e.target.dataset.orderId));
        });
        document.querySelectorAll('.reorder').forEach(button => {
            button.addEventListener('click', (e) => reorder(e.target.dataset.orderId));
        });
        document.querySelectorAll('.contact-kitchen').forEach(button => {
            button.addEventListener('click', (e) => contactKitchen(e.target.dataset.orderId));
        });
        document.querySelectorAll('.rate-order').forEach(button => {
            button.addEventListener('click', (e) => rateOrder(e.target.dataset.orderId));
        });
    }
    
    // --- Order Actions (MODIFIED to use API) ---
    async function cancelOrder(orderId) {
        const confirmed = await window.showConfirmationModal(
            'Are you sure you want to cancel this order?',
            'Yes, Cancel',
            'No'
        );
        if (confirmed) {
            try {
                // REVERTED: Use the original updateOrderStatus function, as the /cancel endpoint does not exist.
                const response = await window.api.updateOrderStatus(orderId, 'cancelled');
                if (response.success) {
                    showNotification('Order cancelled successfully', 'info');
                    displayOrders(); // Refresh list from server
                } else {
                    showNotification(response.message || 'Failed to cancel order', 'error');
                }
            } catch (error) {
                console.error('Cancel order error:', error);
                showNotification(error.message || 'An error occurred while cancelling the order.', 'error');
            }
        }
    }
    
    async function reorder(orderId) {
        try {
            // Fetch fresh order data from API to ensure items are correct
            const response = await window.api.getOrderById(orderId);
            if (response.success && response.order) {
                const order = response.order;
                order.items.forEach(item => {
                    // Create a cart-compatible item object
                    const cartItem = {
                        id: item.menu_item_id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        kitchenId: item.kitchen.id,
                        quantity: item.quantity
                    };
                    addToCart(cartItem);
                });
                showNotification('Items from your previous order have been added to the cart!', 'success');
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1000);
            } else {
                showNotification('Could not find order details to reorder.', 'error');
            }
        } catch (error) {
            console.error('Reorder error:', error);
            showNotification('An error occurred during reorder.', 'error');
        }
    }

    function trackOrder(orderId) {
        showNotification('Order tracking feature coming soon!', 'info');
    }

    function contactKitchen(orderId) {
        showNotification('Kitchen contact feature coming soon!', 'info');
    }
    
    function rateOrder(orderId) {
        showNotification('Order rating feature coming soon!', 'info');
    }
    
    // --- Helper Functions ---
    // Note: Removed getOrders() and saveOrders() that used localStorage
    
    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0 && cart[0].kitchenId !== item.kitchenId) {
            window.showNotification('You can only order from one kitchen at a time.', 'error');
            return;
        }
        
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    function showNotification(message, type) {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
});
