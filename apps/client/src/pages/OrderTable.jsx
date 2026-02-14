import React from "react";

export default function OrderTable({ orders, expandedOrder, setExpandedOrder }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              {/* <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PV Value</th> */}
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 md:px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full hidden xs:block"></div>
                        <span className="font-bold text-slate-900 text-sm">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{order.date}</td>
                    {/* <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1 text-xs md:text-sm font-semibold text-slate-700">
                        <span className="material-symbols-outlined text-amber-500 text-base">stars</span>
                        {order.pv} PV
                      </div>
                    </td> */}
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-slate-900">{order.amount}</td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      {order.tracking ? (
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="text-primary font-bold text-xs md:text-sm hover:underline"
                        >
                          {isExpanded ? "Hide" : "Track"}
                        </button>
                      ) : (
                        <button className="text-slate-400 font-bold text-xs md:text-sm h-8 w-8 hover:bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                      )}
                    </td>
                  </tr>

                  {isExpanded && order.tracking && (
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="px-4 md:px-8 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                              <span className="material-symbols-outlined text-primary">local_shipping</span>
                              Tracking Detail
                            </div>

                            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Courier</span>
                                <span className="text-xs font-bold text-slate-900">{order.tracking.courier}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Tracking ID</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">{order.tracking.trackingId}</span>
                                  <button className="text-primary">
                                    <span className="material-symbols-outlined text-base">content_copy</span>
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Est. Delivery</span>
                                <span className="text-xs font-bold text-slate-900">{order.tracking.estDelivery}</span>
                              </div>
                            </div>

                            <button className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                              View Full Invoice
                            </button>
                          </div>

                          <div className="lg:col-span-2">
                            <div className="space-y-0 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                              {order.tracking.timeline.map((step, i) => (
                                <div key={i} className="flex gap-4 relative">
                                  <div className="z-10 bg-slate-50 py-1">
                                    <div
                                      className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
                                        step.completed
                                          ? step.current
                                            ? "bg-primary ring-4 ring-primary/20"
                                            : "bg-primary"
                                          : "bg-slate-300"
                                      }`}
                                    />
                                  </div>
                                  <div className="flex-1 pb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                                      {step.current && (
                                        <span className="px-1.5 py-0.5 bg-primary text-white text-[9px] font-bold uppercase rounded">
                                          Current
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mb-1">{step.date}</p>
                                    {step.description && (
                                      <p className="text-xs text-slate-600 line-clamp-2">{step.description}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 md:px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
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
      </div>
    </div>
  );
}