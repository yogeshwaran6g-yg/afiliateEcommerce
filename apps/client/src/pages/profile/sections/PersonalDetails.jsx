import React from "react";

export default function PersonalDetails({ data, onChange, onUpdate, isUpdating }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Details</h3>

            <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-200">
                        {data.profile_image ? (
                            <img src={data.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 shadow-md transition-all">
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        onChange({ target: { name: 'profile_image', value: reader.result } });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </label>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">Profile Picture</h4>
                    <p className="text-xs text-slate-500">Avatar will be visible to other members.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name || ""}
                        onChange={onChange}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email || ""}
                        readOnly
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">Email cannot be changed after verification</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={data.phone || ""}
                        onChange={onChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={data.dob || ""}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
            </div>

            <button
                onClick={() => onUpdate('personal')}
                disabled={isUpdating}
                className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
                {isUpdating ? "Saving..." : "Save Personal Details"}
            </button>
        </div>
    );
}
