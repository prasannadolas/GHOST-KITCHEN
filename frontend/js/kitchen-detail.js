// Save as: frontend/js/kitchen-detail.js
import api from './api.js';
// Import cart functions to make them available on this page
import { addToCart } from './cart.js';

// --- RENDER FUNCTIONS ---
function renderKitchenHeader(kitchen) {
    const isOpen = kitchen.is_active;
    const statusText = isOpen ? 'Open' : 'Currently Closed';
    const statusColor = isOpen ? 'text-green-600' : 'text-red-600';
    const rating = parseFloat(kitchen.rating || 0).toFixed(1);
    
    return `
        <div class="container mx-auto px-6 py-8">
            <div class="flex flex-col md:flex-row items-start gap-8">
                <img src="${kitchen.image_url || ''}" alt="${kitchen.name}" class="w-full md:w-64 h-48 object-cover rounded-lg" />
                <div class="flex-1">
                    <h1 class="text-3xl font-playfair font-bold text-gray-800 mb-2">${kitchen.name}</h1>
                    <p class="text-gray-600 mb-4">${kitchen.cuisine_type}</p>
                    <div class="flex items-center gap-4 text-sm mb-4">
                        <span class="text-yellow-500">★ ${rating} (${kitchen.total_reviews} reviews)</span>
                        <span class="${statusColor} font-semibold">${statusText}</span>
                        <span class="text-gray-600">${kitchen.preparation_time}-${kitchen.preparation_time + 15} min delivery</span>
                    </div>
                    <p class="text-gray-700">${kitchen.description}</p>
                </div>
            </div>
        </div>
    `;
}

function renderMenuItems(menuItems, isKitchenOpen, kitchenId) {
    if (!menuItems || menuItems.length === 0) {
        return '<p class="text-center col-span-full">This kitchen has no menu items available right now.</p>';
    }

    return menuItems.map(item => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden menu-item-card" data-category="${item.category}">
            <img src="${item.image_url || '/assets/images/placeholder-food.jpg'}" alt="${item.name}" class="w-full h-40 object-cover" />
            <div class="p-4">
                <h3 class="text-lg font-bold mb-2">${item.name}</h3>
                <p class="text-gray-600 text-sm mb-3 h-10">${item.description || ''}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-orange-600">₹${item.price}</span>
                    <button 
                        class="add-to-cart ${isKitchenOpen ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded-lg transition" 
                        data-id="${item.id}" 
                        data-name="${item.name}" 
                        data-price="${item.price}"
                        data-image="${item.image_url || '/assets/images/placeholder-food.jpg'}"
                        data-kitchen-id="${kitchenId}"
                        ${!isKitchenOpen ? 'disabled' : ''}
                    >
                        ${isKitchenOpen ? 'Add to Cart' : 'Closed'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCategoryFilters(menuItems) {
    if (!menuItems || menuItems.length === 0) return '';
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    return categories.map((category, index) => `
        <button class="px-4 py-2 rounded-full font-medium menu-category ${index === 0 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}" data-category="${category.toLowerCase()}">
            ${category}
        </button>
    `).join('');
}


// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    const kitchenHeaderContainer = document.getElementById('kitchen-header-container');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const categoryFiltersContainer = document.getElementById('category-filters');

    const urlParams = new URLSearchParams(window.location.search);
    const kitchenId = urlParams.get('id');

    if (!kitchenId) {
        kitchenHeaderContainer.innerHTML = '<p class="text-center text-red-500 p-8">Kitchen ID is missing. Please select a kitchen to view its menu.</p>';
        return;
    }

    try {
        const response = await api.getKitchen(kitchenId);
        if (response.success) {
            const { kitchen, menuItems } = response;
            kitchenHeaderContainer.innerHTML = renderKitchenHeader(kitchen);
            categoryFiltersContainer.innerHTML = renderCategoryFilters(menuItems);
            menuItemsContainer.innerHTML = renderMenuItems(menuItems, kitchen.is_active, kitchen.id);
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('Error loading kitchen details:', error);
        kitchenHeaderContainer.innerHTML = `<p class="text-center text-red-500 p-8">Could not load kitchen details. ${error.message}</p>`;
    }

    // --- FILTERING & HIGHLIGHTING LOGIC ---
    if (categoryFiltersContainer) {
        categoryFiltersContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.menu-category');
            if (!clickedButton) return;

            const selectedCategory = clickedButton.dataset.category;

            categoryFiltersContainer.querySelectorAll('.menu-category').forEach(btn => {
                btn.classList.remove('bg-orange-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            clickedButton.classList.remove('bg-gray-200', 'text-gray-700');
            clickedButton.classList.add('bg-orange-600', 'text-white');
            
            const allItems = menuItemsContainer.querySelectorAll('.menu-item-card');
            allItems.forEach(item => {
                const itemCategory = item.dataset.category.toLowerCase();
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }

    // --- ADD TO CART LOGIC WITH IMPROVED ANIMATION ---
    if (menuItemsContainer) {
        menuItemsContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.add-to-cart');
            if (!button || button.disabled) return;

            const item = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                kitchenId: button.dataset.kitchenId
            };

            // 1. Add item to cart. The cart logic will now handle notifications.
            addToCart(item);

            // 2. Start the visual feedback animation
            button.disabled = true;
            button.classList.remove('bg-orange-600', 'hover:bg-orange-700');
            button.classList.add('bg-green-500'); 
            button.innerHTML = `
                <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Added!
            `;

            // 3. Revert the button back to its original state after a delay
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = 'Add to Cart';
                button.classList.remove('bg-green-500');
                button.classList.add('bg-orange-600', 'hover:bg-orange-700');
            }, 2000); // Animation lasts for 2 seconds
        });
    }
});