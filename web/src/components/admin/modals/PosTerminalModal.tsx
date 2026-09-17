"use client";

import React, { useState } from "react";
import {
  IconX,
  IconShoppingCart,
  IconSearch,
  IconPlus,
  IconMinus,
  IconTrash,
  IconCreditCard,
  IconQrcode,
  IconCurrencyDollar,
  IconPrinter,
  IconCheck,
  IconToolsKitchen2,
  IconShoppingBag,
  IconTruck,
  IconKey,
} from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { CartItem, Product, Sale } from "../types";

export const PosTerminalModal: React.FC = () => {
  const {
    isPosModalOpen,
    setIsPosModalOpen,
    products,
    categories,
    selectedOutlet,
    devices,
    staffList,
    currentShift,
    startShift,
    createSale,
  } = useAdminStore();

  // POS Session state
  const [selectedTerminal, setSelectedTerminal] = useState("T1");
  const [enteredPin, setEnteredPin] = useState("");
  const [loggedInStaff, setLoggedInStaff] = useState<any>(staffList[0] || null);
  const [isShiftStarted, setIsShiftStarted] = useState(true);

  // Cart & Order State
  const [orderType, setOrderType] = useState<"Dine-in" | "Takeaway" | "Delivery">("Dine-in");
  const [tableNumber, setTableNumber] = useState("Table 04");
  const [parcelNumber, setParcelNumber] = useState("Parcel #18");
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0] || ({} as any), quantity: 1 },
    { product: products[1] || ({} as any), quantity: 1 },
  ]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Payment & Receipt States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "Cash" | "Card">("UPI");
  const [cashTendered, setCashTendered] = useState<number>(1000);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  if (!isPosModalOpen) return null;

  // PIN login handler
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffList.find((s) => s.pin === enteredPin);
    if (staff) {
      setLoggedInStaff(staff);
      setEnteredPin("");
      setIsShiftStarted(true);
      startShift(staff.id, selectedTerminal, 5000);
    } else {
      alert("Invalid PIN. (Try 1234 for Rahul Sharma, 2244 for Priya Patel)");
      setEnteredPin("");
    }
  };

  // Cart calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.05 * 100) / 100;
  const total = Math.max(0, taxableAmount + tax);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleProcessPayment = () => {
    if (cart.length === 0) return;

    const sale = createSale({
      items: cart,
      subtotal,
      discount: discountAmount,
      tax,
      total,
      paymentMethod: selectedMethod,
      customerName: orderType === "Dine-in" ? `${tableNumber} Guest` : `${parcelNumber} Guest`,
      orderType,
      tableOrParcel: orderType === "Dine-in" ? tableNumber : parcelNumber,
      terminalCode: `${selectedTerminal} — Main Register`,
      staffName: loggedInStaff ? loggedInStaff.name : "Rahul Sharma",
    });

    setCompletedSale(sale);
    setIsPaymentOpen(false);
  };

  const handleStartNewSale = () => {
    setCompletedSale(null);
    setCart([]);
    setDiscountAmount(0);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] max-h-[850px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#0e0e11] text-white px-5 py-3 flex items-center justify-between shrink-0 select-none border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold italic tracking-tight">nuradesk</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>POS LIVE ({selectedTerminal})</span>
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              {selectedOutlet.name} | Cashier: {loggedInStaff ? loggedInStaff.name : "Staff"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm("End current shift and log out?")) {
                  setLoggedInStaff(null);
                  setIsShiftStarted(false);
                }
              }}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800"
            >
              Switch Staff
            </button>
            <button
              type="button"
              onClick={() => setIsPosModalOpen(false)}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>
        </div>

        {/* PIN LOGIN GATE (If not logged in) */}
        {!isShiftStarted || !loggedInStaff ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl border border-gray-200 shadow-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                <IconKey size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-950">Staff PIN Login</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter 4-digit PIN to unlock POS Terminal {selectedTerminal}
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="••••"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
                  className="w-40 h-12 text-center text-3xl tracking-widest font-mono font-bold rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none mx-auto"
                />

                <button
                  type="submit"
                  disabled={enteredPin.length < 4}
                  className="w-full h-10 rounded-lg bg-black text-white font-semibold text-xs hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  Unlock Register & Start Shift
                </button>
              </form>

              <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                Demo PINs: <span className="font-mono font-bold text-gray-700">1234</span> (Rahul),{" "}
                <span className="font-mono font-bold text-gray-700">2244</span> (Priya),{" "}
                <span className="font-mono font-bold text-gray-700">5566</span> (Amit)
              </div>
            </div>
          </div>
        ) : (
          /* LIVE POS WORKSTATION BODY */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT PANE: CATALOG & ORDER TYPE */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 bg-gray-50/40">
              {/* Order Type & Table Bar */}
              <div className="p-3.5 bg-white border-b border-gray-100 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setOrderType("Dine-in")}
                    className={`h-8 px-3 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                      orderType === "Dine-in"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconToolsKitchen2 size={13} />
                    <span>Dine-In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("Takeaway")}
                    className={`h-8 px-3 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                      orderType === "Takeaway"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconShoppingBag size={13} />
                    <span>Takeaway</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("Delivery")}
                    className={`h-8 px-3 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                      orderType === "Delivery"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconTruck size={13} />
                    <span>Delivery</span>
                  </button>
                </div>

                {orderType === "Dine-in" ? (
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 bg-gray-50 cursor-pointer"
                  >
                    {["Table 01", "Table 02", "Table 03", "Table 04", "Table 05", "Table 06"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={parcelNumber}
                    onChange={(e) => setParcelNumber(e.target.value)}
                    className="w-28 h-8 px-2.5 rounded-lg border border-gray-200 text-xs font-mono font-semibold text-gray-800 bg-gray-50"
                  />
                )}
              </div>

              {/* Search & Category Pills */}
              <div className="p-3 border-b border-gray-100 bg-white space-y-2 shrink-0">
                <div className="relative">
                  <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu or scan barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:border-black"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActiveCategory(c)}
                      className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                        activeCategory === c
                          ? "bg-black text-white font-bold"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="flex-1 p-3.5 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="p-3 rounded-xl bg-white border border-gray-200 hover:border-black cursor-pointer transition-all flex flex-col justify-between space-y-2 select-none group"
                    >
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold">{p.category}</span>
                        <h4 className="text-xs font-bold text-gray-950 mt-0.5 leading-snug line-clamp-2">
                          {p.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-xs font-mono font-bold text-gray-950">
                          ₹{p.sellingPrice}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                          +
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANE: ACTIVE TICKET & CART */}
            <div className="w-full md:w-88 lg:w-96 bg-white flex flex-col justify-between shrink-0 border-t md:border-t-0 border-gray-200">
              {/* Ticket Header */}
              <div className="p-3.5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <div className="font-bold text-gray-950 text-xs flex items-center gap-2">
                    <span>Active Ticket</span>
                    <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-mono text-[10px]">
                      {orderType === "Dine-in" ? tableNumber : parcelNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {cart.reduce((a, c) => a + c.quantity, 0)} item(s) selected
                  </div>
                </div>

                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs py-10 space-y-2">
                    <IconShoppingCart size={24} className="stroke-1 text-gray-300" />
                    <span>Cart is empty. Tap menu items to add.</span>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                        <div className="text-gray-400 font-mono text-[11px]">
                          ₹{item.product.sellingPrice} each
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                          >
                            <IconMinus size={12} />
                          </button>
                          <span className="font-bold text-xs font-mono w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xs"
                          >
                            <IconPlus size={12} />
                          </button>
                        </div>

                        <span className="w-16 text-right font-mono font-bold text-gray-950">
                          ₹{(item.product.sellingPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals & Payment Trigger */}
              <div className="p-3.5 border-t border-gray-100 bg-gray-50/50 space-y-2.5 shrink-0">
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>GST (5% F&B)</span>
                    <span className="font-mono">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-950 pt-1.5 border-t border-gray-200">
                    <span>Total Due</span>
                    <span className="font-mono text-base font-black">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => alert(`KOT Sent to Kitchen K1 for ${orderType === "Dine-in" ? tableNumber : parcelNumber}!`)}
                    className="h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs"
                  >
                    KOT / Kitchen
                  </button>
                  <button
                    type="button"
                    disabled={cart.length === 0}
                    onClick={() => setIsPaymentOpen(true)}
                    className="h-10 rounded-lg bg-black hover:bg-zinc-800 text-white font-semibold text-xs disabled:opacity-50"
                  >
                    Pay ₹{total.toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT POPUP MODAL */}
        {isPaymentOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-base font-bold text-gray-950">Select Payment Method</h4>
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="text-gray-400 hover:text-black"
                >
                  <IconX size={16} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-1">
                <div className="text-xs text-gray-500">Amount Due</div>
                <div className="text-3xl font-black font-mono text-gray-950">₹{total.toFixed(2)}</div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "UPI", icon: IconQrcode, label: "UPI / QR" },
                  { id: "Card", icon: IconCreditCard, label: "Card Swipe" },
                  { id: "Cash", icon: IconCurrencyDollar, label: "Cash" },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-colors ${
                        isSelected
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedMethod === "Cash" && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Cash Tendered:</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(Number(e.target.value))}
                      className="w-24 h-8 px-2 rounded border border-gray-300 font-mono text-right"
                    />
                  </div>
                  <div className="flex justify-between font-bold text-xs text-emerald-700">
                    <span>Change Due:</span>
                    <span className="font-mono">₹{Math.max(0, cashTendered - total).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {selectedMethod === "UPI" && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center text-[11px] text-gray-600 space-y-1">
                  <div className="font-semibold text-gray-900">Dynamic UPI QR Ready on Customer Display CD1</div>
                  <div>Supports GPay, PhonePe, Paytm, BHIM</div>
                </div>
              )}

              <button
                type="button"
                onClick={handleProcessPayment}
                className="w-full h-11 rounded-lg bg-black text-white font-bold hover:bg-zinc-800 transition-colors text-xs"
              >
                Complete Sale & Print Receipt
              </button>
            </div>
          </div>
        )}

        {/* THERMAL RECEIPT SUCCESS POPUP */}
        {completedSale && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-6 space-y-4 text-xs font-mono">
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-300">
                <div className="font-sans font-black text-base italic text-gray-950">nuradesk</div>
                <div className="text-[11px] text-gray-600">{completedSale.outlet}</div>
                <div className="text-[10px] text-gray-400">GSTIN: 29AABCN8291Q1Z4</div>
              </div>

              <div className="text-[11px] text-gray-600 space-y-0.5 border-b border-dashed border-gray-300 pb-2">
                <div className="flex justify-between">
                  <span>Invoice:</span>
                  <span className="font-bold text-gray-900">{completedSale.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date/Time:</span>
                  <span>{completedSale.date} {completedSale.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier / Reg:</span>
                  <span>{completedSale.staffName} ({completedSale.terminal})</span>
                </div>
              </div>

              <div className="space-y-1 border-b border-dashed border-gray-300 pb-2 text-[11px]">
                {completedSale.items.map((it) => (
                  <div key={it.product.id} className="flex justify-between">
                    <span>{it.quantity}x {it.product.name}</span>
                    <span>₹{(it.product.sellingPrice * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-xs border-b border-dashed border-gray-300 pb-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{completedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{completedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-950 pt-1">
                  <span>TOTAL PAID ({completedSale.paymentMethod}):</span>
                  <span>₹{completedSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-gray-400 pt-1">
                Thank you for visiting! Powered by Nuradesk POS
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => alert("Thermal receipt sent to P1 printer!")}
                  className="h-9 rounded-lg border border-gray-300 font-sans font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-1.5"
                >
                  <IconPrinter size={13} />
                  <span>Print Thermal Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartNewSale}
                  className="h-9 rounded-lg bg-black text-white font-sans font-semibold hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                >
                  <IconCheck size={14} />
                  <span>Next Sale</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
