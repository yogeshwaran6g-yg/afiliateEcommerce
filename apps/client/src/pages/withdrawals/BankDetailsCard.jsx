import React from "react";
import { Link } from "react-router-dom";

const BankDetailsCard = ({ profile, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div className="h-32 bg-slate-100 rounded-xl mb-4"></div>
                <div className="h-10 bg-slate-200 rounded-lg"></div>
            </div>
        );
    }

    const hasBankDetails = profile?.bank_name && profile?.bank_account_number;

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
                {hasBankDetails && (
                    <Link
                        to="/profile"
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        Manage Account
                    </Link>
                )}
            </div>

            {hasBankDetails ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 mb-4">
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
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600">
                                check
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

            {hasBankDetails && (
                <Link
                    to="/profile"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 mb-4 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Update Bank Information
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
