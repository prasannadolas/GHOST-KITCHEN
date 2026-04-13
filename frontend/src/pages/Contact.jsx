import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the data to your backend
        // For now, we will just show the success message
        setStatus('success');
        e.target.reset(); // clear the form
        
        setTimeout(() => {
            setStatus(null);
        }, 5000); // hide after 5 seconds
    };

    return (
        <main className="py-16 bg-gray-50 flex-grow">
            {/* Hero Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl shadow-sm mb-8">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 mb-4">Contact Us</h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Have a question, suggestion, or want to register your own kitchen? We'd love to hear from you!</p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="container mx-auto px-6 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Send us a Message</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input type="text" id="firstName" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input type="text" id="lastName" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" id="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select id="subject" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white">
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="order">Order Support</option>
                                    <option value="partnership">Kitchen Partnership (Become an Admin)</option>
                                    <option value="technical">Technical Issue</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea id="message" rows="6" required placeholder="Please describe your inquiry in detail..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition duration-200">
                                Send Message
                            </button>
                        </form>

                        {/* Success Message */}
                        {status === 'success' && (
                            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
                                <p className="font-bold">Thank you for your message!</p>
                                <p className="text-sm mt-1">We'll get back to you within 24 hours.</p>
                            </div>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Get in Touch</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-orange-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                                        <p className="text-gray-600">support@ghostkitchen.com</p>
                                        <p className="text-sm text-gray-500">We respond within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Hours */}
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Support Hours</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-semibold text-gray-800">8:00 AM - 10:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday - Sunday</span>
                                    <span className="font-semibold text-gray-800">9:00 AM - 11:00 PM</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-800">
                                    <strong>Emergency Support:</strong> For urgent active order issues, please check your Order Dashboard for direct kitchen contact info.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;