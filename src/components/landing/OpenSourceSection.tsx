import React from 'react'
import { Github } from 'lucide-react'

export function OpenSourceSection() {
    return (
        <section className="py-24 bg-[#0a0a0a] text-center px-6">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-[#f5f5f5] mb-8">
                    Open Source & Privacy
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left bg-neutral-900/50 p-8 rounded-2xl border border-white/5">
                    <div>
                        <h3 className="text-amber-500 font-semibold mb-2">
                            Transparency First
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Our code is open for anyone to inspect. We believe creative tools
                            should be accessible and transparent.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-amber-500 font-semibold mb-2">
                            Zero Data Collection
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Everything runs in your browser. No analytics, no tracking pixels,
                            no user accounts. Your designs stay on your device.
                        </p>
                    </div>
                </div>

                <a
                    href="https://github.com/bretmuchow07/poster-maker"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors border-b border-neutral-700 hover:border-white pb-1"
                >
                    <Github className="w-4 h-4" />
                    <span>View the source on GitHub</span>
                </a>
            </div>
        </section>
    )
}
