"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Layers, 
  Clock, 
  Scale, 
  ShoppingBag, 
  Scan, 
  Package, 
  Users, 
  Truck, 
  UserCheck, 
  Calendar, 
  Sparkles, 
  FileText, 
  Grid, 
  ChefHat, 
  Split, 
  Share2,
  Coffee,
  Zap
} from "lucide-react";
import { INDUSTRY_TABS } from "@/lib/data";
import ScrollReveal from "@/components/ScrollReveal";

export const IndustryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("cafe");
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  const updatePill = () => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  };

  useEffect(() => {
    updatePill();
    setMounted(true);
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activeTab]);

  const current = INDUSTRY_TABS.find((t) => t.id === activeTab) || INDUSTRY_TABS[0];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Coffee":
        return <Coffee size={20} className="text-white" />;
      case "Zap":
        return <Zap size={20} className="text-white" />;
      case "Layers":
        return <Layers size={20} className="text-white" />;
      case "Clock":
        return <Clock size={20} className="text-white" />;
      case "Scale":
        return <Scale size={20} className="text-white" />;
      case "ShoppingBag":
        return <ShoppingBag size={20} className="text-white" />;
      case "Scan":
        return <Scan size={20} className="text-white" />;
      case "Package":
        return <Package size={20} className="text-white" />;
      case "Users":
        return <Users size={20} className="text-white" />;
      case "Truck":
        return <Truck size={20} className="text-white" />;
      case "UserCheck":
        return <UserCheck size={20} className="text-white" />;
      case "Calendar":
        return <Calendar size={20} className="text-white" />;
      case "Sparkles":
        return <Sparkles size={20} className="text-white" />;
      case "FileText":
        return <FileText size={20} className="text-white" />;
      case "Grid":
        return <Grid size={20} className="text-white" />;
      case "ChefHat":
        return <ChefHat size={20} className="text-white" />;
      case "Split":
        return <Split size={20} className="text-white" />;
      case "Share2":
        return <Share2 size={20} className="text-white" />;
      default:
        return <Layers size={20} className="text-white" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Headline & Tabs */}
      <ScrollReveal direction="up" distance={24} duration={600}>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
            Industry-Specific
            <br />
            Features
          </h2>
        </div>

        {/* Tabs Selector with mobile scrollability and smooth sliding pill */}
        <div className="flex justify-start sm:justify-center mb-8 sm:mb-12 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="relative inline-flex p-1 bg-gray-100 rounded-full border border-gray-200 shrink-0 mx-auto select-none">
            
            {/* Smooth Sliding Active 3D Button-20 Pill */}
            {pillStyle.width > 0 && (
              <div
                className={`absolute top-1 bottom-1 button-20 !p-0 !rounded-full pointer-events-none ${
                  mounted ? "transition-all duration-300 ease-out" : ""
                }`}
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                }}
              />
            )}

            {INDUSTRY_TABS.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-950 font-medium"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Spotlight Card with Borders Removed */}
      <ScrollReveal direction="scale" delay={120} duration={650}>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-10 border-0 shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Feature Image with Rounded Corners and Zero Border */}
          <div className="md:col-span-6 relative h-[220px] sm:h-[340px] rounded-2xl overflow-hidden bg-gray-100 border-0 shadow-none">
            <Image
              src={current.image}
              alt={current.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Right Circular Badges and Descriptions - Centered Caption */}
          <div className="md:col-span-6 flex flex-col justify-center items-center text-center">
            <div className="mb-4 sm:mb-6 w-full text-center">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto text-center">
                {current.caption}
              </p>
            </div>

            {/* 4 Feature Badges with Circular Dark Icons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  {/* Circular 3D icon with button-20 styling */}
                  <div className="button-20 !p-0 w-10 h-10 sm:w-12 sm:h-12 !rounded-full flex items-center justify-center mb-2 shrink-0 transition-transform duration-200 group-hover:scale-105">
                    {renderIcon(feat.iconName)}
                  </div>
                  <span className="text-xs font-bold text-gray-950">
                    {feat.title}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
      </ScrollReveal>
    </section>
  );
};
export default IndustryTabs;
