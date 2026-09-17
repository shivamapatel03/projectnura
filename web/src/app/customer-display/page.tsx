"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconDeviceTv,
  IconCheck,
  IconSparkles,
  IconClock,
  IconHeart,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";

type DisplayState = "welcome" | "cart" | "upi" | "success";

export default function CustomerDisplayPage() {
  const [mode, setMode] = useState<DisplayState>("cart");
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white font-sans flex flex-col justify-between select-none overflow-hidden">
      {/* Top Brand Bar */}
      <header className="h-16 px-6 sm:px-10 bg-black/80 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg font-black">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                SHIV CAFE
              </h1>
              <span className="text-[11px] font-semibold text-zinc-400">
                · Main Branch
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Customer Facing Screen (CD1) · Counter POS 1 Linked
            </p>
          </div>
        </div>

        {/* Right time & controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <IconClock size={14} className="text-zinc-500" />
            <span>{timeStr || "07:30 PM"}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMode("welcome")}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                mode === "welcome"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Welcome
            </button>
            <button
              type="button"
              onClick={() => setMode("cart")}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                mode === "cart"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Cart
            </button>
            <button
              type="button"
              onClick={() => setMode("upi")}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                mode === "upi"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              UPI QR
            </button>
            <button
              type="button"
              onClick={() => setMode("success")}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                mode === "success"
                  ? "bg-emerald-500 text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Paid
            </button>
          </div>

          <Link
            href="/admin"
            className="button-20 button-20-sm text-xs flex items-center gap-1.5 !bg-zinc-900 hover:!bg-zinc-800 !border-zinc-800"
          >
            <IconArrowLeft size={13} />
            <span>Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 flex items-center justify-center">
        {mode === "welcome" && (
          <div className="max-w-3xl w-full text-center space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold tracking-wide uppercase">
              <IconSparkles size={16} />
              <span>Specialty Coffee & Artisan Bakes</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                Welcome to Shiv Cafe
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto">
                Please place your order at the counter. Our baristas are crafting your favorite brew.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="text-2xl">☕</div>
                <h3 className="font-bold text-white text-base">Signature Roasts</h3>
                <p className="text-xs text-zinc-400">
                  Try our iced caramel macchiato or artisan cappuccino with organic oat milk.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="text-2xl">🥐</div>
                <h3 className="font-bold text-white text-base">Oven Fresh</h3>
                <p className="text-xs text-zinc-400">
                  Warm almond croissants, sourdough toasts, and fudge brownies fresh every morning.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="text-2xl">🎁</div>
                <h3 className="font-bold text-white text-base">Nura Rewards</h3>
                <p className="text-xs text-zinc-400">
                  Earn points on every order. Ask cashier to link your phone number!
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "cart" && (
          <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 animate-fadeIn">
            {/* Left Items Column */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <span>Current Order (#1042)</span>
                  <span>Price</span>
                </div>

                <div className="divide-y divide-zinc-800/80 my-3">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base text-white flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center font-mono">
                          2×
                        </span>
                        <span>Artisan Cappuccino</span>
                      </div>
                      <div className="text-xs text-zinc-400 pl-8.5 mt-0.5">
                        Oat Milk (+₹45) · Large 360ml
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-base">
                      ₹570.00
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base text-white flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center font-mono">
                          1×
                        </span>
                        <span>Classic Butter Croissant</span>
                      </div>
                      <div className="text-xs text-zinc-400 pl-8.5 mt-0.5">
                        Warmed & Flaky
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-base">
                      ₹160.00
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base text-white flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center font-mono">
                          1×
                        </span>
                        <span>Cold Brew Reserve</span>
                      </div>
                      <div className="text-xs text-zinc-400 pl-8.5 mt-0.5">
                        Steeped 18 hours · Vanilla Sweet Cream
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-base">
                      ₹240.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-zinc-800 space-y-2 text-sm text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal (4 items)</span>
                  <span className="font-mono text-zinc-200">₹970.00</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono text-zinc-200">₹48.50</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Promotion Discount</span>
                  <span className="font-mono">-₹18.50</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="font-mono text-3xl font-black text-emerald-400">
                    ₹1,000.00
                  </span>
                </div>
              </div>
            </div>

            {/* Right Status Column */}
            <div className="md:col-span-5 p-6 sm:p-8 bg-zinc-950/60 flex flex-col justify-between text-center">
              <div className="space-y-4 pt-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl">
                  ☕
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Preparing Bill...
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cashier: Rahul Sharma · Table 05 (Dine-in)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-500">
                  Next Step
                </span>
                <p className="text-xs text-zinc-300">
                  Staff will prompt you to scan UPI QR or insert your Card.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMode("upi")}
                className="button-20 w-full text-sm font-semibold !bg-emerald-600 hover:!bg-emerald-500 !border-emerald-500"
              >
                Scan to Pay with UPI →
              </button>
            </div>
          </div>
        )}

        {mode === "upi" && (
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 animate-fadeIn">
            {/* Left summary */}
            <div className="md:col-span-5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Payable Amount
                </span>
                <h3 className="text-4xl font-black text-white mt-1">
                  ₹1,000.00
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Shiv Cafe · Order Token #1042
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Items (4 items)</span>
                    <span className="font-mono">₹970.00</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>GST (5%)</span>
                    <span className="font-mono">₹30.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-zinc-700 pt-2">
                    <span>Total Due</span>
                    <span className="font-mono text-sm">₹1,000.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <p className="text-xs text-zinc-400">
                  Or pay with Cash / Card at terminal
                </p>
                <button
                  type="button"
                  onClick={() => setMode("success")}
                  className="button-20 button-20-sm w-full text-xs font-semibold !bg-emerald-600 hover:!bg-emerald-500 !border-emerald-500"
                >
                  ✓ Simulate Payment Done
                </button>
              </div>
            </div>

            {/* Right QR */}
            <div className="md:col-span-7 p-8 flex flex-col items-center justify-center text-center space-y-5 bg-zinc-950/60">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Dynamic QR Ready</span>
                </div>
                <h4 className="text-xl font-bold text-white pt-2">
                  Scan to Pay ₹1,000.00
                </h4>
                <p className="text-xs text-zinc-400">
                  Open Google Pay, PhonePe, Paytm, or BHIM
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
                <div className="w-52 h-52 bg-zinc-100 rounded-2xl flex items-center justify-center relative p-3">
                  <svg
                    viewBox="0 0 120 120"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="10" y="10" width="30" height="30" rx="4" fill="#000" />
                    <rect x="15" y="15" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="20" y="20" width="10" height="10" rx="1" fill="#000" />

                    <rect x="80" y="10" width="30" height="30" rx="4" fill="#000" />
                    <rect x="85" y="15" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="90" y="20" width="10" height="10" rx="1" fill="#000" />

                    <rect x="10" y="80" width="30" height="30" rx="4" fill="#000" />
                    <rect x="15" y="85" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="20" y="90" width="10" height="10" rx="1" fill="#000" />

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

                  <div className="absolute w-9 h-9 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-xs font-black text-black">
                    ₹
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-gray-900 mt-2">
                  shivcafe@icici
                </span>
              </div>

              {/* Supported payment badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
                <span className="bg-zinc-800 px-3 py-1 rounded-lg font-medium">
                  Google Pay
                </span>
                <span className="bg-zinc-800 px-3 py-1 rounded-lg font-medium">
                  PhonePe
                </span>
                <span className="bg-zinc-800 px-3 py-1 rounded-lg font-medium">
                  Paytm
                </span>
                <span className="bg-zinc-800 px-3 py-1 rounded-lg font-medium">
                  BHIM
                </span>
              </div>
            </div>
          </div>
        )}

        {mode === "success" && (
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 animate-fadeIn shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
              <IconCheck size={52} className="stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                Payment Successful
              </span>
              <h2 className="text-4xl font-black text-white">
                ₹1,000.00
              </h2>
              <p className="text-sm text-zinc-400">
                Thank you for visiting Shiv Cafe!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Your Order Token</span>
                <span className="font-mono font-black text-white text-base">
                  #1042
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Pickup Location</span>
                <span className="font-bold text-white">Counter Station</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Digital Receipt</span>
                <span className="text-emerald-400 font-semibold">
                  Sent to +91 98450 •••••
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMode("welcome")}
              className="button-20 w-full text-xs font-semibold cursor-pointer"
            >
              Done / Return to Welcome Screen
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-12 px-6 sm:px-10 bg-black/80 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Customer Display CD1 · Online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconHeart size={12} className="text-rose-500 fill-rose-500" />
          <span>Powered by Nuradesk POS</span>
        </div>
      </footer>
    </div>
  );
}
