import React, { useState } from "react";

export default function Network() {
    const [activeLevel, setActiveLevel] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const referralLink = "https://fintechmlm.io/ref/user789_elite";
    const totalReferrals = 1284;
    const activeToday = 42;

    const levels = [
        { level: 1, count: 24 },
        { level: 2, count: 142 },
        { level: 3, count: 310 },
        { level: 4, count: 604 },
        { level: 5, count: 189 },
        { level: 6, count: 15 }
    ];

    const members = [
        {
            id: "#44921",
            name: "Alex Thompson",
            avatar: "AT",
            avatarColor: "bg-slate-300",
            joinDate: "Oct 12, 2023",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
            contribution: "$12,450.00"
        },
        {
            id: "#44890",
            name: "Sarah Jenkins",
            avatar: "SJ",
            avatarColor: "bg-amber-300",
            joinDate: "Oct 09, 2023",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
            contribution: "$8,120.50"
        },
        {
            id: "#44872",
            name: "Michael Vane",
            avatar: "MV",
            avatarColor: "bg-orange-300",
            joinDate: "Sep 28, 2023",
            status: "Inactive",
            statusColor: "bg-slate-100 text-slate-600",
            contribution: "$2,400.00"
        },
        {
            id: "#44855",
            name: "Lily Chen",
            avatar: "LC",
            avatarColor: "bg-amber-300",
            joinDate: "Sep 25, 2023",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
            contribution: "$19,200.00"
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                                F
                            </div>
                            <span className="text-xl font-bold text-slate-900">Fintech<span className="text-primary">MLM</span></span>
                        </div>
                        <nav className="flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary">Dashboard</a>
                            <a href="/network" className="text-sm font-bold text-primary border-b-2 border-primary pb-4">Network</a>
                            <a href="/earnings" className="text-sm font-medium text-slate-600 hover:text-primary">Earnings</a>
                            <a href="/settings" className="text-sm font-medium text-slate-600 hover:text-primary">Settings</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                            U
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Page Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Referral & Team Management</h1>
                        <p className="text-slate-500">
                            Monitor your downline performance and expand your network across 6 levels.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                            <span className="material-symbols-outlined text-slate-600">download</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined">person_add</span>
                            Add Partner
                        </button>
                    </div>
                </div>

                {/* Referral Link & QR Code */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Referral Link Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Your Unique Referral Link</h2>
                        <p className="text-sm text-slate-500 mb-4">
                            Invite new members to join your Level 1 network and earn commissions on every trade they make.
                        </p>

                        {/* Link Input */}
                        <div className="flex items-center gap-3 mb-6">
                            <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                Copy
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Referrals</div>
                                <div className="text-3xl font-bold text-slate-900">{totalReferrals.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Active Today</div>
                                <div className="text-3xl font-bold text-success">{activeToday}</div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center">
                        <div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-6xl text-slate-300">qr_code_2</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Network QR Code</h3>
                        <p className="text-sm text-slate-500 mb-4">Scan to register under user789</p>
                        <button className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                            <span className="material-symbols-outlined text-lg">share</span>
                            Share QR Code
                        </button>
                    </div>
                </div>

                {/* Level Tabs */}
                <div className="bg-white rounded-t-2xl border border-b-0 border-slate-200 px-6">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {levels.map((level) => (
                            <button
                                key={level.level}
                                onClick={() => setActiveLevel(level.level)}
                                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeLevel === level.level
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Level {level.level}
                                <span className="ml-2 text-slate-400">({level.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Team Members Table */}
                <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="relative flex-1 max-w-xs">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Filter Level 1..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-slate-600">SORT BY:</span>
                            <select className="px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>Recently Joined</option>
                                <option>Highest Contribution</option>
                                <option>Name (A-Z)</option>
                                <option>Status</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Contribution
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${member.avatarColor} rounded-full flex items-center justify-center text-slate-700 font-bold text-sm`}>
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{member.name}</div>
                                                <div className="text-xs text-slate-500">ID: {member.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {member.joinDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${member.statusColor}`}>
                                            ● {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                        {member.contribution}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-slate-400">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Showing 1 to 4 of 24 members
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-primary text-white rounded-lg font-semibold text-sm">
                                1
                            </button>
                            <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                2
                            </button>
                            <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                3
                            </button>
                            <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-sm text-slate-500">
                    <div>© 2023 FintechMLM Inc. All rights reserved.</div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <a href="#" className="hover:text-primary">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
