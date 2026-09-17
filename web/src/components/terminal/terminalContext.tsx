"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, PaymentMethod } from "../admin/types";

export interface TerminalStaff {
  id: string;
  name: string;
  role: "Cashier" | "Manager" | "Barista" | "Admin";
  pin: string;
  avatarColor: string;
}

export interface TerminalShift {
  id: string;
  staffId: string;
  staffName: string;
  terminalId: string;
  startTime: string;
  openingCash: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  walletSales: number;
  cashIn: number;
  cashOut: number;
  cashRefunds: number;
  status: "Active" | "Closed";
}

export interface TerminalOrder {
  id: string;
  orderNumber: string;
  type: "Dine-in" | "Takeaway" | "Delivery" | "Counter Sale";
  tableOrParcel: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerName: string;
  customerPhone?: string;
  status: "Open" | "Preparing" | "Ready" | "Completed" | "Voided";
  createdAt: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: "Pending" | "Paid" | "Refunded";
  kotPrinted?: boolean;
}

export interface TerminalHeldSale {
  id: string;
  heldAt: string;
  orderType: "Dine-in" | "Takeaway" | "Delivery" | "Counter Sale";
  tableOrParcel: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerName: string;
  note?: string;
}

export interface TerminalCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  creditBalance: number;
}

export interface TerminalHardware {
  receiptPrinter: boolean;
  cashDrawer: boolean;
  barcodeScanner: boolean;
  customerDisplay: boolean;
}

export interface TerminalAuditLog {
  id: string;
  timestamp: string;
  action: string;
  staffName: string;
  details: string;
  type: "sale" | "refund" | "void" | "cash" | "security" | "shift";
}

export interface RestaurantTable {
  id: string;
  name: string;
  area: "Main Floor" | "Terrace" | "Bar Area";
  seats: number;
  status: "Available" | "Occupied" | "Reserved";
  currentBill?: number;
  guests?: number;
  activeOrderNumber?: string;
}

export interface DeliveryDetails {
  platform: "Zomato" | "Swiggy" | "Direct" | "UberEats";
  riderName: string;
  riderPhone: string;
  orderRef: string;
}

interface TerminalContextType {
  // Device Pairing
  isPaired: boolean;
  pairedDevice: {
    id: string;
    name: string;
    outlet: string;
    code: string;
    pairingCode: string;
  };
  pairDevice: (code: string) => boolean;
  unpairDevice: () => void;

  // Staff Authentication
  staffList: TerminalStaff[];
  currentUser: TerminalStaff | null;
  loginWithPin: (staffId: string, pin: string) => boolean;
  logout: () => void;
  switchUser: () => void;
  isLocked: boolean;
  lockTerminal: () => void;
  unlockTerminal: (pin: string) => boolean;
  verifyManagerPin: (pin: string) => boolean;

  // Shift Management
  activeShift: TerminalShift | null;
  startShift: (openingCash: number) => void;
  closeShift: (countedCash: number, notes?: string) => { expected: number; counted: number; diff: number };
  addCashIn: (amount: number, reason: string) => void;
  addCashOut: (amount: number, reason: string) => void;

  // POS Navigation & Cart
  activeView: "new_sale" | "orders" | "held" | "receipts" | "cash";
  setActiveView: (view: "new_sale" | "orders" | "held" | "receipts" | "cash") => void;
  orderType: "Dine-in" | "Takeaway" | "Delivery" | "Counter Sale";
  setOrderType: (type: "Dine-in" | "Takeaway" | "Delivery" | "Counter Sale") => void;
  selectedTableOrParcel: string;
  setSelectedTableOrParcel: (val: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    note?: string,
    selectedModifiers?: { name: string; extraPrice: number }[],
    selectedVariant?: any
  ) => void;
  updateCartQuantity: (productIdOrIndex: string | number, delta: number) => void;
  removeFromCart: (productIdOrIndex: string | number) => void;
  clearCart: () => void;
  discountAmount: number;
  setDiscountAmount: (val: number) => void;
  subtotal: number;
  cgst: number;
  sgst: number;
  tax: number;
  total: number;

  // Customers
  customers: TerminalCustomer[];
  selectedCustomer: TerminalCustomer | null;
  setSelectedCustomer: (cust: TerminalCustomer | null) => void;
  addCustomer: (name: string, phone: string) => TerminalCustomer;

  // Tables & Dine-in
  tables: RestaurantTable[];
  selectTable: (table: RestaurantTable) => void;
  releaseTable: (tableId: string) => void;

  // Delivery & Takeaway
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: React.Dispatch<React.SetStateAction<DeliveryDetails>>;
  parcelToken: string;

  // Held Sales
  heldSales: TerminalHeldSale[];
  holdCurrentSale: (note?: string) => void;
  resumeHeldSale: (id: string) => void;
  deleteHeldSale: (id: string) => void;

  // Orders & Kitchen
  orders: TerminalOrder[];
  sendToKitchen: () => TerminalOrder;
  completeSale: (method: PaymentMethod, tenderAmount?: number) => TerminalOrder;
  refundOrder: (orderId: string, reason: string) => boolean;
  voidOrder: (orderId: string, reason: string) => boolean;

  // Offline & Hardware
  isOffline: boolean;
  toggleOffline: () => void;
  offlineQueueCount: number;
  syncOfflineQueue: () => number;
  hardware: TerminalHardware;
  toggleHardware: (key: keyof TerminalHardware) => void;
  playTerminalSound: (type?: "scan" | "drawer" | "error" | "success") => void;

  // Audit Logs
  auditLogs: TerminalAuditLog[];
  addAuditLog: (action: string, details: string, type?: TerminalAuditLog["type"]) => void;

  // Products
  products: Product[];
  categories: string[];
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

// Audio synthesis for POS events (Barcode scan, drawer kick, success, error)
export const playTerminalBeep = (type: "scan" | "drawer" | "error" | "success" = "scan") => {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "scan") {
      osc.frequency.setValueAtTime(1750, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "drawer") {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === "error") {
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "success") {
      osc.frequency.setValueAtTime(1180, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (e) {
    // Audio context may be restricted by browser policy before interaction
  }
};

const INITIAL_STAFF: TerminalStaff[] = [
  { id: "st-1", name: "Rahul Sharma", role: "Cashier", pin: "1234", avatarColor: "bg-blue-600" },
  { id: "st-2", name: "Priya Patel", role: "Manager", pin: "5678", avatarColor: "bg-purple-600" },
  { id: "st-3", name: "Amit Verma", role: "Barista", pin: "1111", avatarColor: "bg-amber-600" },
];

const INITIAL_CUSTOMERS: TerminalCustomer[] = [
  { id: "c-1", name: "Rahul Patel", phone: "9876543210", email: "rahul.p@gmail.com", totalVisits: 14, creditBalance: 0 },
  { id: "c-2", name: "Priya Shah", phone: "9820112233", email: "priya.s@yahoo.com", totalVisits: 8, creditBalance: 150 },
  { id: "c-3", name: "Vikram Malhotra", phone: "9819001122", totalVisits: 3, creditBalance: 0 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-1", name: "Espresso Roast", category: "Coffee", sellingPrice: 160, costPrice: 40, taxRate: 5, sku: "COF-ESP-01", barcode: "8901001", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 45, lowStockThreshold: 10, status: "In Stock", active: true, kitchenStation: "Bar" },
  { id: "p-2", name: "Cappuccino Special", category: "Coffee", sellingPrice: 220, costPrice: 55, taxRate: 5, sku: "COF-CAP-02", barcode: "8901002", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 38, lowStockThreshold: 10, status: "In Stock", active: true, kitchenStation: "Bar" },
  { id: "p-3", name: "Iced Caramel Macchiato", category: "Coffee", sellingPrice: 260, costPrice: 65, taxRate: 5, sku: "COF-MAC-03", barcode: "8901003", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 28, lowStockThreshold: 10, status: "In Stock", active: true, kitchenStation: "Bar" },
  { id: "p-4", name: "Artisan Sourdough Sandwich", category: "Food", sellingPrice: 280, costPrice: 90, taxRate: 5, sku: "FOD-SAN-04", barcode: "8901004", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 18, lowStockThreshold: 5, status: "In Stock", active: true, kitchenStation: "Kitchen" },
  { id: "p-5", name: "Classic Truffle Burger", category: "Food", sellingPrice: 340, costPrice: 110, taxRate: 5, sku: "FOD-BGR-05", barcode: "8901005", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 12, lowStockThreshold: 5, status: "In Stock", active: true, kitchenStation: "Kitchen" },
  { id: "p-6", name: "Japanese Ceremonial Matcha", category: "Drinks", sellingPrice: 290, costPrice: 95, taxRate: 5, sku: "DRK-MTC-06", barcode: "8901006", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 14, lowStockThreshold: 5, status: "In Stock", active: true, kitchenStation: "Bar" },
  { id: "p-7", name: "Cold Brew Reserve", category: "Drinks", sellingPrice: 240, costPrice: 60, taxRate: 5, sku: "DRK-CLD-07", barcode: "8901007", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 35, lowStockThreshold: 10, status: "In Stock", active: true, kitchenStation: "Bar" },
  { id: "p-8", name: "Butter Croissant", category: "Bakery", sellingPrice: 140, costPrice: 40, taxRate: 5, sku: "BAK-CRO-08", barcode: "8901008", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 22, lowStockThreshold: 8, status: "In Stock", active: true, kitchenStation: "Kitchen" },
  { id: "p-9", name: "Chocolate Fudge Brownie", category: "Desserts", sellingPrice: 190, costPrice: 50, taxRate: 5, sku: "DES-BRW-09", barcode: "8901009", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80", inventoryTracking: true, stock: 16, lowStockThreshold: 5, status: "In Stock", active: true, kitchenStation: "Kitchen" },
];

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Device Pairing
  const [isPaired, setIsPaired] = useState<boolean>(true);
  const [pairedDevice, setPairedDevice] = useState({
    id: "T1",
    name: "T1 — Counter POS",
    outlet: "Main Branch",
    code: "T1",
    pairingCode: "NURA-84KF",
  });

  // 2. Staff Authentication
  const [staffList] = useState<TerminalStaff[]>(INITIAL_STAFF);
  const [currentUser, setCurrentUser] = useState<TerminalStaff | null>(INITIAL_STAFF[0]); // Default to Rahul
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // 3. Shift Management
  const [activeShift, setActiveShift] = useState<TerminalShift | null>({
    id: "SH-1042",
    staffId: "st-1",
    staffName: "Rahul Sharma",
    terminalId: "T1",
    startTime: "09:30 AM",
    openingCash: 5000,
    cashSales: 3450,
    upiSales: 4200,
    cardSales: 2100,
    walletSales: 0,
    cashIn: 500,
    cashOut: 100,
    cashRefunds: 0,
    status: "Active",
  });

  // 4. POS State
  const [activeView, setActiveView] = useState<"new_sale" | "orders" | "held" | "receipts" | "cash">("new_sale");
  const [orderType, setOrderType] = useState<"Dine-in" | "Takeaway" | "Delivery" | "Counter Sale">("Dine-in");
  const [selectedTableOrParcel, setSelectedTableOrParcel] = useState<string>("Table 05");

  // Tables Management
  const [tables, setTables] = useState<RestaurantTable[]>([
    { id: "T-01", name: "Table 01", area: "Main Floor", seats: 2, status: "Available" },
    { id: "T-02", name: "Table 02", area: "Main Floor", seats: 4, status: "Occupied", guests: 2, currentBill: 336, activeOrderNumber: "#1047" },
    { id: "T-03", name: "Table 03", area: "Main Floor", seats: 2, status: "Available" },
    { id: "T-04", name: "Table 04", area: "Main Floor", seats: 6, status: "Reserved", guests: 4 },
    { id: "T-05", name: "Table 05", area: "Main Floor", seats: 4, status: "Occupied", guests: 3, currentBill: 756, activeOrderNumber: "#1045" },
    { id: "T-06", name: "Table 06", area: "Main Floor", seats: 4, status: "Available" },
    { id: "T-07", name: "Table 07", area: "Terrace", seats: 2, status: "Available" },
    { id: "T-08", name: "Table 08", area: "Terrace", seats: 4, status: "Available" },
    { id: "T-09", name: "Table 09", area: "Terrace", seats: 4, status: "Occupied", guests: 2, currentBill: 480 },
    { id: "T-10", name: "Table 10", area: "Terrace", seats: 6, status: "Available" },
    { id: "T-11", name: "Table 11", area: "Bar Area", seats: 2, status: "Available" },
    { id: "T-12", name: "Table 12", area: "Bar Area", seats: 2, status: "Available" },
  ]);

  const selectTable = (table: RestaurantTable) => {
    setSelectedTableOrParcel(table.name);
    setOrderType("Dine-in");
  };

  const releaseTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId || t.name === tableId
          ? { ...t, status: "Available", currentBill: undefined, guests: undefined, activeOrderNumber: undefined }
          : t
      )
    );
  };

  // Delivery Details & Takeaway Token
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    platform: "Zomato",
    riderName: "Vikas K. (Delivery Partner)",
    riderPhone: "9876501234",
    orderRef: "ZOM-8831",
  });
  const [parcelCount, setParcelCount] = useState<number>(101);
  const parcelToken = `#P-${parcelCount}`;

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<TerminalAuditLog[]>([
    { id: "aud-01", timestamp: "09:30 AM", action: "Shift Start", staffName: "Rahul Sharma", details: "Terminal T1 shift opened with ₹5,000 opening float", type: "shift" },
    { id: "aud-02", timestamp: "10:00 AM", action: "Cash In", staffName: "Rahul Sharma", details: "+₹500 added for small change reserve", type: "cash" },
    { id: "aud-03", timestamp: "10:15 AM", action: "Hold Sale", staffName: "Rahul Sharma", details: "Sale #H001 (₹756) held for Table 04", type: "sale" },
    { id: "aud-04", timestamp: "10:45 AM", action: "Cash Out", staffName: "Rahul Sharma", details: "-₹100 petty cash paid for dairy supply", type: "cash" },
    { id: "aud-05", timestamp: "10:50 AM", action: "Completed Sale", staffName: "Rahul Sharma", details: "Order #1047 (₹336) settled via Card", type: "sale" },
  ]);

  const addAuditLog = (action: string, details: string, type: TerminalAuditLog["type"] = "security") => {
    const newEntry: TerminalAuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action,
      staffName: currentUser ? currentUser.name : "Rahul Sharma",
      details,
      type,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const verifyManagerPin = (pin: string): boolean => {
    // Priya Patel (Manager): 5678, Rahul Sharma (Admin): 1234
    return pin === "5678" || pin === "1234";
  };

  const playTerminalSound = (type: "scan" | "drawer" | "error" | "success" = "scan") => {
    playTerminalBeep(type);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Customers
  const [customers, setCustomers] = useState<TerminalCustomer[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<TerminalCustomer | null>(null);

  // Held Sales
  const [heldSales, setHeldSales] = useState<TerminalHeldSale[]>([
    {
      id: "H001",
      heldAt: "10:15 AM",
      orderType: "Dine-in",
      tableOrParcel: "Table 04",
      items: [
        { product: INITIAL_PRODUCTS[1], quantity: 2 },
        { product: INITIAL_PRODUCTS[3], quantity: 1 },
      ],
      subtotal: 720,
      discount: 0,
      tax: 36,
      total: 756,
      customerName: "Rahul Patel",
      note: "Customer stepped out for a call",
    },
    {
      id: "H002",
      heldAt: "10:45 AM",
      orderType: "Takeaway",
      tableOrParcel: "Parcel #023",
      items: [
        { product: INITIAL_PRODUCTS[6], quantity: 2 },
      ],
      subtotal: 480,
      discount: 0,
      tax: 24,
      total: 504,
      customerName: "Walk-in Customer",
      note: "Waiting for UPI approval",
    },
  ]);

  // Orders
  const [orders, setOrders] = useState<TerminalOrder[]>([
    {
      id: "ord-1045",
      orderNumber: "#1045",
      type: "Dine-in",
      tableOrParcel: "Table 05",
      items: [
        { product: INITIAL_PRODUCTS[1], quantity: 2 },
        { product: INITIAL_PRODUCTS[3], quantity: 1 },
      ],
      subtotal: 720,
      discount: 0,
      tax: 36,
      total: 756,
      customerName: "Sameer Joshi",
      customerPhone: "9845011223",
      status: "Preparing",
      createdAt: "11:15 AM",
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      kotPrinted: true,
    },
    {
      id: "ord-1046",
      orderNumber: "#1046",
      type: "Takeaway",
      tableOrParcel: "Parcel #023",
      items: [
        { product: INITIAL_PRODUCTS[4], quantity: 1 },
        { product: INITIAL_PRODUCTS[6], quantity: 1 },
      ],
      subtotal: 580,
      discount: 0,
      tax: 29,
      total: 609,
      customerName: "Anita Roy",
      status: "Ready",
      createdAt: "11:25 AM",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      kotPrinted: true,
    },
    {
      id: "ord-1047",
      orderNumber: "#1047",
      type: "Dine-in",
      tableOrParcel: "Table 02",
      items: [
        { product: INITIAL_PRODUCTS[0], quantity: 2 },
      ],
      subtotal: 320,
      discount: 0,
      tax: 16,
      total: 336,
      customerName: "Vikram Malhotra",
      status: "Completed",
      createdAt: "10:50 AM",
      paymentMethod: "Card",
      paymentStatus: "Paid",
      kotPrinted: true,
    },
  ]);

  // Offline & Hardware
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [hardware, setHardware] = useState<TerminalHardware>({
    receiptPrinter: true,
    cashDrawer: true,
    barcodeScanner: true,
    customerDisplay: true,
  });

  // Sync order statuses updated from KDS
  useEffect(() => {
    const handleKdsUpdate = (e: any) => {
      if (e.detail && e.detail.orderNumber) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderNumber === e.detail.orderNumber
              ? { ...o, status: e.detail.status }
              : o
          )
        );
      }
    };
    window.addEventListener("nuradesk:kds_order_updated", handleKdsUpdate);
    return () => window.removeEventListener("nuradesk:kds_order_updated", handleKdsUpdate);
  }, []);

  // Accurate Subtotal Calculation with Modifiers and Variants
  const getItemUnitPrice = (item: CartItem) => {
    const modExtra = item.selectedModifiers?.reduce((acc, m) => acc + m.extraPrice, 0) || 0;
    const variantPrice = item.selectedVariant ? item.selectedVariant.price : item.product.sellingPrice;
    return variantPrice + modExtra;
  };

  const subtotal = cart.reduce((acc, item) => acc + getItemUnitPrice(item) * item.quantity, 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const cgst = Math.round(taxableAmount * 0.025 * 100) / 100;
  const sgst = Math.round((taxableAmount * 0.05 - cgst) * 100) / 100;
  const tax = Math.round(taxableAmount * 0.05); // 5% GST
  const total = taxableAmount + tax;

  // Pairing actions
  const pairDevice = (code: string) => {
    if (code.trim().toUpperCase() === "NURA-84KF" || code.trim().length >= 6) {
      setIsPaired(true);
      return true;
    }
    return false;
  };

  const unpairDevice = () => {
    setIsPaired(false);
    setCurrentUser(null);
    setActiveShift(null);
  };

  // Staff actions
  const loginWithPin = (staffId: string, pin: string) => {
    const found = staffList.find((s) => s.id === staffId && s.pin === pin);
    if (found) {
      setCurrentUser(found);
      setIsLocked(false);
      addAuditLog("Staff Login", `${found.name} logged into terminal`, "security");
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog("Staff Logout", `${currentUser.name} logged out`, "security");
    }
    setCurrentUser(null);
  };

  const switchUser = () => {
    if (currentUser) {
      addAuditLog("Switch User", `${currentUser.name} requested switch user`, "security");
    }
    setCurrentUser(null);
  };

  const lockTerminal = () => {
    setIsLocked(true);
    addAuditLog("Lock Terminal", "Terminal locked by user", "security");
  };

  const unlockTerminal = (pin: string) => {
    if (currentUser && currentUser.pin === pin) {
      setIsLocked(false);
      addAuditLog("Unlock Terminal", "Terminal unlocked successfully", "security");
      return true;
    }
    // Admin fallback PIN
    if (pin === "1234") {
      setIsLocked(false);
      addAuditLog("Unlock Terminal", "Terminal unlocked with Master PIN", "security");
      return true;
    }
    return false;
  };

  // Shift actions
  const startShift = (openingCash: number) => {
    if (!currentUser) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActiveShift({
      id: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
      staffId: currentUser.id,
      staffName: currentUser.name,
      terminalId: pairedDevice.id,
      startTime: now,
      openingCash,
      cashSales: 0,
      upiSales: 0,
      cardSales: 0,
      walletSales: 0,
      cashIn: 0,
      cashOut: 0,
      cashRefunds: 0,
      status: "Active",
    });
    addAuditLog("Shift Started", `Opening float: ₹${openingCash.toLocaleString()}`, "shift");
  };

  const closeShift = (countedCash: number, notes?: string) => {
    if (!activeShift) return { expected: 0, counted: 0, diff: 0 };
    const expected = activeShift.openingCash + activeShift.cashSales + activeShift.cashIn - activeShift.cashOut - activeShift.cashRefunds;
    const diff = countedCash - expected;
    addAuditLog(
      "Shift Closed",
      `Expected: ₹${expected.toLocaleString()}, Counted: ₹${countedCash.toLocaleString()}, Variance: ₹${diff.toLocaleString()}`,
      "shift"
    );
    setActiveShift(null);
    setCurrentUser(null);
    return { expected, counted: countedCash, diff };
  };

  const addCashIn = (amount: number, reason: string) => {
    if (!activeShift) return;
    setActiveShift((prev) => prev ? { ...prev, cashIn: prev.cashIn + amount } : null);
    addAuditLog("Cash In", `+₹${amount.toLocaleString()} — ${reason}`, "cash");
    playTerminalSound("drawer");
  };

  const addCashOut = (amount: number, reason: string) => {
    if (!activeShift) return;
    setActiveShift((prev) => prev ? { ...prev, cashOut: prev.cashOut + amount } : null);
    addAuditLog("Cash Out", `-₹${amount.toLocaleString()} — ${reason}`, "cash");
    playTerminalSound("drawer");
  };

  // Cart actions
  const addToCart = (
    product: Product,
    note?: string,
    selectedModifiers?: { name: string; extraPrice: number }[],
    selectedVariant?: any
  ) => {
    playTerminalSound("scan");
    const modKey = selectedModifiers?.map((m) => `${m.name}:${m.extraPrice}`).sort().join("|") || "";
    const varKey = selectedVariant?.name || "";

    setCart((prev) => {
      const idx = prev.findIndex((item) => {
        const itemModKey = item.selectedModifiers?.map((m) => `${m.name}:${m.extraPrice}`).sort().join("|") || "";
        const itemVarKey = item.selectedVariant?.name || "";
        return item.product.id === product.id && itemModKey === modKey && itemVarKey === varKey;
      });

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + 1,
          notes: note || next[idx].notes,
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          notes: note,
          selectedModifiers,
          selectedVariant,
        },
      ];
    });
  };

  const updateCartQuantity = (productIdOrIndex: string | number, delta: number) => {
    setCart((prev) => {
      if (typeof productIdOrIndex === "number") {
        return prev
          .map((item, idx) => {
            if (idx === productIdOrIndex) {
              const newQ = item.quantity + delta;
              return newQ > 0 ? { ...item, quantity: newQ } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];
      }
      return prev
        .map((item) => {
          if (item.product.id === productIdOrIndex) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productIdOrIndex: string | number) => {
    setCart((prev) => {
      if (typeof productIdOrIndex === "number") {
        return prev.filter((_, idx) => idx !== productIdOrIndex);
      }
      return prev.filter((item) => item.product.id !== productIdOrIndex);
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomer(null);
  };

  // Customers
  const addCustomer = (name: string, phone: string) => {
    const newCust: TerminalCustomer = {
      id: `c-${Date.now()}`,
      name,
      phone,
      totalVisits: 1,
      creditBalance: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    setSelectedCustomer(newCust);
    addAuditLog("Customer Created", `${name} (${phone}) added to directory`, "security");
    return newCust;
  };

  // Hold Sale
  const holdCurrentSale = (note?: string) => {
    if (cart.length === 0) return;
    const newHeld: TerminalHeldSale = {
      id: `H00${heldSales.length + 1}`,
      heldAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      orderType,
      tableOrParcel: selectedTableOrParcel,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax,
      total,
      customerName: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
      note: note || "Held at counter",
    };
    setHeldSales((prev) => [newHeld, ...prev]);
    addAuditLog("Hold Sale", `Sale #${newHeld.id} (₹${total}) held: ${newHeld.note}`, "sale");
    clearCart();
  };

  const resumeHeldSale = (id: string) => {
    const found = heldSales.find((h) => h.id === id);
    if (!found) return;
    setCart(found.items);
    setOrderType(found.orderType);
    setSelectedTableOrParcel(found.tableOrParcel);
    setDiscountAmount(found.discount);
    setHeldSales((prev) => prev.filter((h) => h.id !== id));
    addAuditLog("Resume Sale", `Resumed held sale #${id} for ${found.tableOrParcel}`, "sale");
    setActiveView("new_sale");
  };

  const deleteHeldSale = (id: string) => {
    setHeldSales((prev) => prev.filter((h) => h.id !== id));
    addAuditLog("Delete Held Sale", `Held sale #${id} discarded`, "sale");
  };

  // Kitchen Send (KOT)
  const sendToKitchen = () => {
    const newOrder: TerminalOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#${Math.floor(1050 + Math.random() * 500)}`,
      type: orderType,
      tableOrParcel: selectedTableOrParcel,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax,
      total,
      customerName: selectedCustomer ? selectedCustomer.name : "Guest",
      customerPhone: selectedCustomer?.phone,
      status: "Preparing",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      paymentStatus: "Pending",
      kotPrinted: true,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If dine-in, mark table occupied with bill
    if (orderType === "Dine-in") {
      setTables((prev) =>
        prev.map((t) =>
          t.name === selectedTableOrParcel
            ? { ...t, status: "Occupied", currentBill: total, activeOrderNumber: newOrder.orderNumber }
            : t
        )
      );
    }

    addAuditLog("Sent to Kitchen", `KOT sent for ${newOrder.orderNumber} (${selectedTableOrParcel})`, "sale");
    playTerminalSound("success");
    clearCart();

    // Broadcast to Kitchen Display System (KDS)
    if (typeof window !== "undefined") {
      localStorage.setItem("nuradesk_terminal_kot", JSON.stringify(newOrder));
      window.dispatchEvent(new CustomEvent("nuradesk:kot_sent", { detail: newOrder }));
    }

    return newOrder;
  };

  // Complete Payment & Sale
  const completeSale = (method: PaymentMethod, tenderAmount?: number) => {
    const finalTableOrParcel = orderType === "Takeaway" ? parcelToken : selectedTableOrParcel;
    const saleOrder: TerminalOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#${Math.floor(1050 + Math.random() * 500)}`,
      type: orderType,
      tableOrParcel: finalTableOrParcel,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax,
      total,
      customerName: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
      customerPhone: selectedCustomer?.phone,
      status: "Completed",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      paymentMethod: method,
      paymentStatus: "Paid",
      kotPrinted: true,
    };

    setOrders((prev) => [saleOrder, ...prev]);

    // Update Shift Metrics
    if (activeShift) {
      setActiveShift((prev) => {
        if (!prev) return null;
        if (method === "Cash") {
          return { ...prev, cashSales: prev.cashSales + total };
        } else if (method === "UPI") {
          return { ...prev, upiSales: prev.upiSales + total };
        } else if (method === "Card") {
          return { ...prev, cardSales: prev.cardSales + total };
        } else {
          return { ...prev, walletSales: prev.walletSales + total };
        }
      });
    }

    // Increment Takeaway parcel token
    if (orderType === "Takeaway") {
      setParcelCount((prev) => prev + 1);
    }

    // Release table if Dine-in
    if (orderType === "Dine-in") {
      releaseTable(selectedTableOrParcel);
    }

    // If offline, add to queue
    if (isOffline) {
      setOfflineQueue((prev) => [...prev, saleOrder]);
    }

    addAuditLog(
      "Payment Completed",
      `Order ${saleOrder.orderNumber} (₹${total}) settled via ${method}`,
      "sale"
    );
    playTerminalSound("success");
    clearCart();
    return saleOrder;
  };

  // Refund Order
  const refundOrder = (orderId: string, reason: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.paymentStatus === "Refunded") return false;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "Refunded", status: "Completed" } : o))
    );

    if (activeShift && order.paymentMethod === "Cash") {
      setActiveShift((prev) => prev ? { ...prev, cashRefunds: prev.cashRefunds + order.total } : null);
    }

    addAuditLog("Refund Processed", `Order ${order.orderNumber} (₹${order.total}) refunded: ${reason}`, "refund");
    playTerminalSound("drawer");
    return true;
  };

  // Void Order
  const voidOrder = (orderId: string, reason: string) => {
    const order = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Voided" } : o))
    );
    addAuditLog("Order Voided", `Order ${order?.orderNumber || orderId} cancelled: ${reason}`, "void");
    playTerminalSound("error");
    return true;
  };

  // Offline
  const toggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev;
      addAuditLog("Network State", `Terminal switched to ${next ? "Offline" : "Online"} mode`, "security");
      return next;
    });
  };

  const syncOfflineQueue = () => {
    const count = offlineQueue.length;
    setOfflineQueue([]);
    addAuditLog("Offline Sync", `Synced ${count} offline transactions to cloud server`, "sale");
    playTerminalSound("success");
    return count;
  };

  const toggleHardware = (key: keyof TerminalHardware) => {
    setHardware((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <TerminalContext.Provider
      value={{
        isPaired,
        pairedDevice,
        pairDevice,
        unpairDevice,
        staffList,
        currentUser,
        loginWithPin,
        logout,
        switchUser,
        isLocked,
        lockTerminal,
        unlockTerminal,
        verifyManagerPin,
        activeShift,
        startShift,
        closeShift,
        addCashIn,
        addCashOut,
        activeView,
        setActiveView,
        orderType,
        setOrderType,
        selectedTableOrParcel,
        setSelectedTableOrParcel,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        discountAmount,
        setDiscountAmount,
        subtotal,
        cgst,
        sgst,
        tax,
        total,
        customers,
        selectedCustomer,
        setSelectedCustomer,
        addCustomer,
        tables,
        selectTable,
        releaseTable,
        deliveryDetails,
        setDeliveryDetails,
        parcelToken,
        heldSales,
        holdCurrentSale,
        resumeHeldSale,
        deleteHeldSale,
        orders,
        sendToKitchen,
        completeSale,
        refundOrder,
        voidOrder,
        isOffline,
        toggleOffline,
        offlineQueueCount: offlineQueue.length,
        syncOfflineQueue,
        hardware,
        toggleHardware,
        playTerminalSound,
        auditLogs,
        addAuditLog,
        products: INITIAL_PRODUCTS,
        categories: ["All", "Coffee", "Food", "Drinks", "Bakery", "Desserts"],
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminalStore = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminalStore must be used within a TerminalProvider");
  }
  return context;
};
