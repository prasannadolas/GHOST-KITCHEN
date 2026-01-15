import api from './api.js';

// Checkout JavaScript for Ghost Kitchen website
document.addEventListener('DOMContentLoaded', function () {
    
    // Initialize checkout page
    initCheckout();
    
    function initCheckout() {
        // Check if user is logged in
        checkLoginStatus();
        
        // Load cart items
        displayCheckoutItems();
        
        // Initialize form handlers
        initFormHandlers();
        
        // Initialize payment handlers
        initPaymentHandlers();
        
        // Set minimum date for delivery
        setMinimumDeliveryDate();
    }
    
    // --- Check Login Status ---
    function checkLoginStatus() {
        const userName = localStorage.getItem('userName');
        if (!userName) {
            showNotification('Please log in to proceed with checkout', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        // Pre-fill user information if available
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            // You could pre-fill form fields here
        }
    }
    
    // --- Display Checkout Items ---
    function displayCheckoutItems() {
        const cart = getCart();
        const checkoutItemsContainer = document.getElementById('checkout-items');
        const subtotalElement = document.getElementById('checkout-subtotal');
        const gstElement = document.getElementById('checkout-gst');
        const totalElement = document.getElementById('checkout-total');
        
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'warning');
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 2000);
            return;
        }
        
        // Display items
        checkoutItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800">${item.name}</h4>
                    <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-gray-800">₹${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
        
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 40;
        const gst = subtotal * 0.05; // 5% GST
        const total = subtotal + deliveryFee + gst;
        
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        gstElement.textContent = `₹${gst.toFixed(2)}`;
        totalElement.textContent = `₹${total.toFixed(2)}`;
    }
    
    // --- Initialize Form Handlers ---
    function initFormHandlers() {
        const deliveryTimeRadios = document.querySelectorAll('input[name="deliveryTime"]');
        const scheduledTimeDiv = document.getElementById('scheduled-time');
        
        deliveryTimeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'scheduled') {
                    scheduledTimeDiv.classList.remove('hidden');
                } else {
                    scheduledTimeDiv.classList.add('hidden');
                }
            });
        });
        
        const form = document.getElementById('checkout-form');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
    
    // --- Initialize Payment Handlers ---
    function initPaymentHandlers() {
        const placeOrderBtn = document.getElementById('place-order-btn');
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
    
    // --- Set Minimum Delivery Date ---
    function setMinimumDeliveryDate() {
        const deliveryDateInput = document.getElementById('deliveryDate');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        deliveryDateInput.min = minDate;
        deliveryDateInput.value = minDate;
    }
    
    // --- Handle Place Order (MODIFIED to be async) ---
    async function handlePlaceOrder() {
        if (!validateCheckoutForm()) {
            return;
        }
        
        const formData = getFormData();
        const paymentMethod = formData.paymentMethod;
        
        if (paymentMethod === 'upi') {
            initiateUPIPayment(formData);
        } else if (paymentMethod === 'cod') {
            await processCODOrder(formData);
        }
    }
    
    // --- Validate Checkout Form ---
    function validateCheckoutForm() {
        const form = document.getElementById('checkout-form');
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        const phone = document.getElementById('phone').value;
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            showFieldError(document.getElementById('phone'), 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
        
        const pincode = document.getElementById('pincode').value;
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(pincode)) {
            showFieldError(document.getElementById('pincode'), 'Please enter a valid 6-digit PIN code');
            isValid = false;
        }
        
        const deliveryTime = document.querySelector('input[name="deliveryTime"]:checked').value;
        if (deliveryTime === 'scheduled') {
            const deliveryDate = document.getElementById('deliveryDate').value;
            const timeSlot = document.getElementById('deliveryTimeSlot').value;
            
            if (!deliveryDate) {
                showFieldError(document.getElementById('deliveryDate'), 'Please select delivery date');
                isValid = false;
            }
            if (!timeSlot) {
                showFieldError(document.getElementById('deliveryTimeSlot'), 'Please select time slot');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // --- Get Form Data ---
    function getFormData() {
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        const cart = getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 40;
        const gst = subtotal * 0.05;
        const total = subtotal + deliveryFee + gst;
        
        data.cart = cart;
        data.subtotal = subtotal;
        data.deliveryFee = deliveryFee;
        data.gst = gst;
        data.total = total;
        data.userName = localStorage.getItem('userName');
        data.userEmail = localStorage.getItem('userEmail');
        
        return data;
    }
    
    // --- Initiate UPI Payment ---
    function initiateUPIPayment(orderData) {
        const options = {
            key: 'rzp_test_1234567890', // Replace with your Razorpay key
            amount: Math.round(orderData.total * 100), // Amount in paise
            currency: 'INR',
            name: 'Ghost Kitchen',
            description: 'Food Order Payment',
            image: '../images/logo.png',
            order_id: '', // This should come from your backend
            handler: function (response) {
                // Payment successful
                orderData.paymentId = response.razorpay_payment_id;
                orderData.orderId = response.razorpay_order_id;
                orderData.signature = response.razorpay_signature;
                
                processSuccessfulOrder(orderData);
            },
            prefill: {
                name: orderData.firstName + ' ' + orderData.lastName,
                email: orderData.userEmail,
                contact: orderData.phone
            },
            notes: {
                address: orderData.address
            },
            theme: {
                color: '#EA580C'
            },
            modal: {
                ondismiss: function() {
                    showNotification('Payment cancelled', 'warning');
                }
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    }
    
    // --- Process COD Order (MODIFIED to use custom modal) ---
    async function processCODOrder(orderData) {
        const userConfirmed = await window.showConfirmationModal(
            'Confirm your Cash on Delivery order?',
            'Yes, Confirm Order',
            'Cancel'
        );
    
        if (userConfirmed) {
            orderData.paymentMethod = 'cod';
            orderData.paymentStatus = 'pending';
            await processSuccessfulOrder(orderData);
        }
    }
    
    // --- Process Successful Order (MODIFIED to be async) ---
    async function processSuccessfulOrder(orderData) {
        const cart = getCart();
        const apiOrderData = {
            items: cart.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity
            })),
            delivery_address: `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
            delivery_phone: orderData.phone,
            payment_method: orderData.paymentMethod,
            special_instructions: orderData.instructions || '',
            scheduled_delivery: orderData.deliveryTime === 'scheduled' ? 
                new Date(`${orderData.deliveryDate}T${orderData.deliveryTimeSlot.split('-')[0]}:00`).toISOString() : null
        };

        try {
            const response = await window.api.createOrder(apiOrderData);
            if (response.success) {
                localStorage.removeItem('cart');
                showNotification('Order placed successfully!', 'success');
                setTimeout(() => {
                    window.location.href = `order-confirmation.html?orderId=${response.order.id}`;
                }, 2000);
            }
        } catch (error) {
            console.error('Order creation error:', error);
            showNotification('Failed to place order. Please try again.', 'error');
        }
    }
    
    // --- Field Validation & Helper Functions (No changes below) ---
    function calculateEstimatedDelivery(deliveryTime) {
        const now = new Date();
        
        if (deliveryTime === 'asap') {
            const estimatedTime = new Date(now.getTime() + (35 * 60 * 1000));
            return estimatedTime.toISOString();
        } else {
            const deliveryDate = document.getElementById('deliveryDate').value;
            const timeSlot = document.getElementById('deliveryTimeSlot').value;
            
            if (deliveryDate && timeSlot) {
                const [startTime] = timeSlot.split('-');
                const deliveryDateTime = new Date(`${deliveryDate}T${startTime}:00`);
                return deliveryDateTime.toISOString();
            }
        }
        
        return now.toISOString();
    }
    
    function validateField(e) {
        const field = e.target;
        clearFieldError(field);
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'This field is required');
        }
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.classList.add('border-red-500');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        if (typeof field === 'object' && field.target) {
            field = field.target;
        }
        
        field.classList.remove('border-red-500');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }
    
    function showNotification(message, type) {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
});