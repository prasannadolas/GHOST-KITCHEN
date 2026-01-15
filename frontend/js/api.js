// API utility functions for Ghost Kitchen
class GhostKitchenAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('authToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: this.getHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async initializeAuth() {
        if (this.token) {
            try {
                const response = await this.getCurrentUser();
                if (response.success) {
                    localStorage.setItem('userName', response.user.fullName);
                    localStorage.setItem('userEmail', response.user.email);
                    localStorage.setItem('loggedInRole', response.user.role);
                    return response.user;
                }
            } catch (error) {
                console.error("Session token is invalid, logging out.");
                this.logout(); // Clears invalid token
                return null;
            }
        }
        return null;
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

     logout() {
    this.setToken(null);
    // Ensure all user-related items are cleared from localStorage
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loggedInRole');
    }

    // Kitchen methods
    async getKitchens(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/kitchens?${params}`);
    }

    async getKitchen(id) {
        return this.request(`/kitchens/${id}`);
    }

    async createKitchen(kitchenData) {
        return this.request('/kitchens', {
            method: 'POST',
            body: JSON.stringify(kitchenData)
        });
    }

    async updateKitchen(id, kitchenData) {
        return this.request(`/kitchens/${id}`, {
            method: 'PUT',
            body: JSON.stringify(kitchenData)
        });
    }

    async deleteKitchen(id) {
        return this.request(`/kitchens/${id}`, {
            method: 'DELETE'
        });
    }

    // Menu methods
    async getMenuItems(kitchenId, category = null) {
        const params = category ? `?category=${category}` : '';
        return this.request(`/menu/kitchen/${kitchenId}${params}`);
    }

    async getAllMenuItems() {
        return this.request('/menu/admin');
    }

    async createMenuItem(itemData) {
        return this.request('/menu', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    }

    async updateMenuItem(id, itemData) {
        return this.request(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
        });
    }

    async deleteMenuItem(id) {
        return this.request(`/menu/${id}`, {
            method: 'DELETE'
        });
    }

    // Order methods
    async getUserOrders(status = null) {
        const params = status ? `?status=${status}` : '';
        return this.request(`/orders/user${params}`);
    }

    async getAllOrders(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/orders/admin?${params}`);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    async updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // NEW: Dedicated function for users to cancel their own orders
    async cancelUserOrder(id) {
        // The backend for this endpoint should verify that the logged-in user owns this order
        // before proceeding with the cancellation.
        return this.request(`/orders/${id}/cancel`, {
            method: 'POST' // Using POST for a specific action like cancellation is a common pattern
        });
    }

    // Admin methods
    async getDashboardStats() {
        return this.request('/admin/dashboard');
    }

    async getUsers(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/admin/users?${params}`);
    }

    async updateUserRole(userId, role) {
        return this.request(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
    }

    async getSettings() {
        return this.request('/admin/settings');
    }

    async updateSettings(settings) {
        return this.request('/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    // User address methods
    async getUserAddresses() {
        return this.request('/users/addresses');
    }

    async addUserAddress(addressData) {
        return this.request('/users/addresses', {
            method: 'POST',
            body: JSON.stringify(addressData)
        });
    }

    async updateUserAddress(id, addressData) {
        return this.request(`/users/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(addressData)
        });
    }

    async deleteUserAddress(id) {
        return this.request(`/users/addresses/${id}`, {
            method: 'DELETE'
        });
    }
}

// Create global API instance
window.api = new GhostKitchenAPI();

// Auto-login if token exists
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const response = await window.api.getCurrentUser();
            if (response.success) {
                localStorage.setItem('userName', response.user.fullName);
                localStorage.setItem('userEmail', response.user.email);
                localStorage.setItem('loggedInRole', response.user.role);
            }
        } catch (error) {
            // Token is invalid, remove it
            window.api.logout();
        }
    }
});

export default api;