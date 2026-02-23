import React, { useState } from "react";
import RankProgress from "./RankProgress";
import TotalRewards from "./TotalRewards";
import CareerRoadmap from "./CareerRoadmap";
import RewardsFilter from "./RewardsFilter";
import RewardCard from "./RewardCard";
import { rewards } from "./data";
import Skeleton from "../../components/ui/Skeleton";

export default function Ranks() {
    const [activeTab, setActiveTab] = useState("All Rewards");
    const [isLoading, setIsLoading] = useState(false); // Can be linked to a hook later

    const directLegs = 5;
    const targetLegs = 6;
    const progressPercent = 82;

    const filteredRewards = rewards.filter((reward) => {
        if (activeTab === "All Rewards") return true;
        if (activeTab === "Unlocked") return reward.status === "UNLOCKED" || reward.status === "READY TO CLAIM";
        if (activeTab === "Upcoming") return reward.status === "IN PROGRESS" || reward.status === "LOCKED";
        return true;
    });

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RankProgress
                    progressPercent={progressPercent}
                    directLegs={directLegs}
                    targetLegs={targetLegs}
                    isLoading={isLoading}
                />
                <TotalRewards isLoading={isLoading} />
            </div>

            <CareerRoadmap isLoading={isLoading} />

            <RewardsFilter activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-[300px]">
                            <div className="flex justify-between mb-8">
                                <Skeleton width="60px" height="20px" />
                                <Skeleton variant="circular" width="40px" height="40px" />
                            </div>
                            <Skeleton width="60%" height="24px" className="mb-2" />
                            <Skeleton width="40%" height="32px" className="mb-4" />
                            <Skeleton width="100%" height="40px" className="mb-8" />
                            <div className="mt-auto pt-6 border-t border-slate-200/50">
                                <Skeleton width="100%" height="40px" className="rounded-lg" />
                            </div>
                        </div>
                    ))
                ) : (
                    filteredRewards.map((reward) => (
                        <RewardCard key={reward.id} reward={reward} />
                    ))
                )}
            </div>
        </div>
    );
}
