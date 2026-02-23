import React from 'react';
import { useWallet } from "../hooks/useWallet";
import Skeleton from './ui/Skeleton';

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
  footerTextColorClass = "text-teal-700"
}) => {
  const isPositive = parseFloat(percentage) >= 0;
  const currentIcon = icon === "show_chart" ? (isPositive ? "trending_up" : "trending_down") : icon;

  // Dynamic pill classes based on trend
  const trendPillBg = isPositive ? "bg-emerald-100/70" : "bg-red-100/70";
  const trendPillText = isPositive ? "text-emerald-800" : "text-red-800";

  return (
    <div className={`bg-gradient-to-br ${gradientClasses} rounded-2xl p-6 border ${borderClass} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className="z-10 flex-1">
          <div className="text-sm text-slate-600 font-semibold tracking-wide uppercase">{label}</div>
          <div className="text-4xl font-extrabold text-slate-900 mt-2">
            {isLoading ? (
              <Skeleton width="120px" height="32px" />
            ) : (
              <>
                {prefix}{valueWhole}
                {valueDecimal !== undefined && <span className="text-xl font-bold opacity-60">.{valueDecimal}</span>}
              </>
            )}
          </div>
        </div>
        {percentage !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 ${trendPillBg} ${trendPillText} font-bold text-sm rounded-full z-10 border border-white/20 shadow-sm`}>
            {isLoading ? (
              <Skeleton width="40px" height="16px" className="my-0.5" />
            ) : (
              <>
                <span className="material-symbols-outlined text-base font-bold">{currentIcon}</span>
                {isPositive ? "+" : ""}{percentage}%
              </>
            )}
          </div>
        )}
      </div>
      {footerText && (
        <div className={`mt-4 text-xs ${footerTextColorClass} font-medium flex items-center gap-1.5 opacity-80 group-hover:opacity-100`}>
          {isLoading ? (
            <Skeleton width="100px" height="12px" />
          ) : (
            <>
              <span className="material-symbols-outlined text-base">{footerIcon}</span>{footerText}
            </>
          )}
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
          percentage={wallet?.income_change_month}
        />
        <StatCard
          label="This Month Income"
          valueWhole={monthWhole}
          valueDecimal={monthDecimal}
          isLoading={isLoading}
          percentage={wallet?.income_change_month}
          gradientClasses="from-emerald-50 to-teal-50/40"
          borderClass="border-emerald-100"
        />
        <StatCard
          label="Today Income"
          valueWhole={todayWhole}
          valueDecimal={todayDecimal}
          isLoading={isLoading}
          percentage={wallet?.income_change_today}
          footerText="Updated live"
          gradientClasses="from-cyan-50 to-blue-50/40"
          borderClass="border-cyan-100"
        />
      </StatSection>


      <StatSection title="Team Overview">
        <StatCard
          label="Total Team Members"
          valueWhole={formatNumber(wallet?.total_team_members)}
          isLoading={isLoading}
          prefix=""
          percentage={wallet?.members_change_month}
          gradientClasses="from-indigo-50 to-blue-50/40"
          borderClass="border-indigo-100"
          pillBgClass="bg-indigo-100/70"
          pillTextClass="text-indigo-800"
        />
        <StatCard
          label="This Month Joined"
          valueWhole={formatNumber(wallet?.month_joined)}
          isLoading={isLoading}
          prefix="+"
          percentage={wallet?.members_change_month}
          gradientClasses="from-indigo-50 to-blue-50/40"
          borderClass="border-indigo-100"
        />
        <StatCard
          label="Today Joined"
          valueWhole={formatNumber(wallet?.today_joined)}
          isLoading={isLoading}
          prefix="+"
          percentage={wallet?.members_change_today}
          gradientClasses="from-indigo-50 to-blue-50/40"
          borderClass="border-indigo-100"
          pillBgClass="bg-indigo-100/70"
          pillTextClass="text-indigo-800"
          footerText="Updated live • growing fast"
          footerTextColorClass="text-indigo-700"
        />
      </StatSection>

      <StatSection title="Team Purchase Overview">
        <StatCard
          label="Total Team Purchase"
          valueWhole={teamTotalWhole}
          valueDecimal={teamTotalDecimal}
          isLoading={isLoading}
          percentage={wallet?.purchase_change_month}
          gradientClasses="from-purple-50 to-fuchsia-50/40"
          borderClass="border-purple-100"
          pillBgClass="bg-purple-100/70"
          pillTextClass="text-purple-800"
        />
        <StatCard
          label="This Month Purchase"
          valueWhole={teamMonthWhole}
          valueDecimal={teamMonthDecimal}
          isLoading={isLoading}
          percentage={wallet?.purchase_change_month}
          gradientClasses="from-purple-50 to-fuchsia-50/40"
          borderClass="border-purple-100"
        />
        <StatCard
          label="Today Purchase"
          valueWhole={teamTodayWhole}
          valueDecimal={teamTodayDecimal}
          isLoading={isLoading}
          percentage={wallet?.purchase_change_today}
          gradientClasses="from-purple-50 to-fuchsia-50/40"
          borderClass="border-purple-100"
          pillBgClass="bg-purple-100/70"
          pillTextClass="text-purple-800"
          footerText="Updated live"
          footerTextColorClass="text-purple-700"
        />
      </StatSection>

      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Wallet & Balances</h2>

        <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-[1.5rem] p-6 md:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 relative overflow-hidden group">
          <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-center relative z-10">
            {/* Available Balance */}
            <div className="space-y-3 relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                  <span className="material-symbols-outlined text-emerald-600 text-lg font-semibold">account_balance_wallet</span>
                </div>
                <div className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em]">
                  Available Balance
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-baseline">
                  {isLoading ? (
                    <Skeleton width="180px" height="42px" className="my-1" />
                  ) : (
                    <>
                      <span className="text-2xl md:text-3xl font-extrabold mr-1 opacity-90">₹</span>
                      {balanceWhole}
                      <span className="text-xl md:text-2xl font-bold text-slate-400 ml-0.5">.{balanceDecimal}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 w-fit shadow-lg shadow-emerald-200/60 ring-2 ring-emerald-50">
                  <span className="material-symbols-outlined text-base">arrow_downward</span>
                  Withdraw
                </button>
              </div>
            </div>

            {/* Locked Balance */}
            <div className="md:border-l border-slate-200/60 md:pl-10 space-y-3 relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100/50">
                  <span className="material-symbols-outlined text-amber-500 text-lg font-semibold">lock</span>
                </div>
                <div className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em]">
                  Locked Balance
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-black text-slate-800/90 tracking-tight flex items-baseline">
                  {isLoading ? (
                    <Skeleton width="140px" height="36px" className="my-1" />
                  ) : (
                    <>
                      <span className="text-xl md:text-2xl font-extrabold mr-1 opacity-70">₹</span>
                      {lockedWhole}
                      <span className="text-lg md:text-xl font-bold text-slate-300 ml-0.5">.{lockedDecimal}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-medium text-[10px] bg-slate-100/50 w-fit px-1.5 py-0.5 rounded border border-slate-200/50">
                  <span className="material-symbols-outlined text-[12px]">info</span>
                  <span className="italic">Pending verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decorative Elements - Scaled down */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-slate-100 to-white rounded-full opacity-40 blur-3xl z-0 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-emerald-50/30 to-white rounded-full opacity-40 blur-3xl z-0"></div>
        </div>
      </div>
    </div>
  );
}
