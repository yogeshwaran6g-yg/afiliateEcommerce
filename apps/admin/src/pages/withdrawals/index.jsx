import React, { useState, useMemo } from "react";
import { 
    useWithdrawals, 
    useApproveWithdrawalMutation, 
    useRejectWithdrawalMutation 
} from "../../hooks/useWithdrawalService";

import StatCards from "./components/StatCards.jsx";
import WithdrawalFilters from "./components/WithdrawalFilters.jsx";
import WithdrawalTable from "./components/WithdrawalTable.jsx";
import Pagination from "./components/Pagination.jsx";
import ActionModal from "./components/ActionModal.jsx";

export default function Withdrawals() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modal states
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminComment, setAdminComment] = useState("");
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "APPROVE" or "REJECT"

    // Fetch withdrawals (Status logic handled in useMemo below for accurate counts)
    const { data: withdrawals = [], isLoading, error, refetch } = useWithdrawals(null);
    
    // Mutation hooks
    const approveMutation = useApproveWithdrawalMutation();
    const rejectMutation = useRejectWithdrawalMutation();

    const handleOpenActionModal = (withdrawal, type) => {
        setSelectedWithdrawal(withdrawal);
        setActionType(type);
        setAdminComment("");
        setIsActionModalOpen(true);
    };

    const handleAction = async () => {
        if (!selectedWithdrawal) return;
        try {
            setActionLoading(true);
            if (actionType === "APPROVE") {
                await approveMutation.mutateAsync({ requestId: selectedWithdrawal.id, adminComment });
            } else {
                await rejectMutation.mutateAsync({ requestId: selectedWithdrawal.id, adminComment });
            }
            setIsActionModalOpen(false);
        } catch (err) {
            console.error(err);
            alert(err.message || `Failed to ${actionType.toLowerCase()} withdrawal`);
        } finally {
            setActionLoading(false);
        }
    };

    // Filter and Search Logic
    const filteredWithdrawals = useMemo(() => {
        return withdrawals.filter(w => {
            // 1. Search Logic
            const matchesSearch = 
                w.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.user_phone?.includes(searchTerm);
            
            // 2. Status Filter Logic
            const targetStatus = activeFilter === "All" ? null : activeFilter.toUpperCase().replace(" ", "_");
            const matchesStatus = !targetStatus || w.status === targetStatus;

            return matchesSearch && matchesStatus;
        });
    }, [withdrawals, searchTerm, activeFilter]);

    // Pagination Logic
    const total = filteredWithdrawals.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedWithdrawals = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredWithdrawals.slice(start, start + limit);
    }, [filteredWithdrawals, page, limit]);

    // Handle filter/search resets
    const handleFilterChange = (val) => {
        setActiveFilter(val);
        setPage(1);
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setPage(1);
    };

    // Counts for filters
    const counts = useMemo(() => ({
        all: withdrawals.length,
        pending: withdrawals.filter(w => w.status === 'REVIEW_PENDING').length,
        disbursed: withdrawals.filter(w => w.status === 'APPROVED').length,
        voided: withdrawals.filter(w => w.status === 'REJECTED').length,
    }), [withdrawals]);

    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-[10px] font-black">chevron_right</span>
                        <span>Finance</span>
                        <span className="material-symbols-outlined text-[10px] font-black">chevron_right</span>
                        <span className="text-primary">Withdrawals</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Withdrawal Requests</h2>
                    <p className="text-lg text-slate-500 font-medium">Manage and approve member withdrawal requests from their wallet.</p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 group disabled:opacity-60 disabled:cursor-not-allowed border border-white/10"
                >
                    <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`}>
                        refresh
                    </span>
                    <span>{isLoading ? 'Loading...' : 'Refresh List'}</span>
                </button>
            </div>

            {/* Stats */}
            <StatCards 
                withdrawals={withdrawals} 
                isLoading={isLoading} 
            />

            {/* Filters */}
            <WithdrawalFilters 
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                activeFilter={activeFilter}
                setActiveFilter={handleFilterChange}
                counts={counts}
            />

            {/* Table + Pagination */}
            <div className="space-y-6">
                <WithdrawalTable 
                    withdrawals={paginatedWithdrawals}
                    isLoading={isLoading}
                    onAction={handleOpenActionModal}
                />

                <Pagination 
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    onPageChange={setPage}
                />
            </div>

            {/* Actions Modal */}
            <ActionModal 
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                actionType={actionType}
                selectedWithdrawal={selectedWithdrawal}
                adminComment={adminComment}
                setAdminComment={setAdminComment}
                handleAction={handleAction}
                actionLoading={actionLoading}
            />
        </div>
    );
}
