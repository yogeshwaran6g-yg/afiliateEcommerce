import React, { useState, useMemo } from "react";
import { 
    useRecharges, 
    useApproveRechargeMutation, 
    useRejectRechargeMutation 
} from "../../hooks/useRechargeService";

import StatCards from "./components/StatCards.jsx";
import RechargeFilters from "./components/RechargeFilters.jsx";
import RechargeTable from "./components/RechargeTable.jsx";
import Pagination from "./components/Pagination.jsx";
import ActionModal from "./components/ActionModal.jsx";

export default function Recharges() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 1;

    // Modal states
    const [selectedRecharge, setSelectedRecharge] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminComment, setAdminComment] = useState("");
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "APPROVE" or "REJECT"

    // Fetch recharges (ALWAYS fetch all for accurate tab counts and smooth frontend filtering)
    const { data: recharges = [], isLoading, error, refetch } = useRecharges(null);
    
    // Mutation hooks
    const approveMutation = useApproveRechargeMutation();
    const rejectMutation = useRejectRechargeMutation();

    const handleOpenActionModal = (recharge, type) => {
        setSelectedRecharge(recharge);
        setActionType(type);
        setAdminComment("");
        setIsActionModalOpen(true);
    };

    const handleAction = async () => {
        if (!selectedRecharge) return;
        try {
            setActionLoading(true);
            if (actionType === "APPROVE") {
                await approveMutation.mutateAsync({ requestId: selectedRecharge.id, adminComment });
            } else {
                await rejectMutation.mutateAsync({ requestId: selectedRecharge.id, adminComment });
            }
            setIsActionModalOpen(false);
        } catch (err) {
            console.error(err);
            alert(err.message || `Failed to ${actionType.toLowerCase()} recharge`);
        } finally {
            setActionLoading(false);
        }
    };

    // Filter and Search Logic (Frontend)
    const filteredRecharges = useMemo(() => {
        return recharges.filter(r => {
            // 1. Search Logic
            const matchesSearch = 
                r.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.user_phone?.includes(searchTerm) ||
                r.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase());
            
            // 2. Status Filter Logic
            const targetStatus = activeFilter === "All" ? null : activeFilter.toUpperCase().replace(" ", "_");
            const matchesStatus = !targetStatus || r.status === targetStatus;

            return matchesSearch && matchesStatus;
        });
    }, [recharges, searchTerm, activeFilter]);

    // Pagination Logic (Frontend)
    const total = filteredRecharges.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedRecharges = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredRecharges.slice(start, start + limit);
    }, [filteredRecharges, page, limit]);

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
        all: recharges.length,
        pending: recharges.filter(r => r.status === 'REVIEW_PENDING').length,
        approved: recharges.filter(r => r.status === 'APPROVED').length,
        rejected: recharges.filter(r => r.status === 'REJECTED').length,
    }), [recharges]);

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
                        <span className="text-primary">Recharges</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Recharge Requests</h2>
                    <p className="text-lg text-slate-500 font-medium">Approve or reject money added by users to their wallets.</p>
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
                recharges={recharges} 
                isLoading={isLoading} 
            />

            {/* Filters */}
            <RechargeFilters 
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                activeFilter={activeFilter}
                setActiveFilter={handleFilterChange}
                counts={counts}
            />

            {/* Table + Pagination */}
            <div className="space-y-6">
                <RechargeTable 
                    recharges={paginatedRecharges}
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
                selectedRecharge={selectedRecharge}
                adminComment={adminComment}
                setAdminComment={setAdminComment}
                handleAction={handleAction}
                actionLoading={actionLoading}
            />
        </div>
    );
}
