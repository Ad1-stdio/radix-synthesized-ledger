"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type NetworkType = "Mainnet" | "Testnet" | "Stokenet";

interface NetworkContextType {
  activeNetwork: NetworkType;
  setActiveNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>("Mainnet");

  useEffect(() => {
    // Set CSS variable on document element for tailwind injection
    const colors: Record<NetworkType, { rgb: string }> = {
      Mainnet: { rgb: "0 102 255" }, // Radix Blue (#0066ff)
      Testnet: { rgb: "168 85 247" }, // Electric Purple (#a855f7)
      Stokenet: { rgb: "245 158 11" }, // Cyber Amber (#f59e0b)
    };
    
    document.documentElement.style.setProperty('--radix-blue-rgb', colors[activeNetwork].rgb);
  }, [activeNetwork]);

  return (
    <NetworkContext.Provider value={{ activeNetwork, setActiveNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
