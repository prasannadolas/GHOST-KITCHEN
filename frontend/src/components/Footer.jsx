import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12 rounded-t-xl mt-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-playfair font-bold mb-4">GHOST-KITCHEN</h3>
                        <p className="text-gray-400">Your favorite food, delivered.</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul>
                            <li className="mb-2"><Link to="/about" className="text-gray-400 hover:text-white rounded-md">About Us</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-gray-400 hover:text-white rounded-md">Contact</Link></li>
                            <li className="mb-2"><Link to="/faq" className="text-gray-400 hover:text-white rounded-md">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Legal</h3>
                        <ul>
                            <li className="mb-2"><Link to="/terms" className="text-gray-400 hover:text-white rounded-md">Terms of Service</Link></li>
                            <li className="mb-2"><Link to="/privacy" className="text-gray-400 hover:text-white rounded-md">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            {/* SVG Icons removed for brevity, keep your original SVGs here, just change class to className */}
                            <span className="text-gray-400 hover:text-white cursor-pointer">Facebook</span>
                            <span className="text-gray-400 hover:text-white cursor-pointer">Twitter</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
                    &copy; 2026 GHOST-KITCHEN. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;