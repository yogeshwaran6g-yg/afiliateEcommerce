import React from "react";

const ProductHeader = ({ onAddProduct, onManageCategories, searchTerm, setSearchTerm }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-primary font-bold">Products</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Products</h2>
                <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Create and manage your enterprise product catalog.</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onManageCategories}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 text-sm font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 group leading-none"
                >
                    <span className="material-symbols-outlined font-bold text-primary">category</span>
                    <span>Categories</span>
                </button>
                <button
                    onClick={onAddProduct}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group leading-none"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
                    <span>Add New Product</span>
                </button>
            </div>
        </div>
    );
};

export default ProductHeader;
