import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Disc, Layers, Printer, ShieldCheck } from 'lucide-react';
import { PressroomLockupStacked } from '@/components/PressroomBrand';

export const metadata: Metadata = {
  title: 'About — Pressroom Music Print Studio',
  description:
    'Make Music Visible. Learn about Pressroom, an independent digital music print studio built for archival-grade album posters.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans px-6 py-12 md:py-20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text2)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Studio Home</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--text3)]">
            PR–001 • EST. 2026
          </span>
        </div>

        {/* Stacked Brand Lockup & Positioning */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pb-10 border-b border-[var(--border-color)]">
          <div className="shrink-0">
            <PressroomLockupStacked className="w-40 sm:w-44 h-auto text-[var(--text)]" />
          </div>

          <div className="space-y-3">
            <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-[var(--accent)] font-semibold">
              Music / Art / Print
            </span>
            <h1 className="font-serif-display text-4xl sm:text-5xl tracking-[-0.03em] font-[350] leading-[1.05]">
              Make Music Visible.
            </h1>
            <p className="text-base text-[var(--text2)] leading-relaxed">
              Pressroom is an independent digital print studio specialising in music-inspired artwork. Turn the albums you love into prints worth keeping.
            </p>
          </div>
        </div>

        {/* Studio Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-color)] space-y-2">
            <Layers size={18} className="text-[var(--accent)]" />
            <h2 className="font-serif-display text-lg font-medium text-[var(--text)]">
              Five Drafting Archetypes
            </h2>
            <p className="text-sm text-[var(--text2)] leading-relaxed">
              Built on Swiss modernist grids, archival linen mounts, editorial hairline borders, cinematic edge blends, and classic vinyl sleeve proportions.
            </p>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-color)] space-y-2">
            <Disc size={18} className="text-[var(--accent)]" />
            <h2 className="font-serif-display text-lg font-medium text-[var(--text)]">
              Tactile Music Details
            </h2>
            <p className="text-sm text-[var(--text2)] leading-relaxed">
              Auto-parse tracklists, extract 5-color palettes from your cover art, and place movable Parental Advisory badges, QR codes, and runout matrix stamps.
            </p>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-color)] space-y-2">
            <Printer size={18} className="text-[var(--accent)]" />
            <h2 className="font-serif-display text-lg font-medium text-[var(--text)]">
              300 DPI Print Calibration
            </h2>
            <p className="text-sm text-[var(--text2)] leading-relaxed">
              Export print-ready PNG, JPG, PDF, or Vector SVG files calibrated for A4, A3, A2, 12×12″ LP sleeves, and 18×24″ / 24×36″ gallery frames.
            </p>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-color)] space-y-2">
            <ShieldCheck size={18} className="text-[var(--accent)]" />
            <h2 className="font-serif-display text-lg font-medium text-[var(--text)]">
              100% In-Browser & Private
            </h2>
            <p className="text-sm text-[var(--text2)] leading-relaxed">
              Everything renders locally in your browser with zero accounts, zero watermarks, and zero tracking. Your Music. Your Wall. Your Story.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text3)]">
            <Link href="/privacy" className="hover:text-[var(--text)] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <span>EST. 2026</span>
          </div>

          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] text-sm font-semibold transition-colors shadow-sm"
          >
            <span>Open Pressroom Studio</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
