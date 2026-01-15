import api from './api.js';

// Menu JavaScript for Ghost Kitchen website
document.addEventListener('DOMContentLoaded', function () {
    
    // Initialize menu functionality
    initMenuCategories();
    
    // --- Menu Category Filtering ---
    function initMenuCategories() {
        const categoryButtons = document.querySelectorAll('.menu-category');
        const menuItems = document.querySelectorAll('.menu-item');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active button
                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-orange-600', 'text-white', 'active');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                this.classList.remove('bg-gray-200', 'text-gray-700');
                this.classList.add('bg-orange-600', 'text-white', 'active');
                
                // Filter menu items
                menuItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        item.classList.remove('hidden');
                    } else {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }
});