import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useWalletTransactions } from "../../hooks/useWallet.hook.js";

import StatCards from "./components/StatCards.jsx";
import TransactionFilters from "./components/TransactionFilters.jsx";
import TransactionTable from "./components/TransactionTable.jsx";
import Pagination from "./components/Pagination.jsx";
import TransactionDetailsModal from "./components/TransactionDetailsModal.jsx";

const EMPTY_FILTERS = {
    search: '',
    userId: '',
    transactionType: '',
    entryType: '',
    status: '',
    startDate: '',
    endDate: ''
};

export default function WalletTransactions() {
    const [searchParams] = useSearchParams();
    const urlUserId = searchParams.get('userId');

    const [page, setPage] = useState(1);
    const limit = 1;

    const [filters, setFilters] = useState({
        ...EMPTY_FILTERS,
        userId: urlUserId || ''
    });

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Build query params — only include non-empty filter keys
    const queryParams = {
        page,
        limit,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    };

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useWalletTransactions(queryParams);

    const transactions = data?.data?.transactions || [];
    const pagination = data?.data?.pagination || { page: 1, limit, total: 0, totalPages: 0 };

    // Sync URL userId param into filters
    useEffect(() => {
        if (urlUserId && filters.userId !== urlUserId) {
            setFilters(prev => ({ ...prev, userId: urlUserId }));
            setPage(1);
        }
    }, [urlUserId]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // reset to first page on every filter change
    };

    const handleClearFilters = () => {
        setFilters(EMPTY_FILTERS);
        setPage(1);
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedTransaction(null);
    };

    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                        <span>Home</span>
                        <span className="material-symbols-outlined text-[10px] font-black">chevron_right</span>
                        <span>Finance</span>
                        <span className="material-symbols-outlined text-[10px] font-black">chevron_right</span>
                        <span className="text-primary">Wallet Transactions</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Wallet Transaction History</h2>
                    <p className="text-lg text-slate-500 font-medium">Complete transaction ledger for all wallet activities.</p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 group disabled:opacity-60 disabled:cursor-not-allowed border border-white/10"
                >
                    <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`}>
                        refresh
                    </span>
                    <span>{isLoading ? 'Loading...' : 'Refresh Data'}</span>
                </button>
            </div>

            {/* Stats */}
            <StatCards
                pagination={pagination}
                transactions={transactions}
                isLoading={isLoading}
            />

            {/* Filters */}
            <TransactionFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            {/* Table + Pagination */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <TransactionTable
                    transactions={transactions}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onViewDetails={handleViewDetails}
                    onRetry={refetch}
                />

                <Pagination
                    pagination={pagination}
                    onPageChange={setPage}
                />
            </div>

            {/* Details Modal */}
            <TransactionDetailsModal
                transaction={selectedTransaction}
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
            />
        </div>
    );
}
