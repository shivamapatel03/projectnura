"use client";

import React from "react";
import MuxVideoCard from "@/components/MuxVideoCard";
import ScrollReveal from "@/components/ScrollReveal";

export const NuraAISection: React.FC = () => {
  return (
    <section id="nuraai" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Section Headline */}
      <ScrollReveal direction="up" distance={24} duration={600}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950 max-w-3xl mx-auto">
          Meet NuraAI. Your Business, Now Intelligent.
        </h2>
      </ScrollReveal>

      {/* Direct Video Container - Outer gray bezel/border removed */}
      <ScrollReveal direction="scale" delay={120} duration={700} className="mt-10 max-w-4xl mx-auto">
        <MuxVideoCard
          playbackId="NdEph7ZSF01HUdTUC7Rad7q4A8m01rkyP01cXXmbR2cCZw"
          title="NuraAI Assistant Video Demo"
          aspectRatio="16/9"
          autoPlay={true}
          className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-none border-0"
        />
      </ScrollReveal>
    </section>
  );
};
export default NuraAISection;
