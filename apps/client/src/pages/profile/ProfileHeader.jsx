import React from "react";

export default function ProfileHeader({ name, distributorId, tier, joinDate, profileImage, onImageChange }) {
    const fileInputRef = React.useRef(null);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 pb-8 border-b border-slate-200 text-center md:text-left">
            <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-slate-200 to-slate-300 rounded-full overflow-hidden flex items-center justify-center">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl md:text-3xl font-bold text-slate-400">
                            {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : "U"}
                        </span>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white">
                    <span className="material-symbols-outlined text-xs md:text-sm">check</span>
                </div>
            </div>
            <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{name || "User Name"}</h2>
                <p className="text-slate-500 text-xs md:text-sm mb-2">Distributor ID: {distributorId}</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded">{tier}</span>
                    <span className="text-slate-400 text-xs md:text-sm">Joined {joinDate}</span>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onImageChange}
                className="hidden"
                accept="image/*"
            />
            <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
                Change Photo
            </button>
        </div>
    );
}
