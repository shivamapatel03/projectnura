"use client";

import React, { useState } from "react";
import { IconX, IconCheck, IconCash, IconAlertTriangle } from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeShift, closeShift, pairedDevice } = useTerminalStore();
  const [countedCash, setCountedCash] = useState<number>(
    activeShift ? activeShift.openingCash + activeShift.cashSales + activeShift.cashIn - activeShift.cashOut : 0
  );
  const [closedSummary, setClosedSummary] = useState<{ expected: number; counted: number; diff: number } | null>(null);

  if (!isOpen || !activeShift) return null;

  const totalSales = activeShift.cashSales + activeShift.upiSales + activeShift.cardSales + activeShift.walletSales;
  const expectedCash = activeShift.openingCash + activeShift.cashSales + activeShift.cashIn - activeShift.cashOut - activeShift.cashRefunds;
  const diff = countedCash - expectedCash;

  const handleConfirmClose = () => {
    const res = closeShift(countedCash);
    setClosedSummary(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {!closedSummary ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <span className="text-[11px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
                  END OF SHIFT
                </span>
                <h3 className="text-base font-bold text-gray-950">
                  Close Shift & Reconcile
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Shift Breakdown */}
            <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Cashier / Staff:</span>
                  <span className="font-bold text-gray-950">{activeShift.staffName}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Terminal:</span>
                  <span className="font-mono font-bold text-gray-950">{pairedDevice.code}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Opening Cash:</span>
                  <span>₹{activeShift.openingCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                  <span>Gross Shift Sales:</span>
                  <span>₹{totalSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 pl-3">
                  <span>• Cash Sales:</span>
                  <span>₹{activeShift.cashSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 pl-3">
                  <span>• UPI Digital:</span>
                  <span>₹{activeShift.upiSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 pl-3">
                  <span>• Card:</span>
                  <span>₹{activeShift.cardSales.toLocaleString()}</span>
                </div>
              </div>

              {/* Cash Reconciliation */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex justify-between font-bold text-sm text-gray-900">
                  <span>Expected Cash in Drawer:</span>
                  <span>₹{expectedCash.toLocaleString()}</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    Counted Physical Cash
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={countedCash}
                      onChange={(e) => setCountedCash(Number(e.target.value))}
                      className="w-full h-10 pl-7 pr-3 rounded-lg border border-gray-300 bg-white font-bold text-sm text-gray-950 outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs font-bold">
                  <span>Cash Difference:</span>
                  <span
                    className={
                      diff === 0
                        ? "text-emerald-700 font-bold"
                        : diff > 0
                        ? "text-blue-700"
                        : "text-red-600"
                    }
                  >
                    {diff === 0 ? "₹0 (Balanced)" : diff > 0 ? `+₹${diff} (Over)` : `-₹${Math.abs(diff)} (Short)`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmClose}
                className="button-20 w-full h-11 !rounded-xl text-xs font-semibold cursor-pointer"
              >
                Confirm & Close Shift
              </button>
            </div>
          </>
        ) : (
          /* Shift Closed Confirmation */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fadeIn overflow-y-auto flex-1">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
              <IconCheck size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-950">
                ✓ SHIFT CLOSED
              </h3>
              <p className="text-xs text-gray-500">
                Shift report recorded and reconciled
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Shift ID:</span>
                <span className="font-mono font-bold text-gray-950">{activeShift.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Counted:</span>
                <span className="font-bold text-gray-950">₹{closedSummary.counted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difference:</span>
                <span className="font-bold text-gray-950">₹{closedSummary.diff}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setClosedSummary(null);
                onClose();
              }}
              className="button-20 w-full h-11 !rounded-xl text-xs font-semibold cursor-pointer"
            >
              Done (Return to Login)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
