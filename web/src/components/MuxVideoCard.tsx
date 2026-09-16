"use client";

import React, { useState, useEffect } from "react";

interface MuxVideoCardProps {
  playbackId?: string;
  title?: string;
  aspectRatio?: string;
  className?: string;
  autoPlay?: boolean;
}

export const MuxVideoCard: React.FC<MuxVideoCardProps> = ({
  playbackId = "NdEph7ZSF01HUdTUC7Rad7q4A8m01rkyP01cXXmbR2cCZw",
  title = "BARISTA Cafe Promo Video",
  aspectRatio = "16/9",
  className = "",
  autoPlay = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract clean playback ID if full player URL was supplied
  let cleanId = playbackId;
  if (playbackId.includes("player.mux.com/")) {
    const match = playbackId.match(/player\.mux\.com\/([a-zA-Z0-9_-]+)/);
    if (match) cleanId = match[1];
  } else if (playbackId.includes("?")) {
    cleanId = playbackId.split("?")[0];
  }

  const iframeSrc = `https://player.mux.com/${cleanId}?autoplay=${autoPlay ? "1" : "0"}&muted=1&loop=1&playsinline=1`;

  if (!mounted) {
    return (
      <div 
        className={`w-full bg-black/90 rounded-2xl flex items-center justify-center text-xs font-mono text-gray-500 border-0 p-0 m-0 ${className}`}
        style={{ aspectRatio: aspectRatio !== "auto" ? aspectRatio : undefined, border: "none" }}
      >
        <span>Loading video...</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full overflow-hidden bg-black border-0 p-0 m-0 shadow-none outline-none ${className}`}
      style={{ aspectRatio: aspectRatio !== "auto" ? aspectRatio : undefined, border: "none", outline: "none" }}
    >
      <iframe
        src={iframeSrc}
        title={title}
        className="w-full h-full block rounded-2xl border-0 p-0 m-0"
        style={{ border: "none", outline: "none", width: "100%", height: "100%" }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default MuxVideoCard;
