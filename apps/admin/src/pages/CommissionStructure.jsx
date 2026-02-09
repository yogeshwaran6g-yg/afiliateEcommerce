import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const CommissionLevel = ({ level, label, description, value, active, onToggle, onChange }) => (
    <div className={`p-6 rounded-2xl border transition-all flex items-center gap-6 ${active ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-slate-200 opacity-60'}`}>
        <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined">drag_indicator</span>
            </div>
            <div>
                <h4 className="font-bold text-[#172b4d]">{label}</h4>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={!active}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-primary/20 text-right pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
            </div>

            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${active ? 'bg-primary' : 'bg-slate-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    </div>
);

export default function CommissionStructure() {
    const [levels, setLevels] = useState([
        { id: 1, label: "Level 1 (Direct)", description: "First-tier direct referral bonus", value: 15.00, active: true },
        { id: 2, label: "Level 2", description: "Indirect referrals from Level 1", value: 8.00, active: true },
        { id: 3, label: "Level 3", description: "Network depth tier 3", value: 5.00, active: true },
        { id: 4, label: "Level 4", description: "Network depth tier 4", value: 3.50, active: true },
        { id: 5, label: "Level 5", description: "Network depth tier 5", value: 2.00, active: true },
        { id: 6, label: "Level 6 (Disabled)", description: "Toggle to activate this level", value: 0.00, active: false },
    ]);

    const [baseVolume, setBaseVolume] = useState(10000.00);

    const handleToggle = (id) => {
        setLevels(levels.map(l => l.id === id ? { ...l, active: !l.active } : l));
    };

    const handleChange = (id, val) => {
        setLevels(levels.map(l => l.id === id ? { ...l, value: parseFloat(val) || 0 } : l));
    };

    const totalPayoutPercent = levels.reduce((acc, l) => acc + (l.active ? l.value : 0), 0);
    const totalPayoutAmount = (baseVolume * totalPayoutPercent) / 100;
    const companyNet = baseVolume - totalPayoutAmount;
    const operationalFees = baseVolume * 0.045; // Simulated 4.5%

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-display">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                <Header />

                <div className="p-8 lg:p-12 space-y-10 overflow-y-auto">
                    {/* Header & Title */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Settings</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                <span>Compensation</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                <span className="text-primary">MLM Configuration</span>
                            </div>
                            <h2 className="text-4xl font-black text-[#172b4d] tracking-tight">Commission Structure</h2>
                            <p className="text-lg text-slate-500 font-medium">Configure multi-level percentages and manage platform distributions for the unilevel model.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                                <span className="material-symbols-outlined text-lg">history</span>
                                <span>Version History</span>
                            </button>
                            <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-10">
                        {/* Levels List */}
                        <div className="flex-1 space-y-4">
                            {levels.map(level => (
                                <CommissionLevel
                                    key={level.id}
                                    {...level}
                                    onToggle={() => handleToggle(level.id)}
                                    onChange={(val) => handleChange(level.id, val)}
                                />
                            ))}

                            <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-primary/30 transition-all group">
                                <span className="material-symbols-outlined bg-primary/10 p-1 rounded-full group-hover:scale-110 transition-transform">add</span>
                                <span>Add Commission Level</span>
                            </button>
                        </div>

                        {/* Payout Simulation Sidebar */}
                        <div className="w-full xl:w-96 space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-lg font-bold">bar_chart</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#172b4d]">Payout Simulation</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">Live Preview</span>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BASE SALES VOLUME</label>
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

                                <div className="grid grid-cols-2 gap-8 border-t border-slate-50 pt-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Comm. Payout ({totalPayoutPercent}%)</p>
                                        <div className="text-2xl font-black text-primary">${totalPayoutAmount.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Net</p>
                                        <div className="text-2xl font-black text-[#172b4d]">${companyNet.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-primary" style={{ width: `${totalPayoutPercent}%` }}></div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Tier 1 Distributions</span>
                                        <span className="text-[#172b4d] font-bold">${((baseVolume * levels[0].value) / 100).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Tier 2-6 Distributions</span>
                                        <span className="text-[#172b4d] font-bold">${(totalPayoutAmount - ((baseVolume * levels[0].value) / 100)).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-50">
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Platform Operational Fees</span>
                                        <span className="text-[#172b4d] font-bold">${operationalFees.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                                    <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                                        Based on these settings, your network overhead is <span className="font-black">moderate</span>. This allows for a sustainable platform margin of {100 - totalPayoutPercent}%.
                                    </p>
                                </div>

                                <button className="w-full py-4 bg-slate-100 text-primary rounded-xl font-bold text-xs hover:bg-slate-200 transition-all uppercase tracking-widest">
                                    Generate Detailed Report
                                </button>
                            </div>

                            {/* Audit Notice */}
                            <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl space-y-3">
                                <div className="flex items-center gap-2 text-amber-700">
                                    <span className="material-symbols-outlined text-lg font-bold">warning</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Audit Notice</span>
                                </div>
                                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                    Any changes made to the commission structure will be applied to the <span className="font-black underline">next billing cycle</span> starting <span className="font-black">October 1st, 2023</span>. Existing payout logs will not be affected.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-10 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">edit_note</span> Last modified: Sep 12, 2023 at 14:22</span>
                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">person</span> Modified by: Sarah Jenkins (Senior Admin)</span>
                        </div>
                        <div className="flex gap-8">
                            <span className="hover:text-primary transition-colors cursor-pointer">Platform Compliance</span>
                            <span className="hover:text-primary transition-colors cursor-pointer">API Documentation</span>
                            <span className="hover:text-primary transition-colors cursor-pointer">Support Center</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
