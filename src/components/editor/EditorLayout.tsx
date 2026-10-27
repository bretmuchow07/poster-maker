'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from './Sidebar';
import { FontLoader } from '@/components/FontLoader';
import { usePosterStore } from '@/store/posterStore';
import { PosterGallery } from '../PosterGallery';
import { Settings } from '../Settings';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    LayoutGrid,
    Settings as SettingsIcon,
    Home,
    Save,
    Undo2,
    Redo2,
    Download,
    Check,
    ChevronDown,
    Printer,
    ShieldCheck,
    Sliders,
    Github
} from 'lucide-react';

const CanvasArea = dynamic(() => import('./CanvasArea').then(m => m.CanvasArea), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[var(--text2)]">
            <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading Studio Canvas...</span>
        </div>
    )
});

export default function EditorLayout() {
    const {
        view,
        setView,
        theme,
        setTheme,
        triggerExport,
        savePoster,
        currentPosterId,
        config,
        setConfig,
        updatePrintConfig,
        metadata,
        undo,
        redo,
        canUndo,
        canRedo,
        saveStatus,
        lastSavedTime
    } = usePosterStore();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const hasIngestedParams = useRef(false);

    // Ingest deep link parameters (template, artist, album)
    useEffect(() => {
        if (hasIngestedParams.current) return;
        const tpl = searchParams.get('template');
        const artist = searchParams.get('artist');
        const album = searchParams.get('album');

        if (tpl || artist || album) {
            hasIngestedParams.current = true;
            if (tpl && ['modern', 'palette', 'minimal', 'split'].includes(tpl)) {
                setConfig({ template: tpl as 'modern' | 'palette' | 'minimal' | 'split' });
            }
            if (artist || album) {
                usePosterStore.getState().setMetadata({
                    ...(artist ? { artist } : {}),
                    ...(album ? { album } : {})
                });
            }
        }
    }, [searchParams, setConfig]);

    // Global Keyboard Shortcuts (Undo, Redo, Save)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                savePoster();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, savePoster]);

    // Close export popover on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                setIsExportOpen(false);
            }
        };
        if (isExportOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExportOpen]);

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
        <div className="app flex flex-col h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--text)]">
            <FontLoader />

            {/* STUDIO TOOLBAR */}
            <header className="toolbar flex items-center justify-between">
                {/* Brand & Main Navigation */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="brand select-none hover:opacity-80 transition-opacity"
                        title="Return to Homepage"
                    >
                        Poster<span>Maker</span>
                    </Link>

                    <div className="divider" />

                    <nav className="flex items-center gap-1" aria-label="Views">
                        <Link
                            href="/"
                            className="tbtn"
                            title="Back to Homepage"
                            aria-label="Back to Homepage"
                        >
                            <Home size={16} />
                        </Link>
                        <button
                            onClick={() => setView('editor')}
                            className={`tbtn ${view === 'editor' ? 'active' : ''}`}
                            title="Studio Canvas"
                            aria-label="Studio Canvas"
                        >
                            <Sliders size={16} />
                        </button>
                        <button
                            onClick={() => setView('gallery')}
                            className={`tbtn ${view === 'gallery' ? 'active' : ''}`}
                            title="My Saved Posters"
                            aria-label="My Saved Posters"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setView('settings')}
                            className={`tbtn ${view === 'settings' ? 'active' : ''}`}
                            title="Preferences & Settings"
                            aria-label="Preferences & Settings"
                        >
                            <SettingsIcon size={16} />
                        </button>
                        <ThemeToggle size={16} />
                        <a
                            href="https://github.com/bretmuchow07/poster-maker"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tbtn"
                            title="View Source on GitHub"
                            aria-label="View Source on GitHub"
                        >
                            <Github size={16} />
                        </a>
                    </nav>

                    {view === 'editor' && (
                        <>
                            <div className="divider" />

                            {/* History Controls */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={undo}
                                    disabled={!canUndo()}
                                    className="tbtn"
                                    title="Undo (Ctrl+Z)"
                                    aria-label="Undo"
                                >
                                    <Undo2 size={16} />
                                </button>
                                <button
                                    onClick={redo}
                                    disabled={!canRedo()}
                                    className="tbtn"
                                    title="Redo (Ctrl+Y)"
                                    aria-label="Redo"
                                >
                                    <Redo2 size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Center Document Title */}
                {view === 'editor' && (
                    <div className="hidden md:flex items-center gap-2 text-xs text-[var(--text2)] max-w-sm truncate">
                        <span className="font-semibold text-[var(--text)] truncate">
                            {metadata.album || 'Untitled Album'}
                        </span>
                        <span className="opacity-40">•</span>
                        <span className="truncate">{metadata.artist || 'Artist Name'}</span>
                    </div>
                )}

                {/* Actions & Export */}
                {view === 'editor' && (
                    <div className="flex items-center gap-2">
                        {/* Save Confirmation Badge */}
                        {saveStatus === 'saved' && (
                            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 animate-fade-in">
                                <Check size={13} />
                                <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}</span>
                            </div>
                        )}

                        <button
                            onClick={savePoster}
                            className="btn"
                            title="Save design to browser storage (Ctrl+S)"
                        >
                            <Save size={14} />
                            <span>{currentPosterId ? 'Update' : 'Save'}</span>
                        </button>

                        {/* Export Menu Popover */}
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() => setIsExportOpen(!isExportOpen)}
                                className="btn btn-primary"
                                title="Export print-ready file"
                            >
                                <Download size={14} />
                                <span>Export</span>
                                <ChevronDown size={13} className={`transition-transform duration-150 ${isExportOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isExportOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl shadow-2xl p-4 z-50 text-xs animate-fade-in space-y-3.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                                        <span className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                                            <Printer size={13} className="text-[var(--accent)]" />
                                            Print & Export Options
                                        </span>
                                        <span className="text-[10px] text-[var(--text3)] font-mono">
                                            {config.width}×{config.height}px
                                        </span>
                                    </div>

                                    {/* Format Selection */}
                                    <div>
                                        <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">File Format</label>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {(['png', 'jpg', 'pdf'] as const).map(fmt => (
                                                <button
                                                    key={fmt}
                                                    onClick={() => setConfig({ exportFormat: fmt })}
                                                    className={`py-1.5 px-2 text-center rounded-md font-medium uppercase text-[11px] border transition-all ${config.exportFormat === fmt ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--surface2)] text-[var(--text2)] border-[var(--border-color)] hover:border-[var(--border-hover)]'}`}
                                                >
                                                    {fmt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Print DPI Selection */}
                                    <div>
                                        <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Target Resolution</label>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {[
                                                { dpi: 72, label: '72 DPI', sub: 'Web' },
                                                { dpi: 150, label: '150 DPI', sub: 'Proof' },
                                                { dpi: 300, label: '300 DPI', sub: 'Print' },
                                            ].map(item => (
                                                <button
                                                    key={item.dpi}
                                                    onClick={() => updatePrintConfig({ dpi: item.dpi as any })}
                                                    className={`py-1 px-2 rounded-md border text-center transition-all ${config.print?.dpi === item.dpi ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)] font-semibold' : 'bg-[var(--surface2)] text-[var(--text2)] border-[var(--border-color)] hover:border-[var(--border-hover)]'}`}
                                                >
                                                    <div className="text-[11px]">{item.label}</div>
                                                    <div className="text-[9px] opacity-70">{item.sub}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quality Slider for JPG */}
                                    {config.exportFormat === 'jpg' && (
                                        <div>
                                            <div className="flex justify-between items-center text-[11px] mb-1">
                                                <span className="font-medium text-[var(--text2)]">JPEG Quality</span>
                                                <span className="font-mono text-[var(--text3)]">{Math.round((config.exportQuality || 1) * 100)}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="1"
                                                step="0.05"
                                                value={config.exportQuality ?? 1}
                                                onChange={(e) => setConfig({ exportQuality: parseFloat(e.target.value) })}
                                                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    {/* Download Button */}
                                    <button
                                        onClick={() => {
                                            setIsExportOpen(false);
                                            triggerExport(config.exportFormat || 'png', config.exportQuality || 1, config.exportTransparent || false);
                                        }}
                                        className="btn btn-primary w-full py-2 flex items-center justify-center gap-2 font-semibold shadow-sm"
                                    >
                                        <Download size={14} />
                                        <span>Download {config.exportFormat?.toUpperCase() || 'PNG'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN WORKSPACE AREA */}
            <div className="main flex-1 flex overflow-hidden">
                {/* STUDIO SIDEBAR */}
                {view === 'editor' && (
                    <aside className="sidebar z-20">
                        <Sidebar />
                    </aside>
                )}

                {/* CANVAS WORKSPACE */}
                <main className="flex-1 overflow-auto flex justify-center items-center relative bg-[var(--studio-canvas-bg)]">
                    {renderContent()}
                </main>
            </div>

            {/* STUDIO STATUS BAR */}
            <footer className="status-bar select-none">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="font-semibold text-[var(--text)]">
                        {view === 'editor' ? 'Poster Studio' : view === 'gallery' ? 'My Posters' : 'Settings'}
                    </span>
                    {view === 'editor' && (
                        <>
                            <span className="opacity-40">•</span>
                            <span className="text-[var(--text2)]">
                                {config.print?.preset ? config.print.preset.toUpperCase() : 'CUSTOM'} ({config.width}×{config.height}px)
                            </span>
                            <span className="opacity-40">•</span>
                            <span className="text-[var(--text3)]">
                                Template: <strong className="capitalize text-[var(--text2)]">{config.template}</strong>
                            </span>
                        </>
                    )}
                </div>

                <div className="flex-1" />

                <div className="hidden sm:flex items-center gap-3 text-[var(--text3)]">
                    <a
                        href="https://github.com/bretmuchow07/poster-maker"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[var(--text)] transition-colors"
                        title="GitHub Repository"
                    >
                        <Github size={12} />
                        <span>GitHub</span>
                    </a>
                    <span className="opacity-40">•</span>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>Client-side local processing • 100% private</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
