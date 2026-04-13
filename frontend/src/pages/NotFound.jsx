import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <main className="flex-grow flex items-center justify-center py-20 bg-gray-50">
            <div className="text-center max-w-2xl mx-auto px-6">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mx-auto text-orange-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.264-5.354-3.153C5.604 10.729 5.604 9.271 6.646 8.153A7.962 7.962 0 0112 5c2.34 0 4.29 1.264 5.354 3.153C18.396 9.271 18.396 10.729 17.354 11.847z" />
                    </svg>
                    <div className="text-9xl font-bold text-gray-200 mb-4 animate-pulse">404</div>
                </div>

                {/* Error Message */}
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
                <p className="text-lg text-gray-600 mb-8">We can't seem to find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.</p>

                {/* Action Buttons */}
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                    <Link to="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition shadow-md">
                        Go Home
                    </Link>
                    <Link to="/kitchens" className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition">
                        Browse Kitchens
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-16 border-t border-gray-200 pt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Looking for something specific?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
                        <Link to="/kitchens" className="text-gray-600 hover:text-orange-600 transition">All Kitchens</Link>
                        <Link to="/orders" className="text-gray-600 hover:text-orange-600 transition">My Orders</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-orange-600 transition">Contact Us</Link>
                        <Link to="/faq" className="text-gray-600 hover:text-orange-600 transition">FAQ</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotFound;