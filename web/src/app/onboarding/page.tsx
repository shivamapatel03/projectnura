import React from "react";
import OnboardingFlow from "@/components/OnboardingFlow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS Onboarding | Nuradesk",
  description: "Get your POS ready to take its first order in 3-5 minutes.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ step?: string }>;
}) {
  const resolvedParams = await searchParams;
  const step = resolvedParams?.step ? parseInt(resolvedParams.step, 10) : 1;
  return <OnboardingFlow initialStep={step} />;
}

