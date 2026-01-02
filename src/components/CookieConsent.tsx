"use client";

import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check localStorage for previous consent
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Simulate delay for smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "essential_only");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm w-full">
            <div className="panel p-6 border-l-4 border-[var(--primary)] bg-[var(--surface)] shadow-2xl">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                        <Shield className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Cookies & Local Storage</h3>
                    </div>
                </div>

                <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                    This app does not track you or collect personal data.
                    We only use essential storage to remember your preferences.
                </p>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleAccept}
                        className="btn-primary flex-1 text-sm py-2.5"
                    >
                        Accept essential
                    </button>

                    <Link
                        href="/privacy"
                        className="text-sm font-medium text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                    >
                        Learn more
                    </Link>
                </div>
            </div>
        </div>
    );
}
