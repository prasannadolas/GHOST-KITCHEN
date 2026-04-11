import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getKitchen } from '../services/api';
import { CartContext } from '../context/CartContext';

const KitchenDetail = () => {
    const { id } = useParams();
    const [kitchen, setKitchen] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [activeCategory, setActiveCategory] = useState('All');
    const [addedItems, setAddedItems] = useState({}); 

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchKitchenDetails = async () => {
            setLoading(true);
            try {
                const response = await getKitchen(id);
                if (response.success) {
                    setKitchen(response.kitchen);
                    setMenuItems(response.menuItems || []);
                } else {
                    setError("Failed to load kitchen details.");
                }
            } catch (err) {
                setError("Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchKitchenDetails();
    }, [id]);

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    const filteredMenu = activeCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === activeCategory);

    const handleAddToCart = (item) => {
        addToCart({ ...item, kitchenId: id });
        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 2000);
    };

    if (loading) return <div className="text-center py-20 text-gray-500 min-h-screen">Loading menu...</div>;
    if (error) return <div className="text-center py-20 text-red-500 min-h-screen">{error}</div>;
    if (!kitchen) return <div className="text-center py-20 min-h-screen">Kitchen not found.</div>;

    const isOpen = kitchen.is_active;

    return (
        <main className="py-8 bg-gray-50 min-h-screen">
            {/* Kitchen Header */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto shadow-sm mb-8 max-w-6xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <img src={kitchen.image_url || 'https://via.placeholder.com/400x250'} alt={kitchen.name} className="w-full md:w-64 h-48 object-cover rounded-lg shadow-sm" />
                        <div className="flex-1">
                            <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">{kitchen.name}</h1>
                            <p className="text-gray-600 mb-4">{kitchen.cuisine_type}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                <span className="text-yellow-500 font-medium">★ {parseFloat(kitchen.rating || 0).toFixed(1)} ({kitchen.total_reviews} reviews)</span>
                                <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                    {isOpen ? 'Open' : 'Currently Closed'}
                                </span>
                                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {kitchen.preparation_time}-{kitchen.preparation_time + 15} min delivery
                                </span>
                            </div>
                            <p className="text-gray-700">{kitchen.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Section */}
            <section className="container mx-auto px-6 max-w-6xl">
                <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8">Menu</h2>
                
                {/* Filters */}
                {menuItems.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-8">
                        {categories.map(category => (
                            <button 
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition ${activeCategory === category ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {menuItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">This kitchen has no menu items available right now.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMenu.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                <img src={item.image_url || 'https://via.placeholder.com/400x250'} alt={item.name} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                                    
                                    {/* h-10 prevents long descriptions from pushing the button out of bounds */}
                                    <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{item.description}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-orange-600">₹{parseFloat(item.price || 0).toFixed(2)}</span>
                                        
                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            disabled={!isOpen || addedItems[item.id]}
                                            className={`px-4 py-2 rounded-lg transition font-semibold flex items-center justify-center min-w-[120px] ${
                                                !isOpen ? 'bg-gray-400 text-white cursor-not-allowed' : 
                                                addedItems[item.id] ? 'bg-green-500 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                                            }`}
                                        >
                                            {!isOpen ? 'Closed' : 
                                             addedItems[item.id] ? (
                                                <>
                                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Added!
                                                </>
                                            ) : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default KitchenDetail;