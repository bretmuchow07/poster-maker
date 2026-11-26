'use client';

import React from 'react';
import { UploadCloud, Palette, Move, Layout, Printer, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: UploadCloud,
    title: 'Raw Tracklist Extraction',
    description:
      'Upload high-resolution album imagery and paste raw track strings directly from Spotify, Bandcamp, or vinyl liner notes. Titles and runtimes are auto-balanced instantly.',
  },
  {
    icon: Palette,
    title: 'Client-Side Color Quantization',
    description:
      'Median-cut color sampling extracts 5 dominant tonal swatches from your cover art. Colorize backgrounds, typography, and accent markers with harmonic fidelity.',
  },
  {
    icon: Move,
    title: 'Baked Alpha Edge Blending',
    description:
      'Direct on-canvas positioning via Fabric.js. Smooth alpha bottom gradients melt photographic edges into the archival paper base without unsightly seams.',
  },
  {
    icon: Layout,
    title: 'Archival Music Archetypes',
    description:
      'Select between Swiss Palette Grids, Brutalist Inset Rules, Cinematic Splits with ghost blur echoes, and edge-to-edge Modern Studio sleeves.',
  },
  {
    icon: Printer,
    title: '300 DPI Museum Press Export',
    description:
      'Export production-ready PNG, JPG, or Vector PDF files calibrated for ISO standard frames (A4, A3, A2) and US gallery sizes (12×12″, 18×24″, 24×36″).',
  },
  {
    icon: ShieldCheck,
    title: '100% In-Browser & Private',
    description:
      'Zero server uploads, zero tracking cookies, zero accounts, and zero watermarks. Your creative assets are processed exclusively within your browser.',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] border-t border-[var(--border-color)] transition-colors duration-300" id="features">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="max-w-2xl">
          <span className="font-serif-display text-[13px] sm:text-[14px] text-[var(--text)] uppercase tracking-normal font-medium block mb-2">
            ATELIER CAPABILITIES
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[var(--text)] font-[350] tracking-[-1.32px] leading-[1.1]">
            Drafted with precision and physical restraint.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[var(--text2)] mt-2 leading-relaxed font-normal">
            Every tool is designed to give you archival print precision without cluttered software chrome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--border-hover)] p-6 sm:p-7 rounded-[16px] flex flex-col gap-3 transition-colors duration-200 select-none shadow-xs hover:shadow-md cursor-default"
              >
                <div className="w-10 h-10 rounded-[12px] bg-[var(--surface2)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text)]">
                  <Icon size={18} />
                </div>
                <h3 className="font-serif-display text-[18px] text-[var(--text)] font-medium tracking-tight mt-1">
                  {f.title}
                </h3>
                <p className="text-[14px] text-[var(--text2)] leading-relaxed font-normal">
                  {f.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
