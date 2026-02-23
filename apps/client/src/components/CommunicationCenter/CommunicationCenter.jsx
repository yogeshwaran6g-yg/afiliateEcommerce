import React, { useState } from "react";
import ActivityFeed from "./ActivityFeed";
import Announcements from "./Announcements";
import SupportBanner from "./SupportBanner";
import { toast } from "react-toastify";
import { useNotifications } from "../../hooks/useNotificationService";
import { useUserNotification, useMarkAsReadMutation, useDeleteNotificationMutation } from "../../hooks/useUserNotification";

const CommunicationCenter = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
    const [selectedNotificationId, setSelectedNotificationId] = useState(null);

    const { data: notificationsData, isLoading, isError } = useNotifications({ activeOnly: true });

    // Filter out expired notifications on frontend as well (double layer)
    const announcements = React.useMemo(() => {
        if (!Array.isArray(notificationsData)) return [];
        const now = new Date();
        return notificationsData.filter(notif => {
            if (!notif) return false;
            if (!notif.advertisement_end_time) return true;
            return new Date(notif.advertisement_end_time) > now;
        });
    }, [notificationsData]);

    const { data: userNotifications = [], isLoading: isUserNotificationsLoading } = useUserNotification();

    const activityNotifications = React.useMemo(() => {
        if (!Array.isArray(userNotifications)) return [];
        let filtered = userNotifications;

        if (activeTab === "Unread") {
            filtered = userNotifications.filter(n => !n.is_read);
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
                description: notif.description || "",
                time: new Date(notif.created_at).toLocaleString(),
                unread: !notif.is_read
            };
        });
    }, [userNotifications, activeTab]);

    // Set initial selection when data arrives
    React.useEffect(() => {
        if (activeTab === "Announcements") {
            if (announcements.length > 0 && !selectedAnnouncementId) {
                setSelectedAnnouncementId(announcements[0].id);
            }
        } else {
            if (activityNotifications.length > 0 && !selectedNotificationId) {
                setSelectedNotificationId(activityNotifications[0].id);
            }
        }
    }, [announcements, activityNotifications, activeTab, selectedAnnouncementId, selectedNotificationId]);

    const markAsReadMutation = useMarkAsReadMutation();
    const deleteNotificationMutation = useDeleteNotificationMutation();

    const handleNotificationClick = (notification) => {
        setSelectedNotificationId(notification.id);
        if (!notification.is_read) {
            markAsReadMutation.mutate(notification.id, {
                onSuccess: () => toast.success("Marked as read"),
                onError: () => toast.error("Failed to mark as read"),
            });
        }

        // Scroll to detail on mobile
        if (window.innerWidth < 768) {
            document.getElementById('announcement-detail')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleAnnouncementClick = (announcementId) => {
        setSelectedAnnouncementId(announcementId);

        // Scroll to detail on mobile
        if (window.innerWidth < 768) {
            document.getElementById('announcement-detail')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteNotification = (notificationId) => {
        if (selectedNotificationId === notificationId) {
            setSelectedNotificationId(null);
        }
        deleteNotificationMutation.mutate(notificationId, {
            onSuccess: () => toast.success("Notification deleted"),
            onError: () => toast.error("Failed to delete notification"),
        });
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-slate-50">
            <ActivityFeed
                notifications={activityNotifications}
                announcements={announcements}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedAnnouncementId={selectedAnnouncementId}
                setSelectedAnnouncementId={handleAnnouncementClick}
                selectedNotificationId={selectedNotificationId}
                setSelectedNotificationId={(id) => {
                    setSelectedNotificationId(id);
                    if (window.innerWidth < 768) {
                        document.getElementById('announcement-detail')?.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                onNotificationClick={handleNotificationClick}
                onDeleteNotification={handleDeleteNotification}
                isLoading={isUserNotificationsLoading}
                isAnnouncementsLoading={isLoading}
            />

            <section className="flex-1 bg-slate-50 overflow-y-auto min-h-screen md:min-h-0 border-t md:border-t-0 border-slate-200">
                <Announcements
                    notifications={activeTab === "Announcements" ? announcements : activityNotifications}
                    selectedAnnouncementId={activeTab === "Announcements" ? selectedAnnouncementId : selectedNotificationId}
                    isLoading={activeTab === "Announcements" ? isLoading : isUserNotificationsLoading}
                    isError={activeTab === "Announcements" ? isError : false}
                    activeTab={activeTab}
                />
                <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
                    <SupportBanner />
                </div>
            </section>
        </div>
    );
};

export default CommunicationCenter;
