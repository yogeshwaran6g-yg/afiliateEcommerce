import React from "react";

const TicketsSection = ({ tickets }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    Support Tickets
                </h2>
                <button className="text-primary font-semibold text-sm hover:underline">
                    New Ticket
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                                ID
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                                Status
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {tickets.map((ticket) => (
                            <tr
                                key={ticket.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-xs md:text-sm font-semibold text-primary">
                                    {ticket.id}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs md:text-sm font-medium text-slate-900">
                                        {ticket.subject}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-slate-400">
                                        {ticket.lastUpdate}
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <span
                                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${ticket.statusColor}`}
                                    >
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                        <span className="material-symbols-outlined text-lg">
                                            visibility
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketsSection;
