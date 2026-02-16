import React, { useState, useEffect } from "react";

const Announcements = ({ notifications = [], selectedAnnouncementId, isLoading, isError, activeTab }) => {
    if (isLoading) {
        return (
            <section className="flex-1 bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="flex-1 bg-slate-50 flex items-center justify-center p-8">
                <p className="text-slate-500">Error loading notifications. Please try again later.</p>
            </section>
        );
    }

    const featured = notifications.find(n => n.id === selectedAnnouncementId) || notifications[0];

    const getTitle = () => {
        switch (activeTab) {
            case "Announcements": return "Company Announcements";
            case "Earnings": return "Earnings & Commissions";
            case "Unread": return "Unread Notifications";
            default: return "Notification Details";
        }
    };

    const getDescription = () => {
        switch (activeTab) {
            case "Announcements": return "Stay informed with the latest news and updates from headquarters.";
            case "Earnings": return "Track your financial performance and rewards.";
            case "Unread": return "Review notifications that require your attention.";
            default: return "View the details of your selected notification.";
        }
    };

    return (
        <section id="announcement-detail" className="flex-1 bg-slate-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h3 className="font-bold text-3xl text-slate-900 tracking-tight">
                        {getTitle()}
                    </h3>
                    <p className="text-slate-500 mt-1">
                        {getDescription()}
                    </p>
                </div>

                {!featured ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                        <p className="text-slate-500">No active {activeTab === "Announcements" ? "announcements" : "notifications"} at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        {(featured.image_url || activeTab === "Announcements") && (
                            <div className="aspect-21/9 w-full bg-slate-100 relative group overflow-hidden">
                                <img
                                    src={featured.image_url || "/images/default_notification.png"}
                                    alt={featured.heading || featured.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/default_notification.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6 md:p-8"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-lg">
                                        {activeTab === "Announcements" ? "Latest Update" : featured.type || "Notification"}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="p-6 md:p-8">
                            <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight break-words">
                                {featured.heading || featured.title}
                            </h4>
                            <p className="text-slate-600 leading-relaxed mb-8 text-lg break-words">
                                {featured.long_description || featured.description}
                            </p>
                            {featured.type && !featured.image_url && (
                                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                    <span className="material-symbols-outlined">{featured.icon || "notifications"}</span>
                                    {featured.type}
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

