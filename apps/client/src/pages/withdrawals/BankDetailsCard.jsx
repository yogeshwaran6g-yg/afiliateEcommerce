import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "../../components/ui/Skeleton";

const BankDetailsCard = ({ profile, isLoading, status }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton width="180px" height="24px" />
                    <Skeleton width="80px" height="20px" className="rounded-full" />
                </div>
                <div className="border-2 border-slate-100 bg-slate-50/30 rounded-xl p-6 mb-4 space-y-4">
                    <div className="space-y-2">
                        <Skeleton width="120px" height="18px" />
                        <Skeleton width="200px" height="28px" />
                        <Skeleton width="150px" height="20px" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div className="space-y-2">
                            <Skeleton width="60px" height="12px" />
                            <Skeleton width="100px" height="16px" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton width="80px" height="12px" />
                            <Skeleton width="120px" height="16px" />
                        </div>
                    </div>
                </div>
                <Skeleton width="100%" height="44px" className="rounded-lg" />
            </div>
        );
    }

    const hasBankDetails = profile?.bank_name && profile?.bank_account_number;
    const isVerified = status === 'VERIFIED';
    const isPending = status === 'PENDING';
    const isRejected = status === 'REJECTED';

    const getStatusStyles = () => {
        if (isVerified) return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (isPending) return "bg-blue-100 text-blue-700 border-blue-200";
        if (isRejected) return "bg-red-100 text-red-700 border-red-200";
        return "bg-slate-100 text-slate-600 border-slate-200";
    };

    const maskAccountNumber = (number) => {
        if (!number) return "";
        const str = String(number);
        if (str.length < 4) return str;
        return "**** **** **** " + str.slice(-4);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                        account_balance
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                        Linked Bank Account
                    </h2>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyles()}`}>
                    {status?.replace('_', ' ') || 'NOT LINKED'}
                </div>
            </div>

            {hasBankDetails ? (
                <div className={`border-2 ${isVerified ? 'border-dashed border-slate-200' : 'border-slate-100 bg-slate-50/30'} rounded-xl p-6 mb-4`}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2 inline-block">
                                PRIMARY ACCOUNT
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                                {profile.bank_name}
                            </h3>
                            <div className="text-slate-500 font-mono">
                                {maskAccountNumber(profile.bank_account_number)}
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isVerified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            <span className="material-symbols-outlined">
                                {isVerified ? 'check' : 'schedule'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                IFSC Code
                            </div>
                            <div className="font-semibold text-slate-900">{profile.bank_ifsc || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                Holder Name
                            </div>
                            <div className="font-semibold text-slate-900">{profile.bank_account_name || "N/A"}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 mb-4 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-slate-400 text-3xl">
                            add_card
                        </span>
                    </div>
                    <h3 className="text-slate-900 font-bold mb-2">No Bank Account Linked</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-[240px] mx-auto">
                        Please provide your bank details in the profile section to enable withdrawals.
                    </p>
                    <Link
                        to="/profile"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all text-sm shadow-sm"
                    >
                        <span className="material-symbols-outlined text-lg">link</span>
                        Link Bank Account
                    </Link>
                </div>
            )}

            {!isVerified && hasBankDetails && (
                <div className={`p-4 rounded-lg mb-4 text-xs font-medium flex items-start gap-3 ${isRejected ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    <span className="material-symbols-outlined text-lg">
                        {isRejected ? 'error' : 'info'}
                    </span>
                    <div>
                        <p className="font-bold mb-1">
                            {isPending ? 'Verification in Progress' : isRejected ? 'Verification Rejected' : 'Action Required'}
                        </p>
                        <p className="opacity-80">
                            {isPending
                                ? 'Our team is reviewing your bank details. Withdrawals will be enabled once verified.'
                                : isRejected
                                    ? 'Your bank verification was rejected. Please update your details with a valid proof.'
                                    : 'Please complete your bank KYC in the profile section to unlock withdrawals.'}
                        </p>
                        {(isRejected || !isPending) && (
                            <Link to="/profile" className="inline-block mt-2 font-bold underline">
                                Go to Profile
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {hasBankDetails && (
                <Link
                    to="/profile"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 mb-4 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">
                        {isVerified ? 'edit' : 'settings'}
                    </span>
                    {isVerified ? 'Update Bank Information' : 'Manage Bank KYC'}
                </Link>
            )}

            <p className="text-xs text-slate-500 italic">
                Transfers to this account are usually processed within 24-48 business
                hours. Security protocols apply.
            </p>
        </div>
    );
};

export default BankDetailsCard;
