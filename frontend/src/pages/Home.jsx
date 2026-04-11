import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getKitchens } from '../services/api';

const Home = () => {
    // State to hold the fetched kitchens and loading status
    const [kitchens, setKitchens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch kitchens when the component mounts
    useEffect(() => {
        const fetchPopularKitchens = async () => {
            try {
                // Request 3 kitchens just like your old main.js
                const response = await getKitchens({ limit: 3 });
                if (response.success && response.kitchens) {
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

        fetchPopularKitchens();
    }, []); // Empty array means this only runs once on load

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="hero-bg text-white rounded-b-xl">
                <div className="container mx-auto px-6 py-32 text-center">
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">Delicious Food, Delivered To You</h1>
                    <p className="text-lg md:text-xl mb-8">The best meals from the finest local kitchens, right at your doorstep.</p>
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-full p-2 flex items-center shadow-lg">
                            <input type="text" placeholder="Enter your delivery address" className="w-full bg-transparent text-gray-700 px-4 py-2 focus:outline-none rounded-full" />
                            <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition whitespace-nowrap">Find Kitchens</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white rounded-xl mx-4 md:mx-auto mt-8 shadow-sm">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-playfair font-bold text-center mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 rounded-full p-6 mb-4">
                                <span className="text-2xl font-bold text-orange-600">1</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Find Kitchens Nearby</h3>
                            <p className="text-gray-600">Enter your address to see which local kitchens deliver to you.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 rounded-full p-6 mb-4">
                                <span className="text-2xl font-bold text-orange-600">2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Choose Your Meal</h3>
                            <p className="text-gray-600">Browse menus and add your favorite dishes to the cart.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 rounded-full p-6 mb-4">
                                <span className="text-2xl font-bold text-orange-600">3</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pay & Relax</h3>
                            <p className="text-gray-600">Pay securely online and get ready for a delicious meal.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Kitchens Section - NOW DYNAMIC */}
            <section className="py-20 bg-gray-50 rounded-xl mx-4 md:mx-auto mt-8">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-playfair font-bold text-center mb-12">Popular Kitchens</h2>
                    
                    {loading && <p className="text-center text-gray-500 mb-8">Loading popular kitchens...</p>}
                    {error && <p className="text-center text-red-500 mb-8">{error}</p>}
                    
                    {!loading && !error && kitchens.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {kitchens.map((kitchen) => (
                                <Link to={`/kitchen/${kitchen.id}`} key={kitchen.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300 block">
                                    <img src={kitchen.image_url || 'https://via.placeholder.com/400x250'} alt={`Image of ${kitchen.name}`} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{kitchen.name}</h3>
                                        <p className="text-gray-600 mb-4">{kitchen.cuisine_type}</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-yellow-500">★ {parseFloat(kitchen.rating || 0).toFixed(1)} ({kitchen.total_reviews} reviews)</span>
                                            <span className={`font-semibold ${kitchen.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                {kitchen.is_active ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center">
                        <Link to="/kitchens" className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition inline-block">
                            View All Kitchens
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;