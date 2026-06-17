"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import { FadeUp } from "@/components/motion/fade-up";
import { Terminal, Sparkles } from "lucide-react";

type Tier = "execute" | "reason" | "reject";

interface MatchResult {
  action: string;
  score: number;
  tier: Tier;
}

const COMMANDS: Record<string, MatchResult[]> = {
  "schedule maintenance work tomorrow": [
    { action: "create_employee_task", score: 0.84, tier: "execute" },
    { action: "assign_work_order", score: 0.73, tier: "reason" },
    { action: "generate_inspection", score: 0.65, tier: "reject" },
  ],
  "show pending invoices": [
    { action: "view_invoice_list", score: 0.91, tier: "execute" },
    { action: "get_payment_status", score: 0.68, tier: "reason" },
    { action: "generate_financial_report", score: 0.52, tier: "reject" },
  ],
  "navigate to employee dashboard": [
    { action: "open_employee_portal", score: 0.89, tier: "execute" },
    { action: "view_team_overview", score: 0.71, tier: "reason" },
    { action: "load_hr_module", score: 0.58, tier: "reject" },
  ],
  "generate monthly report": [
    { action: "create_monthly_summary", score: 0.87, tier: "execute" },
    { action: "export_analytics_data", score: 0.76, tier: "execute" },
    { action: "schedule_report_delivery", score: 0.61, tier: "reason" },
  ],
};

const EXAMPLE_COMMANDS = Object.keys(COMMANDS);

const TIER_STYLES: Record<Tier, { bar: string; badge: string; label: string }> = {
  execute: { bar: "bg-[var(--color-execute)]", badge: "badge-execute", label: "EXECUTE" },
  reason: { bar: "bg-[var(--color-reason)]", badge: "badge-reason", label: "REASON" },
  reject: { bar: "bg-[var(--color-reject)]", badge: "badge-reject", label: "REJECT" },
};

export function SemanticPlayground() {
  const [input, setInput] = useState(EXAMPLE_COMMANDS[0]);
  const [results, setResults] = useState<MatchResult[]>(COMMANDS[EXAMPLE_COMMANDS[0]]);
  const [animKey, setAnimKey] = useState(0);

  const runMatch = useCallback((command: string) => {
    setInput(command);
    const lc = command.toLowerCase().trim();
    const matched = COMMANDS[lc] ?? COMMANDS[EXAMPLE_COMMANDS[0]];
    setResults(matched);
    setAnimKey((k) => k + 1);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") runMatch(input);
  };

  return (
    <section id="product" className="section-padding bg-bg-secondary">
      <div className="section-container">
        <SectionHeader
          badge="Live Demo"
          title="Semantic Playground"
          subtitle="See how VoiceNav understands natural language and maps it to application actions in real time."
        />

        <FadeUp>
          <div className="max-w-3xl mx-auto bg-bg-elevated border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-bg-secondary/50">
              <Terminal size={14} className="text-text-muted" />
              <span className="text-xs font-[family-name:var(--font-mono)] text-text-muted">
                voicenav-playground
              </span>
              <Sparkles size={12} className="text-accent ml-auto" />
            </div>

            {/* Input Area */}
            <div className="p-5">
              <input
                id="playground-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Try a voice command..."
                className="w-full bg-text-primary text-white font-[family-name:var(--font-mono)] text-sm px-5 py-4 rounded-lg border-none outline-none placeholder:text-white/30 focus:ring-2 focus:ring-accent/30"
              />

              {/* Example Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {EXAMPLE_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    id={`pill-${cmd.split(" ")[0]}`}
                    onClick={() => runMatch(cmd)}
                    className={`text-xs font-[family-name:var(--font-mono)] px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                      input === cmd
                        ? "bg-accent-subtle text-accent border border-accent/20"
                        : "bg-bg-secondary text-text-muted hover:bg-accent-subtle hover:text-accent border border-transparent"
                    }`}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Top Matches
                </span>
                <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-muted">
                  scored by semantic similarity
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={animKey}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                  }}
                  className="space-y-2.5"
                >
                  {results.map((result, i) => {
                    const style = TIER_STYLES[result.tier];
                    return (
                      <motion.div
                        key={`${result.action}-${animKey}`}
                        variants={{
                          hidden: { opacity: 0, x: -16 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] } },
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                          i === 0 ? "border-border-strong bg-bg-elevated" : "border-border bg-bg/50"
                        }`}
                      >
                        {/* Action name */}
                        <span className="font-[family-name:var(--font-mono)] text-sm text-text-primary font-medium flex-shrink-0">
                          {result.action}
                        </span>

                        {/* Confidence bar */}
                        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden mx-2">
                          <motion.div
                            className={`h-full rounded-full ${style.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                          />
                        </div>

                        {/* Score */}
                        <span className="font-[family-name:var(--font-mono)] text-sm text-text-secondary font-semibold w-10 text-right">
                          {result.score.toFixed(2)}
                        </span>

                        {/* Badge */}
                        <span
                          className={`${style.badge} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0`}
                        >
                          {style.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
