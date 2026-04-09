"use client";

export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Activity, Shield, Cpu, Globe, 
  Search, Filter, Zap, Database, Terminal 
} from "lucide-react";
import Link from "next/link";

function ExplorerContent() {
  const searchParams = useSearchParams();
  const isSimulated = searchParams.get("sim") === "true";
  const shards = searchParams.get("shards") || "1";
  const fee = searchParams.get("fee") || "0.00";

  // Mock transaction data for the "Live" feel
  const transactions = [
    { id: "tx_8z2k...", type: "Transfer", amount: "500.00 XRD", status: "Committed", time: "2s ago" },
    { id: "tx_9p1m...", type: "Stake", amount: "1,250.00 XRD", status: "Committed", time: "12s ago" },
    { id: "tx_2v4n...", type: "Resource Claim", amount: "12.45 XRD", status: "Finalizing", time: "Just now" },
  ];

  return (
    <div className="min-h-screen bg-[#08081a] text-white font-sans selection:bg-blue-500/30">
      {/* Responsive Top Bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a25]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-95">
              <ArrowLeft className="w-5 h-5 text-blue-400" />
            </Link>
            <h1 className="text-lg font-bold tracking-tight text-blue-100 flex items-center gap-2">
              <Database className="w-5 h-5" /> NETWORK EXPLORER
            </h1>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Warp to Address / Tx Hash / Shard..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>
        </div>
      </nav>

      <main className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Cerberus Simulation Banner */}
        {isSimulated && (
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap className="w-24 h-24 text-blue-400" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
              <div className="p-4 bg-blue-500/20 rounded-full">
                <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-blue-400 font-black uppercase text-xs tracking-[0.2em]">Cerberus Pipeline Active</p>
                <h2 className="text-xl font-bold">Shard Trace: {shards} Parallel Instances</h2>
                <p className="text-blue-100/60 text-sm max-w-xl">Atomic composition verified across sub-states. Current gas throughput optimized for parallel validation.</p>
              </div>
              <div className="md:ml-auto">
                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20">LIVE FEED</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Shard Fee", val: `${fee} XRD`, icon: Activity, color: "text-blue-400" },
            { label: "Finality", val: "0.8s", icon: Zap, color: "text-yellow-400" },
            { label: "Consensus", val: "Cerberus", icon: Shield, color: "text-green-400" },
            { label: "Round", val: "298104", icon: Terminal, color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-xl font-mono font-bold">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Main Explorer Table Area */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Real-Time Ledger Transitions
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/10">
              <Filter className="w-4 h-4" /> Filter Stream
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] text-gray-500 text-[10px] uppercase tracking-[0.1em]">
                  <th className="px-6 py-4 font-bold">Transaction ID</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs text-blue-400">{tx.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{tx.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        tx.status === 'Committed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-10 animate-pulse"></div>
              <Cpu className="w-12 h-12 text-blue-500/40 relative z-10" />
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Waiting for new ledger transitions on Shard {shards}...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#08081a]">
        <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-400 font-mono text-xs mt-4 tracking-widest animate-pulse">SYNCING WITH RADIX NETWORK...</p>
      </div>
    }>
      <ExplorerContent />
    </Suspense>
  );
}