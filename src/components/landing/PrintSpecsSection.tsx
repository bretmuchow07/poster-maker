'use client';

import React from 'react';

const SIZES = [
  {
    category: 'International A-Series',
    items: [
      { name: 'A4', dim: '210 × 297 mm', use: 'Compact framing & desktop prints' },
      { name: 'A3', dim: '297 × 420 mm', use: 'Most popular bedroom & studio wall size' },
      { name: 'A2', dim: '420 × 594 mm', use: 'Large format statement art' },
    ],
  },
  {
    category: 'Standard US Frames',
    items: [
      { name: '12 × 12″', dim: '305 × 305 mm', use: 'Exact 1:1 vinyl sleeve square frame' },
      { name: '18 × 24″', dim: '457 × 610 mm', use: 'Standard retail gallery frame' },
      { name: '24 × 36″', dim: '610 × 914 mm', use: 'Classic large concert & tour poster' },
    ],
  },
];

export function PrintSpecsSection() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] border-b border-[var(--border-color)] transition-colors duration-200" id="formats">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-[var(--text)] font-extrabold tracking-tight">
            Standard Print Dimensions &amp; Export Formats
          </h2>
          <p className="text-sm sm:text-base text-[var(--text2)] mt-2 leading-relaxed">
            PosterMaker exports high-resolution files pre-sized for standard picture frames, so you can send them straight to your local print shop or online service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SIZES.map((col, idx) => (
            <div key={idx} className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl shadow-lg flex flex-col gap-4">
              <span className="font-mono text-xs text-[var(--accent)] font-bold uppercase tracking-wider">
                {col.category}
              </span>

              <div className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center p-3 rounded bg-[var(--surface2)] border border-[var(--border-color)]">
                    <div>
                      <span className="font-display text-base uppercase text-[var(--text)] font-bold block">
                        {item.name}
                      </span>
                      <span className="text-xs text-[var(--text2)]">
                        {item.use}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                      {item.dim}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Export Quality Banner */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl shadow flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-base uppercase text-[var(--text)] font-bold">
              Export Formats: PNG, JPG, or PDF
            </span>
            <span className="text-xs text-[var(--text2)]">
              Choose 72 DPI for web sharing, 150 DPI for everyday desk prints, or 300 DPI for crisp gallery printing.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 bg-[var(--surface2)] text-[var(--text)] rounded border border-[var(--border-color)]">
              300 DPI
            </span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[var(--surface2)] text-[var(--text)] rounded border border-[var(--border-color)]">
              CMYK-Friendly
            </span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[var(--surface2)] text-[var(--text)] rounded border border-[var(--border-color)]">
              No Watermark
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
