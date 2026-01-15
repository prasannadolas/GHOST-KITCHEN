import api from './api.js';

document.addEventListener('DOMContentLoaded', async () => {

    // --- HELPER FUNCTIONS ---
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('[id$="cart-count-header"]').forEach(el => {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500', 'text-white');
                break;
            default:
                notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // --- UPDATED Custom Confirmation Modal ---
    /**
     * Displays a custom confirmation modal.
     * @param {string} message - The message to display.
     * @param {string} confirmText - The text for the confirmation button.
     * @param {string} cancelText - The text for the cancel button.
     * @returns {Promise<boolean>} - Resolves with true (confirm) or false (cancel).
     */
    function showConfirmationModal(message, confirmText = 'Yes', cancelText = 'No') {
        return new Promise(resolve => {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center';

            const modalContent = document.createElement('div');
            modalContent.className = 'bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full';
            
            const messageEl = document.createElement('p');
            messageEl.className = 'text-gray-700 mb-4';
            messageEl.textContent = message;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'flex justify-end gap-4';

            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700';
            confirmBtn.textContent = confirmText; // Use custom text

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
            cancelBtn.textContent = cancelText; // Use custom text

            buttonGroup.appendChild(cancelBtn);
            buttonGroup.appendChild(confirmBtn);
            modalContent.appendChild(messageEl);
            modalContent.appendChild(buttonGroup);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            const cleanup = () => {
                document.body.removeChild(modalOverlay);
            };

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
        });
    }
    
    // --- AUTHENTICATION & UI LOGIC ---
    function updateHeaderUI(user = null) {
        const loginRegisterButtons = document.getElementById('login-register-buttons');
        const userInfo = document.getElementById('user-info');
        const welcomeMessage = document.getElementById('welcome-message');
        const mobileLoginRegisterButtons = document.getElementById('mobile-login-register-buttons');
        const mobileUserInfo = document.getElementById('mobile-user-info');
        const mobileWelcomeMessage = document.getElementById('mobile-welcome-message');

        if (user && user.fullName) {
            if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${user.fullName}`;
            if (mobileWelcomeMessage) mobileWelcomeMessage.textContent = `Welcome, ${user.fullName}`;
            if (userInfo) userInfo.classList.remove('hidden');
            if (mobileUserInfo) mobileUserInfo.classList.remove('hidden');
            if (loginRegisterButtons) loginRegisterButtons.classList.add('hidden');
            if (mobileLoginRegisterButtons) mobileLoginRegisterButtons.classList.add('hidden');
        } else {
            if (loginRegisterButtons) loginRegisterButtons.classList.remove('hidden');
            if (mobileLoginRegisterButtons) mobileLoginRegisterButtons.classList.remove('hidden');
            if (userInfo) userInfo.classList.add('hidden');
            if (mobileUserInfo) mobileUserInfo.classList.add('hidden');
        }
    }

    // --- HOMEPAGE CARD CREATION ---
    function createPopularKitchenCard(kitchen) {
        const isOpen = kitchen.is_active;
        const statusText = isOpen ? 'Open' : 'Closed';
        const statusColor = isOpen ? 'text-green-600' : 'text-red-600';
        const rating = parseFloat(kitchen.rating || 0).toFixed(1);
        const detailPageUrl = `./user-pages/kitchen-detail.html?id=${kitchen.id}`;

        return `
            <a href="${detailPageUrl}" class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300 block">
                <img src="${kitchen.image_url || 'https://via.placeholder.com/400x250'}" alt="Image of ${kitchen.name}" class="w-full h-48 object-cover" />
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${kitchen.name}</h3>
                    <p class="text-gray-600 mb-4">${kitchen.cuisine_type}</p>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-yellow-500">★ ${rating} (${kitchen.total_reviews} reviews)</span>
                        <span class="${statusColor} font-semibold">${statusText}</span>
                    </div>
                </div>
            </a>
        `;
    }

    // --- INITIALIZATION & EVENT LISTENERS ---
    updateCartCount();
    
    const user = await api.initializeAuth();
    updateHeaderUI(user);

    window.addEventListener('cartUpdated', () => {
        updateCartCount(); 
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    const findKitchensBtn = document.getElementById('find-kitchens-btn');
    const addressInput = document.getElementById('address-input');
    if (findKitchensBtn && addressInput) {
        const findKitchensAction = () => {
            const address = addressInput.value.trim();
            if (address) {
                localStorage.setItem('deliveryAddress', address);
                window.location.href = 'user-pages/kitchens.html';
            } else {
                showNotification('Please enter your delivery address', 'error');
            }
        };
        findKitchensBtn.addEventListener('click', findKitchensAction);
        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                findKitchensAction();
            }
        });
    }
    
    const handleLogout = () => {
        api.logout();
        updateHeaderUI(null);
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            if (window.location.pathname.includes('/user-pages/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = './index.html';
            }
        }, 1500);
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);

    const popularKitchensContainer = document.getElementById('popular-kitchens-container');
    if (popularKitchensContainer) {
        try {
            const response = await api.getKitchens({ limit: 3 });
            if (response.success && response.kitchens.length > 0) {
                popularKitchensContainer.innerHTML = response.kitchens.map(createPopularKitchenCard).join('');
            } else {
                popularKitchensContainer.innerHTML = '<p class="text-center col-span-full">No popular kitchens to display right now.</p>';
            }
        } catch (error) {
            console.error('Failed to load popular kitchens:', error);
            popularKitchensContainer.innerHTML = '<p class="text-center col-span-full text-red-500">Could not load kitchens.</p>';
        }
    }

    // --- Make functions globally available ---
    window.updateCartCount = updateCartCount;
    window.showNotification = showNotification;
    window.showConfirmationModal = showConfirmationModal;
    window.getCart = getCart;
    window.saveCart = saveCart;
});