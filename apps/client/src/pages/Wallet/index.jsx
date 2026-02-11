import React from 'react';
import WalletHeader from './WalletHeader';
import WalletStats from './WalletStats';
import TransactionHistory from './TransactionHistory';
import WalletFooter from './WalletFooter';

export default function Wallet() {
    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 px-4 md:px-8 py-4 md:py-8">
                    <WalletHeader />
                    <WalletStats />
                    <TransactionHistory />
                </div>
                <WalletFooter />
            </main>
        </div>
    );
}
