"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef, MouseEvent } from "react";

export function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });
  
  // Spotlight effect coordinates
  const spotX = useMotionValue(-1000); // Start off-screen
  const spotY = useMotionValue(-1000);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    // Tilt percentages from central axis (-1 to 1)
    const xPct = (mouseXPos / width - 0.5) * 2;
    const yPct = (mouseYPos / height - 0.5) * 2;
    
    x.set(xPct * 4); // 4 degree max tilt
    y.set(yPct * -4);

    // Spotlight follows cursor
    spotX.set(mouseXPos);
    spotY.set(mouseYPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    spotX.set(-1000);
    spotY.set(-1000);
  }

  const spotlightBackground = useMotionTemplate`radial-gradient(350px circle at ${spotX}px ${spotY}px, rgba(255,255,255,0.06), transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      style={{
        rotateX: mouseY,
        rotateY: mouseX,
        transformStyle: "preserve-3d"
      }}
      className={`relative ${className}`}
    >
      <motion.div 
        className="pointer-events-none absolute inset-0 z-50 rounded-xl"
        style={{ background: spotlightBackground }}
      />
      {children}
    </motion.div>
  );
}
