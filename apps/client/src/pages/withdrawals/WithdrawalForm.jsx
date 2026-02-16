import React from "react";

const WithdrawalForm = ({
    withdrawAmount,
    setWithdrawAmount,
    availableBalance,
    setMaxAmount,
    platformFee,
    finalSettlement,
    hasBankDetails,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">sync_alt</span>
                <h2 className="text-lg font-bold text-slate-900">Request Withdrawal</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Amount to Withdraw
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                            $
                        </span>
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) =>
                                setWithdrawAmount(parseFloat(e.target.value) || 0)
                            }
                            className="w-full pl-8 pr-16 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="0.00"
                        />
                        <button
                            onClick={setMaxAmount}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded hover:bg-primary/20"
                        >
                            MAX
                        </button>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Min: $50.00</span>
                        <span>Max: ${availableBalance.toFixed(2)}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Payment Method
                    </label>
                    <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Bank Transfer (Linked)</option>
                        <option>Crypto Wallet</option>
                        <option>PayPal</option>
                    </select>
                </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-lg">
                        info
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                        Transaction Breakdown
                    </h4>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Platform Fee (1.5%)</span>
                        <span className="font-semibold text-primary">
                            ${platformFee.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-100">
                        <span className="font-semibold text-slate-900">
                            Final Settlement:
                        </span>
                        <span className="font-bold text-slate-900">
                            ${finalSettlement.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <button
                disabled={!hasBankDetails || withdrawAmount <= 0}
                className={`w-full font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3 ${!hasBankDetails || withdrawAmount <= 0
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
            >
                <span className="material-symbols-outlined">
                    {hasBankDetails ? "lock" : "error_outline"}
                </span>
                {hasBankDetails ? "INITIATE SECURE WITHDRAWAL" : "LINK BANK TO WITHDRAW"}
            </button>

            <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>End-to-end encrypted transaction secure via FintechCloud SSL</span>
            </div>
        </div>
    );
};

export default WithdrawalForm;
