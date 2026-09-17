"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconUser, IconLock, IconArrowLeft, IconAlertCircle, IconBackspace } from "@tabler/icons-react";
import { useTerminalStore, TerminalStaff } from "../terminalStore";

export const StaffLoginScreen: React.FC = () => {
  const { staffList, loginWithPin, pairedDevice } = useTerminalStore();
  const [selectedStaff, setSelectedStaff] = useState<TerminalStaff | null>(null);
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedStaff) return;
    if (pin.length !== 4) {
      setError("Please enter 4-digit PIN");
      return;
    }
    const success = loginWithPin(selectedStaff.id, pin);
    if (!success) {
      setError("Incorrect PIN. Try 1234");
      setPin("");
    }
  };

  // Auto-submit when 4 digits are typed
  React.useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 antialiased text-gray-950 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logo.png.png"
              alt="Nuradesk"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="text-[11px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
                {pairedDevice.code} · {pairedDevice.outlet}
              </span>
              <h1 className="text-lg font-bold text-gray-950">
                {selectedStaff ? selectedStaff.name : "Who's using this terminal?"}
              </h1>
            </div>
          </div>
          {selectedStaff && (
            <button
              type="button"
              onClick={() => {
                setSelectedStaff(null);
                setPin("");
                setError(null);
              }}
              className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
            >
              <IconArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}
        </div>

        {!selectedStaff ? (
          /* Staff Selection Cards */
          <div className="grid grid-cols-1 gap-3">
            {staffList.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => setSelectedStaff(staff)}
                className="w-full p-4 rounded-xl border border-gray-200 hover:border-black bg-white hover:bg-gray-50/80 flex items-center gap-3.5 transition-all text-left cursor-pointer group"
              >
                <div
                  className={`w-11 h-11 rounded-full ${staff.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                >
                  {staff.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-950 truncate">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {staff.role}
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-black">
                  Select →
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Touch-Friendly PIN Pad */
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center space-y-3">
              <p className="text-xs font-semibold text-gray-500">
                Enter your 4-digit PIN
              </p>

              {/* PIN Dots */}
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      pin.length > index
                        ? "bg-black border-black scale-110"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center justify-center gap-1.5 animate-shake">
                  <IconAlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-14 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-lg font-bold text-gray-900 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-14 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-600 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress("0")}
                className="h-14 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-lg font-bold text-gray-900 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
                aria-label="Backspace"
              >
                <IconBackspace size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit()}
              className="button-20 w-full h-11 !rounded-xl text-xs font-semibold cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
