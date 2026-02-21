import React, { useState, useRef, useEffect } from "react";

const TreeNode = ({ member, isRoot, onSelect, isSelected, onToggle }) => (
    <div className="flex flex-col items-center relative">
        {!isRoot && <div className="h-8 w-px bg-slate-200 mb-0"></div>}

        <div
            onClick={() => onSelect(member)}
            className={`cursor-pointer transition-all duration-300 relative group ${isRoot ? 'w-[280px] md:w-80' : 'w-48 md:w-56'} ${!member.isMatched && 'opacity-40 grayscale-[0.5]'}`}
        >
            <div className={`p-3 md:p-4 rounded-2xl border bg-white shadow-sm transition-all group-hover:shadow-md ${isSelected ? 'border-primary ring-4 ring-primary/5 shadow-lg' : member.isMatched ? 'border-primary/30 ring-4 ring-primary/5' : 'border-slate-100'
                }`}>
                <div className="flex items-center gap-3 md:gap-4">

                    <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 p-0.5 border-slate-200">
                            <img src={member.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                        </div>
                    </div>


                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-[#172b4d] truncate">{member.name}</h4>
                            {member.hasChildren && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggle(member.id);
                                    }}
                                    className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold">
                                        {member.isExpanded ? 'remove' : 'add'}
                                    </span>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">#{member.id}</span>
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
                            onToggle={onToggle}
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
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [visibleLevels, setVisibleLevels] = useState('3 Levels');
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubSidebarOpen, setSubSidebarOpen] = useState(false);

    const viewportRef = useRef(null);

    const [tree, setTree] = useState({
        name: "Alexander Sterling",
        id: "88291",
        teamSize: 12402,
        gv: "₹2.4M",
        avatar: "https://i.pravatar.cc/150?u=Alexander",
        isExpanded: true,
        children: [
            {
                name: "Marcus Chen",
                id: "22819",
                teamSize: 1890,
                gv: "₹452K",
                avatar: "https://i.pravatar.cc/150?u=Marcus",
                hasChildren: true,
                isExpanded: true,
                children: [
                    {
                        name: "Elena Rossi", id: "55123", avatar: "https://i.pravatar.cc/150?u=Elena",
                        hasChildren: true, isExpanded: false,
                        children: [
                            {
                                name: "Luca Bianchi", id: "99101", avatar: "https://i.pravatar.cc/150?u=Luca",
                                hasChildren: true, isExpanded: false,
                                children: [
                                    { name: "Anna Vitale", id: "11223", avatar: "https://i.pravatar.cc/150?u=Anna" }
                                ]
                            }
                        ]
                    },
                    { name: "David Okafor", id: "77234", avatar: "https://i.pravatar.cc/150?u=David" }
                ]
            },
            {
                name: "Sophia Evans",
                id: "10293",
                teamSize: 3901,
                gv: "₹892K",
                avatar: "https://i.pravatar.cc/150?u=Sophia",
                hasChildren: true,
                isExpanded: false,
                children: [
                    { name: "James Wilson", id: "44122", avatar: "https://i.pravatar.cc/150?u=James" }
                ]
            }
        ]
    });

    const expandToLevel = (node, targetLevel) => {
        if (!node.children) return node;
        const shouldExpand = targetLevel === 'All' || node.level < parseInt(targetLevel);
        return {
            ...node,
            isExpanded: shouldExpand,
            children: node.children.map(child => expandToLevel(child, targetLevel))
        };
    };

    const handleSetVisibleLevels = (level) => {
        setVisibleLevels(level);
        setTree(expandToLevel(tree, level));
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            viewportRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const toggleNodeExpansion = (nodeId) => {
        const updateNode = (node) => {
            if (node.id === nodeId) {
                return { ...node, isExpanded: !node.isExpanded };
            }
            if (node.children) {
                return { ...node, children: node.children.map(updateNode) };
            }
            return node;
        };
        setTree(updateNode(tree));
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
    const handleResetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const getPrunedTree = (node, currentLevel, maxLevel, search) => {
        let matchesSearch = !search ||
            node.name.toLowerCase().includes(search.toLowerCase()) ||
            node.id.includes(search);

        let processedChildren = null;
        const shouldRecurse = !!search || maxLevel === 'All' || currentLevel < parseInt(maxLevel);

        if (node.children && shouldRecurse) {
            processedChildren = node.children
                .map(child => getPrunedTree(child, currentLevel + 1, maxLevel, search))
                .filter(Boolean);
        }

        const hasMatchingChild = processedChildren?.length > 0;

        if (matchesSearch) {
            return { ...node, children: processedChildren, isMatched: true, isExpanded: search ? true : node.isExpanded };
        } else if (hasMatchingChild) {
            return { ...node, children: processedChildren, isMatched: false, isExpanded: search ? true : node.isExpanded };
        }

        return null;
    };

    const displayedTree = getPrunedTree(tree, 1, visibleLevels, searchQuery);

    const views = [
        { icon: "account_tree", label: "Unilevel Tree" },
        { icon: "view_list", label: "List Directory" },
        { icon: "group_add", label: "Enrollment" },
        { icon: "analytics", label: "Analytics" }
    ];

    return (
        <div className="flex h-full overflow-hidden relative">

            {/* Left Inner Sidebar */}
            <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out absolute md:relative z-30 h-full ${isSubSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-0 md:translate-x-0 opacity-0 overflow-hidden border-none'}`}>
                <div className="p-6 min-w-[256px]">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">VIEW OPTIONS</h5>
                        <button
                            onClick={() => setSubSidebarOpen(false)}
                            className="md:hidden text-slate-400 hover:text-primary transition-all p-1"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
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
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Capacity</span>
                            <span className="text-[9px] font-bold text-[#172b4d]">12,402 / 20k</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '62%' }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Tree Area */}
            <main className="flex-1 flex flex-col relative bg-[#f1f5f9] overflow-hidden">
                {/* Tree Controls */}
                <div className="p-3 md:p-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 z-10">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setSubSidebarOpen(!isSubSidebarOpen)}
                            className={`p-2.5 md:p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500 hover:text-primary transition-all ${isSubSidebarOpen ? 'text-primary' : ''}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{isSubSidebarOpen ? 'menu_open' : 'menu'}</span>
                        </button>
                        <div className="relative flex-1 md:w-80">
                            <span className="material-symbols-outlined absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base md:text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Search Name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-xs md:text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-1 md:p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
                        {['3 Levels', '5 Levels', 'All'].map(level => (
                            <button
                                key={level}
                                onClick={() => handleSetVisibleLevels(level)}
                                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${visibleLevels === level ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {level}
                            </button>
                        ))}
                        <div className="w-px h-5 md:h-6 bg-slate-100 mx-0.5 md:mx-1"></div>
                        <button
                            onClick={handleFullscreen}
                            className="p-1.5 md:p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">fullscreen</span>
                        </button>
                    </div>
                </div>


                {/* Viewport */}
                <div
                    ref={viewportRef}
                    onMouseDown={handleMouseDown}
                    className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
                >
                    <div
                        className="absolute inset-0 p-16 md:p-32 flex justify-center items-start scroll-smooth transition-transform duration-75"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            transformOrigin: 'top center'
                        }}
                    >
                        {displayedTree ? (
                            <TreeNode
                                member={displayedTree}
                                isRoot
                                onSelect={setSelectedMember}
                                isSelected={selectedMember?.id === tree.id}
                                onToggle={toggleNodeExpansion}
                            />
                        ) : (
                            <div className="mt-20 text-center space-y-4">
                                <span className="material-symbols-outlined text-6xl text-slate-200">person_off</span>
                                <p className="text-slate-400 font-bold">No members found matching your search</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                        <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all border-b border-slate-100">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                        <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined">remove</span>
                        </button>
                    </div>
                    <button onClick={handleResetZoom} className="w-10 h-10 bg-white rounded-2xl border border-slate-200 shadow-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined">center_focus_strong</span>
                    </button>
                </div>
            </main>

            {/* Right Sidebar (Details) */}
            {selectedMember && (
                <aside className="fixed md:relative inset-y-0 right-0 w-80 md:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 z-40 animate-in slide-in-from-right duration-300 shadow-2xl md:shadow-none">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <h3 className="text-sm font-black text-[#172b4d] uppercase tracking-widest">Profile Detail</h3>
                        <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-10">
                        <div className="flex flex-col items-center text-center space-y-4 mb-10">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden mb-2">
                                <img src={selectedMember.avatar} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <h4 className="text-xl md:text-2xl font-black text-[#172b4d] tracking-tight">{selectedMember.name}</h4>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID</span>
                                <span className="text-sm font-black text-[#172b4d]">#{selectedMember.id}</span>
                            </div>
                            {selectedMember.gv && (
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">GV</span>
                                    <span className="text-sm font-black text-green-600">{selectedMember.gv}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 gap-3">
                        <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">message</span>
                            <span>Message</span>
                        </button>
                    </div>
                </aside>
            )}
        </div>
    );
}
