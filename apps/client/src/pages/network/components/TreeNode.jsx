import React from "react";
import {
  ChevronRight,
  GitBranch,
  User,
  MessageCircle,
  Lock,
  Calendar,
  Loader2,
} from "lucide-react";

// Simplified level badge colors
const TreeNode = ({
  node,
  maxDepth,
  isRoot = false,
  expandedNodes,
  loadingNodes = new Set(),
  onToggleExpand,
  onViewTree,
  onOpenModal,
}) => {
  const isLoading = loadingNodes.has(node.id);
  const hasLoadedChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  // canExpand should be true if it has children OR if it has directRefs > 0 (for lazy loading)
  const canExpand = (hasLoadedChildren || (node.directRefs > 0)) && node.level < maxDepth;

  const getLevelBadgeClass = (level) => {
    if (level === 0) return "bg-amber-500";
    if (level === 1) return "bg-blue-500";
    if (level === 2) return "bg-purple-500";
    return "bg-slate-500";
  };

  const avatarInitials = node.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-start group/node">
      <div className="relative py-4">
        {/* Horizontal connector from Left (Incoming) */}
        {!isRoot && (
          <div className="absolute left-[-16px] md:left-[-20px] top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-[16px] md:w-[20px] h-px bg-slate-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 -ml-0.5" />
          </div>
        )}

        <div
          className={`group/card bg-white border border-slate-200 rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-primary/50 hover:-translate-y-1 active:scale-[0.98] w-[42vw] md:w-[280px] shrink-0 relative z-10 overflow-hidden shadow-sm`}
          onClick={() => onOpenModal(node)}
        >
          {/* Level Accent Background */}
          <div className={`absolute top-0 left-0 w-1 md:w-1.5 h-full ${getLevelBadgeClass(node.level)} opacity-80`} />

          {/* Header Section */}
          <div className="flex items-start justify-between mb-1.5 md:mb-2 relative z-10">
            <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover/card:opacity-100 transition-opacity" />
                {node.avatar ? (
                  <img
                    src={node.avatar}
                    alt={node.name}
                    className="w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl object-cover border border-white shadow-sm transition-transform duration-500 group-hover/card:rotate-3"
                  />
                ) : (
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-[8px] md:text-sm border border-white shadow-sm">
                    {avatarInitials}
                  </div>
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3.5 md:h-3.5 rounded-full border-[1.5px] border-white z-10 shadow-sm ${node.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`}
                />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-1 mb-0.5">
                  <h3 className="font-bold text-slate-900 tracking-tight truncate text-[8px] md:text-sm group-hover/card:text-primary transition-colors">
                    {node.name}
                  </h3>
                  <span
                    className={`${getLevelBadgeClass(node.level)} px-1 py-px text-white text-[5px] md:text-[8px] font-black rounded-full uppercase tracking-wider shrink-0 leading-tight`}
                  >
                    {isRoot ? "ROOT" : `L${node.level}`}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[5px] md:text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                  <Calendar className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 shrink-0" />
                  <span className="truncate">{new Date(node.joinDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {canExpand && isRoot && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(node.id, !hasLoadedChildren);
                }}
                disabled={isLoading}
                className={`p-0.5 md:p-1 rounded-md md:rounded-lg transition-all border shrink-0 ${isExpanded ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
              >
                {isLoading ? (
                    <Loader2 className="w-3 md:w-4 h-3 md:h-4 animate-spin" />
                ) : (
                    <ChevronRight className={`w-3 md:w-4 h-3 md:h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                )}
              </button>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-0.5 md:gap-1 mb-1.5 md:mb-2 relative z-10">
            <div className="bg-slate-50/50 p-0.5 md:p-1 rounded-md md:rounded-lg border border-slate-100 text-center transition-colors group-hover/card:bg-white group-hover/card:border-slate-200">
              <p className="text-[5px] md:text-[8px] text-slate-400 font-black uppercase tracking-wide leading-tight">
                Direct
              </p>
              <p className="text-[10px] md:text-sm font-black text-slate-800 leading-tight">
                {node.directRefs}
              </p>
            </div>
            <div className="bg-slate-50/50 p-0.5 md:p-1 rounded-md md:rounded-lg border border-slate-100 text-center transition-colors group-hover/card:bg-white group-hover/card:border-slate-200">
              <p className="text-[5px] md:text-[8px] text-slate-400 font-black uppercase tracking-wide leading-tight">
                Team
              </p>
              <p className="text-[10px] md:text-sm font-black text-slate-800 leading-tight">
                {node.networkSize}
              </p>
            </div>
            <div className="bg-primary/5 p-0.5 md:p-1 rounded-md md:rounded-lg border border-primary/10 text-center group-hover/card:bg-primary/10 transition-colors">
              <p className="text-[5px] md:text-[8px] text-primary/60 font-black uppercase tracking-wide leading-tight">
                Comm
              </p>
              <p className="text-[10px] md:text-sm font-black text-primary leading-tight">
                ₹{node.earnings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-0.5 md:gap-1 relative z-10">
            {!isRoot && node.level < 6 && node.directRefs > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTree(node);
                }}
                className="flex-[1.5] py-1 md:py-1.5 bg-slate-900 text-white text-[6px] md:text-[9px] font-bold rounded-md md:rounded-lg transition-all shadow-md hover:bg-primary active:scale-95 flex items-center justify-center gap-0.5 uppercase tracking-wider overflow-hidden"
              >
                <GitBranch className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
                <span className="truncate">Downline</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(node);
              }}
              className="flex-1 py-1 md:py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[6px] md:text-[9px] font-bold rounded-md md:rounded-lg transition-all border border-slate-200 flex items-center justify-center gap-0.5 active:scale-95 shadow-sm uppercase tracking-wider overflow-hidden"
            >
              <User className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
              <span className="truncate">Profile</span>
            </button>
          </div>
        </div>

        {/* Horizontal connector to Right (Outgoing) */}
        {isExpanded && hasLoadedChildren && (
          <div className="absolute right-[-16px] md:right-[-20px] top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary -mr-0.5 z-20" />
            <div className="w-[16px] md:w-[20px] h-px bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
          </div>
        )}
      </div>

      {/* Children Container - Vertical stack on the right */}
      {isExpanded && hasLoadedChildren && (
        <div className="flex flex-col ml-[16px] md:ml-[20px] pl-[16px] md:pl-[20px] border-l border-dashed border-slate-300 space-y-0 py-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              maxDepth={maxDepth}
              expandedNodes={expandedNodes}
              loadingNodes={loadingNodes}
              onToggleExpand={onToggleExpand}
              onViewTree={onViewTree}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      )}

      {/* Depth Limit Placeholder */}
      {isExpanded && hasLoadedChildren && node.level >= maxDepth && (
        <div className="flex flex-col ml-[16px] md:ml-[20px] pl-[16px] md:pl-[20px] border-l border-dashed border-slate-300 py-4">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200 border-dashed p-5 flex items-center gap-4 max-w-sm shadow-sm group/limit hover:border-primary/40 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0 group-hover/limit:scale-110 transition-transform">
              <Lock className="w-5 md:w-6 h-5 md:h-6 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-black text-slate-800 text-xs md:text-sm tracking-tight group-hover/limit:text-primary transition-colors">
                Growth Potential
              </h5>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Focus to explore deeper
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeNode;
