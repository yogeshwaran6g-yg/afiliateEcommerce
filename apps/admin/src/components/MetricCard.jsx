import React from "react";

export default function MetricCard({ title, value, icon, trend, subValue, iconBg, iconColor, showPulse }) {
    // Generate a soft gradient based on iconColor class
    const getGradient = () => {
        if (iconColor.includes('emerald')) return 'from-emerald-500/10 to-emerald-500/5';
        if (iconColor.includes('amber')) return 'from-amber-500/10 to-amber-500/5';
        if (iconColor.includes('blue')) return 'from-blue-500/10 to-blue-500/5';
        if (iconColor.includes('purple')) return 'from-purple-500/10 to-purple-500/5';
        if (iconColor.includes('pink')) return 'from-pink-500/10 to-pink-500/5';
        if (iconColor.includes('indigo')) return 'from-indigo-500/10 to-indigo-500/5';
        if (iconColor.includes('orange')) return 'from-orange-500/10 to-orange-500/5';
        if (iconColor.includes('rose')) return 'from-rose-500/10 to-rose-500/5';
        if (iconColor.includes('cyan')) return 'from-cyan-500/10 to-cyan-500/5';
        if (iconColor.includes('yellow')) return 'from-yellow-500/10 to-yellow-500/5';
        if (iconColor.includes('red')) return 'from-red-500/10 to-red-500/5';
        return 'from-slate-500/10 to-slate-500/5';
    };

    return (
        <div className="group relative bg-white/70 backdrop-blur-md px-7 py-5 rounded-4xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className={`absolute inset-0 bg-linear-to-br ${getGradient()} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            {/* Decorative Sparkle/Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${iconBg} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor} shadow-xl shadow-current/5 group-hover:scale-110 transition-transform duration-500`}>
                        <span className="material-symbols-outlined text-3xl font-extrabold">{icon}</span>
                    </div>
                    {trend && (
                        <div className="px-3 py-1.5 bg-emerald-50/80 backdrop-blur-sm text-emerald-600 rounded-full text-[11px] font-black flex items-center gap-1.5 border border-emerald-100/50 shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            {trend}
                        </div>
                    )}
                    {subValue && !trend && (
                        <div className="px-3 py-1.5 bg-rose-50/80 backdrop-blur-sm text-rose-600 rounded-full text-[11px] font-black border border-rose-100/50 shadow-sm">
                            {subValue}
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-[#1a2b4b] tracking-tighter flex items-baseline gap-1">
                            {value}
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-20"></span>
                        </h3>
                    </div>

                    {showPulse && (
                        <div className="w-20 h-10 opacity-30 group-hover:opacity-80 transition-all duration-500 translate-y-1">
                            <svg viewBox="0 0 40 20" className="w-full h-full">
                                <path
                                    d="M0,15 L5,15 L8,5 L12,18 L15,10 L20,10 L23,2 L27,15 L32,15 L35,10 L40,10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`${iconColor} animate-[pulse-path_3s_ease-in-out_infinite]`}
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
