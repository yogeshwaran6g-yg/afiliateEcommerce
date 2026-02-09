import React from "react";

export default function SalesChart() {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h4 className="text-lg font-bold text-[#172b4d] mb-1">Monthly Sales Performance</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Revenue growth comparison across all regions</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Year</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Previous Year</span>
                    </div>
                </div>
            </div>

            <div className="h-64 relative w-full pt-4">
                {/* SVG Chart */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1754cf" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#1754cf" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 1, 2, 3].map((i) => (
                        <line key={i} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="#f1f5f9" strokeWidth="1" />
                    ))}

                    {/* Area Fill */}
                    <path
                        d="M0,250 Q100,240 150,200 T250,220 T350,150 T450,180 T550,50 T650,50 T750,200 T850,230 T950,80 L1000,80 L1000,300 L0,300 Z"
                        fill="url(#salesGradient)"
                    />

                    {/* Line Path */}
                    <path
                        d="M0,250 Q100,240 150,200 T250,220 T350,150 T450,180 T550,50 T650,50 T750,200 T850,230 T1000,80"
                        fill="none"
                        stroke="#1754cf"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Dots */}
                    {[0, 150, 350, 550, 650, 850, 1000].map((x, i) => (
                        <circle key={i} cx={x} cy={i === 0 ? 250 : i === 1 ? 200 : i === 2 ? 150 : i === 3 ? 50 : i === 4 ? 50 : i === 5 ? 230 : 80} r="0" fill="#fff" stroke="#1754cf" strokeWidth="3" />
                    ))}
                </svg>

                <div className="flex justify-between mt-6 px-1">
                    {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"].map((month) => (
                        <span key={month} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{month}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
