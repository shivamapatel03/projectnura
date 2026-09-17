"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconAlertCircle, IconCheck, IconBuildingStore } from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

export const DeviceSetupScreen: React.FC = () => {
  const { pairedDevice, pairDevice } = useTerminalStore();
  const [code, setCode] = useState("NURA-84KF");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter a device code");
      return;
    }
    const success = pairDevice(code.trim());
    if (success) {
      setIsSuccess(true);
    } else {
      setError("Invalid device pairing code");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 antialiased text-gray-950 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-1 p-2.5 shadow-xs">
            <Image
              src="/logo/logo.png.png"
              alt="Nuradesk"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950">
            NURADESK
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Terminal POS Device Setup
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleConnect} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Enter Device Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="e.g. NURA-84KF"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-center font-mono font-bold text-base tracking-widest text-gray-950 focus:bg-white focus:border-black outline-none transition-all"
              />
              <p className="text-[11px] text-gray-400 text-center">
                Pairing code generated from your Admin Panel → Terminals
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <IconAlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="button-20 w-full h-12 !rounded-xl text-sm font-semibold cursor-pointer"
            >
              Connect Terminal
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
              <IconCheck size={28} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-950">
                ✓ Terminal Connected
              </h2>
              <p className="text-xs text-gray-500">
                Device successfully paired and authenticated
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Outlet</span>
                <span className="font-bold text-gray-950 flex items-center gap-1">
                  <IconBuildingStore size={14} className="text-gray-500" />
                  <span>{pairedDevice.outlet}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Terminal</span>
                <span className="font-bold text-gray-950 font-mono">
                  {pairedDevice.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online & Ready</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                pairDevice(code);
              }}
              className="button-20 w-full h-12 !rounded-xl text-sm font-semibold cursor-pointer"
            >
              Continue to Staff Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
