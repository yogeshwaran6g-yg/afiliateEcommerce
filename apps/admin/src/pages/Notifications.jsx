import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUserNotification, useMarkUserNotificationAsReadMutation, useMarkAllUserNotificationsAsReadMutation, useDeleteNotificationMutation } from "../hooks/useUserNotification";

export default function Notifications() {
    const [filter, setFilter] = useState("all"); // "all" or "unread"

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
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin Panel</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-bold">All Notifications</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#172b4d] tracking-tighter">System Alerts</h2>
                    <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl">
                        Monitor all user notifications, security flags, and administrative tasks in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-6 py-3 text-slate-600 text-sm font-bold hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
                    >
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:bg-slate-50"}`}
                >
                    All Alerts
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === "unread" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:bg-slate-50"}`}
                >
                    Unread
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6 transition-all hover:bg-slate-50/50 ${!notification.is_read ? 'bg-primary/2' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-slate-100 text-slate-600`}>
                                    <span className="material-symbols-outlined text-2xl font-bold">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-200 text-slate-700`}>
                                                {notification.type}
                                            </span>
                                            {!notification.is_read && (
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                            )}
                                            <h4 className="text-sm md:text-base font-bold text-[#172b4d]">{notification.title}</h4>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl">
                                        {notification.description}
                                    </p>
                                    {notification.user_name && (
                                        <div className="pt-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-xs text-slate-400">person</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                To: {notification.user_name} ({notification.user_phone})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            title="Mark as read"
                                        >
                                            <span className="material-symbols-outlined text-xl">done</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete Record"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-4xl text-slate-300">notifications_off</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#172b4d]">No notifications</h3>
                            <p className="text-slate-500 font-medium">No system alerts found in the database.</p>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}
