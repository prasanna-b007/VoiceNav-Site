"use client";

import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren, staggerItem } from "@/components/motion/stagger-children";
import { FadeUp } from "@/components/motion/fade-up";

const TIERS = [
  {
    threshold: "≥ 0.75",
    label: "EXECUTE",
    title: "Direct Execution",
    description:
      "High-confidence matches execute immediately. The semantic similarity is strong enough to act without hesitation.",
    example: "navigate_to_dashboard → 0.89",
    barWidth: 89,
    color: "execute" as const,
  },
  {
    threshold: "0.50 – 0.74",
    label: "REASON",
    title: "Contextual Reasoning",
    description:
      "Ambiguous commands are sent to the GGUF Reasoner for contextual analysis before execution.",
    example: "assign_work_order → 0.63",
    barWidth: 63,
    color: "reason" as const,
  },
  {
    threshold: "< 0.50",
    label: "REJECT",
    title: "Safe Rejection",
    description:
      "Low-confidence matches are safely rejected. No wrong actions, no unintended side effects.",
    example: "unknown_action → 0.31",
    barWidth: 31,
    color: "reject" as const,
  },
];

const COLOR_MAP = {
  execute: {
    bar: "bg-[var(--color-execute)]",
    text: "text-[var(--color-execute)]",
    badge: "badge-execute",
    accent: "bg-[var(--color-execute)]",
  },
  reason: {
    bar: "bg-[var(--color-reason)]",
    text: "text-[var(--color-reason)]",
    badge: "badge-reason",
    accent: "bg-[var(--color-reason)]",
  },
  reject: {
    bar: "bg-[var(--color-reject)]",
    text: "text-[var(--color-reject)]",
    badge: "badge-reject",
    accent: "bg-[var(--color-reject)]",
  },
};

export function ConfidenceLayer() {
  return (
    <section id="confidence" className="section-padding">
      <div className="section-container">
        <SectionHeader
          badge="Confidence Layer"
          title="Every match is scored. Every action is validated."
          subtitle="The three-tier confidence system ensures your application never executes the wrong action."
        />

        {/* Tier Cards */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TIERS.map((tier) => {
            const colors = COLOR_MAP[tier.color];
            return (
              <motion.div
                key={tier.label}
                variants={staggerItem}
                className="card-premium overflow-hidden"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${colors.accent}`} />

                <div className="p-6">
                  {/* Threshold */}
                  <p className={`font-[family-name:var(--font-mono)] text-2xl font-bold ${colors.text} mb-3`}>
                    {tier.threshold}
                  </p>

                  {/* Badge */}
                  <span className={`${colors.badge} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
                    {tier.label}
                  </span>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mt-4 mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">
                    {tier.description}
                  </p>

                  {/* Example */}
                  <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mb-2">
                    {tier.example}
                  </p>

                  {/* Progress bar */}
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${colors.bar}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tier.barWidth}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </StaggerChildren>

        {/* Confidence Scale */}
        <FadeUp delay={0.3}>
          <div className="max-w-2xl mx-auto mt-14">
            <div className="flex rounded-full h-3 overflow-hidden">
              <div className="bg-[var(--color-reject)] flex-[50]" />
              <div className="bg-[var(--color-reason)] flex-[25]" />
              <div className="bg-[var(--color-execute)] flex-[25]" />
            </div>
            <div className="flex justify-between mt-2.5 text-xs font-[family-name:var(--font-mono)] text-text-muted">
              <span>0.0</span>
              <span className="text-[var(--color-reject)]">REJECT</span>
              <span>0.50</span>
              <span className="text-[var(--color-reason)]">REASON</span>
              <span>0.75</span>
              <span className="text-[var(--color-execute)]">EXECUTE</span>
              <span>1.0</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
