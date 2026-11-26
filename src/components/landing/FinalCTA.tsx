'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[var(--surface)] border border-[var(--border-color)] p-8 sm:p-14 rounded-[16px] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 select-none shadow-sm"
        >
          {/* Subtle Ambient glow */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 pointer-events-none opacity-25 dark:opacity-15 blur-3xl rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
            }}
          />

          <div className="flex flex-col gap-3 max-w-xl relative z-10">
            <span className="font-serif-display text-[13px] sm:text-[14px] text-[var(--text)] uppercase tracking-normal font-medium">
              READY FOR PRINT
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[var(--text)] font-[350] leading-[1.08] tracking-[-1.52px]">
              Step into the drafting atelier.
            </h2>
            <p className="text-[16px] text-[var(--text2)] leading-relaxed font-normal">
              Direct canvas manipulation, automated palette sampling, and 300 DPI exports for museum mounting. Free, in-browser, and zero data collection.
            </p>
          </div>

          <div className="flex items-center relative z-10">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/editor"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--text)] text-[var(--bg)] font-serif-display text-[16px] font-medium rounded-[16px] hover:opacity-90 transition-opacity shadow-sm"
              >
                <Palette size={16} />
                <span>Open Pressroom Studio</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
