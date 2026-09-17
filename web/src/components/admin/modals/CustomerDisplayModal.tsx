"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconX,
  IconDeviceTv,
  IconCheck,
  IconQrcode,
  IconShoppingCart,
  IconSparkles,
  IconExternalLink,
  IconCoffee,
  IconReceipt,
  IconClock,
  IconHeart,
} from "@tabler/icons-react";

interface CustomerDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  outletName?: string;
  deviceName?: string;
}

type DisplayMode = "welcome" | "cart" | "upi" | "success";

export const CustomerDisplayModal: React.FC<CustomerDisplayModalProps> = ({
  isOpen,
  onClose,
  outletName = "Main Branch (Indiranagar)",
  deviceName = "CD1 — Customer Display 1",
}) => {
  const [mode, setMode] = useState<DisplayMode>("cart");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none">
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <IconDeviceTv size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight">
                  {deviceName}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Syncing · POS T1
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Customer Facing Display · {outletName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/customer-display"
              target="_blank"
              className="button-20 button-20-sm text-xs flex items-center gap-1.5 !bg-zinc-800 hover:!bg-zinc-700 !border-zinc-700"
            >
              <span>Open Standalone Screen</span>
              <IconExternalLink size={13} />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>
        </div>

        {/* State Switcher Bar (For testing display states in admin panel) */}
        <div className="px-5 py-2.5 bg-zinc-900/60 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mr-1">
              Preview Mode:
            </span>
            <button
              type="button"
              onClick={() => setMode("welcome")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === "welcome"
                  ? "bg-white text-black shadow-xs font-bold"
                  : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              1. Welcome / Idle
            </button>
            <button
              type="button"
              onClick={() => setMode("cart")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === "cart"
                  ? "bg-white text-black shadow-xs font-bold"
                  : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              2. Live Cart Ringing
            </button>
            <button
              type="button"
              onClick={() => setMode("upi")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === "upi"
                  ? "bg-white text-black shadow-xs font-bold"
                  : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              3. Dynamic UPI QR
            </button>
            <button
              type="button"
              onClick={() => setMode("success")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === "success"
                  ? "bg-emerald-500 text-black shadow-xs font-bold"
                  : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              4. Payment Done
            </button>
          </div>

          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline-block">
            Customer Display = Show
          </span>
        </div>

        {/* Display Screen Simulation Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
          {/* Simulated Tablet Bezel */}
          <div className="w-full max-w-4xl bg-black rounded-3xl p-3 sm:p-4 border-4 border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
            {/* Front Camera Dot */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" />

            {/* Tablet Screen Content */}
            <div className="bg-zinc-900 rounded-2xl overflow-hidden min-h-[440px] flex flex-col border border-zinc-800">
              {/* Screen Top Bar */}
              <div className="h-12 bg-black/60 px-5 flex items-center justify-between border-b border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                    ☕
                  </div>
                  <div>
                    <span className="font-bold text-white tracking-wide">
                      SHIV CAFE
                    </span>
                    <span className="text-[10px] text-zinc-400 ml-1.5">
                      Indiranagar
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-medium">
                  <span className="flex items-center gap-1">
                    <IconClock size={13} />
                    <span>07:28 PM</span>
                  </span>
                  <span className="bg-zinc-800 px-2.5 py-0.5 rounded-md font-mono text-zinc-300">
                    Order #1042
                  </span>
                </div>
              </div>

              {/* Mode 1: Welcome / Idle Screen */}
              {mode === "welcome" && (
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between animate-fadeIn bg-radial-gradient">
                  <div className="text-center max-w-xl mx-auto space-y-3 pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                      <IconSparkles size={14} />
                      <span>Artisanal Coffee & Oven Bakes</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Welcome to Shiv Cafe
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Please place your order at the counter. Our barista is ready to serve you!
                    </p>
                  </div>

                  {/* Cafe Specials Carousel / Promo Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
                    <div className="bg-zinc-800/70 border border-zinc-700/60 rounded-xl p-4 space-y-1.5 hover:border-zinc-600 transition-colors">
                      <div className="text-lg">☕</div>
                      <div className="font-bold text-sm text-white">
                        Specialty Roasts
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Try our single-origin pour-over and iced caramel macchiato.
                      </p>
                    </div>

                    <div className="bg-zinc-800/70 border border-zinc-700/60 rounded-xl p-4 space-y-1.5 hover:border-zinc-600 transition-colors">
                      <div className="text-lg">🥐</div>
                      <div className="font-bold text-sm text-white">
                        Fresh Bakery
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Flaky butter croissants baked fresh every 3 hours.
                      </p>
                    </div>

                    <div className="bg-zinc-800/70 border border-zinc-700/60 rounded-xl p-4 space-y-1.5 hover:border-zinc-600 transition-colors">
                      <div className="text-lg">✨</div>
                      <div className="font-bold text-sm text-white">
                        Loyalty Points
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Earn ₹1 cashback on every ₹10 spent with your phone number.
                      </p>
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 border-t border-zinc-800/60 pt-4">
                    <IconHeart size={12} className="text-rose-500 fill-rose-500" />
                    <span>Serving happiness with passion</span>
                  </div>
                </div>
              )}

              {/* Mode 2: Live Cart Ringing */}
              {mode === "cart" && (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800 animate-fadeIn">
                  {/* Left Column: Itemized Ringing Bill */}
                  <div className="md:col-span-7 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Items Ordered</span>
                        <span>Amount</span>
                      </div>

                      <div className="divide-y divide-zinc-800/60 text-sm max-h-[220px] overflow-y-auto">
                        <div className="py-2.5 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 text-xs flex items-center justify-center font-mono">
                                2×
                              </span>
                              <span>Artisan Cappuccino</span>
                            </div>
                            <div className="text-[11px] text-zinc-400 pl-7">
                              Oat Milk (+₹45) · Regular
                            </div>
                          </div>
                          <div className="font-mono font-bold text-white">
                            ₹570.00
                          </div>
                        </div>

                        <div className="py-2.5 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 text-xs flex items-center justify-center font-mono">
                                1×
                              </span>
                              <span>Classic Butter Croissant</span>
                            </div>
                            <div className="text-[11px] text-zinc-400 pl-7">
                              Warm & Toasted
                            </div>
                          </div>
                          <div className="font-mono font-bold text-white">
                            ₹160.00
                          </div>
                        </div>

                        <div className="py-2.5 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 text-xs flex items-center justify-center font-mono">
                                1×
                              </span>
                              <span>Cold Brew Reserve</span>
                            </div>
                            <div className="text-[11px] text-zinc-400 pl-7">
                              Vanilla Sweet Cream
                            </div>
                          </div>
                          <div className="font-mono font-bold text-white">
                            ₹240.00
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal & Taxes */}
                    <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span>Subtotal (4 items)</span>
                        <span className="font-mono text-zinc-200">₹970.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (5%)</span>
                        <span className="font-mono text-zinc-200">₹48.50</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Special Discount</span>
                        <span className="font-mono">-₹18.50</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                        <span>Total Due</span>
                        <span className="font-mono text-xl text-emerald-400">
                          ₹1,000.00
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Staff Greeting & Live Status */}
                  <div className="md:col-span-5 p-5 bg-zinc-950/40 flex flex-col justify-between text-center">
                    <div className="space-y-3 pt-2">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                        ☕
                      </div>
                      <div>
                        <div className="font-bold text-base text-white">
                          Ringing Order...
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Punched by Rahul Sharma (Cashier)
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-1 text-xs">
                      <div className="font-semibold text-zinc-300">
                        Dining Option
                      </div>
                      <div className="font-bold text-white text-sm">
                        Table 05 · Dine-in
                      </div>
                      <div className="text-[11px] text-zinc-500 pt-1">
                        Token #1042 will be called when ready
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMode("upi")}
                      className="button-20 button-20-sm w-full cursor-pointer text-xs font-semibold !bg-emerald-600 hover:!bg-emerald-500 !border-emerald-500"
                    >
                      Proceed to Pay ₹1,000.00 →
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 3: Dynamic UPI QR Payment */}
              {mode === "upi" && (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800 animate-fadeIn">
                  {/* Left Column: Bill Summary */}
                  <div className="md:col-span-5 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                        Invoice Summary
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        ₹1,000.00
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Shiv Cafe · Order #1042
                      </p>

                      <div className="mt-5 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2 text-xs">
                        <div className="flex justify-between text-zinc-300">
                          <span>Items Total</span>
                          <span className="font-mono">₹970.00</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Tax & Charges</span>
                          <span className="font-mono">₹30.00</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold border-t border-zinc-700 pt-1.5">
                          <span>Payable Amount</span>
                          <span className="font-mono">₹1,000.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="text-[11px] text-zinc-400">
                        Or pay with Cash / Card at terminal
                      </div>
                      <button
                        type="button"
                        onClick={() => setMode("success")}
                        className="button-20 button-20-sm w-full cursor-pointer text-xs font-semibold !bg-emerald-600 hover:!bg-emerald-500 !border-emerald-500"
                      >
                        ✓ Simulate Customer Paid
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Prominent Dynamic UPI QR */}
                  <div className="md:col-span-7 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-950/60">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Ready to Scan</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-2">
                        Scan to Pay with Any UPI App
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Amount ₹1,000 is automatically filled in
                      </p>
                    </div>

                    {/* QR Box */}
                    <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center">
                      <div className="w-44 h-44 bg-zinc-100 rounded-xl flex items-center justify-center relative p-2">
                        {/* High fidelity SVG QR pattern */}
                        <svg
                          viewBox="0 0 120 120"
                          className="w-full h-full"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Corner Squares */}
                          <rect x="10" y="10" width="30" height="30" rx="4" fill="#000" />
                          <rect x="15" y="15" width="20" height="20" rx="2" fill="#fff" />
                          <rect x="20" y="20" width="10" height="10" rx="1" fill="#000" />

                          <rect x="80" y="10" width="30" height="30" rx="4" fill="#000" />
                          <rect x="85" y="15" width="20" height="20" rx="2" fill="#fff" />
                          <rect x="90" y="20" width="10" height="10" rx="1" fill="#000" />

                          <rect x="10" y="80" width="30" height="30" rx="4" fill="#000" />
                          <rect x="15" y="85" width="20" height="20" rx="2" fill="#fff" />
                          <rect x="20" y="90" width="10" height="10" rx="1" fill="#000" />

                          {/* Data dots */}
                          <circle cx="55" cy="20" r="3" fill="#000" />
                          <circle cx="65" cy="20" r="3" fill="#000" />
                          <circle cx="55" cy="30" r="3" fill="#000" />
                          <circle cx="65" cy="35" r="3" fill="#000" />

                          <circle cx="20" cy="55" r="3" fill="#000" />
                          <circle cx="35" cy="55" r="3" fill="#000" />
                          <circle cx="25" cy="65" r="3" fill="#000" />
                          <circle cx="35" cy="65" r="3" fill="#000" />

                          <circle cx="50" cy="50" r="4" fill="#000" />
                          <circle cx="60" cy="50" r="3" fill="#000" />
                          <circle cx="70" cy="50" r="4" fill="#000" />
                          <circle cx="50" cy="60" r="3" fill="#000" />
                          <circle cx="60" cy="60" r="4" fill="#000" />
                          <circle cx="70" cy="60" r="3" fill="#000" />
                          <circle cx="50" cy="70" r="4" fill="#000" />
                          <circle cx="60" cy="70" r="3" fill="#000" />
                          <circle cx="70" cy="70" r="4" fill="#000" />

                          <circle cx="90" cy="55" r="3" fill="#000" />
                          <circle cx="100" cy="60" r="3" fill="#000" />
                          <circle cx="85" cy="65" r="3" fill="#000" />
                          <circle cx="95" cy="70" r="3" fill="#000" />

                          <circle cx="55" cy="90" r="3" fill="#000" />
                          <circle cx="65" cy="95" r="3" fill="#000" />
                          <circle cx="55" cy="100" r="3" fill="#000" />
                          <circle cx="85" cy="90" r="3" fill="#000" />
                          <circle cx="95" cy="95" r="3" fill="#000" />
                          <circle cx="90" cy="105" r="3" fill="#000" />
                          <circle cx="100" cy="105" r="3" fill="#000" />
                        </svg>

                        {/* Center Icon badge */}
                        <div className="absolute w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-[10px] font-black text-black">
                          ₹
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-gray-900 mt-1">
                        shivcafe@icici
                      </span>
                    </div>

                    {/* Supported Apps Chips */}
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span className="bg-zinc-800 px-2 py-0.5 rounded font-medium">
                        Google Pay
                      </span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded font-medium">
                        PhonePe
                      </span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded font-medium">
                        Paytm
                      </span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded font-medium">
                        BHIM
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 4: Payment Done / Thank You */}
              {mode === "success" && (
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-5 animate-fadeIn">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center">
                    <IconCheck size={44} className="stroke-[2.5]" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                      Payment Received
                    </span>
                    <h2 className="text-3xl font-black text-white">
                      ₹1,000.00
                    </h2>
                    <p className="text-sm text-zinc-300">
                      Thank you for dining at Shiv Cafe!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/80 max-w-sm w-full space-y-2 text-xs text-left">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Token Number</span>
                      <span className="font-mono font-bold text-white text-sm">
                        #1042
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Transaction ID</span>
                      <span className="font-mono text-zinc-300">
                        UPI/8492049102
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Digital Receipt</span>
                      <span className="text-emerald-400 font-medium">
                        Sent via SMS
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMode("welcome")}
                    className="button-20 button-20-sm cursor-pointer text-xs font-semibold"
                  >
                    Reset to Welcome Screen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Hardware: HDMI / Dual Display linked to Counter POS</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="button-20 button-20-sm text-xs cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
