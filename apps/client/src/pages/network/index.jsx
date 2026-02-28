import React, { useState } from "react";
import { Link } from "react-router-dom";
import NetworkHeader from "./NetworkHeader";
import LevelTabs from "./LevelTabs";
import MemberTable from "./MemberTable";

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

  if (overviewError?.response?.status === 403) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <span className="material-symbols-outlined text-amber-500 text-4xl">
              lock
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            Feature Locked
          </h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            You must activate your account to unlock network building features and monitor your downline overview.
          </p>
          <button
            onClick={() => window.location.href = '/shop'}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 active:scale-95 w-full"
          >
            Activate Account To Unlock
          </button>
        </div>
      </div>
    );
  }

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

      </div>
    </div>
  );
}
