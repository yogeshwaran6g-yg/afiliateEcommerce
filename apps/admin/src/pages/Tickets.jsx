import React, { useState, useEffect } from "react";

const STATUS_COLORS = {
    OPEN: 'bg-blue-100 text-blue-700',
    IN_REVIEW: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-slate-100 text-slate-500'
};

const PRIORITY_COLORS = {
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-orange-100 text-orange-600',
    HIGH: 'bg-red-100 text-red-600'
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

const TicketRow = ({ ticket, onUpdateStatus }) => {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg text-primary">
                            account_circle
                        </span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#172b4d]">{ticket.user_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            ID: {ticket.user_id} · {ticket.user_phone}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="max-w-xs">
                    <h4 className="text-sm font-bold text-[#172b4d]">{ticket.subject}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {ticket.category}
                    </p>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                </span>
            </td>
            <td className="px-8 py-5">
                <select
                    value={ticket.status}
                    onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none cursor-pointer focus:ring-0 ${STATUS_COLORS[ticket.status]}`}
                >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_REVIEW">IN REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CLOSED">CLOSED</option>
                </select>
            </td>
            <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </td>
            <td className="px-8 py-5">
                <div className="text-xs text-slate-400 max-w-xs truncate" title={ticket.description}>
                    {ticket.description}
                </div>
            </td>
        </tr>
    );
};

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({
        search: '',
        userId: '',
        category: '',
        priority: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchTickets();
    }, [pagination.page, filters]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
            });

            const response = await fetch(`http://localhost:4000/api/v1/admin/tickets?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });

            const data = await response.json();
            if (data.success) {
                setTickets(data.data.tickets);
                setPagination(prev => ({ ...prev, ...data.data.pagination }));
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (ticketId, newStatus) => {
        try {
            const response = await fetch('http://localhost:4000/api/v1/admin/tickets/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ ticketId, status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating ticket status:', error);
            alert('Error updating ticket status');
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
            category: '',
            priority: '',
            status: '',
            startDate: '',
            endDate: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="p-8 lg:p-12 space-y-10">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span>Home</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span>Support</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">Support Tickets</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Support Management</h2>
                    <p className="text-lg text-slate-500 font-medium">Monitor and respond to customer support requests.</p>
                </div>

                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-180 transition-transform">refresh</span>
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Stats Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <StatCard
                    title="Total Tickets"
                    value={pagination.total}
                    subtitle="All time requests"
                    bgColor="bg-white border border-slate-100 shadow-sm"
                    icon="confirmation_number"
                />
                <StatCard
                    title="Open Tickets"
                    value={tickets.filter(t => t.status === 'OPEN').length}
                    subtitle="Awaiting response"
                    bgColor="bg-blue-500 shadow-blue-500/30"
                />
                <StatCard
                    title="In Review"
                    value={tickets.filter(t => t.status === 'IN_REVIEW').length}
                    subtitle="Currently processing"
                    bgColor="bg-yellow-500 shadow-yellow-500/30"
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Filter Tickets</h3>
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
                            placeholder="Search by subject, description, or user..."
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
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">All Categories</option>
                            <option value="ORDER">Order</option>
                            <option value="PAYMENT">Payment</option>
                            <option value="WALLET">Wallet</option>
                            <option value="ACCOUNT">Account</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
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
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Created At</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                                            <span className="text-sm font-bold text-slate-400">Loading tickets...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-6xl text-slate-200">confirmation_number</span>
                                            <span className="text-sm font-bold text-slate-400">No tickets found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tickets.map(ticket => (
                                    <TicketRow key={ticket.id} ticket={ticket} onUpdateStatus={handleUpdateStatus} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
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
        </div>
    );
}
