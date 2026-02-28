import React from "react";
import { useDirectReferrals } from "../../hooks/useReferral";
import { useUser } from "../../hooks/useAuthService";
import ReferralLinkCard from "./ReferralLinkCard";
import QRCodeCard from "./QRCodeCard";
import ReferralTable from "./ReferralTable";
import Skeleton from "../../components/ui/Skeleton";

const DirectReferrals = () => {
  const { data: user } = useUser();
  const [page, setPage] = React.useState(1);
  const limit = 9;

  const { data, isLoading, error, refetch } = useDirectReferrals(page, limit);

  const referralId = user?.referral_id || "LOADING...";
  const referralLink = `${window.location.origin}/signup?ref=${referralId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
  };

  // Full page loading handled by skeletons inside the layout

  if (error) {
    if (error?.response?.status === 403) {
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <span className="material-symbols-outlined text-amber-500 text-4xl">
                lock
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              Activation Required
            </h2>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              You must activate your account by purchasing an activation package before you can view and manage direct referrals.
            </p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 active:scale-95 w-full"
            >
              Activate Account Now
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-500 text-4xl">
              error
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Failed to load referrals
          </h2>
          <p className="text-slate-500 mb-6 font-medium">
            There was an error fetching your referral information. This could be
            due to a connection issue or a temporary server error.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
            >
              Retry Connection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const referrals = data?.referrals || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };


  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Direct Referrals
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">
            Manage and monitor your personal network growth.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-8">
              <Skeleton width="40%" height="20px" className="mb-4" />
              <div className="flex gap-4">
                <Skeleton width="100%" height="48px" className="rounded-xl" />
                <Skeleton width="48px" height="48px" className="rounded-xl" />
              </div>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col items-center">
              <Skeleton width="120px" height="120px" className="rounded-xl mb-4" />
              <Skeleton width="60%" height="16px" />
            </div>
          </>
        ) : (
          <>
            <ReferralLinkCard
              referralLink={referralLink}
              copyToClipboard={copyToClipboard}
            />
            <QRCodeCard referralLink={referralLink} />
          </>
        )}
      </div>

      <ReferralTable referrals={referrals} pagination={pagination} onPageChange={setPage} isLoading={isLoading} />
    </div>
  );
};

export default DirectReferrals;
