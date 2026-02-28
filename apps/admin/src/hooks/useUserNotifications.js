import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import userNotificationApiService from "../services/userNotification.apiservice";
import userApiService from "../services/user.apiservice";
import { toast } from "react-toastify";

export const useUserNotifications = () => {
    const { userId } = useParams();
    const location = useLocation();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0 });
    const [users, setUsers] = useState([]);
    const [usersLoaded, setUsersLoaded] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, [pagination.page, userId]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (usersLoaded && location.pathname.includes("/send/") && userId) {
            setDrawerOpen(true);
        }
    }, [usersLoaded, location.pathname, userId]);

    const fetchUsers = async () => {
        try {
            const data = await userApiService.getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setUsers([]);
        } finally {
            setUsersLoaded(true);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (userId) {
                params.user_id = userId;
            }

            const data = await userNotificationApiService.getNotifications(params);
            if (data && data.items) {
                setNotifications(data.items);
                setPagination(data.pagination);
            } else {
                setNotifications([]);
            }
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load notifications");
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDrawer = () => {
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const setPage = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleSave = async (formData) => {
        try {
            setDrawerLoading(true);
            await userNotificationApiService.sendNotification({
                user_id: formData.user_id,
                type: formData.type,
                title: formData.title,
                description: formData.description
            });
            setDrawerOpen(false);
            fetchNotifications();
            toast.success("Notification sent successfully");
        } catch (err) {
            toast.error(err.message || "Failed to send notification");
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this notification record?")) return;
        try {
            await userNotificationApiService.deleteNotification(id);
            fetchNotifications();
            toast.info("Notification record deleted");
        } catch (err) {
            toast.error(err.message || "Failed to delete notification");
        }
    };

    return {
        userId,
        isDrawerOpen,
        notifications,
        loading,
        drawerLoading,
        error,
        pagination,
        users,
        usersLoaded,
        fetchNotifications,
        handleOpenDrawer,
        handleCloseDrawer,
        handleSave,
        handleDelete,
        setPage
    };
};
