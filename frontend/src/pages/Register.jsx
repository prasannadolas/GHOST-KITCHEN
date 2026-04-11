import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
    // Form field states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [terms, setTerms] = useState(false);
    
    // UI feedback states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation checks from your old auth.js
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (!terms) {
            return setError('You must agree to the Terms of Service');
        }

        setIsSubmitting(true);

        try {
            const response = await registerUser({ fullName, email, phone, password });

            if (response.success) {
                setSuccess('Account created successfully! Redirecting to login...');
                
                // Wait 2 seconds so the user can read the success message, then navigate
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-[70vh] py-16 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">Join Ghost Kitchen</h1>
                    <p className="text-gray-600">Create your account to start ordering</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            required 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            required 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                    </div>

                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={terms}
                            onChange={(e) => setTerms(e.target.checked)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label className="ml-2 text-sm text-gray-600">
                            I agree to the <Link to="/terms" className="text-orange-600 hover:text-orange-700">Terms of Service</Link> and <Link to="/privacy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 ${isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
                
                {/* Success Message */}
                {success && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center">
                        {success}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account? <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">Sign in</Link></p>
                </div>
            </div>
        </main>
    );
};

export default Register;