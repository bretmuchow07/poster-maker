'use client';

import React from 'react';
import Link from 'next/link';
import { Github, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PressroomLockupHorizontal, PressroomMark } from '@/components/PressroomBrand';

export const DotClusterLogo = PressroomMark;

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between bg-[var(--surface)]/95 backdrop-blur-md text-[var(--text)] border border-[var(--border-color)] rounded-full px-5 py-2.5 pointer-events-auto transition-colors duration-300 shadow-sm">
        {/* Brand Cluster */}
        <Link
          href="/"
          className="flex items-center text-[var(--text)] hover:opacity-85 transition-opacity shrink-0"
          title="Pressroom — Music Print Studio"
        >
          <PressroomLockupHorizontal className="h-8 sm:h-9 w-auto" />
        </Link>

        {/* Real Functional Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-[14px] text-[var(--text2)]">
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
        </nav>

        {/* Action cluster: GitHub + Theme Toggle + Open Studio Button */}
        <div className="flex items-center gap-2.5">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/bretmuchow07/poster-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors"
            title="View Source on GitHub"
            aria-label="GitHub Repository"
          >
            <Github size={15} />
          </motion.a>

          <div className="scale-90 origin-center">
            <ThemeToggle />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/editor"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[14px] font-medium text-[var(--bg)] bg-[var(--text)] rounded-[16px] hover:opacity-90 transition-opacity shadow-xs"
            >
              <span>Open Studio</span>
              <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
