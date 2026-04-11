import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import your Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // When the app loads, check if there's a token and fetch the user profile
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Call your backend to get the current user details based on the token
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        setUser(response.data.user);
                    }
                } catch (error) {
                    console.error("Invalid token, logging out.");
                    logout();
                }
            }
            setLoading(false);
        };
        verifyToken();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        setUser(userData);
        
        // Handle admin token logic from your old code
        if (userData.role === 'admin') {
            localStorage.setItem('adminToken', token);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};