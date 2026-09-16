import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Store,
  Terminal,
  ShoppingBag,
  Users,
  Settings,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Receipt,
  Sparkles,
  Layers,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Nuradesk",
  description: "Manage your stores, terminals, inventory, and POS operations.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 flex flex-col selection:bg-black selection:text-white">
      {/* Admin Navbar */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <Image
                  src="/logo/logo.png.png"
                  alt="Nuradesk"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="relative w-24 h-6 flex items-center">
                <Image
                  src="/logo/text.png"
                  alt="Nuradesk"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-black text-white text-[11px] font-semibold tracking-wide">
              ADMIN PORTAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding"
              className="h-9 px-4 rounded-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={14} />
              <span>Resume Onboarding</span>
            </Link>

            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
              Welcome to the Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Your store setup and POS terminals are connected. Manage live registers and catalog below.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/onboarding"
              className="button-20 h-10 px-5 !rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <Layers size={15} />
              <span>Launch 10-Step Onboarding &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">Today's Sales</span>
              <DollarSign size={16} />
            </div>
            <div className="text-2xl font-bold text-gray-950">$0.00</div>
            <div className="text-[11px] text-gray-500 mt-1">Store awaiting first order</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">Active Terminals</span>
              <Terminal size={16} />
            </div>
            <div className="text-2xl font-bold text-gray-950">1 Online</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Terminal 1 connected</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">Menu / Catalog</span>
              <ShoppingBag size={16} />
            </div>
            <div className="text-2xl font-bold text-gray-950">Draft</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Setup in onboarding</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">Security Status</span>
              <ShieldAlert size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-950">2FA Active</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">TOTP Authenticator enabled</div>
          </div>
        </div>

        {/* Onboarding Banner Card */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
              <Sparkles size={13} className="text-yellow-400" />
              <span>Step 1 of 10 in Progress</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Complete POS Onboarding to start processing transactions
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Configure your terminal hardware, customize receipt printing, set tax categories, and create staff pins in 3-5 minutes.
            </p>
          </div>

          <Link
            href="/onboarding"
            className="h-11 px-6 rounded-full bg-white hover:bg-gray-100 text-black text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all shadow-md"
          >
            <span>Continue Onboarding</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}
