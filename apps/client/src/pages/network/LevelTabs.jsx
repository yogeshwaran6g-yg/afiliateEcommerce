import React from "react";

const LevelTabs = ({ levels, activeLevel, setActiveLevel }) => {
    return (
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar border-b border-slate-100">
            {levels.map((level) => (
                <button
                    key={level.level}
                    onClick={() => setActiveLevel(level.level)}
                    className={`flex-1 px-4 md:px-6 py-4 text-xs md:text-sm font-bold whitespace-nowrap transition-colors relative ${activeLevel === level.level
                            ? "text-primary bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                >
                    Lvl {level.level}
                    <span className="ml-1 opacity-50">({level.count})</span>
                </button>
            ))}
        </div>
    );
};

export default LevelTabs;
