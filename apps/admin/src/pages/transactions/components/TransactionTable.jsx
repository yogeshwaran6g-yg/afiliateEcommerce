import TransactionRow from './TransactionRow.jsx';

const COLUMNS = [
    { label: 'Beneficiary', width: '22%' },
    { label: 'Entry', width: '70px', align: 'center' },
    { label: 'Activity Type', width: '14%' },
    { label: 'Amount', width: '130px' },
    { label: 'Main Balance', width: '160px' },
    { label: 'Locked Balance', width: '160px' },
    { label: 'Reference', width: '140px' },
    { label: 'Status', width: '100px', align: 'center' },
    { label: 'Timestamp', width: '130px' },
    { label: 'Description', width: '15%' },
    { label: 'Details', width: '60px', align: 'right' },
];

/** Skeleton rows shown while loading */
const SkeletonRow = () => (
    <tr className="border-b border-slate-50">
        {COLUMNS.map((col, i) => (
            <td key={i} className="px-6 py-5">
                <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-full max-w-[100px]" />
            </td>
        ))}
    </tr>
);

const TransactionTable = ({ transactions, isLoading, isError, error, onViewDetails, onRetry }) => (
    <div className="overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm mx-2 mb-6">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr>
                        {COLUMNS.map((col, i) => (
                            <th
                                key={col.label}
                                className={`px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap 
                                    ${col.align === 'center' ? 'text-center' : ''} 
                                    ${col.align === 'right' ? 'text-right' : ''}`}
                                style={{ width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                ) : isError ? (
                    <tr>
                        <td colSpan={COLUMNS.length} className="px-8 py-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-red-400">error_outline</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-600">Failed to load transactions</p>
                                    <p className="text-xs text-slate-400 mt-1">{error?.message || 'An unexpected error occurred.'}</p>
                                </div>
                                <button
                                    onClick={onRetry}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-base">refresh</span>
                                    Try Again
                                </button>
                            </div>
                        </td>
                    </tr>
                ) : transactions.length === 0 ? (
                    <tr>
                        <td colSpan={COLUMNS.length} className="px-8 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-6xl text-slate-200">receipt_long</span>
                                <span className="text-sm font-bold text-slate-400">No transactions found</span>
                                <span className="text-xs text-slate-300">Try adjusting your filters</span>
                            </div>
                        </td>
                    </tr>
                ) : (
                    transactions.map(transaction => (
                        <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            onViewDetails={onViewDetails}
                        />
                    ))
                )}
            </tbody>
        </table>
    </div>
</div>
);

export default TransactionTable;
