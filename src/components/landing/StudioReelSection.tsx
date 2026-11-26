'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ReelStep {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  caption: string;
  image: string;
}

const REEL_STEPS: ReelStep[] = [
  {
    id: 'import',
    number: '01',
    shortTitle: 'Search or Upload',
    title: 'Import album artwork & tracklists in seconds',
    caption: 'Search iTunes metadata for instant cover art and tracklists, or drop your own 300 DPI artwork directly onto the studio canvas.',
    image: '/reel/step-1-import.png',
  },
  {
    id: 'palette',
    number: '02',
    shortTitle: 'Extract & Compose',
    title: 'Auto-sample 5-color palettes & Swiss grid typography',
    caption: 'Client-side median-cut quantization extracts five dominant swatches while balancing artist, title, signature, and tracklist columns.',
    image: '/reel/step-2-palette.png',
  },
  {
    id: 'customize',
    number: '03',
    shortTitle: 'Move, Style & Tag',
    title: 'Direct canvas manipulation with smart snap guides',
    caption: 'Drag, resize, or remove any element on the canvas—including the movable Parental Advisory badge, QR code, and vinyl runout stamp.',
    image: '/reel/step-3-customize.png',
  },
  {
    id: 'export',
    number: '04',
    shortTitle: 'Export at 300 DPI',
    title: 'Print-ready PNG, JPG, Vector SVG, or PDF',
    caption: 'Choose standard ISO or gallery frame presets, toggle 3mm bleed & margin guides, and export crisp press-ready files with zero watermarks.',
    image: '/reel/step-4-export.png',
  },
];

const SLIDE_DURATION_MS = 4500;

export function StudioReelSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const shouldAdvance = isPlaying && !isHovered;

  useEffect(() => {
    if (!shouldAdvance) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REEL_STEPS.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [shouldAdvance, activeIndex]);

  const current = REEL_STEPS[activeIndex];

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + REEL_STEPS.length) % REEL_STEPS.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % REEL_STEPS.length);

  return (
    <section
      className="w-full px-4 sm:px-8 py-20 max-w-7xl mx-auto bg-[var(--bg)] transition-colors duration-300"
      id="workflow"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-serif-display text-[var(--text)] text-3xl sm:text-4xl md:text-[38px] leading-[1.08] tracking-[-1.52px] font-[350]">
            Inside the studio, frame by frame.
          </h2>
        </div>
        <p className="text-[var(--text2)] text-base max-w-md font-normal leading-relaxed">
          Watch how an album turns into a print-ready poster—from artwork import to 300 DPI export in under a minute.
        </p>
      </div>

      {/* Cinema Reel Frame */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-[20px] overflow-hidden border border-[var(--border-color)] bg-[var(--surface)] shadow-xl"
      >
        {/* Top Studio Transport Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border-color)] bg-[var(--surface)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text)] font-semibold">
              <span className={`w-2 h-2 rounded-full ${shouldAdvance ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--text3)]'}`} />
              <span>Pressroom Studio Reel</span>
            </span>
            <span className="text-[11px] font-mono text-[var(--text3)] hidden sm:inline">
              • {current.number} / 0{REEL_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors"
              aria-label="Previous step"
              title="Previous step"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text)] border border-[var(--border-color)] transition-colors"
              aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
            >
              {isPlaying ? <Pause size={12} className="text-[var(--accent)]" /> : <Play size={12} className="text-[var(--accent)]" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors"
              aria-label="Next step"
              title="Next step"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 16:9 Viewport with Video-like Crossfade & Subtle Motion */}
        <div className="relative w-full aspect-video bg-[var(--studio-canvas-bg)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0.25, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.25 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <motion.img
                src={current.image}
                alt={current.title}
                initial={{ scale: 1 }}
                animate={shouldAdvance ? { scale: 1.025 } : { scale: 1 }}
                transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                className="w-full h-full object-cover object-top select-none"
              />
            </motion.div>
          </AnimatePresence>

          {/* Bottom Caption Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
            <div className="max-w-xl">
              <span className="inline-block font-mono text-[11px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
                Step {current.number} — {current.shortTitle}
              </span>
              <h3 className="font-serif-display text-white text-xl sm:text-2xl font-normal leading-snug">
                {current.title}
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm mt-1 leading-relaxed">
                {current.caption}
              </p>
            </div>

            <Link
              href="/editor"
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-md"
            >
              <span>Try in Studio</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Video-like Scrub Progress Bar */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
            {shouldAdvance ? (
              <motion.div
                key={`progress-${current.id}-${isHovered}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                className="h-full bg-[var(--accent)]"
              />
            ) : (
              <div className="h-full bg-[var(--accent)] w-full opacity-60" />
            )}
          </div>
        </div>

        {/* Chapter Scrubber Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-color)] border-t border-[var(--border-color)] bg-[var(--surface)]">
          {REEL_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-left p-4 transition-colors relative cursor-pointer ${
                  isActive
                    ? 'bg-[var(--surface2)]/80 text-[var(--text)]'
                    : 'hover:bg-[var(--surface2)]/40 text-[var(--text2)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[11px] font-semibold ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}`}>
                    {step.number}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono uppercase text-[var(--accent)]">
                      Active
                    </span>
                  )}
                </div>
                <div className="font-semibold text-sm text-[var(--text)]">
                  {step.shortTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
