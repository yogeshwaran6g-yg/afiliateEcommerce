import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import orderApiService from "../services/orderApiService";
import { toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/common/Pagination";

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border ${styles[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
            {status}
        </span>
    );
};

export default function OrderPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    // URL params for deep linking
    const [searchParams] = useSearchParams();
    const orderNumberParam = searchParams.get("orderNumber");

    const [searchQuery, setSearchQuery] = useState(orderNumberParam || "");
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Modal state
    const [selectedProof, setSelectedProof] = useState(null);
    const [actionModal, setActionModal] = useState({ show: false, payment: null, action: '', comment: '' });

    useEffect(() => {
        if (orderNumberParam) {
            setSearchQuery(orderNumberParam);
        }
    }, [orderNumberParam]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, statusFilter]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await orderApiService.getOrderPayments({
                page: currentPage,
                limit: itemsPerPage,
                status: statusFilter,
                search: debouncedSearchQuery
            });
            setPayments(data.payments);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            toast.error("Failed to fetch order payments");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [currentPage, statusFilter, debouncedSearchQuery]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setCurrentPage(1);
        // fetchPayments() will be triggered by useEffect due to state change if search/page changes
    };

    const handleAction = async () => {
        const { payment, action, comment } = actionModal;
        if (!payment || !action) return;

        try {
            if (action === 'APPROVE') {
                await orderApiService.approvePayment(payment.order_id, comment);
                toast.success("Payment approved successfully");
            } else {
                await orderApiService.rejectPayment(payment.order_id, comment);
                toast.success("Payment rejected");
            }
            setActionModal({ show: false, payment: null, action: '', comment: '' });
            fetchPayments();
        } catch (err) {
            toast.error(`Failed to ${action.toLowerCase()} payment`);
            console.error(err);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-slate-50/30 min-h-screen font-display">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                        <span className="material-symbols-outlined font-bold">chevron_right</span>
                        <span className="text-primary">Order Payment</span>
                    </div>
                    <h2 className="font-bold text-slate-800 tracking-tight">Order Payment</h2>
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">View and verify manual payment submissions from users.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <form onSubmit={handleSearch} className="relative group min-w-[300px]">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Order #, User, Reference..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="px-6 py-3.5 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm appearance-none min-w-[160px]"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
                                <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Payment Info</th>
                                <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Proof</th>
                                <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="font-bold text-slate-700">#{payment.order_number}</div>
                                            <div className="font-bold text-primary tracking-widest uppercase">₹{payment.total_amount}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="font-bold text-slate-700">{payment.user_name}</div>
                                            <div className="text-slate-400 font-bold">{payment.user_email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="font-bold text-slate-600">{payment.payment_type}</div>
                                            <div className="text-slate-400 font-bold tracking-wider">Ref: {payment.transaction_reference}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => setSelectedProof(payment.proof_url)}
                                            className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden hover:scale-110 active:scale-95 transition-all shadow-sm cursor-zoom-in"
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${payment.proof_url}`}
                                                alt="Proof"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Proof'; }}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {payment.status === 'PENDING' && (
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setActionModal({ show: true, payment, action: 'APPROVE', comment: '' })}
                                                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Approve Payment"
                                                >
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </button>
                                                <button
                                                    onClick={() => setActionModal({ show: true, payment, action: 'REJECT', comment: '' })}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Reject Payment"
                                                >
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </button>
                                            </div>
                                        )}
                                        <div className="font-bold text-slate-400 group-hover:hidden uppercase tracking-widest">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-slate-400 font-medium italic">
                                        No payment records found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={payments.length * totalPages} // Approximation since we don't have total count in state
                    itemsPerPage={itemsPerPage}
                    label="payments"
                />
            </div>

            {/* Image Preview Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedProof(null)}></div>
                    <div className="relative max-w-4xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedProof(null)}
                            className="absolute right-6 top-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full flex items-center justify-center transition-all z-10"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <img
                            src={`${import.meta.env.VITE_API_URL}${selectedProof}`}
                            alt="Proof Full"
                            className="w-full h-auto max-h-[85vh] object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {actionModal.show && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal({ ...actionModal, show: false })}></div>
                    <div className="relative max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 space-y-6 text-center">
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-2 ${actionModal.action === 'APPROVE' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                            <span className="material-symbols-outlined text-4xl">
                                {actionModal.action === 'APPROVE' ? 'verified_user' : 'report_off'}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-800">
                                {actionModal.action === 'APPROVE' ? 'Approve Payment?' : 'Reject Payment?'}
                            </h3>
                            <p className="font-bold text-slate-500 px-4">
                                Confirm the manual payment for Order <span className="font-bold">#{actionModal.payment.order_number}</span>.
                            </p>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="font-bold text-slate-400 uppercase tracking-widest ml-1 block">Comment (Optional)</label>
                            <textarea
                                placeholder="Add a reason or transaction info..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none"
                                value={actionModal.comment}
                                onChange={(e) => setActionModal({ ...actionModal, comment: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setActionModal({ ...actionModal, show: false })}
                                className="flex-1 py-4 border border-slate-100 rounded-2xl font-bold text-sm text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleAction}
                                className={`flex-1 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${actionModal.action === 'APPROVE' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}
                            >
                                CONFIRM {actionModal.action}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
