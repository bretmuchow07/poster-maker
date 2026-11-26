'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SIZES = [
  {
    category: 'International ISO A-Series',
    items: [
      { name: 'A4', dim: '210 × 297 mm', use: 'Compact desk framing & archival folios' },
      { name: 'A3', dim: '297 × 420 mm', use: 'Most popular studio & gallery wall format' },
      { name: 'A2', dim: '420 × 594 mm', use: 'Large format exhibition statement artwork' },
    ],
  },
  {
    category: 'Standard US Gallery Frames',
    items: [
      { name: '12 × 12″', dim: '305 × 305 mm', use: '1:1 vinyl sleeve collector square' },
      { name: '18 × 24″', dim: '457 × 610 mm', use: 'Standard retail frame off-the-shelf' },
      { name: '24 × 36″', dim: '610 × 914 mm', use: 'Concert tour print & museum mount' },
    ],
  },
];

export function PrintSpecsSection() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] border-b border-[var(--border-color)] transition-colors duration-300" id="formats">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="max-w-2xl">
          <span className="font-serif-display text-[13px] sm:text-[14px] text-[var(--text)] uppercase tracking-normal font-medium block mb-2">
            PHYSICAL SPECIFICATIONS
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[var(--text)] font-[350] tracking-[-1.32px] leading-[1.1]">
            Calibrated for standard retail frames.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[var(--text2)] mt-2 leading-relaxed font-normal">
            Export 300 DPI high-density print files calibrated for standard frames without custom matting costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SIZES.map((col, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="bg-[var(--surface)] border border-[var(--border-color)] p-6 sm:p-8 rounded-[16px] flex flex-col gap-5 select-none shadow-xs transition-shadow hover:shadow-md"
            >
              <span className="font-serif-display text-[14px] text-[var(--text)] font-medium uppercase tracking-tight">
                {col.category}
              </span>

              <div className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--border-color)] transition-colors"
                  >
                    <div>
                      <span className="font-serif-display text-[16px] text-[var(--text)] font-medium block">
                        {item.name}
                      </span>
                      <span className="text-[13px] text-[var(--text2)] font-normal">
                        {item.use}
                      </span>
                    </div>
                    <span className="font-mono text-[13px] text-[var(--text)] px-2.5 py-1 rounded-[8px] bg-[var(--surface)] border border-[var(--border-color)]">
                      {item.dim}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
