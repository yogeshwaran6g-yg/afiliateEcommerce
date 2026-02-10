import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [expandedOrder, setExpandedOrder] = useState("#ORD-7721");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-slate-50 font-display">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Order History</h1>
              <p className="text-slate-500 mt-1">
                Monitor your personal orders and distribution logistics.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.name
                  ? "border-b-2 border-primary text-primary"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab.name}
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    PV Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-8 bg-primary rounded-full"></div>
                          <span className="font-bold text-slate-900">{order.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                          <span className="material-symbols-outlined text-amber-500 text-base">
                            stars
                          </span>
                          {order.pv} PV
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.tracking ? (
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="text-primary font-semibold text-sm hover:underline"
                          >
                            {expandedOrder === order.id ? "Hide" : "Tracking"}
                          </button>
                        ) : order.status === "Cancelled" ? (
                          <button className="text-primary font-semibold text-sm hover:underline">
                            Reorder
                          </button>
                        ) : (
                          <button className="text-slate-600 font-semibold text-sm hover:underline">
                            Details
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Tracking Details */}
                    {expandedOrder === order.id && order.tracking && (
                      <tr>
                        <td colSpan="6" className="px-6 py-6 bg-slate-50">
                          <div className="flex gap-8">
                            {/* Left: Tracking Info */}
                            <div className="w-1/3 space-y-4">
                              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                                <span className="material-symbols-outlined text-primary">
                                  local_shipping
                                </span>
                                Tracking Detail - {order.id}
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Courier</span>
                                  <span className="text-sm font-semibold text-slate-900">
                                    {order.tracking.courier}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Tracking ID</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900">
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
                                  <span className="text-sm text-slate-500">Est. Delivery</span>
                                  <span className="text-sm font-semibold text-slate-900">
                                    {order.tracking.estDelivery}
                                  </span>
                                </div>
                              </div>

                              <button className="w-full mt-4 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white transition-colors">
                                View Full Invoice
                              </button>
                            </div>

                            {/* Right: Timeline */}
                            <div className="flex-1">
                              <div className="space-y-4">
                                {order.tracking.timeline.map((event, index) => (
                                  <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-3 h-3 rounded-full ${event.completed
                                          ? event.current
                                            ? "bg-primary ring-4 ring-primary/20"
                                            : "bg-primary"
                                          : "bg-slate-300"
                                          }`}
                                      ></div>
                                      {index < order.tracking.timeline.length - 1 && (
                                        <div
                                          className={`w-0.5 h-16 ${event.completed ? "bg-primary" : "bg-slate-200"
                                            }`}
                                        ></div>
                                      )}
                                    </div>
                                    <div className="flex-1 pb-8">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-900">{event.title}</h4>
                                        {event.current && (
                                          <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold uppercase rounded">
                                            Current
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-400 mb-1">{event.date}</p>
                                      {event.description && (
                                        <p className="text-sm text-slate-600">{event.description}</p>
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing 1-4 of 24 orders
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-slate-600">chevron_left</span>
                </button>
                <button className="px-3 py-1 bg-primary text-white rounded-lg font-semibold text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  3
                </button>
                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Support Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">help</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h6 className="font-bold text-slate-900">Need assistance with an order?</h6>
              <p className="text-sm text-slate-500">
                Our 24/7 support team can help with logistics or PV discrepancies.
              </p>
            </div>
            <button className="w-full md:w-auto px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
            <div className="text-center md:text-left">© 2024 Fintech MLM Dashboard. All rights reserved.</div>
            <div className="flex items-center gap-4 md:gap-6">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Help Center</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
