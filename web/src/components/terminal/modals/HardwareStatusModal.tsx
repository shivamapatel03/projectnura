"use client";

import React, { useState } from "react";
import {
  IconX,
  IconPrinter,
  IconCurrencyDollar,
  IconBarcode,
  IconDeviceTv,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

interface HardwareStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareStatusModal: React.FC<HardwareStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { hardware, toggleHardware, playTerminalSound, addAuditLog } = useTerminalStore();
  const [testPrinterStatus, setTestPrinterStatus] = useState<string | null>(null);
  const [testDrawerStatus, setTestDrawerStatus] = useState<string | null>(null);
  const [testScannerStatus, setTestScannerStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestPrint = (type: "receipt" | "kot") => {
    playTerminalSound("scan");
    setTestPrinterStatus(`Printing test slip (${type.toUpperCase()})...`);
    setTimeout(() => {
      setTestPrinterStatus(`✓ ${type.toUpperCase()} test print complete`);
      addAuditLog("Printer Test", `Test slip dispatched to ${type} printer`, "security");
      setTimeout(() => setTestPrinterStatus(null), 2500);
    }, 1200);
  };

  const handleTestDrawerKick = () => {
    playTerminalSound("drawer");
    setTestDrawerStatus("Drawer pulse sent (Kicked open)");
    addAuditLog("Cash Drawer Kick", "Manual test drawer pulse sent", "cash");
    setTimeout(() => setTestDrawerStatus(null), 2000);
  };

  const handleTestScan = () => {
    playTerminalSound("scan");
    setTestScannerStatus("Barcode scan received: SKU-COF-01");
    setTimeout(() => setTestScannerStatus(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
              PERIPHERALS & HARDWARE
            </span>
            <h3 className="text-base font-extrabold text-gray-950">
              Terminal Hardware Diagnostics
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

        {/* Device Cards */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          {/* 1. Thermal Receipt Printer */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                  <IconPrinter size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-950">80mm Thermal Receipt Printer</h4>
                  <p className="text-[11px] text-gray-500 font-mono">USB / ESC-POS · Model RP-80</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleHardware("receiptPrinter")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  hardware.receiptPrinter
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {hardware.receiptPrinter ? "Connected" : "Disconnected"}
              </button>
            </div>

            {testPrinterStatus && (
              <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                {testPrinterStatus}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={!hardware.receiptPrinter}
                onClick={() => handleTestPrint("receipt")}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-800 font-semibold cursor-pointer"
              >
                Test Receipt Slip
              </button>
              <button
                type="button"
                disabled={!hardware.receiptPrinter}
                onClick={() => handleTestPrint("kot")}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-800 font-semibold cursor-pointer"
              >
                Test Kitchen KOT Ticket
              </button>
            </div>
          </div>

          {/* 2. Cash Drawer */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                  <IconCurrencyDollar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-950">RJ12 Cash Drawer</h4>
                  <p className="text-[11px] text-gray-500 font-mono">24V Solenoid Kick via Printer Port</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleHardware("cashDrawer")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  hardware.cashDrawer
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {hardware.cashDrawer ? "Connected" : "Disconnected"}
              </button>
            </div>

            {testDrawerStatus && (
              <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                ✓ {testDrawerStatus}
              </p>
            )}

            <button
              type="button"
              disabled={!hardware.cashDrawer}
              onClick={handleTestDrawerKick}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-800 font-semibold cursor-pointer"
            >
              Kick Drawer Open
            </button>
          </div>

          {/* 3. Barcode Scanner */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                  <IconBarcode size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-950">1D / 2D Barcode Scanner</h4>
                  <p className="text-[11px] text-gray-500 font-mono">USB HID Keyboard Emulation Mode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleHardware("barcodeScanner")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  hardware.barcodeScanner
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {hardware.barcodeScanner ? "Active" : "Disabled"}
              </button>
            </div>

            {testScannerStatus && (
              <p className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
                ✓ {testScannerStatus}
              </p>
            )}

            <button
              type="button"
              disabled={!hardware.barcodeScanner}
              onClick={handleTestScan}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-800 font-semibold cursor-pointer"
            >
              Simulate Barcode Scan
            </button>
          </div>

          {/* 4. Customer Display */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                <IconDeviceTv size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-950">Customer Display (CFD)</h4>
                <p className="text-[11px] text-gray-500 font-mono">Mirroring Cart Total & UPI QR</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleHardware("customerDisplay")}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                hardware.customerDisplay
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {hardware.customerDisplay ? "Online" : "Offline"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="button-20 px-6 py-2.5 !rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
