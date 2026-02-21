import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApiService from "../services/userApiService";

const ReferralLink = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const clientUrl = import.meta.env.VITE_CLIENT_URL || "http://localhost:5174";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const data = await userApiService.getUserDetails(userId);
                setUser(data);
            } catch (err) {
                toast.error("Failed to fetch user details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const referralLink = `${clientUrl}/signup?ref=${user?.referral_id || ""}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Generating Link...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center text-slate-500">
                User not found.
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <button onClick={() => navigate("/users")} className="hover:text-primary transition-colors">Users</button>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <button onClick={() => navigate(`/users/${userId}`)} className="hover:text-primary transition-colors">User Details</button>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary font-bold">Referral Link</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Referral Link</h2>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Share this link to invite new users under {user.name}.</p>
                </div>

                <button
                    onClick={() => navigate(`/users/${userId}`)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 text-sm font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 group leading-none"
                >
                    <span className="material-symbols-outlined font-bold text-primary">arrow_back</span>
                    <span>Back to Profile</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8 md:p-12 space-y-10">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-2">
                        <span className="material-symbols-outlined text-4xl font-bold">link</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-800">{user.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">UID: {user.referral_id}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unique Signup Link</label>
                        <div className="relative group">
                            <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 pr-[140px] text-sm font-bold text-slate-600 break-all min-h-[64px] flex items-center">
                                {referralLink}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${copied ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90'}`}
                            >
                                {copied ? (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        <span>Copied!</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm font-bold">content_copy</span>
                                        <span>Copy Link</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                            <span className="material-symbols-outlined text-xl">info</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-amber-800">Important Note</p>
                            <p className="text-[11px] text-amber-600/80 font-medium leading-relaxed">This link will automatically attribute new signups to {user.name}. Ensure the user knows their referral code: <span className="font-bold underline">{user.referral_id}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralLink;
