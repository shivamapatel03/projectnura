"use client";

import React, { useState } from "react";
import {
  IconCheck,
  IconPrinter,
  IconSend,
  IconBrandWhatsapp,
  IconMail,
  IconMessageCircle,
  IconBarcode,
} from "@tabler/icons-react";
import { TerminalOrder } from "../terminalStore";

interface ReceiptModalProps {
  order: TerminalOrder | null;
  onCloseAndNewSale: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  onCloseAndNewSale,
}) => {
  const [isPrinted, setIsPrinted] = useState(false);
  const [digitalMode, setDigitalMode] = useState<"sms" | "whatsapp" | "email" | null>(null);
  const [contactInput, setContactInput] = useState(order?.customerPhone || "9876543210");
  const [digitalSentToast, setDigitalSentToast] = useState<string | null>(null);

  if (!order) return null;

  const cgst = Math.round(order.tax / 2 * 100) / 100;
  const sgst = order.tax - cgst;

  const handlePrint = () => {
    setIsPrinted(true);
    if (typeof window !== "undefined") {
      window.print();
    }
    setTimeout(() => setIsPrinted(false), 2000);
  };

  const handleSendDigital = (mode: "sms" | "whatsapp" | "email") => {
    setDigitalSentToast(`Receipt dispatched via ${mode.toUpperCase()} to ${contactInput}`);
    setDigitalMode(null);
    setTimeout(() => setDigitalSentToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-2xl animate-scaleUp max-h-[calc(100vh-2rem)] my-auto">
        {/* Success Banner */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 text-center space-y-1">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
            <IconCheck size={18} stroke={3} />
          </div>
          <h3 className="text-sm font-extrabold text-emerald-950">
            Payment Successful
          </h3>
          <p className="text-2xl font-black text-emerald-900 font-mono">
            ₹{order.total.toLocaleString()}
          </p>
        </div>

        {/* Thermal Slip Simulation */}
        <div className="flex-1 p-4 bg-[#fafafa] border-b border-gray-200 text-xs font-mono space-y-2.5 leading-relaxed text-gray-800 overflow-y-auto print:bg-white print:p-0">
          <div className="text-center border-b border-dashed border-gray-300 pb-2">
            <p className="font-black text-sm text-black">SHIV CAFE</p>
            <p className="text-[10px] text-gray-500 font-sans">Main High Street Branch · GSTIN: 24AAACS1234F1Z5</p>
            <p className="text-[10px] text-gray-400">
              {order.createdAt} · {order.orderNumber} · {order.tableOrParcel}
            </p>
          </div>

          {/* Line Items */}
          <div className="space-y-1 py-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>₹{item.product.sellingPrice * item.quantity}</span>
                </div>
                {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                  <div className="text-[10px] text-gray-500 pl-2">
                    {item.selectedModifiers.map((m, mIdx) => (
                      <span key={mIdx}>
                        + {m.name} ({m.extraPrice > 0 ? `₹${m.extraPrice}` : "Free"}){" "}
                      </span>
                    ))}
                  </div>
                )}
                {item.notes && (
                  <div className="text-[10px] text-amber-700 italic pl-2">
                    Note: {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Calculations & GST Breakdown */}
          <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Applied:</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>CGST (2.5%):</span>
              <span>₹{cgst}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SGST (2.5%):</span>
              <span>₹{sgst}</span>
            </div>
            <div className="flex justify-between font-black text-xs text-black pt-1 border-t border-gray-200">
              <span>TOTAL PAID:</span>
              <span>₹{order.total}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px]">
              <span>Payment Mode:</span>
              <span>{order.paymentMethod || "Cash"} · Settled</span>
            </div>
          </div>

          {/* Barcode & Footer */}
          <div className="text-center pt-2 text-[10px] text-gray-400 border-t border-dashed border-gray-300 space-y-1">
            <div className="h-6 mx-auto w-3/4 flex items-center justify-center bg-gray-200 text-gray-600 tracking-widest text-[9px]">
              ||||| | |||| || |||||| | ||
            </div>
            <p>Thank you for dining with Shiv Cafe!</p>
          </div>
        </div>

        {/* Digital Receipt Overlay/Drawer */}
        {digitalMode && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 text-xs space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 uppercase text-[10px]">
                Send via {digitalMode.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setDigitalMode(null)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>
            <input
              type={digitalMode === "email" ? "email" : "tel"}
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
              placeholder={digitalMode === "email" ? "customer@example.com" : "+91 9876543210"}
              className="w-full h-9 px-3 rounded-xl border border-gray-300 font-mono text-xs outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => handleSendDigital(digitalMode)}
              className="w-full h-8 bg-black text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Send E-Receipt
            </button>
          </div>
        )}

        {digitalSentToast && (
          <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs font-bold text-center border-b border-emerald-200 animate-fadeIn">
            ✓ {digitalSentToast}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 space-y-2 bg-white shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <IconPrinter size={15} />
              <span>{isPrinted ? "Printing..." : "Print Slip"}</span>
            </button>

            <button
              type="button"
              onClick={() => setDigitalMode("whatsapp")}
              className="py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <IconBrandWhatsapp size={15} className="text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDigitalMode("sms")}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              SMS Receipt
            </button>
            <button
              type="button"
              onClick={() => setDigitalMode("email")}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Email Receipt
            </button>
          </div>

          <button
            type="button"
            onClick={onCloseAndNewSale}
            className="button-20 w-full h-11 !rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center"
          >
            <span>+ Start New Sale</span>
          </button>
        </div>
      </div>
    </div>
  );
};
