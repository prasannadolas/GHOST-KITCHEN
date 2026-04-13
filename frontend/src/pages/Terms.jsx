import React from 'react';

const Terms = () => {
    return (
        <main className="py-16 bg-gray-50 flex-grow">
            {/* Hero Section */}
            <section className="bg-white rounded-xl mx-4 md:mx-auto max-w-7xl shadow-sm mb-8">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">Terms of Service</h1>
                        <p className="text-lg text-gray-600">Last updated: January 1, 2026</p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="container mx-auto px-6">
                <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-600 mb-6">By accessing and using Ghost Kitchen's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">2. User Accounts</h2>
                        <p className="text-gray-600 mb-4">When you create an account with us (whether as a Customer or a Kitchen Admin), you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.</p>
                        <p className="text-gray-600 mb-6">You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">3. Orders, Kitchens, and Payments</h2>
                        <p className="text-gray-600 mb-4">All orders are placed directly with our registered Kitchen Partners. Ghost Kitchen acts as the platform facilitating this transaction. We reserve the right to refuse any order you place with us.</p>
                        <p className="text-gray-600 mb-6">Payment must be made at the time of ordering. All prices are subject to change without notice based on individual kitchen menu updates.</p>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">4. Cancellations and Refunds</h2>
                        <p className="text-gray-600 mb-4">Orders may be cancelled before the kitchen changes the status to 'Preparing'. Once preparation has begun, orders cannot be cancelled via the dashboard.</p>
                        <p className="text-gray-600 mb-6">Refunds will be processed for cancelled orders or in cases where food quality issues are reported and verified by the platform administrators.</p>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">5. User Conduct</h2>
                        <p className="text-gray-600 mb-4">You agree not to use the service to:</p>
                        <ul className="list-disc pl-6 text-gray-600 mb-6">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Place fraudulent or fake orders</li>
                            <li>Attempt to gain unauthorized access to the Admin Dashboard</li>
                            <li>Upload viruses or other malicious code</li>
                        </ul>

                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">6. Contact Information</h2>
                        <p className="text-gray-600 mb-4">If you have any questions about these Terms of Service, please contact our administrative team at:</p>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-2"><strong>Email:</strong> legal@ghostkitchen.com</p>
                            <p className="text-gray-600 mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                            <p className="text-gray-600"><strong>Address:</strong> 123 Food Street, Culinary District, Mumbai</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Terms;