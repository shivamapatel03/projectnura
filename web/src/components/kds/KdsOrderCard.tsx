"use client";

import React, { useState, useEffect } from "react";
import { KdsOrder, KdsItem } from "./types";
import { useKdsStore } from "./kdsStore";
import {
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
  IconNotes,
  IconMotorbike,
  IconArmchair,
  IconShoppingBag,
} from "@tabler/icons-react";

interface KdsOrderCardProps {
  order: KdsOrder;
}

export const KdsOrderCard: React.FC<KdsOrderCardProps> = ({ order }) => {
  const {
    startOrder,
    readyOrder,
    completeOrder,
    toggleItemCompleted,
    setSelectedOrderForModal,
    settings,
  } = useKdsStore();

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const isLight = settings.theme === "light";

  // Sync and tick timer on client to eliminate SSR hydration discrepancy
  useEffect(() => {
    const calcElapsed = () => {
      if (order.status === "COMPLETED" && order.completedAt) {
        return Math.max(0, Math.floor((order.completedAt - order.createdAt) / 1000));
      }
      return Math.max(0, Math.floor((Date.now() - order.createdAt) / 1000));
    };

    setElapsedSeconds(calcElapsed());

    if (order.status === "COMPLETED") return;

    const interval = setInterval(() => {
      setElapsedSeconds(calcElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt, order.status, order.completedAt]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Color urgency coding based on target minutes
  const targetSecs = (order.targetMinutes || 10) * 60;
  const isUrgent = elapsedSeconds >= targetSecs;
  const isWarning = elapsedSeconds >= targetSecs * 0.6 && !isUrgent;

  // Order type badge color & icon
  const getDestinationBadge = () => {
    if (order.orderType === "Dine-in") {
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
            isLight
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
          }`}
        >
          <IconArmchair size={14} />
          <span>{order.destination}</span>
        </span>
      );
    }
    if (order.orderType === "Takeaway") {
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
            isLight
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
          }`}
        >
          <IconShoppingBag size={14} />
          <span>{order.destination}</span>
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
          isLight
            ? "bg-orange-50 text-orange-700 border border-orange-200"
            : "bg-orange-500/15 text-orange-300 border border-orange-500/30"
        }`}
      >
        <IconMotorbike size={14} />
        <span>
          {order.destination} {order.deliveryPlatform ? `· ${order.deliveryPlatform}` : ""}
        </span>
      </span>
    );
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none overflow-hidden ${
        isLight
          ? order.isNewAlert
            ? "border-amber-400 ring-2 ring-amber-400/40 bg-white shadow-md"
            : isUrgent
            ? "border-rose-300 ring-1 ring-rose-400/30 bg-rose-50/25 shadow-xs"
            : isWarning
            ? "border-amber-300 bg-amber-50/25 shadow-xs"
            : "border-gray-200 bg-white hover:border-gray-300 shadow-xs"
          : order.isNewAlert
          ? "border-amber-400/80 ring-2 ring-amber-400/40 bg-[#1e222d] shadow-lg"
          : isUrgent
          ? "border-rose-600/80 ring-1 ring-rose-500/30 bg-[#1c181c] shadow-lg"
          : isWarning
          ? "border-amber-600/50 bg-[#1c1a16] shadow-lg"
          : "border-gray-800/80 bg-[#161a22] hover:border-gray-700 shadow-lg"
      } ${
        settings.displaySize === "large"
          ? "p-5 min-h-[380px]"
          : settings.displaySize === "compact"
          ? "p-3.5 min-h-[290px]"
          : "p-4 min-h-[330px]"
      }`}
    >
      {/* 1. Header: Order #, Table / Parcel, Timer, Order Time */}
      <div
        className={`space-y-2 pb-3 ${
          isLight ? "border-b border-gray-100" : "border-b border-gray-800/80"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Order # */}
          <button
            type="button"
            onClick={() => setSelectedOrderForModal(order)}
            className="text-left group cursor-pointer"
            title="Click to view full order details"
          >
            <span
              className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
                isLight
                  ? "text-gray-950 group-hover:text-amber-600"
                  : "text-white group-hover:text-amber-400"
              }`}
            >
              {order.orderNumber}
            </span>
          </button>

          {/* Live Timer */}
          <div
            suppressHydrationWarning
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
              isUrgent
                ? "bg-rose-500 text-white animate-pulse"
                : isWarning
                ? isLight
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : isLight
                ? "bg-gray-100 text-gray-700 border border-gray-200"
                : "bg-gray-800/80 text-gray-300 border border-gray-700/60"
            }`}
          >
            <IconClock size={13} className={isUrgent ? "text-white" : isLight ? "text-gray-500" : "text-gray-400"} />
            <span suppressHydrationWarning>{timeFormatted}</span>
          </div>
        </div>

        {/* Destination & Order Time */}
        <div className="flex items-center justify-between">
          <div>{getDestinationBadge()}</div>
          <span className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            {order.orderTime}
          </span>
        </div>
      </div>

      {/* 2. Items List */}
      <div className="flex-1 py-3 space-y-2.5 overflow-y-auto max-h-[240px]">
        {order.items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItemCompleted(order.id, item.id)}
            className={`flex items-start justify-between gap-2 p-2 rounded-xl border transition-colors cursor-pointer ${
              item.isCompleted
                ? isLight
                  ? "bg-gray-100/70 border-gray-200 text-gray-400 line-through"
                  : "bg-gray-900/40 border-gray-800/40 text-gray-500 line-through"
                : isLight
                ? "bg-gray-50/80 border-gray-200 text-gray-900 hover:bg-gray-100"
                : "bg-[#0d0f12]/60 border-gray-800/80 text-white hover:bg-[#0d0f12]"
            }`}
            title="Tap to mark item prepared"
          >
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight leading-snug">
                <span
                  className={`font-mono font-black shrink-0 ${
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
                      ? "text-gray-900"
                      : "text-gray-100"
                  }
                >
                  {item.name}
                </span>
              </div>

              {/* Modifiers & Notes */}
              {(item.modifiers || item.notes) && (
                <div
                  className={`pl-6 space-y-0.5 text-[11px] ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {item.modifiers?.map((m, idx) => (
                    <div
                      key={idx}
                      className={isLight ? "text-amber-800 font-medium" : "text-amber-300/90 font-medium"}
                    >
                      • {m}
                    </div>
                  ))}
                  {item.notes && (
                    <div
                      className={isLight ? "text-rose-600 font-semibold italic" : "text-rose-300/90 font-semibold italic"}
                    >
                      Note: {item.notes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Checkbox Icon */}
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                item.isCompleted
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : isLight
                  ? "border-gray-300 bg-white text-transparent hover:border-gray-400"
                  : "border-gray-700 bg-transparent text-transparent hover:border-gray-500"
              }`}
            >
              <IconCheck size={14} stroke={3} />
            </div>
          </div>
        ))}

        {/* Special Instructions callout */}
        {order.specialInstructions && (
          <div
            className={`flex items-start gap-1.5 p-2 rounded-xl text-xs font-semibold ${
              isLight
                ? "bg-amber-50 border border-amber-200 text-amber-900"
                : "bg-amber-500/10 border border-amber-500/20 text-amber-200"
            }`}
          >
            <IconNotes
              size={15}
              className={`shrink-0 mt-0.5 ${isLight ? "text-amber-600" : "text-amber-400"}`}
            />
            <span className="leading-tight">{order.specialInstructions}</span>
          </div>
        )}
      </div>

      {/* 3. Action Footer Button */}
      <div
        className={`pt-3 ${
          isLight ? "border-t border-gray-100" : "border-t border-gray-800/80"
        }`}
      >
        {order.status === "NEW" && (
          <button
            type="button"
            onClick={() => startOrder(order.id)}
            className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
          >
            <span>Start</span>
            <IconArrowRight size={17} stroke={2.5} />
          </button>
        )}

        {order.status === "PREPARING" && (
          <button
            type="button"
            onClick={() => readyOrder(order.id)}
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
          >
            <IconCheck size={18} stroke={3} />
            <span>Ready</span>
          </button>
        )}

        {order.status === "READY" && (
          <button
            type="button"
            onClick={() => completeOrder(order.id)}
            className={`w-full h-11 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 ${
              isLight
                ? "bg-gray-900 hover:bg-black text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
          >
            <IconCheck size={18} stroke={3} />
            <span>Complete</span>
          </button>
        )}

        {order.status === "COMPLETED" && (
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
            <span>✓ Completed & Served</span>
            <button
              type="button"
              onClick={() => setSelectedOrderForModal(order)}
              className={`hover:underline cursor-pointer ${
                isLight ? "text-amber-600" : "text-amber-400"
              }`}
            >
              Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
