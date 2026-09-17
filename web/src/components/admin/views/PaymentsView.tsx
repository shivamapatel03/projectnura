"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Search,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useAdminStore } from "../adminStore";
import { PaymentMethod } from "../types";

export const PaymentsView: React.FC = () => {
  const { payments, sales, currentShift } = useAdminStore();

  const [activeMethod, setActiveMethod] = useState<PaymentMethod | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Success" | "Refunded">("All");

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = activeMethod === "All" || p.method === activeMethod;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesSearch =
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.saleInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.gatewayRef && p.gatewayRef.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMethod && matchesStatus && matchesSearch;
  });

  const totalCollected = payments
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0);

  const cashCollected = payments
    .filter((p) => p.status === "Success" && p.method === "Cash")
    .reduce((sum, p) => sum + p.amount, 0);

  const digitalCollected = payments
    .filter((p) => p.status === "Success" && (p.method === "UPI" || p.method === "Card"))
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExportCSV = () => {
    const headers = "TransactionID,Invoice,Method,Amount,Status,Date,Time,Customer,GatewayRef\n";
    const rows = filteredPayments
      .map(
        (p) =>
          `"${p.transactionId}","${p.saleInvoice}","${p.method}","${p.amount}","${p.status}","${p.date}","${p.time}","${p.customer}","${p.gatewayRef || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Nuradesk-Payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Payments & Settlement Ledger
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time reconciliation of UPI, Card, Cash drawer collections, and refunds.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download size={15} />
            <span>Export Transactions</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Total Settled Today</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1">
            <ShieldCheck size={12} />
            <span>Auto-reconciliation active</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <Banknote size={13} />
            <span>Cash in Drawer</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            ₹{cashCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Opening Float: ₹5,000</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-purple-700 font-medium flex items-center gap-1">
            <Smartphone size={13} />
            <span>Digital (UPI + Cards)</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 font-mono">
            ₹{digitalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Direct Gateway Deposits</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <RotateCcw size={13} />
            <span>Total Refunds</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            ₹{totalRefunded.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Processed back to source</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {(["All", "UPI", "Cash", "Card", "Wallet"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setActiveMethod(method as PaymentMethod | "All")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  activeMethod === method
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | "Success" | "Refunded")}
              aria-label="Filter by payment status"
              className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white text-gray-700 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Refunded">Refunded</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Txn ID, Invoice, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Invoice Ref</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Gateway Reference</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-semibold text-gray-950">
                      {pay.transactionId}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-600 font-medium">
                      {pay.saleInvoice}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-gray-600">
                      <div>{pay.date}</div>
                      <div className="text-[11px] text-gray-400">{pay.time}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-gray-900">{pay.customer}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-gray-800">
                        {pay.method === "UPI" && <Smartphone size={13} className="text-purple-600" />}
                        {pay.method === "Cash" && <Banknote size={13} className="text-emerald-600" />}
                        {pay.method === "Card" && <CreditCard size={13} className="text-blue-600" />}
                        {pay.method === "Wallet" && <Wallet size={13} className="text-amber-600" />}
                        <span className="font-semibold">{pay.method}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-500 text-[11px]">
                      {pay.gatewayRef || "— (Cash Direct)"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                      ₹{pay.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {pay.status === "Success" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} /> Settled
                        </span>
                      )}
                      {pay.status === "Refunded" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <RotateCcw size={11} /> Refunded
                        </span>
                      )}
                      {pay.status === "Failed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle size={11} /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
