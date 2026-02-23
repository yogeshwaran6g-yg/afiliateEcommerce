import React, { useState } from "react";
import Skeleton from "../../../components/ui/Skeleton";

export default function PersonalDetails({ data, onChange, onUpdate, isUpdating, isLoading }) {
    const [editMode, setEditMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imgError, setImgError] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImgError(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        onChange({ target: { name: 'profile_image', value: null } });
        setImageFile(null);
        setPreviewUrl(null);
        setImgError(false);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        await onUpdate(imageFile);
        setEditMode(false);
        setImageFile(null);
        setPreviewUrl(null);
    };

    const showForm = editMode;

    const displayImage = previewUrl || (data.profile_image && !imgError ? (data.profile_image.startsWith('http') ? data.profile_image : `${import.meta.env.VITE_API_URL}${data.profile_image}`) : null);

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Personal Details</h3>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors bg-slate-50 rounded-lg"
                        title="Edit Details"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center text-center">
                {/* Profile Card Style from Image */}
                <div className="w-full max-w-sm mb-6">
                    <div className="flex flex-col items-center gap-4 w-full">
                        {/* Avatar */}
                        <div className="relative">
                            {isLoading ? (
                                <Skeleton variant="circular" width="112px" height="112px" className="rounded-full border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]" />
                            ) : (
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-slate-100 flex items-center justify-center">
                                    {displayImage ? (
                                        <img
                                            src={displayImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-primary/40">
                                            <span className="material-symbols-outlined text-5xl">person</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {editMode && (
                                <div className="absolute -bottom-2 -right-2 flex flex-col gap-2">
                                    <label className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 shadow-lg transition-all border-2 border-white">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    {(data.profile_image || imageFile) && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="w-9 h-9 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 shadow-lg transition-all border-2 border-white"
                                            title="Remove Photo"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-2 w-full flex flex-col items-center">
                            {isLoading ? (
                                <>
                                    <Skeleton width="180px" height="32px" className="mb-4" />
                                    <div className="space-y-2 w-full flex flex-col items-center">
                                        <Skeleton width="220px" height="18px" />
                                        <Skeleton width="160px" height="18px" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{data.name || "Setup Name"}</h4>

                                    <div className="flex flex-col gap-1.5 mt-4">
                                        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
                                            <span className="material-symbols-outlined text-lg opacity-60">mail</span>
                                            <span>{data.email || "No email provided"}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
                                            <span className="material-symbols-outlined text-lg opacity-60">call</span>
                                            <span>{data.phone || "No phone added"}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                {showForm && (
                    <div className="w-full pt-8 mt-8 border-t border-slate-50">
                        <div className="space-y-4 text-left max-w-md mx-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name || ""}
                                    onChange={onChange}
                                    placeholder="Enter full name"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email || ""}
                                    onChange={onChange}
                                    placeholder="Enter email address"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={data.phone || ""}
                                    onChange={onChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={data.dob || ""}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                    className="flex-1 bg-[#0F172A] text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="px-6 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
