import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import SalesChart from "../components/SalesChart";
import PayoutChart from "../components/PayoutChart";
import TopAffiliates from "../components/TopAffiliates";
import SystemAlerts from "../components/SystemAlerts";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-display">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="p-8 lg:p-10 space-y-10 overflow-y-auto">
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
                        <div className="flex-1 space-y-8">
                            <SalesChart />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <PayoutChart />
                                <TopAffiliates />
                            </div>
                        </div>

                        {/* Right Sidebar - System Alerts */}
                        <div className="w-full xl:w-96 space-y-8">
                            <SystemAlerts />

                            {/* Quick Actions Placeholder */}
                            <div className="bg-[#172b4d] p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                                <h4 className="text-sm font-black tracking-widest uppercase mb-6 opacity-60">Quick Admin Actions</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-all">
                                        <span className="material-symbols-outlined text-2xl">person_add</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Add User</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-all">
                                        <span className="material-symbols-outlined text-2xl">account_balance</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Payout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
