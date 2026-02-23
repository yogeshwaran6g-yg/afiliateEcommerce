import React from 'react';
import { useWallet } from "../hooks/useWallet";

const formatCurrencyParts = (amount) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
  return formatted.split('.');
};

const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num || 0);

const StatSection = ({ title, children }) => (
  <div className="space-y-7">
    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const MiniChart = ({ data, isPositive }) => {
  // Always show a graph - use placeholder if data is missing or too short
  const values = (data && data.length >= 2) 
    ? data.map(d => parseFloat(d.value || 0))
    : [10, 20, 15, 25, 22, 30, 28]; // Placeholder data
    
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const width = 80;
  const height = 30;
  
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Colors: Green for up, Red for down
  const strokeColor = isPositive ? "#10b981" : "#ef4444";
  const fillColor = isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)";

  return (
    <div className="absolute bottom-4 right-6 opacity-60 group-hover:opacity-100 transition-opacity">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${isPositive}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path
          d={`M ${points} L ${width},${height} L 0,${height} Z`}
          fill={`url(#grad-${isPositive})`}
        />
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};

const StatCard = ({
  label,
  valueWhole,
  valueDecimal,
  isLoading,
  prefix = "₹",
  percentage,
  icon = "show_chart",
  gradientClasses = "from-teal-50 to-cyan-50/40",
  borderClass = "border-teal-100",
  pillBgClass = "bg-teal-100/70",
  pillTextClass = "text-teal-800",
  footerText,
  footerIcon = "autorenew",
  footerTextColorClass = "text-teal-700",
  chartData
}) => {
  const isPositive = parseFloat(percentage) >= 0;
  const currentIcon = icon === "show_chart" ? (isPositive ? "trending_up" : "trending_down") : icon;
  
  // Dynamic pill classes based on trend
  const trendPillBg = isPositive ? "bg-emerald-100/70" : "bg-red-100/70";
  const trendPillText = isPositive ? "text-emerald-800" : "text-red-800";

  return (
    <div className={`bg-gradient-to-br ${gradientClasses} rounded-2xl p-6 border ${borderClass} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className="z-10">
          <div className="text-sm text-slate-600 font-semibold tracking-wide uppercase">{label}</div>
          <div className="text-4xl font-extrabold text-slate-900 mt-2">
            {isLoading ? "..." : (
              <>
                {prefix}{valueWhole}
                {valueDecimal !== undefined && <span className="text-xl font-bold opacity-60">.{valueDecimal}</span>}
              </>
            )}
          </div>
        </div>
        {percentage !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 ${trendPillBg} ${trendPillText} font-bold text-sm rounded-full z-10 border border-white/20 shadow-sm`}>
            <span className="material-symbols-outlined text-base font-bold">{currentIcon}</span>
            {isPositive ? "+" : ""}{percentage}%
          </div>
        )}
      </div>
      <MiniChart data={chartData} isPositive={isPositive} />
      {footerText && (
        <div className={`mt-4 text-xs ${footerTextColorClass} font-medium flex items-center gap-1.5 opacity-80 group-hover:opacity-100`}>
          <span className="material-symbols-outlined text-base">{footerIcon}</span>{footerText}
        </div>
      )}
    </div>
  );
};

export default function StatsCards() {
  const { data: wallet, isLoading } = useWallet();

  const [totalWhole, totalDecimal] = formatCurrencyParts(wallet?.total_income);
  const [monthWhole, monthDecimal] = formatCurrencyParts(wallet?.month_income);
  const [todayWhole, todayDecimal] = formatCurrencyParts(wallet?.today_income);
  const [balanceWhole, balanceDecimal] = formatCurrencyParts(wallet?.balance);
  const [lockedWhole, lockedDecimal] = formatCurrencyParts(wallet?.locked_balance);

  const [teamTotalWhole, teamTotalDecimal] = formatCurrencyParts(wallet?.total_team_purchase);
  const [teamMonthWhole, teamMonthDecimal] = formatCurrencyParts(wallet?.month_purchase);
  const [teamTodayWhole, teamTodayDecimal] = formatCurrencyParts(wallet?.today_purchase);

  return (
    <div className="space-y-16 pb-12">
      <StatSection title="Income Overview">
        <StatCard
          label="Total Income"
          valueWhole={totalWhole}
          valueDecimal={totalDecimal}
          isLoading={isLoading}
          percentage={wallet?.income_change}
          chartData={wallet?.charts?.dailyIncome}
        />
        <StatCard
          label="This Month Income"
          valueWhole={monthWhole}
          valueDecimal={monthDecimal}
          isLoading={isLoading}
          percentage={wallet?.income_change} // Default for showing color
          gradientClasses="from-emerald-50 to-teal-50/40"
          borderClass="border-emerald-100"
          chartData={wallet?.charts?.dailyIncome}
        />
        <StatCard
          label="Today Income"
          valueWhole={todayWhole}
          valueDecimal={todayDecimal}
          isLoading={isLoading}
          percentage={wallet?.income_change}
          footerText="Updated live"
          gradientClasses="from-cyan-50 to-blue-50/40"
          borderClass="border-cyan-100"
          chartData={wallet?.charts?.dailyIncome}
        />
      </StatSection>


      <StatSection title="Team Overview">
        <StatCard
          label="Total Team Members"
          valueWhole={formatNumber(wallet?.total_team_members)}
          isLoading={isLoading}
          prefix=""
          percentage={wallet?.members_change}
          gradientClasses="from-indigo-50 to-blue-50/40"
          borderClass="border-indigo-100"
          pillBgClass="bg-indigo-100/70"
          pillTextClass="text-indigo-800"
          chartData={wallet?.charts?.dailyJoins}
        />
        <StatCard
          label="This Month Joined"
          valueWhole={formatNumber(wallet?.month_joined)}
          isLoading={isLoading}
          prefix="+"
          percentage={wallet?.members_change}
          gradientClasses="from-indigo-50 to-blue-50/40"
          borderClass="border-indigo-100"
          chartData={wallet?.charts?.dailyJoins}
        />
        <StatCard
          label="Today Joined"
          valueWhole={formatNumber(wallet?.today_joined)}
          isLoading={isLoading}
          prefix="+"
          percentage={wallet?.members_change}
          gradientClasses="from-indigo-50 to-blue-50/40"
          borderClass="border-indigo-100"
          pillBgClass="bg-indigo-100/70"
          pillTextClass="text-indigo-800"
          footerText="Updated live • growing fast"
          footerTextColorClass="text-indigo-700"
          chartData={wallet?.charts?.dailyJoins}
        />
      </StatSection>

      <StatSection title="Team Purchase Overview">
        <StatCard
          label="Total Team Purchase"
          valueWhole={teamTotalWhole}
          valueDecimal={teamTotalDecimal}
          isLoading={isLoading}
          percentage={wallet?.purchase_change}
          gradientClasses="from-purple-50 to-fuchsia-50/40"
          borderClass="border-purple-100"
          pillBgClass="bg-purple-100/70"
          pillTextClass="text-purple-800"
          chartData={wallet?.charts?.dailyPurchases}
        />
        <StatCard
          label="This Month Purchase"
          valueWhole={teamMonthWhole}
          valueDecimal={teamMonthDecimal}
          isLoading={isLoading}
          percentage={wallet?.purchase_change}
          gradientClasses="from-purple-50 to-fuchsia-50/40"
          borderClass="border-purple-100"
          chartData={wallet?.charts?.dailyPurchases}
        />
        <StatCard
          label="Today Purchase"
          valueWhole={teamTodayWhole}
          valueDecimal={teamTodayDecimal}
          isLoading={isLoading}
          percentage={wallet?.purchase_change}
          gradientClasses="from-purple-50 to-fuchsia-50/40"
          borderClass="border-purple-100"
          pillBgClass="bg-purple-100/70"
          pillTextClass="text-purple-800"
          footerText="Updated live"
          footerTextColorClass="text-purple-700"
          chartData={wallet?.charts?.dailyPurchases}
        />
      </StatSection>

      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Wallet & Balances</h2>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-2 relative">
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-emerald-600">account_balance_wallet</span>
                Available Balance
              </div>
              <div className="text-5xl font-black text-slate-900">
                {isLoading ? "..." : <>₹{balanceWhole}<span className="text-2xl font-bold opacity-50">.{balanceDecimal}</span></>}
              </div>
              <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 w-fit shadow-lg shadow-emerald-200">
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                Withdraw
              </button>
              <MiniChart data={wallet?.charts?.dailyIncome} isPositive={true} />
            </div>

            <div className="space-y-2 md:border-l md:pl-8 border-slate-100 relative">
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-amber-500">lock</span>
                Locked Balance
              </div>
              <div className="text-4xl font-black text-slate-900/80">
                {isLoading ? "..." : <>₹{lockedWhole}<span className="text-xl font-bold opacity-40">.{lockedDecimal}</span></>}
              </div>
              <p className="text-xs text-slate-400 font-medium italic">Pending verification</p>
              <MiniChart data={wallet?.charts?.dailyIncome} isPositive={true} />
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>
        </div>
      </div>

    </div>
  );
}

