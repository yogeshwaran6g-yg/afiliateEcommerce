import React from "react";

export default function TopAffiliates() {
    const affiliates = [
        {
            name: "Marcus Vane",
            level: "Level 8 Diamond",
            value: "$12,450",
            trend: "+14%",
            trendColor: "text-green-600"
        },
        {
            name: "Sarah Jenkins",
            level: "Level 6 Platinum",
            value: "$9,820",
            trend: "+8%",
            trendColor: "text-green-600"
        },
        {
            name: "Lee Kwang",
            level: "Level 7 Emerald",
            value: "$8,100",
            trend: "-2%",
            trendColor: "text-red-600"
        }
    ];

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-bold text-[#172b4d]">Top Affiliates</h4>
                <button className="text-primary text-xs font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-6">
                {affiliates.map((aff, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-slate-100 border-2 border-slate-50 overflow-hidden transition-transform group-hover:scale-105">
                                <img src={`https://i.pravatar.cc/150?u=${aff.name}`} alt={aff.name} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-[#172b4d] leading-none mb-1">{aff.name}</h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{aff.level}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-[#172b4d] tracking-tight">{aff.value}</div>
                            <div className={`text-[10px] font-bold ${aff.trendColor}`}>{aff.trend}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
