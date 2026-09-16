import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Nuradesk",
  description: "Enterprise POS business management, sales KPIs, inventory, terminals, and NuraAI intelligence.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
