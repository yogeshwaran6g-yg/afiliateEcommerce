import React from 'react';
import { Link } from 'react-router-dom';
import AddFundsForm from './AddFundsForm';

export default function AddFunds() {
    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 px-4 md:px-8 py-8 md:py-12">
                    <div className="max-w-2xl mx-auto mb-6">
                        <Link to="/wallet" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 group">
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span className="font-semibold text-sm">Back to Wallet</span>
                        </Link>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Add Funds</h1>
                            <p className="text-slate-500">Complete the payment information below to add funds to your wallet.</p>
                        </div>
                    </div>
                    <AddFundsForm />
                </div>
            </main>
        </div>
    );
}
