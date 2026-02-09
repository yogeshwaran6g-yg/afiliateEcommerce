import React, { useState } from "react";

export default function Wallet() {
    const [dateFilter, setDateFilter] = useState("Last 30 Days");

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
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            F
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">FinTrack MLM</div>
                            <div className="text-xs text-slate-500">DISTRIBUTOR PORTAL</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="/wallet" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg mb-1">
                        <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                        <span className="font-semibold">Wallet & Earnings</span>
                    </a>
                    <a href="/team" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
                        <span className="material-symbols-outlined text-xl">groups</span>
                        <span className="font-medium">My Team</span>
                    </a>
                    <a href="/products" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
                        <span className="material-symbols-outlined text-xl">inventory_2</span>
                        <span className="font-medium">Products</span>
                    </a>
                    <a href="/reports" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg mb-1">
                        <span className="material-symbols-outlined text-xl">bar_chart</span>
                        <span className="font-medium">Reports</span>
                    </a>
                </nav>

                {/* Settings */}
                <div className="p-4 border-t border-slate-200">
                    <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg">
                        <span className="material-symbols-outlined text-xl">settings</span>
                        <span className="font-medium">Settings</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Wallet & Earnings History</h1>
                            <p className="text-slate-500">
                                Manage your commissions, monitor pending holds, and withdraw your funds.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export CSV
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                Withdraw Funds
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
            </main>
        </div>
    );
}
