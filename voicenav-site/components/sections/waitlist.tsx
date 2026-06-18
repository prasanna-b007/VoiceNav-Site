"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeUp } from "@/components/motion/fade-up";
import {
  Mail,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Bell,
  Shield,
  Zap,
  User,
  Phone,
} from "lucide-react";

type WaitlistState = "idle" | "submitting" | "success" | "error";

/* ───── Celebration particles ───── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  angle: number;
  dist: number;
}

function generateParticles(count: number): Particle[] {
  const colors = [
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#818cf8",
    "#a78bfa",
    "#6ee7b7",
    "#34d399",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 10,
    y: 50 + (Math.random() - 0.5) * 10,
    size: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.3,
    duration: Math.random() * 0.8 + 0.8,
    angle: (360 / count) * i + (Math.random() - 0.5) * 30,
    dist: 80 + Math.random() * 60,
  }));
}

function CelebrationParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Wrap in setTimeout to avoid triggering synchronous cascading renders
    const timer = setTimeout(() => {
      setParticles(generateParticles(24));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.6],
              x: tx,
              y: ty,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

/* ───── Animated checkmark ───── */
function SuccessCheckmark() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.4] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-20 h-20 rounded-full border-2 border-accent/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* Main circle */}
      <motion.div
        className="relative w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.35)",
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.15,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.3, ease: "easeOut" }}
        >
          <Check size={28} strokeWidth={3} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Pulsing ring */}
      <motion.div
        className="absolute w-16 h-16 rounded-full border-2 border-accent"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

/* ───── Trust indicators ───── */
const TRUST_ITEMS = [
  { icon: Shield, text: "No spam, ever" },
  { icon: Bell, text: "Early access priority" },
  { icon: Zap, text: "First to know" },
];

/* ───── Waitlist Component ───── */
interface WaitlistProps {
  source?: string;
}

export function Waitlist({ source = "landing-page" }: WaitlistProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState<WaitlistState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const clearError = useCallback(() => {
    if (state === "error") setState("idle");
  }, [state]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !mobile.trim()) return;

      setState("submitting");
      setErrorMessage("");

      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            mobile: mobile.trim(),
            source,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setState("success");
          setName("");
          setEmail("");
          setMobile("");
        } else {
          setState("error");
          setErrorMessage(
            data.message || "Something went wrong. Please try again."
          );
        }
      } catch {
        setState("error");
        setErrorMessage(
          "Network error. Please check your connection and try again."
        );
      }
    },
    [name, email, mobile, source]
  );

  const isSubmitting = state === "submitting";
  const canSubmit = name.trim() && email.trim() && mobile.trim() && !isSubmitting;

  return (
    <section id="waitlist" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-accent-subtle via-transparent to-accent-glow opacity-40 blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-subtle opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-glow opacity-15 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-subtle border border-accent/10 mb-6">
              <Sparkles size={14} className="text-accent" />
              <span className="text-xs font-semibold tracking-widest uppercase text-accent">
                Early Access
              </span>
            </div>
          </FadeUp>

          {/* Heading */}
          <FadeUp delay={0.1}>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Join the{" "}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                VoiceNav
              </span>{" "}
              Waitlist
            </h2>
          </FadeUp>

          {/* Description */}
          <FadeUp delay={0.2}>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-lg mx-auto">
              Get early access to the semantic voice SDK before public launch.
            </p>
          </FadeUp>

          {/* Form Card */}
          <FadeUp delay={0.3}>
            <div className="mt-10 relative group">
              {/* Gradient border wrapper */}
              <div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.2), transparent 40%, transparent 60%, rgba(37,99,235,0.15))",
                }}
              />

              <div
                className="relative glass rounded-2xl p-8 md:p-10"
                style={{ overflow: "hidden" }}
              >
                {/* Bottom subtle glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                  {state === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="py-8 relative"
                    >
                      {/* Celebration particles */}
                      <CelebrationParticles />

                      <div className="flex flex-col items-center gap-6 relative z-10">
                        {/* Animated checkmark */}
                        <SuccessCheckmark />

                        {/* Text content with staggered reveal */}
                        <div className="space-y-3">
                          <motion.h3
                            className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-text-primary"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.5,
                              duration: 0.5,
                              ease: [0.25, 0.4, 0.25, 1],
                            }}
                          >
                            You&apos;re on the list!
                          </motion.h3>

                          <motion.p
                            className="text-base text-text-secondary max-w-sm mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.65,
                              duration: 0.5,
                              ease: [0.25, 0.4, 0.25, 1],
                            }}
                          >
                            We&apos;ll notify you when VoiceNav launches.
                          </motion.p>
                        </div>

                        {/* What to expect card */}
                        <motion.div
                          className="w-full max-w-sm mt-2"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                        >
                          <div className="rounded-xl bg-accent-subtle/50 border border-accent/8 p-5 space-y-3">
                            <p className="text-xs font-semibold tracking-widest uppercase text-accent">
                              What&apos;s next
                            </p>
                            <div className="space-y-2.5">
                              {[
                                "You'll receive a confirmation email shortly",
                                "We'll notify you before public launch",
                                "Early users get founding member perks",
                              ].map((item, i) => (
                                <motion.div
                                  key={i}
                                  className="flex items-start gap-2.5"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: 0.9 + i * 0.1,
                                    duration: 0.4,
                                  }}
                                >
                                  <div className="mt-0.5 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                    <Check
                                      size={12}
                                      strokeWidth={2.5}
                                      className="text-accent"
                                    />
                                  </div>
                                  <span className="text-sm text-text-secondary text-left">
                                    {item}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Submit another */}
                        <motion.button
                          type="button"
                          onClick={() => setState("idle")}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-accent transition-colors duration-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <Mail size={14} />
                          Submit another entry
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Fields grid — 2 cols on desktop, stacked on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Full Name */}
                          <div
                            className={`relative transition-all duration-300 ${
                              focusedField === "name"
                                ? "shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                                : ""
                            } rounded-xl`}
                          >
                            <User
                              size={18}
                              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                                focusedField === "name"
                                  ? "text-accent"
                                  : "text-text-muted"
                              }`}
                            />
                            <input
                              id="waitlist-name"
                              type="text"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                clearError();
                              }}
                              onFocus={() => setFocusedField("name")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Full Name"
                              required
                              minLength={2}
                              maxLength={100}
                              disabled={isSubmitting}
                              className="w-full pl-11 pr-4 py-3.5 text-sm bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                              aria-label="Full name"
                            />
                          </div>

                          {/* Mobile Number */}
                          <div
                            className={`relative transition-all duration-300 ${
                              focusedField === "mobile"
                                ? "shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                                : ""
                            } rounded-xl`}
                          >
                            <Phone
                              size={18}
                              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                                focusedField === "mobile"
                                  ? "text-accent"
                                  : "text-text-muted"
                              }`}
                            />
                            <input
                              id="waitlist-mobile"
                              type="tel"
                              value={mobile}
                              onChange={(e) => {
                                setMobile(e.target.value);
                                clearError();
                              }}
                              onFocus={() => setFocusedField("mobile")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Mobile Number"
                              required
                              disabled={isSubmitting}
                              className="w-full pl-11 pr-4 py-3.5 text-sm bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                              aria-label="Mobile number"
                            />
                          </div>
                        </div>

                        {/* Email + Submit row */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div
                            className={`relative flex-1 transition-all duration-300 ${
                              focusedField === "email"
                                ? "shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                                : ""
                            } rounded-xl`}
                          >
                            <Mail
                              size={18}
                              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                                focusedField === "email"
                                  ? "text-accent"
                                  : "text-text-muted"
                              }`}
                            />
                            <input
                              id="waitlist-email"
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                clearError();
                              }}
                              onFocus={() => setFocusedField("email")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Email Address"
                              required
                              disabled={isSubmitting}
                              className="w-full pl-11 pr-4 py-3.5 text-sm bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                              aria-label="Email address"
                            />
                          </div>

                          <button
                            id="waitlist-submit"
                            type="submit"
                            disabled={!canSubmit}
                            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 sm:min-w-[180px] overflow-hidden"
                            style={{
                              background:
                                "linear-gradient(135deg, #2563eb, #1d4ed8)",
                              boxShadow:
                                "0 4px 24px rgba(37, 99, 235, 0.30), inset 0 1px 0 rgba(255,255,255,0.1)",
                            }}
                          >
                            {/* Hover shimmer */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            {isSubmitting ? (
                              <>
                                <Loader2
                                  size={16}
                                  className="animate-spin relative z-10"
                                />
                                <span className="relative z-10">
                                  Joining...
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="relative z-10">
                                  Join Waitlist
                                </span>
                                <ArrowRight
                                  size={16}
                                  className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                              </>
                            )}
                          </button>
                        </div>

                        {/* Error message */}
                        <AnimatePresence>
                          {state === "error" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                <AlertCircle
                                  size={16}
                                  className="text-red-500 shrink-0"
                                />
                                <p className="text-sm text-red-600">
                                  {errorMessage}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
                          {TRUST_ITEMS.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 text-xs text-text-muted"
                            >
                              <item.icon size={13} className="text-accent/60" />
                              <span>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
