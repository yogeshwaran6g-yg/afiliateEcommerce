import React, { useState } from "react";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [expandedOrder, setExpandedOrder] = useState("#ORD-7721");

  const tabs = [
    { name: "All Orders", count: 24 },
    { name: "Processing", count: 3 },
    { name: "Shipped", count: 5 },
    { name: "Delivered", count: 14 },
    { name: "Cancelled", count: 2 }
  ];

  const orders = [
    {
      id: "#ORD-7721",
      date: "Oct 24, 2023",
      pv: 120,
      amount: "$450.00",
      status: "In Transit",
      statusColor: "bg-blue-100 text-blue-700",
      tracking: {
        courier: "FedEx Express",
        trackingId: "FEX-1029384756",
        estDelivery: "Oct 28, 2023",
        timeline: [
          {
            title: "Order Placed",
            date: "Oct 24, 2023 • 09:12 AM",
            description: "Your order has been received and is waiting for validation.",
            completed: true
          },
          {
            title: "Packed & Handed Over",
            date: "Oct 25, 2023 • 14:45 PM",
            description: "Items verified and packed at our central distribution hub.",
            completed: true
          },
          {
            title: "Shipped",
            date: "Oct 26, 2023 • 10:20 AM",
            description: "In Transit - Package arrived at regional sorting facility (Chicago, IL).",
            completed: true,
            current: true
          },
          {
            title: "Out for Delivery",
            date: "Expected Oct 28, 2023",
            description: "Pending delivery signature",
            completed: false
          },
          {
            title: "Delivered",
            date: "Pending delivery signature",
            description: "",
            completed: false
          }
        ]
      }
    },
    {
      id: "#ORD-7718",
      date: "Oct 20, 2023",
      pv: 85,
      amount: "$210.50",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-700"
    },
    {
      id: "#ORD-7699",
      date: "Oct 15, 2023",
      pv: 210,
      amount: "$890.00",
      status: "Processing",
      statusColor: "bg-yellow-100 text-yellow-700"
    },
    {
      id: "#ORD-7650",
      date: "Oct 02, 2023",
      pv: 45,
      amount: "$95.00",
      status: "Cancelled",
      statusColor: "bg-slate-100 text-slate-700"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Order History</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Monitor your personal orders and distribution logistics.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-base md:text-lg">calendar_month</span>
            Last 30 Days
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-base md:text-lg">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-semibold whitespace-nowrap transition-colors relative ${activeTab === tab.name
              ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab.name}
            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table - Wrapped in overflow-x-auto */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  PV Value
                </th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full hidden xs:block"></div>
                        <span className="font-bold text-slate-900 text-sm">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{order.date}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1 text-xs md:text-sm font-semibold text-slate-700">
                        <span className="material-symbols-outlined text-amber-500 text-base">
                          stars
                        </span>
                        {order.pv} PV
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-slate-900">
                      {order.amount}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      {order.tracking ? (
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="text-primary font-bold text-xs md:text-sm hover:underline"
                        >
                          {expandedOrder === order.id ? "Hide" : "Track"}
                        </button>
                      ) : (
                        <button className="text-slate-400 font-bold text-xs md:text-sm h-8 w-8 hover:bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Tracking Details - Responsive Grid */}
                  {expandedOrder === order.id && order.tracking && (
                    <tr className="bg-slate-50">
                      <td colSpan="6" className="px-4 md:px-8 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Left: Tracking Info */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                              <span className="material-symbols-outlined text-primary">
                                local_shipping
                              </span>
                              Tracking Detail
                            </div>

                            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Courier</span>
                                <span className="text-xs font-bold text-slate-900">
                                  {order.tracking.courier}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Tracking ID</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">
                                    {order.tracking.trackingId}
                                  </span>
                                  <button className="text-primary">
                                    <span className="material-symbols-outlined text-base">
                                      content_copy
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Est. Delivery</span>
                                <span className="text-xs font-bold text-slate-900">
                                  {order.tracking.estDelivery}
                                </span>
                              </div>
                            </div>

                            <button className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                              View Full Invoice
                            </button>
                          </div>

                          {/* Right: Timeline */}
                          <div className="lg:col-span-2">
                            <div className="space-y-0 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                              {order.tracking.timeline.map((event, index) => (
                                <div key={index} className="flex gap-4 relative">
                                  <div className="z-10 bg-slate-50 py-1">
                                    <div
                                      className={`w-3.5 h-3.5 rounded-full border-2 border-white ${event.completed
                                        ? event.current
                                          ? "bg-primary ring-4 ring-primary/20"
                                          : "bg-primary"
                                        : "bg-slate-300"
                                        }`}
                                    ></div>
                                  </div>
                                  <div className="flex-1 pb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-slate-900 text-sm">{event.title}</h4>
                                      {event.current && (
                                        <span className="px-1.5 py-0.5 bg-primary text-white text-[9px] font-bold uppercase rounded">
                                          Current
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mb-1">{event.date}</p>
                                    {event.description && (
                                      <p className="text-xs text-slate-600 line-clamp-2">{event.description}</p>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Simplified on mobile */}
        <div className="px-4 md:px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-[10px] md:text-sm text-slate-500 font-medium">
            Showing 1-4 of 24
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-1.5 border border-slate-300 rounded-lg hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-slate-600 text-lg">chevron_left</span>
            </button>
            <button className="h-8 w-8 bg-primary text-white rounded-lg font-bold text-xs md:text-sm">
              1
            </button>
            <button className="h-8 w-8 border border-slate-300 rounded-lg font-bold text-xs md:text-sm text-slate-600 hover:bg-white transition-colors">
              2
            </button>
            <button className="p-1.5 border border-slate-300 rounded-lg hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-slate-600 text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Support Banner - Stacked on mobile */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white">support_agent</span>
        </div>
        <div className="flex-1">
          <h6 className="font-bold text-white text-base">Need assistance with an order?</h6>
          <p className="text-sm text-slate-400">
            Our 24/7 support team can help with logistics or PV discrepancies.
          </p>
        </div>
        <button className="w-full md:w-auto px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Get Help
        </button>
      </div>
    </div>
  );
}
