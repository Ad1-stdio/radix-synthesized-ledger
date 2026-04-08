"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  simulateConnection: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const simulateConnection = () => {
    setIsConnected(true);
    setAddress("rdx1qsp...m2p9");
    setBalance(12450.00);
    setIsModalOpen(false);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
  };

  return (
    <WalletContext.Provider 
      value={{
        isConnected, address, balance, isModalOpen, 
        openModal, closeModal, simulateConnection, disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
}
