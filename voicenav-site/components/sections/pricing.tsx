"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren, staggerItem } from "@/components/motion/stagger-children";

interface Plan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Perfect for testing and personal projects",
    features: [
      "Up to 100 actions/month",
      "Single application",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started",
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "For growing applications",
    features: [
      "Up to 10,000 actions/month",
      "Up to 3 applications",
      "Email support",
      "Advanced analytics",
      "Custom action registry",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "₹3,999",
    period: "/month",
    description: "For production applications",
    features: [
      "Unlimited actions",
      "Unlimited applications",
      "Priority support",
      "Full analytics dashboard",
      "Custom model training",
      "GGUF Reasoner access",
      "Team collaboration",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale deployments",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "On-premise deployment",
      "Custom integrations",
      "Security audit",
    ],
    cta: "Contact Sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-bg-secondary">
      <div className="section-container">
        <SectionHeader
          badge="Pricing"
          title="Start free. Scale with confidence."
          subtitle="Transparent pricing that grows with your application."
        />

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto items-start">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={staggerItem}
              className={`relative rounded-xl p-6 ${
                plan.highlighted ? "card-accent" : "card-premium"
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
                  Popular
                </span>
              )}

              {/* Name */}
              <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>

              {/* Price */}
              <div className="mt-3 mb-1">
                <span className="text-4xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-text-muted ml-1">{plan.period}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <Check
                      size={15}
                      className="text-[var(--color-execute)] mt-0.5 flex-shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                id={`pricing-cta-${plan.name.toLowerCase()}`}
                className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  plan.highlighted
                    ? "bg-accent text-white hover:bg-accent-hover shadow-accent"
                    : "border border-border-strong text-text-primary hover:bg-bg-elevated"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
