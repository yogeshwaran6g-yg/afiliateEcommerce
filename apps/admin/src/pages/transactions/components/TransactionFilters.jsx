const inputCls = "w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none";

const TransactionFilters = ({ filters, onFilterChange, onClearFilters }) => (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">filter_list</span>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Filter Transactions</h3>
            </div>
            <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
            >
                <span className="material-symbols-outlined text-base">filter_alt_off</span>
                <span>Clear All</span>
            </button>
        </div>

        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
                <input
                    type="text"
                    placeholder="Search by user name, phone, or email..."
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none shadow-inner shadow-slate-900/5"
                />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">User ID</p>
                    <input
                        type="text"
                        placeholder="Ex: 1001"
                        value={filters.userId}
                        onChange={(e) => onFilterChange('userId', e.target.value)}
                        className={inputCls}
                    />
                </div>

                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Type</p>
                    <select
                        value={filters.transactionType}
                        onChange={(e) => onFilterChange('transactionType', e.target.value)}
                        className={inputCls}
                    >
                        <option value="">All Types</option>
                        <option value="RECHARGE_REQUEST">Recharge</option>
                        <option value="MANUAL_PAYMENT_RECHARGE">Manual Pmt Recharge</option>
                        <option value="WITHDRAWAL_REQUEST">Withdrawal</option>
                        <option value="REFERRAL_COMMISSION">Commission</option>
                        <option value="PRODUCT_PURCHASE">Product Purchase</option>
                        <option value="ACTIVATION_PURCHASE">Activation Purchase</option>
                        <option value="ADMIN_ADJUSTMENT">Admin Adjustment</option>
                        <option value="REVERSAL">Reversal</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Type</p>
                    <select
                        value={filters.entryType}
                        onChange={(e) => onFilterChange('entryType', e.target.value)}
                        className={inputCls}
                    >
                        <option value="">All Entries</option>
                        <option value="CREDIT">Credit</option>
                        <option value="DEBIT">Debit</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</p>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className={inputCls}
                    >
                        <option value="">All Status</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                        <option value="REVERSED">Reversed</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</p>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => onFilterChange('startDate', e.target.value)}
                        className={inputCls}
                    />
                </div>

                <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</p>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => onFilterChange('endDate', e.target.value)}
                        className={inputCls}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default TransactionFilters;
