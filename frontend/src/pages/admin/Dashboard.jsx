import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAdminStats } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAdminStats();
                if (response.success) {
                    setStats(response.stats);
                }
            } catch (err) {
                setError('Failed to load dashboard statistics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Navigation Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, <span className="font-bold text-orange-600">{user?.fullName}</span>. Here is what's happening today.</p>
                </header>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-8 font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-3 bg-green-100 rounded-xl text-2xl">💰</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Revenue</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">₹{parseFloat(stats?.revenue || 0).toFixed(2)}</p>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-3 bg-blue-100 rounded-xl text-2xl">📦</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Orders</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats?.orders || 0}</p>
                    </div>

                    {/* Conditional Cards for Super Admin Only */}
                    {user?.role === 'admin' && (
                        <>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="p-3 bg-purple-100 rounded-xl text-2xl">👥</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Customers</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats?.users || 0}</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="p-3 bg-orange-100 rounded-xl text-2xl">🏢</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Kitchens</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats?.kitchens || 0}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Recent Activity Placeholder */}
                <div className="flex flex-wrap gap-4">
                    <Link to="/admin/orders" className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-md">
                           View All Orders
                    </Link>
                     <Link to="/admin/menu" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                          Manage Menu
                     </Link>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;