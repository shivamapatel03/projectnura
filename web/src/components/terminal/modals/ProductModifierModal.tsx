"use client";

import React, { useState } from "react";
import { IconX, IconCheck, IconPlus, IconMinus } from "@tabler/icons-react";
import { Product } from "@/components/admin/types";

interface ProductModifierModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    selectedModifiers: { name: string; extraPrice: number }[],
    note: string,
    quantity: number
  ) => void;
}

interface ModifierGroup {
  name: string;
  type: "single" | "multiple";
  options: { name: string; extraPrice: number; default?: boolean }[];
}

const BEVERAGE_MODIFIERS: ModifierGroup[] = [
  {
    name: "Size",
    type: "single",
    options: [
      { name: "Regular (250ml)", extraPrice: 0, default: true },
      { name: "Large (350ml)", extraPrice: 40 },
    ],
  },
  {
    name: "Milk Choice",
    type: "single",
    options: [
      { name: "Dairy Milk", extraPrice: 0, default: true },
      { name: "Oat Milk", extraPrice: 45 },
      { name: "Almond Milk", extraPrice: 50 },
      { name: "Soy Milk", extraPrice: 35 },
    ],
  },
  {
    name: "Sweetness Level",
    type: "single",
    options: [
      { name: "100% Regular", extraPrice: 0, default: true },
      { name: "50% Less Sweet", extraPrice: 0 },
      { name: "Sugar-Free (Stevia)", extraPrice: 10 },
      { name: "Unsweetened (0%)", extraPrice: 0 },
    ],
  },
  {
    name: "Add-ons & Extras",
    type: "multiple",
    options: [
      { name: "Extra Espresso Shot", extraPrice: 40 },
      { name: "Vanilla Syrup", extraPrice: 30 },
      { name: "Hazelnut Syrup", extraPrice: 30 },
      { name: "Whipped Cream", extraPrice: 25 },
    ],
  },
];

const FOOD_MODIFIERS: ModifierGroup[] = [
  {
    name: "Preparation / Style",
    type: "single",
    options: [
      { name: "Standard Recipe", extraPrice: 0, default: true },
      { name: "Extra Toasted / Crispy", extraPrice: 0 },
      { name: "Mild Spiced", extraPrice: 0 },
    ],
  },
  {
    name: "Add-ons",
    type: "multiple",
    options: [
      { name: "Extra Melted Cheese", extraPrice: 35 },
      { name: "Garlic Truffle Dip", extraPrice: 40 },
      { name: "Jalapeño Relish", extraPrice: 20 },
      { name: "Double Patty / Slice", extraPrice: 80 },
    ],
  },
];

export const ProductModifierModal: React.FC<ProductModifierModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  const isDrinkOrCoffee =
    product.category === "Coffee" || product.category === "Drinks";
  const modifierGroups = isDrinkOrCoffee ? BEVERAGE_MODIFIERS : FOOD_MODIFIERS;

  // Track single-choice selections
  const [selectedSingles, setSelectedSingles] = useState<{ [group: string]: { name: string; extraPrice: number } }>(() => {
    const initial: { [group: string]: { name: string; extraPrice: number } } = {};
    modifierGroups.forEach((group) => {
      if (group.type === "single") {
        const def = group.options.find((o) => o.default) || group.options[0];
        if (def) {
          initial[group.name] = { name: def.name, extraPrice: def.extraPrice };
        }
      }
    });
    return initial;
  });

  // Track multi-choice selections
  const [selectedMultiples, setSelectedMultiples] = useState<{ [name: string]: number }>({});
  const [specialNote, setSpecialNote] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate extra price
  const singleExtra = Object.values(selectedSingles).reduce((acc, s) => acc + s.extraPrice, 0);
  const multiExtra = Object.values(selectedMultiples).reduce((acc, price) => acc + price, 0);
  const unitPrice = product.sellingPrice + singleExtra + multiExtra;
  const totalPrice = unitPrice * quantity;

  const handleToggleMultiple = (optName: string, extraPrice: number) => {
    setSelectedMultiples((prev) => {
      const next = { ...prev };
      if (next[optName] !== undefined) {
        delete next[optName];
      } else {
        next[optName] = extraPrice;
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const allModifiers: { name: string; extraPrice: number }[] = [];
    Object.entries(selectedSingles).forEach(([groupName, opt]) => {
      if (opt.extraPrice > 0 || opt.name.includes("Large") || opt.name.includes("Oat") || opt.name.includes("Almond")) {
        allModifiers.push({ name: opt.name, extraPrice: opt.extraPrice });
      }
    });
    Object.entries(selectedMultiples).forEach(([name, extraPrice]) => {
      allModifiers.push({ name, extraPrice });
    });

    onConfirm(product, allModifiers, specialNote, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto antialiased text-gray-950 font-sans animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] my-auto shadow-2xl animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-11 h-11 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-bold">
                ☕
              </div>
            )}
            <div>
              <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest block">
                CUSTOMIZE ITEM
              </span>
              <h3 className="text-base font-extrabold text-gray-950">
                {product.name}
              </h3>
              <p className="text-xs font-bold text-gray-500 font-mono">
                Base: ₹{product.sellingPrice}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Modifiers Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
          {modifierGroups.map((group) => (
            <div key={group.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
                  {group.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {group.type === "single" ? "Choose 1" : "Optional extras"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {group.options.map((opt) => {
                  const isSelected =
                    group.type === "single"
                      ? selectedSingles[group.name]?.name === opt.name
                      : selectedMultiples[opt.name] !== undefined;

                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => {
                        if (group.type === "single") {
                          setSelectedSingles((prev) => ({
                            ...prev,
                            [group.name]: { name: opt.name, extraPrice: opt.extraPrice },
                          }));
                        } else {
                          handleToggleMultiple(opt.name, opt.extraPrice);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black shadow-xs font-bold"
                          : "bg-gray-50/80 hover:bg-gray-100/80 border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-${group.type === "single" ? "full" : "md"} border flex items-center justify-center text-[10px] ${
                            isSelected
                              ? "bg-white text-black border-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <IconCheck size={11} stroke={3} />}
                        </div>
                        <span className="text-xs font-semibold">{opt.name}</span>
                      </div>
                      {opt.extraPrice > 0 && (
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            isSelected ? "text-emerald-300" : "text-gray-500"
                          }`}
                        >
                          +₹{opt.extraPrice}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Kitchen Note */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="font-bold text-xs uppercase tracking-wider text-gray-700 block">
              Kitchen Instructions / Line Note
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Extra hot, separate sauce, iced cup"
              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-medium text-gray-900 outline-none focus:border-black focus:bg-white"
            />
          </div>
        </div>

        {/* Quantity & CTA Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-gray-200">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 disabled:opacity-30 flex items-center justify-center cursor-pointer text-gray-700"
            >
              <IconMinus size={14} />
            </button>
            <span className="font-mono font-bold text-sm w-6 text-center text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer text-gray-700"
            >
              <IconPlus size={14} />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="button-20 flex-1 h-11 !rounded-xl text-xs font-bold flex items-center justify-between px-5 cursor-pointer"
          >
            <span>Add Customized Item</span>
            <span className="font-mono text-sm font-black">₹{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
