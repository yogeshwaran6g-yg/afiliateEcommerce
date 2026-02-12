import React from 'react';

export default function WalletHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
            <div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Wallet & Earnings History</h1>
                <p className="text-sm md:text-base text-slate-500">
                    Manage your commissions, monitor pending holds, and withdraw your funds.
                </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 text-sm">
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="hidden sm:inline">Export CSV</span>
                </button>
                <button className="flex items-center gap-2 px-4 md:px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 text-sm">
                    <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                    <span className="hidden sm:inline">Withdraw Funds</span>
                </button>
            </div>
        </div>
    );
}
