import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApiService from "../services/userApiService";

export default function UserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('WALLET');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);

    useEffect(() => {
        if (userId) {
            window.scrollTo(0, 0);
            fetchUserDetails();
        }
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const data = await userApiService.getUserDetails(userId);
            setUser(data);
            setEditData({
                name: data.name,
                email: data.email,
                phone: data.phone
            });
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load user details");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await userApiService.updateUser(userId, editData);
            setUser(prev => ({ ...prev, ...editData }));
            setIsEditing(false);
            // Optional: Show success toast
        } catch (err) {
            alert(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleBlockToggle = async () => {
        try {
            const action = user.is_blocked ? 'unblock' : 'block';
            if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

            setIsBlocking(true);
            const updatedStatus = !user.is_blocked;
            await userApiService.updateUser(userId, { is_blocked: updatedStatus });
            setUser(prev => ({ ...prev, is_blocked: updatedStatus }));
        } catch (err) {
            alert(err.message || "Failed to update block status");
        } finally {
            setIsBlocking(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Subject Identification in Progress</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-red-500/5 max-w-2xl mx-auto space-y-8">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-5xl">warning</span>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-[#172b4d] tracking-tighter">Subject Not Located</h3>
                        <p className="font-medium text-slate-500 text-lg leading-relaxed px-12">{error || "The requested user profile does not exist or has been purged from the active registry."}</p>
                    </div>
                    <button
                        onClick={() => navigate('/users')}
                        className="w-full py-5 bg-[#172b4d] text-white rounded-3xl font-black text-sm hover:shadow-2xl hover:shadow-[#172b4d]/20 transition-all active:scale-[0.98]"
                    >
                        RETURN TO MASTER REGISTRY
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-slate-50/50">
            <div className="max-w-[1600px] mx-auto space-y-12">

                {/* Global Back Header */}
                <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={() => navigate('/users')}
                        className="group flex items-center gap-4 pl-2 pr-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </div>
                        <span className="text-xs font-black text-slate-500 group-hover:text-[#172b4d] uppercase tracking-widest transition-colors">Registry</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Identity Verified</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT PANEL: Identity Summary */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6 animate-in slide-in-from-left-8 duration-700">
                        {/* Identity Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>

                            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-primary-light p-1 rounded-3xl shadow-xl shadow-primary/10">
                                        <div className="w-full h-full bg-white rounded-[1.3rem] flex items-center justify-center font-black text-3xl text-primary">
                                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                                        <span className="material-symbols-outlined text-sm font-black">verified</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center text-xl font-black text-[#172b4d] focus:outline-none focus:border-primary/50"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-black text-[#172b4d] tracking-tight">{user.name}</h2>
                                    )}
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">ID: WD-{user.id.toString().padStart(6, '0')}</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${user.account_activation_status === 'ACTIVATED' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {user.account_activation_status}
                                    </span>
                                    {user.is_blocked && (
                                        <span className="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest bg-red-50 text-red-600">
                                            RESTRICTED
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 space-y-3 border-t border-slate-50 pt-8">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment</p>
                                    <p className="text-[10px] font-black text-slate-600">{new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                                    <span className="px-2 py-0.5 bg-slate-50 text-[8px] font-black text-slate-400 uppercase rounded border border-slate-100">{user.role || 'MEMBER_ENTITY'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Technical Integrity Bento */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 space-y-6">
                            <h4 className="text-[9px] font-black text-[#172b4d] uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-8 h-px bg-slate-200 rounded-full"></span>
                                Technical Integrity
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Sync</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_phone_verified ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{user.is_phone_verified ? 'Verified' : 'Pending'}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Account State</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{user.is_active ? 'Active' : 'Locked'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {[
                                    { label: 'Network Code', value: user.referral_id, icon: 'link', action: () => setActiveTab('REFERRALS') },
                                    { label: 'Origin Node', value: user.referred_by ? `UID-${user.referred_by}` : 'Organic', icon: 'hub', action: user.referred_by ? () => navigate(`/users/${user.referred_by}`) : null },
                                    { label: 'Registry Key', value: '••••••••••••', icon: 'key' },
                                    { label: 'System Check', value: new Date(user.updated_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }), icon: 'verified' }
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={item.action}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all border border-transparent ${item.action ? 'hover:bg-primary/5 hover:border-primary/10 cursor-pointer group/item' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined text-xs ${item.action ? 'text-primary' : 'text-slate-300'}`}>{item.icon}</span>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        </div>
                                        <p className={`text-[9px] font-black ${item.action ? 'text-primary' : 'text-slate-600'}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Contact & Restriction */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 space-y-6 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-[3rem] -mb-12 -mr-12 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-lg shadow-inner">mail</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Primary Channel</p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-white/30"
                                            />
                                        ) : (
                                            <p className="text-xs font-bold text-white/90 truncate">{user.email || 'NO_EMAIL_RECORD'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-lg">smartphone</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Mobile Access</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.phone}
                                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                                className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-white/30"
                                            />
                                        ) : (
                                            <p className="text-xs font-bold text-white/90">{user.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="flex gap-2 relative z-10">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 py-4 bg-primary text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Confirm Update'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-4 bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 relative z-10">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-white/5 hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        Update Profile Dossier
                                    </button>
                                    <button
                                        onClick={handleBlockToggle}
                                        disabled={isBlocking}
                                        className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${user.is_blocked ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-xl hover:shadow-red-500/20'} disabled:opacity-50`}
                                    >
                                        {isBlocking ? 'Processing...' : (user.is_blocked ? 'Authorize System Access' : 'Restrict Identity Node')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Tabbed Infrastructure */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-in slide-in-from-right-8 duration-700">

                        {/* Intelligence Header */}
                        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-[#172b4d] tracking-tighter">Business Intelligence</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Monitoring</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Path: </span>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Global-012</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {user.referred_by && (
                                    <button
                                        onClick={() => navigate(`/users/${user.referred_by}`)}
                                        className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-xl shadow-slate-200/20 flex items-center gap-4 group hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all active:scale-95"
                                    >
                                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-xl font-black">login</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Origin Node</p>
                                            <p className="text-sm font-black text-[#172b4d] tracking-widest font-mono line-height-none">UID-{user.referred_by}</p>
                                        </div>
                                    </button>
                                )}
                                <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-xl shadow-slate-200/20 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-xl font-black">share</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Key</p>
                                        <p className="text-sm font-black text-primary tracking-widest font-mono line-height-none">{user.referral_id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Segmented Controller */}
                        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 inline-flex flex-wrap items-center gap-1">
                            {[
                                { id: 'WALLET', label: 'Wallet', icon: 'account_balance_wallet' },
                                { id: 'BANKING', label: 'Banking', icon: 'assured_workload' },
                                { id: 'REFERRALS', label: 'Referrals', icon: 'hub' },
                                { id: 'ACTIVATION', label: 'Activation', icon: 'bolt' },
                                { id: 'KYC', label: 'KYC', icon: 'verified_user' },
                                { id: 'ACTIVITY', label: 'Activity', icon: 'history_edu' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => tab.id === 'KYC' ? navigate(`/kyc/${userId}`) : setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>


                        {/* TAB CONTENT: WALLET */}
                        {activeTab === 'WALLET' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Active Liquidity Card */}
                                    <div className="bg-[#0f172a] rounded-4xl p-8 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group border border-white/5">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                                    <span className="material-symbols-outlined text-xl text-primary font-black">bolt</span>
                                                </div>
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-widest border border-primary/20">Active Assets</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Liquid Balance</p>
                                                <h3 className="text-4xl font-black tracking-tight tabular-nums">
                                                    <span className="text-primary mr-1">₹</span>
                                                    {Number(user.balance || 0).toLocaleString()}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Escrowed Funds Card */}
                                    <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden group">
                                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50 rounded-tl-full -mb-16 -mr-16 transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined text-xl font-black">lock</span>
                                                </div>
                                                <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100">Escrowed</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Safety Vault</p>
                                                <h3 className="text-4xl font-black text-[#172b4d] tracking-tight tabular-nums">
                                                    <span className="text-slate-200 mr-1">₹</span>
                                                    {Number(user.locked_balance || 0).toLocaleString()}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-100 rounded-4xl p-8 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-300">database</span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-[#172b4d] uppercase tracking-widest">Transaction Ledger</p>
                                            <p className="text-[8px] font-medium text-slate-400 font-mono tracking-tighter">NODE_TRANSIT: UID-{user.id.toString().padStart(6, '0')}</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100 hover:bg-slate-100 transition-all">
                                        Initialize Sync
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: BANKING */}
                        {activeTab === 'BANKING' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white border border-slate-100 rounded-4xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-full -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-xl font-black">domain</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black text-[#172b4d] uppercase tracking-widest">{user.bank_name || 'UNDEFINED_ENTITY'}</p>
                                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Settlement Portal</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Direct Route Number</p>
                                                    <p className="text-xs font-black text-slate-600 font-mono tracking-widest">{user.bank_account_number || '••••••••••••'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gateway Access Code</p>
                                                    <p className="text-xs font-black text-slate-600 font-mono tracking-widest">{user.bank_ifsc || '••••••••'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-px bg-slate-100 hidden md:block"></div>

                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                                    <span className="material-symbols-outlined text-xl font-black">badge</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black text-[#172b4d] uppercase tracking-widest">{user.bank_account_name || 'NO_HOLDER_RECORDED'}</p>
                                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Legal Identity</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${user.bank_status === 'VERIFIED' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    Gateway: {user.bank_status || 'PENDING'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: REFERRALS */}
                        {activeTab === 'REFERRALS' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-4xl p-8 border border-slate-100 space-y-6 group/ref relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover/ref:scale-110"></div>
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-sm font-black">person_pin</span>
                                            </div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Referral Code</p>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 relative z-10">
                                            <h5 className="text-2xl font-black text-[#172b4d] font-mono tracking-widest">{user.referral_id}</h5>
                                            <button
                                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all active:scale-95"
                                                onClick={() => navigator.clipboard.writeText(user.referral_id)}
                                            >
                                                <span className="material-symbols-outlined text-base">content_copy</span>
                                            </button>
                                        </div>
                                    </div>

                                    {user.referred_by_referral_id ? (
                                        <div className="bg-white rounded-4xl p-8 border border-slate-100 space-y-6 group/rep relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover/rep:scale-110"></div>
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                                                    <span className="material-symbols-outlined text-sm font-black">link</span>
                                                </div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Referred By ID</p>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 relative z-10">
                                                <h5 className="text-2xl font-black text-green-600 font-mono tracking-widest">{user.referred_by_referral_id}</h5>
                                                <button
                                                    onClick={() => navigate(`/users/${user.referred_by}`)}
                                                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-green-600 hover:border-green-500/20 hover:shadow-lg transition-all active:scale-95"
                                                >
                                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-900 rounded-4xl p-8 border border-white/5 space-y-6 group/net relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover/net:scale-110"></div>
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                    <span className="material-symbols-outlined text-sm font-black">stars</span>
                                                </div>
                                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Network Placement</p>
                                            </div>
                                            <div className="relative z-10 pt-1">
                                                <h5 className="text-xl font-black text-white uppercase tracking-tighter">Gold Elite Level</h5>
                                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Genesis Node Deployment</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: KYC */}
                        {activeTab === 'KYC' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white border border-slate-100 rounded-4xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-full -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700"></div>
                                    <h4 className="text-[9px] font-black text-[#172b4d] uppercase tracking-[0.2em] flex items-center gap-3 mb-8 relative z-10">
                                        <span className="w-8 h-px bg-slate-200 rounded-full"></span>
                                        Compliance Protocol Status
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                        <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19.5px] before:top-4 before:bottom-4 before:w-px before:bg-slate-100">
                                            {[
                                                { title: "Identity Validation", status: user.identity_status, info: `${user.id_type || 'ID'}: ${user.id_number || 'NOT_FOUND'}`, icon: 'badge' },
                                                { title: "Residential Check", status: user.address_status, info: 'Utility / Legal Proof Registry', icon: 'location_on' },
                                                { title: "Gateway Sync", status: user.bank_status, info: user.bank_name ? `${user.bank_name} (${user.bank_ifsc})` : 'Financial Micro-transfer', icon: 'sync_alt' }
                                            ].map((step, i) => (
                                                <div key={i} className="flex gap-6 relative z-10 group/step">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${step.status === 'VERIFIED' ? 'bg-green-500 text-white shadow-green-500/10' :
                                                        step.status === 'REJECTED' ? 'bg-red-500 text-white shadow-red-500/10' :
                                                            step.status === 'PENDING' ? 'bg-amber-500 text-white shadow-amber-500/10' :
                                                                'bg-white text-slate-300 border border-slate-100 shadow-sm'
                                                        }`}>
                                                        <span className="material-symbols-outlined text-base">{step.icon}</span>
                                                    </div>
                                                    <div className="flex-1 pt-0.5">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <h6 className="text-[9px] font-black text-[#172b4d] uppercase tracking-tight">{step.title}</h6>
                                                            <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${step.status === 'VERIFIED' ? 'bg-green-50 text-green-600' :
                                                                step.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                                    'bg-slate-50 text-slate-400'
                                                                }`}>{step.status || 'NOT_SUBMITTED'}</span>
                                                        </div>
                                                        <p className="text-[8px] font-medium text-slate-400">{step.info}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100/50 space-y-6">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-black text-[#172b4d] uppercase tracking-widest">Compliance Dossier</h4>
                                                <p className="text-[9px] text-slate-400 font-medium">Download verified documentation</p>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Identity Registry', url: user.id_document_url },
                                                    { label: 'Residential Map', url: user.address_document_url },
                                                    { label: 'Settlement Proof', url: user.bank_document_url }
                                                ].map((doc, i) => (
                                                    <button
                                                        key={i}
                                                        disabled={!doc.url}
                                                        onClick={() => doc.url && window.open(`http://localhost:4000${doc.url}`, '_blank')}
                                                        className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all group shadow-sm ${doc.url ? 'bg-white border-slate-100 hover:bg-slate-100 hover:border-primary/20 cursor-pointer' : 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`material-symbols-outlined text-sm ${doc.url ? 'text-slate-300 group-hover:text-primary' : 'text-slate-200'}`}>description</span>
                                                            <span className={`text-[8px] font-black uppercase tracking-widest ${doc.url ? 'text-slate-500' : 'text-slate-300'}`}>{doc.label}</span>
                                                        </div>
                                                        <span className={`material-symbols-outlined text-sm ${doc.url ? 'text-slate-400' : 'text-slate-200'}`}>
                                                            {doc.url ? 'visibility' : 'block'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: ACTIVATION */}
                        {activeTab === 'ACTIVATION' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-12">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                                <span className="material-symbols-outlined text-3xl font-black">bolt</span>
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-[#172b4d] tracking-tighter uppercase">Activation Ledger</h4>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Product Enrollment Integrity</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Current State</p>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${user.activation_payment_status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        user.activation_payment_status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                                            user.activation_payment_status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    {user.activation_payment_status || 'NOT_SUBMITTED'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                        <div className="space-y-10">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Enrolled Product</p>
                                                    <p className="text-xs font-black text-[#172b4d] tracking-tight">{user.activated_product_name || 'GENERIC_ACCESS'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Payment Channel</p>
                                                    <p className="text-xs font-black text-[#172b4d] tracking-tight uppercase">{user.activation_payment_type || 'MANUAL_DEPOSIT'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Submission Timestamp</p>
                                                    <p className="text-xs font-black text-[#172b4d] tracking-tight font-mono">{user.activation_submitted_at ? new Date(user.activation_submitted_at).toLocaleString() : 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Admin Notation</p>
                                                    <p className="text-xs font-medium text-slate-400 italic tracking-tight">{user.activation_admin_comment || 'NO_ADMIN_COMMENT_LOGGED'}</p>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-slate-300 text-sm">info</span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verification Protocol</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                                    Activation proof is verified by system administrators manually. Please ensure the transaction hash or receipt image matches the user's payment intent.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-[10px] font-black text-[#172b4d] uppercase tracking-widest">Financial Evidence</h5>
                                                {user.activation_proof_url && (
                                                    <button
                                                        onClick={() => window.open(`http://localhost:4000${user.activation_proof_url}`, '_blank')}
                                                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all group"
                                                    >
                                                        <span className="text-[8px] font-black uppercase tracking-widest">External Review</span>
                                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">open_in_new</span>
                                                    </button>
                                                )}
                                            </div>

                                            {user.activation_proof_url ? (
                                                <div
                                                    className="relative aspect-3/2 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden group/proof cursor-zoom-in"
                                                    onClick={() => window.open(`http://localhost:4000${user.activation_proof_url}`, '_blank')}
                                                >
                                                    <img
                                                        src={`http://localhost:4000${user.activation_proof_url}`}
                                                        alt="Activation Proof"
                                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                        <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-slate-900">zoom_in</span>
                                                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Review Evidence</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-3/2 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-300">
                                                    <span className="material-symbols-outlined text-6xl opacity-20">cloud_off</span>
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Proof Evidence Missing</p>
                                                        <p className="text-[8px] font-medium opacity-30 mt-1 uppercase tracking-widest">Manual verification required</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: ACTIVITY */}
                        {activeTab === 'ACTIVITY' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-4xl border border-slate-100 p-20 text-center space-y-6 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0"></div>
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto relative">
                                        <span className="material-symbols-outlined text-4xl text-slate-200">receipt_long</span>
                                        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white animate-pulse"></div>
                                    </div>
                                    <div className="space-y-2 max-w-xs mx-auto">
                                        <h4 className="text-lg font-black text-[#172b4d] uppercase tracking-tighter">Event Logs Isolated</h4>
                                        <p className="text-[9px] text-slate-400 font-medium leading-relaxed">System activity streams are currently being indexed at the Global Node level. Check back in T-minus 12 minutes.</p>
                                    </div>
                                    <div className="pt-4">
                                        <button className="px-8 py-3 bg-[#172b4d] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                                            Reload Data Stream
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer Insight */}
                <div className="text-center pt-8 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Global Infrastructure • Cloud Distributed Registry • SSL Encrypted</p>
                </div>

            </div>
        </div>
    );
}
