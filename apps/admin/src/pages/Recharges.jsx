import React, { useState, useEffect } from "react";
import rechargeApiService from "../services/rechargeApiService";

export default function Recharges() {
    const [recharges, setRecharges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [selectedRecharge, setSelectedRecharge] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminComment, setAdminComment] = useState("");
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "APPROVE" or "REJECT"

    const IMAGE_BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        fetchRecharges();
    }, [activeFilter]);

    const fetchRecharges = async () => {
        try {
            setLoading(true);
            const status = activeFilter === "All" ? null : activeFilter.toUpperCase().replace(" ", "_");
            const data = await rechargeApiService.getRecharges(status);
            setRecharges(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load recharges");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenActionModal = (recharge, type) => {
        setSelectedRecharge(recharge);
        setActionType(type);
        setAdminComment("");
        setIsActionModalOpen(true);
    };

    const handleAction = async () => {
        if (!selectedRecharge) return;
        try {
            setActionLoading(true);
            if (actionType === "APPROVE") {
                await rechargeApiService.approveRecharge(selectedRecharge.id, adminComment);
            } else {
                await rechargeApiService.rejectRecharge(selectedRecharge.id, adminComment);
            }
            setIsActionModalOpen(false);
            fetchRecharges();
        } catch (err) {
            alert(err.message || `Failed to ${actionType.toLowerCase()} recharge`);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredRecharges = recharges.filter(r =>
        r.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user_phone?.includes(searchTerm) ||
        r.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && recharges.length === 0) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-semibold text-sm animate-pulse">Loading recharges...</p>
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
                        <span className="text-primary font-bold">Recharges</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Recharges</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Validate and approve distributor wallet recharges.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Review", count: recharges.filter(r => r.status === 'REVIEW_PENDING').length, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Approved (Total)", count: recharges.filter(r => r.status === 'APPROVED').length, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Rejected", count: recharges.filter(r => r.status === 'REJECTED').length, color: "text-red-600", bg: "bg-red-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h4 className={`text-4xl font-bold ${stat.color}`}>{stat.count}</h4>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                            <span className="material-symbols-outlined text-2xl font-bold">
                                {stat.label.includes("Pending") ? "pending_actions" : stat.label.includes("Approved") ? "check_circle" : "cancel"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab & Search Control Bar */}
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    {/* Segmented Tabs */}
                    <div className="bg-slate-50 p-1.5 rounded-[2.2rem] flex items-center overflow-x-auto no-scrollbar min-w-0">
                        {[
                            { label: 'All Requests', value: 'All', count: recharges.length },
                            { label: 'Pending', value: 'Review Pending', count: recharges.filter(r => r.status === 'REVIEW_PENDING').length },
                            { label: 'Authorized', value: 'Approved', count: recharges.filter(r => r.status === 'APPROVED').length },
                            { label: 'Voided', value: 'Rejected', count: recharges.filter(r => r.status === 'REJECTED').length }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveFilter(tab.value)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-[1.8rem] text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tab.value
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
                            placeholder="Find by distributor or reference..."
                            className="w-full bg-slate-50 border border-transparent rounded-[2rem] pl-14 pr-6 py-4 text-xs font-bold text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Recharges Table / Mobile Cards */}
            <div className={`bg-white rounded-[2.5rem] md:rounded-5xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500 ${filteredRecharges.length === 0 ? 'p-10' : ''}`}>
                {filteredRecharges.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 text-center py-20 px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                            <span className="material-symbols-outlined text-4xl font-light">account_balance_wallet</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No reconciliation requests found</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="block lg:hidden divide-y divide-slate-50">
                            {filteredRecharges.map((request, i) => (
                                <div key={i} className="p-4 md:p-6 space-y-4 hover:bg-slate-50/30 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm">
                                                {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-slate-800 tracking-tight truncate">{request.user_name}</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{request.user_phone}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-bold text-slate-800 leading-none">₹{Number(request.amount).toLocaleString()}</div>
                                            <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest mt-1 ${request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                request.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {request.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-2xl p-3 flex items-center justify-between border border-slate-100/50 gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-[#172b4d] truncate">{request.payment_method}</p>
                                            <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">REF: {request.payment_reference || 'N/A'}</p>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                                            {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            {request.proof_image && (
                                                <a
                                                    href={`${IMAGE_BASE_URL}${request.proof_image}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-lg active:scale-95 transition-all flex items-center gap-1.5"
                                                >
                                                    <span className="material-symbols-outlined text-sm">image</span>
                                                    <span>PROOF</span>
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {request.status === 'REVIEW_PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenActionModal(request, "APPROVE")}
                                                        className="px-3 py-2 bg-green-500 text-white text-[9px] font-bold rounded-lg active:scale-95 transition-all shadow-md shadow-green-500/10 uppercase"
                                                    >
                                                        APPROVE
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenActionModal(request, "REJECT")}
                                                        className="px-3 py-2 bg-red-50 text-red-600 text-[9px] font-bold rounded-lg active:scale-95 transition-all uppercase"
                                                    >
                                                        REJECT
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-300">
                                                    <span className="material-symbols-outlined text-sm font-bold">
                                                        {request.status === 'APPROVED' ? 'verified_user' : 'cancel'}
                                                    </span>
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">
                                                        {request.status === 'APPROVED' ? 'AUTHORIZED' : 'DENIED'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left min-w-[1100px]">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">DISTRIBUTOR</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AMOUNT</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">METHOD & REF</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SUBMITTED ON</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">STATUS</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">PROOF & ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRecharges.map((request, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                        {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-800 tracking-tight truncate">{request.user_name}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{request.user_phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="text-lg font-bold text-slate-800">₹{Number(request.amount).toLocaleString()}</div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-800">{request.payment_method}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">REF: {request.payment_reference || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-sm font-medium text-slate-500">
                                                    {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest ${request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {request.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    {request.proof_image && (
                                                        <a
                                                            href={`${IMAGE_BASE_URL}${request.proof_image}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all group/proof"
                                                        >
                                                            <span className="material-symbols-outlined text-xl group-hover/proof:scale-110">image</span>
                                                        </a>
                                                    )}
                                                    {request.status === 'REVIEW_PENDING' && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleOpenActionModal(request, "APPROVE")}
                                                                className="px-4 py-2 bg-green-500 text-white text-[10px] font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/10 active:scale-95"
                                                            >
                                                                APPROVE
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenActionModal(request, "REJECT")}
                                                                className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-bold rounded-xl hover:bg-red-100 transition-all active:scale-95"
                                                            >
                                                                REJECT
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Action Modal (Approve/Reject) */}
            {isActionModalOpen && selectedRecharge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`text-3xl font-bold tracking-tight ${actionType === 'APPROVE' ? 'text-green-600' : 'text-red-600'}`}>
                                        {actionType === 'APPROVE' ? 'Confirm Influx' : 'Deny Request'}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction Identity: RECH-{selectedRecharge.id}</p>
                                </div>
                                <button onClick={() => setIsActionModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Funding Magnitude</label>
                                    <p className="text-2xl font-bold text-slate-800">₹{Number(selectedRecharge.amount).toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Distributor</label>
                                    <p className="text-sm font-bold text-[#172b4d]">{selectedRecharge.user_name}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Commentary</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                                    rows={4}
                                    placeholder={actionType === 'APPROVE' ? "Verified payment against bank statement..." : "Incorrect reference number or blurred proof..."}
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 text-sm font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={handleAction}
                                    disabled={actionLoading}
                                    className={`flex-2 px-8 py-4 text-white text-sm font-bold rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 ${actionType === 'APPROVE' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                        }`}
                                >
                                    {actionLoading ? 'Finalizing...' : (actionType === 'APPROVE' ? 'AUTHORIZE FUNDING' : 'DENY FUNDING')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
