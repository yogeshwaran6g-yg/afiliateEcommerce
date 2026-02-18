import React from "react";
import { Link } from "react-router-dom";

export default function CartSummary({ subtotal, shipping, tax, total, totalItems, taxRate }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

            {/* Price Breakdown */}
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Estimated Shipping</span>
                    <span className="font-bold text-slate-900">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Tax ({taxRate * 100}%)</span>
                    <span className="font-bold text-slate-900">₹{tax.toFixed(2)}</span>
                </div>
            </div>

            
            

            {/* Grand Total */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-slate-900">Grand Total</span>
                <span className="text-3xl font-black text-slate-900">₹{total.toFixed(2)}</span>
            </div>

            {/* Proceed Button */}
            <Link
                to="/checkout"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-6 shadow-lg shadow-primary/20"
            >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
            </Link>

            {/* Security Info */}
            <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    <span className="material-symbols-outlined text-lg text-emerald-500">verified_user</span>
                    <span>Secure Checkout</span>
                </div>                
            </div>
        </div>
    );
}
