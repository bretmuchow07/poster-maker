import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { TemplateShowcase } from '@/components/landing/TemplateShowcase';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PrintSpecsSection } from '@/components/landing/PrintSpecsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)] transition-colors duration-200">
      <Header />
      <HeroSection />
      <TemplateShowcase />
      <FeaturesSection />
      <PrintSpecsSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
