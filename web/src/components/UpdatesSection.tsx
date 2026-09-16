"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const UpdatesSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal direction="up" distance={28} duration={650} className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
          Get Updates
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Stay updated with the latest releases.
        </p>

        {submitted ? (
          <div className="mt-6 p-3.5 rounded-full bg-gray-100 border border-gray-300 text-black text-sm font-semibold flex items-center justify-center gap-2 max-w-sm mx-auto">
            <CheckCircle2 size={18} />
            <span>Thank you! You are subscribed.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex items-center max-w-sm mx-auto bg-white rounded-full border border-gray-300 p-1 focus-within:border-black transition-all"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="button-20 shrink-0 !py-2 !px-5 !rounded-full text-sm font-semibold cursor-pointer"
            >
              Join
            </button>
          </form>
        )}
      </ScrollReveal>
    </section>
  );
};
export default UpdatesSection;
