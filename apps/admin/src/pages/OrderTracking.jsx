import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useOrderDetails, useAddOrderTrackingMutation, useOrders } from "../hooks/useOrder.hook";

export default function OrderTracking() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // URL params for deep linking
    const [searchParams] = useSearchParams();
    const orderNumberParam = searchParams.get("orderNumber");

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { data: searchResults, isLoading: searching } = useOrders({ search: searchQuery });
    const { data: order, isLoading: loadingOrder } = useOrderDetails(selectedOrderId);
    const addTrackingMutation = useAddOrderTrackingMutation();

    // Handle auto-search from URL param
    useEffect(() => {
        if (orderNumberParam && searchQuery !== orderNumberParam) {
            setSearchQuery(orderNumberParam);
        }
    }, [orderNumberParam]);

    useEffect(() => {
        if (searchResults?.orders?.length > 0 && searchQuery) {
            setSelectedOrderId(searchResults.orders[0].id);
        } else if (searchResults?.orders?.length === 0 && searchQuery) {
            setSelectedOrderId(null);
            toast.error("No order found");
        }
    }, [searchResults, searchQuery]);

    const handleAddTracking = async (e) => {
        e.preventDefault();
        if (!order || !title) return;

        try {
            await addTrackingMutation.mutateAsync({ orderId: order.id, title, description });
            toast.success("Tracking update added successfully");
            setTitle("");
            setDescription("");
        } catch (err) {
            toast.error("Failed to add tracking update");
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-slate-50/30 min-h-screen font-display">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                        <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-primary">Order Tracking</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Order Tracking</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Update and manage real-time tracking for customer orders.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search & Order Info Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800">Search Order</h3>
                        <form onSubmit={(e) => e.preventDefault()} className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Order # or User Name..."
                                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-medium ${searching ? 'animate-pulse' : ''}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        {order && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Number</span>
                                        <span className="text-xs font-bold text-slate-700">#{order.order_number}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                                        <span className="text-xs font-bold text-slate-700">{order.user_name}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tracking Form & Timeline Column */}
                <div className="lg:col-span-2 space-y-8">
                    {order ? (
                        <>
                            {/* Update Form */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Add New Update</h3>
                                <form onSubmit={handleAddTracking} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Update Title</label>
                                            <div className="relative group">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">label</span>
                                                <select
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-medium appearance-none"
                                                    required
                                                >
                                                    <option value="">Select Status Update</option>
                                                    <option value="Order Processing">Order Processing</option>
                                                    <option value="Packed & Ready">Packed & Ready</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="In Transit">In Transit</option>
                                                    <option value="Out For Delivery">Out For Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="Custom Update">Custom Update</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>

                                        {title === "Custom Update" && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Custom Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter title..."
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-medium"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Detailed Description</label>
                                        <textarea
                                            placeholder="Provide more details about this status (e.g., AWB Number, Delivery Partner details...)"
                                            rows="4"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-medium resize-none"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={addTrackingMutation.isPending}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {addTrackingMutation.isPending ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                                UPDATING...
                                            </div>
                                        ) : "POST TRACKING UPDATE"}
                                    </button>
                                </form>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                                <h3 className="text-lg font-bold text-slate-800 mb-8">Tracking History</h3>
                                <div className="relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>

                                    <div className="space-y-8 relative">
                                        {order.tracking?.length > 0 ? order.tracking.map((item, i) => (
                                            <div key={i} className="flex gap-8 group">
                                                <div className="relative z-10">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${i === 0 ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                                        <span className="material-symbols-outlined text-xl">
                                                            {item.title.toLowerCase().includes('shipped') ? 'local_shipping' :
                                                                item.title.toLowerCase().includes('delivered') ? 'task_alt' :
                                                                    item.title.toLowerCase().includes('transit') ? 'route' :
                                                                        'radio_button_checked'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 pt-1 pb-8 border-b border-slate-50 last:border-0">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                        <h4 className={`font-bold ${i === 0 ? 'text-slate-800' : 'text-slate-500'}`}>{item.title}</h4>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            {new Date(item.status_time).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.description}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12">
                                                <span className="material-symbols-outlined text-slate-200 text-5xl mb-4">history</span>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No tracking history available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-2">No Order Selected</h4>
                            <p className="text-xs text-slate-500 font-medium max-w-sm leading-relaxed">
                                Search for an order by its number or customer name to start updating its real-time tracking information.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
