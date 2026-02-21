import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "HIGH PRIORITY",
            title: "Large Withdrawal Flagged",
            description: "User #8921 requested a payout of ₹4,500. Manual verification required to prevent fraudulent activities. Check the user's transaction history before approving.",
            time: "2026-02-21 13:45",
            color: "red",
            isRead: false
        },
        {
            id: 2,
            type: "KYC VERIFICATION",
            title: "12 New Member Approvals",
            description: "New users from the Southeast Asia region are awaiting document verification. High volume of signups today.",
            time: "2026-02-21 12:30",
            color: "blue",
            isRead: false
        },
        {
            id: 3,
            type: "SECURITY",
            title: "Multiple Login Attempts",
            description: "Unusual login patterns detected from IP 192.168.1.1 on node #04. Account locked for 30 minutes as a precaution.",
            time: "2026-02-21 09:15",
            color: "slate",
            isRead: true
        },
        {
            id: 4,
            type: "BACKUP SUCCESS",
            title: "Weekly Database Export",
            description: "Cloud storage backup completed successfully. Total size: 4.2GB. Integrity checks passed.",
            time: "2026-02-20 23:00",
            color: "green",
            isRead: true
        },
        {
            id: 5,
            type: "SYSTEM UPDATE",
            title: "Server Maintenance Scheduled",
            description: "Scheduled maintenance on bypass servers starting at 02:00 AM IST. Expect minor downtime for referral links.",
            time: "2026-02-20 18:30",
            color: "amber",
            isRead: true
        }
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        toast.success("Notification marked as read");
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.info("Notification removed");
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin Panel</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">Notifications</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#172b4d] tracking-tighter">System Alerts</h2>
                    <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl">
                        Monitor system health, security flags, and administrative tasks.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-6 py-3 text-slate-600 text-sm font-black hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
                    >
                        Mark All Read
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6 transition-all hover:bg-slate-50/50 ${!notification.isRead ? 'bg-primary/2' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notification.color === 'red' ? 'bg-red-50 text-red-600' :
                                    notification.color === 'blue' ? 'bg-blue-50 text-primary' :
                                        notification.color === 'green' ? 'bg-green-50 text-green-600' :
                                            notification.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                                'bg-slate-100 text-slate-600'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl font-bold">
                                        {notification.color === 'red' ? 'priority_high' :
                                            notification.color === 'blue' ? 'verified' :
                                                notification.color === 'green' ? 'check_circle' :
                                                    notification.color === 'amber' ? 'update' :
                                                        'info'}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${notification.color === 'red' ? 'bg-red-100 text-red-700' :
                                                notification.color === 'blue' ? 'bg-blue-100 text-primary' :
                                                    notification.color === 'green' ? 'bg-green-100 text-green-700' :
                                                        notification.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-slate-200 text-slate-700'
                                                }`}>
                                                {notification.type}
                                            </span>
                                            {!notification.isRead && (
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                            )}
                                            <h4 className="text-sm md:text-base font-bold text-[#172b4d]">{notification.title}</h4>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl">
                                        {notification.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.isRead && (
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
                                        title="Delete"
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
                            <p className="text-slate-500 font-medium">All caught up! There are no new system alerts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
