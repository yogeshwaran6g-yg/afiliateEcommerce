import React from 'react';

const UserProfileSidebar = ({
    user,
    isEditing,
    editData,
    setEditData,
    handleSave,
    saving,
    setIsEditing,
    handleBlockToggle,
    isBlocking,
    setActiveTab,
    navigate
}) => {
    return (
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 animate-in slide-in-from-left-8 duration-700">
            {/* Unified Profile Box */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">

                {/* Identity Header Section */}
                <div className="p-5">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative">
                            <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center font-bold text-3xl text-slate-700">
                                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-sm">
                                <span className="material-symbols-outlined text-sm font-bold">verified</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                            )}
                            <p className="text-xs text-slate-500 font-medium">ID: #{user.id.toString().padStart(6, '0')}</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.account_activation_status === 'ACTIVATED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {user.account_activation_status}
                            </span>
                            {!!user.is_blocked && (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                                    Blocked
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Joined On</span>
                            <span className="text-slate-700 font-semibold">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Role</span>
                            <span className="text-slate-700 font-semibold uppercase">{user.role || 'Member'}</span>
                        </div>
                    </div>
                </div>

                {/* Technical Details Section */}
                <div className="px-5 py-4 space-y-3 bg-slate-50/30 border-y border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Status</p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <p className="text-[9px] font-medium text-slate-500 uppercase mb-1">Mobile</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${user.is_phone_verified ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                <p className="text-[11px] font-bold text-slate-700">{user.is_phone_verified ? 'Verified' : 'Pending'}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <p className="text-[9px] font-medium text-slate-500 uppercase mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <p className="text-[11px] font-bold text-slate-700">{user.is_active ? 'Active' : 'Locked'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {[
                            { label: 'Referral ID', value: user.referral_id, icon: 'link', action: () => setActiveTab('REFERRALS') },
                            { label: 'Referred By', value: user.referred_by ? `UID-${user.referred_by}` : 'Organic', icon: 'person', action: user.referred_by ? () => navigate(`/users/${user.referred_by}`) : null },
                            { label: 'Last Updated', value: new Date(user.updated_at).toLocaleDateString(), icon: 'history' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={item.action}
                                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${item.action ? 'hover:bg-primary/5 cursor-pointer group' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary">{item.icon}</span>
                                    <p className="text-xs text-slate-600 font-medium">{item.label}</p>
                                </div>
                                <p className={`text-xs font-semibold ${item.action ? 'text-primary' : 'text-slate-800'}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact & Actions Section */}
                <div className="p-5 space-y-5 mt-auto">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                ) : (
                                    <p className="text-xs font-semibold text-slate-700 truncate">{user.email || 'No email'}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-sm">smartphone</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                                <p className="text-xs font-semibold text-slate-700">{user.phone}</p>
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={handleBlockToggle}
                                disabled={isBlocking}
                                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${user.is_blocked ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'} disabled:opacity-50`}
                            >
                                {isBlocking ? 'Wait...' : (user.is_blocked ? 'Unblock User' : 'Block User')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileSidebar;
