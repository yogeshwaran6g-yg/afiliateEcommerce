import React from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useWallet";

const getInitials = (name = "N/A") => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const getColorFromType = (type) => {
    const types = {
        REFERRAL_COMMISSION: "from-blue-400 to-blue-600",
        UPGRADE_BONUS: "from-green-400 to-green-600",
        WITHDRAWAL_REQUEST: "from-purple-400 to-purple-600",
        RECHARGE_REQUEST: "from-orange-400 to-orange-600",
        REVERSAL: "from-red-400 to-red-600",
    };
    return types[type] || "from-slate-400 to-slate-600";
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatCurrency = (amount, entryType) => {
    const isNegative = entryType?.toUpperCase() === "DEBIT" || amount < 0;
    const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Math.abs(amount) || 0);

    return {
        text: `${isNegative ? "-" : "+"}${formatted}`,
        isNegative,
    };
};

const getStatusLabel = (status) => {
    if (!status) return "Success";
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export default function TransactionsTable() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useTransactions(5, 0);

    const transactions = data?.transactions || [];

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
                <div className="p-6 h-16 border-b border-slate-200 bg-slate-50"></div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-slate-50 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <span className="material-symbols-outlined text-slate-400 text-5xl mb-4">error</span>
                <p className="text-slate-500 font-medium">Failed to load transactions</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">Recent Transactions</h3>
                <button
                    onClick={() => navigate("/wallet/history")}
                    className="text-primary font-semibold text-sm hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Entity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {transactions.length > 0 ? (
                            transactions.map((txn, i) => {
                                const currency = formatCurrency(txn.amount, txn.entry_type);
                                return (
                                    <tr key={txn.id || `txn-${i}`} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full bg-linear-to-br ${getColorFromType(txn.transaction_type)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                                    {getInitials(txn.description || txn.transaction_type)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-sm text-slate-900 truncate">
                                                        {txn.description || "System Transaction"}
                                                    </div>
                                                    <div className="text-xs text-slate-500 truncate">
                                                        {txn.reference_id ? `Ref: ${txn.reference_id}` : "No reference"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">
                                                {getStatusLabel(txn.transaction_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">
                                                {formatDate(txn.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-bold ${!currency.isNegative ? 'text-green-600' : 'text-red-500'}`}>
                                                {currency.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={txn.status?.toUpperCase() === "SUCCESS" ? "badge-completed" : "badge-processing"}>
                                                {getStatusLabel(txn.status)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    No Recent Transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
