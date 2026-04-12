import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAdminOrders, updateAdminOrderStatus } from '../../services/api';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await getAdminOrders();
            if (response.success) {
                setOrders(response.orders);
            }
        } catch (err) {
            setError('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await updateAdminOrderStatus(orderId, newStatus);
            if (response.success) {
                // Refresh the list to show updated status
                fetchOrders();
            }
        } catch (err) {
            alert('Error updating status: ' + (err.error || 'Unknown error'));
        }
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(o => o.status.toLowerCase() === filter.toLowerCase());

    const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-playfair font-bold text-gray-800">Order Management</h1>
                        <p className="text-gray-600 mt-1">Track and update active kitchen orders.</p>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['all', 'pending', 'preparing', 'delivered'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    filter === f 
                                    ? 'bg-orange-600 text-white shadow-md' 
                                    : 'text-gray-500 hover:text-orange-600'
                                }`}
                            >
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Kitchen</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Current Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.delivery_address}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-orange-600">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2"
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">#{order.id}</td>

                                         {/* ADD THIS NEW TD BLOCK */}
                                        <td className="px-6 py-4">
                                             <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                             {order.kitchen_names || 'Multiple/Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-20 text-gray-500 font-medium">
                                No orders found in this category.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderManagement;