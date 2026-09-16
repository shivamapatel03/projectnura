"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Users, 
  Utensils, 
  Package, 
  Building2, 
  BarChart3, 
  Sparkles,
  ChevronDown
} from "lucide-react";
import { POS_CAPABILITIES } from "@/lib/data";
import MuxVideoCard from "@/components/MuxVideoCard";
import ScrollReveal from "@/components/ScrollReveal";

export const FeatureEngine: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("quick-billing");

  const leftItems = POS_CAPABILITIES.slice(0, 3);
  const rightItems = POS_CAPABILITIES.slice(3, 6);

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case "quick-billing":
        return <Zap size={18} className="text-black" />;
      case "customer-mgmt":
        return <Users size={18} className="text-black" />;
      case "tables-kot":
        return <Utensils size={18} className="text-black" />;
      case "inventory":
        return <Package size={18} className="text-black" />;
      case "multi-outlet":
        return <Building2 size={18} className="text-black" />;
      case "reports":
        return <BarChart3 size={18} className="text-black" />;
      default:
        return <Sparkles size={18} className="text-black" />;
    }
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Headline */}
      <ScrollReveal direction="up" distance={24} duration={600} className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
          Sell wherever your customers are.
        </h2>
      </ScrollReveal>

      {/* 3-Column Layout (Left 3 items, Center Direct Video, Right 3 items) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Items 1 - 3 */}
        <ScrollReveal direction="left" distance={28} duration={650} className="lg:col-span-3 space-y-3">
          {leftItems.map((item, idx) => {
            const isActive = activeId === item.id;
            const itemNumber = idx + 1;
            return (
              <div
                key={item.id}
                onClick={() => setActiveId(isActive ? "" : item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left border-0 shadow-none outline-none ring-0 ${
                  isActive
                    ? "bg-gray-50"
                    : "hover:bg-gray-50/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 text-black flex items-center justify-center">
                      {getFeatureIcon(item.id)}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-gray-950">
                      {itemNumber}. {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-semibold bg-black text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isActive ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </div>
                </div>
                
                {/* Dropdown: Subline appears when active */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isActive ? "max-h-24 opacity-100 mt-2.5" : "max-h-0 opacity-0 mt-0 pointer-events-none"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollReveal>

        {/* Center Display: Direct Video Container - Outer gray bezel/border removed */}
        <ScrollReveal direction="scale" delay={100} duration={700} className="lg:col-span-6">
          <MuxVideoCard
            playbackId="NdEph7ZSF01HUdTUC7Rad7q4A8m01rkyP01cXXmbR2cCZw"
            title="Nuradesk Engine"
            aspectRatio="16/10"
            autoPlay={true}
            className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-none border-0"
          />
        </ScrollReveal>

        {/* Right Column: Items 4 - 6 */}
        <ScrollReveal direction="right" distance={28} duration={650} className="lg:col-span-3 space-y-3">
          {rightItems.map((item, idx) => {
            const isActive = activeId === item.id;
            const itemNumber = idx + 4;
            return (
              <div
                key={item.id}
                onClick={() => setActiveId(isActive ? "" : item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left border-0 shadow-none outline-none ring-0 ${
                  isActive
                    ? "bg-gray-50"
                    : "hover:bg-gray-50/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 text-black flex items-center justify-center">
                      {getFeatureIcon(item.id)}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-gray-950">
                      {itemNumber}. {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-semibold bg-black text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isActive ? "rotate-180 text-black" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Dropdown: Subline appears when active */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isActive ? "max-h-24 opacity-100 mt-2.5" : "max-h-0 opacity-0 mt-0 pointer-events-none"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollReveal>

      </div>
    </section>
  );
};
export default FeatureEngine;
