import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 md:p-20">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft size={16} />
                    Back to Studio Home
                </Link>

                <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>

                <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
                    <p className="text-[var(--foreground)]">
                        PosterMaker is designed as an offline-capable, browser-native creative tool with privacy by design:
                    </p>

                    <section className="space-y-2 bg-[var(--surface)] p-6 rounded-xl border border-[var(--sidebar-border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">Zero Remote Tracking</h2>
                        <p className="text-sm">
                            We do not collect, store, or transmit any personal data. There are no tracking scripts, telemetry analytics, or advertising cookies loaded anywhere on this site.
                        </p>
                    </section>

                    <section className="space-y-2 bg-[var(--surface)] p-6 rounded-xl border border-[var(--sidebar-border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">100% In-Browser Rendering</h2>
                        <p className="text-sm">
                            All image processing, color extraction, and canvas rasterization execute directly inside your browser's WebGL / 2D Canvas context. Your album art and typography are never uploaded to a cloud server.
                        </p>
                    </section>

                    <section className="space-y-2 bg-[var(--surface)] p-6 rounded-xl border border-[var(--sidebar-border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">Client-Side Local Storage</h2>
                        <p className="text-sm">
                            Your saved poster templates and active projects are stored exclusively in your browser's private `localStorage`. You can wipe or export this data at any time from your browser settings or within the app gallery.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-[var(--sidebar-border)] text-xs font-mono text-[var(--muted-foreground)]">
                        Last reviewed: 2025 • Open Source MIT License
                    </div>
                </div>
            </div>
        </div>
    );
}
