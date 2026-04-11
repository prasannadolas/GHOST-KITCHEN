// Admin Dashboard JavaScript for Ghost Kitchen
document.addEventListener('DOMContentLoaded', function () {
    
    // Initialize admin dashboard
    initAdminDashboard();
    
    function initAdminDashboard() {
        // Check admin authentication
        checkAdminAuth();
        
        // Initialize navigation
        initNavigation();
        
        // Initialize charts
        initCharts();
        
        // Load dashboard data
        loadDashboardData();
        
        // Initialize modals
        initModals();
        
        // Initialize event handlers
        initEventHandlers();
    }
    
    // --- Admin Authentication ---
    function checkAdminAuth() {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            // Redirect to admin login (you would create this page)
            window.location.href = 'login.html';
            return;
        }
    }
    
    // --- Navigation ---
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetSection = this.getAttribute('href').substring(1) + '-section';
                
                // Update active nav link
                navLinks.forEach(nl => {
                    nl.classList.remove('text-orange-600', 'bg-orange-50');
                    nl.classList.add('text-gray-600');
                });
                
                this.classList.remove('text-gray-600');
                this.classList.add('text-orange-600', 'bg-orange-50');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.add('hidden');
                });
                
                const target = document.getElementById(targetSection);
                if (target) {
                    target.classList.remove('hidden');
                    
                    // Load section-specific data
                    loadSectionData(targetSection);
                }
            });
        });
    }
    
    // --- Initialize Charts ---
    function initCharts() {
        // Orders Chart
        const ordersCtx = document.getElementById('ordersChart');
        if (ordersCtx) {
            new Chart(ordersCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Orders',
                        data: [65, 78, 90, 81, 95, 105],
                        borderColor: '#EA580C',
                        backgroundColor: 'rgba(234, 88, 12, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 15000, 18000, 16000, 20000, 22000],
                        backgroundColor: '#EA580C',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // --- Load Dashboard Data ---
    function loadDashboardData() {
        // Load real data from API
        window.api.getDashboardStats()
            .then(response => {
                if (response.success) {
                    updateStatsCards(response.stats);
                    updateRecentOrders(response.recentOrders);
                    updateCharts(response.monthlyStats);
                }
            })
            .catch(error => {
                console.error('Failed to load dashboard data:', error);
                showNotification('Failed to load dashboard data', 'error');
            });
    }
    
    // --- Update Stats Cards ---
    function updateStatsCards(stats) {
        // Update total orders
        const totalOrdersElement = document.querySelector('.stats-card:nth-child(1) .text-3xl');
        if (totalOrdersElement) {
            totalOrdersElement.textContent = stats.totalOrders.toLocaleString();
        }
        
        // Update revenue
        const revenueElement = document.querySelector('.stats-card:nth-child(2) .text-3xl');
        if (revenueElement) {
            revenueElement.textContent = `₹${stats.totalRevenue.toLocaleString()}`;
        }
        
        // Update active kitchens
        const kitchensElement = document.querySelector('.stats-card:nth-child(3) .text-3xl');
        if (kitchensElement) {
            kitchensElement.textContent = stats.activeKitchens;
        }
        
        // Update total users
        const usersElement = document.querySelector('.stats-card:nth-child(4) .text-3xl');
        if (usersElement) {
            usersElement.textContent = stats.totalUsers.toLocaleString();
        }
    }
    
    // --- Update Recent Orders ---
    function updateRecentOrders(orders) {
        const tableBody = document.querySelector('tbody');
        if (tableBody && orders.length > 0) {
            tableBody.innerHTML = orders.map(order => `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">#${order.id}</td>
                    <td class="px-6 py-4">${order.customer_name}</td>
                    <td class="px-6 py-4">${order.kitchen_name || 'Multiple'}</td>
                    <td class="px-6 py-4">₹${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}">
                            ${order.status}
                        </span>
                    </td>
                    <td class="px-6 py-4">${formatDate(order.created_at)}</td>
                </tr>
            `).join('');
        }
    }
    
    // --- Update Charts ---
    function updateCharts(monthlyStats) {
        if (monthlyStats && monthlyStats.length > 0) {
            const labels = monthlyStats.map(stat => stat.month).reverse();
            const orderData = monthlyStats.map(stat => stat.order_count).reverse();
            const revenueData = monthlyStats.map(stat => stat.revenue).reverse();
            
            // Update orders chart
            if (window.ordersChart) {
                window.ordersChart.data.labels = labels;
                window.ordersChart.data.datasets[0].data = orderData;
                window.ordersChart.update();
            }
            
            // Update revenue chart
            if (window.revenueChart) {
                window.revenueChart.data.labels = labels;
                window.revenueChart.data.datasets[0].data = revenueData;
                window.revenueChart.update();
            }
        }
    }
    
    // --- Load Recent Orders ---
    function loadRecentOrders() {
        window.api.getAllOrders({ limit: 10 })
            .then(response => {
                if (response.success) {
                    updateRecentOrders(response.orders);
                }
            })
            .catch(error => {
                console.error('Failed to load recent orders:', error);
            });
    }
    
    // --- Initialize Charts ---
    function initCharts() {
        // Orders Chart
        const ordersCtx = document.getElementById('ordersChart');
        if (ordersCtx) {
            window.ordersChart = new Chart(ordersCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Orders',
                        data: [],
                        borderColor: '#EA580C',
                        backgroundColor: 'rgba(234, 88, 12, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            window.revenueChart = new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Revenue',
                        data: [],
                        backgroundColor: '#EA580C',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // --- Load Section Data ---
    function loadSectionData(sectionId) {
        switch(sectionId) {
            case 'orders-section':
                loadOrdersData();
                break;
            case 'kitchens-section':
                loadKitchensData();
                break;
            case 'menu-section':
                loadMenuData();
                break;
            case 'users-section':
                loadUsersData();
                break;
            case 'analytics-section':
                loadAnalyticsData();
                break;
        }
    }
    
    // --- Load Orders Data ---
    function loadOrdersData() {
        window.api.getAllOrders()
            .then(response => {
                if (response.success) {
                    const ordersTableBody = document.getElementById('orders-table-body');
                    
                    if (ordersTableBody) {
                        ordersTableBody.innerHTML = response.orders.map(order => `
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">#${order.id}</td>
                                <td class="px-6 py-4">${order.customer_name}</td>
                                <td class="px-6 py-4">${order.kitchen_name || 'Multiple'}</td>
                                <td class="px-6 py-4">${order.item_count} items</td>
                                <td class="px-6 py-4">₹${parseFloat(order.total_amount).toFixed(2)}</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}">
                                        ${order.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4">${formatDate(order.created_at)}</td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <button onclick="viewOrder('${order.id}')" class="text-blue-600 hover:text-blue-800 text-sm">View</button>
                                        <button onclick="updateOrderStatus('${order.id}')" class="text-green-600 hover:text-green-800 text-sm">Update</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('');
                    }
                }
            })
            .catch(error => {
                console.error('Failed to load orders:', error);
                showNotification('Failed to load orders', 'error');
            });
    }
    
    // --- Load Kitchens Data ---
    function loadKitchensData() {
        window.api.getKitchens()
            .then(response => {
                if (response.success) {
                    const kitchensGrid = document.getElementById('kitchens-grid');
                    if (kitchensGrid) {
                        kitchensGrid.innerHTML = response.kitchens.map(kitchen => `
                            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src="${kitchen.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop'}" alt="${kitchen.name}" class="w-full h-48 object-cover">
                                <div class="p-6">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="text-lg font-bold text-gray-800">${kitchen.name}</h3>
                                        <span class="px-2 py-1 text-xs font-medium rounded-full ${kitchen.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                            ${kitchen.is_active ? 'active' : 'inactive'}
                                        </span>
                                    </div>
                                    <p class="text-gray-600 mb-4">${kitchen.cuisine_type}</p>
                                    <div class="flex justify-between text-sm text-gray-600 mb-4">
                                        <span>${kitchen.review_count} reviews</span>
                                        <span>★ ${kitchen.avg_rating}</span>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button onclick="editKitchen(${kitchen.id})" class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition text-sm">
                                            Edit
                                        </button>
                                        <button onclick="toggleKitchenStatus(${kitchen.id}, ${kitchen.is_active})" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition text-sm">
                                            ${kitchen.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            })
            .catch(error => {
                console.error('Failed to load kitchens:', error);
                showNotification('Failed to load kitchens', 'error');
            });
    }
    
    // --- Initialize Modals ---
    function initModals() {
        const addKitchenBtn = document.getElementById('add-kitchen-btn');
        const addKitchenModal = document.getElementById('add-kitchen-modal');
        const closeKitchenModal = document.getElementById('close-kitchen-modal');
        const cancelKitchen = document.getElementById('cancel-kitchen');
        
        if (addKitchenBtn && addKitchenModal) {
            addKitchenBtn.addEventListener('click', () => {
                addKitchenModal.classList.remove('hidden');
                addKitchenModal.classList.add('flex');
            });
        }
        
        if (closeKitchenModal && addKitchenModal) {
            closeKitchenModal.addEventListener('click', () => {
                addKitchenModal.classList.add('hidden');
                addKitchenModal.classList.remove('flex');
            });
        }
        
        if (cancelKitchen && addKitchenModal) {
            cancelKitchen.addEventListener('click', () => {
                addKitchenModal.classList.add('hidden');
                addKitchenModal.classList.remove('flex');
            });
        }
        
        // Add kitchen form submission
        const addKitchenForm = document.getElementById('add-kitchen-form');
        if (addKitchenForm) {
            addKitchenForm.addEventListener('submit', handleAddKitchen);
        }
    }
    
    // --- Initialize Event Handlers ---
    function initEventHandlers() {
        // Admin logout
        const adminLogout = document.getElementById('admin-logout');
        if (adminLogout) {
            adminLogout.addEventListener('click', () => {
                localStorage.removeItem('adminUser');
                window.location.href = 'login.html';
            });
        }
        
        // Notifications
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                // Show notifications dropdown
                alert('Notifications feature coming soon!');
            });
        }
    }
    
    // --- Handle Add Kitchen ---
    function handleAddKitchen(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const kitchenData = {};
        
        for (let [key, value] of formData.entries()) {
            kitchenData[key] = value;
        }
        
        // Send to API
        window.api.createKitchen(kitchenData)
            .then(response => {
                if (response.success) {
                    // Close modal and refresh data
                    const modal = document.getElementById('add-kitchen-modal');
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    
                    // Reset form
                    e.target.reset();
                    
                    // Reload kitchens data
                    loadKitchensData();
                    
                    showNotification('Kitchen added successfully!', 'success');
                }
            })
            .catch(error => {
                console.error('Failed to add kitchen:', error);
                showNotification(error.message || 'Failed to add kitchen', 'error');
            });
    }
    
    // --- Helper Functions ---
    function getStatusColor(status) {
        switch(status) {
            case 'pending': return 'bg-blue-100 text-blue-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'preparing': return 'bg-yellow-100 text-yellow-800';
            case 'ready': return 'bg-purple-100 text-purple-800';
            case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function showNotification(message, type) {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
    
    // --- Global Functions (called from HTML) ---
    window.viewOrder = function(orderId) {
        window.api.getOrder(orderId)
            .then(response => {
                if (response.success) {
                    // Show order details modal or redirect to order page
                    alert(`Order Details:\nID: ${response.order.id}\nCustomer: ${response.order.customer_name}\nTotal: ₹${response.order.total_amount}\nStatus: ${response.order.status}`);
                }
            })
            .catch(error => {
                console.error('Failed to load order:', error);
                showNotification('Failed to load order details', 'error');
            });
    };
    
    window.updateOrderStatus = function(orderId) {
        const newStatus = prompt('Enter new status (pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled):');
        if (newStatus) {
            window.api.updateOrderStatus(orderId, newStatus)
                .then(response => {
                    if (response.success) {
                        loadOrdersData();
                        showNotification('Order status updated!', 'success');
                    }
                })
                .catch(error => {
                    console.error('Failed to update order status:', error);
                    showNotification(error.message || 'Failed to update order status', 'error');
                });
        }
    };
    
    window.editKitchen = function(kitchenId) {
        alert(`Edit kitchen: ${kitchenId}`);
    };
    
    window.toggleKitchenStatus = function(kitchenId, currentStatus) {
        const newStatus = !currentStatus;
        
        window.api.updateKitchen(kitchenId, { is_active: newStatus })
            .then(response => {
                if (response.success) {
                    loadKitchensData();
                    showNotification(`Kitchen ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
                }
            })
            .catch(error => {
                console.error('Failed to toggle kitchen status:', error);
                showNotification(error.message || 'Failed to update kitchen status', 'error');
            });
    };
    
    // Load other section data functions
    function loadMenuData() {
        console.log('Loading menu data...');
    }
    
    function loadUsersData() {
        console.log('Loading users data...');
    }
    
    function loadAnalyticsData() {
        console.log('Loading analytics data...');
    }
});