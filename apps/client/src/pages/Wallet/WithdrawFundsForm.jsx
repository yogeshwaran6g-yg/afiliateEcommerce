import React, { useState } from "react";
import { useWithdrawMutation } from "../../hooks/useWallet";
import { toast } from "react-toastify";

export default function WithdrawFundsForm({ onClose, wallet }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const withdrawMutation = useWithdrawMutation();

  const maxWithdrawable = wallet?.withdrawable || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (numericAmount > maxWithdrawable) {
      setError(
        `You cannot withdraw more than your available balance (₹${maxWithdrawable.toFixed(2)}).`,
      );
      return;
    }

    try {
      await withdrawMutation.mutateAsync({ amount: numericAmount });
      toast.success("Withdrawal request submitted successfully!");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit withdrawal request. Please try again.",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-200 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Withdraw Funds</h2>
            <p className="text-sm text-slate-500">
              Transfer earnings to your bank account
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Balance Info */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-500">
            Available Balance
          </span>
          <span className="text-xl font-bold text-primary">
            ₹{maxWithdrawable.toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">
            Withdrawal Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold"
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}
        </div>

        {/* Quick Selection */}
        <div className="grid grid-cols-4 gap-2">
          {[500, 1000, 2000, 5000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val.toString())}
              className="py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              ₹{val}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={withdrawMutation.isPending || !amount}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              withdrawMutation.isPending || !amount
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            {withdrawMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">payments</span>
                Withdraw Now
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            * Withdrawal requests are typically processed within 24-48 hours.
          </p>
        </div>
      </form>
    </div>
  );
}
