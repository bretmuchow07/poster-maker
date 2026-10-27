'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="h-16 w-full px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="brand select-none hover:opacity-85 transition-opacity flex items-center text-lg sm:text-xl font-bold"
            title="PosterMaker Home"
          >
            Poster<span>Maker</span>
          </Link>
          <span className="text-[11px] font-mono uppercase text-[var(--accent)] px-2 py-0.5 bg-[var(--surface2)] border border-[var(--border-color)] rounded hidden sm:inline-block">
            Album Poster Studio
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-[var(--text2)]">
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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub Source Link */}
          <a
            href="https://github.com/bretmuchow07/poster-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="tbtn border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
            title="View Source on GitHub"
            aria-label="View Source on GitHub"
          >
            <Github size={16} />
          </a>

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          <Link
            href="/editor"
            className="btn btn-primary inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
          >
            <span>Open Editor</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
