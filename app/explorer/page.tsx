"use client";
export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, CheckCircle2, X, Activity, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ExplorerContent() {
  const searchParams = useSearchParams();
  const isSimulation = searchParams.get('sim') === 'true';
  const [lockedTrace, setLockedTrace] = useState(isSimulation ? "sim_preview" : null);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#05050a] overflow-hidden">
      
      {/* 1. LEFT PANEL: The Feed */}
      <div className="w-full lg:w-[450px] flex flex-col border-r border-white/5 p-6 bg-[#080812] z-20">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Network <span className="text-blue-500">Trace</span>
          </h1>
          <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em]">Synthesized Recent Emissions</p>
        </div>

        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {/* Mock Item */}
          <div 
            onClick={() => setLockedTrace("tx_8z2k_demo")}
            className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-blue-400 font-mono mb-1">TRANSFER_ASSET</p>
                <p className="text-sm font-bold text-white uppercase">tx_8z2k...2p9</p>
              </div>
              <p className="text-white font-mono text-sm">500.00 XRD</p>
            </div>
          </div>

          {isSimulation && (
             <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-md mt-4">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="text-blue-500" size={20} />
                    <p className="text-white font-bold text-sm uppercase">Simulation Ready</p>
                </div>
                <div className="text-[10px] font-mono text-white/40 mb-6">
                    Predicted Shards: 20 <br /> Estimated Fee: 1.00 XRD
                </div>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                  Publish to Mainnet
                </button>
             </div>
          )}
        </div>
      </div>

      {/* 2. CENTER PANEL: The Visualization (The Void) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center">
        {/* Hex Grid Mock */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e1e3f_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative">
           <div className="w-64 h-64 rounded-full border border-blue-500/10 animate-[ping_3s_linear_infinite]" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-blue-500/50" size={48} />
           </div>
        </div>
      </div>

      {/* 3. RIGHT PANEL: The Decompiler Drawer */}
      <AnimatePresence>
        {lockedTrace && (
          <motion.div 
            initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
            className="absolute lg:relative right-0 top-0 bottom-0 w-full lg:w-[500px] bg-[#0c0c16] border-l border-white/10 z-30 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div>
                <p className="text-[10px] text-blue-500 font-bold font-mono uppercase tracking-widest flex items-center gap-2">
                   <Cpu size={12} /> Scrypto Decompiler
                </p>
                <h2 className="text-white font-bold text-lg">{lockedTrace}</h2>
              </div>
              <button onClick={() => setLockedTrace(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] text-white/30 font-mono uppercase">Raw Scrypto (Rust)</p>
                   <p className="text-[10px] text-emerald-500 font-mono">v1.2.0</p>
                </div>
                <pre className="bg-black/50 rounded-xl p-6 border border-white/5 text-[12px] font-mono leading-relaxed text-blue-100/80 overflow-x-auto">
                  <span className="text-purple-400">CALL_METHOD</span><br/>
                  &nbsp;&nbsp;<span className="text-orange-300">Address</span>("<span className="text-white/40">account_rdx1...</span>")<br/>
                  &nbsp;&nbsp;<span className="text-emerald-400">"withdraw"</span><br/>
                  &nbsp;&nbsp;<span className="text-blue-500">Decimal</span>("<span className="text-emerald-400">100.5</span>");
                </pre>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-white/30 font-mono uppercase">Cerberus Orbit</p>
                 <div className="h-48 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center relative">
                    <Activity className="text-blue-500 animate-pulse mb-2" size={32} />
                    <p className="text-white font-bold text-xs uppercase">Consensus Active</p>
                    <p className="text-[10px] text-white/40 font-mono mt-1">Finality: 1.2s</p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#05050a] flex items-center justify-center text-blue-500 font-mono">SYNCHRONIZING...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}