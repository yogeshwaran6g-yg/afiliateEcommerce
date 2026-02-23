import React from "react";
import Skeleton from "../../components/ui/Skeleton";

const TotalRewards = ({ isLoading }) => {
    return (
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div className="relative z-10">
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 text-primary">
                    Total Rewards Claimed
                </div>
                {isLoading ? (
                    <>
                        <Skeleton dark={true} width="160px" height="48px" className="mb-6" />
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <Skeleton variant="circular" width="24px" height="24px" className="bg-white/10" />
                                <Skeleton width="180px" height="16px" className="bg-white/10" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton variant="circular" width="24px" height="24px" className="bg-white/10" />
                                <Skeleton width="150px" height="16px" className="bg-white/10" />
                            </div>
                        </div>
                        <Skeleton width="100%" height="56px" className="rounded-xl bg-white/10" />
                    </>
                ) : (
                    <>
                        <div className="text-3xl md:text-5xl font-black mb-6">
                            ₹24,850
                            <span className="text-base md:text-xl text-slate-500 ml-1">.00</span>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default TotalRewards;
