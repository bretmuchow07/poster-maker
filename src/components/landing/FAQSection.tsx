'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I print the posters and get standard frames to fit?',
    answer:
      'Our studio presets match standard ISO international sizes (A4, A3, A2) and classic US frame sizes (12×12″ vinyl sleeves, 18×24″, 24×36″). When exporting at 300 DPI (PDF or PNG), send the file to your local print shop or an online print service and choose standard framing off the shelf from IKEA, Target, or West Elm.',
  },
  {
    question: 'How does the tracklist auto-parser work?',
    answer:
      'Instead of typing each track by hand, copy track strings directly from Spotify, Apple Music, Bandcamp, or Wikipedia and click "Paste Bulk Tracks" in the editor. The parser automatically detects track numbers, titles, and timestamps and formats them cleanly into balanced columns.',
  },
  {
    question: 'Can I upload any image or cover art?',
    answer:
      'Yes. Upload any JPEG, PNG, or WebP image. The app automatically creates an optimized canvas version in your browser, runs a median-cut color extraction to generate a 5-color swatch palette, and lets you drag, scale, and blend the bottom edge with the background.',
  },
  {
    question: 'Are there any watermarks or hidden fees?',
    answer:
      'None. Pressroom is 100% free to use. There are no watermarks on exported files, no subscription tiers, and no mandatory account signups. You get full-resolution exports (72, 150, or 300 DPI) right away.',
  },
  {
    question: 'Is my artwork and data kept private?',
    answer:
      'Entirely private. Pressroom processes all images and designs strictly inside your browser using client-side HTML5 canvas and Web APIs. Your uploaded images and custom tracklists are never transmitted to or stored on any external server.',
  },
  {
    question: 'What paper stock or finish do you recommend for printing?',
    answer:
      'For Swiss and minimal typography posters, we recommend a heavy uncoated matte or archival cotton paper (200–250 gsm) to avoid glare under frame glass. For vibrant, photographic artwork or high-contrast modern layouts, satin or lustre photo paper brings out deep black levels and swatch saturation.',
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] transition-colors duration-300" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="font-serif-display text-[13px] sm:text-[14px] text-[var(--text)] uppercase tracking-normal font-medium block mb-2">
            FREQUENTLY ASKED
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[var(--text)] font-[350] tracking-[-1.32px] leading-[1.1]">
            Archival printing, explained.
          </h2>
          <p className="text-[15px] text-[var(--text2)] mt-2 font-normal">
            Everything you need to know about preparing digital posters for tangible framing.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 select-none hover:bg-[var(--surface2)]/50 transition-colors cursor-pointer"
                >
                  <span className="font-serif-display text-[17px] text-[var(--text)] font-medium tracking-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[var(--text2)] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-[var(--text)]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-[15px] text-[var(--text2)] leading-relaxed border-t border-[var(--border-color)] font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
