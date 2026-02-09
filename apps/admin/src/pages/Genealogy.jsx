import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const TreeNode = ({ member, isRoot, onSelect, isSelected }) => (
    <div className="flex flex-col items-center relative">
        {!isRoot && <div className="h-8 w-px bg-slate-200 mb-0"></div>}

        <div
            onClick={() => onSelect(member)}
            className={`cursor-pointer transition-all duration-300 relative group ${isRoot ? 'w-80' : 'w-56'
                }`}
        >
            <div className={`p-4 rounded-2xl border bg-white shadow-sm transition-all group-hover:shadow-md ${isSelected ? 'border-primary ring-4 ring-primary/5 shadow-lg' : 'border-slate-100'
                }`}>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full border-2 p-0.5 ${member.rank === 'PLATINUM' ? 'border-primary' :
                                member.rank === 'GOLD' ? 'border-amber-400' : 'border-slate-200'
                            }`}>
                            <img src={member.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            L{member.level}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-[#172b4d] truncate">{member.name}</h4>
                            {member.hasChildren && (
                                <button className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-sm font-bold">
                                        {member.isExpanded ? 'remove' : 'add'}
                                    </span>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${member.rank === 'PLATINUM' ? 'text-primary' : 'text-amber-600'
                                }`}>{member.rank} MEMBER</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">ID: #{member.id}</span>
                        </div>
                    </div>
                </div>

                {isRoot && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50">
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">TEAM SIZE</p>
                            <p className="text-sm font-black text-[#172b4d]">{member.teamSize.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">GV (MONTHLY)</p>
                            <p className="text-sm font-black text-green-600">{member.gv}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {member.isExpanded && member.children && (
            <div className="relative flex justify-center pt-8">
                {/* Connector Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-200"></div>
                {member.children.length > 1 && (
                    <div className="absolute top-8 left-[calc(100%/ (2 * var(--child-count)))] right-[calc(100%/ (2 * var(--child-count)))] h-px bg-slate-200"
                        style={{ '--child-count': member.children.length }}
                    ></div>
                )}
                <div className="flex gap-12">
                    {member.children.map((child, i) => (
                        <TreeNode
                            key={i}
                            member={child}
                            onSelect={onSelect}
                            isSelected={isSelected?.id === child.id}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default function Genealogy() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [activeView, setActiveView] = useState("Unilevel Tree");

    const treeData = {
        name: "Alexander Sterling",
        id: "88291",
        rank: "PLATINUM",
        level: 1,
        teamSize: 12402,
        gv: "$2.4M",
        avatar: "https://i.pravatar.cc/150?u=Alexander",
        isExpanded: true,
        children: [
            {
                name: "Marcus Chen",
                id: "22819",
                rank: "PLATINUM",
                level: 2,
                teamSize: 1890,
                gv: "$452K",
                avatar: "https://i.pravatar.cc/150?u=Marcus",
                hasChildren: true,
                isExpanded: true,
                children: [
                    { name: "Elena Rossi", id: "55123", rank: "GOLD", level: 3, avatar: "https://i.pravatar.cc/150?u=Elena" },
                    { name: "David Okafor", id: "77234", rank: "GOLD", level: 3, avatar: "https://i.pravatar.cc/150?u=David" }
                ]
            },
            {
                name: "Sophia Evans",
                id: "10293",
                rank: "GOLD",
                level: 2,
                teamSize: 3901,
                gv: "$892K",
                avatar: "https://i.pravatar.cc/150?u=Sophia",
                hasChildren: true
            }
        ]
    };

    const views = [
        { icon: "account_tree", label: "Unilevel Tree" },
        { icon: "view_list", label: "List Directory" },
        { icon: "monitoring", label: "Rank Tracker" },
        { icon: "group_add", label: "Enrollment" },
        { icon: "analytics", label: "Analytics" }
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] font-display overflow-hidden">
            <Sidebar />

            {/* Left Inner Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">VIEWS</h5>
                    <nav className="space-y-1">
                        {views.map(view => (
                            <button
                                key={view.label}
                                onClick={() => setActiveView(view.label)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeView === view.label ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{view.icon}</span>
                                <span>{view.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Tree Capacity</span>
                            <span className="text-[9px] font-bold text-[#172b4d]">12,402 / 20k</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '62%' }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Tree Area */}
            <main className="flex-1 flex flex-col relative bg-[#f1f5f9] overflow-hidden">
                {/* Top Navigation */}
                <div className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-10">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl font-bold">account_tree</span>
                            </div>
                            <h1 className="text-xl font-bold text-[#172b4d] tracking-tight">Global Genealogy</h1>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 border-l border-slate-200 pl-8">
                            {['Genealogy', 'Commissions', 'Reports', 'Settings'].map((item) => (
                                <button key={item} className={`text-xs font-bold uppercase tracking-widest ${item === 'Genealogy' ? 'text-primary border-b-2 border-primary pb-px' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                            Admin Console
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX_dj4KfY6NKcsjryLVAz302mj4ap8VZXGDmA847VctRCQyj5SuefFtzW0hnb1Cdgs9Enl7l70_ui1jrHWj_sHQbVOxhoP5-8IMCQ7YhkZJpZdhDRIRMiSbXTyu5aMODTEN7waowtGKb9UztPBdt2sRD4Hc7XzQRV0anhyY9qDS78D8Yu8LGSpObqn_iBmb2uYWvKhS6vpENUHMdorRAYZdAvw0BvNYBKAzflWEy95LHdPocZOu9pJ0wbfmFzRLyfKxxhfXcvyhQg" className="w-full h-full object-cover" alt="" />
                        </div>
                    </div>
                </div>

                {/* Tree Controls */}
                <div className="absolute top-24 left-8 right-8 z-10 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <div className="relative w-80">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Find User ID or Name..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm font-medium"
                            />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500 hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                        {['3 Levels', '5 Levels', 'All'].map(level => (
                            <button key={level} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${level === '3 Levels' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}>
                                {level}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-slate-100 mx-2"></div>
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            <span>Filter Ranks</span>
                        </button>
                    </div>
                </div>

                {/* Tree Viewport (Scrollable) */}
                <div className="flex-1 overflow-auto p-32 flex justify-center items-start scroll-smooth cursor-grab active:cursor-grabbing">
                    <TreeNode
                        member={treeData}
                        isRoot
                        onSelect={setSelectedMember}
                        isSelected={selectedMember?.id === treeData.id}
                    />
                </div>

                {/* Navigation Minimap Placeholder */}
                <div className="absolute bottom-8 left-8 p-4 bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl space-y-2 pointer-events-auto">
                    <div className="w-32 h-20 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="w-8 h-8 border-2 border-primary bg-primary/5 rounded-lg"></div>
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-2 pointer-events-auto">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                        <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                        <div className="w-full h-px bg-slate-100"></div>
                        <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined">remove</span>
                        </button>
                    </div>
                    <button className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-xl flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined">center_focus_strong</span>
                    </button>
                </div>
            </main>

            {/* Right Details Sidebar */}
            {selectedMember && (
                <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <h3 className="text-lg font-black text-[#172b4d]">User Details</h3>
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10">
                        <div className="flex flex-col items-center text-center space-y-4 mb-10">
                            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden mb-2">
                                <img src={selectedMember.avatar} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-[#172b4d] tracking-tight">{selectedMember.name}</h4>
                                <div className="mt-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block">
                                    {selectedMember.rank} MEMBER
                                </div>
                                <p className="text-xs text-slate-400 font-bold mt-3">Affiliate ID: #{selectedMember.id}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">PERFORMANCE KPIS</h5>
                                <div className="space-y-2">
                                    {[
                                        { label: "Personal Volume", value: "$12,450" },
                                        { label: "Team Volume", value: selectedMember.gv || "$0", color: "text-primary" },
                                        { label: "Direct Referrals", value: selectedMember.teamSize || "0" }
                                    ].map(kpi => (
                                        <div key={kpi.label} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                                            <span className="text-sm text-slate-500 font-medium">{kpi.label}</span>
                                            <span className={`text-sm font-black ${kpi.color || 'text-[#172b4d]'}`}>{kpi.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SPONSOR INFO</h5>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white overflow-hidden">
                                            <img src="https://i.pravatar.cc/150?u=Alexander" alt="" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#172b4d]">Alexander Sterling</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: #88291</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">open_in_new</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-3 bg-slate-50 border-t border-slate-100">
                        <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">message</span>
                            <span>Contact User</span>
                        </button>
                        <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
                            View Full Profile
                        </button>
                    </div>
                </aside>
            )}
        </div>
    );
}
