import React from "react";
import MetricCard from "../components/MetricCard";
import { useDashboardStats } from "../hooks/useStatsService";
import { toast } from "react-toastify";

export default function Dashboard() {
    const { data: stats, isLoading, isError, refetch } = useDashboardStats();

    const fetchStats = async () => {
        try {
            await refetch();
        } catch (error) {
            console.error("Error refreshing dashboard stats:", error);
            toast.error("Failed to refresh dashboard statistics");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-red-500 font-bold">Failed to load dashboard statistics</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const cards = [
        {
            title: "Active Users",
            value: stats?.activeUsers || 0,
            icon: "person_check",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            showPulse: true
        },
        {
            title: "Pending Users",
            value: stats?.pendingUsers || 0,
            icon: "person_search",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600"
        },
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: "group",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: "shopping_bag",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "Today's Orders",
            value: stats?.todayOrders || 0,
            icon: "today",
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            showPulse: true
        },
        {
            title: "Total Recharges",
            value: stats?.totalRecharges || 0,
            icon: "account_balance_wallet",
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600"
        },
        {
            title: "Pending Recharges",
            value: stats?.pendingRecharges || 0,
            icon: "pending_actions",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
        },
        {
            title: "Today Pending Recharge",
            value: stats?.todayPendingRecharges || 0,
            icon: "update",
            iconBg: "bg-rose-100",
            iconColor: "text-rose-600"
        },
        {
            title: "Total Withdrawals",
            value: stats?.totalWithdrawals || 0,
            icon: "payments",
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600"
        },
        {
            title: "Pending Withdrawals",
            value: stats?.pendingWithdrawals || 0,
            icon: "hourglass_empty",
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600"
        },
        {
            title: "Today Pending Withdrawal",
            value: stats?.todayPendingWithdrawals || 0,
            icon: "event_repeat",
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
        }
    ];

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#172b4d] tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 font-medium">Overview of your platform's performance</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Refresh Data
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <MetricCard key={index} {...card} />
                ))}
            </div>
        </div>
    );
}

