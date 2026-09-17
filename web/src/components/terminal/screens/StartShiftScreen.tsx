"use client";

import React, { useState } from "react";
import { IconCash, IconClock, IconUser, IconDeviceDesktop } from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

export const StartShiftScreen: React.FC = () => {
  const { currentUser, pairedDevice, startShift, logout } = useTerminalStore();
  const [openingCash, setOpeningCash] = useState<number>(5000);

  const quickAmounts = [2000, 5000, 10000, 15000];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startShift(openingCash);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 antialiased text-gray-950 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[11px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
              Shift Setup
            </span>
            <h1 className="text-xl font-black text-gray-950">
              START SHIFT
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs font-semibold text-gray-500 hover:text-black cursor-pointer"
          >
            Switch User
          </button>
        </div>

        {/* Staff & Terminal Info Card */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5">
              <IconUser size={15} />
              <span>Staff</span>
            </span>
            <span className="font-bold text-gray-950">
              {currentUser.name} ({currentUser.role})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5">
              <IconDeviceDesktop size={15} />
              <span>Terminal</span>
            </span>
            <span className="font-bold font-mono text-gray-950">
              {pairedDevice.code} · {pairedDevice.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5">
              <IconClock size={15} />
              <span>Start Time</span>
            </span>
            <span className="font-medium text-gray-700">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Opening Cash Input */}
        <form onSubmit={handleStart} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Opening Cash in Drawer
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base font-bold text-gray-500">₹</span>
              <input
                type="number"
                value={openingCash}
                onChange={(e) => setOpeningCash(Number(e.target.value))}
                min={0}
                step={100}
                className="w-full h-12 pl-9 pr-4 rounded-xl border border-gray-300 bg-white font-bold text-lg text-gray-950 focus:border-black outline-none transition-colors"
              />
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-2 pt-1">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setOpeningCash(amt)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    openingCash === amt
                      ? "bg-black border-black text-white"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="button-20 w-full h-12 !rounded-xl text-sm font-semibold cursor-pointer"
          >
            Start Shift
          </button>
        </form>
      </div>
    </div>
  );
};
