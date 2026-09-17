"use client";

import React, { useState, useEffect } from "react";
import { useKdsStore } from "./kdsStore";
import {
  IconX,
  IconVolume,
  IconVolumeOff,
  IconDeviceTv,
  IconClock,
  IconSettings,
  IconLanguage,
  IconUnlink,
  IconCheck,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { playKdsNewOrderChime } from "./kdsSound";

export const KdsSettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSettings,
    unpairDevice,
    pairedDevice,
  } = useKdsStore();

  const [kitchenName, setKitchenName] = useState(settings.kitchenName);
  const [selectedStation, setSelectedStation] = useState(settings.selectedStation);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [soundVolume, setSoundVolume] = useState(settings.soundVolume);
  const [displaySize, setDisplaySize] = useState(settings.displaySize);
  const [targetMinutes, setTargetMinutes] = useState(settings.targetMinutes);
  const [language, setLanguage] = useState(settings.language);
  const [theme, setTheme] = useState<"dark" | "light">(settings.theme || "dark");

  useEffect(() => {
    if (isSettingsOpen) {
      setKitchenName(settings.kitchenName);
      setSelectedStation(settings.selectedStation);
      setSoundEnabled(settings.soundEnabled);
      setSoundVolume(settings.soundVolume);
      setDisplaySize(settings.displaySize);
      setTargetMinutes(settings.targetMinutes);
      setLanguage(settings.language);
      setTheme(settings.theme || "dark");
    }
  }, [isSettingsOpen, settings]);

  if (!isSettingsOpen) return null;

  const isLight = theme === "light";

  const handleSave = () => {
    updateSettings({
      kitchenName,
      selectedStation,
      soundEnabled,
      soundVolume,
      displaySize,
      targetMinutes,
      language,
      theme,
    });
    setIsSettingsOpen(false);
  };

  const handleTestSound = () => {
    playKdsNewOrderChime(soundVolume);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 my-auto max-h-[calc(100vh-2rem)] flex flex-col transition-colors ${
          isLight
            ? "bg-white border border-gray-200 text-gray-900"
            : "bg-[#161a22] border border-gray-800 text-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isLight ? "border-gray-200" : "border-gray-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <IconSettings size={20} className="text-amber-400" />
            <h2
              className={`text-lg font-black tracking-tight uppercase ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              KDS SETTINGS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Theme / Appearance (Dark vs Light) */}
          <div>
            <label
              className={`text-xs font-bold block mb-1.5 ${
                isLight ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Color Mode / Theme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  updateSettings({ theme: "dark" });
                }}
                className={`h-11 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-amber-400 text-black border-amber-400 font-black shadow-sm"
                    : isLight
                    ? "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    : "bg-[#0d0f12] border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <IconMoon size={16} />
                <span>Dark Mode (Kitchen)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  updateSettings({ theme: "light" });
                }}
                className={`h-11 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-amber-400 text-black border-amber-400 font-black shadow-sm"
                    : isLight
                    ? "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    : "bg-[#0d0f12] border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <IconSun size={16} />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Kitchen Name */}
          <div>
            <label
              className={`text-xs font-bold block mb-1 ${
                isLight ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Kitchen Display Name
            </label>
            <input
              type="text"
              value={kitchenName}
              onChange={(e) => setKitchenName(e.target.value)}
              className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold outline-none focus:border-amber-400 ${
                isLight
                  ? "bg-gray-50 border-gray-300 text-gray-900"
                  : "bg-[#0d0f12] border-gray-700 text-white"
              }`}
            />
          </div>

          {/* Station Assignment */}
          <div>
            <label
              className={`text-xs font-bold block mb-1 ${
                isLight ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Assigned Kitchen Station
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["All", "Main Kitchen", "Bar", "Dessert"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStation(st)}
                  className={`h-9 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    selectedStation === st
                      ? "bg-amber-400 text-black border-amber-400 font-black"
                      : isLight
                      ? "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      : "bg-[#0d0f12] border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Alert Volume */}
          <div
            className={`p-3 rounded-xl border space-y-3 ${
              isLight ? "bg-gray-50 border-gray-200" : "bg-[#0d0f12] border-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <IconVolume size={18} className="text-emerald-500" />
                ) : (
                  <IconVolumeOff size={18} className="text-gray-400" />
                )}
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Order Alert Sound
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Play chime when fresh tickets arrive
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  soundEnabled ? "bg-emerald-500" : isLight ? "bg-gray-300" : "bg-gray-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    soundEnabled ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {soundEnabled && (
              <div
                className={`space-y-1.5 pt-2 border-t ${
                  isLight ? "border-gray-200" : "border-gray-800/80"
                }`}
              >
                <div
                  className={`flex items-center justify-between text-xs font-semibold ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <span>Volume</span>
                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="text-[11px] font-bold text-amber-500 hover:underline cursor-pointer"
                  >
                    Test Chime 🔔
                  </button>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            )}
          </div>

          {/* Card Display Size */}
          <div>
            <label
              className={`text-xs font-bold block mb-1 ${
                isLight ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Display Density (Card Size)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "normal", "large"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setDisplaySize(sz)}
                  className={`h-9 rounded-xl border text-xs font-bold capitalize transition-colors cursor-pointer ${
                    displaySize === sz
                      ? isLight
                        ? "bg-gray-900 text-white font-black border-gray-900 shadow-xs"
                        : "bg-white text-black font-black border-white shadow-xs"
                      : isLight
                      ? "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      : "bg-[#0d0f12] border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {sz === "large" ? "Large (TV/Wall)" : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Target Prep Timer */}
          <div>
            <label
              className={`text-xs font-bold block mb-1 ${
                isLight ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Target Order Prep Time (Minutes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="3"
                max="60"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(parseInt(e.target.value) || 10)}
                className={`w-24 h-10 px-3 rounded-xl border text-xs font-bold text-center outline-none focus:border-amber-400 ${
                  isLight
                    ? "bg-gray-50 border-gray-300 text-gray-900"
                    : "bg-[#0d0f12] border-gray-700 text-white"
                }`}
              />
              <span className="text-xs text-gray-500">
                Cards show amber at 60% and red alert when exceeded
              </span>
            </div>
          </div>

          {/* Language */}
          <div>
            <label
              className={`text-xs font-bold block mb-1 ${
                isLight ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full h-10 px-3 rounded-xl border text-xs font-bold outline-none focus:border-amber-400 ${
                isLight
                  ? "bg-gray-50 border-gray-300 text-gray-900"
                  : "bg-[#0d0f12] border-gray-700 text-white"
              }`}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            </select>
          </div>

          {/* Device Pairing info & Unpair button */}
          <div
            className={`pt-3 border-t flex items-center justify-between ${
              isLight ? "border-gray-200" : "border-gray-800"
            }`}
          >
            <div>
              <span
                className={`text-xs font-bold block ${
                  isLight ? "text-gray-800" : "text-gray-400"
                }`}
              >
                Paired: {pairedDevice.name} ({pairedDevice.code})
              </span>
              <span className="text-[10px] text-gray-500">{pairedDevice.outlet}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                unpairDevice();
                setIsSettingsOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <IconUnlink size={14} />
              <span>Unpair Display</span>
            </button>
          </div>
        </div>

        {/* Footer Save Button */}
        <div
          className={`pt-3 border-t flex gap-2 ${
            isLight ? "border-gray-200" : "border-gray-800"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className={`flex-1 h-11 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer transition-colors shadow-md"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
