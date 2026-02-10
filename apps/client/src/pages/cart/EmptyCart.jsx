import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
    return (
        <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-slate-300">shopping_cart</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all">
                Start Shopping
            </Link>
        </div>
    );
}
