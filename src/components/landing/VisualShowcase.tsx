'use client';
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function VisualShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    })
    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 0])
    const y3 = useTransform(scrollYProgress, [0, 1], [150, -150])
    return (
        <section ref={containerRef} className="py-32 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                    {/* Poster 1 - Minimal */}
                    <motion.div
                        style={{
                            y: y1,
                        }}
                        className="relative group"
                    >
                        <div className="aspect-[3/4] bg-neutral-900 rounded-sm shadow-2xl shadow-black border border-white/5 p-6 flex flex-col justify-between transform transition-transform duration-500 hover:scale-[1.02]">
                            <div className="w-full aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-sm mb-4" />
                            <div className="space-y-2">
                                <div className="h-2 w-1/2 bg-neutral-800 rounded-full" />
                                <div className="h-2 w-3/4 bg-neutral-800 rounded-full" />
                            </div>
                            <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-end">
                                <div className="h-8 w-8 bg-white/10" />
                                <div className="text-[10px] text-neutral-600 font-mono">
                                    SIDE A / SIDE B
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-center text-neutral-500 font-mono text-sm">
                            Minimal Layout
                        </p>
                    </motion.div>

                    {/* Poster 2 - Full Art */}
                    <motion.div
                        style={{
                            y: y2,
                        }}
                        className="relative group z-10"
                    >
                        <div className="aspect-[3/4] bg-neutral-800 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 to-black/80" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                <h3 className="text-4xl font-bold text-white/90 mix-blend-overlay tracking-tighter">
                                    NEON
                                    <br />
                                    NIGHTS
                                </h3>
                                <div className="mt-8 space-y-1 opacity-60">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1 w-32 bg-white/40 rounded-full mx-auto"
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Vinyl texture overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                        </div>
                        <p className="mt-4 text-center text-neutral-500 font-mono text-sm">
                            Full Art Bleed
                        </p>
                    </motion.div>

                    {/* Poster 3 - Split */}
                    <motion.div
                        style={{
                            y: y3,
                        }}
                        className="relative group"
                    >
                        <div className="aspect-[3/4] bg-[#f5f5f5] rounded-sm shadow-2xl shadow-black border border-white/5 p-4 flex flex-col transform transition-transform duration-500 hover:scale-[1.02]">
                            <div className="h-1/2 bg-black mb-4 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full border-2 border-white/20" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-4 w-2/3 bg-neutral-200" />
                                    <div className="h-2 w-full bg-neutral-200" />
                                    <div className="h-2 w-full bg-neutral-200" />
                                </div>
                                <div className="flex justify-between items-center border-t border-neutral-200 pt-4">
                                    <div className="h-6 w-12 bg-neutral-200" />
                                    <div className="h-6 w-6 bg-neutral-900 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-center text-neutral-500 font-mono text-sm">
                            Split Swiss Style
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
