import React from "react";

const TransactionHistory = ({ transactions }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">history</span>
                    <h2 className="text-xl font-bold text-slate-900">
                        Transaction History
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Request Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {transactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">
                                    {transaction.date}
                                </div>
                                <div className="text-sm text-slate-500">{transaction.time}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-mono text-sm font-semibold text-primary">
                                    {transaction.id}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">
                                        {transaction.methodIcon}
                                    </span>
                                    <span className="font-medium text-slate-900">
                                        {transaction.method}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-900">
                                    {transaction.amount}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.statusColor}`}
                                >
                                    ● {transaction.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 hover:bg-slate-100 rounded-lg">
                                    <span className="material-symbols-outlined text-slate-400">
                                        more_vert
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                    Showing 1-3 of 24 transactions
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                        <span className="material-symbols-outlined text-slate-600">
                            chevron_left
                        </span>
                    </button>
                    <button className="px-3 py-1 bg-primary text-white rounded-lg font-semibold text-sm">
                        1
                    </button>
                    <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50">
                        2
                    </button>
                    <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50">
                        3
                    </button>
                    <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                        <span className="material-symbols-outlined text-slate-600">
                            chevron_right
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
