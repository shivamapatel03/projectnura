"use client";

import React, { useState } from "react";
import { IconX, IconSearch, IconUserPlus, IconUser, IconCheck } from "@tabler/icons-react";
import { useTerminalStore, TerminalCustomer } from "../terminalStore";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { customers, selectedCustomer, setSelectedCustomer, addCustomer } = useTerminalStore();
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  if (!isOpen) return null;

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    addCustomer(newName.trim(), newPhone.trim());
    setIsAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-950">
              {isAdding ? "Add New Customer" : "Select Customer"}
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

        {!isAdding ? (
          <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
            {/* Search Input */}
            <div className="relative flex items-center">
              <IconSearch size={16} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone number..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-black"
              />
            </div>

            {/* Customers List */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filtered.map((cust) => {
                const isSelected = selectedCustomer?.id === cust.id;
                return (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(cust);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gray-100 border-black font-bold"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-gray-950">{cust.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono">{cust.phone}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {cust.totalVisits} visits {cust.creditBalance > 0 && `· Credit: ₹${cust.creditBalance}`}
                      </p>
                    </div>
                    {isSelected && <IconCheck size={16} className="text-black" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="button-20 w-full h-10 !rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <IconUserPlus size={15} />
              <span>Add Customer</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateCustomer} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">Customer Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">Phone Number</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 outline-none focus:border-black"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="w-1/2 h-10 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="button-20 w-1/2 h-10 !rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save & Select
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
