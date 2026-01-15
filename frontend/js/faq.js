// FAQ JavaScript for Ghost Kitchen website
document.addEventListener('DOMContentLoaded', function () {
    
    // Initialize FAQ functionality
    initFAQ();
    
    function initFAQ() {
        // FAQ toggle functionality
        initFAQToggles();
        
        // FAQ search functionality
        initFAQSearch();
        
        // FAQ category filtering
        initFAQCategories();
    }
    
    // --- FAQ Toggle Functionality ---
    function initFAQToggles() {
        const faqToggles = document.querySelectorAll('.faq-toggle');
        
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');
                const icon = this.querySelector('.faq-icon');
                
                // Toggle answer visibility
                if (answer.classList.contains('hidden')) {
                    answer.classList.remove('hidden');
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    answer.classList.add('hidden');
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
    
    // --- FAQ Search Functionality ---
    function initFAQSearch() {
        const searchInput = document.getElementById('faq-search');
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                let hasVisibleItems = false;
                
                faqItems.forEach(item => {
                    const question = item.querySelector('.faq-toggle').textContent.toLowerCase();
                    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                    
                    if (searchTerm === '' || 
                        question.includes(searchTerm) || 
                        answer.includes(searchTerm)) {
                        item.style.display = 'block';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show/hide no results message
                toggleNoResults(!hasVisibleItems);
            });
        }
    }
    
    // --- FAQ Category Filtering ---
    function initFAQCategories() {
        const categoryButtons = document.querySelectorAll('.category-filter');
        const faqItems = document.querySelectorAll('.faq-item');
        
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
                
                // Filter FAQ items
                let hasVisibleItems = false;
                
                faqItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'block';
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Clear search input when filtering by category
                const searchInput = document.getElementById('faq-search');
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Show/hide no results message
                toggleNoResults(!hasVisibleItems);
            });
        });
    }
    
    // --- Toggle No Results Message ---
    function toggleNoResults(show) {
        const noResults = document.getElementById('no-results');
        const faqList = document.getElementById('faq-list');
        
        if (show) {
            if (noResults) noResults.classList.remove('hidden');
            if (faqList) faqList.classList.add('hidden');
        } else {
            if (noResults) noResults.classList.add('hidden');
            if (faqList) faqList.classList.remove('hidden');
        }
    }
});