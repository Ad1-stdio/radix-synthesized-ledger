"use client";

import { useEffect, useState } from "react";
import { fetchLiveTransactions, fetchNetworkPulse } from "@/lib/radix-gateway";
import { useNetwork } from "@/contexts/NetworkContext";

export interface LiveTransaction {
   id: string; // intent_hash / tx_id
   label: string; // parsed from manifest
   amount: string; // fee or some extraction
   time: string;
   traceType: string;
}

export function useTransactionFeed() {
  const { activeNetwork } = useNetwork();
  
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pulse, setPulse] = useState({ epoch: 0, round: 0 });
  const [latestTxId, setLatestTxId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Reset state briefly on network change to trigger loading vibes
    setTransactions([]);
    setIsError(false);

    const poll = async () => {
      // Fetch Pulse
      const pulseData = await fetchNetworkPulse(activeNetwork);
      if (mounted && pulseData?.ledger_state) {
         setPulse({ 
             epoch: pulseData.ledger_state.epoch, 
             round: pulseData.ledger_state.round 
         });
      }

      // Fetch Txs
      const data = await fetchLiveTransactions(activeNetwork);
      if (!mounted) return;
      
      if (!data) {
         setIsLive(false);
         setIsError(true);
         return;
      }
      
      setIsLive(true);
      setIsError(false);
      
      const items = data.items || [];
      
      // Parse API stream into our UI's LiveTransaction format
      const parsed: LiveTransaction[] = items.map((item: any) => {
         const hexHash = item.intent_hash || item.state_version?.toString() || Math.random().toString();
         const shortHash = hexHash.slice(-8);
         
         // Extract intelligence from raw manifest textual instructions
         let traceType = "CALL_METHOD";
         let label = "CONTRACT_CALL";
         const instructions = item.manifest_instructions || "";
         
         if (instructions.includes("TAKE_FROM_WORKTOP") && instructions.includes("DEPOSIT")) { 
             traceType = "TRANSFER"; label = "ASSET_TRANSFER"; 
         }
         else if (instructions.includes("Method") && instructions.toLowerCase().includes("swap")) { 
             traceType = "FAST_EXEC"; label = "DEX_SWAP"; 
         }
         else if (instructions.includes("Method") && instructions.toLowerCase().includes("stake")) { 
             traceType = "DELEGATE_STAKE"; label = "STAKE"; 
         }
         else if (instructions.includes("TAKE_FROM_WORKTOP")) { 
             traceType = "TAKE_FROM_WORKTOP"; label = "WITHDRAW"; 
         }
         
         const feeAmount = item.fee_paid ? parseFloat(item.fee_paid).toFixed(4) : "0.0125";
         const feeString = `FEE: ${feeAmount} XRD`;
         
         return {
            id: `tx_${shortHash}`,
            label,
            amount: feeString,
            time: "live",
            traceType
         };
      });
      
      if (parsed.length > 0) {
          setTransactions(parsed);
          
          // Trigger the latest tx trace!
          const newTx = parsed[0].id;
          setLatestTxId(prev => prev !== newTx ? newTx : prev);
      }
    };
    
    poll();
    const intv = setInterval(poll, 5000);

    return () => {
      mounted = false;
      clearInterval(intv);
    };
  }, [activeNetwork]);

  return { transactions, isLive, isError, pulse, latestTxId };
}
