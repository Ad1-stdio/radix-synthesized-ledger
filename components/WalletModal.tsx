"use client";

import { useWallet } from "@/contexts/WalletContext";
import { useNetwork } from "@/contexts/NetworkContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export function WalletModal() {
  const { isModalOpen, closeModal, simulateConnection } = useWallet();
  const { activeNetwork } = useNetwork();
  
  const [qrBlocks, setQrBlocks] = useState<number[]>([]);
  const [connectStep, setConnectStep] = useState<number>(0); // 0=Wait, 1=Handshake, 2=Sync, 3=Complete

  useEffect(() => {
    if (isModalOpen) {
      setConnectStep(0);
      setQrBlocks(Array.from({ length: 64 }).map(() => Math.random()));
      const interval = setInterval(() => {
         if (connectStep === 0) {
            setQrBlocks(Array.from({ length: 64 }).map(() => Math.random()));
         }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isModalOpen, connectStep]);

  const handleSimulate = async () => {
     setConnectStep(1);
     
     // Lock the QR code
     setQrBlocks(Array.from({ length: 64 }).map((_, i) => i % 3 === 0 || i % 7 === 0 ? 1 : 0.1));
     
     // 1. Handshake Simulation
     await new Promise(r => setTimeout(r, 1200));
     setConnectStep(2);
     
     // 2. Ledger Sync Simulation
     await new Promise(r => setTimeout(r, 1500));
     setConnectStep(3);
     
     // 3. Finalize
     await new Promise(r => setTimeout(r, 600));
     simulateConnection();
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-navy/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-heavy w-full max-w-sm rounded-2xl overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(var(--radix-blue-rgb),0.5)] border border-radix-blue/30"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className={`flex justify-between items-center p-6 border-b transition-colors ${connectStep > 0 ? "bg-radix-blue/10 border-radix-blue/30" : "border-white/10"}`}>
              <h2 className="text-lg font-bold font-sans text-white uppercase tracking-wider">
                 Connect to {activeNetwork}
              </h2>
              <button 
                onClick={closeModal} 
                disabled={connectStep > 0 && connectStep < 3}
                className="text-text-muted hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col items-center">
              <div className="text-xs font-mono text-text-muted mb-8 text-center uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={14} className="text-radix-blue" />
                {connectStep === 0 && "Scan with Mobile Wallet"}
                {connectStep === 1 && "Establishing Deep Link Payload"}
                {connectStep === 2 && "Synchronizing Persona Vaults"}
                {connectStep === 3 && "Verification Complete"}
              </div>

              {/* QR Code Container */}
              <div className={`w-56 h-56 p-3 rounded-xl mb-8 relative group overflow-hidden transition-all duration-700
                 ${connectStep > 0 ? "bg-radix-blue/20 shadow-[0_0_30px_rgba(var(--radix-blue-rgb),0.8)] border border-radix-blue" : "bg-white shadow-glow-blue border border-white/20"}
              `}>
                <div className="absolute inset-0 bg-radix-blue/10 mix-blend-multiply opacity-50 z-10 pointer-events-none"></div>
                
                <div className="w-full h-full grid grid-cols-8 gap-0.5 relative z-0">
                  {qrBlocks.map((val, i) => (
                    <motion.div 
                      key={i}
                      className={`rounded-[1px] transition-colors ${connectStep > 0 ? 'bg-radix-blue' : 'bg-[#08081a]'}`}
                      animate={{ opacity: val > 0.4 ? 1 : 0.08 }}
                      transition={{ duration: connectStep > 0 ? 0.2 : 0.5 }}
                    />
                  ))}
                </div>

                {/* Scanner / Success Beams */}
                <AnimatePresence>
                   {connectStep === 0 && (
                      <motion.div 
                        key="scanner"
                        className="absolute left-0 w-full h-[2px] bg-radix-blue shadow-[0_0_15px_rgba(var(--radix-blue-rgb),1)] z-20"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        exit={{ opacity: 0 }}
                      />
                   )}
                   {connectStep === 3 && (
                      <motion.div 
                        key="success"
                        className="absolute inset-0 flex items-center justify-center bg-[#08081a]/80 backdrop-blur-sm z-30"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      >
                         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                            <CheckCircle2 size={64} className="text-radix-blue drop-shadow-glow-blue" />
                         </motion.div>
                      </motion.div>
                   )}
                </AnimatePresence>
              </div>

              {/* Action */}
              <button 
                onClick={handleSimulate}
                disabled={connectStep > 0}
                className="w-full bg-radix-blue text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-glow-blue hover:shadow-[0_0_25px_rgba(var(--radix-blue-rgb),0.7)] text-sm uppercase tracking-wider disabled:opacity-50 disabled:grayscale"
              >
                {connectStep > 0 ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <LinkIcon size={18} />
                  </motion.div>
                ) : (
                  "Simulate Connection"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
