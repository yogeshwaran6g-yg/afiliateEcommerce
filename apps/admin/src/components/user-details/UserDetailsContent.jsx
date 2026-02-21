import React from 'react';

const UserDetailsContent = ({
    user,
    activeTab,
    setActiveTab,
    userId,
    navigate
}) => {
    return (
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 animate-in slide-in-from-right-8 duration-700">

            {/* Simple Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">User Overview</h2>
                    <p className="text-sm text-slate-500 font-medium">Detailed breakdown of user status and performance.</p>
                </div>

                <div className="flex items-center gap-3">
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
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg text-primary font-bold">share</span>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Referral Code</p>
                            <p className="text-xs font-bold text-primary">{user.referral_id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Tab Control */}
            <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100 inline-flex flex-wrap items-center gap-1">
                {[
                    { id: 'ACTIVATION', label: 'Activation', icon: 'bolt' },
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
                                    <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-[10px] font-bold uppercase tracking-wider">Main Wallet</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Available Balance</p>
                                    <h3 className="text-3xl font-bold tracking-tight">
                                        <span className="text-primary mr-2 font-medium">₹</span>
                                        {Number(user.balance || 0).toLocaleString()}
                                    </h3>
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
                                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                                        <span className="text-slate-300 mr-2 font-medium">₹</span>
                                        {Number(user.locked_balance || 0).toLocaleString()}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

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
                        <button className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
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

                        {user.referred_by_referral_id ? (
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
                        ) : (
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined text-sm font-bold">stars</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level</p>
                                </div>
                                <div>
                                    <h5 className="text-lg font-bold text-slate-700">Premium Member</h5>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">Direct Enrollment</p>
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

            {/* TAB CONTENT: ACTIVATION */}
            {activeTab === 'ACTIVATION' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                                    <span className="material-symbols-outlined text-2xl">bolt</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 tracking-tight">Activation Details</h4>
                                    <p className="text-slate-500 font-medium text-[11px]">Payment and enrollment status.</p>
                                </div>
                            </div>

                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${user.activation_payment_status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' :
                                user.activation_payment_status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    user.activation_payment_status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                        'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                {user.activation_payment_status || 'Empty'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Product</p>
                                        <p className="text-xs font-semibold text-slate-700">{user.activated_product_name || 'Not Available'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Method</p>
                                        <p className="text-xs font-semibold text-slate-700 uppercase">{user.activation_payment_type || 'None'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                        <p className="text-xs font-semibold text-slate-700">{user.activation_submitted_at ? new Date(user.activation_submitted_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reference</p>
                                        <p className="text-xs font-medium text-slate-500 truncate">{user.referral_id}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                        " {user.activation_admin_comment || 'No admin notes available'} "
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Proof</p>
                                {user.activation_proof_url ? (
                                    <div className="relative aspect-video bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-zoom-in"
                                        onClick={() => window.open(`http://localhost:4000${user.activation_proof_url}`, '_blank')}>
                                        <img
                                            src={`http://localhost:4000${user.activation_proof_url}`}
                                            alt="Proof"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300">
                                        <p className="text-xs font-bold uppercase opacity-50">No evidence provided</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default UserDetailsContent;
