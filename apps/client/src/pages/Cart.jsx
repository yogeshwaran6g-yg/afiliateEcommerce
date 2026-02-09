import React, { useState } from "react";

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Ultra Hydration Serum",
            sku: "MLM-99234",
            price: 99.00,
            quantity: 1,
            pv: 45,
            image: "bg-gradient-to-br from-amber-200 to-amber-400"
        },
        {
            id: 2,
            name: "Daily Multi-Vitamins",
            sku: "MLM-77112",
            price: 45.00,
            quantity: 2,
            pv: 20,
            image: "bg-gradient-to-br from-orange-300 to-orange-500"
        }
    ]);

    const updateQuantity = (id, delta) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 12.00;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    const totalPV = cartItems.reduce((sum, item) => sum + (item.pv * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl text-orange-500">widgets</span>
                            <span className="text-lg font-bold text-slate-900">MLM Pro Dashboard</span>
                        </div>
                        <div className="relative flex-1 max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="flex items-center gap-6">
                            <a href="/products" className="text-sm font-medium text-slate-600 hover:text-orange-500">Shop</a>
                            <a href="/orders" className="text-sm font-medium text-slate-600 hover:text-orange-500">Orders</a>
                            <a href="/network" className="text-sm font-medium text-slate-600 hover:text-orange-500">Network</a>
                            <a href="/wallet" className="text-sm font-medium text-slate-600 hover:text-orange-500">Wallet</a>
                        </nav>
                        <button className="p-2 hover:bg-slate-100 rounded-lg relative">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-slate-600">help</span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-orange-200">
                            U
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <a href="/" className="text-orange-600 hover:text-orange-700">Home</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-slate-900 font-medium">Shopping Cart</span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
                    <p className="text-orange-600">
                        Review your items and PV earnings before final checkout.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Price</div>
                                <div className="col-span-2">Quantity</div>
                                <div className="col-span-1">PV</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-slate-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-6 items-center">
                                        {/* Product */}
                                        <div className="col-span-5 flex items-center gap-4">
                                            <div className={`w-20 h-20 ${item.image} rounded-lg`}></div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                                <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2 text-slate-700 font-semibold">
                                            ${item.price.toFixed(2)}
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 border border-slate-300 rounded-lg w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-3 py-1 hover:bg-slate-50 text-slate-600"
                                                >
                                                    −
                                                </button>
                                                <span className="px-2 font-semibold text-slate-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-3 py-1 hover:bg-slate-50 text-slate-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* PV */}
                                        <div className="col-span-1">
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-orange-600">{item.pv * item.quantity}</div>
                                                <div className="text-xs text-orange-500">PV</div>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-2 flex items-center justify-end gap-4">
                                            <span className="font-bold text-slate-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-6">
                            <a
                                href="/products"
                                className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                Continue Shopping
                            </a>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal ({totalItems} items)</span>
                                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Estimated Shipping</span>
                                    <span className="font-semibold text-slate-900">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Tax (8%)</span>
                                    <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total PV */}
                            <div className="bg-orange-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-slate-700">Total PV Earned</span>
                                    <span className="text-2xl font-bold text-orange-600">{totalPV} PV</span>
                                </div>
                                <p className="text-xs text-orange-600 uppercase font-semibold tracking-wide">
                                    Applied to current qualification cycle
                                </p>
                            </div>

                            {/* Grand Total */}
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                                <span className="text-lg font-bold text-slate-900">Grand Total</span>
                                <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                            </div>

                            {/* Proceed Button */}
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-4">
                                Proceed to Payment
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>

                            {/* Security Info */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-3">
                                    <span className="material-symbols-outlined text-sm text-red-500">lock</span>
                                    <span>Secure 256-bit SSL Encrypted Payment</span>
                                </div>
                                <div className="flex items-center justify-center gap-3 opacity-50">
                                    <div className="w-8 h-6 bg-slate-200 rounded"></div>
                                    <div className="w-8 h-6 bg-slate-200 rounded"></div>
                                    <div className="w-8 h-6 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">copyright</span>
                        <span>2024 MLM Pro Platform. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-orange-500">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-500">Terms of Service</a>
                        <a href="#" className="hover:text-orange-500">Support Center</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
