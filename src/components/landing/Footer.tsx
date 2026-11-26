'use client';

import React from 'react';
import Link from 'next/link';
import { Github, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PressroomLockupHorizontal } from '@/components/PressroomBrand';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--surface)] border-t border-[var(--border-color)] py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Main Clean Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
          {/* Brand & Purpose */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="inline-flex items-center self-start text-[var(--text)] hover:opacity-85 transition-opacity" title="Pressroom — Music Print Studio">
              <PressroomLockupHorizontal className="h-10 sm:h-11 w-auto" />
            </Link>
            <p className="text-[13px] text-[var(--text2)]">
              Independent music print studio. Make Music Visible — in-browser with zero tracking.
            </p>
          </div>

          {/* Essential Clean Links */}
          <nav className="flex flex-wrap items-center gap-5 sm:gap-7 text-[13px] text-[var(--text2)]">
            <a href="#templates" className="hover:text-[var(--text)] transition-colors">
              Templates
            </a>
            <a href="#features" className="hover:text-[var(--text)] transition-colors">
              Features
            </a>
            <a href="#formats" className="hover:text-[var(--text)] transition-colors">
              Print Sizes
            </a>
            <a href="#faq" className="hover:text-[var(--text)] transition-colors">
              FAQ
            </a>
            <Link href="/about" className="hover:text-[var(--text)] transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-[var(--text)] transition-colors">
              Privacy
            </Link>
          </nav>

          {/* Quick Actions: GitHub + Studio Launch */}
          <div className="flex items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/bretmuchow07/poster-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] border border-[var(--border-color)] transition-colors"
              title="View Source on GitHub"
            >
              <Github size={14} />
            </motion.a>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/editor"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-[var(--bg)] bg-[var(--text)] rounded-[12px] hover:opacity-90 transition-opacity"
              >
                <span>Open Studio</span>
                <ArrowUpRight size={12} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Sub-Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[12px] text-[var(--text3)] gap-3">
          <p>
            &copy; {new Date().getFullYear()} Pressroom (PR–001). All album cover rights belong to their respective artists.
          </p>
          <div className="flex items-center gap-4">
            <span>300 DPI Export</span>
            <span>•</span>
            <span>Zero Cookies</span>
            <span>•</span>
            <span>Client-Side</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
