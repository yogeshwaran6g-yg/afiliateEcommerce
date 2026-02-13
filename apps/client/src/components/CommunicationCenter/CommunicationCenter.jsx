import React, { useState } from "react";
import ActivityFeed from "./ActivityFeed";
import Announcements from "./Announcements";
import SupportBanner from "./SupportBanner";
import { useNotifications } from "../../hooks/useNotificationService";

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

    const activityNotifications = [
        // ... (existing activityNotifications array remains same)
        {
            id: 1,
            icon: "payments",
            iconBg: "bg-green-50",
            iconColor: "text-success",
            title: "Commission Received",
            description: "$50.00 USD from Level 2 referral has been added to your wallet.",
            time: "Just now",
            unread: true
        },
        {
            id: 2,
            icon: "person_add",
            iconBg: "bg-blue-50",
            iconColor: "text-primary",
            title: "New Direct Referral",
            description: "Welcome Sarah Jenkins to your network. Send a welcome message!",
            time: "15 mins ago",
            unread: true
        },
        {
            id: 3,
            icon: "local_shipping",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500",
            title: "Order Shipped",
            description: "Your physical marketing kit (Order #MLM-928) is on its way.",
            time: "2 hours ago",
            unread: true
        },
        {
            id: 4,
            icon: "security",
            iconBg: "bg-slate-100",
            iconColor: "text-slate-500",
            title: "Password Changed Successfully",
            description: "Your security profile was updated yesterday.",
            time: "Yesterday at 4:30 PM",
            unread: false
        },
        {
            id: 5,
            icon: "verified",
            iconBg: "bg-slate-100",
            iconColor: "text-slate-500",
            title: "KYC Verified",
            description: "Your identity verification has been approved by our compliance team.",
            time: "2 days ago",
            unread: false
        }
    ];

    return (
        <div className="flex-1 flex overflow-hidden">
            <ActivityFeed
                notifications={activityNotifications}
                announcements={announcements}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedAnnouncementId={selectedAnnouncementId}
                setSelectedAnnouncementId={setSelectedAnnouncementId}
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
