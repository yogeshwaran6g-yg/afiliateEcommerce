import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Wallet() {
    const [dateFilter, setDateFilter] = useState("Last 30 Days");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const transactions = [
        {
            date: "Oct 24, 2023",
            title: "Referral Bonus - Alex Smith",
            subtitle: "Order ID: #ORD-99281",
            type: "Referral",
            typeColor: "text-blue-600 bg-blue-50",
            amount: "+$125.00",
            amountColor: "text-green-600",
            status: "Completed",
            statusColor: "bg-green-100 text-green-700"
        },
        {
            date: "Oct 22, 2023",
            title: "Withdrawal to Bank Account",
            subtitle: "Ref: CHASE-XXXX-1234",
            type: "Payout",
            typeColor: "text-slate-600 bg-slate-50",
            amount: "-$2,000.00",
            amountColor: "text-red-600",
            status: "Completed",
            statusColor: "bg-green-100 text-green-700"
        },
        {
            date: "Oct 21, 2023",
            title: "Team Performance Bonus",
            subtitle: "Tier 2 Overrides",
            type: "Performance",
            typeColor: "text-purple-600 bg-purple-50",
            amount: "+$450.00",
            amountColor: "text-green-600",
            status: "Pending",
            statusColor: "bg-amber-100 text-amber-700"
        },
        {
            date: "Oct 20, 2023",
            title: "Monthly Platform Subscription",
            subtitle: "Auto-renewal",
            type: "Service Fee",
            typeColor: "text-slate-600 bg-slate-50",
            amount: "-$29.00",
            amountColor: "text-red-600",
            status: "Completed",
            statusColor: "bg-green-100 text-green-700"
        },
        {
            date: "Oct 18, 2023",
            title: "Direct Sale Commission",
            subtitle: "Order ID: #ORD-98105",
            type: "Sales",
            typeColor: "text-blue-600 bg-blue-50",
            amount: "+$75.50",
            amountColor: "text-green-600",
            status: "Completed",
            statusColor: "bg-green-100 text-green-700"
        }
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <Header toggleSidebar={() => setIsSidebarOpen(true)} />

                <div className="flex-1 px-4 md:px-8 py-4 md:py-8">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Wallet & Earnings History</h1>
                            <p className="text-sm md:text-base text-slate-500">
                                Manage your commissions, monitor pending holds, and withdraw your funds.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <button className="flex items-center gap-2 px-3 md:px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 text-sm">
                                <span className="material-symbols-outlined text-lg">download</span>
                                <span className="hidden sm:inline">Export CSV</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 md:px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 text-sm">
                                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                <span className="hidden sm:inline">Withdraw Funds</span>
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Commission Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-green-600">trending_up</span>
                                <span className="text-sm font-semibold text-slate-500 uppercase">Commission</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-slate-900">$4,250.80</span>
                                <span className="text-sm font-semibold text-green-600">+12.5%</span>
                            </div>
                            <p className="text-sm text-slate-500">Earned in the last 30 days</p>
                        </div>

                        {/* On Hold Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-amber-600">schedule</span>
                                <span className="text-sm font-semibold text-slate-500 uppercase">On Hold</span>
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-1">$840.00</div>
                            <p className="text-sm text-slate-500">Available in approx. 14 days</p>
                        </div>

                        {/* Withdrawable Card */}
                        <div className="bg-primary rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                                <span className="text-sm font-semibold uppercase opacity-90">Withdrawable</span>
                            </div>
                            <div className="text-4xl font-bold mb-1">$12,480.25</div>
                            <p className="text-sm opacity-90">Instant payout available</p>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction History</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                        search
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                    {dateFilter}
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-lg">tune</span>
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {transactions.map((transaction, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {transaction.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{transaction.title}</div>
                                            <div className="text-sm text-slate-500">{transaction.subtitle}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.typeColor}`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${transaction.amountColor}`}>
                                                {transaction.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.statusColor}`}>
                                                ● {transaction.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                                Showing 1 to 5 of 42 transactions
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-slate-600">chevron_left</span>
                                </button>
                                <button className="px-3 py-1 bg-primary text-white rounded-lg font-semibold text-sm">
                                    1
                                </button>
                                <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50">
                                    2
                                </button>
                                <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50">
                                    3
                                </button>
                                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 mt-auto py-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
                        <div className="text-center md:text-left">© 2024 Fintech MLM Dashboard. All rights reserved.</div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <a href="#" className="hover:text-primary">Privacy Policy</a>
                            <a href="#" className="hover:text-primary">Terms of Service</a>
                            <a href="#" className="hover:text-primary">Help Center</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
