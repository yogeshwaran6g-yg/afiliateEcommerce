import React from "react";

const NetworkHeader = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Network Management
                </h1>
                <p className="text-sm md:text-base text-slate-500 mt-1">
                    Monitor downline performance and expand your network across 6 levels.
                </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none p-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600 text-lg md:text-xl">
                        download
                    </span>
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Member
                </button>
            </div>
        </div>
    );
};

export default NetworkHeader;
