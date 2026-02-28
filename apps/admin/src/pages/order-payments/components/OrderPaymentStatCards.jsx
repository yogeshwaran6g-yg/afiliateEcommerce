import React from "react";

const StatCard = ({ title, value, icon, color, isLoading }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6 group hover:scale-[1.02] transition-all duration-500">
        <div className={`w-20 h-20 rounded-[2rem] ${color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-widest">{title}</p>
            {isLoading ? (
                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg mt-1"></div>
            ) : (
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
            )}
        </div>
    </div>
);

export default function OrderPaymentStatCards({ payments = [], counts = {}, isLoading }) {
    const totalAmount = payments.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);
    const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
                title="Total Payments" 
                value={counts.ALL || 0}
                icon="receipt_long" 
                color="bg-indigo-50 text-indigo-500"
                isLoading={isLoading}
            />
            <StatCard 
                title="Pending Verification" 
                value={counts.PENDING || 0}
                icon="pending_actions" 
                color="bg-amber-50 text-amber-500"
                isLoading={isLoading}
            />
            <StatCard 
                title="Total Verified" 
                value={counts.APPROVED || 0}
                icon="verified" 
                color="bg-emerald-50 text-emerald-500"
                isLoading={isLoading}
            />
            <StatCard 
                title="Rejected Payments" 
                value={counts.REJECTED || 0}
                icon="block" 
                color="bg-rose-50 text-rose-500"
                isLoading={isLoading}
            />
        </div>
    );
}
