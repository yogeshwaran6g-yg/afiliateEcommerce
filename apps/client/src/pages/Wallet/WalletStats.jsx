import React from 'react';

export default function WalletStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Commission Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-green-600">trending_up</span>
                    <span className="text-sm font-semibold text-slate-500 uppercase">Commission</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-slate-900">$4,250.80</span>
                    <span className="text-sm font-semibold text-green-600">+12.5%</span>
                </div>
                <p className="text-sm text-slate-500">Earned in the last 30 days</p>
            </div>

            {/* On Hold Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-amber-600">schedule</span>
                    <span className="text-sm font-semibold text-slate-500 uppercase">On Hold</span>
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-1">$840.00</div>
                <p className="text-sm text-slate-500">Available in approx. 14 days</p>
            </div>

            {/* Withdrawable Card */}
            <div className="bg-primary rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="text-sm font-semibold uppercase opacity-90">Withdrawable</span>
                </div>
                <div className="text-4xl font-bold mb-1">$12,480.25</div>
                <p className="text-sm opacity-90">Instant payout available</p>
            </div>
        </div>
    );
}
