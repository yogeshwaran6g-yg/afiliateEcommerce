import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Network() {
    const [activeLevel, setActiveLevel] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Hamburger Menu - Mobile Only */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        <div className="flex items-center gap-2 md:gap-4 ml-auto">
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                    search
                                </span>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                U
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 px-4 md:px-8 py-4 md:py-8">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Referral & Team Management</h1>
                            <p className="text-sm md:text-base text-slate-500">
                                Monitor your downline performance and expand your network across 6 levels.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                                <span className="material-symbols-outlined text-slate-600">download</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm">
                                <span className="material-symbols-outlined">person_add</span>
                                <span className="hidden sm:inline">Add Partner</span>
                            </button>
                        </div>
                    </div>

                    {/* Referral Link & QR Code */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        {/* Referral Link Card */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 md:p-6">
                            <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">Your Unique Referral Link</h2>
                            <p className="text-xs md:text-sm text-slate-500 mb-4">
                                Invite new members to join your Level 1 network and earn commissions on every trade they make.
                            </p>

                            {/* Link Input */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 md:mb-6">
                                <input
                                    type="text"
                                    value={referralLink}
                                    readOnly
                                    className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-mono text-slate-700"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                    Copy
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Referrals</div>
                                    <div className="text-2xl md:text-3xl font-bold text-slate-900">{totalReferrals.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Active Today</div>
                                    <div className="text-2xl md:text-3xl font-bold text-success">{activeToday}</div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 flex flex-col items-center justify-center">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-5xl md:text-6xl text-slate-300">qr_code_2</span>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">Network QR Code</h3>
                            <p className="text-xs md:text-sm text-slate-500 mb-4 text-center">Scan to register under user789</p>
                            <button className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                                <span className="material-symbols-outlined text-lg">share</span>
                                Share QR Code
                            </button>
                        </div>
                    </div>

                    {/* Level Tabs */}
                    <div className="bg-white rounded-t-2xl border border-b-0 border-slate-200 px-2 md:px-6">
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                            {levels.map((level) => (
                                <button
                                    key={level.level}
                                    onClick={() => setActiveLevel(level.level)}
                                    className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold whitespace-nowrap transition-colors ${activeLevel === level.level
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    Level {level.level}
                                    <span className="ml-1 md:ml-2 text-slate-400">({level.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Team Members Table */}
                    <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden">
                        {/* Search and Sort Header */}
                        <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
                            <div className="flex items-center gap-2 text-xs md:text-sm">
                                <span className="font-semibold text-slate-600">SORT BY:</span>
                                <select className="px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs md:text-sm">
                                    <option>Recently Joined</option>
                                    <option>Highest Contribution</option>
                                    <option>Name (A-Z)</option>
                                    <option>Status</option>
                                </select>
                            </div>
                        </div>

                        {/* Table Header - Hidden on mobile */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Member</div>
                            <div className="col-span-2">Join Date</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3">Contribution</div>
                            <div className="col-span-1">Action</div>
                        </div>

                        {/* Members List */}
                        <div className="divide-y divide-slate-200">
                            {members.map((member) => (
                                <div key={member.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:px-6 md:py-4 md:items-center hover:bg-slate-50 transition-colors">
                                    {/* Mobile Layout */}
                                    <div className="md:hidden space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${member.avatarColor} rounded-full flex items-center justify-center font-bold text-slate-700`}>
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{member.name}</div>
                                                    <div className="text-xs text-slate-500">{member.id}</div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.statusColor}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-slate-500">Joined {member.joinDate}</div>
                                            <div className="font-bold text-slate-900">{member.contribution}</div>
                                        </div>
                                        <button className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                            View Details
                                        </button>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden md:contents">
                                        <div className="col-span-1 text-sm font-semibold text-slate-500">{member.id}</div>
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className={`w-10 h-10 ${member.avatarColor} rounded-full flex items-center justify-center font-bold text-slate-700`}>
                                                {member.avatar}
                                            </div>
                                            <div className="font-semibold text-slate-900">{member.name}</div>
                                        </div>
                                        <div className="col-span-2 text-sm text-slate-600">{member.joinDate}</div>
                                        <div className="col-span-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${member.statusColor}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-lg font-bold text-slate-900">{member.contribution}</div>
                                        <div className="col-span-1">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg">
                                                <span className="material-symbols-outlined text-slate-600">more_vert</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="px-4 md:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs md:text-sm text-slate-500">
                                Showing <span className="font-semibold text-slate-900">1-4</span> of <span className="font-semibold text-slate-900">24</span> members
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                    Previous
                                </button>
                                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold">
                                    1
                                </button>
                                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                    2
                                </button>
                                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 mt-auto py-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
                        <div>© 2023 FintechMLM Inc. All rights reserved.</div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <a href="#" className="hover:text-primary">Privacy Policy</a>
                            <a href="#" className="hover:text-primary">Terms of Service</a>
                            <a href="#" className="hover:text-primary">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
