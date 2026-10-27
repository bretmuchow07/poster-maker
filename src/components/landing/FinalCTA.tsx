'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[var(--surface)] border border-[var(--border-color)] p-8 sm:p-14 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          {/* Subtle background ambient sheen */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 pointer-events-none opacity-30 dark:opacity-15 blur-3xl rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
            }}
          />

          <div className="flex flex-col gap-3 max-w-xl relative z-10">
            <h2 className="font-display text-3xl sm:text-5xl uppercase text-[var(--text)] font-extrabold leading-none tracking-tight">
              Create your album poster now.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text2)] leading-relaxed">
              Upload your favorite artwork, auto-parse tracklists, customize the layout and palette, and download your 300 DPI print file. 100% free with no account needed.
            </p>
          </div>

          <div className="flex items-center relative z-10">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/editor"
                className="btn btn-primary px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-foreground)] font-display text-base uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/15"
              >
                <Palette size={18} />
                <span>Open Poster Editor</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
