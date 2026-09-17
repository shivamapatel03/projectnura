"use client";

import React, { useState } from "react";
import { IconLock, IconAlertCircle, IconBackspace } from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

export const LockScreen: React.FC = () => {
  const { pairedDevice, currentUser, unlockTerminal, switchUser } = useTerminalStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin("");
    setError(null);
  };

  const handleUnlock = () => {
    if (pin.length !== 4) {
      setError("Enter 4-digit PIN");
      return;
    }
    const success = unlockTerminal(pin);
    if (!success) {
      setError("Incorrect PIN. Try 1234");
      setPin("");
    }
  };

  // Auto unlock on 4 digits
  React.useEffect(() => {
    if (pin.length === 4) {
      handleUnlock();
    }
  }, [pin]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e11]/95 backdrop-blur-md flex items-center justify-center p-4 antialiased text-white font-sans animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 text-center">
        {/* Header */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-zinc-800 text-white flex items-center justify-center border border-zinc-700">
            <IconLock size={22} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-wider uppercase text-zinc-200">
              TERMINAL LOCKED
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {pairedDevice.code} · {pairedDevice.outlet}
            </p>
          </div>
          {currentUser && (
            <p className="text-xs font-semibold text-zinc-300">
              User: <span className="text-white">{currentUser.name}</span>
            </p>
          )}
        </div>

        {/* PIN Dots */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  pin.length > index
                    ? "bg-white border-white scale-110"
                    : "bg-zinc-800 border-zinc-600"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-400 text-xs flex items-center justify-center gap-1">
              <IconAlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Touch Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num.toString())}
              className="h-12 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-lg font-bold text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-zinc-800/40 hover:bg-zinc-700/60 text-[11px] font-bold text-zinc-400 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-lg font-bold text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-zinc-800/40 hover:bg-zinc-700/60 text-zinc-300 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Backspace"
          >
            <IconBackspace size={18} />
          </button>
        </div>

        <div className="pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={switchUser}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            ↪ Switch to another user
          </button>
        </div>
      </div>
    </div>
  );
};
