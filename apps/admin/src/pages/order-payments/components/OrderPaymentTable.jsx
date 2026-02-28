import React from "react";

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-amber-100 text-amber-600 border-amber-200",
        APPROVED: "bg-emerald-100 text-emerald-600 border-emerald-200",
        REJECTED: "bg-rose-100 text-rose-600 border-rose-200",
    };
    return (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${styles[status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
            {status}
        </span>
    );
};

export default function OrderPaymentTable({ payments = [], isLoading, onAction, onPreview }) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-12 text-center space-y-4">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching Transactions...</p>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl text-slate-200 font-black text-[48px]">receipt_long</span>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">No Payments Found</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">We couldn't find any order payment records matching your current filters.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto text-nowrap">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Order Info</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">User Details</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Description</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Payment Proof</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {payments.map((val) => (
                            <tr key={val.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-10 py-7">
                                    <div className="space-y-1">
                                        <div className="text-sm font-black text-slate-800 tracking-tight">#{val.order_number}</div>
                                        <div className="text-[10px] font-black text-primary tracking-widest uppercase bg-primary/5 px-2 py-0.5 rounded-md inline-block">₹{parseFloat(val.total_amount).toLocaleString()}</div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                                            {val.user_name?.charAt(0)}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-black text-slate-800 tracking-tight">{val.user_name}</div>
                                            <div className="text-[11px] text-slate-400 font-bold">{val.user_phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="space-y-1">
                                        <div className="text-xs font-black text-slate-600 uppercase tracking-widest">{val.payment_type}</div>
                                        <div className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md inline-block border border-slate-100">REF: {val.transaction_reference}</div>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <button
                                        onClick={() => onPreview(val.proof_url)}
                                        className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 overflow-hidden group shadow-sm hover:scale-110 active:scale-95 transition-all duration-300 relative inline-flex items-center justify-center"
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${val.proof_url}`}
                                            alt="Proof"
                                            className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Proof'; }}
                                        />
                                        <span className="material-symbols-outlined absolute text-primary opacity-0 group-hover:opacity-100 transition-opacity font-black text-xl">
                                            zoom_in
                                        </span>
                                    </button>
                                </td>
                                <td className="px-10 py-7">
                                    <StatusBadge status={val.status} />
                                </td>
                                <td className="px-10 py-7 text-right">
                                    {val.status === 'PENDING' ? (
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => onAction(val, "APPROVE")}
                                                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100"
                                            >
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            </button>
                                            <button
                                                onClick={() => onAction(val, "REJECT")}
                                                className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block">
                                            {new Date(val.updated_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
