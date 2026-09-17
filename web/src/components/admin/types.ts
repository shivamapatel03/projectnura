export type AdminTab =
  | "dashboard"
  | "pos"
  | "sales"
  | "orders"
  | "products"
  | "inventory"
  | "billing"
  | "payments"
  | "staff"
  | "terminals"
  | "reports"
  | "settings";

export interface Outlet {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isMain?: boolean;
}

export interface ProductModifier {
  id: string;
  name: string;
  options: { name: string; extraPrice: number }[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Regular", "Large"
  price: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  taxRate: number; // e.g. 5, 12, 18
  sku: string;
  barcode: string;
  image?: string;
  inventoryTracking: boolean;
  stock: number;
  lowStockThreshold: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  active: boolean;
  // Restaurant specific
  modifiers?: ProductModifier[];
  variants?: ProductVariant[];
  kitchenStation?: "Kitchen" | "Bar" | "Grill" | "Dessert";
  // Retail specific
  brand?: string;
  unit?: "pcs" | "kg" | "g" | "ltr" | "box";
  supplier?: string;
}

export type StaffRole = "Owner" | "Store Manager" | "Cashier" | "Waiter" | "Kitchen Chef";

export interface StaffPermission {
  canDiscount: boolean;
  canRefund: boolean;
  canVoid: boolean;
  canViewReports: boolean;
  canManageInventory: boolean;
  canManageStaff: boolean;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  pin: string; // 4-digit PIN for POS login
  outletIds: string[];
  permissions: StaffPermission;
  avatar: string;
  status: "Active" | "On Shift" | "Inactive";
  joinedDate: string;
}

export type DeviceType =
  | "POS Terminal"
  | "Kitchen Display"
  | "Customer Display"
  | "Receipt Printer"
  | "Cash Drawer";

export interface Device {
  id: string;
  code: string; // e.g. T1, K1, P1
  name: string;
  type: DeviceType;
  outletId: string;
  outletName: string;
  status: "Online" | "Busy" | "Offline";
  ip: string;
  battery?: string;
  pairedCode?: string;
  lastSync: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedModifiers?: { name: string; extraPrice: number }[];
  notes?: string;
}

export type OrderType = "Dine-in" | "Takeaway" | "Delivery";
export type OrderStatus = "Open" | "Preparing" | "Ready" | "Completed" | "Cancelled";

export interface Order {
  id: string;
  orderNumber: string; // e.g. #1045
  type: OrderType;
  tableNumber?: string; // e.g. "Table 05"
  parcelNumber?: string; // e.g. "Parcel #23"
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  terminalCode: string;
  cashierName: string;
}

export type PaymentMethod = "Cash" | "UPI" | "Card" | "Wallet" | "Split";

export interface Sale {
  id: string;
  invoiceNumber: string; // e.g. INV-9821
  orderId?: string;
  date: string;
  time: string;
  outlet: string;
  terminal: string;
  staffName: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: "Completed" | "Refunded" | "Voided";
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string; // e.g. TXN-5829104
  saleInvoice: string;
  amount: number;
  method: PaymentMethod;
  status: "Success" | "Refunded" | "Failed";
  date: string;
  time: string;
  customer: string;
  gatewayRef?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: "Sale" | "Purchase Inward" | "Adjustment" | "Wastage" | "Transfer";
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason?: string;
  user: string;
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  terminalCode: string;
  outletName: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  expectedCash: number;
  actualCash?: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  totalSales: number;
  status: "Open" | "Closed";
}
