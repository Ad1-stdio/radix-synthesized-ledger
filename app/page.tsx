"use client";

import { LiquidityDepthChart } from "@/components/LiquidityDepthChart";
import { Check, ArrowUpRight, ArrowLeftRight, Box, Hexagon, Layers, Activity, Database, Zap } from "lucide-react";
import { MagneticCard } from "@/components/MagneticCard";
import { motion } from "framer-motion";
import { OdometerCurrency } from "@/components/Odometer";
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useNetwork } from "@/contexts/NetworkContext";

const PhysicalVault = ({ name, amount, subtext, colorClassName, delay }: { name: string, amount: string | number, subtext: string, colorClassName: string, delay: number }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
      <MagneticCard className="glass-heavy rounded-2xl p-6 relative overflow-hidden h-40 flex flex-col justify-end group border-t border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
         <div className={`absolute -top-10 -right-10 w-48 h-48 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${colorClassName}`} />
         
         <div className="absolute top-5 left-5">
           <div className="text-[9px] font-mono text-text-muted font-bold tracking-widest uppercase mb-1">Asset Vault</div>
           <div className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <Box size={14} className={colorClassName.replace("bg-", "text-")} /> {name}
           </div>
         </div>

         {/* Floating Asset Hexagon */}
         <motion.div 
           animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }} 
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
           className="absolute right-6 top-6"
         >
           <Hexagon size={48} className={colorClassName.replace("bg-", "text-")} strokeWidth={1} />
           {/* Inner Core */}
           <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className={`absolute inset-0 m-auto w-4 h-4 rounded-full ${colorClassName} blur-sm`} />
         </motion.div>

         <div className="text-3xl font-mono font-bold text-white tracking-tight mt-auto z-10 drop-shadow-lg flex items-baseline gap-1">
            {typeof amount === "number" ? <OdometerCurrency value={amount} /> : amount}
         </div>
         <div className="text-[10px] font-mono text-text-muted z-10 uppercase tracking-widest">
            {subtext}
         </div>
      </MagneticCard>
    </motion.div>
);

export default function DashboardPage() {
  const { isConnected, balance } = useWallet();
  const { activeNetwork } = useNetwork();
  
  const [volume, setVolume] = useState(28491024);
  const [tps, setTps] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => prev + (Math.random() * 5000));
      // Simulate pulse variations based on network simulation
      setTps(Math.floor(Math.random() * (activeNetwork === 'Mainnet' ? 40 : 15)) + 5);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeNetwork]);

  return (
    <div className="max-w-[1440px] w-full mx-auto space-y-8 pb-12 px-8 pt-8 relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-radix-blue/10 blur-[150px] pointer-events-none -z-10 rounded-full mix-blend-screen translate-x-1/2 -translate-y-1/2"></div>

      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black text-white tracking-widest uppercase font-sans mb-2">
            Ledger Intelligence
          </motion.h1>
          <div className="font-mono text-sm text-text-muted flex items-center gap-3">
             <Layers size={14} className="text-radix-blue" />
             Scrypto Asset-Oriented Engine <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">V 1.2.0</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-staking-green/30 bg-staking-green/10 text-staking-green text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(60,213,175,0.2)]">
          <span className="w-2 h-2 rounded-full bg-staking-green animate-pulse"></span>
          Cerberus Consensus Active
        </div>
      </div>

      {/* Physical Persona Vaults */}
      <div>
         <div className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <UserIcon /> Connected Persona Vaults
         </div>
         {isConnected ? (
           <div className="grid grid-cols-4 gap-6">
             <PhysicalVault name="Radix (XRD)" amount={balance} subtext="$4,204.10 USD" colorClassName="bg-radix-blue" delay={0.1} />
             <PhysicalVault name="Ociswap (OCI)" amount="12,500.00" subtext="$840.00 USD" colorClassName="bg-purple-500" delay={0.2} />
             <PhysicalVault name="HugCoin (HUG)" amount="1M" subtext="$102.50 USD" colorClassName="bg-pink-500" delay={0.3} />
             
             {/* Staked Vault */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                 <MagneticCard className="glass-heavy rounded-2xl p-6 relative overflow-hidden h-40 flex flex-col justify-end group border border-staking-green/30 shadow-[0_0_30px_rgba(60,213,175,0.15)]">
                    <div className="absolute top-5 left-5">
                       <div className="text-[9px] font-mono text-staking-green font-bold tracking-widest uppercase mb-1">Staked Component</div>
                       <div className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                          <Activity size={14} className="text-staking-green" /> Validator Node
                       </div>
                    </div>
                    <div className="text-3xl font-mono font-bold text-staking-green tracking-tight mt-auto z-10 drop-shadow-[0_0_10px_rgba(60,213,175,0.8)]">
                       50,000.00
                    </div>
                    <div className="text-[10px] font-mono text-staking-green/70 z-10 uppercase tracking-widest mt-1">
                       Active Yield • 8.5% APY
                    </div>
                 </MagneticCard>
             </motion.div>
           </div>
         ) : (
           <div className="h-40 glass-heavy rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-text-muted font-mono text-xs uppercase tracking-widest">
              <LockIcon className="mb-2 opacity-50" />
              Connect Wallet to synchronize physical vaults
           </div>
         )}
      </div>

      {/* Network Pulse Command Center (Bloomberg Terminal Style) */}
      <div className="grid grid-cols-[1fr,2.5fr] gap-6 mt-12">
        {/* Real-time Metrics Column */}
        <div className="flex flex-col gap-6">
           <MagneticCard className="glass-heavy rounded-2xl p-6 border-l-4 border-l-radix-blue">
               <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4 flex justify-between items-center">
                  Live TPS <Zap size={12} className="text-radix-blue" />
               </div>
               <div className="text-5xl font-sans font-black text-white tracking-tighter">
                  {tps} <span className="text-xl text-radix-blue font-bold tracking-normal">tx/s</span>
               </div>
               <div className="mt-4 h-1 w-full bg-white/5 rounded overflow-hidden">
                  <motion.div className="h-full bg-radix-blue" animate={{ width: `${(tps / 50) * 100}%` }} transition={{ duration: 0.5 }} />
               </div>
           </MagneticCard>

           <MagneticCard className="glass-heavy rounded-2xl p-6">
               <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4 flex justify-between items-center">
                  24H Ledger Volume <Database size={12} className="text-purple-400" />
               </div>
               <div className="text-3xl font-mono font-bold text-white">
                  $<OdometerCurrency value={volume} />
               </div>
               <div className="text-xs font-mono text-staking-green mt-2 flex items-center gap-1">
                  <ArrowUpRight size={12} /> +12.4% (Live)
               </div>
           </MagneticCard>
           
           <MagneticCard className="glass-heavy rounded-2xl p-6 bg-gradient-to-br from-[#0c0d1c] to-[#0a1b14]">
               <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4">
                  Total Value Locked (TVL)
               </div>
               <div className="text-3xl font-mono font-bold text-white">
                  $412.5M
               </div>
               <div className="text-xs font-mono text-text-muted mt-2 border-t border-white/10 pt-2 flex justify-between">
                  <span>DeFi</span> <span className="text-white">125M</span>
               </div>
               <div className="text-xs font-mono text-text-muted mt-1 flex justify-between">
                  <span>Staked</span> <span className="text-white">287.5M</span>
               </div>
           </MagneticCard>
        </div>

        {/* Liquidity Depth Terminal */}
        <MagneticCard className="glass-heavy rounded-2xl p-6 min-h-[400px] flex flex-col relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
             <div className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-radix-blue" /> Institutional Liquidity Flow
             </div>
             <div className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-mono font-bold uppercase rounded border border-red-500/30 animate-pulse">
                Live Orderbook
             </div>
          </div>
          <div className="flex-1 mt-8">
             <LiquidityDepthChart />
          </div>
        </MagneticCard>
      </div>

    </div>
  );
}

// Simple icons missing from lucide-react import list
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-radix-blue"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = ({ className }: { className?: string }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
