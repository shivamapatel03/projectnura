import React from "react";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account | Nuradesk",
  description: "Verify your account to activate your store, terminals, and dashboard.",
};

export default function VerifyPage() {
  return <AuthPage initialMode="verify" />;
}
