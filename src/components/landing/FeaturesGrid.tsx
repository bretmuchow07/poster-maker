'use client';
import React from 'react'
import { motion } from 'framer-motion'
import {
    LayoutTemplate,
    Type,
    Disc,
    QrCode,
    Printer,
    Download,
} from 'lucide-react'

const features = [
    {
        icon: LayoutTemplate,
        text: 'Album artwork + tracklist layouts',
    },
    {
        icon: Type,
        text: 'Custom fonts and typography control',
    },
    {
        icon: Disc,
        text: 'Label & release metadata fields',
    },
    {
        icon: QrCode,
        text: 'QR codes for streaming or shops',
    },
    {
        icon: Printer,
        text: 'Print sizes from digital to A2',
    },
    {
        icon: Download,
        text: 'Download as high-res PNG or PDF',
    },
]

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#f5f5f5] mb-6 tracking-tight">
                        What you can make
                    </h2>
                    <div className="h-1 w-20 bg-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                            className="flex items-start gap-4 group"
                        >
                            <div className="p-3 rounded-lg bg-neutral-900 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <p className="text-lg text-neutral-300 font-light pt-2 leading-tight">
                                {feature.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
