'use client';

import React from 'react';
import { UploadCloud, Palette, Move, Layout, Printer, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: UploadCloud,
    title: 'Upload Artwork & Paste Raw Tracklists',
    description:
      'Upload any high-resolution image and paste raw track text copied directly from Spotify, Apple Music, or Bandcamp. Titles and durations are auto-parsed instantly.',
  },
  {
    icon: Palette,
    title: 'Automatic 5-Color Extraction',
    description:
      'The app samples your album cover and extracts 5 dominant swatches. Easily recolor the background, typography, or swatches to create a cohesive design.',
  },
  {
    icon: Move,
    title: 'On-Canvas Drag & Edge Blending',
    description:
      'Drag and scale elements freely. Use the edge blend slider to bake smooth alpha transparency into the bottom of your image, melting it into the background.',
  },
  {
    icon: Layout,
    title: '4 Distinct Music Archetypes',
    description:
      'Choose from the Swiss Palette Grid, Brutalist Inset Rule, Cinematic Split with ghost blur titles, or the classic edge-to-edge Modern Studio layout.',
  },
  {
    icon: Printer,
    title: '300 DPI Print-Ready Export',
    description:
      'Download high-resolution PNG, JPG, or Vector PDF files calibrated for standard frame sizes (A4, A3, A2, 12×12″ vinyl sleeve, 18×24″, 24×36″).',
  },
  {
    icon: ShieldCheck,
    title: '100% Free, Private & In-Browser',
    description:
      'No account creation, no subscriptions, no tracking, and no watermarks. Your artwork is processed entirely within your browser and never leaves your device.',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--surface2)]/40 border-t border-b border-[var(--border-color)] transition-colors duration-200" id="features">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-[var(--text)] font-extrabold tracking-tight">
            Built for Music Fans &amp; Print Enthusiasts
          </h2>
          <p className="text-sm sm:text-base text-[var(--text2)] mt-2 leading-relaxed">
            Every feature is designed to give you complete creative control over your album posters without overwhelming complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--surface2)] p-6 rounded-xl shadow-lg flex flex-col gap-3 transition-colors group cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--surface2)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-lg uppercase text-[var(--text)] font-bold mt-1">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
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
