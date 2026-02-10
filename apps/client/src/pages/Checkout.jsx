import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Checkout() {
    const [selectedAddress, setSelectedAddress] = useState("main");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [useWallet, setUseWallet] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const walletBalance = 1450.00;
    const subtotal = 628.00;
    const shippingFee = 0;
    const tax = 12.56;
    const walletCredit = useWallet ? -150.00 : 0;
    const total = subtotal + shippingFee + tax + walletCredit;

    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navigation */}
                <Header toggleSidebar={() => setIsSidebarOpen(true)} />

                <div className="flex-1 overflow-y-auto">
                    {/* Progress Steps */}
                    <div className="bg-white border-b border-slate-200 py-6 md:py-8">
                        <div className="max-w-3xl mx-auto px-4 md:px-8">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-10"></div>
                                <div className="absolute top-5 left-0 w-2/3 h-1 bg-primary -z-10"></div>

                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                        <span className="material-symbols-outlined text-sm md:text-lg">check</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">Cart</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                        <span className="material-symbols-outlined text-sm md:text-lg">check</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">Shipping</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                        <span className="material-symbols-outlined text-sm md:text-lg">credit_card</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-primary uppercase">Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Checkout Form */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Page Title */}
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
                                    <p className="text-sm md:text-base text-slate-500">Complete your transaction securely.</p>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                            <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
                                        </div>
                                        <button className="text-primary text-sm font-semibold hover:underline">Add New</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setSelectedAddress("main")}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedAddress === "main"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="material-symbols-outlined text-slate-400">home</span>
                                                {selectedAddress === "main" && (
                                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-sm">check</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1">Main Residence</h3>
                                            <p className="text-xs text-slate-500 truncate">123 Business Parkway, Suite 100</p>
                                            <p className="text-xs text-slate-500">Manhattan, NY 10001</p>
                                        </button>

                                        <button
                                            onClick={() => setSelectedAddress("regional")}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedAddress === "regional"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="material-symbols-outlined text-slate-400">business</span>
                                                {selectedAddress === "regional" && (
                                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-sm">check</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1">Regional Office</h3>
                                            <p className="text-xs text-slate-500 truncate">456 Enterprise Drive</p>
                                            <p className="text-xs text-slate-500">Austin, TX 73301</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-primary">credit_card</span>
                                        <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                                    </div>

                                    {/* Wallet Balance Toggle */}
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Use Wallet Balance</h3>
                                                <p className="text-xs text-slate-500">Balance: <span className="text-success font-semibold">${walletBalance.toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setUseWallet(!useWallet)}
                                            className={`relative w-10 h-5 md:w-12 md:h-6 rounded-full transition-colors ${useWallet ? "bg-primary" : "bg-slate-300"
                                                }`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-transform ${useWallet ? "translate-x-5 md:translate-x-6" : "translate-x-0.5"
                                                }`}></div>
                                        </button>
                                    </div>

                                    {/* Payment Options */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        <button
                                            onClick={() => setPaymentMethod("card")}
                                            className={`p-4 rounded-xl border-2 flex flex-row sm:flex-col items-center gap-3 transition-all ${paymentMethod === "card"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl text-primary">credit_card</span>
                                            <span className="text-sm font-semibold text-slate-900">Card</span>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod("bank")}
                                            className={`p-4 rounded-xl border-2 flex flex-row sm:flex-col items-center gap-3 transition-all ${paymentMethod === "bank"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl text-slate-400">account_balance</span>
                                            <span className="text-sm font-semibold text-slate-900">Bank</span>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod("crypto")}
                                            className={`p-4 rounded-xl border-2 flex flex-row sm:flex-col items-center gap-3 transition-all ${paymentMethod === "crypto"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl text-slate-400">currency_bitcoin</span>
                                            <span className="text-sm font-semibold text-slate-900">Crypto</span>
                                        </button>
                                    </div>

                                    {/* Card Details Form */}
                                    {paymentMethod === "card" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-2">Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Johnathan Doe"
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-2">Card Number</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                        credit_card
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="**** **** **** 4421"
                                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Expiry</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-2">CVV</label>
                                                    <input
                                                        type="text"
                                                        placeholder="***"
                                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8">
                                    <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

                                    {/* Products */}
                                    <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 text-xs">Premium Distributor Kit</h3>
                                                <p className="text-[10px] text-slate-500">Qty: 1</p>
                                            </div>
                                            <span className="font-bold text-slate-900 text-sm">$499.00</span>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 text-xs">Digital Marketing Suite</h3>
                                                <p className="text-[10px] text-slate-500">Qty: 1</p>
                                            </div>
                                            <span className="font-bold text-slate-900 text-sm">$129.00</span>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-600">Subtotal</span>
                                            <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-600">Shipping</span>
                                            <span className="font-semibold text-success">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-600">Tax</span>
                                            <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                                        </div>
                                        {useWallet && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-primary font-medium">Wallet Credit</span>
                                                <span className="font-semibold text-primary">-${Math.abs(walletCredit).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-base font-bold text-slate-900">Total</span>
                                        <span className="text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
                                    </div>

                                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                        Place Order
                                    </button>

                                    <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">verified_user</span>
                                            SSL
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">security</span>
                                            ADS
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">verified</span>
                                            VISA
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                            <div>© 2024 Fintech MLM. All rights reserved.</div>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-primary">Privacy</a>
                                <a href="#" className="hover:text-primary">Terms</a>
                                <a href="#" className="hover:text-primary">Support</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
