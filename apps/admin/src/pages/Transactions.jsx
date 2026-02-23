import React, { useState, useEffect } from "react";
import walletApiService from "../services/walletApiService";
import { toast } from "react-toastify";

const TransactionRow = ({ tx }) => {
    // Determine display entity
    const entityName = tx.transaction_type === 'REFERRAL_COMMISSION' ? (tx.downline_name || "Unknown") : (tx.user_name || "System");
    const entityRole = tx.transaction_type === 'REFERRAL_COMMISSION' ? (tx.downline_rank || "Distributor") : (tx.user_rank || "User");
    const entityInitials = entityName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }) + ' · ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getIcon = () => {
        switch (tx.transaction_type) {
            case 'RECHARGE_REQUEST': return 'add_circle';
            case 'WITHDRAWAL_REQUEST': return 'account_balance_wallet';
            case 'REFERRAL_COMMISSION': return 'payments';
            default: return 'swap_horiz';
        }
    };

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.entry_type === 'CREDIT' ? 'bg-green-100 text-green-600' :
                        tx.entry_type === 'DEBIT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        } shadow-sm`}>
                        <span className="material-symbols-outlined text-lg font-bold">
                            {tx.entry_type === 'CREDIT' ? 'south_east' : 'north_west'}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-[#172b4d] truncate">TX-{tx.id.toString().padStart(6, '0')}</p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest truncate">
                            {tx.transaction_type.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden shrink-0 border border-primary/20">
                        {entityInitials}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-[#172b4d] truncate">{entityName}</p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest truncate">{entityRole}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5 text-slate-500 font-medium whitespace-nowrap">
                {formatDate(tx.created_at)}
            </td>
            <td className="px-8 py-5">
                <div className={`font-bold ${tx.entry_type === 'CREDIT' ? 'text-green-600' : 'text-[#172b4d]'}`}>
                    {tx.entry_type === 'CREDIT' ? '+' : '-'}₹{formatAmount(tx.amount)}
                </div>
            </td>
            <td className="px-8 py-5">
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                    tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {tx.status}
                </span>
            </td>
            <td className="px-8 py-5 text-right">
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                    <span className="material-symbols-outlined font-bold">visibility</span>
                </button>
            </td>
        </tr>
    );
};

export default function Transactions() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [transactions, setTransactions] = useState([]);
    const [metrics, setMetrics] = useState({
        grossVolume: 0,
        adminFees: 0,
        networkPayouts: 0,
        activeFloat: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (activeFilter !== "All") filters.entryType = activeFilter.toUpperCase();

            const [txRes, metricsRes] = await Promise.all([
                walletApiService.getWalletTransactions(filters),
                walletApiService.getTransactionMetrics()
            ]);

            setTransactions(txRes.data.transactions);
            setMetrics(metricsRes.data);
        } catch (error) {
            toast.error("Failed to fetch transaction data");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span className="text-primary font-bold">Transactions</span>
                    </div>
                    <h2 className="font-bold text-slate-800 tracking-tight">Transactions</h2>
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">Monitoring real-time financial movements.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined font-bold text-lg">download</span>
                        <span>Export CSV</span>
                    </button>
                    <button className="px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all leading-none">
                        Audit All
                    </button>
                </div>
            </div>

            {/* Overall Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Gross Volume (24h)", value: formatCurrency(metrics.grossVolume), trend: "+12%", icon: "account_balance" },
                    { label: "Admin Fees", value: formatCurrency(metrics.adminFees), trend: "+5%", icon: "toll" },
                    { label: "Network Payouts", value: formatCurrency(metrics.networkPayouts), trend: "-2%", icon: "volunteer_activism" },
                    { label: "Active Float", value: formatCurrency(metrics.activeFloat), trend: "Stable", icon: "savings" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <span className="material-symbols-outlined font-bold">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#172b4d]">{stat.value}</span>
                                <span className={`font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-slate-400'}`}>{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-50 gap-6">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                        <div className="flex items-center gap-1.5 min-w-max">
                            {["All", "Credit", "Debit"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-5 py-2 rounded-xl font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group flex-1 md:flex-none">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-lg group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Search ID..."
                                className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-xl">tune</span>
                        </button>
                    </div>
                </div>

                <div className="p-0 min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2">database_off</span>
                            <p className="font-bold">No transactions found</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block lg:hidden divide-y divide-slate-50">
                                {transactions.map((tx, idx) => (
                                    <div key={idx} className="p-4 md:p-6 space-y-4 hover:bg-slate-50/30 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tx.entry_type === 'CREDIT' ? 'bg-green-100 text-green-600' :
                                                    tx.entry_type === 'DEBIT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-lg font-bold">
                                                        {tx.entry_type === 'CREDIT' ? 'south_east' : 'north_west'}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#172b4d] truncate">TX-{tx.id.toString().padStart(6, '0')}</p>
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-0.5">{tx.transaction_type.replace(/_/g, ' ')}</p>
                                                </div>
                                            </div>
                                            <div className={`font-bold text-right shrink-0 ${tx.entry_type === 'CREDIT' ? 'text-green-600' : 'text-[#172b4d]'}`}>
                                                {tx.entry_type === 'CREDIT' ? '+' : '-'}₹{new Intl.NumberFormat('en-IN').format(tx.amount)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden shrink-0">
                                                    {(tx.transaction_type === 'REFERRAL_COMMISSION' ? (tx.downline_name || "U") : (tx.user_name || "S")).charAt(0)}
                                                </div>
                                                <p className="font-bold text-slate-600 truncate">{tx.transaction_type === 'REFERRAL_COMMISSION' ? (tx.downline_name || "Unknown") : (tx.user_name || "System")}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-lg font-bold uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                                tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <p className="font-medium text-slate-400">{new Date(tx.created_at).toLocaleString()}</p>
                                            <button className="flex items-center gap-1 font-bold text-primary uppercase tracking-widest hover:underline">
                                                Details
                                                <span className="material-symbols-outlined text-xs font-bold">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left min-w-[900px]">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">TRANSACTION</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">INITIATOR / ENTITY</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">TIMESTAMPS</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">AMOUNT</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">STATUS</th>
                                            <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-right">DETAILS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.map((tx, idx) => (
                                            <TransactionRow key={idx} tx={tx} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 md:p-8 flex items-center justify-between border-t border-slate-50">
                    <p className="font-bold text-slate-400 uppercase tracking-widest">Viewing real-time ledger</p>
                    <button className="font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                        <span>Load Historical Data</span>
                        <span className="material-symbols-outlined text-sm">history</span>
                    </button>
                </div>
            </div>

            {/* Verification Footer */}
            <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <span className="material-symbols-outlined text-[120px]">encrypted</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-bold tracking-[0.2em] opacity-60">LEDGER INTEGRITY VERIFIED</span>
                        </div>
                        <h4 className="font-bold tracking-tight">Real-time Financial Audit Trail</h4>
                        <p className="text-white/50 font-medium max-w-xl">Every movement is logged with AES-256 encryption. The platform maintains a 1:1 asset ratio across all distributor wallets.</p>
                    </div>
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl font-bold uppercase tracking-widest transition-all whitespace-nowrap">
                        Download Audit Report
                    </button>
                </div>
            </div>
        </div>
    );
}
