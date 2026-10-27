'use client';

import React from 'react';
import { usePosterStore } from '@/store/posterStore';
import { Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';

export function PosterGallery() {
    const { savedPosters, loadPoster, deletePoster, createNewPoster } = usePosterStore();

    return (
        <div className="p-8 w-full max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight">Saved Posters</h2>
                    <p className="text-xs text-[var(--muted)] mt-1">Stored securely on your device in browser LocalStorage</p>
                </div>
                <button
                    onClick={createNewPoster}
                    className="btn btn-primary shadow-sm"
                >
                    <Plus size={16} />
                    <span>Create New Poster</span>
                </button>
            </div>

            {savedPosters.length === 0 ? (
                <div className="text-center py-20 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface2)] flex items-center justify-center mx-auto mb-3 text-[var(--accent)]">
                        <ImageIcon size={22} />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] text-base mb-1">No saved posters yet</h3>
                    <p className="text-xs text-[var(--muted)] mb-5 max-w-sm mx-auto">
                        Your designs will appear here when you click Save in the studio editor.
                    </p>
                    <button
                        onClick={createNewPoster}
                        className="btn btn-primary"
                    >
                        Start Your First Poster
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPosters.map((poster) => (
                        <div
                            key={poster.id}
                            className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
                        >
                            {/* Visual Preview Card */}
                            <div
                                className="h-56 w-full relative flex flex-col items-center justify-between p-4 overflow-hidden"
                                style={{
                                    background: poster.config.backgroundColor?.startsWith('linear')
                                        ? poster.config.backgroundColor
                                        : poster.config.backgroundColor || '#ffffff'
                                }}
                            >
                                {poster.config.backgroundImage ? (
                                    <div className="relative w-full h-36 rounded-md overflow-hidden shadow-xs border border-black/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={poster.config.backgroundImage}
                                            alt={poster.metadata.album || 'Poster Cover'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-32 rounded-md bg-black/5 dark:bg-white/5 flex items-center justify-center border border-dashed border-black/10">
                                        <span className="text-[11px] font-mono text-[var(--muted)]">Minimal Typographic</span>
                                    </div>
                                )}

                                <div className="w-full text-center mt-2">
                                    <h3
                                        className="font-bold text-sm truncate w-full"
                                        style={{
                                            color: poster.config.textColor || '#18181b',
                                            fontFamily: poster.config.fontFamily || 'sans-serif'
                                        }}
                                    >
                                        {poster.metadata.album || 'Untitled Album'}
                                    </h3>
                                    <p
                                        className="text-xs truncate w-full opacity-80"
                                        style={{
                                            color: poster.config.textColor || '#18181b',
                                            fontFamily: poster.config.fontFamily || 'sans-serif'
                                        }}
                                    >
                                        {poster.metadata.artist || 'Artist Name'}
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer Meta */}
                            <div className="p-3.5 bg-[var(--surface)] border-t border-[var(--border-color)] flex items-center justify-between mt-auto">
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface2)] text-[var(--text2)]">
                                            {poster.config.print?.preset || 'A3'}
                                        </span>
                                        <span className="text-[10px] text-[var(--muted)]">
                                            {poster.metadata.tracks?.length || 0} tracks
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-[var(--muted)] mt-1">
                                        {new Date(poster.lastModified).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => {
                                            if (confirm(`Delete "${poster.name || 'this poster'}"?`)) {
                                                deletePoster(poster.id);
                                            }
                                        }}
                                        className="p-1.5 text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                        title="Delete poster"
                                        aria-label="Delete poster"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                    <button
                                        onClick={() => loadPoster(poster.id)}
                                        className="btn btn-primary py-1 px-2.5 text-xs"
                                        title="Open in studio editor"
                                    >
                                        <Edit size={13} />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
