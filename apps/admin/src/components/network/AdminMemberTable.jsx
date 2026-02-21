import React from "react";

const AdminMemberTable = ({ members, isLoading, error, pagination, onPageChange, onLimitChange }) => {
    if (error) {
        return (
            <div className="p-12 text-center bg-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4">
                    <span className="material-symbols-outlined text-2xl">error</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Failed to load members</h3>
                <p className="text-xs text-slate-500">{error.message || "There was an error fetching the team data."}</p>
            </div>
        );
    }

    if (isLoading && (!members || members.length === 0)) {
        return (
            <div className="p-12 text-center bg-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-4 animate-spin">
                    <span className="material-symbols-outlined text-2xl">sync</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Loading members...</h3>
                <p className="text-xs text-slate-500">Fetching team details from the server.</p>
            </div>
        );
    }

    if (!members || members.length === 0) {
        return (
            <div className="p-12 text-center bg-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-4">
                    <span className="material-symbols-outlined text-2xl">group</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No members found</h3>
                <p className="text-xs text-slate-500">This level doesn't have any members yet.</p>
            </div>
        );
    }

    const getAvatarColor = (name) => {
        const colors = [
            "bg-slate-300",
            "bg-amber-300",
            "bg-orange-300",
            "bg-emerald-300",
            "bg-sky-300",
            "bg-rose-300",
        ];
        const index = (name?.charCodeAt(0) || 0) % colors.length;
        return colors[index];
    };

    const getInitials = (name) => {
        return name
            ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)
            : "??";
    };

    return (
        <div className="bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Join Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Contribution</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-slate-50 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 ${getAvatarColor(member.name)} rounded-2xl flex items-center justify-center text-slate-700 font-bold text-base shadow-inner uppercase group-hover:bg-white group-hover:shadow-sm transition-all duration-300`}>
                                            {getInitials(member.name)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{member.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {member.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-xs font-semibold text-slate-600">{member.email}</div>
                                    <div className="text-[10px] text-slate-400 font-bold tracking-tight">{member.phone}</div>
                                </td>
                                <td className="px-8 py-6 text-xs font-bold text-slate-500">
                                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : "N/A"}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                        member.status === "Active"
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="text-sm font-black text-slate-800">
                                        ₹{(member.contribution || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-bold">Network Revenue</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows:</span>
                        <select
                            value={pagination.limit || 10}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        >
                            {[10, 20, 50, 100].map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </select>
                        <span className="text-[10px] font-bold text-slate-400">Total: {pagination.total}</span>
                    </div>

                    <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page</span>
                            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-800 shadow-sm min-w-[3rem] text-center">
                                {pagination.page}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of {pagination.totalPages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                                disabled={pagination.page <= 1}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                            </button>
                            <button
                                onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMemberTable;
