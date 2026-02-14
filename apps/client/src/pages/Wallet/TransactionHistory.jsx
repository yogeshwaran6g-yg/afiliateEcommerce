import React, { useState } from 'react';

export default function TransactionHistory({ transactions = [] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = transactions.filter(t => 
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference_id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'SUCCESS':
            case 'COMPLETED':
            case 'APPROVED':
                return 'text-commission';            
            case 'PENDING':
                return 'text-hold';
            case 'FAILED':
            case 'CANCELLED':
            case 'REJECTED':
                return 'text-red-500';
            default:
                return 'text-slate-400';
        }
    };

    const getStatusDotColor = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'SUCCESS':
            case 'COMPLETED':
            case 'APPROVED':
                return 'bg-commission';            
            case 'PENDING':
                return 'bg-hold';
            case 'FAILED':
            case 'CANCELLED':
            case 'REJECTED':
                return 'bg-red-500';
            default:
                return 'bg-slate-400';
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return 'Success';
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const getTypeLabel = (type) => {
        switch (type?.toUpperCase()) {
            case 'REFERRAL_COMMISSION': return 'Referral';
            case 'WITHDRAWAL_REQUEST': return 'Payout';
            case 'RECHARGE_REQUEST': return 'Deposit';
            case 'ADMIN_ADJUSTMENT': return 'Adjustment';
            case 'REVERSAL': return 'Reversal';            
            default: return type || 'Transaction';
        }
    }

    const getTypeStyles = (type) => {
        const label = getTypeLabel(type);
        switch (label) {
            case 'Referral': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'Payout': return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
            case 'Deposit': return 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'Adjustment': return 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
            case 'Reversal': return 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400';
            default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount, entryType) => {
        const isNegative = entryType?.toUpperCase() === 'DEBIT' || amount < 0;
        const formatted = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(Math.abs(amount) || 0);
        
        return (
            <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-commission'}`}>
                {isNegative ? '-' : '+'}{formatted}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Filters Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-bold text-lg px-2 text-slate-900 dark:text-white">Transaction History</h3>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input 
                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100" 
                            placeholder="Search transactions..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <tr key={transaction.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                        {formatDate(transaction.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{transaction.description || 'No description'}</span>
                                            {transaction.reference_id && (
                                                <span className="text-xs text-slate-400">Ref ID: #{transaction.reference_id}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeStyles(transaction.transaction_type)}`}>
                                            {getTypeLabel(transaction.transaction_type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {formatCurrency(transaction.amount, transaction.entry_type)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${getStatusStyles(transaction.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(transaction.status)}`}></span>
                                            {getStatusLabel(transaction.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-slate-400 dark:text-slate-500">
                                    <span className="material-symbols-outlined text-5xl mb-3 opacity-20">history</span>
                                    <p className="font-bold uppercase tracking-widest text-xs">No transactions found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} transactions</p>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400" disabled>
                            <span className="material-symbols-outlined text-sm leading-none">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded">1</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">2</button>
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
