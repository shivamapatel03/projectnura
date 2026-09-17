"use client";

import React, { useState } from "react";
import { IconPlus, IconSearch, IconAlertTriangle, IconTrash, IconEdit, IconPackage } from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";

export const ProductsView: React.FC = () => {
  const { products, categories, setIsAddProductOpen, deleteProduct, updateProduct } = useAdminStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

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

  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Products & Menu Catalog
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your menu items, categories, variants, taxes, and stock levels.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddProductOpen(true)}
          className="h-10 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <IconPlus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 4 Summary Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Total Products</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">{products.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Inventory Asset Value</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            ₹{totalInventoryValue.toLocaleString()}
          </div>
        </div>
        <div
          onClick={() => setStockFilter(stockFilter === "low" ? "all" : "low")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            stockFilter === "low" ? "border-amber-500 ring-1 ring-amber-500" : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <IconAlertTriangle size={13} />
            <span>Low Stock Items</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">{lowStockCount}</div>
        </div>
        <div
          onClick={() => setStockFilter(stockFilter === "out" ? "all" : "out")}
          className={`p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1 cursor-pointer transition-colors ${
            stockFilter === "out" ? "border-red-500 ring-1 ring-red-500" : "hover:border-gray-300"
          }`}
        >
          <div className="text-xs text-red-600 font-medium flex items-center gap-1">
            <IconAlertTriangle size={13} />
            <span>Out of Stock</span>
          </div>
          <div className="text-2xl font-bold text-red-600 font-mono">{outOfStockCount}</div>
        </div>
      </div>

      {/* Main Products Container */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Search & Category Filter Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <IconSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product name, SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold pb-3">
                <th className="pb-3 pl-1">Product Details</th>
                <th className="pb-3">SKU / Barcode</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Selling Price</th>
                <th className="pb-3">Cost Price</th>
                <th className="pb-3">Tax (GST)</th>
                <th className="pb-3">Stock Units</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const margin = p.sellingPrice > 0 ? Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100) : 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 shadow-2xs"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs uppercase shrink-0">
                            {p.name.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-950 text-xs sm:text-sm">{p.name}</div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            {p.kitchenStation && (
                              <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-mono text-[10px]">
                                {p.kitchenStation}
                              </span>
                            )}
                            {p.variants && (
                              <span className="text-gray-400">
                                {p.variants.length} variant{p.variants.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-mono text-[11px]">
                      <div className="font-semibold text-gray-900">{p.sku}</div>
                      <div className="text-gray-400 text-[10px]">{p.barcode}</div>
                    </td>

                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 font-bold text-gray-950 font-mono text-xs">
                      ₹{p.sellingPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 font-mono text-gray-500 text-xs">
                      ₹{p.costPrice.toFixed(2)}
                      <span className="text-[10px] text-emerald-600 font-semibold ml-1">
                        ({margin}% margin)
                      </span>
                    </td>

                    <td className="py-3.5 font-mono text-gray-600">{p.taxRate}%</td>

                    <td className="py-3.5 font-mono font-bold text-gray-950 text-xs">
                      {p.stock} units
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "In Stock"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "Low Stock"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-1">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newPrice = prompt("Enter new selling price:", p.sellingPrice.toString());
                            if (newPrice && !isNaN(Number(newPrice))) {
                              updateProduct(p.id, { sellingPrice: Number(newPrice) });
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                          title="Quick edit price"
                        >
                          <IconEdit size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <IconTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <IconPackage size={24} className="stroke-1 text-gray-300" />
                      <span>No products found matching your search.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
