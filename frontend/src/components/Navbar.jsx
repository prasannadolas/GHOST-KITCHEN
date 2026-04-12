import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);

    useEffect(() => {
        const hasBeenGreeted = sessionStorage.getItem('greeted');

        if (user && !hasBeenGreeted) {
            setShowToast(true);
            sessionStorage.setItem('greeted', 'true');

            const timer = setTimeout(() => {
                setShowToast(false);
            }, 4000);

            return () => clearTimeout(timer);
        }

        if (!user) {
            sessionStorage.removeItem('greeted');
        }
    }, [user]);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    // Helper to check if user has dashboard access
    const hasAdminAccess = user && (user.role === 'admin' || user.role === 'kitchen_owner');

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 rounded-b-lg">
            
            {/* --- TOAST NOTIFICATION POPUP --- */}
            {showToast && user && (
                <div className="fixed top-24 right-6 z-[100] animate-bounce-in">
                    <div className="bg-white border-l-4 border-orange-600 shadow-2xl rounded-lg p-4 flex items-center space-x-4 min-w-[300px]">
                        <div className="bg-orange-100 p-2 rounded-full">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Welcome Back!</p>
                            <p className="text-xs text-gray-600 font-medium">
                                Login successfully by <span className="text-orange-600">{user.fullName}</span>
                            </p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-playfair text-orange-600 font-bold rounded-md">
                    GHOST-KITCHEN
                </Link>
                
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/kitchens" className="text-gray-600 hover:text-orange-600 transition font-medium">Kitchens</Link>
                    <Link to="/orders" className="text-gray-600 hover:text-orange-600 transition font-medium">My Orders</Link>
                    <Link to="/cart" className="text-gray-600 hover:text-orange-600 transition relative font-medium">
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 -mt-2 -mr-4 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </nav>
                
                <div className="hidden md:flex items-center space-x-4">
                    {!user ? (
                        <div className="flex space-x-4">
                            <Link to="/login" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition">Log In</Link>
                            <Link to="/register" className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition">Register</Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-700">Welcome, {user.fullName}</span>
                            
                            {/* FIXED: Now checks for BOTH admin and kitchen_owner */}
                            {hasAdminAccess && (
                                <Link to="/admin/dashboard" className="text-sm text-orange-600 font-bold hover:underline">Dashboard</Link>
                            )}
                            
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">Logout</button>
                        </div>
                    )}
                </div>
                
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-6 pb-4">
                    <Link to="/kitchens" className="block py-2 text-gray-600">Kitchens</Link>
                    <Link to="/orders" className="block py-2 text-gray-600">My Orders</Link>
                    <Link to="/cart" className="block py-2 text-gray-600">Cart</Link>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="block text-center py-2 text-gray-600">Log In</Link>
                                <Link to="/register" className="block text-center py-2 text-orange-600 font-bold">Register</Link>
                            </>
                        ) : (
                            <>
                                {/* FIXED: Added Dashboard link to mobile view as well */}
                                {hasAdminAccess && (
                                    <Link to="/admin/dashboard" className="block text-center py-2 mb-2 text-orange-600 font-bold bg-orange-50 rounded-lg">Admin Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="w-full py-2 bg-red-600 text-white rounded-full">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
                        <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                        <div className="flex space-x-4">
                            <button onClick={() => setShowLogoutModal(false)} className="flex-1 bg-gray-100 py-2 rounded-lg font-bold">Cancel</button>
                            <button onClick={confirmLogout} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;