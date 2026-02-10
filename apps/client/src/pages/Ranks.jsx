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
      showClaim: false,
    },
    {
      id: 2,
      title: "Elite Timepiece",
      value: "$2,500 Val.",
      description:
        "Reached Platinum rank and maintained for 2 consecutive months.",
      status: "READY TO CLAIM",
      statusColor: "bg-blue-100 text-blue-700",
      bgColor: "bg-blue-50",
      icon: "schedule",
      iconColor: "text-blue-600",
      showClaim: true,
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
      progressText: "75% COMPLETE",
    },
    {
      id: 4,
      title: "Annual Leadership Retreat",
      value: "Priceless",
      description:
        "Must reach Blue Diamond rank before the December 31st deadline.",
      status: "LOCKED",
      statusColor: "bg-slate-100 text-slate-500",
      bgColor: "bg-slate-100",
      icon: "flight",
      iconColor: "text-slate-300",
      lockText: "Next available at Blue Diamond",
    },
    {
      id: 5,
      title: "Profit Sharing Pool",
      value: "Variable",
      description:
        "Participate in 2% of the global company turnover quarterly.",
      status: "LOCKED",
      statusColor: "bg-slate-100 text-slate-500",
      bgColor: "bg-slate-100",
      icon: "account_balance",
      iconColor: "text-slate-300",
      lockText: "Next available at Ambassador",
    },
    {
      id: 6,
      title: "Founder's Equity Grant",
      value: "100k Units",
      description:
        "Legacy reward for consistent top-tier performance over 24 months.",
      status: "LOCKED",
      statusColor: "bg-slate-100 text-slate-500",
      bgColor: "bg-slate-100",
      icon: "handshake",
      iconColor: "text-slate-300",
      lockText: "Next available at Crown Ambassador",
    },
  ];

  const careerRoadmap = [
    {
      rank: "Ruby",
      status: "COMPLETED",
      color: "bg-primary",
      textColor: "text-primary",
    },
    {
      rank: "Platinum",
      status: "COMPLETED",
      color: "bg-primary",
      textColor: "text-primary",
    },
    {
      rank: "DIAMOND",
      status: "CURRENT",
      color: "bg-primary",
      textColor: "text-primary",
      current: true,
    },
    {
      rank: "Blue Diamond",
      status: "LOCKED",
      color: "bg-slate-300",
      textColor: "text-slate-400",
    },
    {
      rank: "Ambassador",
      status: "LOCKED",
      color: "bg-slate-300",
      textColor: "text-slate-400",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Path to Blue Diamond */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Rank Circle */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-8 border-primary/20 flex items-center justify-center">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-primary bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl md:text-4xl text-primary">
                    military_tech
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-primary text-white text-[10px] md:text-xs font-bold rounded-full shadow-lg">
                  DIAMOND
                </span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-2">
                Next Rank: Blue Diamond
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-6 font-medium">
                You're {progressPercent}% of the way to your next rank
                advancement. Keep it up!
              </p>

              {/* Progress Bar */}
              <div className="mb-6 max-w-md mx-auto md:mx-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Total Progress
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-primary">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                <div className="bg-slate-50 rounded-xl p-3 md:p-4 border border-slate-100">
                  <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1">
                    Current PV
                  </div>
                  <div className="text-lg md:text-2xl font-black text-slate-900">
                    {currentPV.toLocaleString()}{" "}
                    <span className="text-[10px] md:text-xs text-slate-400 font-bold">
                      / {targetPV / 1000}k
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 md:p-4 border border-slate-100">
                  <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1">
                    Direct Legs
                  </div>
                  <div className="text-lg md:text-2xl font-black text-slate-900">
                    {directLegs}{" "}
                    <span className="text-[10px] md:text-xs text-slate-400 font-bold">
                      / {targetLegs}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Total Rewards */}
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 text-primary">
              Total Rewards Claimed
            </div>
            <div className="text-3xl md:text-5xl font-black mb-6">
              $24,850
              <span className="text-base md:text-xl text-slate-500 ml-1">
                .00
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  emoji_events
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-300">
                  12 Achievements Unlocked
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  card_giftcard
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-300">
                  2 Rewards Pending Claim
                </span>
              </div>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-primary/20">
              Claim Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Career Roadmap */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 font-display">
          Career Roadmap
        </h2>

        <div className="relative px-4">
          {/* Progress Line */}
          <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-100 hidden md:block"></div>
          <div className="absolute top-6 left-12 w-[40%] h-0.5 bg-primary hidden md:block"></div>

          {/* Ranks */}
          <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-0">
            {careerRoadmap.map((item, index) => (
              <div
                key={index}
                className="flex md:flex-col items-center gap-4 md:gap-3"
              >
                <div
                  className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center ring-4 ring-white shadow-md relative z-10 ${
                    item.current ? "ring-primary/20 scale-110" : ""
                  }`}
                >
                  {item.status === "COMPLETED" ? (
                    <span className="material-symbols-outlined text-white text-xl">
                      check
                    </span>
                  ) : item.current ? (
                    <span className="material-symbols-outlined text-white text-xl">
                      military_tech
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 text-xl">
                      lock
                    </span>
                  )}
                </div>
                <div className="text-left md:text-center">
                  <div
                    className={`font-black text-sm ${item.current ? "text-primary" : "text-slate-900 opacity-60"}`}
                  >
                    {item.rank}
                  </div>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      item.current ? "text-primary/70" : "text-slate-400"
                    }`}
                  >
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards Filter Context */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {["All Rewards", "Unlocked", "Upcoming"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest pl-2">
          <span>Sort:</span>
          <select className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer">
            <option>Most Valuable</option>
            <option>Recent</option>
          </select>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`${reward.bgColor} rounded-2xl border border-transparent hover:border-slate-200 transition-all p-6 relative group shadow-sm flex flex-col`}
          >
            {/* Status Badge */}
            <div className="mb-6 flex justify-between items-start">
              <span
                className={`${reward.statusColor} px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider`}
              >
                {reward.status}
              </span>
              <span
                className={`material-symbols-outlined text-3xl ${reward.iconColor} opacity-20 group-hover:opacity-100 transition-opacity`}
              >
                {reward.icon}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {reward.title}
            </h3>
            <div className="text-2xl font-black text-slate-900 mb-3">
              {reward.value}
            </div>
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
              {reward.description}
            </p>

            {/* Progress Bar for In Progress */}
            {reward.progress && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 text-[10px] font-bold">
                  <span className="text-slate-400">{reward.progressText}</span>
                  <span className="text-slate-900">{reward.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full"
                    style={{ width: `${reward.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Area */}
            <div className="mt-auto pt-6 border-t border-slate-200/50">
              {reward.showClaim ? (
                <button className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-sm">
                  Claim Now
                </button>
              ) : reward.claimedDate ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <span className="material-symbols-outlined text-lg">
                    check_circle
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {reward.claimedDate}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">
                    lock
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {reward.lockText}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
