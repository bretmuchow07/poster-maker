'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="w-full px-4 sm:px-8 pt-28 pb-16 max-w-7xl mx-auto flex flex-col gap-12 lg:gap-16">
      {/* Editorial Headline & Value Proposition (HyperFrames kinetic sequence) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.09, delayChildren: 0.05 },
          },
        }}
        className="flex flex-col gap-6 max-w-4xl"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="px-2.5 py-1 bg-[var(--surface2)] border border-[var(--border-color)] text-[var(--accent)] font-mono text-xs uppercase tracking-wider rounded">
            Free Web Studio
          </span>
          <a
            href="https://github.com/bretmuchow07/poster-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--surface)] hover:bg-[var(--surface2)] border border-[var(--border-color)] text-[var(--text2)] hover:text-[var(--text)] font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            <Github size={13} />
            <span>GitHub Source</span>
          </a>
          <span className="text-xs text-[var(--text3)]">
            • No account required • In-browser
          </span>
        </motion.div>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--text)] uppercase leading-[0.98] font-extrabold"
        >
          Design custom album posters ready to print.
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="text-base sm:text-lg text-[var(--text2)] max-w-2xl leading-relaxed"
        >
          Upload any artwork and auto-parse your tracklist. Extract authentic 5-color palettes, format tracklists in iconic music layouts, blend image edges seamlessly, and export 300 DPI files for framing.
        </motion.p>

        {/* Action Buttons & Feature Badges (HyperFrames press-release-spring) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/editor"
              className="btn btn-primary px-6 py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-display text-sm uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[var(--accent)]/15"
            >
              <span>Start Designing Free</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <a
              href="#templates"
              className="btn px-6 py-3.5 bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--text)] font-display text-sm uppercase tracking-wider font-semibold rounded-lg transition-colors border border-[var(--border-color)] block"
            >
              View Templates
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.4 } },
          }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-[var(--text3)]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            300 DPI Export (PNG, JPG, PDF)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Auto-Palette Extraction
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Drag &amp; Drop Canvas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            No Watermarks
          </span>
        </motion.div>
      </motion.div>

      {/* 3 Real Poster Previews (HyperFrames split-tilt-cards & ambient-glow-bloom) */}
      <div className="relative w-full">
        {/* Ambient Glow Bloom Layer */}
        <div
          className="absolute -inset-6 sm:-inset-10 pointer-events-none opacity-40 dark:opacity-25 blur-3xl rounded-full transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.28) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%)',
          }}
        />

        <div className="w-full bg-[var(--surface)] border border-[var(--border-color)] p-4 sm:p-8 rounded-xl shadow-2xl relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border-color)]">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text)] font-semibold">
              Iconic Layout Archetypes Created in PosterMaker
            </span>
            <span className="text-xs text-[var(--text3)] hidden sm:inline">
              Click any poster to open in editor
            </span>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ perspective: 1200 }}
          >
            {/* Poster 1: Swiss Swatch Archetype (Opposing perspective tilt) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02, rotateY: 0 }}
              className="relative transition-shadow duration-300 rounded"
            >
              <Link
                href="/editor?template=palette&artist=Echo+Velocity&album=Neo-Construct+04"
                className="bg-[#F5F3EE] text-[#14171A] p-6 shadow-2xl relative flex flex-col justify-between aspect-[1/1.414] rounded group border border-black/5 block h-full"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#534434] uppercase border-b border-[#534434]/20 pb-1">
                    <span>SWISS COLOR SWATCH</span>
                    <span>ECHO VELOCITY • 2024</span>
                  </div>
                  <div className="w-full h-44 bg-[#14171A] relative overflow-hidden rounded-sm">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdc3pScOq7iwApF_pMJm3Ykq6qDv6lpHtCl7A2xKuAJiXUx4l1zWeBAU8I8Vov8j_9se74Gd15pgygF_AQuCNj6r70evMdAfKozjhACEo7GvSG7d4n25NsWw6WdCynSObLDQF8j2zaoL5lwLqgOZfLUwEZdMfsMagChq3xFX4s7GWL_VzWwZVfZmtkhmntt-FbLmk5cCosZF9S7sUYJ6qpeZ2DrwRznil1dX4FWnlz-udChC59KCnY"
                      alt="Neo-Construct 04 artwork"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-base uppercase tracking-tight font-extrabold text-[#14171A]">
                      NEO-CONSTRUCT 04
                    </span>
                    <span className="font-mono text-[9px] text-[#534434]">ECHO VELOCITY</span>
                  </div>

                  {/* 5 Extracted Swatches */}
                  <div className="flex gap-1.5 pt-1">
                    <div className="w-4 h-4 bg-[#1F2937] rounded-sm transition-transform group-hover:scale-110" />
                    <div className="w-4 h-4 bg-[#F59E0B] rounded-sm transition-transform group-hover:scale-110" />
                    <div className="w-4 h-4 bg-[#3B82F6] rounded-sm transition-transform group-hover:scale-110" />
                    <div className="w-4 h-4 bg-[#E2E8F0] rounded-sm transition-transform group-hover:scale-110" />
                    <div className="w-4 h-4 bg-[#10B981] rounded-sm transition-transform group-hover:scale-110" />
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-mono text-[#534434] pt-2 border-t border-[#534434]/20">
                    <span>LABEL: APERTURE DISCS</span>
                    <span>LENGTH: 58:14</span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Poster 2: Brutalist Inset Archetype (Elevated center hero card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative transition-shadow duration-300 rounded"
            >
              <Link
                href="/editor?template=minimal&artist=Studio+Recordings&album=Chromatic+Static"
                className="bg-[#F5A8B8] text-[#121315] p-6 shadow-2xl relative flex flex-col justify-between aspect-[1/1.414] rounded group block h-full"
              >
                {/* Inset Hairline Border */}
                <div className="absolute inset-4 border border-[#121315]/40 pointer-events-none rounded-sm transition-all duration-300 group-hover:inset-3" />

                <div className="flex flex-col gap-2 relative z-10">
                  <div className="text-[8px] font-mono tracking-widest text-[#121315] uppercase border-b border-[#121315]/30 pb-1 text-center">
                    TRACK 01 / TRACK 02 / TRACK 03 / TRACK 04 / TRACK 05
                  </div>
                  <div className="w-full h-44 bg-[#121315] relative overflow-hidden flex items-center justify-center p-2 rounded-sm">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9vX4P-g98HdPki1CekOA_pxSdvtMzfDFxQUrXUnZoZZROY5wN31KpppNlJyLyBxbZgs6vQ4dM66lqpurmVGO9ykDswirDnsUXoIPxnwbO-UOViWK8aeqcR_XTgAucE7EUPbtTbljNNbmzVmL8w1jS2szNf5PO5CTifwPTR5DYHHTE9qV4aS7LjW7kmMxuAmcgItyNqlDqKMHLpjJdTz88GwAVSvyC_e5xzpraES5-zBBitynAoy1K"
                      alt="Chromatic Static artwork"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 relative z-10 mt-3 text-center">
                  <h3 className="font-display text-2xl uppercase tracking-tighter font-black text-[#121315] leading-none">
                    CHROMATIC STATIC
                  </h3>
                  <p className="font-mono text-[9px] text-[#121315] uppercase font-bold">
                    STUDIO RECORDINGS
                  </p>
                  <p className="text-[8px] leading-tight text-[#121315]/80 pt-1.5 border-t border-[#121315]/20">
                    ALL COMPOSITIONS WRITTEN, PRODUCED AND ARRANGED BY STUDIO RECORDINGS.
                  </p>
                  <div className="text-[8px] font-mono text-[#121315] pt-0.5">
                    EDITORIAL PRESS • 2024
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Poster 3: Cinematic Split Archetype (Opposing perspective tilt) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02, rotateY: 0 }}
              className="relative transition-shadow duration-300 rounded"
            >
              <Link
                href="/editor?template=split&artist=Solene+Grey&album=Nocturne+Protocol"
                className="bg-[#0E0E10] text-[#E3E2E5] p-6 shadow-2xl relative flex flex-col justify-between aspect-[1/1.414] rounded group border border-white/5 block h-full"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#abb8db] uppercase border-b border-white/10 pb-1">
                    <span>CINEMATIC SPLIT</span>
                    <span>SOLENE GREY • 2024</span>
                  </div>
                  <div className="w-full h-44 bg-[#1f2022] relative overflow-hidden rounded-sm">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2NkY8wjVm-YQoyGOYT8MBoOaMxVH_wMmGYF0aTyxh58kf6k8sv3xDpZPOVLXukDcf9jlaoUL6VDE4y8E7SG2PgTK1rLehBsFd1OdCMnh_YZapph_Xm0BqUNJWxE6Jmw8eSqqHHQvcefZW10srssjb7E_otr_INazRmb2GBCcfytTJw_AyLCy0smNv9U0MMftLRYWDMLm4pFHOZhi0AHWGvlg58MQT2c0Gc1E_G16fVz3vVOg5Ar45"
                      alt="Nocturne Protocol artwork"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <div>
                    <span className="font-display text-xl uppercase tracking-tight font-black text-[#e3e2e5] block">
                      NOCTURNE PROTOCOL
                    </span>
                    <span className="font-mono text-[9px] text-[#ffc174] block">
                      SOLENE GREY
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 text-[8px] font-mono text-[#abb8db] pt-1.5 border-t border-white/10">
                    <div>01. LUMEN DIVERGENCE</div>
                    <div>02. CYLINDER SHADOWS</div>
                    <div>03. OBSIDIAN TIDE</div>
                    <div>04. TERMINAL VEIL</div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-mono text-[#abb8db] pt-1">
                    <span>XO / REPUBLIC RECORDS</span>
                    <span>PARENTAL ADVISORY</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
