'use client';
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function FinalCTA() {
    return (
        <section className="py-32 bg-[var(--background)] flex flex-col items-center justify-center px-6 text-center">
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.9,
                }}
                whileInView={{
                    opacity: 1,
                    scale: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.5,
                }}
            >
                <Link
                    href="/editor"
                    className="group relative px-10 py-5 bg-amber-500 text-black text-xl font-bold rounded-full hover:bg-amber-400 transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.5)]"
                >
                    Start Designing
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="mt-6 text-neutral-500 font-mono text-sm">
                    Free. Open-source. No sign-up.
                </p>
            </motion.div>
        </section>
    )
}
