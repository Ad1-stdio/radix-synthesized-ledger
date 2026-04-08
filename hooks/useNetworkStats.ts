"use client";

import { useEffect, useState, useRef } from "react";
import { fetchGatewayNetworkState } from "@/lib/api/gateway";
import { useNetwork } from "@/contexts/NetworkContext";

export function useNetworkStats() {
  const { activeNetwork } = useNetwork();
  
  const [epoch, setEpoch] = useState<number | null>(null);
  const [tps, setTps] = useState<number>(0);
  const [staked, setStaked] = useState<number>(3120000000); 
  
  const lastStateVersionRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Network Specific Bounds
  const getNetworkMockConfig = () => {
    switch (activeNetwork) {
      case "Mainnet": return { baseTps: 32, maxTps: 50, randRange: 10, stakedBase: 3120000000, epochOff: 0 };
      case "Testnet": return { baseTps: 1200, maxTps: 5000, randRange: 400, stakedBase: 154000000, epochOff: 104 };
      case "Stokenet": return { baseTps: 5, maxTps: 15, randRange: 3, stakedBase: 8400000, epochOff: 80 };
    }
  }

  useEffect(() => {
    let mounted = true;
    const config = getNetworkMockConfig();
    
    // Reset immediately on switch
    setTps(config.baseTps);
    setStaked(config.stakedBase);

    const poll = async () => {
      const data = await fetchGatewayNetworkState();
      
      if (!mounted || !data?.ledger_state) return;
      
      setEpoch(data.ledger_state.epoch + config.epochOff);
      
      // We skip actual gateway TPS calc now because we need to spoof Testnet/Stokenet loads for the aesthetics
      setTps(config.baseTps + Math.random() * config.randRange);
      
      // Provide a tiny organic fluctuation in the staked XRD mock
      setStaked((prev) => prev + (Math.random() * 50000 - 20000));
    };

    poll(); // Initial hit
    const interval = setInterval(poll, 10000); // Every 10 seconds
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeNetwork]);

  return { epoch, tps, staked };
}
