"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export const BrandShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Only update when section is in or near the viewport
            if (rect.top < viewportHeight + 150 && rect.bottom > -150) {
              const center = rect.top + rect.height / 2 - viewportHeight / 2;
              setOffset(center);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
      <div className="relative min-h-[440px] sm:min-h-[520px] flex items-center justify-center">
        
        {/* Floating Contextual Tiles matching the mockup layout with parallax */}

        {/* Top Left: Cafe Storefront */}
        <div 
          style={{ transform: `translate3d(${offset * -0.04}px, ${offset * 0.12}px, 0)` }}
          className="absolute -top-4 left-4 sm:left-16 w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 hidden sm:block will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop"
            alt="Café POS"
            fill
            className="object-cover"
          />
        </div>

        {/* Top Center: Kitchen KDS Station */}
        <div 
          style={{ transform: `translate3d(calc(-50% + ${offset * 0.02}px), ${offset * 0.16}px, 0)` }}
          className="absolute top-0 left-1/4 sm:left-[38%] w-20 h-16 sm:w-40 sm:h-28 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 opacity-70 sm:opacity-100 will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&auto=format&fit=crop"
            alt="Kitchen Preparation"
            fill
            className="object-cover"
          />
        </div>

        {/* Top Right: Dark Register Display */}
        <div 
          style={{ transform: `translate3d(${offset * 0.05}px, ${offset * 0.14}px, 0)` }}
          className="absolute top-2 right-2 sm:right-28 w-20 h-18 sm:w-40 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 opacity-70 sm:opacity-100 will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="/pos_register.jpg"
            alt="POS Register"
            fill
            className="object-cover"
          />
        </div>

        {/* Far Right: Retail Barcode & Clothes Rack */}
        <div 
          style={{ transform: `translate3d(${offset * 0.08}px, ${offset * 0.06}px, 0)` }}
          className="absolute top-1/3 -right-2 sm:right-6 w-24 h-28 sm:w-36 sm:h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 hidden md:block will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop"
            alt="Retail Store"
            fill
            className="object-cover"
          />
        </div>

        {/* Far Left: Busy Dining Room */}
        <div 
          style={{ transform: `translate3d(${offset * -0.08}px, calc(-50% + ${offset * 0.06}px), 0)` }}
          className="absolute top-1/2 -left-2 sm:left-4 w-24 h-28 sm:w-36 sm:h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 hidden md:block will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"
            alt="Restaurant Guests"
            fill
            className="object-cover"
          />
        </div>

        {/* Center: Massive Bold Nuradesk Brand Wordmark */}
        <div 
          style={{ transform: `translate3d(0, ${offset * 0.02}px, 0)` }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto py-12 will-change-transform transition-transform duration-75 ease-out"
        >
          <div className="relative w-full max-w-[580px] h-14 sm:h-28 md:h-36 mx-auto">
            <Image
              src="/logo/text.png"
              alt="Nuradesk"
              fill
              priority
              className="object-contain"
            />
          </div>
          <p className="mt-4 text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-gray-500 font-mono">
            Point of Sale Operating Platform
          </p>
        </div>

        {/* Bottom Left: Barista Brewing */}
        <div 
          style={{ transform: `translate3d(${offset * -0.05}px, ${offset * -0.12}px, 0)` }}
          className="absolute -bottom-2 left-2 sm:left-24 w-20 h-16 sm:w-36 sm:h-28 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 opacity-70 sm:opacity-100 will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&auto=format&fit=crop"
            alt="Barista"
            fill
            className="object-cover"
          />
        </div>

        {/* Bottom Center: Handheld POS Device */}
        <div 
          style={{ transform: `translate3d(-50%, ${offset * -0.18}px, 0)` }}
          className="absolute -bottom-4 left-1/2 w-20 h-18 sm:w-36 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 opacity-70 sm:opacity-100 will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=400&auto=format&fit=crop"
            alt="Tap and Pay"
            fill
            className="object-cover"
          />
        </div>

        {/* Bottom Right: Countertop Tablet Register */}
        <div 
          style={{ transform: `translate3d(${offset * 0.06}px, ${offset * -0.14}px, 0)` }}
          className="absolute -bottom-2 right-6 sm:right-24 w-28 h-24 sm:w-36 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-none z-10 hidden sm:block will-change-transform transition-transform duration-75 ease-out"
        >
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=400&auto=format&fit=crop"
            alt="Tablet Terminal"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
};
export default BrandShowcase;
