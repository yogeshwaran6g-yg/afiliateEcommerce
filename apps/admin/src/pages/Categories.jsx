import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryApiService from "../services/categoryApiService";

const CategoryDrawer = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await categoryApiService.createCategory({ name });
            onSuccess();
            onClose();
            setName("");
        } catch (err) {
            alert(err.message || "Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-[#172b4d]/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white h-screen overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
                <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-[#172b4d]">Add New Category</h2>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest leading-none">Create a new product group</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <span className="material-symbols-outlined font-bold">close</span>
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#172b4d] ml-1">Category Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Wellness, Skincare"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-slate-50 flex items-center justify-end gap-4 z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-slate-600 text-sm font-black hover:bg-slate-50 rounded-xl transition-all"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white text-sm font-black rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 leading-none disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? This might affect products in this category.")) {
            try {
                await categoryApiService.deleteCategory(id);
                fetchCategories();
            } catch (err) {
                alert(err.message || "Failed to delete category");
            }
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
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
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group leading-none"
                    >
                        <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
                        <span>Add New Category</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
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
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50/70 border-b border-slate-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CATEGORY NAME</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CREATED AT</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black uppercase text-xs">
                                                {cat.name.charAt(0)}
                                            </div>
                                            <h4 className="text-sm font-black text-[#172b4d]">{cat.name}</h4>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-500">{new Date(cat.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-all hover:scale-110"
                                        >
                                            <span className="material-symbols-outlined text-[20px] font-bold">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CategoryDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSuccess={fetchCategories}
            />
        </div>
    );
}
