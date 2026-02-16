import React, { useMemo } from "react";

export default function WalletStats({ wallet, transactions = [] }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const growth = useMemo(() => {
    if (!transactions || transactions.length === 0)
      return { percent: 0, trend: "up" };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Filter and sum commissions for two periods
    // Assuming transactions have 'amount' and 'created_at' and 'transaction_type'
    const referralCommissions = transactions.filter(
      (t) => t.transaction_type === "REFERRAL_COMMISSION",
    );

    let currentPeriodSum = 0;
    let previousPeriodSum = 0;

    referralCommissions.forEach((t) => {
      const date = new Date(t.created_at);
      const amount = parseFloat(t.amount);
      if (date >= thirtyDaysAgo) {
        currentPeriodSum += amount;
      } else if (date >= sixtyDaysAgo && date < thirtyDaysAgo) {
        previousPeriodSum += amount;
      }
    });

    if (previousPeriodSum === 0) {
      return {
        percent: currentPeriodSum > 0 ? 100 : 0,
        trend: "up",
      };
    }

    const diff = currentPeriodSum - previousPeriodSum;
    const percent = (diff / previousPeriodSum) * 100;

    return {
      percent: Math.abs(percent).toFixed(1),
      trend: percent >= 0 ? "up" : "down",
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Commission Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-8 -mt-8"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span
              className={`material-symbols-outlined text-green-500 text-xl`}
            >
              {growth.trend === "up" ? "trending_up" : "trending_down"}
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Commission
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {wallet ? (
              formatCurrency(wallet.commissions)
            ) : (
              <span className="text-red-600 bg-red-600/10 p-1 rounded-lg">
                !fetch error
              </span>
            )}
          </span>
          <span
            className={`text-xs font-bold ${growth.trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"} px-1.5 py-0.5 rounded`}
          >
            {growth.trend === "up" ? "+" : "-"}
            {growth.percent}%
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Earned in the last 30 days
        </p>
      </div>

      {/* Hold Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500 text-xl">
              pending
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            On Hold
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {wallet ? (
              formatCurrency(wallet.on_hold)
            ) : (
              <span className="text-red-600 bg-red-600/10 p-1 rounded-lg">
                !fetch error
              </span>
            )}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Pending verification for payout <br /> or anyother else
        </p>
      </div>

      {/* Withdrawable Card */}
      <div className="bg-[#1754cf] p-6 rounded-xl shadow-xl shadow-blue-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              wallet
            </span>
          </div>
          <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Withdrawable
          </span>
        </div>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl font-black text-white">
            {wallet ? (
              formatCurrency(wallet.withdrawable)
            ) : (
              <span className="text-red-600 bg-red-600/10 p-1 rounded-lg">
                !fetch error
              </span>
            )}
          </span>
        </div>
        <p className="text-xs text-white/60 mt-2 relative z-10">
          Instant payout available
        </p>
      </div>
    </div>
  );
}
