import React from "react";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Nuradesk",
  description: "Sign up to manage your business and keep things running smoothly.",
};

export default function SignUp() {
  return <AuthPage initialMode="signup" />;
}
