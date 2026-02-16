import React from "react";
import MetricCard from "../components/MetricCard";
import TopAffiliates from "../components/TopAffiliates";
import SystemAlerts from "../components/SystemAlerts";

export default function Dashboard() {
    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-10">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Sales"
                    value="$428,590.00"
                    icon="payments"
                    trend="+12.5%"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <MetricCard
                    title="Total Payouts"
                    value="$156,210.45"
                    icon="account_balance_wallet"
                    trend="+4.2%"
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <MetricCard
                    title="Active Users"
                    value="12,840"
                    icon="person"
                    trend="+8.1%"
                    iconBg="bg-blue-100"
                    iconColor="text-primary"
                />
                <MetricCard
                    title="Pending Withdrawals"
                    value="42 Req."
                    icon="error"
                    subValue="24 Critical"
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
            </div>

            {/* Main Analytics Content */}
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Middle Content */}
                <div className="flex-1 space-y-8 min-w-0">
                    <TopAffiliates />
                </div>

                {/* Right Sidebar - System Alerts */}
                <div className="w-full xl:w-96 space-y-8">
                    <SystemAlerts />
                </div>

            </div>
        </div>
    );
}

