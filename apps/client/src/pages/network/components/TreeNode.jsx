import React from "react";
import {
  ChevronRight,
  GitBranch,
  User,
  MessageCircle,
  Lock,
  Calendar,
} from "lucide-react";

// Simplified level badge colors
const TreeNode = ({
  node,
  maxDepth,
  isRoot = false,
  expandedNodes,
  onToggleExpand,
  onViewTree,
  onOpenModal,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const canExpand = hasChildren && node.level < maxDepth;

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
          <div className="absolute left-[-24px] md:left-[-32px] top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-[24px] md:w-[32px] h-px bg-slate-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 -ml-0.5" />
          </div>
        )}

        <div
          className={`group/card bg-white border border-slate-200 rounded-2xl p-2.5 md:p-3 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-primary/50 hover:-translate-y-1 active:scale-[0.98] w-[180px] md:w-[220px] shrink-0 relative z-10 overflow-hidden shadow-sm`}
          onClick={() => onOpenModal(node)}
        >
          {/* Level Accent Background */}
          <div className={`absolute top-0 left-0 w-1.5 h-full ${getLevelBadgeClass(node.level)} opacity-80`} />

          {/* Header Section */}
          <div className="flex items-start justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover/card:opacity-100 transition-opacity" />
                {node.avatar ? (
                  <img
                    src={node.avatar}
                    alt={node.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover border-2 border-white shadow-sm transition-transform duration-500 group-hover/card:rotate-3"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs md:text-sm border-2 border-white shadow-sm">
                    {avatarInitials}
                  </div>
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 border-white z-10 shadow-sm ${node.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 tracking-tight truncate text-[11px] md:text-sm group-hover/card:text-primary transition-colors">
                    {node.name}
                  </h3>
                  <span
                    className={`${getLevelBadgeClass(node.level)} px-1.5 py-0.5 text-white text-[6px] md:text-[8px] font-black rounded-full uppercase tracking-wider`}
                  >
                    {isRoot ? "ROOT" : `LVL ${node.level}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[7px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>Joined {new Date(node.joinDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {canExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(node.id);
                }}
                className={`p-1 rounded-lg transition-all border ${isExpanded ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
              >
                <ChevronRight className={`w-3.5 md:w-4 h-3.5 md:h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
              </button>
            )}
          </div>

          {/* New Attractive Stats Section */}
          <div className="grid grid-cols-3 gap-1.5 mb-2 relative z-10">
            <div className="bg-slate-50/50 p-1 rounded-lg border border-slate-100 text-center transition-colors group-hover/card:bg-white group-hover/card:border-slate-200">
              <p className="text-[6px] md:text-[8px] text-slate-400 font-black uppercase tracking-wide mb-0.5">
                Direct
              </p>
              <p className="text-xs md:text-sm font-black text-slate-800">
                {node.directRefs}
              </p>
            </div>
            <div className="bg-slate-50/50 p-1 rounded-lg border border-slate-100 text-center transition-colors group-hover/card:bg-white group-hover/card:border-slate-200">
              <p className="text-[6px] md:text-[8px] text-slate-400 font-black uppercase tracking-wide mb-0.5">
                Network
              </p>
              <p className="text-xs md:text-sm font-black text-slate-800">
                {node.networkSize}
              </p>
            </div>
            <div className="bg-primary/5 p-1 rounded-lg border border-primary/10 text-center group-hover/card:bg-primary/10 transition-colors">
              <p className="text-[6px] md:text-[8px] text-primary/60 font-black uppercase tracking-wide mb-0.5">
                Earnings
              </p>
              <p className="text-xs md:text-sm font-black text-primary">
                ₹{node.earnings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Improved Footer Actions */}
          <div className="flex items-center gap-1.5 relative z-10">
            {!isRoot && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTree(node);
                }}
                className="flex-[1.5] py-1.5 bg-slate-900 text-white text-[8px] md:text-[9px] font-bold rounded-lg transition-all shadow-md hover:bg-primary active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider"
              >
                <GitBranch className="w-3 h-3" />
                <span>Downline</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(node);
              }}
              className="flex-1 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[8px] md:text-[9px] font-bold rounded-lg transition-all border border-slate-200 flex items-center justify-center gap-1 active:scale-95 shadow-sm uppercase tracking-wider"
            >
              <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Horizontal connector to Right (Outgoing) */}
        {isExpanded && hasChildren && (
          <div className="absolute right-[-24px] md:right-[-32px] top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary -mr-0.5 z-20" />
            <div className="w-[24px] md:w-[32px] h-px bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
          </div>
        )}
      </div>

      {/* Children Container - Vertical stack on the right */}
      {isExpanded && hasChildren && (
        <div className="flex flex-col ml-[24px] md:ml-[32px] pl-[24px] md:pl-[32px] border-l border-dashed border-slate-300 space-y-6 py-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              maxDepth={maxDepth}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onViewTree={onViewTree}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      )}

      {/* Depth Limit Placeholder */}
      {isExpanded && hasChildren && node.level >= maxDepth && (
        <div className="flex flex-col ml-[24px] md:ml-[32px] pl-[24px] md:pl-[32px] border-l border-dashed border-slate-300 py-4">
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
