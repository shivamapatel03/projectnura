"use client";

import React, { useState } from "react";
import {
  IconX,
  IconCash,
  IconQrcode,
  IconCreditCard,
  IconColumns,
  IconCheck,
  IconAlertTriangle,
  IconRefresh,
  IconDeviceTv,
} from "@tabler/icons-react";
import { PaymentMethod } from "@/components/admin/types";
import { useTerminalStore } from "../terminalStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { total, completeSale, playTerminalSound } = useTerminalStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("Cash");
  const [cashTendered, setCashTendered] = useState<number>(total);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentFailed, setPaymentFailed] = useState<boolean>(false);
  const [failureReason, setFailureReason] = useState<string>("");
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  // Split state
  const [splitWays, setSplitWays] = useState<number>(2);
  const [splitCash, setSplitCash] = useState<number>(Math.round(total / 2));

  if (!isOpen) return null;

  const change = Math.max(0, cashTendered - total);
  const isCashSufficient = cashTendered >= total;

  const handleCashTender = (amt: number) => {
    setCashTendered(amt);
  };

  const handleEqualSplit = (ways: number) => {
    setSplitWays(ways);
    const portion = Math.round(total / ways);
    setSplitCash(portion);
  };

  const handleComplete = () => {
    if (selectedMethod === "Cash" && !isCashSufficient) return;

    setIsProcessing(true);
    setPaymentFailed(false);

    setTimeout(() => {
      // If user toggled simulate failure for Card/UPI
      if (simulateFailure && (selectedMethod === "Card" || selectedMethod === "UPI")) {
        setIsProcessing(false);
        setPaymentFailed(true);
        playTerminalSound("error");
        setFailureReason(
          selectedMethod === "Card"
            ? "Card Issuer Declined: Insufficient Funds / PIN Timeout [ERR_504]"
            : "UPI Gateway Timeout: Bank server not responding [ERR_UPI_408]"
        );
        return;
      }

      setIsProcessing(false);
      playTerminalSound("success");
      const order = completeSale(selectedMethod, cashTendered);
      onPaymentSuccess(order);
    }, 850);
  };

  const handleRetry = () => {
    setPaymentFailed(false);
    setSimulateFailure(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
              CHECKOUT & SETTLEMENT
            </span>
            <h3 className="text-base font-extrabold text-gray-950">
              Select Payment Method
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

        {/* Total Banner */}
        <div className="bg-gray-50/90 border-b border-gray-200 py-3.5 px-6 text-center shrink-0">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Total Amount Due
          </p>
          <p className="text-2xl sm:text-3xl font-black text-gray-950 mt-0.5 font-mono">
            ₹{total.toLocaleString()}
          </p>
        </div>

        {/* Failed State Screen */}
        {paymentFailed ? (
          <div className="p-6 space-y-4 text-center animate-fadeIn flex-1 overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <IconAlertTriangle size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-950">
                Payment Failed
              </h4>
              <p className="text-xs text-red-600 font-medium px-4">
                {failureReason}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 text-left space-y-1">
              <p className="font-bold text-gray-900">Troubleshooting options:</p>
              <p>• Verify the card has sufficient balance or swipe again.</p>
              <p>• Switch to Cash or generate a new UPI QR code.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentFailed(false);
                  setSelectedMethod("Cash");
                  setSimulateFailure(false);
                }}
                className="py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 cursor-pointer"
              >
                Pay with Cash
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className="button-20 py-2.5 px-4 !rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <IconRefresh size={15} />
                <span>Retry Payment</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Payment Tabs & Details */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Tabs */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "Cash", label: "Cash", icon: IconCash },
                { id: "UPI", label: "UPI QR", icon: IconQrcode },
                { id: "Card", label: "Card", icon: IconCreditCard },
                { id: "Split", label: "Split", icon: IconColumns },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedMethod === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(tab.id as PaymentMethod);
                      setPaymentFailed(false);
                    }}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black text-white border-black shadow-xs scale-102"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-bold">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Failure Toggle (for QA and Verification) */}
            {(selectedMethod === "Card" || selectedMethod === "UPI") && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-medium text-[11px]">
                  Simulate Bank Gateway Decline / Timeout
                </span>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </div>
            )}

            {/* CASH TAB */}
            {selectedMethod === "Cash" && (
              <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-200 animate-fadeIn text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Cash Received from Customer
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-base font-bold text-gray-500 font-mono">₹</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(Number(e.target.value))}
                      min={0}
                      className="w-full h-11 pl-8 pr-3 rounded-xl border border-gray-300 bg-white font-mono font-bold text-base text-gray-950 outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Quick Cash Suggestions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCashTender(total)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 font-bold text-gray-800 text-xs cursor-pointer"
                  >
                    Exact (₹{total})
                  </button>
                  {[500, 1000, 2000].map((amt) => {
                    if (amt < total && total > 500) return null;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleCashTender(amt)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 font-bold text-gray-800 text-xs cursor-pointer"
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                </div>

                {/* Change Calculation */}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-sm font-bold">
                  <span className="text-gray-600">Change Due to Customer:</span>
                  <span className={`text-base font-mono font-black ${change > 0 ? "text-emerald-700" : "text-gray-900"}`}>
                    ₹{change.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* UPI QR TAB */}
            {selectedMethod === "UPI" && (
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-3 animate-fadeIn">
                <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-xl border border-gray-300 flex flex-col items-center justify-center shadow-xs">
                  <div className="w-full h-full bg-zinc-950 rounded-xl p-2 flex flex-col items-center justify-center text-white text-[10px] font-mono leading-tight">
                    <IconQrcode size={64} className="text-white" />
                    <span className="text-[9px] text-zinc-300 mt-1">SCAN TO PAY</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-900">
                    Displaying Dynamic QR on Secondary Display
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    VPA: shivcafe@icici · Amount: ₹{total}
                  </p>
                </div>
              </div>
            )}

            {/* CARD TAB */}
            {selectedMethod === "Card" && (
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-2.5 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-700">
                  <IconCreditCard size={28} />
                </div>
                <p className="text-sm font-bold text-gray-900">
                  Swipe, Insert or Tap Card on Terminal
                </p>
                <p className="text-xs text-gray-500">
                  Supporting Visa, Mastercard, RuPay & Amex contactless
                </p>
              </div>
            )}

            {/* SPLIT TAB */}
            {selectedMethod === "Split" && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3.5 animate-fadeIn text-xs">
                {/* Equal Split Quick Presets */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600 block">Equal Split Between Guests</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 3, 4].map((ways) => (
                      <button
                        key={ways}
                        type="button"
                        onClick={() => handleEqualSplit(ways)}
                        className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                          splitWays === ways
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {ways}-Way (₹{Math.round(total / ways)})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Split Breakdown */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between font-bold">
                    <span>Part 1: Cash Paid</span>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={(e) => setSplitCash(Math.min(total, Math.max(0, Number(e.target.value))))}
                      max={total}
                      className="w-28 h-9 px-2 border border-gray-300 rounded-xl text-right font-mono font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between font-bold text-gray-700">
                    <span>Part 2: UPI / Digital Card Balance</span>
                    <span className="font-mono text-sm text-black">
                      ₹{Math.max(0, total - splitCash).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            </div>

            {/* Complete Payment Pinned Footer */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
              <button
                type="button"
                onClick={handleComplete}
                disabled={
                  (selectedMethod === "Cash" && !isCashSufficient) ||
                  isProcessing
                }
                className="button-20 w-full h-11 sm:h-12 !rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Complete Payment — ₹{total.toLocaleString()}</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
