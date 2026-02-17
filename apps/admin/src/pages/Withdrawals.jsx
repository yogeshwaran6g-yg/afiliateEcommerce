import React, { useState, useEffect } from "react";
import withdrawalApiService from "../services/withdrawalApiService";

export default function Withdrawals() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminComment, setAdminComment] = useState("");
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "APPROVE" or "REJECT"

    useEffect(() => {
        fetchWithdrawals();
    }, [activeFilter]);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const status = activeFilter === "All" ? null : activeFilter.toUpperCase().replace(" ", "_");
            const data = await withdrawalApiService.getWithdrawals(status);
            setWithdrawals(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load withdrawals");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenActionModal = (withdrawal, type) => {
        setSelectedWithdrawal(withdrawal);
        setActionType(type);
        setAdminComment("");
        setIsActionModalOpen(true);
    };

    const handleAction = async () => {
        if (!selectedWithdrawal) return;
        try {
            setActionLoading(true);
            if (actionType === "APPROVE") {
                await withdrawalApiService.approveWithdrawal(selectedWithdrawal.id, adminComment);
            } else {
                await withdrawalApiService.rejectWithdrawal(selectedWithdrawal.id, adminComment);
            }
            setIsActionModalOpen(false);
            fetchWithdrawals();
        } catch (err) {
            alert(err.message || `Failed to ${actionType.toLowerCase()} withdrawal`);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredWithdrawals = withdrawals.filter(w =>
        w.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.user_phone?.includes(searchTerm)
    );

    if (loading && withdrawals.length === 0) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processing Withdrawal Requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Finance</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">Withdrawal Requests</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#172b4d] tracking-tighter">Liquid Asset Outflow</h2>
                    <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl">Review and authorize distributor payout requests to ensure financial integrity.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Payouts", count: withdrawals.filter(w => w.status === 'REVIEW_PENDING').length, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Approved (Disbursed)", count: withdrawals.filter(w => w.status === 'APPROVED').length, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Rejected (Voided)", count: withdrawals.filter(w => w.status === 'REJECTED').length, color: "text-red-600", bg: "bg-red-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h4 className={`text-4xl font-black ${stat.color}`}>{stat.count}</h4>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                            <span className="material-symbols-outlined text-2xl font-bold">
                                {stat.label.includes("Pending") ? "payments" : stat.label.includes("Approved") ? "verified_user" : "gpp_bad"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 md:px-8 md:py-6 rounded-5xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="relative flex-1 group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search by user name or phone..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-4 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    {["All", "Review Pending", "Approved", "Rejected"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Withdrawals Table */}
            <div className="bg-white rounded-5xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1100px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DISTRIBUTOR</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYOUT MAGNITUDE</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BANK PARAMETERS</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">REQUESTED ON</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">AUTHORIZATION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredWithdrawals.map((request, i) => {
                                const bank = typeof request.bank_details === 'string' ? JSON.parse(request.bank_details) : request.bank_details;
                                return (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                                                    {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-black text-[#172b4d] tracking-tight truncate">{request.user_name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{request.user_phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-lg font-black text-red-600">₹{Number(request.amount).toLocaleString()}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400 leading-none">account_balance</span>
                                                    <p className="text-[11px] font-bold text-[#172b4d] truncate uppercase tracking-wider">{bank?.bank_name || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400 leading-none">tag</span>
                                                    <p className="text-[10px] font-medium text-slate-500 truncate tracking-widest font-mono uppercase">{bank?.account_number || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400 leading-none">vpn_key</span>
                                                    <p className="text-[10px] font-medium text-slate-400 truncate tracking-widest font-mono uppercase">IFSC: {bank?.ifsc || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-sm font-medium text-slate-500">
                                                {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {request.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                {request.status === 'REVIEW_PENDING' && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenActionModal(request, "APPROVE")}
                                                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                                                        >
                                                            DISBURSE
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenActionModal(request, "REJECT")}
                                                            className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black rounded-xl hover:bg-red-100 transition-all active:scale-95"
                                                        >
                                                            VOID
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredWithdrawals.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <span className="material-symbols-outlined text-7xl font-light">account_balance</span>
                                            <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">No payment outflow requests identified</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Modal (Approve/Reject) */}
            {isActionModalOpen && selectedWithdrawal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`text-3xl font-black tracking-tight ${actionType === 'APPROVE' ? 'text-green-600' : 'text-red-600'}`}>
                                        {actionType === 'APPROVE' ? 'Confirm Disbursement' : 'Void Outflow'}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref ID: WD-{selectedWithdrawal.id}</p>
                                </div>
                                <button onClick={() => setIsActionModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Outflow</label>
                                    <p className="text-2xl font-black text-[#172b4d]">₹{Number(selectedWithdrawal.amount).toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</label>
                                    <p className="text-sm font-bold text-[#172b4d]">{selectedWithdrawal.user_name}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reviewer's Log</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                                    rows={4}
                                    placeholder={actionType === 'APPROVE' ? "Transfer executed via IMPS..." : "Inconsistent bank parameters detected..."}
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 text-sm font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAction}
                                    disabled={actionLoading}
                                    className={`flex-2 px-8 py-4 text-white text-sm font-black rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 ${actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                        }`}
                                >
                                    {actionLoading ? 'Executing...' : (actionType === 'APPROVE' ? 'AUTHORIZE PAYOUT' : 'VOID REQUEST')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
