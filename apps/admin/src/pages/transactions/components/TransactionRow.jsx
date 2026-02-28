const STATUS_COLORS = {
    SUCCESS: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    FAILED: 'bg-red-100 text-red-700 border-red-200',
    REVERSED: 'bg-amber-100 text-amber-700 border-amber-200',
    PENDING: 'bg-blue-100 text-blue-700 border-blue-200'
};

const TYPE_COLORS = {
    RECHARGE_REQUEST: 'bg-blue-50 text-blue-600 border-blue-100',
    WITHDRAWAL_REQUEST: 'bg-orange-50 text-orange-600 border-orange-100',
    REFERRAL_COMMISSION: 'bg-purple-50 text-purple-600 border-purple-100',
    ADMIN_ADJUSTMENT: 'bg-slate-50 text-slate-600 border-slate-200',
    REVERSAL: 'bg-red-50 text-red-600 border-red-100',
    ORDER_PAYMENT: 'bg-indigo-50 text-indigo-600 border-indigo-100'
};

const TRANSACTION_ICONS = {
    RECHARGE_REQUEST: 'payments',
    WITHDRAWAL_REQUEST: 'account_balance_wallet',
    REFERRAL_COMMISSION: 'group_add',
    ADMIN_ADJUSTMENT: 'admin_panel_settings',
    REVERSAL: 'history',
    ORDER_PAYMENT: 'shopping_bag'
};

const fmt = (val) => (val !== null && val !== undefined ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—');

const TransactionRow = ({ transaction, onViewDetails }) => {
    const isCredit = transaction.entry_type === 'CREDIT';
    
    // Deeper row shading for the "stand alone" rich look
    const rowBg = isCredit 
        ? 'hover:bg-emerald-50/50 bg-emerald-50/20' 
        : 'hover:bg-red-50/50 bg-red-50/20';

    const entryTypeStyle = isCredit 
        ? 'text-emerald-700 bg-emerald-100 border-emerald-200 shadow-sm' 
        : 'text-red-700 bg-red-100 border-red-200 shadow-sm';

    return (
        <tr className={`${rowBg} transition-all duration-300 border-b border-white/50 group`}>
            {/* 1. Beneficiary (User) */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-md ${isCredit ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600' : 'bg-gradient-to-br from-red-100 to-red-200 text-red-600'}`}>
                        <span className="material-symbols-outlined text-xl font-medium">
                            {TRANSACTION_ICONS[transaction.transaction_type] || 'receipt_long'}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-[13px] font-black text-slate-800 leading-tight mb-0.5">{transaction.user_name}</h4>
                        <div className="flex items-center gap-2">
                            <a 
                                href={`/admin/users/${transaction.user_id}`} 
                                onClick={(e) => { e.preventDefault(); console.log('Navigate to user:', transaction.user_id); }}
                                className="text-[10px] text-primary font-black hover:underline tracking-tight bg-primary/5 px-1.5 py-0.5 rounded"
                            >
                                #{transaction.user_id}
                            </a>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] text-slate-500 font-bold">{transaction.user_phone}</span>
                        </div>
                    </div>
                </div>
            </td>

            {/* 2. Entry */}
            <td className="px-6 py-5 text-center">
                <span className={`px-2.5 py-1.5 rounded-[10px] text-[9px] font-black border uppercase tracking-[0.1em] ${entryTypeStyle}`}>
                    {transaction.entry_type}
                </span>
            </td>

            {/* 3. Activity Type */}
            <td className="px-6 py-5">
                <div className="flex flex-col gap-1.5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider w-fit shadow-sm ${TYPE_COLORS[transaction.transaction_type] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {transaction.transaction_type.replace(/_/g, ' ')}
                    </span>
                    {transaction.reversal_of && (
                        <div className="flex items-center gap-1.5 text-[9px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 w-fit">
                            <span className="material-symbols-outlined text-[12px]">replay</span>
                            REV OF: {transaction.reversal_of}
                        </div>
                    )}
                </div>
            </td>

            {/* 4. Amount */}
            <td className="px-6 py-5">
                <div className={`text-base font-black tracking-tight ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className="text-xs opacity-60 mr-0.5">{isCredit ? '+' : '-'}</span>
                    {fmt(transaction.amount)}
                </div>
            </td>

            {/* 5. Available Balance */}
            <td className="px-6 py-5">
                <div className="bg-white/40 rounded-xl p-2 border border-slate-100/50 space-y-1 shadow-inner">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Before</span>
                        <span className="text-slate-600 font-bold">{fmt(transaction.balance_before)}</span>
                    </div>
                    <div className="h-px bg-slate-100 mx-1"></div>
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter">After</span>
                        <span className="text-slate-900 font-black">{fmt(transaction.balance_after)}</span>
                    </div>
                </div>
            </td>

            {/* 6. Locked Balance */}
            <td className="px-6 py-5">
                <div className="bg-white/40 rounded-xl p-2 border border-slate-100/50 space-y-1 shadow-inner">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Locked Before</span>
                        <span className="text-slate-600 font-bold">{fmt(transaction.locked_before)}</span>
                    </div>
                    <div className="h-px bg-slate-100 mx-1"></div>
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Locked After</span>
                        <span className="text-slate-900 font-black">{fmt(transaction.locked_after)}</span>
                    </div>
                </div>
            </td>

            {/* 7. Reference */}
            <td className="px-6 py-5">
                <div className="flex flex-col gap-1.5">
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); }}
                        className="text-[10px] font-black text-primary/80 hover:text-primary hover:underline uppercase tracking-[0.1em] bg-primary/5 px-2 py-1 rounded-lg w-fit transition-all"
                    >
                        {transaction.reference_table || 'General'}
                    </a>
                    {transaction.reference_id ? (
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[11px] text-slate-300">key</span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                                {transaction.reference_id}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-300 ml-1">—</span>
                    )}
                </div>
            </td>

            {/* 8. Status */}
            <td className="px-6 py-5 text-center">
                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm inline-block ${STATUS_COLORS[transaction.status] || STATUS_COLORS.REVERSED}`}>
                    {transaction.status}
                </span>
            </td>

            {/* 9. Timestamp */}
            <td className="px-6 py-5">
                <div className="flex flex-col">
                    <span className="text-[11px] text-slate-700 font-black tracking-tight">
                        {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                        {new Date(transaction.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                    </span>
                </div>
            </td>

            {/* 10. Narration */}
            <td className="px-6 py-5">
                {transaction.description ? (
                    <div className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[180px] line-clamp-2 italic" title={transaction.description}>
                        "{transaction.description}"
                    </div>
                ) : (
                    <span className="text-[10px] text-slate-300 italic">No narration</span>
                )}
            </td>

            {/* 11. Details (Actions) */}
            <td className="px-6 py-5 text-right">
                <button
                    onClick={() => onViewDetails(transaction)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-[12px] text-slate-400 hover:text-primary hover:border-primary/40 hover:shadow-lg transition-all active:scale-95 group-hover:bg-primary/5 shadow-sm"
                    title="Detailed Analysis"
                >
                    <span className="material-symbols-outlined text-[22px] font-light">analytics</span>
                </button>
            </td>
        </tr>
    );
};

export default TransactionRow;
