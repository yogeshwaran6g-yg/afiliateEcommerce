import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import userNotificationApiService from "../services/userNotificationApiService";
import userApiService from "../services/userApiService";

const NotificationDrawer = ({ isOpen, onClose, onSave, loading, users = [], initialUserId = "" }) => {
    const initialFormState = {
        user_id: initialUserId,
        type: "ORDER",
        title: "",
        description: "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...initialFormState, user_id: initialUserId });
        }
    }, [isOpen, initialUserId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const selectedUser = users.find(u => u.dbId === formData.user_id);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-black text-[#172b4d] tracking-tight">
                            Send User Notification
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Direct communication with partners
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    <div className="space-y-6">
                        <div className="space-y-2" ref={dropdownRef}>
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Recipient User <span className="text-red-500">*</span></label>

                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer flex justify-between items-center"
                                >
                                    <span className={selectedUser ? "" : "text-slate-400"}>
                                        {selectedUser ? `${selectedUser.name}` : "Select a user"}
                                    </span>
                                    <span className="material-symbols-outlined text-slate-400">
                                        expand_more
                                    </span>
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                        <div className="max-h-[160px] overflow-y-auto py-1 custom-scrollbar">
                                            {users.length > 0 ? (
                                                users.map(user => (
                                                    <div
                                                        key={user.dbId}
                                                        onClick={() => {
                                                            setFormData(p => ({ ...p, user_id: user.dbId }));
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-3 text-sm font-bold cursor-pointer hover:bg-slate-50 transition-colors ${formData.user_id === user.dbId ? 'text-primary bg-primary/5' : 'text-[#172b4d]'}`}
                                                    >
                                                        {user.name} 
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-center text-slate-400 text-xs font-bold">
                                                    No users found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Notification Type <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer flex justify-between items-center"
                                >
                                <option value="ORDER">Order</option>
                                <option value="PAYMENT">Payment</option>
                                <option value="WALLET">Wallet</option>
                                <option value="ACCOUNT">Account</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Short, catchy headline"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Message Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                placeholder="Detailed message content..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white/80 backdrop-blur-md border-t border-slate-50 flex items-center justify-end gap-4 z-20">
                    <button type="button" onClick={onClose} className="px-8 py-3.5 text-slate-600 text-sm font-black hover:bg-slate-50 rounded-2xl transition-all">
                        Discard
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3.5 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 leading-none disabled:opacity-50">
                        {loading ? "Processing..." : "Send Notification"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function UserNotifications() {
    const { userId } = useParams();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, [pagination.page, userId]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userApiService.getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setUsers([]);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (userId) {
                params.user_id = userId;
            }

            const data = await userNotificationApiService.getNotifications(params);
            if (data && data.items) {
                setNotifications(data.items);
                setPagination(data.pagination);
            } else {
                setNotifications([]);
            }
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load notifications");
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDrawer = () => {
        setDrawerOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            setDrawerLoading(true);
            await userNotificationApiService.sendNotification({
                user_id: formData.user_id,
                type: formData.type,
                title: formData.title,
                description: formData.description
            });
            setDrawerOpen(false);
            fetchNotifications();
        } catch (err) {
            alert(err.message || "Failed to send notification");
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this notification record?")) return;
        try {
            await userNotificationApiService.deleteNotification(id);
            fetchNotifications();
        } catch (err) {
            alert(err.message || "Failed to delete notification");
        }
    };

    if (loading && (!notifications || notifications.length === 0)) {
        return (
            <div className="p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Dispatch History...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span>Communication</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">Direct Messages</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#172b4d] tracking-tighter">Notification Hub</h2>
                    <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl">Send targeted alerts and messages to individual distributors via direct dispatch.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-sm font-bold">{error}</p>
                        <button onClick={fetchNotifications} className="ml-auto underline text-xs">Retry</button>
                    </div>
                )}

                <button
                    onClick={handleOpenDrawer}
                    className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white text-sm font-black rounded-3xl shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-45 transition-transform">send</span>
                    Dispatch Message
                </button>
            </div>

            <div className="bg-white rounded-5xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">RECIPIENT</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MESSAGE CONTENT</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TYPE</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {notifications.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {item?.user_name?.charAt(0) || item?.user_id}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-[#172b4d] tracking-tight truncate">{item?.user_name || 'System User'}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">Recipient ID: {item?.user_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="max-w-md">
                                            <h4 className="text-sm font-bold text-[#172b4d] tracking-tight">{item?.title}</h4>
                                            <p className="text-[11px] text-slate-400 font-medium truncate mt-1">{item?.description}</p>
                                            <p className="text-[9px] text-slate-300 mt-1 font-bold">{item?.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${item?.type === 'ORDER' ? 'bg-purple-50 text-purple-600' :
                                            item?.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600' :
                                                item?.type === 'WALLET' ? 'bg-indigo-50 text-indigo-600' :
                                                    item?.type === 'ACCOUNT' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-slate-50 text-slate-400'
                                            }`}>
                                            {item?.type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        {item.is_read ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <span className="material-symbols-outlined text-sm font-bold">done_all</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Seen</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <span className="material-symbols-outlined text-sm font-bold">mail</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Sent</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {notifications.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <span className="material-symbols-outlined text-6xl">outgoing_mail</span>
                                            <p className="text-sm font-bold">No dispatch history available yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing Page {pagination.page} of {pagination.pages} ({pagination.total} Records)
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <NotificationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSave={handleSave}
                loading={drawerLoading}
                users={users}
                initialUserId={userId}
            />
        </div>
    );
}
