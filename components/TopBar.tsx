"use client";

import { motion } from "framer-motion";
import { Bell, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { OdometerCurrency } from "@/components/Odometer";
import { useNetwork, NetworkType } from "@/contexts/NetworkContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TABS: NetworkType[] = ["Mainnet", "Testnet", "Stokenet"];

export function TopBar() {
  const { isConnected, balance } = useWallet();
  const { activeNetwork, setActiveNetwork } = useNetwork();
  const router = useRouter();
  const [isWarping, setIsWarping] = useState(false);

  const executeWarp = (hash: string) => {
      setIsWarping(true);
      setTimeout(() => {
          setIsWarping(false);
          router.push(`/explorer?tx=${encodeURIComponent(hash)}`);
      }, 350);
  };

  return (
    <>
      {/* High-Speed Warp Overlay Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-panel-bg backdrop-blur-md transition-all duration-300 pointer-events-none flex items-center justify-center ${isWarping ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} 
      >
         {isWarping && (
           <motion.div animate={{ rotate: 180, scale: [1, 2] }} transition={{ duration: 0.3 }} className="w-64 h-64 border-[40px] border-radix-blue rounded-full blur-3xl opacity-20" />
         )}
      </div>

      <header className="h-20 border-b border-[#1e1e38] flex items-center justify-between px-8 bg-deep-navy sticky top-0 z-40 font-mono text-sm">
        {/* Network Tabs */}
        <div className="flex gap-8 h-full relative">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveNetwork(tab)}
              className={cn(
                "relative h-full px-1 flex items-center justify-center transition-colors hover:text-white",
                activeNetwork === tab ? "text-radix-blue font-bold" : "text-text-muted"
              )}
            >
              {tab}
              {activeNetwork === tab && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-radix-blue"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-6">
          {/* Live Data Badge */}
          <div className="flex items-center gap-2 border border-radix-blue/30 bg-radix-blue/10 px-3 py-1.5 rounded-full">
             <motion.div 
               animate={{ opacity: [1, 0.5, 1] }} 
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="w-2 h-2 rounded-full bg-radix-blue shadow-glow-blue" 
             />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1">Live <span className="opacity-40">Feed</span></span>
          </div>

          {/* Global Warp Search */}
          <div className="ml-8 relative group hidden md:block z-50">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-radix-blue transition-colors" />
             <input 
               type="text" 
               placeholder="Warp to Address / Tx Hash..."
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && e.currentTarget.value) {
                    executeWarp(e.currentTarget.value);
                 }
               }}
               className="w-72 bg-[#121226]/50 border border-panel-border rounded-full py-1.5 pl-9 pr-4 text-xs font-mono text-white placeholder-text-muted/50 focus:outline-none focus:border-radix-blue/50 focus:bg-[#1a1a36]/80 focus:shadow-[0_0_15px_rgba(var(--radix-blue-rgb),0.3)] transition-all peer"
             />
             
             {/* Recent History Dropdown */}
             <div className="absolute top-full left-0 w-full mt-2 pt-2 opacity-0 invisible peer-focus:opacity-100 peer-focus:visible transition-all duration-300 transform translate-y-2 peer-focus:translate-y-0">
                <div className="bg-[#0b0b14]/95 backdrop-blur-3xl border border-white/10 rounded-xl p-2 shadow-2xl flex flex-col gap-1">
                   <div className="text-[9px] font-bold font-mono text-text-muted uppercase tracking-widest px-2 py-1">Recent Warps</div>
                   {["sim_tx_b4f1_a22c", "account_rdx1689r4avgsz3...", "tx_1a4f_c302"].map((hash, i) => (
                      <button 
                         key={i}
                         className="text-left w-full px-2 py-2 rounded-lg hover:bg-radix-blue/10 border border-transparent hover:border-radix-blue/20 transition-all group flex items-center gap-2"
                         onMouseDown={(e) => {
                            e.preventDefault();
                            executeWarp(hash);
                         }}
                      >
                         <Search size={10} className="text-text-muted group-hover:text-radix-blue flex-shrink-0" />
                         <span className="font-mono text-xs text-text-muted group-hover:text-white transition-colors truncate">{hash}</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2 bg-[#121226] px-4 py-2 rounded-lg border border-panel-border transition-colors min-w-[140px] justify-center">
            <span className="text-text-muted">BAL:</span>
            {isConnected ? (
               <span className="text-staking-green font-bold flex items-center gap-1">
                 <OdometerCurrency value={balance} /> XRD
               </span>
            ) : (
               <span className="text-text-muted font-bold">0.00 XRD</span>
            )}
          </div>
          <button className="text-text-muted hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-radix-blue rounded-full"></span>
          </button>
          <button className="w-8 h-8 rounded-full border border-panel-border flex items-center justify-center overflow-hidden bg-panel-bg hover:border-white transition-all">
             {/* Replace with actual profile picture */}
            <User size={16} className="text-text-muted" />
          </button>
        </div>
      </header>
    </>
  );
}
