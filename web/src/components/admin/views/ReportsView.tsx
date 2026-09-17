"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PieChart,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { useAdminStore } from "../adminStore";

export const ReportsView: React.FC = () => {
  const { sales, products, currentShift } = useAdminStore();

  const [dateRange, setDateRange] = useState<"Today" | "Yesterday" | "7days" | "30days">("Today");
  const [activeReportTab, setActiveReportTab] = useState<"sales" | "products" | "shifts">("sales");

  const completedSales = sales.filter((s) => s.status === "Completed");
  const totalRevenue = completedSales.reduce((sum, s) => sum + s.total, 0);
  const totalOrders = completedSales.length;
  const avgTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalRefunds = sales
    .filter((s) => s.status === "Refunded")
    .reduce((sum, s) => sum + s.total, 0);

  // Compute Product-wise aggregates from real sales items
  const productStatsMap: Record<
    string,
    { name: string; category: string; unitsSold: number; revenue: number }
  > = {};

  completedSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const pId = item.product.id;
      if (!productStatsMap[pId]) {
        productStatsMap[pId] = {
          name: item.product.name,
          category: item.product.category,
          unitsSold: 0,
          revenue: 0,
        };
      }
      productStatsMap[pId].unitsSold += item.quantity;
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.sellingPrice;
      productStatsMap[pId].revenue += price * item.quantity;
    });
  });

  const productStatsList = Object.values(productStatsMap).sort((a, b) => b.revenue - a.revenue);

  // Payment Breakdown
  const paymentBreakdown = {
    UPI: completedSales.filter((s) => s.paymentMethod === "UPI").reduce((sum, s) => sum + s.total, 0),
    Card: completedSales.filter((s) => s.paymentMethod === "Card").reduce((sum, s) => sum + s.total, 0),
    Cash: completedSales.filter((s) => s.paymentMethod === "Cash").reduce((sum, s) => sum + s.total, 0),
    Wallet: completedSales.filter((s) => s.paymentMethod === "Wallet").reduce((sum, s) => sum + s.total, 0),
  };

  const handleExportCSV = () => {
    let content = "";
    if (activeReportTab === "sales") {
      content = "Invoice,Customer,PaymentMethod,GrossTotal,Status\n" +
        sales.map((s) => `"${s.invoiceNumber}","${s.customerName}","${s.paymentMethod}","${s.total}","${s.status}"`).join("\n");
    } else {
      content = "Product,Category,UnitsSold,TotalRevenue\n" +
        productStatsList.map((p) => `"${p.name}","${p.category}","${p.unitsSold}","${p.revenue}"`).join("\n");
    }
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Nuradesk-Report-${activeReportTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Analytics & Executive Reports
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Operational KPIs, category performance, staff shift audits, and channel breakdowns.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            {(["Today", "Yesterday", "7days", "30days"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  dateRange === range ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                {range === "7days" ? "Last 7 Days" : range === "30days" ? "This Month" : range}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Gross Revenue</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Real-time synced</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Completed Bills</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">{totalOrders}</div>
          <div className="text-[11px] text-gray-400">Across active registers</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Avg Order Value (AOV)</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{avgTicket.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Per paying customer</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-amber-700 font-medium">Total Returns / Refunds</div>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            ₹{totalRefunds.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Void & returned items</div>
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveReportTab("sales")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeReportTab === "sales"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <BarChart3 size={14} />
          <span>Sales & Payment Mix</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab("products")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeReportTab === "products"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Award size={14} />
          <span>Product Velocity</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab("shifts")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeReportTab === "shifts"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Clock size={14} />
          <span>Register Shift Audit</span>
        </button>
      </div>

      {/* Tab 1: Sales & Payment Mix */}
      {activeReportTab === "sales" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Method Distribution */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-950">Payment Tender Distribution</h3>
              <p className="text-xs text-gray-500">Breakdown of gross collection across payment modes.</p>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(paymentBreakdown).map(([mode, amt]) => {
                const pct = totalRevenue > 0 ? Math.round((amt / totalRevenue) * 100) : 0;
                return (
                  <div key={mode} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-800">{mode}</span>
                      <span className="font-mono text-gray-950 font-bold">
                        ₹{amt.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          mode === "UPI"
                            ? "bg-purple-600"
                            : mode === "Card"
                            ? "bg-blue-600"
                            : mode === "Cash"
                            ? "bg-emerald-600"
                            : "bg-amber-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly Traffic & Hourly Sales Indicator */}
          <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-950">Hourly Revenue Pulse</h3>
              <p className="text-xs text-gray-500">
                Peak transaction density observed during active counter hours.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-2 pt-4 items-end h-40">
              {[
                { time: "09 AM", value: 3400 },
                { time: "11 AM", value: 8900 },
                { time: "01 PM", value: 16400 },
                { time: "03 PM", value: 24800 },
                { time: "05 PM", value: 18200 },
                { time: "07 PM", value: 9200 },
              ].map((slot, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="text-[10px] font-mono text-gray-500">₹{(slot.value / 1000).toFixed(1)}k</div>
                  <div
                    className="w-full max-w-[48px] bg-black hover:bg-zinc-800 rounded-t-lg transition-all"
                    style={{ height: `${(slot.value / 25000) * 100}%` }}
                  />
                  <div className="text-[10px] font-mono text-gray-400">{slot.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Product Velocity */}
      {activeReportTab === "products" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-950">Top Selling Menu Items & Products</h3>
            <p className="text-xs text-gray-500">
              Ranking by units sold and gross contribution margin to revenue.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Item Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Units Sold</th>
                  <th className="py-3 px-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {productStatsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No product sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  productStatsList.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-400">#{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-gray-950">{prod.name}</td>
                      <td className="py-3 px-3 text-gray-600">{prod.category}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-gray-900">
                        {prod.unitsSold}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-gray-950">
                        ₹{prod.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Register Shift Audit */}
      {activeReportTab === "shifts" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-950">Cash Drawer & Register Shifts</h3>
            <p className="text-xs text-gray-500">
              Audits of cashier shift openings, expected vs actual cash balances, and variance tracking.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Staff / Cashier</th>
                  <th className="py-3 px-3">Terminal & Outlet</th>
                  <th className="py-3 px-3">Start Time</th>
                  <th className="py-3 px-3 text-right">Opening Float</th>
                  <th className="py-3 px-3 text-right">Cash Collected</th>
                  <th className="py-3 px-3 text-right">Expected In Drawer</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {currentShift && (
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-gray-950">
                      {currentShift.staffName}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      <div>{currentShift.terminalCode}</div>
                      <div className="text-[10px] text-gray-400">{currentShift.outletName}</div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">{currentShift.startTime}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-700">
                      ₹{currentShift.openingCash.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-600 font-bold">
                      ₹{currentShift.cashSales.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                      ₹{(currentShift.openingCash + currentShift.cashSales).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} /> Shift Active
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
