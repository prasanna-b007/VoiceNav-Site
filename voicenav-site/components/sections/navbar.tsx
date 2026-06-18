"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { AzuoLogo } from "@/components/ui/logo";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Architecture", href: "#architecture" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Waitlist", href: "#waitlist" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mobileOpen
          ? "bg-[rgba(249,249,247,0.98)] backdrop-blur-none"
          : scrolled
          ? "bg-bg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 px-5 lg:px-8">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-semibold text-text-primary tracking-tight"
        >
          <AzuoLogo size={28} />
          <span>AZUO <span className="text-accent">VoiceNav</span></span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#waitlist"
          className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-accent rounded-full hover:bg-accent-hover transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-accent"
        >
          Join Waitlist
        </a>

        {/* Mobile Toggle */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden p-2 text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-[rgba(249,249,247,0.98)] border-t border-border overflow-hidden"
          >
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#waitlist"
                onClick={() => setMobileOpen(false)}
                className="block mt-3 text-center py-2.5 text-sm font-medium text-white bg-accent rounded-full hover:bg-accent-hover transition-colors"
              >
                Join Waitlist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
