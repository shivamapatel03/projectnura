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
  ChevronRight,
  Plus,
  ArrowUpRight,
  Download,
  Filter,
  Check,
  Store,
  Printer,
  Layers,
  X,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sliders,
  DollarSign,
  Smartphone,
  Eye,
  Trash2,
  Edit,
  Power,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronUp,
  CheckCircle2,
  Utensils,
  ChefHat,
  Barcode,
  Truck,
  ShoppingBag,
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

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-950 flex antialiased selection:bg-black selection:text-white font-sans overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. COLLAPSIBLE SIDEBAR WITH ORIGINAL NURADESK LOGO & TOGGLE               */}
      {/* ========================================================================= */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-18"
        } bg-[#0e0e11] border-r border-zinc-800/80 text-white shrink-0 flex flex-col justify-between transition-all duration-300 z-30 select-none overflow-y-auto hidden md:flex`}
      >
        <div className="p-3 space-y-4">
          {/* Header with Original Nuradesk Logo & Collapse Toggle */}
          {sidebarOpen ? (
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo/logo.png.png"
                    alt="Nuradesk"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-24 sm:w-28 h-6 sm:h-7 flex items-center justify-center brightness-0 invert">
                  <Image
                    src="/logo/text.png"
                    alt="Nuradesk"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Close Sidebar Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 pt-1 pb-1">
              {/* Collapsed Original Logo Mark */}
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
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Open Sidebar Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Open sidebar"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Nav Items List (Exact 12 items from image) */}
          <div className="pt-1">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (sidebarOpen) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full h-10 px-3 rounded-xl text-xs sm:text-[13px] font-medium flex items-center justify-between transition-all cursor-pointer text-left ${
                        isActive
                          ? "bg-[#212126] text-white shadow-sm font-semibold border border-zinc-700/50"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={17} className={isActive ? "text-white" : "text-zinc-400"} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                }

                // Collapsed State: Centered Icon with Tooltip
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-11 h-10 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                      isActive
                        ? "bg-[#212126] text-white shadow-sm border border-zinc-700/60"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-zinc-400"} />
                    <span className="absolute left-14 bg-zinc-950 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: Quick Action White Box + Branch/Role Switchers */}
        <div className="p-3 space-y-3">
          {sidebarOpen ? (
            <>
              {/* Quick Action Card */}
              <div
                onClick={() => setIsAddProductOpen(true)}
                className="w-full p-4 rounded-2xl bg-white text-gray-950 border border-zinc-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-md hover:bg-gray-50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus size={16} />
                </div>
                <div className="text-xs font-bold text-gray-950">Add new product</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Or manage catalog</div>
              </div>

              {/* Outlet Switcher Footer */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-xs">
                <div
                  onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                  className="flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-white cursor-pointer rounded-lg hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Store size={13} className="text-zinc-500" />
                    <span className="font-semibold text-zinc-200 truncate">{selectedBranch}</span>
                  </div>
                  <ChevronDown size={13} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2.5 pb-1">
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-10 h-10 rounded-xl bg-white text-black hover:bg-gray-200 flex items-center justify-center shadow-md transition-colors cursor-pointer"
                title="Add new product"
              >
                <Plus size={18} />
              </button>
              <div
                className="w-8 h-8 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center border border-zinc-700 shadow-sm cursor-pointer"
                title="Rahul (Admin)"
              >
                R
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Clean, Light, Luxury Aesthetics)                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] overflow-y-auto">
        {/* Top Header Bar: "My POS", "Outlet: [ Main Branch ∨ ]", Bell, "Name ∨" */}
        <header className="w-full bg-white border-b border-gray-200/90 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Left: Sidebar Toggle + "My POS" */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer transition-colors shadow-2xs"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Layers size={17} />
            </button>
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
            /* TAB: DASHBOARD (Exact layout & content matching user's reference image)   */
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

              {/* 4 KPI METRIC CARDS: Sales, Orders, Avg., Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Sales */}
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
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
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
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
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
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
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
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

              {/* TWO LARGE CARDS: "Sales Overview" (with SALES CHART) & "Recent Sales" */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT CARD: Sales Overview */}
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

                  {/* SALES CHART CONTAINER */}
                  <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[320px] flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-center justify-between pb-2">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Total Revenue Today
                        </span>
                        <div className="text-2xl font-black text-gray-950">₹48,520.00</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        Peak: 2:00 PM – 4:00 PM
                      </span>
                    </div>

                    {/* Styled Interactive SVG Sales Curve with SALES CHART label */}
                    <div className="relative w-full h-48 sm:h-52 flex flex-col justify-end">
                      {/* Watermark Label "SALES CHART" */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <span className="text-2xl sm:text-3xl font-black tracking-widest text-gray-200 uppercase">
                          SALES CHART
                        </span>
                      </div>

                      {/* SVG Line & Gradient Curve */}
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 500 180"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal Grid lines */}
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="0" y1="90" x2="500" y2="90" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="0" y1="140" x2="500" y2="140" stroke="#f3f4f6" strokeWidth="1" />

                        {/* Filled Area */}
                        <path
                          d="M 0 160 Q 70 140 120 110 T 250 50 T 360 85 T 500 30 L 500 180 L 0 180 Z"
                          fill="url(#salesGrad)"
                        />
                        {/* Stroke Path */}
                        <path
                          d="M 0 160 Q 70 140 120 110 T 250 50 T 360 85 T 500 30"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Interactive Data Points */}
                        <circle cx="120" cy="110" r="5" fill="#2563eb" className="stroke-white stroke-2" />
                        <circle cx="250" cy="50" r="6" fill="#1e40af" className="stroke-white stroke-2" />
                        <circle cx="360" cy="85" r="5" fill="#2563eb" className="stroke-white stroke-2" />
                        <circle cx="500" cy="30" r="6" fill="#2563eb" className="stroke-white stroke-2" />
                      </svg>
                    </div>

                    {/* Time Axis Labels */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
                      <span>9 AM</span>
                      <span>12 PM</span>
                      <span>3 PM</span>
                      <span>6 PM</span>
                      <span>9 PM</span>
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
                  <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[320px] flex flex-col justify-between">
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
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
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
              <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
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
                                : p.status === "Low Stock"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-red-50 text-red-700 border border-red-200"
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-6 animate-fadeIn">
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
