"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { PRICING_TIERS } from "@/lib/data";
import ScrollReveal from "@/components/ScrollReveal";

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Pricing Header & Switcher */}
      <ScrollReveal direction="up" distance={24} duration={600}>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
            Pricing
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            Transparent, predictable subscription plans. Start with a 7-day free trial.
          </p>
        </div>

        {/* Monthly / Yearly Switcher with Smooth Sliding Button-20 3D Pill */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex p-1 bg-gray-100 rounded-full border border-gray-200 select-none">
            
            {/* Animated 3D Button-20 Sliding Pill */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-32 sm:w-36 button-20 !p-0 !rounded-full transition-transform duration-300 ease-out pointer-events-none ${
                billingCycle === "yearly" ? "translate-x-full" : "translate-x-0"
              }`}
            />

            {/* Monthly Button */}
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`relative z-10 w-32 sm:w-36 h-9 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center justify-center cursor-pointer ${
                billingCycle === "monthly"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              Monthly
            </button>

            {/* Yearly Button */}
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`relative z-10 w-32 sm:w-36 h-9 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                billingCycle === "yearly"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              <span>Yearly</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors duration-200 ${
                  billingCycle === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Save 15%
              </span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 3 Pricing Cards matching mockup with Staggered Scroll Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {PRICING_TIERS.map((tier, idx) => {
          const price = billingCycle === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
          const period = billingCycle === "monthly" ? "/mo." : "/yr.";

          return (
            <ScrollReveal
              key={tier.id}
              direction="up"
              delay={idx * 140}
              distance={36}
              duration={700}
              className="flex"
            >
              <div
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 bg-white w-full ${
                  tier.highlight
                    ? "border-black ring-1 ring-black shadow-none"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
              {/* Popular Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-none">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Plan Name */}
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold text-gray-950">{tier.name}</h3>
                  {tier.id === "super" && (
                    <span className="text-[11px] font-semibold text-black bg-gray-100 px-2 py-0.5 rounded">
                      Includes NuraAI
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-6 min-h-[32px]">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline">
                    <span className="text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight font-sans">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 font-medium ml-1.5 text-sm sm:text-base">
                      {period}
                    </span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      Effective ₹{tier.yearlyMonthlyEquivalent}/month, billed annually
                    </div>
                  )}
                </div>

                {/* Features Checklist */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                    What's included:
                  </span>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <IconCheck size={16} className="text-black shrink-0 mt-0.5" stroke={2.5} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button using user's exact .button-20 CSS */}
              <div className="pt-4">
                <Link
                  href="/signup"
                  className="button-20 w-full text-center block cursor-pointer"
                >
                  {tier.ctaText}
                </Link>
                <p className="text-[11px] text-gray-400 text-center mt-2.5">
                  7-day trial • Cancel anytime • Data preserved
                </p>
              </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
export default PricingSection;
