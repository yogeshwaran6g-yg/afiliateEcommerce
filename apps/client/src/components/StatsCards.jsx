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
        </div>
    );
}
