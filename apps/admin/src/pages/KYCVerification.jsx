import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userApiService from "../services/userApiService";

export default function KYCVerification() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchRecords();
    }, [filter]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const data = await userApiService.getKYCRecords(filter);
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch KYC records:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-bold">Verification</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Verification</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Review and approve user identification documents.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {['', 'PENDING', 'VERIFIED', 'REJECTED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            {f || 'All Requests'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4 shadow-sm">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Registry...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Identity Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Address Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bank Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {records.map((record) => (
                                    <tr key={record.dbId} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-xs font-black text-slate-400 font-mono tracking-widest">{record.id}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/10">
                                                    {record.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#172b4d] tracking-tight">{record.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-400">{record.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest ${getStatusColor(record.statuses.identity)}`}>
                                                {record.statuses.identity || 'NONE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest ${getStatusColor(record.statuses.address)}`}>
                                                {record.statuses.address || 'NONE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest ${getStatusColor(record.statuses.bank)}`}>
                                                {record.statuses.bank || 'NONE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => navigate(`/kyc/${record.dbId}`)}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 transition-all active:scale-95"
                                            >
                                                Review Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {records.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                                    <span className="material-symbols-outlined text-4xl">search_off</span>
                                                </div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching registry records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
