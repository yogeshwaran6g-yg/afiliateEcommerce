import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useUserNotification, useSendNotificationMutation, useDeleteNotificationMutation } from "../hooks/useUserNotification";
import { useUsers } from "../hooks/useUserService";
import NotificationDrawer from "../components/notifications/NotificationDrawer";
import NotificationTable from "../components/notifications/NotificationTable";

export default function UserNotifications() {
    const { userId } = useParams();
    const location = useLocation();
    const [page, setPage] = useState(1);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const { data: usersData, isLoading: usersLoading } = useUsers();
    const users = Array.isArray(usersData) ? usersData : [];

    const { data: notificationsData, isLoading: notificationsLoading, error, refetch } = useUserNotification({
        page,
        limit: 20,
        ...(userId && { user_id: userId })
    });

    const sendMutation = useSendNotificationMutation();
    const deleteMutation = useDeleteNotificationMutation();

    useEffect(() => {
        if (!usersLoading && location.pathname.includes("/send/") && userId) {
            setDrawerOpen(true);
        }
    }, [usersLoading, location.pathname, userId]);

    const handleOpenDrawer = () => setDrawerOpen(true);
    const handleCloseDrawer = () => setDrawerOpen(false);

    const handleSave = async (formData) => {
        await sendMutation.mutateAsync(formData);
        setDrawerOpen(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notification record?")) return;
        await deleteMutation.mutateAsync(id);
    };

    const notifications = notificationsData?.items || [];
    const pagination = notificationsData?.pagination || { total: 0, page: 1, limit: 20, pages: 0 };

    if (notificationsLoading && notifications.length === 0) {
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
                        <p className="text-sm font-bold">{error.message || error}</p>
                        <button onClick={() => refetch()} className="ml-auto underline text-xs">Retry</button>
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

            <NotificationTable 
                notifications={notifications} 
                onDelete={handleDelete} 
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between rounded-3xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing Page {pagination.page} of {pagination.pages} ({pagination.total} Records)
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPage(pagination.page - 1)}
                            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 transition-all"
                        >
                            Previous
                        </button>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPage(pagination.page + 1)}
                            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <NotificationDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                onSave={handleSave}
                loading={sendMutation.isPending}
                users={users}
                initialUserId={userId}
            />
        </div>
    );
}
