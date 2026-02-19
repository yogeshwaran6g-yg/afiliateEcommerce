import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [openDropdown, setOpenDropdown] = useState(location.pathname.includes('recharges') || location.pathname.includes('withdrawals') || location.pathname.includes('transactions') || location.pathname.includes('wallet-transactions') ? 'Transactions' : null);

    const sections = [
        {
            title: "Core",
            items: [
                { icon: "dashboard", label: "Dashboard", path: "/" },
                { icon: "inventory_2", label: "Products", path: "/products" },
                { icon: "campaign", label: "Announcements", path: "/announcements" },
                { icon: "person_search", label: "User Management", path: "/users" },
                { icon: "confirmation_number", label: "Tickets", path: "/tickets" },
                { icon: "mail", label: "User Notifications", path: "/user-notifications" },
                { icon: "verified_user", label: "KYC Verification", path: "/kyc" },
                { icon: "account_tree", label: "Tree View", path: "/genealogy" },
            ]
        },
        {
            title: "Finance",
            items: [
                { icon: "settings_suggest", label: "Commission Config", path: "/settings/commission" },
                { icon: "payments", label: "Commissions", path: "/payouts" },
                {
                    icon: "swap_horiz",
                    label: "Transactions",
                    subItems: [
                        { label: "Record History", path: "/transactions" },
                        { label: "Wallet Transactions", path: "/wallet-transactions" },
                        { label: "Recharges", path: "/recharges" },
                        { label: "Withdrawals", path: "/withdrawals" },
                    ]
                },
                { icon: "analytics", label: "Reports", path: "/reports" },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;
    const isDropdownActive = (subItems) => subItems.some(item => isActive(item.path));

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0b101b] text-slate-400 border-r border-white/5 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isCollapsed ? "w-20" : "w-64"} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

            {/* Logo & Close Button */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleCollapse}
                        className="hidden md:flex p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <span className="material-symbols-outlined font-bold text-[22px]">
                            {isCollapsed ? 'menu_open' : 'menu'}
                        </span>
                    </button>

                    <Link to="/" className={`flex items-center gap-3 group/logo active:scale-95 transition-transform ${isCollapsed ? 'scale-0 w-0 h-0 overflow-hidden' : 'opacity-100'}`} onClick={onClose}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 group-hover/logo:scale-110 transition-transform shrink-0">
                            <span className="material-symbols-outlined text-2xl font-bold">analytics</span>
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-white text-lg tracking-tight leading-none group-hover/logo:text-primary transition-colors truncate">MLM Admin</div>
                            <div className="text-[10px] text-[#42526e] font-semibold tracking-wider mt-1 truncate">Enterprise</div>
                        </div>
                    </Link>
                </div>

                <button
                    onClick={onClose}
                    className="md:hidden text-slate-500 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined font-bold">close</span>
                </button>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto no-scrollbar">

                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        {!isCollapsed && (
                            <div className="px-4 text-[11px] font-semibold text-[#42526e] tracking-wide animate-in fade-in duration-300">
                                {section.title}
                            </div>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item, i) => {
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isExpanded = openDropdown === item.label && !isCollapsed;
                                const active = hasSubItems ? isDropdownActive(item.subItems) : isActive(item.path);

                                return (
                                    <div key={i} className="space-y-1">
                                        {hasSubItems ? (
                                            <>
                                                <button
                                                    onClick={() => !isCollapsed && toggleDropdown(item.label)}
                                                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${active && !isExpanded ? "bg-primary/10 text-primary" : "hover:bg-white/5 hover:text-white"}`}
                                                    title={isCollapsed ? item.label : ""}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`material-symbols-outlined text-[20px] ${active ? "text-primary" : "text-[#42526e] group-hover:text-primary"}`}>
                                                            {item.icon}
                                                        </span>
                                                        {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
                                                    </div>
                                                    {!isCollapsed && (
                                                        <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                                                            keyboard_arrow_down
                                                        </span>
                                                    )}
                                                </button>

                                                {isExpanded && (
                                                    <div className="mt-1 ml-4 pl-4 border-l border-white/5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                        {item.subItems.map((subItem, j) => (
                                                            <Link
                                                                key={j}
                                                                to={subItem.path}
                                                                onClick={onClose}
                                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isActive(subItem.path)
                                                                    ? "text-primary"
                                                                    : "text-[#42526e] hover:text-white"
                                                                    }`}
                                                            >
                                                                <span className={`w-1.5 h-1.5 rounded-full ${isActive(subItem.path) ? "bg-primary" : "bg-[#42526e]"}`}></span>
                                                                <span>{subItem.label}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                to={item.path}
                                                onClick={onClose}
                                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${active
                                                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                                                    : "hover:bg-white/5 hover:text-white"
                                                    }`}
                                                title={isCollapsed ? item.label : ""}
                                            >
                                                <span className={`material-symbols-outlined text-[20px] ${active ? "text-white" : "text-[#42526e] group-hover:text-primary"
                                                    }`}>
                                                    {item.icon}
                                                </span>
                                                {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Profile Footer */}
            <div className={`p-6 border-t border-white/5 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-6'}`}>
                <div className={`bg-white/5 rounded-2xl p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border border-white/5 overflow-hidden`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 text-[10px] font-black text-primary">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        {!isCollapsed && (
                            <div className="truncate animate-in fade-in duration-300">
                                <div className="text-[11px] font-bold text-white leading-tight truncate">{user?.name || 'Admin User'}</div>
                                <div className="text-[9px] text-[#42526e] font-semibold uppercase tracking-wider">{user?.role || 'Admin'}</div>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={logout}
                            className="text-[#42526e] hover:text-red-400 transition-colors shrink-0 animate-in fade-in duration-300"
                            title="Logout Securely"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
