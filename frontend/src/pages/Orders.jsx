import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders, updateOrderStatus } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    
    // State for the custom Cancel Modal
    const [orderToCancel, setOrderToCancel] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await getUserOrders();
            if (response.success) {
                // Sort newest first using backend's created_at field
                setOrders(response.orders.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)));
            }
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Triggers the modal instead of window.confirm
    const handleCancelClick = (orderId) => {
        setOrderToCancel(orderId);
    };

    // Executes the API call when the user clicks "Yes, Cancel Order" in the modal
    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        
        try {
            const response = await updateOrderStatus(orderToCancel, 'cancelled');
            if (response.success) {
                fetchOrders(); // Refresh the list automatically
            }
        } catch (error) {
            alert('Failed to cancel order.');
        } finally {
            setOrderToCancel(null); // Close the modal
        }
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(o => o.status?.toLowerCase() === filter.toLowerCase());

    return (
        <main className="py-8 min-h-screen bg-gray-50 relative">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-8">My Orders</h1>

                    {!user ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Please log in to view your orders</h2>
                            <p className="text-gray-600 mb-6">You need to be logged in to access your order history</p>
                            <Link to="/login" className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition inline-block">Log In</Link>
                        </div>
                    ) : (
                        <>
                            {/* Filter Tabs */}
                            <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200">
                                {['all', 'pending', 'preparing', 'delivered'].map(f => (
                                    <button 
                                        key={f} 
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 font-medium border-b-2 transition capitalize ${filter === f ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-orange-600'}`}
                                    >
                                        {f === 'all' ? 'All Orders' : f}
                                    </button>
                                ))}
                            </div>

                            {loading ? (
                                <p className="text-center text-gray-500 py-8">Loading your orders...</p>
                            ) : filteredOrders.length === 0 ? (
                                <div className="text-center py-16">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                                    <p className="text-gray-600 mb-6">You haven't placed any orders. Start browsing our kitchens!</p>
                                    <Link to="/kitchens" className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition inline-block">Browse Kitchens</Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredOrders.map(order => {
                                        // FIXED: Properly reading 'created_at' from SQL database
                                        const dateString = order.created_at || order.createdAt;
                                        const orderDate = dateString 
                                            ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                                            : 'Unknown Date';
                                            
                                        const kitchenName = order.items?.[0]?.kitchen?.name || "Ghost Kitchen";
                                        const isPending = order.status?.toLowerCase() === 'pending';

                                        // FIXED: Correct SQL math mapping for Subtotal, Delivery, and GST
                                        const totalAmount = parseFloat(order.total_amount || 0);
                                        const deliveryFee = parseFloat(order.delivery_fee || 40);
                                        const gstAmount = parseFloat(order.gst_amount || 0);
                                        // Calculate subtotal dynamically if backend didn't save it directly
                                        const subtotal = totalAmount - deliveryFee - gstAmount;

                                        return (
                                            <div key={order.id} className="bg-gray-50 rounded-lg p-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                                                        <p className="text-sm text-gray-600">From {kitchenName}</p>
                                                        <p className="text-sm text-gray-600">{orderDate}</p>
                                                    </div>
                                                    <div className="mt-4 md:mt-0">
                                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                            isPending ? 'bg-blue-100 text-blue-800' :
                                                            order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4">
                                                    <div className="space-y-2 mb-4">
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm">
                                                                <span>{item.quantity}x {item.name || 'Item'}</span>
                                                                <span>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Subtotal, Fee, GST Breakdown with FIXED Math */}
                                                    <div className="space-y-2 border-t border-gray-200 pt-2 mb-4">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Subtotal</span>
                                                            <span>₹{subtotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>Delivery Fee</span>
                                                            <span>₹{deliveryFee.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>GST (5%)</span>
                                                            <span>₹{gstAmount.toFixed(2)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                                                        <span>Total</span>
                                                        <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
                                                    </div>

                                                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                                        <Link to={`/order-confirmation/${order.id}`} className="flex-1 bg-orange-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition">
                                                            Track Order
                                                        </Link>
                                                        {isPending && (
                                                            <button onClick={() => handleCancelClick(order.id)} className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition">
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Custom Cancel Order Modal */}
            {orderToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to cancel Order #{orderToCancel}? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setOrderToCancel(null)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                No, Keep It
                            </button>
                            <button 
                                onClick={confirmCancelOrder}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                            >
                                Yes, Cancel It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Orders;