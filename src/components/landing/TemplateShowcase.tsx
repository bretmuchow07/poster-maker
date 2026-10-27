'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TEMPLATES = [
  {
    id: 'palette',
    name: 'Swiss Palette Grid',
    inspiredBy: 'Asymmetric 2-Column Swiss Grid',
    description:
      'A structured 2-column Swiss modernist layout featuring a framed cover, 5 extracted color swatches, an ordered tracklist, label and runtime metadata, and an artist signature layer.',
    bg: '#F5F3EE',
    textColor: '#14171A',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdc3pScOq7iwApF_pMJm3Ykq6qDv6lpHtCl7A2xKuAJiXUx4l1zWeBAU8I8Vov8j_9se74Gd15pgygF_AQuCNj6r70evMdAfKozjhACEo7GvSG7d4n25NsWw6WdCynSObLDQF8j2zaoL5lwLqgOZfLUwEZdMfsMagChq3xFX4s7GWL_VzWwZVfZmtkhmntt-FbLmk5cCosZF9S7sUYJ6qpeZ2DrwRznil1dX4FWnlz-udChC59KCnY',
    query: 'template=palette&artist=Echo+Velocity&album=Neo-Construct+04',
  },
  {
    id: 'minimal',
    name: 'Brutalist Inset Rule',
    inspiredBy: 'Fine Hairline Inset & Slashed Typography',
    description:
      'Solid colored editorial paper framed by a fine hairline inset border. Features an inline slashed tracklist above the artwork and high-impact grotesque typography below.',
    bg: '#F5A8B8',
    textColor: '#121315',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9vX4P-g98HdPki1CekOA_pxSdvtMzfDFxQUrXUnZoZZROY5wN31KpppNlJyLyBxbZgs6vQ4dM66lqpurmVGO9ykDswirDnsUXoIPxnwbO-UOViWK8aeqcR_XTgAucE7EUPbtTbljNNbmzVmL8w1jS2szNf5PO5CTifwPTR5DYHHTE9qV4aS7LjW7kmMxuAmcgItyNqlDqKMHLpjJdTz88GwAVSvyC_e5xzpraES5-zBBitynAoy1K',
    query: 'template=minimal&artist=Studio+Recordings&album=Chromatic+Static',
  },
  {
    id: 'split',
    name: 'Cinematic Split',
    inspiredBy: 'Photographic Edge Fade & Blur Echo',
    description:
      'Upper photographic bleed fading into dark paper with an edge blend. Paired with a kinetic blur title echo and a balanced 2-column tracklist with feature credits.',
    bg: '#0E0E10',
    textColor: '#E3E2E5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2NkY8wjVm-YQoyGOYT8MBoOaMxVH_wMmGYF0aTyxh58kf6k8sv3xDpZPOVLXukDcf9jlaoUL6VDE4y8E7SG2PgTK1rLehBsFd1OdCMnh_YZapph_Xm0BqUNJWxE6Jmw8eSqqHHQvcefZW10srssjb7E_otr_INazRmb2GBCcfytTJw_AyLCy0smNv9U0MMftLRYWDMLm4pFHOZhi0AHWGvlg58MQT2c0Gc1E_G16fVz3vVOg5Ar45',
    query: 'template=split&artist=Solene+Grey&album=Nocturne+Protocol',
  },
  {
    id: 'modern',
    name: 'Modern Studio',
    inspiredBy: 'Edge-to-Edge Vinyl Sleeve Edition',
    description:
      'Dominant edge-to-edge album artwork taking center stage, accompanied by bold stacked artist titles, an optional scannable streaming QR code, and a parental advisory badge.',
    bg: '#141416',
    textColor: '#FFFFFF',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBibAuWFqRdxG06qQ4XNcjWD6os1Wdis0lNRvdYpZeKHYC-LprV173q7NtqmoZnUq-UCGOBaqVcOz4mdzaRRfYeB4B-OFgrVjBG4weBI83016Z_zneHqeKm7vWQI8cREm-GLlVPlQuR7YlE83LpmeH56ak5w7h_HT6gc8jRq83XGB4_hzXnZKE3-E5Avr_ChU9o0gu7CrmG6v3L1eEpY2ZaszAJEHJu7YGPp0ZTKwAOmcpPmDf6OjwT',
    query: 'template=modern',
  },
];

export function TemplateShowcase() {
  return (
    <section className="w-full px-4 sm:px-8 py-20 bg-[var(--bg)] transition-colors duration-200" id="templates">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-[var(--text)] font-extrabold tracking-tight">
            Four Iconic Layout Archetypes
          </h2>
          <p className="text-sm sm:text-base text-[var(--text2)] mt-2 leading-relaxed">
            Every template is fully customizable: change fonts, colors, borders, image positioning, and tracklist flows with intuitive controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tmpl, idx) => (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="flex"
            >
              <Link
                href={`/editor?${tmpl.query}`}
                className="bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--surface2)] p-5 rounded-xl shadow-lg flex flex-col justify-between gap-4 group transition-all duration-200 w-full"
              >
                <div className="flex flex-col gap-3">
                  <div
                    style={{ backgroundColor: tmpl.bg, color: tmpl.textColor }}
                    className="w-full aspect-[4/5] p-4 rounded-lg flex flex-col justify-between shadow-inner relative overflow-hidden"
                  >
                    <div className="w-full h-32 rounded bg-black/10 overflow-hidden">
                      <img
                        src={tmpl.image}
                        alt={tmpl.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col gap-1 pt-2">
                      <span className="font-display text-sm font-bold uppercase truncate">
                        {tmpl.name}
                      </span>
                      <span className="text-[9px] font-mono opacity-70 truncate">
                        {tmpl.inspiredBy}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <h3 className="font-display text-base uppercase text-[var(--text)] font-bold">
                      {tmpl.name}
                    </h3>
                    <ArrowUpRight size={16} className="text-[var(--text3)] group-hover:text-[var(--accent)] transition-colors" />
                  </div>

                  <p className="text-xs text-[var(--text2)] leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] font-mono text-[10px] text-[var(--accent)] font-semibold flex items-center justify-between">
                  <span>OPEN TEMPLATE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
