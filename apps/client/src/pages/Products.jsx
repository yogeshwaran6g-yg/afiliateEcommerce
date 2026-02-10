import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Products() {
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const products = [
        {
            id: 1,
            name: "Ultra-Vite Daily...",
            category: "WELLNESS",
            price: 45.00,
            pv: 40,
            commission: 15,
            badge: "IN STOCK",
            badgeColor: "bg-green-100 text-green-700",
            image: "bg-gradient-to-br from-green-200 to-green-400"
        },
        {
            id: 2,
            name: "Luxe Glow Night...",
            category: "BEAUTY",
            price: 89.99,
            pv: 75,
            commission: 20,
            badge: "HOT ITEM",
            badgeColor: "bg-orange-100 text-orange-700",
            image: "bg-gradient-to-br from-orange-200 to-orange-400"
        },
        {
            id: 3,
            name: "Mastering Direct Sal...",
            category: "DIGITAL",
            price: 149.00,
            pv: 120,
            commission: 30,
            badge: "DIGITAL COURSE",
            badgeColor: "bg-teal-100 text-teal-700",
            image: "bg-gradient-to-br from-teal-400 to-teal-600"
        },
        {
            id: 4,
            name: "Smart Hydration...",
            category: "WELLNESS",
            price: 32.50,
            pv: 15,
            commission: 10,
            badge: "LIMITED",
            badgeColor: "bg-red-100 text-red-700",
            image: "bg-gradient-to-br from-amber-200 to-amber-400"
        },
        {
            id: 5,
            name: "Essential Oils Relax...",
            category: "WELLNESS",
            price: 55.00,
            pv: 45,
            commission: 18,
            badge: null,
            image: "bg-gradient-to-br from-amber-300 to-amber-500"
        },
        {
            id: 6,
            name: "Satin Velvet Lipstick...",
            category: "BEAUTY",
            price: 24.00,
            pv: 12,
            commission: 12,
            badge: null,
            image: "bg-gradient-to-br from-rose-300 to-rose-500"
        },
        {
            id: 7,
            name: "Monthly Pro...",
            category: "DIGITAL",
            price: 19.99,
            pv: 10,
            commission: 5,
            badge: null,
            image: "bg-gradient-to-br from-slate-200 to-slate-300"
        },
        {
            id: 8,
            name: "Age-Defying Serum...",
            category: "BEAUTY",
            price: 120.00,
            pv: 100,
            commission: 25,
            badge: "NEW",
            badgeColor: "bg-slate-100 text-slate-700",
            image: "bg-gradient-to-br from-amber-600 to-amber-800"
        }
    ];

    const categories = [
        { name: "Wellness", count: 12, icon: "spa" },
        { name: "Beauty", count: 8, icon: "face_retouching_natural" },
        { name: "Digital", count: 5, icon: "laptop_mac" }
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <Header toggleSidebar={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 md:mb-6">
                        <a href="/" className="hover:text-primary">Home</a>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-slate-900 font-medium">Shop</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Products & Shop</h1>
                            <p className="text-sm md:text-base text-slate-500">
                                Empowering your business with high-quality inventory and great PV points.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <span className="material-symbols-outlined text-slate-600">grid_view</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <span className="material-symbols-outlined text-slate-600">view_list</span>
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 md:px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="pv">Highest PV</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                            >
                                {/* Product Image */}
                                <div className={`aspect-square ${product.image} relative p-6 flex items-center justify-center`}>
                                    {product.badge && (
                                        <div className="absolute top-4 left-4">
                                            <span className={`${product.badgeColor} px-3 py-1 rounded-full text-[10px] font-bold uppercase`}>
                                                {product.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                        {product.category}
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-3">{product.name}</h3>
                                    <div className="text-2xl font-bold text-slate-900 mb-3">${product.price.toFixed(2)}</div>

                                    {/* PV and Commission */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className="font-semibold text-slate-600">{product.pv} PV</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className="font-semibold text-orange-600">{product.commission}% COMM</span>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 mt-auto py-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
                        <div className="text-center md:text-left">© 2024 Fintech MLM Dashboard. All rights reserved.</div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <a href="#" className="hover:text-primary">Privacy Policy</a>
                            <a href="#" className="hover:text-primary">Terms of Service</a>
                            <a href="#" className="hover:text-primary">Help Center</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div >
    );
}
