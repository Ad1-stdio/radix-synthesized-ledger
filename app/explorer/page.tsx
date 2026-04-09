"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { CanvasShardMap } from "@/components/CanvasShardMap";
import { MagneticCard } from "@/components/MagneticCard";
import { useSpring, useTransform, motion, useMotionValue, AnimatePresence, MotionValue } from "framer-motion";
import { Activity, Database, Cpu, WifiOff, CheckCircle2, UploadCloud, Lock } from "lucide-react";
import { useNetwork } from "@/contexts/NetworkContext";
import { useWallet } from "@/contexts/WalletContext";
import { useTransactionFeed } from "@/hooks/useTransactionFeed";
import { useSearchParams } from "next/navigation";

const MANIFEST_FEED = Array.from({length: 30}).map((_, i) => {
   const hash = Math.floor(Math.abs(Math.sin(i + 42)) * 16777215).toString(16).padStart(6, '0');
   return `[CERBERUS] TX_${hash}->OK`;
});

// Protect the constant-loop scrolling ticker from parent React tree re-renders
const VisualizerDock = React.memo(({ shardsInvolved, formattedHealth }: { shardsInvolved: number, formattedHealth: MotionValue<string> }) => {
  return (
      <div className="h-16 w-full mt-auto border-t border-panel-border bg-[#0B0B14]/90 backdrop-blur-3xl relative z-20 flex font-mono text-[10px] uppercase tracking-widest divide-x divide-panel-border shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex-shrink-0">
         
         <div className="flex-1 flex items-center overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0B0B14] to-transparent z-10" />
            <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 40, repeat: Infinity }}
               className="flex gap-8 text-gray-500 opacity-60 whitespace-nowrap min-w-max pr-8"
            >
               {MANIFEST_FEED.map((msg, i) => <span key={`a-${i}`}>{msg}</span>)}
               {MANIFEST_FEED.map((msg, i) => <span key={`b-${i}`}>{msg}</span>)}
            </motion.div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0B0B14] to-transparent z-10" />
         </div>

         <div className="hidden md:flex w-64 px-6 items-center justify-between bg-[#0F0F1A]">
            <div className="flex items-center gap-2 text-gray-500">
               <Database size={14} className="text-[#052cc0]" />
               Shards Involved
            </div>
            <div className="text-white font-bold text-lg w-12 text-right">
               {shardsInvolved > 0 ? (
                 <motion.span 
                   key={shardsInvolved} 
                   initial={{ opacity: 0.5, y: -2 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                 >
                   {shardsInvolved}
                 </motion.span>
               ) : "---"}
            </div>
         </div>

         <div className="hidden sm:flex w-56 px-6 items-center justify-between text-gray-500">
             <div className="flex items-center gap-2">
               <Activity size={14} className="text-blue-500 animate-pulse" />
               Health
             </div>
             <motion.div className="text-white font-bold text-sm">
                <motion.span>{formattedHealth}</motion.span>
             </motion.div>
         </div>

      </div>
  );
});
VisualizerDock.displayName = "VisualizerDock";

function ExplorerContent() {
  const { activeNetwork } = useNetwork();
  const { isConnected } = useWallet();
  const { transactions, isError, latestTxId } = useTransactionFeed();
  
  const searchParams = useSearchParams();
  const txWarpId = searchParams.get('tx');
  const isSimulation = searchParams.get('sim') === 'true';
  const simulatedShards = searchParams.get('shards');
  const simulatedFee = searchParams.get('fee');
  
  const [hoveredTraceId, setHoveredTraceId] = useState<string | null>(null);
  const [lockedTraceId, setLockedTraceId] = useState<string | null>(isSimulation ? 'sim_trace_preview' : (txWarpId || null));
  
  const activeTraceId = hoveredTraceId || lockedTraceId || latestTxId;
  const [shardsInvolved, setShardsInvolved] = useState(0);

  // Floating trace values
  const traceX = useMotionValue(-1000);
  const traceY = useMotionValue(-1000);

  // Health flicker
  const x = useSpring(0, { stiffness: 200, damping: 5 });
  useEffect(() => {
    const interval = setInterval(() => {
       x.set(Math.random());
    }, 2500);
    return () => clearInterval(interval);
  }, [x]);
  
  const healthVal = useTransform(x, [0, 1], [40, 65]);
  const formattedHealth = useTransform(healthVal, (val) => `98.${Math.floor(val)}%`);

  const activeEmission = transactions.find(e => e.id === activeTraceId);

  return (
    <div className="max-w-[1440px] mx-auto h-[calc(100vh-80px)] xl:h-screen lg:h-[calc(100vh-80px)] flex flex-col relative overflow-hidden bg-[#0A0A12]">
      
      {/* Background Matrix Shard Grid */}
      <CanvasShardMap activeTraceId={activeTraceId} onShardsInvolved={setShardsInvolved} traceX={traceX} traceY={traceY} />
      
      {/* Reconnecting Toast */}
      <AnimatePresence>
        {isError && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-24 left-8 z-50 glass-heavy rounded-full px-6 py-3 flex items-center gap-3 border border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
             <WifiOff size={16} />
             <span className="font-mono text-xs font-bold tracking-widest uppercase animate-pulse">Reconnecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Data Chip */}
      <motion.div 
        style={{ x: traceX, y: traceY }}
        className="absolute z-50 pointer-events-none -translate-y-12 translate-x-4 mix-blend-screen hidden lg:block"
      >
        <div className="bg-[#0c0d1c]/90 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded flex items-center gap-2 p-1.5 backdrop-blur-md">
           <Cpu size={12} className="text-blue-500" />
           <span className="font-mono text-[9px] font-bold text-white tracking-widest">{activeEmission?.traceType || "EXECUTING"}</span>
        </div>
      </motion.div>

      {/* Responsive Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-y-auto lg:overflow-hidden">

        {/* Foreground Content */}
        <div className="w-full lg:w-[480px] p-6 lg:p-12 lg:ml-8 lg:mt-12 flex flex-col pointer-events-none z-10">
          <div className="pointer-events-auto h-full flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-wide uppercase font-sans mb-8 leading-tight flex-shrink-0">
              Live Network <br />
              <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">Trace Explorer</span>
            </h1>

            <div className="flex justify-between items-end mb-4 flex-shrink-0">
                <div className="text-xs sm:text-sm font-mono tracking-widest text-gray-400 uppercase">
                  {activeNetwork === "Stokenet" ? "Developer Deployments" : "Synthesized Recent Emissions"}
                </div>
            </div>

            <MagneticCard className="flex-shrink-0 backdrop-blur-xl bg-[#0c0d1c]/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] max-h-[400px] overflow-y-auto custom-scrollbar pointer-events-auto">
              
              {isSimulation && (
                  <div className="absolute inset-0 bg-[#0c0d1c]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 flex items-center justify-center rounded-full mb-4 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <CheckCircle2 className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-sans text-white uppercase tracking-widest mb-1">Simulation Successful</h3>
                      <div className="font-mono text-[10px] sm:text-xs text-gray-400 mb-6 px-4">
                        Predicted Fee: <span className="text-white font-bold">{simulatedFee} XRD</span>
                        <br />
                        Network Cost: <span className="text-blue-500 font-bold">{simulatedShards} Shards Context</span>
                      </div>

                      <button 
                        disabled={!isConnected}
                        className="w-full relative group overflow-hidden rounded-lg font-bold font-sans text-xs sm:text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-[#D4AF37] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="absolute inset-0 border border-[#D4AF37] rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.8)] transition-all"></div>
                        <div className="relative py-3 px-6 flex items-center justify-center gap-2 text-[#D4AF37]">
                            {isConnected ? <UploadCloud size={16} /> : <Lock size={16} />}
                            {isConnected ? "Publish to Mainnet" : "Connect Wallet to Publish"}
                        </div>
                      </button>
                  </div>
              )}

              {(!transactions || transactions.length === 0) && !isSimulation && (
                  <div className="p-8 text-center text-gray-500 font-mono text-xs uppercase animate-pulse">
                    Awaiting network packets...
                  </div>
              )}
              {transactions && transactions.map((emission: any) => {
                  const isActive = activeTraceId === emission.id;
                  const isLocked = lockedTraceId === emission.id;
                  
                  return (
                    <div 
                      key={emission.id}
                      onMouseEnter={() => setHoveredTraceId(emission.id)}
                      onMouseLeave={() => setHoveredTraceId(null)}
                      onClick={() => setLockedTraceId(isLocked ? null : emission.id)}
                      className={`p-3 sm:p-4 rounded-xl transition-all cursor-pointer flex justify-between items-center group
                        ${isActive ? 'bg-blue-500/10 border-blue-500/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#121220]/50 border-transparent hover:bg-white/5'} 
                        border`}
                    >
                      <div className="flex flex-col gap-1 font-mono">
                        <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider">{emission.label || emission.type}</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-500 flex gap-2 items-center">
                            {emission.id} • {emission.time}
                            {isLocked && <span className="text-[8px] bg-blue-500 text-white px-1 ml-2 rounded">LOCKED</span>}
                        </span>
                      </div>
                      <div className={`font-mono font-bold text-xs sm:text-sm transition-colors ${isActive ? 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'text-gray-500 group-hover:text-white'}`}>
                        {emission.amount}
                      </div>
                    </div>
                  );
              })}
            </MagneticCard>
            
            <div className="hidden lg:flex text-xs font-mono text-gray-400 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg mt-6 flex-shrink-0">
              <p>Hover or click an emission log above to parse its vector execution trace across the simulated Shard grid.</p>
            </div>
          </div>
        </div>

        {/* Scrypto Decompiler & Topology Drawer (Responsive placement) */}
        <AnimatePresence>
          {lockedTraceId && !isSimulation && (
              <motion.div 
                initial={{ x: 500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full lg:w-[450px] lg:absolute lg:right-0 lg:top-0 lg:bottom-16 bg-[#0A0A14]/95 backdrop-blur-3xl lg:border-l border-t lg:border-t-0 border-white/10 z-40 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] mt-4 lg:mt-0"
              >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <div>
                      <div className="text-[10px] text-blue-500 font-bold font-mono tracking-widest uppercase mb-1 flex items-center gap-2">
                        <Cpu size={12} /> Scrypto Decompiler
                      </div>
                      <h2 className="text-white font-sans font-bold text-base sm:text-lg truncate w-48 sm:w-64">{lockedTraceId}</h2>
                    </div>
                    <button onClick={() => setLockedTraceId(null)} className="text-gray-500 hover:text-white transition-colors">
                      <Lock size={16} className="mb-1 mx-auto" />
                      <span className="text-[8px] font-mono block uppercase text-center">Unlock</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 sm:space-y-8 pb-20 lg:pb-6">
                    {/* AI Summary */}
                    <div>
                      <h3 className="text-[10px] sm:text-xs font-mono text-gray-500 font-bold uppercase tracking-widest mb-2 sm:mb-3 border-b border-white/5 pb-2">Execution Abstract</h3>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                          <span className="text-blue-500 font-bold">Autogenerated:</span> This transaction successfully extracted assets from the user's primary Vault, routed a swap through the Ociswap component, and deposited the resulting tokens back into the Worktop before taking final state execution proofs.
                      </p>
                    </div>

                    {/* Scrypto Source */}
                    <div>
                      <h3 className="text-[10px] sm:text-xs font-mono text-gray-500 font-bold uppercase tracking-widest mb-2 sm:mb-3 border-b border-white/5 pb-2 flex justify-between">
                          <span>Raw Scrypto (Rust)</span>
                          <span className="text-emerald-400 lowercase text-[9px] sm:text-[10px]">v1.2.0</span>
                      </h3>
                      <div className="bg-[#05050A] rounded-xl p-4 border border-white/5 text-[10px] sm:text-[11px] font-mono leading-relaxed overflow-x-auto custom-scrollbar">
                          <span className="text-purple-400">CALL_METHOD</span><br/>
                          &nbsp;&nbsp;<span className="text-orange-300">Address</span>(<span className="text-gray-400">"account_rdx1..."</span>)<br/>
                          &nbsp;&nbsp;<span className="text-emerald-400">"withdraw"</span><br/>
                          &nbsp;&nbsp;<span className="text-orange-300">Address</span>(<span className="text-gray-400">"resource_rdx1..."</span>)<br/>
                          &nbsp;&nbsp;<span className="text-blue-500">Decimal</span>(<span className="text-emerald-400">"100.5"</span>);<br/>
                          <br/>
                          <span className="text-purple-400">TAKE_FROM_WORKTOP</span><br/>
                          &nbsp;&nbsp;<span className="text-orange-300">Address</span>(<span className="text-gray-400">"resource_rdx1..."</span>)<br/>
                          &nbsp;&nbsp;<span className="text-blue-500">Decimal</span>(<span className="text-emerald-400">"100.5"</span>)<br/>
                          &nbsp;&nbsp;<span className="text-white">Bucket</span>(<span className="text-emerald-400">"bucket1"</span>);
                      </div>
                    </div>

                    {/* Consensus Topology */}
                    <div>
                      <h3 className="text-[10px] sm:text-xs font-mono text-gray-500 font-bold uppercase tracking-widest mb-2 sm:mb-3 border-b border-white/5 pb-2">Cerberus Orbit</h3>
                      <div className="bg-black/30 rounded-xl h-40 sm:h-48 border border-white/5 relative overflow-hidden flex items-center justify-center">
                          {/* Mock D3-style animated topology */}
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-blue-500/20 absolute" />
                          <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-dashed border-purple-500/30 absolute" />
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center relative z-10">
                            <Activity size={16} className="text-blue-500" />
                          </div>
                          {/* Nodes */}
                          {[0, 1, 2, 3, 4].map(i => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                                style={{
                                  top: `calc(50% + ${Math.sin(i * Math.PI * 0.4) * (typeof window !== 'undefined' && window.innerWidth < 640 ? 45 : 60)}px)`,
                                  left: `calc(50% + ${Math.cos(i * Math.PI * 0.4) * (typeof window !== 'undefined' && window.innerWidth < 640 ? 45 : 60)}px)`
                                }}
                            />
                          ))}
                          <div className="absolute bottom-2 left-0 right-0 text-center text-[7px] sm:text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                            Finality Achieved • 1.2s
                          </div>
                      </div>
                    </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VisualizerDock shardsInvolved={shardsInvolved} formattedHealth={formattedHealth} />
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0A0A12] flex items-center justify-center text-blue-500 font-mono text-sm animate-pulse uppercase tracking-widest">Booting Cerberus_Trace...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}