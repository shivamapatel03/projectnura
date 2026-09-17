"use client";

import React, { useState } from "react";
import {
  IconPlus,
  IconChevronDown,
  IconX,
  IconCheck,
  IconRotateClockwise,
  IconEdit,
  IconPower,
  IconCopy,
  IconPrinter,
  IconCurrencyDollar,
  IconDeviceTv,
  IconExternalLink,
} from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { Device } from "../types";
import { CustomerDisplayModal } from "../modals/CustomerDisplayModal";

export const TerminalsView: React.FC = () => {
  const {
    devices,
    setIsAddDeviceOpen,
    updateDevice,
    updateDeviceStatus,
    deleteDevice,
    selectedOutlet,
    setSelectedOutlet,
    outlets,
  } = useAdminStore();

  const [outletFilter, setOutletFilter] = useState<string>(selectedOutlet.id);
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);

  // Customer Display modal state
  const [isCustomerDisplayOpen, setIsCustomerDisplayOpen] = useState(false);
  const [selectedCustomerDisplay, setSelectedCustomerDisplay] = useState<Device | null>(null);

  // Manage Device modal state
  const [managedDevice, setManagedDevice] = useState<Device | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [newGeneratedCode, setNewGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Keep managedDevice in sync with store
  const activeManagedDevice = managedDevice
    ? devices.find((d) => d.id === managedDevice.id) || managedDevice
    : null;

  const currentOutletName =
    outletFilter === "all"
      ? "All Outlets"
      : outlets.find((o) => o.id === outletFilter)?.name || selectedOutlet.name;

  const filteredDevices = devices.filter((d) => {
    if (outletFilter === "all") return true;
    return d.outletId === outletFilter;
  });

  const handleOpenManage = (device: Device) => {
    setManagedDevice(device);
    setIsRenaming(false);
    setRenameValue(device.name);
    setNewGeneratedCode(null);
    setCodeCopied(false);
  };

  const handleSaveRename = () => {
    if (!activeManagedDevice || !renameValue.trim()) return;
    updateDevice(activeManagedDevice.id, { name: renameValue.trim() });
    setIsRenaming(false);
  };

  const handleGenerateNewCode = () => {
    if (!activeManagedDevice) return;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let part = "";
    for (let i = 0; i < 4; i++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newCode = `NURA-${part}`;
    updateDevice(activeManagedDevice.id, { pairingCode: newCode });
    setNewGeneratedCode(newCode);
    setCodeCopied(false);
  };

  const handleCopyNewCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleToggleDisable = () => {
    if (!activeManagedDevice) return;
    if (activeManagedDevice.status === "Disabled") {
      updateDeviceStatus(activeManagedDevice.id, "Online");
    } else {
      updateDeviceStatus(activeManagedDevice.id, "Disabled");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Terminals
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage POS and other devices
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const cdDev = devices.find((d) => d.type === "Customer Display") || null;
              setSelectedCustomerDisplay(cdDev);
              setIsCustomerDisplayOpen(true);
            }}
            className="button-20 button-20-sm text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <IconDeviceTv size={15} />
            <span>Show Customer Display</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddDeviceOpen(true)}
            className="button-20 button-20-sm text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <IconPlus size={15} />
            <span>+ Add Device</span>
          </button>
        </div>
      </div>

      {/* Outlet Selector Dropdown */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
          className="h-9 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-900 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <span>{currentOutletName}</span>
          <IconChevronDown size={14} className="text-gray-500" />
        </button>

        {isOutletDropdownOpen && (
          <div className="absolute left-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 text-xs animate-fadeIn">
            <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Filter By Outlet
            </div>
            <button
              type="button"
              onClick={() => {
                setOutletFilter("all");
                setIsOutletDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                outletFilter === "all"
                  ? "font-bold text-black bg-gray-50"
                  : "text-gray-700"
              }`}
            >
              <span>All Outlets</span>
              {outletFilter === "all" && <IconCheck size={14} className="text-black" />}
            </button>

            {outlets.map((out) => (
              <button
                key={out.id}
                type="button"
                onClick={() => {
                  setOutletFilter(out.id);
                  setSelectedOutlet(out);
                  setIsOutletDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                  outletFilter === out.id
                    ? "font-bold text-black bg-gray-50"
                    : "text-gray-700"
                }`}
              >
                <span>{out.name}</span>
                {outletFilter === out.id && <IconCheck size={14} className="text-black" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Device Cards Stack */}
      <div className="space-y-3.5">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((dev) => {
            const isOnline = dev.status === "Online";
            const isOffline = dev.status === "Offline";
            const isDisabled = dev.status === "Disabled";

            return (
              <div
                key={dev.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all space-y-4"
              >
                {/* Top Row: Device ID + Name & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-gray-950 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/80">
                        {dev.code}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-950 truncate">
                        {dev.name}
                      </h3>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {dev.type} · {dev.outletName}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last active: {dev.lastActive || "Just now"}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0">
                    {isOnline && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Online</span>
                      </span>
                    )}
                    {isOffline && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                        <span className="w-2 h-2 rounded-full border border-gray-400 bg-transparent" />
                        <span>Offline</span>
                      </span>
                    )}
                    {isDisabled && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Disabled</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Manage Action Button */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenManage(dev)}
                      className="h-8 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Manage
                    </button>

                    {dev.type === "Customer Display" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomerDisplay(dev);
                          setIsCustomerDisplayOpen(true);
                        }}
                        className="button-20 button-20-sm text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <IconDeviceTv size={14} />
                        <span>Show Customer Display</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-gray-400">
                    ID: {dev.code}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              No devices found for this outlet
            </p>
            <p className="text-xs text-gray-500">
              Click "+ Add Device" to register a POS Terminal, Kitchen Display, or Customer Display.
            </p>
            <button
              type="button"
              onClick={() => setIsAddDeviceOpen(true)}
              className="mt-2 button-20 button-20-sm text-xs cursor-pointer"
            >
              + Add Device
            </button>
          </div>
        )}
      </div>

      {/* DEVICE DETAILS MODAL (When Admin clicks Manage) */}
      {activeManagedDevice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-base font-bold text-gray-950">
                  {activeManagedDevice.code} — {activeManagedDevice.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManagedDevice(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs overflow-y-auto max-h-[80vh]">
              {/* Rename Inline Field (if active) */}
              {isRenaming && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Rename Device
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 focus:border-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveRename}
                      className="button-20 button-20-sm text-xs cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRenaming(false)}
                      className="h-9 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Newly generated code alert */}
              {newGeneratedCode && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>New Pairing Code Generated</span>
                    <button
                      type="button"
                      onClick={() => handleCopyNewCode(newGeneratedCode)}
                      className="text-xs text-emerald-800 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {codeCopied ? (
                        <>
                          <IconCheck size={14} /> <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <IconCopy size={14} /> <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-2xl font-black text-gray-950 tracking-wider">
                    {newGeneratedCode}
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Enter this code on the physical device to pair.
                  </p>
                </div>
              )}

              {/* Device Metadata Specifications */}
              <div className="space-y-3 bg-gray-50/70 border border-gray-200/80 rounded-xl p-4.5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-medium text-gray-500">Status</div>
                    <div className="mt-1 font-semibold">
                      {activeManagedDevice.status === "Online" && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Online</span>
                        </span>
                      )}
                      {activeManagedDevice.status === "Offline" && (
                        <span className="inline-flex items-center gap-1.5 text-gray-600 font-bold">
                          <span className="w-2 h-2 rounded-full border border-gray-400 bg-transparent" />
                          <span>Offline</span>
                        </span>
                      )}
                      {activeManagedDevice.status === "Disabled" && (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-gray-500">Device Type</div>
                    <div className="mt-1 font-bold text-gray-950">
                      {activeManagedDevice.type}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-gray-500">Outlet</div>
                    <div className="mt-1 font-bold text-gray-950">
                      {activeManagedDevice.outletName}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-gray-500">Device ID</div>
                    <div className="mt-1 font-mono font-bold text-gray-950">
                      {activeManagedDevice.code}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-gray-500">Last Active</div>
                    <div className="mt-1 font-semibold text-gray-950">
                      {activeManagedDevice.lastActive || "Just now"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-gray-500">Created</div>
                    <div className="mt-1 font-semibold text-gray-950">
                      {activeManagedDevice.createdDate || "17 Sep 2026"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Hardware (For POS devices) */}
              {activeManagedDevice.type === "POS Terminal" && (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                    Hardware
                  </div>
                  <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden bg-white">
                    {/* Receipt Printer */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                        <IconPrinter size={15} className="text-gray-500" />
                        <span>Receipt Printer</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {activeManagedDevice.hardware?.receiptPrinter || "Connected"}
                      </span>
                    </div>

                    {/* Cash Drawer */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                        <IconCurrencyDollar size={15} className="text-gray-500" />
                        <span>Cash Drawer</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {activeManagedDevice.hardware?.cashDrawer || "Connected"}
                      </span>
                    </div>

                    {/* Customer Display */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                        <IconDeviceTv size={15} className="text-gray-500" />
                        <span>Customer Display</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cd = devices.find((d) => d.type === "Customer Display") || null;
                          setSelectedCustomerDisplay(cd);
                          setIsCustomerDisplayOpen(true);
                        }}
                        className="button-20 button-20-sm text-[11px] !py-1 !px-3 cursor-pointer"
                      >
                        Show Display
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                  Actions
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeManagedDevice.type === "Customer Display" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomerDisplay(activeManagedDevice);
                        setIsCustomerDisplayOpen(true);
                      }}
                      className="button-20 button-20-sm text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <IconDeviceTv size={14} />
                      <span>Show Customer Display</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsRenaming(true)}
                    className="h-9 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <IconEdit size={14} />
                    <span>Rename</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateNewCode}
                    className="h-9 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <IconRotateClockwise size={14} />
                    <span>Generate New Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleDisable}
                    className={`h-9 px-4 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      activeManagedDevice.status === "Disabled"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                    }`}
                  >
                    <IconPower size={14} />
                    <span>
                      {activeManagedDevice.status === "Disabled"
                        ? "Enable Device"
                        : "Disable Device"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Decommission / Delete Option */}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400">
                <span>Pairing Code: {activeManagedDevice.pairingCode || "NURA-84KF"}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove ${activeManagedDevice.name}?`)) {
                      deleteDevice(activeManagedDevice.id);
                      setManagedDevice(null);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                >
                  Remove Device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Display Simulator Modal */}
      <CustomerDisplayModal
        isOpen={isCustomerDisplayOpen}
        onClose={() => setIsCustomerDisplayOpen(false)}
        outletName={selectedCustomerDisplay?.outletName || currentOutletName}
        deviceName={selectedCustomerDisplay?.name || "CD1 — Customer Display 1"}
      />
    </div>
  );
};
export default TerminalsView;
