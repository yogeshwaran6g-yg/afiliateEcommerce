import React, { useState } from "react";
import OrderTable from "./OrderTable";
import SupportBanner from "./SupportBanner";
import { useGetMyOrders, useGetOrderById } from "../hooks/useOrderService";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef(null);

  const { data: ordersResponse, isLoading: loading } = useGetMyOrders();
  const orders = ordersResponse?.data || [];

  // We'll use a local state to trigger detail fetching for specific orders
  // Alternatively, we could have a component inside OrderTable for each row
  // that uses useGetOrderById(id).
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: detailResponse } = useGetOrderById(selectedOrderId);

  // Cache for order details to avoid redundant loads, though Query handles this
  // We'll pass the whole detailResponse to OrderTable
  const orderDetails =
    selectedOrderId && detailResponse?.data
      ? { [selectedOrderId]: detailResponse.data }
      : {};

  const handleExpandOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setSelectedOrderId(null);
      return;
    }

    setExpandedOrder(orderId);
    setSelectedOrderId(orderId);
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Apply Tab Filter
    if (activeTab !== "All Orders") {
      filtered = filtered.filter(
        (order) =>
          order.status?.toUpperCase() ===
          activeTab.toUpperCase().replace(" ", "_"),
      );
    }

    // Apply Date Filter (Specific Date)
    if (selectedDate) {
      filtered = filtered.filter((order) => {
        // created_at usually looks like "2024-03-21T..." or "2024-03-21 ..."
        // We compare the YYYY-MM-DD part
        const orderDateStr = new Date(order.created_at)
          .toISOString()
          .split("T")[0];
        return orderDateStr === selectedDate;
      });
    }

    return filtered;
  };

  // Calculate counts for tabs
  const getTabCounts = () => {
    const counts = {
      "All Orders": orders.length,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      const status =
        order.status?.charAt(0).toUpperCase() +
        order.status?.slice(1).toLowerCase();
      // Map API status to Tab names if needed
      // API: PROCESSING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
      // Tabs: Processing, Shipped, Delivered, Cancelled
      // We might need to map OUT_FOR_DELIVERY to Shipped or Delivered or add a tab.
      // For now let's map roughly.

      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    return counts;
  };

  const tabCounts = getTabCounts();

  const tabs = [
    { name: "All Orders", count: tabCounts["All Orders"] },
    { name: "Processing", count: tabCounts["Processing"] },
    { name: "Shipped", count: tabCounts["Shipped"] },
    { name: "Delivered", count: tabCounts["Delivered"] },
    { name: "Cancelled", count: tabCounts["Cancelled"] },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">
            Order History
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Monitor your personal orders and distribution logistics.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none h-[42px]">
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
            />
            <button
              onClick={() => {
                try {
                  if (dateInputRef.current?.showPicker) {
                    dateInputRef.current.showPicker();
                  } else {
                    dateInputRef.current?.focus();
                    dateInputRef.current?.click();
                  }
                } catch (e) {
                  dateInputRef.current?.click();
                }
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-xs md:text-sm font-medium transition-colors w-full h-full ${
                selectedDate
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-base md:text-lg pointer-events-none">
                {selectedDate ? "event_available" : "calendar_month"}
              </span>
              <span className="pointer-events-none">
                {selectedDate ? selectedDate : "Select Date"}
              </span>
            </button>
            {selectedDate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate("");
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center z-30 shadow-md hover:bg-slate-700 transition-colors"
                title="Clear filter"
              >
                <span className="material-symbols-outlined text-[12px]">
                  close
                </span>
              </button>
            )}
          </div>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-base md:text-lg">
              download
            </span>
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

      {loading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : (
        <OrderTable
          orders={getFilteredOrders()}
          expandedOrder={expandedOrder}
          setExpandedOrder={handleExpandOrder}
          orderDetails={orderDetails}
        />
      )}

      <SupportBanner />
    </div>
  );
}
