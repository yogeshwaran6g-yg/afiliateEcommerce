import React from "react";
import { Users, Activity, DollarSign, Layers } from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  colorClass,
  borderColor,
}) => (
  <div
    className={`glass-card rounded-2xl p-5 border ${borderColor} hover:border-opacity-100 transition-all cursor-pointer group`}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className={`p-2 ${colorClass}/20 rounded-lg group-hover:${colorClass}/30 transition-colors`}
      >
        <Icon className={`w-5 h-5 ${colorClass.replace("bg-", "text-")}`} />
      </div>
      {trend && (
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const NetworkStats = ({ totalNetwork = 0, directRefs = 0, earnings = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="Total Network Size"
        value={totalNetwork.toLocaleString()}
        trend={null}
        colorClass="bg-blue-500"
        borderColor="border-blue-500/20"
      />
      <StatCard
        icon={Users}
        label="Direct Referrals"
        value={directRefs.toLocaleString()}
        trend={null}
        colorClass="bg-emerald-500"
        borderColor="border-emerald-500/20"
      />
      <StatCard
        icon={DollarSign}
        label="Estimated Earnings"
        value={`₹${earnings.toLocaleString()}`}
        trend={null}
        colorClass="bg-purple-500"
        borderColor="border-purple-500/20"
      />
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="3"
                fill="none"
              ></circle>
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#06b6d4"
                strokeWidth="3"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset="17"
              ></circle>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-cyan-400">
              5/6
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">83%</h3>
        <p className="text-sm text-gray-400">Depth Utilization</p>
      </div>
    </div>
  );
};

export default NetworkStats;
