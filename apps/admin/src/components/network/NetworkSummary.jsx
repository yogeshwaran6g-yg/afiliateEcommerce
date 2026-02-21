import React from "react";

const NetworkSummary = ({ selectedUser, referralOverview }) => {
    if (!selectedUser) return null;

    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/40 flex flex-col xl:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center border-2 border-primary/10 shadow-inner group">
                    <span className="material-symbols-outlined text-4xl text-primary transform group-hover:rotate-12 transition-transform duration-300">hub</span>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser.name}</h3>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                            NETWORK ROOT
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">fingerprint</span>
                            {selectedUser.id}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                            Joined {selectedUser.joined}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full xl:w-auto">
                <div className="px-6 py-4 bg-slate-50/50 rounded-3xl border border-slate-100 text-center space-y-1 group hover:bg-white hover:shadow-md transition-all duration-300">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Network</p>
                    <p className="text-lg font-black text-slate-800 tracking-tighter">{referralOverview?.overallCount || 0}</p>
                </div>
                <div className="px-6 py-4 bg-slate-50/50 rounded-3xl border border-slate-100 text-center space-y-1 group hover:bg-white hover:shadow-md transition-all duration-300">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Direct Refs</p>
                    <p className="text-lg font-black text-primary tracking-tighter">{referralOverview?.levels?.find(l => l.level === 1)?.referralCount || 0}</p>
                </div>
                <div className="px-6 py-4 bg-slate-50/50 rounded-3xl border border-slate-100 text-center space-y-1 group hover:bg-white hover:shadow-md transition-all duration-300">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Levels</p>
                    <p className="text-lg font-black text-slate-800 tracking-tighter">{referralOverview?.totalLevels || 0}</p>
                </div>
                <div className="px-6 py-4 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-1 shadow-lg shadow-slate-900/10">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Revenue</p>
                    <p className="text-lg font-black text-white tracking-tighter">₹{(referralOverview?.overallEarnings || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default NetworkSummary;
