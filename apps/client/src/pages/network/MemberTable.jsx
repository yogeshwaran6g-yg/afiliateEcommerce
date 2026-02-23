import React from "react";
import Skeleton from "../../components/ui/Skeleton";

const MemberTable = ({ members, isLoading, error, pagination, onPageChange, onLimitChange }) => {
    if (error) {
        return (
            <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                    <span className="material-symbols-outlined text-2xl">error</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Failed to load members</h3>
                <p className="text-sm text-slate-500">There was an error fetching the team data. Please try again.</p>
            </div>
        );
    }

    // Simplified loading state handling - we'll show skeletons in the table body

    // Handled in table body

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
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/30 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Member
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">
                                Contact
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                                Join Date
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Status
                            </th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Contribution
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-slate-100`}>
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <Skeleton variant="circular" width="48px" height="48px" className="rounded-2xl" />
                                            <div className="space-y-2">
                                                <Skeleton width="100px" height="16px" />
                                                <Skeleton width="60px" height="10px" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 hidden sm:table-cell">
                                        <div className="space-y-2">
                                            <Skeleton width="140px" height="12px" />
                                            <Skeleton width="90px" height="10px" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 hidden md:table-cell">
                                        <Skeleton width="80px" height="12px" />
                                    </td>
                                    <td className="px-8 py-5">
                                        <Skeleton width="70px" height="24px" className="rounded-full" />
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-2">
                                            <Skeleton width="90px" height="16px" />
                                            <Skeleton width="80px" height="10px" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : members.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                                        <span className="material-symbols-outlined text-2xl">group</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No members found</h3>
                                    <p className="text-sm text-slate-500">This level doesn't have any members yet.</p>
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-slate-50/30 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 ${getAvatarColor(member.name)} rounded-2xl flex items-center justify-center text-slate-700 font-bold text-base shadow-inner uppercase group-hover:bg-white group-hover:shadow-sm transition-all duration-300`}
                                            >
                                                {getInitials(member.name)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">
                                                    {member.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold">
                                                    ID: {member.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 hidden sm:table-cell">
                                        <div className="text-xs font-medium text-slate-600">
                                            {member.email}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold tracking-tight">
                                            {member.phone}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-semibold text-slate-500 hidden md:table-cell">
                                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-US", {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : "N/A"}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${member.status === "Active"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-slate-100 text-slate-500 border border-slate-200"
                                                }`}
                                        >
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-slate-900">
                                            ₹{(member.contribution || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-[10px] text-emerald-600 font-bold">
                                            Network Revenue
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rows:</span>
                        <select
                            value={pagination.limit || 10}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            {[5, 10, 20, 50, 100].map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </select>
                        <span className="text-[10px] font-bold text-slate-400">Total: {pagination.total || members.length}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                            disabled={pagination.page <= 1}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Page</span>
                            <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700 shadow-sm min-w-[2rem] text-center">
                                {pagination.page || 1}
                            </div>
                            <span className="text-xs font-bold text-slate-400">of {pagination.totalPages || 1}</span>
                        </div>

                        <button
                            onClick={() => onPageChange(Math.min(pagination.totalPages, (pagination.page || 1) + 1))}
                            disabled={!pagination.totalPages || pagination.page >= pagination.totalPages}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MemberTable;
