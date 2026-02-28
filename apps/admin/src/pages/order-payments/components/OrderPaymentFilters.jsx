import React from "react";

export default function OrderPaymentFilters({ searchTerm, setSearchTerm, activeFilter, setActiveFilter, counts = {} }) {
    const filters = [
        { label: "All", count: counts.ALL || 0 },
        { label: "Pending", count: counts.PENDING || 0 },
        { label: "Approved", count: counts.APPROVED || 0 },
        { label: "Rejected", count: counts.REJECTED || 0 },
    ];

    return (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {filters.map((f) => (
                    <button
                        key={f.label}
                        onClick={() => setActiveFilter(f.label)}
                        className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
                            activeFilter === f.label
                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                    >
                        <span>{f.label}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] ${
                            activeFilter === f.label ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative group min-w-[320px]">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search Order #, User, Reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all duration-300 outline-none shadow-inner"
                />
            </div>
        </div>
    );
}
