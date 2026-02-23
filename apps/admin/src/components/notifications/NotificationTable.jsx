import React from "react";

const NotificationTable = ({ notifications, onDelete }) => {
    return (
        <div className="bg-white rounded-5xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">RECIPIENT</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MESSAGE CONTENT</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TYPE</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {notifications.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {item?.user_name?.charAt(0) || item?.user_id}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-black text-[#172b4d] tracking-tight truncate">{item?.user_name || 'System User'}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">Recipient ID: {item?.user_id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="max-w-md">
                                        <h4 className="text-sm font-bold text-[#172b4d] tracking-tight">{item?.title}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium truncate mt-1">{item?.description}</p>
                                        <p className="text-[9px] text-slate-300 mt-1 font-bold">{item?.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${item?.type === 'ORDER' ? 'bg-purple-50 text-purple-600' :
                                        item?.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600' :
                                            item?.type === 'WALLET' ? 'bg-indigo-50 text-indigo-600' :
                                                item?.type === 'ACCOUNT' ? 'bg-slate-100 text-slate-600' :
                                                    'bg-slate-50 text-slate-400'
                                        }`}>
                                        {item?.type}
                                    </span>
                                </td>
                                <td className="px-10 py-6">
                                    {item.is_read ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <span className="material-symbols-outlined text-sm font-bold">done_all</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Seen</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <span className="material-symbols-outlined text-sm font-bold">mail</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Sent</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => onDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {notifications.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 text-slate-300">
                                        <span className="material-symbols-outlined text-6xl">outgoing_mail</span>
                                        <p className="text-sm font-bold">No dispatch history available yet.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NotificationTable;
