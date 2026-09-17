"use client";

import React from "react";
import { useKdsStore } from "./kdsStore";
import {
  IconX,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconArmchair,
  IconShoppingBag,
  IconMotorbike,
  IconNotes,
  IconArrowBackUp,
} from "@tabler/icons-react";

export const KdsOrderDetailsModal: React.FC = () => {
  const {
    selectedOrderForModal,
    setSelectedOrderForModal,
    startOrder,
    readyOrder,
    completeOrder,
    recallOrder,
    toggleItemCompleted,
    settings,
  } = useKdsStore();

  if (!selectedOrderForModal) return null;
  const order = selectedOrderForModal;

  const isLight = settings.theme === "light";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 my-auto max-h-[calc(100vh-2rem)] flex flex-col transition-colors ${
          isLight
            ? "bg-white border border-gray-200 text-gray-900"
            : "bg-[#161a22] border border-gray-800 text-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isLight ? "border-gray-200" : "border-gray-800"
          }`}
        >
          <div>
            <div className="flex items-center gap-3">
              <h2
                className={`text-2xl font-black tracking-tight ${
                  isLight ? "text-gray-950" : "text-white"
                }`}
              >
                ORDER {order.orderNumber}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  order.status === "NEW"
                    ? "bg-amber-400 text-black font-black"
                    : order.status === "PREPARING"
                    ? "bg-blue-600 text-white"
                    : order.status === "READY"
                    ? "bg-emerald-500 text-black font-black"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p
              className={`text-sm font-bold mt-0.5 ${
                isLight ? "text-amber-700" : "text-amber-400"
              }`}
            >
              {order.destination} · {order.orderType}
              {order.deliveryPlatform ? ` (${order.deliveryPlatform})` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedOrderForModal(null)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Info Grid: Order Time, Destination, Items Count */}
        <div
          className={`grid grid-cols-3 gap-2 rounded-xl p-3 text-center border ${
            isLight
              ? "bg-gray-50 border-gray-200"
              : "bg-[#0d0f12] border-gray-800"
          }`}
        >
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Order Time
            </span>
            <span
              className={`text-xs font-bold ${
                isLight ? "text-gray-800" : "text-gray-200"
              }`}
            >
              {order.orderTime}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Destination
            </span>
            <span
              className={`text-xs font-bold ${
                isLight ? "text-gray-950" : "text-white"
              }`}
            >
              {order.destination}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Items
            </span>
            <span
              className={`text-xs font-bold font-mono ${
                isLight ? "text-amber-700" : "text-amber-400"
              }`}
            >
              {order.items.reduce((acc, i) => acc + i.quantity, 0)} Units
            </span>
          </div>
        </div>

        {/* Items Checklist */}
        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[280px] pr-1">
          <span
            className={`text-xs font-bold uppercase tracking-wider block ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Items to Prepare (Tap to complete)
          </span>

          {order.items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItemCompleted(order.id, item.id)}
              className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                item.isCompleted
                  ? isLight
                    ? "bg-gray-100/70 border-gray-200 text-gray-400"
                    : "bg-gray-900/40 border-gray-800/40 text-gray-500"
                  : isLight
                  ? "bg-gray-50/90 border-gray-200 text-gray-900 hover:border-gray-300"
                  : "bg-[#0d0f12] border-gray-800 text-white hover:border-gray-700"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span
                    className={`font-mono font-black ${
                      isLight ? "text-amber-700" : "text-amber-400"
                    }`}
                  >
                    {item.quantity}×
                  </span>
                  <span
                    className={
                      item.isCompleted
                        ? isLight
                          ? "line-through text-gray-400"
                          : "line-through text-gray-500"
                        : isLight
                        ? "text-gray-950"
                        : "text-white"
                    }
                  >
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isLight
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {item.station}
                  </span>
                </div>

                {item.modifiers && item.modifiers.length > 0 && (
                  <div
                    className={`pl-6 text-xs font-medium ${
                      isLight ? "text-amber-800" : "text-amber-300"
                    }`}
                  >
                    {item.modifiers.map((m, i) => (
                      <div key={i}>• {m}</div>
                    ))}
                  </div>
                )}

                {item.notes && (
                  <div
                    className={`pl-6 text-xs font-semibold italic ${
                      isLight ? "text-rose-600" : "text-rose-300"
                    }`}
                  >
                    Special: {item.notes}
                  </div>
                )}
              </div>

              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                  item.isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isLight
                    ? "border-gray-300 bg-white text-transparent"
                    : "border-gray-700 text-transparent"
                }`}
              >
                <IconCheck size={16} stroke={3} />
              </div>
            </div>
          ))}

          {order.specialInstructions && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                isLight
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-200"
              }`}
            >
              <IconNotes
                size={16}
                className={`shrink-0 mt-0.5 ${
                  isLight ? "text-amber-600" : "text-amber-400"
                }`}
              />
              <span>{order.specialInstructions}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div
          className={`pt-3 border-t flex items-center gap-2.5 ${
            isLight ? "border-gray-200" : "border-gray-800"
          }`}
        >
          {order.status === "NEW" && (
            <button
              type="button"
              onClick={() => {
                startOrder(order.id);
                setSelectedOrderForModal(null);
              }}
              className="flex-1 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Start Preparing</span>
              <IconArrowRight size={18} stroke={2.5} />
            </button>
          )}

          {order.status === "PREPARING" && (
            <button
              type="button"
              onClick={() => {
                readyOrder(order.id);
                setSelectedOrderForModal(null);
              }}
              className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <IconCheck size={18} stroke={3} />
              <span>Mark Ready</span>
            </button>
          )}

          {order.status === "READY" && (
            <button
              type="button"
              onClick={() => {
                completeOrder(order.id);
                setSelectedOrderForModal(null);
              }}
              className={`flex-1 h-12 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isLight
                  ? "bg-gray-950 hover:bg-black text-white"
                  : "bg-white hover:bg-gray-200 text-black"
              }`}
            >
              <IconCheck size={18} stroke={3} />
              <span>Complete Order</span>
            </button>
          )}

          {order.status === "COMPLETED" && (
            <button
              type="button"
              onClick={() => {
                recallOrder(order.id);
                setSelectedOrderForModal(null);
              }}
              className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                isLight
                  ? "bg-gray-100 hover:bg-gray-200 text-amber-800 border border-gray-200"
                  : "bg-gray-800 hover:bg-gray-700 text-amber-300"
              }`}
            >
              <IconArrowBackUp size={18} />
              <span>Recall to Ready</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
