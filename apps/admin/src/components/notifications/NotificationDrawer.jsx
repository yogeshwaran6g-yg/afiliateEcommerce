import React, { useState, useEffect, useRef } from "react";

const NotificationDrawer = ({ isOpen, onClose, onSave, loading, users = [], initialUserId = "" }) => {
    const initialFormState = {
        user_id: initialUserId,
        type: "ORDER",
        title: "",
        description: "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen && users.length > 0) {
            const matchedUser = users.find(u => {
                const uDbId = u.dbId?.toString();
                const uId = u.id?.toString();
                const targetId = initialUserId?.toString();
                
                return uDbId === targetId || 
                       uId === targetId || 
                       uId === `UL-${targetId?.padStart(6, '0')}` ||
                       u.name?.toLowerCase() === targetId?.toLowerCase();
            });

            if (matchedUser) {
                setFormData(prev => ({ ...prev, user_id: matchedUser.dbId }));
            } else if (initialUserId) {
                setFormData(prev => ({ ...prev, user_id: initialUserId }));
            }
        }
    }, [isOpen, initialUserId, users]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const selectedUser = users.find(u => {
        const uDbId = u.dbId?.toString();
        const uId = u.id?.toString();
        const targetId = formData.user_id?.toString();

        return uDbId === targetId || 
               uId === targetId || 
               uId === `UL-${targetId?.padStart(6, '0')}` ||
               u.name?.toLowerCase() === targetId?.toLowerCase();
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-black text-[#172b4d] tracking-tight">
                            Send User Notification
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Direct communication with partners
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    <div className="space-y-6">
                        <div className="space-y-2" ref={dropdownRef}>
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Recipient User <span className="text-red-500">*</span></label>

                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer flex justify-between items-center"
                                >
                                    <span className={selectedUser ? "" : "text-slate-400"}>
                                        {selectedUser ? `${selectedUser.name}` : (formData.user_id ? "Resolving user..." : "Select a user")}
                                    </span>
                                    <span className="material-symbols-outlined text-slate-400">
                                        expand_more
                                    </span>
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                        <div className="max-h-[160px] overflow-y-auto py-1 custom-scrollbar">
                                            {users.length > 0 ? (
                                                users.map(user => (
                                                    <div
                                                        key={user.dbId}
                                                        onClick={() => {
                                                            setFormData(p => ({ ...p, user_id: user.dbId }));
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-3 text-sm font-bold cursor-pointer hover:bg-slate-50 transition-colors ${formData.user_id === user.dbId ? 'text-primary bg-primary/5' : 'text-[#172b4d]'}`}
                                                    >
                                                        {user.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-center text-slate-400 text-xs font-bold">
                                                    No users found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Notification Type <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer flex justify-between items-center"
                            >
                                <option value="ORDER">Order</option>
                                <option value="PAYMENT">Payment</option>
                                <option value="WALLET">Wallet</option>
                                <option value="ACCOUNT">Account</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Short, catchy headline"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#172b4d] ml-1">Message Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                placeholder="Detailed message content..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white/80 backdrop-blur-md border-t border-slate-50 flex items-center justify-end gap-4 z-20">
                    <button type="button" onClick={onClose} className="px-8 py-3.5 text-slate-600 text-sm font-black hover:bg-slate-50 rounded-2xl transition-all">
                        Discard
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3.5 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 leading-none disabled:opacity-50">
                        {loading ? "Processing..." : "Send Notification"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationDrawer;
