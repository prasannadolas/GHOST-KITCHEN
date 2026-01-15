// Order Confirmation JavaScript for Ghost Kitchen website

let orderStatusInterval;

document.addEventListener('DOMContentLoaded', function () {
    
    initOrderConfirmation();
    
    /**
     * Initializes the page by getting the order ID from the URL and
     * starting the process of loading details and polling for updates.
     */
    function initOrderConfirmation() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        
        if (orderId) {
            loadOrderDetails(orderId);
            // Start polling for real-time status updates
            if (orderStatusInterval) clearInterval(orderStatusInterval);
            orderStatusInterval = setInterval(() => loadOrderDetails(orderId), 30000);
        } else {
            showNotification('No order ID found. Redirecting...', 'error');
            setTimeout(() => window.location.href = 'orders.html', 2000);
        }
    }
    
    /**
     * Fetches the complete order details from the API in a single call.
     * @param {string} orderId - The ID of the order to fetch.
     */
    async function loadOrderDetails(orderId) {
        try {
            const response = await window.api.getOrder(orderId);
            
            if (response.success && response.order) {
                displayOrderDetails(response.order);
            } else {
                handleOrderLoadError('Sorry, we could not find that order.');
            }
        } catch (error) {
            console.error('Failed to load order details:', error);
            handleOrderLoadError('An error occurred while loading order details.');
        }
    }

    /**
     * Main function to update the page with the fetched order data.
     * @param {object} order - The complete order object from the API.
     */
    function displayOrderDetails(order) {
        safeSetText('order-id', `Order ID: #${order.id}`); 
        renderFinancialDetails(order);
        renderOrderItems(order.items || []);
        renderDeliveryDetails(order);
        updateOrderStatusVisuals(order.status || 'Confirmed');
        
        if (['Delivered', 'Cancelled'].includes(order.status)) {
            clearInterval(orderStatusInterval);
        }
    }

    /**
     * Renders the financial summary using data directly from the backend.
     * @param {object} order - The order object.
     */
    function renderFinancialDetails(order) {
        const subtotal = parseFloat(order.subtotal || 0);
        const gst = parseFloat(order.gst_amount || 0);
        const total = parseFloat(order.total_amount || 0);
        
        safeSetText('order-subtotal', `₹${subtotal.toFixed(2)}`);
        safeSetText('order-gst', `₹${gst.toFixed(2)}`);
        safeSetText('order-total', `₹${total.toFixed(2)}`);
    }

    /**
     * Renders the list of items using details included in the order object.
     * @param {Array} items - The array of item objects.
     */
    function renderOrderItems(items) {
        const container = document.getElementById('order-items');
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = '<p class="text-gray-600 py-4">No items found for this order.</p>';
            return;
        }

        container.innerHTML = items.map(item => {
            const price = parseFloat(item.price || 0);
            const quantity = parseInt(item.quantity || 1);
            const itemTotal = price * quantity;

            return `
                <div class="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                    <img src="${item.image_url || '/assets/images/placeholder-food.jpg'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-800">${item.name || 'Unnamed Item'}</h4>
                        <p class="text-sm text-gray-600">Quantity: ${quantity}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-gray-800">₹${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Renders all delivery-related information.
     * @param {object} order - The order object.
     */
    function renderDeliveryDetails(order) {
        safeSetText('delivery-address', order.delivery_address || 'Not Provided');
        safeSetText('delivery-phone', order.delivery_phone || 'Not Provided');
        const paymentMethod = order.payment_method || 'N/A';
        const paymentText = paymentMethod.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'Paid Online';
        safeSetText('payment-method', paymentText);
    }
    
    /**
     * Updates the visual order status tracker.
     * @param {string} currentStatus - The current status of the order.
     */
    function updateOrderStatusVisuals(currentStatus) {
        const statuses = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
        const statusMap = {
            'Confirmed': 'status-confirmed',
            'Preparing': 'status-preparing',
            'Out for Delivery': 'status-out-for-delivery',
            'Delivered': 'status-delivered'
        };

        let currentIndex = statuses.indexOf(currentStatus);
        if (currentIndex === -1) currentIndex = 0;

        statuses.forEach((status, index) => {
            const element = document.getElementById(statusMap[status]);
            if (element) {
                const icon = element.querySelector('.status-icon');
                const text = element.querySelector('.status-text');
                const isCurrent = index === currentIndex;
                const isCompleted = index < currentIndex;

                icon.className = 'status-icon w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300'; // Reset classes
                text.className = 'status-text text-sm font-medium transition-all duration-300';

                if (isCompleted) {
                    icon.classList.add('bg-green-500', 'border-green-500', 'text-white');
                    text.classList.add('text-green-600');
                    icon.innerHTML = '&#10003;'; // Checkmark
                } else if (isCurrent) {
                    icon.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
                    text.classList.add('text-orange-600');
                    icon.innerHTML = `<div class="w-3 h-3 bg-white rounded-full"></div>`; // Inner dot
                } else {
                    icon.classList.add('bg-white', 'border-gray-300');
                    text.classList.add('text-gray-500');
                    icon.innerHTML = '';
                }
            }
        });
    }

    // --- Helper Functions ---
    function handleOrderLoadError(message) {
        showNotification(message, 'error');
        clearInterval(orderStatusInterval);
        setTimeout(() => window.location.href = 'orders.html', 3000);
    }

    function safeSetText(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }
    
    function showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
});