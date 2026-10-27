'use client';

import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--surface)] border-t border-[var(--border-color)] py-12 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          {/* Brand info */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="brand select-none text-xl font-bold">
              Poster<span>Maker</span>
            </Link>
            <p className="text-[var(--text2)] leading-relaxed">
              A privacy-focused, browser-based design studio for creating iconic music album posters ready for physical framing.
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/bretmuchow07/poster-maker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline font-mono"
              >
                <Github size={13} />
                <span>github.com/bretmuchow07/poster-maker</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-[var(--accent)] font-bold">
              Navigation
            </span>
            <Link href="/editor" className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              Open Editor
            </Link>
            <a href="#templates" className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              Poster Templates
            </a>
            <a href="#features" className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              Features &amp; Capabilities
            </a>
            <a href="#formats" className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              Print Sizes &amp; Formats
            </a>
            <a href="#faq" className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              FAQ &amp; Printing Guide
            </a>
          </div>

          {/* Technology & Open Source */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-[var(--accent)] font-bold">
              Engine &amp; Open Source
            </span>
            <a
              href="https://github.com/bretmuchow07/poster-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text2)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-1.5"
            >
              <Github size={13} />
              <span>GitHub Source Repository</span>
            </a>
            <span className="text-[var(--text2)]">100% Client-Side Processing</span>
            <span className="text-[var(--text2)]">HTML5 Canvas &amp; Fabric.js</span>
            <span className="text-[var(--text2)]">No Tracking &amp; No Data Stored</span>
            <span className="text-[var(--text2)]">300 DPI Export Standard</span>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-[var(--accent)] font-bold">
              Legal &amp; Policy
            </span>
            <Link href="/privacy" className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              Privacy Policy &amp; Terms
            </Link>
            <p className="text-[var(--text3)] leading-relaxed mt-1">
              Album artwork and artist trademarks remain the property of their respective copyright holders.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border-color)] text-xs text-[var(--text3)]">
          <span>
            © {new Date().getFullYear()} PosterMaker. Free, open-source, and private music print studio.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bretmuchow07/poster-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text2)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-1"
            >
              <Github size={13} />
              <span>GitHub</span>
            </a>
            <Link href="/editor" className="text-[var(--accent)] hover:underline font-semibold">
              Launch Studio →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
