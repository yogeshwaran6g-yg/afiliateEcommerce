import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserNotification, useMarkUserNotificationAsReadMutation, useMarkAllUserNotificationsAsReadMutation, useDeleteNotificationMutation } from "../hooks/useUserNotification";

export default function Notifications() {
    const [filter, setFilter] = useState("all"); // "all" or "unread"
    const navigate = useNavigate();

    // Use useUserNotification (admin feed) instead of useMyNotifications (personal feed)
    // admin feed is public on the server and returns all notifications
    const { data, isLoading } = useUserNotification({
        limit: 50,
        unread_only: filter === "unread"
    });

    if (data?.debug) {
        console.log("[DEBUG] Server Response Details:", data.debug);
    }

    // Fallback: If backend fails to filter, we filter locally
    const rawNotifications = data?.items || [];
    const notifications = filter === "unread"
        ? rawNotifications.filter(n => !n.is_read)
        : rawNotifications;

    const markAsReadMutation = useMarkUserNotificationAsReadMutation();
    const markAllReadMutation = useMarkAllUserNotificationsAsReadMutation();
    const deleteMutation = useDeleteNotificationMutation();

    const handleMarkAsRead = async (id) => {
        await markAsReadMutation.mutateAsync(id);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this notification record?")) return;
        await deleteMutation.mutateAsync(id);
    };

    const handleMarkAllRead = async () => {
        await markAllReadMutation.mutateAsync();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'ORDER': return 'shopping_cart';
            case 'PAYMENT': return 'payments';
            case 'WALLET': return 'account_balance_wallet';
            case 'ACCOUNT': return 'person';
            default: return 'notifications';
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Alerts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin Panel</span>
                        <span className="material-symbols-outlined text-xs md:text-sm">chevron_right</span>
                        <span className="text-primary font-black">All Notifications</span>
                    </div>
                    <h2 className="text-2xl md:text-5xl font-black text-[#172b4d] tracking-tighter" style={{fontFamily: '"Inter", sans-serif'}}>System Alerts</h2>
                    <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Monitor all user notifications, security flags, and administrative tasks in real-time.
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-2xl w-full md:w-fit shadow-sm overflow-x-auto">
                <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:bg-slate-50"}`}
                >
                    All Alerts
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === "unread" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:bg-slate-50"}`}
                >
                    Unread
                </button>
            </div>

            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group p-5 md:p-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-6 transition-all hover:bg-slate-50/50 ${!notification.is_read ? 'bg-primary/[0.03]' : ''}`}
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-slate-100 text-slate-600`}>
                                    <span className="material-symbols-outlined text-xl md:text-2xl font-bold">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 rounded-md bg-slate-200 text-slate-700`}>
                                                    {notification.type}
                                                </span>
                                                {!notification.is_read && (
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                                )}
                                                <h4 className="text-sm md:text-base font-bold text-[#172b4d] truncate">
                                                    {notification.title}
                                                </h4>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold shrink-0">
                                                {notification.created_at ? new Date(notification.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ''}
                                            </span>
                                        </div>
                                        
                                        {(() => {
                                            let desc = notification.description;
                                            let link = null;
                                            try {
                                                if (desc && (desc.startsWith('{') || desc.startsWith('['))) {
                                                    const meta = JSON.parse(desc);
                                                    desc = meta.text || desc;
                                                    link = meta.link;
                                                }
                                            } catch (e) {
                                                // Not JSON, use as is
                                            }

                                            return (
                                                <div className="space-y-3">
                                                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-4xl line-clamp-3 md:line-clamp-none">
                                                        {desc}
                                                    </p>
                                                    {link && (
                                                        <button 
                                                            onClick={() => navigate(link)}
                                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all group/btn"
                                                        >
                                                            <span>View Details</span>
                                                            <span className="material-symbols-outlined text-xs group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-0 md:opacity-0 group-hover:opacity-100 transition-all">
                                    {filter === 'unread' && !notification.is_read ? (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="flex-1 md:flex-none p-2.5 md:p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center justify-center border border-transparent md:border-none hover:border-primary/20"
                                            title="Mark as read"
                                        >
                                            <span className="material-symbols-outlined text-xl">done</span>
                                            <span className="md:hidden ml-2 text-xs font-bold">Mark Read</span>
                                        </button>
                                    ) : (
                                        <div className="hidden md:block w-11 h-11"></div>
                                    )}

                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="flex-1 md:flex-none p-2.5 md:p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center border border-transparent md:border-none hover:border-red-100"
                                        title="Delete Record"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                        <span className="md:hidden ml-2 text-xs font-bold">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 md:p-20 text-center space-y-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-3xl md:text-4xl text-slate-300">notifications_off</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[#172b4d]">No notifications</h3>
                            <p className="text-sm md:text-base text-slate-500 font-medium">No system alerts found in the database.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
