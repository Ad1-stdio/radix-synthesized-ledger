"use client";

// 1. Production Shield: Force dynamic rendering and handle Next.js build bailouts
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSpring, useTransform, motion, useMotionValue, AnimatePresence, MotionValue } from "framer-motion";
import { Activity, Database, Cpu, WifiOff, CheckCircle2, UploadCloud, Lock, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Mock Components - Replace with your actual imports if they exist
const CanvasShardMap = ({ activeTraceId, onShardsInvolved, traceX, traceY }: any) => (
   <div className="absolute inset-0 opacity-40 bg-[url('/hex-grid.svg')] bg-center pointer-events-none" />
);
const MagneticCard = ({ children, className }: any) => <div className={className}>{children}</div>;

const MANIFEST_FEED = Array.from({ length: 30 }).map((_, i) => {
   const hash = Math.floor(Math.abs(Math.sin(i + 42)) * 16777215).toString(16).padStart(6, '0');
   return `[CERBERUS] TX_${hash}->OK`;
});

const VisualizerDock = React.memo(({ shardsInvolved, formattedHealth }: { shardsInvolved: number, formattedHealth: MotionValue<string> }) => {
   return (
      <div className="h-16 w-full mt-auto border-t border-white/10 bg-[#0B0B14]/90 backdrop-blur-3xl relative z-20 flex font-mono text-[10px] uppercase tracking-widest divide-x divide-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex-shrink-0 overflow-x-auto">
         <div className="flex-1 min-w-[300px] flex items-center overflow-hidden relative">
            <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 40, repeat: Infinity }}
               className="flex gap-8 text-white/40 whitespace-nowrap min-w-max pr-8"
            >
               {MANIFEST_FEED.map((msg, i) => <span key={`a-${i}`}>{msg}</span>)}
               {MANIFEST_FEED.map((msg, i) => <span key={`b-${i}`}>{msg}</span>)}
            </motion.div>
         </div>
         <div className="hidden md:flex w-64 px-6 items-center justify-between bg-[#0F0F1A]">
            <div className="flex items-center gap-2 text-white/40"><Database size={14} className="text-blue-500" /> Shards</div>
            <div className="text-white font-bold text-lg">{shardsInvolved || "---"}</div>
         </div>
      </div>
   );
});

function ExplorerContent() {
   const searchParams = useSearchParams();
   const txWarpId = searchParams.get('tx');
   const isSimulation = searchParams.get('sim') === 'true';
   const simulatedShards = searchParams.get('shards');
   const simulatedFee = searchParams.get('fee');

   const [lockedTraceId, setLockedTraceId] = useState<string | null>(isSimulation ? 'sim_preview' : (txWarpId || null));
   const [shardsInvolved, setShardsInvolved] = useState(55); // Default for visual

   // Animation values
   const traceX = useMotionValue(-1000);
   const traceY = useMotionValue(-1000);
   const x = useSpring(0, { stiffness: 200, damping: 5 });
   const healthVal = useTransform(x, [0, 1], [40, 65]);
   const formattedHealth = useTransform(healthVal, (val) => `98.${Math.floor(val)}%`);

   return (
      <div className="max-w-[1440px] mx-auto h-screen lg:h-[calc(100vh-80px)] flex flex-col relative overflow-hidden bg-[#0A0A12]">
         <CanvasShardMap activeTraceId={lockedTraceId} onShardsInvolved={setShardsInvolved} traceX={traceX} traceY={traceY} />

         {/* Responsive Wrapper */}
         <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-y-auto lg:overflow-hidden">

            {/* Left Section: Feed */}
            <div className="w-full lg:w-[480px] p-6 lg:p-12 flex flex-col pointer-events-none">
               <div className="pointer-events-auto">
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase mb-6">
                     Live Network <br />
                     <span className="text-blue-500 shadow-blue-500/50">Trace Explorer</span>
                  </h1>

                  <MagneticCard className="backdrop-blur-xl bg-[#0c0d1c]/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 relative shadow-2xl max-h-[400px] overflow-y-auto">
                     {isSimulation && (
                        <div className="absolute inset-0 bg-[#0c0d1c]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
                           <div className="w-12 h-12 bg-blue-500/20 flex items-center justify-center rounded-full mb-3 border border-blue-500"><CheckCircle2 size={24} className="text-blue-500" /></div>
                           <h3 className="text-white font-bold uppercase tracking-widest text-sm">Simulation Success</h3>
                           <p className="text-[10px] text-white/50 font-mono mt-2">Fee: {simulatedFee} XRD • {simulatedShards} Shards</p>
                           <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-all">Publish to Mainnet</button>
                        </div>
                     )}
                     {/* Mock List Item */}
                     <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 flex justify-between items-center">
                        <div className="flex flex-col font-mono">
                           <span className="text-white font-bold text-xs">TRANSFER_ASSET</span>
                           <span className="text-[10px] text-white/40">{lockedTraceId || "tx_8z2k..."}</span>
                        </div>
                        <span className="text-blue-500 font-bold font-mono text-sm">500.00 XRD</span>
                     </div>
                  </MagneticCard>
               </div>
            </div>

            {/* Right Section: Decompiler (Drawer on mobile, Pane on desktop) */}
            <AnimatePresence>
               {lockedTraceId && (
                  <motion.div
                     initial={{ x: 500, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     exit={{ x: 500, opacity: 0 }}
                     className="w-full lg:w-[500px] bg-[#0A0A14]/95 lg:h-full border-l border-white/10 flex flex-col shadow-2xl z-40"
                  >
                     <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                           <div className="text-[10px] text-blue-500 font-bold font-mono uppercase flex items-center gap-2"><Cpu size={12} /> Scrypto Decompiler</div>
                           <h2 className="text-white font-bold text-lg truncate w-48">{lockedTraceId}</h2>
                        </div>
                        <button onClick={() => setLockedTraceId(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                     </div>

                     <div className="p-6 space-y-8 overflow-y-auto">
                        <div>
                           <h3 className="text-[10px] text-white/40 font-mono font-bold uppercase mb-3 border-b border-white/5 pb-2">Raw Scrypto (Rust)</h3>
                           <div className="bg-black/50 rounded-xl p-4 border border-white/5 text-[11px] font-mono leading-relaxed overflow-x-auto text-blue-200">
                              <span className="text-purple-400">CALL_METHOD</span><br />
                              &nbsp;&nbsp;<span className="text-orange-300">Address</span>("<span className="text-white/40">account_rdx1...</span>")<br />
                              &nbsp;&nbsp;<span className="text-emerald-400">"withdraw"</span><br />
                              &nbsp;&nbsp;<span className="text-blue-500">Decimal</span>("<span className="text-emerald-400">100.5</span>");
                           </div>
                        </div>

                        <div>
                           <h3 className="text-[10px] text-white/40 font-mono font-bold uppercase mb-3 border-b border-white/5 pb-2">Cerberus Orbit</h3>
                           <div className="bg-black/30 rounded-xl h-48 border border-white/5 relative flex items-center justify-center">
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border border-blue-500/20 absolute" />
                              <Activity size={20} className="text-blue-500 animate-pulse" />
                              <div className="absolute bottom-4 text-[9px] font-mono text-white/40 uppercase">Finality Achieved • 1.2s</div>
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
      <Suspense fallback={<div className="h-screen bg-[#0A0A12] flex items-center justify-center text-blue-500 font-mono animate-pulse">BOOTING CERBERUS_TRACE...</div>}>
         <ExplorerContent />
      </Suspense>
   );
}