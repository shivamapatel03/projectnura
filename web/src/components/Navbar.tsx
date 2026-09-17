"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconChevronDown, IconX } from "@tabler/icons-react";

interface SubItem {
  name: string;
  targetId: string;
}

interface NavSection {
  id: string;
  label: string;
  targetId: string;
  items: SubItem[];
}

const DROPDOWN_SECTIONS: NavSection[] = [
  {
    id: "solution",
    label: "Solution",
    targetId: "solutions",
    items: [
      { name: "Café", targetId: "solutions" },
      { name: "Restaurant", targetId: "solutions" },
      { name: "Retail", targetId: "solutions" },
      { name: "Bakery", targetId: "industry-tabs" },
      { name: "Salon", targetId: "industry-tabs" },
    ],
  },
  {
    id: "features",
    label: "Features",
    targetId: "features",
    items: [
      { name: "POS Terminal", targetId: "features" },
      { name: "Kitchen KDS", targetId: "features" },
      { name: "NuraAI", targetId: "nuraai" },
      { name: "Multi-Outlet", targetId: "features" },
    ],
  },
];

export const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect scroll past Hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        setPastHero(heroBottom <= 75);
      } else {
        setPastHero(window.scrollY > 600);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("nav")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Prevent background scrolling when sidebar drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  const scrollToSection = (id: string) => {
    closeDrawer();
    setOpenDropdown(null);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMouseEnter = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleTopNavClick = (sectionId: string, targetId: string) => {
    if (openDropdown === sectionId) {
      scrollToSection(targetId);
    } else {
      setOpenDropdown(sectionId);
    }
  };

  return (
    <>
      {/* Dual-Phase Sticky Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out ${
          pastHero
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs py-3 sm:py-3.5"
            : "bg-transparent text-white border-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between relative min-h-[44px]">
          {/* Left: Brand Logo & Text */}
          <div
            onClick={() => scrollToSection("hero")}
            className={`flex items-center gap-2.5 cursor-pointer select-none transition-all duration-300 ${
              pastHero
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none invisible"
            }`}
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
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
          </div>

          {/* Center: Desktop Navigation with Simple, Reliable Dropdowns */}
          <nav className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-7 lg:gap-9">
            {/* 1 & 2: Solution & Features with Clean Dropdowns */}
            {DROPDOWN_SECTIONS.map((section) => {
              const isOpen = openDropdown === section.id;
              return (
                <div
                  key={section.id}
                  className="relative py-2"
                  onMouseEnter={() => handleMouseEnter(section.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleTopNavClick(section.id, section.targetId)}
                    className={`inline-flex items-center gap-1.5 text-sm lg:text-[15px] font-medium transition-colors cursor-pointer select-none ${
                      pastHero
                        ? isOpen
                          ? "text-black"
                          : "text-gray-700 hover:text-black"
                        : isOpen
                        ? "text-white"
                        : "text-white/90 hover:text-white"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span>{section.label}</span>
                    <IconChevronDown
                      size={14}
                      className={`transition-transform duration-200 ease-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                      } ${pastHero ? "text-gray-400" : "text-white/70"}`}
                    />
                  </button>

                  {/* Clean Typographic Dropdown Menu: Fast, Smooth & Bug-Free */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 transition-all duration-150 ease-out ${
                      isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto visible"
                        : "opacity-0 translate-y-1 pointer-events-none invisible"
                    }`}
                  >
                    <div className="bg-white border border-gray-200/90 shadow-2xl rounded-2xl p-5 sm:p-6 w-64 sm:w-72 select-none">
                      <div className="space-y-2.5">
                        {section.items.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => scrollToSection(item.targetId)}
                            className="group flex items-center justify-between w-full text-left text-xl sm:text-2xl font-bold tracking-tight text-gray-400 hover:text-black transition-colors duration-150 cursor-pointer"
                          >
                            <span className="group-hover:translate-x-1.5 transition-transform duration-150 ease-out">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-black transition-opacity duration-150">
                              →
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Bottom Footer Sub-Link */}
                      <div className="mt-4 pt-3.5 border-t border-gray-100">
                        <button
                          onClick={() => scrollToSection(section.targetId)}
                          className="text-xs font-semibold text-gray-400 hover:text-black transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Explore all {section.label.toLowerCase()}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 3: Pricing (ONLY direct link, NO dropdown, NO chevron) */}
            <div
              className="py-2"
              onMouseEnter={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => scrollToSection("pricing")}
                className={`text-sm lg:text-[15px] font-medium transition-colors cursor-pointer select-none ${
                  pastHero
                    ? "text-gray-700 hover:text-black"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Pricing
              </button>
            </div>
          </nav>

          {/* Right Area: Action Buttons (Desktop) & Burger Menu */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto md:ml-0">
            {/* Desktop Scrolled CTA: "Try - It's Free" appears only past hero */}
            <div
              className={`hidden md:flex items-center transition-opacity duration-300 ${
                pastHero
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none invisible"
              }`}
            >
              <Link
                href="/signup"
                className="button-20 text-xs sm:text-sm font-semibold !px-4 sm:!px-6 !py-2 !rounded-full cursor-pointer"
              >
                Try - It's Free
              </Link>
            </div>

            {/* Burger Menu Button: Strictly Mobile Only (md:hidden) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`md:hidden p-2 sm:p-2.5 rounded-xl transition-colors flex flex-col justify-center items-center gap-1.5 focus:outline-none cursor-pointer ${
                pastHero
                  ? "text-gray-950 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Open Navigation Menu"
            >
              <span
                className={`w-5 sm:w-6 h-[2px] rounded-full transition-colors ${
                  pastHero ? "bg-black" : "bg-white"
                }`}
              />
              <span
                className={`w-5 sm:w-6 h-[2px] rounded-full transition-colors ${
                  pastHero ? "bg-black" : "bg-white"
                }`}
              />
              <span
                className={`w-5 sm:w-6 h-[2px] rounded-full transition-colors ${
                  pastHero ? "bg-black" : "bg-white"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Right-Side Minimalist Menu Drawer */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-200 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white z-50 shadow-2xl flex flex-col justify-between p-7 sm:p-10 transition-transform duration-300 ease-out transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header: "Menu" and Close button */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-gray-950 font-sans">
              Menu
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close Menu"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* The 3 Core Sections: Solution, Features, Pricing */}
        <div className="flex-1 flex flex-col justify-center space-y-8 my-auto py-6 overflow-y-auto">
          {/* 1. Solution */}
          <div className="space-y-2">
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-2xl sm:text-3xl font-bold text-gray-400 hover:text-black transition-colors text-left block cursor-pointer tracking-tight"
            >
              Solution
            </button>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 font-normal">
              <span
                onClick={() => scrollToSection("solutions")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Café
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("solutions")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Restaurant
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("solutions")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Retail
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("industry-tabs")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Bakery
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("industry-tabs")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Salon
              </span>
            </div>
          </div>

          {/* 2. Features */}
          <div className="space-y-2">
            <button
              onClick={() => scrollToSection("features")}
              className="text-2xl sm:text-3xl font-bold text-gray-400 hover:text-black transition-colors text-left block cursor-pointer tracking-tight"
            >
              Features
            </button>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 font-normal">
              <span
                onClick={() => scrollToSection("features")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                POS Terminal
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("features")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Kitchen KDS
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("nuraai")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                NuraAI
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("features")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Multi-Outlet
              </span>
            </div>
          </div>

          {/* 3. Pricing */}
          <div className="space-y-2">
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-2xl sm:text-3xl font-bold text-gray-400 hover:text-black transition-colors text-left block cursor-pointer tracking-tight"
            >
              Pricing
            </button>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 font-normal">
              <span
                onClick={() => scrollToSection("pricing")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Basic Plan
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("pricing")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Pro Plan
              </span>
              <span className="text-gray-300">•</span>
              <span
                onClick={() => scrollToSection("pricing")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Super Plan
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Sign Up */}
        <div className="pt-6 border-t border-gray-100">
          <Link
            href="/signup"
            onClick={closeDrawer}
            className="button-20 w-full text-sm font-semibold !py-3 !rounded-full cursor-pointer text-center block"
          >
            Try - It's Free
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
