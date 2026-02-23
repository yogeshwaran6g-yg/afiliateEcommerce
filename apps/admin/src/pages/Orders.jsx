import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import orderApiService from "../services/orderApiService";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/common/Pagination";

export default function Orders() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get("search");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParam || "");

    useEffect(() => {
        if (searchParam !== null) {
            setSearchTerm(searchParam);
        }
    }, [searchParam]);
    const [statusFilter, setStatusFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Reset pagination when filters change
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearchTerm, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, statusFilter, debouncedSearchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderApiService.getOrders({
                page: pagination.page,
                limit: pagination.limit,
                status: statusFilter,
                search: debouncedSearchTerm
            });
            setOrders(data.orders);
            setPagination(prev => ({ ...prev, total: data.pagination.total, totalPages: data.pagination.totalPages }));
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'PROCESSING': return 'bg-sky-50 text-sky-700 border-sky-200';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPaymentMethodColor = (method) => {
        switch (method?.toUpperCase()) {
            case 'WALLET': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
            case 'MANUAL': return 'bg-orange-50 text-orange-600 border-orange-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toUpperCase()) {
            case 'PRODUCT_PURCHASE': case 'PRODUCT PURCHASE': return 'bg-violet-50 text-violet-600 border-violet-200';
            case 'ACTIVATION': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    // Truncate order number for display
    const truncateOrderNumber = (num) => {
        if (!num) return '';
        if (num.length <= 16) return num;
        return num.slice(0, 8) + '…' + num.slice(-4);
    };

    // Initial loading state only (when no data exists)
    const isInitialLoading = loading && orders.length === 0 && pagination.page === 1;

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <span>Admin</span>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span className="text-primary font-bold">Orders</span>
                    </div>
                    <h2 className="font-bold text-slate-800 tracking-tight">Order Management</h2>
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">View and track all customer transactions and order fulfillment.</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl font-bold">shopping_cart</span>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Orders</h5>
                        <div className="text-2xl font-bold text-[#172b4d] tracking-tighter">{pagination.total}</div>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                {/* Filters */}
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <form onSubmit={handleSearch} className="relative w-full lg:w-96 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by order ID, name, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                        />
                    </form>

                    <div className="flex items-center gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer pr-10 relative"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="relative">
                    {/* Inline Loading Overlay */}
                    {loading && orders.length > 0 && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                            </div>
                        </div>
                    )}

                    {isInitialLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
                            <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                            <p className="text-slate-500 font-bold uppercase tracking-widest">Syncing Orders Data...</p>
                        </div>
                    ) : error ? (
                        <div className="p-20 text-center">
                            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                            <h3 className="font-bold text-red-900 mb-2">Fetch Error</h3>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className="bg-slate-50/70 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Order Details</th>
                                    <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order, i) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors cursor-default" title={`#${order.order_number}`}>
                                                    #{truncateOrderNumber(order.order_number)}
                                                </h4>
                                                <p className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    {new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-primary shadow-sm group-hover:bg-white transition-colors">
                                                    {order.user_name?.charAt(0)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-slate-800 leading-none">{order.user_name}</p>
                                                    <p className="text-slate-400 font-bold uppercase tracking-wider leading-none">{order.user_phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-emerald-600">₹{Number(order.total_amount).toLocaleString()}</p>
                                                <p className={`font-bold uppercase tracking-widest leading-none ${order.payment_method === 'WALLET' ? 'text-indigo-500' : 'text-orange-500'}`}>{order.payment_method}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${order.order_type === 'PRODUCT_PURCHASE' ? 'text-violet-600 bg-violet-50 border border-violet-100' : 'text-cyan-600 bg-cyan-50 border border-cyan-100'}`}>
                                                {order.order_type === 'PRODUCT_PURCHASE' ? 'Purchase' : order.order_type === 'ACTIVATION' ? 'Activation' : order.order_type?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                    className="p-2 text-slate-400 hover:text-primary transition-all hover:scale-110 hover:bg-primary/5 rounded-xl"
                                                    title="View Details"
                                                >
                                                    <span className="material-symbols-outlined font-bold text-[20px]">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/order-tracking?orderNumber=${order.order_number}`)}
                                                    className="p-2 text-slate-400 hover:text-indigo-500 transition-all hover:scale-110 hover:bg-indigo-50 rounded-xl"
                                                    title="Track Order"
                                                >
                                                    <span className="material-symbols-outlined font-bold text-[20px]">local_shipping</span>
                                                </button>
                                                {order.payment_method === 'MANUAL' && (
                                                    <button
                                                        onClick={() => navigate(`/order-payment?orderNumber=${order.order_number}`)}
                                                        className="p-2 text-slate-400 hover:text-emerald-500 transition-all hover:scale-110 hover:bg-emerald-50 rounded-xl"
                                                        title="View Payment Proof"
                                                    >
                                                        <span className="material-symbols-outlined font-bold text-[20px]">payments</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    limit={pagination.limit}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                    onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
                />
            </div>
        </div>
    );
}
