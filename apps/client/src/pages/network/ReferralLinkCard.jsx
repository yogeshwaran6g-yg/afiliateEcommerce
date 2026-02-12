import React from "react";

const ReferralLinkCard = ({
    referralLink,
    copyToClipboard,
    totalReferrals,
    activeToday,
}) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Referral Link</h2>
            <p className="text-sm text-slate-500 mb-4 whitespace-normal">
                Invite members to your Level 1 network.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-mono text-slate-700 overflow-hidden text-ellipsis"
                />
                <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">content_copy</span>
                    Copy
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Total Referrals
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900">
                        {totalReferrals.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Active Today
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-emerald-600">
                        {activeToday}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralLinkCard;
