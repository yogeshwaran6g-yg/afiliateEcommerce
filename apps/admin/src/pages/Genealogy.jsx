import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers, useUserReferralOverview, useTeamMembers } from "../hooks/useUserService";
import AdminLevelTabs from "../components/network/AdminLevelTabs";
import AdminMemberTable from "../components/network/AdminMemberTable";
import UserSearchBar from "../components/network/UserSearchBar";
import NetworkSummary from "../components/network/NetworkSummary";

export default function Genealogy() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeLevel, setActiveLevel] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

    const { data: allUsers = [], isLoading: isLoadingUsers } = useUsers();
    
    // Derived state: selected user based on URL param
    const selectedUser = userId ? allUsers.find(u => u.dbId === parseInt(userId) || u.id === userId) : null;

    const { data: referralOverview, isLoading: isOverviewLoading } = useUserReferralOverview(selectedUser?.dbId);
    
    const { 
        data: teamData, 
        isLoading: isTeamLoading, 
        error: teamError 
    } = useTeamMembers(selectedUser?.dbId, activeLevel, pagination.page, pagination.limit);

    const teamMembers = teamData?.members || [];
    const serverPagination = teamData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

    const handleUserSelect = (user) => {
        navigate(`/genealogy/${user.dbId}`);
        setActiveLevel(1);
        setPagination({ page: 1, limit: 10 });
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-8 bg-slate-50/30 min-h-screen font-display">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Network</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">Explore and analyze team referral networks and performance.</p>
                </div>

                <UserSearchBar 
                    allUsers={allUsers} 
                    isLoadingUsers={isLoadingUsers} 
                    onUserSelect={handleUserSelect} 
                />
            </div>

            {selectedUser ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <NetworkSummary 
                        selectedUser={selectedUser} 
                        referralOverview={referralOverview} 
                    />

                    {/* Team Explorer Table Section */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/30 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Level Explorer</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Explore your team depth and performance.</p>
                        </div>
                        
                        <AdminLevelTabs
                            levels={referralOverview?.levels?.map(l => ({ level: l.level, count: l.referralCount })) || []}
                            activeLevel={activeLevel}
                            setActiveLevel={(lvl) => {
                                setActiveLevel(lvl);
                                setPagination({ ...pagination, page: 1 });
                            }}
                        />

                        <AdminMemberTable
                            members={teamMembers}
                            isLoading={isTeamLoading}
                            error={teamError}
                            pagination={serverPagination}
                            onPageChange={(p) => setPagination({ ...pagination, page: p })}
                            onLimitChange={(l) => setPagination({ ...pagination, limit: l, page: 1 })}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 animate-in fade-in duration-1000">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:bg-primary/30 transition-all duration-500"></div>
                        <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white border border-slate-100 rounded-[3rem] shadow-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl md:text-8xl text-primary animate-pulse">hub</span>
                        </div>
                    </div>
                    <div className="text-center space-y-3 max-w-sm">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Select a Network Root</h3>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-widest">Use the search bar above to select a distributor and visualize their entire downline network performance.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

