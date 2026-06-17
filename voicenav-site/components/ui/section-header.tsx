"use client";

import { FadeUp } from "@/components/motion/fade-up";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`${align === "center" ? "text-center" : "text-left"} mb-16 ${className}`}
    >
      {badge && (
        <FadeUp>
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-accent-subtle text-accent border border-accent/20 mb-6 font-[family-name:var(--font-mono)]">
            {badge}
          </span>
        </FadeUp>
      )}
      <FadeUp delay={0.1}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight font-[family-name:var(--font-heading)]">
          {title}
        </h2>
      </FadeUp>
      {subtitle && (
        <FadeUp delay={0.2}>
          <p className="mt-5 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </FadeUp>
      )}
    </div>
  );
}
