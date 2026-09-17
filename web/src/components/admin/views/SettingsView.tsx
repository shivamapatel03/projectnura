"use client";

import React, { useState } from "react";
import {
  Building2,
  Store,
  Receipt,
  Shield,
  Sliders,
  Check,
  Save,
  Printer,
  Lock,
  Percent,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { useAdminStore } from "../adminStore";

export const SettingsView: React.FC = () => {
  const { outlets } = useAdminStore();

  const [activeTab, setActiveTab] = useState<"business" | "pos" | "receipt" | "security">("business");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Business profile form state
  const [businessName, setBusinessName] = useState("Nuradesk Specialty Roasters");
  const [legalName, setLegalName] = useState("Nuradesk Hospitality LLP");
  const [gstin, setGstin] = useState("29AABCN8291M1Z5");
  const [email, setEmail] = useState("admin@nuradesk.com");
  const [phone, setPhone] = useState("+91 80 4123 9081");
  const [currency, setCurrency] = useState("INR (₹)");
  const [defaultTax, setDefaultTax] = useState("5%");

  // POS Preferences
  const [allowManualDiscount, setAllowManualDiscount] = useState(true);
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(true);
  const [enforceShiftFloat, setEnforceShiftFloat] = useState(true);
  const [enableKitchenDisplay, setEnableKitchenDisplay] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(true);

  // Receipt customization
  const [receiptHeader, setReceiptHeader] = useState("Nuradesk Specialty Roasters\nFresh Roasted Beans & Artisanal Brews");
  const [receiptFooter, setReceiptFooter] = useState("Thank you for dining with us!\nFollow us @nuradesk.coffee");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            System & Business Settings
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure brand identity, outlet locations, POS rules, and thermal receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="h-10 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          {savedSuccess ? <Check size={16} className="text-emerald-400" /> : <Save size={16} />}
          <span>{savedSuccess ? "Preferences Saved!" : "Save Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("business")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "business"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Building2 size={14} />
          <span>Business & Outlets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pos")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "pos"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Sliders size={14} />
          <span>POS Register Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("receipt")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "receipt"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Receipt size={14} />
          <span>Thermal Receipts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "security"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Shield size={14} />
          <span>Staff Security & Roles</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab: Business & Outlets */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-950">Company Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
                <div>
                  <label className="block font-semibold mb-1">Trading Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Legal Registered Entity</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">GSTIN / Tax Identification</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Base Currency</label>
                  <input
                    type="text"
                    disabled
                    value={currency}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Outlets Listing */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-950">Active Locations & Outlets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {outlets.map((out) => (
                  <div key={out.id} className="p-4 rounded-xl border border-gray-200 space-y-2 bg-gray-50/50">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-gray-950 text-xs">{out.name}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-white">
                        {out.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span>{out.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        <span>{out.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: POS Register Rules */}
        {activeTab === "pos" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-gray-950">Register Operation Rules</h3>
              <p className="text-xs text-gray-500">Configure how cashiers interact with the POS checkout terminal.</p>
            </div>

            <div className="space-y-4 divide-y divide-gray-100 text-xs text-gray-800">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold">Allow Cashier Custom Discounts</div>
                  <div className="text-gray-400 text-[11px]">
                    Permits cashiers to apply % or fixed rupee discounts during checkout.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowManualDiscount}
                  onChange={(e) => setAllowManualDiscount(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold">Automatic Cash Drawer Kick</div>
                  <div className="text-gray-400 text-[11px]">
                    Sends kick pulse (RJ12) to physical cash drawer upon cash payment confirmation.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoOpenDrawer}
                  onChange={(e) => setAutoOpenDrawer(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold">Enforce Opening Float Count</div>
                  <div className="text-gray-400 text-[11px]">
                    Requires cashiers to count and input opening drawer cash before taking sales.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enforceShiftFloat}
                  onChange={(e) => setEnforceShiftFloat(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold">Real-time Kitchen Display System (KDS) Routing</div>
                  <div className="text-gray-400 text-[11px]">
                    Sends dine-in food tickets directly to kitchen displays upon order placement.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableKitchenDisplay}
                  onChange={(e) => setEnableKitchenDisplay(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold">Chime Sound on New Order</div>
                  <div className="text-gray-400 text-[11px]">
                    Play audio alert when new orders land on KDS or counter.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundNotifications}
                  onChange={(e) => setSoundNotifications(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Thermal Receipts */}
        {activeTab === "receipt" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-950">Thermal Receipt Layout (80mm / 58mm)</h3>
              <p className="text-xs text-gray-500">Customize header notes, tax breakdowns, and footer slogans.</p>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div>
                <label className="block font-semibold mb-1">Receipt Header Text</label>
                <textarea
                  rows={3}
                  value={receiptHeader}
                  onChange={(e) => setReceiptHeader(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Receipt Footer Note</label>
                <textarea
                  rows={3}
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Security & Roles */}
        {activeTab === "security" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-950">Access Control & PIN Lockout</h3>
              <p className="text-xs text-gray-500">Security policies for cashiers and store managers.</p>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Auto-lock Register after Inactivity</div>
                  <div className="text-gray-500 text-[11px]">Requires PIN re-entry after 2 minutes of idle time.</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-black text-white text-[11px] font-semibold">Enabled</span>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Manager Override on Refunds</div>
                  <div className="text-gray-500 text-[11px]">Cashier accounts cannot process refunds without Manager PIN.</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-black text-white text-[11px] font-semibold">Required</span>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Hardware Pairing Authentication</div>
                  <div className="text-gray-500 text-[11px]">New POS devices must enter a 6-digit pairing token.</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-black text-white text-[11px] font-semibold">Enforced</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
