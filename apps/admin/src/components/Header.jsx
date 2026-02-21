import React from "react";
import { Link } from "react-router-dom";

export default function Header({ title = "Analytics Overview", onMenuClick }) {
    return (
        <header className="h-16 md:h-20 flex items-center justify-between px-3 md:px-8 bg-white border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-1.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0"
                >
                    <span className="material-symbols-outlined font-bold text-[22px]">menu</span>
                </button>
                <h1 className="text-sm md:text-xl font-semibold text-slate-800 truncate leading-tight">{title}</h1>

            </div>

            <div className="flex items-center gap-1.5 md:gap-6 shrink-0">
                {/* Search Bar - Hidden on mobile/tablet */}
                <div className="relative hidden lg:block w-64 xl:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search accounts, txns..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    />
                </div>

                {/* Date Selector - Compact on mobile */}
                <button className="flex items-center gap-2 px-2.5 md:px-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-[#172b4d] hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    <span className="hidden sm:inline">Last 30 Days</span>
                </button>

                {/* Icons */}
                <div className="flex items-center gap-0.5 md:gap-2">
                    <Link to="/notifications" className="relative p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
                        <span className="material-symbols-outlined text-[22px] md:text-2xl">notifications</span>
                        <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
                    </Link>
                    <button className="hidden sm:flex p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>
            </div>


        </header>
    );
}
