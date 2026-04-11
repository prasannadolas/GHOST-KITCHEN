import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
    const { cart, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Custom Modal State
    const [showClearModal, setShowClearModal] = useState(false);

    const handleClearCart = () => {
        // Show our custom modal instead of window.confirm
        setShowClearModal(true);
    };

    const confirmClearCart = () => {
        clearCart();
        setShowClearModal(false);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        if (user) {
            navigate('/checkout');
        } else {
            alert('Please log in to proceed to checkout.');
            navigate('/login');
        }
    };

    return (
        <main className="py-8 min-h-screen bg-gray-50 relative">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-8">Shopping Cart</h1>
                    
                    {cart.length === 0 ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
                            <Link to="/kitchens" className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition inline-block">
                                Browse Kitchens
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-100 gap-4">
                                        <div className="flex items-center gap-4 flex-grow">
                                            <img src={item.image_url || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80'} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                                <p className="text-gray-600">₹{parseFloat(item.price).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="text-lg font-bold p-1 rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition">-</button>
                                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="text-lg font-bold p-1 rounded-full w-8 h-8 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white transition">+</button>
                                        </div>
                                        
                                        <div className="text-right sm:min-w-[100px]">
                                            <p className="font-bold text-lg text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline text-sm font-medium mt-1">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-8 mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
                                    <span className="text-lg font-bold text-gray-800">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-700">Delivery Fee:</span>
                                    <span className="text-lg font-bold text-gray-600">₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6 text-xl font-bold border-t border-gray-200 pt-4">
                                    <span className="text-gray-800">Total:</span>
                                    <span className="text-orange-600">₹{total.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button onClick={handleClearCart} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                                        Clear Cart
                                    </button>
                                    <button onClick={handleCheckout} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Custom Clear Cart Modal */}
            {showClearModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Cart</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to remove all items from your cart? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setShowClearModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmClearCart}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;