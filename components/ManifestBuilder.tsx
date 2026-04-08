"use client";

import { useState, useEffect } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { GripVertical, Plus, Play, Trash2, Code2, AlertTriangle, Cpu } from "lucide-react";
import { useNetwork } from "@/contexts/NetworkContext";

export interface InstructionBlock {
   id: string;
   type: string;
   label: string;
   color: string;
   syntax: string;
   predictedShards: number;
}

const AVAILABLE_BLOCKS: Omit<InstructionBlock, 'id'>[] = [
   { type: "WITHDRAW", label: "Take From Worktop", color: "text-radix-blue", syntax: "TAKE_FROM_WORKTOP Address(\"resource_rdx...\") Decimal(\"100\");", predictedShards: 12 },
   { type: "DEPOSIT", label: "Deposit To Vault", color: "text-staking-green", syntax: "DEPOSIT_BATCH Expression(\"ENTIRE_WORKTOP\");", predictedShards: 8 },
   { type: "CALL_METHOD", label: "Component Call", color: "text-purple-400", syntax: "CALL_METHOD Address(\"component_rdx...\") \"swap\";", predictedShards: 35 },
   { type: "ASSERT", label: "Assert Worktop", color: "text-orange-400", syntax: "ASSERT_WORKTOP_CONTAINS Address(\"resource_rdx...\") Decimal(\"100\");", predictedShards: 3 }
];

export function ManifestBuilder({ 
  onBlocksChange, 
  onSimulate 
}: { 
  onBlocksChange: (blocks: InstructionBlock[]) => void; 
  onSimulate: (blocks: InstructionBlock[]) => void;
}) {
  const [blocks, setBlocks] = useState<InstructionBlock[]>([]);
  const { activeNetwork } = useNetwork();
  
  // Update parent whenever blocks change
  useEffect(() => {
     onBlocksChange(blocks);
  }, [blocks, onBlocksChange]);

  const addBlock = (tmpl: Omit<InstructionBlock, 'id'>) => {
     setBlocks([...blocks, { ...tmpl, id: Math.random().toString(36).substring(7) }]);
  };

  const removeBlock = (id: string) => {
     setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#121226]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
       {/* Header */}
       <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#15152a]">
          <div>
            <h2 className="text-white font-bold font-sans uppercase tracking-wider text-xl flex items-center gap-2">
               <Code2 className="text-radix-blue" size={20} />
               Transaction Orchestrator
            </h2>
            <div className="text-xs font-mono text-text-muted mt-1">Radix {activeNetwork} Syntax</div>
          </div>
          <button 
             onClick={() => onSimulate(blocks)}
             disabled={blocks.length === 0}
             className="bg-radix-blue hover:bg-radix-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg font-sans uppercase tracking-widest text-sm flex items-center gap-2 transition-colors shadow-glow-blue"
          >
             <Play fill="currentColor" size={14} />
             Dry Run
          </button>
       </div>

       <div className="flex flex-1 overflow-hidden">
          
          {/* Builder Area */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 relative">
            {blocks.length === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-text-muted/30 flex items-center justify-center mb-4">
                     <Plus size={24} className="opacity-50" />
                  </div>
                  <div className="font-mono text-sm uppercase tracking-widest opacity-60">Drag instructions here</div>
               </div>
            ) : (
               <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="flex flex-col gap-3 z-10 w-full min-h-[50vh]">
                 <AnimatePresence>
                   {blocks.map((block) => (
                      <Reorder.Item 
                        key={block.id} 
                        value={block}
                        className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-4 cursor-grab active:cursor-grabbing group hover:border-radix-blue/30 transition-colors bg-[#181832]/80"
                      >
                         <GripVertical className="text-text-muted/50 group-hover:text-text-muted" size={18} />
                         <div className="flex-1">
                            <div className={`font-bold font-mono text-sm uppercase tracking-wide ${block.color}`}>
                               {block.label}
                            </div>
                            <div className="font-mono text-[10px] text-text-muted mt-1 p-2 bg-black/40 rounded border border-white/5 font-medium">
                               {block.syntax}
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                           <div className="text-[9px] font-mono font-bold text-radix-blue border border-radix-blue/30 px-2 py-0.5 rounded bg-radix-blue/10 flex items-center gap-1 shadow-glow-blue uppercase tracking-widest block">
                              <Cpu size={10} /> {block.predictedShards} shards
                           </div>
                           <button 
                             onClick={() => removeBlock(block.id)}
                             className="text-text-muted hover:text-red-400 p-1 rounded transition-colors"
                           >
                              <Trash2 size={14} />
                           </button>
                         </div>
                      </Reorder.Item>
                   ))}
                 </AnimatePresence>
               </Reorder.Group>
            )}
            
            {/* End marker */}
            {blocks.length > 0 && (
               <div className="text-center py-4 border-t border-dashed border-white/10 mt-4 z-10">
                 <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted bg-[#121226] px-4 py-1.5 rounded-full border border-white/5">
                   END OF MANIFEST
                 </span>
               </div>
            )}
          </div>

          {/* Catalog Palette */}
          <div className="w-72 border-l border-white/10 bg-[#0c0c1a] p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar shadow-inner">
             <div className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-widest mb-2 px-1">
                Instruction Set
             </div>
             {AVAILABLE_BLOCKS.map(block => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block)}
                  className="p-3 bg-panel-bg rounded-lg border border-white/5 hover:border-white/20 transition-all text-left flex flex-col gap-1.5 group hover:bg-[#1f1f3a]"
                >
                   <div className="flex justify-between items-center">
                     <span className={`font-bold font-mono text-xs uppercase tracking-wide ${block.color}`}>{block.label}</span>
                     <Plus size={14} className="text-text-muted group-hover:text-white" />
                   </div>
                   <div className="text-[9px] font-mono text-text-muted opacity-80 leading-tight">
                     {block.syntax.substring(0, 30)}...
                   </div>
                </button>
             ))}
             
             <div className="mt-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400/80 flex gap-3 text-xs">
                <AlertTriangle size={32} className="flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-mono">
                  Radix employs a powerful asset-oriented instruction set. Dragging instructions orchestrates exact network interactions without complex smart contract logic for simple token flows.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
