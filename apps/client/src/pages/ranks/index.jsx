import React, { useState } from "react";
import RankProgress from "./RankProgress";
import TotalRewards from "./TotalRewards";
import CareerRoadmap from "./CareerRoadmap";
import RewardsFilter from "./RewardsFilter";
import RewardCard from "./RewardCard";
import { rewards } from "./data";

export default function Ranks() {
    const [activeTab, setActiveTab] = useState("All Rewards");

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
                />
                <TotalRewards />
            </div>

            <CareerRoadmap />

            <RewardsFilter activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                ))}
            </div>
        </div>
    );
}
