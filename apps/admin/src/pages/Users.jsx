import React, { useState } from "react";

const RankBadge = ({ rank }) => {
    const styles = {
        Diamond: "bg-blue-50 text-blue-600 border-blue-100",
        Gold: "bg-amber-50 text-amber-600 border-amber-100",
        Silver: "bg-slate-50 text-slate-500 border-slate-200",
        Platinum: "bg-indigo-50 text-indigo-600 border-indigo-100",
    };

    const icons = {
        Diamond: "diamond",
        Gold: "workspace_premium",
        Silver: "military_tech",
        Platinum: "stars",
    };

    return (
        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${styles[rank] || styles.Silver}`}>
            <span className="material-symbols-outlined text-[14px] font-bold">{icons[rank] || "person"}</span>
            {rank}
        </div>
    );
};

export default function Users() {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const users = [
        { id: "UL-882910", name: "Johnathan Doe", avatar: "JD", rank: "Diamond", level: "Level 2", joined: "Oct 12, 2023", status: "ACTIVE", color: "bg-blue-100 text-blue-600" },
        { id: "UL-882915", name: "Sarah Kensington", avatar: "SK", rank: "Gold", level: "Level 1", joined: "Nov 05, 2023", status: "BLOCKED", color: "bg-pink-100 text-pink-600" },
        { id: "UL-882944", name: "Marcus Wright", avatar: "MW", rank: "Silver", level: "Level 4", joined: "Dec 18, 2023", status: "ACTIVE", color: "bg-slate-200 text-slate-600" },
        { id: "UL-883011", name: "Elena Lopez", avatar: "EL", rank: "Platinum", level: "Level 3", joined: "Jan 10, 2024", status: "ACTIVE", color: "bg-cyan-100 text-cyan-600" },
    ];

    const toggleSelect = (id) => {
        setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-black">User Management</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#172b4d] tracking-tighter">Distributor Directory</h2>
                    <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl">Review, monitor, and manage performance across the global Unilevel network.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 text-sm font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all group">
                        <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">download</span>
                        <span className="hidden md:inline">Export</span>
                    </button>
                </div>

            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 md:px-8 md:py-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="relative flex-1 group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-4 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {["All Ranks", "All Levels", "All Countries"].map((filter, i) => (
                        <button key={i} className="flex-1 md:flex-none px-4 md:px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 text-sm font-bold text-[#172b4d] hover:bg-slate-100 transition-all min-w-[140px] md:min-w-[160px] justify-between">
                            <span className="truncate">{filter}</span>
                            <span className="material-symbols-outlined text-slate-400 font-bold">expand_more</span>
                        </button>
                    ))}
                    <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined font-bold">tune</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                                </th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">USER DETAILS</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">RANK</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">LEVEL</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">JOINED DATE</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user, i) => (
                                <tr key={i} className={`hover:bg-slate-50/50 transition-colors group ${selectedUsers.includes(user.id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-10 py-6">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelect(user.id)}
                                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center font-black text-xs shadow-sm shadow-black/5 shrink-0`}>
                                                {user.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-[#172b4d] tracking-tight truncate">{user.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">ID: {user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <RankBadge rank={user.rank} />
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-sm font-bold text-[#172b4d]">{user.level}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-sm font-medium text-slate-500">{user.joined}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center justify-end gap-3 px-4">
                                            <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                            <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            {user.status === 'ACTIVE' ? (
                                                <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <span className="material-symbols-outlined text-xl">block</span>
                                                </button>
                                            ) : (
                                                <button className="p-2.5 text-green-500 hover:bg-green-50 rounded-xl transition-all">
                                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
