"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNetwork } from "@/contexts/NetworkContext";
import React from "react";

export function NetworkTransitionWrapper({ children }: { children: React.ReactNode }) {
   const { activeNetwork } = useNetwork();
   
   return (
      <AnimatePresence mode="wait">
         <motion.div
           key={activeNetwork}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.15, ease: "easeOut" }}
           className="w-full h-full"
         >
            {children}
         </motion.div>
      </AnimatePresence>
   );
}
