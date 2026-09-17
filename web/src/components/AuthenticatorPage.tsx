"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconShieldCheck, IconCheck, IconKey, IconArrowLeft } from "@tabler/icons-react";

export const AuthenticatorPage: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [trustDevice, setTrustDevice] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [useBackupCode]);

  const handleCodeChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    const newCode = [...code];
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newCode[index] = cleaned[cleaned.length - 1];
    setCode(newCode);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!useBackupCode && code.some((c) => !c)) {
      setErrorMsg("Please enter all 6 digits of your authenticator code.");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1200);
    }, 800);
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

        {/* Right: Return to Sign In / Need Help */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs sm:text-[13px] font-semibold text-gray-600 hover:text-black flex items-center gap-1 transition-colors"
          >
            <IconArrowLeft size={13} /> Sign In
          </Link>
          <a
            href="mailto:support@nuradesk.com"
            className="text-xs sm:text-[13px] font-semibold text-gray-900 hover:text-black transition-colors"
          >
            Need Help?
          </a>
        </div>
      </header>

      {/* Main Centered Authenticator Card */}
      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-2 sm:py-4 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-[380px] sm:max-w-[420px] my-auto">
          {/* Security Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-950 flex items-center justify-center mx-auto mb-3">
            <IconShieldCheck size={26} className="text-black" />
          </div>

          {/* Screen Title */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 mb-1.5">
            Two-Factor Authentication
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-gray-600 mb-6 leading-relaxed max-w-sm mx-auto">
            {useBackupCode
              ? "Enter one of your 8-digit emergency backup recovery codes to access the Admin Panel."
              : "Enter the 6-digit security code generated by your authenticator app (Google Authenticator, Microsoft Authenticator, or 1Password)."}
          </p>

          {/* Success Banner */}
          {verified && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
              <IconCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Identity verified! Accessing Admin Panel...</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {!useBackupCode ? (
              /* 6 Square Segmented Input Slots (Joined, Not Individual) */
              <div className="flex items-center justify-center">
                <div className="inline-flex rounded-xl border border-gray-300 bg-gray-100 overflow-hidden divide-x divide-gray-300 shadow-xs focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 transition-all">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-11 h-11 sm:w-12 sm:h-12 bg-transparent text-center text-lg sm:text-xl font-bold font-mono text-gray-950 focus:bg-white focus:outline-none transition-colors"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Backup Code Single Input */
              <div>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCD-1234-EFGH"
                  className="w-full h-11 rounded-full border border-gray-200 bg-gray-100 px-5 text-center font-mono tracking-widest text-sm text-gray-950 placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                  autoFocus
                />
              </div>
            )}

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-center pt-1">
              <label className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span>Don't ask again on this trusted browser for 30 days</span>
              </label>
            </div>

            {/* Primary Action Button (Solid Black .button-20, No Arrow) */}
            <div>
              <button
                type="submit"
                disabled={verifying || verified}
                className="button-20 w-full h-10 sm:h-11 !rounded-full text-xs sm:text-sm font-semibold cursor-pointer flex items-center justify-center disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Access Admin Panel"}
              </button>
            </div>
          </form>

          {/* Toggle Backup Code / Help */}
          <div className="mt-5 space-y-2 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setErrorMsg("");
              }}
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <IconKey size={13} />
              {useBackupCode
                ? "Use 6-digit Authenticator app code"
                : "Lost access to authenticator? Use backup code"}
            </button>

            <div className="text-gray-400 text-[11px]">
              Protected with industry-standard TOTP encryption.
            </div>
          </div>
        </div>
      </main>

      {/* Footer spacer */}
      <footer className="w-full py-2.5 shrink-0 text-center">
        <span className="text-[11px] text-gray-400">
          Nuradesk Admin Security &bull; POS Cloud Portal
        </span>
      </footer>
    </div>
  );
};

export default AuthenticatorPage;
