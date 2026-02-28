import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
    usePopups, 
    useCreatePopupMutation, 
    useUpdatePopupMutation, 
    useDeletePopupMutation 
} from "../hooks/usePopupService";

const PopupNoticeDrawer = ({ isOpen, onClose, popup, onSave, loading }) => {
    const [formData, setFormData] = useState({
        title: "",
        short_description: "",
        long_description: "",
        is_active: 1
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const IMAGE_BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        if (popup) {
            setFormData({
                title: popup.title || "",
                short_description: popup.short_description || "",
                long_description: popup.long_description || "",
                is_active: popup.is_active ? 1 : 0
            });
            setLogoPreview(popup.logo ? `${IMAGE_BASE_URL}${popup.logo}` : null);
        } else {
            setFormData({
                title: "",
                short_description: "",
                long_description: "",
                is_active: 1
            });
            setLogoPreview(null);
        }
        setLogoFile(null);
    }, [popup, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value 
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData };
        if (logoFile) {
            data.logo = logoFile;
        }
        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <form onSubmit={handleSubmit} className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {popup ? "Edit Popup Notice" : "Create Popup Notice"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Details for the frontend popup notice
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    {/* Media Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-lg">image</span>
                            Popup Image / Logo
                        </div>

                        <div className="relative group aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/50">
                            {logoPreview ? (
                                <>
                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => document.getElementById('logo-upload').click()} className="px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">
                                            Replace Image
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button type="button" onClick={() => document.getElementById('logo-upload').click()} className="flex flex-col items-center gap-4 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-5xl">add_photo_alternate</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
                                </button>
                            )}
                            <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoChange} />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-lg">edit_note</span>
                            Content Details
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 ml-1">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter popup title"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 ml-1">Short Description</label>
                                <input
                                    type="text"
                                    name="short_description"
                                    value={formData.short_description}
                                    onChange={handleInputChange}
                                    placeholder="Brief summary"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 ml-1">Long Description</label>
                                <textarea
                                    name="long_description"
                                    value={formData.long_description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Detailed message..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={formData.is_active === 1}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary bg-white border-slate-200 rounded focus:ring-primary/20 focus:ring-4 transition-all"
                                    />
                                </div>
                                <label htmlFor="is_active" className="text-sm font-bold text-slate-700 select-none cursor-pointer">
                                    Active for All Users
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-white/80 backdrop-blur-md border-t border-slate-50 flex items-center justify-end gap-3 z-20">
                    <button type="button" onClick={onClose} className="px-6 py-3 text-slate-600 text-sm font-bold hover:bg-slate-50 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50">
                        {loading ? "Saving..." : (popup ? "Save Changes" : "Create Popup")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function PopupNotices() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedPopup, setSelectedPopup] = useState(null);

    const { data: popups = [], isLoading } = usePopups();
    const createMutation = useCreatePopupMutation();
    const updateMutation = useUpdatePopupMutation();
    const deleteMutation = useDeletePopupMutation();

    const IMAGE_BASE_URL = 'http://localhost:4000';

    const handleOpenDrawer = (popup = null) => {
        setSelectedPopup(popup);
        setDrawerOpen(true);
    };

    const handleSave = async (popupData) => {
        try {
            if (selectedPopup) {
                await updateMutation.mutateAsync({ id: selectedPopup.id, popupData });
                toast.success("Popup notice updated successfully");
            } else {
                await createMutation.mutateAsync(popupData);
                toast.success("Popup notice created successfully");
            }
            setDrawerOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to save popup notice");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this popup notice?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success("Popup notice deleted successfully");
        } catch (err) {
            toast.error(err.message || "Failed to delete popup notice");
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-semibold text-sm animate-pulse">Loading popup notices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span>Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary font-bold">Popup Notices</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Popup Notices</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Manage popups that appear for users when they log in.</p>
                </div>

                <button
                    onClick={() => handleOpenDrawer()}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
                    New Popup Notice
                </button>
            </div>

            {/* List Table */}
            <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500 ${popups.length === 0 ? 'p-10' : ''}`}>
                {popups.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                        <span className="material-symbols-outlined text-6xl">campaign</span>
                        <p className="text-sm font-bold">No popup notices found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Popup Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Created</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {popups.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                                    {item.logo ? (
                                                        <img src={`${IMAGE_BASE_URL}${item.logo}`} className="w-full h-full object-contain" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">
                                                            NO IMAGE
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">{item.title}</h4>
                                                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{item.short_description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.is_active ? (
                                                <span className="px-3 py-1.5 rounded-xl bg-green-50 text-green-700 text-[9px] font-bold uppercase tracking-widest border border-green-100">Active</span>
                                            ) : (
                                                <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest border border-slate-100">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-slate-700">{new Date(item.created_at).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenDrawer(item)} className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                                                    <span className="material-symbols-outlined text-[22px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <span className="material-symbols-outlined text-[22px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <PopupNoticeDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                popup={selectedPopup}
                onSave={handleSave}
                loading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
}
