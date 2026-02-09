import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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
        <div className="flex h-screen bg-[#f8fafc] font-display overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                <div className="flex-1 p-10 lg:p-14 space-y-10 overflow-y-auto">
                    {/* Page Header */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                <span className="text-primary font-black">User Management</span>
                            </div>
                            <h2 className="text-5xl font-black text-[#172b4d] tracking-tighter">Distributor Directory</h2>
                            <p className="text-xl text-slate-500 font-medium">Review, monitor, and manage performance across the global Unilevel network.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 text-sm font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all group">
                                <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">download</span>
                                <span>Export</span>
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group leading-none">
                                <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">person_add</span>
                                <span>Add Member</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white px-8 py-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="relative flex-1 group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-4 py-4 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {[
                                { label: "All Ranks", icon: "expand_more" },
                                { label: "All Levels", icon: "expand_more" },
                                { label: "All Countries", icon: "expand_more" }
                            ].map((filter, i) => (
                                <button key={i} className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 text-sm font-bold text-[#172b4d] hover:bg-slate-100 transition-all min-w-[160px] justify-between">
                                    <span>{filter.label}</span>
                                    <span className="material-symbols-outlined text-slate-400 font-bold">{filter.icon}</span>
                                </button>
                            ))}
                            <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined font-bold">tune</span>
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
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
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-14">ACTIONS</th>
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
                                                <div className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center font-black text-xs shadow-sm shadow-black/5`}>
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-[#172b4d] tracking-tight">{user.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {user.id}</p>
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
            </main>
        </div>
    );
}
