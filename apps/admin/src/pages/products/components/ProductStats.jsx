import React from "react";

const ProductStats = ({ totalProducts }) => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10 flex flex-col justify-center">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Total Active Products</h5>
                <div className="flex items-center gap-4">
                    <div className="text-3xl md:text-4xl font-black text-[#172b4d] tracking-tighter leading-tight">{totalProducts}</div>
                    <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-lg border border-green-100 h-fit mt-1">
                        <span className="material-symbols-outlined text-xs font-black">trending_up</span>
                        <span>Live</span>
                    </div>
                </div>
                <p className="text-[11px] text-slate-400 font-bold mt-3 leading-none tracking-wide">Syncing with global fulfillment centers...</p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 text-slate-50 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none">
                <span className="material-symbols-outlined text-[150px] md:text-[200px] leading-none select-none">inventory</span>
            </div>
        </div>
    );
};

export default ProductStats;
