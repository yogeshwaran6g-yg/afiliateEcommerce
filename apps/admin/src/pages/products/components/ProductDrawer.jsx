import React, { useState, useEffect } from "react";
import productApiService from "../../../services/productApiService";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:4000";

const ProductDrawer = ({ isOpen, onClose, product, categories, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category_id: "",
        short_desc: "",
        long_desc: "",
        original_price: "",
        sale_price: "",
        stock: "0",
        low_stock_alert: "10",
        is_active: 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                category_id: product.category_id || "",
                short_desc: product.short_desc || "",
                long_desc: product.long_desc || "",
                original_price: product.original_price || "",
                sale_price: product.sale_price || "",
                stock: product.stock || "0",
                low_stock_alert: product.low_stock_alert || "10",
                is_active: product.is_active ?? 1
            });

            // Handle image preview for edit
            let images = [];
            try {
                images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");
            } catch (e) {
                images = product.images ? [product.images] : [];
            }
            if (images.length > 0) {
                const img = images[0];
                if (img.startsWith('http')) {
                    setImagePreview(img);
                } else if (img.startsWith('/uploads/products/')) {
                    setImagePreview(`${BACKEND_URL}${img}`);
                } else {
                    const cleanPath = img.startsWith('/') ? img.substring(1) : img;
                    setImagePreview(`${BACKEND_URL}/uploads/products/${cleanPath}`);
                }
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                name: "",
                slug: "",
                category_id: "",
                short_desc: "",
                long_desc: "",
                original_price: "",
                sale_price: "",
                stock: "0",
                low_stock_alert: "10",
                is_active: 1
            });
            setImagePreview(null);
            setImageFile(null);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const slugify = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            if (name === "name" && !product) { // Only auto-slug during creation
                newData.slug = slugify(value);
            }
            return newData;
        });
    };

    const handleRefreshSlug = () => {
        setFormData(prev => ({
            ...prev,
            slug: slugify(prev.name) + (prev.name ? "-" + Math.random().toString(36).substring(2, 5) : "")
        }));
    };

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
            setLoading(true);
            const data = new FormData();
            
            // Check if we are updating and only send changed fields
            if (product?.id) {
                let hasChanges = false;
                Object.keys(formData).forEach(key => {
                    const newValue = formData[key];
                    const oldValue = product[key];
                    
                    // Comparison logic (handle string vs number)
                    if (String(newValue) !== String(oldValue ?? "")) {
                        data.append(key, newValue);
                        hasChanges = true;
                    }
                });

                if (imageFile) {
                    data.append('images', imageFile);
                    hasChanges = true;
                }

                if (!hasChanges) {
                    toast.info("No changes detected");
                    onClose();
                    return;
                }

                await productApiService.updateProduct(product.id, data);
                toast.success("Product updated successfully");
            } else {
                // Creation: send everything
                Object.keys(formData).forEach(key => {
                    let value = formData[key];
                    if (typeof value === 'string') value = value.trim();
                    if ((['original_price', 'sale_price', 'stock', 'low_stock_alert'].includes(key)) && value === "") {
                        value = "0";
                    }
                    data.append(key, value);
                });
                if (imageFile) {
                    data.append('images', imageFile);
                }
                await productApiService.createProduct(data);
                toast.success("Product published successfully");
            }
            onSuccess();
            onClose();
        } catch (err) {
            const errorMsg = err.message || "Failed to save product";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-[#172b4d]/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            <form onSubmit={handleSubmit} className="relative w-full max-w-2xl bg-white h-screen flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 shadow-2xl">
                <div className="shrink-0 bg-white/95 backdrop-blur-md z-10 px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#172b4d] tracking-tight">{product ? "Edit Product" : "Add New Product"}</h2>
                        <p className="text-[10px] text-primary font-bold mt-0.5 uppercase tracking-widest leading-none">Define your product parameters</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all hover:rotate-90"
                    >
                        <span className="material-symbols-outlined font-bold">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-100"></div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">BASIC INFORMATION</label>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Product Name <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Premium Immune Support"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center justify-between">
                                        <span>SKU Code (Slug) <span className="text-primary">*</span></span>
                                        <button
                                            type="button"
                                            onClick={handleRefreshSlug}
                                            className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[10px] font-bold">magic_button</span>
                                            Generate
                                        </button>
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="wlns-001"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Category <span className="text-primary">*</span></label>
                                    <div className="relative group">
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm pr-10"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary group-focus-within:rotate-180 transition-all font-bold text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Short Description <span className="text-primary">*</span></label>
                                <textarea
                                    name="short_desc"
                                    value={formData.short_desc}
                                    onChange={handleInputChange}
                                    placeholder="Brief summary..."
                                    rows="2"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Description <span className="text-primary">*</span></label>
                                <textarea
                                    name="long_desc"
                                    value={formData.long_desc}
                                    onChange={handleInputChange}
                                    placeholder="Enter full product details and benefits..."
                                    rows="5"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-semibold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all resize-none shadow-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-100"></div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">PRODUCT MEDIA</label>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>
                        <div className="relative group/upload">
                            <input
                                type="file"
                                id="product-image"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <label
                                htmlFor="product-image"
                                className="border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 p-10 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative min-h-[180px] shadow-inner"
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-full min-h-[180px]">
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white p-3 rounded-full shadow-lg text-primary scale-75 group-hover:scale-100 transition-transform">
                                                <span className="material-symbols-outlined text-2xl font-bold">cached</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-primary/10 transition-all duration-300">
                                            <span className="material-symbols-outlined text-3xl font-bold">add_photo_alternate</span>
                                        </div>
                                        <div className="mt-5">
                                            <p className="text-sm font-bold text-[#172b4d]">Drop image or click to browse</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest bg-white border border-slate-100 px-2.5 py-1 rounded-full inline-block">PNG, JPG (MAX. 2MB)</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Pricing & Stock Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pricing */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-100"></div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">PRICING</label>
                                <div className="h-px flex-1 bg-slate-100"></div>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl p-6 space-y-4 border border-slate-100 shadow-inner">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Retail Price (₹)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="original_price"
                                            value={formData.original_price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Sale Price (₹)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="sale_price"
                                            value={formData.sale_price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-100"></div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">INVENTORY</label>
                                <div className="h-px flex-1 bg-slate-100"></div>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl p-6 space-y-4 border border-slate-100 shadow-inner">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Current Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Low Stock Alert</label>
                                    <input
                                        type="number"
                                        name="low_stock_alert"
                                        value={formData.low_stock_alert}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-amber-600 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-100"></div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">AVAILABILITY STATUS</label>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>
                        <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="is_active"
                                        value="1"
                                        checked={formData.is_active == 1}
                                        onChange={handleInputChange}
                                        className="peer hidden"
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-200 rounded-full peer-checked:border-primary peer-checked:bg-white transition-all flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 peer-checked:text-[#172b4d] ml-1">Active</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="is_active"
                                        value="0"
                                        checked={formData.is_active == 0}
                                        onChange={handleInputChange}
                                        className="peer hidden"
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-200 rounded-full peer-checked:border-slate-400 peer-checked:bg-white transition-all flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 peer-checked:text-[#172b4d] ml-1">Inactive</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 p-6 bg-white border-t border-slate-50 flex items-center justify-between gap-4 z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-3 text-slate-500 text-[11px] font-black hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                        <span>Discard</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-[#172b4d] text-white text-[11px] font-black rounded-xl shadow-xl shadow-[#172b4d]/20 hover:bg-[#1a335a] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 uppercase tracking-[0.15em] disabled:opacity-50 disabled:grayscale"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <span className="material-symbols-outlined text-lg">verified</span>
                        )}
                        <span>{product ? "Update Product" : "Publish Product"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductDrawer;
