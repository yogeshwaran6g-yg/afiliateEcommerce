import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Checkout() {
    const [selectedAddress, setSelectedAddress] = useState("main");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [useWallet, setUseWallet] = useState(true);

    const walletBalance = 1450.00;
    const subtotal = 628.00;
    const shippingFee = 0;
    const tax = 12.56;
    const walletCredit = useWallet ? -150.00 : 0;
    const total = subtotal + shippingFee + tax + walletCredit;

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Progress Steps */}
            <div className="bg-white border-b border-slate-200 py-6 md:py-8 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
                <div className="max-w-3xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-10"></div>
                        <div className="absolute top-5 left-0 w-2/3 h-1 bg-primary -z-10"></div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                <span className="material-symbols-outlined text-base md:text-lg">check</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">Cart</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                <span className="material-symbols-outlined text-base md:text-lg">check</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">Shipping</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                <span className="material-symbols-outlined text-base md:text-lg">credit_card</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-primary uppercase">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Page Title */}
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
                        <p className="text-sm md:text-base text-slate-500">Complete your transaction by selecting an address and payment method.</p>
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
                                <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Main Residence</h3>
                                <p className="text-xs md:text-sm text-slate-500">123 Business Parkway, Suite 100</p>
                                <p className="text-xs md:text-sm text-slate-500">Manhattan, New York, 10001</p>
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
                                <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Regional Office</h3>
                                <p className="text-xs md:text-sm text-slate-500">456 Enterprise Drive</p>
                                <p className="text-xs md:text-sm text-slate-500">Austin, Texas, 73301</p>
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
                                    <h3 className="font-bold text-slate-900 text-sm md:text-base">Use Wallet Balance</h3>
                                    <p className="text-[10px] md:text-sm text-slate-500">Current Balance: <span className="text-emerald-600 font-semibold">${walletBalance.toFixed(2)}</span></p>
                                </div>
                            </div>
                            <button
                                onClick={() => setUseWallet(!useWallet)}
                                className={`relative w-10 md:w-12 h-5 md:h-6 rounded-full transition-colors ${useWallet ? "bg-primary" : "bg-slate-300"
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-4 md:w-5 h-4 md:h-5 bg-white rounded-full transition-transform ${useWallet ? "translate-x-5 md:translate-x-6" : "translate-x-0.5"
                                    }`}></div>
                            </button>
                        </div>

                        {/* Payment Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {[
                                { id: "card", icon: "credit_card", label: "Card" },
                                { id: "bank", icon: "account_balance", label: "Bank" },
                                { id: "crypto", icon: "currency_bitcoin", label: "Crypto" }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setPaymentMethod(opt.id)}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === opt.id
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-2xl ${paymentMethod === opt.id ? "text-primary" : "text-slate-400"}`}>{opt.icon}</span>
                                    <span className="text-xs md:text-sm font-semibold text-slate-900">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Card Details Form */}
                        {paymentMethod === "card" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Johnathan Doe"
                                        className="w-full px-4 py-2.5 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="**** **** **** 4421"
                                            className="w-full px-4 py-2.5 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-2.5 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="***"
                                                className="w-full px-4 py-2.5 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                        {/* Products */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                            {[
                                { name: "Distributor Kit", price: "$499.00" },
                                { name: "Marketing Suite", price: "$129.00" }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">{item.name}</span>
                                    <span className="font-bold text-slate-900">{item.price}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Shipping</span>
                                <span className="font-semibold text-emerald-600 uppercase">Free</span>
                            </div>
                            {useWallet && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-primary font-medium">Wallet Reward</span>
                                    <span className="font-semibold text-primary">-${Math.abs(walletCredit).toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
                        </div>

                        {/* Place Order Button */}
                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-4 text-sm md:text-base">
                            <span className="material-symbols-outlined">lock</span>
                            Complete Purchase
                        </button>

                        {/* Support */}
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-[10px] md:text-xs text-slate-500">
                                Need help? Call <span className="text-primary font-bold">1-800-FINTECH</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
