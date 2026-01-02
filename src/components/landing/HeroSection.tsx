'use client';
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
                >
                    Design album posters. <br />
                    <span className="text-amber-500">Print-ready.</span> Open-source.
                </motion.h1>

                <motion.p
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Create high-resolution album posters with artwork, tracklists, label
                    info, and custom typography — built for artists and labels.
                </motion.p>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex flex-col items-center gap-6"
                >
                    <Link
                        href="/editor"
                        className="group relative px-8 py-4 bg-[var(--foreground)] text-[var(--background)] text-lg font-semibold rounded-full hover:bg-amber-400 transition-colors duration-300 flex items-center gap-3"
                    >
                        Create a Poster
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="text-sm text-[var(--muted)] font-mono tracking-wide">
                        No accounts. No tracking. No data stored.
                    </p>
                </motion.div>
            </div>

            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sidebar-border)] to-transparent" />
        </section>
    )
}
