"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Printer,
  CheckCircle2,
  RotateCcw,
  Percent,
  Calendar,
  Eye,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import { useAdminStore } from "../adminStore";
import { Sale } from "../types";

export const BillingView: React.FC = () => {
  const { sales, setSelectedSaleDetail } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [taxFilter, setTaxFilter] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);

  const filteredInvoices = sales.filter((s) => {
    const matchesSearch =
      s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(searchQuery));
    return matchesSearch;
  });

  const totalTaxable = sales
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + s.subtotal, 0);

  const totalGSTCollected = sales
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + s.tax, 0);

  const totalInvoicedGross = sales
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + s.total, 0);

  const totalCreditNotes = sales
    .filter((s) => s.status === "Refunded")
    .reduce((acc, s) => acc + s.total, 0);

  const handleExportInvoices = () => {
    const headers =
      "InvoiceNo,Date,Time,Customer,TaxableAmount,CGST,SGST,TotalGST,TotalGross,PaymentMethod,Status\n";
    const rows = filteredInvoices
      .map((s) => {
        const cgst = (s.tax / 2).toFixed(2);
        const sgst = (s.tax / 2).toFixed(2);
        return `"${s.invoiceNumber}","${s.date}","${s.time}","${s.customerName}","${s.subtotal}","${cgst}","${sgst}","${s.tax}","${s.total}","${s.paymentMethod}","${s.status}"`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Nuradesk-Invoices-GST-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Billing & GST Compliance
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Compliant tax invoices, CGST / SGST breakdown, and credit note statements.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportInvoices}
            className="h-10 px-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download size={15} />
            <span>Export GST Invoices</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Total Invoiced Gross</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalInvoicedGross.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Total B2C & B2B billings</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Taxable Base Value</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalTaxable.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Excluding GST</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-purple-700 font-medium flex items-center gap-1">
            <Percent size={13} />
            <span>GST Output Tax</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 font-mono">
            ₹{totalGSTCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">
            CGST: ₹{(totalGSTCollected / 2).toFixed(1)} | SGST: ₹{(totalGSTCollected / 2).toFixed(1)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <RotateCcw size={13} />
            <span>Credit Notes (Refunds)</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            ₹{totalCreditNotes.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700">Tax reversal adjusted</div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Search & Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-4 border-b border-gray-100">
          <div className="text-sm font-bold text-gray-950 flex items-center gap-2">
            <FileText size={16} className="text-gray-600" />
            <span>Tax Invoices Registry</span>
          </div>

          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoice #, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3 text-right">Taxable Value</th>
                <th className="py-3 px-3 text-right">CGST</th>
                <th className="py-3 px-3 text-right">SGST</th>
                <th className="py-3 px-3 text-right">Gross Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredInvoices.map((inv) => {
                const cgst = (inv.tax / 2).toFixed(2);
                const sgst = (inv.tax / 2).toFixed(2);
                return (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-gray-950">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">{inv.date}</td>
                    <td className="py-3.5 px-3 font-medium text-gray-900">{inv.customerName}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-600">
                      ₹{inv.subtotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-500">₹{cgst}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-500">₹{sgst}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                      ₹{inv.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {inv.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <RotateCcw size={11} /> Refunded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black font-semibold cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full border border-gray-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-gray-700" />
                <span className="font-bold text-gray-900 text-sm">
                  Tax Invoice: {selectedInvoice.invoiceNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                aria-label="Close invoice preview"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700">
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                  <h3 className="font-bold text-base text-gray-950">NURADESK HOSPITALITY LLP</h3>
                  <div className="text-gray-500 mt-1">100 Feet Rd, Indiranagar, Bengaluru 560038</div>
                  <div className="text-gray-400 font-mono text-[11px]">GSTIN: 29AABCN8291M1Z5</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-gray-900">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-gray-500">{selectedInvoice.date}</div>
                  <div className="text-emerald-600 font-semibold">{selectedInvoice.status.toUpperCase()}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-[11px] font-semibold text-gray-400 uppercase">Billed To</div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">
                  {selectedInvoice.customerName}
                </div>
                {selectedInvoice.customerPhone && (
                  <div className="text-gray-500 font-mono text-xs">{selectedInvoice.customerPhone}</div>
                )}
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-gray-900">
                          {item.product.name}
                          {item.selectedVariant && (
                            <span className="text-gray-400 text-[10px] block">
                              {item.selectedVariant.name}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{item.product.sellingPrice}</td>
                        <td className="p-2.5 text-right font-mono font-bold">
                          ₹{(item.product.sellingPrice * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Computation Summary */}
              <div className="space-y-1.5 pt-2 border-t border-gray-200 font-mono text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Taxable Subtotal</span>
                  <span>₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>CGST (2.5%)</span>
                  <span>₹{(selectedInvoice.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>SGST (2.5%)</span>
                  <span>₹{(selectedInvoice.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-950 pt-2 border-t border-gray-200">
                  <span>Invoice Total</span>
                  <span>₹{selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
