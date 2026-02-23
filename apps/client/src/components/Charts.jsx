import React from 'react';
import { useWallet } from "../hooks/useWallet";
import Skeleton from './ui/Skeleton';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

export default function Charts() {
    const { data: wallet, isLoading } = useWallet();

    const monthlyIncomeData = wallet?.charts?.monthlyIncome || [];
    const monthlyJoinsData = wallet?.charts?.monthlyJoins || [];

    // Helper to format months for display
    const formatMonth = (monthStr) => {
        if (!monthStr) return "";
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    };

    const formattedIncomeData = monthlyIncomeData.map(d => ({
        name: formatMonth(d.month),
        value: parseFloat(d.value)
    }));

    const formattedJoinsData = monthlyJoinsData.map(d => ({
        name: formatMonth(d.month),
        value: parseInt(d.value)
    }));

    const avgIncome = formattedIncomeData.length > 0
        ? (formattedIncomeData.reduce((a, b) => a + b.value, 0) / formattedIncomeData.length).toFixed(0)
        : 0;

    const totalJoins = formattedJoinsData.reduce((a, b) => a + b.value, 0);

    const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                    <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
                    <p className="text-lg font-black text-slate-900">
                        {prefix}{new Intl.NumberFormat('en-IN').format(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Income Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h4 className="font-extrabold text-xl text-slate-900 tracking-tight">Monthly Income</h4>
                        {isLoading ? (
                            <Skeleton width="150px" height="16px" className="mt-2" />
                        ) : (
                            <p className="text-sm text-slate-500 mt-1 font-medium">₹{new Intl.NumberFormat('en-IN').format(avgIncome)} avg. per month</p>
                        )}
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 rounded-full text-xs font-bold text-blue-700 border border-blue-100">
                        {isLoading ? (
                            <Skeleton width="80px" height="12px" />
                        ) : (
                            formattedIncomeData.length > 0 ? `Last ${formattedIncomeData.length} Months` : "No data"
                        )}
                    </div>
                </div>

                <div className="h-64 w-full">
                    {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    ) : formattedIncomeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedIncomeData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1754cf" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#1754cf" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip prefix="₹" />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#1754cf"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">No income data yet</div>
                    )}
                </div>
            </div>

            {/* Team Growth Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h4 className="font-extrabold text-xl text-slate-900 tracking-tight">Team Growth</h4>
                        {isLoading ? (
                            <Skeleton width="150px" height="16px" className="mt-2" />
                        ) : (
                            <p className="text-sm text-slate-500 mt-1 font-medium">{totalJoins} new members joined</p>
                        )}
                    </div>
                    {isLoading ? (
                        <Skeleton width="60px" height="24px" className="rounded-full" />
                    ) : wallet?.members_change !== undefined && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${parseFloat(wallet.members_change) >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            <span className="material-symbols-outlined text-base font-bold">
                                {parseFloat(wallet.members_change) >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            <span>{Math.abs(wallet.members_change)}%</span>
                        </div>
                    )}
                </div>

                <div className="h-64 w-full">
                    {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    ) : formattedJoinsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formattedJoinsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar
                                    dataKey="value"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                    animationDuration={1500}
                                >
                                    {formattedJoinsData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === formattedJoinsData.length - 1 ? '#1754cf' : '#e2e8f0'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">No growth data yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}

