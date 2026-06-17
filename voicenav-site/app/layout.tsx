import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AZUO VoiceNav — Semantic Voice SDK for Applications",
  description:
    "A semantic voice SDK that discovers application capabilities, understands intent using semantic matching, and executes actions in real time. 97%+ accuracy, sub-5ms routing, zero inference cost.",
  keywords: [
    "voice SDK",
    "semantic matching",
    "voice navigation",
    "intent detection",
    "Model2Vec",
    "developer tools",
    "voice commands",
    "AZUO",
    "VoiceNav",
  ],
  openGraph: {
    title: "AZUO VoiceNav — Semantic Voice SDK",
    description:
      "Your application already knows what to do. VoiceNav teaches it how to listen.",
    type: "website",
    siteName: "AZUO VoiceNav",
  },
  twitter: {
    card: "summary_large_image",
    title: "AZUO VoiceNav — Semantic Voice SDK",
    description:
      "Your application already knows what to do. VoiceNav teaches it how to listen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <body className={`min-h-screen flex flex-col bg-bg text-text-primary ${plusJakartaSans.className}`}>
        {children}
      </body>
    </html>
  );
}
