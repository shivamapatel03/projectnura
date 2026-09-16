export interface BusinessType {
  id: string;
  name: string;
  tagline: string;
  image: string;
  features: string[];
}

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "cafe",
    name: "Café",
    tagline: "Speed, barista modifiers, takeaway parcels & table orders.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    features: ["Quick Modifiers", "Barista Queue", "Table Ordering", "Split Bills"]
  },
  {
    id: "restaurant",
    name: "Restaurant",
    tagline: "Floor management, KOT, KDS, courses, guest counts & split billing.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    features: ["Visual Floor Plan", "Multi-KDS Routing", "Table Merging", "Captain App"]
  },
  {
    id: "retail",
    name: "Retail",
    tagline: "High-speed barcode scanning, SKU matrix, inventory & customer credit.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    features: ["Barcode Scanner", "SKU & Variants", "Low-Stock Alerts", "Customer Ledger"]
  },
  {
    id: "bakery",
    name: "Bakery",
    tagline: "Batch expiry tracking, custom cake orders & daily production sheets.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    features: ["Batch Management", "Expiry Dates", "Weight / Units", "Advance Orders"]
  },
  {
    id: "salon",
    name: "Salon & Spa",
    tagline: "Appointments, stylist commissions, service packages & client notes.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
    features: ["Stylist Allocation", "Service Duration", "Client History", "Package Billing"]
  },
  {
    id: "qsr",
    name: "QSR & Fast Food",
    tagline: "Rapid counter checkout, customer token queue & kitchen dispatch.",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
    features: ["Token Display", "Combo Sets", "Under-5s Checkout", "Kitchen Dispatch"]
  }
];

export interface IndustryFeatureTab {
  id: string;
  name: string;
  image: string;
  caption: string;
  features: {
    iconName: string;
    title: string;
    description: string;
  }[];
}

export const INDUSTRY_TABS: IndustryFeatureTab[] = [
  {
    id: "cafe",
    name: "Café",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
    caption: "Specialty coffee shops and bustling cafés running rapid counter orders, barista queues, and table service.",
    features: [
      {
        iconName: "Coffee",
        title: "Barista Queue",
        description: "Direct KOT routing to espresso station with customized cup modifiers."
      },
      {
        iconName: "Zap",
        title: "Rapid Modifiers",
        description: "Oat milk, extra shot, syrup, and temperature toggles in one tap."
      },
      {
        iconName: "ShoppingBag",
        title: "Counter & Takeaway",
        description: "Token generation for counter pickup and split bills for table guests."
      },
      {
        iconName: "Clock",
        title: "Rush Hour Speed",
        description: "Under-3-second transaction flow designed for morning peak traffic."
      }
    ]
  },
  {
    id: "bakeries",
    name: "Bakeries",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    caption: "Artisan bakeries & patisseries managing fast morning counter traffic and daily baked batches.",
    features: [
      {
        iconName: "Layers",
        title: "Item Variants",
        description: "Size, eggless, sugar-free, and sliced variations in one click."
      },
      {
        iconName: "Clock",
        title: "Batch Expiry",
        description: "Track shelf-life per bake and auto-discount evening batches."
      },
      {
        iconName: "Scale",
        title: "Weight / Units",
        description: "Seamless scale integration for weigh-and-pay pastries and breads."
      },
      {
        iconName: "ShoppingBag",
        title: "Counter & Takeaway",
        description: "Numbered parcel queue tickets for rapid takeaway handoffs."
      }
    ]
  },
  {
    id: "retail",
    name: "Retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    caption: "Boutiques, grocery, and specialty retail with deep catalog hierarchies and instant barcode flow.",
    features: [
      {
        iconName: "Scan",
        title: "Barcode Engine",
        description: "Instant USB / Bluetooth barcode lookup with sub-second cart add."
      },
      {
        iconName: "Package",
        title: "Inventory Matrix",
        description: "Live multi-tier stock counts with automated purchase order generation."
      },
      {
        iconName: "Users",
        title: "Customer Credit",
        description: "Store credit ledgers, purchase history, and WhatsApp receipts."
      },
      {
        iconName: "Truck",
        title: "Suppliers & POs",
        description: "Direct vendor bills with automatic cost price & margin calculation."
      }
    ]
  },
  {
    id: "salons",
    name: "Salons",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
    caption: "High-end salons, spas, and wellness studios connecting client appointments to billing.",
    features: [
      {
        iconName: "UserCheck",
        title: "Staff Assignment",
        description: "Tag service commissions per stylist, colorist, and therapist."
      },
      {
        iconName: "Calendar",
        title: "Appointments",
        description: "Walk-in queuing combined with scheduled bookings on one screen."
      },
      {
        iconName: "Sparkles",
        title: "Service Bundles",
        description: "Dynamic packages with combined services and custom discounts."
      },
      {
        iconName: "FileText",
        title: "Client History",
        description: "Store color formulas, styling preferences, and lifetime spend."
      }
    ]
  },
  {
    id: "restaurants",
    name: "Restaurants",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    caption: "Full-service dining with floor diagrams, table timers, split bills, and live kitchen displays.",
    features: [
      {
        iconName: "Grid",
        title: "Table Lifecycle",
        description: "Available, Occupied, Billed states with live guest timer alerts."
      },
      {
        iconName: "ChefHat",
        title: "KOT & KDS",
        description: "Instant routing to kitchen, pantry, and bar displays with item notes."
      },
      {
        iconName: "Split",
        title: "Split Payments",
        description: "Divide checks by items, equal seat split, cash/card combinations."
      },
      {
        iconName: "Share2",
        title: "Table Transfers",
        description: "Merge tables or shift guests between indoor and patio seating."
      }
    ]
  }
];

export const PRICING_TIERS = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 499,
    yearlyPrice: 5499,
    yearlyMonthlyEquivalent: 458,
    description: "Essential POS engine for single counter shops & bakeries.",
    features: [
      "1 Registered POS Terminal",
      "Universal New Sale & Cart Engine",
      "Thermal Receipt & Invoicing",
      "Basic Inventory Tracking",
      "Daily Shift & Cash Register Close",
      "Email & WhatsApp Receipts",
      "Standard Business Reports"
    ],
    ctaText: "Signup",
    highlight: false
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    monthlyPrice: 799,
    yearlyPrice: 8999,
    yearlyMonthlyEquivalent: 749,
    description: "Engineered for high-turnover dining, cafés & retail stores.",
    features: [
      "Up to 3 Active Terminals",
      "Restaurant Table Screen & Floor Plans",
      "Live KOT & Kitchen Display (KDS)",
      "High-speed Barcode Scanner Support",
      "Multi-payment Splits (Cash + UPI + Card)",
      "Low Stock Alerts & Reorder Points",
      "Customer Ledgers & Purchase History",
      "Role-based Cashier & Staff PINs"
    ],
    ctaText: "Start 7-Day Free Trial",
    highlight: true
  },
  {
    id: "super",
    name: "Super",
    monthlyPrice: 1399,
    yearlyPrice: 15999,
    yearlyMonthlyEquivalent: 1333,
    description: "Complete enterprise stack for multi-outlet chains & leaders.",
    features: [
      "Unlimited Terminals & Outlets",
      "NuraAI Intelligent Business Assistant",
      "Multi-Branch Central Inventory Sync",
      "Outlet-to-Outlet Stock Transfers",
      "Deep P&L, Tax & Margin Analytics",
      "Full Staff Audit Logs & Permissions",
      "Custom Webhooks & Accounting Export",
      "Dedicated 24/7 Priority Support"
    ],
    ctaText: "Start 7-Day Free Trial",
    highlight: false
  }
];

export const POS_CAPABILITIES = [
  {
    id: "quick-billing",
    title: "Quick Billing",
    desc: "Fast barcode scan & tap to pay checkout engine.",
    badge: "Sub-second Flow",
    previewTitle: "Sub-Second Barcode & Touch Checkout",
    previewSubtitle: "Designed for high-frequency transactions with minimum clicks."
  },
  {
    id: "customer-mgmt",
    title: "Customer Management",
    desc: "Profiles, store credit balance & order history.",
    previewTitle: "Integrated Customer CRM & Credit Ledger",
    previewSubtitle: "Track customer lifetime value, store balances, and visit frequency."
  },
  {
    id: "tables-kot",
    title: "Tables & KOT",
    desc: "Visual floor plans, table timers & kitchen display.",
    previewTitle: "Realtime Restaurant Floor & Kitchen KOT",
    previewSubtitle: "Manage table states (Available, Occupied, Billed) and send tickets instantly."
  },
  {
    id: "inventory",
    title: "Inventory Management",
    desc: "Live stock counts, low-stock warnings & purchases.",
    previewTitle: "Automated Multi-Channel Inventory",
    previewSubtitle: "Every sale updates stock in real-time with zero discrepancy."
  },
  {
    id: "multi-outlet",
    title: "Multi-Outlet Sync",
    desc: "Centralized control across branches & devices.",
    previewTitle: "Multi-Branch Cloud Centralization",
    previewSubtitle: "Monitor all outlets, terminals, and shift balances from a single dashboard."
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    desc: "Real-time revenue, staff performance & split reconciliation.",
    previewTitle: "Deep Financial Reports & Audit Trails",
    previewSubtitle: "Analyze daily sales, category velocity, tax summaries, and cashier shifts."
  }
];
