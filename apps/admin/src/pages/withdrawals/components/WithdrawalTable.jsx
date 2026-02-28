import React from 'react';
import WithdrawalRow from './WithdrawalRow.jsx';

const COLUMNS = [
    { label: 'Member Name', width: '25%' },
    { label: 'Amount', width: '15%' },
    { label: 'Bank Details', width: '20%' },
    { label: 'Date', width: '15%' },
    { label: 'Status', width: '10%' },
    { label: 'Actions', width: '15%', align: 'right' },
];

const SkeletonRow = () => (
    <tr className="border-b border-slate-50">
        {COLUMNS.map((col, i) => (
            <td key={i} className="px-10 py-6">
                <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-full max-w-[120px]" />
            </td>
        ))}
    </tr>
);

const WithdrawalTable = ({ withdrawals, isLoading, onAction }) => {
    if (isLoading && withdrawals.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                {COLUMNS.map((col, i) => (
                                    <th
                                        key={i}
                                        className={`px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest ${col.align === 'right' ? 'text-right' : ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (withdrawals.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-32 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <span className="material-symbols-outlined text-6xl font-extralight">account_balance</span>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">No payout requests matching the criteria</h4>
                        <p className="text-xs text-slate-300 font-bold">Try adjusting your filtration criteria</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-500">
            {/* Mobile Card View */}
            <div className="block lg:hidden divide-y divide-slate-100">
                {withdrawals.map((request, i) => {
                    const bank = typeof request.bank_details === 'string' ? JSON.parse(request.bank_details) : request.bank_details;
                    return (
                        <div key={i} className="p-6 space-y-6 hover:bg-slate-50/30 transition-colors group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-primary/10">
                                        {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[13px] font-black text-slate-800 tracking-tight truncate">{request.user_name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{request.user_phone}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-sm font-black text-rose-600 leading-none">₹{Number(request.amount).toLocaleString()}</div>
                                    <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest mt-2 border ${request.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        request.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {request.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 rounded-2xl p-4 space-y-2 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">account_balance</span>
                                    <p className="text-[10px] font-black text-slate-800 uppercase truncate">{bank?.bank_name || 'N/A'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">tag</span>
                                    <p className="text-[9px] font-black text-slate-500 font-mono tracking-widest truncate">{bank?.account_number || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </p>
                                <div className="flex items-center gap-2">
                                    {request.status === 'REVIEW_PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => onAction(request, "APPROVE")}
                                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl active:scale-95 transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest border border-white/10"
                                            >
                                                APPROVE
                                            </button>
                                            <button
                                                onClick={() => onAction(request, "REJECT")}
                                                className="px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black rounded-xl active:scale-95 transition-all uppercase tracking-widest border border-rose-100"
                                            >
                                                REJECT
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <span className="material-symbols-outlined text-sm font-black">
                                                {request.status === 'APPROVED' ? 'verified_user' : 'cancel'}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                                {request.status === 'APPROVED' ? 'APPROVED' : 'REJECTED'}
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
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {COLUMNS.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest ${col.align === 'right' ? 'text-right' : ''}`}
                                    style={{ width: col.width }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {withdrawals.map((request, i) => (
                            <WithdrawalRow 
                                key={request.id || i} 
                                request={request} 
                                onAction={onAction} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WithdrawalTable;
