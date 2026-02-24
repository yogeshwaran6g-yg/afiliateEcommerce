import React from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const ProductList = ({ 
    products, 
    searchTerm, 
    setSearchTerm, 
    startIndex, 
    itemsPerPage, 
    onEdit, 
    onDelete 
}) => {
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
        // Default placeholder
        let imageUrl = "https://placehold.co/400x400/f8fafc/1e293b?text=No+Image";

        if (typeof firstImage === 'string' && firstImage.trim() !== "") {
            if (firstImage.startsWith('http')) {
                imageUrl = firstImage;
            } else if (firstImage.startsWith('/uploads/products/')) {
                imageUrl = `${BACKEND_URL}${firstImage}`;
            } else {
                // Remove leading slash if any
                const cleanPath = firstImage.startsWith('/') ? firstImage.substring(1) : firstImage;
                imageUrl = `${BACKEND_URL}/uploads/products/${cleanPath}`;
            }
        }
        return imageUrl;
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
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
                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                        Showing {products.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, products.length)} of {products.length} results
                    </p>
                </div>
            </div>

            {/* Mobile Grid Layout */}
            <div className="block md:hidden p-4 space-y-4">
                {products.map((prod, i) => {
                    const images = getProductImages(prod);
                    const imageUrl = getFirstImageUrl(images);

                    return (
                        <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-200/50 shrink-0">
                                    <img src={imageUrl} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1584017444311-6ad0998fcebe?w=100&h=100&fit=crop"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-black text-[#172b4d] truncate">{prod.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">SKU: {prod.slug?.toUpperCase()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${prod.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                        {prod.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 h-px bg-slate-100/50 w-full"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-[#172b4d]">₹{Number(prod.sale_price).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <span className={`text-base font-bold ${prod.stock <= prod.low_stock_alert ? 'text-amber-600' : 'text-slate-600'}`}>{prod.stock} Units</span>
                                        {prod.stock <= prod.low_stock_alert && (
                                            <span className="material-symbols-outlined text-amber-500 text-lg animate-pulse">report_problem</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <button
                                    onClick={() => onEdit(prod)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Edit Product
                                </button>
                                <div className="w-4"></div>
                                <button
                                    onClick={() => onDelete(prod.id)}
                                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-50/70 border-b border-slate-50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT DETAILS</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRICING</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">INVENTORY</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
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
                                                <img src={imageUrl} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1584017444311-6ad0998fcebe?w=100&h=100&fit=crop"} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#172b4d]">{prod.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 leading-none">SKU: {prod.slug?.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[#172b4d]">₹{Number(prod.sale_price).toLocaleString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-600">{prod.stock} Units</span>
                                            {(prod.stock <= prod.low_stock_alert) && (
                                                <span className="material-symbols-outlined text-amber-500 text-lg font-black animate-pulse">report_problem</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {prod.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 text-slate-400">
                                            <button
                                                onClick={() => onEdit(prod)}
                                                className="hover:text-primary transition-all hover:scale-110"
                                            >
                                                <span className="material-symbols-outlined text-[20px] font-bold">edit</span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(prod.id)}
                                                className="hover:text-red-500 transition-all hover:scale-110"
                                            >
                                                <span className="material-symbols-outlined text-[20px] font-bold">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
