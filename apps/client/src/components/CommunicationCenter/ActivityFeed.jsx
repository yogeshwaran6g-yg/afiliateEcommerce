import React from "react";

const ActivityFeed = ({
    notifications,
    announcements = [],
    activeTab,
    setActiveTab,
    selectedAnnouncementId,
    setSelectedAnnouncementId,
    selectedNotificationId,
    setSelectedNotificationId,
    onNotificationClick,
    onDeleteNotification,
    isLoading,
    isAnnouncementsLoading
}) => {
    const isNowLoading = activeTab === "Announcements" ? isAnnouncementsLoading : isLoading;

    return (
        <section className="w-full lg:w-5/12 border-r border-slate-200 bg-white flex flex-col">
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900">Activity Feed</h3>
                    <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                        {activeTab === "Announcements"
                            ? announcements.length
                            : notifications.filter(n => n.unread).length} {activeTab === "Announcements" ? "Total" : "New"}
                    </span>
                </div>
                <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar">
                    {["All", "Unread", "Announcements"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === tab
                                ? "border-b-2 border-primary text-primary"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {isNowLoading ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-2">
                        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 font-medium">Loading notifications...</p>
                    </div>
                ) : activeTab === "Announcements" ? (
                    announcements.length > 0 ? (
                        announcements.map((notif) => (
                            <button
                                key={notif.id}
                                onClick={() => setSelectedAnnouncementId(notif.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex gap-4 group ${selectedAnnouncementId === notif.id
                                    ? "bg-primary/5 border-primary shadow-sm"
                                    : "bg-white border-slate-100 hover:border-primary/30"
                                    }`}
                            >
                                <div className="size-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-100">
                                    <img
                                        src={notif.image_url || "/images/default_notification.png"}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/default_notification.png";
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate break-all ${selectedAnnouncementId === notif.id ? "text-primary" : "text-slate-900"}`}>
                                        {notif.heading}
                                    </p>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug break-all">
                                        {notif.short_description}
                                    </p>
                                    <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight font-bold">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500 text-sm">No announcements available.</p>
                        </div>
                    )
                ) : (
                    notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => onNotificationClick?.(notif)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${selectedNotificationId === notif.id
                                    ? "bg-primary/5 border-primary shadow-sm"
                                    : notif.unread
                                        ? "bg-white border-slate-100 hover:border-primary/30"
                                        : "bg-white/60 border-slate-100 hover:border-primary/30 grayscale-[0.5] opacity-80"
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`size-10 rounded-lg ${notif.iconBg} flex items-center justify-center ${notif.iconColor} shrink-0`}>
                                        <span className="material-symbols-outlined">{notif.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate break-all ${selectedNotificationId === notif.id ? "text-primary" : "text-slate-900"}`}>
                                                    {notif.title}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                {(activeTab === "All" || activeTab === "Unread") && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm("Are you sure you want to delete this notification?")) {
                                                                onDeleteNotification?.(notif.id);
                                                            }
                                                        }}
                                                        className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        title="Delete Notification"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                )}
                                                {notif.unread && <div className="size-2 bg-primary rounded-full shrink-0"></div>}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 break-all">{notif.description}</p>
                                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight font-bold">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {notif.time}
                                        </p>
                                        {activeTab === "Unread" && notif.unread && (
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`mark-as-read-${notif.id}`}
                                                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        onNotificationClick?.(notif);
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`mark-as-read-${notif.id}`}
                                                    className="text-xs font-bold text-slate-600 cursor-pointer hover:text-primary transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Mark as read
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500 text-sm">No notifications available.</p>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default ActivityFeed;
