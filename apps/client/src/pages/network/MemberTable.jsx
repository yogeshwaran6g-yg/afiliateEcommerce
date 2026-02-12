import React from "react";

const MemberTable = ({ members }) => {
    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Member
                            </th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">
                                Join Date
                            </th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Status
                            </th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Contribution
                            </th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {members.map((member) => (
                            <tr
                                key={member.id}
                                className="hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="px-4 md:px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 md:w-10 md:h-10 ${member.avatarColor} rounded-full flex items-center justify-center text-slate-700 font-bold text-xs md:text-sm shadow-inner`}
                                        >
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">
                                                {member.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium">
                                                ID: {member.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-slate-600 hidden sm:table-cell">
                                    {member.joinDate}
                                </td>
                                <td className="px-4 md:px-6 py-4">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${member.statusColor}`}
                                    >
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-sm font-black text-slate-900">
                                    {member.contribution}
                                </td>
                                <td className="px-4 md:px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                                        <span className="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
                <div className="text-[10px] md:text-xs text-slate-400 font-bold">
                    PAGE 1 OF 6
                </div>
                <div className="flex items-center gap-2">
                    <button className="h-8 w-8 bg-primary text-white rounded-lg font-bold text-xs">
                        1
                    </button>
                    <button className="h-8 w-8 border border-slate-200 rounded-lg font-bold text-xs text-slate-500 hover:bg-white">
                        2
                    </button>
                    <button className="h-8 w-8 border border-slate-200 rounded-lg font-bold text-xs text-slate-500 hover:bg-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">
                            chevron_right
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default MemberTable;
