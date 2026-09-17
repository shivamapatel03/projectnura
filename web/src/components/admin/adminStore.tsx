"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Outlet,
  Product,
  Staff,
  Device,
  Order,
  Sale,
  PaymentTransaction,
  StockMovement,
  Shift,
  CartItem,
  AdminTab,
} from "./types";

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  selectedOutlet: Outlet;
  setSelectedOutlet: (outlet: Outlet) => void;
  outlets: Outlet[];

  // Products
  products: Product[];
  categories: string[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Staff
  staffList: Staff[];
  addStaff: (staff: Omit<Staff, "id" | "joinedDate">) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Devices / Terminals
  devices: Device[];
  addDevice: (device: Omit<Device, "id" | "lastSync">) => void;
  updateDeviceStatus: (id: string, status: Device["status"]) => void;

  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;

  // Sales
  sales: Sale[];
  createSale: (saleData: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: Sale["paymentMethod"];
    customerName: string;
    customerPhone?: string;
    orderType?: Order["type"];
    tableOrParcel?: string;
    terminalCode?: string;
    staffName?: string;
  }) => Sale;
  refundSale: (id: string) => void;

  // Payments
  payments: PaymentTransaction[];

  // Inventory
  stockMovements: StockMovement[];
  adjustStock: (productId: string, quantityChange: number, reason: string) => void;

  // Shift & POS Session
  currentShift: Shift | null;
  startShift: (staffId: string, terminalCode: string, openingCash: number) => void;
  endShift: (actualCash: number) => void;

  // Global Modals / UI
  isAddProductOpen: boolean;
  setIsAddProductOpen: (open: boolean) => void;
  isAddStaffOpen: boolean;
  setIsAddStaffOpen: (open: boolean) => void;
  isAddDeviceOpen: boolean;
  setIsAddDeviceOpen: (open: boolean) => void;
  isPosModalOpen: boolean;
  setIsPosModalOpen: (open: boolean) => void;
  selectedSaleDetail: Sale | null;
  setSelectedSaleDetail: (sale: Sale | null) => void;
}

const INITIAL_OUTLETS: Outlet[] = [
  {
    id: "out-1",
    name: "Main Branch (Indiranagar)",
    code: "MB-01",
    address: "100 Feet Rd, Indiranagar, Bengaluru",
    phone: "+91 80 4123 9081",
    isMain: true,
  },
  {
    id: "out-2",
    name: "Koramangala Outlet",
    code: "KM-02",
    address: "5th Block, Koramangala, Bengaluru",
    phone: "+91 80 2553 4410",
  },
  {
    id: "out-3",
    name: "Whitefield Flagship",
    code: "WF-03",
    address: "ITPL Main Rd, Whitefield, Bengaluru",
    phone: "+91 80 6712 3344",
  },
];

const INITIAL_CATEGORIES = [
  "All",
  "Beverages",
  "Bakery & Toast",
  "Brunch Specials",
  "Desserts",
  "Retail & Beans",
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Artisan Cappuccino",
    category: "Beverages",
    sellingPrice: 240,
    costPrice: 65,
    taxRate: 5,
    sku: "BEV-CAP-001",
    barcode: "89012345001",
    inventoryTracking: true,
    stock: 145,
    lowStockThreshold: 20,
    status: "In Stock",
    active: true,
    kitchenStation: "Bar",
    modifiers: [
      {
        id: "mod-1",
        name: "Milk Choice",
        options: [
          { name: "Regular Dairy", extraPrice: 0 },
          { name: "Oat Milk", extraPrice: 45 },
          { name: "Almond Milk", extraPrice: 50 },
        ],
      },
    ],
    variants: [
      { id: "var-1", name: "Regular (240ml)", price: 240, sku: "BEV-CAP-REG" },
      { id: "var-2", name: "Large (360ml)", price: 290, sku: "BEV-CAP-LRG" },
    ],
  },
  {
    id: "prod-2",
    name: "Truffle Mushroom Melt",
    category: "Brunch Specials",
    sellingPrice: 480,
    costPrice: 160,
    taxRate: 5,
    sku: "FD-TRF-002",
    barcode: "89012345002",
    inventoryTracking: true,
    stock: 42,
    lowStockThreshold: 10,
    status: "In Stock",
    active: true,
    kitchenStation: "Kitchen",
    modifiers: [
      {
        id: "mod-2",
        name: "Add-ons",
        options: [
          { name: "Extra Truffle Glaze", extraPrice: 60 },
          { name: "Smoked Cheddar", extraPrice: 50 },
        ],
      },
    ],
  },
  {
    id: "prod-3",
    name: "Belgian Dark Chocolate Croissant",
    category: "Bakery & Toast",
    sellingPrice: 220,
    costPrice: 70,
    taxRate: 5,
    sku: "BAK-CRS-003",
    barcode: "89012345003",
    inventoryTracking: true,
    stock: 18,
    lowStockThreshold: 15,
    status: "In Stock",
    active: true,
    kitchenStation: "Kitchen",
  },
  {
    id: "prod-4",
    name: "Japanese Ceremonial Matcha",
    category: "Beverages",
    sellingPrice: 290,
    costPrice: 95,
    taxRate: 5,
    sku: "BEV-MTC-004",
    barcode: "89012345004",
    inventoryTracking: true,
    stock: 8,
    lowStockThreshold: 12,
    status: "Low Stock",
    active: true,
    kitchenStation: "Bar",
  },
  {
    id: "prod-5",
    name: "Cold Brew Reserve",
    category: "Beverages",
    sellingPrice: 260,
    costPrice: 60,
    taxRate: 5,
    sku: "BEV-CLD-005",
    barcode: "89012345005",
    inventoryTracking: true,
    stock: 55,
    lowStockThreshold: 15,
    status: "In Stock",
    active: true,
    kitchenStation: "Bar",
  },
  {
    id: "prod-6",
    name: "Avocado Sourdough Toast",
    category: "Brunch Specials",
    sellingPrice: 390,
    costPrice: 130,
    taxRate: 5,
    sku: "BRN-AVO-006",
    barcode: "89012345006",
    inventoryTracking: true,
    stock: 32,
    lowStockThreshold: 10,
    status: "In Stock",
    active: true,
    kitchenStation: "Kitchen",
  },
  {
    id: "prod-7",
    name: "Madagascar Vanilla Bean Gelato",
    category: "Desserts",
    sellingPrice: 210,
    costPrice: 65,
    taxRate: 5,
    sku: "DES-GEL-007",
    barcode: "89012345007",
    inventoryTracking: true,
    stock: 24,
    lowStockThreshold: 10,
    status: "In Stock",
    active: true,
    kitchenStation: "Dessert",
  },
  {
    id: "prod-8",
    name: "Estate Blend Whole Beans (250g)",
    category: "Retail & Beans",
    sellingPrice: 550,
    costPrice: 240,
    taxRate: 12,
    sku: "RTL-COF-008",
    barcode: "89012345008",
    inventoryTracking: true,
    stock: 35,
    lowStockThreshold: 8,
    status: "In Stock",
    active: true,
    brand: "Nuradesk Reserve",
    unit: "pcs",
    supplier: "Chikmagalur Coffee Co.",
  },
];

const INITIAL_STAFF: Staff[] = [
  {
    id: "stf-1",
    name: "Rahul Sharma",
    email: "rahul@nuradesk.com",
    phone: "+91 98450 12345",
    role: "Owner",
    pin: "1234",
    outletIds: ["out-1", "out-2", "out-3"],
    permissions: {
      canDiscount: true,
      canRefund: true,
      canVoid: true,
      canViewReports: true,
      canManageInventory: true,
      canManageStaff: true,
    },
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    status: "On Shift",
    joinedDate: "Jan 2024",
  },
  {
    id: "stf-2",
    name: "Priya Patel",
    email: "priya@nuradesk.com",
    phone: "+91 98860 67890",
    role: "Store Manager",
    pin: "2244",
    outletIds: ["out-1"],
    permissions: {
      canDiscount: true,
      canRefund: true,
      canVoid: true,
      canViewReports: true,
      canManageInventory: true,
      canManageStaff: false,
    },
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    status: "Active",
    joinedDate: "Mar 2024",
  },
  {
    id: "stf-3",
    name: "Amit Verma",
    email: "amit.v@nuradesk.com",
    phone: "+91 99012 34567",
    role: "Cashier",
    pin: "5566",
    outletIds: ["out-1"],
    permissions: {
      canDiscount: false,
      canRefund: false,
      canVoid: false,
      canViewReports: false,
      canManageInventory: false,
      canManageStaff: false,
    },
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    status: "Active",
    joinedDate: "Jun 2024",
  },
  {
    id: "stf-4",
    name: "Chef Vikram Nair",
    email: "vikram@nuradesk.com",
    phone: "+91 97410 88990",
    role: "Kitchen Chef",
    pin: "7788",
    outletIds: ["out-1"],
    permissions: {
      canDiscount: false,
      canRefund: false,
      canVoid: false,
      canViewReports: false,
      canManageInventory: true,
      canManageStaff: false,
    },
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    status: "Active",
    joinedDate: "Feb 2024",
  },
];

const INITIAL_DEVICES: Device[] = [
  {
    id: "dev-1",
    code: "T1",
    name: "T1 — Main Counter POS",
    type: "POS Terminal",
    outletId: "out-1",
    outletName: "Main Branch",
    status: "Online",
    ip: "192.168.1.101",
    battery: "100% (AC)",
    pairedCode: "ND-9182",
    lastSync: "Just now",
  },
  {
    id: "dev-2",
    code: "T2",
    name: "T2 — Drive-Thru / Takeaway",
    type: "POS Terminal",
    outletId: "out-1",
    outletName: "Main Branch",
    status: "Online",
    ip: "192.168.1.102",
    battery: "94%",
    pairedCode: "ND-4412",
    lastSync: "2m ago",
  },
  {
    id: "dev-3",
    code: "K1",
    name: "K1 — Main Kitchen Display",
    type: "Kitchen Display",
    outletId: "out-1",
    outletName: "Main Branch",
    status: "Online",
    ip: "192.168.1.105",
    pairedCode: "ND-8831",
    lastSync: "Just now",
  },
  {
    id: "dev-4",
    code: "CD1",
    name: "CD1 — Customer Facing Screen",
    type: "Customer Display",
    outletId: "out-1",
    outletName: "Main Branch",
    status: "Online",
    ip: "192.168.1.108",
    pairedCode: "ND-6610",
    lastSync: "5m ago",
  },
  {
    id: "dev-5",
    code: "P1",
    name: "P1 — 80mm Receipt Printer",
    type: "Receipt Printer",
    outletId: "out-1",
    outletName: "Main Branch",
    status: "Online",
    ip: "192.168.1.110",
    pairedCode: "ND-2299",
    lastSync: "Ready",
  },
  {
    id: "dev-6",
    code: "D1",
    name: "D1 — Automatic Cash Drawer",
    type: "Cash Drawer",
    outletId: "out-1",
    outletName: "Main Branch",
    status: "Online",
    ip: "Port: RJ12 P1",
    pairedCode: "ND-0012",
    lastSync: "Closed",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1045",
    orderNumber: "#1045",
    type: "Dine-in",
    tableNumber: "Table 05",
    customerName: "Sameer Joshi",
    customerPhone: "9845011223",
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
    ],
    subtotal: 960,
    tax: 48,
    discount: 0,
    total: 1008,
    status: "Preparing",
    createdAt: "10m ago",
    terminalCode: "T1",
    cashierName: "Rahul Sharma",
  },
  {
    id: "ord-1046",
    orderNumber: "#1046",
    type: "Takeaway",
    parcelNumber: "Parcel #23",
    customerName: "Ananya Rao",
    customerPhone: "9886044332",
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 2 },
      { product: INITIAL_PRODUCTS[4], quantity: 1 },
    ],
    subtotal: 700,
    tax: 35,
    discount: 50,
    total: 685,
    status: "Ready",
    createdAt: "18m ago",
    terminalCode: "T2",
    cashierName: "Amit Verma",
  },
  {
    id: "ord-1044",
    orderNumber: "#1044",
    type: "Dine-in",
    tableNumber: "Table 02",
    customerName: "Julie Williams",
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 2 },
      { product: INITIAL_PRODUCTS[4], quantity: 2 },
    ],
    subtotal: 1480,
    tax: 74,
    discount: 0,
    total: 1554,
    status: "Completed",
    createdAt: "35m ago",
    terminalCode: "T1",
    cashierName: "Rahul Sharma",
  },
];

const INITIAL_SALES: Sale[] = [
  {
    id: "sale-1084",
    invoiceNumber: "INV-1084",
    orderId: "ord-1044",
    date: "17 Sep 2026",
    time: "03:14 PM",
    outlet: "Main Branch",
    terminal: "T1 — Main Counter",
    staffName: "Rahul Sharma",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98450 11029",
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[2], quantity: 1 },
    ],
    subtotal: 700,
    discount: 0,
    tax: 35,
    total: 735,
    paymentMethod: "UPI",
    status: "Completed",
  },
  {
    id: "sale-1083",
    invoiceNumber: "INV-1083",
    date: "17 Sep 2026",
    time: "03:02 PM",
    outlet: "Main Branch",
    terminal: "T1 — Main Counter",
    staffName: "Rahul Sharma",
    customerName: "Julie Williams",
    customerPhone: "+91 98860 90112",
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
      { product: INITIAL_PRODUCTS[4], quantity: 2 },
    ],
    subtotal: 1000,
    discount: 50,
    tax: 47.5,
    total: 997.5,
    paymentMethod: "Card",
    status: "Completed",
  },
  {
    id: "sale-1082",
    invoiceNumber: "INV-1082",
    date: "17 Sep 2026",
    time: "02:48 PM",
    outlet: "Main Branch",
    terminal: "T2 — Drive-Thru",
    staffName: "Amit Verma",
    customerName: "Michael Philips",
    items: [{ product: INITIAL_PRODUCTS[4], quantity: 1 }],
    subtotal: 260,
    discount: 0,
    tax: 13,
    total: 273,
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "sale-1081",
    invoiceNumber: "INV-1081",
    date: "17 Sep 2026",
    time: "02:35 PM",
    outlet: "Main Branch",
    terminal: "T1 — Main Counter",
    staffName: "Rahul Sharma",
    customerName: "Sarah Jenkins",
    items: [
      { product: INITIAL_PRODUCTS[5], quantity: 1 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 },
    ],
    subtotal: 680,
    discount: 0,
    tax: 34,
    total: 714,
    paymentMethod: "UPI",
    status: "Completed",
  },
  {
    id: "sale-1080",
    invoiceNumber: "INV-1080",
    date: "17 Sep 2026",
    time: "02:18 PM",
    outlet: "Main Branch",
    terminal: "T1 — Main Counter",
    staffName: "Rahul Sharma",
    customerName: "Devin Vance",
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 2 },
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
    ],
    subtotal: 680,
    discount: 0,
    tax: 34,
    total: 714,
    paymentMethod: "UPI",
    status: "Completed",
  },
];

const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: "pay-1",
    transactionId: "TXN-8921004",
    saleInvoice: "INV-1084",
    amount: 735,
    method: "UPI",
    status: "Success",
    date: "17 Sep 2026",
    time: "03:14 PM",
    customer: "Rahul Sharma",
    gatewayRef: "UPI/PhonePe/91823901",
  },
  {
    id: "pay-2",
    transactionId: "TXN-8921003",
    saleInvoice: "INV-1083",
    amount: 997.5,
    method: "Card",
    status: "Success",
    date: "17 Sep 2026",
    time: "03:02 PM",
    customer: "Julie Williams",
    gatewayRef: "HDFC/VISA/4491",
  },
  {
    id: "pay-3",
    transactionId: "TXN-8921002",
    saleInvoice: "INV-1082",
    amount: 273,
    method: "Cash",
    status: "Success",
    date: "17 Sep 2026",
    time: "02:48 PM",
    customer: "Michael Philips",
  },
  {
    id: "pay-4",
    transactionId: "TXN-8921001",
    saleInvoice: "INV-1081",
    amount: 714,
    method: "UPI",
    status: "Success",
    date: "17 Sep 2026",
    time: "02:35 PM",
    customer: "Sarah Jenkins",
    gatewayRef: "UPI/GPay/88123004",
  },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: "mov-1",
    date: "17 Sep 2026, 03:14 PM",
    productId: "prod-1",
    productName: "Artisan Cappuccino",
    type: "Sale",
    quantity: -2,
    previousStock: 147,
    newStock: 145,
    user: "Rahul Sharma (T1)",
  },
  {
    id: "mov-2",
    date: "17 Sep 2026, 02:00 PM",
    productId: "prod-3",
    productName: "Belgian Dark Chocolate Croissant",
    type: "Purchase Inward",
    quantity: 25,
    previousStock: 5,
    newStock: 30,
    reason: "Bakery Batch #12",
    user: "Priya Patel",
  },
  {
    id: "mov-3",
    date: "17 Sep 2026, 11:30 AM",
    productId: "prod-4",
    productName: "Japanese Ceremonial Matcha",
    type: "Adjustment",
    quantity: -2,
    previousStock: 10,
    newStock: 8,
    reason: "Barista Training",
    user: "Rahul Sharma",
  },
];

const INITIAL_SHIFT: Shift = {
  id: "shf-1",
  staffId: "stf-1",
  staffName: "Rahul Sharma",
  terminalCode: "T1",
  outletName: "Main Branch",
  startTime: "09:00 AM, Today",
  openingCash: 5000,
  expectedCash: 12450,
  cashSales: 7450,
  upiSales: 28420,
  cardSales: 12650,
  totalSales: 48520,
  status: "Open",
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>(INITIAL_OUTLETS[0]);
  const [outlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [currentShift, setCurrentShift] = useState<Shift | null>(INITIAL_SHIFT);

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  // Product Actions
  const addProduct = (newProd: Omit<Product, "id">) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);

    // Add inventory movement
    if (product.stock > 0) {
      setStockMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          date: "Just now",
          productId: id,
          productName: product.name,
          type: "Purchase Inward",
          quantity: product.stock,
          previousStock: 0,
          newStock: product.stock,
          reason: "Initial catalog stock",
          user: "Admin",
        },
        ...prev,
      ]);
    }

    if (!categories.includes(product.category)) {
      setCategories((prev) => [...prev, product.category]);
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Staff Actions
  const addStaff = (newStaff: Omit<Staff, "id" | "joinedDate">) => {
    const id = `stf-${Date.now()}`;
    const staff: Staff = {
      ...newStaff,
      id,
      joinedDate: "Today",
    };
    setStaffList((prev) => [staff, ...prev]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  // Device Actions
  const addDevice = (newDev: Omit<Device, "id" | "lastSync">) => {
    const id = `dev-${Date.now()}`;
    const device: Device = {
      ...newDev,
      id,
      lastSync: "Just paired",
    };
    setDevices((prev) => [...prev, device]);
  };

  const updateDeviceStatus = (id: string, status: Device["status"]) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, lastSync: "Just now" } : d))
    );
  };

  // Order Actions
  const createOrder = (orderData: Omit<Order, "id" | "createdAt">): Order => {
    const order: Order = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-4)}`,
      createdAt: "Just now",
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // Sale Actions: Creates live sale + payment record + updates inventory + updates shift!
  const createSale = (saleData: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: Sale["paymentMethod"];
    customerName: string;
    customerPhone?: string;
    orderType?: Order["type"];
    tableOrParcel?: string;
    terminalCode?: string;
    staffName?: string;
  }): Sale => {
    const saleId = `sale-${Date.now().toString().slice(-4)}`;
    const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSale: Sale = {
      id: saleId,
      invoiceNumber,
      date: "17 Sep 2026",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      outlet: selectedOutlet.name,
      terminal: saleData.terminalCode || "T1 — Main Counter",
      staffName: saleData.staffName || "Rahul Sharma",
      customerName: saleData.customerName || "Walk-in Customer",
      customerPhone: saleData.customerPhone,
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      tax: saleData.tax,
      total: saleData.total,
      paymentMethod: saleData.paymentMethod,
      status: "Completed",
    };

    setSales((prev) => [newSale, ...prev]);

    // 1. Record payment transaction
    const newTxn: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      saleInvoice: invoiceNumber,
      amount: saleData.total,
      method: saleData.paymentMethod,
      status: "Success",
      date: "17 Sep 2026",
      time: newSale.time,
      customer: newSale.customerName,
      gatewayRef:
        saleData.paymentMethod === "UPI"
          ? `UPI/Live/${Math.floor(100000 + Math.random() * 900000)}`
          : saleData.paymentMethod === "Card"
          ? `VISA/Auth/${Math.floor(1000 + Math.random() * 9000)}`
          : undefined,
    };
    setPayments((prev) => [newTxn, ...prev]);

    // 2. Decrement inventory and log movements
    saleData.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.product.id) {
            const updatedStock = Math.max(0, p.stock - item.quantity);
            const status =
              updatedStock === 0
                ? "Out of Stock"
                : updatedStock <= p.lowStockThreshold
                ? "Low Stock"
                : "In Stock";
            return { ...p, stock: updatedStock, status };
          }
          return p;
        })
      );

      setStockMovements((prev) => [
        {
          id: `mov-${Date.now()}-${item.product.id}`,
          date: "Just now",
          productId: item.product.id,
          productName: item.product.name,
          type: "Sale",
          quantity: -item.quantity,
          previousStock: item.product.stock,
          newStock: Math.max(0, item.product.stock - item.quantity),
          reason: `Sale ${invoiceNumber}`,
          user: `${newSale.staffName} (${newSale.terminal})`,
        },
        ...prev,
      ]);
    });

    // 3. Update current shift totals
    if (currentShift) {
      setCurrentShift((prev) => {
        if (!prev) return null;
        const cashAdd = saleData.paymentMethod === "Cash" ? saleData.total : 0;
        const upiAdd = saleData.paymentMethod === "UPI" ? saleData.total : 0;
        const cardAdd = saleData.paymentMethod === "Card" ? saleData.total : 0;
        return {
          ...prev,
          totalSales: prev.totalSales + saleData.total,
          cashSales: prev.cashSales + cashAdd,
          upiSales: prev.upiSales + upiAdd,
          cardSales: prev.cardSales + cardAdd,
          expectedCash: prev.expectedCash + cashAdd,
        };
      });
    }

    return newSale;
  };

  const refundSale = (saleId: string) => {
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: "Refunded" } : s))
    );
    setPayments((prev) =>
      prev.map((p) => {
        const matchingSale = sales.find((s) => s.id === saleId);
        if (matchingSale && p.saleInvoice === matchingSale.invoiceNumber) {
          return { ...p, status: "Refunded" };
        }
        return p;
      })
    );
  };

  const adjustStock = (productId: string, quantityChange: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + quantityChange);
          const status =
            newStock === 0
              ? "Out of Stock"
              : newStock <= p.lowStockThreshold
              ? "Low Stock"
              : "In Stock";
          return { ...p, stock: newStock, status };
        }
        return p;
      })
    );

    const product = products.find((p) => p.id === productId);
    if (product) {
      setStockMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          date: "Just now",
          productId,
          productName: product.name,
          type: "Adjustment",
          quantity: quantityChange,
          previousStock: product.stock,
          newStock: Math.max(0, product.stock + quantityChange),
          reason,
          user: "Manager",
        },
        ...prev,
      ]);
    }
  };

  const startShift = (staffId: string, terminalCode: string, openingCash: number) => {
    const staff = staffList.find((s) => s.id === staffId);
    const newShift: Shift = {
      id: `shf-${Date.now()}`,
      staffId,
      staffName: staff ? staff.name : "Staff",
      terminalCode,
      outletName: selectedOutlet.name,
      startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", Today",
      openingCash,
      expectedCash: openingCash,
      cashSales: 0,
      upiSales: 0,
      cardSales: 0,
      totalSales: 0,
      status: "Open",
    };
    setCurrentShift(newShift);
  };

  const endShift = (actualCash: number) => {
    if (currentShift) {
      setCurrentShift((prev) => (prev ? { ...prev, actualCash, status: "Closed" } : null));
    }
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedOutlet,
        setSelectedOutlet,
        outlets,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        staffList,
        addStaff,
        updateStaff,
        deleteStaff,
        devices,
        addDevice,
        updateDeviceStatus,
        orders,
        createOrder,
        updateOrderStatus,
        sales,
        createSale,
        refundSale,
        payments,
        stockMovements,
        adjustStock,
        currentShift,
        startShift,
        endShift,
        isAddProductOpen,
        setIsAddProductOpen,
        isAddStaffOpen,
        setIsAddStaffOpen,
        isAddDeviceOpen,
        setIsAddDeviceOpen,
        isPosModalOpen,
        setIsPosModalOpen,
        selectedSaleDetail,
        setSelectedSaleDetail,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminProvider");
  }
  return context;
};
