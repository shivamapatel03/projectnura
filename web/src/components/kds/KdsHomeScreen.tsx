"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useKdsStore } from "./kdsStore";
import { KdsOrderCard } from "./KdsOrderCard";
import { KdsOrderDetailsModal } from "./KdsOrderDetailsModal";
import { KdsSettingsModal } from "./KdsSettingsModal";
import {
  IconWifi,
  IconWifiOff,
  IconSettings,
  IconVolume,
  IconVolumeOff,
  IconPlus,
  IconBell,
  IconChevronDown,
  IconDeviceTv,
  IconCheck,
  IconClock,
  IconFilter,
  IconRefresh,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";

export const KdsHomeScreen: React.FC = () => {
  const {
    pairedDevice,
    isOnline,
    toggleOffline,
    selectedStation,
    setSelectedStation,
    activeStatusFilter,
    setActiveStatusFilter,
    orders,
    filteredOrders,
    simulateIncomingOrder,
    setIsSettingsOpen,
    settings,
    updateSettings,
    newOrderAlertBanner,
    dismissNewOrderAlertBanner,
    startOrder,
  } = useKdsStore();

  const [timeStr, setTimeStr] = useState<string>("");
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isLight = settings.theme === "light";

  // Counts by status (filtered by current station)
  const stationOrders = orders.filter((order) => {
    if (selectedStation === "All") return true;
    return order.items.some(
      (it) => it.station.toLowerCase() === selectedStation.toLowerCase()
    );
  });

  const newOrders = stationOrders.filter((o) => o.status === "NEW");
  const preparingOrders = stationOrders.filter((o) => o.status === "PREPARING");
  const readyOrders = stationOrders.filter((o) => o.status === "READY");
  const completedOrders = stationOrders.filter((o) => o.status === "COMPLETED");

  return (
    <div
      className={`h-screen w-screen flex flex-col font-sans select-none overflow-hidden antialiased transition-colors duration-200 ${
        isLight ? "bg-[#f3f4f6] text-gray-900" : "bg-[#0d0f12] text-gray-100"
      }`}
    >
      {/* 1. TOP KDS STATUS & CONTROL BAR */}
      <header
        className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 transition-colors duration-200 ${
          isLight
            ? "bg-white border-b border-gray-200 shadow-xs"
            : "bg-[#161a22] border-b border-gray-800 shadow-md"
        }`}
      >
        {/* Left: Brand Logo, Cafe Name, Station Selector */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/logo.png.png"
              alt="Nuradesk"
              width={28}
              height={28}
              className={`w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 ${
                isLight ? "" : "brightness-0 invert [filter:brightness(0)_invert(1)]"
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-black text-sm sm:text-base tracking-tight ${
                    isLight ? "text-gray-950" : "text-white"
                  }`}
                >
                  {pairedDevice.cafeName || "SHIV CAFE"}
                </span>
                <span className="text-gray-400 text-xs font-semibold">·</span>
                <span
                  className={`text-xs font-medium hidden md:inline ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {pairedDevice.outlet || "Main Branch"}
                </span>
              </div>
            </div>
          </div>

          {/* Station Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStationMenuOpen(!isStationMenuOpen)}
              className={`h-8 px-3 rounded-lg border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors ${
                isLight
                  ? "bg-gray-100 border-gray-200 hover:border-gray-300 text-amber-800"
                  : "bg-[#0d0f12] border-gray-700 hover:border-gray-600 text-amber-400"
              }`}
              title="Filter by preparation station"
            >
              <span className="uppercase">
                {selectedStation === "All" ? "ALL STATIONS" : selectedStation}
              </span>
              <span
                className={`font-mono ${isLight ? "text-gray-400" : "text-gray-500"}`}
              >
                · {pairedDevice.id}
              </span>
              <IconChevronDown
                size={14}
                className={isLight ? "text-gray-500" : "text-gray-400"}
              />
            </button>

            {isStationMenuOpen && (
              <div
                className={`absolute top-10 left-0 w-44 rounded-xl shadow-2xl p-1 z-50 animate-fadeIn space-y-0.5 border ${
                  isLight ? "bg-white border-gray-200" : "bg-[#161a22] border-gray-700"
                }`}
              >
                {(["All", "Main Kitchen", "Bar", "Dessert"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSelectedStation(st);
                      setIsStationMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs text-left font-bold flex items-center justify-between cursor-pointer transition-colors ${
                      selectedStation === st
                        ? "bg-amber-400 text-black font-black"
                        : isLight
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <span>{st === "All" ? "All Stations" : st}</span>
                    {selectedStation === st && <IconCheck size={14} stroke={3} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Digital Clock */}
        <div
          className={`hidden lg:flex items-center gap-2 text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
            isLight
              ? "bg-gray-100 border-gray-200 text-gray-700"
              : "bg-[#0d0f12] border-gray-800 text-gray-400"
          }`}
        >
          <IconClock size={14} className={isLight ? "text-gray-500" : "text-gray-500"} />
          <span>{timeStr || "12:42:00 PM"}</span>
        </div>

        {/* Right Controls: Online, Simulate Order, Theme Quick Toggle, Audio, Settings */}
        <div className="flex items-center gap-2">
          {/* Online / Offline Status Indicator */}
          <button
            type="button"
            onClick={toggleOffline}
            className={`h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isOnline
                ? isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-emerald-950/40 border-emerald-800/80 text-emerald-400"
                : isLight
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                : "bg-rose-950/40 border-rose-800/80 text-rose-400 animate-pulse"
            }`}
            title={
              isOnline
                ? "Display is Online · Tap to simulate offline"
                : "Offline · Tap to go online"
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-rose-500"}`}
            />
            <span>{isOnline ? "Online" : "Offline"}</span>
          </button>

          {/* Test/Simulate Order button */}
          <button
            type="button"
            onClick={simulateIncomingOrder}
            className={`h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isLight
                ? "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900"
                : "bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300"
            }`}
            title="Simulate an incoming order from POS counter"
          >
            <IconPlus size={14} stroke={2.5} />
            <span className="hidden sm:inline">Test Order</span>
          </button>

          {/* Theme Quick Toggle Button */}
          <button
            type="button"
            onClick={() => updateSettings({ theme: isLight ? "dark" : "light" })}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 border-gray-200 text-amber-600"
                : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-amber-400 hover:text-white"
            }`}
            title={isLight ? "Switch to Dark Kitchen" : "Switch to Light Mode"}
          >
            {isLight ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
              settings.soundEnabled
                ? isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                  : "bg-gray-800/80 border-gray-700 text-emerald-400 hover:text-white"
                : isLight
                ? "bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-600"
                : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-400"
            }`}
            title={
              settings.soundEnabled
                ? "Sound Enabled · Click to Mute"
                : "Sound Muted · Click to Enable"
            }
          >
            {settings.soundEnabled ? <IconVolume size={16} /> : <IconVolumeOff size={16} />}
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
                : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-400 hover:text-white"
            }`}
            title="KDS Settings"
          >
            <IconSettings size={16} />
          </button>
        </div>
      </header>

      {/* 2. NEW ORDER ALERT BANNER (Flashing callout when fresh order arrives) */}
      {newOrderAlertBanner && (
        <div className="bg-amber-400 text-black px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-black animate-bounce shadow-xl z-20">
          <div className="flex items-center gap-2">
            <IconBell size={18} className="animate-pulse" />
            <span>NEW ORDER {newOrderAlertBanner.orderNumber}</span>
            <span className="bg-black text-amber-400 px-2 py-0.5 rounded text-xs font-bold font-mono">
              {newOrderAlertBanner.destination}
            </span>
            <span className="hidden md:inline font-medium text-xs">
              ({newOrderAlertBanner.items.length} items)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                startOrder(newOrderAlertBanner.id);
                dismissNewOrderAlertBanner();
              }}
              className="px-3 py-1 rounded bg-black text-white text-xs font-black uppercase hover:bg-gray-900 cursor-pointer transition-colors"
            >
              Start Preparing
            </button>
            <button
              type="button"
              onClick={dismissNewOrderAlertBanner}
              className="px-2 py-1 rounded text-black/70 hover:text-black font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 3. STATUS FILTER TABS BAR */}
      <div
        className={`h-12 px-4 sm:px-6 border-b flex items-center justify-between shrink-0 transition-colors duration-200 ${
          isLight ? "bg-white border-gray-200" : "bg-[#11141a] border-gray-800/80"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {/* ALL */}
          <button
            type="button"
            onClick={() => setActiveStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeStatusFilter === "ALL"
                ? isLight
                  ? "bg-gray-950 text-white font-black shadow-xs"
                  : "bg-white text-black font-black shadow-xs"
                : isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <span>All Columns</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isLight ? "bg-gray-200 text-gray-700" : "bg-gray-700 text-gray-200"
              }`}
            >
              {stationOrders.length}
            </span>
          </button>

          {/* NEW */}
          <button
            type="button"
            onClick={() => setActiveStatusFilter("NEW")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeStatusFilter === "NEW"
                ? "bg-amber-400 text-black font-black shadow-xs"
                : isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <span>New</span>
            {newOrders.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isLight
                    ? "bg-amber-100 text-amber-800"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {newOrders.length}
              </span>
            )}
          </button>

          {/* PREPARING */}
          <button
            type="button"
            onClick={() => setActiveStatusFilter("PREPARING")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeStatusFilter === "PREPARING"
                ? "bg-blue-600 text-white font-black shadow-xs"
                : isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <span>Preparing</span>
            {preparingOrders.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isLight
                    ? "bg-blue-100 text-blue-800"
                    : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {preparingOrders.length}
              </span>
            )}
          </button>

          {/* READY */}
          <button
            type="button"
            onClick={() => setActiveStatusFilter("READY")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeStatusFilter === "READY"
                ? "bg-emerald-600 text-white font-black shadow-xs"
                : isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <span>Ready</span>
            {readyOrders.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isLight
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {readyOrders.length}
              </span>
            )}
          </button>

          {/* COMPLETED */}
          <button
            type="button"
            onClick={() => setActiveStatusFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeStatusFilter === "COMPLETED"
                ? isLight
                  ? "bg-gray-800 text-white font-black shadow-xs"
                  : "bg-gray-700 text-white font-black shadow-xs"
                : isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <span>Completed</span>
            {completedOrders.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isLight ? "bg-gray-200 text-gray-600" : "bg-gray-800 text-gray-400"
                }`}
              >
                {completedOrders.length}
              </span>
            )}
          </button>
        </div>

        <div
          className={`text-[11px] font-semibold hidden md:block ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Tap cards to view full details · Tap items to check off
        </div>
      </div>

      {/* 4. MAIN KDS CONTENT AREA */}
      <main
        className={`flex-1 overflow-hidden p-3 sm:p-4 transition-colors duration-200 ${
          isLight ? "bg-[#f3f4f6]" : "bg-[#0d0f12]"
        }`}
      >
        {activeStatusFilter === "ALL" ? (
          /* 3-COLUMN KANBAN BOARD (Section 03 Layout: NEW | PREPARING | READY) */
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 overflow-hidden">
            {/* COLUMN 1: NEW ORDERS */}
            <div
              className={`flex flex-col h-full rounded-2xl overflow-hidden shadow-xs border transition-colors ${
                isLight
                  ? "bg-gray-200/50 border-gray-300"
                  : "bg-[#13161c] border-gray-800/80 shadow-inner"
              }`}
            >
              <div
                className={`px-4 py-3 flex items-center justify-between shrink-0 border-b ${
                  isLight
                    ? "bg-amber-50/90 border-amber-200"
                    : "bg-[#181c24] border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3
                    className={`font-black text-xs uppercase tracking-wider ${
                      isLight ? "text-amber-950" : "text-white"
                    }`}
                  >
                    NEW ORDERS
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
                    isLight
                      ? "bg-amber-200 text-amber-900"
                      : "bg-amber-400/20 text-amber-300"
                  }`}
                >
                  {newOrders.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {newOrders.length === 0 ? (
                  <div
                    className={`h-48 flex flex-col items-center justify-center text-xs font-bold ${
                      isLight ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span>No new orders</span>
                    <span
                      className={`text-[10px] font-normal mt-0.5 ${
                        isLight ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      Tickets sent from POS appear here
                    </span>
                  </div>
                ) : (
                  newOrders.map((order) => <KdsOrderCard key={order.id} order={order} />)
                )}
              </div>
            </div>

            {/* COLUMN 2: PREPARING */}
            <div
              className={`flex flex-col h-full rounded-2xl overflow-hidden shadow-xs border transition-colors ${
                isLight
                  ? "bg-gray-200/50 border-gray-300"
                  : "bg-[#13161c] border-gray-800/80 shadow-inner"
              }`}
            >
              <div
                className={`px-4 py-3 flex items-center justify-between shrink-0 border-b ${
                  isLight
                    ? "bg-blue-50/90 border-blue-200"
                    : "bg-[#181c24] border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <h3
                    className={`font-black text-xs uppercase tracking-wider ${
                      isLight ? "text-blue-950" : "text-white"
                    }`}
                  >
                    PREPARING
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
                    isLight
                      ? "bg-blue-200 text-blue-900"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {preparingOrders.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {preparingOrders.length === 0 ? (
                  <div
                    className={`h-48 flex flex-col items-center justify-center text-xs font-bold ${
                      isLight ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span>No orders preparing</span>
                    <span
                      className={`text-[10px] font-normal mt-0.5 ${
                        isLight ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      Tap [START] on new orders
                    </span>
                  </div>
                ) : (
                  preparingOrders.map((order) => (
                    <KdsOrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: READY */}
            <div
              className={`flex flex-col h-full rounded-2xl overflow-hidden shadow-xs border transition-colors ${
                isLight
                  ? "bg-gray-200/50 border-gray-300"
                  : "bg-[#13161c] border-gray-800/80 shadow-inner"
              }`}
            >
              <div
                className={`px-4 py-3 flex items-center justify-between shrink-0 border-b ${
                  isLight
                    ? "bg-emerald-50/90 border-emerald-200"
                    : "bg-[#181c24] border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3
                    className={`font-black text-xs uppercase tracking-wider ${
                      isLight ? "text-emerald-950" : "text-white"
                    }`}
                  >
                    READY FOR PICKUP
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
                    isLight
                      ? "bg-emerald-200 text-emerald-900"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {readyOrders.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {readyOrders.length === 0 ? (
                  <div
                    className={`h-48 flex flex-col items-center justify-center text-xs font-bold ${
                      isLight ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span>No orders waiting for pickup</span>
                    <span
                      className={`text-[10px] font-normal mt-0.5 ${
                        isLight ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      Tap [READY] when food is cooked
                    </span>
                  </div>
                ) : (
                  readyOrders.map((order) => (
                    <KdsOrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* FILTERED GRID VIEW (Single status grid e.g. all NEW, all PREPARING, or all COMPLETED history) */
          <div className="h-full overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div
                className={`h-64 flex flex-col items-center justify-center text-xs font-bold ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <span>No {activeStatusFilter.toLowerCase()} orders found</span>
                <button
                  type="button"
                  onClick={() => setActiveStatusFilter("ALL")}
                  className="mt-2 text-amber-500 hover:underline text-xs cursor-pointer"
                >
                  Switch to All Columns
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
                {filteredOrders.map((order) => (
                  <KdsOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Modals */}
      <KdsOrderDetailsModal />
      <KdsSettingsModal />
    </div>
  );
};
