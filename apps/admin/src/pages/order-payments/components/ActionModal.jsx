import React from "react";

export default function ActionModal({ isOpen, onClose, actionType, selectedPayment, adminComment, setAdminComment, handleAction, actionLoading }) {
    if (!isOpen) return null;

    const isApprove = actionType === "APPROVE";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative max-w-lg w-full bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isApprove ? 'bg-emerald-50 text-emerald-500 shadow-emerald-100' : 'bg-rose-50 text-rose-500 shadow-rose-100'}`}>
                            <span className="material-symbols-outlined text-3xl font-black">
                                {isApprove ? 'verified_user' : 'report_off'}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                {isApprove ? 'Approve Payment' : 'Reject Payment'}
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Order #{selectedPayment?.order_number}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <span className={`material-symbols-outlined font-black ${isApprove ? 'text-emerald-500' : 'text-rose-500'}`}>info</span>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                {isApprove 
                                    ? `This will confirm the manual payment of ₹${parseFloat(selectedPayment?.total_amount).toLocaleString()} and mark the order as PAID.` 
                                    : `This will reject the payment and the user will be notified of the failure.`
                                }
                            </p>
                            <p className="text-xs text-slate-400 font-medium italic">This action will update the system ledger and cannot be easily undone.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Internal Admin Comment</label>
                        <textarea
                            placeholder={isApprove ? "Add optional confirmation notes..." : "Provide a reason for rejection (required)..."}
                            className={`w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-8 transition-all min-h-[120px] outline-none ${isApprove ? 'focus:ring-emerald-500/5 focus:border-emerald-500/20' : 'focus:ring-rose-500/5 focus:border-rose-500/20'}`}
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleAction}
                        disabled={actionLoading || (!isApprove && !adminComment.trim())}
                        className={`flex-2 py-5 px-10 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 ${isApprove ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'}`}
                    >
                        {actionLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">{isApprove ? 'done_all' : 'report'}</span>
                                <span>{isApprove ? 'Confirm Approval' : 'Confirm Rejection'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
