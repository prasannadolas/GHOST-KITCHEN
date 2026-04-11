import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Access global state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await loginUser({ email, password });
            if (response.success) {
                // Update global context
                login(response.user, response.token);
                
                // Redirect based on role (like your old code)
                setTimeout(() => {
                    if (response.user.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else if (response.user.role === 'kitchen_owner') {
                        navigate('/kitchen-dashboard');
                    } else {
                        navigate('/'); // Send to Home
                    }
                }, 1000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-[70vh] py-16 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 ${isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium">Sign up</Link></p>
                </div>
            </div>
        </main>
    );
};

export default Login;