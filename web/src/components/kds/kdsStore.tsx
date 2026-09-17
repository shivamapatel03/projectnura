"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  KdsOrder,
  KdsOrderStatus,
  KdsDevice,
  KdsSettings,
  KdsItem,
} from "./types";
import { playKdsNewOrderChime, playKdsActionChime } from "./kdsSound";

interface KdsContextType {
  // Device Pairing
  isPaired: boolean;
  pairedDevice: KdsDevice;
  pairDevice: (code: string) => boolean;
  unpairDevice: () => void;

  // Connectivity
  isOnline: boolean;
  toggleOffline: () => void;

  // Station & Status Filters
  selectedStation: string;
  setSelectedStation: (station: string) => void;
  activeStatusFilter: "ALL" | KdsOrderStatus;
  setActiveStatusFilter: (status: "ALL" | KdsOrderStatus) => void;

  // Orders
  orders: KdsOrder[];
  filteredOrders: KdsOrder[];
  startOrder: (id: string) => void;
  readyOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  recallOrder: (id: string) => void;
  toggleItemCompleted: (orderId: string, itemId: string) => void;
  acknowledgeAlert: (orderId: string) => void;
  simulateIncomingOrder: () => void;

  // Details Modal
  selectedOrderForModal: KdsOrder | null;
  setSelectedOrderForModal: (order: KdsOrder | null) => void;

  // Settings Modal
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  settings: KdsSettings;
  updateSettings: (updates: Partial<KdsSettings>) => void;

  // Notification Banner
  newOrderAlertBanner: KdsOrder | null;
  dismissNewOrderAlertBanner: () => void;
}

const DEFAULT_DEVICE: KdsDevice = {
  id: "K1",
  name: "K1 — Main Kitchen",
  station: "Main Kitchen",
  outlet: "Main Branch",
  cafeName: "Shiv Cafe",
  code: "NURA-84KF",
  isPaired: true,
  pairedAt: "Today, 08:00 AM",
};

const DEFAULT_SETTINGS: KdsSettings = {
  kitchenName: "Shiv Cafe - Main Kitchen",
  selectedStation: "All",
  soundEnabled: true,
  soundVolume: 0.8,
  displaySize: "normal",
  targetMinutes: 10,
  autoCompleteMinutes: 0,
  language: "English",
  theme: "dark",
};

const INITIAL_KDS_ORDERS: KdsOrder[] = [
  {
    id: "kds-1045",
    orderNumber: "#1045",
    destination: "TABLE 05",
    orderType: "Dine-in",
    items: [
      {
        id: "item-1045-1",
        name: "Cappuccino",
        quantity: 2,
        station: "Bar",
        modifiers: ["Oat milk"],
      },
      {
        id: "item-1045-2",
        name: "Artisan Sourdough Sandwich",
        quantity: 1,
        station: "Main Kitchen",
        notes: "No onions",
      },
    ],
    specialInstructions: "Serve coffee first please",
    orderTime: "12:42 PM",
    createdAt: Date.now() - 4 * 60 * 1000 - 32 * 1000, // 04:32 ago
    status: "NEW",
    targetMinutes: 10,
    isNewAlert: false,
  },
  {
    id: "kds-1042",
    orderNumber: "#1042",
    destination: "TABLE 02",
    orderType: "Dine-in",
    items: [
      {
        id: "item-1042-1",
        name: "Classic Truffle Burger",
        quantity: 2,
        station: "Main Kitchen",
        modifiers: ["Extra cheese"],
        notes: "Well done patties",
        isCompleted: true,
      },
      {
        id: "item-1042-2",
        name: "Espresso Roast",
        quantity: 2,
        station: "Bar",
        modifiers: ["Extra shot"],
      },
    ],
    orderTime: "12:35 PM",
    createdAt: Date.now() - 8 * 60 * 1000 - 15 * 1000, // 08:15 ago
    startedAt: Date.now() - 5 * 60 * 1000,
    status: "PREPARING",
    targetMinutes: 10,
    isNewAlert: false,
  },
  {
    id: "kds-1039",
    orderNumber: "#1039",
    destination: "PARCEL 021",
    orderType: "Takeaway",
    items: [
      {
        id: "item-1039-1",
        name: "Artisan Sourdough Sandwich",
        quantity: 1,
        station: "Main Kitchen",
        modifiers: ["Oat bread"],
        isCompleted: true,
      },
      {
        id: "item-1039-2",
        name: "Cold Brew Reserve",
        quantity: 2,
        station: "Bar",
        modifiers: ["Oat milk"],
        isCompleted: true,
      },
    ],
    orderTime: "12:28 PM",
    createdAt: Date.now() - 14 * 60 * 1000 - 45 * 1000,
    startedAt: Date.now() - 11 * 60 * 1000,
    readyAt: Date.now() - 2 * 60 * 1000,
    status: "READY",
    targetMinutes: 10,
    isNewAlert: false,
  },
  {
    id: "kds-1048",
    orderNumber: "#1048",
    destination: "DELIVERY",
    orderType: "Delivery",
    deliveryPlatform: "Zomato",
    items: [
      {
        id: "item-1048-1",
        name: "Butter Croissant",
        quantity: 2,
        station: "Main Kitchen",
        notes: "Heat before pack",
      },
      {
        id: "item-1048-2",
        name: "Japanese Ceremonial Matcha",
        quantity: 1,
        station: "Bar",
        modifiers: ["Less sweet"],
      },
      {
        id: "item-1048-3",
        name: "Chocolate Fudge Brownie",
        quantity: 1,
        station: "Dessert",
      },
    ],
    orderTime: "12:47 PM",
    createdAt: Date.now() - 1 * 60 * 1000 - 10 * 1000,
    status: "NEW",
    targetMinutes: 10,
    isNewAlert: true,
  },
];

const KdsContext = createContext<KdsContextType | undefined>(undefined);

export const KdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Device Pairing State
  const [isPaired, setIsPaired] = useState<boolean>(true);
  const [pairedDevice, setPairedDevice] = useState<KdsDevice>(DEFAULT_DEVICE);

  // Online / Offline State
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Station and Status Filter
  const [selectedStation, setSelectedStation] = useState<string>("All");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"ALL" | KdsOrderStatus>("ALL");

  // Settings
  const [settings, setSettings] = useState<KdsSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<KdsOrder | null>(null);
  const [newOrderAlertBanner, setNewOrderAlertBanner] = useState<KdsOrder | null>(null);

  // Orders State
  const [orders, setOrders] = useState<KdsOrder[]>(INITIAL_KDS_ORDERS);

  // Hydrate client-only values from localStorage safely after mount
  useEffect(() => {
    try {
      const storedPaired = localStorage.getItem("nuradesk_kds_paired");
      if (storedPaired !== null) {
        setIsPaired(storedPaired === "true");
      }
      const storedDevice = localStorage.getItem("nuradesk_kds_device");
      if (storedDevice) {
        setPairedDevice(JSON.parse(storedDevice));
      }
      const storedSettings = localStorage.getItem("nuradesk_kds_settings");
      if (storedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(storedSettings) }));
      }
      const storedOrders = localStorage.getItem("nuradesk_kds_orders");
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync orders with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nuradesk_kds_orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Listen for terminal "Sent to Kitchen" KOT events across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nuradesk_terminal_kot" && e.newValue) {
        try {
          const terminalOrder = JSON.parse(e.newValue);
          importOrderFromTerminal(terminalOrder);
        } catch (err) {
          // ignore
        }
      }
    };

    const handleCustomKotEvent = (e: any) => {
      if (e.detail) {
        importOrderFromTerminal(e.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nuradesk:kot_sent", handleCustomKotEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nuradesk:kot_sent", handleCustomKotEvent);
    };
  }, [settings.soundEnabled, settings.soundVolume]);

  const importOrderFromTerminal = useCallback((terminalOrder: any) => {
    // Map terminal cart items to KdsItems
    const mappedItems: KdsItem[] = (terminalOrder.items || []).map((ci: any, idx: number) => {
      let station: "Main Kitchen" | "Bar" | "Dessert" = "Main Kitchen";
      const cat = ci.product?.category?.toLowerCase() || "";
      const name = ci.product?.name?.toLowerCase() || "";
      if (cat.includes("coffee") || cat.includes("drink") || name.includes("matcha") || name.includes("brew")) {
        station = "Bar";
      } else if (cat.includes("dessert") || name.includes("brownie") || name.includes("cake")) {
        station = "Dessert";
      }

      const mods: string[] = [];
      if (ci.selectedSize) mods.push(ci.selectedSize);
      if (ci.selectedMilk) mods.push(ci.selectedMilk);
      if (ci.selectedSugar) mods.push(ci.selectedSugar);
      if (ci.selectedTemp) mods.push(ci.selectedTemp);
      if (ci.selectedAddOns && Array.isArray(ci.selectedAddOns)) {
        ci.selectedAddOns.forEach((a: any) => mods.push(typeof a === "string" ? a : a.name));
      }

      return {
        id: `it-${Date.now()}-${idx}`,
        name: ci.product?.name || "Item",
        quantity: ci.quantity || 1,
        station,
        modifiers: mods.length > 0 ? mods : undefined,
        notes: ci.itemNotes || undefined,
        isCompleted: false,
      };
    });

    const newKdsOrder: KdsOrder = {
      id: `kds-${Date.now()}`,
      orderNumber: terminalOrder.orderNumber || `#${Math.floor(1050 + Math.random() * 500)}`,
      destination: terminalOrder.tableOrParcel || "Counter Sale",
      orderType: terminalOrder.type === "Dine-in" ? "Dine-in" : terminalOrder.type === "Takeaway" ? "Takeaway" : "Delivery",
      deliveryPlatform: terminalOrder.deliveryDetails?.platform,
      items: mappedItems,
      specialInstructions: terminalOrder.note,
      orderTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      status: "NEW",
      targetMinutes: 10,
      isNewAlert: true,
    };

    setOrders((prev) => [newKdsOrder, ...prev.filter((o) => o.orderNumber !== newKdsOrder.orderNumber)]);
    setNewOrderAlertBanner(newKdsOrder);

    if (settings.soundEnabled) {
      playKdsNewOrderChime(settings.soundVolume);
    }
  }, [settings.soundEnabled, settings.soundVolume]);

  // Pair Device
  const pairDevice = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    const device: KdsDevice = {
      ...DEFAULT_DEVICE,
      code: cleanCode,
      isPaired: true,
      pairedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setIsPaired(true);
    setPairedDevice(device);
    localStorage.setItem("nuradesk_kds_paired", "true");
    localStorage.setItem("nuradesk_kds_device", JSON.stringify(device));
    return true;
  };

  const unpairDevice = () => {
    setIsPaired(false);
    localStorage.setItem("nuradesk_kds_paired", "false");
  };

  const toggleOffline = () => {
    setIsOnline((prev) => !prev);
  };

  // Order Status Lifecycle
  const startOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "PREPARING", startedAt: Date.now(), isNewAlert: false } : o))
    );
    if (settings.soundEnabled) {
      playKdsActionChime("ready", settings.soundVolume * 0.7);
    }
    broadcastStatusChange(id, "Preparing");
  };

  const readyOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "READY", readyAt: Date.now() } : o))
    );
    if (settings.soundEnabled) {
      playKdsActionChime("ready", settings.soundVolume);
    }
    broadcastStatusChange(id, "Ready");
  };

  const completeOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "COMPLETED", completedAt: Date.now() } : o))
    );
    if (settings.soundEnabled) {
      playKdsActionChime("complete", settings.soundVolume);
    }
    broadcastStatusChange(id, "Completed");
  };

  const recallOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "READY" } : o))
    );
    broadcastStatusChange(id, "Ready");
  };

  const toggleItemCompleted = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
          ),
        };
      })
    );
  };

  const acknowledgeAlert = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isNewAlert: false } : o))
    );
  };

  const dismissNewOrderAlertBanner = () => {
    setNewOrderAlertBanner(null);
  };

  const broadcastStatusChange = (kdsOrderId: string, status: string) => {
    if (typeof window !== "undefined") {
      const order = orders.find((o) => o.id === kdsOrderId);
      if (order) {
        window.dispatchEvent(
          new CustomEvent("nuradesk:kds_order_updated", {
            detail: { orderNumber: order.orderNumber, status },
          })
        );
      }
    }
  };

  // Simulate an incoming POS Order to test kitchen notifications
  const simulateIncomingOrder = () => {
    const mockOrderNumbers = [1050, 1051, 1052, 1053, 1054, 1055];
    const nextNum = mockOrderNumbers[Math.floor(Math.random() * mockOrderNumbers.length)];
    const tables = ["TABLE 03", "TABLE 08", "PARCEL #029", "DELIVERY (Swiggy)", "TABLE 12"];
    const targetDest = tables[Math.floor(Math.random() * tables.length)];

    const simOrder: KdsOrder = {
      id: `kds-${Date.now()}`,
      orderNumber: `#${nextNum}`,
      destination: targetDest,
      orderType: targetDest.includes("TABLE") ? "Dine-in" : targetDest.includes("PARCEL") ? "Takeaway" : "Delivery",
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: "Cappuccino Special",
          quantity: 2,
          station: "Bar",
          modifiers: ["Extra foam", "Almond milk"],
        },
        {
          id: `item-${Date.now()}-2`,
          name: "Classic Truffle Burger",
          quantity: 1,
          station: "Main Kitchen",
          modifiers: ["Extra cheese"],
          notes: "Sauce on the side",
        },
      ],
      specialInstructions: "Rush order for VIP customer",
      orderTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      status: "NEW",
      targetMinutes: 10,
      isNewAlert: true,
    };

    setOrders((prev) => [simOrder, ...prev]);
    setNewOrderAlertBanner(simOrder);
    if (settings.soundEnabled) {
      playKdsNewOrderChime(settings.soundVolume);
    }
  };

  const updateSettings = (updates: Partial<KdsSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem("nuradesk_kds_settings", JSON.stringify(next));
      }
      return next;
    });
  };

  // Filter orders according to station and active status tab
  const filteredOrders = orders.filter((order) => {
    // 1. Station filtering
    if (selectedStation !== "All") {
      const hasStationItems = order.items.some(
        (it) => it.station.toLowerCase() === selectedStation.toLowerCase()
      );
      if (!hasStationItems) return false;
    }

    // 2. Status tab filtering
    if (activeStatusFilter !== "ALL") {
      if (order.status !== activeStatusFilter) return false;
    }

    return true;
  });

  return (
    <KdsContext.Provider
      value={{
        isPaired,
        pairedDevice,
        pairDevice,
        unpairDevice,
        isOnline,
        toggleOffline,
        selectedStation,
        setSelectedStation,
        activeStatusFilter,
        setActiveStatusFilter,
        orders,
        filteredOrders,
        startOrder,
        readyOrder,
        completeOrder,
        recallOrder,
        toggleItemCompleted,
        acknowledgeAlert,
        simulateIncomingOrder,
        selectedOrderForModal,
        setSelectedOrderForModal,
        isSettingsOpen,
        setIsSettingsOpen,
        settings,
        updateSettings,
        newOrderAlertBanner,
        dismissNewOrderAlertBanner,
      }}
    >
      {children}
    </KdsContext.Provider>
  );
};

export const useKdsStore = () => {
  const context = useContext(KdsContext);
  if (!context) {
    throw new Error("useKdsStore must be used within a KdsProvider");
  }
  return context;
};
