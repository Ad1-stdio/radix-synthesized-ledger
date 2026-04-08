"use client";

import React, { useState, useEffect } from "react";
import { CanvasShardMap } from "@/components/CanvasShardMap";
import { MagneticCard } from "@/components/MagneticCard";
import { useSpring, useTransform, motion, useMotionValue, AnimatePresence, MotionValue } from "framer-motion";
import { Activity, Database, Cpu, WifiOff, CheckCircle2, UploadCloud, Lock } from "lucide-react";
import { useNetwork } from "@/contexts/NetworkContext";
import { useWallet } from "@/contexts/WalletContext";
import { useTransactionFeed } from "@/hooks/useTransactionFeed";
import { useSearchParams } from "next/navigation";

// ... [existing file code below MANIFEST_FEED and VisualizerDock omitted for brevity] ...

const MANIFEST_FEED = Array.from({length: 30}).map((_, i) => {
   const hash = Math.floor(Math.abs(Math.sin(i + 42)) * 16777215).toString(16).padStart(6, '0');
   return `[CERBERUS] TX_${hash}->OK`;
});

// Protect the constant-loop scrolling ticker from parent React tree re-renders
const VisualizerDock = React.memo(({ shardsInvolved, formattedHealth }: { shardsInvolved: number, formattedHealth: MotionValue<string> }) => {
  return (
      <div className="h-16 w-full mt-auto border-t border-panel-border bg-[#0B0B14]/90 backdrop-blur-3xl relative z-20 flex font-mono text-[10px] uppercase tracking-widest divide-x divide-panel-border shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex-shrink-0">
         
         <div className="flex-1 flex items-center overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-panel-bg to-transparent z-10" />
            <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 40, repeat: Infinity }}
               className="flex gap-8 text-text-muted opacity-60 whitespace-nowrap min-w-max pr-8"
            >
               {MANIFEST_FEED.map((msg, i) => <span key={`a-${i}`}>{msg}</span>)}
               {MANIFEST_FEED.map((msg, i) => <span key={`b-${i}`}>{msg}</span>)}
            </motion.div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-panel-bg to-transparent z-10" />
         </div>

         <div className="w-64 px-6 flex items-center justify-between bg-[#0F0F1A]">
            <div className="flex items-center gap-2 text-text-muted">
               <Database size={14} className="text-radix-blue" />
               Shards Involved
            </div>
            <div className="text-white font-bold text-lg w-12 text-right">
               {shardsInvolved > 0 ? (
                 <motion.span 
                   key={shardsInvolved} 
                   initial={{ opacity: 0.5, y: -2 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   className="text-radix-blue drop-shadow-glow-blue"
                 >
                   {shardsInvolved}
                 </motion.span>
               ) : "---"}
            </div>
         </div>

         <div className="w-56 px-6 flex items-center justify-between text-text-muted">
             <div className="flex items-center gap-2">
               <Activity size={14} className="text-radix-blue animate-pulse" />
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

export default function ExplorerPage() {
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
    <div className="max-w-[1440px] mx-auto h-[calc(100vh-80px)] flex flex-col relative overflow-hidden bg-[#0A0A12]">
      
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
        className="absolute z-50 pointer-events-none -translate-y-12 translate-x-4 mix-blend-screen"
      >
        <div className="bg-[#0c0d1c]/90 border border-radix-blue shadow-[0_0_20px_rgba(var(--radix-blue-rgb),0.5)] rounded flex items-center gap-2 p-1.5 backdrop-blur-md">
           <Cpu size={12} className="text-radix-blue" />
           <span className="font-mono text-[9px] font-bold text-white tracking-widest">{activeEmission?.traceType || "EXECUTING"}</span>
        </div>
      </motion.div>

      {/* Foreground Content */}
      <div className="flex-1 min-h-0 w-[480px] space-y-6 relative z-10 p-8 ml-8 mt-12 pointer-events-none">
        <div className="pointer-events-auto h-full flex flex-col">
           <h1 className="text-4xl font-black text-white tracking-wide uppercase font-sans mb-8 leading-tight flex-shrink-0">
             Live Network <br />
             <span className="text-radix-blue text-glow">Trace Explorer</span>
           </h1>

           <div className="flex justify-between items-end mb-4 flex-shrink-0">
               <div className="text-sm font-mono tracking-widest text-text-muted uppercase">
                 {activeNetwork === "Stokenet" ? "Developer Deployments" : "Synthesized Recent Emissions"}
               </div>
           </div>

           <MagneticCard className="flex-shrink-0 backdrop-blur-xl bg-[#0c0d1c]/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] max-h-[400px] overflow-y-auto custom-scrollbar">
             
             {isSimulation && (
                <div className="absolute inset-0 bg-[#0c0d1c]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-radix-blue/20 flex items-center justify-center rounded-full mb-4 border border-radix-blue shadow-glow-blue">
                       <CheckCircle2 size={32} className="text-radix-blue" />
                    </div>
                    <h3 className="text-lg font-bold font-sans text-white uppercase tracking-widest mb-1">Simulation Successful</h3>
                    <div className="font-mono text-xs text-text-muted mb-6 px-4">
                       Predicted Fee: <span className="text-white font-bold">{simulatedFee} XRD</span>
                       <br />
                       Network Cost: <span className="text-radix-blue font-bold">{simulatedShards} Shards Context</span>
                    </div>

                    <button 
                       disabled={!isConnected}
                       className="w-full relative group overflow-hidden rounded-lg font-bold font-sans text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
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

             {transactions.length === 0 && !isSimulation && (
                <div className="p-8 text-center text-text-muted font-mono text-xs uppercase animate-pulse">
                   Awaiting network packets...
                </div>
             )}
             {transactions.map((emission) => {
                const isActive = activeTraceId === emission.id;
                const isLocked = lockedTraceId === emission.id;
                
                return (
                  <div 
                    key={emission.id}
                    onMouseEnter={() => setHoveredTraceId(emission.id)}
                    onMouseLeave={() => setHoveredTraceId(null)}
                    onClick={() => setLockedTraceId(isLocked ? null : emission.id)}
                    className={`p-4 rounded-xl transition-all cursor-pointer flex justify-between items-center group
                      ${isActive ? 'bg-radix-blue/10 border-radix-blue/50 shadow-[inset_0_0_15px_rgba(var(--radix-blue-rgb),0.2)]' : 'bg-[#121220]/50 border-transparent hover:bg-white/5'} 
                      border`}
                  >
                     <div className="flex flex-col gap-1 font-mono">
                       <span className="text-white font-bold text-xs uppercase tracking-wider">{emission.label}</span>
                       <span className="text-[10px] text-text-muted flex gap-2 items-center">
                          {emission.id} • {emission.time}
                          {isLocked && <span className="text-[8px] bg-radix-blue text-white px-1 ml-2 rounded">LOCKED</span>}
                       </span>
                     </div>
                     <div className={`font-mono font-bold text-sm transition-colors ${isActive ? 'text-radix-blue drop-shadow-glow-blue' : 'text-text-muted group-hover:text-white'}`}>
                       {emission.amount}
                     </div>
                  </div>
                );
             })}
           </MagneticCard>
           
           <div className="text-xs font-mono text-text-muted p-4 bg-radix-blue/5 border border-radix-blue/10 rounded-lg mt-6 flex-shrink-0">
             <p>Hover or click an emission log above to parse its vector execution trace across the simulated Shard grid.</p>
           </div>
        </div>
      </div>

      {/* Scrypto Decompiler & Topology Drawer */}
      <AnimatePresence>
         {lockedTraceId && !isSimulation && (
            <motion.div 
               initial={{ x: 400, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: 400, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="absolute right-0 top-0 bottom-16 w-[450px] bg-[#0A0A14]/95 backdrop-blur-3xl border-l border-white/10 z-40 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
               {/* Header */}
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <div>
                    <div className="text-[10px] text-radix-blue font-bold font-mono tracking-widest uppercase mb-1 flex items-center gap-2">
                       <Cpu size={12} /> Scrypto Decompiler
                    </div>
                    <h2 className="text-white font-sans font-bold text-lg truncate w-64">{lockedTraceId}</h2>
                  </div>
                  <button onClick={() => setLockedTraceId(null)} className="text-text-muted hover:text-white transition-colors">
                     <Lock size={16} className="mb-1" />
                     <span className="text-[8px] font-mono block uppercase">Unlock</span>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                  {/* AI Summary */}
                  <div>
                     <h3 className="text-xs font-mono text-text-muted font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Execution Abstract</h3>
                     <p className="text-sm text-text-muted leading-relaxed">
                        <span className="text-radix-blue font-bold">Autogenerated:</span> This transaction successfully extracted assets from the user's primary Vault, routed a swap through the Ociswap component, and deposited the resulting tokens back into the Worktop before taking final state execution proofs.
                     </p>
                  </div>

                  {/* Scrypto Source */}
                  <div>
                     <h3 className="text-xs font-mono text-text-muted font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2 flex justify-between">
                        <span>Raw Scrypto (Rust)</span>
                        <span className="text-staking-green lowercase text-[10px]">v1.2.0</span>
                     </h3>
                     <div className="bg-[#05050A] rounded-xl p-4 border border-white/5 text-[11px] font-mono leading-relaxed overflow-x-auto">
                        <span className="text-purple-400">CALL_METHOD</span><br/>
                        &nbsp;&nbsp;<span className="text-orange-300">Address</span>(<span className="text-gray-400">"account_rdx1..."</span>)<br/>
                        &nbsp;&nbsp;<span className="text-staking-green">"withdraw"</span><br/>
                        &nbsp;&nbsp;<span className="text-orange-300">Address</span>(<span className="text-gray-400">"resource_rdx1..."</span>)<br/>
                        &nbsp;&nbsp;<span className="text-radix-blue">Decimal</span>(<span className="text-staking-green">"100.5"</span>);<br/>
                        <br/>
                        <span className="text-purple-400">TAKE_FROM_WORKTOP</span><br/>
                        &nbsp;&nbsp;<span className="text-orange-300">Address</span>(<span className="text-gray-400">"resource_rdx1..."</span>)<br/>
                        &nbsp;&nbsp;<span className="text-radix-blue">Decimal</span>(<span className="text-staking-green">"100.5"</span>)<br/>
                        &nbsp;&nbsp;<span className="text-white">Bucket</span>(<span className="text-staking-green">"bucket1"</span>);
                     </div>
                  </div>

                  {/* Consensus Topology */}
                  <div>
                     <h3 className="text-xs font-mono text-text-muted font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Cerberus Orbit</h3>
                     <div className="bg-black/30 rounded-xl h-48 border border-white/5 relative overflow-hidden flex items-center justify-center">
                        {/* Mock D3-style animated topology */}
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 rounded-full border border-radix-blue/20 absolute" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border border-dashed border-purple-500/30 absolute" />
                        <div className="w-12 h-12 rounded-full bg-radix-blue/10 border border-radix-blue shadow-[0_0_20px_rgba(0,102,255,0.4)] flex items-center justify-center relative z-10">
                           <Activity size={16} className="text-radix-blue" />
                        </div>
                        {/* Nodes */}
                        {[0, 1, 2, 3, 4].map(i => (
                           <motion.div 
                              key={i}
                              initial={{ opacity: 0.2 }}
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                              className="absolute w-2 h-2 rounded-full bg-staking-green shadow-[0_0_10px_#3cd5af]"
                              style={{
                                 top: `calc(50% + ${Math.sin(i * Math.PI * 0.4) * 60}px)`,
                                 left: `calc(50% + ${Math.cos(i * Math.PI * 0.4) * 60}px)`
                              }}
                           />
                        ))}
                        {/* Ping lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                           <circle cx="50%" cy="50%" r="60" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4">
                              <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                           </circle>
                        </svg>
                        <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-mono text-text-muted uppercase tracking-widest">
                           Finality Achieved • 1.2s
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <VisualizerDock shardsInvolved={shardsInvolved} formattedHealth={formattedHealth} />
    </div>
  );
}
