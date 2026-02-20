import React from "react";
import { useCart } from "../../hooks/useCart";

export default function ProductCard({ product, viewMode = 'grid' }) {
    const { addToCart } = useCart();
    const fallback = "https://lh3.googleusercontent.com/aida-public/AB6AXuBXStPgVjo_e1K5n-KuNNAVTw9TjpFH2zABBeKg1XiX7STgBS9Eq38RsVuanZMQnE-Cm-XR_gyWIHEcLYtr1VRDOw6RUn9pHJWzWTNFis_bVk5QS4KAHZCsU9EIVSAe3oIHrHiEGkGGSwHS8MVRFXFN0hyBcxI855jchrFw6zm4ot7qKq-NEuWqyw71MM15nPYmvfk_ptK13p7B9wsjH2TvnwPPYOgX8nX8B4XK3v0JdvuKJMsxCMX91Yw8A8IueA8SSSCaFEHTJGM"
    let images = [];
    try {
        images = typeof product.images === 'string'
            ? JSON.parse(product.images)
            : (product.images || []);
    } catch (e) {
        images = [];
    }

    const firstImage = images.length > 0 ? images[0] : null;

    const handleImageError = (e) => {
        if (e.target.src !== fallback) {
            e.target.src = fallback;
        }
    };

    const isList = viewMode === 'list';

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex ${isList ? 'flex-col sm:flex-row sm:h-64' : 'flex-col'}`}>
            {/* Product Image */}
            <div className={`${isList ? 'sm:w-64 w-full h-48 sm:h-full' : 'aspect-square'} relative flex items-center justify-center shrink-0 bg-slate-50 overflow-hidden`}>
                {firstImage ? (
                    <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${firstImage}`}
                        alt={product.name}
                        onError={handleImageError}
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
            <div className={`p-4 flex flex-col flex-1 ${isList ? 'sm:p-6' : ''}`}>
                <div className="flex flex-col gap-1 mb-2">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {product.category_name || "Uncategorized"}
                    </div>
                    <h3 className={`font-bold text-slate-900 line-clamp-2 ${isList ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                        {product.name}
                    </h3>
                </div>

                {isList && product.short_desc && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 hidden sm:block">
                        {product.short_desc}
                    </p>
                )}

                <div className={`flex ${isList ? 'flex-row items-end justify-between gap-4' : 'flex-col gap-4'} mt-auto`}>
                    <div className="flex flex-col gap-2">
                        <div className="text-lg md:text-xl font-bold text-slate-900">
                            ₹{parseFloat(product.sale_price).toFixed(2)}
                        </div>
                        {/* PV and Commission */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[10px] md:text-xs">
                                <span className="font-bold text-slate-600">{product.pv || 0} PV</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] md:text-xs">
                                <span className="font-bold text-orange-600">{product.commission || 0}% COMM</span>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        disabled={product.stock_status === 'OUT_OF_STOCK'}
                        onClick={() => addToCart(product)}
                        className={`font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm ${isList ? 'w-auto' : 'w-full'} ${product.stock_status === 'OUT_OF_STOCK'
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-primary hover:bg-primary/90 text-white"
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                        <span className={isList ? 'hidden md:inline' : ''}>Add to Cart</span>
                        {isList && <span className="md:hidden">Add</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
