import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/api';

const Checkout = () => {
    const { cart, subtotal, deliveryFee, total, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State to prevent the redirect bug
    const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cart.length === 0 && !isOrderSuccessful) {
            navigate('/cart');
        }
    }, [user, cart, navigate, isOrderSuccessful]);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        deliveryTime: 'asap',
        deliveryDate: '',
        deliveryTimeSlot: '',
        paymentMethod: 'cod', // Defaulting to COD
        instructions: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const gst = subtotal * 0.05;
    const finalTotal = subtotal + deliveryFee + gst;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.phone.length !== 10) return setError("Please enter a valid 10-digit phone number.");
        if (formData.pincode.length !== 6) return setError("Please enter a valid 6-digit PIN.");
        if (formData.deliveryTime === 'scheduled' && (!formData.deliveryDate || !formData.deliveryTimeSlot)) {
            return setError("Please select a date and time slot for scheduled delivery.");
        }

        setShowConfirmModal(true);
    };

    const confirmAndPlaceOrder = async () => {
        setShowConfirmModal(false);
        setIsSubmitting(true);

        const apiOrderData = {
            items: cart.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity
            })),
            delivery_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            delivery_phone: formData.phone,
            payment_method: formData.paymentMethod,
            special_instructions: formData.instructions,
            scheduled_delivery: formData.deliveryTime === 'scheduled' 
                ? new Date(`${formData.deliveryDate}T${formData.deliveryTimeSlot.split('-')[0]}:00`).toISOString() 
                : null
        };

        try {
            const response = await createOrder(apiOrderData);
            if (response.success) {
                setIsOrderSuccessful(true); 
                clearCart(); 
                navigate(`/order-confirmation/${response.order.id}`); 
            }
        } catch (err) {
            setError(err.message || 'Failed to place order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user || (cart.length === 0 && !isOrderSuccessful)) return null; 

    return (
        <main className="py-8 min-h-screen bg-gray-50 relative">
            <div className="container mx-auto px-6 max-w-6xl">
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-center space-x-8">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                            <span className="ml-2 text-sm font-medium text-gray-600">Cart</span>
                        </div>
                        <div className="w-16 h-1 bg-orange-600"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <span className="ml-2 text-sm font-medium text-orange-600">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                            <span className="ml-2 text-sm font-medium text-gray-600">Confirmation</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-8">Checkout</h1>
                            
                            {/* ADDED ID HERE */}
                            <form id="checkout-form" onSubmit={handlePreSubmit} className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Information</h2>
                                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                                        <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                        <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 mb-4" />
                                    <textarea name="address" placeholder="Full Delivery Address" required rows="3" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 mb-4 resize-none"></textarea>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                        <input type="text" name="state" placeholder="State" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                        <input type="text" name="pincode" placeholder="PIN Code" required value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Time</h2>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.deliveryTime === 'asap' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                                            <input type="radio" name="deliveryTime" value="asap" checked={formData.deliveryTime === 'asap'} onChange={handleInputChange} className="hidden" />
                                            <div className="ml-3">
                                                <div className="font-medium text-gray-800">ASAP</div>
                                                <div className="text-sm text-gray-600">Deliver as soon as possible</div>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.deliveryTime === 'scheduled' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                                            <input type="radio" name="deliveryTime" value="scheduled" checked={formData.deliveryTime === 'scheduled'} onChange={handleInputChange} className="hidden" />
                                            <div className="ml-3">
                                                <div className="font-medium text-gray-800">Schedule</div>
                                                <div className="text-sm text-gray-600">Choose delivery time</div>
                                            </div>
                                        </label>
                                    </div>

                                    {formData.deliveryTime === 'scheduled' && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <input type="date" name="deliveryDate" min={new Date().toISOString().split('T')[0]} value={formData.deliveryDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                            <select name="deliveryTimeSlot" value={formData.deliveryTimeSlot} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                                                <option value="">Select time slot</option>
                                                <option value="18:00-19:00">6:00 PM - 7:00 PM</option>
                                                <option value="19:00-20:00">7:00 PM - 8:00 PM</option>
                                                <option value="20:00-21:00">8:00 PM - 9:00 PM</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                                    <div className="space-y-4">
                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                                            <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} className="hidden" />
                                            <div className="ml-3 flex items-center">
                                                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none">
                                                    <rect x="2" y="4" width="20" height="16" rx="2" fill="#FF6B35"/>
                                                    <path d="M8 12h8M8 8h8M8 16h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                                <div>
                                                    <div className="font-medium text-gray-800">UPI Payment</div>
                                                    <div className="text-sm text-gray-600">Pay using UPI (Google Pay, PhonePe, Paytm, etc.)</div>
                                                </div>
                                            </div>
                                        </label>
                                        
                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                                            <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                                            <div className="ml-3 flex items-center">
                                                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" fill="#10B981"/>
                                                    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <div>
                                                    <div className="font-medium text-gray-800">Cash on Delivery</div>
                                                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Special Instructions (Optional)</h2>
                                    <textarea name="instructions" rows="3" placeholder="Any special instructions for the kitchen or delivery..." value={formData.instructions} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition resize-none"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                                        <img src={item.image_url || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (5%)</span>
                                    <span>₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-orange-600">₹{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ERROR DISPLAY MOVED HERE */}
                            {error && <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                            {/* CONFIRM ORDER BUTTON MOVED HERE (Uses form="checkout-form") */}
                            <button form="checkout-form" type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition text-lg mt-6 disabled:bg-orange-400 flex justify-center items-center">
                                {isSubmitting ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                                        </svg>
                                        Confirm Order
                                    </>
                                )}
                            </button>

                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center text-green-800 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                                    </svg>
                                    Your payment information is secure and encrypted
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Your Order</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                You are about to place an order for <span className="font-bold text-gray-700">₹{finalTotal.toFixed(2)}</span> using <span className="font-bold text-gray-700">{formData.paymentMethod.toUpperCase()}</span>. Do you want to proceed?
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAndPlaceOrder}
                                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Checkout;