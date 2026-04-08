"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingShards() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const shards = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 30 + 20,
    delay: Math.random() * 10,
    rotate: Math.random() * 360,
    opacity: Math.random() * 0.05 + 0.02
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {shards.map((shard) => (
        <motion.div
          key={shard.id}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -100, 50, 0],
            x: [0, 50, -50, 0],
            rotate: [shard.rotate, shard.rotate + 180, shard.rotate + 360],
            opacity: [shard.opacity, shard.opacity * 1.5, shard.opacity]
          }}
          transition={{
            duration: shard.duration,
            repeat: Infinity,
            delay: shard.delay,
            ease: "linear"
          }}
          className="absolute border border-white/20"
          style={{
            width: shard.size,
            height: shard.size,
            left: shard.left,
            top: shard.top,
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
            clipPath: ["polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", "polygon(50% 0%, 0% 100%, 100% 100%)"][shard.id % 3]
          }}
        />
      ))}
    </div>
  );
}
