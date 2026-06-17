"use client";

import { motion } from "motion/react";
import { Target, Zap, IndianRupee } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren, staggerItem } from "@/components/motion/stagger-children";

const FEATURES = [
  {
    icon: Target,
    title: "97%+ Intent Accuracy",
    description:
      "Model2Vec semantic embeddings understand meaning, not just keywords. VoiceNav matches user intent to application actions with near-perfect accuracy across domains.",
  },
  {
    icon: Zap,
    title: "Sub-5ms Matching",
    description:
      "Semantic routing happens in under 5 milliseconds. No cloud roundtrips, no API latency. Your application responds before the user finishes speaking.",
  },
  {
    icon: IndianRupee,
    title: "₹0 Inference Cost",
    description:
      "All semantic matching runs locally using Model2Vec embeddings. No per-request charges, no token costs, no usage limits. Scale freely.",
  },
];

export function WhyVoiceNav() {
  return (
    <section id="why" className="section-padding">
      <div className="section-container">
        <SectionHeader
          badge="Why VoiceNav"
          title="Built for production. Designed for developers."
          subtitle="Three pillars that make VoiceNav the most practical voice SDK for real applications."
        />

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="card-premium p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center mb-5">
                <feature.icon size={22} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-3 text-text-primary">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
