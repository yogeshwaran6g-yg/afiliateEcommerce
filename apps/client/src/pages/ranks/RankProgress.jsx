import React from "react";

const RankProgress = ({
    progressPercent,
    directLegs,
    targetLegs,
}) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* Rank Circle */}
                <div className="relative shrink-0">
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
                        You're {progressPercent}% of the way to your next rank advancement.
                        Keep it up!
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
                    <div className="grid grid-cols-1 gap-4 max-w-md mx-auto md:mx-0">
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
    );
};

export default RankProgress;
