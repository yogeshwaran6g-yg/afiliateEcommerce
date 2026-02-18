import React, { useState, useMemo } from "react";
import { useCommissionConfig } from "../hooks/useCommissionConfig";

const CommissionLevel = ({ level, label, description, value, active, onToggle, onChange }) => (
    <div className={`p-5 md:p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center gap-4 md:gap-6 ${active ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-slate-200 opacity-60'}`}>
        <div className="flex items-center gap-4 flex-1">
            <div className="hidden md:flex w-10 h-10 items-center justify-center text-slate-300">
                <span className="material-symbols-outlined">drag_indicator</span>
            </div>
            <div>
                <h4 className="text-sm md:text-base font-bold text-[#172b4d]">{label || `Level ${level}`}</h4>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">{description || (level === 1 ? "First-tier direct referral bonus" : `Network depth tier ${level}`)}</p>
            </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="relative">
                <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={!active}
                    className="w-20 md:w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-primary/20 text-right pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
            </div>

            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 ${active ? 'bg-primary' : 'bg-slate-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
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
            label: l.level === 1 ? "Level 1 (Direct)" : `Level ${l.level}`,
            description: l.level === 1 ? "First-tier direct referral bonus" : `Network depth tier ${l.level}`,
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Header & Title */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-bold">Settings</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Commission Structure</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Configure multi-level percentages and platform distributions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={saveConfigs}
                        disabled={saving}
                        className="flex-1 md:flex-none px-8 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 leading-none disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white/20 border-b-white rounded-full"></span>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* Levels List */}
                <div className="flex-1 space-y-4">
                    <div className="p-1">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Distribution Levels</h5>
                        <div className="space-y-4">
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
                <div className="w-full xl:w-96 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-lg font-bold">analytics</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#172b4d]">Payout Simulation</h3>
                            </div>
                            <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">Live</span>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BASE VOLUME</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={baseVolume}
                                    onChange={(e) => setBaseVolume(parseFloat(e.target.value) || 0)}
                                    className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-slate-50 pt-8">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">Payout ({totalPayoutPercent.toFixed(2)}%)</p>
                                <div className="text-xl md:text-2xl font-black text-primary truncate">${totalPayoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">Net Revenue</p>
                                <div className="text-xl md:text-2xl font-black text-[#172b4d] truncate">${companyNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                        </div>

                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(totalPayoutPercent, 100)}%` }}></div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Op. Fees (4.5%)</span>
                                <span className="text-[#172b4d] font-black">${operationalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                                <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                                    Network overhead is <span className="font-black">sustainable</span>. Target margin: {(100 - totalPayoutPercent).toFixed(2)}%.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Audit Notice */}
                    <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[2.5rem] space-y-3">
                        <div className="flex items-center gap-2 text-amber-700">
                            <span className="material-symbols-outlined text-lg font-bold">warning</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Audit Notice</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                            Changes apply to the <span className="font-black underline">next billing cycle</span>. Payout logs remain immutable.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
