import api from './api.js';

// Authentication JavaScript for Ghost Kitchen website
document.addEventListener('DOMContentLoaded', function () {
    
    // --- Login Form Handler ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // --- Register Form Handler ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // --- UPDATED LOGIN FUNCTION with Role-Based Redirection ---
    async function handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        try {
            const response = await api.login({ email, password });
            
            if (response.success) {
                // Store essential user data in localStorage for the session
                localStorage.setItem('userName', response.user.fullName);
                localStorage.setItem('loggedInRole', response.user.role);
                
                // --- UPDATE: Set specific token for Admin Dashboard access ---
                // The admin dashboard specifically checks for 'adminToken' to grant access.
                if (response.user.role === 'admin') {
                    localStorage.setItem('adminToken', response.token);
                }
                
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect the user based on their role after a short delay.
                setTimeout(() => {
                    switch (response.user.role) {
                        case 'admin':
                            // --- UPDATE: Corrected the redirection path ---
                            window.location.href = '../admin/admin-dashboard.html';
                            break;
                        case 'kitchen_owner':
                            window.location.href = '../admin/kitchen-dashboard.html';
                            break;
                        default:
                            // Regular 'customer' roles are sent to the homepage.
                            window.location.href = '../index.html';
                            break;
                    }
                }, 1500);
            }
        } catch (error) {
            showError(error.message || 'Login failed. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // --- Register Function ---
    async function handleRegister() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Validation
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            showError('Please fill in all required fields');
            return;
        }
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        if (!terms) {
            showError('You must agree to the terms of service');
            return;
        }

        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const response = await api.register({ fullName, email, phone, password });

            if (response.success) {
                showNotification('Account created successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        } catch (error) {
            showError(error.message || 'Registration failed. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // --- Helper Functions ---
    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
        if (window.showNotification) {
            window.showNotification(message, 'error');
        }
    }

    function showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
});