import React from 'react';

const About = () => {
    return (
        <main className="py-16 bg-gray-50 flex-grow">
            {/* Hero Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl shadow-sm mb-8">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 mb-4">About Ghost Kitchen</h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">We're revolutionizing food delivery by connecting you with the finest local ghost kitchens, bringing restaurant-quality meals straight to your doorstep.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop" alt="Chef preparing food in a modern kitchen" className="w-full h-96 object-cover rounded-lg shadow-lg" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-6">Founded to bridge the gap between talented chefs and food lovers, Ghost Kitchen emerged from a simple idea: everyone deserves access to exceptional food, no matter where they are. We recognized that brilliant culinary minds were operating kitchens without traditional storefronts.</p>
                            <p className="text-gray-600">Today, we provide the ultimate platform for these ghost kitchens. By centralizing menus, managing seamless orders, and providing robust dashboards for kitchen owners, we ensure an unparalleled variety of flavors are delivered fresh to your door.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl py-16 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Our Mission & Values</h2>
                        <p className="text-lg text-gray-600">What drives us every day</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Quality First</h3>
                            <p className="text-gray-600">We partner only with kitchens that meet our strict quality standards, ensuring every meal exceeds your expectations.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Speed & Reliability</h3>
                            <p className="text-gray-600">Fast delivery times and reliable order tracking from the kitchen straight to your dining table.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Empowering Chefs</h3>
                            <p className="text-gray-600">Supporting local businesses by providing them the digital infrastructure to manage menus, orders, and revenue seamlessly.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;