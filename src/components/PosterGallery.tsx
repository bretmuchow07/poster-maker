'use client';

import React from 'react';
import { usePosterStore } from '@/store/posterStore';
import { Trash2, Edit, Plus } from 'lucide-react';

export function PosterGallery() {
    const { savedPosters, loadPoster, deletePoster, createNewPoster } = usePosterStore();

    return (
        <div className="p-8 w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[var(--foreground)]">Saved Posters</h2>
                <button
                    onClick={createNewPoster}
                    className="flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] px-4 py-2 rounded shadow hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    Create New
                </button>
            </div>

            {savedPosters.length === 0 ? (
                <div className="text-center py-20 bg-[var(--card)] border border-[var(--card-border)] rounded-xl">
                    <p className="text-[var(--muted)] mb-4">No saved posters yet.</p>
                    <button
                        onClick={createNewPoster}
                        className="text-[var(--accent)] hover:underline"
                    >
                        Start your first design
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPosters.map((poster) => (
                        <div key={poster.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            {/* Visual Preview (Simplified as text for now) */}
                            <div
                                className="h-48 w-full flex flex-col items-center justify-center p-4 text-center"
                                style={{ background: poster.config.backgroundColor.startsWith('linear') ? poster.config.backgroundColor : poster.config.backgroundColor }}
                            >
                                <h3
                                    className="font-bold text-xl mb-1 truncate w-full"
                                    style={{ color: poster.config.textColor, fontFamily: poster.config.fontFamily }}
                                >
                                    {poster.metadata.album}
                                </h3>
                                <p
                                    className="text-sm truncate w-full"
                                    style={{ color: poster.config.textColor, fontFamily: poster.config.fontFamily, opacity: 0.8 }}
                                >
                                    {poster.metadata.artist}
                                </p>
                            </div>

                            <div className="p-4 bg-[var(--card)]">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold text-[var(--foreground)] truncate max-w-[180px]">{poster.name}</h4>
                                        <span className="text-xs text-[var(--muted)]">
                                            {new Date(poster.lastModified).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deletePoster(poster.id)}
                                            className="p-2 text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => loadPoster(poster.id)}
                                            className="p-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded hover:opacity-90 transition-opacity"
                                            title="Open Editor"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
