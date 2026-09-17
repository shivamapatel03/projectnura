"use client";

import React, { useState } from "react";
import { IconX, IconTag, IconTicket, IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { useTerminalStore } from "../terminalStore";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestManagerPin: (discountValue: number, callback: () => void) => void;
}

const PROMO_CODES: { [code: string]: { label: string; type: "percent" | "flat"; value: number } } = {
  COFFEE10: { label: "Coffee Special (10% OFF)", type: "percent", value: 10 },
  FLAT50: { label: "Flat ₹50 Instant Voucher", type: "flat", value: 50 },
  STAFF25: { label: "Staff & Partner 25% OFF (Requires Manager)", type: "percent", value: 25 },
  WELCOME: { label: "Welcome Cafe Treat (Flat ₹100 OFF)", type: "flat", value: 100 },
};

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  onRequestManagerPin,
}) => {
  const { subtotal, discountAmount, setDiscountAmount, addAuditLog } = useTerminalStore();
  const [discountType, setDiscountType] = useState<"percent" | "flat" | "coupon">("percent");
  const [percentValue, setPercentValue] = useState<number>(10);
  const [flatValue, setFlatValue] = useState<number>(50);
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<{ label: string; amount: number } | null>(null);
  const [promoError, setPromoError] = useState<string>("");

  if (!isOpen) return null;

  // Calculate calculated discount
  let computedDiscount = 0;
  if (discountType === "percent") {
    computedDiscount = Math.round((subtotal * percentValue) / 100);
  } else if (discountType === "flat") {
    computedDiscount = Math.min(flatValue, subtotal);
  } else if (discountType === "coupon" && promoApplied) {
    computedDiscount = promoApplied.amount;
  }

  const effectiveTotal = Math.max(0, subtotal - computedDiscount);
  const isHighDiscount =
    (discountType === "percent" && percentValue > 20) ||
    computedDiscount > 200 ||
    (promoApplied && promoApplied.amount > 200);

  const handleApplyPromoCode = () => {
    setPromoError("");
    const cleaned = promoCodeInput.trim().toUpperCase();
    const promo = PROMO_CODES[cleaned];
    if (promo) {
      const amt =
        promo.type === "percent"
          ? Math.round((subtotal * promo.value) / 100)
          : Math.min(promo.value, subtotal);
      setPromoApplied({ label: promo.label, amount: amt });
    } else {
      setPromoError("Invalid or expired coupon code. Try COFFEE10 or FLAT50.");
    }
  };

  const handleApply = () => {
    if (isHighDiscount) {
      // Prompt for Manager PIN verification
      onRequestManagerPin(computedDiscount, () => {
        setDiscountAmount(computedDiscount);
        addAuditLog(
          "Discount Applied",
          `₹${computedDiscount} discount approved with Manager authorization (Subtotal: ₹${subtotal})`,
          "security"
        );
        onClose();
      });
      return;
    }

    setDiscountAmount(computedDiscount);
    addAuditLog(
      "Discount Applied",
      `₹${computedDiscount} discount applied (${discountType} mode)`,
      "sale"
    );
    onClose();
  };

  const handleRemoveDiscount = () => {
    setDiscountAmount(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
              PROMOTIONS & DISCOUNTS
            </span>
            <h3 className="text-base font-extrabold text-gray-950">
              Apply Order Discount
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

        {/* Current Order Quick Summary */}
        <div className="bg-gray-50/80 px-6 py-2.5 border-b border-gray-200 flex justify-between items-center text-xs shrink-0">
          <span className="text-gray-500 font-medium">Cart Subtotal:</span>
          <span className="font-mono font-black text-gray-950 text-sm">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        {/* Tabs & Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setDiscountType("percent")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                discountType === "percent"
                  ? "bg-white text-black shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              % Percentage
            </button>
            <button
              type="button"
              onClick={() => setDiscountType("flat")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                discountType === "flat"
                  ? "bg-white text-black shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              ₹ Flat Amount
            </button>
            <button
              type="button"
              onClick={() => setDiscountType("coupon")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                discountType === "coupon"
                  ? "bg-white text-black shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Coupon Code
            </button>
          </div>

          {/* TAB 1: Percentage */}
          {discountType === "percent" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20, 25, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPercentValue(pct)}
                    className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      percentValue === pct
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">
                  Custom Percentage
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={percentValue}
                  onChange={(e) => setPercentValue(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-full h-10 px-3 border border-gray-300 rounded-xl text-xs font-mono font-bold outline-none focus:border-black"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Flat Amount */}
          {discountType === "flat" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="grid grid-cols-4 gap-2">
                {[20, 50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFlatValue(amt)}
                    className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      flatValue === amt
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">
                  Custom Rupee Discount (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  max={subtotal}
                  value={flatValue}
                  onChange={(e) => setFlatValue(Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 px-3 border border-gray-300 rounded-xl text-xs font-mono font-bold outline-none focus:border-black"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Coupon Codes */}
          {discountType === "coupon" && (
            <div className="space-y-3 animate-fadeIn text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code: COFFEE10 or FLAT50"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 h-10 px-3 border border-gray-300 rounded-xl uppercase font-mono font-bold text-xs outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleApplyPromoCode}
                  className="px-4 h-10 rounded-xl bg-black text-white font-bold text-xs cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {promoError && (
                <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>
              )}

              {promoApplied && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconCheck size={16} className="text-emerald-700" />
                    <span className="font-bold text-xs">{promoApplied.label}</span>
                  </div>
                  <span className="font-mono font-bold text-xs">-₹{promoApplied.amount}</span>
                </div>
              )}

              <div className="text-[11px] text-gray-400 space-y-1 pt-1">
                <p>Available Demo Codes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(PROMO_CODES).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setPromoCodeInput(c);
                        const promo = PROMO_CODES[c];
                        const amt =
                          promo.type === "percent"
                            ? Math.round((subtotal * promo.value) / 100)
                            : Math.min(promo.value, subtotal);
                        setPromoApplied({ label: promo.label, amount: amt });
                        setPromoError("");
                      }}
                      className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px] font-bold cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* High Discount Warning */}
          {isHighDiscount && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
              <IconAlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Manager Authorization Required</span>
                <span className="text-[11px] text-amber-800">
                  Discounts greater than 20% or ₹200 require Manager PIN verification.
                </span>
              </div>
            </div>
          )}

          {/* Discount Summary Card */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Original Subtotal:</span>
              <span className="font-mono">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Discount Savings:</span>
              <span className="font-mono">-₹{computedDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-950 font-black text-sm pt-1 border-t border-gray-200">
              <span>New Taxable Amount:</span>
              <span className="font-mono">₹{effectiveTotal.toLocaleString()}</span>
            </div>
          </div>

          </div>

          {/* Action Buttons Pinned Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/70 flex gap-2 shrink-0">
            {discountAmount > 0 && (
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="px-3 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold cursor-pointer"
              >
                Remove Discount
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="button-20 flex-1 py-2.5 !rounded-xl text-xs font-semibold cursor-pointer"
            >
              Apply Discount
            </button>
          </div>
        </div>
      </div>
  );
};
