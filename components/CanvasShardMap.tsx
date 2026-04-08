"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useNetwork, NetworkType } from "@/contexts/NetworkContext";

interface CanvasShardMapProps {
  activeTraceId: string | null;
  onShardsInvolved?: (count: number) => void;
  traceX?: MotionValue<number>;
  traceY?: MotionValue<number>;
}

export function CanvasShardMap({ activeTraceId, onShardsInvolved, traceX, traceY }: CanvasShardMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cbRef = useRef(onShardsInvolved);
  const { activeNetwork } = useNetwork();

  useEffect(() => {
    cbRef.current = onShardsInvolved;
  }, [onShardsInvolved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // huge optimization
    if (!ctx) return;

    let w = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    let h = canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    // Define Network Hex Colors
    const colors: Record<NetworkType, { rgbStr: string, hex: string }> = {
      Mainnet: { rgbStr: "0, 102, 255", hex: "#0066ff" },
      Testnet: { rgbStr: "168, 85, 247", hex: "#a855f7" },
      Stokenet: { rgbStr: "245, 158, 11", hex: "#f59e0b" },
    };
    const cRgb = colors[activeNetwork].rgbStr;
    const cHex = colors[activeNetwork].hex;

    // Create Offscreen Buffer for Background Grid
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = w;
    bgCanvas.height = h;
    const bgCtx = bgCanvas.getContext("2d");

    const hexRad = 18;
    const hexWidth = Math.sqrt(3) * hexRad;
    const hexHeight = 2 * hexRad;
    const xOffset = hexWidth;
    const yOffset = hexHeight * 0.75;

    interface Hex { x: number; y: number; bloom: number; }
    let hexes: Hex[] = [];
    
    function drawHexToCtx(context: CanvasRenderingContext2D, x: number, y: number, r: number, fillStyle: string, strokeStyle: string) {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) context.moveTo(hx, hy);
        else context.lineTo(hx, hy);
      }
      context.closePath();
      context.fillStyle = fillStyle;
      context.fill();
      context.strokeStyle = strokeStyle;
      context.stroke();
    }

    function initHexes() {
      hexes = [];
      const cols = Math.ceil(w / xOffset) + 1;
      const rows = Math.ceil(h / yOffset) + 1;
      
      if (bgCtx) {
         bgCtx.fillStyle = "#0c0d1c"; // Deep navy base
         bgCtx.fillRect(0, 0, w, h);
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * xOffset + (row % 2 === 1 ? hexWidth / 2 : 0);
          const y = row * yOffset;
          hexes.push({ x, y, bloom: 0 });
          
          // Draw standard inactive background hex ONLY ONCE to cache
          if (bgCtx) {
             drawHexToCtx(bgCtx, x, y, hexRad - 3, `rgba(255, 255, 255, 0.03)`, `rgba(255, 255, 255, 0.05)`);
          }
        }
      }
    }
    initHexes();

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
       const rect = canvas.getBoundingClientRect();
       // Normalize mapped coords adjusting for actual canvas element bounds!
       mouseX = e.clientX - rect.left;
       mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    let traceProgress = 0;
    
    // Pseudo-random deterministic coords tracking ID string
    const hash = activeTraceId ? activeTraceId.charCodeAt(activeTraceId.length - 1) : 0;
    const sx = 200; // start roughly near emission UI
    const sy = ((hash % 5) + 1) * 150;
    const ex = w - ((hash % 4) * 100 + 400); 
    const ey = h - ((hash % 5) * 150 + 100);

    const traceDuration = 75; // Balanced: Not a slow slug, but not a lightning flash
    let reportedShards = 0;
    let totalInvolvedThisRun = 0;

    function render() {
      if (!ctx || !canvas) return;
      
      // OPTIMIZATION: Draw cached static background matrix instantly
      ctx.drawImage(bgCanvas, 0, 0);

      if (activeTraceId) {
        if (traceProgress === 0) totalInvolvedThisRun = 0; // reset
        traceProgress += 1;
      } else {
        traceProgress = 0;
        reportedShards = 0;
        if (cbRef.current) cbRef.current(0);
      }
      
      const t = Math.min(traceProgress / traceDuration, 1);
      const lx = sx + (ex - sx) * t;
      const ly = sy + (ey - sy) * t;
      
      // OPTIMIZATION: Update framer-motion DOM chip directly if it exists
      if (activeTraceId && t > 0 && t <= 1) {
         if (traceX) traceX.set(lx);
         if (traceY) traceY.set(ly);
      } else {
         if (traceX) traceX.set(-1000); // hide it far away
         if (traceY) traceY.set(-1000);
      }

      // OPTIMIZATION: Process hexes and only draw the actively bloomed ones
      for (const hex of hexes) {
        // Trace line collision bloom
        if (activeTraceId && t > 0 && t < 1) {
           const dist = Math.hypot(hex.x - lx, hex.y - ly);
           if (dist < 80) { // Bloom collision radius
              if (hex.bloom === 0) totalInvolvedThisRun++;
              hex.bloom = Math.max(hex.bloom, 1.0); 
           }
        }
        
        // Native mouse hover calculation
        const distToMouse = Math.hypot(hex.x - mouseX, hex.y - mouseY);
        let lift = 0;
        let hoverGlow = 0;
        if (distToMouse < 80) {
           const intensity = (80 - distToMouse) / 80;
           lift = intensity * 12; // up to 12px physical lift
           hoverGlow = intensity * 0.8; // max 80% opacity glow white
        }
        
        if (hex.bloom > 0) hex.bloom -= 0.025; // matched decay rate
        if (hex.bloom < 0) hex.bloom = 0;
        
        // Combine states for drawing
        if (hex.bloom > 0.01 || hoverGlow > 0.01) {
          const dy = hex.y - lift;
          
          if (hoverGlow > 0.01 && hex.bloom < 0.2) {
             // Isolated hover state (bright edge, soft core)
             drawHexToCtx(ctx, hex.x, dy, hexRad - 3 + (lift * 0.1), `rgba(${cRgb}, ${hoverGlow * 0.4})`, `rgba(255, 255, 255, ${hoverGlow})`);
          } else if (hex.bloom > 0.01) {
             // Trace interaction state (radiant active network color)
             const blendedLift = hex.y - (lift || 0); // Maintain lift even during bloom if hovered
             drawHexToCtx(ctx, hex.x, blendedLift, hexRad - 3 + (lift * 0.1), `rgba(${cRgb}, ${hex.bloom * 0.9})`, `rgba(${cRgb}, ${hex.bloom})`);
          }
        }
      }
      
      // Ping up to UI
      if (activeTraceId && t <= 1 && totalInvolvedThisRun > reportedShards) {
         reportedShards = totalInvolvedThisRun;
         if (cbRef.current) cbRef.current(reportedShards);
      }

      if (activeTraceId && t > 0) {
         ctx.save();
         const steps = Math.floor(t * traceDuration);
         
         const drawBraidSegment = (phaseShift: number, color: string, width: number) => {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            
            for (let i = 0; i <= steps; i++) {
               const st = i / traceDuration;
               const bx = sx + (ex - sx) * st;
               const by = sy + (ey - sy) * st;
               
               const angle = Math.atan2(ey - sy, ex - sx);
               const perp = angle + Math.PI / 2;
               
               const envelope = Math.sin(st * Math.PI); 
               const frequency = 8;
               const amplitude = 35 * envelope; 
               const offset = Math.sin(st * Math.PI * frequency + phaseShift) * amplitude;
               
               const fx = bx + Math.cos(perp) * offset;
               const fy = by + Math.sin(perp) * offset;
               
               if (i === 0) ctx.moveTo(fx, fy);
               else ctx.lineTo(fx, fy);
            }
            ctx.stroke();
         };

         // Cerberus 3-Braid (shadow outer glow only on the braid itself)
         ctx.shadowColor = cHex;
         ctx.shadowBlur = 10;
         drawBraidSegment(0, `rgba(${cRgb}, 1)`, 3);
         drawBraidSegment((Math.PI * 2) / 3, `rgba(${cRgb}, 0.7)`, 2);
         drawBraidSegment((Math.PI * 4) / 3, "rgba(255, 255, 255, 0.9)", 1.5);
         
         // Glowing head
         ctx.beginPath();
         const hst = steps / traceDuration;
         ctx.arc(sx + (ex - sx) * hst, sy + (ey - sy) * hst, 6, 0, Math.PI * 2);
         ctx.fillStyle = "#fff";
         ctx.shadowColor = cHex;
         ctx.shadowBlur = 30;
         ctx.fill();

         ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    }

    render();

    const handleResize = () => {
       w = canvas.width = window.innerWidth;
       h = canvas.height = window.innerHeight;
       bgCanvas.width = w;
       bgCanvas.height = h;
       initHexes();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeTraceId, activeNetwork]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60" style={{ filter: `drop-shadow(0 0 20px rgba(var(--radix-blue-rgb), 0.2))` }} />;
}
