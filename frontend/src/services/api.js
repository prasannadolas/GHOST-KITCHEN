import axios from 'axios';

// Create an Axios instance with your base URL
// 🌐 DEPLOYMENT UPDATE: Uses Vercel's Environment Variable if available, otherwise defaults to localhost
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add an interceptor to automatically attach the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getKitchens = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/kitchens?${params}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching kitchens:", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        // Axios wraps the backend error message inside error.response.data
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

export const getKitchen = async (id) => {
    try {
        const response = await api.get(`/kitchens/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch kitchen details');
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to place order');
    }
};

export const getOrder = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch order details');
    }
};

export const getUserOrders = async () => {
    try {
        const response = await api.get('/orders/user');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch user orders');
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update order status');
    }
};

// --- ADMIN & KITCHEN OWNER SERVICES ---

// 1. Get Dashboard Statistics
export const getAdminStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 2. Toggle Kitchen Status (Open/Close)
export const toggleKitchenStatus = async (kitchenId, isActive) => {
    try {
        const response = await api.patch(`/admin/kitchens/${kitchenId}/status`, { 
            is_active: isActive 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 3. Get All Admin Orders
export const getAdminOrders = async () => {
    try {
        const response = await api.get('/admin/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 4. Update Order Status (Preparing, Delivered, etc.)
export const updateAdminOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/admin/orders/${orderId}/status`, { 
            status: status 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 5. Delete Menu Item
export const deleteMenuItem = async (itemId) => {
    try {
        const response = await api.delete(`/admin/menu/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;