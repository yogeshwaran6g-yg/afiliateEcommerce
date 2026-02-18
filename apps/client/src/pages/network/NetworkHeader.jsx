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
           
        </div>
    );
};

export default NetworkHeader;
