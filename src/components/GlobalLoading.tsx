'use client';

import React from 'react';
import { usePosterStore } from '@/store/posterStore';
import { Loader2 } from 'lucide-react';

export function GlobalLoading() {
    const { isLoading } = usePosterStore();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)]" />
                <p className="text-sm font-medium tracking-wider uppercase animate-pulse">Processing...</p>
            </div>
        </div>
    );
}
