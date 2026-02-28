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
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <section className="w-full lg:w-5/12 border-r border-slate-200 bg-white flex flex-col" style={{ fontFamily: '"Inter", sans-serif' }}>
            {/* Header */}
            <div className="px-6 pt-6 pb-0 border-b border-slate-100">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900 tracking-tight">Inbox</h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Your activity &amp; announcements</p>
                    </div>
                    {activeTab !== "Announcements" && unreadCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
                            {unreadCount} Unread
                        </span>
                    )}
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0">
                    {["All", "Unread", "Announcements"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${activeTab === tab
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed Content */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {isNowLoading ? (
                    <div className="flex flex-col items-center justify-center h-48 space-y-3">
                        <div className="size-8 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Loading...</p>
                    </div>
                ) : activeTab === "Announcements" ? (
                    announcements.length > 0 ? (
                        announcements.map((notif) => (
                            <button
                                key={notif.id}
                                onClick={() => setSelectedAnnouncementId(notif.id)}
                                className={`w-full text-left px-5 py-4 flex gap-4 group transition-all ${selectedAnnouncementId === notif.id
                                    ? "bg-primary/5 border-l-2 border-l-primary"
                                    : "hover:bg-slate-50 border-l-2 border-l-transparent"
                                    }`}
                            >
                                <div className="size-11 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-100 shadow-sm">
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
                                    <p className={`text-sm font-semibold truncate ${selectedAnnouncementId === notif.id ? "text-primary" : "text-slate-800"}`}>
                                        {notif.heading}
                                    </p>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                        {notif.short_description}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                            <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">campaign</span>
                            <p className="text-slate-400 text-sm font-medium">No announcements yet</p>
                        </div>
                    )
                ) : (
                    notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => onNotificationClick?.(notif)}
                                className={`px-5 py-4 flex gap-4 cursor-pointer transition-all border-l-2 group ${selectedNotificationId === notif.id
                                    ? "bg-primary/5 border-l-primary"
                                    : notif.unread
                                        ? "bg-white hover:bg-slate-50 border-l-transparent"
                                        : "bg-slate-50/50 hover:bg-slate-50 border-l-transparent opacity-70"
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`size-10 rounded-xl ${notif.iconBg} flex items-center justify-center ${notif.iconColor} shrink-0 shadow-sm`}>
                                    <span className="material-symbols-outlined text-[20px]">{notif.icon}</span>
                                </div>

                                {/* Body */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className={`text-sm font-semibold truncate ${selectedNotificationId === notif.id ? "text-primary" : notif.unread ? "text-slate-900" : "text-slate-500"}`}>
                                            {notif.title}
                                        </p>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {notif.unread && (
                                                <span className="size-2 bg-primary rounded-full shrink-0"></span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm("Delete this notification?")) {
                                                        onDeleteNotification?.(notif.id);
                                                    }
                                                }}
                                                className="size-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{notif.description}</p>
                                    <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                                        {notif.time}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                            <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">notifications_off</span>
                            <p className="text-slate-400 text-sm font-medium">
                                {activeTab === "Unread" ? "All caught up!" : "No notifications yet"}
                            </p>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default ActivityFeed;
