"use client";

import React from "react";
import { TerminalProvider, useTerminalStore } from "./terminalStore";
import { DeviceSetupScreen } from "./screens/DeviceSetupScreen";
import { StaffLoginScreen } from "./screens/StaffLoginScreen";
import { StartShiftScreen } from "./screens/StartShiftScreen";
import { PosHomeScreen } from "./screens/PosHomeScreen";
import { LockScreen } from "./screens/LockScreen";

const TerminalContent: React.FC = () => {
  const { isPaired, currentUser, activeShift, isLocked } = useTerminalStore();

  if (!isPaired) {
    return <DeviceSetupScreen />;
  }

  if (!currentUser) {
    return <StaffLoginScreen />;
  }

  if (!activeShift) {
    return <StartShiftScreen />;
  }

  return (
    <>
      <PosHomeScreen />
      {isLocked && <LockScreen />}
    </>
  );
};

export const TerminalApp: React.FC = () => {
  return (
    <TerminalProvider>
      <TerminalContent />
    </TerminalProvider>
  );
};

export default TerminalApp;
