import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PosterMetadata {
  artist: string;
  album: string;
  year: string;
  tracks: { title: string; duration: string }[];
  label?: string;
  releaseDate?: string; // e.g. "SEPTEMBER 24, 2013"
  totalDuration?: string; // e.g. "67:22"
  producerCredit?: string; // e.g. "ALL SONGS WRITTEN, PRODUCED AND ARRANGED BY THE ARTIST"
}

export interface PrintConfig {
  preset: 'a4' | 'a3' | 'a2' | 'letter' | 'tabloid' | 'custom';
  dpi: 72 | 150 | 300;
  showBleed: boolean;
  showMargins: boolean;
  bleedMm: number;
  marginMm: number;
}

export interface LabelConfig {
  visible: boolean;
  text: string;
  catalogNumber: string;
  year: string;
  position: { left: number; top: number };
  width: number;
  align: 'left' | 'center' | 'right';
}

export interface QrCodeConfig {
  visible: boolean;
  url: string;
  size?: number;
}

export interface SignatureConfig {
  visible: boolean;
  text: string;
  fontFamily: string;
  fontSize: number;
  color?: string;
}

export interface FrameBorderConfig {
  visible: boolean;
  insetMm: number;
  strokeWidth: number;
  color?: string;
}

export interface LinerNotesConfig {
  visible: boolean;
  text: string;
  fontSize: number;
  align?: 'left' | 'center' | 'right';
}

export interface FontConfig {
  letterSpacing: number;
  lineHeight: number;
}

export interface PosterConfig {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string; // Optimized Data URL
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  imageOpacity?: number;
  imageBlur?: number; // 0 to 1 blur intensity
  imageFade?: number; // 0 to 100 percentage bottom fade to background
  imageBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
  imageLocked?: boolean;
  textColor: string;
  fontFamily: string;
  template: 'modern' | 'split' | 'minimal' | 'palette';
  exportTrigger: number; // Increment to trigger export
  exportFormat?: 'png' | 'jpg' | 'pdf';
  exportQuality?: number;
  exportTransparent?: boolean;

  // Print Settings
  print: PrintConfig;

  // Label Info
  label: LabelConfig;

  // QR Code for streaming / vinyl shop
  qrCode?: QrCodeConfig;

  // Swatch styling
  paletteSwatches?: string[];
  swatchShape?: 'square' | 'rounded' | 'circle';

  // Layout & Formatting
  tracklistLayout?: 'single' | 'double' | 'inline';
  textEffect?: 'none' | 'blur-echo';

  // Signature script overlay
  signature?: SignatureConfig;

  // Inset frame border
  frameBorder?: FrameBorderConfig;

  // Liner notes / producer credits
  linerNotes?: LinerNotesConfig;

  // Advanced settings
  artistFontSize?: number;
  albumFontSize?: number;
  tracklistFontSize?: number;

  artistFontWeight?: number | string;
  albumFontWeight?: number | string;
  tracklistFontWeight?: number | string;

  artistLetterSpacing?: number;
  albumLetterSpacing?: number;
  tracklistLetterSpacing?: number;

  artistLineHeight?: number;
  albumLineHeight?: number;
  tracklistLineHeight?: number;

  artistColor?: string;
  albumColor?: string;
  tracklistIndent?: number;
  padding?: number;

  // Position overrides (drag & drop)
  artistPosition?: { left: number; top: number };
  albumPosition?: { left: number; top: number };
  tracklistPosition?: { left: number; top: number };
  swatchesPosition?: { left: number; top: number };

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

export interface HistorySnapshot {
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
  isLoading: boolean;
  theme: 'light' | 'dark';

  // History & Feedback
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedTime: string | null;

  // Actions
  setMetadata: (metadata: Partial<PosterMetadata>) => void;
  setConfig: (config: Partial<PosterConfig>) => void;
  updatePrintConfig: (config: Partial<PrintConfig>) => void;
  updateLabelConfig: (config: Partial<LabelConfig>) => void;
  updateQrCodeConfig: (config: Partial<QrCodeConfig>) => void;
  updateSignatureConfig: (signature: Partial<SignatureConfig>) => void;
  updateFrameBorderConfig: (frameBorder: Partial<FrameBorderConfig>) => void;
  updateLinerNotesConfig: (linerNotes: Partial<LinerNotesConfig>) => void;
  setPaletteSwatches: (swatches: string[]) => void;
  updateTrack: (index: number, track: Partial<{ title: string; duration: string }>) => void;
  addTrack: () => void;
  removeTrack: (index: number) => void;
  importTracklist: (rawText: string) => number;
  triggerExport: (format?: 'png' | 'jpg' | 'pdf', quality?: number, transparent?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Navigation & Persistence
  setView: (view: 'editor' | 'gallery' | 'settings') => void;
  savePosterAs: (name: string) => void;
  savePoster: () => void; // Update current or create new if null
  loadPoster: (id: string) => void;
  deletePoster: (id: string) => void;
  createNewPoster: () => void;
}

const MAX_HISTORY = 30;

function createSnapshot(state: { config: PosterConfig; metadata: PosterMetadata }): HistorySnapshot {
  return {
    config: JSON.parse(JSON.stringify(state.config)),
    metadata: JSON.parse(JSON.stringify(state.metadata)),
  };
}

export const usePosterStore = create<PosterState>()(
  persist(
    (set, get) => ({
      metadata: {
        artist: 'Artist Name',
        album: 'Album Title',
        year: '2024',
        tracks: [
          { title: 'Track 01', duration: '3:45' },
          { title: 'Track 02', duration: '4:20' },
          { title: 'Track 03', duration: '2:55' },
        ],
        label: 'Record Label',
        releaseDate: 'SEPTEMBER 24, 2024',
        totalDuration: '45:10',
        producerCredit: 'ALL SONGS WRITTEN, PRODUCED AND ARRANGED BY THE ARTIST',
      },
      config: {
        width: 1080,
        height: 1350, // 4:5 Aspect Ratio
        backgroundColor: '#ffffff',
        imageScale: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageOpacity: 1,
        imageBlur: 0,
        imageFade: 0,
        imageBlendMode: 'normal',
        imageLocked: false,
        textColor: '#18181b',
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

        // Defaults for print settings
        print: {
          preset: 'custom',
          dpi: 72,
          showBleed: false,
          showMargins: false,
          bleedMm: 3,
          marginMm: 10,
        },
        label: {
          visible: false,
          text: 'Record Label',
          catalogNumber: 'CAT001',
          year: '2024',
          position: { left: 60, top: 1300 },
          width: 200,
          align: 'left',
        },
        qrCode: {
          visible: false,
          url: 'https://open.spotify.com',
          size: 100,
        },
        paletteSwatches: ['#2c3e50', '#a27b5c', '#dcd7c9', '#4f709c', '#213555'],
        swatchShape: 'square',
        tracklistLayout: 'single',
        textEffect: 'none',
        signature: {
          visible: false,
          text: 'Artist Autograph',
          fontFamily: 'Caveat',
          fontSize: 34,
        },
        frameBorder: {
          visible: false,
          insetMm: 12,
          strokeWidth: 1.5,
        },
        linerNotes: {
          visible: false,
          text: 'ALL SONGS WRITTEN, PRODUCED AND ARRANGED BY THE ARTIST',
          fontSize: 11,
          align: 'center',
        },
      },

      view: 'editor',
      savedPosters: [],
      currentPosterId: null,
      isLoading: false,
      theme: 'dark',

      past: [],
      future: [],
      saveStatus: 'idle',
      lastSavedTime: null,

      setMetadata: (newMetadata) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          metadata: { ...state.metadata, ...newMetadata },
        })),

      setConfig: (newConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: { ...state.config, ...newConfig },
        })),

      updatePrintConfig: (newPrintConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            print: { ...state.config.print, ...newPrintConfig },
          },
        })),

      updateLabelConfig: (newLabelConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            label: { ...state.config.label, ...newLabelConfig },
          },
        })),

      updateQrCodeConfig: (newQrConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            qrCode: { ...(state.config.qrCode || { visible: false, url: '', size: 100 }), ...newQrConfig },
          },
        })),

      updateSignatureConfig: (newSigConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            signature: { ...(state.config.signature || { visible: false, text: '', fontFamily: 'Caveat', fontSize: 34 }), ...newSigConfig },
          },
        })),

      updateFrameBorderConfig: (newBorderConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            frameBorder: { ...(state.config.frameBorder || { visible: false, insetMm: 12, strokeWidth: 1.5 }), ...newBorderConfig },
          },
        })),

      updateLinerNotesConfig: (newLinerConfig) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            linerNotes: { ...(state.config.linerNotes || { visible: false, text: '', fontSize: 11, align: 'center' }), ...newLinerConfig },
          },
        })),

      setPaletteSwatches: (swatches) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          config: {
            ...state.config,
            paletteSwatches: swatches,
          },
        })),

      updateTrack: (index, track) =>
        set((state) => {
          const newTracks = [...state.metadata.tracks];
          newTracks[index] = { ...newTracks[index], ...track };
          return {
            past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
            future: [],
            metadata: { ...state.metadata, tracks: newTracks },
          };
        }),

      addTrack: () =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          metadata: {
            ...state.metadata,
            tracks: [
              ...state.metadata.tracks,
              { title: `Track ${String(state.metadata.tracks.length + 1).padStart(2, '0')}`, duration: '3:30' },
            ],
          },
        })),

      removeTrack: (index) =>
        set((state) => ({
          past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
          future: [],
          metadata: {
            ...state.metadata,
            tracks: state.metadata.tracks.filter((_, i) => i !== index),
          },
        })),

      importTracklist: (rawText: string): number => {
        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return 0;

        const parsedTracks: { title: string; duration: string }[] = [];
        for (const line of lines) {
          const durationMatch = line.match(/(?:[-–—\s])?\(?(\d{1,2}:\d{2})\)?$/);
          let duration = '3:30';
          let titlePart = line;

          if (durationMatch) {
            duration = durationMatch[1];
            titlePart = line.slice(0, line.lastIndexOf(durationMatch[0])).trim();
          }

          titlePart = titlePart.replace(/^\d+[\.\-\)\s]+/, '').trim();
          if (titlePart.length > 0) {
            parsedTracks.push({ title: titlePart, duration });
          }
        }

        if (parsedTracks.length > 0) {
          set((state) => ({
            past: [...state.past, createSnapshot(state)].slice(-MAX_HISTORY),
            future: [],
            metadata: {
              ...state.metadata,
              tracks: parsedTracks,
            },
          }));
          return parsedTracks.length;
        }
        return 0;
      },

      triggerExport: (format = 'png', quality = 1.0, transparent = false) =>
        set((state) => ({
          config: {
            ...state.config,
            exportFormat: format,
            exportQuality: quality,
            exportTransparent: transparent,
            exportTrigger: state.config.exportTrigger + 1,
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setTheme: (theme) => set({ theme }),

      undo: () => {
        const { past, future, config, metadata } = get();
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
          past: newPast,
          future: [createSnapshot({ config, metadata }), ...future].slice(0, MAX_HISTORY),
          config: { ...previous.config, exportTrigger: 0 },
          metadata: previous.metadata,
        });
      },

      redo: () => {
        const { past, future, config, metadata } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
          past: [...past, createSnapshot({ config, metadata })].slice(-MAX_HISTORY),
          future: newFuture,
          config: { ...next.config, exportTrigger: 0 },
          metadata: next.metadata,
        });
      },

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      setView: (view) => set({ view }),

      savePoster: () => {
        const { currentPosterId, config, metadata, savedPosters } = get();
        set({ saveStatus: 'saving' });

        try {
          const now = Date.now();
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (currentPosterId) {
            const updated = savedPosters.map((p) =>
              p.id === currentPosterId
                ? { ...p, config: { ...config, exportTrigger: 0 }, metadata, lastModified: now }
                : p
            );
            set({ savedPosters: updated, saveStatus: 'saved', lastSavedTime: timeString });
          } else {
            const newId = `poster_${now}`;
            const autoName = `${metadata.artist} - ${metadata.album}`.trim() || 'Untitled Poster';
            const newPoster: SavedPoster = {
              id: newId,
              name: autoName,
              lastModified: now,
              config: { ...config, exportTrigger: 0 },
              metadata,
            };
            set({
              savedPosters: [newPoster, ...savedPosters],
              currentPosterId: newId,
              saveStatus: 'saved',
              lastSavedTime: timeString,
            });
          }

          setTimeout(() => {
            if (get().saveStatus === 'saved') {
              set({ saveStatus: 'idle' });
            }
          }, 2500);
        } catch (err) {
          console.error('Save failed:', err);
          set({ saveStatus: 'error' });
          setTimeout(() => set({ saveStatus: 'idle' }), 3000);
        }
      },

      savePosterAs: (name: string) => {
        const { config, metadata, savedPosters } = get();
        set({ saveStatus: 'saving' });

        try {
          const now = Date.now();
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newId = `poster_${now}`;
          const newPoster: SavedPoster = {
            id: newId,
            name: name.trim() || 'Untitled Poster',
            lastModified: now,
            config: { ...config, exportTrigger: 0 },
            metadata,
          };

          set({
            savedPosters: [newPoster, ...savedPosters],
            currentPosterId: newId,
            saveStatus: 'saved',
            lastSavedTime: timeString,
          });

          setTimeout(() => {
            if (get().saveStatus === 'saved') {
              set({ saveStatus: 'idle' });
            }
          }, 2500);
        } catch (err) {
          console.error('Save As failed:', err);
          set({ saveStatus: 'error' });
          setTimeout(() => set({ saveStatus: 'idle' }), 3000);
        }
      },

      loadPoster: (id: string) => {
        const poster = get().savedPosters.find((p) => p.id === id);
        if (poster) {
          set({
            config: { ...poster.config, exportTrigger: 0 },
            metadata: poster.metadata,
            currentPosterId: id,
            past: [],
            future: [],
            view: 'editor',
          });
        }
      },

      deletePoster: (id) =>
        set((state) => ({
          savedPosters: state.savedPosters.filter((p) => p.id !== id),
          currentPosterId: state.currentPosterId === id ? null : state.currentPosterId,
        })),

      createNewPoster: () =>
        set({
          currentPosterId: null,
          past: [],
          future: [],
          metadata: {
            artist: 'Artist Name',
            album: 'Album Title',
            year: '2024',
            tracks: [
              { title: 'Track 01', duration: '3:45' },
              { title: 'Track 02', duration: '4:20' },
              { title: 'Track 03', duration: '2:55' },
            ],
            label: 'Record Label',
            releaseDate: 'SEPTEMBER 24, 2024',
            totalDuration: '45:10',
            producerCredit: 'ALL SONGS WRITTEN, PRODUCED AND ARRANGED BY THE ARTIST',
          },
          config: {
            width: 1080,
            height: 1350,
            backgroundColor: '#ffffff',
            imageScale: 1,
            imageOffsetX: 0,
            imageOffsetY: 0,
            imageOpacity: 1,
            imageBlur: 0,
            imageFade: 0,
            imageBlendMode: 'normal',
            imageLocked: false,
            textColor: '#18181b',
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
            print: {
              preset: 'custom',
              dpi: 72,
              showBleed: false,
              showMargins: false,
              bleedMm: 3,
              marginMm: 10,
            },
            label: {
              visible: false,
              text: 'Record Label',
              catalogNumber: 'CAT001',
              year: '2024',
              position: { left: 60, top: 1300 },
              width: 200,
              align: 'left',
            },
            qrCode: {
              visible: false,
              url: 'https://open.spotify.com',
              size: 100,
            },
            paletteSwatches: ['#2c3e50', '#a27b5c', '#dcd7c9', '#4f709c', '#213555'],
            swatchShape: 'square',
            tracklistLayout: 'single',
            textEffect: 'none',
            signature: {
              visible: false,
              text: 'Artist Autograph',
              fontFamily: 'Caveat',
              fontSize: 34,
            },
            frameBorder: {
              visible: false,
              insetMm: 12,
              strokeWidth: 1.5,
            },
            linerNotes: {
              visible: false,
              text: 'ALL SONGS WRITTEN, PRODUCED AND ARRANGED BY THE ARTIST',
              fontSize: 11,
              align: 'center',
            },
          },
          view: 'editor',
        }),
    }),
    {
      name: 'poster-storage',
      partialize: (state) => ({
        metadata: state.metadata,
        config: {
          ...state.config,
          exportTrigger: 0,
        },
        savedPosters: state.savedPosters,
        currentPosterId: state.currentPosterId,
        theme: state.theme,
      }),
    }
  )
);
