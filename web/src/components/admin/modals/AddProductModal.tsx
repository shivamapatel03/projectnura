"use client";

import React, { useState } from "react";
import { IconX, IconPlus, IconTrash, IconPhoto, IconFileText, IconCheck } from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { ProductModifier, ProductVariant } from "../types";

const PRESET_IMAGES = [
  { label: "Espresso", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80" },
  { label: "Cappuccino", url: "https://images.unsplash.com/photo-1572442388796-11668ba67e53?w=400&q=80" },
  { label: "Cold Brew", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80" },
  { label: "Croissant", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
  { label: "Matcha", url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80" },
  { label: "Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { label: "Sourdough", url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80" },
  { label: "Brownie", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
];

export const AddProductModal: React.FC = () => {
  const { isAddProductOpen, setIsAddProductOpen, addProduct, categories } = useAdminStore();

  const [activeSubTab, setActiveSubTab] = useState<"general" | "restaurant" | "retail">("general");

  // General fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Beverages");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [taxRate, setTaxRate] = useState<number>(5);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [imageOption, setImageOption] = useState<"no-image" | "image">("no-image");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("50");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [inventoryTracking, setInventoryTracking] = useState(true);
  const [active, setActive] = useState(true);

  // Restaurant fields
  const [kitchenStation, setKitchenStation] = useState<"Kitchen" | "Bar" | "Grill" | "Dessert">("Kitchen");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [varName, setVarName] = useState("");
  const [varPrice, setVarPrice] = useState("");

  const [modifiers, setModifiers] = useState<ProductModifier[]>([]);
  const [modName, setModName] = useState("");
  const [modOptionName, setModOptionName] = useState("");
  const [modOptionPrice, setModOptionPrice] = useState("");

  // Retail fields
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState<"pcs" | "kg" | "g" | "ltr" | "box">("pcs");
  const [supplier, setSupplier] = useState("");

  if (!isAddProductOpen) return null;

  const handleAddVariant = () => {
    if (!varName || !varPrice) return;
    setVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        name: varName,
        price: Number(varPrice),
        sku: `${sku || "SKU"}-${varName.toUpperCase().slice(0, 3)}`,
      },
    ]);
    setVarName("");
    setVarPrice("");
  };

  const handleAddModifier = () => {
    if (!modName || !modOptionName) return;
    setModifiers((prev) => [
      ...prev,
      {
        id: `mod-${Date.now()}`,
        name: modName,
        options: [{ name: modOptionName, extraPrice: Number(modOptionPrice) || 0 }],
      },
    ]);
    setModName("");
    setModOptionName("");
    setModOptionPrice("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellingPrice) return;

    const initialStock = Number(stock) || 0;
    const threshold = Number(lowStockThreshold) || 10;
    const status =
      initialStock === 0 ? "Out of Stock" : initialStock <= threshold ? "Low Stock" : "In Stock";

    addProduct({
      name,
      category,
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice) || Math.round(Number(sellingPrice) * 0.35),
      taxRate,
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: barcode || `890${Math.floor(10000000 + Math.random() * 90000000)}`,
      image: imageOption === "image" && image.trim() ? image.trim() : undefined,
      inventoryTracking,
      stock: initialStock,
      lowStockThreshold: threshold,
      status,
      active,
      kitchenStation,
      variants: variants.length > 0 ? variants : undefined,
      modifiers: modifiers.length > 0 ? modifiers : undefined,
      brand: brand || undefined,
      unit,
      supplier: supplier || undefined,
    });

    setIsAddProductOpen(false);
    // Reset
    setName("");
    setSellingPrice("");
    setCostPrice("");
    setSku("");
    setBarcode("");
    setImageOption("no-image");
    setImage("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-950">Add New Product</h3>
            <p className="text-xs text-gray-500">
              Configure catalog item, pricing, variants, and stock tracking.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddProductOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50/70 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab("general")}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeSubTab === "general"
                ? "border-black text-black font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            General & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("restaurant")}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeSubTab === "restaurant"
                ? "border-black text-black font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Restaurant (Variants & KDS)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("retail")}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeSubTab === "retail"
                ? "border-black text-black font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Retail (Brand & Supplier)
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {activeSubTab === "general" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pistachio Matcha Cold Foam"
                  className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all font-medium text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all text-xs text-gray-900 font-medium cursor-pointer"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Tax Rate (GST)</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all text-xs text-gray-900 font-medium cursor-pointer"
                  >
                    <option value={0}>0% (Tax Exempt)</option>
                    <option value={5}>5% (Restaurant / F&B)</option>
                    <option value={12}>12% (Packaged Goods)</option>
                    <option value={18}>18% (Standard Retail)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="280.00"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all font-mono text-xs text-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="85.00"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all font-mono text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. BEV-MAT-009"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all font-mono text-xs text-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Barcode (EAN/UPC)</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="89012345009"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all font-mono text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Product Media Display: Image vs Non-Image Option */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="font-bold text-gray-900 text-xs">Product Media Display Option</div>
                    <div className="text-gray-500 text-[11px]">Configure whether this product displays with a high-res photo or as a compact text-only card</div>
                  </div>
                  <div className="inline-flex bg-gray-200/70 p-0.5 rounded-lg shrink-0">
                    <button
                      type="button"
                      onClick={() => setImageOption("no-image")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        imageOption === "no-image"
                          ? "bg-white text-gray-950 shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <IconFileText size={13} />
                      <span>Non-Image (Text Only)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageOption("image")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        imageOption === "image"
                          ? "bg-black text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <IconPhoto size={13} />
                      <span>With Image</span>
                    </button>
                  </div>
                </div>

                {imageOption === "image" ? (
                  <div className="space-y-3 pt-2.5 border-t border-gray-200/70">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-700">Image Web URL</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white font-mono text-xs outline-none focus:border-black"
                        />
                        {image && (
                          <button
                            type="button"
                            onClick={() => setImage("")}
                            className="px-2.5 h-9 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:text-red-600 hover:border-red-200 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preset Image Suggestions */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-medium text-gray-500">Quick-Pick Coffee & Food Presets:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setImage(preset.url)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                              image === preset.url
                                ? "bg-black text-white border-black"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Thumbnail Preview */}
                    {image && (
                      <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200">
                        <img
                          src={image}
                          alt="Preview"
                          className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80";
                          }}
                        />
                        <div className="text-xs">
                          <div className="font-bold text-gray-900">{name || "Product Name"}</div>
                          <div className="text-gray-500 font-mono text-[11px]">₹{sellingPrice || "0.00"}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Image linked (Will render photo card in POS Terminal)</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs uppercase">
                        {(name || "PR").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Text-Only Card Mode</div>
                        <div className="text-[11px] text-gray-500">Fast, compact display in POS Terminal</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Inventory Stock Tracking</div>
                    <div className="text-gray-500 text-[11px]">Track deductions on every sale</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={inventoryTracking}
                    onChange={(e) => setInventoryTracking(e.target.checked)}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                </div>

                {inventoryTracking && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200/60">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">Initial Stock</label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">Low Stock Alert</label>
                      <input
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === "restaurant" && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900">Kitchen Display (KDS) Routing</label>
                <select
                  value={kitchenStation}
                  onChange={(e) => setKitchenStation(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none transition-all text-xs"
                >
                  <option value="Kitchen">Kitchen Station (Cooked Dishes & Meals)</option>
                  <option value="Bar">Beverage Bar (Espresso & Cocktails)</option>
                  <option value="Grill">Grill / Tandoor Section</option>
                  <option value="Dessert">Bakery & Dessert Station</option>
                </select>
              </div>

              {/* Variants Section */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>Portion Sizes & Variants</span>
                  <span className="text-[11px] text-gray-500">e.g. Regular, Large</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Variant name (e.g. Large)"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={varPrice}
                    onChange={(e) => setVarPrice(e.target.value)}
                    className="w-28 h-9 px-3 rounded-lg border border-gray-200 bg-white font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 h-9 bg-black text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                  >
                    <IconPlus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {variants.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {variants.map((v, i) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 text-xs"
                      >
                        <span className="font-medium">{v.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold">₹{v.price}</span>
                          <button
                            type="button"
                            onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IconTrash size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modifiers Section */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>Custom Add-ons & Modifiers</span>
                  <span className="text-[11px] text-gray-500">e.g. Oat Milk (+₹45)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Group (e.g. Milk)"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Option (e.g. Almond Milk)"
                    value={modOptionName}
                    onChange={(e) => setModOptionName(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="+₹"
                      value={modOptionPrice}
                      onChange={(e) => setModOptionPrice(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddModifier}
                      className="px-3 h-9 bg-black text-white rounded-lg font-semibold text-xs shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {modifiers.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {modifiers.map((m, i) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 text-xs"
                      >
                        <div>
                          <span className="font-bold text-gray-900">{m.name}: </span>
                          <span className="text-gray-600">
                            {m.options[0]?.name} (+₹{m.options[0]?.extraPrice})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setModifiers((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <IconTrash size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === "retail" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900">Brand / Manufacturer</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Blue Tokai / Nuradesk Reserve"
                  className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Unit of Measure</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="ltr">Litres (ltr)</option>
                    <option value="box">Carton Box (box)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Primary Supplier</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="e.g. Metro Cash & Carry"
                    className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activeProd"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              <label htmlFor="activeProd" className="text-xs text-gray-700 cursor-pointer font-medium">
                Make product immediately active for sale
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="h-10 px-4 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-black text-white hover:bg-zinc-800 font-semibold transition-colors"
              >
                Save Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
