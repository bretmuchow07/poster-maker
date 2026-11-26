'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Real album poster mockups representing Pressroom's 5 drafting archetypes
const FLOATING_TILES = [
  {
    id: 1,
    title: 'Swiss Palette Grid',
    image: '/examples/palette.png',
    size: 'w-24 h-24 sm:w-32 sm:h-32',
    position: 'top-8 left-4 sm:top-12 sm:left-12 lg:left-24',
    rotation: '-rotate-3',
    delay: 0.1,
  },
  {
    id: 2,
    title: 'Brutalist Inset Rule',
    image: '/examples/minimal.png',
    size: 'w-28 h-28 sm:w-36 sm:h-36',
    position: 'top-10 right-4 sm:top-14 sm:right-12 lg:right-28',
    rotation: 'rotate-4',
    delay: 0.18,
  },
  {
    id: 3,
    title: 'Archival Linen Atelier',
    image: '/examples/cosmos.png',
    size: 'w-24 h-24 sm:w-28 sm:h-28',
    position: 'bottom-6 left-6 sm:bottom-12 sm:left-20 lg:left-36',
    rotation: 'rotate-2',
    delay: 0.26,
  },
  {
    id: 4,
    title: 'Cinematic Split Fade',
    image: '/examples/split.png',
    size: 'w-28 h-28 sm:w-32 sm:h-32',
    position: 'bottom-8 right-6 sm:bottom-14 sm:right-20 lg:right-32',
    rotation: '-rotate-2',
    delay: 0.32,
  },
  {
    id: 5,
    title: 'Modern Studio Sleeve',
    image: '/examples/modern.png',
    size: 'w-20 h-20 sm:w-24 sm:h-24 hidden md:block',
    position: 'top-1/2 -translate-y-1/2 left-2 sm:left-8',
    rotation: '-rotate-6',
    delay: 0.22,
  },
  {
    id: 6,
    title: '5-Swatch Extraction',
    image: '/examples/palette.png',
    size: 'w-20 h-20 sm:w-24 sm:h-24 hidden md:block',
    position: 'top-1/2 -translate-y-1/2 right-2 sm:right-8',
    rotation: 'rotate-6',
    delay: 0.28,
  },
];

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-4 sm:px-8 pt-28 pb-16 overflow-hidden select-none bg-[var(--bg)] transition-colors duration-300">
      {/* HyperFrames Ambient Glow Bloom Layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 blur-3xl transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 45%, var(--accent-subtle) 0%, transparent 65%)',
        }}
      />

      {/* Floating Album Poster Tiles pinned around the Hero */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
        {FLOATING_TILES.map((tile) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: tile.delay, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${tile.position} pointer-events-auto group`}
          >
            <motion.div
              whileHover={{ scale: 1.06, rotate: 0, y: -6 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className={`relative overflow-hidden rounded-[14px] ${tile.size} ${tile.rotation} transition-shadow duration-300 border border-[var(--border-color)] bg-[var(--surface)] shadow-md hover:shadow-xl cursor-pointer`}
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover select-none"
                loading="eager"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Centered Editorial Text Stack (Capped group stagger <= 0.5s) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
        className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center"
      >
        {/* Eyebrow Label: All-caps stamp */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="mb-5"
        >
          <span className="font-serif-display font-medium text-[13px] sm:text-[14px] tracking-normal text-[var(--text)] uppercase px-3.5 py-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-full shadow-xs">
            MUSIC PRINT STUDIO • EST. 2026
          </span>
        </motion.div>

        {/* Hero Headline: Whisper-Weight 350 Serif */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="font-serif-display text-[var(--text)] text-[44px] sm:text-[62px] md:text-[72px] leading-[0.92] sm:leading-[0.88] tracking-[-2px] sm:tracking-[-3.5px] font-[350] mb-6"
        >
          Make Music Visible.
        </motion.h1>

        {/* Subtitle Body */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="text-[var(--text2)] text-[16px] sm:text-[18px] leading-[1.5] max-w-xl mx-auto mb-9 font-normal"
        >
          An independent music print studio. Turn the albums you love into prints worth keeping—auto-parse tracklists, extract 5-color palettes, and export 300 DPI files in-browser.
        </motion.p>

        {/* Two-Button Row: Primary Filled + Secondary Outlined (Press-Release Spring) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/editor"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[15px] font-medium text-[var(--bg)] bg-[var(--text)] rounded-[16px] hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Start Designing Free</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <a
              href="#templates"
              className="inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-[var(--text)] bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] hover:bg-[var(--surface2)] transition-colors"
            >
              <span>View 5 Archetypes</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
