"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconLayoutDashboard,
  IconReceipt2,
  IconClipboardList,
  IconPackage,
  IconPackages,
  IconFileInvoice,
  IconCreditCard,
  IconUserCheck,
  IconDeviceDesktop,
  IconChartBar,
  IconSettings,
  IconBell,
  IconChevronDown,
  IconChevronLeft,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { AdminProvider, useAdminStore } from "./adminStore";
import { AdminTab } from "./types";

// Views
import { DashboardView } from "./views/DashboardView";
import { ProductsView } from "./views/ProductsView";
import { StaffView } from "./views/StaffView";
import { TerminalsView } from "./views/TerminalsView";
import { SalesView } from "./views/SalesView";
import { OrdersView } from "./views/OrdersView";
import { PaymentsView } from "./views/PaymentsView";
import { InventoryView } from "./views/InventoryView";
import { BillingView } from "./views/BillingView";
import { ReportsView } from "./views/ReportsView";
import { SettingsView } from "./views/SettingsView";

// Modals & Sidebar
import { AddProductModal } from "./modals/AddProductModal";
import { AddStaffModal } from "./modals/AddStaffModal";
import { AddDeviceModal } from "./modals/AddDeviceModal";
import { AiAssistantSidebar } from "./AiAssistantSidebar";

const AdminDashboardContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedOutlet,
    setSelectedOutlet,
    outlets,
  } = useAdminStore();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: IconLayoutDashboard },
    { id: "sales", label: "Sales", icon: IconReceipt2 },
    { id: "orders", label: "Orders", icon: IconClipboardList },
    { id: "products", label: "Products", icon: IconPackage },
    { id: "inventory", label: "Inventory", icon: IconPackages },
    { id: "billing", label: "Billing", icon: IconFileInvoice },
    { id: "payments", label: "Payments", icon: IconCreditCard },
    { id: "staff", label: "Staff", icon: IconUserCheck },
    { id: "terminals", label: "Terminals", icon: IconDeviceDesktop },
    { id: "reports", label: "Reports", icon: IconChartBar },
    { id: "settings", label: "Settings", icon: IconSettings },
  ];

  return (
    <div className="h-screen w-screen bg-[#f8f9fa] text-gray-950 flex antialiased selection:bg-black selection:text-white font-sans overflow-hidden">
      {/* 1. STICKY COLLAPSIBLE SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-[72px]"
        } h-screen sticky top-0 bg-[#0e0e11] border-r border-zinc-800/80 text-white shrink-0 flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 select-none overflow-hidden hidden md:flex`}
      >
        <div className="p-3 space-y-3 flex-1 flex flex-col min-h-0">
          {/* Header with Nuradesk Logo & Collapse Toggle */}
          {sidebarOpen ? (
            <div className="flex items-center justify-between px-2 pt-1 pb-1 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] cursor-pointer"
                title="Nuradesk"
              >
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
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
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shrink-0"
                title="Collapse sidebar"
              >
                <IconChevronLeft size={16} />
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
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                title="Expand sidebar"
              >
                <IconChevronLeft size={16} className="rotate-180" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
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
                    className={`w-full h-9 sm:h-[38px] px-3 rounded-xl text-xs sm:text-[13px] font-medium flex items-center transition-all cursor-pointer relative group outline-none focus:outline-none select-none ${
                      isActive
                        ? "bg-[#212126] text-white font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <Icon size={17} className={isActive ? "text-white" : "text-zinc-400"} />
                    </div>

                    <span
                      className={`ml-3 truncate whitespace-nowrap transition-all duration-300 ${
                        sidebarOpen
                          ? "opacity-100 max-w-[160px] translate-x-0"
                          : "opacity-0 max-w-0 -translate-x-3 pointer-events-none"
                      }`}
                    >
                      {item.label}
                    </span>

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

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-[#fafafa]">
        {/* Top Header Bar */}
        <header className="w-full bg-white border-b border-gray-200/90 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
          {/* Left: App Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-950">
              My POS
            </h1>
            <span className="hidden sm:inline-block text-gray-300">•</span>
            <span className="hidden sm:inline-block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {activeTab}
            </span>
          </div>

          {/* Right: Outlet & Profile */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Outlet Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">
                Outlet:
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                  className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300 font-semibold text-xs sm:text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>{selectedOutlet.name}</span>
                  <IconChevronDown size={14} className="text-gray-500" />
                </button>

                {isOutletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 text-xs animate-fadeIn">
                    <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Switch Outlet Location
                    </div>
                    {outlets.map((out) => (
                      <button
                        key={out.id}
                        type="button"
                        onClick={() => {
                          setSelectedOutlet(out);
                          setIsOutletDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                          selectedOutlet.id === out.id
                            ? "font-bold text-black bg-gray-100"
                            : "text-gray-700"
                        }`}
                      >
                        <div>
                          <div>{out.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{out.code}</div>
                        </div>
                        {selectedOutlet.id === out.id && <IconCheck size={14} className="text-black" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => setIsAiOpen(true)}
              className="flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Open AI Assistant"
              title="Nuradesk AI"
            >
              <Image
                src="/logo/AI.png"
                alt="Nuradesk AI"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-[30px] sm:h-[30px] object-contain"
              />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-gray-200/90 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
              <IconBell size={16} />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>Rahul</span>
                <IconChevronDown size={14} className="text-gray-500" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 text-xs animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="font-bold text-gray-900">Rahul Sharma</p>
                    <p className="text-[11px] text-gray-500">rahul@nuradesk.com</p>
                    <span className="inline-block mt-1 px-2 py-0.2 rounded text-[10px] bg-black text-white font-mono">
                      Owner & Admin
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("settings");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Account & Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("terminals");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Terminals & Devices
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

        {/* Dashboard Main Workspace */}
        <main className="p-4 sm:p-8 space-y-7 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "sales" && <SalesView />}
          {activeTab === "orders" && <OrdersView />}
          {activeTab === "products" && <ProductsView />}
          {activeTab === "inventory" && <InventoryView />}
          {activeTab === "billing" && <BillingView />}
          {activeTab === "payments" && <PaymentsView />}
          {activeTab === "staff" && <StaffView />}
          {activeTab === "terminals" && <TerminalsView />}
          {activeTab === "reports" && <ReportsView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & AI Assistant */}
      <AddProductModal />
      <AddStaffModal />
      <AddDeviceModal />
      <AiAssistantSidebar isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
};

export default AdminDashboard;
