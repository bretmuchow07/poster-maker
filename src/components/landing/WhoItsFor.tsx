'use client';
import React from 'react'
import { motion } from 'framer-motion'

const personas = [
    'Independent Artists',
    'Record Labels',
    'Graphic Designers',
    'Music Archivists',
    'Super Fans',
]

export function WhoItsFor() {
    return (
        <section className="py-20 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-sm font-mono text-neutral-500 mb-12 uppercase tracking-widest">
                    Built For
                </h2>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {personas.map((persona, index) => (
                        <motion.span
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: index * 0.1,
                            }}
                            className="text-2xl md:text-4xl font-bold text-neutral-700 hover:text-[#f5f5f5] transition-colors duration-500 cursor-default"
                        >
                            {persona}
                            {index !== personas.length - 1 && (
                                <span className="text-neutral-800 ml-4 md:ml-8">/</span>
                            )}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    )
}
