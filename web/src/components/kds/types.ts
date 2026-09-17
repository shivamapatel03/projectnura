export type KdsOrderStatus = "NEW" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type KdsOrderType = "Dine-in" | "Takeaway" | "Delivery";

export type KdsStation = "Main Kitchen" | "Bar" | "Dessert";

export interface KdsItem {
  id: string;
  name: string;
  quantity: number;
  station: KdsStation;
  modifiers?: string[];
  notes?: string;
  isCompleted?: boolean;
}

export interface KdsOrder {
  id: string;
  orderNumber: string;
  destination: string; // "TABLE 05", "PARCEL #023", "DELIVERY"
  orderType: KdsOrderType;
  deliveryPlatform?: "Zomato" | "Swiggy" | "Direct";
  items: KdsItem[];
  specialInstructions?: string;
  orderTime: string; // "12:42 PM"
  createdAt: number; // timestamp in ms
  startedAt?: number;
  readyAt?: number;
  completedAt?: number;
  status: KdsOrderStatus;
  targetMinutes: number; // default 10
  isNewAlert?: boolean;
}

export interface KdsDevice {
  id: string;
  name: string;
  station: string;
  outlet: string;
  cafeName: string;
  code: string;
  isPaired: boolean;
  pairedAt?: string;
}

export interface KdsSettings {
  kitchenName: string;
  selectedStation: string; // "All" | "Main Kitchen" | "Bar" | "Dessert"
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  displaySize: "compact" | "normal" | "large";
  targetMinutes: number; // default 10
  autoCompleteMinutes: number; // 0 = disabled
  language: string;
  theme: "dark" | "light";
}
