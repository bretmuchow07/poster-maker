import React from 'react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="py-8 bg-[var(--background)] border-t border-[var(--sidebar-border)]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--muted-foreground)]">
                <div className="flex gap-6">
                    <a href="#" className="hover:text-neutral-400 transition-colors">
                        GitHub
                    </a>
                    <a href="https://github.com/bretmuchow07/poster-maker" className="hover:text-neutral-400 transition-colors">
                        License
                    </a>
                    <Link href="/privacy" className="hover:text-neutral-400 transition-colors">
                        Privacy
                    </Link>
                </div>
                <div>© {new Date().getFullYear()} Open Poster Tool. MIT License.</div>
            </div>
        </footer>
    )
}
