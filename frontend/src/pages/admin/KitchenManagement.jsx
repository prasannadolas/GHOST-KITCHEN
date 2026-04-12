import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toggleKitchenStatus } from '../../services/api';

const KitchenManagement = () => {
    const [kitchens, setKitchens] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchKitchens = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/kitchens');
            setKitchens(res.data.kitchens);
        } catch (error) {
            console.error("Failed to load kitchens", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKitchens();
    }, []);

    const handleToggle = async (id, currentStatus) => {
        try {
            // If currentStatus is 1 (active), we send 0 to close it, and vice versa
            const newStatus = currentStatus ? 0 : 1; 
            await toggleKitchenStatus(id, newStatus);
            fetchKitchens(); // Refresh the list
        } catch (error) {
            alert('Failed to update kitchen status');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800">Kitchen Management</h1>
                    <p className="text-gray-600 mt-1">Open or close kitchens across the platform.</p>
                </header>

                {loading ? (
                    <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 mx-auto"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kitchens.map((kitchen) => (
                            <div key={kitchen.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{kitchen.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${kitchen.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {kitchen.is_active ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-6">{kitchen.address || 'No address provided'}</p>
                                
                                <button 
                                    onClick={() => handleToggle(kitchen.id, kitchen.is_active)}
                                    className={`w-full py-3 rounded-xl font-bold transition ${kitchen.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                >
                                    {kitchen.is_active ? 'Force Close Kitchen' : 'Open Kitchen'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default KitchenManagement;