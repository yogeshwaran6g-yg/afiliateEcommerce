import React, { useState, useEffect } from "react";
import announcementApiService from "../services/announcementApiService";

const AnnouncementDrawer = ({ isOpen, onClose, announcement, onSave, loading }) => {
    const [formData, setFormData] = useState({
        heading: "",
        short_description: "",
        long_description: "",
        advertisement_end_time: "",
        image_url: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const IMAGE_BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        if (announcement) {
            setFormData({
                heading: announcement.heading || "",
                short_description: announcement.short_description || "",
                long_description: announcement.long_description || "",
                advertisement_end_time: announcement.advertisement_end_time ? new Date(announcement.advertisement_end_time).toISOString().slice(0, 16) : "",
                image_url: announcement.image_url || ""
            });
            setImagePreview(announcement.image_url ? `${IMAGE_BASE_URL}${announcement.image_url}` : null);
        } else {
            setFormData({
                heading: "",
                short_description: "",
                long_description: "",
                advertisement_end_time: "",
                image_url: ""
            });
            setImagePreview(null);
        }
        setImageFile(null);
    }, [announcement, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }
        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <form onSubmit={handleSubmit} className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {announcement ? "Edit Announcement" : "Create Announcement"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Provide details for the system notification
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
                            Media Asset
                        </div>

                        <div className="relative group aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/50">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => document.getElementById('image-upload').click()} className="px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">
                                            Replace Image
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button type="button" onClick={() => document.getElementById('image-upload').click()} className="flex flex-col items-center gap-4 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-5xl">add_photo_alternate</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Upload Cover Image</span>
                                </button>
                            )}
                            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
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
                                <label className="text-sm font-semibold text-slate-800 ml-1">Heading <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter announcement heading"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 ml-1">Short Description <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="short_description"
                                    value={formData.short_description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Brief summary"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 ml-1">Full Content <span className="text-red-500">*</span></label>
                                <textarea
                                    name="long_description"
                                    value={formData.long_description}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    placeholder="Enter your message..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 ml-1">Expiration Date & Time <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    name="advertisement_end_time"
                                    value={formData.advertisement_end_time}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                />
                                <p className="text-[10px] text-slate-400 font-medium ml-1">Select when this notification should expire.</p>
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
                        {loading ? "Saving..." : (announcement ? "Save Changes" : "Submit")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function Announcements() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const IMAGE_BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await announcementApiService.getAnnouncements();
            setAnnouncements(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDrawer = (announcement = null) => {
        setSelectedAnnouncement(announcement);
        setDrawerOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            setDrawerLoading(true);
            if (selectedAnnouncement) {
                await announcementApiService.updateAnnouncement(selectedAnnouncement.id, formData);
            } else {
                await announcementApiService.createAnnouncement(formData);
            }
            setDrawerOpen(false);
            fetchAnnouncements();
        } catch (err) {
            alert(err.message || "Failed to save announcement");
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            setLoading(true);
            await announcementApiService.deleteAnnouncement(id);
            fetchAnnouncements();
        } catch (err) {
            alert(err.message || "Failed to delete announcement");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-semibold text-sm animate-pulse">Loading announcements...</p>
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
                        <span className="text-primary font-bold">Announcements</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Announcements</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Manage system-wide updates and notifications.</p>
                </div>

                <button
                    onClick={() => handleOpenDrawer()}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
                    New Announcement
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/50 border-b border-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {announcements.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                                {item.image_url ? (
                                                    <img src={`${IMAGE_BASE_URL}${item.image_url}`} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <span className="material-symbols-outlined">image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 tracking-tight">{item.heading}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{item.short_description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date</p>
                                            <p className="text-xs font-semibold text-slate-700">{new Date(item.advertisement_end_time).toLocaleDateString()} {new Date(item.advertisement_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(item.advertisement_end_time) > new Date() ? (
                                            <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wide">Active</span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wide">Expired</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleOpenDrawer(item)} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {announcements.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <span className="material-symbols-outlined text-6xl">campaign</span>
                                            <p className="text-sm font-bold">No announcements found in the bulletin.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnnouncementDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                announcement={selectedAnnouncement}
                onSave={handleSave}
                loading={drawerLoading}
            />
        </div>
    );
}
