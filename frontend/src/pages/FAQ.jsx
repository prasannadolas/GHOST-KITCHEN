import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // The React Way: Store data in an array and map over it!
    const faqData = [
        { id: 1, category: 'ordering', question: 'How do I place an order?', answer: 'To place an order, simply browse our available kitchens, select the dishes you want, add them to your cart, and proceed to checkout. You\'ll need to provide your delivery address and payment information to complete your order.' },
        { id: 2, category: 'ordering', question: 'Can I modify my order after placing it?', answer: 'You can modify your order within 5 minutes of placing it, provided the kitchen hasn\'t started preparing your food. After that, modifications may not be possible. Contact our support team immediately if you need to make changes.' },
        { id: 3, category: 'ordering', question: 'What\'s the minimum order amount?', answer: 'The minimum order amount varies by kitchen and location, typically ranging from ₹150 to ₹300. You\'ll see the minimum order requirement on each kitchen\'s page before placing your order.' },
        { id: 4, category: 'delivery', question: 'How long does delivery take?', answer: 'Delivery times typically range from 25-45 minutes, depending on the kitchen\'s preparation time, your location, and current demand. You\'ll see estimated delivery times before completing your order.' },
        { id: 5, category: 'delivery', question: 'Do you deliver to my area?', answer: 'Enter your address on our homepage to see available kitchens in your area. We\'re constantly expanding our delivery zones, so check back regularly if we don\'t currently serve your location.' },
        { id: 6, category: 'delivery', question: 'What are the delivery charges?', answer: 'Delivery charges are typically ₹40 for most orders. Some kitchens offer free delivery on orders above a certain amount. You\'ll see all applicable charges before confirming your order.' },
        { id: 7, category: 'payment', question: 'What payment methods do you accept?', answer: 'We accept all major credit and debit cards, UPI payments, net banking, and popular digital wallets. Cash on delivery is available in select areas.' },
        { id: 8, category: 'payment', question: 'Is my payment information secure?', answer: 'Yes, absolutely. We use industry-standard encryption and secure payment gateways to protect your financial information. We never store your complete card details on our servers.' },
        { id: 9, category: 'payment', question: 'Can I get a refund for my order?', answer: 'Refunds are available for cancelled orders (before preparation begins) or if there are issues with your delivered order. Refunds typically process within 5-7 business days to your original payment method.' },
        { id: 10, category: 'account', question: 'Do I need to create an account to order?', answer: 'While you can browse menus without an account, you\'ll need to create one to place orders. This helps us track your orders, save your preferences, and provide better customer service.' },
        { id: 11, category: 'account', question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a password reset link. Follow the instructions in the email to create a new password.' },
        { id: 12, category: 'other', question: 'How do I contact customer support?', answer: 'You can reach our support team through the contact form on our website, email us at support@ghostkitchen.com, or call +1 (555) 123-4567. We\'re available 8 AM to 10 PM, 7 days a week.' }
    ];

    // Filter logic for search bar and category buttons
    const filteredFaqs = faqData.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="py-16 bg-gray-50 flex-grow">
            {/* Hero Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl shadow-sm mb-8">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Find answers to common questions about ordering, delivery, payments, and more.</p>
                    </div>
                    
                    {/* Search FAQ */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search for answers..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="container mx-auto px-6 max-w-7xl mb-8">
                <div className="flex flex-wrap gap-4 justify-center">
                    {['all', 'ordering', 'delivery', 'payment', 'account', 'other'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-bold capitalize transition ${activeCategory === cat ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-6 max-w-7xl">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFaqs.map((faq) => (
                                <div key={faq.id} className="border border-gray-100 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                                        className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
                                    >
                                        <span className="font-bold text-gray-800">{faq.question}</span>
                                        <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${expandedId === faq.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    {expandedId === faq.id && (
                                        <div className="px-6 py-4 text-gray-600 bg-white border-t border-gray-100 animate-fade-in">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">No matching questions found</h2>
                            <p className="text-gray-600 mb-6">Try adjusting your search terms or browse by category</p>
                            <Link to="/contact" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition">Contact Support</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Still Need Help Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl mt-8 py-16 shadow-sm">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Still Need Help?</h2>
                    <p className="text-lg text-gray-600 mb-8">Can't find what you're looking for? Our support team is here to help.</p>
                    <Link to="/contact" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition text-lg">Contact Support</Link>
                </div>
            </section>
        </main>
    );
};

export default FAQ;