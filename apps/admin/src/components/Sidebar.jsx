import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const sections = [
        {
            title: "CORE",
            items: [
                { icon: "dashboard", label: "Dashboard", path: "/" },
                { icon: "inventory_2", label: "Product Catalog", path: "/products" },
                { icon: "person_search", label: "User Management", path: "/users" },
                { icon: "account_tree", label: "Tree View", path: "/genealogy" },
            ]
        },
        {
            title: "FINANCE",
            items: [
                { icon: "payments", label: "Commissions", path: "/payouts" },
                { icon: "receipt_long", label: "Transactions", path: "/transactions" },
                { icon: "analytics", label: "Reports", path: "/reports" },
            ]
        },
        {
            title: "SYSTEM",
            items: [
                { icon: "settings", label: "Configuration", path: "/settings/commission" },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-68 hidden md:flex flex-col bg-[#0b101b] text-slate-400 border-r border-white/5">
            {/* Logo */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-2xl font-bold">analytics</span>
                </div>
                <div>
                    <div className="font-bold text-white text-lg tracking-tight">MLM Admin</div>
                    <div className="text-[10px] text-[#42526e] font-bold uppercase tracking-widest leading-none">ENTERPRISE PANEL</div>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="px-4 text-[10px] font-bold text-[#42526e] uppercase tracking-[0.2em]">
                            {section.title}
                        </div>
                        <div className="space-y-1">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${isActive(item.path)
                                        ? "bg-primary text-white shadow-xl shadow-primary/20"
                                        : "hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${isActive(item.path) ? "text-white" : "text-[#42526e] group-hover:text-primary"
                                        }`}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Profile Footer */}
            <div className="p-6 border-t border-white/5">
                <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX_dj4KfY6NKcsjryLVAz302mj4ap8VZXGDmA847VctRCQyj5SuefFtzW0hnb1Cdgs9Enl7l70_ui1jrHWj_sHQbVOxhoP5-8IMCQ7YhkZJpZdhDRIRMiSbXTyu5aMODTEN7waowtGKb9UztPBdt2sRD4Hc7XzQRV0anhyY9qDS78D8Yu8LGSpObqn_iBmb2uYWvKhS6vpENUHMdorRAYZdAvw0BvNYBKAzflWEy95LHdPocZOu9pJ0wbfmFzRLyfKxxhfXcvyhQg" className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white leading-tight">Alex Thompson</div>
                            <div className="text-[10px] text-[#42526e] font-semibold">Super Admin</div>
                        </div>
                    </div>
                    <button className="text-[#42526e] hover:text-red-400 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
