"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconCheck, IconChevronDown, IconSearch } from "@tabler/icons-react";
import * as Flags from "country-flag-icons/react/3x2";

interface AuthPageProps {
  initialMode?: "signup" | "login" | "verify";
}

const COUNTRIES = [
  { name: "India", code: "+91", iso: "IN" },
  { name: "United States", code: "+1", iso: "US" },
  { name: "United Kingdom", code: "+44", iso: "GB" },
  { name: "United Arab Emirates", code: "+971", iso: "AE" },
  { name: "Canada", code: "+1", iso: "CA" },
  { name: "Australia", code: "+61", iso: "AU" },
  { name: "Saudi Arabia", code: "+966", iso: "SA" },
  { name: "Singapore", code: "+65", iso: "SG" },
  { name: "Qatar", code: "+974", iso: "QA" },
  { name: "Kuwait", code: "+965", iso: "KW" },
  { name: "Oman", code: "+968", iso: "OM" },
  { name: "Bahrain", code: "+973", iso: "BH" },
  { name: "Germany", code: "+49", iso: "DE" },
  { name: "France", code: "+33", iso: "FR" },
  { name: "Malaysia", code: "+60", iso: "MY" },
  { name: "Indonesia", code: "+62", iso: "ID" },
  { name: "Philippines", code: "+63", iso: "PH" },
  { name: "South Africa", code: "+27", iso: "ZA" },
  { name: "Nigeria", code: "+234", iso: "NG" },
  { name: "Kenya", code: "+254", iso: "KE" },
  { name: "New Zealand", code: "+64", iso: "NZ" },
  { name: "Ireland", code: "+353", iso: "IE" },
  { name: "Italy", code: "+39", iso: "IT" },
  { name: "Spain", code: "+34", iso: "ES" },
  { name: "Netherlands", code: "+31", iso: "NL" },
  { name: "Switzerland", code: "+41", iso: "CH" },
  { name: "Sweden", code: "+46", iso: "SE" },
  { name: "Japan", code: "+81", iso: "JP" },
  { name: "South Korea", code: "+82", iso: "KR" },
  { name: "China", code: "+86", iso: "CN" },
  { name: "Hong Kong", code: "+852", iso: "HK" },
  { name: "Thailand", code: "+66", iso: "TH" },
  { name: "Vietnam", code: "+84", iso: "VN" },
  { name: "Brazil", code: "+55", iso: "BR" },
  { name: "Mexico", code: "+52", iso: "MX" },
  { name: "Nepal", code: "+977", iso: "NP" },
  { name: "Sri Lanka", code: "+94", iso: "LK" },
  { name: "Bangladesh", code: "+880", iso: "BD" },
  { name: "Pakistan", code: "+92", iso: "PK" },
  { name: "Egypt", code: "+20", iso: "EG" },
  { name: "Turkey", code: "+90", iso: "TR" },
];

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = "signup" }) => {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login" | "verify">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);

  // OTP Verification State (4 Digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState<number>(30);
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Country Code Picker State (Default: India +91)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (mode !== "verify") return;
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, resendCountdown]);

  // Focus first OTP box on entering verify mode
  React.useEffect(() => {
    if (mode === "verify") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 4).split("");
      digits.forEach((d, i) => {
        if (index + i < 4) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 3);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleaned[cleaned.length - 1];
    setOtp(newOtp);
    if (index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setResendCountdown(30);
    setOtp(["", "", "", ""]);
    otpInputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      setMode("verify");
      setResendCountdown(30);
      return;
    }
    if (mode === "verify") {
      setVerified(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 1000);
      return;
    }
    // mode === "login" -> route to 2FA Authenticator to access Admin Panel
    setSubmitted(true);
    setTimeout(() => {
      router.push("/authenticator");
    }, 1000);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-white text-gray-950 flex flex-col justify-between selection:bg-black selection:text-white overflow-x-hidden">
      {/* Top Header: Compact Height */}
      <header className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-2 sm:py-2.5 flex items-center justify-between shrink-0">
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
        <a
          href="mailto:support@nuradesk.com"
          className="text-xs sm:text-[13px] font-semibold text-gray-900 hover:text-black transition-colors"
        >
          Need Help?
        </a>
      </header>

      {/* Main Split Screen Content: Perfectly Fits Screen, Zero Cropping */}
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-10 py-1 sm:py-2 w-full flex items-center justify-center overflow-y-auto lg:overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full max-w-5xl my-auto">
          
          {/* Left Column: Headline, Avatars & Overlapping Images (Zero Shadows, Proportional) */}
          <div className="lg:col-span-6 flex flex-col items-center text-center">
            {/* Headline */}
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-gray-950 max-w-xs sm:max-w-sm leading-snug">
              {mode === "signup"
                ? "Sign in to manage your business and keep things running smoothly."
                : mode === "login"
                ? "Welcome back. Access your store, staff, and live analytics."
                : "Verify your account to activate your store, terminals, and dashboard."}
            </h1>

            {/* Overlapping Social Proof Avatar Stack (Zero Shadows) */}
            <div className="flex items-center justify-center -space-x-1.5 my-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                alt="Merchant"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
                alt="Merchant"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
                alt="Merchant"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
                alt="Merchant"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=120&auto=format&fit=crop"
                alt="Merchant"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover"
              />
            </div>

            {/* Overlapping Floating Showcase Images (Zero Shadows, Clean Cutout Aesthetic) */}
            <div className="relative w-[230px] sm:w-[250px] h-[180px] sm:h-[200px] mx-auto mt-1">
              {/* Top Left Image: Bright Warm Café Interior */}
              <div className="absolute top-0 left-0 w-[125px] sm:w-[138px] h-[135px] sm:h-[150px] rounded-lg overflow-hidden bg-gray-100 z-10">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
                  alt="Modern Café Counter"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Bottom Right Image: Dark Moody Restaurant with Curved Top-Left Corner */}
              <div className="absolute bottom-0 right-0 w-[130px] sm:w-[145px] h-[140px] sm:h-[155px] rounded-lg rounded-tl-[48px] sm:rounded-tl-[56px] overflow-hidden bg-gray-900 z-20">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
                  alt="Sleek Dining Space"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form / Verification Screen with Black Button-20 CTA (Zero Shadows) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[365px] bg-white">
              {mode === "verify" ? (
                /* Verification Screen Matching Mockup */
                <div>
                  {/* Form Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-950 text-center tracking-tight mb-1.5">
                    Verify Your Account
                  </h2>

                  {/* Subtitle with email highlighted in blue */}
                  <p className="text-xs sm:text-[13px] text-gray-800 text-center mb-6 leading-normal">
                    OTP send to{" "}
                    <span className="font-semibold text-blue-600 break-all">
                      {formData.email || "Xyx22@gmail.com"}
                    </span>
                  </p>

                  {/* Success Notification */}
                  {verified && (
                    <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-center gap-2">
                      <IconCheck size={15} className="text-emerald-600 shrink-0" />
                      <span>Account verified successfully! Redirecting to onboarding...</span>
                    </div>
                  )}

                  {/* OTP Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 4 Digit Input Boxes with Full Light Grey Fill */}
                    <div className="flex items-center justify-center gap-3 sm:gap-3.5">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-[52px] h-[56px] sm:w-[58px] sm:h-[62px] rounded-2xl border border-gray-200 bg-gray-100 text-center text-xl sm:text-2xl font-bold text-gray-950 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all shadow-none"
                          autoComplete="one-time-code"
                        />
                      ))}
                    </div>

                    {/* Resend Code Prompt */}
                    <div className="text-center text-xs sm:text-[13px] text-gray-800">
                      Didn't receive it?{" "}
                      {resendCountdown > 0 ? (
                        <span className="text-gray-500">
                          Resend code in{" "}
                          <span className="font-bold text-gray-900">{resendCountdown}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          className="font-bold text-gray-950 hover:underline cursor-pointer"
                        >
                          Resend code
                        </button>
                      )}
                    </div>

                    {/* Primary CTA: Verify & Continue (No arrow) */}
                    <div>
                      <button
                        type="submit"
                        className="button-20 w-full h-10 !rounded-full text-xs sm:text-[13px] font-semibold cursor-pointer flex items-center justify-center"
                      >
                        Verify & Continue
                      </button>
                    </div>
                  </form>

                  {/* Return to signup / change email */}
                  <div className="mt-4 text-center text-xs text-gray-500">
                    Entered wrong email?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>
                </div>
              ) : (
                /* Signup / Login Form */
                <div>
                  {/* Form Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-950 text-center tracking-tight mb-1.5 sm:mb-2">
                    {mode === "signup" ? "Create Account" : "Sign In"}
                  </h2>

                  {/* Top Google Sign-In Pill Button (Zero Shadows) */}
                  <button
                    type="button"
                    className="w-full h-9 rounded-full bg-gray-100 hover:bg-gray-200/80 px-4 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>

                  {/* OR Divider */}
                  <div className="my-1 sm:my-1.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">
                      OR
                    </span>
                  </div>

                  {/* Success Notification */}
                  {submitted && (
                    <div className="mb-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                      <IconCheck size={14} className="text-emerald-600 shrink-0" />
                      <span>
                        {mode === "signup"
                          ? "Account setup initiated! Check your email to verify."
                          : "Authenticated! Redirecting to Two-Factor Authenticator..."}
                      </span>
                    </div>
                  )}

                  {/* Form Body: Compact Perfect Pill Shape Inputs */}
                  <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
                    {mode === "signup" && (
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-semibold text-gray-900 mb-0.5 leading-none">
                          Full Name*
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Alex Henderson"
                          className="w-full h-9 rounded-full border border-gray-200 bg-gray-50/70 px-4 text-xs sm:text-[13px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] font-semibold text-gray-900 mb-0.5 leading-none">
                        Email Address :
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@business.com"
                        className="w-full h-9 rounded-full border border-gray-200 bg-gray-50/70 px-4 text-xs sm:text-[13px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>

                    {mode === "signup" && (
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-semibold text-gray-900 mb-0.5 leading-none">
                          Phone Number(optional):
                        </label>
                        <div className="relative">
                          {/* Pill Container with Country Code Trigger and Phone Input */}
                          <div className="w-full h-9 rounded-full border border-gray-200 bg-gray-50/70 focus-within:bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black flex items-center transition-all">
                            {/* Country Code Trigger Button with country-flag-icons SVG */}
                            <button
                              type="button"
                              onClick={() => {
                                setCountryDropdownOpen(!countryDropdownOpen);
                                setCountrySearch("");
                              }}
                              className="h-full pl-3 pr-2 flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-black shrink-0 border-r border-gray-200 cursor-pointer focus:outline-none transition-colors"
                              aria-label="Select Country Code"
                            >
                              {(() => {
                                const FlagIcon = Flags[selectedCountry.iso as keyof typeof Flags];
                                return FlagIcon ? (
                                  <FlagIcon className="w-5 h-3.5 object-cover rounded-xs shadow-xs" />
                                ) : (
                                  <span className="text-sm">🇮🇳</span>
                                );
                              })()}
                              <span className="text-[11px] font-medium text-gray-700">{selectedCountry.code}</span>
                              <IconChevronDown size={11} className="text-gray-400" />
                            </button>

                            {/* Phone Digits Input */}
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="98765 43210"
                              className="w-full h-full bg-transparent px-3 text-xs sm:text-[13px] text-gray-900 placeholder:text-gray-400 outline-none rounded-r-full"
                            />
                          </div>

                          {/* Dropdown Popover with Country Search */}
                          {countryDropdownOpen && (
                            <>
                              {/* Invisible Backdrop for click-outside */}
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setCountryDropdownOpen(false)}
                              />

                              {/* Popover Card */}
                              <div className="absolute z-50 left-0 top-10 w-64 max-h-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                                {/* Search Input Bar */}
                                <div className="p-2 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2 shrink-0">
                                  <IconSearch size={13} className="text-gray-400 shrink-0 ml-1" />
                                  <input
                                    type="text"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    placeholder="Search country or code..."
                                    className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 outline-none"
                                    autoFocus
                                  />
                                </div>

                                {/* Scrollable list with country-flag-icons SVGs */}
                                <div className="overflow-y-auto max-h-40 p-1 divide-y divide-gray-50">
                                  {filteredCountries.map((c) => {
                                    const FlagIcon = Flags[c.iso as keyof typeof Flags];
                                    return (
                                      <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCountry(c);
                                          setCountryDropdownOpen(false);
                                          setCountrySearch("");
                                        }}
                                        className={`w-full px-2.5 py-1.5 flex items-center justify-between rounded-lg text-xs hover:bg-gray-100 text-left transition-colors cursor-pointer ${
                                          selectedCountry.name === c.name ? "bg-gray-50 font-semibold" : ""
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          {FlagIcon ? (
                                            <FlagIcon className="w-4 h-3 object-cover rounded-xs shrink-0 shadow-xs" />
                                          ) : null}
                                          <span className="text-gray-800 truncate">{c.name}</span>
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-mono shrink-0 ml-2">
                                          {c.code}
                                        </span>
                                      </button>
                                    );
                                  })}
                                  {filteredCountries.length === 0 && (
                                    <div className="py-3 text-center text-xs text-gray-400">
                                      No country found
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] font-semibold text-gray-900 mb-0.5 leading-none">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full h-9 rounded-full border border-gray-200 bg-gray-50/70 px-4 pr-10 text-xs sm:text-[13px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                        </button>
                      </div>
                    </div>

                    {mode === "signup" && (
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-semibold text-gray-900 mb-0.5 leading-none">
                          Confirm password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••••••"
                            className="w-full h-9 rounded-full border border-gray-200 bg-gray-50/70 px-4 pr-10 text-xs sm:text-[13px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Terms / Remember Me */}
                    {mode === "signup" ? (
                      <div className="flex items-center justify-center pt-0.5">
                        <label className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-gray-800 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span>
                            I agree to the{" "}
                            <a href="#" className="font-semibold underline hover:text-black">
                              Terms & Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] pt-0.5">
                        <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span>Remember me</span>
                        </label>
                        <a href="#" className="font-semibold text-gray-900 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    {/* Primary CTA Button: In Black with button-20 CSS (No arrow) */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        className="button-20 w-full h-9 !rounded-full text-xs sm:text-[13px] font-semibold cursor-pointer flex items-center justify-center"
                      >
                        {mode === "signup" ? "Create Account" : "Sign In"}
                      </button>
                    </div>
                  </form>

                  {/* Bottom Toggle Link */}
                  <div className="mt-2 text-center text-xs text-gray-600">
                    {mode === "signup" ? (
                      <span>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          Log In
                        </button>
                      </span>
                    ) : (
                      <span>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          Create Account
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AuthPage;
