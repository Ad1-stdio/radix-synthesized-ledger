"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export function Odometer({ value, format = "standard", suffix = "" }: { value: number, format?: "standard" | "compact", suffix?: string }) {
  const springValue = useSpring(value, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const display = useTransform(springValue, (current) => {
    if (format === "compact") {
      return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(current) + suffix;
    }
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(current) + suffix;
  });

  return <motion.span>{display}</motion.span>;
}

export function OdometerCurrency({ value }: { value: number }) {
  const springValue = useSpring(value, { stiffness: 45, damping: 25 });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const display = useTransform(springValue, (current) => {
    return Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(current);
  });

  return <motion.span>{display}</motion.span>;
}
