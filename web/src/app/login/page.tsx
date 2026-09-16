import React from "react";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Nuradesk",
  description: "Sign in to manage your business and keep things running smoothly.",
};

export default function Login() {
  return <AuthPage initialMode="login" />;
}
