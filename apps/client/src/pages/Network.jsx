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
        <div className="p-4 md:p-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Network Management</h1>
                    <p className="text-sm md:text-base text-slate-500 mt-1">
                        Monitor downline performance and expand your network across 6 levels.
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none p-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 text-lg md:text-xl">download</span>
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Member
                    </button>
                </div>
            </div>

            {/* Referral Link & QR Code */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Referral Link Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Referral Link</h2>
                    <p className="text-sm text-slate-500 mb-4 whitespace-normal">
                        Invite members to your Level 1 network.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-mono text-slate-700 overflow-hidden text-ellipsis"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                            Copy
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Referrals</div>
                            <div className="text-2xl md:text-3xl font-black text-slate-900">{totalReferrals.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Today</div>
                            <div className="text-2xl md:text-3xl font-black text-emerald-600">{activeToday}</div>
                        </div>
                    </div>
                </div>

                {/* QR Code Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center shadow-sm">
                    <div className="w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-5xl text-slate-300">qr_code_2</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">Network QR</h3>
                    <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                        <span className="material-symbols-outlined text-lg">share</span>
                        Share QR
                    </button>
                </div>
            </div>

            {/* Level Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="flex items-center gap-0 overflow-x-auto no-scrollbar border-b border-slate-100">
                    {levels.map((level) => (
                        <button
                            key={level.level}
                            onClick={() => setActiveLevel(level.level)}
                            className={`flex-1 px-4 md:px-6 py-4 text-xs md:text-sm font-bold whitespace-nowrap transition-colors relative ${activeLevel === level.level
                                ? "text-primary bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            Lvl {level.level}
                            <span className="ml-1 opacity-50">({level.count})</span>
                        </button>
                    ))}
                </div>

                {/* Team Members Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Join Date</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contribution</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 md:w-10 md:h-10 ${member.avatarColor} rounded-full flex items-center justify-center text-slate-700 font-bold text-xs md:text-sm shadow-inner`}>
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">ID: {member.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-slate-600 hidden sm:table-cell">
                                        {member.joinDate}
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${member.statusColor}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-sm font-black text-slate-900">
                                        {member.contribution}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
                    <div className="text-[10px] md:text-xs text-slate-400 font-bold">
                        PAGE 1 OF 6
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="h-8 w-8 bg-primary text-white rounded-lg font-bold text-xs">1</button>
                        <button className="h-8 w-8 border border-slate-200 rounded-lg font-bold text-xs text-slate-500 hover:bg-white">2</button>
                        <button className="h-8 w-8 border border-slate-200 rounded-lg font-bold text-xs text-slate-500 hover:bg-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
