import React from "react";

export default function MetricCard({ title, value, icon, trend, subValue, iconBg, iconColor }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${iconBg} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} shadow-lg shadow-current/10`}>
                        <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
                    </div>
                    {trend && (
                        <div className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-green-100">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            {trend}
                        </div>
                    )}
                    {subValue && !trend && (
                        <div className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100">
                            {subValue}
                        </div>
                    )}
                </div>

                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-[#172b4d] tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
