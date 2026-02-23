import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import productApiService from "../services/productApiService";
import categoryApiService from "../services/categoryApiService";
import { toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/common/Pagination";

const ProductDrawer = ({ isOpen, onClose, product, categories, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category_id: "1",
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
                category_id: product.category_id || "1",
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
                setImagePreview(img.startsWith('http') ? img : `http://localhost:4000/uploads/products/${img}`);
            }
        } else {
            setFormData({
                name: "",
                slug: "",
                category_id: "1",
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

            // Auto-generate slug if name changes and user hasn't manually edited slug yet
            if (name === "name") {
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
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (imageFile) {
                data.append('images', imageFile);
            }

            if (product?.id) {
                await productApiService.updateProduct(product.id, data);
                toast.success("Product updated successfully");
            } else {
                await productApiService.createProduct(data);
                toast.success("Product published successfully");
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to save product");
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
                        <h2 className="font-bold text-[#172b4d] tracking-tight">{product ? "Edit Product" : "Add New Product"}</h2>
                        <p className="text-primary font-bold mt-0.5 uppercase tracking-widest leading-none">Define your product parameters</p>
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
                        className="px-5 py-3 text-slate-500 text-[11px] font-bold hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                        <span>Discard</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-[#172b4d] text-white text-[11px] font-bold rounded-xl shadow-xl shadow-[#172b4d]/20 hover:bg-[#1a335a] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 uppercase tracking-[0.15em] disabled:opacity-50 disabled:grayscale"
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

export default function Products() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get("search");

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParam || "");
    const [limit, setLimit] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (searchParam !== null) {
            setSearchTerm(searchParam);
        }
    }, [searchParam]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const IMAGE_BASE_URL = 'http://localhost:4000/uploads/products/';

    const getProductImages = (prod) => {
        let images = [];
        if (Array.isArray(prod.images)) {
            images = prod.images;
        } else {
            try {
                images = JSON.parse(prod.images || "[]");
                if (!Array.isArray(images)) images = [images];
            } catch (e) {
                images = prod.images ? [prod.images] : [];
            }
        }
        return images;
    };

    const getFirstImageUrl = (images) => {
        const firstImage = images[0];
        let imageUrl = "https://images.unsplash.com/photo-1584017444311-6ad0998fcebe?w=100&h=100&fit=crop";

        if (typeof firstImage === 'string' && firstImage.trim() !== "") {
            if (firstImage.startsWith('http')) {
                imageUrl = firstImage;
            } else {
                const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
                const path = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
                imageUrl = `${base}${path}`;
            }
        }
        return imageUrl;
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryApiService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productApiService.getProducts({
                page: currentPage,
                limit: limit,
                search: debouncedSearchTerm
            });
            setProducts(response.products);
            setTotalProducts(response.total);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setDrawerOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productApiService.deleteProduct(id);
                toast.success("Product deleted successfully");
                fetchProducts();
            } catch (err) {
                toast.error(err.message || "Failed to delete product");
            }
        }
    };

    const handleOpenDrawer = () => {
        setSelectedProduct(null);
        setDrawerOpen(true);
    };

    // Reset to first page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    // Initial loading state only (when no data exists)
    const isInitialLoading = loading && products.length === 0;

    if (error) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="bg-red-50 border border-red-100 p-8 rounded-4xl text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h3 className="text-xl font-bold text-red-900 mb-2">Sync Failure</h3>
                    <p className="text-red-700 font-medium mb-6">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-6 py-3 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Retry Sync
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <span>Admin</span>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span className="text-primary font-bold">Products</span>
                    </div>
                    <h2 className="font-bold text-slate-800 tracking-tight">Products</h2>
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">Create and manage your enterprise product catalog.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/categories")}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 group leading-none"
                    >
                        <span className="material-symbols-outlined font-bold text-primary">category</span>
                        <span>Categories</span>
                    </button>
                    <button
                        onClick={handleOpenDrawer}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group leading-none"
                    >
                        <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
                <div className="relative z-10 flex flex-col justify-center">
                    <h5 className="font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Total Active Products</h5>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-[#172b4d] tracking-tighter leading-tight">{totalProducts}</div>
                        <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-lg border border-green-100 h-fit mt-1">
                            <span className="material-symbols-outlined font-bold">trending_up</span>
                            <span>Live</span>
                        </div>
                    </div>
                    <p className="text-slate-400 font-bold mt-3 leading-none tracking-wide">Syncing with global fulfillment centers...</p>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 text-slate-50 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none">
                    <span className="material-symbols-outlined text-[150px] md:text-[200px] leading-none select-none">inventory</span>
                </div>
            </div>

            {/* Desktop Table View / Mobile Card View Wrapper */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] relative">
                {/* Inline Loading Overlay */}
                {loading && products.length > 0 && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                        </div>
                    </div>
                )}

                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative w-full lg:w-96 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4">
                        <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                            <span className="material-symbols-outlined font-bold">tune</span>
                        </button>
                        <div className="hidden md:block w-px h-8 bg-slate-100 mx-2"></div>
                    </div>
                </div>

                {isInitialLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
                        <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">Loading Product Catalog...</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Grid Layout (Visible on small screens) */}
                        <div className="block md:hidden p-4 space-y-4">
                            {products.map((prod, i) => {
                                const images = getProductImages(prod);
                                const imageUrl = getFirstImageUrl(images);

                                return (
                                    <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-200/50 shrink-0">
                                                <img src={imageUrl} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[#172b4d] truncate">{prod.name}</h4>
                                                <p className="text-slate-400 font-bold uppercase tracking-wider mt-1">SKU: {prod.slug.toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${prod.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                                    {prod.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 h-px bg-slate-100/50 w-full"></div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-400 uppercase tracking-widest">Price & Reward</p>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#172b4d]">₹{Number(prod.sale_price).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="font-bold text-slate-400 uppercase tracking-widest">Inventory</p>
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`font-bold ${prod.stock <= prod.low_stock_alert ? 'text-amber-600' : 'text-slate-600'}`}>{prod.stock} Units</span>
                                                    {prod.stock <= prod.low_stock_alert && (
                                                        <span className="material-symbols-outlined text-amber-500 animate-pulse">report_problem</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <button
                                                onClick={() => handleEdit(prod)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                                Edit Product
                                            </button>
                                            <div className="w-4"></div>
                                            <button
                                                onClick={() => handleDelete(prod.id)}
                                                className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table Layout (Visible on md and up) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50/70 border-b border-slate-50">
                                    <tr>
                                        <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">PRODUCT DETAILS</th>
                                        <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">PRICING</th>
                                        <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">INVENTORY</th>
                                        <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest">STATUS</th>
                                        <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {products.map((prod, i) => {
                                        const images = getProductImages(prod);
                                        const imageUrl = getFirstImageUrl(images);

                                        return (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border border-slate-100 shrink-0">
                                                            <img src={imageUrl} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#172b4d]">{prod.name}</h4>
                                                            <p className="text-slate-400 font-bold uppercase tracking-wider mt-1 leading-none">SKU: {prod.slug.toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-[#172b4d]">₹{Number(prod.sale_price).toLocaleString()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-600">{prod.stock} Units</span>
                                                        {(prod.stock <= prod.low_stock_alert) && (
                                                            <span className="material-symbols-outlined text-amber-500 font-bold animate-pulse">report_problem</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-widest ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {prod.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 text-slate-400">
                                                        <button
                                                            onClick={() => handleEdit(prod)}
                                                            className="hover:text-primary transition-all hover:scale-110"
                                                        >
                                                            <span className="material-symbols-outlined font-bold">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(prod.id)}
                                                            className="hover:text-red-500 transition-all hover:scale-110"
                                                        >
                                                            <span className="material-symbols-outlined font-bold">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalProducts}
                            limit={limit}
                            onPageChange={setCurrentPage}
                            onLimitChange={setLimit}
                        />
                    </>
                )}
            </div>

            <ProductDrawer
                isOpen={isDrawerOpen}
                product={selectedProduct}
                categories={categories}
                onClose={() => setDrawerOpen(false)}
                onSuccess={fetchProducts}
            />
        </div>
    );
}
