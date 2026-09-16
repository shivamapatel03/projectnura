"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import MuxVideoCard from "@/components/MuxVideoCard";
import ScrollReveal from "@/components/ScrollReveal";

export const HeroSection: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Background Video Layer with Dark Shading & Film Grain Noise */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 w-full h-full scale-105">
          <MuxVideoCard
            playbackId="NdEph7ZSF01HUdTUC7Rad7q4A8m01rkyP01cXXmbR2cCZw"
            title="Nuradesk Background Video"
            aspectRatio="auto"
            autoPlay={true}
            className="w-full h-full object-cover [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:object-cover pointer-events-none"
          />
        </div>
        
        {/* Dark Shading Gradient Overlay matching user mockup */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85 backdrop-blur-[1px]" />
        
        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/85" />

        {/* Subtle Film Grain / Noise Effect Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Centered Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 text-center flex flex-col items-center justify-center">
        <ScrollReveal direction="up" distance={24} duration={700}>
          {/* Centered Pure White Brand Lockup */}
          <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-6 sm:mb-7">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 [filter:brightness(0)_invert(1)]">
              <Image
                src="/logo/logo.png.png"
                alt="Nuradesk Mark"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <div className="relative w-32 sm:w-48 h-8 sm:h-12 flex items-center justify-center [filter:brightness(0)_invert(1)]">
              <Image
                src="/logo/text.png"
                alt="Nuradesk"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Hero Headline: Reduced Size, Strictly Two Lines */}
          <h1 className="text-xl min-[360px]:text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-white max-w-3xl sm:max-w-4xl mx-auto leading-[1.22] sm:leading-[1.16]">
            <span className="block">Everything You Need to Run</span>
            <span className="block text-gray-100 mt-0.5 sm:mt-1">Your Business, in One POS.</span>
          </h1>

          {/* Centered CTA Button using classic black button-20 */}
          <div className="mt-7 sm:mt-9 flex justify-center">
            <Link
              href="/signup"
              className="button-20 text-sm sm:text-base font-semibold !px-7 sm:!px-8 !py-2.5 sm:!py-3 !rounded-full cursor-pointer"
            >
              Try - It's Free
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
export default HeroSection;
