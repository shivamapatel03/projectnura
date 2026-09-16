"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { BUSINESS_TYPES } from "@/lib/data";

import ScrollReveal from "@/components/ScrollReveal";

export const BusinessTypes: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = 3;
  const maxIndex = BUSINESS_TYPES.length - visibleCards;

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const currentItems = BUSINESS_TYPES.slice(startIndex, startIndex + visibleCards);

  return (
    <section id="solutions" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={24} duration={600}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
              Built for the way you do business.
            </h2>
            <p className="mt-2 text-base text-gray-600 max-w-2xl">
              One shared transaction engine powers all business types; business-specific features appear only when relevant.
            </p>
          </div>
          
          {/* Top right numbering indicator matching mockup */}
          <div className="hidden md:block text-sm font-mono text-gray-400 font-medium">
            01
          </div>
        </div>
      </ScrollReveal>

      {/* 3 Prominent Business Cards matching mockup with Staggered Scroll Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentItems.map((item, idx) => (
          <ScrollReveal
            key={item.id}
            direction="up"
            delay={idx * 130}
            distance={36}
            duration={700}
          >
            <div className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300">
              {/* Background Photography */}
              <div className="absolute inset-0 bg-gray-900">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
                {/* Clean flat dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              {/* Bottom Content Area */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1.5 max-w-[220px] line-clamp-2">
                    {item.tagline}
                  </p>
                </div>

                {/* Circular Action Button with 3D Button-20 Finish */}
                <div className="button-20 !p-0 w-11 h-11 !rounded-full text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 shrink-0 ml-3 cursor-pointer">
                  <ArrowUpRight size={20} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Navigation Arrows Below matching mockup image */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          aria-label="Previous Category"
          className="w-11 h-11 rounded-full border border-gray-300 bg-white text-gray-700 hover:text-gray-950 hover:border-gray-900 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Category"
          className="w-11 h-11 rounded-full border border-gray-300 bg-white text-gray-700 hover:text-gray-950 hover:border-gray-900 flex items-center justify-center transition-colors"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
export default BusinessTypes;
