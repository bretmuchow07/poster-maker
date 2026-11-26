'use client';

import React, { useState } from 'react';
import { Search, Loader2, X, Music, Disc, Sparkles, AlertCircle } from 'lucide-react';
import {
  searchAlbums,
  getAlbumTracks,
  fetchAndOptimizeAlbumArt,
  ItunesAlbum,
} from '@/utils/itunes';
import { usePosterStore } from '@/store/posterStore';
import { extractDominantColors } from '@/utils/colorUtils';

interface AlbumSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  'Blonde Frank Ocean',
  'Random Access Memories',
  'Currents Tame Impala',
  'IGOR Tyler the Creator',
  'Abbey Road The Beatles',
  'SOS SZA',
];

export function AlbumSearchModal({ isOpen, onClose }: AlbumSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ItunesAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { metadata, setMetadata, config, setConfig, updateQrCodeConfig } = usePosterStore();

  if (!isOpen) return null;

  const performSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const albums = await searchAlbums(trimmed);
      setResults(albums);
      if (albums.length === 0) {
        setErrorMessage(`No albums found matching "${trimmed}". Try checking the spelling.`);
      }
    } catch (err: any) {
      console.error('Search failed', err);
      setErrorMessage('Search request failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSelectAlbum = async (album: ItunesAlbum) => {
    setImportingId(album.collectionId);
    setStatusMessage('Fetching tracklist & print-res artwork...');
    setErrorMessage(null);

    try {
      // 1. Fetch tracks and durations
      const { tracks, totalDuration, label } = await getAlbumTracks(album.collectionId);

      // 2. Fetch & optimize high-res 3000x3000 artwork (safe for canvas + localStorage)
      setStatusMessage('Optimizing artwork for 300 DPI...');
      const optimizedArtDataUrl = await fetchAndOptimizeAlbumArt(album.artworkUrl100);

      // 3. Extract 5-color palette & contrast colors
      setStatusMessage('Extracting studio color palette...');
      const colors = await extractDominantColors(optimizedArtDataUrl);

      // 4. Update poster metadata
      setMetadata({
        artist: album.artistName,
        album: album.collectionName,
        year: album.year,
        releaseDate: album.formattedReleaseDate,
        totalDuration,
        label: label || album.copyright?.replace(/^[℗©\s\d,.-]+/, '') || metadata.label,
        tracks: tracks.length > 0 ? tracks : metadata.tracks,
      });

      // 5. Update poster visuals & auto-theme
      const commonReset = {
        autoFitTitle: true,
        albumFontSize: undefined,
        artistPosition: undefined,
        albumPosition: undefined,
        tracklistPosition: undefined,
        qrCodePosition: undefined,
        matrixStampPosition: undefined
      };

      if (config.template === 'modern') {
        setConfig({
          ...commonReset,
          backgroundImage: optimizedArtDataUrl,
          backgroundColor: colors.suggestedGradient,
          textColor: colors.text,
          artistColor: colors.text,
          albumColor: colors.text,
          paletteSwatches: colors.palette,
        });
      } else if (config.template === 'cosmos') {
        setConfig({
          ...commonReset,
          backgroundImage: optimizedArtDataUrl,
          backgroundColor: '#f7f5f3',
          textColor: '#0d0d0d',
          artistColor: '#0d0d0d',
          albumColor: '#0d0d0d',
          paletteSwatches: colors.palette,
        });
      } else {
        setConfig({
          ...commonReset,
          backgroundImage: optimizedArtDataUrl,
          backgroundColor: colors.background,
          textColor: colors.text,
          artistColor: undefined,
          albumColor: undefined,
          paletteSwatches: colors.palette,
        });
      }

      // 6. Connect the QR code to the official Apple Music stream
      if (album.collectionViewUrl) {
        updateQrCodeConfig({
          url: album.collectionViewUrl,
          visible: true,
        });
      }

      // Close modal on success
      onClose();
    } catch (err: any) {
      console.error('Import failed', err);
      setErrorMessage(
        'Failed to import album details. You can try another album or upload directly.'
      );
    } finally {
      setImportingId(null);
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] transition-all">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--surface2)]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Disc size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[var(--text)] flex items-center gap-1.5">
                <span>Instant Album Import & Auto-Theme</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-bold">
                  300 DPI Art
                </span>
              </h3>
              <p className="text-[10px] text-[var(--text3)]">
                Pulls canonical tracklist, release date, label, and high-res cover art.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3.5 border-b border-[var(--border-color)] flex gap-2 bg-[var(--surface)]"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]"
              size={14}
            />
            <input
              type="text"
              className="inp pl-8 pr-8 text-xs w-full py-2"
              placeholder="Search artist or album (e.g. Radiohead In Rainbows)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary text-xs px-4 flex items-center gap-1.5 font-medium"
            disabled={loading || importingId !== null}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
            <span>Search</span>
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        {results.length === 0 && !loading && (
          <div className="px-4 py-2 border-b border-[var(--border-color)] bg-[var(--surface2)]/20 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-[var(--text3)] mr-1 flex items-center gap-1">
              <Sparkles size={11} className="text-[var(--accent)]" /> Quick suggestions:
            </span>
            {QUICK_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  setQuery(sug);
                  performSearch(sug);
                }}
                className="px-2 py-0.5 rounded-full bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text2)] hover:text-[var(--text)] transition-colors border border-[var(--border-color)]"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Status / Error Notifications */}
        {statusMessage && (
          <div className="p-3 bg-[var(--accent)]/10 border-b border-[var(--accent)]/20 text-[var(--accent)] text-xs flex items-center gap-2 animate-fade-in">
            <Loader2 size={14} className="animate-spin flex-shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Results Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text3)] space-y-2">
              <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
              <span className="text-xs">Searching official catalog...</span>
            </div>
          )}

          {!loading && results.length === 0 && !errorMessage && (
            <div className="text-center py-12 px-6 space-y-2">
              <Music size={28} className="mx-auto text-[var(--text3)] opacity-60" />
              <p className="text-xs font-medium text-[var(--text)]">Search any album or artist</p>
              <p className="text-[11px] text-[var(--text3)] max-w-sm mx-auto">
                Instantly imports the artwork, extracts 5 dominant colors, fills the tracklist with
                durations, and configures the streaming QR code.
              </p>
            </div>
          )}

          {!loading &&
            results.map((album) => {
              const isSelected = importingId === album.collectionId;
              return (
                <div
                  key={album.collectionId}
                  onClick={() => !importingId && handleSelectAlbum(album)}
                  className={`flex items-center gap-3.5 p-2.5 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--border-color)] bg-[var(--surface2)]/40 hover:bg-[var(--surface2)] hover:border-[var(--accent)]/50'
                  } ${importingId && !isSelected ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  {/* Album Cover Thumbnail */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--surface3)] shadow-sm">
                    {album.artworkUrl100 ? (
                      <img
                        src={album.artworkUrl100}
                        alt={album.collectionName}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text3)]">
                        <Music size={18} />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 size={18} className="animate-spin text-[var(--accent)]" />
                      </div>
                    )}
                  </div>

                  {/* Album Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {album.collectionName}
                    </div>
                    <div className="text-[11px] text-[var(--text2)] truncate font-medium">
                      {album.artistName}
                    </div>
                    <div className="text-[10px] text-[var(--text3)] flex items-center gap-2 mt-0.5">
                      <span>{album.year}</span>
                      <span>•</span>
                      <span>{album.trackCount} tracks</span>
                      {album.primaryGenreName && (
                        <>
                          <span>•</span>
                          <span className="truncate">{album.primaryGenreName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Select CTA */}
                  <div className="flex-shrink-0 pr-1">
                    {isSelected ? (
                      <span className="text-[10px] font-semibold text-[var(--accent)]">
                        Applying...
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-[var(--surface)] text-[var(--text2)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all border border-[var(--border-color)] group-hover:border-transparent">
                        Import
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--surface2)]/20 flex items-center justify-between text-[10px] text-[var(--text3)] px-4">
          <span>Official lossless catalog data via Apple Music / iTunes</span>
          <button
            onClick={onClose}
            className="text-[var(--text2)] hover:text-[var(--text)] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
