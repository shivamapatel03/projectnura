"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  IconPlus,
  IconSearch,
  IconBarcode,
  IconTrash,
  IconPlayerPause,
  IconToolsKitchen2,
  IconLock,
  IconUserCheck,
  IconReceipt,
  IconCash,
  IconClipboardList,
  IconCheck,
  IconWifi,
  IconWifiOff,
  IconPrinter,
  IconCurrencyDollar,
  IconDeviceTv,
  IconUser,
  IconTag,
  IconNotes,
  IconArrowRight,
  IconChevronDown,
  IconLayoutSidebar,
  IconPhoto,
  IconFileText,
  IconChevronLeft,
  IconChevronRight,
  IconShoppingCart,
  IconArmchair,
  IconMotorbike,
  IconShieldLock,
  IconRefresh,
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useTerminalStore, TerminalOrder } from "../terminalStore";
import { Product } from "@/components/admin/types";
import { PaymentModal } from "../modals/PaymentModal";
import { ReceiptModal } from "../modals/ReceiptModal";
import { CloseShiftModal } from "../modals/CloseShiftModal";
import { CustomerModal } from "../modals/CustomerModal";
import { ProductModifierModal } from "../modals/ProductModifierModal";
import { DiscountModal } from "../modals/DiscountModal";
import { TableSelectorModal } from "../modals/TableSelectorModal";
import { HardwareStatusModal } from "../modals/HardwareStatusModal";
import { ManagerPinModal } from "../modals/ManagerPinModal";

export const PosHomeScreen: React.FC = () => {
  const {
    pairedDevice,
    currentUser,
    activeShift,
    lockTerminal,
    switchUser,
    activeView,
    setActiveView,
    orderType,
    setOrderType,
    selectedTableOrParcel,
    setSelectedTableOrParcel,
    products,
    categories,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    cgst,
    sgst,
    tax,
    total,
    discountAmount,
    setDiscountAmount,
    selectedCustomer,
    tables,
    deliveryDetails,
    setDeliveryDetails,
    parcelToken,
    heldSales,
    holdCurrentSale,
    resumeHeldSale,
    deleteHeldSale,
    orders,
    sendToKitchen,
    refundOrder,
    voidOrder,
    isOffline,
    toggleOffline,
    offlineQueueCount,
    syncOfflineQueue,
    hardware,
    playTerminalSound,
    auditLogs,
    addAuditLog,
    addCashIn,
    addCashOut,
  } = useTerminalStore();

  // Sidebars & Display toggles
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [showImages, setShowImages] = useState(true);

  // Search & Category filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Smooth Sliding Pill Switchers Refs & States
  const orderTypeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [orderTypePill, setOrderTypePill] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [categoryPill, setCategoryPill] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const updateOrderTypePill = () => {
    const el = orderTypeRefs.current[orderType];
    if (el) {
      setOrderTypePill({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  };

  const updateCategoryPill = () => {
    const el = categoryRefs.current[selectedCategory];
    if (el) {
      setCategoryPill({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  };

  useEffect(() => {
    if (activeView === "new_sale") {
      const timer = setTimeout(() => {
        updateOrderTypePill();
        updateCategoryPill();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [activeView, orderType, selectedCategory, categories]);

  useEffect(() => {
    const handleResize = () => {
      updateOrderTypePill();
      updateCategoryPill();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [orderType, selectedCategory]);

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [completedOrderForReceipt, setCompletedOrderForReceipt] = useState<TerminalOrder | null>(null);
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Product Modifiers Modal
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
  const [selectedProductForModifier, setSelectedProductForModifier] = useState<Product | null>(null);

  // Hold Sale with Note Modal
  const [isHoldSaleModalOpen, setIsHoldSaleModalOpen] = useState(false);
  const [holdSaleNoteText, setHoldSaleNoteText] = useState("");

  // Delivery Partner Details Modal
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  // Manager PIN Verification Modal State
  const [managerPinModal, setManagerPinModal] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    title: "",
    onSuccess: () => {},
  });

  // Line Item Note Modal
  const [activeItemNoteModalIndex, setActiveItemNoteModalIndex] = useState<number | null>(null);
  const [itemNoteText, setItemNoteText] = useState("");

  // Cash In / Out modal state & Subview (Drawer vs. Audit)
  const [cashSubView, setCashSubView] = useState<"drawer" | "audit">("drawer");
  const [cashFlowModal, setCashFlowModal] = useState<"in" | "out" | null>(null);
  const [cashFlowAmount, setCashFlowAmount] = useState<number>(500);
  const [cashFlowReason, setCashFlowReason] = useState("");

  // Notifications & Toasts
  const [drawerKickedToast, setDrawerKickedToast] = useState(false);
  const [kotSentToast, setKotSentToast] = useState(false);
  const [scannerToast, setScannerToast] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Barcode Scanner simulation
  const handleBarcodeSimulation = () => {
    const randomProd = products[Math.floor(Math.random() * products.length)];
    addToCart(randomProd);
    setScannerToast(`Scanned: ${randomProd.name} (${randomProd.barcode})`);
    setTimeout(() => setScannerToast(null), 2500);
  };

  // Kitchen send
  const handleSendKitchenClick = () => {
    if (cart.length === 0) return;
    sendToKitchen();
    setKotSentToast(true);
    setTimeout(() => setKotSentToast(false), 2500);
  };

  // Cash Drawer Kick with sound
  const handleOpenCashDrawer = () => {
    playTerminalSound("drawer");
    addAuditLog("Manual Drawer Kick", "Cash drawer manually triggered open by staff", "cash");
    setDrawerKickedToast(true);
    setTimeout(() => setDrawerKickedToast(false), 2000);
  };

  // Cash Flow In / Out
  const handleCashFlowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cashFlowModal === "in") {
      addCashIn(cashFlowAmount, cashFlowReason || "Float addition");
    } else if (cashFlowModal === "out") {
      addCashOut(cashFlowAmount, cashFlowReason || "Vendor / Petty payout");
    }
    setCashFlowModal(null);
    setCashFlowReason("");
  };

  // Void Order with Manager PIN
  const handleRequestVoidOrder = (order: TerminalOrder) => {
    setManagerPinModal({
      isOpen: true,
      title: `Authorize Void for Order ${order.orderNumber}`,
      description: `Amount: ₹${order.total} · Destination: ${order.tableOrParcel}`,
      onSuccess: () => {
        voidOrder(order.id, "Manager authorized void");
      },
    });
  };

  // Refund Order with Manager PIN
  const handleRequestRefundOrder = (order: TerminalOrder) => {
    setManagerPinModal({
      isOpen: true,
      title: `Authorize Refund for Order ${order.orderNumber}`,
      description: `Refund Amount: ₹${order.total} · Method: ${order.paymentMethod || "Cash"}`,
      onSuccess: () => {
        refundOrder(order.id, "Customer return / cancellation");
      },
    });
  };

  // Hold Sale Submit
  const handleHoldSaleConfirm = () => {
    holdCurrentSale(holdSaleNoteText || "Held at counter");
    setIsHoldSaleModalOpen(false);
    setHoldSaleNoteText("");
  };

  return (
    <div className="h-screen w-screen bg-[#f8f9fa] text-gray-950 flex flex-col antialiased font-sans select-none overflow-hidden">
      {/* 1. TOP TERMINAL STATUS BAR */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Sidebar Toggle, Brand Logo & Cafe Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer bg-white"
            title={isLeftSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <IconLayoutSidebar size={17} />
          </button>

          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/logo.png.png"
              alt="Nuradesk"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-gray-950">
                SHIV CAFE
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500 font-medium">
                {pairedDevice.outlet}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Device & Active Shift Info */}
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 font-mono font-bold text-xs text-gray-900">
            {pairedDevice.code}
          </span>
          <span className="text-xs font-bold text-gray-900">
            {currentUser?.name}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Shift Active</span>
          </span>
        </div>

        {/* Right: Hardware & Offline Controls */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleOffline}
            className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isOffline
                ? "bg-amber-500 border-amber-600 text-white animate-pulse"
                : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
            title={isOffline ? "Currently Offline - Click to Go Online" : "Online - Click to test Offline Mode"}
          >
            {isOffline ? <IconWifiOff size={14} /> : <IconWifi size={14} className="text-emerald-600" />}
            <span>{isOffline ? `Offline (${offlineQueueCount})` : "Online"}</span>
          </button>

          {isOffline && offlineQueueCount > 0 && (
            <button
              type="button"
              onClick={() => syncOfflineQueue()}
              className="h-8 px-2.5 rounded-lg bg-black text-white text-xs font-semibold cursor-pointer"
            >
              Sync
            </button>
          )}

          {/* Hardware Status Diagnostics Trigger */}
          <button
            type="button"
            onClick={() => setIsHardwareModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium cursor-pointer"
            title="Open Hardware Diagnostics"
          >
            <IconPrinter size={15} className={hardware.receiptPrinter ? "text-emerald-600" : "text-gray-400"} />
            <IconCurrencyDollar size={15} className={hardware.cashDrawer ? "text-emerald-600" : "text-gray-400"} />
            <IconBarcode size={15} className={hardware.barcodeScanner ? "text-emerald-600" : "text-gray-400"} />
            <span className="text-[11px] font-bold text-gray-500 hidden md:inline">Hardware</span>
          </button>

          {/* Kitchen Display System (KDS) Direct Link */}
          <a
            href="/kds"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer transition-colors"
            title="Open Kitchen Display System (KDS)"
          >
            <IconToolsKitchen2 size={15} className="text-amber-700" />
            <span className="hidden md:inline">KDS</span>
          </a>
        </div>
      </header>

      {/* Barcode Scanner Feedback Banner */}
      {scannerToast && (
        <div className="bg-blue-600 text-white text-xs font-bold py-1.5 px-4 text-center animate-fadeIn flex items-center justify-center gap-2">
          <IconBarcode size={16} />
          <span>{scannerToast}</span>
        </div>
      )}

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: TERMINAL SIDEBAR */}
        <aside
          className={`bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out z-20 select-none ${
            isLeftSidebarOpen
              ? "w-48 sm:w-52 p-2.5"
              : "w-16 p-2 items-center"
          }`}
        >
          {/* Top Section: Navigation & Actions */}
          <div className="w-full space-y-2">
            {/* Header: Navigation label + collapse button (only rendered when expanded) */}
            {isLeftSidebarOpen && (
              <div className="flex items-center justify-between mb-1 px-1 animate-fadeIn">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIsLeftSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer transition-colors"
                  title="Collapse to Mini Rail"
                >
                  <IconChevronLeft size={16} />
                </button>
              </div>
            )}

            {/* + New Sale Button */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={() => setActiveView("new_sale")}
                className={`button-20 h-10 flex items-center justify-center font-bold text-white shadow-xs cursor-pointer transition-all duration-300 ease-in-out shrink-0 ${
                  isLeftSidebarOpen
                    ? "w-full !rounded-xl !px-3 gap-2"
                    : "w-10 !rounded-full !p-0"
                }`}
                title="+ New Sale"
              >
                <IconPlus size={18} stroke={2.5} className="shrink-0" />
                {isLeftSidebarOpen && (
                  <span className="whitespace-nowrap text-xs font-bold animate-fadeIn">
                    New Sale
                  </span>
                )}
              </button>
            </div>

            {/* Orders */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={() => setActiveView("orders")}
                className={`relative h-10 rounded-xl flex items-center transition-all duration-300 ease-in-out cursor-pointer ${
                  isLeftSidebarOpen
                    ? "w-full px-3 justify-between"
                    : "w-10 justify-center"
                } ${
                  activeView === "orders"
                    ? "bg-gray-100 text-black font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
                title="Orders"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <IconClipboardList size={19} className="shrink-0 text-gray-700" />
                  {isLeftSidebarOpen && (
                    <span className="whitespace-nowrap text-xs font-semibold animate-fadeIn">
                      Orders
                    </span>
                  )}
                </div>
                {orders.filter((o) => o.status === "Preparing" || o.status === "Ready").length > 0 && (
                  <span
                    className={`font-bold transition-all duration-300 ease-in-out shrink-0 ${
                      isLeftSidebarOpen
                        ? "px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-800"
                        : "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center shadow-xs"
                    }`}
                  >
                    {orders.filter((o) => o.status === "Preparing" || o.status === "Ready").length}
                  </span>
                )}
              </button>
            </div>

            {/* Held Sales */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={() => setActiveView("held")}
                className={`relative h-10 rounded-xl flex items-center transition-all duration-300 ease-in-out cursor-pointer ${
                  isLeftSidebarOpen
                    ? "w-full px-3 justify-between"
                    : "w-10 justify-center"
                } ${
                  activeView === "held"
                    ? "bg-gray-100 text-black font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
                title="Held Sales"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <IconPlayerPause size={19} className="shrink-0 text-gray-700" />
                  {isLeftSidebarOpen && (
                    <span className="whitespace-nowrap text-xs font-semibold animate-fadeIn">
                      Held
                    </span>
                  )}
                </div>
                {heldSales.length > 0 && (
                  <span
                    className={`font-bold transition-all duration-300 ease-in-out shrink-0 ${
                      isLeftSidebarOpen
                        ? "px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900"
                        : "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center shadow-xs"
                    }`}
                  >
                    {heldSales.length}
                  </span>
                )}
              </button>
            </div>

            {/* Receipts */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={() => setActiveView("receipts")}
                className={`relative h-10 rounded-xl flex items-center transition-all duration-300 ease-in-out cursor-pointer ${
                  isLeftSidebarOpen
                    ? "w-full px-3 justify-start"
                    : "w-10 justify-center"
                } ${
                  activeView === "receipts"
                    ? "bg-gray-100 text-black font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
                title="Receipts & Ledger"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <IconReceipt size={19} className="shrink-0 text-gray-700" />
                  {isLeftSidebarOpen && (
                    <span className="whitespace-nowrap text-xs font-semibold animate-fadeIn">
                      Receipts
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Cash & Audit */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={() => setActiveView("cash")}
                className={`relative h-10 rounded-xl flex items-center transition-all duration-300 ease-in-out cursor-pointer ${
                  isLeftSidebarOpen
                    ? "w-full px-3 justify-start"
                    : "w-10 justify-center"
                } ${
                  activeView === "cash"
                    ? "bg-gray-100 text-black font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
                title="Cash In/Out & Audit Logs"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <IconCash size={19} className="shrink-0 text-gray-700" />
                  {isLeftSidebarOpen && (
                    <span className="whitespace-nowrap text-xs font-semibold animate-fadeIn">
                      Cash & Audit
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Actions: Lock & Switch User */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5 w-full flex flex-col items-center">
            {/* Lock Terminal */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={lockTerminal}
                className={`h-10 rounded-xl flex items-center transition-all duration-300 ease-in-out text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer ${
                  isLeftSidebarOpen
                    ? "w-full px-3 justify-start"
                    : "w-10 justify-center"
                }`}
                title="Lock Terminal"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <IconLock size={18} className="shrink-0 text-gray-500" />
                  {isLeftSidebarOpen && (
                    <span className="whitespace-nowrap text-xs font-semibold animate-fadeIn">
                      Lock Terminal
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Switch User */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={switchUser}
                className={`h-10 rounded-xl flex items-center transition-all duration-300 ease-in-out text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer ${
                  isLeftSidebarOpen
                    ? "w-full px-3 justify-start"
                    : "w-10 justify-center"
                }`}
                title="Switch User"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <IconUserCheck size={18} className="shrink-0 text-gray-500" />
                  {isLeftSidebarOpen && (
                    <span className="whitespace-nowrap text-xs font-semibold animate-fadeIn">
                      Switch User
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* COLUMN 2: CENTER WORKSPACE */}
        <main className="flex-1 bg-[#f8f9fa] flex flex-col overflow-hidden min-w-0">
          {/* VIEW: NEW SALE */}
          {activeView === "new_sale" && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
              {/* Order Type Switcher + Destination + Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Order Type Selector with Smooth Sliding 3D Indicator */}
                <div className="relative flex items-center p-1 rounded-xl bg-white border border-gray-200 select-none shrink-0">
                  {orderTypePill.width > 0 && (
                    <div
                      className="absolute top-1 bottom-1 button-20 !p-0 !rounded-lg transition-all duration-300 ease-out pointer-events-none"
                      style={{
                        left: `${orderTypePill.left}px`,
                        width: `${orderTypePill.width}px`,
                      }}
                    />
                  )}

                  {(["Dine-in", "Takeaway", "Delivery", "Counter Sale"] as const).map((type) => (
                    <button
                      key={type}
                      ref={(el) => {
                        orderTypeRefs.current[type] = el;
                      }}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 cursor-pointer ${
                        orderType === type
                          ? "text-white font-extrabold"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Destination Details per Order Type */}
                {orderType === "Dine-in" && (
                  <button
                    type="button"
                    onClick={() => setIsTableSelectorOpen(true)}
                    className="h-9 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-bold text-xs text-gray-900 flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                    title="Choose Table from Floor Plan"
                  >
                    <IconArmchair size={15} className="text-emerald-600" />
                    <span>{selectedTableOrParcel}</span>
                    <span className="text-[10px] text-gray-400 font-normal">Change</span>
                  </button>
                )}

                {orderType === "Takeaway" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="h-9 px-3 rounded-xl bg-purple-50 border border-purple-200 font-mono font-black text-xs text-purple-900 flex items-center gap-1.5">
                      <span>Pickup Token {parcelToken}</span>
                    </span>
                  </div>
                )}

                {orderType === "Delivery" && (
                  <button
                    type="button"
                    onClick={() => setIsDeliveryModalOpen(true)}
                    className="h-9 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 font-bold text-xs text-amber-950 flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Edit Delivery Partner & Rider Info"
                  >
                    <IconMotorbike size={15} className="text-amber-700" />
                    <span>{deliveryDetails.platform}</span>
                    <span className="text-[10px] text-amber-700 font-normal">({deliveryDetails.riderName})</span>
                  </button>
                )}

                {/* Search Bar + Barcode scan simulation + Image toggle */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <div className="relative flex items-center flex-1 max-w-xs">
                    <IconSearch size={15} className="absolute left-3 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items or SKU..."
                      className="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleBarcodeSimulation}
                    className="h-9 px-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-1 text-xs font-semibold cursor-pointer shrink-0"
                    title="Simulate Barcode Scanner Beep"
                  >
                    <IconBarcode size={16} />
                    <span className="hidden lg:inline">Scan</span>
                  </button>

                  {/* Image View Toggle */}
                  <div className="flex items-center border border-gray-200 rounded-xl p-0.5 bg-gray-50 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowImages(true)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        showImages
                          ? "bg-white text-black shadow-xs font-bold"
                          : "text-gray-500 hover:text-black"
                      }`}
                      title="Show Product Images"
                    >
                      <IconPhoto size={14} />
                      <span className="hidden xl:inline">Images</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImages(false)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        !showImages
                          ? "bg-white text-black shadow-xs font-bold"
                          : "text-gray-500 hover:text-black"
                      }`}
                      title="Compact Cards without Images"
                    >
                      <IconFileText size={14} />
                      <span className="hidden xl:inline">Text</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Pills with Smooth Sliding 3D Indicator */}
              <div className="relative inline-flex items-center p-1 rounded-xl bg-white border border-gray-200 overflow-x-auto select-none no-scrollbar shrink-0 w-fit max-w-full shadow-2xs">
                {categoryPill.width > 0 && (
                  <div
                    className="absolute top-1 bottom-1 button-20 !p-0 !rounded-lg transition-all duration-300 ease-out pointer-events-none"
                    style={{
                      left: `${categoryPill.left}px`,
                      width: `${categoryPill.width}px`,
                    }}
                  />
                )}

                {categories.map((cat) => (
                  <button
                    key={cat}
                    ref={(el) => {
                      categoryRefs.current[cat] = el;
                    }}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "text-white font-extrabold"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Catalog Grid */}
              <div className="flex-1 overflow-y-auto pr-1">
                <div
                  className={`grid gap-3 ${
                    showImages
                      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                  }`}
                >
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className={`rounded-2xl bg-white border border-gray-200 hover:border-black flex flex-col justify-between text-left transition-all hover:shadow-xs group overflow-hidden ${
                        showImages ? "h-52" : "p-3 h-32"
                      }`}
                    >
                      {/* Optional Product Image Thumbnail */}
                      {showImages && (
                        <div
                          onClick={() => {
                            addToCart(prod);
                            setIsRightSidebarOpen(true);
                          }}
                          className="w-full h-24 bg-gray-100 relative overflow-hidden shrink-0 cursor-pointer"
                        >
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                              ☕
                            </div>
                          )}
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                            {prod.category}
                          </span>
                        </div>
                      )}

                      <div className={`flex-1 flex flex-col justify-between ${showImages ? "p-3" : ""}`}>
                        <div
                          onClick={() => {
                            addToCart(prod);
                            setIsRightSidebarOpen(true);
                          }}
                          className="space-y-1 min-w-0 cursor-pointer"
                        >
                          {!showImages && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              {prod.category}
                            </span>
                          )}
                          <h4 className="font-bold text-xs sm:text-sm text-gray-950 leading-snug line-clamp-2 group-hover:text-black">
                            {prod.name}
                          </h4>
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 mt-1">
                          <span className="text-xs sm:text-sm font-black text-gray-950 font-mono">
                            ₹{prod.sellingPrice}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Customize Modifiers Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProductForModifier(prod);
                                setIsModifierModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold cursor-pointer"
                              title="Customize Size / Milk / Add-ons"
                            >
                              Options
                            </button>

                            {/* Quick Add Button */}
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(prod);
                                setIsRightSidebarOpen(true);
                              }}
                              className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-black group-hover:text-white text-gray-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                              title="Quick 1-Click Add"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ORDERS */}
          {activeView === "orders" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-950">
                    Kitchen & Floor Orders
                  </h2>
                  <p className="text-xs text-gray-500">Live order tickets and KOT routing</p>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-xl border border-gray-200 text-gray-700">
                  {orders.length} total orders
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-sm text-gray-950">
                          {ord.orderNumber}
                        </span>
                        <p className="text-xs font-semibold text-gray-600">
                          {ord.tableOrParcel} · {ord.type}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === "Preparing"
                            ? "bg-amber-100 text-amber-800"
                            : ord.status === "Ready"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "Voided"
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1.5 text-xs text-gray-700 border-t border-gray-100 pt-2 max-h-32 overflow-y-auto">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between font-medium">
                            <span>{it.product.name} × {it.quantity}</span>
                            <span className="font-mono">₹{it.product.sellingPrice * it.quantity}</span>
                          </div>
                          {it.selectedModifiers && it.selectedModifiers.length > 0 && (
                            <p className="text-[10px] text-gray-400 pl-2">
                              {it.selectedModifiers.map((m) => m.name).join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-bold text-xs">
                      <span>Total: ₹{ord.total}</span>
                      <span className="text-[10px] font-mono text-gray-400">{ord.createdAt}</span>
                    </div>

                    {/* Actions: Void Order */}
                    {ord.status !== "Voided" && (
                      <div className="pt-2 border-t border-gray-100 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRequestVoidOrder(ord)}
                          className="flex-1 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold cursor-pointer"
                        >
                          Void Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: HELD SALES */}
          {activeView === "held" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h2 className="text-base font-bold text-gray-950">
                Held Sales ({heldSales.length})
              </h2>

              {heldSales.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-gray-200 text-center space-y-2">
                  <p className="text-sm font-bold text-gray-900">No active held carts</p>
                  <p className="text-xs text-gray-500">Hold any sale in progress to resume later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {heldSales.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-gray-950">
                            #{h.id}
                          </span>
                          <p className="text-xs font-semibold text-gray-600">
                            {h.tableOrParcel} ({h.orderType})
                          </p>
                        </div>
                        <span className="text-xs font-black text-gray-950 font-mono">
                          ₹{h.total}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded-xl border border-gray-100">
                        "{h.note}"
                      </p>

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => resumeHeldSale(h.id)}
                          className="button-20 flex-1 h-8 !py-0 !rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Resume Sale
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteHeldSale(h.id)}
                          className="px-3 h-8 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-600 text-xs font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: RECEIPTS */}
          {activeView === "receipts" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h2 className="text-base font-bold text-gray-950">
                Transaction Receipts & Refunds
              </h2>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Destination</th>
                      <th className="p-3">Method</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-gray-950">{o.orderNumber}</td>
                        <td className="p-3 text-gray-500">{o.createdAt}</td>
                        <td className="p-3 text-gray-700">{o.tableOrParcel}</td>
                        <td className="p-3 font-medium text-gray-600">{o.paymentMethod || "Cash"}</td>
                        <td className="p-3 text-right font-mono font-bold text-gray-950">₹{o.total}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              o.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setCompletedOrderForReceipt(o)}
                            className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-[11px] cursor-pointer"
                          >
                            View Slip
                          </button>
                          {o.paymentStatus === "Paid" && (
                            <button
                              type="button"
                              onClick={() => handleRequestRefundOrder(o)}
                              className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 font-semibold text-[11px] cursor-pointer"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: CASH & AUDIT */}
          {activeView === "cash" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {/* Header & Subview Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setCashSubView("drawer")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cashSubView === "drawer"
                        ? "bg-white text-black shadow-xs"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    Drawer & Reconcile
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashSubView("audit")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cashSubView === "audit"
                        ? "bg-white text-black shadow-xs"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    Audit Event Logs ({auditLogs.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCashDrawer}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-bold text-xs text-gray-800 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <IconCurrencyDollar size={15} />
                  <span>Kick Cash Drawer</span>
                </button>
              </div>

              {drawerKickedToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <IconCheck size={16} />
                  <span>Cash Drawer pulse sent (Kicked open)</span>
                </div>
              )}

              {/* CASH SUBVIEW: DRAWER */}
              {cashSubView === "drawer" && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                      <p className="text-gray-500 text-[11px] font-medium">Opening Cash</p>
                      <p className="text-lg font-black text-gray-950 font-mono">
                        ₹{activeShift?.openingCash.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                      <p className="text-gray-500 text-[11px] font-medium">Cash Sales</p>
                      <p className="text-lg font-black text-emerald-700 font-mono">
                        +₹{activeShift?.cashSales.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                      <p className="text-gray-500 text-[11px] font-medium">Cash In / Out</p>
                      <p className="text-lg font-black text-gray-950 font-mono">
                        +₹{activeShift?.cashIn} / -₹{activeShift?.cashOut}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1">
                      <p className="text-gray-500 text-[11px] font-medium">Expected in Drawer</p>
                      <p className="text-lg font-black text-black font-mono">
                        ₹{((activeShift?.openingCash || 0) + (activeShift?.cashSales || 0) + (activeShift?.cashIn || 0) - (activeShift?.cashOut || 0) - (activeShift?.cashRefunds || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Flow Buttons */}
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCashFlowModal("in");
                        setCashFlowAmount(500);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 cursor-pointer shadow-2xs"
                    >
                      + Cash In (Float Add)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCashFlowModal("out");
                        setCashFlowAmount(200);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 cursor-pointer shadow-2xs"
                    >
                      - Cash Out (Payout)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCloseShiftOpen(true)}
                      className="button-20 px-5 py-2 !rounded-xl text-xs font-semibold cursor-pointer ml-auto"
                    >
                      Close Shift & Reconcile (Z-Report)
                    </button>
                  </div>
                </div>
              )}

              {/* CASH SUBVIEW: AUDIT EVENT LOGS */}
              {cashSubView === "audit" && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs animate-fadeIn">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Staff</th>
                        <th className="p-3">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono text-gray-500 text-[11px] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                log.type === "shift"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : log.type === "cash"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : log.type === "void" || log.type === "refund"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {log.type}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-gray-950 whitespace-nowrap">
                            {log.action}
                          </td>
                          <td className="p-3 text-gray-700 font-medium whitespace-nowrap">
                            {log.staffName}
                          </td>
                          <td className="p-3 text-gray-600 font-mono text-[11px]">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>

        {/* COLUMN 3: CURRENT SALE / CART PANEL */}
        <aside
          className={`bg-white border-l border-gray-200 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out z-10 ${
            isRightSidebarOpen
              ? "w-80 sm:w-96 opacity-100"
              : "w-0 opacity-0 overflow-hidden border-l-0 p-0 pointer-events-none"
          }`}
        >
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold font-mono text-gray-400 uppercase tracking-widest">
                  CURRENT SALE
                </span>
                {cart.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-black text-white">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
                  title="Collapse Cart Panel"
                >
                  <IconChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Destination & Customer Bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                {orderType === "Takeaway" ? parcelToken : selectedTableOrParcel} · {orderType}
              </span>

              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(true)}
                className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <IconUser size={13} />
                <span>{selectedCustomer ? selectedCustomer.name : "+ Customer"}</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
                <p className="text-sm font-semibold text-gray-600">Cart is empty</p>
                <p className="text-xs text-gray-400">Tap items on the left to start a sale</p>
              </div>
            ) : (
              cart.map((item, itemIdx) => {
                const modExtra = item.selectedModifiers?.reduce((s, m) => s + m.extraPrice, 0) || 0;
                const unitPrice = item.product.sellingPrice + modExtra;

                return (
                  <div
                    key={`${item.product.id}-${itemIdx}`}
                    className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-950">{item.product.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono">
                          ₹{unitPrice} each
                        </p>
                      </div>
                      <span className="font-mono font-bold text-gray-950">
                        ₹{unitPrice * item.quantity}
                      </span>
                    </div>

                    {/* Modifiers Pill List */}
                    {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {item.selectedModifiers.map((mod, mIdx) => (
                          <span
                            key={mIdx}
                            className="bg-gray-200/80 text-gray-800 px-2 py-0.5 rounded-md font-medium"
                          >
                            + {mod.name} {mod.extraPrice > 0 ? `(₹${mod.extraPrice})` : ""}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[10px] text-amber-700 italic bg-amber-50 px-2 py-0.5 rounded">
                        Note: {item.notes}
                      </p>
                    )}

                    {/* Quantity Stepper & Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(itemIdx, -1)}
                          className="w-6 h-6 rounded-md bg-white border border-gray-300 font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold font-mono text-xs w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(itemIdx, 1)}
                          className="w-6 h-6 rounded-md bg-white border border-gray-300 font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemNoteModalIndex(itemIdx);
                            setItemNoteText(item.notes || "");
                          }}
                          className="text-[11px] text-gray-500 hover:text-black font-semibold cursor-pointer"
                        >
                          Note
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemIdx)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer: Tax Breakdown & Actions */}
          <div className="p-4 border-t border-gray-200 bg-white space-y-3 shrink-0">
            {kotSentToast && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-fadeIn">
                ✓ Order sent to Kitchen Display (KDS)
              </div>
            )}

            {/* Calculations with Transparent GST breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <IconTag size={12} />
                  <span>{discountAmount > 0 ? `Discount (-₹${discountAmount})` : "+ Add Discount / Coupon"}</span>
                </button>
                <span className="font-mono text-emerald-700 font-bold">{discountAmount > 0 ? `-₹${discountAmount}` : "₹0"}</span>
              </div>

              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>CGST (2.5%)</span>
                <span className="font-mono">₹{cgst}</span>
              </div>

              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>SGST (2.5%)</span>
                <span className="font-mono">₹{sgst}</span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-base text-gray-950">
                <span>TOTAL</span>
                <span className="font-mono">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Hold & Kitchen Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setIsHoldSaleModalOpen(true)}
                className="py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Hold Sale
              </button>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleSendKitchenClick}
                className="py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1 transition-colors"
              >
                <IconToolsKitchen2 size={15} />
                <span>To Kitchen</span>
              </button>
            </div>

            {/* Pay Button using Button-20 CSS */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setIsPaymentOpen(true)}
              className="button-20 w-full h-12 !rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>Pay</span>
              <span className="font-mono">₹{total.toLocaleString()}</span>
              <IconArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>

      {/* Floating Cart Quick Button when right sidebar is collapsed */}
      {!isRightSidebarOpen && cart.length > 0 && (
        <button
          type="button"
          onClick={() => setIsRightSidebarOpen(true)}
          className="button-20 fixed bottom-5 right-5 z-30 shadow-2xl flex items-center gap-2.5 py-3 px-5 !rounded-full cursor-pointer animate-fadeIn border border-white/20"
        >
          <IconShoppingCart size={18} />
          <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          <span className="font-bold text-emerald-400 font-mono">· ₹{total.toLocaleString()}</span>
        </button>
      )}

      {/* MODALS */}
      {/* 1. Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={(order) => {
          setIsPaymentOpen(false);
          setCompletedOrderForReceipt(order);
        }}
      />

      {/* 2. Receipt Modal */}
      <ReceiptModal
        order={completedOrderForReceipt}
        onCloseAndNewSale={() => setCompletedOrderForReceipt(null)}
      />

      {/* 3. Close Shift Modal */}
      <CloseShiftModal
        isOpen={isCloseShiftOpen}
        onClose={() => setIsCloseShiftOpen(false)}
      />

      {/* 4. Customer Selection Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />

      {/* 5. Discount Modal with Manager PIN trigger */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onRequestManagerPin={(val, callback) => {
          setManagerPinModal({
            isOpen: true,
            title: "Authorize High Discount",
            description: `Requires Manager authorization for ₹${val} discount`,
            onSuccess: callback,
          });
        }}
      />

      {/* 6. Product Modifier Modal */}
      <ProductModifierModal
        product={selectedProductForModifier}
        isOpen={isModifierModalOpen}
        onClose={() => {
          setIsModifierModalOpen(false);
          setSelectedProductForModifier(null);
        }}
        onConfirm={(prod, modifiers, note, qty) => {
          for (let i = 0; i < qty; i++) {
            addToCart(prod, note, modifiers);
          }
          setIsRightSidebarOpen(true);
        }}
      />

      {/* 7. Table Selector Floor Plan Modal */}
      <TableSelectorModal
        isOpen={isTableSelectorOpen}
        onClose={() => setIsTableSelectorOpen(false)}
      />

      {/* 8. Hardware Status Modal */}
      <HardwareStatusModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />

      {/* 9. Manager PIN Verification Modal */}
      <ManagerPinModal
        isOpen={managerPinModal.isOpen}
        title={managerPinModal.title}
        description={managerPinModal.description}
        onClose={() => setManagerPinModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={managerPinModal.onSuccess}
      />

      {/* 10. Hold Sale Note Modal */}
      {isHoldSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-xs bg-white rounded-xl p-5 space-y-4 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-950">Hold Current Sale</h3>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Reason / Note</label>
              <input
                type="text"
                value={holdSaleNoteText}
                onChange={(e) => setHoldSaleNoteText(e.target.value)}
                placeholder="e.g. Stepped out for phone call"
                className="w-full h-10 px-3 border border-gray-300 rounded-xl text-xs outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsHoldSaleModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleHoldSaleConfirm}
                className="button-20 flex-1 py-2 !rounded-xl text-xs font-semibold cursor-pointer"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Delivery Details Selector Modal */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 space-y-4 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-950">Delivery Partner & Rider</h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block">Platform</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["Zomato", "Swiggy", "Direct"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDeliveryDetails((prev) => ({ ...prev, platform: p }))}
                      className={`py-2 rounded-xl border text-center font-bold cursor-pointer ${
                        deliveryDetails.platform === p
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-600 block">Rider Name</label>
                <input
                  type="text"
                  value={deliveryDetails.riderName}
                  onChange={(e) => setDeliveryDetails((prev) => ({ ...prev, riderName: e.target.value }))}
                  className="w-full h-9 px-3 border border-gray-300 rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-600 block">Rider Phone</label>
                <input
                  type="text"
                  value={deliveryDetails.riderPhone}
                  onChange={(e) => setDeliveryDetails((prev) => ({ ...prev, riderPhone: e.target.value }))}
                  className="w-full h-9 px-3 border border-gray-300 rounded-xl text-xs font-mono outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDeliveryModalOpen(false)}
              className="button-20 w-full py-2.5 !rounded-xl text-xs font-semibold cursor-pointer"
            >
              Save Delivery Details
            </button>
          </div>
        </div>
      )}

      {/* 12. Line Item Note Modal */}
      {activeItemNoteModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-xs bg-white rounded-xl p-5 space-y-4 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-950">Add Line Note</h3>
            <input
              type="text"
              value={itemNoteText}
              onChange={(e) => setItemNoteText(e.target.value)}
              placeholder="e.g. Less sugar, extra hot"
              className="w-full h-10 px-3 border border-gray-300 rounded-xl text-xs font-medium outline-none focus:border-black"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveItemNoteModalIndex(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (cart[activeItemNoteModalIndex]) {
                    cart[activeItemNoteModalIndex].notes = itemNoteText;
                  }
                  setActiveItemNoteModalIndex(null);
                }}
                className="button-20 flex-1 py-2 !rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. Cash Flow (In / Out) Modal */}
      {cashFlowModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <form onSubmit={handleCashFlowSubmit} className="w-full max-w-xs bg-white rounded-xl p-5 space-y-4 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-950">
              {cashFlowModal === "in" ? "+ Cash In (Float Add)" : "- Cash Out (Payout)"}
            </h3>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">Amount in ₹</label>
              <input
                type="number"
                value={cashFlowAmount}
                onChange={(e) => setCashFlowAmount(Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-300 rounded-xl text-sm font-mono font-bold outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">Reason / Supplier</label>
              <input
                type="text"
                value={cashFlowReason}
                onChange={(e) => setCashFlowReason(e.target.value)}
                placeholder="e.g. Dairy vendor, Float"
                className="w-full h-10 px-3 border border-gray-300 rounded-xl text-xs outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCashFlowModal(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-20 flex-1 py-2 !rounded-xl text-xs font-semibold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
