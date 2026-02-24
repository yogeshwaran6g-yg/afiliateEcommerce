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
import referralService from "../../services/referralService";

const NetworkTree = () => {
  const { data: initialData, isLoading: initialLoading, isError, refetch } = useNetworkTree(null, 1);
  const [currentRoot, setCurrentRoot] = useState(null);
  const [viewPath, setViewPath] = useState([]); // Array of {id, name, node}
  const [maxVisibleDepth] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loadingNodes, setLoadingNodes] = useState(new Set());

  useEffect(() => {
    if (initialData && viewPath.length === 0) {
      setCurrentRoot(initialData);
      setExpandedNodes(new Set([initialData.id]));
    }
  }, [initialData, viewPath]);

  const handleToggleExpand = async (nodeId, shouldFetch = false) => {
    // Only the current root should be expanded in the drill-down view
    if (nodeId !== currentRoot?.id) return;

    if (shouldFetch) {
      setLoadingNodes((prev) => new Set(prev).add(nodeId));
      try {
        const response = await referralService.getNetworkTree(nodeId, 1);
        const subTree = response?.data || response;
        if (subTree) {
          setCurrentRoot(subTree);
        }
      } catch (error) {
        console.error("Failed to fetch sub-tree:", error);
      } finally {
        setLoadingNodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(nodeId);
          return newSet;
        });
      }
    }
    setExpandedNodes(new Set([nodeId]));
  };

  const handleViewTree = async (node) => {
    // Move current root to view path
    setViewPath((prev) => [...prev, currentRoot]);
    
    setLoadingNodes((prev) => new Set(prev).add(node.id));
    try {
      // Fetch directs for the selected node
      const response = await referralService.getNetworkTree(node.id, 1);
      const subTree = response?.data || response;
      if (subTree) {
        setCurrentRoot(subTree);
        setExpandedNodes(new Set([subTree.id]));
      }
    } catch (error) {
      console.error("Failed to fetch downline:", error);
    } finally {
      setLoadingNodes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
    }
  };

  const navigateBack = (index) => {
    if (index === -1) {
      setCurrentRoot(initialData);
      setViewPath([]);
      setExpandedNodes(new Set([initialData.id]));
    } else {
      const newPath = viewPath.slice(0, index);
      const targetNode = viewPath[index];
      setCurrentRoot(targetNode);
      setViewPath(newPath);
      setExpandedNodes(new Set([targetNode.id]));
    }
  };

  const returnToFullTree = () => {
    setCurrentRoot(initialData);
    setViewPath([]);
    setExpandedNodes(new Set([initialData.id]));
  };

  const handleOpenModal = (node) => {
    setSelectedMember(node);
    setIsModalOpen(true);
  };

  if (initialLoading) {
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
                <RefreshCw className={`w-3.5 h-3.5 ${initialLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs Navigation */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => navigateBack(-1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${viewPath.length === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Home className="w-3.5 h-3.5" />
            My Network
          </button>
          
          {viewPath.map((node, index) => (
            <React.Fragment key={node.id}>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              <button
                onClick={() => navigateBack(index)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-500 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all whitespace-nowrap"
              >
                {node.name}
              </button>
            </React.Fragment>
          ))}

          {viewPath.length > 0 && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold whitespace-nowrap">
                {currentRoot.name}
              </div>
            </>
          )}
        </div>

        {/* Ultra-Compact Stats Row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 py-1.5 border-y border-slate-100 mb-3 min-h-[32px]">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Total People:</span>
            <span className="text-xs font-bold text-slate-700">{initialData ? (initialData.networkSize + 1).toLocaleString() : "0"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Direct Referrals:</span>
            <span className="text-xs font-bold text-slate-700">{initialData?.directRefs || "0"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Active Members:</span>
            <span className="text-xs font-bold text-slate-700">{initialData?.activeMembers || "0"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Commission:</span>
            <span className="text-xs font-bold text-slate-700">₹{initialData?.earnings?.toLocaleString() || "0"}</span>
          </div>
        </div>

        {/* Depth Limit Banner - Simplified */}
        {viewPath.length > 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600">
                  Exploring <span className="text-amber-700 font-bold">{currentRoot.name}'s</span> downline.
                  Currently at <span className="font-bold text-amber-700">Level {currentRoot.level}</span>.
                </p>
              </div>
              <button
                onClick={returnToFullTree}
                className="px-3 py-1 bg-white hover:bg-amber-100/50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold transition-all shadow-sm active:scale-95"
              >
                Return to Root
              </button>
            </div>
          </div>
        )}

        {/* Simplified Toolbar */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-lg border border-primary/10">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Showing {currentRoot.directRefs} Direct Referrals
              </span>
            </div>
            {loadingNodes.size > 0 && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg transition-all shadow-sm hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg transition-all shadow-sm hover:bg-slate-50">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree View Container - Maximized Height */}
        <div className="relative border border-slate-200 bg-white rounded-2xl p-3 md:p-6 shadow-sm overflow-auto flex-1 h-full scrollbar-hide mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div className="inline-flex min-w-full justify-start items-start py-2">
    <TreeNode
      node={currentRoot}
      maxDepth={maxVisibleDepth}
      isRoot={true}
      expandedNodes={expandedNodes}
      loadingNodes={loadingNodes}
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
