export default function StatsCards() {
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
                <div className="text-4xl font-extrabold text-slate-900 mt-2">$18,750<span className="text-xl font-bold">.00</span></div>
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
              <div className="text-4xl font-extrabold text-slate-900 mt-2">$3,450<span className="text-xl font-bold">.75</span></div>
            </div>
          </div>

          {/* Today Income */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50/40 rounded-2xl p-6 border border-teal-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Today Income</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">$420<span className="text-xl font-bold">.30</span></div>
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
                <div className="text-4xl font-extrabold text-slate-900 mt-2">1,458</div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100/70 text-indigo-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>5.2%
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/40 rounded-2xl p-6 border border-indigo-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-sm text-slate-600 font-semibold tracking-wide">This Month Joined</div>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">+187</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/40 rounded-2xl p-6 border border-indigo-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Today Joined</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">+24</div>
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
                <div className="text-4xl font-extrabold text-slate-900 mt-2">$47,820<span className="text-xl font-bold">.00</span></div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100/70 text-purple-800 font-semibold text-sm rounded-full">
                <span className="material-symbols-outlined text-base">show_chart</span>9.8%
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/40 rounded-2xl p-6 border border-purple-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-sm text-slate-600 font-semibold tracking-wide">This Month Purchase</div>
              <div className="text-4xl font-extrabold text-slate-900 mt-2">$8,950<span className="text-xl font-bold">.40</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/40 rounded-2xl p-6 border border-purple-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-600 font-semibold tracking-wide">Today Purchase</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">$1,240<span className="text-xl font-bold">.75</span></div>
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

      {/* Wallet & Balances */}
      <div className="space-y-7">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Wallet & Balances</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Withdrawable Balance */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-[1.015] transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-1 ring-white/30 mb-6">
                <span className="material-symbols-outlined text-white text-3xl">account_balance_wallet</span>
              </div>
              <div className="text-sm text-teal-100/90 font-semibold tracking-wide mb-2">Withdrawable Balance</div>
              <div className="text-5xl font-black text-white leading-tight">$2,100<span className="text-3xl font-bold">.50</span></div>
              <button className="mt-8 w-full bg-white/95 text-emerald-800 font-bold py-3.5 px-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-lg">
                <span className="material-symbols-outlined">arrow_downward</span>
                Withdraw Now
              </button>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-white rounded-3xl p-8 border border-amber-200/60 shadow-xl hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10 space-y-7">
              <div className="w-14 h-14 bg-amber-200/40 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-amber-800 text-3xl">account_balance_wallet</span>
              </div>
              <div>
                <div className="text-sm text-amber-800/90 font-semibold tracking-wide mb-2">Wallet Balance</div>
                <div className="text-5xl font-black text-amber-950 leading-tight">$5,200<span className="text-3xl font-bold">.75</span></div>
              </div>
              <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg">
                <span className="material-symbols-outlined">tune</span>
                Manage Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}