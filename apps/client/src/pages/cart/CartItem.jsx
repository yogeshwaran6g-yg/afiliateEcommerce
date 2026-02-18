import React from "react";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    return (
        <div className="p-4 md:p-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:px-6 md:py-6 items-center">
                {/* Product */}
                <div className="md:col-span-5 flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBXStPgVjo_e1K5n-KuNNAVTw9TjpFH2zABBeKg1XiX7STgBS9Eq38RsVuanZMQnE-Cm-XR_gyWIHEcLYtr1VRDOw6RUn9pHJWzWTNFis_bVk5QS4KAHZCsU9EIVSAe3oIHrHiEGkGGSwHS8MVRFXFN0hyBcxI855jchrFw6zm4ot7qKq-NEuWqyw71MM15nPYmvfk_ptK13p7B9wsjH2TvnwPPYOgX8nX8B4XK3v0JdvuKJMsxCMX91Yw8A8IueA8SSSCaFEHTJGM";
                                }}
                            />
                        ) : (
                            <span className="material-symbols-outlined text-slate-300">inventory_2</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">{item.name}</h3>
                        {item.sku && <p className="text-xs text-slate-500">SKU: {item.sku}</p>}
                    </div>
                </div>

                {/* Price - Mobile layout adjustment */}
                <div className="md:col-span-2 flex md:block justify-between items-center text-sm">
                    <span className="md:hidden text-slate-500">Price:</span>
                    <span className="text-slate-700 font-semibold">₹{item.price.toFixed(2)}</span>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2 flex md:block justify-between items-center text-sm">
                    <span className="md:hidden text-slate-500">Quantity:</span>
                    <div className="flex items-center gap-2 border border-slate-300 rounded-lg w-fit bg-white">
                        <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 md:px-3 py-1 hover:bg-slate-50 text-slate-600"
                        >
                            −
                        </button>
                        <span className="px-1 md:px-2 font-semibold text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 md:px-3 py-1 hover:bg-slate-50 text-slate-600"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Total Price */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                    <div className="md:hidden text-slate-900 font-bold">Total:</div>
                    <span className="font-bold text-slate-900 text-base md:text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center justify-end">
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
