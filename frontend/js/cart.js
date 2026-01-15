// --- CORE, EXPORTABLE CART FUNCTIONS ---

/**
 * Retrieves the cart from localStorage.
 * @returns {Array} The cart array.
 */
export function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

/**
 * Saves the cart to localStorage and notifies the app of the update.
 * @param {Array} cart - The cart array to save.
 */
export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch a custom event so the header icon can update instantly.
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

/**
 * Shows an error toast if the user tries to order from a different kitchen.
 * @param {object} item - The item to add, must include a kitchenId property.
 */
export function addToCart(item) {
    let cart = getCart();
    
    // Case 1: The cart is not empty and the new item is from a different kitchen.
    if (cart.length > 0 && cart[0].kitchenId !== item.kitchenId) {
        // Show an error toast and prevent adding the item.
        window.showNotification('You can only order from one kitchen at a time.', 'error');
        return; // Stop the function here.
        
    } else {
        // Case 2: The cart is empty or the item is from the same kitchen.
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if item already in cart
        } else {
            item.quantity = 1; // Add new item with quantity 1
            cart.push(item);
        }
        
        saveCart(cart);
        window.showNotification(`"${item.name}" added to cart!`, 'success');
    }
}


// --- CART PAGE SPECIFIC LOGIC ---
// This code only runs when the user is on the cart.html page.

function initCartPage() {
    // Store references to all needed DOM elements for efficiency
    const elements = {
        container: document.getElementById('cart-items-container'),
        summary: document.getElementById('cart-summary'),
        emptyMsg: document.getElementById('empty-cart'),
        subtotal: document.getElementById('cart-subtotal'),
        total: document.getElementById('cart-total'),
        clearBtn: document.getElementById('clear-cart'),
        checkoutBtn: document.getElementById('checkout-btn'),
    };

    // Exit if we're not on the cart page
    if (!elements.container) return;

    function createCartItemHTML(item) {
        return `
            <div class="cart-item flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b gap-4" data-id="${item.id}">
                <div class="flex items-center gap-4 flex-grow">
                    <img src="${item.image || '/assets/images/placeholder-food.jpg'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                    <div>
                        <h3 class="font-bold text-lg">${item.name}</h3>
                        <p class="text-gray-600">₹${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button class="quantity-change text-lg font-bold p-1 rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition" data-id="${item.id}" data-change="-1">-</button>
                    <span class="font-semibold w-8 text-center">${item.quantity}</span>
                    <button class="quantity-change text-lg font-bold p-1 rounded-full w-8 h-8 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white transition" data-id="${item.id}" data-change="1">+</button>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg">₹${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item text-red-500 hover:underline text-sm font-medium" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
    }

    function render() {
        const cart = getCart();

        if (cart.length === 0) {
            elements.container.innerHTML = '';
            elements.emptyMsg.classList.remove('hidden');
            elements.summary.classList.add('hidden');
        } else {
            elements.emptyMsg.classList.add('hidden');
            elements.summary.classList.remove('hidden');
            elements.container.innerHTML = cart.map(createCartItemHTML).join('');
            updateCartSummary(cart);
        }
    }

    function updateCartSummary(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 40; // This could come from a config later
        const total = subtotal + deliveryFee;

        elements.subtotal.textContent = `₹${subtotal.toFixed(2)}`;
        elements.total.textContent = `₹${total.toFixed(2)}`;
    }

    // --- EVENT HANDLERS ---

    function handleInteraction(event) {
        const target = event.target;
        const itemId = target.dataset.id;
        if (!itemId) return;

        let cart = getCart();

        if (target.classList.contains('quantity-change')) {
            const change = parseInt(target.dataset.change);
            const item = cart.find(i => i.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== itemId);
                }
            }
        } else if (target.classList.contains('remove-item')) {
            cart = cart.filter(i => i.id !== itemId);
        } else {
            return;
        }

        saveCart(cart);
        render(); // Re-render the cart after any change
    }

    // --- MODIFIED FUNCTION ---
    // This now uses the custom modal instead of the browser's confirm().
    async function handleClearCart() {
        const userConfirmed = await window.showConfirmationModal(
            'Are you sure you want to clear your cart?',
            'Yes, Clear',
            'No'
        );

        if (userConfirmed) {
            saveCart([]);
            render();
        }
    }

    function handleCheckout() {
        if (getCart().length === 0) {
            alert('Your cart is empty.');
            return;
        }
        if (localStorage.getItem('authToken')) {
            window.location.href = './checkout.html';
        } else {
            alert('Please log in to proceed to checkout.');
            window.location.href = './login.html';
        }
    }

    // --- INITIALIZATION ---
    elements.container.addEventListener('click', handleInteraction);
    elements.clearBtn.addEventListener('click', handleClearCart);
    elements.checkoutBtn.addEventListener('click', handleCheckout);
    render(); // Initial render of the cart when the page loads
}

// Check if we are on the cart page and, if so, initialize its functionality.
document.addEventListener('DOMContentLoaded', initCartPage);