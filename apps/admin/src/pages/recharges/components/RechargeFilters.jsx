import React from 'react';

const inputCls = "w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none";

const RechargeFilters = ({ searchTerm, setSearchTerm, activeFilter, setActiveFilter, counts }) => {
    const tabs = [
        { label: 'All', value: 'All', count: counts.all },
        { label: 'Pending', value: 'Review Pending', count: counts.pending },
        { label: 'Approved', value: 'Approved', count: counts.approved },
        { label: 'Rejected', value: 'Rejected', count: counts.rejected }
    ];

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                {/* Segmented Tabs */}
                <div className="bg-slate-50 p-1.5 rounded-[2.2rem] flex items-center overflow-x-auto no-scrollbar min-w-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveFilter(tab.value)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tab.value
                                ? 'bg-white text-primary shadow-lg shadow-primary/10'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black ${activeFilter === tab.value ? 'bg-primary/10 text-primary' : 'bg-slate-200/50 text-slate-400'
                                    }`}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Compact Search */}
                <div className="relative group flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Find by distributor or reference..."
                        className="w-full bg-slate-50 border border-transparent rounded-[2rem] pl-14 pr-6 py-4 text-xs font-bold text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default RechargeFilters;
