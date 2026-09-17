"use client";

import React, { useState } from "react";
import {
  Boxes,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Plus,
  Minus,
  RotateCcw,
  SlidersHorizontal,
  X,
  History,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useAdminStore } from "../adminStore";
import { Product, StockMovement } from "../types";

export const InventoryView: React.FC = () => {
  const { products, stockMovements, adjustStock } = useAdminStore();

  const [activeTab, setActiveTab] = useState<"stock" | "movements">("stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Adjustment Modal State
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [adjustReason, setAdjustReason] = useState<string>("Restock / Purchase Inward");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock =
      stockFilter === "all"
        ? true
        : stockFilter === "low"
        ? p.status === "Low Stock"
        : p.status === "Out of Stock";

    return matchesCat && matchesSearch && matchesStock;
  });

  const totalAssetValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;
  const totalUnitsInStock = products.reduce((acc, p) => acc + p.stock, 0);

  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    if (adjustQty <= 0) {
      alert("Please enter a quantity greater than zero.");
      return;
    }

    const signedQty = adjustType === "add" ? adjustQty : -adjustQty;
    adjustStock(adjustingProduct.id, signedQty, adjustReason);
    setAdjustingProduct(null);
    setAdjustQty(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Inventory & Stock Controls
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time stock ledger, automated deductions per POS sale, and wastage audit.
          </p>
        </div>

        {/* Tab Switcher: Stock List vs Movements */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("stock")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "stock"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <Boxes size={14} />
            <span>Stock Catalog</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("movements")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "movements"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <History size={14} />
            <span>Audit Trail ({stockMovements.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Total Inventory Value</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalAssetValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">At standard cost price</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Units in Stock</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">{totalUnitsInStock}</div>
          <div className="text-[11px] text-gray-400">Across all outlets</div>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === "low" ? "all" : "low")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            stockFilter === "low" ? "border-amber-500 ring-1 ring-amber-500" : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle size={13} />
            <span>Low Stock Alerts</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">{lowStockCount}</div>
          <div className="text-[11px] text-amber-600">Below threshold</div>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === "out" ? "all" : "out")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            stockFilter === "out" ? "border-red-500 ring-1 ring-red-500" : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertTriangle size={13} />
            <span>Out of Stock</span>
          </div>
          <div className="text-2xl font-bold text-red-600 font-mono">{outOfStockCount}</div>
          <div className="text-[11px] text-red-600">Needs urgent restocking</div>
        </div>
      </div>

      {activeTab === "stock" ? (
        /* Stock List Tab */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as "all" | "low" | "out")}
                aria-label="Filter by stock status"
                className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white text-gray-700 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="all">All Inventory</option>
                <option value="low">Low Stock Only</option>
                <option value="out">Out of Stock Only</option>
              </select>

              <div className="relative min-w-[240px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search item, SKU, barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Item / Name</th>
                  <th className="py-3 px-3">SKU & Barcode</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Cost Price</th>
                  <th className="py-3 px-3 text-right">Current Stock</th>
                  <th className="py-3 px-3 text-right">Stock Value</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-gray-950">
                      <div>{p.name}</div>
                      {p.unit && <div className="text-[11px] text-gray-400 font-normal">Unit: {p.unit}</div>}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-500">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-gray-400">{p.barcode}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-600">
                      ₹{p.costPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                      {p.stock}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">
                      ₹{(p.stock * p.costPrice).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {p.status === "In Stock" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} /> Healthy
                        </span>
                      )}
                      {p.status === "Low Stock" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle size={11} /> Low ({p.stock}/{p.lowStockThreshold})
                        </span>
                      )}
                      {p.status === "Out of Stock" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle size={11} /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setAdjustingProduct(p);
                          setAdjustQty(0);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-black hover:text-white hover:border-black text-gray-700 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Movements Audit Log Tab */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-950">Real-Time Stock Audit Trail</h3>
            <p className="text-xs text-gray-500">
              Complete chronological ledger of inventory deductions from POS checkouts and manual adjustments.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Activity Type</th>
                  <th className="py-3 px-3 text-right">Adjustment</th>
                  <th className="py-3 px-3 text-right">Previous</th>
                  <th className="py-3 px-3 text-right">New Stock</th>
                  <th className="py-3 px-3">Reason / User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {stockMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-gray-500 whitespace-nowrap">{mov.date}</td>
                    <td className="py-3.5 px-3 font-semibold text-gray-950">{mov.productName}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          mov.type === "Sale"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : mov.type === "Purchase Inward"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : mov.type === "Wastage"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-3 text-right font-mono font-bold ${
                        mov.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-500">{mov.previousStock}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-gray-950">{mov.newStock}</td>
                    <td className="py-3.5 px-3 text-gray-600">
                      <div>{mov.reason || "Automated POS Sale deduction"}</div>
                      <div className="text-[10px] text-gray-400 font-mono">By: {mov.user}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full border border-gray-200 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-gray-700" />
                <span className="font-bold text-gray-900 text-sm">
                  Adjust Stock: {adjustingProduct.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                aria-label="Close stock adjustment"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="p-6 space-y-4 text-xs text-gray-700">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center font-mono">
                <div>
                  <span className="text-gray-500">Current Stock:</span>{" "}
                  <strong className="text-gray-950">{adjustingProduct.stock} units</strong>
                </div>
                <div>
                  <span className="text-gray-500">SKU:</span>{" "}
                  <span className="text-gray-800">{adjustingProduct.sku}</span>
                </div>
              </div>

              {/* Action Type Toggle */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType("add")}
                    className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      adjustType === "add"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Plus size={14} />
                    <span>Add Stock (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("subtract")}
                    className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      adjustType === "subtract"
                        ? "bg-rose-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Minus size={14} />
                    <span>Reduce Stock (-)</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustQty || ""}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  placeholder="Enter number of units"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-black"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Reason for Adjustment</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="Restock / Purchase Inward">Restock / Purchase Inward</option>
                  <option value="Damaged Goods / Spillage">Damaged Goods / Spillage</option>
                  <option value="Inventory Count Correction">Physical Inventory Count Correction</option>
                  <option value="Expired Stock Removal">Expired Stock Removal</option>
                  <option value="Staff Training Usage">Barista / Staff Training Usage</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500">Projected New Stock:</span>
                <span className="font-bold text-sm text-gray-950">
                  {adjustType === "add"
                    ? adjustingProduct.stock + adjustQty
                    : Math.max(0, adjustingProduct.stock - adjustQty)}{" "}
                  units
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
