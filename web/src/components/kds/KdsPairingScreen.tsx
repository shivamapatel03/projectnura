"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useKdsStore } from "./kdsStore";
import { IconCheck, IconDeviceTv, IconArrowRight, IconSparkles } from "@tabler/icons-react";

export const KdsPairingScreen: React.FC = () => {
  const { pairDevice, pairedDevice } = useKdsStore();
  const [deviceCode, setDeviceCode] = useState("NURA-84KF");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceCode.trim()) {
      setError("Please enter a device code");
      return;
    }
    const success = pairDevice(deviceCode);
    if (success) {
      setIsSuccess(true);
    } else {
      setError("Invalid device pairing code");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0d0f12] text-white flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-[#161a22] border border-gray-800/80 rounded-2xl p-8 shadow-2xl relative z-10">
        {!isSuccess ? (
          /* Step 1: Enter Device Code */
          <div className="space-y-6 text-center">
            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/logo/logo.png.png"
                alt="Nuradesk"
                width={36}
                height={36}
                className="w-9 h-9 object-contain brightness-0 invert [filter:brightness(0)_invert(1)]"
              />
              <h1 className="text-sm font-black tracking-widest text-gray-400 uppercase">
                NURADESK
              </h1>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Set up Kitchen Display
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter the device code generated from your Admin panel or POS
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleConnect} className="space-y-4 text-left">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Enter Device Code
                </label>
                <input
                  type="text"
                  value={deviceCode}
                  onChange={(e) => {
                    setDeviceCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="e.g. NURA-84KF"
                  autoFocus
                  className="w-full h-12 px-4 rounded-xl bg-[#0d0f12] border border-gray-700 text-center font-mono font-bold text-lg tracking-widest text-white placeholder-gray-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
                {error && (
                  <p className="text-xs text-rose-500 font-semibold mt-1 text-center">
                    {error}
                  </p>
                )}
              </div>

              {/* Quick Preset Buttons for Instant Testing */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[10px] text-gray-500 font-semibold">Demo Codes:</span>
                <button
                  type="button"
                  onClick={() => setDeviceCode("NURA-84KF")}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  NURA-84KF
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceCode("K1-KITCHEN")}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  K1-KITCHEN
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-white text-black hover:bg-gray-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md mt-4"
              >
                <span>Connect</span>
                <IconArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Connection Success */
          <div className="space-y-6 text-center animate-fadeIn">
            {/* Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <IconCheck size={32} stroke={3} />
            </div>

            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Kitchen Connected
              </h2>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                Device successfully paired to your outlet
              </p>
            </div>

            {/* Outlet Details Card */}
            <div className="bg-[#0d0f12] border border-gray-800 rounded-xl p-4 text-center space-y-1">
              <div className="font-black text-base text-white tracking-wide">
                {pairedDevice.cafeName || "Shiv Cafe"}
              </div>
              <div className="font-bold text-sm text-amber-400">
                {pairedDevice.name || "K1 — Main Kitchen"}
              </div>
              <div className="text-xs text-gray-400 font-medium">
                {pairedDevice.outlet || "Main Branch"}
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              The kitchen display will remember this pairing on this terminal.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
            >
              <span>Continue to Kitchen</span>
              <IconArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-gray-500 flex items-center gap-2">
        <span>Nuradesk KDS · Shiv Cafe Kitchen System</span>
      </div>
    </div>
  );
};
