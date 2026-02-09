import React from "react";

export default function Header() {
    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-20">
            <div>
                <h1 className="text-xl font-bold text-[#172b4d] tracking-tight">Analytics Overview</h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative w-64 lg:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search accounts, txns..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    />
                </div>

                {/* Date Selector */}
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#172b4d] hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    <span>Last 30 Days</span>
                </button>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
                    </button>
                    <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
