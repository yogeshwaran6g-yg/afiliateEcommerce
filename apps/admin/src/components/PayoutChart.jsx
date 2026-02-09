import React from "react";

export default function PayoutChart() {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative h-full flex flex-col items-center justify-center">
            <h4 className="text-lg font-bold text-[#172b4d] mb-8 w-full">Payout Distribution</h4>

            <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Outer Ring */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="10"
                    />
                    {/* Active Segment */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#1754cf"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="62.8"
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-[#172b4d]">100%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Split</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full mt-10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Direct Ref</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Level Bonus</span>
                </div>
            </div>
        </div>
    );
}
