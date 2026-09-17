"use client";

import React, { useState } from "react";
import { IconX, IconShieldCheck, IconKey, IconUser, IconMail, IconPhone, IconBuildingStore } from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";
import { StaffRole } from "../types";

export const AddStaffModal: React.FC = () => {
  const { isAddStaffOpen, setIsAddStaffOpen, addStaff, outlets } = useAdminStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("Cashier");
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([outlets[0]?.id || "out-1"]);
  const [pin, setPin] = useState("");

  // Permissions
  const [canDiscount, setCanDiscount] = useState(role === "Owner" || role === "Store Manager");
  const [canRefund, setCanRefund] = useState(role === "Owner" || role === "Store Manager");
  const [canVoid, setCanVoid] = useState(role === "Owner");
  const [canViewReports, setCanViewReports] = useState(role === "Owner" || role === "Store Manager");
  const [canManageInventory, setCanManageInventory] = useState(role !== "Waiter");

  if (!isAddStaffOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pin) return;

    addStaff({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@nuradesk.com`,
      phone: phone || "+91 98000 00000",
      role,
      pin: pin.slice(0, 4),
      outletIds: selectedOutlets,
      permissions: {
        canDiscount,
        canRefund,
        canVoid,
        canViewReports,
        canManageInventory,
        canManageStaff: role === "Owner",
      },
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      status: "Active",
    });

    setIsAddStaffOpen(false);
    // Reset
    setName("");
    setEmail("");
    setPhone("");
    setPin("");
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 className="text-base font-bold text-gray-950">Add Staff Account</h3>
            <p className="text-xs text-gray-500">
              Step {step} of 4: {step === 1 ? "Basic Details" : step === 2 ? "Role & Outlets" : step === 3 ? "Permissions" : "POS Security PIN"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddStaffOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 h-1 bg-gray-100">
          <div className={`h-full bg-black ${step >= 1 ? "opacity-100" : "opacity-0"}`} />
          <div className={`h-full bg-black ${step >= 2 ? "opacity-100" : "opacity-0"}`} />
          <div className={`h-full bg-black ${step >= 3 ? "opacity-100" : "opacity-0"}`} />
          <div className={`h-full bg-black ${step >= 4 ? "opacity-100" : "opacity-0"}`} />
        </div>

        {/* Step Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <IconUser size={13} />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <IconMail size={13} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="arjun@nuradesk.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <IconPhone size={13} />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98450 99881"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-900">Assigned Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    const r = e.target.value as StaffRole;
                    setRole(r);
                    setCanDiscount(r === "Owner" || r === "Store Manager");
                    setCanRefund(r === "Owner" || r === "Store Manager");
                    setCanVoid(r === "Owner");
                    setCanViewReports(r === "Owner" || r === "Store Manager");
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
                >
                  <option value="Store Manager">Store Manager (Full Store Access)</option>
                  <option value="Cashier">Cashier (POS & Billing)</option>
                  <option value="Waiter">Waiter (Table Orders & KOT)</option>
                  <option value="Kitchen Chef">Kitchen Chef (KDS Station)</option>
                  <option value="Owner">Owner / Executive Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <IconBuildingStore size={13} />
                  <span>Accessible Outlets</span>
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {outlets.map((o) => (
                    <label
                      key={o.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOutlets.includes(o.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOutlets([...selectedOutlets, o.id]);
                          } else {
                            setSelectedOutlets(selectedOutlets.filter((id) => id !== o.id));
                          }
                        }}
                        className="w-4 h-4 accent-black"
                      />
                      <span className="font-medium text-gray-900">{o.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                <IconShieldCheck size={14} />
                <span>Security Permissions</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200">
                  <span>Can apply manual cart discounts</span>
                  <input
                    type="checkbox"
                    checked={canDiscount}
                    onChange={(e) => setCanDiscount(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200">
                  <span>Can issue transaction refunds</span>
                  <input
                    type="checkbox"
                    checked={canRefund}
                    onChange={(e) => setCanRefund(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200">
                  <span>Can void orders & cancel bills</span>
                  <input
                    type="checkbox"
                    checked={canVoid}
                    onChange={(e) => setCanVoid(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200">
                  <span>Can view reports & revenue KPIs</span>
                  <input
                    type="checkbox"
                    checked={canViewReports}
                    onChange={(e) => setCanViewReports(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200">
                  <span>Can adjust inventory & receive stock</span>
                  <input
                    type="checkbox"
                    checked={canManageInventory}
                    onChange={(e) => setCanManageInventory(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                  <IconKey size={18} />
                </div>
                <div className="font-bold text-gray-950 text-sm">Set 4-Digit POS Fast PIN</div>
                <p className="text-gray-500 text-xs">
                  {name || "Staff member"} will use this PIN to log in to POS registers and start shifts.
                </p>
                <div className="pt-2">
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    className="w-36 h-12 text-center text-2xl tracking-widest font-mono font-bold rounded-xl border border-gray-300 bg-white focus:border-black outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Navigation Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="h-9 px-3.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !name) {
                    alert("Please enter a staff name");
                    return;
                  }
                  setStep((prev) => (prev + 1) as any);
                }}
                className="h-9 px-4 rounded-lg bg-black text-white font-semibold hover:bg-zinc-800"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={pin.length < 4}
                className="h-9 px-5 rounded-lg bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50"
              >
                Save Staff Member
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
