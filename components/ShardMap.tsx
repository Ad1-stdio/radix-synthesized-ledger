"use client";

import { motion } from "framer-motion";

interface ShardMapProps {
  activeTraceId: string | null;
}

export function ShardMap({ activeTraceId }: ShardMapProps) {
  // Generate a random-looking but deterministic scatter grid
  const nodes = [];
  for (let x = 0; x < 12; x++) {
    for (let y = 0; y < 8; y++) {
      nodes.push({ 
        x: x * 100 + 50 + (x % 2 === 0 ? 25 : -25), 
        y: y * 100 + 50 + (y % 2 === 0 ? -25 : 25) 
      });
    }
  }

  // Predefined complex routing paths mapping abstract transaction coordinates
  const TRACES = [
    "M75,25 L225,225 L575,125 L925,475 L1125,175",
    "M175,775 L375,575 L625,625 L875,275 L1125,325",
    "M25,475 L325,425 L675,275 L975,425 L1175,225",
    "M875,775 L675,475 L425,375 L125,75",
    "M575,725 L375,425 L125,225 L625,125"
  ];

  let selectedTrace = null;
  if (activeTraceId) {
    const sum = activeTraceId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    selectedTrace = TRACES[sum % TRACES.length];
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
      <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
        <defs>
          <filter id="neonBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Network Links (Soft) */}
        <path d="M75,25 L225,225 L375,425 L675,475" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        <path d="M625,625 L875,775 L1125,325" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        <path d="M225,225 L625,125" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />

        {/* Nodes Grid */}
        {nodes.map((node, i) => (
          <circle 
            key={i} 
            cx={node.x} 
            cy={node.y} 
            r={1.5} 
            fill="rgba(255,255,255,0.15)"
            className="transition-all duration-300 hover:fill-radix-blue"
          />
        ))}

        {/* Active Trace Neon Pulse */}
        {selectedTrace && (
          <motion.path
            key={activeTraceId} // Forces recreation to trigger drawing from 0
            d={selectedTrace}
            stroke="#3cd5af"
            strokeWidth="3"
            fill="none"
            filter="url(#neonBlur)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          />
        )}
      </svg>
    </div>
  );
}
