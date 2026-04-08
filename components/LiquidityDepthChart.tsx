"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function LiquidityDepthChart() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      <div className="flex justify-between items-center mb-4 text-text-muted relative z-20">
        <div>
          <h2 className="text-white text-lg font-bold font-sans tracking-wide uppercase">Live Liquidity Depth</h2>
          <div className="text-[10px]">GLOBAL MAINNET AGGREGATOR</div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3d426b]"></span>
            BUY SIDE
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-staking-green"></span>
            SELL SIDE
          </div>
        </div>
      </div>

      <div className="relative flex-1 rounded-xl border border-white/10 bg-[#18182f] overflow-hidden p-0.5" style={{ perspective: '1000px' }}>
        <motion.div style={{ y: yParallax }} className="absolute inset-[-10px] grid grid-cols-2 grid-rows-3 gap-0.5 p-0.5 z-0">
          {/* Top Left */}
          <div className="bg-[#2a2d4a] relative overflow-hidden flex flex-wrap content-start p-1 gap-1 glass-panel !border-none">
             {Array.from({length: 40}).map((_, i) => <div key={i} className="w-[1px] h-[1px] bg-white absolute" style={{left: `${(i%10)*10}%`, top: `${Math.floor(i/10)*25}%`, opacity: 0.1}}></div>)}
          </div>
          {/* Top Right */}
          <div className="bg-staking-green opacity-90 relative glass-panel !border-none"></div>
          
          {/* Middle Left */}
          <div className="bg-[#2a2d4a] relative glass-panel !border-none"></div>
          {/* Middle Right */}
          <div className="bg-[#2b8871] relative glass-panel !border-none"></div>

          {/* Bottom Left */}
          <div className="bg-[#1e1f38] relative glass-panel !border-none"></div>
          {/* Bottom Right */}
          <div className="bg-[#1e584f] relative glass-panel !border-none"></div>
        </motion.div>

        {/* Central Overlay Label - stays static or moves differently */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="glass-panel px-3 py-1 font-mono text-[10px] text-white whitespace-nowrap shadow-glow-blue border border-radix-blue">
            MARKET EQUILIBRIUM: 0.1283 XRD/USD
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] text-text-muted font-mono tracking-widest uppercase relative z-20">
        <div>LOWER BOUND: -15%</div>
        <div className="text-staking-green">NODE SYNC: 100%</div>
        <div>UPPER BOUND: +15%</div>
      </div>
    </div>
  );
}
