import React from 'react';

const ActionModal = ({ 
    isOpen, 
    onClose, 
    actionType, 
    selectedWithdrawal, 
    adminComment, 
    setAdminComment, 
    handleAction, 
    actionLoading 
}) => {
    if (!isOpen || !selectedWithdrawal) return null;

    const isApprove = actionType === 'APPROVE';
    const bank = typeof selectedWithdrawal.bank_details === 'string' ? JSON.parse(selectedWithdrawal.bank_details) : selectedWithdrawal.bank_details;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="p-8 md:p-12 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-3xl font-black tracking-tight ${isApprove ? 'text-slate-900' : 'text-rose-600'}`}>
                                {isApprove ? 'Approve Withdrawal' : 'Reject Withdrawal'}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">
                                Ref ID: WD-{selectedWithdrawal.id}
                            </p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6 border border-slate-100 shadow-inner">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Withdrawal Amount</label>
                            <p className="text-3xl font-black text-rose-600 tracking-tight">
                                ₹{Number(selectedWithdrawal.amount).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="h-px bg-slate-200/50" />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Name</label>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary font-black text-[10px] border border-slate-100">
                                    {selectedWithdrawal.user_name?.substring(0, 1).toUpperCase()}
                                </div>
                                <p className="text-sm font-black text-slate-700">{selectedWithdrawal.user_name}</p>
                            </div>
                        </div>
                        <div className="h-px bg-slate-200/50" />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bank Details</label>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="material-symbols-outlined text-sm text-slate-400">account_balance</span>
                                <p className="text-xs font-black text-slate-500 uppercase">{bank?.bank_name} - {bank?.account_number}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Note</label>
                            {!isApprove && <span className="text-[9px] text-rose-400 font-bold uppercase">Required for rejection</span>}
                        </div>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white transition-all resize-none shadow-inner"
                            rows={4}
                             placeholder={isApprove ? "Note for approval (optional)..." : "Reason for rejection (required)..."}
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-8 py-5 bg-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAction}
                            disabled={actionLoading || (!isApprove && !adminComment.trim())}
                            className={`flex-[2] px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                                isApprove 
                                    ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' 
                                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                            }`}
                        >
                            {actionLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Executing...</span>
                                </div>
                            ) : (
                                 isApprove ? 'APPROVE NOW' : 'REJECT NOW'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
