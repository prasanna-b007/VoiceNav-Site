"use client";

import { motion } from "motion/react";
import { Mic, AudioWaveform, GitBranch, Shield, Brain, Play, ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren, staggerItem } from "@/components/motion/stagger-children";

const LAYERS = [
  {
    icon: Mic,
    title: "Voice Input",
    description: "Browser Speech Recognition API captures natural language input",
    highlight: false,
  },
  {
    icon: AudioWaveform,
    title: "Speech Recognition",
    description: "Real-time speech-to-text conversion with noise filtering",
    highlight: false,
  },
  {
    icon: GitBranch,
    title: "Semantic Router",
    description: "Model2Vec transforms text into semantic vectors for matching",
    highlight: false,
  },
  {
    icon: Shield,
    title: "Confidence Layer",
    description: "Three-tier scoring system filters and validates matches",
    highlight: true,
  },
  {
    icon: Brain,
    title: "GGUF Reasoner",
    description: "Local LLM handles ambiguous commands requiring context",
    highlight: false,
  },
  {
    icon: Play,
    title: "Execution Engine",
    description: "Validated actions execute within your application",
    highlight: false,
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="section-padding bg-bg-secondary">
      <div className="section-container">
        <SectionHeader
          badge="Architecture"
          title="Engineered for real-time performance"
          subtitle="Every layer is optimized for speed, accuracy, and reliability."
        />

        <StaggerChildren className="max-w-xl mx-auto">
          {LAYERS.map((layer, i) => (
            <div key={layer.title}>
              <motion.div
                variants={staggerItem}
                className={`flex items-center gap-4 p-5 rounded-xl transition-all duration-200 ${
                  layer.highlight
                    ? "card-accent"
                    : "card-premium"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    layer.highlight
                      ? "bg-accent text-white"
                      : "bg-accent-subtle text-accent"
                  }`}
                >
                  <layer.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm">
                    {layer.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {layer.description}
                  </p>
                </div>
              </motion.div>

              {i < LAYERS.length - 1 && (
                <motion.div
                  variants={staggerItem}
                  className="flex justify-center my-2"
                >
                  <ChevronDown size={18} className="text-accent/30" />
                </motion.div>
              )}
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
