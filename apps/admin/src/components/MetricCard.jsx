import React from "react";

export default function MetricCard({ title, value, icon, trend, subValue, iconBg, iconColor, showPulse }) {
    return (
        <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${iconBg} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} shadow-lg shadow-current/10`}>
                        <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
                    </div>
                    {trend && (
                        <div className={`px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-green-100 ${showPulse ? 'animate-pulse' : ''}`}>
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

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                        <h3 className="text-2xl font-black text-[#172b4d] tracking-tight">{value}</h3>
                    </div>

                    {showPulse && (
                        <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                            <svg viewBox="0 0 40 20" className="w-full h-full">
                                <path
                                    d="M0,15 L5,15 L8,5 L12,18 L15,10 L20,10 L23,2 L27,15 L32,15 L35,10 L40,10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`${iconColor} animate-[pulse-path_3s_linear_infinite]`}
                                    style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-path {
                    0% { stroke-dashoffset: 100; }
                    50% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -100; }
                }
            `}} />
        </div>
    );
}
