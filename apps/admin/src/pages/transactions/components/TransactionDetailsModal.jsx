const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const fmt = (val) =>
    val !== null && val !== undefined ? `₹${Number(val).toFixed(2)}` : '—';

const STATUS_STYLES = {
    SUCCESS: 'bg-emerald-50 text-emerald-600',
    FAILED: 'bg-red-50 text-red-500',
    REVERSED: 'bg-slate-100 text-slate-500',
};

/** Reusable label + value row */
const InfoRow = ({ label, value, mono = false, full = false }) => (
    <div className={full ? 'col-span-2' : ''}>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-sm font-bold text-[#172b4d] break-all ${mono ? 'font-mono' : ''}`}>
            {value ?? '—'}
        </p>
    </div>
);

const Section = ({ title, children }) => (
    <div className="space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 grid grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const TransactionDetailsModal = ({ transaction, isOpen, onClose }) => {
    if (!transaction || !isOpen) return null;

    const isCredit = transaction.entry_type === 'CREDIT';
    const meta = transaction.meta
        ? (typeof transaction.meta === 'string' ? JSON.parse(transaction.meta) : transaction.meta)
        : null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white flex flex-col max-h-[94vh] animate-in fade-in zoom-in duration-300">

                {/* Top Navigation / Status Bar */}
                <div className="flex items-center justify-between px-10 pt-10 pb-6">
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${STATUS_STYLES[transaction.status] || STATUS_STYLES.REVERSED}`}>
                            {transaction.status}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${isCredit ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {transaction.entry_type}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all active:scale-95 border border-slate-100 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-2xl font-light">close</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="overflow-y-auto px-10 pb-10 space-y-8 scrollbar-hide">
                    
                    {/* Header Section */}
                    <div className="space-y-1">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                            Transaction <span className="text-primary">Details</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                ID: <span className="font-mono text-slate-900">{transaction.id}</span>
                            </p>
                            <span className="text-slate-300">•</span>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                {new Date(transaction.created_at).toLocaleString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Amount Hero Card */}
                    <div className={`relative overflow-hidden rounded-[2rem] p-8 border ${isCredit ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                        {/* Decorative background icon */}
                        <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
                            <span className="material-symbols-outlined text-[180px]">
                                {isCredit ? 'arrow_downward' : 'arrow_upward'}
                            </span>
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 ${isCredit ? 'text-emerald-500' : 'text-red-500'}`}>
                                    Total Transaction Amount
                                </p>
                                <p className={`text-5xl font-black tracking-tight ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {isCredit ? '+' : '-'}{fmt(transaction.amount)}
                                </p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Transaction Type</p>
                                <p className="text-xl font-black text-slate-800 uppercase tracking-wide">
                                    {transaction.transaction_type?.replace(/_/g, ' ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Left Column: User & Core Info */}
                        <div className="space-y-8">
                            {/* User Profile */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Profile</h4>
                                </div>
                                <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 space-y-4 shadow-sm">
                                    <div className="flex items-center gap-4 pb-4 border-b border-slate-200/60">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-slate-300">account_circle</span>
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900">{transaction.user_name}</p>
                                            <p className="text-xs font-bold text-primary">#{transaction.user_id}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoRow label="Phone" value={transaction.user_phone} />
                                        <InfoRow label="Wallet ID" value={transaction.wallet_id} />
                                    </div>
                                </div>
                            </div>

                            {/* Reference Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">link</span>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference Details</h4>
                                </div>
                                <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 space-y-4 shadow-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoRow label="Source Table" value={transaction.reference_table} full />
                                        <InfoRow label="Source ID" value={transaction.reference_id} mono full />
                                        {transaction.reversal_of && (
                                            <InfoRow label="Reversal Of" value={transaction.reversal_of} mono full />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Balances & Proof */}
                        <div className="space-y-8">
                            {/* Balance Snapshots */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">account_balance</span>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Balance Impact</h4>
                                </div>
                                <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 shadow-xl space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Available Balance</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-center">
                                                <p className="text-[9px] text-slate-500 font-bold mb-1">BEFORE</p>
                                                <p className="text-sm font-bold text-slate-300">{fmt(transaction.balance_before)}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-700">trending_flat</span>
                                            <div className="text-center">
                                                <p className="text-[9px] text-emerald-500/80 font-bold mb-1">AFTER</p>
                                                <p className="text-lg font-black text-white">{fmt(transaction.balance_after)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-slate-800" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Locked Balance</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-center">
                                                <p className="text-[9px] text-slate-500 font-bold mb-1">BEFORE</p>
                                                <p className="text-sm font-bold text-slate-300">{fmt(transaction.locked_before)}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-700">trending_flat</span>
                                            <div className="text-center">
                                                <p className="text-[9px] text-amber-500/80 font-bold mb-1">AFTER</p>
                                                <p className="text-lg font-black text-white">{fmt(transaction.locked_after)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details (Bank/Recharge etc) */}
                            {(transaction.bank_details || transaction.proof_image) && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">info</span>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Process Context</h4>
                                    </div>
                                    <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        {transaction.bank_details && (
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="pb-2 border-b border-slate-200/60">
                                                    <p className="text-[9px] text-slate-400 font-black mb-1">BANK DESTINATION</p>
                                                    <p className="text-sm font-bold text-slate-800">{transaction.bank_details.bank_name}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InfoRow label="A/C Holder" value={transaction.bank_details.account_name} />
                                                    <InfoRow label="A/C Number" value={transaction.bank_details.account_number} mono />
                                                </div>
                                            </div>
                                        )}
                                        {transaction.proof_image && (
                                            <div className="mt-4">
                                                <p className="text-[9px] text-slate-400 font-black mb-2 uppercase">ATTACHMENT</p>
                                                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner group relative cursor-pointer" onClick={() => window.open(`${IMAGE_BASE_URL}${transaction.proof_image}`, '_blank')}>
                                                    <img
                                                        src={`${IMAGE_BASE_URL}${transaction.proof_image}`}
                                                        alt="Proof"
                                                        className="w-full h-auto max-h-40 object-cover bg-white transition-transform group-hover:scale-110"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Attachment'; }}
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <span className="material-symbols-outlined text-white text-3xl">open_in_new</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full Width Sections: Description & Meta */}
                    <div className="space-y-8">
                        {/* Description */}
                        {transaction.description && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">notes</span>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Narration</h4>
                                </div>
                                <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                        "{transaction.description}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Meta JSON */}
                        {meta && Object.keys(meta).length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">code</span>
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Metadata</h4>
                                </div>
                                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 overflow-hidden shadow-inner font-mono text-[11px]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(meta).map(([key, value]) => (
                                            <div key={key} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                                                <span className="text-[9px] text-slate-400 uppercase font-black">{key}</span>
                                                <span className="text-slate-700 font-bold truncate" title={String(value)}>
                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Sticky Action */}
                <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/30 rounded-b-[2.5rem]">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white text-xs font-black rounded-2xl shadow-lg hover:bg-slate-800 hover:shadow-slate-200 active:scale-[0.98] transition-all tracking-[0.2em] uppercase"
                    >
                        DISMISS RECORD
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
