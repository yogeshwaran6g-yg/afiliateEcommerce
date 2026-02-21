import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryApiService from "../services/categoryApiService";

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        parent_id: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApiService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const data = new FormData();
            data.append("name", formData.name);
            data.append("parent_id", formData.parent_id || "");
            if (imageFile) {
                data.append("image", imageFile);
            }

            if (formData.id) {
                await categoryApiService.updateCategory(formData.id, data);
            } else {
                await categoryApiService.createCategory(data);
            }
            fetchCategories();
            handleReset();
        } catch (err) {
            alert(err.message || "Failed to save category");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (cat) => {
        const formElement = document.getElementById('category-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setFormData({
            id: cat.id,
            name: cat.name,
            parent_id: cat.parent_id || ""
        });
        setImageFile(null);
        if (cat.image) {
            // Check if image already has a protocol
            const imageUrl = cat.image.startsWith('http')
                ? cat.image
                : `http://localhost:4000${cat.image}`;
            setImagePreview(imageUrl);
        } else {
            setImagePreview(null);
        }
    };

    const handleReset = () => {
        setFormData({
            id: null,
            name: "",
            parent_id: ""
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? This might affect products in this category.")) {
            try {
                await categoryApiService.deleteCategory(id);
                fetchCategories();
                if (formData.id === id) handleReset();
            } catch (err) {
                alert(err.message || "Failed to delete category");
            }
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && categories.length === 0) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <button onClick={() => navigate("/products")} className="hover:text-primary transition-colors">Products</button>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary font-bold">Categories</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Product Categories</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Organize your products into meaningful groups.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 text-sm font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 group leading-none"
                    >
                        <span className="material-symbols-outlined font-bold text-primary">arrow_back</span>
                        <span>Back to Products</span>
                    </button>
                </div>
            </div>

            {/* In-Page Form */}
            <div id="category-form" className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 scroll-mt-10">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-[#172b4d]">{formData.id ? "Edit Category" : "Add New Category"}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                            {formData.id ? "Modify existing category details" : "Create a new product group"}
                        </p>
                    </div>
                    {formData.id && (
                        <button
                            onClick={handleReset}
                            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Switch to Create New
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {/* Image Preview & Upload */}
                    <div className="lg:row-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Category Image</label>
                        <div className="relative group/overlay">
                            <input
                                type="file"
                                id="cat-image"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <label
                                htmlFor="cat-image"
                                className="w-full aspect-square border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative shadow-inner"
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white p-2 rounded-full shadow-lg text-primary">
                                                <span className="material-symbols-outlined text-lg">cached</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center p-4">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Upload</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Wellness"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Parent Category</label>
                            <div className="relative group">
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">No Parent (Top Level)</option>
                                    {categories.filter(c => c.id !== formData.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex items-center justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 text-slate-500 text-[11px] font-black hover:bg-slate-50 rounded-xl transition-all uppercase tracking-[0.2em]"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-8 py-3.5 bg-[#172b4d] text-white text-[11px] font-black rounded-xl shadow-xl shadow-[#172b4d]/20 hover:bg-[#1a335a] transition-all active:scale-95 flex items-center gap-3 uppercase tracking-[0.2em] ${saving ? "opacity-50 grayscale" : ""}`}
                        >
                            {saving ? (
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <span className="material-symbols-outlined text-lg">verified</span>
                            )}
                            {saving ? "Saving..." : (formData.id ? "Update Category" : "Publish Category")}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative w-full lg:w-96 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                        />
                    </div>
                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Showing {filteredCategories.length} categories</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/70 border-b border-slate-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">IMAGE</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">NAME</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PARENT</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CREATED AT</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCategories.map((cat) => (
                                <tr key={cat.id} className={`hover:bg-slate-50/50 transition-colors ${formData.id === cat.id ? "bg-primary/5" : ""}`}>
                                    <td className="px-8 py-6 text-xs font-bold text-slate-400">#{cat.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                            {cat.image ? (
                                                <img src={`http://localhost:4000${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                                    <span className="material-symbols-outlined text-2xl">category</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <h4 className="text-sm font-black text-[#172b4d]">{cat.name}</h4>
                                    </td>
                                    <td className="px-8 py-6">
                                        {cat.parent_id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                                                <span className="text-[11px] font-black text-[#172b4d] uppercase tracking-wider">
                                                    {categories.find(c => c.id === cat.parent_id)?.name || `ID: ${cat.parent_id}`}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Top Level</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{new Date(cat.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className={`p-2 transition-all hover:scale-110 ${formData.id === cat.id ? "text-primary bg-primary/10 rounded-xl" : "text-slate-300 hover:text-primary"}`}
                                                title="Edit Category"
                                            >
                                                <span className="material-symbols-outlined text-[20px] font-bold">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="text-slate-300 hover:text-red-500 transition-all hover:scale-110"
                                            >
                                                <span className="material-symbols-outlined text-[20px] font-bold">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <p className="text-slate-400 font-bold text-sm">No categories found matching your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
