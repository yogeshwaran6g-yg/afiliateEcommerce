import React from "react";

export default function KycSummary({ status, progress, canWithdraw }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'VERIFIED': return 'text-green-600';
            case 'UNDER_REVIEW': return 'text-blue-600';
            case 'PARTIALLY_VERIFIED': return 'text-orange-600';
            case 'NOT_SUBMITTED': return 'text-slate-600';
            default: return 'text-slate-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">KYC Summary</h3>
            
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Verification Progress</span>
                    <span className="text-sm font-bold text-slate-900">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Overall Status</p>
                    <p className={`text-lg font-bold ${getStatusColor(status)}`}>
                        {status.replace('_', ' ')}
                    </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Withdrawals</p>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${canWithdraw ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <p className={`text-lg font-bold ${canWithdraw ? 'text-green-600' : 'text-red-600'}`}>
                            {canWithdraw ? 'ENABLED' : 'DISABLED'}
                        </p>
                    </div>
                </div>
            </div>

            {!canWithdraw && (
                <div className="mt-6 flex gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <span className="material-symbols-outlined text-red-500 text-xl">warning</span>
                    <p className="text-xs text-red-700 leading-relaxed">
                        Your account is currently restricted from withdrawals. Please complete all verification steps to enable full account features.
                    </p>
                </div>
            )}
        </div>
    );
}
