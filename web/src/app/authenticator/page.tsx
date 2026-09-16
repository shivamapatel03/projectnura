import React from "react";
import AuthenticatorPage from "@/components/AuthenticatorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Two-Factor Authentication | Nuradesk",
  description: "Secure two-factor verification to access the Nuradesk Admin Panel.",
};

export default function AuthenticatorRoute() {
  return <AuthenticatorPage />;
}
