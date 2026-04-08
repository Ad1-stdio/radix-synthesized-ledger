"use client";

import { Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticCard } from "@/components/MagneticCard";
import { useNetworkStats } from "@/hooks/useNetworkStats";
import { Odometer } from "@/components/Odometer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function TransactionsPage() {
  const { epoch, tps, staked } = useNetworkStats();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const VOLUME_DATA = [
     { val: 30, label: "OCT 18", vol: "$1.2M" },
     { val: 45, label: "OCT 19", vol: "$1.8M" },
     { val: 30, label: "OCT 20", vol: "$1.2M" },
     { val: 60, label: "OCT 21", vol: "$2.4M" },
     { val: 40, label: "OCT 22", vol: "$1.6M" },
     { val: 70, label: "OCT 23", vol: "$2.8M" },
     { val: 80, label: "OCT 24", vol: "$3.2M" }
  ];

  return (
    <div className="max-w-7xl mx-auto flex gap-12 font-sans pb-12">
      
      {/* Left side: Transactions List */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-1">
              Transaction History
            </h1>
            <p className="font-mono text-sm text-staking-green">
              Real-time ledger feed from Babylong Protocol
            </p>
          </div>
          <div className="flex gap-4 font-mono text-xs text-text-muted">
            <button className="px-4 py-2 border border-panel-border rounded hover:text-white transition-colors">
              FILTER: ALL_ASSETS
            </button>
            <button className="px-4 py-2 border border-panel-border rounded hover:text-white transition-colors">
              SORT: RECENT
            </button>
          </div>
        </div>

        {/* Transaction Cards */}
        {/* SUCCESS */}
        <MagneticCard className="glass-heavy rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-staking-green/10 text-staking-green border border-staking-green/20">
                SUCCESS
              </span>
              <div className="font-mono text-xs text-text-muted flex items-center gap-1 group cursor-pointer transition-all hover:text-white hover:scale-105 hover:drop-shadow-glow-blue relative z-10">
                TXID: <span className="underline decoration-text-muted/30 underline-offset-4">2a8f...9d32</span>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="text-2xl font-mono font-bold text-white mb-1">+1,240.50 XRD</div>
              <div className="text-[10px] font-mono text-text-muted">2023-10-24 14:02:11</div>
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-wide uppercase mb-12">
            STAKE XRD TO VALIDATOR
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-8 z-10 w-full">
            <div className="z-10 flex items-center gap-2 text-staking-green shrink-0">
              <div className="w-3 h-3 bg-staking-green rounded-sm shadow-glow-green"></div>
              Signed
            </div>
            <div className="flex-1 h-[1px] bg-staking-green mx-3" style={{boxShadow: '0 0 10px #3cd5af'}}></div>
            <div className="z-10 flex items-center gap-2 text-staking-green shrink-0">
              <div className="w-3 h-3 bg-staking-green rounded-sm shadow-glow-green"></div>
              Propagated
            </div>
            <div className="flex-1 h-[1px] bg-staking-green mx-3" style={{boxShadow: '0 0 10px #3cd5af'}}></div>
            <div className="z-10 flex items-center gap-2 text-staking-green shrink-0">
              <div className="w-3 h-3 bg-staking-green rounded-sm shadow-glow-green"></div>
              Finalized
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-text-muted mt-4 relative z-10">
            <div className="flex gap-4">
              <span>FEES: <span className="text-white/80">0.021 XRD</span></span>
              <span>METHOD: <span className="text-white/80">STAKE_REQUEST</span></span>
            </div>
            <button className="flex items-center gap-1 hover:text-white transition-colors relative z-10">
              VIEW_EXPLORER <ExternalLink size={12} />
            </button>
          </div>
        </MagneticCard>

        {/* PENDING */}
        <MagneticCard className="glass-heavy rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border border-text-muted/30 text-text-muted">
                PENDING
              </span>
              <div className="font-mono text-xs text-text-muted flex items-center gap-1 group cursor-pointer transition-all hover:text-white hover:scale-105 hover:drop-shadow-glow-blue relative z-10">
                TXID: <span className="underline decoration-text-muted/30 underline-offset-4">9c11...ff0a</span>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="text-2xl font-mono font-bold text-white mb-1">-500.00 XRD</div>
              <div className="text-[10px] font-mono text-text-muted">2023-10-24 14:15:45</div>
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-wide uppercase mb-12">
            SWAP XRD FOR LSULP
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-8 z-10 w-full">
            <div className="z-10 flex items-center gap-2 text-staking-green shrink-0">
              <div className="w-3 h-3 bg-staking-green rounded-sm shadow-glow-green"></div>
              Signed
            </div>
            <div className="flex-1 h-[1px] bg-staking-green mx-3" style={{boxShadow: '0 0 10px #3cd5af'}}></div>
            <div className="z-10 flex items-center gap-2 text-staking-green shrink-0">
              <div className="w-3 h-3 bg-staking-green rounded-sm shadow-glow-green"></div>
              Propagated
            </div>
            <div className="flex-1 h-[1px] bg-panel-border mx-3"></div>
            <div className="z-10 flex items-center gap-2 text-text-muted shrink-0">
              <div className="w-3 h-3 bg-[#1e1e38] rounded-sm"></div>
              Finalized
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-text-muted mt-4 relative z-10">
            <div className="flex gap-4">
              <span>FEES: <span className="text-white/80">PENDING</span></span>
              <span>METHOD: <span className="text-white/80">LIQUID_SWAP</span></span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse"></span>
               AWAITING_CONSENSUS
            </div>
          </div>
        </MagneticCard>

        {/* FAILED */}
        <MagneticCard className="glass-heavy !border-red-500/20 bg-red-950/10 rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border border-red-500/30 text-red-400 bg-red-500/10">
                FAILED
              </span>
              <div className="font-mono text-xs text-text-muted flex items-center gap-1 group cursor-pointer transition-all hover:text-red-400 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] relative z-10">
                TXID: <span className="underline decoration-text-muted/30 underline-offset-4">4d2e...3e12</span>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="text-2xl font-mono font-bold text-[#ff8080] mb-1">ERROR_CODE: 403</div>
              <div className="text-[10px] font-mono text-text-muted">2023-10-24 13:45:00</div>
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-wide uppercase mb-12">
            WITHDRAWAL AUTHORIZATION
          </div>

          {/* Progress Bar */}
          <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-8 z-10 w-full">
            <div className="z-10 flex items-center gap-2 text-staking-green shrink-0">
              <div className="w-3 h-3 bg-staking-green rounded-sm shadow-glow-green"></div>
              Signed
            </div>
            <div className="flex-1 h-[1px] bg-red-500 mx-3"></div>
            <div className="z-10 flex items-center gap-2 text-red-400 shrink-0">
              <div className="w-3 h-3 bg-red-500 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
              Rejected
            </div>
            <div className="flex-1 h-[1px] bg-panel-border mx-3"></div>
            <div className="z-10 flex items-center gap-2 text-text-muted shrink-0">
              <div className="w-3 h-3 bg-[#1e1e38] rounded-sm"></div>
              Finalized
            </div>
          </div>

          <div className="bg-[#2a1313] border border-red-500/20 p-4 rounded mt-4 text-xs font-mono relative z-10">
             <div className="text-red-300 mb-1">REASON: INSUFFICIENT_RESOURCE_FOR_FEES</div>
             <div className="text-text-muted">Transaction rejected by node during pre-verification. Adjust fee parameters and retry.</div>
          </div>
        </MagneticCard>

      </div>

      {/* Right side: Summary Column */}
      <div className="w-80 space-y-6">
        
        {/* Network Health */}
        <MagneticCard className="glass-heavy p-6 rounded-xl font-mono tracking-widest">
           <div className="text-[10px] text-text-muted mb-6">NETWORK HEALTH</div>
           
           <div className="space-y-6">
             <div>
               <div className="flex justify-between items-end mb-2 text-xs">
                 <span className="text-text-muted">TPS_THROUGHPUT</span>
                 <span className="text-xl text-staking-green font-bold relative z-10 w-16 text-right">
                   <Odometer value={tps} />
                 </span>
               </div>
               <div className="h-1 bg-panel-border w-full relative z-10">
                 <div className="h-full bg-staking-green w-[75%]" style={{boxShadow: '0 0 10px #3cd5af'}}></div>
               </div>
             </div>
             
             <div>
               <div className="flex justify-between items-end mb-2 text-xs">
                 <span className="text-text-muted">FINALITY_SPEED</span>
                 <span className="text-xl text-white font-bold relative z-10">1.2s</span>
               </div>
               <div className="h-1 bg-panel-border w-full relative z-10">
                 <div className="h-full bg-[#6c79ff] w-[40%]"></div>
               </div>
             </div>

             <div className="pt-4 border-t border-panel-border text-[10px] space-y-2 relative z-10">
               <div className="flex justify-between">
                 <span className="text-text-muted">EPOCH_NUMBER</span>
                 <span className="text-white">
                   {epoch ? <Odometer value={epoch} /> : "SYNCING..."}
                 </span>
               </div>
               <div className="flex justify-between">
                 <span className="text-text-muted">TOTAL_STAKED</span>
                 <span className="text-white">
                   <Odometer value={staked} format="compact" suffix=" XRD" />
                 </span>
               </div>
             </div>
           </div>
        </MagneticCard>

        {/* Activity Map / Molecule */}
        <MagneticCard className="glass-heavy p-6 rounded-xl aspect-square flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-radix-blue/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
           
           <Share2 size={64} strokeWidth={1} className="text-radix-blue mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-blue transition-all relative z-10" />
           
           <div className="text-center font-mono relative z-10">
             <div className="text-[10px] font-bold text-radix-blue tracking-widest bg-radix-blue/10 px-3 py-1 rounded inline-block mb-1 border border-radix-blue/20">SYNTHETIC_VISUALIZER_ACTIVE</div>
             <div className="text-[8px] text-text-muted tracking-widest">v.2.0.4 - LEDGER_PULSE</div>
           </div>
        </MagneticCard>

        {/* 7-day Volume Box */}
        <MagneticCard className="glass-heavy p-6 rounded-xl font-mono overflow-visible">
           <div className="text-[10px] text-text-muted mb-4 tracking-widest flex justify-between items-center relative z-10">
             <span>7-DAY VOLUME PULSE</span>
             <span className="text-staking-green animate-pulse">LIVE</span>
           </div>
           <div className="flex gap-2 items-end h-[70px] relative z-10 w-full mt-2">
              {VOLUME_DATA.map((item, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex justify-center h-full items-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredBar === i && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep-navy border border-staking-green/50 px-2 py-1 rounded text-[9px] text-staking-green font-bold shadow-glow-green z-50 whitespace-nowrap"
                      >
                        {item.vol}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${item.val}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.05 }}
                    style={{
                       boxShadow: hoveredBar === i ? '0 0 15px #3cd5af' : 'none'
                    }}
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-300 relative z-20", 
                      hoveredBar === i 
                         ? "bg-staking-green brightness-125" 
                         : i > 4 
                           ? "bg-staking-green/80" 
                           : "bg-[#2a2d4a]"
                    )}
                  />
                  
                  {/* Active baseline marker */}
                  {hoveredBar === i && (
                    <motion.div layoutId="active-bar-dot" className="absolute -bottom-3 w-1.5 h-1.5 bg-staking-green rounded-full shadow-glow-green z-10" />
                  )}
                </div>
              ))}
           </div>
           <div className="flex justify-between text-[8px] text-text-muted mt-5 tracking-widest relative z-10">
             <span>OCT 18</span>
             <span>OCT 24</span>
           </div>
        </MagneticCard>

      </div>

    </div>
  );
}
