"use client";

import React, { useState } from "react";
import { X, Monitor, Printer, Tv, DollarSign, Check, QrCode } from "lucide-react";
import { useAdminStore } from "../adminStore";
import { DeviceType } from "../types";

export const AddDeviceModal: React.FC = () => {
  const { isAddDeviceOpen, setIsAddDeviceOpen, addDevice, selectedOutlet } = useAdminStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [deviceType, setDeviceType] = useState<DeviceType>("POS Terminal");
  const [name, setName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  if (!isAddDeviceOpen) return null;

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const codePrefix =
      deviceType === "POS Terminal"
        ? "T"
        : deviceType === "Kitchen Display"
        ? "K"
        : deviceType === "Customer Display"
        ? "CD"
        : deviceType === "Receipt Printer"
        ? "P"
        : "D";

    const code = `${codePrefix}${Math.floor(3 + Math.random() * 7)}`;
    const pairingCode = `ND-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCode(pairingCode);

    addDevice({
      code,
      name,
      type: deviceType,
      outletId: selectedOutlet.id,
      outletName: selectedOutlet.name,
      status: "Online",
      ip: `192.168.1.${Math.floor(105 + Math.random() * 90)}`,
      pairedCode: pairingCode,
    });

    setStep(2);
  };

  const handleFinish = () => {
    setIsAddDeviceOpen(false);
    setStep(1);
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 className="text-base font-bold text-gray-950">Pair Hardware Device</h3>
            <p className="text-xs text-gray-500">
              {step === 1 ? "Select device hardware specification" : "Pairing code generated"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddDeviceOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleGenerateCode} className="p-6 space-y-4 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-gray-900">Device Hardware Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: "POS Terminal", icon: Monitor, label: "POS Terminal" },
                  { type: "Kitchen Display", icon: Tv, label: "Kitchen KDS" },
                  { type: "Receipt Printer", icon: Printer, label: "Printer (80mm)" },
                  { type: "Customer Display", icon: Tv, label: "Customer Screen" },
                  { type: "Cash Drawer", icon: DollarSign, label: "Cash Drawer" },
                ].map((d) => {
                  const Icon = d.icon;
                  const isSelected = deviceType === d.type;

                  return (
                    <button
                      key={d.type}
                      type="button"
                      onClick={() => {
                        setDeviceType(d.type as DeviceType);
                        if (!name) setName(d.label);
                      }}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                        isSelected
                          ? "border-black bg-gray-50 font-bold text-black"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="font-semibold text-gray-900">Device Nickname / Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Counter 3 / Bar Station"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs text-gray-900"
              />
            </div>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-[11px] space-y-1">
              <div className="font-semibold text-gray-900">Target Outlet</div>
              <div>{selectedOutlet.name} ({selectedOutlet.address})</div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddDeviceOpen(false)}
                className="h-9 px-4 rounded-lg border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-lg bg-black text-white font-semibold hover:bg-zinc-800"
              >
                Generate Device Code
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-5 text-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Check size={24} className="stroke-[2.5]" />
            </div>

            <div>
              <h4 className="text-base font-bold text-gray-950">Enter Pairing Code on Hardware</h4>
              <p className="text-gray-500 mt-1">
                Open the Nuradesk app on the target device and type this one-time code:
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 text-center space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Device Code</div>
              <div className="text-3xl font-mono font-black text-gray-950 tracking-wider">
                {generatedCode}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Listening for device handshake...</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full h-10 rounded-lg bg-black text-white font-semibold hover:bg-zinc-800 transition-colors"
            >
              Device Paired & Connected
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
