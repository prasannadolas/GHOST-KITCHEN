import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const AddMenuItem = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [kitchens, setKitchens] = useState([]); // For Super Admin to pick a kitchen
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        kitchen_id: '',
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        image_url: '',
        is_vegetarian: false,
        is_vegan: false,
        spice_level: 'mild',
        preparation_time: 15
    });

    useEffect(() => {
        // If Super Admin, fetch all kitchens for the dropdown
        if (user?.role === 'admin') {
            const fetchKitchens = async () => {
                try {
                    const res = await axios.get('http://localhost:3001/api/kitchens');
                    setKitchens(res.data.kitchens);
                } catch (err) {
                    console.error("Failed to load kitchens", err);
                }
            };
            fetchKitchens();
        } else {
            // If Kitchen Owner, we need to know their kitchen ID
            // Ideally, your AuthContext or a separate call provides this.
            // For now, we'll assume the backend handles the owner's kitchen link.
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3001/api/menu', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert('Dish added successfully!');
                navigate('/admin/menu');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add dish');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-800">Add New Dish</h1>
                    <p className="text-gray-600 mt-1">Create a new entry for your kitchen's menu.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user?.role === 'admin' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Kitchen</label>
                                    <select 
                                        name="kitchen_id" 
                                        required 
                                        value={formData.kitchen_id} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="">-- Choose a Kitchen --</option>
                                        {kitchens.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Dish Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Paneer Butter Masala" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="Starters">Starters</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Beverages">Beverages</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="250.00" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Prep Time (mins)</label>
                                <input type="number" name="preparation_time" value={formData.preparation_time} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe the ingredients and taste..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://image-link.com/dish.jpg" />
                        </div>

                        <div className="flex flex-wrap gap-6 py-4">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="is_vegetarian" checked={formData.is_vegetarian} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                                <span className="text-sm font-semibold text-gray-700">Vegetarian</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="is_vegan" checked={formData.is_vegan} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                                <span className="text-sm font-semibold text-gray-700">Vegan</span>
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg disabled:bg-gray-400">
                            {loading ? 'Processing...' : '🚀 Create Dish'}
                        </button>
                    </form>

                    {/* Preview Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Card Preview</h2>
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            <img src={formData.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'} className="w-full h-56 object-cover" alt="Preview" />
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-800">{formData.name || 'Dish Name'}</h3>
                                    <span className="text-orange-600 font-bold text-xl">₹{formData.price || '0'}</span>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{formData.description || 'No description provided.'}</p>
                                <div className="flex gap-2">
                                    {formData.is_vegetarian && <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Veg</span>}
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">{formData.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddMenuItem;