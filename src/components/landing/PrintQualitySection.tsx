'use client';
import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function PrintQualitySection() {
    return (
        <section className="py-24 bg-neutral-900/30 border-y border-white/5">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -20,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-6 tracking-tight">
                            Built for <span className="text-amber-500">Print</span> & Digital
                        </h2>
                        <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
                            Posters are rendered at full resolution and designed to scale
                            cleanly from social media to physical print. We handle the
                            technical details so you can focus on the design.
                        </p>

                        <ul className="space-y-4">
                            {[
                                'DPI control (72 / 150 / 300)',
                                'Standard sizes (A-series, Square, Letter)',
                                'Bleed and margin awareness',
                                'Vector-sharp typography',
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-3 text-neutral-300"
                                >
                                    <Check className="w-5 h-5 text-amber-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="relative"
                    >
                        {/* Abstract representation of print marks/bleed */}
                        <div className="aspect-square bg-[#0a0a0a] border border-white/10 p-8 relative">
                            {/* Corner Crop Marks */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/50" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/50" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/50" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/50" />

                            {/* Content */}
                            <div className="w-full h-full border border-dashed border-neutral-700 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-neutral-800">300</div>
                                    <div className="text-sm font-mono text-neutral-600 mt-2">
                                        DPI READY
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
