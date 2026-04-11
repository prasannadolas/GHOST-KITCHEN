import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getKitchens } from '../services/api';

const Kitchens = () => {
    const [kitchens, setKitchens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // States for filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const fetchAllKitchens = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await getKitchens(filters);
            if (response.success) {
                setKitchens(response.kitchens);
            } else {
                setError("Failed to load kitchens.");
            }
        } catch (err) {
            setError("Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    // Load kitchens on initial mount
    useEffect(() => {
        fetchAllKitchens();
    }, []);

    // Handle Search Button Click
    const handleSearch = () => {
        fetchAllKitchens({ search: searchTerm, cuisine: activeCategory === 'All' ? '' : activeCategory });
    };

    // Handle "Enter" key in search bar
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle Category Filter Click
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        fetchAllKitchens({ search: searchTerm, cuisine: category === 'All' ? '' : category });
    };

    return (
        <main className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-playfair font-bold text-gray-800">All Kitchens</h1>
                    <p className="text-lg text-gray-600 mt-2">Discover amazing food from local ghost kitchens</p>
                </div>
                
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8 flex items-center space-x-2">
                    <input 
                        type="text" 
                        placeholder="Search kitchens or cuisine..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition" 
                    />
                    <button 
                        onClick={handleSearch}
                        className="px-6 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition"
                    >
                        Search
                    </button>
                </div>

                {/* Category Filters */}
                <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
                    {['All', 'Indian', 'Chinese', 'Dessert'].map((category) => (
                        <button 
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeCategory === category ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading / Error States */}
                {loading && <p className="text-center text-gray-500">Loading kitchens...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Kitchens Grid */}
                {!loading && !error && kitchens.length === 0 && (
                    <p className="text-center text-gray-600">No kitchens found. Try adjusting your search.</p>
                )}

                {!loading && !error && kitchens.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {kitchens.map(kitchen => (
                            <div key={kitchen.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                <Link to={`/kitchen/${kitchen.id}`}>
                                    <img className="w-full h-48 object-cover" src={kitchen.image_url || 'https://via.placeholder.com/400x250'} alt={`Image of ${kitchen.name}`} />
                                </Link>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold font-playfair text-gray-800">{kitchen.name}</h3>
                                            <p className="text-sm text-gray-600">{kitchen.cuisine_type}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${kitchen.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {kitchen.is_active ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        <span>{parseFloat(kitchen.rating || 0).toFixed(1)} ({kitchen.total_reviews} reviews)</span>
                                    </div>
                                    <div className="mt-4">
                                        {kitchen.is_active ? (
                                            <Link to={`/kitchen/${kitchen.id}`} className="block w-full text-center px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition font-semibold">
                                                View Menu
                                            </Link>
                                        ) : (
                                            <button disabled className="block w-full text-center px-4 py-2 text-white bg-gray-400 cursor-not-allowed rounded-lg font-semibold">
                                                Currently Closed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Kitchens;