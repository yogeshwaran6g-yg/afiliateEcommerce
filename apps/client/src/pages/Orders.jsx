import React, { useState } from "react";
import OrderTable from "./ordertable";
import SupportBanner from "./supportbanner";

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
          { title: "Order Placed", date: "Oct 24, 2023 • 09:12 AM", description: "Your order has been received and is waiting for validation.", completed: true },
          { title: "Packed & Handed Over", date: "Oct 25, 2023 • 14:45 PM", description: "Items verified and packed at our central distribution hub.", completed: true },
          { title: "Shipped", date: "Oct 26, 2023 • 10:20 AM", description: "In Transit - Package arrived at regional sorting facility (Chicago, IL).", completed: true, current: true },
          { title: "Out for Delivery", date: "Expected Oct 28, 2023", description: "Pending delivery signature", completed: false },
          { title: "Delivered", date: "Pending delivery signature", description: "", completed: false }
        ]
      }
    },
    { id: "#ORD-7718", date: "Oct 20, 2023", pv: 85, amount: "$210.50", status: "Delivered", statusColor: "bg-green-100 text-green-700" },
    { id: "#ORD-7699", date: "Oct 15, 2023", pv: 210, amount: "$890.00", status: "Processing", statusColor: "bg-yellow-100 text-yellow-700" },
    { id: "#ORD-7650", date: "Oct 02, 2023", pv: 45, amount: "$95.00", status: "Cancelled", statusColor: "bg-slate-100 text-slate-700" }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Order History</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Monitor your personal orders and distribution logistics.</p>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-semibold whitespace-nowrap transition-colors relative ${
              activeTab === tab.name
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

      <OrderTable
        orders={orders}
        expandedOrder={expandedOrder}
        setExpandedOrder={setExpandedOrder}
      />

      <SupportBanner />
    </div>
  );
}