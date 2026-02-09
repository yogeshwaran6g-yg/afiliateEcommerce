export default function Charts() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
    const teamGrowthData = [40, 65, 50, 80, 45, 90];

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Income Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h4 className="font-bold text-lg text-slate-900">Monthly Income</h4>
                        <p className="text-sm text-slate-500 mt-1">$1,200 Average per month</p>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                        Last 6 Months
                    </div>
                </div>

                <svg viewBox="0 0 400 200" className="w-full h-48">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Income curve */}
                    <path
                        d="M 20,140 Q 80,100 130,110 T 240,60 T 380,40"
                        fill="none"
                        stroke="#1754cf"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Month labels */}
                    {months.map((month, i) => (
                        <text
                            key={i}
                            x={20 + i * 65}
                            y="190"
                            fontSize="11"
                            fill="#94a3b8"
                            textAnchor="middle"
                        >
                            {month}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Team Growth Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h4 className="font-bold text-lg text-slate-900">Team Growth</h4>
                        <p className="text-sm text-slate-500 mt-1">142 New members joined</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                        <span className="material-symbols-outlined text-base">trending_down</span>
                        <span>2.1%</span>
                    </div>
                </div>

                <div className="flex gap-3 items-end h-48 px-4">
                    {teamGrowthData.map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                                <div
                                    style={{ height: `${value}%` }}
                                    className={`w-full rounded-t-lg transition-all ${i % 2 === 0 ? 'bg-primary' : 'bg-blue-300'
                                        }`}
                                />
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{months[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
