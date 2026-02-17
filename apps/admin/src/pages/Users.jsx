import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userApiService from "../services/userApiService";


export default function Users() {
    const navigate = useNavigate();
    const [selectedUsers, setSelectedUsers] = useState([]);
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

    const toggleSelect = (id) => {
        setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
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
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Distributor Data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="bg-red-50 border border-red-100 p-8 rounded-4xl text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h3 className="text-xl font-black text-red-900 mb-2">Connection Error</h3>
                    <p className="text-red-700 font-medium mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white text-sm font-black rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
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
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Enterprise Control</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">Distributor Registry</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#172b4d] tracking-tighter">Identity Management</h2>
                    <p className="text-sm md:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">Review and authorize partner access across the global unilevel infrastructure.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">cloud_download</span>
                        Export Dossier
                    </button>
                </div>
            </div>

            {/* Tab & Search Control Bar */}
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    {/* Segmented Tabs */}
                    <div className="bg-slate-50 p-1.5 rounded-[2.2rem] flex items-center overflow-x-auto no-scrollbar min-w-0">
                        {[
                            { label: 'All Partners', value: 'ALL', count: users.length },
                            { label: 'Active', value: 'ACTIVE', count: users.filter(u => u.status === 'ACTIVE').length },
                            { label: 'Blocked', value: 'BLOCKED', count: users.filter(u => u.status === 'BLOCKED').length },
                            { label: 'Pending', value: 'INACTIVE', count: users.filter(u => u.status === 'INACTIVE').length }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === tab.value
                                    ? 'bg-white text-primary shadow-lg shadow-primary/10'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] ${statusFilter === tab.value ? 'bg-primary/10 text-primary' : 'bg-slate-200/50 text-slate-400'
                                    }`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Compact Search */}
                    <div className="relative flex-1 group max-w-md">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Identify subject by name, ID or email..."
                            className="w-full bg-slate-50 border border-transparent rounded-[2rem] pl-14 pr-6 py-4 text-xs font-bold text-[#172b4d] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-5xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-3">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                                </th>
                                <th className="px-10 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">USER DETAILS</th>
                                <th className="px-10 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">JOINED DATE</th>
                                <th className="px-10 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                <th className="px-10 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user, i) => (
                                <tr key={i} className={`hover:bg-slate-50/50 transition-colors group ${selectedUsers.includes(user.id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-10 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelect(user.id)}
                                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-10 py-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full ${user.color || 'bg-blue-100 text-blue-600'} flex items-center justify-center font-black text-xs shadow-sm shadow-black/5 shrink-0`}>
                                                {user.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-[#172b4d] tracking-tight truncate">{user.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">ID: {user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-3">
                                        <span className="text-sm font-medium text-slate-500">{user.joined}</span>
                                    </td>
                                    <td className="px-10 py-3">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : (user.status === 'BLOCKED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-3">
                                        <div className="flex items-center justify-end gap-3 px-4">
                                            <button
                                                onClick={() => navigate(`/users/${user.dbId}`)}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                                            >
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                            {/* <button
                                                onClick={() => handleEditUser(user.dbId)}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                                            >
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            {user.status === 'ACTIVE' || user.status === 'INACTIVE' ? (
                                                <button
                                                    onClick={() => handleBlockUser(user.dbId)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">block</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnblockUser(user.dbId)}
                                                    className={`p-2.5 rounded-xl transition-all ${user.status === 'BLOCKED' ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                                                >
                                                    <span className="material-symbols-outlined text-xl">{user.status === 'BLOCKED' ? 'check_circle' : 'how_to_reg'}</span>
                                                </button>
                                            )} */}
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
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-[#172b4d] tracking-tight">Distributor Dossier</h3>
                                <button onClick={() => setIsViewModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Identity</label>
                                        <p className="text-lg font-bold text-[#172b4d]">{viewUser.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication</label>
                                        <p className="text-sm font-bold text-[#172b4d]">{viewUser.email || 'N/A'}</p>
                                        <p className="text-sm font-medium text-slate-500">{viewUser.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Affiliate ID</label>
                                        <p className="text-sm font-black text-primary">{viewUser.referral_id}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet Reservoir</label>
                                        <p className="text-2xl font-black text-[#172b4d]">₹{Number(viewUser.balance || 0).toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">LOCKED: ₹{Number(viewUser.locked_balance || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</label>
                                        <div>
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${viewUser.account_activation_status === 'ACTIVATED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {viewUser.account_activation_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex justify-end">
                                <button onClick={() => setIsViewModalOpen(false)} className="px-8 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                                    Acknowledge
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
                        <form onSubmit={handleUpdateUser} className="p-8 md:p-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-[#172b4d] tracking-tight">Modify Parameters</h3>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Distributor Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all underline-offset-4"
                                        value={editUser.name}
                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Endpoint (Email)</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        value={editUser.email || ''}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Link</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                            value={editUser.phone}
                                            onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">System Restriction</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none"
                                            value={editUser.is_blocked ? "1" : "0"}
                                            onChange={(e) => setEditUser({ ...editUser, is_blocked: e.target.value === "1" })}
                                        >
                                            <option value="0">ALLOW ACCESS</option>
                                            <option value="1">DENY ACCESS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex gap-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 text-sm font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
                                    Discard
                                </button>
                                <button type="submit" className="flex-2 px-8 py-4 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95">
                                    {modalActionLoading ? 'Synchronizing...' : 'Authorize Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
