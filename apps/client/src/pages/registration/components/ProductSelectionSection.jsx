import React from 'react';

export default function ProductSelectionSection({ products, selectedProduct, handleProductChange, errors, loading }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">2</div>
                <h2 className="text-2xl font-black text-slate-900">Choose Your Package</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/2 space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">inventory_2</span>
                        Select a Product
                    </label>
                    <select
                        className={`w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 ${errors.product ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-sm font-medium`}
                        onChange={handleProductChange}
                        value={selectedProduct?.id || ""}
                        disabled={loading}
                    >
                        <option value="" disabled>{loading ? "Loading Products..." : "--- Choose Your Package ---"}</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} - ₹{parseFloat(product.sale_price).toLocaleString()}
                            </option>
                        ))}
                    </select>
                    {errors.product && <p className="text-xs text-red-500 font-medium ml-1">{errors.product}</p>}
                </div>

                {selectedProduct && (
                    <div className="w-full md:w-1/2 flex items-center gap-4 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-5 rounded-2xl border-2 border-primary/20 shadow-lg animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="relative shrink-0">
                            {selectedProduct.image ? (
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                                    <span className="material-symbols-outlined text-3xl text-slate-400">image</span>
                                </div>
                            )}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-slate-900 text-base leading-tight mb-1 truncate">{selectedProduct.name}</h4>
                            <p className="text-slate-500 text-xs line-clamp-2 mb-2">{selectedProduct.description}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-primary font-black text-2xl">₹{parseFloat(selectedProduct.sale_price).toLocaleString()}</span>
                                <span className="text-[10px] bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md">Selected</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
