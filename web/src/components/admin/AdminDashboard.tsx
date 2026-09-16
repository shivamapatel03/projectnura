"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  ReceiptText,
  ClipboardList,
  Package,
  Boxes,
  Receipt,
  CreditCard,
  UserCheck,
  Monitor,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  ChevronLeft,
  Plus,
  ArrowUpRight,
  Download,
  Check,
  Store,
  Layers,
  X,
  Edit,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "pos"
  | "sales"
  | "orders"
  | "products"
  | "inventory"
  | "billing"
  | "payments"
  | "staff"
  | "terminals"
  | "reports"
  | "settings";

// Initial mock orders matching the design
const INITIAL_ORDERS = [
  {
    id: "918-5878",
    customer: "Cameron Smith",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    phone: "(316) 555-0116",
    email: "audra10@hotmail.com",
    purchase: "₹16,718.21",
    status: "Active",
    history: "Shipped",
    historyColor: "bg-black text-white",
  },
  {
    id: "224-5343",
    customer: "Julie Williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    phone: "(308) 555-0121",
    email: "littel.jo@block.com",
    purchase: "₹27,989.45",
    status: "Active",
    history: "In progress",
    historyColor: "bg-zinc-800 text-white",
  },
  {
    id: "395-9823",
    customer: "Michael Philips",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    phone: "(406) 555-0120",
    email: "csmitham@healthcare.info",
    purchase: "₹5,213.98",
    status: "Active",
    history: "Received",
    historyColor: "bg-neutral-900 text-white",
  },
  {
    id: "712-4419",
    customer: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    phone: "(505) 555-0199",
    email: "s.jenkins@outlook.com",
    purchase: "₹8,450.00",
    status: "Active",
    history: "Ready",
    historyColor: "bg-emerald-950 text-emerald-300",
  },
  {
    id: "560-1284",
    customer: "Devin Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    phone: "(202) 555-0182",
    email: "devin.vance@gmail.com",
    purchase: "₹12,190.50",
    status: "Active",
    history: "Completed",
    historyColor: "bg-black text-white",
  },
];

const RECENT_SALES = [
  {
    id: "#1084",
    customer: "Rahul Sharma",
    items: "2x Artisan Cappuccino, 1x Croissant",
    amount: "₹660",
    method: "UPI (PhonePe)",
    time: "2m ago",
    status: "Completed",
  },
  {
    id: "#1083",
    customer: "Julie Williams",
    items: "1x Truffle Melt, 2x Cold Brew",
    amount: "₹1,060",
    method: "Credit Card",
    time: "6m ago",
    status: "Completed",
  },
  {
    id: "#1082",
    customer: "Michael Philips",
    items: "1x Cold Brew Reserve",
    amount: "₹290",
    method: "Cash",
    time: "14m ago",
    status: "Completed",
  },
  {
    id: "#1081",
    customer: "Sarah Jenkins",
    items: "1x Avocado Toast, 1x Matcha Latte",
    amount: "₹730",
    method: "UPI (GPay)",
    time: "25m ago",
    status: "Completed",
  },
  {
    id: "#1080",
    customer: "Devin Vance",
    items: "2x Butter Croissant, 1x Espresso",
    amount: "₹480",
    method: "UPI (Paytm)",
    time: "38m ago",
    status: "Completed",
  },
  {
    id: "#1079",
    customer: "Cameron Smith",
    items: "3x Artisan Cappuccino, 2x Truffle Melt",
    amount: "₹1,680",
    method: "Debit Card",
    time: "55m ago",
    status: "Completed",
  },
];

const TOP_PRODUCTS = [
  { rank: 1, name: "Artisan Cappuccino", category: "Beverages", price: "₹240", sold: 68, revenue: "₹16,320", status: "In Stock" },
  { rank: 2, name: "Cold Brew Reserve", category: "Beverages", price: "₹290", sold: 44, revenue: "₹12,760", status: "In Stock" },
  { rank: 3, name: "Truffle Mushroom Melt", category: "Food", price: "₹480", sold: 22, revenue: "₹10,560", status: "Low Stock" },
  { rank: 4, name: "Butter Croissant", category: "Bakery", price: "₹180", sold: 35, revenue: "₹6,300", status: "In Stock" },
  { rank: 5, name: "Avocado Sourdough Toast", category: "Food", price: "₹420", sold: 18, revenue: "₹7,560", status: "In Stock" },
];

const PRODUCTS_DATA = [
  { id: "P-101", name: "Artisan Cappuccino", category: "Beverages", price: "₹240", stock: 84, sku: "CAP-01", status: "In Stock" },
  { id: "P-102", name: "Truffle Mushroom Melt", category: "Food", price: "₹480", stock: 12, sku: "TMM-02", status: "Low Stock" },
  { id: "P-103", name: "Cold Brew Reserve", category: "Beverages", price: "₹290", stock: 110, sku: "CBR-03", status: "In Stock" },
  { id: "P-104", name: "Butter Croissant", category: "Bakery", price: "₹180", stock: 4, sku: "BCR-04", status: "Low Stock" },
  { id: "P-105", name: "Avocado Sourdough Toast", category: "Food", price: "₹420", stock: 35, sku: "AST-05", status: "In Stock" },
  { id: "P-106", name: "Matcha Latte Supreme", category: "Beverages", price: "₹310", stock: 0, sku: "MLS-06", status: "Out of Stock" },
];

const DEVICES_DATA = [
  { id: "T1", name: "T1 POS Register", type: "POS Terminal", outlet: "Main Branch", status: "Online", ip: "192.168.1.101", battery: "98%" },
  { id: "T2", name: "T2 Counter Terminal", type: "POS Terminal", outlet: "Main Branch", status: "Online", ip: "192.168.1.102", battery: "100%" },
  { id: "K1", name: "K1 Kitchen Display", type: "KDS Screen", outlet: "Main Branch", status: "Active", ip: "192.168.1.110", battery: "AC Power" },
  { id: "CD1", name: "CD1 Customer Display", type: "Customer Screen", outlet: "Main Branch", status: "Paired", ip: "192.168.1.112", battery: "AC Power" },
  { id: "P1", name: "P1 Thermal Receipt Printer", type: "Printer", outlet: "Main Branch", status: "Ready", ip: "192.168.1.120", battery: "AC Power" },
  { id: "D1", name: "D1 Cash Drawer", type: "Cash Drawer", outlet: "Main Branch", status: "Closed", ip: "Direct RJ11", battery: "Connected" },
];

// Hourly Bar Chart data for Sales Overview
const HOURLY_BAR_CHART_DATA = [
  { time: "9 AM", amount: "₹4,250", orders: 16, heightPct: 28 },
  { time: "11 AM", amount: "₹7,820", orders: 31, heightPct: 52 },
  { time: "1 PM", amount: "₹11,640", orders: 45, heightPct: 78 },
  { time: "3 PM", amount: "₹14,910", orders: 58, heightPct: 100, isPeak: true },
  { time: "5 PM", amount: "₹6,120", orders: 24, heightPct: 41 },
  { time: "7 PM", amount: "₹3,780", orders: 10, heightPct: 25 },
];

const WEEKLY_BAR_CHART_DATA = [
  { time: "Mon", amount: "₹38,200", orders: 142, heightPct: 65 },
  { time: "Tue", amount: "₹41,500", orders: 156, heightPct: 72 },
  { time: "Wed", amount: "₹36,800", orders: 138, heightPct: 60 },
  { time: "Thu", amount: "₹44,100", orders: 168, heightPct: 78 },
  { time: "Fri", amount: "₹52,400", orders: 198, heightPct: 92 },
  { time: "Sat", amount: "₹58,900", orders: 224, heightPct: 100, isPeak: true },
  { time: "Sun", amount: "₹48,520", orders: 184, heightPct: 83 },
];

const MONTHLY_BAR_CHART_DATA = [
  { time: "Jan", amount: "₹1,24,000", orders: 480, heightPct: 62 },
  { time: "Feb", amount: "₹1,48,500", orders: 590, heightPct: 74 },
  { time: "Mar", amount: "₹1,96,000", orders: 780, heightPct: 98, isPeak: true },
  { time: "Apr", amount: "₹1,62,000", orders: 640, heightPct: 81 },
  { time: "May", amount: "₹1,55,000", orders: 610, heightPct: 77 },
  { time: "Jun", amount: "₹1,82,000", orders: 720, heightPct: 91 },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("Main Branch");
  const [userName, setUserName] = useState<string>("Rahul");
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState<boolean>(false);
  const [chartTimeframe, setChartTimeframe] = useState<"Today" | "Week" | "Month">("Today");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Startup Guide state
  const [isStartupGuideDismissed, setIsStartupGuideDismissed] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    step1: false, // 01 — Add Products
    step2: false, // 02 — Add Staff
    step3: false, // 03 — Set Up POS
    step4: false, // 04 — Start Selling
    step5: false, // 05 — Set Up Tables & Kitchen
  });

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isRequiredCompleted =
    Boolean(completedSteps.step1 &&
    completedSteps.step2 &&
    completedSteps.step3 &&
    completedSteps.step4);
  const isAllCompleted = completedCount === 5;

  // Add Product form state
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Beverages");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");

  // Exactly the 12 items shown in user's uploaded image
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pos", label: "POS", icon: ShoppingCart },
    { id: "sales", label: "Sales", icon: ReceiptText },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "products", label: "Products", icon: Package },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "billing", label: "Billing", icon: Receipt },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "staff", label: "Staff", icon: UserCheck },
    { id: "terminals", label: "Terminals", icon: Monitor },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Active chart dataset
  const activeChartData =
    chartTimeframe === "Today"
      ? HOURLY_BAR_CHART_DATA
      : chartTimeframe === "Week"
      ? WEEKLY_BAR_CHART_DATA
      : MONTHLY_BAR_CHART_DATA;

  return (
    <div className="h-screen w-screen bg-[#f8f9fa] text-gray-950 flex antialiased selection:bg-black selection:text-white font-sans overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. STICKY COLLAPSIBLE SIDEBAR WITH SMOOTH ANIMATION & CLEAN LOGO          */}
      {/* ========================================================================= */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-[72px]"
        } h-screen sticky top-0 bg-[#0e0e11] border-r border-zinc-800/80 text-white shrink-0 flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 select-none overflow-hidden hidden md:flex`}
      >
        <div className="p-3 space-y-3 flex-1 flex flex-col min-h-0">
          {/* Header with Original Nuradesk Logo & Collapse Toggle (No overlap) */}
          {sidebarOpen ? (
            <div className="flex items-center justify-between px-1.5 pt-1 pb-1 shrink-0">
              <Link href="/" className="flex items-center gap-2.5 cursor-pointer group min-w-0">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo/logo.png.png"
                    alt="Nuradesk"
                    width={32}
                    height={32}
                    className="object-contain brightness-0 invert"
                    priority
                  />
                </div>
                <div className="relative h-6 w-24 sm:w-28 flex items-center">
                  <Image
                    src="/logo/text.png"
                    alt="Nuradesk"
                    width={110}
                    height={26}
                    className="object-contain brightness-0 invert"
                    priority
                  />
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 pt-1 pb-1 shrink-0">
              <Link
                href="/"
                className="relative w-8 h-8 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                title="Nuradesk"
              >
                <Image
                  src="/logo/logo.png.png"
                  alt="Nuradesk"
                  width={32}
                  height={32}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(true)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                title="Expand sidebar"
              >
                <ChevronLeft size={16} className="rotate-180" />
              </button>
            </div>
          )}

          {/* Nav Items List (Smooth text collapse, fits cleanly without scroll) */}
          <div className="pt-1 flex-1 overflow-hidden">
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-full h-9 sm:h-[38px] px-3 rounded-xl text-xs sm:text-[13px] font-medium flex items-center transition-all cursor-pointer relative group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none ${
                      isActive
                        ? "bg-[#212126] text-white font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    {/* Fixed Icon Anchor */}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <Icon size={17} className={isActive ? "text-white" : "text-zinc-400"} />
                    </div>

                    {/* Smoothly Collapsing Label */}
                    <span
                      className={`ml-3 truncate whitespace-nowrap transition-all duration-300 ${
                        sidebarOpen
                          ? "opacity-100 max-w-[160px] translate-x-0"
                          : "opacity-0 max-w-0 -translate-x-3 pointer-events-none"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Floating Tooltip when collapsed */}
                    {!sidebarOpen && (
                      <span className="absolute left-[78px] bg-zinc-950 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Scrolls independently while sidebar stays sticky)   */}
      {/* ========================================================================= */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-[#fafafa]">
        {/* Top Header Bar: "My POS", "Outlet: [ Main Branch ∨ ]", Bell, "Name ∨" */}
        <header className="w-full bg-white border-b border-gray-200/90 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Left: "My POS" */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-950">
              My POS
            </h1>
          </div>

          {/* Center-Right: "Outlet: [ Main Branch ∨ ]" */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 hidden sm:inline">
                Outlet:
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                  className="bg-[#0047FF] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{selectedBranch}</span>
                  <ChevronDown size={14} />
                </button>

                {/* Outlet Dropdown Menu */}
                {isOutletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 text-xs animate-fadeIn">
                    <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Select Outlet
                    </div>
                    {["Main Branch", "Downtown Outlet", "Airport Terminal", "Express Counter"].map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setSelectedBranch(b);
                          setIsOutletDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                          selectedBranch === b ? "font-bold text-blue-600 bg-blue-50/50" : "text-gray-700"
                        }`}
                      >
                        <span>{b}</span>
                        {selectedBranch === b && <Check size={14} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notification Bell Icon */}
            <button className="w-9 h-9 rounded-full border border-gray-200/90 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors cursor-pointer relative">
              <Bell size={16} />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* Profile Menu: "Name ∨" */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>{userName}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 text-xs animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="font-bold text-gray-900">Rahul Sharma</p>
                    <p className="text-[11px] text-gray-500">rahul@nuradesk.com</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsPosModalOpen(true);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Open Live POS
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    href="/login"
                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 space-y-7 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" ? (
            /* ========================================================================= */
            /* TAB: DASHBOARD (Exact layout & content with Modern Bar Chart)             */
            /* ========================================================================= */
            <div className="space-y-7 animate-fadeIn">
              {/* Greeting Section */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
                  Good afternoon, Rahul 👋
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Here's what's happening today.
                </p>
              </div>

              {/* ========================================================================= */}
              {/* STARTUP GUIDE (Clean, compact, no gradients, no decorative shadows)       */}
              {/* ========================================================================= */}
              {!isStartupGuideDismissed ? (
                <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-5">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          Startup Guide
                        </span>
                        {isRequiredCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <Check size={11} className="stroke-[3]" />
                            <span>Ready to operate</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-950 mt-1">
                        Get your business ready
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Complete these steps to start using Nuradesk:
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span className="text-xs font-semibold text-gray-500">
                        {completedCount} of 5 completed
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsStartupGuideDismissed(true)}
                        className="text-xs text-gray-500 hover:text-gray-900 font-medium px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {isRequiredCompleted ? "Dismiss" : "Skip guide"}
                      </button>
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-3">
                    {/* 01 — Add Products */}
                    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleStep("step1")}
                          title={completedSteps.step1 ? "Mark incomplete" : "Mark complete"}
                          className="cursor-pointer shrink-0"
                        >
                          {completedSteps.step1 ? (
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-gray-950">
                            01 — Add Products
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Add the products or services you sell.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddProductOpen(true);
                          setCompletedSteps((prev) => ({ ...prev, step1: true }));
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Add Product
                      </button>
                    </div>

                    {/* 02 — Add Staff */}
                    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleStep("step2")}
                          title={completedSteps.step2 ? "Mark incomplete" : "Mark complete"}
                          className="cursor-pointer shrink-0"
                        >
                          {completedSteps.step2 ? (
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-gray-950">
                            02 — Add Staff
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Create staff accounts and assign roles and PINs.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("staff");
                          setCompletedSteps((prev) => ({ ...prev, step2: true }));
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Add Staff
                      </button>
                    </div>

                    {/* 03 — Set Up POS */}
                    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleStep("step3")}
                          title={completedSteps.step3 ? "Mark incomplete" : "Mark complete"}
                          className="cursor-pointer shrink-0"
                        >
                          {completedSteps.step3 ? (
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-gray-950">
                            03 — Set Up POS
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Create and connect your POS terminal.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("terminals");
                          setCompletedSteps((prev) => ({ ...prev, step3: true }));
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Set Up Terminal
                      </button>
                    </div>

                    {/* 04 — Start Selling */}
                    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleStep("step4")}
                          title={completedSteps.step4 ? "Mark incomplete" : "Mark complete"}
                          className="cursor-pointer shrink-0"
                        >
                          {completedSteps.step4 ? (
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-gray-950">
                            04 — Start Selling
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Open the POS and make your first sale.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPosModalOpen(true);
                          setCompletedSteps((prev) => ({ ...prev, step4: true }));
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Open POS
                      </button>
                    </div>

                    {/* Restaurant / Café only Section */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Restaurant / Café only:
                      </span>
                    </div>

                    {/* 05 — Set Up Tables & Kitchen */}
                    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleStep("step5")}
                          title={completedSteps.step5 ? "Mark incomplete" : "Mark complete"}
                          className="cursor-pointer shrink-0"
                        >
                          {completedSteps.step5 ? (
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-gray-950">
                            05 — Set Up Tables & Kitchen
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Create tables and connect your Kitchen Display.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("settings");
                          setCompletedSteps((prev) => ({ ...prev, step5: true }));
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Set Up
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Collapsed / Dismissed state */
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">Startup Guide</span>
                    <span className="text-gray-300">•</span>
                    <span>{completedCount} of 5 completed</span>
                    {isRequiredCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStartupGuideDismissed(false)}
                    className="text-black font-semibold hover:underline cursor-pointer"
                  >
                    Resume Guide
                  </button>
                </div>
              )}

              {/* 4 KPI METRIC CARDS: Sales, Orders, Avg., Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Sales */}
                <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-gray-600">Sales</div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mt-2.5">
                    ₹48,520
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                    <span>+12.8% from yesterday</span>
                  </div>
                </div>

                {/* 2. Orders */}
                <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-gray-600">Orders</div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mt-2.5">
                    184
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                    <span>+8.2% from yesterday</span>
                  </div>
                </div>

                {/* 3. Avg. */}
                <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-gray-600">Avg.</div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mt-2.5">
                    ₹263
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                    <span>+4.5% vs average ticket</span>
                  </div>
                </div>

                {/* 4. Customer */}
                <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-gray-600">Customer</div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mt-2.5">
                    126
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                    <span>+15 new customers today</span>
                  </div>
                </div>
              </div>

              {/* TWO LARGE CARDS: "Sales Overview" (MODERN BAR CHART) & "Recent Sales" */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT CARD: Sales Overview with Interactive BAR CHART */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                      Sales Overview
                    </h3>
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-xs font-semibold text-gray-600">
                      {(["Today", "Week", "Month"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setChartTimeframe(t)}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            chartTimeframe === t
                              ? "bg-white text-gray-950 shadow-xs font-bold"
                              : "hover:text-gray-950"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SALES BAR CHART CONTAINER */}
                  <div className="p-6 sm:p-7 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[340px] flex flex-col justify-between relative overflow-hidden group">
                    {/* Top Revenue Summary & Peak Indicator */}
                    <div className="flex items-center justify-between pb-3">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Total Revenue {chartTimeframe === "Today" ? "Today" : chartTimeframe === "Week" ? "This Week" : "This Month"}
                        </span>
                        <div className="text-2xl font-black text-gray-950">
                          {chartTimeframe === "Today"
                            ? "₹48,520.00"
                            : chartTimeframe === "Week"
                            ? "₹3,19,420.00"
                            : "₹9,67,500.00"}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {chartTimeframe === "Today" ? "Peak: 3:00 PM" : chartTimeframe === "Week" ? "Peak: Saturday" : "Peak: March"}
                      </span>
                    </div>

                    {/* Styled Interactive BAR CHART */}
                    <div className="relative w-full pt-6 pb-2">
                      {/* Bar Columns Container */}
                      <div className="h-44 sm:h-48 flex items-end justify-between gap-3 sm:gap-5 border-b border-gray-100 px-2 sm:px-4 relative z-10">
                        {activeChartData.map((item, idx) => {
                          const isHovered = hoveredBarIndex === idx;

                          return (
                            <div
                              key={item.time}
                              onMouseEnter={() => setHoveredBarIndex(idx)}
                              onMouseLeave={() => setHoveredBarIndex(null)}
                              className="flex-1 flex flex-col items-center h-full justify-end group/bar cursor-pointer relative"
                            >
                              {/* Hover Floating Tooltip */}
                              {isHovered && (
                                <div className="absolute -top-10 bg-gray-950 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl z-20 whitespace-nowrap animate-fadeIn pointer-events-none border border-zinc-800">
                                  <span>{item.amount}</span>
                                  <span className="text-zinc-400 text-[10px] ml-1.5">({item.orders} orders)</span>
                                </div>
                              )}

                              {/* Background Pill Track */}
                              <div className="w-full max-w-[42px] h-full bg-gray-100/70 rounded-t-xl flex flex-col justify-end p-1 transition-colors group-hover/bar:bg-gray-100">
                                {/* Colored Bar */}
                                <div
                                  style={{ height: `${item.heightPct}%` }}
                                  className={`w-full rounded-t-lg transition-all duration-300 ${
                                    item.isPeak
                                      ? "bg-[#0047FF] shadow-sm group-hover/bar:brightness-110"
                                      : isHovered
                                      ? "bg-blue-600"
                                      : "bg-blue-500/80 group-hover/bar:bg-blue-600"
                                  }`}
                                />
                              </div>

                              {/* Time Axis Label */}
                              <span
                                className={`text-[11px] mt-2.5 transition-colors ${
                                  item.isPeak || isHovered
                                    ? "font-bold text-gray-950"
                                    : "font-semibold text-gray-500"
                                }`}
                              >
                                {item.time}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chart Footer Indicator */}
                    <div className="flex justify-between items-center pt-2 text-[11px] font-medium text-gray-400">
                      <span>Live Register Sync: Active</span>
                      <span>Hover any bar for breakdown</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT CARD: Recent Sales */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                      Recent Sales
                    </h3>
                    <button
                      onClick={() => setActiveTab("sales")}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {/* RECENT SALES CONTAINER */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[340px] flex flex-col justify-between">
                    <div className="divide-y divide-gray-100">
                      {RECENT_SALES.map((sale) => (
                        <div
                          key={sale.id}
                          className="py-2.5 sm:py-3 flex items-center justify-between hover:bg-gray-50/80 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 shrink-0 font-bold text-xs">
                              {sale.id.slice(1, 4)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-gray-950 truncate">
                                  {sale.customer}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400">
                                  {sale.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 truncate max-w-[200px] sm:max-w-[260px]">
                                {sale.items}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs sm:text-sm font-black text-gray-950">
                              {sale.amount}
                            </div>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                                {sale.method}
                              </span>
                              <span className="text-[10px] text-gray-400">{sale.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Showing latest 6 transactions</span>
                      <button
                        onClick={() => setIsPosModalOpen(true)}
                        className="font-semibold text-gray-900 hover:underline cursor-pointer"
                      >
                        + New POS Sale
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP PRODUCTS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                    Top Products
                  </h3>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Manage Catalog →
                  </button>
                </div>

                {/* Top Products Table */}
                <div className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-gray-700">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold pb-3">
                        <th className="pb-3 w-12 font-medium">#</th>
                        <th className="pb-3 font-medium">Product</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Units Sold</th>
                        <th className="pb-3 font-medium">Revenue</th>
                        <th className="pb-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {TOP_PRODUCTS.map((prod) => (
                        <tr key={prod.rank} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 font-bold text-gray-400 font-mono">
                            0{prod.rank}
                          </td>
                          <td className="py-3 font-bold text-gray-950">{prod.name}</td>
                          <td className="py-3 text-gray-600">{prod.category}</td>
                          <td className="py-3 font-semibold text-gray-900">{prod.price}</td>
                          <td className="py-3 font-mono font-bold text-gray-950">
                            {prod.sold} units
                          </td>
                          <td className="py-3 font-black text-gray-950">{prod.revenue}</td>
                          <td className="py-3 text-right">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                prod.status === "In Stock"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {prod.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADAPTIVE BUSINESS MODULES (Restaurant & Retail modules from user mockup) */}
              <div className="p-6 sm:p-7 rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-gray-950">
                    Business Modular Extensions
                  </h4>
                  <p className="text-xs text-gray-500">
                    Your Nuradesk instance adapts dynamically based on your business type.
                  </p>
                </div>

                <div className="pt-2 space-y-4 text-xs sm:text-sm">
                  {/* Restaurant Modules */}
                  <div className="space-y-2">
                    <div className="text-gray-600 font-medium">
                      For restaurant-type businesses, additional modules can appear:
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => alert("Launching Tables Module: Floor Map & Table Status Active.")}
                        className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                      >
                        <span className="text-base">🍽️</span>
                        <span>Tables</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold ml-1">
                          Floor Plan
                        </span>
                      </button>

                      <button
                        onClick={() => alert("Launching Kitchen Display (KDS): Live Cooking Tickets.")}
                        className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                      >
                        <span className="text-base">👨‍🍳</span>
                        <span>Kitchen / KDS</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold ml-1">
                          Live Orders
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Retail Modules */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="text-gray-600 font-medium">
                      For retail:
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => alert("Barcode Module: Ready for USB / Bluetooth Laser Scanning.")}
                        className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                      >
                        <span className="text-base">🏷️</span>
                        <span>Barcode</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold ml-1">
                          Scan & Print
                        </span>
                      </button>

                      <button
                        onClick={() => alert("Suppliers Module: Vendor Directory & Purchase POs.")}
                        className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                      >
                        <span className="text-base">🚚</span>
                        <span>Suppliers</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold ml-1">
                          Vendor POs
                        </span>
                      </button>

                      <button
                        onClick={() => alert("Purchases Module: Goods Received Notes & Inward Stock.")}
                        className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/90 text-gray-900 font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
                      >
                        <span className="text-base">🛒</span>
                        <span>Purchases</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold ml-1">
                          Inward Stock
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "pos" ? (
            /* ========================================================================= */
            /* TAB: POS TERMINALS STATION                                                */
            /* ========================================================================= */
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">POS Terminal Station</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Launch live cashier registers, manage outlets, and take quick orders.
                  </p>
                </div>
                <button
                  onClick={() => setIsPosModalOpen(true)}
                  className="button-20 h-10 px-6 !rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  <span>Launch Fullscreen POS Terminal</span>
                </button>
              </div>

              {/* Terminal List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Online & Ready
                      </span>
                      <span className="text-xs text-gray-500 font-mono">192.168.1.101</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-950">Terminal 1 — Main Counter</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Assigned to: Main Branch | Cashier: Rahul S. | Shift: Morning
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-200/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Today's Takings: ₹28,450.00</span>
                    <button
                      onClick={() => setIsPosModalOpen(true)}
                      className="button-20 h-8 px-4 !rounded-full text-xs font-semibold"
                    >
                      Open Register
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Online & Ready
                      </span>
                      <span className="text-xs text-gray-500 font-mono">192.168.1.102</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-950">Terminal 2 — Drive-Thru / Takeaway</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Assigned to: Main Branch | Cashier: Ananya M. | Shift: Morning
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-200/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Today's Takings: ₹14,920.00</span>
                    <button
                      onClick={() => setIsPosModalOpen(true)}
                      className="button-20 h-8 px-4 !rounded-full text-xs font-semibold"
                    >
                      Open Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "products" ? (
            /* ========================================================================= */
            /* TAB: PRODUCTS & MENU CATALOG                                              */
            /* ========================================================================= */
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">Products & Catalog</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage menu items, categories, variants, taxes, and modifier groups.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="button-20 h-10 px-5 !rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-700">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold pb-3">
                      <th className="pb-3 font-medium">SKU</th>
                      <th className="pb-3 font-medium">Item Name</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Stock</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PRODUCTS_DATA.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 font-mono text-xs font-bold text-gray-900">{p.sku}</td>
                        <td className="py-3 font-bold text-gray-950">{p.name}</td>
                        <td className="py-3 text-gray-600">{p.category}</td>
                        <td className="py-3 font-bold text-gray-950">{p.price}</td>
                        <td className="py-3 font-mono text-xs text-gray-800">{p.stock} units</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              p.status === "In Stock"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button className="text-gray-400 hover:text-black p-1">
                            <Edit size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "terminals" ? (
            /* ========================================================================= */
            /* TAB: TERMINALS & HARDWARE                                                 */
            /* ========================================================================= */
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">Terminals & Hardware Devices</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connected POS hardware, Kitchen Displays, Printers, and Drawers.
                  </p>
                </div>
                <button className="button-20 h-10 px-5 !rounded-full text-xs font-semibold flex items-center gap-2">
                  <Plus size={15} />
                  <span>Pair New Device</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEVICES_DATA.map((dev) => (
                  <div key={dev.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                        {dev.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {dev.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-950">{dev.name}</h4>
                      <p className="text-xs text-gray-500">{dev.type}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200 text-xs text-gray-600 flex justify-between font-mono">
                      <span>IP: {dev.ip}</span>
                      <span>Power: {dev.battery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "orders" ? (
            /* ========================================================================= */
            /* TAB: ORDERS                                                               */
            /* ========================================================================= */
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">Orders Management</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Track live dining, delivery, and takeaway orders.</p>
                </div>
                <button className="button-20 h-9 px-4 !rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Download size={13} />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-700">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold pb-3">
                      <th className="pb-3">Order No.</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {INITIAL_ORDERS.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 font-mono font-bold text-gray-950">{o.id}</td>
                        <td className="py-3 font-semibold text-gray-900">{o.customer}</td>
                        <td className="py-3 text-gray-500">{o.phone}</td>
                        <td className="py-3 font-bold text-gray-950">{o.purchase}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${o.historyColor}`}>
                            {o.history}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button className="text-blue-600 hover:underline font-semibold text-xs">
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* TAB: GENERIC WORKSPACE (Sales, Inventory, Billing, Payments, Staff, etc) */
            /* ========================================================================= */
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-950 capitalize">{activeTab} Hub</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Managing {activeTab} for {selectedBranch}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="h-9 px-4 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-xs font-semibold cursor-pointer transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>

              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                  <Layers size={22} />
                </div>
                <h3 className="text-base font-bold text-gray-950 capitalize">{activeTab} Workspace Active</h3>
                <p className="text-xs text-gray-600 max-w-md">
                  All real-time operations, records, and controls for {activeTab} are synchronized across all POS registers in {selectedBranch}.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsPosModalOpen(true)}
                    className="button-20 h-9 px-5 !rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Open POS Terminal & Cashier
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD PRODUCT MODAL                                                      */}
      {/* ========================================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 relative">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-950 mb-1">Add New Product</h3>
            <p className="text-xs text-gray-500 mb-5">Create a menu item for your POS catalog.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddProductOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Vanilla Iced Latte"
                  className="w-full h-10 px-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                  >
                    <option value="Beverages">Beverages</option>
                    <option value="Food">Food</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-900">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="250"
                    className="w-full h-10 px-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900">Initial Stock</label>
                <input
                  type="number"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  placeholder="50"
                  className="w-full h-10 px-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="h-10 px-5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-20 h-10 px-6 !rounded-full font-semibold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LIVE POS REGISTER MODAL                                                */}
      {/* ========================================================================= */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[85vh] max-h-[700px]">
            {/* POS Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold italic">nuradesk</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-bold text-emerald-400">
                  ● POS LIVE (T1)
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">Main Branch | Cashier: Rahul S.</span>
              </div>
              <button
                onClick={() => setIsPosModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* POS Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Catalog Grid */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto border-r border-gray-200 space-y-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-950">Quick Catalog</h3>
                  <div className="text-xs text-gray-500">Tap to add to ticket</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRODUCTS_DATA.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-black cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold">{item.category}</span>
                        <h4 className="text-xs font-bold text-gray-900 mt-0.5 leading-tight">{item.name}</h4>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-black text-gray-950">{item.price}</span>
                        <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                          +
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Order Bill */}
              <div className="w-full md:w-80 bg-white p-5 flex flex-col justify-between shrink-0">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-950">Ticket #1042</span>
                    <span className="text-[11px] text-gray-500">Table 4</span>
                  </div>

                  <div className="py-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">Artisan Cappuccino</div>
                        <div className="text-[10px] text-gray-500">1x Regular</div>
                      </div>
                      <span className="font-bold text-gray-950">₹240</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">Truffle Mushroom Melt</div>
                        <div className="text-[10px] text-gray-500">1x Extra Dip</div>
                      </div>
                      <span className="font-bold text-gray-950">₹480</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Total */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>₹720.00</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>GST (18%)</span>
                      <span>₹129.60</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-gray-950 pt-1 border-t border-gray-100">
                      <span>Total Due</span>
                      <span>₹849.60</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Payment Processed! Receipt printed to P1.")}
                    className="button-20 w-full h-11 !rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <CreditCard size={15} />
                    <span>Pay ₹849.60 (Cash / UPI / Card)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
