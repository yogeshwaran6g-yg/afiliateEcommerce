import React from "react";

const WithdrawalHeader = ({ availableBalance, isLoading }) => {
    return (
        <>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <a href="/" className="hover:text-primary">
                    Home
                </a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-slate-900 font-medium">
                    Withdrawals & Bank Details
                </span>
            </div>
 
            {/* Page Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Withdrawals & Bank Details
                    </h1>
                    <p className="text-slate-500">
                        Securely manage your funds and transfer to linked accounts.
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-500 uppercase mb-1">
                        Available Balance
                    </div>
                    <div className="text-4xl font-bold text-primary mb-3">
                        {isLoading ? (
                             <div className="h-10 w-32 bg-slate-100 animate-pulse rounded ml-auto"></div>
                        ) : (
                            `₹${parseFloat(availableBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default WithdrawalHeader;
