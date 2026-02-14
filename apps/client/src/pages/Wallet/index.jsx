import React, { useState } from 'react';
import WalletHeader from './WalletHeader';
import WalletStats from './WalletStats';
import TransactionHistory from './TransactionHistory';
import WalletFooter from './WalletFooter';
import { useWallet, useTransactions } from '../../hooks/useWallet';
import WithdrawFundsForm from './WithdrawFundsForm';
import AddFunds from './AddFunds';

function Wallet() {
    const { data: walletData, isLoading: isWalletLoading, error: walletError } = useWallet();
    const { data: transactionsData, isLoading: isTransactionsLoading } = useTransactions();
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    if (isWalletLoading || isTransactionsLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 font-display">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-semibold animate-pulse">Loading Wallet...</p>
                </div>
            </div>
        );
    }

    if (walletError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 font-display">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load wallet</h2>
                    <p className="text-slate-500 mb-6 font-medium">There was an error fetching your wallet information. This could be due to a connection issue.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-display">
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto w-full">
                    <WalletHeader onWithdrawClick={() => setIsWithdrawModalOpen(true)} />
                    <WalletStats wallet={walletData} transactions={transactionsData} />
                    
                    <div className="w-full">
                        <TransactionHistory transactions={transactionsData} />
                    </div>
                </div>
                <WalletFooter />
            </main>

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
                    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200 shadow-2xl">
                        <WithdrawFundsForm 
                            onClose={() => setIsWithdrawModalOpen(false)} 
                            wallet={walletData}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Named export for the AddFunds page
Wallet.AddFunds = AddFunds;

export default Wallet;
