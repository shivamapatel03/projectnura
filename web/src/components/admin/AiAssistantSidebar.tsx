"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  IconX,
  IconSend,
  IconArrowRight,
  IconRotate2,
} from "@tabler/icons-react";
import { useAdminStore } from "./adminStore";
import { AdminTab } from "./types";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
  action?: {
    label: string;
    tab: AdminTab;
  };
}

interface AiAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantSidebar: React.FC<AiAssistantSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    products,
    sales,
    orders,
    devices,
    staffList,
    selectedOutlet,
    setActiveTab,
    currentShift,
  } = useAdminStore();

  const [inputQuery, setInputQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Hello Rahul! I'm your Nuradesk Copilot. Ask me anything about today's sales, stock levels, open orders, or staff shifts.",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240);
  };

  // Focus input smoothly on open
  useEffect(() => {
    if (isOpen) {
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen && !isClosing) return null;

  // Real store metrics
  const completedSales = sales.filter((s) => s.status === "Completed");
  const totalRevenue = completedSales.reduce((acc, s) => acc + s.total, 0);
  const lowStockProducts = products.filter(
    (p) => p.status === "Low Stock" || p.status === "Out of Stock"
  );
  const openOrders = orders.filter(
    (o) => o.status === "Open" || o.status === "Preparing"
  );

  const generateAnswer = (query: string): { text: string; action?: { label: string; tab: AdminTab } } => {
    const q = query.toLowerCase().trim();

    if (q.includes("sale") || q.includes("revenue") || q.includes("today") || q.includes("gross")) {
      return {
        text: `Today's gross sales stand at ₹${totalRevenue.toLocaleString()} across ${completedSales.length} completed transactions at ${selectedOutlet.name}. Average ticket value is ₹${
          completedSales.length > 0 ? Math.round(totalRevenue / completedSales.length) : 0
        }.`,
        action: { label: "View Sales Ledger", tab: "sales" },
      };
    }

    if (q.includes("stock") || q.includes("inventory") || q.includes("low") || q.includes("out")) {
      if (lowStockProducts.length === 0) {
        return {
          text: "All inventory items are currently well-stocked. There are no low or out-of-stock items.",
          action: { label: "Open Inventory", tab: "inventory" },
        };
      }
      const names = lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(", ");
      return {
        text: `You have ${lowStockProducts.length} item(s) needing attention: ${names}.`,
        action: { label: "Manage Inventory", tab: "inventory" },
      };
    }

    if (q.includes("order") || q.includes("kitchen") || q.includes("ticket") || q.includes("pending")) {
      return {
        text: `There are currently ${openOrders.length} active order(s) on the live board (Open or Preparing in Kitchen).`,
        action: { label: "Open Live Orders", tab: "orders" },
      };
    }

    if (q.includes("device") || q.includes("terminal") || q.includes("hardware") || q.includes("pos")) {
      const onlineCount = devices.filter((d) => d.status === "Online").length;
      return {
        text: `You have ${devices.length} registered terminal(s) in ${selectedOutlet.name}. ${onlineCount} are currently online and paired.`,
        action: { label: "View Terminals", tab: "terminals" },
      };
    }

    if (q.includes("staff") || q.includes("shift") || q.includes("cashier") || q.includes("employee")) {
      const activeStaff = currentShift ? currentShift.staffName : "None";
      return {
        text: `Total registered staff: ${staffList.length}. Active shift on Terminal 1: ${activeStaff} (Started at ${currentShift?.startTime || "N/A"}).`,
        action: { label: "Staff Directory", tab: "staff" },
      };
    }

    if (q.includes("report") || q.includes("analytics") || q.includes("performance") || q.includes("top")) {
      return {
        text: "Your top selling items today are Espresso Roast, Cappuccino, and Cold Brew. UPI accounts for the highest digital volume at 58%.",
        action: { label: "View Executive Reports", tab: "reports" },
      };
    }

    return {
      text: `Here is a quick snapshot for ${selectedOutlet.name}: Gross revenue is ₹${totalRevenue.toLocaleString()}, with ${openOrders.length} live kitchen orders and ${lowStockProducts.length} inventory items requiring restock.`,
      action: { label: "Go to Dashboard", tab: "dashboard" },
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputQuery).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: "Just now",
    };

    const response = generateAnswer(text);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "assistant",
      text: response.text,
      time: "Just now",
      action: response.action,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const promptPills = [
    "Today's sales summary",
    "Any low stock items?",
    "Show active orders",
    "Terminal status",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Subtle backdrop with hardware-accelerated fade */}
      <div
        className={`fixed inset-0 bg-black/25 ${
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Right Drawer Panel: Ultra-smooth GPU slide, No Shadow, Crisp Flat Borders */}
      <aside
        className={`relative w-full max-w-[390px] h-full bg-white border-l border-gray-200 flex flex-col z-10 ${
          isClosing ? "animate-drawer-out" : "animate-drawer-in"
        }`}
      >
        {/* Header */}
        <div className="h-14 px-4 sm:px-5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/logo/AI.png"
                alt="Nuradesk AI"
                width={22}
                height={22}
                className="w-5 h-5 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-gray-950">
                  Nuradesk AI
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                  Copilot
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Live store assistant</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close AI Assistant"
            className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/70 overflow-x-auto shrink-0 flex items-center gap-1.5">
          {promptPills.map((pill, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(pill)}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-[11px] font-medium text-gray-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {m.sender === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1 text-gray-500 font-semibold text-[10px]">
                  <Image
                    src="/logo/AI.png"
                    alt="AI"
                    width={16}
                    height={16}
                    className="w-3.5 h-3.5 object-contain shrink-0"
                  />
                  <span>Nuradesk AI</span>
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-black text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.action && (
                  <button
                    type="button"
                    onClick={() => {
                      if (m.action) {
                        setActiveTab(m.action.tab);
                        handleClose();
                      }
                    }}
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-black bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    <span>{m.action.label}</span>
                    <IconArrowRight size={12} />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-black bg-white transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about sales, stock, orders..."
              className="flex-1 text-xs outline-none bg-transparent placeholder:text-gray-400 text-gray-900"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputQuery.trim()}
              className="w-7 h-7 rounded-lg bg-black disabled:bg-gray-200 text-white disabled:text-gray-400 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <IconSend size={13} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-gray-400">
            <span>Powered by Nuradesk Intelligence</span>
            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: "assistant",
                    text: "Chat cleared. What else would you like to know?",
                    time: "Just now",
                  },
                ])
              }
              className="hover:text-gray-700 cursor-pointer flex items-center gap-1"
            >
              <IconRotate2 size={11} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
