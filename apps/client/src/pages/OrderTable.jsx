import React from "react";

export default function OrderTable({ orders, expandedOrder, setExpandedOrder, orderDetails }) {

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PROCESSING': return "bg-blue-100 text-blue-700";
      case 'SHIPPED': return "bg-yellow-100 text-yellow-700";
      case 'DELIVERED': return "bg-green-100 text-green-700";
      case 'CANCELLED': return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 md:px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const details = orderDetails[order.id];
              const statusColor = getStatusColor(order.status);

              return (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full hidden xs:block"></div>
                        <span className="font-bold text-slate-900 text-sm">{order.order_number}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{formatDate(order.created_at)}</td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-slate-900">₹{order.total_amount}</td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button
                        onClick={() => setExpandedOrder(order.id)}
                        className="text-primary font-bold text-xs md:text-sm hover:underline"
                      >
                        {isExpanded ? "Hide" : "Track"}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="px-4 md:px-8 py-6">
                        {details ? (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Items Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                                Order Items
                              </div>
                              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                                {details.items && details.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                    <div>
                                      <p className="text-sm font-bold text-slate-900">{item.product_name}</p>
                                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">₹{item.price}</p>
                                  </div>
                                ))}
                                <div className="flex justify-between pt-2 border-t border-slate-200">
                                  <span className="font-bold text-slate-900">Total</span>
                                  <span className="font-bold text-primary">₹{order.total_amount}</span>
                                </div>
                              </div>
                            </div>

                            {/* Tracking Section */}
                            <div className="lg:col-span-2 space-y-8">
                              {/* Shipping Address Section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                                  Shipping Address
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                  {details.shipping_address ? (() => {
                                    try {
                                      const addr = typeof details.shipping_address === 'string' 
                                        ? JSON.parse(details.shipping_address) 
                                        : details.shipping_address;
                                      return (
                                        <div className="space-y-1">
                                          <p className="text-sm font-bold text-slate-900">{addr.address}</p>
                                          <p className="text-sm text-slate-700">{addr.city}, {addr.state} - {addr.pincode}</p>
                                        </div>
                                      );
                                    } catch (e) {
                                      return <p className="text-sm text-slate-600">{details.shipping_address}</p>;
                                    }
                                  })() : (
                                    <p className="text-sm text-slate-500 italic">No shipping address recorded for this order.</p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                                  <span className="material-symbols-outlined text-primary">history</span>
                                  Tracking Timeline
                                </div>
                                <div className="space-y-0 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 ml-2">
                                  {details.tracking && details.tracking.map((step, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                      <div className="z-10 bg-slate-50 py-1">
                                        <div
                                          className={`w-3.5 h-3.5 rounded-full border-2 border-white bg-primary`}
                                        />
                                      </div>
                                      <div className="flex-1 pb-6">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mb-1">{new Date(step.status_time).toLocaleString()}</p>
                                        {step.description && (
                                          <p className="text-xs text-slate-600 line-clamp-2">{step.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {(!details.tracking || details.tracking.length === 0) && (
                                    <p className="text-sm text-slate-500 italic pl-6">No tracking updates yet.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">Loading details...</div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Static for now) */}
      {/* <div className="px-4 md:px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="text-[10px] md:text-sm text-slate-500 font-medium">Showing 1-4 of 24</div>
        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-1.5 border border-slate-300 rounded-lg hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-lg">chevron_left</span>
          </button>
          <button className="h-8 w-8 bg-primary text-white rounded-lg font-bold text-xs md:text-sm">1</button>
          <button className="h-8 w-8 border border-slate-300 rounded-lg font-bold text-xs md:text-sm text-slate-600 hover:bg-white transition-colors">2</button>
          <button className="p-1.5 border border-slate-300 rounded-lg hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-lg">chevron_right</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}