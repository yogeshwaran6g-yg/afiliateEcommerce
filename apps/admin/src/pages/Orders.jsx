import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderApiService from "../services/orderApiService";

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderApiService.getOrders({
                page: pagination.page,
                limit: pagination.limit,
                status: statusFilter,
                search: searchTerm
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
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchOrders();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    if (loading && pagination.page === 1) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing Orders Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary font-bold">Orders</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Order Management</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">View and track all customer transactions and order fulfillment.</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl font-bold">shopping_cart</span>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Orders</h5>
                        <div className="text-2xl font-black text-[#172b4d] tracking-tighter">{pagination.total}</div>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                {/* Filters */}
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <form onSubmit={handleSearch} className="relative w-full lg:w-96 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by order ID, name, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                        />
                    </form>

                    <div className="flex items-center gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer pr-10 relative"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Showing {orders.length} results</p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {error ? (
                        <div className="p-20 text-center">
                            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                            <h3 className="text-xl font-black text-red-900 mb-2">Fetch Error</h3>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className="bg-slate-50/70 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Order Details</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Customer</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Amount</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Type</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order, i) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">#{order.order_number}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                                    {new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-primary shadow-sm group-hover:bg-white transition-colors">
                                                    {order.user_name?.charAt(0)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-slate-800 leading-none">{order.user_name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{order.user_phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-slate-800">₹{Number(order.total_amount).toLocaleString()}</p>
                                                <p className="text-[10px] text-primary/70 font-black uppercase tracking-widest">{order.payment_method}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2.5 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black tracking-widest border border-slate-100 uppercase inline-block">
                                                {order.order_type?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(order.status)}`}>
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

                {/* Pagination */}
                <div className="p-6 md:p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {pagination.page} of {pagination.totalPages || 1}</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                        </button>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
