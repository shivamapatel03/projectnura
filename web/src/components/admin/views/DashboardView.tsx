"use client";

import React, { useState } from "react";
import {
  Check,
  ArrowUpRight,
  ShoppingCart,
  ChefHat,
  Utensils,
  Barcode,
  Truck,
  Package,
} from "lucide-react";
import { useAdminStore } from "../adminStore";

const HOURLY_BAR_CHART_DATA = [
  { time: "9 AM", amount: "₹4,250", orders: 16, heightPct: 28 },
  { time: "11 AM", amount: "₹7,820", orders: 31, heightPct: 52 },
  { time: "1 PM", amount: "₹11,640", orders: 45, heightPct: 78 },
  { time: "3 PM", amount: "₹14,910", orders: 58, heightPct: 100, isPeak: true },
  { time: "5 PM", amount: "₹6,120", orders: 24, heightPct: 41 },
  { time: "7 PM", amount: "₹3,780", orders: 10, heightPct: 25 },
];

const WEEKLY_BAR_CHART_DATA = [
  { time: "Mon", amount: "₹38,200", orders: 142, heightPct: 65 },
  { time: "Tue", amount: "₹41,500", orders: 156, heightPct: 72 },
  { time: "Wed", amount: "₹36,800", orders: 138, heightPct: 60 },
  { time: "Thu", amount: "₹44,100", orders: 168, heightPct: 78 },
  { time: "Fri", amount: "₹52,400", orders: 198, heightPct: 92 },
  { time: "Sat", amount: "₹58,900", orders: 224, heightPct: 100, isPeak: true },
  { time: "Sun", amount: "₹48,520", orders: 184, heightPct: 83 },
];

const MONTHLY_BAR_CHART_DATA = [
  { time: "Jan", amount: "₹1,24,000", orders: 480, heightPct: 62 },
  { time: "Feb", amount: "₹1,48,500", orders: 590, heightPct: 74 },
  { time: "Mar", amount: "₹1,96,000", orders: 780, heightPct: 98, isPeak: true },
  { time: "Apr", amount: "₹1,62,000", orders: 640, heightPct: 81 },
  { time: "May", amount: "₹1,55,000", orders: 610, heightPct: 77 },
  { time: "Jun", amount: "₹1,82,000", orders: 720, heightPct: 91 },
];

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    sales,
    products,
    setIsAddProductOpen,
    setIsAddStaffOpen,
    setIsAddDeviceOpen,
    setIsPosModalOpen,
  } = useAdminStore();

  const [chartTimeframe, setChartTimeframe] = useState<"Today" | "Week" | "Month">("Today");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Startup Guide state
  const [isStartupGuideDismissed, setIsStartupGuideDismissed] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    step1: false, // 01 — Add Products
    step2: false, // 02 — Add Staff
    step3: false, // 03 — Set Up POS
    step4: false, // 04 — Start Selling
    step5: false, // 05 — Set Up Tables & Kitchen
  });

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isRequiredCompleted = Boolean(
    completedSteps.step1 &&
      completedSteps.step2 &&
      completedSteps.step3 &&
      completedSteps.step4
  );

  const activeChartData =
    chartTimeframe === "Today"
      ? HOURLY_BAR_CHART_DATA
      : chartTimeframe === "Week"
      ? WEEKLY_BAR_CHART_DATA
      : MONTHLY_BAR_CHART_DATA;

  const totalGrossRevenue = sales
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + s.total, 0);

  const totalOrdersCount = sales.filter((s) => s.status === "Completed").length;
  const avgTicket = totalOrdersCount > 0 ? Math.round(totalGrossRevenue / totalOrdersCount) : 0;

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Greeting Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
          Good afternoon, Rahul 👋
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Here's what's happening across your outlets today.
        </p>
      </div>

      {/* STARTUP GUIDE */}
      {!isStartupGuideDismissed ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Startup Guide
                </span>
                {isRequiredCompleted && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <Check size={11} className="stroke-[3]" />
                    <span>Ready to operate</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-950 mt-1">
                Get your business ready
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Complete these steps to start using Nuradesk:
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-semibold text-gray-500">
                {completedCount} of 5 completed
              </span>
              <button
                type="button"
                onClick={() => setIsStartupGuideDismissed(true)}
                className="text-xs text-gray-500 hover:text-gray-900 font-medium px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {isRequiredCompleted ? "Dismiss" : "Skip guide"}
              </button>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {/* 01 — Add Products */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStep("step1")}
                  title={completedSteps.step1 ? "Mark incomplete" : "Mark complete"}
                  className="cursor-pointer shrink-0"
                >
                  {completedSteps.step1 ? (
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-950">
                    01 — Add Products
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    Add the products or services you sell.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddProductOpen(true);
                  setCompletedSteps((prev) => ({ ...prev, step1: true }));
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
              >
                Add Product
              </button>
            </div>

            {/* 02 — Add Staff */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStep("step2")}
                  title={completedSteps.step2 ? "Mark incomplete" : "Mark complete"}
                  className="cursor-pointer shrink-0"
                >
                  {completedSteps.step2 ? (
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-950">
                    02 — Add Staff
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    Create staff accounts and assign roles and PINs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddStaffOpen(true);
                  setCompletedSteps((prev) => ({ ...prev, step2: true }));
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
              >
                Add Staff
              </button>
            </div>

            {/* 03 — Set Up POS */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStep("step3")}
                  title={completedSteps.step3 ? "Mark incomplete" : "Mark complete"}
                  className="cursor-pointer shrink-0"
                >
                  {completedSteps.step3 ? (
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-950">
                    03 — Set Up POS
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    Create and connect your POS terminal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddDeviceOpen(true);
                  setCompletedSteps((prev) => ({ ...prev, step3: true }));
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
              >
                Set Up Terminal
              </button>
            </div>

            {/* 04 — Start Selling */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStep("step4")}
                  title={completedSteps.step4 ? "Mark incomplete" : "Mark complete"}
                  className="cursor-pointer shrink-0"
                >
                  {completedSteps.step4 ? (
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-950">
                    04 — Start Selling
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    Open the POS and make your first sale.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPosModalOpen(true);
                  setCompletedSteps((prev) => ({ ...prev, step4: true }));
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
              >
                Open POS
              </button>
            </div>

            {/* Restaurant / Café only Section */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Restaurant / Café only:
              </span>
            </div>

            {/* 05 — Set Up Tables & Kitchen */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStep("step5")}
                  title={completedSteps.step5 ? "Mark incomplete" : "Mark complete"}
                  className="cursor-pointer shrink-0"
                >
                  {completedSteps.step5 ? (
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                  )}
                </button>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-950">
                    05 — Set Up Tables & Kitchen
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    Create tables and connect your Kitchen Display.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("orders");
                  setCompletedSteps((prev) => ({ ...prev, step5: true }));
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
              >
                Set Up
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed / Dismissed state */
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">Startup Guide</span>
            <span className="text-gray-300">•</span>
            <span>{completedCount} of 5 completed</span>
            {isRequiredCompleted && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ Completed
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsStartupGuideDismissed(false)}
            className="text-black font-semibold hover:underline cursor-pointer"
          >
            Resume Guide
          </button>
        </div>
      )}

      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-none">
          <div className="text-sm font-semibold text-gray-600">Sales</div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight mt-2.5 font-mono">
            ₹{totalGrossRevenue.toLocaleString()}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-none">
          <div className="text-sm font-semibold text-gray-600">Orders</div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight mt-2.5 font-mono">
            {totalOrdersCount}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-none">
          <div className="text-sm font-semibold text-gray-600">Avg. Ticket</div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight mt-2.5 font-mono">
            ₹{avgTicket.toLocaleString()}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-none">
          <div className="text-sm font-semibold text-gray-600">Products Catalog</div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight mt-2.5 font-mono">
            {products.length}
          </div>
        </div>
      </div>

      {/* TWO LARGE CARDS: "Sales Overview" & "Recent Sales" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT CARD: Sales Overview with Interactive BAR CHART */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-950">Sales Overview</h3>
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-xs font-semibold text-gray-600">
              {(["Today", "Week", "Month"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartTimeframe(t)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartTimeframe === t
                      ? "bg-white text-gray-950 shadow-xs font-bold"
                      : "hover:text-gray-950"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SALES BAR CHART CONTAINER */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-gray-200/90 shadow-none min-h-[340px] flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Revenue {chartTimeframe === "Today" ? "Today" : chartTimeframe === "Week" ? "This Week" : "This Month"}
                </span>
                <div className="text-2xl font-black text-gray-950 font-mono">
                  {chartTimeframe === "Today"
                    ? `₹${totalGrossRevenue.toLocaleString()}`
                    : chartTimeframe === "Week"
                    ? "₹3,19,420.00"
                    : "₹9,67,500.00"}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                {chartTimeframe === "Today" ? "Peak: 3:00 PM" : chartTimeframe === "Week" ? "Peak: Saturday" : "Peak: March"}
              </span>
            </div>

            {/* Styled Interactive BAR CHART */}
            <div className="relative w-full pt-6 pb-2">
              <div className="h-44 sm:h-48 flex items-end justify-between gap-3 sm:gap-5 border-b border-gray-100 px-2 sm:px-4 relative z-10">
                {activeChartData.map((item, idx) => {
                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div
                      key={item.time}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      className="flex-1 flex flex-col items-center h-full justify-end group/bar cursor-pointer relative"
                    >
                      {isHovered && (
                        <div className="absolute -top-10 bg-gray-950 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl z-20 whitespace-nowrap animate-fadeIn pointer-events-none border border-zinc-800">
                          <span>{item.amount}</span>
                          <span className="text-zinc-400 text-[10px] ml-1.5">({item.orders} orders)</span>
                        </div>
                      )}

                      <div className="w-full max-w-[42px] h-full bg-gray-100/70 rounded-t-xl flex flex-col justify-end p-1 transition-colors group-hover/bar:bg-gray-100">
                        <div
                          style={{ height: `${item.heightPct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            item.isPeak
                              ? "bg-black shadow-sm group-hover/bar:brightness-110"
                              : isHovered
                              ? "bg-zinc-800"
                              : "bg-zinc-700 group-hover/bar:bg-black"
                          }`}
                        />
                      </div>

                      <span
                        className={`text-[11px] mt-2.5 transition-colors ${
                          item.isPeak || isHovered
                            ? "font-bold text-gray-950"
                            : "font-semibold text-gray-500"
                        }`}
                      >
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] font-medium text-gray-400">
              <span>Live Register Sync: Active</span>
              <span>Hover bar for detailed metrics</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Recent Sales */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-950">Recent Sales</h3>
            <button
              onClick={() => setActiveTab("sales")}
              className="text-xs font-semibold text-black hover:underline transition-colors cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200/90 shadow-none min-h-[340px] flex flex-col justify-between">
            <div className="divide-y divide-gray-100">
              {sales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="py-2.5 sm:py-3 flex items-center justify-between hover:bg-gray-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                  onClick={() => setActiveTab("sales")}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 shrink-0 font-mono font-bold text-xs">
                      {sale.invoiceNumber.slice(-3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-950 truncate">
                          {sale.customerName}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {sale.invoiceNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-[200px] sm:max-w-[260px]">
                        {sale.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-gray-950 font-mono">
                      ₹{sale.total.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-medium">
                        {sale.paymentMethod}
                      </span>
                      <span className="text-[10px] text-gray-400">{sale.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Showing latest transactions</span>
              <button
                type="button"
                onClick={() => setIsPosModalOpen(true)}
                className="font-semibold text-gray-900 hover:underline cursor-pointer"
              >
                + New POS Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS: POS CASHIER LAUNCHER BANNER */}
      <div className="p-6 rounded-xl bg-black text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Registers Ready</span>
          </div>
          <h3 className="text-lg font-bold">Start Cashier Session / POS Register</h3>
          <p className="text-xs text-zinc-400">
            Open the POS interface to add cart items, handle dine-in/takeaway, process UPI & print bills.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPosModalOpen(true)}
          className="h-11 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <ShoppingCart size={16} />
          <span>Launch POS Register (T1)</span>
        </button>
      </div>

      {/* ADAPTIVE BUSINESS MODULES */}
      <div className="p-6 sm:p-7 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold text-gray-950">
            Business Modular Extensions
          </h4>
          <p className="text-xs text-gray-500">
            Nuradesk seamlessly adapts to Restaurant, Café, or Retail business modes.
          </p>
        </div>

        <div className="pt-2 space-y-4 text-xs sm:text-sm">
          {/* Restaurant Modules */}
          <div className="space-y-2">
            <div className="text-gray-600 font-medium">Restaurant & Café modules:</div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Utensils size={15} className="text-amber-600" />
                <span>Tables & Dining</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold ml-1">
                  Floor Map
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ChefHat size={15} className="text-blue-600" />
                <span>Kitchen Display (KDS)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold ml-1">
                  Live Tickets
                </span>
              </button>
            </div>
          </div>

          {/* Retail Modules */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="text-gray-600 font-medium">Retail & Inventory modules:</div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Barcode size={15} className="text-emerald-600" />
                <span>Barcode Scanner</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold ml-1">
                  SKU & Laser
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Truck size={15} className="text-purple-600" />
                <span>Inward Stock & Suppliers</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold ml-1">
                  Audit Log
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
