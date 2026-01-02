import React from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { VisualShowcase } from '@/components/landing/VisualShowcase'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { PrintQualitySection } from '@/components/landing/PrintQualitySection'
import { OpenSourceSection } from '@/components/landing/OpenSourceSection'
import { WhoItsFor } from '@/components/landing/WhoItsFor'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSection />
      <VisualShowcase />
      <FeaturesGrid />
      <PrintQualitySection />
      <OpenSourceSection />
      <WhoItsFor />
      <FinalCTA />
      <Footer />
    </main>
  )
}

