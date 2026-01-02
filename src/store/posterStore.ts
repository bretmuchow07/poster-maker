import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PosterMetadata {
  artist: string;
  album: string;
  year: string;
  tracks: { title: string; duration: string }[];
  label?: string;
}

export interface PosterConfig {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string; // Data URL or Object URL
  textColor: string;
  fontFamily: string;
  template: 'modern' | 'split' | 'minimal';
  exportTrigger: number; // Increment to trigger export

  // Advanced settings
  artistFontSize?: number;
  albumFontSize?: number;
  tracklistFontSize?: number;

  artistFontWeight?: number | string;
  albumFontWeight?: number | string;
  tracklistFontWeight?: number | string;
  artistColor?: string;
  albumColor?: string;
  tracklistIndent?: number;
  padding?: number;

  // Position overrides (drag & drop)
  artistPosition?: { left: number; top: number };
  albumPosition?: { left: number; top: number };
  tracklistPosition?: { left: number; top: number };

  // Alignment settings
  artistAlign?: 'left' | 'center' | 'right';
  albumAlign?: 'left' | 'center' | 'right';
  tracklistAlign?: 'left' | 'center' | 'right';
}

export interface SavedPoster {
  id: string;
  name: string;
  lastModified: number;
  config: PosterConfig;
  metadata: PosterMetadata;
}

export interface PosterState {
  metadata: PosterMetadata;
  config: PosterConfig;

  // App State
  view: 'editor' | 'gallery' | 'settings';
  savedPosters: SavedPoster[];
  currentPosterId: string | null;

  // Actions
  setMetadata: (metadata: Partial<PosterMetadata>) => void;
  setConfig: (config: Partial<PosterConfig>) => void;
  updateTrack: (index: number, track: Partial<{ title: string; duration: string }>) => void;
  addTrack: () => void;
  removeTrack: (index: number) => void;
  triggerExport: () => void;

  // Navigation & Persistence
  setView: (view: 'editor' | 'gallery' | 'settings') => void;
  savePosterAs: (name: string) => void;
  savePoster: () => void; // Update current or create new if null
  loadPoster: (id: string) => void;
  deletePoster: (id: string) => void;
  createNewPoster: () => void;
}

export const usePosterStore = create<PosterState>()(persist((set, get) => ({
  metadata: {
    artist: 'Artist Name',
    album: 'Album Title',
    year: '2024',
    tracks: [
      { title: 'Track 01', duration: '3:45' },
      { title: 'Track 02', duration: '4:20' },
      { title: 'Track 03', duration: '2:55' },
    ],
  },
  config: {
    width: 1080,
    height: 1350, // 4:5 Aspect Ratio (IG Portrait)
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Inter',
    template: 'modern',
    exportTrigger: 0,
    artistFontSize: 28,
    albumFontSize: 85,
    tracklistFontSize: 14,
    artistFontWeight: 700,
    albumFontWeight: 800,
    tracklistFontWeight: 600,
    tracklistIndent: 0,
    padding: 60,
    artistAlign: 'center',
    albumAlign: 'center',
    tracklistAlign: 'center',
  },

  view: 'editor',
  savedPosters: [],
  currentPosterId: null,

  setMetadata: (newMetadata) =>
    set((state) => ({ metadata: { ...state.metadata, ...newMetadata } })),

  setConfig: (newConfig) =>
    set((state) => ({ config: { ...state.config, ...newConfig } })),

  updateTrack: (index, track) =>
    set((state) => {
      const newTracks = [...state.metadata.tracks];
      newTracks[index] = { ...newTracks[index], ...track };
      return { metadata: { ...state.metadata, tracks: newTracks } };
    }),

  addTrack: () =>
    set((state) => ({
      metadata: {
        ...state.metadata,
        tracks: [...state.metadata.tracks, { title: 'New Track', duration: '0:00' }],
      },
    })),

  removeTrack: (index) =>
    set((state) => ({
      metadata: {
        ...state.metadata,
        tracks: state.metadata.tracks.filter((_, i) => i !== index),
      },
    })),

  triggerExport: () =>
    set((state) => ({ config: { ...state.config, exportTrigger: state.config.exportTrigger + 1 } })),

  setView: (view) => set({ view }),

  savePosterAs: (name) => {
    const state = get();
    const newPoster: SavedPoster = {
      id: crypto.randomUUID(),
      name,
      lastModified: Date.now(),
      config: state.config,
      metadata: state.metadata
    };
    set(state => ({
      savedPosters: [...state.savedPosters, newPoster],
      currentPosterId: newPoster.id,
      view: 'editor'
    }));
  },

  savePoster: () => {
    const state = get();
    if (!state.currentPosterId) {
      // If no ID, treat as new save
      get().savePosterAs(state.metadata.album || 'Untitled Poster');
      return;
    }

    set(state => ({
      savedPosters: state.savedPosters.map(p =>
        p.id === state.currentPosterId
          ? { ...p, config: state.config, metadata: state.metadata, lastModified: Date.now() }
          : p
      )
    }));
  },

  loadPoster: (id) => {
    const poster = get().savedPosters.find(p => p.id === id);
    if (poster) {
      set({
        currentPosterId: poster.id,
        config: poster.config,
        metadata: poster.metadata,
        view: 'editor'
      });
    }
  },

  deletePoster: (id) =>
    set(state => ({
      savedPosters: state.savedPosters.filter(p => p.id !== id),
      currentPosterId: state.currentPosterId === id ? null : state.currentPosterId
    })),

  createNewPoster: () =>
    set({
      currentPosterId: null,
      metadata: {
        artist: 'Artist Name',
        album: 'Album Title',
        year: '2024',
        tracks: [
          { title: 'Track 01', duration: '3:45' },
          { title: 'Track 02', duration: '4:20' },
          { title: 'Track 03', duration: '2:55' },
        ],
      },
      config: {
        width: 1080,
        height: 1350,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Inter',
        template: 'modern',
        exportTrigger: 0,
      },
      view: 'editor'
    })

}), {
  name: 'poster-storage',
}));
