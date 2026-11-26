import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PressroomLockupStacked } from '@/components/PressroomBrand';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 md:p-20">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft size={16} />
                    Back to Studio Home
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-[var(--sidebar-border)]">
                    <div className="shrink-0">
                        <PressroomLockupStacked className="w-32 sm:w-36 h-auto text-[var(--text)]" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif-display text-4xl font-[350] tracking-tight">Privacy Policy</h1>
                        <p className="text-[var(--foreground)]">
                            Pressroom is designed as an offline-capable, browser-native music print studio with privacy by design:
                        </p>
                    </div>
                </div>

                <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">

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

                    <div className="pt-6 border-t border-[var(--sidebar-border)] flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
                        <span>Last reviewed: 2026 • Pressroom (PR–001) • Open Source MIT License</span>
                        <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
                            About Pressroom
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
