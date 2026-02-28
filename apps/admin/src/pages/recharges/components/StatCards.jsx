import React from 'react';

const StatCard = ({ title, value, subtitle, theme = 'light', icon, isLoading }) => {
    const themes = {
        light: 'bg-white border-slate-100 text-slate-900',
        amber: 'bg-amber-50/50 border-amber-100 text-amber-600',
        emerald: 'bg-emerald-50/50 border-emerald-100 text-emerald-600',
        rose: 'bg-rose-50/50 border-rose-100 text-rose-600',
    };

    const titleColors = {
        light: 'text-slate-400',
        amber: 'text-amber-500',
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

const StatCards = ({ recharges, isLoading }) => {
    const stats = {
        pending: recharges.filter(r => r.status === 'REVIEW_PENDING').length,
        approved: recharges.filter(r => r.status === 'APPROVED').length,
        rejected: recharges.filter(r => r.status === 'REJECTED').length,
        total: recharges.length
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
                title="All Requests"
                value={stats.total}
                subtitle="Total recharge attempts"
                theme="light"
                icon="account_balance_wallet"
                isLoading={isLoading}
            />
            <StatCard
                title="Pending"
                value={stats.pending}
                subtitle="Waiting for your approval"
                theme="amber"
                icon="pending_actions"
                isLoading={isLoading}
            />
            <StatCard
                title="Approved"
                value={stats.approved}
                subtitle="Successfully added to wallets"
                theme="emerald"
                icon="check_circle"
                isLoading={isLoading}
            />
            <StatCard
                title="Rejected"
                value={stats.rejected}
                subtitle="Requests you have declined"
                theme="rose"
                icon="cancel"
                isLoading={isLoading}
            />
        </div>
    );
};

export default StatCards;
