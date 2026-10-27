'use client';

import { useEffect } from 'react';
import { usePosterStore } from '@/store/posterStore';

const SYSTEM_FONTS = new Set([
    'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'serif', 'sans-serif'
]);

function loadGoogleFont(fontName: string) {
    if (!fontName || SYSTEM_FONTS.has(fontName)) return;

    const fontId = `font-${fontName.replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return;

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    // Request font with display=swap
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}&display=swap`;
    document.head.appendChild(link);
}

export function FontLoader() {
    const fontFamily = usePosterStore((state) => state.config.fontFamily);
    const signatureFont = usePosterStore((state) => state.config.signature?.fontFamily);

    useEffect(() => {
        if (fontFamily) {
            loadGoogleFont(fontFamily);
        }
        if (signatureFont) {
            loadGoogleFont(signatureFont);
        }
    }, [fontFamily, signatureFont]);

    return null;
}
