import React from "react";

const ReferralLinkCard = ({
  referralLink,
  copyToClipboard,
}) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Referral Link</h2>
          <p className="text-sm text-slate-500 mt-1">
            Invite members to your Level 1 network.
          </p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">link</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-mono text-slate-700 overflow-hidden text-ellipsis focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-hover:text-primary transition-colors">
            link
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">
            content_copy
          </span>
          Copy Link
        </button>
      </div>

     
    </div>
  );
};

export default ReferralLinkCard;
