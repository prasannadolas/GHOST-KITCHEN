import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const kitchensContainer = document.getElementById('kitchens-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const categoryFilters = document.getElementById('category-filters');

    // --- RENDER FUNCTION ---
    // Creates the HTML for a single kitchen card from a data object
    const createKitchenCard = (kitchen) => {
        const isOpen = kitchen.is_active;
        const statusClass = isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const statusText = isOpen ? 'Open' : 'Closed';
        const buttonClass = isOpen ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed';
        const buttonText = isOpen ? 'View Menu' : 'Currently Closed';
        const rating = parseFloat(kitchen.rating || 0).toFixed(1);
        const detailPageUrl = `./kitchen-detail.html?id=${kitchen.id}`;

        return `
            <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <a href="${detailPageUrl}">
                    <img class="w-full h-48 object-cover" src="${kitchen.image_url || 'https://via.placeholder.com/400x250'}" alt="Image of ${kitchen.name}">
                </a>
                <div class="p-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-bold font-playfair text-gray-800">${kitchen.name}</h3>
                            <p class="text-sm text-gray-600">${kitchen.cuisine_type}</p>
                        </div>
                        <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">${statusText}</span>
                    </div>
                    <div class="flex items-center mt-2 text-sm text-gray-500">
                        <svg class="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span>${rating} (${kitchen.total_reviews} reviews)</span>
                    </div>
                    <div class="mt-4">
                        <a href="${isOpen ? detailPageUrl : '#'}" class="block w-full text-center px-4 py-2 text-white rounded-lg transition ${buttonClass}" ${!isOpen ? 'aria-disabled="true"' : ''}>
                            ${buttonText}
                        </a>
                    </div>
                </div>
            </div>
        `;
    };

    // --- API CALL ---
    // Fetches kitchens from the backend and displays them
    const loadKitchens = async (filters = {}) => {
        if (!kitchensContainer) return;

        try {
            kitchensContainer.innerHTML = '<p class="text-center col-span-full">Loading kitchens...</p>';
            const response = await api.getKitchens(filters);

            if (response.success && response.kitchens.length > 0) {
                kitchensContainer.innerHTML = response.kitchens.map(createKitchenCard).join('');
            } else {
                kitchensContainer.innerHTML = '<p class="text-center col-span-full">No kitchens found. Try adjusting your search.</p>';
            }
        } catch (error) {
            console.error('Failed to load kitchens:', error);
            kitchensContainer.innerHTML = '<p class="text-center col-span-full text-red-500">Sorry, we couldn\'t load the kitchens. Please try again later.</p>';
        }
    };

    // --- EVENT LISTENERS ---
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            loadKitchens({ search: searchTerm });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const searchTerm = searchInput.value.trim();
                loadKitchens({ search: searchTerm });
            }
        });
    }

    if (categoryFilters) {
        categoryFilters.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                categoryFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('bg-orange-600', 'text-white'));
                event.target.classList.add('bg-orange-600', 'text-white');
                
                const cuisine = event.target.dataset.cuisine;
                loadKitchens({ cuisine: cuisine === 'All' ? '' : cuisine });
            }
        });
    }

    // --- INITIAL LOAD ---
    // Load all kitchens when the page is first opened
    loadKitchens();
});