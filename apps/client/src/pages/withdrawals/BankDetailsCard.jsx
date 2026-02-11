import React from "react";

const BankDetailsCard = () => {
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
                <a
                    href="#"
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    Manage Accounts
                </a>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 mb-4">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2 inline-block">
                            PRIMARY ACCOUNT
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                            Chase Manhattan Bank
                        </h3>
                        <div className="text-slate-500 font-mono">**** **** **** 5678</div>
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
                            SWIFT / BIC
                        </div>
                        <div className="font-semibold text-slate-900">CHASEUS33</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Holder Name
                        </div>
                        <div className="font-semibold text-slate-900">Alex Thompson</div>
                    </div>
                </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 mb-4">
                <span className="material-symbols-outlined text-lg">edit</span>
                Update Bank Information
            </button>

            <p className="text-xs text-slate-500 italic">
                Transfers to this account are usually processed within 24-48 business
                hours. Security protocols apply.
            </p>
        </div>
    );
};

export default BankDetailsCard;
