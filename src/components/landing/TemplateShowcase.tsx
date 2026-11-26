'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TEMPLATES = [
  {
    id: 'cosmos',
    name: 'Archival Linen Atelier',
    badge: 'NEW ARCHETYPE',
    description: 'Unprimed linen canvas, optical didone whisper serif typography, 8-dot registration mark, and 5-swatch palette row.',
    image: '/examples/cosmos.png',
    link: '/editor?template=cosmos&artist=Echo+Velocity&album=Linen+Gallery+Archive',
  },
  {
    id: 'palette',
    name: 'Swiss Palette Grid',
    badge: 'CLASSIC MODERNIST',
    description: 'Asymmetric 2-column modernist grid with framed artwork, 5 extracted color swatches, ordered tracklist, and signature layer.',
    image: '/examples/palette.png',
    link: '/editor?template=palette&artist=Echo+Velocity&album=Neo-Construct+04',
  },
  {
    id: 'minimal',
    name: 'Brutalist Inset Rule',
    badge: 'EDITORIAL PAPER',
    description: 'Solid editorial paper framed by a fine hairline inset border. Inline slashed tracklist stream above the artwork with grotesque typography below.',
    image: '/examples/minimal.png',
    link: '/editor?template=minimal&artist=Studio+Recordings&album=Chromatic+Static',
  },
  {
    id: 'split',
    name: 'Cinematic Split',
    badge: 'EDGE BLEND',
    description: 'Upper photographic bleed fading into dark paper with baked alpha edge blending, paired with kinetic blur title echo and 2-column tracks.',
    image: '/examples/split.png',
    link: '/editor?template=split&artist=Solene+Grey&album=Nocturne+Protocol',
  },
  {
    id: 'modern',
    name: 'Modern Studio',
    badge: 'VINYL SLEEVE',
    description: 'Edge-to-edge album artwork taking center stage, accompanied by bold stacked artist titles, streaming QR code, and parental advisory badge.',
    image: '/examples/modern.png',
    link: '/editor?template=modern',
  },
];

export function TemplateShowcase() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 max-w-7xl mx-auto bg-[var(--bg)] transition-colors duration-300" id="templates">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span className="font-serif-display text-[13px] sm:text-[14px] text-[var(--text)] uppercase tracking-normal font-medium block mb-2">
            ARCHIVAL ARCHETYPES
          </span>
          <h2 className="font-serif-display text-[var(--text)] text-3xl sm:text-4xl md:text-[38px] leading-[1.08] tracking-[-1.52px] font-[350]">
            Five distinct drafting frameworks.
          </h2>
        </div>
        <p className="text-[var(--text2)] text-base max-w-md font-normal leading-relaxed">
          Every archetype comes pre-calibrated with baseline grids, typographic hierarchy, and palette sampling. Click any design to launch directly in the atelier.
        </p>
      </div>

      {/* 5 Archetypes Grid with HyperFrames InView and Spring Hover Lift */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl, idx) => (
          <motion.div
            key={tmpl.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col group cursor-pointer"
          >
            {/* Card Image Container (16px radius, edge-to-edge image) */}
            <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-[var(--surface2)] border border-[var(--border-color)] shadow-sm group-hover:shadow-lg transition-all duration-300">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url('${tmpl.image}')` }}
              />

              {/* Archetype Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[11px] font-mono uppercase px-2.5 py-1 bg-[var(--surface)]/90 backdrop-blur-sm text-[var(--text)] rounded-full border border-[var(--border-color)] font-semibold tracking-wider shadow-xs">
                  {tmpl.badge}
                </span>
              </div>

              {/* Hover CTA Link Overlay */}
              <Link
                href={tmpl.link}
                className="absolute inset-0 z-10 flex items-end p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--surface)] text-[var(--text)] text-[14px] font-medium rounded-[16px] shadow-sm">
                  <span>Open Archetype</span>
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </div>

            {/* Typography below the card */}
            <div className="pt-4 flex flex-col gap-1">
              <Link
                href={tmpl.link}
                className="font-serif-display text-[18px] text-[var(--text)] leading-[1.29] tracking-[-0.2px] font-medium hover:opacity-80 transition-opacity"
              >
                {tmpl.name}
              </Link>
              <p className="text-[14px] text-[var(--text2)] leading-relaxed font-normal">
                {tmpl.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
