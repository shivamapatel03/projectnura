"use client";

import React, { useState } from "react";
import { Plus, Monitor, Tv, Printer, DollarSign, Wifi, Battery, CheckCircle, RefreshCw, Power } from "lucide-react";
import { useAdminStore } from "../adminStore";

export const TerminalsView: React.FC = () => {
  const { devices, setIsAddDeviceOpen, updateDeviceStatus, setIsPosModalOpen, selectedOutlet } = useAdminStore();
  const [filterType, setFilterType] = useState("All");

  const filteredDevices = devices.filter((d) => {
    if (filterType === "All") return true;
    if (filterType === "POS") return d.type === "POS Terminal";
    if (filterType === "KDS") return d.type === "Kitchen Display";
    if (filterType === "Printers") return d.type === "Receipt Printer" || d.type === "Cash Drawer";
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Terminals & Hardware Devices
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage physical POS registers, Kitchen Displays (KDS), Customer screens, and thermal printers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddDeviceOpen(true)}
          className="h-10 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus size={16} />
          <span>+ Add Hardware Device</span>
        </button>
      </div>

      {/* 4 KPI summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Connected Devices</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">{devices.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Live POS Registers</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {devices.filter((d) => d.type === "POS Terminal" && d.status === "Online").length} Active
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Kitchen KDS Displays</div>
          <div className="text-2xl font-bold text-blue-600 font-mono">
            {devices.filter((d) => d.type === "Kitchen Display").length} Online
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Printers & Drawers</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            {devices.filter((d) => d.type === "Receipt Printer" || d.type === "Cash Drawer").length} Ready
          </div>
        </div>
      </div>

      {/* Main Terminals Grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-5">
        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            {["All", "POS", "KDS", "Printers"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === f
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f} Devices
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            Outlet: <span className="font-semibold text-gray-900">{selectedOutlet.name}</span>
          </div>
        </div>

        {/* Devices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((dev) => {
            const Icon =
              dev.type === "POS Terminal"
                ? Monitor
                : dev.type === "Kitchen Display"
                ? Tv
                : dev.type === "Receipt Printer"
                ? Printer
                : DollarSign;

            return (
              <div
                key={dev.id}
                className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs font-mono">
                      {dev.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        dev.status === "Online"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dev.status === "Online" ? "bg-emerald-600 animate-pulse" : "bg-gray-400"
                        }`}
                      />
                      <span>{dev.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                      <Icon size={15} className="text-gray-500" />
                      <span>{dev.name}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{dev.type}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/80 text-[11px] text-gray-600 space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>IP: {dev.ip}</span>
                    {dev.battery && <span>Power: {dev.battery}</span>}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {dev.type === "POS Terminal" ? (
                      <button
                        type="button"
                        onClick={() => setIsPosModalOpen(true)}
                        className="h-8 px-3 rounded-lg bg-black hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Launch POS
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`Test signal sent to ${dev.name}. Status: OK`)}
                        className="h-8 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Ping Device
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        updateDeviceStatus(dev.id, dev.status === "Online" ? "Offline" : "Online")
                      }
                      className="text-gray-400 hover:text-black p-1"
                      title="Toggle power"
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
