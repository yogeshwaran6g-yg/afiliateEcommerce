const StatCard = ({ title, value, subtitle, theme = 'light', icon, isLoading }) => {
    const isLight = theme === 'light';
    const themes = {
        light: 'bg-white border-slate-100 text-slate-900',
        emerald: 'bg-emerald-50/50 border-emerald-100 text-emerald-600',
        rose: 'bg-rose-50/50 border-rose-100 text-rose-600',
    };

    const titleColors = {
        light: 'text-slate-400',
        emerald: 'text-emerald-500',
        rose: 'text-rose-500',
    };

    return (
        <div className={`${themes[theme]} p-8 rounded-[2rem] border shadow-sm relative overflow-hidden transition-all hover:shadow-md group`}>
            <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                    <h5 className={`text-[10px] font-black uppercase tracking-[0.2em] ${titleColors[theme]}`}>
                        {title}
                    </h5>
                    {isLoading ? (
                        <div className="h-10 w-32 rounded-xl animate-pulse bg-slate-100" />
                    ) : (
                        <div className="text-4xl font-black tracking-tight">
                            {value}
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {subtitle}
                </p>
            </div>
            {icon && (
                <div className={`absolute -right-6 -bottom-6 opacity-[0.03] transition-transform group-hover:scale-110 duration-500`}>
                    <span className="material-symbols-outlined text-[140px] leading-none">{icon}</span>
                </div>
            )}
        </div>
    );
};

const StatCards = ({ pagination, transactions, isLoading }) => {
    const getTotal = (entryType) =>
        transactions
            .filter(t => t.entry_type === entryType && t.status === 'SUCCESS')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StatCard
                title="Total Transactions"
                value={pagination.total}
                subtitle="Across all filters"
                theme="light"
                icon="receipt_long"
                isLoading={isLoading}
            />
            <StatCard
                title="Total Credits (page)"
                value={`₹${getTotal('CREDIT').toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                subtitle="Money Added — current page"
                theme="emerald"
                icon="arrow_downward"
                isLoading={isLoading}
            />
            <StatCard
                title="Total Debits (page)"
                value={`₹${getTotal('DEBIT').toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                subtitle="Money Deducted — current page"
                theme="rose"
                icon="arrow_upward"
                isLoading={isLoading}
            />
        </div>
    );
};

export default StatCards;
