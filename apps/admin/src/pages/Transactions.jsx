import React, { useState } from "react";

const TransactionRow = ({ tx }) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-8 py-5">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-100 text-green-600' :
                    tx.type === 'DEBIT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    } shadow-sm`}>
                    <span className="material-symbols-outlined text-lg font-bold">
                        {tx.type === 'CREDIT' ? 'south_east' : tx.type === 'DEBIT' ? 'north_west' : 'swap_horiz'}
                    </span>
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-[#172b4d] truncate">{tx.id}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{tx.category}</p>
                </div>
            </div>
        </td>
        <td className="px-8 py-5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={tx.userAvatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-[#172b4d] truncate">{tx.userName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{tx.userRole}</p>
                </div>
            </div>
        </td>
        <td className="px-8 py-5 text-sm text-slate-500 font-medium whitespace-nowrap">
            {tx.date}
        </td>
        <td className="px-8 py-5">
            <div className={`text-sm font-black ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-[#172b4d]'}`}>
                {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount}
            </div>
        </td>
        <td className="px-8 py-5">
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                tx.status === 'PROCESSING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                {tx.status}
            </span>
        </td>
        <td className="px-8 py-5 text-right">
            <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                <span className="material-symbols-outlined font-bold">visibility</span>
            </button>
        </td>
    </tr>
);

export default function Transactions() {
    const [activeFilter, setActiveFilter] = useState("All");

    const transactions = [
        { id: "TX-990231", category: "Sales Revenue", userName: "Marcus Thorne", userRole: "Distributor", userAvatar: "https://i.pravatar.cc/150?u=Marcus", date: "Oct 25, 2023 · 14:32", amount: "1,250.00", type: "CREDIT", status: "COMPLETED" },
        { id: "TX-990232", category: "User Payout", userName: "Sarah Jenkins", userRole: "Manager", userAvatar: "https://i.pravatar.cc/150?u=Sarah", date: "Oct 25, 2023 · 12:15", amount: "3,200.00", type: "DEBIT", status: "PROCESSING" },
        { id: "TX-990233", category: "Internal Transfer", userName: "Alexander Sterling", userRole: "Admin", userAvatar: "https://i.pravatar.cc/150?u=Alexander", date: "Oct 24, 2023 · 18:45", amount: "5,000.00", type: "TRANSFER", status: "COMPLETED" },
        { id: "TX-990234", category: "Unilevel Commission", userName: "Elena Rodriguez", userRole: "Distributor", userAvatar: "https://i.pravatar.cc/150?u=Elena", date: "Oct 24, 2023 · 09:22", amount: "450.00", type: "CREDIT", status: "COMPLETED" },
        { id: "TX-990235", category: "Performance Bonus", userName: "Marcus Thorne", userRole: "Distributor", userAvatar: "https://i.pravatar.cc/150?u=Marcus", date: "Oct 23, 2023 · 21:10", amount: "250.00", type: "CREDIT", status: "COMPLETED" },
    ];

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-bold">Transactions</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Transactions</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Monitoring real-time financial movements.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 text-sm font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined font-bold text-lg">download</span>
                        <span>Export CSV</span>
                    </button>
                    <button className="px-6 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all leading-none">
                        Audit All
                    </button>
                </div>
            </div>

            {/* Overall Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Gross Volume (24h)", value: "$45,210", trend: "+12%", icon: "account_balance" },
                    { label: "Admin Fees", value: "$3,450", trend: "+5%", icon: "toll" },
                    { label: "Network Payouts", value: "$18,900", trend: "-2%", icon: "volunteer_activism" },
                    { label: "Active Float", value: "$142,500", trend: "Stable", icon: "savings" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <span className="material-symbols-outlined font-bold">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-[#172b4d]">{stat.value}</span>
                                <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-slate-400'}`}>{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-50 gap-6">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                        <div className="flex items-center gap-1.5 min-w-max">
                            {["All", "Credit", "Debit", "Transfer"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group flex-1 md:flex-none">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-lg group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Search ID..."
                                className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-xl">tune</span>
                        </button>
                    </div>
                </div>

                <div className="p-0">
                    {/* Mobile Card View */}
                    <div className="block lg:hidden divide-y divide-slate-50">
                        {transactions
                            .filter(tx => activeFilter === "All" || tx.type.toUpperCase() === activeFilter.toUpperCase())
                            .map((tx, idx) => (
                                <div key={idx} className="p-4 md:p-6 space-y-4 hover:bg-slate-50/30 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tx.type === 'CREDIT' ? 'bg-green-100 text-green-600' :
                                                tx.type === 'DEBIT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                <span className="material-symbols-outlined text-lg font-bold">
                                                    {tx.type === 'CREDIT' ? 'south_east' : tx.type === 'DEBIT' ? 'north_west' : 'swap_horiz'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#172b4d] truncate">{tx.id}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{tx.category}</p>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-black text-right shrink-0 ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-[#172b4d]'}`}>
                                            {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                <img src={tx.userAvatar} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-600 truncate">{tx.userName}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            tx.status === 'PROCESSING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <p className="text-[9px] font-medium text-slate-400">{tx.date}</p>
                                        <button className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest hover:underline">
                                            Details
                                            <span className="material-symbols-outlined text-xs font-bold">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">TRANSACTION</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">INITIATOR</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">TIMESTAMPS</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AMOUNT</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">DETAILS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions
                                    .filter(tx => activeFilter === "All" || tx.type.toUpperCase() === activeFilter.toUpperCase())
                                    .map((tx, idx) => (
                                        <TransactionRow key={idx} tx={tx} />
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-6 md:p-8 flex items-center justify-between border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Viewing last 24 hours</p>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                        <span>Load Historical Data</span>
                        <span className="material-symbols-outlined text-sm">history</span>
                    </button>
                </div>
            </div>

            {/* Verification Footer */}
            <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <span className="material-symbols-outlined text-[120px]">encrypted</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black tracking-[0.2em] opacity-60">LEDGER INTEGRITY VERIFIED</span>
                        </div>
                        <h4 className="text-xl md:text-2xl font-black tracking-tight">Real-time Financial Audit Trail</h4>
                        <p className="text-white/50 text-xs md:text-sm font-medium max-w-xl">Every movement is logged with AES-256 encryption. The platform maintains a 1:1 asset ratio across all distributor wallets.</p>
                    </div>
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
                        Download Audit Report
                    </button>
                </div>
            </div>
        </div>
    );
}
