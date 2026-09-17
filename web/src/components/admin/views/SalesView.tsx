"use client";

import React, { useState } from "react";
import {
  IconSearch,
  IconReceipt,
  IconDownload,
  IconRotate2,
  IconArrowUpRight,
  IconPrinter,
  IconX,
  IconCreditCard,
  IconCash,
  IconDeviceMobile,
  IconCircleCheck,
  IconAlertCircle,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { Sale } from "../types";

export const SalesView: React.FC = () => {
  const { sales, refundSale, selectedSaleDetail, setSelectedSaleDetail, setActiveTab } =
    useAdminStore();

  const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "Refunded" | "Voided">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("All");

  const filteredSales = sales.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesMethod = selectedMethod === "All" || s.paymentMethod === selectedMethod;
    const matchesSearch =
      s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(searchQuery)) ||
      s.staffName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesMethod && matchesSearch;
  });

  const totalGrossRevenue = sales
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + s.total, 0);

  const totalRefunded = sales
    .filter((s) => s.status === "Refunded")
    .reduce((acc, s) => acc + s.total, 0);

  const completedCount = sales.filter((s) => s.status === "Completed").length;
  const avgOrderValue = completedCount > 0 ? Math.round(totalGrossRevenue / completedCount) : 0;

  const handleExportCSV = () => {
    const headers = "Invoice,Date,Time,Outlet,Terminal,Cashier,Customer,Phone,ItemsCount,Total,Method,Status\n";
    const rows = filteredSales
      .map(
        (s) =>
          `"${s.invoiceNumber}","${s.date}","${s.time}","${s.outlet}","${s.terminal}","${s.staffName}","${s.customerName}","${s.customerPhone || ""}","${s.items.length}","${s.total}","${s.paymentMethod}","${s.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Nuradesk-Sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Sales & Transactions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time audit log of all completed, refunded, and voided register sales.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <IconDownload size={15} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("terminals")}
            className="h-10 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <IconDeviceDesktop size={16} />
            <span>Launch Terminal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Net Gross Revenue</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalGrossRevenue.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Completed Invoices</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">{completedCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Avg. Ticket Size</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{avgOrderValue.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <IconRotate2 size={13} />
            <span>Refunded Value</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            ₹{totalRefunded.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {(["All", "Completed", "Refunded", "Voided"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Payment Method filter */}
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              aria-label="Filter by payment method"
              className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white text-gray-700 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Wallet">Wallet</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoice, customer, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Cashier / Device</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3 text-right">Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <IconReceipt size={32} className="mx-auto mb-2 opacity-30" />
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedSaleDetail(sale)}
                  >
                    <td className="py-3.5 px-3 font-mono font-semibold text-gray-950 flex items-center gap-1.5">
                      <span>{sale.invoiceNumber}</span>
                      <IconArrowUpRight
                        size={13}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity"
                      />
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-gray-600">
                      <div>{sale.date}</div>
                      <div className="text-[11px] text-gray-400">{sale.time}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-gray-900">
                      <div>{sale.customerName}</div>
                      {sale.customerPhone && (
                        <div className="text-[11px] text-gray-400 font-mono">{sale.customerPhone}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      <div>{sale.staffName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{sale.terminal}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[11px]">
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        {sale.paymentMethod === "UPI" && <IconDeviceMobile size={13} className="text-purple-600" />}
                        {sale.paymentMethod === "Cash" && <IconCash size={13} className="text-emerald-600" />}
                        {sale.paymentMethod === "Card" && <IconCreditCard size={13} className="text-blue-600" />}
                        <span className="font-medium">{sale.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                      ₹{sale.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {sale.status === "Completed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <IconCircleCheck size={11} /> Completed
                        </span>
                      )}
                      {sale.status === "Refunded" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <IconRotate2 size={11} /> Refunded
                        </span>
                      )}
                      {sale.status === "Voided" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <IconAlertCircle size={11} /> Voided
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedSaleDetail(sale)}
                        className="text-xs text-gray-600 hover:text-black font-medium underline underline-offset-2 cursor-pointer mr-2"
                      >
                        Receipt
                      </button>
                      {sale.status === "Completed" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Confirm refund for invoice ${sale.invoiceNumber} (₹${sale.total})?`)) {
                              refundSale(sale.id);
                            }
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Details Drawer / Receipt Modal */}
      {selectedSaleDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full border border-gray-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <IconReceipt size={17} className="text-gray-700" />
                <span className="font-bold text-gray-900 text-sm">
                  Invoice Details: {selectedSaleDetail.invoiceNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSaleDetail(null)}
                aria-label="Close invoice details"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <IconX size={16} />
              </button>
            </div>

            {/* Thermal Printable Receipt Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-gray-700">
              {/* Receipt Top */}
              <div className="text-center border-b border-dashed border-gray-300 pb-3 space-y-1">
                <h3 className="font-bold text-base text-gray-950 uppercase tracking-wider">
                  NURADESK SPECIALTY ROASTERS
                </h3>
                <p className="text-[11px] text-gray-500">{selectedSaleDetail.outlet}</p>
                <p className="text-[10px] text-gray-400">GSTIN: 29AABCN8291M1Z5</p>
                <p className="text-[10px] text-gray-400">
                  {selectedSaleDetail.date} • {selectedSaleDetail.time}
                </p>
              </div>

              {/* Cashier & Customer Info */}
              <div className="flex justify-between text-[11px] border-b border-dashed border-gray-200 pb-2">
                <div>
                  <span className="text-gray-400">Cashier:</span> {selectedSaleDetail.staffName}
                  <br />
                  <span className="text-gray-400">Terminal:</span> {selectedSaleDetail.terminal}
                </div>
                <div className="text-right">
                  <span className="text-gray-400">Customer:</span> {selectedSaleDetail.customerName}
                  {selectedSaleDetail.customerPhone && (
                    <>
                      <br />
                      <span className="text-gray-400">Ph:</span> {selectedSaleDetail.customerPhone}
                    </>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 border-b border-dashed border-gray-300 pb-3">
                <div className="flex justify-between text-[11px] text-gray-400 font-semibold uppercase">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {selectedSaleDetail.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div className="flex-1 pr-2">
                      <div className="font-medium text-gray-900">
                        {it.quantity}x {it.product.name}
                      </div>
                      {it.selectedVariant && (
                        <div className="text-[10px] text-gray-500">• {it.selectedVariant.name}</div>
                      )}
                      {it.selectedModifiers && it.selectedModifiers.length > 0 && (
                        <div className="text-[10px] text-gray-500">
                          • {it.selectedModifiers.map((m) => m.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-semibold">
                      ₹
                      {(
                        (it.selectedVariant ? it.selectedVariant.price : it.product.sellingPrice) *
                        it.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax & Totals */}
              <div className="space-y-1.5 text-xs pt-1 border-b border-dashed border-gray-300 pb-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{selectedSaleDetail.subtotal.toLocaleString()}</span>
                </div>
                {selectedSaleDetail.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount</span>
                    <span>-₹{selectedSaleDetail.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>CGST (2.5%)</span>
                  <span>₹{(selectedSaleDetail.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>SGST (2.5%)</span>
                  <span>₹{(selectedSaleDetail.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-950 pt-1 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span>₹{selectedSaleDetail.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="text-[11px] text-gray-500 flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-gray-800 uppercase">
                  {selectedSaleDetail.paymentMethod}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 flex justify-between">
                <span>Status:</span>
                <span
                  className={`font-semibold ${
                    selectedSaleDetail.status === "Completed"
                      ? "text-emerald-600"
                      : selectedSaleDetail.status === "Refunded"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {selectedSaleDetail.status.toUpperCase()}
                </span>
              </div>

              <div className="text-center text-[10px] text-gray-400 pt-2">
                Thank you for visiting Nuradesk!
                <br />
                Powered by Nuradesk OS • All rights reserved
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
              {selectedSaleDetail.status === "Completed" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(`Refund this order of ₹${selectedSaleDetail.total}?`)
                    ) {
                      refundSale(selectedSaleDetail.id);
                      setSelectedSaleDetail(null);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer transition-colors"
                >
                  Refund Sale
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <IconPrinter size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSaleDetail(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
