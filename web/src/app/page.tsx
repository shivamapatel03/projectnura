import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BusinessTypes from "@/components/BusinessTypes";
import NuraAISection from "@/components/NuraAISection";
import FeatureEngine from "@/components/FeatureEngine";
import IndustryTabs from "@/components/IndustryTabs";
import PricingSection from "@/components/PricingSection";
import UpdatesSection from "@/components/UpdatesSection";
import BrandShowcase from "@/components/BrandShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* 2. Hero Section with Headline & Interactive POS Preview */}
      <HeroSection />

      {/* 3. "Built for the way you do business." (Cafe, Restaurant, Retail) */}
      <BusinessTypes />

      {/* 4. "Meet NuraAI. Your Business, Now Intelligent." */}
      <NuraAISection />

      {/* 5. "Sell wherever your customers are." (Interactive 6-Point Engine) */}
      <FeatureEngine />

      {/* 6. "Industry-Specific Features" (Bakeries, Retail, Salons, Restaurants) */}
      <IndustryTabs />

      {/* 7. "Pricing" (Monthly/Yearly with Basic, Pro, Super) */}
      <PricingSection />

      {/* 8. "Get Updates" Newsletter Subscription */}
      <UpdatesSection />

      {/* 9. Giant "Nuradesk" Brand Showcase with Floating Visuals */}
      <BrandShowcase />

      {/* 10. Dark Brand Footer */}
      <Footer />
    </main>
  );
}
