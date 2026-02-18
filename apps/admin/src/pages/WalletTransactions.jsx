import React, { useState, useEffect } from "react";

const STATUS_COLORS = {
    SUCCESS: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    REVERSED: 'bg-slate-100 text-slate-500'
};

const TRANSACTION_ICONS = {
    RECHARGE_REQUEST: 'add_circle',
    WITHDRAWAL_REQUEST: 'remove_circle',
    REFERRAL_COMMISSION: 'person_add',
    ADMIN_ADJUSTMENT: 'settings',
    REVERSAL: 'undo'
};

const StatCard = ({ title, value, subtitle, bgColor, icon }) => (
    <div className={`${bgColor} p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden`}>
        <div className="relative z-10">
            <h5 className={`text-[11px] font-black uppercase tracking-widest mb-2 ${bgColor.includes('white') ? 'text-slate-400' : 'text-white/50'}`}>
                {title}
            </h5>
            <div className={`text-4xl font-black tracking-tight ${bgColor.includes('white') ? 'text-[#172b4d]' : 'text-white'}`}>
                {value}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 ${bgColor.includes('white') ? 'text-slate-400' : 'text-white/70'}`}>
                {subtitle}
            </p>
        </div>
        {icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-10">
                <span className="material-symbols-outlined text-[120px] leading-none">{icon}</span>
            </div>
        )}
        {!bgColor.includes('white') && <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />}
    </div>
);

const TransactionRow = ({ transaction, onViewDetails }) => {
    const isCredit = transaction.entry_type === 'CREDIT';
    const colorClass = isCredit ? 'text-green-600' : 'text-red-600';
    const bgClass = isCredit ? 'bg-green-100' : 'bg-red-100';

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-lg ${colorClass}`}>
                            {TRANSACTION_ICONS[transaction.transaction_type] || 'sync_alt'}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#172b4d]">{transaction.user_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            ID: {transaction.user_id} · {transaction.user_phone}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-lg ${colorClass}`}>
                            {isCredit ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[#172b4d]">{transaction.transaction_type.replace(/_/g, ' ')}</p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase">{transaction.entry_type}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className={`text-sm font-black ${colorClass}`}>
                    {isCredit ? '+' : '-'}₹{transaction.amount}
                </span>
            </td>
            <td className="px-8 py-5">
                <div className="text-xs text-slate-500">
                    <div className="font-bold">Before: ₹{transaction.balance_before}</div>
                    <div className="font-bold">After: ₹{transaction.balance_after}</div>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className="text-sm font-medium text-slate-500">₹{transaction.current_balance}</span>
            </td>
            <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[transaction.status] || STATUS_COLORS.REVERSED}`}>
                    {transaction.status}
                </span>
            </td>
            <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </td>
            <td className="px-8 py-5">
                {transaction.description && (
                    <div className="text-xs text-slate-400 max-w-xs truncate" title={transaction.description}>
                        {transaction.description}
                    </div>
                )}
            </td>
            <td className="px-8 py-5">
                <button
                    onClick={() => onViewDetails(transaction)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all active:scale-90"
                >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                </button>
            </td>
        </tr>
    );
};

const TransactionDetailsModal = ({ transaction, isOpen, onClose }) => {
    if (!transaction || !isOpen) return null;

    const IMAGE_BASE_URL = 'http://localhost:4000';
    const isCredit = transaction.entry_type === 'CREDIT';
    const colorClass = isCredit ? 'text-green-600' : 'text-red-600';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="p-8 md:p-12 space-y-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-black tracking-tight text-[#172b4d]">
                                Transaction Details
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                Transaction ID: {transaction.id}
                            </p>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-6 grid grid-cols-2 gap-6 border border-slate-100">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                <p className="text-sm font-bold text-[#172b4d]">{transaction.transaction_type.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</label>
                                <p className={`text-lg font-black ${colorClass}`}>
                                    {isCredit ? '+' : '-'}₹{transaction.amount}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                                <p className="text-sm font-bold text-[#172b4d]">{transaction.status}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                                <p className="text-sm font-bold text-[#172b4d]">
                                    {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Conditional Details for Recharges */}
                        {transaction.transaction_type === 'RECHARGE_REQUEST' && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recharge Information</h4>
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</label>
                                            <p className="text-sm font-bold text-[#172b4d]">{transaction.payment_method || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</label>
                                            <p className="text-sm font-bold text-[#172b4d] font-mono">{transaction.payment_reference || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {transaction.proof_image && (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proof of Payment</label>
                                            <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200">
                                                <img
                                                    src={`${IMAGE_BASE_URL}${transaction.proof_image}`}
                                                    alt="Payment Proof"
                                                    className="w-full h-auto max-h-60 object-contain bg-white"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Conditional Details for Withdrawals */}
                        {transaction.transaction_type === 'WITHDRAWAL_REQUEST' && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Withdrawal Information</h4>
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                                    <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Amount</label>
                                            <p className="text-sm font-bold text-[#172b4d]">₹{transaction.amount}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee</label>
                                            <p className="text-sm font-bold text-red-500">₹{transaction.platform_fee || '0'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Payable</label>
                                            <p className="text-sm font-black text-green-600">₹{transaction.net_amount || transaction.amount}</p>
                                        </div>
                                    </div>
                                    {transaction.bank_details && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Details</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">account_balance</span>
                                                    <p className="text-[11px] font-bold text-[#172b4d]">{transaction.bank_details.bank_name}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                                                    <p className="text-[11px] font-bold text-[#172b4d]">{transaction.bank_details.account_name}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">tag</span>
                                                    <p className="text-[11px] font-bold text-[#172b4d] font-mono">{transaction.bank_details.account_number}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">vpn_key</span>
                                                    <p className="text-[11px] font-bold text-[#172b4d] font-mono">{transaction.bank_details.ifsc || transaction.bank_details.ifsc_code}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {transaction.description && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Log</label>
                                <div className="bg-slate-50 rounded-2xl p-4 text-xs font-medium text-slate-600 border border-slate-100">
                                    {transaction.description}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={onClose}
                            className="w-full px-8 py-4 bg-slate-100 text-slate-600 text-sm font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                        >
                            CLOSE DETAILS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TOTAL_PAGES = 5; // Replace with actual pagination logic

export default function WalletTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({
        search: '',
        userId: '',
        transactionType: '',
        entryType: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedTransaction(null);
    };

    useEffect(() => {
        fetchTransactions();
    }, [pagination.page, filters]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
            });

            const response = await fetch(`/api/admin/wallet-transactions?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();
            if (data.success) {
                setTransactions(data.data.transactions);
                setPagination(prev => ({ ...prev, ...data.data.pagination }));
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            userId: '',
            transactionType: '',
            entryType: '',
            status: '',
            startDate: '',
            endDate: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getTotal = (entryType) => transactions
        .filter(t => t.entry_type === entryType && t.status === 'SUCCESS')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span>Home</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span>Finance</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">Wallet Transactions</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Wallet Transaction History</h2>
                    <p className="text-lg text-slate-500 font-medium">Complete transaction ledger for all wallet activities.</p>
                </div>

                <button
                    onClick={fetchTransactions}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-180 transition-transform">refresh</span>
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Stats Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <StatCard
                    title="Total Transactions"
                    value={pagination.total}
                    subtitle="Across all users"
                    bgColor="bg-white border border-slate-100 shadow-sm"
                    icon="receipt_long"
                />
                <StatCard
                    title="Total Credits"
                    value={`₹${getTotal('CREDIT').toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    subtitle="Money Added"
                    bgColor="bg-green-500 shadow-green-500/30"
                />
                <StatCard
                    title="Total Debits"
                    value={`₹${getTotal('DEBIT').toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    subtitle="Money Deducted"
                    bgColor="bg-red-500 shadow-red-500/30"
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Filter Transactions</h3>
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <span className="material-symbols-outlined text-base">filter_alt_off</span>
                        <span>Clear All</span>
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search by user name, phone, or description..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
                        />
                    </div>

                    {/* Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <input
                            type="text"
                            placeholder="User ID"
                            value={filters.userId}
                            onChange={(e) => handleFilterChange('userId', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <select
                            value={filters.transactionType}
                            onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">All Types</option>
                            <option value="RECHARGE_REQUEST">Recharge</option>
                            <option value="WITHDRAWAL_REQUEST">Withdrawal</option>
                            <option value="REFERRAL_COMMISSION">Commission</option>
                            <option value="ADMIN_ADJUSTMENT">Admin Adjustment</option>
                            <option value="REVERSAL">Reversal</option>
                        </select>
                        <select
                            value={filters.entryType}
                            onChange={(e) => handleFilterChange('entryType', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">All Entries</option>
                            <option value="CREDIT">Credit</option>
                            <option value="DEBIT">Debit</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">All Status</option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILED">Failed</option>
                            <option value="REVERSED">Reversed</option>
                        </select>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            placeholder="Start Date"
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            placeholder="End Date"
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto px-2 pb-2">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-8 py-12 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                                            <span className="text-sm font-bold text-slate-400">Loading transactions...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-6xl text-slate-200">receipt_long</span>
                                            <span className="text-sm font-bold text-slate-400">No transactions found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(transaction => (
                                    <TransactionRow key={transaction.id} transaction={transaction} onViewDetails={handleViewDetails} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${p === pagination.page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <TransactionDetailsModal
                transaction={selectedTransaction}
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
            />
        </div>
    );
}
