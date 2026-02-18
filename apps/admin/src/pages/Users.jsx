import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userApiService from "../services/userApiService";


export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal states
    const [viewUser, setViewUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalActionLoading, setModalActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userApiService.getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = async (dbId) => {
        try {
            setModalActionLoading(true);
            const details = await userApiService.getUserDetails(dbId);
            setViewUser(details);
            setIsViewModalOpen(true);
        } catch (err) {
            alert(err.message || "Failed to fetch user details");
        } finally {
            setModalActionLoading(false);
        }
    };

    const handleEditUser = async (dbId) => {
        try {
            setModalActionLoading(true);
            const details = await userApiService.getUserDetails(dbId);
            setEditUser(details);
            setIsEditModalOpen(true);
        } catch (err) {
            alert(err.message || "Failed to fetch user details");
        } finally {
            setModalActionLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            setModalActionLoading(true);
            await userApiService.updateUser(editUser.id, {
                name: editUser.name,
                email: editUser.email,
                phone: editUser.phone,
                account_activation_status: editUser.account_activation_status,
                is_blocked: editUser.is_blocked
            });
            setIsEditModalOpen(false);
            fetchUsers(); // Refresh the list
        } catch (err) {
            alert(err.message || "Failed to update user");
        } finally {
            setModalActionLoading(false);
        }
    };



    const handleBlockUser = async (dbId) => {
        if (!confirm("Are you sure you want to DENY access for this distributor?")) return;
        try {
            setLoading(true);
            await userApiService.updateUser(dbId, { is_blocked: true });
            fetchUsers();
        } catch (err) {
            alert(err.message || "Failed to block user");
            setLoading(false);
        }
    };

    const handleUnblockUser = async (dbId) => {
        if (!confirm("Are you sure you want to RESTORE access for this distributor?")) return;
        try {
            setLoading(true);
            await userApiService.updateUser(dbId, { is_blocked: false });
            fetchUsers();
        } catch (err) {
            alert(err.message || "Failed to unblock user");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-semibold text-sm animate-pulse">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="bg-red-50 border border-red-100 p-8 rounded-4xl text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h3 className="text-xl font-bold text-red-900 mb-2">Connection Error</h3>
                    <p className="text-red-700 font-medium mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }


    const filteredUsers = users.filter(user => {
        if (statusFilter === 'ALL') return true;
        return user.status === statusFilter;
    });

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-slate-50/30 min-h-screen font-display">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary">Users</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Users</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Manage and oversee all user accounts.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all group">
                        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Tab & Search Control Bar */}
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    {/* Segmented Tabs */}
                    <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center overflow-x-auto no-scrollbar min-w-0">
                        {[
                            { label: 'All Users', value: 'ALL', count: users.length },
                            { label: 'Active', value: 'ACTIVE', count: users.filter(u => u.status === 'ACTIVE').length },
                            { label: 'Blocked', value: 'BLOCKED', count: users.filter(u => u.status === 'BLOCKED').length },
                            { label: 'Pending', value: 'INACTIVE', count: users.filter(u => u.status === 'INACTIVE').length }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === tab.value
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] ${statusFilter === tab.value ? 'bg-primary/10 text-primary' : 'bg-slate-200/50 text-slate-400'
                                    }`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Compact Search */}
                    <div className="relative flex-1 group max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/50 border-b border-slate-50">
                            <tr>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined On</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user, i) => (
                                <tr key={i} className={`hover:bg-slate-50/50 transition-colors group`}>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full ${user.color || 'bg-slate-100 text-slate-600'} flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200`}>
                                                {user.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 tracking-tight truncate">{user.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5 truncate">ID: {user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-xs font-semibold text-slate-600">{user.joined}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : (user.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <button
                                                onClick={() => navigate(`/users/${user.dbId}`)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View User Modal */}
            {isViewModalOpen && viewUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="p-8 md:p-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">User Details</h3>
                                <button onClick={() => setIsViewModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                        <p className="text-base font-semibold text-slate-800">{viewUser.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</label>
                                        <p className="text-sm font-semibold text-slate-700">{viewUser.email || 'N/A'}</p>
                                        <p className="text-sm font-medium text-slate-500">{viewUser.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Referral ID</label>
                                        <p className="text-sm font-bold text-primary">{viewUser.referral_id}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wallet Balance</label>
                                        <p className="text-xl font-bold text-slate-800">₹{Number(viewUser.balance || 0).toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Locked: ₹{Number(viewUser.locked_balance || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                                        <div>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${viewUser.account_activation_status === 'ACTIVATED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {viewUser.account_activation_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-3 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-all shadow-md active:scale-95">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <form onSubmit={handleUpdateUser} className="p-8 md:p-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Edit User</h3>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        value={editUser.name}
                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        value={editUser.email || ''}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                            value={editUser.phone}
                                            onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Access Status</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none"
                                            value={editUser.is_blocked ? "1" : "0"}
                                            onChange={(e) => setEditUser({ ...editUser, is_blocked: e.target.value === "1" })}
                                        >
                                            <option value="0">ALLOW ACCESS</option>
                                            <option value="1">DENY ACCESS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95">
                                    {modalActionLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
