import React from "react";

const RewardCard = ({ reward }) => {
    return (
        <div
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
            <h3 className="text-lg font-bold text-slate-900 mb-1">{reward.title}</h3>
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
                        <span className="material-symbols-outlined text-lg">lock</span>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {reward.lockText}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RewardCard;
