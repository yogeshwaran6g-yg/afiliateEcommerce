import React, { useState, useMemo } from "react";
import { useCommissionConfig } from "../hooks/useCommissionConfig";

const CommissionLevel = ({ level, label, description, value, active, onToggle, onChange }) => (
    <div className={`p-5 md:p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 ${active ? 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-slate-50/50 border-slate-200 opacity-60'}`}>
        <div className="flex items-center gap-4 flex-1">
            <div className={`flex w-12 h-12 items-center justify-center rounded-2xl transition-colors ${active ? 'bg-primary/5 text-primary' : 'bg-slate-100 text-slate-300'}`}>
                <span className="material-symbols-outlined text-xl font-bold">
                    {level === 1 ? 'person_add' : level === 2 ? 'group' : 'account_tree'}
                </span>
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="text-sm md:text-base font-black text-[#172b4d] truncate">{label || `Level ${level}`}</h4>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{description || (level === 1 ? "Direct referral" : `Tier ${level} network`)}</p>
            </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t border-slate-50 md:border-t-0">
            <div className="relative group">
                <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={!active}
                    className="w-24 md:w-28 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-right pr-10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">%</span>
            </div>

            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative shrink-0 ${active ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-slate-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    </div>
);

export default function CommissionStructure() {
    const { levels, loading, saving, updateLevelProperty, saveConfigs } = useCommissionConfig();
    const [baseVolume, setBaseVolume] = useState(10000.00);

    const levelsData = useMemo(() => {
        return levels.map(l => ({
            ...l,
            label: l.level === 1 ? "Direct Referral" : `Network Tier ${l.level}`,
            description: l.level === 1 ? "Direct acquisition bonus" : `Multi-level network distribution`,
        }));
    }, [levels]);

    const totalPayoutPercent = useMemo(() => {
        return levels.reduce((acc, l) => acc + (l.is_active ? parseFloat(l.percent || 0) : 0), 0);
    }, [levels]);

    const totalPayoutAmount = (baseVolume * totalPayoutPercent) / 100;
    const companyNet = baseVolume - totalPayoutAmount;
    const operationalFees = baseVolume * 0.045;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching configs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10 rounded-full"></div>

            {/* Header & Title */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                        <span className="text-primary font-bold">Finance</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Commission Management</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Design your multi-tier revenue distribution engine. Changes impact network rewards instantly.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={saveConfigs}
                        disabled={saving}
                        className="w-full md:w-auto px-10 py-4 bg-[#1e293b] text-white text-sm font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 leading-none disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white/20 border-b-white rounded-full"></span>
                                <span>Deploying...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                <span>Deploy Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-12">
                {/* Levels List */}
                <div className="flex-1 space-y-4">
                    <div className="p-1">
                        <div className="flex items-center justify-between mb-8">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Nodes</h5>
                            <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">6 Active Tiers</span>
                        </div>
                        <div className="space-y-5">
                            {levelsData.map(level => (
                                <CommissionLevel
                                    key={level.level}
                                    {...level}
                                    active={level.is_active}
                                    value={level.percent}
                                    onToggle={() => updateLevelProperty(level.level, 'is_active', !level.is_active)}
                                    onChange={(val) => updateLevelProperty(level.level, 'percent', val)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Simulation Sidebar */}
                <div className="w-full xl:w-[400px] space-y-6">
                    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-[0_32px_64px_rgba(0,0,0,0.02)] space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-2xl font-bold">insights</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Simulation</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Payouts</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BASE SALES VOLUME</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                                <input
                                    type="number"
                                    value={baseVolume}
                                    onChange={(e) => setBaseVolume(parseFloat(e.target.value) || 0)}
                                    className="w-full pl-12 pr-6 py-6 bg-slate-50 border border-slate-100 rounded-3xl text-3xl font-black text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-50">
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Payout ({totalPayoutPercent.toFixed(2)}%)</p>
                                    <div className="text-3xl font-black text-primary tracking-tight">${totalPayoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Net Revenue</p>
                                    <div className="text-3xl font-black text-slate-900 tracking-tight">${companyNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Sustainability Bar</span>
                                <span className={totalPayoutPercent > 80 ? 'text-red-500' : 'text-green-600'}>
                                    {(100 - totalPayoutPercent).toFixed(1)}% margin
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 shadow-sm ${totalPayoutPercent > 80 ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(totalPayoutPercent, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                            <span className="material-symbols-outlined text-blue-600 font-bold">verified</span>
                            <div className="space-y-1">
                                <p className="text-xs text-blue-900 font-black">Fee Calculation Notice</p>
                                <p className="text-[11px] text-blue-800/70 font-bold leading-relaxed">
                                    Operational fees (4.5%) are already deducted from the Platform Net Revenue. Distribution is stable.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final Notice */}
                    <div className="px-10 py-6 border-l-2 border-amber-200 bg-amber-50/30">
                        <p className="text-[10px] text-amber-900/60 font-bold leading-relaxed uppercase tracking-wider">
                            Changes require re-calibration of <br />
                            affiliate point values (PV).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
