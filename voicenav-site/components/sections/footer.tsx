const FOOTER_LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#" },
  { label: "GitHub", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-text-primary text-white py-12 px-6">
      <div className="section-container">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <span className="font-[family-name:var(--font-heading)] text-xl font-semibold">
            AZUO <span className="text-accent-light">VoiceNav</span>
          </span>

          <nav className="flex flex-wrap gap-6 sm:gap-8">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © 2025 AZUO Technologies. All rights reserved.
            </p>
            <p className="text-xs text-white/40 italic">
              Built with precision.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
