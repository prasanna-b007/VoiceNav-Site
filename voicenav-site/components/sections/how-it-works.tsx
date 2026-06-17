"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { FadeUp } from "@/components/motion/fade-up";
import { ChevronRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Discover your application",
    description:
      "One command scans your application, discovers routes, actions, and capabilities. VoiceNav builds a semantic registry automatically.",
    content: (
      <div className="code-block mt-4 text-[13px]">
        <span className="code-comment">$ npx @voicenav/cli init</span>
        <br /><br />
        <span className="code-string">✓</span> Scanning application routes...
        <br />
        <span className="code-string">✓</span> Found 24 navigable routes
        <br />
        <span className="code-string">✓</span> Found 18 executable actions
        <br />
        <span className="code-string">✓</span> Generated semantic registry
        <br />
        <span className="code-string">✓</span> VoiceNav initialized successfully
      </div>
    ),
  },
  {
    num: "02",
    title: "Understand user intent",
    description:
      "Model2Vec transforms voice commands into semantic vectors. The Confidence Layer scores every match, ensuring only high-confidence actions execute.",
    content: (
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {["Voice Command", "Semantic Vector", "Confidence Score", "Decision"].map(
          (item, i, arr) => (
            <div key={item} className="flex items-center gap-2">
              <span className="bg-bg-elevated border border-border rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-text-primary whitespace-nowrap">
                {item}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight size={14} className="text-accent/50 flex-shrink-0" />
              )}
            </div>
          )
        )}
      </div>
    ),
  },
  {
    num: "03",
    title: "Execute with confidence",
    description:
      "High-confidence matches execute immediately. Ambiguous commands get routed through the GGUF Reasoner. Low-confidence commands are safely rejected.",
    content: (
      <div className="mt-4 flex flex-wrap gap-2.5">
        <span className="badge-execute text-xs font-[family-name:var(--font-mono)] font-medium px-3 py-1.5 rounded-lg">
          navigate(&quot;/dashboard&quot;)
        </span>
        <span className="badge-reason text-xs font-[family-name:var(--font-mono)] font-medium px-3 py-1.5 rounded-lg">
          reasoner.clarify(intent)
        </span>
        <span className="badge-reject text-xs font-[family-name:var(--font-mono)] font-medium px-3 py-1.5 rounded-lg">
          reject(&quot;low confidence&quot;)
        </span>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="section-container">
        <SectionHeader
          badge="How It Works"
          title="Three steps to voice-enabled applications"
          subtitle="From installation to production in minutes, not months."
        />

        <div className="max-w-3xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-5 md:left-6 top-12 bottom-12 w-[2px] bg-border" />

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.15}>
                <div className="flex gap-5 md:gap-8 relative">
                  {/* Step Circle */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 z-10 shadow-sm">
                    {step.num}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <h3 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                      {step.description}
                    </p>
                    {step.content}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
