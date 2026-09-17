"use client";

import React, { useState, useEffect } from "react";
import { IconX, IconCopy, IconCheck } from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { DeviceType, Device } from "../types";

export const AddDeviceModal: React.FC = () => {
  const {
    isAddDeviceOpen,
    setIsAddDeviceOpen,
    addDevice,
    devices,
    selectedOutlet,
    outlets,
  } = useAdminStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [deviceType, setDeviceType] = useState<DeviceType>("POS Terminal");
  const [name, setName] = useState("Counter POS 1");
  const [outletId, setOutletId] = useState(selectedOutlet.id);
  const [createdDevice, setCreatedDevice] = useState<Device | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync outletId when modal opens
  useEffect(() => {
    if (isAddDeviceOpen) {
      setOutletId(selectedOutlet.id);
      setStep(1);
      setCopied(false);
    }
  }, [isAddDeviceOpen, selectedOutlet.id]);

  // Update default name suggestion when device type changes
  useEffect(() => {
    if (step === 1) {
      const prefix =
        deviceType === "POS Terminal"
          ? "Counter POS"
          : deviceType === "Kitchen Display"
          ? "Kitchen Display"
          : "Customer Display";
      const count =
        devices.filter((d) => d.type === deviceType).length + 1;
      setName(`${prefix} ${count}`);
    }
  }, [deviceType, devices, step]);

  if (!isAddDeviceOpen) return null;

  const getNextCode = (type: DeviceType): string => {
    const prefix =
      type === "POS Terminal" ? "T" : type === "Kitchen Display" ? "K" : "CD";
    const existingNums = devices
      .filter((d) => d.code.startsWith(prefix))
      .map((d) => parseInt(d.code.replace(prefix, ""), 10))
      .filter((n) => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    return `${prefix}${nextNum}`;
  };

  const generatePairingCode = (): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let part = "";
    for (let i = 0; i < 4; i++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `NURA-${part}`;
  };

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const targetOutlet =
      outlets.find((o) => o.id === outletId) || selectedOutlet;
    const code = getNextCode(deviceType);
    const pairingCode = generatePairingCode();

    const newDevice = addDevice({
      code,
      name: name.trim(),
      type: deviceType,
      outletId: targetOutlet.id,
      outletName: targetOutlet.name,
      status: "Online",
      lastActive: "Just now",
      createdDate: "17 Sep 2026",
      pairingCode,
      hardware:
        deviceType === "POS Terminal"
          ? {
              receiptPrinter: "Connected",
              cashDrawer: "Connected",
              customerDisplay: "Not Connected",
            }
          : undefined,
      ip: `192.168.1.${Math.floor(110 + Math.random() * 80)}`,
    });

    setCreatedDevice(newDevice);
    setStep(2);
  };

  const handleCopyCode = () => {
    if (createdDevice?.pairingCode) {
      navigator.clipboard.writeText(createdDevice.pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDone = () => {
    setIsAddDeviceOpen(false);
    setStep(1);
    setCreatedDevice(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <h3 className="text-base font-bold text-gray-950">
            {step === 1 ? "Add Device" : "Device Created"}
          </h3>
          <button
            type="button"
            onClick={handleDone}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreateDevice} className="p-6 space-y-5 text-xs">
            {/* Device Type Radio */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-gray-900 block">
                Device Type
              </label>
              <div className="space-y-2">
                {(
                  [
                    "POS Terminal",
                    "Kitchen Display",
                    "Customer Display",
                  ] as DeviceType[]
                ).map((t) => {
                  const isChecked = deviceType === t;
                  return (
                    <label
                      key={t}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "border-black bg-gray-50 text-gray-950 font-semibold"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deviceType"
                        checked={isChecked}
                        onChange={() => setDeviceType(t)}
                        className="w-4 h-4 text-black focus:ring-black accent-black cursor-pointer"
                      />
                      <span className="text-xs">{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Device Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-900 block">
                Device Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Counter POS 1"
                className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white focus:border-black outline-none text-xs text-gray-950 transition-colors"
              />
            </div>

            {/* Outlet Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-900 block">
                Outlet
              </label>
              <select
                value={outletId}
                onChange={(e) => setOutletId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white focus:border-black outline-none text-xs text-gray-950 cursor-pointer transition-colors"
              >
                {outlets.map((out) => (
                  <option key={out.id} value={out.id}>
                    {out.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="button-20 w-full h-11 !rounded-xl text-xs font-semibold cursor-pointer"
              >
                Create Device
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: After Creating */
          <div className="p-6 space-y-6 text-center">
            {/* Device Subheader */}
            <div className="text-left bg-gray-50 border border-gray-200 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Device
              </div>
              <div className="text-sm font-bold text-gray-950 mt-0.5">
                {createdDevice?.code} — {createdDevice?.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {createdDevice?.type} · {createdDevice?.outletName}
              </div>
            </div>

            {/* Pairing Code Section */}
            <div className="p-5 rounded-xl border border-gray-200 bg-white text-center space-y-2">
              <div className="text-xs font-semibold text-gray-500">
                Pairing Code
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-gray-950 tracking-wider">
                  {createdDevice?.pairingCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy Pairing Code"
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  {copied ? <IconCheck size={16} className="text-emerald-600" /> : <IconCopy size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 pt-1">
                Enter this code on the physical device.
              </p>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={handleDone}
              className="button-20 w-full h-11 !rounded-xl text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default AddDeviceModal;
