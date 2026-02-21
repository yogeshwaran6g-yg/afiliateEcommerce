import React from 'react';
import { useWallet } from "../hooks/useWallet";

const formatCurrencyParts = (amount) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
  return formatted.split('.');
};

export default function StatsCards() {
  const { data: wallet, isLoading } = useWallet();

  const [totalWhole, totalDecimal] = formatCurrencyParts(wallet?.total_income);
  const [monthWhole, monthDecimal] = formatCurrencyParts(wallet?.month_income);
  const [todayWhole, todayDecimal] = formatCurrencyParts(wallet?.today_income);
  const [balanceWhole, balanceDecimal] = formatCurrencyParts(wallet?.balance);
  const [lockedWhole, lockedDecimal] = formatCurrencyParts(wallet?.locked_balance);

  // Team Purchase Parts
  const [teamTotalWhole, teamTotalDecimal] = formatCurrencyParts(wallet?.total_team_purchase);
  const [teamMonthWhole, teamMonthDecimal] = formatCurrencyParts(wallet?.month_purchase);
  const [teamTodayWhole, teamTodayDecimal] = formatCurrencyParts(wallet?.today_purchase);

  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num || 0);

  return (
    <div className="space-y-16 pb-12">
      {/* INCOME Section */}
      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Income Overview</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Income */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50/40 rounded-2xl p-6 border border-teal-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Total Income</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  {isLoading ? "..." : <>₹{totalWhole}<span className="text-xl font-bold">.{totalDecimal}</span></>}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-100/70 text-teal-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>11.5%
              </div>
            </div>
          </div>

          {/* This Month Income */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50/40 rounded-2xl p-6 border border-teal-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-sm text-slate-600 font-semibold tracking-wide">This Month Income</div>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">
                {isLoading ? "..." : <>₹{monthWhole}<span className="text-xl font-bold">.{monthDecimal}</span></>}
              </div>
            </div>
          </div>

          {/* Today Income */}
          <div className="bg-linear-to-br from-teal-50 to-cyan-50/40 rounded-2xl p-6 border border-teal-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Today Income</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  {isLoading ? "..." : <>₹{todayWhole}<span className="text-xl font-bold">.{todayDecimal}</span></>}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-100/70 text-teal-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>13.5%
              </div>
            </div>
            <div className="mt-4 text-xs text-teal-700 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">autorenew</span>Updated live
            </div>
          </div>
        </div>
      </div>

      {/* TEAM Section */}
      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Overview</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/40 rounded-2xl p-6 border border-indigo-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Total Team Members</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  {isLoading ? "..." : formatNumber(wallet?.total_team_members || 0)}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100/70 text-indigo-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>5.2%
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/40 rounded-2xl p-6 border border-indigo-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-sm text-slate-600 font-semibold tracking-wide">This Month Joined</div>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">
                {isLoading ? "..." : `+${formatNumber(wallet?.month_joined || 0)}`}
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-indigo-50 to-blue-50/40 rounded-2xl p-6 border border-indigo-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Today Joined</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  {isLoading ? "..." : `+${formatNumber(wallet?.today_joined || 0)}`}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100/70 text-indigo-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>12.1%
              </div>
            </div>
            <div className="mt-4 text-xs text-indigo-700 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">autorenew</span>Updated live • growing fast
            </div>
          </div>
        </div>
      </div>

      {/* TEAM PURCHASE */}
      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Purchase Overview</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/40 rounded-2xl p-6 border border-purple-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Total Team Purchase</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  {isLoading ? "..." : <>₹{teamTotalWhole}<span className="text-xl font-bold">.{teamTotalDecimal}</span></>}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100/70 text-purple-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>9.8%
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-fuchsia-50/40 rounded-2xl p-6 border border-purple-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-sm text-slate-600 font-semibold tracking-wide">This Month Purchase</div>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">
                {isLoading ? "..." : <>₹{teamMonthWhole}<span className="text-xl font-bold">.{teamMonthDecimal}</span></>}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/40 rounded-2xl p-6 border border-purple-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Today Purchase</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  {isLoading ? "..." : <>₹{teamTodayWhole}<span className="text-xl font-bold">.{teamTodayDecimal}</span></>}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100/70 text-purple-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>18.3%
              </div>
            </div>
            <div className="mt-4 text-xs text-purple-700 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">autorenew</span>Updated live
            </div>
          </div>
        </div>
      </div>

      {/* Wallet & Balances - Minimalist Design */}
      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Wallet & Balances</h2>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Available Balance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-emerald-600">account_balance_wallet</span>
                Available Balance
              </div>
              <div className="text-5xl font-black text-slate-900">
                {isLoading ? "..." : <>₹{balanceWhole}<span className="text-2xl font-bold opacity-50">.{balanceDecimal}</span></>}
              </div>
              <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 w-fit">
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                Withdraw
              </button>
            </div>

            {/* Locked Balance */}
            <div className="space-y-2 md:border-l md:pl-8 border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-amber-500">lock</span>
                Locked Balance
              </div>
              <div className="text-4xl font-black text-slate-900/80">
                {isLoading ? "..." : <>₹{lockedWhole}<span className="text-xl font-bold opacity-40">.{lockedDecimal}</span></>}
              </div>
              <p className="text-xs text-slate-400 font-medium italic">Pending verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
