import React from 'react';

const PrivacyTerms = () => {
    return (
        <div className="bg-[#f8fafc] min-h-screen">
            <div className="px-4 md:px-8 py-8 md:py-12 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                    <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 font-medium">Privacy & Terms</span>
                </div>

                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden crystal-shadow">
                        <div className="p-8 md:p-12 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/50">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                Last updated: February 20, 2024
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                Privacy Policy & <br />
                                <span className="text-primary">Terms and Conditions</span>
                            </h1>
                            <p className="text-slate-500 mt-6 text-lg max-w-2xl leading-relaxed">
                                We value your privacy and are committed to protecting your personal data.
                                This document outlines our practices and your rights.
                            </p>
                        </div>
                       
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden crystal-shadow p-8 md:p-12 space-y-16">
                        {/* Privacy Policy Section */}
                        <section id="privacy">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">shield_person</span>
                                </span>
                                Privacy Policy
                            </h2>
                            <div className="space-y-10 text-slate-600 leading-relaxed">
                                <p className="text-lg text-slate-500 italic border-l-4 border-blue-500 pl-6 py-1">
                                    At Affiliate Ecommerce, we take your privacy seriously. This policy describes how we collect, use, and handle your data.
                                </p>

                                <div id="data-collection" className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="text-primary">1.</span> Data Collection
                                    </h3>
                                    <p className="text-slate-600">We collect information you provide directly to us when you create an account, verify your identity (KYC), and use our platform. This includes:</p>
                                    <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {['Legal Name', 'Email Address', 'Phone Number', 'Identity Documents'].map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div id="use-of-info">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="text-primary">2.</span> Use of Information
                                    </h3>
                                    <p>We use your information to provide our services, process transactions, verify identities, and communicate with you about your account and our platform updates. This data helps us improve user experience and maintain network security.</p>
                                </div>

                                <div id="security">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="text-primary">3.</span> Security
                                    </h3>
                                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                        <span className="material-symbols-outlined text-blue-600 text-3xl shrink-0">security</span>
                                        <p className="text-sm text-blue-800">
                                            We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our systems are monitored 24/7 for potential threats.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-slate-100"></div>

                        {/* Terms and Conditions Section */}
                        <section id="terms">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">contract_edit</span>
                                </span>
                                Terms and Conditions
                            </h2>
                            <div className="space-y-10 text-slate-600 leading-relaxed">
                                <p className="text-lg text-slate-500 italic border-l-4 border-purple-500 pl-6 py-1">
                                    By using our platform, you agree to comply with and be bound by the following terms and conditions.
                                </p>

                                <div id="eligibility">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="text-purple-600">1.</span> Account Eligibility
                                    </h3>
                                    <p>Users must be at least 18 years old and provide accurate, complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
                                </div>

                                <div id="usage">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="text-purple-600">2.</span> Platform Usage
                                    </h3>
                                    <p>Our platform must be used in accordance with all applicable laws. Any fraudulent activity, spamming, or abuse of the system will result in immediate account termination and potential legal action.</p>
                                </div>

                                <div id="payments">
                                    <div className="bg-purple-50/30 p-8 rounded-3xl border border-purple-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <span className="text-purple-600">3.</span> Payments & Commissions
                                        </h3>
                                        <p className="mb-4">Commissions are calculated based on the program rules at the time of the transaction. Withdrawals are subject to:</p>
                                        <div className="space-y-3">
                                            {[
                                                'Identity verification (KYC) completion',
                                                'Platform processing times (typically 3-5 business days)',
                                                'Minimum withdrawal threshold requirements'
                                            ].map((rule) => (
                                                <div key={rule} className="flex gap-3 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0"></span>
                                                    {rule}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div id="termination">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="text-purple-600">4.</span> Termination
                                    </h3>
                                    <p>We reserve the right to suspend or terminate accounts that violate our terms or engage in harmful activities to the platform or its users without prior notice.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Contact Footer */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 text-center crystal-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full"></div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Have questions about our terms?</h2>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                            Our support team is here to help you understand how we protect your information and what your responsibilities are.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="mailto:support@affiliate.com" className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
                                Contact Support
                            </a>
                            <button className="px-8 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-all">
                                Help Center
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-400 text-xs">
                    &copy; 2024 Affiliate Ecommerce Platform. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default PrivacyTerms;
