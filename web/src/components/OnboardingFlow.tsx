"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Store,
  ChevronDown,
  Check,
  CheckCircle2,
  Loader2,
  Layers,
  UtensilsCrossed,
  ShoppingBag,
  PackageCheck,
  Bike,
  Globe,
  CalendarCheck,
  Banknote,
  QrCode,
  CreditCard,
  Wallet,
  Landmark,
  UserCheck,
} from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";

interface OnboardingFlowProps {
  initialStep?: number;
  initialStoreName?: string;
}

const PRIMARY_BUSINESS_TYPES = [
  { id: "Cafe", label: "Cafe", icon: "☕" },
  { id: "Restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "Bakery", label: "Bakery", icon: "🥐" },
  { id: "Retail", label: "Retail", icon: "🛍️" },
  { id: "QSR", label: "QSR", icon: "🍔" },
  { id: "Pharmacy", label: "Pharmacy", icon: "💊" },
];

const OTHER_BUSINESS_TYPES = [
  { id: "Grocery", label: "Grocery", icon: "🥦" },
  { id: "Salon", label: "Salon", icon: "💇" },
  { id: "Electronics", label: "Electronics", icon: "📱" },
  { id: "Clothing", label: "Clothing", icon: "👕" },
  { id: "Services", label: "Services", icon: "🛠️" },
  { id: "Custom", label: "Other (Specify)", icon: "✨" },
];

const ALL_BUSINESS_TYPES = [
  ...PRIMARY_BUSINESS_TYPES,
  ...OTHER_BUSINESS_TYPES.filter((t) => t.id !== "Custom"),
];

const POPULAR_COUNTRIES = [
  { name: "India", code: "+91", iso: "IN" },
  { name: "United States", code: "+1", iso: "US" },
  { name: "United Arab Emirates", code: "+971", iso: "AE" },
  { name: "United Kingdom", code: "+44", iso: "GB" },
  { name: "Singapore", code: "+65", iso: "SG" },
  { name: "Canada", code: "+1", iso: "CA" },
  { name: "Australia", code: "+61", iso: "AU" },
  { name: "Germany", code: "+49", iso: "DE" },
  { name: "Saudi Arabia", code: "+966", iso: "SA" },
  { name: "France", code: "+33", iso: "FR" },
];

const TIME_ZONES = [
  { id: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { id: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { id: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { id: "Europe/London", label: "Europe/London (GMT)" },
  { id: "America/New_York", label: "America/New_York (EST)" },
  { id: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
  { id: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
  { id: "Asia/Riyadh", label: "Asia/Riyadh (AST)" },
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", iso: "IN", name: "Indian Rupee" },
  { code: "USD", symbol: "$", iso: "US", name: "US Dollar" },
  { code: "AED", symbol: "د.إ", iso: "AE", name: "UAE Dirham" },
  { code: "GBP", symbol: "£", iso: "GB", name: "British Pound" },
  { code: "EUR", symbol: "€", iso: "FR", name: "Euro" },
  { code: "SGD", symbol: "S$", iso: "SG", name: "Singapore Dollar" },
  { code: "CAD", symbol: "C$", iso: "CA", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", iso: "AU", name: "Australian Dollar" },
  { code: "SAR", symbol: "﷼", iso: "SA", name: "Saudi Riyal" },
];

const SELLING_CHANNELS = [
  { id: "in_store", label: "In-store", icon: Store },
  { id: "counter", label: "Counter", icon: Layers },
  { id: "table_service", label: "Table service", icon: UtensilsCrossed },
  { id: "takeaway", label: "Takeaway", icon: ShoppingBag },
  { id: "pickup", label: "Pickup", icon: PackageCheck },
  { id: "delivery", label: "Delivery", icon: Bike },
  { id: "online_orders", label: "Online orders", icon: Globe },
  { id: "appointment_service", label: "Appointment / Service", icon: CalendarCheck },
];

const PAYMENT_METHODS = [
  {
    id: "cash",
    label: "Cash",
    desc: "Accept cash payments at the counter",
    icon: Banknote,
  },
  {
    id: "upi",
    label: "UPI",
    desc: "Dynamic QR, Google Pay, PhonePe, Paytm",
    icon: QrCode,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    desc: "Swipe, chip, tap & POS card machine",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Wallet",
    desc: "Digital wallet balances & prepaid gift cards",
    icon: Wallet,
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    desc: "Direct NEFT, RTGS, IMPS wire transfers",
    icon: Landmark,
  },
  {
    id: "customer_credit",
    label: "Customer Credit",
    desc: "Khata ledger, house accounts & pay later",
    icon: UserCheck,
  },
];

const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: "₹299",
    yearlyPrice: "₹239",
    period: "/Mon",
    isPopular: false,
    features: [
      "1 Outlet",
      "2 Staff",
      "Basic POS",
      "Basic Reports",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "₹799",
    yearlyPrice: "₹639",
    period: "/Mon",
    isPopular: true,
    features: [
      "3 Outlet",
      "10 Staff",
      "Advanced POS",
      "Inventory",
      "KDS",
      "Multi-outlet",
    ],
  },
  {
    id: "super",
    name: "Super",
    monthlyPrice: "₹1399",
    yearlyPrice: "₹1119",
    period: "/Mon",
    isPopular: false,
    features: [
      "Unlimited",
      "Unlimited Staff",
      "Everything Pro",
      "Advanced Reports",
      "API",
      "NuraAI",
    ],
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialStep = 1,
  initialStoreName = "Name",
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [storeName, setStoreName] = useState<string>(initialStoreName);
  const [businessType, setBusinessType] = useState<string>("Cafe");
  const [customType, setCustomType] = useState<string>("");
  const [otherDropdownOpen, setOtherDropdownOpen] = useState<boolean>(false);

  // Step 3 Form State
  const [businessName, setBusinessName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [country, setCountry] = useState<string>("India");
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(POPULAR_COUNTRIES[0]);
  const [taxStatus, setTaxStatus] = useState<"registered" | "not_registered">("registered");
  const [gstn, setGstn] = useState<string>("");

  const [businessTypeDropdownOpen, setBusinessTypeDropdownOpen] = useState<boolean>(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState<boolean>(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState<boolean>(false);

  // Step 4 Form State
  const [outletName, setOutletName] = useState<string>("");
  const [outletAddress, setOutletAddress] = useState<string>("");
  const [outletPhone, setOutletPhone] = useState<string>("");
  const [selectedOutletPhoneCountry, setSelectedOutletPhoneCountry] = useState(POPULAR_COUNTRIES[0]);
  const [outletPhoneDropdownOpen, setOutletPhoneDropdownOpen] = useState<boolean>(false);
  const [timeZone, setTimeZone] = useState<string>("Asia/Kolkata");
  const [timeZoneDropdownOpen, setTimeZoneDropdownOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState<boolean>(false);
  const [isMainOutlet, setIsMainOutlet] = useState<boolean>(true);

  // Step 5 Form State: How do you sell to your customers?
  const [sellingChannels, setSellingChannels] = useState<string[]>(["in_store"]);

  const toggleSellingChannel = (id: string) => {
    setSellingChannels((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Step 6 Form State: Set up billing
  const [taxEnabled, setTaxEnabled] = useState<boolean>(true);
  const [taxPricingModel, setTaxPricingModel] = useState<"included" | "excluded">("included");
  const [taxRate, setTaxRate] = useState<string>("18% GST");
  const [taxConfigOpen, setTaxConfigOpen] = useState<boolean>(false);
  const [invoiceBusinessName, setInvoiceBusinessName] = useState<string>("");
  const [invoicePrefix, setInvoicePrefix] = useState<string>("INV");
  const [invoiceStartingNumber, setInvoiceStartingNumber] = useState<string>("1001");
  const [receiptFooter, setReceiptFooter] = useState<string>("Thank you!");

  // Step 7 Form State: Payment Methods
  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<string[]>([
    "cash",
    "upi",
    "card",
  ]);

  const togglePaymentMethod = (id: string) => {
    setEnabledPaymentMethods((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Step 8 Form State: Plan selection
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  // Step 9 Form State: Buffering / Setting up Admin Panel
  const router = useRouter();
  const [setupProgress, setSetupProgress] = useState<number>(0);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    if (currentStep === 9) {
      setSetupProgress(0);
      const interval = setInterval(() => {
        setSetupProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleContinueToPOS = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  const formattedTrialEnd = trialEndDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalSteps = 9;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-white text-gray-950 flex flex-col justify-between selection:bg-black selection:text-white overflow-x-hidden">
      {/* Top Header: Brand Logo & Need Help? */}
      <header className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-3 sm:py-4 flex items-center justify-between shrink-0">
        {/* Left: Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo/logo.png.png"
              alt="Nuradesk Mark"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-24 sm:w-28 h-6 sm:h-7 flex items-center justify-center">
            <Image
              src="/logo/text.png"
              alt="Nuradesk"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right: Need Help? */}
        <div className="flex items-center gap-4">
          {currentStep === 2 && (
            <button
              onClick={prevStep}
              className="text-xs sm:text-[13px] font-semibold text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
          <a
            href="mailto:support@nuradesk.com"
            className="text-xs sm:text-[13px] font-semibold text-gray-900 hover:text-black transition-colors"
          >
            Need Help?
          </a>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-1 sm:py-3 flex flex-col items-center justify-center text-center">
        {currentStep === 1 ? (
          /* ============================================================ */
          /* STEP 1: Welcome Screen (Pixel-Perfect Match to Mockup)       */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-lg my-auto animate-fadeIn">
            {/* Title: Welcome to Name! */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 mb-1 sm:mb-2">
              Welcome to {storeName}!
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-950 max-w-md mx-auto mb-3 sm:mb-4 leading-snug">
              Let's get your POS ready to take its first order.
            </h2>

            {/* POS Hardware Terminal Visual (Extracted from Mockup) */}
            <div className="relative w-[240px] sm:w-[280px] h-[180px] sm:h-[210px] overflow-hidden flex items-center justify-center my-1 sm:my-2">
              <img
                src="/onboarding/onboarding-1.png"
                alt="Nuradesk POS Terminal"
                className="absolute pointer-events-none select-none max-w-none"
                style={{
                  width: "1024px",
                  height: "728px",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -47.4%)",
                }}
              />
            </div>

            {/* Setup Duration Info */}
            <p className="text-xs sm:text-sm md:text-[15px] font-semibold text-gray-900 mt-2 sm:mt-3 mb-4 sm:mb-5">
              Setup takes about 3–5 minutes.
            </p>

            {/* 10 Progress Indicator Dots: 1st Active, 9 Hollow */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === currentStep - 1
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Primary Action Button: Button-20 in Black "Get Started →" */}
            <button
              onClick={nextStep}
              className="button-20 h-11 sm:h-12 px-8 sm:px-10 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        ) : currentStep === 2 ? (
          /* ============================================================ */
          /* STEP 2: What type of business do you run?                    */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-lg my-auto animate-fadeIn">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-6 sm:mb-8">
              What type of business do you run?
            </h1>

            {/* Business Type Cards Grid: Row 1 (3 items), Row 2 (3 items), Row 3 (Other centered) */}
            <div className="flex flex-col items-center gap-2.5 sm:gap-3 w-full max-w-md mx-auto">
              {/* Row 1: Cafe, Restaurant, Bakery */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
                {PRIMARY_BUSINESS_TYPES.slice(0, 3).map((item) => {
                  const isSelected = businessType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setBusinessType(item.id);
                        setOtherDropdownOpen(false);
                      }}
                      className={`h-[52px] sm:h-[56px] rounded-2xl flex items-center justify-center gap-2 px-3 py-2 transition-all cursor-pointer select-none text-xs sm:text-[13px] font-semibold ${
                        isSelected
                          ? "bg-gray-100 border-2 border-black text-black ring-2 ring-black/10 shadow-xs scale-[1.02]"
                          : "bg-gray-50/90 border border-gray-200/90 text-gray-800 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-base sm:text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Retail, QSR, Pharmacy */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
                {PRIMARY_BUSINESS_TYPES.slice(3, 6).map((item) => {
                  const isSelected = businessType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setBusinessType(item.id);
                        setOtherDropdownOpen(false);
                      }}
                      className={`h-[52px] sm:h-[56px] rounded-2xl flex items-center justify-center gap-2 px-3 py-2 transition-all cursor-pointer select-none text-xs sm:text-[13px] font-semibold ${
                        isSelected
                          ? "bg-gray-100 border-2 border-black text-black ring-2 ring-black/10 shadow-xs scale-[1.02]"
                          : "bg-gray-50/90 border border-gray-200/90 text-gray-800 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-base sm:text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 3: Other Dropdown (Centered, Floating Dropdown Menu) */}
              <div className="relative flex justify-center w-full">
                {(() => {
                  const isOtherSelected = !PRIMARY_BUSINESS_TYPES.some((p) => p.id === businessType);
                  const displayLabel = isOtherSelected
                    ? (businessType === "Custom" ? (customType || "Other") : businessType)
                    : "Other";

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setOtherDropdownOpen(!otherDropdownOpen)}
                        className={`h-[52px] sm:h-[56px] min-w-[130px] sm:min-w-[145px] rounded-2xl flex items-center justify-center gap-2 px-5 py-2 transition-all cursor-pointer select-none text-xs sm:text-[13px] font-semibold ${
                          isOtherSelected
                            ? "bg-gray-100 border-2 border-black text-black ring-2 ring-black/10 shadow-xs scale-[1.02]"
                            : "bg-gray-50/90 border border-gray-200/90 text-gray-800 hover:bg-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <span>{displayLabel}</span>
                        <ChevronDown
                          size={14}
                          className={`text-gray-500 transition-transform ${
                            otherDropdownOpen ? "rotate-180 text-black" : ""
                          }`}
                        />
                      </button>

                      {/* Floating Dropdown Popover */}
                      {otherDropdownOpen && (
                        <>
                          {/* Backdrop to dismiss on click outside */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOtherDropdownOpen(false)}
                          />

                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-52 sm:w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden py-1.5 animate-fadeIn">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                              More Business Types
                            </div>
                            <div className="max-h-56 overflow-y-auto p-1 divide-y divide-gray-50">
                              {OTHER_BUSINESS_TYPES.map((item) => {
                                const isItemActive = businessType === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      setBusinessType(item.id);
                                      if (item.id !== "Custom") {
                                        setOtherDropdownOpen(false);
                                      }
                                    }}
                                    className={`w-full px-3 py-2 flex items-center justify-between rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                                      isItemActive
                                        ? "bg-gray-100 text-black font-bold"
                                        : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-base">{item.icon}</span>
                                      <span>{item.label}</span>
                                    </div>
                                    {isItemActive && <Check size={14} className="text-black shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* If Custom was selected, allow typing custom name */}
                            {businessType === "Custom" && (
                              <div className="p-2 border-t border-gray-100 bg-gray-50/70 flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={customType}
                                  onChange={(e) => setCustomType(e.target.value)}
                                  placeholder="Type business name..."
                                  className="w-full h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 outline-none focus:border-black"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => setOtherDropdownOpen(false)}
                                  className="h-8 px-2.5 rounded-lg bg-black text-white text-xs font-semibold shrink-0 cursor-pointer"
                                >
                                  Done
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Setup Duration Info */}
            <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-6 sm:mt-7 mb-4 sm:mb-5">
              Setup takes about 3–5 minutes.
            </p>

            {/* 10 Progress Indicator Dots: 2nd Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 1
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 1
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Primary Action Button: Solid Black Button-20 (Zero Blue!) */}
            <button
              onClick={nextStep}
              className="button-20 h-11 sm:h-12 px-10 sm:px-12 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue
            </button>
          </div>
        ) : currentStep === 3 ? (
          /* ============================================================ */
          /* STEP 3: Tell us about your business (Two-Column Layout)      */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-2xl my-auto animate-fadeIn">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-6 sm:mb-8">
              Tell us about your business
            </h1>

            {/* Form: Two Columns */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 sm:gap-y-4 text-left mb-6 sm:mb-8">
              {/* Left Column */}
              <div className="flex flex-col gap-3.5 sm:gap-4">
                {/* Field 1: Business name * */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Business name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                  />
                </div>

                {/* Field 2: Business type* */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Business type*
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setBusinessTypeDropdownOpen(!businessTypeDropdownOpen);
                      setCountryDropdownOpen(false);
                      setPhoneDropdownOpen(false);
                    }}
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-900 transition-all cursor-pointer"
                  >
                    <span>{businessType || "Cafe"}</span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform ${
                        businessTypeDropdownOpen ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </button>

                  {/* Business Type Dropdown Menu */}
                  {businessTypeDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setBusinessTypeDropdownOpen(false)}
                      />
                      <div className="absolute left-0 top-full mt-1.5 z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-52 overflow-y-auto animate-fadeIn">
                        {ALL_BUSINESS_TYPES.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setBusinessType(item.label);
                              setBusinessTypeDropdownOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-left transition-colors cursor-pointer ${
                              businessType === item.label
                                ? "bg-gray-100 text-black font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{item.icon}</span>
                              <span>{item.label}</span>
                            </span>
                            {businessType === item.label && (
                              <Check size={14} className="text-black shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Field 3: Phone* */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Phone*
                  </label>
                  <div className="w-full h-10 sm:h-11 rounded-full border border-gray-200/90 bg-gray-50/70 focus-within:bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black flex items-center transition-all">
                    {/* Flag Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneDropdownOpen(!phoneDropdownOpen);
                        setBusinessTypeDropdownOpen(false);
                        setCountryDropdownOpen(false);
                      }}
                      className="h-full pl-3.5 pr-2 flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-black shrink-0 border-r border-gray-200 cursor-pointer focus:outline-none transition-colors"
                    >
                      {(() => {
                        const FlagIcon = Flags[selectedPhoneCountry.iso as keyof typeof Flags];
                        return FlagIcon ? (
                          <FlagIcon className="w-5 h-3.5 object-cover rounded-xs shadow-xs" />
                        ) : (
                          <span>🇮🇳</span>
                        );
                      })()}
                      <span className="text-[11px] font-medium text-gray-700">
                        {selectedPhoneCountry.code}
                      </span>
                      <ChevronDown size={11} className="text-gray-400" />
                    </button>

                    {/* Input */}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-full bg-transparent px-3 text-xs sm:text-sm text-gray-900 outline-none rounded-r-full"
                    />
                  </div>

                  {/* Phone Country Code Dropdown */}
                  {phoneDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setPhoneDropdownOpen(false)}
                      />
                      <div className="absolute left-0 top-full mt-1.5 z-50 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-48 overflow-y-auto animate-fadeIn divide-y divide-gray-50">
                        {POPULAR_COUNTRIES.map((c) => {
                          const FlagIcon = Flags[c.iso as keyof typeof Flags];
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                setSelectedPhoneCountry(c);
                                setPhoneDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 flex items-center justify-between text-xs text-left hover:bg-gray-50 cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                {FlagIcon && (
                                  <FlagIcon className="w-4 h-3 object-cover rounded-xs shadow-xs shrink-0" />
                                )}
                                <span className="text-gray-800 truncate">{c.name}</span>
                              </span>
                              <span className="text-gray-500 font-mono text-[11px]">{c.code}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Field 4: Email* */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3.5 sm:gap-4">
                {/* Field 1: Address * */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                  />
                </div>

                {/* Field 2: Country* */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Country*
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCountryDropdownOpen(!countryDropdownOpen);
                      setBusinessTypeDropdownOpen(false);
                      setPhoneDropdownOpen(false);
                    }}
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-900 transition-all cursor-pointer"
                  >
                    <span>{country}</span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform ${
                        countryDropdownOpen ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </button>

                  {/* Country Dropdown Menu */}
                  {countryDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setCountryDropdownOpen(false)}
                      />
                      <div className="absolute left-0 top-full mt-1.5 z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-52 overflow-y-auto animate-fadeIn divide-y divide-gray-50">
                        {POPULAR_COUNTRIES.map((c) => {
                          const FlagIcon = Flags[c.iso as keyof typeof Flags];
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                setCountry(c.name);
                                setSelectedPhoneCountry(c);
                                setCountryDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-left transition-colors cursor-pointer ${
                                country === c.name
                                  ? "bg-gray-100 text-black font-bold"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {FlagIcon && (
                                  <FlagIcon className="w-4 h-3 object-cover rounded-xs shadow-xs shrink-0" />
                                )}
                                <span>{c.name}</span>
                              </span>
                              {country === c.name && (
                                <Check size={14} className="text-black shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Field 3: Tax registration* */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Tax registration*
                  </label>
                  <div className="flex items-center gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => setTaxStatus("registered")}
                      className={`flex-1 h-10 sm:h-11 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                        taxStatus === "registered"
                          ? "bg-gray-100 border-2 border-black text-black ring-2 ring-black/10 shadow-xs"
                          : "bg-gray-50/70 border border-gray-200/90 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      Registered
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxStatus("not_registered")}
                      className={`flex-1 h-10 sm:h-11 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                        taxStatus === "not_registered"
                          ? "bg-gray-100 border-2 border-black text-black ring-2 ring-black/10 shadow-xs"
                          : "bg-gray-50/70 border border-gray-200/90 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      Not registered
                    </button>
                  </div>
                </div>

                {/* Field 4: If registered Enter GSTN* */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    If registered Enter GSTN*
                  </label>
                  <input
                    type="text"
                    value={gstn}
                    onChange={(e) => setGstn(e.target.value.toUpperCase())}
                    disabled={taxStatus === "not_registered"}
                    className={`w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 text-xs sm:text-sm text-gray-900 outline-none transition-all ${
                      taxStatus === "not_registered"
                        ? "bg-gray-100/60 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 10 Progress Indicator Dots: 3rd Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 2
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 2
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom Buttons: Back & Continue (Solid Black Button-20, Zero Blue) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={prevStep}
                className="h-11 sm:h-12 px-8 sm:px-10 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="button-20 h-11 sm:h-12 px-10 sm:px-12 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        ) : currentStep === 4 ? (
          /* ============================================================ */
          /* STEP 4: Set up your first outlet                             */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-md my-auto animate-fadeIn">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-6 sm:mb-8">
              Set up your first outlet
            </h1>

            {/* Form: Single Centered Column */}
            <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto flex flex-col gap-3.5 sm:gap-4 text-left mb-6 sm:mb-8">
              {/* Field 1: Outlet name * */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Outlet name *
                </label>
                <input
                  type="text"
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                />
              </div>

              {/* Field 2: Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Address
                </label>
                <input
                  type="text"
                  value={outletAddress}
                  onChange={(e) => setOutletAddress(e.target.value)}
                  className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                />
              </div>

              {/* Field 3: Phone* */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Phone*
                </label>
                <div className="w-full h-10 sm:h-11 rounded-full border border-gray-200/90 bg-gray-50/70 focus-within:bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black flex items-center transition-all">
                  {/* Flag Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setOutletPhoneDropdownOpen(!outletPhoneDropdownOpen);
                      setTimeZoneDropdownOpen(false);
                      setCurrencyDropdownOpen(false);
                    }}
                    className="h-full pl-3.5 pr-2 flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-black shrink-0 border-r border-gray-200 cursor-pointer focus:outline-none transition-colors"
                  >
                    {(() => {
                      const FlagIcon = Flags[selectedOutletPhoneCountry.iso as keyof typeof Flags];
                      return FlagIcon ? (
                        <FlagIcon className="w-5 h-3.5 object-cover rounded-xs shadow-xs" />
                      ) : (
                        <span>🇮🇳</span>
                      );
                    })()}
                    <span className="text-[11px] font-medium text-gray-700">
                      {selectedOutletPhoneCountry.code}
                    </span>
                    <ChevronDown size={11} className="text-gray-400" />
                  </button>

                  {/* Input */}
                  <input
                    type="tel"
                    value={outletPhone}
                    onChange={(e) => setOutletPhone(e.target.value)}
                    className="w-full h-full bg-transparent px-3 text-xs sm:text-sm text-gray-900 outline-none rounded-r-full"
                  />
                </div>

                {/* Phone Country Code Dropdown */}
                {outletPhoneDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOutletPhoneDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-48 overflow-y-auto animate-fadeIn divide-y divide-gray-50">
                      {POPULAR_COUNTRIES.map((c) => {
                        const FlagIcon = Flags[c.iso as keyof typeof Flags];
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setSelectedOutletPhoneCountry(c);
                              setOutletPhoneDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 flex items-center justify-between text-xs text-left hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              {FlagIcon && (
                                <FlagIcon className="w-4 h-3 object-cover rounded-xs shadow-xs shrink-0" />
                              )}
                              <span className="text-gray-800 truncate">{c.name}</span>
                            </span>
                            <span className="text-gray-500 font-mono text-[11px]">{c.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Field 4: Time Zone* */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Time Zone*
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTimeZoneDropdownOpen(!timeZoneDropdownOpen);
                    setOutletPhoneDropdownOpen(false);
                    setCurrencyDropdownOpen(false);
                  }}
                  className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-900 transition-all cursor-pointer"
                >
                  <span className="w-3" />
                  <span className="text-center font-medium text-gray-900">{timeZone}</span>
                  <ChevronDown
                    size={13}
                    className={`text-gray-400 transition-transform ${
                      timeZoneDropdownOpen ? "rotate-180 text-black" : ""
                    }`}
                  />
                </button>

                {/* Time Zone Dropdown Menu */}
                {timeZoneDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setTimeZoneDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-48 overflow-y-auto animate-fadeIn divide-y divide-gray-50">
                      {TIME_ZONES.map((tz) => (
                        <button
                          key={tz.id}
                          type="button"
                          onClick={() => {
                            setTimeZone(tz.id);
                            setTimeZoneDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-xs text-left transition-colors cursor-pointer flex items-center justify-between ${
                            timeZone === tz.id
                              ? "bg-gray-100 text-black font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{tz.label}</span>
                          {timeZone === tz.id && <Check size={13} className="text-black shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Field 5: Currency & Main outlet */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  Currency
                </label>
                <div className="flex items-center gap-3.5 w-full">
                  {/* Currency Pill Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrencyDropdownOpen(!currencyDropdownOpen);
                        setTimeZoneDropdownOpen(false);
                        setOutletPhoneDropdownOpen(false);
                      }}
                      className="h-10 sm:h-11 px-3.5 rounded-full border border-gray-200/90 bg-gray-50/70 hover:bg-gray-100 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900 transition-all cursor-pointer"
                    >
                      {(() => {
                        const FlagIcon = Flags[selectedCurrency.iso as keyof typeof Flags];
                        return FlagIcon ? (
                          <FlagIcon className="w-4 h-3 object-cover rounded-xs shadow-xs" />
                        ) : (
                          <span>🇮🇳</span>
                        );
                      })()}
                      <span className="font-semibold text-gray-800">
                        {selectedCurrency.symbol} {selectedCurrency.code}
                      </span>
                      <ChevronDown
                        size={11}
                        className={`text-gray-400 transition-transform ${
                          currencyDropdownOpen ? "rotate-180 text-black" : ""
                        }`}
                      />
                    </button>

                    {currencyDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setCurrencyDropdownOpen(false)}
                        />
                        <div className="absolute left-0 bottom-full mb-2 z-50 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden py-1 max-h-48 overflow-y-auto animate-fadeIn divide-y divide-gray-50">
                          {CURRENCIES.map((cur) => {
                            const FlagIcon = Flags[cur.iso as keyof typeof Flags];
                            return (
                              <button
                                key={cur.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCurrency(cur);
                                  setCurrencyDropdownOpen(false);
                                }}
                                className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                                  selectedCurrency.code === cur.code
                                    ? "bg-gray-100 text-black font-bold"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {FlagIcon && (
                                    <FlagIcon className="w-4 h-3 object-cover rounded-xs shadow-xs" />
                                  )}
                                  <span>{cur.symbol} {cur.code}</span>
                                </span>
                                <span className="text-[11px] text-gray-400">{cur.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Main Outlet Checkbox */}
                  <label
                    onClick={() => setIsMainOutlet(!isMainOutlet)}
                    className="flex items-center gap-2 cursor-pointer select-none py-1"
                  >
                    <div
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                        isMainOutlet
                          ? "bg-black border-black text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isMainOutlet && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-gray-900">
                      Main outlet
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 10 Progress Indicator Dots: 4th Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 3
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 3
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom Buttons: Back & Continue (Solid Black Button-20, Zero Blue, No Arrows) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={prevStep}
                className="h-11 sm:h-12 px-8 sm:px-10 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="button-20 h-11 sm:h-12 px-10 sm:px-12 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        ) : currentStep === 5 ? (
          /* ============================================================ */
          /* STEP 5: How do you sell to your customers?                  */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-xl my-auto animate-fadeIn">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-1 sm:mb-1.5">
              How do you sell to your customers?
            </h1>

            {/* Note in parentheses */}
            <p className="text-xs sm:text-[13px] text-gray-500 text-center mb-2.5 sm:mb-3">
              (The available options can change based on business type.)
            </p>

            {/* Section Prompt */}
            <h2 className="text-xs sm:text-sm font-semibold text-gray-900 text-center mb-4 sm:mb-5">
              Select everything that applies.
            </h2>

            {/* Selling Channels Grid: 2 Columns of Interactive Pill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-lg mx-auto mb-6 sm:mb-7">
              {SELLING_CHANNELS.map((item) => {
                const isSelected = sellingChannels.includes(item.id);
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSellingChannel(item.id)}
                    className="h-[48px] sm:h-[52px] px-3.5 sm:px-4 rounded-2xl flex items-center justify-between transition-colors cursor-pointer select-none text-left bg-gray-50/80 border border-gray-200/90 hover:bg-gray-100 hover:border-gray-300"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-gray-200/70 text-gray-700">
                        <IconComponent size={14} />
                      </div>
                      <span className="text-xs sm:text-[13px] font-semibold text-gray-900 truncate">
                        {item.label}
                      </span>
                    </div>

                    {/* Custom Checkbox - only this gets ticked */}
                    <div
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                        isSelected
                          ? "bg-black border-black text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 10 Progress Indicator Dots: 5th Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 4
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 4
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom Buttons: Back & Continue (Solid Black Button-20, Zero Blue, No Arrows) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={prevStep}
                className="h-11 sm:h-12 px-8 sm:px-10 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="button-20 h-11 sm:h-12 px-10 sm:px-12 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        ) : currentStep === 6 ? (
          /* ============================================================ */
          /* STEP 6: Set up billing                                       */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-2xl my-auto animate-fadeIn">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-1">
              Set up billing
            </h1>

            {/* Subtitle - noting editable later */}
            <p className="text-xs sm:text-[13px] text-gray-500 text-center mb-6 sm:mb-7">
              (You can customize and edit all billing details later)
            </p>

            {/* 2-Column Form Layout: Left (Tax & Pricing), Right (Invoice / Receipt) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-left mb-6 sm:mb-8">
              {/* Left Column: Tax & Pricing */}
              <div className="flex flex-col gap-4">
                {/* Tax Checkbox */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Tax
                  </label>
                  <label
                    onClick={() => setTaxEnabled(!taxEnabled)}
                    className="h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/80 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer transition-colors select-none"
                  >
                    <div
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                        taxEnabled
                          ? "bg-black border-black text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {taxEnabled && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-gray-900">
                      Enable tax
                    </span>
                  </label>
                </div>

                {/* Tax Configuration Button */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Tax configuration
                  </label>
                  <div className="h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/80 flex items-center justify-between">
                    <span className="text-xs sm:text-[13px] text-gray-700 font-medium">
                      Rate: <strong className="text-gray-900">{taxRate}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setTaxConfigOpen(!taxConfigOpen)}
                      className="h-7 px-3 rounded-full border border-black bg-white hover:bg-black hover:text-white text-xs font-semibold text-gray-900 cursor-pointer transition-colors"
                    >
                      Configure
                    </button>
                  </div>

                  {/* Tax Config Popover */}
                  {taxConfigOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setTaxConfigOpen(false)}
                      />
                      <div className="absolute left-0 bottom-full mb-2 z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-3 animate-fadeIn">
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Select Default Tax Rate
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["0% Exempt", "5% GST", "12% GST", "18% GST", "28% GST"].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => {
                                setTaxRate(rate);
                                setTaxConfigOpen(false);
                              }}
                              className={`h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                taxRate === rate
                                  ? "bg-black text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {rate}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Pricing: Tax included / Tax excluded */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Pricing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaxPricingModel("included")}
                      className={`h-10 sm:h-11 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        taxPricingModel === "included"
                          ? "bg-black text-white shadow-xs"
                          : "bg-gray-50/80 border border-gray-200/90 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full border ${
                          taxPricingModel === "included"
                            ? "border-white bg-white"
                            : "border-gray-400 bg-transparent"
                        }`}
                      />
                      <span>Tax included</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxPricingModel("excluded")}
                      className={`h-10 sm:h-11 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        taxPricingModel === "excluded"
                          ? "bg-black text-white shadow-xs"
                          : "bg-gray-50/80 border border-gray-200/90 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full border ${
                          taxPricingModel === "excluded"
                            ? "border-white bg-white"
                            : "border-gray-400 bg-transparent"
                        }`}
                      />
                      <span>Tax excluded</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Invoice / Receipt */}
              <div className="flex flex-col gap-4">
                {/* Business Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Business name
                  </label>
                  <input
                    type="text"
                    value={invoiceBusinessName || businessName || "My Business"}
                    onChange={(e) => setInvoiceBusinessName(e.target.value)}
                    placeholder="My Business"
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                  />
                </div>

                {/* Prefix and Starting Number side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                      Invoice prefix
                    </label>
                    <input
                      type="text"
                      value={invoicePrefix}
                      onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                      placeholder="INV"
                      className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                      Starting number
                    </label>
                    <input
                      type="number"
                      value={invoiceStartingNumber}
                      onChange={(e) => setInvoiceStartingNumber(e.target.value)}
                      placeholder="1001"
                      className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Receipt Footer */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-gray-900">
                    Receipt footer
                  </label>
                  <input
                    type="text"
                    value={receiptFooter}
                    onChange={(e) => setReceiptFooter(e.target.value)}
                    placeholder="Thank you!"
                    className="w-full h-10 sm:h-11 px-4 rounded-full border border-gray-200/90 bg-gray-50/70 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 10 Progress Indicator Dots: 6th Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 5
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 5
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom Buttons: Back & Continue (Solid Black Button-20, Zero Blue, No Arrows) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={prevStep}
                className="h-11 sm:h-12 px-8 sm:px-10 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="button-20 h-11 sm:h-12 px-10 sm:px-12 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        ) : currentStep === 7 ? (
          /* ============================================================ */
          /* STEP 7: Payment Methods                                      */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-2xl my-auto animate-fadeIn">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-1">
              Payment Methods
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] text-gray-500 text-center mb-5 sm:mb-6">
              How do customers pay? Enable the payment modes accepted on your POS.
            </p>

            {/* 6 Payment Method Cards with Enable/Disable Toggle Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto mb-6 sm:mb-8">
              {PAYMENT_METHODS.map((method) => {
                const isEnabled = enabledPaymentMethods.includes(method.id);
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.id}
                    onClick={() => togglePaymentMethod(method.id)}
                    className="h-16 px-3.5 sm:px-4 rounded-2xl flex items-center justify-between transition-colors cursor-pointer select-none text-left bg-gray-50/80 border border-gray-200/90 hover:bg-gray-100/90 hover:border-gray-300"
                  >
                    {/* Left: Icon & Names */}
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gray-200/70 text-gray-800">
                        <IconComponent size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-[13px] font-bold text-gray-900 truncate">
                          {method.label}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {method.desc}
                        </div>
                      </div>
                    </div>

                    {/* Right: Toggle Button (Enable / Disable) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                          isEnabled ? "bg-black" : "bg-gray-200"
                        }`}
                        aria-checked={isEnabled}
                        role="switch"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                            isEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 10 Progress Indicator Dots: 7th Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 6
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 6
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom Buttons: Back & Continue (Solid Black Button-20, Zero Blue, No Arrows) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={prevStep}
                className="h-11 sm:h-12 px-8 sm:px-10 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="button-20 h-11 sm:h-12 px-10 sm:px-12 !rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        ) : currentStep === 8 ? (
          /* ============================================================ */
          /* STEP 8: Choose Plan (Pixel-Perfect Match to Mockup)          */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-4xl my-auto animate-fadeIn">
            {/* Title: Choose the right plan for your business */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-gray-950 text-center mb-0.5 sm:mb-1">
              Choose the right plan for your business
            </h1>

            {/* Subtitle: Start with a 7-day free trial. */}
            <p className="text-xs sm:text-[13px] text-gray-500 text-center mb-3 sm:mb-4">
              Start with a 7-day free trial.
            </p>

            {/* Monthly / Yearly Toggle Pill */}
            <div className="inline-flex items-center p-0.5 sm:p-1 rounded-full bg-gray-100/90 border border-gray-200/80 mb-3 sm:mb-4">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <span>Yearly</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    billingCycle === "yearly"
                      ? "bg-white/20 text-white"
                      : "bg-black/10 text-black"
                  }`}
                >
                  Save 20%
                </span>
              </button>
            </div>

            {/* 3 Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl sm:max-w-4xl mx-auto mb-2.5 sm:mb-3 items-stretch">
              {PRICING_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                const price =
                  billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-2xl p-3.5 sm:p-4 bg-white border flex flex-col justify-between text-center transition-all cursor-pointer select-none overflow-hidden ${
                      isSelected
                        ? "border-black ring-2 ring-black shadow-md"
                        : "border-gray-200/90 hover:border-gray-400 shadow-sm hover:shadow"
                    }`}
                  >
                    {/* Top Popular Badge (Middle Plan) */}
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl tracking-wide uppercase">
                        Popular
                      </div>
                    )}

                    {/* Card Content Top: Title & Price */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-950 mb-1">
                        {plan.name}
                      </h3>

                      <div className="flex items-baseline justify-center gap-0.5 mb-2 sm:mb-2.5">
                        <span className="text-2xl sm:text-[26px] font-black text-gray-950 tracking-tight">
                          {price}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">
                          {plan.period}
                        </span>
                      </div>

                      {/* Feature list centered */}
                      <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-[13px] text-gray-800 font-medium">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="leading-tight">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button: Start Trial (Black Button-20, Zero Blue) */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan.id);
                          nextStep();
                        }}
                        className="button-20 w-full h-8 sm:h-9 !rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center cursor-pointer"
                      >
                        Start Trial
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Subtext */}
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium text-center mb-2.5 sm:mb-3">
              No commitment. Upgrade or change your plan anytime.
            </p>

            {/* 10 Progress Indicator Dots: 8th Active */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i === 7
                      ? "w-2.5 h-2.5 rounded-full bg-black scale-110"
                      : i < 7
                      ? "w-2.5 h-2.5 rounded-full bg-gray-800"
                      : "w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom Navigation Buttons: Back & Continue (Solid Black Button-20, Zero Blue, No Arrows) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <button
                type="button"
                onClick={prevStep}
                className="h-10 sm:h-11 px-7 sm:px-9 rounded-full border border-black bg-white hover:bg-gray-50 text-black text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="button-20 h-10 sm:h-11 px-9 sm:px-11 !rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* STEP 9: Final Screen - Trial Started & Admin Setup Buffering */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center w-full max-w-lg my-auto animate-fadeIn text-center">
            {/* Title: 🎉 Your trial has started! */}
            <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight text-gray-950 flex items-center justify-center gap-2 mb-1">
              <span>🎉</span> Your trial has started!
            </h1>

            {/* Subtitle: 7 days free */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-950 mb-3 sm:mb-4">
              7 days free
            </h2>

            {/* Gray Box: The setting up page buffering the admin panel */}
            <div className="w-[300px] sm:w-[360px] h-[145px] sm:h-[160px] rounded-2xl bg-gray-200/80 border border-gray-300/80 p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden mb-4 sm:mb-5 select-none">
              {/* Buffering / Setup Progress Content */}
              <div className="flex flex-col items-center justify-center w-full z-10">
                {setupProgress < 100 ? (
                  <>
                    <div className="relative w-9 h-9 mb-1.5 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full border-2 border-gray-400 border-t-black animate-spin" />
                      <Store size={16} className="text-gray-900 absolute" />
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-gray-950 mb-0.5">
                      Setting up your admin panel...
                    </div>
                    <div className="text-[11px] text-gray-600 mb-2 font-medium">
                      Configuring {businessName || storeName || "POS"} workspace
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center mb-1.5 shadow-sm">
                      <Check size={18} className="stroke-[3]" />
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-gray-950 mb-0.5">
                      Admin Panel Ready!
                    </div>
                    <div className="text-[11px] text-gray-600 mb-2 font-medium">
                      POS terminal synchronized & active
                    </div>
                  </>
                )}

                {/* Progress Bar */}
                <div className="w-44 sm:w-52 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${setupProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-mono font-medium mt-1">
                  {setupProgress}% Complete
                </span>
              </div>
            </div>

            {/* 3 Feature Checkmark Bullets */}
            <div className="flex flex-col items-start gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-[13px] font-semibold text-gray-900 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black select-none">✓</span>
                <span>No payment charged today</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black select-none">✓</span>
                <span>
                  All {selectedPlan === "super" ? "Super" : selectedPlan === "basic" ? "Basic" : "Pro"} features are available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black select-none">✓</span>
                <span>Upgrade or change your plan anytime</span>
              </div>
            </div>

            {/* Subtext: Your trial ends on September 22, 2026 */}
            <p className="text-xs sm:text-[13px] font-bold text-gray-900 mb-4 sm:mb-5">
              Your trial ends on {formattedTrialEnd}
            </p>

            {/* Action Button: Continue to POS (Solid Black Button-20, Zero Blue, No Arrows) */}
            <button
              type="button"
              onClick={handleContinueToPOS}
              disabled={isRedirecting}
              className="button-20 h-10 sm:h-11 px-10 sm:px-12 !rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-transform"
            >
              {isRedirecting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Opening Admin Panel...
                </span>
              ) : (
                "Continue to POS"
              )}
            </button>
          </div>
        )}
      </main>

      {/* Footer spacer to maintain perfect fit-screen */}
      <footer className="w-full py-2 shrink-0 text-center">
        <span className="text-[11px] text-gray-400">
          {currentStep === totalSteps ? "" : `Step ${currentStep} of ${totalSteps}`}
        </span>
      </footer>
    </div>
  );
};

export default OnboardingFlow;
