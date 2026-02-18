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
  const [maxVisibleDepth, setMaxVisibleDepth] = useState(6);
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
    setMaxVisibleDepth(6 - node.level);
    setExpandedNodes(new Set([node.id]));
  };

  const returnToFullTree = () => {
    setCurrentRoot(treeData);
    setCurrentLevel(0);
    setMaxVisibleDepth(6);
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
    <div className="min-h-screen bg-slate-50 font-display">
      <div className="flex-1 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Home className="w-3 h-3" />
            <span>Network</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">
              {currentLevel === 0
                ? "Full Tree View"
                : `${currentRoot.name}'s Tree`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Referral Network
            </h2>
            <div className="flex items-center gap-3">
              <Link
                to="/network/my-team"
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95"
              >
                <Table className="w-4 h-4" />
                Table View
              </Link>
              <button 
                onClick={() => refetch()}
                className="p-2.5 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 text-slate-500 shadow-sm active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        

        {/* Depth Limit Banner */}
        {currentLevel > 0 && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-3xl p-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">
                  Viewing Limited Depth
                </h3>
                <p className="text-sm text-slate-600">
                  You're viewing {currentRoot.name}'s downline -{" "}
                  {maxVisibleDepth} levels visible (6-level limit from your
                  position)
                </p>
              </div>
              <button
                onClick={returnToFullTree}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-amber-600 border border-amber-200 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
              >
                Return to Full Tree
              </button>
            </div>
          </div>
        )}

        {/* Tree Controls */}
        <div className="mb-6 bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={expandAll}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-all border border-slate-200"
              >
                <ChevronsDown className="w-4 h-4" />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-all border border-slate-200"
              >
                <ChevronsUp className="w-4 h-4" />
                Collapse All
              </button>
              <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>
              <div className="flex items-center gap-2 group relative">
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl flex items-center gap-2">
                  <span className="text-sm font-bold">
                    Level {currentLevel} of 6
                  </span>
                  <Info className="w-4 h-4 cursor-help" />
                </div>
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all absolute top-full left-0 mt-2 w-72 bg-white shadow-xl rounded-2xl p-4 text-xs text-slate-600 z-50 border border-slate-100 leading-relaxed">
                  You can view up to 6 levels deep from your position. When
                  viewing a member's tree, the total depth from your account
                  cannot exceed 6 levels.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 text-slate-500">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 text-slate-500">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tree View Container */}
        <div className="bg-white rounded-[32px] p-4 md:p-12 shadow-sm border border-slate-200 overflow-auto max-h-[85vh] scrollbar-hide">
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
