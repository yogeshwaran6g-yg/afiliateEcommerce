import React, { useState } from "react";

const ProductDrawer = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-[#172b4d]/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-2xl bg-white h-screen overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
                <div className="sticky top-0 bg-white z-10 px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#172b4d]">Add New Product</h2>
                        <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest leading-none">Define your product and MLM point value parameters</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <span className="material-symbols-outlined font-bold">close</span>
                    </button>
                </div>

                <div className="p-10 space-y-12 pb-32">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BASIC INFORMATION</label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#172b4d] ml-1">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Premium Immune Support"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#172b4d] ml-1">SKU Code</label>
                                    <input
                                        type="text"
                                        defaultValue="WLNS-001"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#172b4d] ml-1">Category</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer">
                                        <option>Wellness</option>
                                        <option>Skincare</option>
                                        <option>Devices</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#172b4d] ml-1">Description</label>
                                <textarea
                                    placeholder="Enter product details and benefits..."
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PRODUCT MEDIA</label>
                        <div className="border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 p-12 flex flex-col items-center justify-center text-center group hover:bg-slate-50 hover:border-primary/20 transition-all cursor-pointer">
                            <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl font-bold">cloud_upload</span>
                            </div>
                            <div className="mt-6">
                                <p className="text-lg font-black text-[#172b4d]">Click to upload or drag & drop</p>
                                <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">SVG, PNG, JPG (max. 800×800px)</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PRICING & COMMISSION (PV)</label>
                        <div className="bg-slate-50 rounded-3xl p-8 grid grid-cols-3 gap-6 border border-slate-100">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">RETAIL PRICE</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                    <input type="number" placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">MEMBER PRICE</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                    <input type="number" placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">PV MAPPING</label>
                                <div className="relative group">
                                    <input type="number" placeholder="0.00" className="w-full bg-blue-50 border border-primary/20 rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 pr-10" />
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-lg opacity-40 group-hover:opacity-100 transition-opacity">deployed_code</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">INVENTORY MANAGEMENT</label>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#172b4d] ml-1">Current Stock</label>
                                <input type="number" defaultValue="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#172b4d] ml-1">Low Stock Threshold</label>
                                <input type="number" defaultValue="10" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#172b4d] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-slate-50 flex items-center justify-end gap-4 z-20">
                    <button
                        onClick={onClose}
                        className="px-8 py-3.5 text-slate-600 text-sm font-black hover:bg-slate-50 rounded-2xl transition-all"
                    >
                        Discard
                    </button>
                    <button className="px-8 py-3.5 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 leading-none">
                        Save Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Products() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const products = [
        { name: "Vitality Multi-Vitamin", sku: "WLNS-07-2023-00-42", price: "$124.00", pv: "85 PV", status: "Active", stock: "1,240 Units", img: "https://images.unsplash.com/photo-1584017444311-6ad0998fcebe?w=100&h=100&fit=crop" },
        { name: "Glow Radiance Serum", sku: "SKTN-05-2023-11-20", price: "$89.50", pv: "60 PV", status: "Active", stock: "850 Units", img: "https://images.unsplash.com/photo-1620916566398-39f1143af7be?w=100&h=100&fit=crop" },
        { name: "Zen Pure Matcha Tea", sku: "WLNS-02-2023-09-15", price: "$49.00", pv: "35 PV", status: "Low Stock", stock: "12 Units", img: "https://images.unsplash.com/photo-1582733315328-d89d901c809b?w=100&h=100&fit=crop" },
    ];

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <span>Home</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary font-black">Product Management</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#172b4d] tracking-tight">Enterprise Product Catalog</h2>
                    <p className="text-sm text-slate-500 font-medium">Create, manage, and distribute products across your global MLM platform.</p>
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group leading-none"
                >
                    <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
                <div className="relative z-10 flex flex-col justify-center">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Total Active Products</h5>
                    <div className="flex items-center gap-4">
                        <div className="text-3xl md:text-4xl font-black text-[#172b4d] tracking-tighter leading-tight">1,240</div>
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-lg border border-green-100 h-fit mt-1">
                            <span className="material-symbols-outlined text-xs font-black">trending_up</span>
                            <span>+3.5%</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mt-3 leading-none tracking-wide">Syncing with global fulfillment centers...</p>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 text-slate-50 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none">
                    <span className="material-symbols-outlined text-[150px] md:text-[200px] leading-none select-none">inventory</span>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative w-full lg:w-96 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or category..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4">
                        <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                            <span className="material-symbols-outlined font-bold">tune</span>
                        </button>
                        <div className="hidden md:block w-px h-8 bg-slate-100 mx-2"></div>
                        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Showing 1 to 3 of 1,240 results</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/70 border-b border-slate-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT DETAILS</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRICING & PV</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">INVENTORY</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((prod, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border border-slate-100 shrink-0">
                                                <img src={prod.img} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#172b4d]">{prod.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 leading-none">SKU: {prod.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[#172b4d]">{prod.price}</p>
                                            <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest">
                                                <span className="material-symbols-outlined text-sm font-black">deployed_code</span>
                                                <span>{prod.pv}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-600">{prod.stock}</span>
                                            {prod.status === "Low Stock" && (
                                                <span className="material-symbols-outlined text-amber-500 text-lg font-black animate-pulse">report_problem</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${prod.status === "Active" ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 text-slate-400">
                                            <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px] font-bold">edit</span></button>
                                            <button className="hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px] font-bold">delete</span></button>
                                            <button className="hover:text-slate-600 transition-colors"><span className="material-symbols-outlined text-[20px] font-bold">more_vert</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
}
