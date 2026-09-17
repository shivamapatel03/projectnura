"use client";

import React, { useState } from "react";
import { IconX, IconShieldLock, IconBackspace, IconCheck } from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

interface ManagerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onSuccess: () => void;
}

export const ManagerPinModal: React.FC<ManagerPinModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onSuccess,
}) => {
  const { verifyManagerPin, playTerminalSound, addAuditLog } = useTerminalStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setError(false);
      if (next.length === 4) {
        verify(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verify = (enteredPin: string) => {
    if (verifyManagerPin(enteredPin)) {
      playTerminalSound("success");
      addAuditLog("Manager PIN Verified", `Action: ${title}`, "security");
      setPin("");
      onSuccess();
      onClose();
    } else {
      playTerminalSound("error");
      setError(true);
      setTimeout(() => {
        setPin("");
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-xs bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <IconShieldLock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-950">Manager PIN</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold">
                AUTHORIZATION
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Reason / Title */}
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <p className="text-xs font-bold text-gray-900">{title}</p>
          {description && (
            <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
          )}
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  error
                    ? "bg-red-500 scale-110 animate-shake"
                    : filled
                    ? "bg-black scale-110"
                    : "border-2 border-gray-300 bg-white"
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-[11px] text-red-600 font-bold text-center">
            Invalid Manager PIN (Try 5678 or 1234)
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 font-mono font-bold text-base text-gray-900 transition-colors cursor-pointer border border-gray-200/60 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin("")}
            className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-500 transition-colors cursor-pointer flex items-center justify-center"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 font-mono font-bold text-base text-gray-900 transition-colors cursor-pointer border border-gray-200/60 flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer flex items-center justify-center"
          >
            <IconBackspace size={18} />
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          Manager PIN: <span className="font-mono font-bold text-gray-600">5678</span> (Priya) or <span className="font-mono font-bold text-gray-600">1234</span>
        </p>
      </div>
    </div>
  );
};
