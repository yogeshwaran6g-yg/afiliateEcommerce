import React, { useState } from "react";
import ActivityFeed from "./ActivityFeed";
import Announcements from "./Announcements";
import SupportBanner from "./SupportBanner";
import { useNotifications } from "../../hooks/useNotificationService";
import { useUserNotification, useMarkAsReadMutation } from "../../hooks/useUserNotification";

const CommunicationCenter = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);

    const { data: notificationsData, isLoading, isError } = useNotifications({ activeOnly: true });

    // Filter out expired notifications on frontend as well (double layer)
    const announcements = React.useMemo(() => {
        if (!notificationsData?.success) return [];
        const now = new Date();
        return notificationsData.data.filter(notif => {
            if (!notif.advertisement_end_time) return true;
            return new Date(notif.advertisement_end_time) > now;
        });
    }, [notificationsData]);

    // Set initial selection when data arrives
    React.useEffect(() => {
        if (announcements.length > 0 && !selectedAnnouncementId) {
            setSelectedAnnouncementId(announcements[0].id);
        }
    }, [announcements, selectedAnnouncementId]);

    const { data: userNotifications = [], isLoading: isUserNotificationsLoading } = useUserNotification();

    const activityNotifications = React.useMemo(() => {
        if (!Array.isArray(userNotifications)) return [];
        let filtered = userNotifications;

        if (activeTab === "Unread") {
            filtered = userNotifications.filter(n => !n.is_read);
        } else if (activeTab === "Earnings") {
            filtered = userNotifications.filter(n =>
                n.type?.toLowerCase() === 'earning' ||
                n.type?.toLowerCase() === 'commission'
            );
        }

        return filtered.map(notif => {
            // Helper to get icon and colors based on type
            const getTypeStyles = (type) => {
                switch (type?.toLowerCase()) {
                    case 'earning':
                    case 'commission':
                        return { icon: "payments", bg: "bg-green-50", color: "text-success" };
                    case 'referral':
                        return { icon: "person_add", bg: "bg-blue-50", color: "text-primary" };
                    case 'order':
                    case 'shipping':
                        return { icon: "local_shipping", bg: "bg-orange-50", color: "text-orange-500" };
                    case 'security':
                    case 'password':
                        return { icon: "security", bg: "bg-slate-100", color: "text-slate-500" };
                    case 'kyc':
                    case 'verification':
                        return { icon: "verified", bg: "bg-slate-100", color: "text-slate-500" };
                    default:
                        return { icon: "notifications", bg: "bg-slate-100", color: "text-slate-500" };
                }
            };

            const styles = getTypeStyles(notif.type);

            return {
                ...notif,
                icon: styles.icon,
                iconBg: styles.bg,
                iconColor: styles.color,
                title: notif.title,
                description: notif.description || notif.title, // Fallback to title if no description
                time: new Date(notif.created_at).toLocaleString(),
                unread: !notif.is_read
            };
        });
    }, [userNotifications, activeTab]);

    const markAsReadMutation = useMarkAsReadMutation();

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsReadMutation.mutate(notification.id);
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            <ActivityFeed
                notifications={activityNotifications}
                announcements={announcements}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedAnnouncementId={selectedAnnouncementId}
                setSelectedAnnouncementId={setSelectedAnnouncementId}
                onNotificationClick={handleNotificationClick}
                isLoading={isUserNotificationsLoading}
                isAnnouncementsLoading={isLoading}
            />

            <section className="flex-1 bg-slate-50 overflow-y-auto">
                <Announcements
                    notifications={announcements}
                    selectedAnnouncementId={selectedAnnouncementId}
                    isLoading={isLoading}
                    isError={isError}
                />
                <div className="max-w-4xl mx-auto px-8 pb-8">
                    <SupportBanner />
                </div>
            </section>
        </div>
    );
};

export default CommunicationCenter;
