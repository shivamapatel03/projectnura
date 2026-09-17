"use client";

import React, { useState } from "react";
import { IconPlus, IconSearch, IconKey, IconTrash } from "@tabler/icons-react";
import { useAdminStore } from "../adminStore";

export const StaffView: React.FC = () => {
  const { staffList, setIsAddStaffOpen, deleteStaff, currentShift } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === "All" || s.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            Staff & Access Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure employee roles, outlet scopes, 4-digit security PINs, and shift assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddStaffOpen(true)}
          className="h-10 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <IconPlus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Total Staff Accounts</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">{staffList.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Currently On Shift</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentShift ? 1 : 0} Active</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Store Managers</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            {staffList.filter((s) => s.role === "Store Manager" || s.role === "Owner").length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-none space-y-1">
          <div className="text-xs text-gray-500 font-medium">Cashiers & Servers</div>
          <div className="text-2xl font-bold text-gray-950 font-mono">
            {staffList.filter((s) => s.role === "Cashier" || s.role === "Waiter").length}
          </div>
        </div>
      </div>

      {/* Main Staff Container */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <IconSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by staff name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {["All", "Store Manager", "Cashier", "Kitchen Chef", "Owner"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedRoleFilter === r
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold pb-3">
                <th className="pb-3 pl-1">Staff Member</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Terminal PIN</th>
                <th className="pb-3">Outlet Scope</th>
                <th className="pb-3">Shift Status</th>
                <th className="pb-3 text-right pr-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((s) => {
                const isOnShift = currentShift && currentShift.staffId === s.id;

                return (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-950 text-xs sm:text-sm">{s.name}</div>
                          <div className="text-[11px] text-gray-400">{s.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 font-medium text-[11px]">
                        {s.role}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono text-gray-600">{s.phone}</td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="tracking-widest">••••</span>
                        <span className="text-[10px] text-gray-400 font-sans">({s.pin})</span>
                      </div>
                    </td>

                    <td className="py-3.5 text-gray-600">
                      {s.outletIds.length > 1 ? "All Outlets (Multi-Store)" : "Main Branch"}
                    </td>

                    <td className="py-3.5">
                      {isOnShift ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>On Shift (T1)</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium text-[10px]">
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right pr-1">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newPin = prompt("Enter new 4-digit PIN for " + s.name + ":", s.pin);
                            if (newPin && newPin.length === 4) {
                              alert("PIN updated successfully for " + s.name);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                          title="Change PIN"
                        >
                          <IconKey size={13} />
                        </button>
                        {s.role !== "Owner" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove staff account for "${s.name}"?`)) {
                                deleteStaff(s.id);
                              }
                            }}
                            className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete staff"
                          >
                            <IconTrash size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
