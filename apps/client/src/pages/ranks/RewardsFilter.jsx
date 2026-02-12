import React from "react";

const RewardsFilter = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                {["All Rewards", "Unlocked", "Upcoming"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === tab
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
    );
};

export default RewardsFilter;
