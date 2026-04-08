"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, TerminalSquare, History, Compass, Settings, Wallet, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNetwork } from "@/contexts/NetworkContext";
import { useWallet } from "@/contexts/WalletContext";

import { useTransactionFeed } from "@/hooks/useTransactionFeed";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Playground", href: "/playground", icon: TerminalSquare },
  { name: "Transactions", href: "/transactions", icon: History },
  { name: "Explorer", href: "/explorer", icon: Compass },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected, address, openModal, disconnect } = useWallet();
  const { activeNetwork } = useNetwork();
  const { pulse } = useTransactionFeed();

  return (
    <aside className="w-64 glass-heavy h-screen flex flex-col pt-8 pb-6 px-4">
      {/* Brand */}
      <div className="mb-6 px-2 uppercase leading-tight font-black tracking-widest text-radix-blue drop-shadow-glow-blue transition-colors duration-500">
        <div className="text-xl">Synthetic</div>
        <div className="text-xl">Ledger</div>
        <div className="text-xs text-text-muted mt-1 font-mono normal-case tracking-normal">
          Radix {activeNetwork}
        </div>
      </div>

      {/* Network Pulse */}
      <div className="mb-8 px-4 py-3 mx-2 rounded-lg bg-black/40 border border-white/5 shadow-inner">
         <div className="flex items-center gap-2 mb-2">
            <Radio size={12} className="text-radix-blue animate-pulse" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Network Pulse</span>
         </div>
         <div className="grid grid-cols-2 gap-2">
            <div>
               <div className="text-[9px] text-text-muted font-mono">EPOCH</div>
               <div className="font-mono text-sm text-white font-bold">{pulse.epoch || "---"}</div>
            </div>
            <div>
               <div className="text-[9px] text-text-muted font-mono">ROUND</div>
               <div className="font-mono text-sm text-white font-bold">{pulse.round || "---"}</div>
            </div>
         </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg font-mono text-sm tracking-wide transition-all",
                isActive
                  ? "bg-[#18182f] text-radix-blue border-l-2 border-radix-blue"
                  : "text-text-muted hover:text-white"
              )}
            >
              <Icon size={20} className={isActive ? "text-radix-blue" : ""} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Docs & Support */}
      <div className="space-y-4 mb-6 px-4 text-xs font-mono text-text-muted">
        <Link href="#" className="flex items-center gap-3 hover:text-white transition-colors">
          <Wallet size={16} /> {/* Placeholder for book/docs icon */}
          Docs
        </Link>
        <Link href="#" className="flex items-center gap-3 hover:text-white transition-colors">
          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">?</div>
          Support
        </Link>
      </div>

      {/* Connect Wallet */}
      {!isConnected ? (
        <button 
          onClick={openModal}
          className="w-full bg-radix-blue hover:opacity-80 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-glow-blue hover:shadow-[0_0_25px_rgba(var(--radix-blue-rgb),0.7)] text-sm"
        >
          <Wallet size={18} />
          CONNECT WALLET
        </button>
      ) : (
        <button 
          onClick={disconnect}
          className="w-full glass-heavy border border-radix-blue/30 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-between transition-all group hover:bg-white/5 shadow-glow-blue"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-radix-blue shadow-[0_0_8px_rgba(var(--radix-blue-rgb),1)]"></div>
            <span className="font-mono text-sm group-hover:hidden">{address}</span>
            <span className="font-mono text-sm hidden group-hover:block text-red-400">DISCONNECT</span>
          </div>
          <Wallet size={16} className="text-radix-blue" />
        </button>
      )}
    </aside>
  );
}
