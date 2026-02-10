import React from "react";
import { useCart } from "../../hooks/useCart";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    // Handle images safely (could be JSON string or array)
    let images = [];
    try {
        images = typeof product.images === 'string'
            ? JSON.parse(product.images)
            : (product.images || []);
    } catch (e) {
        images = [];
    }

    const firstImage = images.length > 0 ? images[0] : null;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
            {/* Product Image */}
            <div className="aspect-square relative p-6 flex items-center justify-center shrink-0 bg-slate-50">
                {firstImage ? (
                    <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${firstImage}`}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
                    </div>
                )}

                {product.stock_status === 'OUT_OF_STOCK' && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                    {product.category_name || "Uncategorized"}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm md:text-base line-clamp-1">{product.name}</h3>
                <div className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                    ${parseFloat(product.sale_price).toFixed(2)}
                </div>

                {/* PV and Commission (Defaults if missing from DB) */}
                <div className="flex items-center gap-3 mb-4 mt-auto">
                    <div className="flex items-center gap-1 text-[10px] md:text-xs">
                        <span className="font-bold text-slate-600">{product.pv || 0} PV</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs">
                        <span className="font-bold text-orange-600">{product.commission || 0}% COMM</span>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    disabled={product.stock_status === 'OUT_OF_STOCK'}
                    onClick={() => addToCart(product)}
                    className={`w-full font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm ${product.stock_status === 'OUT_OF_STOCK'
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
