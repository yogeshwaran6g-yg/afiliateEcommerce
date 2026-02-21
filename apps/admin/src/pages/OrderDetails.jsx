import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderApiService from "../services/orderApiService";

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderApiService.getOrderDetails(id);
            setOrder(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Order Data...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-4 md:p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
                <div className="bg-red-50 border border-red-100 p-8 rounded-4xl text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h3 className="text-xl font-black text-red-900 mb-2">Sync Failure</h3>
                    <p className="text-red-700 font-medium mb-6">{error || "Order not found"}</p>
                    <button onClick={() => navigate('/orders')} className="px-6 py-3 bg-red-500 text-white text-sm font-black rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Back to Orders</button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        <button onClick={() => navigate('/orders')} className="hover:text-primary transition-colors">Orders</button>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary font-bold">{order.order_number}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Order Details</h2>
                    <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">Full breakdown of customer order, payment, and fulfillment status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Order Items & Customer Info */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Items Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-lg font-black text-[#172b4d]">Order Items</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/70 border-b border-slate-50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRICE</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">QTY</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/50 shrink-0 overflow-hidden">
                                                        {/* Product Image placeholder or logic */}
                                                        <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-slate-300">inventory_2</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[#172b4d]">{item.product_name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {item.product_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-[#172b4d]">₹{Number(item.price).toLocaleString()}</td>
                                            <td className="px-8 py-6 text-sm font-bold text-[#172b4d] text-center">{item.quantity}</td>
                                            <td className="px-8 py-6 text-sm font-black text-[#172b4d] text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50/30">
                                    <tr>
                                        <td colSpan="3" className="px-8 py-4 text-sm font-bold text-[#172b4d] text-right">Subtotal</td>
                                        <td className="px-8 py-4 text-sm font-black text-[#172b4d] text-right">₹{Number(order.total_amount - order.shipping_cost).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="px-8 py-4 text-sm font-bold text-slate-400 text-right">Shipping</td>
                                        <td className="px-8 py-4 text-sm font-black text-[#172b4d] text-right">₹{Number(order.shipping_cost).toLocaleString()}</td>
                                    </tr>
                                    <tr className="border-t border-slate-100">
                                        <td colSpan="3" className="px-8 py-6 text-base font-black text-primary text-right uppercase tracking-[.25em]">Grand Total</td>
                                        <td className="px-8 py-6 text-xl font-black text-primary text-right">₹{Number(order.total_amount).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Shipping & Payment Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                <h3 className="text-lg font-black text-[#172b4d]">Shipping Details</h3>
                            </div>
                            <div className="space-y-4 text-sm font-medium text-slate-600">
                                {order.shipping_address ? (
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 leading-relaxed font-bold">
                                        {/* Assuming address is JSON string stored in DB */}
                                        {typeof order.shipping_address === 'string' ? order.shipping_address : JSON.stringify(order.shipping_address)}
                                    </div>
                                ) : (
                                    <p className="italic text-slate-400">No shipping address provided.</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                <h3 className="text-lg font-black text-[#172b4d]">Payment Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Method</span>
                                    <span className="text-sm font-black text-[#172b4d]">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                                {order.transaction_reference && (
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ref No.</span>
                                        <span className="text-sm font-black text-[#172b4d] truncate max-w-[150px]">{order.transaction_reference}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Tracking */}
                <div className="space-y-10">
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">person</span>
                            <h3 className="text-lg font-black text-[#172b4d]">Customer</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xl border border-primary/10">
                                {order.user_name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-black text-[#172b4d] truncate">{order.user_name}</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 mt-1">{order.user_phone}</p>
                            </div>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                <span>{order.user_email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Tracking Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <h3 className="text-lg font-black text-[#172b4d]">Order Timeline</h3>
                        </div>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-px before:bg-slate-100/50">
                            {order.tracking?.map((step, idx) => (
                                <div key={idx} className="relative flex items-start gap-6 group">
                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-transform group-hover:scale-110 ${idx === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-sm font-black">{idx === 0 ? 'check_circle' : 'radio_button_checked'}</span>
                                    </div>
                                    <div className="pt-1">
                                        <h4 className={`text-sm font-black ${idx === 0 ? 'text-[#172b4d]' : 'text-slate-400'}`}>{step.title}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">{step.description}</p>
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">{new Date(step.status_time).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
