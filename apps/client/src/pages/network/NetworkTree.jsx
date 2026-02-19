import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Network,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Menu,
  Home,
  ChevronRight,
  Search,
  Bell,
  UserPlus,
  AlertTriangle,
  ChevronsDown,
  ChevronsUp,
  Info,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  Table,
} from "lucide-react";
import { Link } from "react-router-dom";
import NetworkStats from "./components/NetworkStats";
import TreeNode from "./components/TreeNode";
import MemberDetailsModal from "./components/MemberDetailsModal";
import { useNetworkTree } from "../../hooks/useReferrals";

const NetworkTree = () => {
  const { data: treeData, isLoading, isError, refetch } = useNetworkTree();
  const [currentRoot, setCurrentRoot] = useState(null);
  const [maxVisibleDepth, setMaxVisibleDepth] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    if (treeData) {
      setCurrentRoot(treeData);
      setExpandedNodes(new Set([treeData.id]));
    }
  }, [treeData]);

  const handleToggleExpand = (nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = [];
    const traverse = (node) => {
      allIds.push(node.id);
      node.children?.forEach(traverse);
    };
    if (currentRoot) traverse(currentRoot);
    setExpandedNodes(new Set(allIds));
  };

  const collapseAll = () => {
    if (currentRoot) setExpandedNodes(new Set([currentRoot.id]));
  };

  const handleViewTree = (node) => {
    setCurrentRoot(node);
    setCurrentLevel(node.level);
    setMaxVisibleDepth(1);
    setExpandedNodes(new Set([node.id]));
  };

  const returnToFullTree = () => {
    setCurrentRoot(treeData);
    setCurrentLevel(0);
    setMaxVisibleDepth(1);
    setExpandedNodes(new Set([treeData.id]));
  };

  const handleOpenModal = (node) => {
    setSelectedMember(node);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !currentRoot) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to Load Network</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          There was an error fetching your network data. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-primary/10">
      {/* Ambient Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex-1 px-2 md:px-6 py-2 md:py-3 max-w-[98%] mx-auto w-full flex flex-col h-[max(100vh,800px)]">
        {/* Title Section */}
        <div className="mb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1 text-slate-400 font-medium text-[9px] uppercase tracking-wider">
                <Network className="w-2.5 h-2.5" />
                <span>Referral Tree</span>
              </div>
              <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
                My Team
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/network/my-team"
                className="flex items-center gap-1.5 px-3 py-1 bg-white text-slate-500 border border-slate-200 rounded-lg text-[10px] font-medium shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Table className="w-3 h-3 text-slate-400" />
                Show Table
              </Link>
              <button
                onClick={() => refetch()}
                className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg transition-all shadow-sm hover:bg-slate-50 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Ultra-Compact Stats Row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 py-1.5 border-y border-slate-100 mb-3 min-h-[32px]">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Total People:</span>
            <span className="text-xs font-bold text-slate-700">{treeData ? (treeData.networkSize + 1).toLocaleString() : "0"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Direct Referrals:</span>
            <span className="text-xs font-bold text-slate-700">{treeData?.directRefs || "0"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Active Members:</span>
            <span className="text-xs font-bold text-slate-700">{treeData?.activeMembers || "0"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Earnings:</span>
            <span className="text-xs font-bold text-slate-700">₹{treeData?.earnings?.toLocaleString() || "0"}</span>
          </div>
        </div>

        {/* Depth Limit Banner - Simplified */}
        {currentLevel > 0 && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-slate-900 text-lg">
                  Focused View Active
                </h3>
                <p className="text-sm text-slate-600">
                  Currently exploring <span className="text-amber-700 font-bold">{currentRoot.name}'s</span> downline.
                  Showing up to <span className="font-bold">{maxVisibleDepth} deep</span>.
                </p>
              </div>
              <button
                onClick={returnToFullTree}
                className="px-6 py-2 bg-white hover:bg-amber-100/50 text-amber-600 border border-amber-200 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
              >
                Return Home
              </button>
            </div>
          </div>
        )}

        {/* Tree Controls - Simplified Toolbar */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky top-4 z-40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={expandAll}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold transition-all border border-slate-200 active:scale-95 uppercase tracking-wide"
              >
                <ChevronsDown className="w-3.5 h-3.5 text-primary" />
                Expand
              </button>
              <button
                onClick={collapseAll}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold transition-all border border-slate-200 active:scale-95 uppercase tracking-wide"
              >
                <ChevronsUp className="w-3.5 h-3.5 text-slate-400" />
                Collapse
              </button>
              <div className="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  LVL {currentLevel} • {currentRoot.networkSize} Members
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:w-10 md:h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 text-slate-500">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex-1 md:w-10 md:h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 text-slate-500">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tree View Container - Maximized Height */}
        <div className="relative border border-slate-200 bg-white rounded-2xl p-3 md:p-6 shadow-sm overflow-auto flex-1 h-full scrollbar-hide mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div className="inline-flex min-w-full justify-start items-start py-2">
            <TreeNode
              node={currentRoot}
              maxDepth={maxVisibleDepth + currentLevel}
              isRoot={currentLevel === 0}
              expandedNodes={expandedNodes}
              onToggleExpand={handleToggleExpand}
              onViewTree={handleViewTree}
              onOpenModal={handleOpenModal}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MemberDetailsModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onViewTree={handleViewTree}
        />
      )}
    </div>
  );
};

export default NetworkTree;
