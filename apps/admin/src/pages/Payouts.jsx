import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const PayoutRow = ({ request, isSelected, onSelect }) => (
    <tr className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
        <td className="px-8 py-5">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(request.id)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
            />
        </td>
        <td className="px-8 py-5">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white overflow-hidden shadow-sm">
                    <img src={request.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[#172b4d]">{request.userName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: {request.userId}</p>
                </div>
            </div>
        </td>
        <td className="px-8 py-5">
            <span className="text-sm font-black text-[#172b4d]">${request.amount}</span>
        </td>
        <td className="px-8 py-5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-lg">{request.methodIcon}</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-[#172b4d]">{request.method}</p>
                    <p className="text-[9px] text-slate-400 font-medium font-mono">{request.methodDetail}</p>
                </div>
            </div>
        </td>
        <td className="px-8 py-5 text-sm text-slate-500 font-medium">
            {request.date}
        </td>
        <td className="px-8 py-5">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${request.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    request.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                {request.status}
            </span>
        </td>
        <td className="px-8 py-5 text-right">
            {request.status === 'PENDING' ? (
                <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-lg font-bold">check</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-lg font-bold">close</span>
                    </button>
                </div>
            ) : (
                <button className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined font-bold">more_vert</span>
                </button>
            )}
        </td>
    </tr>
);

export default function Payouts() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeTab, setActiveTab] = useState("All");

    const requests = [
        { id: 1, userName: "Marcus Thorne", userId: "UL-992341", avatar: "https://i.pravatar.cc/150?u=Marcus", amount: "12,450.00", method: "USDT (ERC20)", methodIcon: "currency_bitcoin", methodDetail: "0x71C...39A1", date: "Oct 24, 2023 · 14:32", status: "PENDING" },
        { id: 2, userName: "Sarah Jenkins", userId: "UL-882103", avatar: "https://i.pravatar.cc/150?u=Sarah", amount: "3,200.00", method: "Bank Transfer", methodIcon: "account_balance", methodDetail: "Chase Bank · ****4521", date: "Oct 24, 2023 · 12:10", status: "PENDING" },
        { id: 3, userName: "David Chen", userId: "UL-771920", avatar: "https://i.pravatar.cc/150?u=David", amount: "8,900.00", method: "BTC", methodIcon: "currency_bitcoin", methodDetail: "1BvBM...72pC", date: "Oct 23, 2023 · 09:15", status: "APPROVED" },
        { id: 4, userName: "Elena Rodriguez", userId: "UL-125582", avatar: "https://i.pravatar.cc/150?u=Elena", amount: "550.00", method: "Bank Transfer", methodIcon: "account_balance", methodDetail: "Wells Fargo · ****8812", date: "Oct 24, 2023 · 08:45", status: "PENDING" },
    ];

    const toggleSelect = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selectedItems.length === requests.length) setSelectedItems([]);
        else setSelectedItems(requests.map(r => r.id));
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-display">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="p-8 lg:p-12 space-y-10 overflow-y-auto">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                <span>Home</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                <span>Finance</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                <span className="text-primary font-black">Payout Requests</span>
                            </div>
                            <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Payout & Wallet Administration</h2>
                            <p className="text-lg text-slate-500 font-medium">Manage withdrawal requests and monitor platform liquidity.</p>
                        </div>

                        <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group">
                            <span className="material-symbols-outlined font-bold group-hover:rotate-12 transition-transform">account_balance_wallet</span>
                            <span>Batch Process All</span>
                        </button>
                    </div>

                    {/* Stats Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col justify-center h-full">
                                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pending Withdrawal Amount</h5>
                                <div className="flex items-end gap-4">
                                    <div className="text-6xl font-black text-[#172b4d] tracking-tighter">$124,500.00</div>
                                    <div className="mb-2 flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        <span>+12.5%</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 mt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                                        <p className="text-xs font-bold text-[#172b4d]">42 Requests Pending</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                                        <p className="text-xs font-bold text-slate-400">Last update: 5 mins ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 text-slate-50 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-700">
                                <span className="material-symbols-outlined text-[200px] leading-none">payments</span>
                            </div>
                        </div>

                        <div className="bg-primary p-10 rounded-[2.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h5 className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-6">Settled Last 24h</h5>
                                <div className="text-5xl font-black text-white mb-8 tracking-tight">$45,210.32</div>

                                <div className="space-y-3">
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-3/4 rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">75% of daily target reached</p>
                                </div>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl w-fit">
                                {["All", "Pending", "Completed"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2.5 rounded-[0.9rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 uppercase tracking-widest transition-all">
                                    <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                                    <span>Filters</span>
                                </button>
                                <div className="w-px h-8 bg-slate-100 mx-2"></div>
                                <button className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-all">Export CSV</button>
                                <button className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedItems.length > 0 ? 'bg-[#172b4d] text-white shadow-xl shadow-slate-200 cursor-pointer' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}>
                                    Process Batch ({selectedItems.length} selected)
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto mt-4 px-2 pb-2">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.length === requests.length}
                                                onChange={toggleAll}
                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">USER DETAILS</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AMOUNT</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">METHOD</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE REQUESTED</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {requests.map(req => (
                                        <PayoutRow
                                            key={req.id}
                                            request={req}
                                            isSelected={selectedItems.includes(req.id)}
                                            onSelect={toggleSelect}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-400">Showing 1 to 10 of 42 requests</p>
                            <div className="flex items-center gap-1.5">
                                <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Previous</button>
                                {[1, 2, 3, "...", 5].map((p, i) => (
                                    <button key={i} className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'}`}>
                                        {p}
                                    </button>
                                ))}
                                <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Next</button>
                            </div>
                        </div>
                    </div>

                    {/* Lower Info Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 flex gap-6 items-start group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary border border-blue-100 shrink-0 transform group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl font-bold">info</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-blue-900 mb-2">Liquidity Check Required</h4>
                                <p className="text-sm text-blue-800 leading-relaxed font-medium">Pending withdrawals are currently 12% higher than the last 7-day average. Ensure bank reserves are adequately funded before starting batch processing.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
                            <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shrink-0 transform group-hover:rotate-6 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-bold">history</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#172b4d] mb-1">Recent Audit Logs</h4>
                                    <p className="text-xs text-slate-400 font-bold">Batch processing completed for 25 requests.</p>
                                </div>
                            </div>
                            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View Logs</button>
                        </div>
                    </div>

                    {/* Bottom Disclaimer */}
                    <footer className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        <p>© 2023 Enterprise MLM Solutions. All financial operations are encrypted.</p>
                        <div className="flex gap-10">
                            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
                            <span className="hover:text-primary transition-colors cursor-pointer">Security Audit</span>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
