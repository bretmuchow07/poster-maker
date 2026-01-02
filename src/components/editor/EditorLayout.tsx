'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from './Sidebar';
import { FontLoader } from '@/components/FontLoader';
import { usePosterStore } from '@/store/posterStore';
import { PosterGallery } from '../PosterGallery';
import { Settings } from '../Settings';
import { LayoutGrid, Settings as SettingsIcon, Home, Save } from 'lucide-react';

const CanvasArea = dynamic(() => import('./CanvasArea').then(m => m.CanvasArea), {
    ssr: false,
    loading: () => <div className="flex-1 flex items-center justify-center text-neutral-500">Loading Editor...</div>
});

export default function EditorLayout() {
    const { view, setView, triggerExport, savePoster, currentPosterId, config } = usePosterStore();

    // Init Theme
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme && theme !== 'system') {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, []);

    const renderContent = () => {
        switch (view) {
            case 'gallery':
                return <PosterGallery />;
            case 'settings':
                return <Settings />;
            case 'editor':
            default:
                return <CanvasArea />;
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-sans">
            <FontLoader />
            {/* Sidebar - Only visible in Editor Mode */}
            {view === 'editor' && (
                <aside className="w-80 flex-shrink-0 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] overflow-y-auto z-20">
                    <Sidebar />
                </aside>
            )}

            {/* Main Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[var(--background)]">
                {/* Header */}
                <header className="h-14 border-b border-[var(--card-border)] flex items-center px-6 justify-between bg-[var(--background)]/80 backdrop-blur z-20">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setView('gallery')}>
                            <h1 className="font-bold text-lg tracking-tight text-[var(--foreground)]">Poster<span className="text-[var(--accent)]">Maker</span></h1>
                        </div>

                        <nav className="flex gap-1">
                            <button
                                onClick={() => setView('editor')}
                                className={`p-2 rounded-md transition-colors ${view === 'editor' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--muted)] hover:bg-[var(--sidebar-bg)]'}`}
                                title="Editor"
                            >
                                <Home size={18} />
                            </button>
                            <button
                                onClick={() => setView('gallery')}
                                className={`p-2 rounded-md transition-colors ${view === 'gallery' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--muted)] hover:bg-[var(--sidebar-bg)]'}`}
                                title="My Posters"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setView('settings')}
                                className={`p-2 rounded-md transition-colors ${view === 'settings' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--muted)] hover:bg-[var(--sidebar-bg)]'}`}
                                title="Settings"
                            >
                                <SettingsIcon size={18} />
                            </button>
                        </nav>
                    </div>

                    <div className="flex gap-2">
                        {view === 'editor' && (
                            <>
                                <button
                                    onClick={savePoster}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--sidebar-bg)] rounded transition-colors"
                                >
                                    <Save size={16} />
                                    {currentPosterId ? 'Update' : 'Save'}
                                </button>
                                <button onClick={() => triggerExport(config.exportFormat, config.exportQuality, config.exportTransparent)} className="px-4 py-2 bg-[var(--accent)] hover:opacity-90 text-[var(--accent-foreground)] rounded text-sm font-medium transition-colors shadow-sm">
                                    Export
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto flex justify-center items-center relative">
                    {renderContent()}
                </div>

                {/* Footer */}
                <footer className="py-2 text-center text-[10px] uppercase tracking-widest text-[var(--muted)] border-t border-[var(--card-border)] bg-[var(--background)]">
                    bret's corner presents...
                </footer>
            </main>
        </div>
    );
}
