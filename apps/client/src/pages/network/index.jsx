import React, { useState } from "react";
import { Link } from "react-router-dom";
import NetworkHeader from "./NetworkHeader";
import LevelTabs from "./LevelTabs";
import MemberTable from "./MemberTable";
import NetworkFooter from "./NetworkFooter";
import { useReferralOverview, useTeamMembers } from "../../hooks/useReferrals";

export default function Network() {
  const [activeLevel, setActiveLevel] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { 
    data: overviewData, 
    isLoading: isOverviewLoading,
    error: overviewError 
  } = useReferralOverview();

  const { 
    data: teamData, 
    isLoading: isTeamLoading, 
    error: teamError,
    isPreviousData
  } = useTeamMembers(activeLevel, page, limit);

  const handleLevelChange = (level) => {
    setActiveLevel(level);
    setPage(1);
  };

  const levels = overviewData?.levels || [
    { level: 1, referralCount: 0 },
    { level: 2, referralCount: 0 },
    { level: 3, referralCount: 0 },
    { level: 4, referralCount: 0 },
    { level: 5, referralCount: 0 },
    { level: 6, referralCount: 0 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <NetworkHeader />

      <div className="flex justify-end gap-3">
        <Link
          to="/network/tree"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">
            account_tree
          </span>
          Tree View
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <LevelTabs
          levels={levels.map(l => ({ level: l.level, count: l.referralCount }))}
          activeLevel={activeLevel}
          setActiveLevel={handleLevelChange}
        />
        <MemberTable 
          members={teamData?.members || []} 
          isLoading={isTeamLoading}
          error={teamError}
          pagination={teamData?.pagination}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
        <NetworkFooter />
      </div>
    </div>
  );
}
