import React from "react";

const RankingTable = ({ rankings }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <h4 className="text-slate-900 dark:text-white font-bold text-lg">
          Top 100 Distributors
        </h4>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
              placeholder="Search by name or ID"
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 uppercase text-[11px] font-black tracking-widest">
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Distributor</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4 text-right">Team Growth</th>
              <th className="px-6 py-4 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rankings.map((row) => (
              <tr key={row.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-black text-slate-400 dark:text-slate-600">
                  {row.rank < 10 ? `0${row.rank}` : row.rank}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${row.imageUrl}")` }}
                    ></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        {row.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase">
                        ID: {row.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {row.region}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${row.growth.startsWith("+") ? "bg-success/10 text-success" : "bg-amber-100 text-amber-600"}`}>
                    {row.growth}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`material-symbols-outlined ${row.trend === "up" ? "text-success" : row.trend === "down" ? "text-amber-500" : "text-slate-400"}`}>
                    {row.trend === "up" ? "trending_up" : row.trend === "down" ? "trending_down" : "remove"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
        <button className="text-primary font-bold text-sm hover:underline">
          View All 100 Distributors
        </button>
      </div>
    </div>
  );
};

export default RankingTable;
