import React, { useState } from "react";

export default function Ranks() {
    const [activeTab, setActiveTab] = useState("All Rewards");

    const currentPV = 12450;
    const targetPV = 15000;
    const directLegs = 5;
    const targetLegs = 6;
    const progressPercent = 82;

    const rewards = [
        {
            id: 1,
            title: "Fast Start Bonus",
            value: "$1,000",
            description: "Awarded for reaching Ruby rank within your first 30 days.",
            status: "UNLOCKED",
            statusColor: "bg-green-100 text-green-700",
            bgColor: "bg-green-50",
            icon: "payments",
            iconColor: "text-green-600",
            claimedDate: "Claimed on Feb 12",
            showClaim: false
        },
        {
            id: 2,
            title: "Elite Timepiece",
            value: "$2,500 Val.",
            description: "Reached Platinum rank and maintained for 2 consecutive months.",
            status: "READY TO CLAIM",
            statusColor: "bg-blue-100 text-blue-700",
            bgColor: "bg-blue-50",
            icon: "schedule",
            iconColor: "text-blue-600",
            showClaim: true
        },
        {
            id: 3,
            title: "Luxury Car Allowance",
            value: "$15k Fund",
            description: "Maintain Diamond rank with 20,000 Group Volume.",
            status: "IN PROGRESS",
            statusColor: "bg-slate-100 text-slate-700",
            bgColor: "bg-slate-50",
            icon: "directions_car",
            iconColor: "text-slate-400",
            progress: 75,
            progressText: "75% COMPLETE"
        },
        {
            id: 4,
            title: "Annual Leadership Retreat",
            value: "Priceless",
            description: "Must reach Blue Diamond rank before the December 31st deadline.",
            status: "LOCKED",
            statusColor: "bg-slate-100 text-slate-500",
            bgColor: "bg-slate-100",
            icon: "flight",
            iconColor: "text-slate-300",
            lockText: "Next available at Blue Diamond"
        },
        {
            id: 5,
            title: "Profit Sharing Pool",
            value: "Variable",
            description: "Participate in 2% of the global company turnover quarterly.",
            status: "LOCKED",
            statusColor: "bg-slate-100 text-slate-500",
            bgColor: "bg-slate-100",
            icon: "account_balance",
            iconColor: "text-slate-300",
            lockText: "Next available at Ambassador"
        },
        {
            id: 6,
            title: "Founder's Equity Grant",
            value: "100k Units",
            description: "Legacy reward for consistent top-tier performance over 24 months.",
            status: "LOCKED",
            statusColor: "bg-slate-100 text-slate-500",
            bgColor: "bg-slate-100",
            icon: "handshake",
            iconColor: "text-slate-300",
            lockText: "Next available at Crown Ambassador"
        }
    ];

    const careerRoadmap = [
        { rank: "Ruby", status: "COMPLETED", color: "bg-primary", textColor: "text-primary" },
        { rank: "Platinum", status: "COMPLETED", color: "bg-primary", textColor: "text-primary" },
        { rank: "DIAMOND", status: "CURRENT RANK", color: "bg-primary", textColor: "text-primary", current: true },
        { rank: "Blue Diamond", status: "LOCKED", color: "bg-slate-300", textColor: "text-slate-400" },
        { rank: "Ambassador", status: "LOCKED", color: "bg-slate-300", textColor: "text-slate-400" }
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
                        <nav className="flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary">Dashboard</a>
                            <a href="/team" className="text-sm font-medium text-slate-600 hover:text-primary">Team</a>
                            <a href="/ranks" className="text-sm font-bold text-primary border-b-2 border-primary pb-4">Ranks</a>
                            <a href="/wallet" className="text-sm font-medium text-slate-600 hover:text-primary">Wallet</a>
                            <a href="/settings" className="text-sm font-medium text-slate-600 hover:text-primary">Settings</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search achievements..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-700">Alex Rivera</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">DIAMOND RANK</span>
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                                AR
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left: Path to Blue Diamond */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
                        <div className="flex items-start gap-6">
                            {/* Rank Circle */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-primary">military_tech</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">DIAMOND</span>
                                </div>
                            </div>

                            {/* Progress Info */}
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Path to Blue Diamond</h2>
                                <p className="text-slate-500 mb-6">
                                    You've reached {progressPercent}% of the requirements for the next rank. Keep pushing!
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-600">Total Progress</span>
                                        <span className="text-sm font-bold text-primary">{progressPercent}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Current PV</div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {currentPV.toLocaleString()} <span className="text-sm text-slate-400">/ {(targetPV / 1000)}k</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Direct Legs</div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {directLegs} <span className="text-sm text-slate-400">/ {targetLegs}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Total Rewards */}
                    <div className="bg-primary rounded-2xl p-6 text-white">
                        <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                            Total Rewards Claimed
                        </div>
                        <div className="text-5xl font-bold mb-6">$24,850.00</div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">emoji_events</span>
                                <span className="text-sm font-semibold">12 Achievements Unlocked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">card_giftcard</span>
                                <span className="text-sm font-semibold">2 Rewards Pending Claim</span>
                            </div>
                        </div>

                        <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                            View Wallet History
                        </button>
                    </div>
                </div>

                {/* Rewards Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6 border-b border-slate-200">
                            {["All Rewards", "Unlocked", "Upcoming"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-semibold transition-colors ${activeTab === tab
                                            ? "border-b-2 border-primary text-primary"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-semibold">SORT BY:</span>
                            <select className="px-3 py-1 border border-slate-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>Value (High to Low)</option>
                                <option>Value (Low to High)</option>
                                <option>Recently Unlocked</option>
                            </select>
                        </div>
                    </div>

                    {/* Rewards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rewards.map((reward) => (
                            <div
                                key={reward.id}
                                className={`${reward.bgColor} rounded-2xl border-2 ${reward.status === "UNLOCKED" ? "border-green-200" :
                                        reward.status === "READY TO CLAIM" ? "border-blue-200" :
                                            "border-slate-200"
                                    } p-6 relative`}
                            >
                                {/* Status Badge */}
                                <div className="mb-4">
                                    <span className={`${reward.statusColor} px-3 py-1 rounded text-xs font-bold uppercase`}>
                                        {reward.status}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="mb-4">
                                    <span className={`material-symbols-outlined text-5xl ${reward.iconColor}`}>
                                        {reward.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{reward.title}</h3>
                                <div className="text-2xl font-bold text-slate-700 mb-3">{reward.value}</div>
                                <p className="text-sm text-slate-600 mb-4">{reward.description}</p>

                                {/* Progress Bar for In Progress */}
                                {reward.progress && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-slate-500">{reward.progressText}</span>
                                            <span className="text-xs font-bold text-slate-700">{reward.progress}% / 20K GV</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${reward.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                {reward.showClaim && (
                                    <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                                        Claim Reward
                                    </button>
                                )}
                                {reward.claimedDate && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        <span className="text-sm font-semibold">{reward.claimedDate}</span>
                                    </div>
                                )}
                                {reward.lockText && (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <span className="material-symbols-outlined text-lg">lock</span>
                                        <span className="text-sm font-medium">{reward.lockText}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Career Roadmap */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Career Roadmap</h2>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200"></div>
                        <div className="absolute top-6 left-0 w-1/2 h-1 bg-primary"></div>

                        {/* Ranks */}
                        <div className="relative flex justify-between">
                            {careerRoadmap.map((item, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-3 ${item.current ? "ring-4 ring-primary/20" : ""
                                        }`}>
                                        {item.status === "COMPLETED" ? (
                                            <span className="material-symbols-outlined text-white">check</span>
                                        ) : item.current ? (
                                            <span className="material-symbols-outlined text-white">military_tech</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-slate-400">lock</span>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className={`font-bold text-sm ${item.current ? "text-primary" : item.textColor}`}>
                                            {item.rank}
                                        </div>
                                        <div className={`text-xs uppercase tracking-wider ${item.current ? "text-primary font-bold" : "text-slate-400"
                                            }`}>
                                            {item.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
