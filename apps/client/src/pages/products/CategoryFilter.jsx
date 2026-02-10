import React from "react";

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
    return (
        <div className="lg:w-64 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:block">Categories</div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {/* All Categories Button */}
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all whitespace-nowrap lg:w-full ${activeCategory === null
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-slate-200 lg:border-0 hover:bg-slate-50 text-slate-600"
                        }`}
                >
                    <span className="material-symbols-outlined text-xl">grid_view</span>
                    <span className="text-sm font-medium">All Products</span>
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all whitespace-nowrap lg:w-full ${activeCategory === cat.id
                                ? "bg-primary text-white border-primary"
                                : "bg-white border-slate-200 lg:border-0 hover:bg-slate-50 text-slate-600"
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {cat.icon || "category"}
                        </span>
                        <span className="text-sm font-medium">{cat.name}</span>
                        {cat.count !== undefined && (
                            <span className="hidden lg:block ml-auto text-xs font-bold opacity-60">
                                {cat.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
