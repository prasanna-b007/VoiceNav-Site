"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { FadeUp } from "@/components/motion/fade-up";
import { Counter } from "@/components/motion/counter";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.HeroScene),
  { ssr: false }
);

function HeroFallback() {
  return (
    <div className="w-full aspect-square max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-accent-subtle via-bg-secondary to-accent-glow animate-pulse-glow" />
  );
}

const STATS = [
  { id: "accuracy", value: 97, prefix: "", suffix: "%+", label: "Intent Accuracy" },
  { id: "latency", value: 5, prefix: "<", suffix: "ms", label: "Semantic Routing" },
  { id: "cost", value: null, display: "₹0", label: "Inference Cost" },
  { id: "time", value: 10, prefix: "", suffix: " min", label: "Integration Time" },
] as const;

export function Hero() {
  return (
    <section id="hero" className="section-padding pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20">
      <div className="section-container">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="order-2 lg:order-1">
            <FadeUp>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold leading-[1.1] tracking-tight">
                Your application already knows what to do.{" "}
                <span className="block mt-2">
                  VoiceNav teaches it how to{" "}
                  <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                    listen
                  </span>
                  .
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="mt-7 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl">
                A semantic voice SDK that discovers application capabilities,
                understands intent using semantic matching, and executes actions
                in real time.
              </p>
            </FadeUp>

            {/* Stats Row — above the fold */}
            <FadeUp delay={0.25}>
              <div className="mt-8 mb-2 glass rounded-xl p-4 md:p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
                  {STATS.map((stat, i) => (
                    <div
                      key={stat.id}
                      className={`text-center ${
                        i < STATS.length - 1
                          ? "md:border-r md:border-border"
                          : ""
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
                        {stat.value !== null ? (
                          <Counter
                            target={stat.value}
                            prefix={stat.prefix ?? ""}
                            suffix={stat.suffix}
                            duration={2}
                          />
                        ) : (
                          stat.display
                        )}
                      </div>
                      <div className="mt-1 text-xs sm:text-sm text-text-muted font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.35}>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="#waitlist"
                  id="hero-cta-primary"
                  className="inline-flex items-center px-7 py-3.5 text-sm font-semibold text-white bg-accent rounded-full hover:bg-accent-hover transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-accent"
                >
                  Join Waitlist
                </a>
                <a
                  href="#docs"
                  id="hero-cta-secondary"
                  className="inline-flex items-center px-7 py-3.5 text-sm font-semibold text-text-primary border border-border-strong rounded-full hover:bg-bg-elevated transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                >
                  View Documentation
                </a>
              </div>
            </FadeUp>
          </div>

          {/* 3D Visual Column */}
          <div className="order-1 lg:order-2">
            <FadeUp delay={0.2} distance={20}>
              <Suspense fallback={<HeroFallback />}>
                <HeroScene />
              </Suspense>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
