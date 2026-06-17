"use client";

import { X, Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { FadeUp } from "@/components/motion/fade-up";

const V1_FEATURES = [
  "Fuse.js keyword matching",
  "String similarity only",
  "No confidence scoring",
  "Limited to exact patterns",
  "Manual action mapping",
];

const V2_FEATURES = [
  "Model2Vec semantic embeddings",
  "Contextual intent understanding",
  "Three-tier confidence layer",
  "Automatic action discovery",
  "Zero-config integration",
];

export function Comparison() {
  return (
    <section id="comparison" className="section-padding bg-bg-secondary">
      <div className="section-container">
        <SectionHeader
          badge="Evolution"
          title="From keywords to semantics"
          subtitle="See how VoiceNav v2 fundamentally changes how applications understand voice commands."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* V1 Panel */}
          <FadeUp delay={0}>
            <div className="bg-bg-secondary border border-border rounded-xl p-6 h-full opacity-80">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary">
                  VoiceNav v1
                </h3>
                <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-text-muted bg-border px-2 py-0.5 rounded-full">
                  Legacy
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {V1_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-text-muted">
                    <X size={16} className="text-text-muted/50 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* V1 Example */}
              <div className="border-t border-border pt-5">
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-3">
                  Example Match
                </p>
                <div className="bg-bg/50 rounded-lg p-3 font-[family-name:var(--font-mono)] text-xs">
                  <p className="text-text-muted mb-2">&gt; schedule maintenance work tomorrow</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-text-secondary">schedule_task</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-text-muted/40" style={{ width: "45%" }} />
                    </div>
                    <span className="text-text-muted">0.45</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* V2 Panel */}
          <FadeUp delay={0.15}>
            <div className="card-accent p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary">
                  VoiceNav v2
                </h3>
                <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-white bg-accent px-2 py-0.5 rounded-full">
                  Current
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {V2_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-text-primary">
                    <Check size={16} className="text-[var(--color-execute)] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* V2 Example */}
              <div className="border-t border-accent/20 pt-5">
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-3">
                  Example Match
                </p>
                <div className="bg-bg-elevated rounded-lg p-3 font-[family-name:var(--font-mono)] text-xs">
                  <p className="text-text-muted mb-2">&gt; schedule maintenance work tomorrow</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-text-primary font-medium">create_employee_task</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--color-execute)]" style={{ width: "84%" }} />
                    </div>
                    <span className="text-[var(--color-execute)] font-semibold">0.84</span>
                    <span className="badge-execute text-[9px] font-bold px-2 py-0.5 rounded-full">
                      EXECUTE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
