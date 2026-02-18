import React from "react";
import {
  ChevronRight,
  GitBranch,
  User,
  MessageCircle,
  Lock,
} from "lucide-react";

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

  // Level-based configuration for ultra-responsiveness
  const config = {
    root: {
      padding: "p-4 md:p-6",
      avatar: "w-12 h-12 md:w-16 md:h-16",
      title: "text-lg md:text-xl",
      gap: "gap-4",
      stats: "grid-cols-3",
      width: "max-w-md",
      connectorOffset: "left-[31px]",
      childPadding: "pl-8 md:pl-12",
      childMargin: "ml-[31px]",
    },
    lv1: {
      padding: "p-3 md:p-5",
      avatar: "w-10 h-10 md:w-14 md:h-14",
      title: "text-base md:text-lg",
      gap: "gap-3",
      stats: "grid-cols-3",
      width: "max-w-sm md:max-w-md",
      connectorOffset: "left-[23px] md:left-[31px]",
      childPadding: "pl-6 md:pl-12",
      childMargin: "ml-[23px] md:ml-[31px]",
    },
    lv2: {
      padding: "p-2.5 md:p-4",
      avatar: "w-9 h-9 md:w-12 md:h-12",
      title: "text-sm md:text-base",
      gap: "gap-2",
      stats: "grid-cols-3",
      width: "max-w-xs md:max-w-sm",
      connectorOffset: "left-[21px] md:left-[31px]",
      childPadding: "pl-4 md:pl-12",
      childMargin: "ml-[21px] md:ml-[31px]",
    },
    lvN: {
      padding: "p-2 md:p-3",
      avatar: "w-8 h-8 md:w-10 md:h-10",
      title: "text-xs md:text-sm",
      gap: "gap-2",
      stats: "flex flex-wrap gap-2",
      width: "max-w-[280px] md:max-w-xs",
      connectorOffset: "left-[19px] md:left-[31px]",
      childPadding: "pl-3 md:pl-6",
      childMargin: "ml-[19px] md:ml-[31px]",
    },
  };

  const c = isRoot
    ? config.root
    : node.level === 1
      ? config.lv1
      : node.level === 2
        ? config.lv2
        : config.lvN;

  const levelBadgeClass = `bg-gradient-to-r ${
    node.level === 0
      ? "from-amber-400 to-orange-500"
      : node.level === 1
        ? "from-blue-500 to-blue-600"
        : node.level === 2
          ? "from-purple-500 to-purple-600"
          : "from-slate-400 to-slate-500"
  }`;

  const borderClass = isRoot
    ? "border-slate-200 hover:border-primary/50 shadow-blue-100/50"
    : node.level === 1
      ? "border-blue-100 hover:border-blue-200 shadow-blue-50/50"
      : node.level === 2
        ? "border-purple-100 hover:border-purple-200 shadow-purple-50/50"
        : "border-slate-100 hover:border-slate-200 shadow-slate-50/50";

  const glowClass = isExpanded ? "shadow-md ring-2 ring-primary/5" : "shadow-sm";

  const avatarInitials = node.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  return (
    <div className={`relative ${isRoot ? "" : "mt-4 md:mt-6"}`}>
      {!isRoot && (
        <>
          <div
            className={`absolute ${c.connectorOffset} top-[-16px] md:top-[-24px] w-[1.5px] md:h-[24px] h-[16px] bg-slate-200/80`}
          />
          <div
            className={`absolute ${c.connectorOffset} top-[24px] md:top-[31px] w-[16px] md:w-[24px] h-[1.5px] bg-slate-200/80`}
          />
        </>
      )}

      <div className="flex flex-col">
        <div
          className={`bg-white rounded-2xl md:rounded-3xl border ${borderClass} ${glowClass} ${c.padding} cursor-pointer transition-all hover:bg-slate-50 hover:shadow-lg active:scale-[0.99] ${c.width}`}
          onClick={() => onOpenModal(node)}
        >
          {/* View 1 & 2: Avatar & Profile Info (Name, Level, Date) */}
          <div className={`flex items-start justify-between ${node.level <= 2 ? "mb-3 md:mb-5" : "mb-2"}`}>
            <div className={`flex items-center ${c.gap} flex-1 min-w-0`}>
              <div className="relative shrink-0">
                {node.avatar ? (
                  <img
                    src={node.avatar}
                    alt={node.name}
                    className={`${c.avatar} rounded-xl md:rounded-2xl object-cover border-2 ${
                      isRoot
                        ? "border-amber-100"
                        : node.level === 1
                          ? "border-blue-100"
                          : node.level === 2
                            ? "border-purple-100"
                            : "border-slate-100"
                    }`}
                  />
                ) : (
                  <div
                    className={`${c.avatar} rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold ${node.level > 2 ? "text-xs" : "text-sm md:text-xl"}`}
                  >
                    {avatarInitials}
                  </div>
                )}
                {node.level <= 3 && (
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 md:border-[3px] border-white ${node.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <h3 className={`font-bold text-slate-900 truncate ${c.title}`}>
                    {node.name}
                  </h3>
                  <span
                    className={`${levelBadgeClass} px-1.5 py-0.5 text-white text-[8px] md:text-[10px] font-black rounded-md md:rounded-lg shadow-sm whitespace-nowrap`}
                  >
                    {isRoot ? "ROOT" : `LVL ${node.level}`}
                  </span>
                </div>
                <p className="text-[9px] md:text-xs text-slate-400 font-medium">
                  {new Date(node.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Action 1: Expand Toggle (View 6 part A) */}
            {canExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(node.id);
                }}
                className={`p-1.5 md:p-2 bg-slate-50 hover:bg-slate-100 rounded-lg md:rounded-xl transition-all border border-slate-100 ${isExpanded ? "rotate-90" : ""}`}
              >
                <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Views 3, 4, 5: Direct, Network, Earnings Stats */}
          <div className={`${node.level <= 2 ? "grid" : ""} ${c.stats} mb-3 md:mb-5`}>
            {/* View 3: Direct */}
            <div className="bg-slate-50/50 p-1.5 md:p-2.5 rounded-lg md:rounded-2xl text-center border border-slate-100/50 flex-1 min-w-[60px]">
              <p className="text-[7px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Direct
              </p>
              <p className="text-xs md:text-sm font-black text-slate-800">
                {node.directRefs}
              </p>
            </div>
            {/* View 4: Network */}
            <div className="bg-slate-50/50 p-1.5 md:p-2.5 rounded-lg md:rounded-2xl text-center border border-slate-100/50 flex-1 min-w-[60px]">
              <p className="text-[7px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Network
              </p>
              <p className="text-xs md:text-sm font-black text-slate-800">
                {node.networkSize}
              </p>
            </div>
            {/* View 5: Earnings (INR) */}
            <div className="bg-primary/5 p-1.5 md:p-2.5 rounded-lg md:rounded-2xl text-center border border-primary/10 flex-1 min-w-[70px]">
              <p className="text-[7px] md:text-[9px] text-primary/70 font-bold uppercase tracking-wider mb-0.5">
                Earnings
              </p>
              <p className="text-xs md:text-sm font-black text-primary">
                ₹{node.earnings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* View 6 part B: Footer Actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {!isRoot && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTree(node);
                }}
                className="flex-[2] px-3 py-1.5 md:py-2.5 bg-primary text-white text-[10px] md:text-xs font-bold rounded-lg md:rounded-xl transition-all shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-1.5 hover:shadow-lg active:scale-95"
              >
                <GitBranch className="w-3 md:w-3.5 h-3 md:h-3.5" />
                <span className="hidden xs:inline">View Tree</span>
                <span className="xs:hidden">Tree</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(node);
              }}
              className={`flex-1 px-3 py-1.5 md:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] md:text-xs font-bold rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${isRoot ? "w-full" : ""}`}
            >
              <User className="w-3 md:w-3.5 h-3 md:h-3.5" />
              <span className={isRoot || node.level <= 2 ? "" : "hidden"}>
                {isRoot ? "Root Details" : "Details"}
              </span>
            </button>
            {isRoot && (
              <button className="p-1.5 md:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg md:rounded-xl transition-all">
                <MessageCircle className="w-3.5 md:w-4 h-3.5 md:h-4" />
              </button>
            )}
          </div>
        </div>


        {/* Children Render */}
        {isExpanded && hasChildren && (
          <div className={`${c.childPadding} border-l-2 border-slate-200/50 ${c.childMargin} mt-4 md:mt-6 space-y-4 md:space-y-6 relative`}>
            {/* Horizontal join line indicator at dropdown arrow level */}
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
          <div className={`${c.childPadding} ${c.childMargin} mt-4 md:mt-6`}>
            <div className="bg-slate-50 rounded-2xl md:rounded-[32px] border border-slate-200 border-dashed p-4 md:p-6 flex items-center gap-3 md:gap-4 max-w-sm">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0">
                <Lock className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-700 text-sm md:text-base">
                  Deeper Levels Locked
                </h5>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                  Click "View Tree" on this member to explore further
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TreeNode;
