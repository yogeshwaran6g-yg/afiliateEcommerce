import React, { useState, useEffect } from "react";

const Announcements = ({ notifications = [], selectedAnnouncementId, isLoading, isError }) => {
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
                <p className="text-slate-500">Error loading announcements. Please try again later.</p>
            </section>
        );
    }

    const featured = notifications.find(n => n.id === selectedAnnouncementId) || notifications[0];

    return (
        <section className="flex-1 bg-slate-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h3 className="font-bold text-3xl text-slate-900 tracking-tight">
                        Company Announcements
                    </h3>
                    <p className="text-slate-500 mt-1">
                        Stay informed with the latest news and updates from headquarters.
                    </p>
                </div>

                {!featured ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                        <p className="text-slate-500">No active announcements at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="aspect-21/9 w-full bg-slate-100 relative group overflow-hidden">
                            <img
                                src={featured.image_url || "/images/default_notification.png"}
                                alt={featured.heading}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/default_notification.png";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6 md:p-8"></div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-primary text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-lg">
                                    Latest Update
                                </span>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    {new Date(featured.created_at).toLocaleDateString()}
                                </span>
                                <span className="size-1 bg-slate-200 rounded-full"></span>
                                <span className="text-xs font-semibold text-primary">Announcement</span>
                            </div>
                            <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                {featured.heading}
                            </h4>
                            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                                {featured.long_description}
                            </p>
                            <div className="flex items-center justify-end pt-6 border-t border-slate-100">
                                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Read More
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Announcements;

