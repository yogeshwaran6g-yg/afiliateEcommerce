import React, { useState, useContext } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../hooks/useAuthService";

export default function Settings() {
    const navigate = useNavigate();
    const { user } = useContext(ProfileContext);
    const forgotPasswordMutation = useForgotPasswordMutation();


    const handleResetPassword = async () => {
        navigate("/reset-password", {
            state: {
                isUpdate: true,
            },
        });
    };

    return (
        <div className="px-4 md:px-8 py-4 md:py-8 max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 mb-6">
                <a href="/dashboard" className="hover:text-primary transition-colors">
                    Dashboard
                </a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-slate-900 dark:text-slate-300 font-medium tracking-tight">Settings</span>
            </div>

            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Account Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Manage your account security and update your password.
                </p>
            </div>


            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center dark:bg-rose-900/20 dark:text-rose-400">
                            <span className="material-symbols-outlined text-2xl">security</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Account Security</h3>
                            <p className="text-sm text-slate-500 max-w-md mt-1">
                                Keep your account secure by updating your password regularly. We'll send a code to your phone.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleResetPassword}
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 relative z-10"
                    >
                        {forgotPasswordMutation.isPending ? (
                            <>
                                <div className="size-4 border-2 border-slate-300 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">lock_reset</span>
                                <span>Update Password</span>
                            </>
                        )}
                    </button>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-rose-50/30 dark:bg-rose-900/10 size-64 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </div>

            <footer className="mt-20 py-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
                    <div>© 2024 Affiliate Ecommerce. Dashboard Settings v1.0</div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Security</a>
                        <a href="#" className="hover:text-primary transition-colors">Help</a>
                    </div>
                </div>
            </footer>
        </div >
    );
}
