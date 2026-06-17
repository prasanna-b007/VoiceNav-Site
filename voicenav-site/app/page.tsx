import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { SemanticPlayground } from "@/components/sections/semantic-playground";
import { WhyVoiceNav } from "@/components/sections/why-voicenav";
import { Comparison } from "@/components/sections/comparison";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Architecture } from "@/components/sections/architecture";
import { ConfidenceLayer } from "@/components/sections/confidence-layer";
import { DocsPreview } from "@/components/sections/docs-preview";
import { Pricing } from "@/components/sections/pricing";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SemanticPlayground />
        <WhyVoiceNav />
        <Comparison />
        <HowItWorks />
        <Architecture />
        <ConfidenceLayer />
        <DocsPreview />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
