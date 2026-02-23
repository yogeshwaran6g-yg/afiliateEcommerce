import React from "react";
import { careerRoadmap } from "./data";
import Skeleton from "../../components/ui/Skeleton";

const CareerRoadmap = ({ isLoading }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 font-display">
                Career Roadmap
            </h2>

            <div className="relative px-4">
                {/* Progress Line */}
                <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-100 hidden md:block"></div>
                <div className="absolute top-6 left-12 w-[40%] h-0.5 bg-primary hidden md:block"></div>

                {/* Ranks */}
                <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex md:flex-col items-center gap-4 md:gap-3">
                                <Skeleton variant="circular" width="48px" height="48px" className="ring-4 ring-white shadow-md z-10" />
                                <div className="text-left md:text-center space-y-2">
                                    <Skeleton width="60px" height="14px" />
                                    <Skeleton width="40px" height="10px" />
                                </div>
                            </div>
                        ))
                    ) : (
                        careerRoadmap.map((item, index) => (
                            <div
                                key={index}
                                className="flex md:flex-col items-center gap-4 md:gap-3"
                            >
                                <div
                                    className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center ring-4 ring-white shadow-md relative z-10 ${item.current ? "ring-primary/20 scale-110" : ""
                                        }`}
                                >
                                    {item.status === "COMPLETED" ? (
                                        <span className="material-symbols-outlined text-white text-xl">
                                            check
                                        </span>
                                    ) : item.current ? (
                                        <span className="material-symbols-outlined text-white text-xl">
                                            military_tech
                                        </span>
                                    ) : (
                                        <span className="material-symbols-outlined text-slate-400 text-xl">
                                            lock
                                        </span>
                                    )}
                                </div>
                                <div className="text-left md:text-center">
                                    <div
                                        className={`font-black text-sm ${item.current ? "text-primary" : "text-slate-900 opacity-60"}`}
                                    >
                                        {item.rank}
                                    </div>
                                    <div
                                        className={`text-[10px] font-bold uppercase tracking-wider ${item.current ? "text-primary/70" : "text-slate-400"
                                            }`}
                                    >
                                        {item.status}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
