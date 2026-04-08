"use client";

import { useState } from "react";
import { ManifestBuilder, InstructionBlock } from "@/components/ManifestBuilder";
import { CanvasShardMap } from "@/components/CanvasShardMap";
import { useMotionValue, motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, RefreshCw, Layers, CheckCircle2, FileJson, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlaygroundPage() {
  const [blocks, setBlocks] = useState<InstructionBlock[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Derive trace id format to plug into canvas
  // if blocks are present, generate a pseudo trace ID. Change ID on array length length to re-trigger.
  const activeTraceId = blocks.length > 0 ? `sim_trace_${blocks.length}_${blocks.reduce((acc, b) => acc + b.predictedShards, 0)}` : null;
  const traceX = useMotionValue(-1000);
  const traceY = useMotionValue(-1000);
  const router = useRouter();

  const handleSimulate = async (currentBlocks: InstructionBlock[]) => {
      setIsSimulating(true);
      
      const totalShards = currentBlocks.reduce((acc, curr) => acc + curr.predictedShards, 0);
      const predictedFee = (totalShards * 0.05).toFixed(2);
      
      // Trigger a clean fast client-side router warp
      const mainContainer = document.getElementById("warp-main") || document.body;
      mainContainer.style.transition = "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)";
      mainContainer.style.opacity = "0";
      
      setTimeout(() => {
         mainContainer.style.opacity = "1";
         router.push(`/explorer?sim=true&shards=${totalShards}&fee=${predictedFee}`);
      }, 150);
  };

  return (
    <div className="max-w-[1440px] mx-auto h-[calc(100vh-80px)] p-6 relative overflow-hidden bg-[#0A0A12]">
      {/* Background Matrix Shard Grid */}
      <CanvasShardMap activeTraceId={activeTraceId} onShardsInvolved={() => {}} traceX={traceX} traceY={traceY} />

      <div className="relative z-10 w-full h-full flex gap-6">
         
         {/* Main Builder Pane */}
         <div className="flex-1 flex flex-col h-full opacity-95">
             <div className="mb-4">
                 <h1 className="text-3xl font-black text-white uppercase tracking-wider font-sans leading-tight">
                    Transaction <span className="text-radix-blue">Playground</span>
                 </h1>
             </div>
             
             <div className="flex-1 min-h-0">
                <ManifestBuilder onBlocksChange={setBlocks} onSimulate={handleSimulate} />
             </div>
         </div>

         {/* Right Sidebar - Dry Run Results */}
         <div className="w-[380px] flex flex-col gap-6">
            
            {/* Simulation Pane */}
            <div className="bg-[#121226]/80 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col h-[500px] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6 text-text-muted font-bold tracking-widest uppercase font-mono text-sm border-b border-white/5 pb-4">
                   <TerminalSquare size={16} className="text-radix-blue" />
                   Dry Run Simulation
                </div>

                {isSimulating && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1a]/95 backdrop-blur-sm z-20">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                         <RefreshCw size={32} className="text-radix-blue" />
                      </motion.div>
                      <div className="text-radix-blue font-mono text-xs uppercase tracking-widest mt-6 animate-pulse">
                         Computing Preview...
                      </div>
                   </div>
                )}

                {!simulationResult && !isSimulating && (
                   <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-40">
                      <FileJson size={48} className="mb-4" />
                      <div className="text-center font-mono text-xs">Run a simulation to view <br/>predicted resource changes.</div>
                   </div>
                )}

                {simulationResult && !isSimulating && (
                   <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      
                      <div className="flex items-center gap-3 p-3 bg-staking-green/10 border border-staking-green/30 rounded-lg text-staking-green font-mono text-xs font-bold uppercase tracking-wider mb-6 shadow-[inset_0_0_15px_rgba(60,213,175,0.1)]">
                         <CheckCircle2 size={16} />
                         Execution Validated
                      </div>

                      <div className="mb-6 bg-black/40 p-4 rounded-xl border border-white/5">
                         <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-1">Predicted Network Fee</div>
                         <div className="text-2xl font-bold font-mono text-white tracking-widest">{simulationResult.gasPredicted} <span className="text-sm text-radix-blue">XRD</span></div>
                      </div>

                      <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3 border-b border-white/10 pb-2 flex justify-between">
                         <span>Resource Manifest</span>
                         <span>{simulationResult.shards} Shards</span>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                         {simulationResult.changes.map((change: any, i: number) => (
                            <div key={i} className="bg-[#1a1a36]/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1">
                                <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-1">
                                  <Layers size={10} /> Step {i+1}
                                </div>
                                <div className="font-mono text-xs">
                                   <span className="text-white font-bold">{change.action}</span>{" "}
                                   <span className={change.color + " font-bold drop-shadow-glow-blue"}>{change.resource}</span>{" "}
                                   <span className="text-text-muted">{change.target}</span>
                                </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
            </div>

            {/* Hint Box */}
            <div className="bg-radix-blue/10 border border-radix-blue/30 rounded-2xl p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-radix-blue/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-radix-blue/40 transition-colors"></div>
               <h3 className="text-white font-sans font-bold tracking-wide uppercase text-sm mb-2">Atomic Composability</h3>
               <p className="text-text-muted font-mono text-xs leading-relaxed">
                 Because Radix uses the Scrypto engine, all assets behave as physical objects. If a transaction halts midway, the entire operation is automatically rolled back without complex smart-contract guardrails.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
