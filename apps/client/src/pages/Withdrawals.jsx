import React, { useState } from "react";

export default function Withdrawals() {
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const availableBalance = 4250.00;
    const platformFeeRate = 0.015; // 1.5%

    const platformFee = withdrawAmount * platformFeeRate;
    const finalSettlement = withdrawAmount - platformFee;

    const setMaxAmount = () => {
        setWithdrawAmount(availableBalance);
    };

    const transactions = [
        {
            date: "Oct 24, 2023",
            time: "14:32 PM",
            id: "#TRX-8829-XP",
            method: "Bank Transfer",
            methodIcon: "account_balance",
            amount: "$1,200.00",
            status: "Pending",
            statusColor: "bg-amber-100 text-amber-700"
        },
        {
            date: "Oct 20, 2023",
            time: "09:19 AM",
            id: "#TRX-8791-LA",
            method: "Bank Transfer",
            methodIcon: "account_balance",
            amount: "$850.00",
            status: "Approved",
            statusColor: "bg-blue-100 text-blue-700"
        },
        {
            date: "Oct 15, 2023",
            time: "18:45 PM",
            id: "#TRX-8649-QT",
            method: "Crypto Wallet",
            methodIcon: "currency_bitcoin",
            amount: "$3,100.00",
            status: "Paid",
            statusColor: "bg-green-100 text-green-700"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                F
                            </div>
                            <span className="text-lg font-bold text-slate-900">Fintech<span className="text-primary">MLM</span></span>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary">Dashboard</a>
                            <a href="/earnings" className="text-sm font-medium text-slate-600 hover:text-primary">Earnings</a>
                            <a href="/network" className="text-sm font-medium text-slate-600 hover:text-primary">Network</a>
                            <a href="/withdrawals" className="text-sm font-bold text-primary border-b-2 border-primary pb-4">Withdrawals</a>
                            <a href="/settings" className="text-sm font-medium text-slate-600 hover:text-primary">Settings</a>
                        </nav>
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-slate-600">help</span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <a href="/" className="hover:text-primary">Home</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-slate-900 font-medium">Withdrawals & Bank Details</span>
                </div>

                {/* Page Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Withdrawals & Bank Details</h1>
                        <p className="text-slate-500">
                            Securely manage your funds and transfer to linked accounts.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-slate-500 uppercase mb-1">Available Balance</div>
                        <div className="text-4xl font-bold text-primary mb-3">${availableBalance.toFixed(2)}</div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Top Up Wallet
                        </button>
                    </div>
                </div>

                {/* Main Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Linked Bank Account */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">account_balance</span>
                                <h2 className="text-lg font-bold text-slate-900">Linked Bank Account</h2>
                            </div>
                            <a href="#" className="text-sm font-semibold text-primary hover:underline">Manage Accounts</a>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 mb-4">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2 inline-block">PRIMARY ACCOUNT</span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">Chase Manhattan Bank</h3>
                                    <div className="text-slate-500 font-mono">**** **** **** 5678</div>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600">check</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">SWIFT / BIC</div>
                                    <div className="font-semibold text-slate-900">CHASEUS33</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Holder Name</div>
                                    <div className="font-semibold text-slate-900">Alex Thompson</div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 mb-4">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Update Bank Information
                        </button>

                        <p className="text-xs text-slate-500 italic">
                            Transfers to this account are usually processed within 24-48 business hours. Security protocols apply.
                        </p>
                    </div>

                    {/* Request Withdrawal */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary">sync_alt</span>
                            <h2 className="text-lg font-bold text-slate-900">Request Withdrawal</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Amount to Withdraw</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                                        className="w-full pl-8 pr-16 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="0.00"
                                    />
                                    <button
                                        onClick={setMaxAmount}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded hover:bg-primary/20"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>Min: $50.00</span>
                                    <span>Max: ${availableBalance.toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Payment Method</label>
                                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option>Bank Transfer (Linked)</option>
                                    <option>Crypto Wallet</option>
                                    <option>PayPal</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary text-lg">info</span>
                                <h4 className="font-bold text-slate-900 text-sm">Transaction Breakdown</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Platform Fee (1.5%)</span>
                                    <span className="font-semibold text-primary">${platformFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-100">
                                    <span className="font-semibold text-slate-900">Final Settlement:</span>
                                    <span className="font-bold text-slate-900">${finalSettlement.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-3">
                            <span className="material-symbols-outlined">lock</span>
                            INITIATE SECURE WITHDRAWAL
                        </button>

                        <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <span>End-to-end encrypted transaction secure via FintechCloud SSL</span>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-lg">tune</span>
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Request Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{transaction.date}</div>
                                        <div className="text-sm text-slate-500">{transaction.time}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-semibold text-primary">{transaction.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400">{transaction.methodIcon}</span>
                                            <span className="font-medium text-slate-900">{transaction.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-900">{transaction.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.statusColor}`}>
                                            ● {transaction.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                                            <span className="material-symbols-outlined text-slate-400">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Showing 1-3 of 24 transactions
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

                {/* Help Banner */}
                <div className="bg-slate-100 rounded-2xl p-6 mt-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Need help with your withdrawal?</h3>
                        <p className="text-slate-600 text-sm">Our support team is available 24/7 for fintech-related inquiries.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
                            Live Support
                        </button>
                        <button className="px-6 py-3 border border-slate-300 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50">
                            FAQs & Policy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
