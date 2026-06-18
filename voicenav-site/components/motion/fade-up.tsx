"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
}: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0, margin: "0px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
