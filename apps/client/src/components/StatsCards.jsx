export default function StatsCards() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Total Lifetime Earnings */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">payments</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <span className="material-symbols-outlined text-base">trending_up</span>
                        <span>12.5%</span>
                    </div>
                </div>
                <div className="text-sm text-slate-500 font-medium mb-1">Total Lifetime Earnings</div>
                <div className="text-3xl font-bold text-slate-900">$12,450.00</div>
                <div className="text-xs text-slate-400 mt-2">Updated 5m ago</div>
            </div>

            {/* Withdrawable Balance - Featured Card */}
            <div className="gradient-primary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-white">account_balance_wallet</span>
                    </div>
                    <div className="text-sm text-white/80 font-medium mb-1">Withdrawable Balance</div>
                    <div className="text-3xl font-bold text-white mb-6">$2,100.50</div>
                    <button className="w-full bg-white text-primary font-semibold py-2.5 px-4 rounded-lg hover:bg-white/95 transition-colors">
                        Withdraw Funds
                    </button>
                </div>
            </div>

            {/* Total Team Size */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600">groups</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                        <span className="material-symbols-outlined text-base">trending_up</span>
                        <span>5.2%</span>
                    </div>
                </div>
                <div className="text-sm text-slate-500 font-medium mb-1">Total Team Size</div>
                <div className="text-3xl font-bold text-slate-900">
                    1,240 <span className="text-lg text-slate-500 font-normal">Members</span>
                </div>
                <div className="flex items-center gap-1 mt-3">
                    <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-amber-400 to-amber-600 border-2 border-white"></div>
                        <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                            +2
                        </div>
                    </div>
                </div>
            </div>
            
{/* INCOME */}
<div className="space-y-6">
  {/* Total Income */}
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-green-700 text-3xl">
            trending_up
          </span>
        </div>
        <div>
          <div className="text-sm text-gray-600 font-medium tracking-wide">
            Total Income
          </div>
          <div className="text-3xl font-bold text-gray-900">$18,750.00</div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
        <span className="material-symbols-outlined text-base">trending_up</span>
        <span>11.5%</span>
      </div>
    </div>
  </div>

  {/* This Month Income */}
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-green-700 text-3xl">
          calendar_month
        </span>
      </div>
      <div>
        <div className="text-sm text-gray-600 font-medium tracking-wide">
          This Month Income
        </div>
        <div className="text-3xl font-bold text-gray-900">$3,450.75</div>
      </div>
    </div>
  </div>

  {/* Today Income */}
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-green-700 text-3xl">
            today
          </span>
        </div>
        <div>
          <div className="text-sm text-gray-600 font-medium tracking-wide">
            Today Income
          </div>
          <div className="text-3xl font-bold text-gray-900">$420.30</div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
        <span className="material-symbols-outlined text-base">trending_up</span>
        <span>13.5%</span>
      </div>
    </div>

    <div className="text-xs text-gray-500 font-medium mt-4">Updated live</div>
  </div>
</div>

{/* MEMBERS */}
<div className="space-y-6">
  {/* Total Team Members */}
  <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/7 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/6 rounded-full blur-3xl"></div>

    <div className="relative z-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-3xl">
              groups
            </span>
          </div>
          <div>
            <div className="text-sm text-indigo-100/90 font-medium tracking-wide">
              Total Team Members
            </div>
            <div className="text-3xl font-bold text-white">1,458</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/15 rounded-full text-white/95 text-sm font-medium">
          <span className="material-symbols-outlined text-base">trending_up</span>
          5.2%
        </div>
      </div>
    </div>
  </div>

  {/* This Month Joined */}
  <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/7 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/6 rounded-full blur-3xl"></div>

    <div className="relative z-10 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-3xl">
            calendar_month
          </span>
        </div>
        <div>
          <div className="text-sm text-indigo-100/90 font-medium tracking-wide">
            This Month Joined
          </div>
          <div className="text-3xl font-bold text-white">+187</div>
        </div>
      </div>
    </div>
  </div>

  {/* Today Joined */}
  <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/7 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/6 rounded-full blur-3xl"></div>

    <div className="relative z-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-3xl">
              today
            </span>
          </div>
          <div>
            <div className="text-sm text-indigo-100/90 font-medium tracking-wide">
              Today Joined
            </div>
            <div className="text-3xl font-bold text-white">+24</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/15 rounded-full text-white/95 text-sm font-medium">
          <span className="material-symbols-outlined text-base">trending_up</span>
          12.1%
        </div>
      </div>

      <div className="text-xs text-indigo-100/75 font-medium">
        Updated live • Team growing steadily
      </div>
    </div>
  </div>
</div>

{/* TEAM PURCHASE */}
<div className="space-y-6">
  {/* Total Team Purchase */}
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 relative">
    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-4 py-1.5 bg-purple-50 rounded-full text-purple-700 text-sm font-medium">
      <span className="material-symbols-outlined text-base">trending_up</span>
      9.8%
    </div>

    <div className="flex items-start gap-4 pr-32">
      <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-purple-600 text-3xl">
          shopping_cart
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-gray-600 font-medium tracking-wide">
          Total Team Purchase
        </div>
        <div className="text-3xl font-bold text-gray-900">$47,820.00</div>
      </div>
    </div>
  </div>

  {/* This Month Team Purchase */}
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-purple-600 text-3xl">
          calendar_month
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-gray-600 font-medium tracking-wide">
          This Month Team Purchase
        </div>
        <div className="text-3xl font-bold text-gray-900">$8,950.40</div>
      </div>
    </div>
  </div>

  {/* Today Team Purchase */}
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 relative">
    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-4 py-1.5 bg-purple-50 rounded-full text-purple-700 text-sm font-medium">
      <span className="material-symbols-outlined text-base">trending_up</span>
      18.3%
    </div>

    <div className="flex items-start gap-4 pr-32">
      <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-purple-600 text-3xl">
          today
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-gray-600 font-medium tracking-wide">
          Today Team Purchase
        </div>
        <div className="text-3xl font-bold text-gray-900">$1,240.75</div>
      </div>
    </div>

    <div className="mt-5 text-xs text-gray-500 font-medium">Updated live</div>
  </div>
</div>

{/* WALLET BALANCE */}
<div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
  <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl"></div>
  <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"></div>

  <div className="relative z-10 space-y-7">
    <div className="flex items-start justify-between">
      <div className="w-14 h-14 bg-amber-100/70 rounded-xl flex items-center justify-center shadow-sm">
        <span className="material-symbols-outlined text-amber-700 text-3xl">
          account_balance_wallet
        </span>
      </div>
    </div>

    <div>
      <div className="text-sm text-slate-600 font-medium tracking-wide mb-1">
        Wallet Balance
      </div>
      <div className="text-3xl font-bold text-slate-900">$5,200.75</div>
    </div>

    <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-amber-650 hover:to-amber-750 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
      <span className="material-symbols-outlined">account_balance_wallet</span>
      Manage Wallet
    </button>
  </div>
</div>
      
        </div>
    );
}
