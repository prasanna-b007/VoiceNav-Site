"use client";

import { FadeUp } from "@/components/motion/fade-up";

export function CTA() {
  return (
    <section
      id="cta-section"
      className="section-padding py-24 md:py-32 bg-bg-secondary relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-16 left-[10%] w-3 h-3 rounded-full bg-accent/20 animate-float" />
      <div
        className="absolute bottom-20 right-[12%] w-2 h-2 rounded-full bg-accent/30 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-[5%] w-1.5 h-1.5 rounded-full bg-accent/15 animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="section-container relative z-10">
        <FadeUp>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-text-primary text-center max-w-3xl mx-auto leading-tight">
            Give your application a voice.
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-6 text-xl text-text-secondary text-center max-w-xl mx-auto">
            Deploy VoiceNav in minutes. Scale to millions of commands.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#pricing"
              id="cta-start-free"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-accent rounded-full hover:bg-accent-hover transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-accent"
            >
              Start Free
            </a>
            <a
              href="#"
              id="cta-book-demo"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-text-primary border border-border-strong rounded-full hover:bg-bg-elevated transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Book Demo
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
