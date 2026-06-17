"use client";

import { motion } from "motion/react";
import {
  Rocket,
  Code2,
  LayoutDashboard,
  Database,
  FileCode,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import {
  StaggerChildren,
  staggerItem,
} from "@/components/motion/stagger-children";
import type { LucideIcon } from "lucide-react";

interface DocCard {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
}

const docs: DocCard[] = [
  {
    icon: Rocket,
    title: "Getting Started",
    description:
      "Install VoiceNav and run your first voice command in under 10 minutes.",
    tag: "Quickstart",
  },
  {
    icon: Code2,
    title: "React Integration",
    description:
      "Hooks, providers, and components for seamless React integration.",
    tag: "Framework",
  },
  {
    icon: LayoutDashboard,
    title: "Next.js Integration",
    description:
      "App Router support, server components, and SSR compatibility.",
    tag: "Framework",
  },
  {
    icon: Database,
    title: "Action Registry",
    description:
      "Define, discover, and manage semantic actions across your application.",
    tag: "Core",
  },
  {
    icon: FileCode,
    title: "API Reference",
    description:
      "Complete API documentation with TypeScript types and examples.",
    tag: "Reference",
  },
];

export function DocsPreview() {
  return (
    <section id="docs" className="section-padding">
      <div className="section-container">
        <SectionHeader
          badge="Documentation"
          title="Everything you need to integrate"
          subtitle="Comprehensive guides for every framework and use case."
        />

        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          staggerDelay={0.08}
        >
          {docs.map((doc) => (
            <motion.div
              key={doc.title}
              variants={staggerItem}
              className="card-premium p-6 relative group cursor-pointer"
              id={`doc-card-${doc.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {/* Tag pill */}
              <span className="absolute top-4 right-4 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full">
                {doc.tag}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-4">
                <doc.icon className="w-5 h-5 text-accent" strokeWidth={1.8} />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg mb-2 text-text-primary">
                {doc.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {doc.description}
              </p>

              {/* Hover arrow */}
              <div className="flex items-center gap-1.5 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </StaggerChildren>

        {/* Coming soon notice */}
        <p className="text-center text-sm text-text-muted mt-8 flex items-center justify-center gap-2">
          <BookOpen className="w-4 h-4" />
          Full documentation coming soon
        </p>
      </div>
    </section>
  );
}
