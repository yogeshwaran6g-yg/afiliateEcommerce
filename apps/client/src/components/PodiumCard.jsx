import React from "react";

const PodiumCard = ({ rank, name, pv, change, rankTitle, imageUrl, isChampion }) => {
  const rankColors = {
    1: "border-gold",
    2: "border-silver",
    3: "border-bronze",
  };

  const badgeColors = {
    1: "bg-gold",
    2: "bg-silver",
    3: "bg-bronze",
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isChampion ? "p-8 border-2 border-primary shadow-lg shadow-primary/10 relative scale-105" : "p-6 border-slate-200 dark:border-slate-800"} text-center podium-shadow h-full flex flex-col justify-center`}
    >
      {isChampion && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Champion
        </div>
      )}
      <div className="relative mx-auto mb-4">
        <div className={`rounded-full border-4 ${rankColors[rank] || "border-slate-200"} p-1 ${isChampion ? "size-32" : "size-24"}`}>
          <div
            className="w-full h-full rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          ></div>
        </div>
        <div
          className={`absolute -bottom-2 -right-2 ${badgeColors[rank] || "bg-slate-400"} text-white text-xs font-black rounded-full ${isChampion ? "size-10" : "size-8"} flex items-center justify-center border-4 border-white dark:border-slate-900`}
        >
          {rank}
        </div>
      </div>
      <h3 className={`text-slate-900 dark:text-white font-black tracking-tight ${isChampion ? "text-2xl" : "text-lg"}`}>
        {name}
      </h3>
      <p className={`text-primary font-black ${isChampion ? "text-3xl" : "text-xl"}`}>
        {pv} PV
      </p>
      <p className="text-success text-sm font-semibold flex items-center justify-center gap-1 mt-1">
        <span className="material-symbols-outlined text-sm">trending_up</span>
        {change}
      </p>
      <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
        {rankTitle}
      </p>
    </div>
  );
};

export default PodiumCard;
