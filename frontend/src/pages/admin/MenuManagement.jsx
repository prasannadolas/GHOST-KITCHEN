import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { deleteMenuItem } from '../../services/api';
import axios from 'axios'; // For the initial fetch, or add a helper to api.js

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [error, setError] = useState('');

    const fetchMenu = async () => {
        try {
            // Using the admin endpoint defined in your backend menu.js
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/menu/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setMenuItems(response.data.menuItems);
            }
        } catch (err) {
            setError('Failed to load menu items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await deleteMenuItem(itemToDelete.id);
            if (response.success) {
                setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id));
                setItemToDelete(null);
            }
        } catch (err) {
            alert('Failed to delete item.');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-playfair font-bold text-gray-800">Menu Management</h1>
                        <p className="text-gray-600 mt-1">Add, edit, or remove dishes from the kitchens.</p>
                    </div>
                    <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg">
                        + Add New Dish
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <img 
                                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'} 
                                    className="w-full h-48 object-cover" 
                                    alt={item.name} 
                                />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                        <span className="text-orange-600 font-bold">₹{parseFloat(item.price).toFixed(2)}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                            {item.kitchen_name}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => setItemToDelete(item)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Delete Confirmation Modal */}
                {itemToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <span className="text-red-600 text-xl font-bold">!</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Dish?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete <span className="font-bold text-gray-800">{itemToDelete.name}</span>? This cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button 
                                    onClick={() => setItemToDelete(null)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MenuManagement;