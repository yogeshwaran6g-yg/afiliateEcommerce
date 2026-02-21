import React from "react";

const AdminLevelTabs = ({ levels, activeLevel, setActiveLevel }) => {
    return (
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar border-b border-slate-100 bg-white">
            {levels.map((level) => (
                <button
                    key={level.level}
                    onClick={() => setActiveLevel(level.level)}
                    className={`flex-1 px-4 md:px-8 py-5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${activeLevel === level.level
                            ? "text-primary bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    Lvl {level.level}
                    <span className="ml-1 opacity-50 font-bold">
                        ({level.count})
                    </span>
                </button>
            ))}
        </div>
    );
};

export default AdminLevelTabs;
