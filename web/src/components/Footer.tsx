"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 pb-12 sm:pb-16 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative bg-white rounded-full p-0.5 flex items-center justify-center">
                <Image
                  src="/logo/logo.png.png"
                  alt="Nuradesk"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white font-sans">
                Nuradesk
              </span>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Everything you need to run your business.
            </p>
          </div>

          {/* Products Column */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200">
              Products
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors">POS Terminal</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Restaurant Tables & KOT</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Kitchen Display (KDS)</Link></li>
              <li><Link href="#nuraai" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>NuraAI Assistant</span>
                <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.2 rounded font-semibold uppercase">Super</span>
              </Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Multi-Outlet Central Sync</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Real-time Inventory Engine</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Shift & Cash Reconciliation</Link></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="#solutions" className="hover:text-white transition-colors">Cafés & Specialty Coffee</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Full-Service Dining</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Quick Service (QSR)</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Retail & Boutiques</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Artisan Bakeries</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Salons & Spas</Link></li>
              <li><Link href="#solutions" className="hover:text-white transition-colors">Multi-Chain Enterprises</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#pricing" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Hardware Setup</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Thermal Printers</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">API & Webhooks</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Privacy & Security</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Support Portal</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar matching mockup image */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative bg-white rounded-full p-0.5 flex items-center justify-center">
              <Image
                src="/logo/logo.png.png"
                alt="Nuradesk"
                width={14}
                height={14}
                className="object-contain"
              />
            </div>
            <span>© {new Date().getFullYear()} Nuradesk. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
