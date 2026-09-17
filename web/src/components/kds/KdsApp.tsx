"use client";

import React from "react";
import { KdsProvider, useKdsStore } from "./kdsStore";
import { KdsPairingScreen } from "./KdsPairingScreen";
import { KdsHomeScreen } from "./KdsHomeScreen";

const KdsRootContent: React.FC = () => {
  const { isPaired } = useKdsStore();

  if (!isPaired) {
    return <KdsPairingScreen />;
  }

  return <KdsHomeScreen />;
};

export const KdsApp: React.FC = () => {
  return (
    <KdsProvider>
      <KdsRootContent />
    </KdsProvider>
  );
};
