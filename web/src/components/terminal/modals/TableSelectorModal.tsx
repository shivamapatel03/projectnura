"use client";

import React, { useState } from "react";
import { IconX, IconCheck, IconUsers, IconArmchair, IconReceipt } from "@tabler/icons-react";
import { useTerminalStore, RestaurantTable } from "../terminalStore";

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    tables,
    selectedTableOrParcel,
    selectTable,
    releaseTable,
    orderType,
    setOrderType,
  } = useTerminalStore();

  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Available" | "Occupied">("All");

  if (!isOpen) return null;

  const filteredTables = tables.filter((t) => {
    const matchArea = selectedArea === "All" || t.area === selectedArea;
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchArea && matchStatus;
  });

  const availableCount = tables.filter((t) => t.status === "Available").length;
  const occupiedCount = tables.filter((t) => t.status === "Occupied").length;

  const handleTableClick = (table: RestaurantTable) => {
    selectTable(table);
    setOrderType("Dine-in");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
              DINE-IN FLOOR PLAN
            </span>
            <h3 className="text-base font-extrabold text-gray-950">
              Select Dining Table
            </h3>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {availableCount} Available
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {occupiedCount} Occupied
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Floor Area & Status Filter Bar */}
        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Areas */}
          <div className="flex items-center gap-1.5">
            {["All", "Main Floor", "Terrace", "Bar Area"].map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedArea === area
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            {(["All", "Available", "Occupied"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-gray-200 text-gray-900 font-bold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tables Grid */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredTables.map((table) => {
              const isSelected = selectedTableOrParcel === table.name;
              const isAvailable = table.status === "Available";
              const isOccupied = table.status === "Occupied";
              const isReserved = table.status === "Reserved";

              return (
                <div
                  key={table.id}
                  className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between text-left group ${
                    isSelected
                      ? "border-black ring-2 ring-black bg-gray-50/80"
                      : isAvailable
                      ? "bg-white border-gray-200 hover:border-emerald-500 hover:shadow-sm"
                      : isOccupied
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-purple-50/40 border-purple-200"
                  }`}
                >
                  <div>
                    {/* Top Row: Table Name & Status Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm text-gray-950">
                        {table.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : isOccupied
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {table.status}
                      </span>
                    </div>

                    {/* Area & Seats */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <IconArmchair size={13} />
                        {table.seats} Seats
                      </span>
                      <span>·</span>
                      <span>{table.area}</span>
                    </div>

                    {/* Occupied details if present */}
                    {isOccupied && table.currentBill && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-xs font-mono">
                        <div className="flex justify-between text-amber-900 font-bold">
                          <span>Bill:</span>
                          <span>₹{table.currentBill}</span>
                        </div>
                        {table.activeOrderNumber && (
                          <div className="text-[10px] text-amber-700">
                            Order {table.activeOrderNumber}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-gray-100 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTableClick(table)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-black text-white"
                          : isAvailable
                          ? "bg-gray-100 hover:bg-black hover:text-white text-gray-900"
                          : "bg-amber-200/80 hover:bg-amber-300 text-amber-950"
                      }`}
                    >
                      {isSelected ? "Selected" : isOccupied ? "Switch Table" : "Select"}
                    </button>

                    {isOccupied && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          releaseTable(table.id);
                        }}
                        className="p-1.5 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-700 text-gray-500 text-[11px] font-semibold cursor-pointer"
                        title="Release / Vacate Table"
                      >
                        Vacate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
