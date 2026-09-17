"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  PackageCheck,
  Search,
  ArrowRight,
  X,
  Printer,
  ShoppingBag,
  Utensils,
  Truck,
  RotateCw,
} from "lucide-react";
import { useAdminStore } from "../adminStore";
import { Order, OrderStatus } from "../types";

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, setIsPosModalOpen } = useAdminStore();

  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesTab = activeTab === "All" || ord.status === activeTab;
    const matchesType = selectedType === "All" || ord.type === selectedType;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.tableNumber && ord.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.parcelNumber && ord.parcelNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesType && matchesSearch;
  });

  const openCount = orders.filter((o) => o.status === "Open").length;
  const preparingCount = orders.filter((o) => o.status === "Preparing").length;
  const readyCount = orders.filter((o) => o.status === "Ready").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Open":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={11} /> Open
          </span>
        );
      case "Preparing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <ChefHat size={11} /> In Kitchen
          </span>
        );
      case "Ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <PackageCheck size={11} /> Ready
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={11} /> Cancelled
          </span>
        );
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === "Open") return "Preparing";
    if (current === "Preparing") return "Ready";
    if (current === "Ready") return "Completed";
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Live Orders Board
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time table orders, takeaway parcels, and kitchen display ticketing.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPosModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <ShoppingBag size={16} />
            <span>New Order / Sale</span>
          </button>
        </div>
      </div>

      {/* 4 Pipeline Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab(activeTab === "Open" ? "All" : "Open")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            activeTab === "Open" ? "border-blue-500 ring-1 ring-blue-500" : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
            <Clock size={13} />
            <span>Open Orders</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono">{openCount}</div>
        </div>

        <div
          onClick={() => setActiveTab(activeTab === "Preparing" ? "All" : "Preparing")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            activeTab === "Preparing"
              ? "border-amber-500 ring-1 ring-amber-500"
              : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <ChefHat size={13} />
            <span>In Preparation</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">{preparingCount}</div>
        </div>

        <div
          onClick={() => setActiveTab(activeTab === "Ready" ? "All" : "Ready")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            activeTab === "Ready"
              ? "border-purple-500 ring-1 ring-purple-500"
              : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-purple-700 font-medium flex items-center gap-1">
            <PackageCheck size={13} />
            <span>Ready for Pickup</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 font-mono">{readyCount}</div>
        </div>

        <div
          onClick={() => setActiveTab(activeTab === "Completed" ? "All" : "Completed")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            activeTab === "Completed"
              ? "border-emerald-500 ring-1 ring-emerald-500"
              : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Completed Orders</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{completedCount}</div>
        </div>
      </div>

      {/* Main Board Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {(["All", "Open", "Preparing", "Ready", "Completed", "Cancelled"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Dining Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by order type"
              className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white text-gray-700 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="All">All Types (Dine-in / Takeaway)</option>
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
              <option value="Delivery">Delivery</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search order #, table, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Type & Dest.</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3">Terminal</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Quick Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
                    No orders matching the active criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const nextStatus = getNextStatus(ord.status);
                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(ord)}
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-950">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-gray-900">
                          {ord.type === "Dine-in" && <Utensils size={13} className="text-amber-600" />}
                          {ord.type === "Takeaway" && (
                            <ShoppingBag size={13} className="text-blue-600" />
                          )}
                          {ord.type === "Delivery" && <Truck size={13} className="text-purple-600" />}
                          <span>{ord.type}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {ord.tableNumber || ord.parcelNumber || "Counter"}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-gray-900">
                        <div>{ord.customerName}</div>
                        {ord.customerPhone && (
                          <div className="text-[11px] text-gray-400 font-mono">{ord.customerPhone}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs truncate text-gray-600">
                        {ord.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-gray-500">
                        <div>{ord.terminalCode}</div>
                        <div className="text-[10px] text-gray-400">{ord.cashierName}</div>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">{ord.createdAt}</td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                        ₹{ord.total.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-center">{getStatusBadge(ord.status)}</td>
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(ord.id, nextStatus)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            <span>Mark {nextStatus}</span>
                            <ArrowRight size={12} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="text-xs text-gray-500 hover:text-black font-medium underline cursor-pointer"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full border border-gray-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ChefHat size={17} className="text-gray-700" />
                <span className="font-bold text-gray-900 text-sm">
                  Order Ticket: {selectedOrder.orderNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 font-mono">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <div>
                  <div className="text-base font-bold text-gray-950">{selectedOrder.customerName}</div>
                  <div className="text-gray-500">
                    {selectedOrder.type} • {selectedOrder.tableNumber || selectedOrder.parcelNumber}
                  </div>
                </div>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* Order Items breakdown */}
              <div className="space-y-3 py-2 border-b border-dashed border-gray-300">
                <div className="font-semibold text-gray-400 text-[11px] uppercase">
                  Kitchen Items & Addons
                </div>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">
                        {item.quantity}x {item.product.name}
                      </div>
                      {item.selectedVariant && (
                        <div className="text-gray-500 text-[11px]">• {item.selectedVariant.name}</div>
                      )}
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="text-gray-500 text-[11px]">
                          • {item.selectedModifiers.map((m) => m.name).join(", ")}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-amber-700 text-[11px] font-sans italic">
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="font-semibold">
                      ₹
                      {(
                        (item.selectedVariant ? item.selectedVariant.price : item.product.sellingPrice) *
                        item.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Pricing Breakdown */}
              <div className="space-y-1 pt-1 border-b border-gray-200 pb-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount</span>
                    <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST)</span>
                  <span>₹{selectedOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-950 pt-1">
                  <span>Order Total</span>
                  <span>₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-[11px] text-gray-400 space-y-0.5">
                <div>Terminal: {selectedOrder.terminalCode}</div>
                <div>Cashier: {selectedOrder.cashierName}</div>
                <div>Created: {selectedOrder.createdAt}</div>
              </div>
            </div>

            {/* Stepper Footer Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
              {selectedOrder.status !== "Completed" && selectedOrder.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, "Cancelled");
                    setSelectedOrder(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer transition-colors"
                >
                  Cancel Order
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {getNextStatus(selectedOrder.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      const nxt = getNextStatus(selectedOrder.status);
                      if (nxt) updateOrderStatus(selectedOrder.id, nxt);
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <span>Advance to {getNextStatus(selectedOrder.status)}</span>
                    <ArrowRight size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
