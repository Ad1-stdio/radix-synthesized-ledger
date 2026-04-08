"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function BackgroundEnvironment() {
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for the different blobs
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const yParallax3 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Radix Blue Blob */}
      <motion.div 
        animate={{ 
          x: [0, 30, -20, 0], 
          scale: [1, 1.1, 0.9, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full"
        style={{
          y: yParallax1,
          background: "radial-gradient(circle, #0066ff 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.15
        }}
      />

      {/* Indigo Blob */}
      <motion.div 
        animate={{ 
          x: [0, -40, 20, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[10%] w-[900px] h-[900px] rounded-full"
        style={{
          y: yParallax2,
          background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.15
        }}
      />

      {/* Staking Green Blob */}
      <motion.div 
        animate={{ 
          x: [0, 50, -30, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[40%] w-[600px] h-[600px] rounded-full"
        style={{
          y: yParallax3,
          background: "radial-gradient(circle, #3cd5af 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.15
        }}
      />
    </div>
  );
}
