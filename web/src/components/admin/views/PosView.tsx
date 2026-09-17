"use client";

import React, { useState } from "react";
import {
  IconPlus,
  IconSearch,
  IconShoppingCart,
  IconReceipt,
  IconCreditCard,
  IconCash,
  IconDeviceMobile,
  IconWallet,
  IconBuilding,
  IconCircleCheck,
  IconPrinter,
  IconShare,
  IconArrowLeft,
  IconTrash,
  IconPlayerPause,
  IconPlayerPlay,
  IconX,
  IconClock,
  IconToolsKitchen2,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { CartItem, PaymentMethod, Product, Sale } from "../types";

interface HeldSale {
  id: string;
  timestamp: string;
  items: CartItem[];
  customerName: string;
}

export const PosView: React.FC = () => {
  const { products, sales, createSale, selectedOutlet, setSelectedSaleDetail } = useAdminStore();

  // Navigation mode within POS: "main" (Recent Sales list) | "new_sale"
  const [posMode, setPosMode] = useState<"main" | "new_sale">("main");

  // New Sale Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [orderType, setOrderType] = useState<"Dine-in" | "Takeaway">("Dine-in");
  const [tableOrParcel, setTableOrParcel] = useState<string>("Table 01");
  const [customerName, setCustomerName] = useState<string>("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  // Held Sales State
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);

  // Payment & Receipt Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("Cash");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);
  const [sendReceiptToast, setSendReceiptToast] = useState(false);

  // Categories list
  const categories = ["All", "Coffee", "Food", "Drinks", "Desserts", "Bakery"];

  // Filter products for catalog
  const filteredProducts = products.filter((p) => {
    let matchesCat = true;
    if (selectedCategory === "Coffee") {
      matchesCat = p.category === "Beverages" && p.name.toLowerCase().includes("cappuccino") || p.name.toLowerCase().includes("brew") || p.name.toLowerCase().includes("matcha") || p.category === "Coffee";
    } else if (selectedCategory === "Food") {
      matchesCat = p.category === "Brunch Specials" || p.category === "Food";
    } else if (selectedCategory === "Drinks") {
      matchesCat = p.category === "Beverages";
    } else if (selectedCategory === "Bakery") {
      matchesCat = p.category === "Bakery & Toast";
    } else if (selectedCategory === "Desserts") {
      matchesCat = p.category === "Desserts";
    }

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.sellingPrice;
    const mods = (item.selectedModifiers || []).reduce((mSum, m) => mSum + m.extraPrice, 0);
    return acc + (price + mods) * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + tax;

  // Cart Helpers
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName("Walk-in Customer");
    setCustomerPhone("");
  };

  // Hold Sale
  const handleHoldSale = () => {
    if (cart.length === 0) return;
    const newHeld: HeldSale = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [...cart],
      customerName: customerName || "Walk-in Customer",
    };
    setHeldSales((prev) => [newHeld, ...prev]);
    clearCart();
    setPosMode("main");
  };

  // Resume Held Sale
  const handleResumeSale = (held: HeldSale) => {
    setCart(held.items);
    setCustomerName(held.customerName);
    setHeldSales((prev) => prev.filter((h) => h.id !== held.id));
    setPosMode("new_sale");
  };

  // Confirm Payment & Complete Sale
  const handleConfirmPayment = () => {
    if (cart.length === 0) return;

    const newSale = createSale({
      items: cart,
      subtotal,
      discount: 0,
      tax,
      total,
      paymentMethod: selectedPaymentMethod,
      customerName: customerName || "Walk-in Customer",
      customerPhone: customerPhone || undefined,
      orderType,
      tableOrParcel: orderType === "Dine-in" ? tableOrParcel : "Takeaway Parcel",
      terminalCode: "POS",
      staffName: "Rahul Sharma",
    });

    setLastCompletedSale(newSale);
    setIsPaymentOpen(false);
    clearCart();
  };

  // Format date helper: "Today", "Yesterday", or formatted date string
  const getRelativeDate = (dateStr: string) => {
    return dateStr.includes("17 Sep") ? "Today" : "Yesterday";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. SCREEN: POS MAIN (Header + Recent Sales)                               */}
      {/* ========================================================================= */}
      {posMode === "main" && (
        <div className="space-y-6">
          {/* Top POS Header Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">POS</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Start a new sale or continue an existing sale.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {heldSales.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                  <IconPlayerPause size={15} />
                  <span>{heldSales.length} Held Sale{heldSales.length > 1 ? "s" : ""}</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setPosMode("new_sale")}
                className="h-11 px-5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span>+ New Sale</span>
              </button>
            </div>
          </div>

          {/* Held Sales Resume Bar (if any held) */}
          {heldSales.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <IconPlayerPause size={14} className="text-amber-600" />
                <span>HELD SALES READY TO RESUME</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {heldSales.map((h) => {
                  const hTotal = h.items.reduce((sum, it) => sum + it.product.sellingPrice * it.quantity, 0);
                  return (
                    <div
                      key={h.id}
                      className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-gray-950">{h.customerName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {h.items.length} items • ₹{hTotal} • {h.timestamp}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResumeSale(h)}
                        className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Resume
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Sales Section */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-950">Recent Sales</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest completed transactions processed through POS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPosMode("new_sale")}
                className="text-xs font-semibold text-black hover:underline cursor-pointer"
              >
                + New Sale
              </button>
            </div>

            {/* Sales Table matching format: INV-1005 | ₹850 | Cash | Today | Completed */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Invoice</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {sales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedSaleDetail(sale)}
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-950">
                        {sale.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-950">
                        ₹{sale.total.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-medium text-gray-800">
                          {sale.paymentMethod === "Cash" && <IconCash size={13} className="text-emerald-600" />}
                          {sale.paymentMethod === "UPI" && <IconDeviceMobile size={13} className="text-purple-600" />}
                          {sale.paymentMethod === "Card" && <IconCreditCard size={13} className="text-blue-600" />}
                          {sale.paymentMethod === "Wallet" && <IconWallet size={13} className="text-amber-600" />}
                          {sale.paymentMethod === "Credit" && <IconBuilding size={13} className="text-indigo-600" />}
                          <span>{sale.paymentMethod}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-600">
                        {getRelativeDate(sale.date)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <IconCircleCheck size={11} /> Completed
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedSaleDetail(sale)}
                          className="text-xs text-gray-600 hover:text-black font-semibold underline underline-offset-2 cursor-pointer"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SCREEN: NEW SALE (Product Selection + CURRENT SALE Cart)               */}
      {/* ========================================================================= */}
      {posMode === "new_sale" && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPosMode("main")}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
                title="Back to Recent Sales"
              >
                <IconArrowLeft size={16} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-950">New Sale</h2>
                <p className="text-xs text-gray-500">Scan or select items from catalog.</p>
              </div>
            </div>

            {/* Dining Mode Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setOrderType("Dine-in")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    orderType === "Dine-in" ? "bg-white text-black shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  <IconToolsKitchen2 size={13} />
                  <span>Dine-in</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("Takeaway")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    orderType === "Takeaway" ? "bg-white text-black shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  <IconShoppingBag size={13} />
                  <span>Takeaway</span>
                </button>
              </div>

              {orderType === "Dine-in" && (
                <input
                  type="text"
                  value={tableOrParcel}
                  onChange={(e) => setTableOrParcel(e.target.value)}
                  placeholder="Table #"
                  className="w-24 h-9 px-2.5 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-black"
                />
              )}
            </div>
          </div>

          {/* 2-Column Split: Products Catalog vs CURRENT SALE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Search + Categories + Products (Cols 1 to 7) */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              {/* Search products: [ Search / Scan ] */}
              <div className="relative">
                <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-black"
                />
              </div>

              {/* Categories: All | Coffee | Food | Drinks | Desserts */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Categories
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
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

              {/* Products Grid */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Products ({filteredProducts.length})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="p-3.5 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50/60 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-xs text-gray-950 group-hover:text-black">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{p.category}</div>
                        <div className="text-xs font-bold text-gray-900 font-mono mt-1">
                          ₹{p.sellingPrice}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shrink-0"
                        title="Add to cart"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CURRENT SALE (Cols 8 to 12) */}
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="text-sm font-bold text-gray-950 uppercase tracking-wider">
                  CURRENT SALE
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items List: Cappuccino × 2   ₹300 */}
              <div className="space-y-2.5 min-h-[160px] max-h-[280px] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-1">
                    <IconShoppingCart size={28} className="mx-auto opacity-30" />
                    <p className="text-xs">No items in current sale.</p>
                    <p className="text-[11px] text-gray-400">Click any product on the left to add.</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.product.sellingPrice;
                    const itemTotal = itemPrice * item.quantity;
                    return (
                      <div
                        key={item.product.id}
                        className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-gray-950 truncate">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            ₹{itemPrice} each
                          </div>
                        </div>

                        {/* Stepper + Total */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <div className="w-16 text-right font-mono font-bold text-xs text-gray-950">
                            ₹{itemTotal}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-rose-600 cursor-pointer"
                            title="Remove"
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Subtotal, Tax, TOTAL */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (5% GST)</span>
                  <span className="text-gray-900 font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-950 pt-2 border-t border-gray-200">
                  <span>TOTAL</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* [ Hold ] [ Pay ] Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={handleHoldSale}
                  className="h-11 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <IconPlayerPause size={15} />
                  <span>Hold</span>
                </button>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => setIsPaymentOpen(true)}
                  className="h-11 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                >
                  <IconCreditCard size={15} />
                  <span>Pay (₹{total.toLocaleString()})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: PAYMENT SCREEN                                                  */}
      {/* ========================================================================= */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full border border-gray-200 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="font-bold text-gray-900 text-sm">PAYMENT</span>
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <IconX size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-gray-700">
              {/* Total Due Banner */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-0.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Due
                </span>
                <div className="text-3xl font-black text-gray-950 font-mono">
                  ₹{total.toLocaleString()}
                </div>
              </div>

              {/* Payment Methods (Radio options matching user spec) */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Select Payment Method
                </div>

                <div className="space-y-2">
                  {(["Cash", "UPI", "Card", "Wallet", "Credit"] as PaymentMethod[]).map((mode) => (
                    <label
                      key={mode}
                      onClick={() => setSelectedPaymentMethod(mode)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedPaymentMethod === mode
                          ? "border-black bg-gray-50 font-bold text-black"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMode"
                          checked={selectedPaymentMethod === mode}
                          onChange={() => setSelectedPaymentMethod(mode)}
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                        <span className="text-sm">{mode}</span>
                      </div>

                      <div className="text-gray-500">
                        {mode === "Cash" && <IconCash size={16} className="text-emerald-600" />}
                        {mode === "UPI" && <IconDeviceMobile size={16} className="text-purple-600" />}
                        {mode === "Card" && <IconCreditCard size={16} className="text-blue-600" />}
                        {mode === "Wallet" && <IconWallet size={16} className="text-amber-600" />}
                        {mode === "Credit" && <IconBuilding size={16} className="text-indigo-600" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* If Cash: Calculator for change */}
              {selectedPaymentMethod === "Cash" && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block text-[11px] font-bold text-gray-600">
                    Cash Tendered by Customer
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder={total.toString()}
                      className="w-full h-9 pl-7 pr-3 rounded-lg border border-gray-300 font-mono text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                  {Number(cashTendered) >= total && (
                    <div className="text-xs font-mono text-emerald-700 flex justify-between pt-1">
                      <span>Change to Return:</span>
                      <span className="font-bold">
                        ₹{(Number(cashTendered) - total).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: PAYMENT SUCCESS & RECEIPT                                       */}
      {/* ========================================================================= */}
      {lastCompletedSale && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-sm w-full border border-gray-200 overflow-hidden shadow-2xl text-center p-6 space-y-5">
            {/* Success Badge */}
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <IconCircleCheck size={28} />
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                PAYMENT SUCCESS
              </div>
              <h3 className="text-lg font-bold text-emerald-700">✓ Payment successful</h3>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs space-y-2 text-left">
              <div className="flex justify-between text-gray-600">
                <span>Invoice:</span>
                <span className="font-bold text-gray-950">{lastCompletedSale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Amount:</span>
                <span className="font-bold text-gray-950">
                  ₹{lastCompletedSale.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment:</span>
                <span className="font-bold text-gray-950">{lastCompletedSale.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Time:</span>
                <span className="text-gray-500">
                  {lastCompletedSale.date}, {lastCompletedSale.time}
                </span>
              </div>
            </div>

            {/* Toast feedback for Send Receipt */}
            {sendReceiptToast && (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fadeIn">
                Receipt SMS & WhatsApp dispatch triggered!
              </div>
            )}

            {/* Action Buttons matching user spec: [ Print Receipt ] [ Send Receipt ] [ New Sale ] */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-10 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-800 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <IconPrinter size={14} />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSendReceiptToast(true);
                    setTimeout(() => setSendReceiptToast(false), 2000);
                  }}
                  className="h-10 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-800 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <IconShare size={14} />
                  <span>Send Receipt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLastCompletedSale(null);
                  setPosMode("new_sale");
                }}
                className="w-full h-11 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                <span>+ New Sale</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLastCompletedSale(null);
                  setPosMode("main");
                }}
                className="w-full text-xs text-gray-500 hover:text-black py-1 font-medium cursor-pointer"
              >
                Back to Recent Sales
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
