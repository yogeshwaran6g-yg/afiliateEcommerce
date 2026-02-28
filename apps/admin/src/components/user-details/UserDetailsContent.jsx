import React, { useState, useEffect } from 'react';
import userApiService from '../../services/user.apiservice';
import { toast } from 'react-toastify';

const UserDetailsContent = ({
    user,
    activeTab,
    setActiveTab,
    userId,
    navigate,
    refreshUser
}) => {
    const [isEditingWallet, setIsEditingWallet] = useState(false);
    const [walletData, setWalletData] = useState({
        balance: user.balance,
        locked_balance: user.locked_balance
    });
    const [saving, setSaving] = useState(false);

    // Sync local state when user prop updates
    useEffect(() => {
        setWalletData({
            balance: user.balance,
            locked_balance: user.locked_balance
        });
    }, [user.balance, user.locked_balance]);

    const handleSaveWallet = async () => {
        try {
            setSaving(true);
            await userApiService.updateUser(userId, {
                balance: parseFloat(walletData.balance),
                locked_balance: parseFloat(walletData.locked_balance)
            });
            setIsEditingWallet(false);
            if (refreshUser) refreshUser();
            toast.success("Wallet updated successfully");
        } catch (error) {
            toast.error(error.message || "Failed to update wallet");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 animate-in slide-in-from-right-8 duration-700">

            {/* Simple Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">User Overview</h2>
                    <p className="text-sm text-slate-500 font-medium">Basic info and wallet details for this user.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/user-notifications/send/${user.id || user.dbId}`)}
                        className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">send</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Send Message</span>
                    </button>
                    {!!user.referred_by && (
                        <button
                            onClick={() => navigate(`/users/${user.referred_by}`)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                        >
                            <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary transition-colors font-bold">person</span>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sponsor</p>
                                <p className="text-xs font-semibold text-slate-700">UID-{user.referred_by}</p>
                            </div>
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/users/${userId}/referral`)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-lg text-primary font-bold group-hover:rotate-12 transition-transform">share</span>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Referral Code</p>
                            <p className="text-xs font-bold text-primary">{user.referral_id}</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Simple Tab Control */}
            <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100 inline-flex flex-wrap items-center gap-1">
                {[
                    { id: 'KYC', label: 'KYC', icon: 'verified_user' },
                    { id: 'WALLET', label: 'Wallet', icon: 'account_balance_wallet' },
                    { id: 'REFERRALS', label: 'Referrals', icon: 'hub' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => tab.id === 'KYC' ? navigate(`/kyc/${userId}`) : setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/50'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>


            {/* TAB CONTENT: WALLET */}
            {activeTab === 'WALLET' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Balance Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-xl text-primary font-bold">payments</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!isEditingWallet && (
                                            <button
                                                onClick={() => setIsEditingWallet(true)}
                                                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                        )}
                                        <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-[10px] font-bold uppercase tracking-wider">Main Wallet</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Available Balance</p>
                                    {isEditingWallet ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary text-2xl font-medium">₹</span>
                                            <input
                                                type="number"
                                                value={walletData.balance}
                                                onChange={(e) => setWalletData({ ...walletData, balance: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-2xl font-bold text-white w-full focus:outline-none focus:ring-2 focus:ring-primary/40 ring-offset-slate-900 ring-offset-2"
                                            />
                                        </div>
                                    ) : (
                                        <h3 className="text-3xl font-bold tracking-tight">
                                            <span className="text-primary mr-2 font-medium">₹</span>
                                            {Number(user.balance || 0).toLocaleString()}
                                        </h3>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Locked Balance Card */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl font-bold">lock_clock</span>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-100">Hold</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locked Amount</p>
                                    {isEditingWallet ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-300 text-2xl font-medium">₹</span>
                                            <input
                                                type="number"
                                                value={walletData.locked_balance}
                                                onChange={(e) => setWalletData({ ...walletData, locked_balance: e.target.value })}
                                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-2xl font-bold text-slate-800 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    ) : (
                                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                                            <span className="text-slate-300 mr-2 font-medium">₹</span>
                                            {Number(user.locked_balance || 0).toLocaleString()}
                                        </h3>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditingWallet && (
                        <div className="flex gap-3 animate-in slide-in-from-top-2 duration-300">
                            <button
                                onClick={handleSaveWallet}
                                disabled={saving}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {saving ? 'Updating Wallet...' : 'Save Balance Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingWallet(false);
                                    setWalletData({
                                        balance: user.balance,
                                        locked_balance: user.locked_balance
                                    });
                                }}
                                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-sm">list_alt</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-700">Recent Transactions</p>
                                <p className="text-[10px] text-slate-500">History for current node</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/transactions?userId=${userId}`)}
                            className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            View All
                        </button>
                    </div>
                </div>
            )}



            {/* TAB CONTENT: REFERRALS */}
            {activeTab === 'REFERRALS' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-sm font-bold">person_pin</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Referral Code</p>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <h5 className="text-xl font-bold text-slate-800 font-mono tracking-wider">{user.referral_id}</h5>
                                <button
                                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                    onClick={() => navigator.clipboard.writeText(user.referral_id)}
                                >
                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                </button>
                            </div>
                        </div>

                        {user.referred_by_referral_id && (
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined text-sm font-bold">link</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sponsor Code</p>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <h5 className="text-xl font-bold text-green-700 font-mono tracking-wider">{user.referred_by_referral_id}</h5>
                                    <button
                                        onClick={() => navigate(`/users/${user.referred_by}`)}
                                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-green-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate(`/genealogy/${userId}`)}
                        className="w-full mt-2 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-200"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">hub</span>
                        View Full Network Explorer
                    </button>
                </div>
            )}

            {/* TAB CONTENT: KYC */}
            {activeTab === 'KYC' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Verification Process</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                {[
                                    { title: "Identity", status: user.identity_status, info: `${user.id_type || 'ID'}: ${user.id_number || 'No record'}`, icon: 'badge' },
                                    { title: "Address", status: user.address_status, info: 'Postal verify', icon: 'location_on' },
                                    { title: "Banking", status: user.bank_status, info: user.bank_name || 'Bank verify', icon: 'payments' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                            step.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                step.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-50 text-slate-300'
                                            }`}>
                                            <span className="material-symbols-outlined text-sm">{step.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h6 className="text-[11px] font-bold text-slate-700">{step.title}</h6>
                                                <span className={`text-[9px] font-bold uppercase ${step.status === 'VERIFIED' ? 'text-green-700' :
                                                    step.status === 'PENDING' ? 'text-amber-700' :
                                                        'text-slate-400'
                                                    }`}>{step.status || 'Pending'}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium">{step.info}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents</p>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Identity Proof', url: user.id_document_url },
                                        { label: 'Address Proof', url: user.address_document_url },
                                        { label: 'Bank Proof', url: user.bank_document_url }
                                    ].map((doc, i) => (
                                        <button
                                            key={i}
                                            disabled={!doc.url}
                                            onClick={() => doc.url && window.open(`http://localhost:4000${doc.url}`, '_blank')}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-semibold transition-colors ${doc.url ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-transparent border-slate-100 text-slate-300'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">description</span>
                                                {doc.label}
                                            </div>
                                            <span className="material-symbols-outlined text-xs">
                                                {doc.url ? 'visibility' : 'close'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Other tabs remain here */}



        </div>
    );
};

export default UserDetailsContent;
