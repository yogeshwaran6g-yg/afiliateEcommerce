import React from 'react';

const STATUS_STYLING = {
    APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
    REVIEW_PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
};

const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const RechargeRow = ({ request, onAction }) => {
    const isPending = request.status === 'REVIEW_PENDING';

    return (
        <tr className="hover:bg-slate-50/50 transition-all duration-300 border-b border-slate-50 group">
            <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-primary/10">
                        {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-[13px] font-black text-slate-800 tracking-tight truncate mb-0.5">{request.user_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{request.user_phone}</p>
                    </div>
                </div>
            </td>
            <td className="px-10 py-6">
                <div className="text-lg font-black text-slate-800 tracking-tight">₹{Number(request.amount).toLocaleString('en-IN')}</div>
            </td>
            <td className="px-10 py-6">
                <p className="text-xs font-black text-slate-700 tracking-tight">{request.payment_method}</p>
            </td>
            <td className="px-10 py-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate">{request.payment_reference || 'N/A'}</p>
            </td>
            <td className="px-10 py-6">
                <div className="flex flex-col">
                    <span className="text-[11px] text-slate-700 font-black tracking-tight">
                        {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                        {new Date(request.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                </div>
            </td>
            <td className="px-10 py-6">
                {request.proof_image ? (
                    <button
                        onClick={() => window.open(`${IMAGE_BASE_URL}${request.proof_image}`, '_blank')}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all group/proof border border-transparent shadow-sm overflow-hidden"
                        title="View Proof Image"
                    >
                        <img 
                            src={`${IMAGE_BASE_URL}${request.proof_image}`} 
                            alt="Proof" 
                            className="w-full h-full object-cover opacity-60 group-hover/proof:opacity-100 transition-opacity"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = '<span class="material-symbols-outlined text-xl">image</span>';
                            }}
                        />
                    </button>
                ) : (
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">N/A</span>
                )}
            </td>
            <td className="px-10 py-6">
                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm inline-block ${STATUS_STYLING[request.status] || 'bg-slate-100 text-slate-400'}`}>
                    {request.status.replace("_", " ")}
                </span>
            </td>
            <td className="px-10 py-6">
                <div className="flex items-center justify-end gap-3">
                    {isPending ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onAction(request, "APPROVE")}
                                className="px-4 py-2.5 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 uppercase tracking-widest border border-emerald-400/20"
                            >
                                APPROVE
                            </button>
                            <button
                                onClick={() => onAction(request, "REJECT")}
                                className="px-4 py-2.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-xl hover:bg-rose-100 transition-all active:scale-95 uppercase tracking-widest border border-rose-100"
                            >
                                REJECT
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                             <span className={`material-symbols-outlined text-sm ${request.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {request.status === 'APPROVED' ? 'verified_user' : 'cancel'}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {request.status === 'APPROVED' ? 'APPROVED' : 'REJECTED'}
                            </span>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default RechargeRow;
