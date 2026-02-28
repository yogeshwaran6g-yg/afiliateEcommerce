import React from "react";

const Announcements = ({ notifications = [], selectedAnnouncementId, isLoading, isError, activeTab }) => {
    if (isLoading) {
        return (
            <section className="flex-1 bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-10 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400 font-medium tracking-wide" style={{ fontFamily: '"Inter", sans-serif' }}>Loading...</p>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="flex-1 bg-slate-50 flex items-center justify-center p-8">
                <p className="text-slate-500 text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>Error loading notifications. Please try again later.</p>
            </section>
        );
    }

    const featured = notifications.find(n => n.id === selectedAnnouncementId) || notifications[0];

    const getTitle = () => {
        switch (activeTab) {
            case "Announcements": return "Company Announcements";
            case "Unread": return "Unread Notifications";
            default: return "Notification Details";
        }
    };

    const getDescription = () => {
        switch (activeTab) {
            case "Announcements": return "Stay informed with the latest news from headquarters.";
            case "Unread": return "Review notifications that require your attention.";
            default: return "View the details of your selected notification.";
        }
    };

    return (
        <section id="announcement-detail" className="flex-1 bg-slate-50 overflow-y-auto" style={{ fontFamily: '"Inter", sans-serif' }}>
            <div className="max-w-3xl mx-auto p-5 md:p-8">
                {/* Page header */}
                <div className="mb-6">
                    <h3 className="font-bold text-2xl text-slate-900 tracking-tight">
                        {getTitle()}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        {getDescription()}
                    </p>
                </div>

                {!featured ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-4xl text-slate-200 block mx-auto mb-3">inbox</span>
                        <p className="text-slate-500 text-sm font-medium">No {activeTab === "Announcements" ? "announcements" : "notifications"} at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        {/* Hero image */}
                        {(featured.image_url || activeTab === "Announcements") && (
                            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                                <img
                                    src={featured.image_url || "/images/default_notification.png"}
                                    alt={featured.heading || featured.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/default_notification.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                                        {activeTab === "Announcements" ? "Latest Update" : featured.type || "Notification"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {/* Type badge for non-image notifications */}
                            {!featured.image_url && featured.type && (
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[14px]">{featured.icon || "notifications"}</span>
                                        {featured.type}
                                    </span>
                                </div>
                            )}

                            <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug break-words">
                                {featured.heading || featured.title}
                            </h4>
                            <p className="text-slate-600 leading-relaxed break-words text-base">
                                {featured.long_description || featured.description}
                            </p>

                            {/* Timestamp */}
                            {featured.created_at && (
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    {new Date(featured.created_at).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Announcements;
