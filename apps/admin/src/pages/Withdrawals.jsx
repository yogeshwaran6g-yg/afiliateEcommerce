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
                    <p className="text-slate-500 font-semibold text-sm animate-pulse">Loading withdrawals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-bold">Withdrawals</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Withdrawals</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Review and authorize distributor payout requests.</p>
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

            {/* Tab & Search Control Bar */}
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 font-display">
                    {/* Segmented Tabs */}
                    <div className="bg-slate-50 p-1.5 rounded-[2.2rem] flex items-center overflow-x-auto no-scrollbar min-w-0">
                        {[
                            { label: 'All Payouts', value: 'All', count: withdrawals.length },
                            { label: 'Pending', value: 'Review Pending', count: withdrawals.filter(w => w.status === 'REVIEW_PENDING').length },
                            { label: 'Disbursed', value: 'Approved', count: withdrawals.filter(w => w.status === 'APPROVED').length },
                            { label: 'Voided', value: 'Rejected', count: withdrawals.filter(w => w.status === 'REJECTED').length }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveFilter(tab.value)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tab.value
                                    ? 'bg-white text-primary shadow-lg shadow-primary/10'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] ${activeFilter === tab.value ? 'bg-primary/10 text-primary' : 'bg-slate-200/50 text-slate-400'
                                    }`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Compact Search */}
                    <div className="relative flex-1 group max-w-md">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Find by distributor or phone..."
                            className="w-full bg-slate-50 border border-transparent rounded-[2rem] pl-14 pr-6 py-4 text-xs font-bold text-[#172b4d] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Withdrawals Table / Mobile Cards */}
            <div className={`bg-white rounded-[2.5rem] md:rounded-5xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500 ${filteredWithdrawals.length === 0 ? 'p-10' : ''}`}>
                {filteredWithdrawals.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 text-center py-20 px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                            <span className="material-symbols-outlined text-4xl font-light">account_balance</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No payout requests matching the criteria</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="block lg:hidden divide-y divide-slate-50">
                            {filteredWithdrawals.map((request, i) => {
                                const bank = typeof request.bank_details === 'string' ? JSON.parse(request.bank_details) : request.bank_details;
                                return (
                                    <div key={i} className="p-4 md:p-6 space-y-4 hover:bg-slate-50/30 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shrink-0 shadow-md">
                                                    {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-black text-[#172b4d] tracking-tight truncate">{request.user_name}</h4>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{request.user_phone}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-red-600 leading-none">₹{Number(request.amount).toLocaleString()}</div>
                                                <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest mt-1 ${request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {request.status.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 rounded-2xl p-3 space-y-2 border border-slate-100/50">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[14px] text-slate-400">account_balance</span>
                                                <p className="text-[10px] font-bold text-[#172b4d] uppercase truncate">{bank?.bank_name || 'N/A'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[14px] text-slate-400">tag</span>
                                                <p className="text-[9px] font-bold text-slate-500 font-mono tracking-widest truncate">{bank?.account_number || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {request.status === 'REVIEW_PENDING' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenActionModal(request, "APPROVE")}
                                                            className="px-3 py-2 bg-slate-900 text-white text-[9px] font-black rounded-lg active:scale-95 transition-all shadow-md shadow-slate-900/10 uppercase"
                                                        >
                                                            DISBURSE
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenActionModal(request, "REJECT")}
                                                            className="px-3 py-2 bg-red-50 text-red-600 text-[9px] font-black rounded-lg active:scale-95 transition-all uppercase"
                                                        >
                                                            VOID
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-slate-300">
                                                        <span className="material-symbols-outlined text-sm font-bold">
                                                            {request.status === 'APPROVED' ? 'verified_user' : 'cancel'}
                                                        </span>
                                                        <span className="text-[8px] font-black uppercase tracking-widest font-display">
                                                            {request.status === 'APPROVED' ? 'SETTLED' : 'VOIDED'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left min-w-[1100px]">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DISTRIBUTOR</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYOUT MAGNITUDE</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BANK PARAMETERS</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">REQUESTED ON</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTION</th>
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
                                                        {request.status === 'REVIEW_PENDING' ? (
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
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-300">
                                                                <span className="material-symbols-outlined text-lg">
                                                                    {request.status === 'APPROVED' ? 'check_circle' : 'cancel'}
                                                                </span>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                                                    {request.status === 'APPROVED' ? 'FINALIZED' : 'VOIDED'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
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
