const transactions = [
    {
        initials: "JD",
        name: "Jane Doe",
        subtitle: "Level 2 Distributor",
        type: "Commission",
        date: "Oct 12, 2023",
        amount: "+$124.00",
        status: "Completed",
        color: "from-blue-400 to-blue-600"
    },
    {
        initials: "SM",
        name: "Steve Miller",
        subtitle: "Direct Referral",
        type: "Upgrade Bonus",
        date: "Oct 11, 2023",
        amount: "+$250.00",
        status: "Completed",
        color: "from-green-400 to-green-600"
    },
    {
        initials: "E",
        name: "Withdrawal Request",
        subtitle: "Bank Transfer (**** 4291)",
        type: "Payout",
        date: "Oct 10, 2023",
        amount: "-$500.00",
        status: "Processing",
        color: "from-purple-400 to-purple-600"
    },
];

export default function TransactionsTable() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">Recent Network Transactions</h3>
                <button className="text-primary font-semibold text-sm hover:underline">
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
                        {transactions.map((txn, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-linear-to-br ${txn.color} flex items-center justify-center text-white font-bold text-sm`}>
                                            {txn.initials}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-slate-900">{txn.name}</div>
                                            <div className="text-xs text-slate-500">{txn.subtitle}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-700">{txn.type}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-700">{txn.date}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-bold ${txn.amount.startsWith('+') ? 'text-green-600' : 'text-slate-700'}`}>
                                        {txn.amount}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={txn.status === "Completed" ? "badge-completed" : "badge-processing"}>
                                        {txn.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
