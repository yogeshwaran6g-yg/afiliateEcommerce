import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    useOrderPayments, 
    useApprovePaymentMutation, 
    useRejectPaymentMutation 
} from "../../hooks/useOrder.hook";

import OrderPaymentStatCards from "./components/OrderPaymentStatCards.jsx";
import OrderPaymentFilters from "./components/OrderPaymentFilters.jsx";
import OrderPaymentTable from "./components/OrderPaymentTable.jsx";
import Pagination from "./components/Pagination.jsx";
import ActionModal from "./components/ActionModal.jsx";

export default function OrderPayments() {
    const [searchParams] = useSearchParams();
    const orderNumberParam = searchParams.get("orderNumber");

    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState(orderNumberParam || "");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modal states
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [adminComment, setAdminComment] = useState("");
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "APPROVE" or "REJECT"
    const [selectedProof, setSelectedProof] = useState(null);

    // Sync URL param
    useEffect(() => {
        if (orderNumberParam && searchTerm !== orderNumberParam) {
            setSearchTerm(orderNumberParam);
            setPage(1);
        }
    }, [orderNumberParam]);

    // Build query params
    const queryParams = {
        page: 1, // We fetch all for easier frontend filtering and accurate counts across tabs
        limit: 1000, 
        status: activeFilter === "All" ? "" : activeFilter.toUpperCase(),
        search: searchTerm
    };

    const { data, isLoading, refetch } = useOrderPayments(queryParams);
    const payments = data?.payments || [];
    const counts = data?.counts || { ALL: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };

    // Mutation hooks
    const approveMutation = useApprovePaymentMutation();
    const rejectMutation = useRejectPaymentMutation();

    const handleOpenActionModal = (payment, type) => {
        setSelectedPayment(payment);
        setActionType(type);
        setAdminComment("");
        setIsActionModalOpen(true);
    };

    const handleAction = async () => {
        if (!selectedPayment) return;
        try {
            setActionLoading(true);
            if (actionType === "APPROVE") {
                await approveMutation.mutateAsync({ orderId: selectedPayment.order_id, adminComment });
                toast.success("Payment approved successfully");
            } else {
                await rejectMutation.mutateAsync({ orderId: selectedPayment.order_id, reason: adminComment });
                toast.success("Payment rejected");
            }
            setIsActionModalOpen(false);
            refetch();
        } catch (err) {
            console.error(err);
            toast.error(err.message || `Failed to ${actionType.toLowerCase()} payment`);
        } finally {
            setActionLoading(false);
        }
    };

    // Frontend pagination of the fetched results
    const paginatedPayments = useMemo(() => {
        const start = (page - 1) * limit;
        return payments.slice(start, start + limit);
    }, [payments, page, limit]);

    const totalPages = Math.ceil((data?.total || payments.length) / limit);

    return (
        <div className="p-8 lg:p-12 space-y-10 font-display min-h-screen bg-slate-50/20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-[10px] font-black">chevron_right</span>
                        <span>Orders</span>
                        <span className="material-symbols-outlined text-[10px] font-black">chevron_right</span>
                        <span className="text-primary">Order Payments</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Order Payments</h2>
                    <p className="text-lg text-slate-500 font-medium">Verify manual payment proofs submitted for product and activation orders.</p>
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
            <OrderPaymentStatCards 
                payments={payments} 
                counts={counts}
                isLoading={isLoading} 
            />

            {/* Filters */}
            <OrderPaymentFilters 
                searchTerm={searchTerm}
                setSearchTerm={(val) => { setSearchTerm(val); setPage(1); }}
                activeFilter={activeFilter}
                setActiveFilter={(val) => { setActiveFilter(val); setPage(1); }}
                counts={counts}
            />

            {/* Table + Pagination */}
            <div className="space-y-6">
                <OrderPaymentTable 
                    payments={paginatedPayments}
                    isLoading={isLoading}
                    onAction={handleOpenActionModal}
                    onPreview={setSelectedProof}
                />

                <Pagination 
                    page={page}
                    totalPages={totalPages}
                    total={data?.total || payments.length}
                    limit={limit}
                    onPageChange={setPage}
                />
            </div>

            {/* Actions Modal */}
            <ActionModal 
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                actionType={actionType}
                selectedPayment={selectedPayment}
                adminComment={adminComment}
                setAdminComment={setAdminComment}
                handleAction={handleAction}
                actionLoading={actionLoading}
            />

            {/* Image Preview Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setSelectedProof(null)}></div>
                    <div className="relative max-w-5xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="absolute right-8 top-8 z-10">
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="w-14 h-14 bg-white/20 hover:bg-white/40 text-white backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90"
                            >
                                <span className="material-symbols-outlined text-3xl font-black">close</span>
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[400px]">
                            <img
                                src={`${import.meta.env.VITE_API_URL}${selectedProof}`}
                                alt="Proof Full"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl border border-slate-100"
                            />
                        </div>
                        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">image</span>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Payment Verification Proof</span>
                            </div>
                            <a 
                                href={`${import.meta.env.VITE_API_URL}${selectedProof}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                Open Original
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
