import React from "react";
import { useUserNotification, useMarkUserNotificationAsReadMutation } from "../hooks/useUserNotification";

export default function SystemAlerts() {
    // Show top 5 unread from the master notification feed
    const { data, isLoading } = useUserNotification({ unread_only: true, limit: 10 });
    const notifications = (data?.items || []).filter(n => !n.is_read).slice(0, 5);
    const markAsReadMutation = useMarkUserNotificationAsReadMutation();

    const handleDismiss = (id) => {
        markAsReadMutation.mutate(id);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
                <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loading Alerts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 fill-1">campaign</span>
                <h3 className="text-lg font-bold text-[#172b4d]">System Alerts</h3>
                {notifications.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-lg">
                        {notifications.length} NEW
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                        <p className="text-slate-400 text-sm font-medium">No active alerts</p>
                    </div>
                ) : (
                    notifications.map((alert) => (
                        <div key={alert.id} className={`relative p-5 rounded-2xl border bg-white border-slate-100 shadow-sm transition-all hover:scale-[1.01]`}>

                            <button
                                onClick={() => handleDismiss(alert.id)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Dismiss"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>

                            <div className="flex justify-between items-start mb-2 pr-8">
                                <span className={`text-[9px] font-black tracking-widest uppercase text-primary`}>
                                    {alert.type}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                    {alert.created_at ? new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#172b4d] mb-1">{alert.title}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.description}</p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleDismiss(alert.id)}
                                    className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Mark as Seen
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
