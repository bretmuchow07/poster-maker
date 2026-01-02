'use client';

import { useEffect } from 'react';
import { usePosterStore } from '@/store/posterStore';

const SYSTEM_FONTS = new Set([
    'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'serif', 'sans-serif'
]);

export function FontLoader() {
    const fontFamily = usePosterStore((state) => state.config.fontFamily);

    useEffect(() => {
        if (!fontFamily || SYSTEM_FONTS.has(fontFamily)) return;

        const fontId = `font-${fontFamily.replace(/\s+/g, '-')}`;

        // Check if already loaded
        if (document.getElementById(fontId)) return;

        // Create link
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        // Requesting a range of weights to ensure bold/light variations work if available
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;

        document.head.appendChild(link);

        return () => {
            // Optional: Cleanup if we wanted to unload fonts, but usually better to keep them caching
        };
    }, [fontFamily]);

    return null;
}
