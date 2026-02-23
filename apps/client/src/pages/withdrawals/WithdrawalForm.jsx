import React, { useState } from "react";
import { useWithdrawMutation } from "../../hooks/useWallet";
import { toast } from "react-toastify";
import Skeleton from "../../components/ui/Skeleton";

const WithdrawalForm = ({
    withdrawAmount,
    setWithdrawAmount,
    availableBalance,
    setMaxAmount,
    platformFee,
    commissionPercent,
    finalSettlement,
    maxWithdrawAmount,
    pendingCount,
    hasBankDetails,
    isBankVerified,
    bankKycStatus,
    isLoading: isFetching
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const withdrawMutation = useWithdrawMutation();

    const getButtonContent = () => {
        if (isFetching || isSubmitting) return "Processing...";
        if (!hasBankDetails) return "LINK BANK TO WITHDRAW";
        if (bankKycStatus === 'PENDING') return "KYC UNDER REVIEW";
        if (bankKycStatus === 'REJECTED') return "KYC REJECTED - UPDATE BANK";
        if (!isBankVerified) return "COMPLETE KYC TO WITHDRAW";
        if (pendingCount >= 2) return "PENDING LIMIT REACHED (MAX 2)";
        if (withdrawAmount <= 0) return "ENTER AMOUNT";
        if (withdrawAmount < 50) return "MIN WITHDRAW ₹50.00";
        if (withdrawAmount > availableBalance) return "INSUFFICIENT BALANCE";
        if (withdrawAmount > maxWithdrawAmount) return "EXCEEDS MAX LIMIT";
        return "INITIATE SECURE WITHDRAWAL";
    };

    const isButtonDisabled = isFetching || isSubmitting || !isBankVerified || withdrawAmount <= 0 || withdrawAmount > availableBalance || withdrawAmount < 50 || withdrawAmount > maxWithdrawAmount || pendingCount >= 2;

    const getButtonIcon = () => {
        if (isFetching || isSubmitting) return "sync";
        if (!isBankVerified || pendingCount >= 2) return "lock_clock";
        return "verified_user";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isButtonDisabled) return;

        setIsSubmitting(true);
        try {
            await withdrawMutation.mutateAsync({
                amount: withdrawAmount,
                // Bank details are fetched by backend from profile/bank details table usually, 
                // but let's see what the backend expects. 
                // The service expects bankDetails as 3rd param.
            });
            toast.success("Withdrawal request submitted successfully!");
            setWithdrawAmount(0);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit withdrawal request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">sync_alt</span>
                <h2 className="text-lg font-bold text-slate-900">Request Withdrawal</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Amount to Withdraw
                    </label>
                    {isFetching ? (
                        <Skeleton width="100%" height="48px" className="rounded-lg" />
                    ) : (
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) =>
                                    setWithdrawAmount(parseFloat(e.target.value) || 0)
                                }
                                className={`w-full pl-8 pr-16 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${withdrawAmount > maxWithdrawAmount ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                    }`}
                                placeholder="0.00"
                            />
                            <button
                                type="button"
                                onClick={setMaxAmount}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded hover:bg-primary/20"
                            >
                                MAX
                            </button>
                        </div>
                    )}
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        {isFetching ? (
                            <Skeleton width="100%" height="12px" />
                        ) : (
                            <>
                                <span>Min: ₹50.00</span>
                                <span>Max per req: ₹{maxWithdrawAmount.toLocaleString()}</span>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Payment Method
                    </label>
                    {isFetching ? (
                        <Skeleton width="100%" height="48px" className="rounded-lg" />
                    ) : (
                        <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Bank Transfer (Linked)</option>
                        </select>
                    )}
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
                    {isFetching ? (
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton width="100px" height="16px" />
                                <Skeleton width="60px" height="16px" />
                            </div>
                            <div className="flex justify-between pt-2 border-t border-blue-100">
                                <Skeleton width="120px" height="18px" />
                                <Skeleton width="80px" height="18px" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Platform Fee ({commissionPercent}%)</span>
                                <span className="font-semibold text-primary">
                                    ₹{platformFee.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-blue-100">
                                <span className="font-semibold text-slate-900">
                                    Final Settlement:
                                </span>
                                <span className="font-bold text-slate-900">
                                    ₹{finalSettlement.toFixed(2)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {pendingCount > 0 && (
                <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 ${pendingCount >= 2 ? 'bg-orange-50 text-orange-800' : 'bg-blue-50 text-blue-800'
                    }`}>
                    <span className="material-symbols-outlined text-lg">
                        {pendingCount >= 2 ? 'warning' : 'pending'}
                    </span>
                    <div>
                        <p className="font-bold">Pending Requests: {pendingCount}/2</p>
                        <p className="text-xs opacity-80">
                            {pendingCount >= 2
                                ? "You cannot submit more requests until your current ones are processed."
                                : "Your funds are held safely until approved by the admin."}
                        </p>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3 ${isButtonDisabled
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                    }`}
            >
                <span className={`material-symbols-outlined ${(isFetching || isSubmitting) ? "animate-spin" : ""}`}>
                    {getButtonIcon()}
                </span>
                {getButtonContent()}
            </button>

            <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>End-to-end encrypted transaction secure via FintechCloud SSL</span>
            </div>
        </form>
    );
};

export default WithdrawalForm;
