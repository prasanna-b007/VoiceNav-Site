"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useRef, useEffect } from "react";

interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function Counter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0, margin: "0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString()
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      });
      return controls.stop;
    }
  }, [isInView, target, duration, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
