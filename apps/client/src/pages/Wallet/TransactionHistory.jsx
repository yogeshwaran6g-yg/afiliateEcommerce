import React, { useState } from 'react';
import { transactions } from './data';

export default function TransactionHistory() {
    const [dateFilter, setDateFilter] = useState("Last 30 Days");

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction History</h2>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        {dateFilter}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {transactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {transaction.date}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">{transaction.title}</div>
                                <div className="text-sm text-slate-500">{transaction.subtitle}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.typeColor}`}>
                                    {transaction.type}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`font-bold ${transaction.amountColor}`}>
                                    {transaction.amount}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.statusColor}`}>
                                    ● {transaction.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                    Showing 1 to 5 of 42 transactions
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                        <span className="material-symbols-outlined text-slate-600">chevron_left</span>
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
                        <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
