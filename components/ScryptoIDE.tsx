"use client";

import { Check, RefreshCw, FileText, Copy, Save, Sparkles, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BUILD_LOGS = [
  { text: "scrypto build --release", type: "cmd", ts: "00:00:00.000" },
  { text: "Compiling scrypto-v1.1.0...", type: "log", ts: "00:00:00.120" },
  { text: "Compiling core_math v0.2.1", type: "log", ts: "00:00:00.150" },
  { text: "Analyzing blueprint constraints...", type: "log", ts: "00:00:00.220" },
  { text: "Finished release [optimized] target(s) in 0.44s", type: "success", ts: "00:00:00.440" },
  { text: "resim test --all", type: "cmd", ts: "00:00:00.450" },
  { text: "Running unit tests: 4 passed; 0 failed", type: "success", ts: "00:00:00.890" },
  { text: "awaiting_interaction_", type: "prompt", ts: "00:00:00.900" }
];

function formatTimestamp(ts: string) {
  return <span className="opacity-70 mr-3 text-[10px] font-mono tracking-widest">{ts}</span>;
}

export function ScryptoIDE() {
  const [pipelineState, setPipelineState] = useState<"idle" | "compiling" | "ready" | "transferring">("idle");
  const [logs, setLogs] = useState<typeof BUILD_LOGS>([]);
  
  // AI Fix state
  const [toastVisible, setToastVisible] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [flashTick, setFlashTick] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (pipelineState === "compiling") {
      setToastVisible(false); // Hide toast when recompiling
      setLogs([]);
      let i = 0;
      const t = setInterval(() => {
        if (i < BUILD_LOGS.length) {
          setLogs(prev => [...prev, BUILD_LOGS[i]]);
          i++;
        } else {
          clearInterval(t);
          setPipelineState("ready"); // Next step
          setToastVisible(true); // Spawn toast on compile finish!
        }
      }, 300);
      return () => clearInterval(t);
    }
  }, [pipelineState]);

  const handleRun = () => {
    if (pipelineState === "idle") {
      setPipelineState("compiling");
    } else if (pipelineState === "ready") {
       setPipelineState("transferring");
       setTimeout(() => setPipelineState("idle"), 2000);
    }
  };

  const applyFix = () => {
    setIsOptimized(true);
    setToastVisible(false);
    setFlashTick(prev => prev + 1);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 font-mono text-sm relative">
      
      {/* Bucket Animation Layer */}
      <AnimatePresence>
        {pipelineState === "transferring" && (
          <motion.div
            initial={{ left: '40%', top: '50%', scale: 0.8, opacity: 0 }}
            animate={{ left: '100%', top: '70%', scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute z-50 pointer-events-none drop-shadow-[0_0_25px_rgba(60,213,175,0.8)] -translate-x-1/2 -translate-y-1/2"
          >
            {/* The Bucket Trail */}
            <motion.div 
               className="absolute top-1/2 right-full h-1.5 rounded-l-full bg-gradient-to-r from-transparent to-staking-green blur-sm"
               style={{ transform: "translateY(-50%)" }}
               initial={{ width: 0 }}
               animate={{ width: 300 }}
               transition={{ duration: 1.5, ease: "linear" }}
            />
            {/* The Bucket SVG */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3cd5af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 bg-deep-navy rounded-xl">
              <path d="M4 4h16c.55 0 1 .45 1 1v1l-2 14c-.1.66-.67 1.15-1.34 1.15H6.34c-.67 0-1.24-.49-1.34-1.15L3 6V5c0-.55.45-1 1-1Z"/>
              <path d="M4 6h16"/>
              <path d="M8 10v4"/>
              <path d="M16 10v4"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left: Pipeline */}
      <div className="w-64 flex flex-col justify-between">
        <div>
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="text-white font-bold font-sans tracking-widest uppercase mb-1">Blueprint Flow</h2>
              <div className="text-[10px] text-text-muted">ASSEMBLY PIPELINE V2.4</div>
            </div>
            <button 
               onClick={handleRun}
               className="bg-radix-blue hover:bg-blue-600 text-white p-2 rounded shadow-glow-blue transition-all"
            >
               <Play size={16} />
            </button>
          </div>
          
          <div className="relative pl-6 space-y-12">
            <div className="absolute top-4 bottom-4 left-[35px] w-[2px] bg-panel-border z-0"></div>
            <div className="absolute top-4 left-[35px] w-[2px] bg-staking-green z-0 transition-all duration-1000" style={{ height: pipelineState === "idle" ? '0%' : pipelineState === "compiling" ? '20%' : '60%', boxShadow: '0 0 10px #3cd5af' }}></div>

            {/* Step 1 */}
            <div className="relative z-10 flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${pipelineState !== 'idle' ? 'bg-[#122822] border-staking-green text-staking-green shadow-glow-green' : 'bg-panel-bg border-text-muted/30 text-text-muted'}`}>
                {pipelineState === "compiling" ? <RefreshCw size={14} className="animate-spin" /> : <Check size={16} />}
              </div>
              <div className="w-full">
                <div className={`font-bold tracking-widest uppercase text-xs mb-1 ${pipelineState !== 'idle' ? 'text-white' : 'text-text-muted'}`}>Compile</div>
                
                {pipelineState === "compiling" && (
                   <>
                     <div className="text-[10px] tracking-widest text-text-muted mb-2 animate-pulse">PROCESSING...</div>
                     <div className="h-1 bg-panel-border w-full rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: "0%" }} 
                          animate={{ width: "100%" }} 
                          transition={{ duration: 2.4, ease: "linear" }}
                          className="h-full bg-staking-green shadow-glow-green"
                       />
                     </div>
                   </>
                )}
                {pipelineState !== "compiling" && pipelineState !== "idle" && (
                   <div className="text-[10px] tracking-widest text-staking-green mt-1">SUCCESS: 2.4s</div>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${pipelineState === 'ready' || pipelineState === 'transferring' ? 'bg-panel-bg border-radix-blue text-radix-blue shadow-glow-blue' : 'bg-panel-bg border-text-muted/30 text-text-muted'}`}>
                <RefreshCw size={14} className={pipelineState === 'ready' ? 'animate-spin duration-3000' : ''} />
              </div>
              <div className="w-full">
                <div className={`font-bold tracking-widest uppercase text-xs mb-1 ${pipelineState === 'ready' ? 'text-white' : 'text-text-muted'}`}>Unit Testing</div>
                {pipelineState === 'ready' && (
                  <>
                    <div className="text-text-muted text-[10px] tracking-widest mb-2 flex items-center gap-2">
                      RUNNING ScryptoVM<span className="animate-pulse">...</span>
                    </div>
                    <div className="h-1 bg-panel-border w-full rounded-full overflow-hidden">
                       <div className="h-full bg-radix-blue w-[60%] shadow-glow-blue"></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex items-start gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full bg-panel-border border border-text-muted/30 flex items-center justify-center shrink-0 mt-1"></div>
              <div>
                <div className="font-bold tracking-widest uppercase text-xs mb-1 text-text-muted">Deploy</div>
                <div className="text-text-muted text-[10px] tracking-widest">AWAITING TRIGGER</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Validator Status */}
        <div className="border border-panel-border bg-panel-bg p-4 rounded-xl flex items-center justify-between text-xs tracking-widest uppercase">
          <div>
            <div className="text-[10px] text-text-muted mb-1">VALIDATOR STATUS</div>
            <div className="text-white font-bold">Radix-Node-01: Online</div>
          </div>
          <div className="w-2 h-2 bg-staking-green rounded-full shadow-glow-green animate-pulse"></div>
        </div>
      </div>

      {/* Center: Editor */}
      <div className="flex-1 bg-[#0b0b14] border border-panel-border rounded-xl flex flex-col overflow-hidden relative">
        <div className="h-12 border-b border-panel-border bg-[#121220] flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-text-muted text-xs tracking-widest hover:text-white transition-colors cursor-pointer">
            <FileText size={14} />
            HELLO_WORLD.RS
          </div>
          <div className="flex items-center gap-3 text-text-muted">
            <Copy size={14} className="cursor-pointer hover:text-white" />
            <Save size={14} className="cursor-pointer hover:text-white" />
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto leading-relaxed text-[13px] relative z-0">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0b0b14] border-r border-panel-border/30 flex flex-col items-end py-6 pr-3 text-[#3a3a5a] select-none">
            {Array.from({length: 30}).map((_, i) => <div key={i}>{i+1}</div>)}
          </div>
          <div className="pl-10">
            <pre className="font-mono whitespace-pre text-white">
<span className="text-[#0066ff]">use</span> <span className="text-text-muted">scrypto::prelude::*;</span>

<span className="text-[#0066ff] font-bold">blueprint!</span> {"{"}
    <span className="text-[#0066ff]">struct</span> <span className="text-staking-green">HelloWorld</span> {"{"}
        sample_vault: <span className="text-staking-green">Vault</span>,
    {"}"}

    <span className="text-[#0066ff]">impl</span> <span className="text-staking-green">HelloWorld</span> {"{"}
        <span className="text-[#0066ff]">pub fn</span> <span className="text-[#e2e2a3]">instantiate_hello</span>() <span className="text-[#0066ff]">{"->"}</span> <span className="text-staking-green">ComponentAddress</span> {"{"}
            <span className="text-[#0066ff]">let</span> my_bucket: <span className="text-staking-green">Bucket</span> = <span className="text-staking-green">ResourceBuilder</span>::new_fungible()
                .metadata(<span className="text-[#ff9d66]">&quot;name&quot;</span>, <span className="text-[#ff9d66]">&quot;Hello Token&quot;</span>)
                .initial_supply(<span className="text-[#ff66b2]">1000</span>);

            Self {"{"}
                sample_vault: <span className="text-staking-green">Vault</span>::with_bucket(my_bucket)
            {"}"}
            .instantiate()
            .globalize()
        {"}"}

{isOptimized ? (
<motion.div key={`opt-${flashTick}`} initial={{ backgroundColor: "rgba(60,213,175,0.4)" }} animate={{ backgroundColor: "rgba(60,213,175,0.0)" }} transition={{ duration: 1.5 }} className="rounded">
        <span className="text-[#0066ff]">pub fn</span> <span className="text-[#e2e2a3]">free_token</span>(<span className="text-[#0066ff]">&mut</span> self, auth: <span className="text-staking-green">Proof</span>) <span className="text-[#0066ff]">{"->"}</span> <span className="text-staking-green">Bucket</span> {"{"}
            <span className="text-[#0066ff]">assert!</span>(auth.amount() {">"} <span className="text-[#ff66b2]">0</span>, <span className="text-[#ff9d66]">&quot;Invalid proof!&quot;</span>);
            <span className="text-[#0066ff]">self</span>.sample_vault.take(<span className="text-[#ff66b2]">1</span>)
        {"}"}
</motion.div>
) : (
<div>
        <span className="text-[#0066ff]">pub fn</span> <span className="text-[#e2e2a3]">free_token</span>(<span className="text-[#0066ff]">&mut</span> self) <span className="text-[#0066ff]">{"->"}</span> <span className="text-staking-green">Bucket</span> {"{"}
            <span className="text-[#0066ff]">self</span>.sample_vault.take(<span className="text-[#ff66b2]">1</span>)
        {"}"}
</div>
)}
    {"}"}
{"}"}
            </pre>
          </div>
          
          {/* AI Assistant Overlay */}
          <AnimatePresence>
            {toastVisible && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-6 right-6 w-80 bg-panel-bg border border-[#2a2a4a] rounded-xl shadow-[0_20px_50px_-10px_rgba(0,102,255,0.3)] overflow-hidden z-20"
              >
                <div className="bg-[#18182f] px-4 py-3 border-b border-[#2a2a4a] flex gap-3 items-center">
                  <Sparkles size={16} className="text-[#0066ff]" />
                  <div>
                    <div className="font-bold text-white text-[10px] tracking-widest uppercase">Scrypto AI Assistant</div>
                    <div className="text-[#8a8ca8] text-[8px] tracking-widest uppercase">Optimization Suggested</div>
                  </div>
                </div>
                <div className="p-4 text-xs text-[#8a8ca8] leading-relaxed">
                  Your <code className="text-[#e2e2a3] bg-black/30 px-1 py-0.5 rounded">free_token</code> method lacks auth verification. Supply a <code className="text-staking-green">Proof</code> standard to prevent generic withdrawals.
                  <div className="mt-4 flex gap-2 w-full font-bold tracking-wider text-[10px] uppercase">
                    <button onClick={() => setToastVisible(false)} className="flex-1 py-2 px-3 bg-[#1e1e38] text-white rounded hover:bg-[#2a2a4a] transition-colors">Dismiss</button>
                    <button onClick={applyFix} className="flex-1 py-2 px-3 bg-[#0066ff] text-white rounded shadow-glow-blue hover:shadow-[0_0_15px_rgba(0,102,255,0.7)] transition-all">Apply Fix</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Console & Details */}
      <div className="w-72 flex flex-col gap-6 relative z-10">
        <div className="flex-1 bg-panel-bg border border-panel-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-panel-border text-[10px] font-bold text-white tracking-widest uppercase flex justify-between">
            Console Output
            {pipelineState === "idle" && <span className="text-text-muted lowercase">waiting...</span>}
          </div>
          <div className="p-4 text-[11px] text-text-muted leading-relaxed font-mono overflow-y-auto max-h-[300px]">
             {logs.map((log, i) => {
                if (!log) return null;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                    className={`mt-1 flex ${log.type === 'cmd' ? "text-white mt-3" : log.type === 'success' ? "text-staking-green drop-shadow-glow-green mt-2" : log.type === 'prompt' ? "mt-4" : "text-white/50"}`}
                  >
                    {formatTimestamp(log.ts)}
                    {log.type === 'cmd' && <span className="text-radix-blue mr-2">{">"}</span>}
                    {log.text}
                    {log.type === 'prompt' && <span className="animate-pulse">_</span>}
                  </motion.div>
                );
             })}
          </div>
        </div>

        <div className="h-48 bg-panel-bg border border-panel-border rounded-xl p-4 flex flex-col relative overflow-hidden">
           {/* Focus glow for bucket drop */}
           <motion.div 
              className="absolute inset-0 bg-staking-green/10 z-0 mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: pipelineState === "transferring" ? 1 : 0 }}
              transition={{ duration: 1 }}
           />

          <div className="text-[10px] font-bold text-white tracking-widest uppercase mb-4 relative z-10">Deployment Manifest</div>
          
          <div className="space-y-4 flex-1 relative z-10">
            <div className="flex justify-between items-center text-[10px] tracking-widest">
              <span className="text-text-muted">NETWORK</span>
              <span className="text-white">RADIX_MAINNET</span>
            </div>
            <div className="flex justify-between items-center text-[10px] tracking-widest">
               <span className="text-text-muted">GAS_LIMIT</span>
               <div className="text-right">
                  <div className="text-staking-green font-bold text-sm">10,000,000</div>
                  <div className="text-text-muted text-[8px]">QUANTA</div>
               </div>
            </div>
            <div className="flex justify-between items-center text-[10px] tracking-widest border-t border-panel-border/50 pt-2 pb-2">
              <span className="text-text-muted">FEE_PAYER</span>
              <span className="text-text-muted underline decoration-text-muted/30 underline-offset-2">rdx1q...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
