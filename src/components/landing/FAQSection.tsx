'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I print the posters and get standard frames to fit?',
    answer:
      'Our studio presets match standard ISO international sizes (A4, A3, A2) and classic US frame sizes (12×12″ vinyl sleeves, 18×24″, 24×36″). When exporting at 300 DPI (PDF or PNG), send the file to your local print shop or an online print service (like Gelato, Printful, or your local copy center) and choose standard framing off the shelf from IKEA, Target, or Amazon.',
  },
  {
    question: 'How does the tracklist auto-parser work?',
    answer:
      'Instead of typing each track by hand, you can copy the tracklist directly from Spotify, Apple Music, Bandcamp, or Wikipedia and click "Paste Bulk Tracks" in the editor. The parser automatically detects track numbers, titles, and timestamps (e.g. "01. Song Title 3:45") and formats them cleanly into two columns.',
  },
  {
    question: 'Can I upload any image or cover art?',
    answer:
      'Yes. You can upload any JPEG, PNG, or WebP image. The app automatically creates an optimized canvas version in your browser, runs a median-cut color extraction to generate a 5-color swatch palette, and lets you drag, scale, and blend the bottom edge with the background.',
  },
  {
    question: 'Are there any watermarks or hidden fees?',
    answer:
      'None. PosterMaker is 100% free to use. There are no watermarks on exported files, no subscription tiers, and no mandatory account signups. You get full-resolution exports (72, 150, or 300 DPI) right away.',
  },
  {
    question: 'Is my artwork and data kept private?',
    answer:
      'Entirely private. PosterMaker processes all images and designs strictly inside your browser using client-side HTML5 canvas and Web APIs. Your uploaded images and custom tracklists are never transmitted to or stored on any external server.',
  },
  {
    question: 'What paper stock or finish do you recommend for printing?',
    answer:
      'For Swiss and minimal typography posters, we recommend a heavy matte or archival cotton paper (200–250 gsm) to avoid glare under frame glass. For vibrant, photographic artwork or high-contrast modern layouts, satin or lustre photo paper brings out deep black levels and swatch saturation.',
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--surface2)]/40 border-t border-[var(--border-color)] transition-colors duration-200" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs uppercase tracking-wider">
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-[var(--text)] font-extrabold tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-sm sm:text-base text-[var(--text2)] max-w-2xl leading-relaxed">
            Common questions about printing, sizing, privacy, and creating your custom music prints.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--border-hover)] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--surface2)]/50 transition-colors"
                >
                  <span className="font-display text-base uppercase text-[var(--text)] font-bold">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0 text-[var(--accent)]"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-[var(--text2)] leading-relaxed border-t border-[var(--border-color)]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
