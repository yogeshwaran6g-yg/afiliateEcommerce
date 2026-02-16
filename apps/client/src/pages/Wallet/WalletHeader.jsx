import React from 'react';
import { Link } from 'react-router-dom';

export default function WalletHeader({ onWithdrawClick }) {
    return (
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
                <h2 className="text-3xl font-black tracking-tight mb-1 text-slate-900 dark:text-slate-100">Wallet & Earnings History</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your commissions, monitor pending holds, and withdraw your funds.
                </p>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Export CSV
                </button>
                <Link 
                    to="/wallet/add-funds" 
                    className="flex items-center gap-2 px-6 py-2 bg-[#10b981] text-white rounded-lg text-sm font-bold hover:bg-[#0da371] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Add Funds
                </Link>
                {/* <button 
                    onClick={onWithdrawClick}
                    className="flex items-center gap-2 px-6 py-2 bg-[#1754cf] text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">payments</span>
                    Withdraw Funds
                </button> */}
            </div>
        </div>
    );
}

