import React, { useState } from "react";

const UserSearchBar = ({ allUsers, isLoadingUsers, onUserSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = searchQuery ? allUsers.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

    const handleSelect = (user) => {
        onUserSelect(user);
        setSearchQuery("");
    };

    return (
        <div className="relative w-full md:w-96 group">
            <div className={`relative z-20 flex items-center bg-white border ${searchQuery ? 'border-primary shadow-lg ring-4 ring-primary/5' : 'border-slate-200 shadow-sm'} rounded-2xl transition-all duration-300`}>
                <span className="material-symbols-outlined ml-4 text-slate-400">search</span>
                <input
                    type="text"
                    placeholder="Explore User Network (Name or ID)..."
                    className="w-full px-4 py-3.5 text-sm font-bold text-slate-700 bg-transparent focus:outline-none placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="mr-4 text-slate-300 hover:text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-y-auto max-h-[400px] no-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
                    {isLoadingUsers ? (
                        <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Searching Database...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {filteredUsers.map(user => (
                                <button
                                    key={user.dbId}
                                    onClick={() => handleSelect(user)}
                                    className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all text-left group"
                                >
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">UID: {user.id}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No users found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserSearchBar;
