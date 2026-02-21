import React from "react";

export default function TopAffiliates() {
    const affiliates = [
        {
            name: "Marcus Vane",
            level: "Level 8 Diamond",
            value: "₹12,450",
            trend: "+14%",
            trendColor: "text-green-600",
            momentum: "up",
            momentumValue: "2"
        },
        {
            name: "Sarah Jenkins",
            level: "Level 6 Platinum",
            value: "₹9,820",
            trend: "+8%",
            trendColor: "text-green-600",
            momentum: "none",
            momentumValue: "0"
        },
        {
            name: "Lee Kwang",
            level: "Level 7 Emerald",
            value: "₹8,100",
            trend: "-2%",
            trendColor: "text-red-600",
            momentum: "down",
            momentumValue: "1"
        }
    ];

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-700">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h4 className="text-lg font-black text-[#172b4d] uppercase tracking-tighter">Performance Leaders</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top Affiliate Acquisition</p>
                </div>
                <button className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">View Analytics</button>
            </div>

            <div className="space-y-6">
                {affiliates.map((aff, i) => (
                    <div key={i} className="flex items-center justify-between group/item cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-50 overflow-hidden transition-transform group-hover/item:scale-110">
                                    <img src={`https://i.pravatar.cc/150?u=${aff.name}`} alt={aff.name} />
                                </div>
                                {aff.momentum !== 'none' && (
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-white shadow-sm ${aff.momentum === 'up' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        <span className="material-symbols-outlined text-[10px] font-bold">
                                            {aff.momentum === 'up' ? 'arrow_upward' : 'arrow_downward'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h5 className="text-sm font-black text-[#172b4d] leading-none mb-1 group-hover/item:text-primary transition-colors">{aff.name}</h5>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{aff.level}</p>
                                    {aff.momentumValue !== "0" && (
                                        <span className={`text-[8px] font-black uppercase ${aff.momentum === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {aff.momentum === 'up' ? '+' : '-'}{aff.momentumValue} POS
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-[#172b4d] tracking-tight group-hover/item:scale-110 transition-transform origin-right">{aff.value}</div>
                            <div className={`text-[10px] font-black uppercase tracking-tighter ${aff.trendColor}`}>{aff.trend}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
