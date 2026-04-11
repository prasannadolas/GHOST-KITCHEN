import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrder = async () => {
        try {
            const response = await getOrder(id);
            if (response.success) {
                setOrder(response.order);
            }
        } catch (err) {
            setError('Could not load order details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchOrder();

        // Set up polling every 30 seconds for live status updates
        const intervalId = setInterval(fetchOrder, 30000);

        // Cleanup interval if the user leaves the page or order is delivered/cancelled
        if (order?.status === 'Delivered' || order?.status === 'Cancelled') {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [id, order?.status]);

    if (loading) return <div className="text-center py-20 min-h-screen">Loading order details...</div>;
    if (error || !order) return <div className="text-center py-20 min-h-screen text-red-500">{error || "Order not found."}</div>;

    // Helper for visual tracker
    const statuses = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentStatusIndex = Math.max(0, statuses.indexOf(order.status || 'Confirmed'));

    return (
        <main className="py-8 min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Success Banner */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Order Confirmed!</h1>
                    <p className="text-lg text-gray-600 mb-6">Thank you! We've received your order and will start preparing it soon.</p>
                    <div className="bg-orange-50 rounded-lg p-4 inline-block">
                        <p className="text-orange-800 font-semibold">Order ID: #{order.id}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>
                            
                            <div className="space-y-4 mb-8">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0">
                                        <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.name || 'Unnamed Item'}</h4>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-3">
                                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{parseFloat(order.subtotal || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>₹40.00</span></div>
                                <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>₹{parseFloat(order.gst_amount || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-gray-200">
                                    <span>Total Paid</span><span>₹{parseFloat(order.total_amount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Tracker & Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status</h3>
                            <div className="space-y-4">
                                {statuses.map((status, index) => {
                                    const isCompleted = index < currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    return (
                                        <div key={status} className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all 
                                                ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                                                  isCurrent ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                                {isCompleted ? '✓' : isCurrent ? <div className="w-3 h-3 bg-white rounded-full"></div> : index + 1}
                                            </div>
                                            <div className="ml-3">
                                                <p className={`font-medium ${isCurrent ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{status}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h3>
                            <div className="space-y-3 text-sm">
                                <div><p className="font-medium text-gray-700">Delivering to:</p><p className="text-gray-600">{order.delivery_address || 'Not Provided'}</p></div>
                                <div><p className="font-medium text-gray-700">Phone:</p><p className="text-gray-600">{order.delivery_phone || 'Not Provided'}</p></div>
                                <div><p className="font-medium text-gray-700">Payment Method:</p><p className="text-gray-600">{order.payment_method?.toUpperCase() === 'COD' ? 'Cash on Delivery' : 'Paid Online'}</p></div>
                            </div>
                        </div>

                        <Link to="/orders" className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                            View All My Orders
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmation;

