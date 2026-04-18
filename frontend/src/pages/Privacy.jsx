import React from 'react';

const Privacy = () => {
    return (
        <main className="py-16 bg-gray-50 flex-grow">
            {/* Hero Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl shadow-sm mb-8">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">Privacy Policy</h1>
                        <p className="text-lg text-gray-600">Last updated: January 1, 2026</p>
                    </div>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="container mx-auto px-6">
                <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">At Ghost Kitchen, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.</p>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4 mt-8">1. Information We Collect</h2>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Personal Information</h3>
                        <p className="text-gray-600 mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-6">
                            <li>Register for an account (Customer or Kitchen Admin)</li>
                            <li>Place an order</li>
                            <li>Contact us for support</li>
                        </ul>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4 mt-8">2. How We Use Your Information</h2>
                        <p className="text-gray-600 mb-4">We use the information we collect for various purposes, including:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-6">
                            <li>Process and fulfill your Ghost Kitchen orders</li>
                            <li>Provide customer support and dashboard analytics</li>
                            <li>Improve our website and services</li>
                            <li>Prevent fraud and ensure security (via JWT tokens)</li>
                        </ul>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4 mt-8">3. Information Sharing</h2>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">With Kitchen Partners</h3>
                        <p className="text-gray-600 mb-4">We share necessary order information with our registered kitchen owners to fulfill your orders, including your name and order details.</p>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4 mt-8">4. Data Security</h2>
                        <p className="text-gray-600 mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-6">
                            <li>Secure JSON Web Tokens (JWT) for authentication</li>
                            <li>Secure MySQL databases</li>
                            <li>Password hashing</li>
                        </ul>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4 mt-8">5. Contact Us</h2>
                        <p className="text-gray-600 mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-2"><strong>Email:</strong> privacy@ghostkitchen.com</p>
                            <p className="text-gray-600 mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                            <p className="text-gray-600"><strong>Address:</strong> 123 Food Street, Culinary District, Mumbai</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Privacy;