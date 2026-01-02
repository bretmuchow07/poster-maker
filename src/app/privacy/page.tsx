import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-20">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold">Privacy Policy</h1>

                <div className="space-y-6 text-neutral-300 leading-relaxed">
                    <p>
                        This application is designed with privacy as a core principle. Here is what you need to know:
                    </p>

                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">No Data Collection</h2>
                        <p>
                            We do not collect, store, or transmit any personal data using this application.
                            There are no accounts, no analytics, and no tracking cookies.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">Local Processing</h2>
                        <p>
                            All image processing happens directly in your browser. When you upload an image for your poster,
                            it stays on your device. It is never uploaded to any server.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">Local Storage</h2>
                        <p>
                            We use your browser's Local Storage to save your poster designs so you can come back to them later.
                            This data lives only on your device and can be cleared by you at any time.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-sm text-neutral-500">
                        Last updated: January 2025
                    </div>
                </div>
            </div>
        </div>
    );
}
