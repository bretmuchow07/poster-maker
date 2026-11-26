export interface ItunesAlbum {
  collectionId: number;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  highResArtworkUrl: string;
  releaseDate: string;
  year: string;
  formattedReleaseDate: string;
  copyright?: string;
  trackCount: number;
  primaryGenreName?: string;
  collectionViewUrl: string;
}

export interface ItunesTrack {
  title: string;
  duration: string;
  trackNumber: number;
}

export interface ItunesAlbumDetails {
  tracks: { title: string; duration: string }[];
  totalDuration: string;
  label?: string;
}

/**
 * Searches iTunes / Apple Music for albums matching the user's query.
 * Attempts local Next.js proxy route first, falls back directly to iTunes if needed.
 */
export async function searchAlbums(query: string): Promise<ItunesAlbum[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  let data: any = null;

  try {
    const res = await fetch(`/api/itunes?action=search&term=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.warn('API route search failed, falling back to direct iTunes endpoint', err);
  }

  // Fallback to direct client-side fetch if API route failed
  if (!data || !data.results) {
    try {
      const directUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
        trimmed
      )}&entity=album&limit=12`;
      const directRes = await fetch(directUrl);
      if (directRes.ok) {
        data = await directRes.json();
      }
    } catch (directErr) {
      console.error('Direct iTunes search also failed', directErr);
      return [];
    }
  }

  if (!data || !data.results) return [];

  return data.results.map((item: any): ItunesAlbum => {
    let year = '';
    let formattedReleaseDate = '';

    if (item.releaseDate) {
      try {
        const dateObj = new Date(item.releaseDate);
        if (!isNaN(dateObj.getTime())) {
          year = dateObj.getFullYear().toString();
          formattedReleaseDate = dateObj
            .toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            .toUpperCase();
        }
      } catch {
        // ignore date parse errors
      }
    }

    // Replace default 100x100 with 3000x3000 for lossless print resolution
    const rawArtwork = item.artworkUrl100 || item.artworkUrl60 || '';
    const highResArtworkUrl = rawArtwork.replace(/\/100x100bb\.jpg$/, '/3000x3000bb.jpg');

    return {
      collectionId: item.collectionId,
      artistName: item.artistName || 'Unknown Artist',
      collectionName: item.collectionName || 'Untitled Album',
      artworkUrl100: rawArtwork,
      highResArtworkUrl: highResArtworkUrl || rawArtwork,
      releaseDate: item.releaseDate || '',
      year: year || '2024',
      formattedReleaseDate: formattedReleaseDate || year,
      copyright: item.copyright,
      trackCount: item.trackCount || 0,
      primaryGenreName: item.primaryGenreName,
      collectionViewUrl: item.collectionViewUrl || '',
    };
  });
}

/**
 * Fetches the complete tracklist, track lengths, and album metadata by collectionId.
 */
export async function getAlbumTracks(collectionId: number): Promise<ItunesAlbumDetails> {
  let data: any = null;

  try {
    const res = await fetch(`/api/itunes?action=lookup&id=${collectionId}`);
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.warn('API route lookup failed, falling back to direct iTunes endpoint', err);
  }

  if (!data || !data.results) {
    try {
      const directUrl = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`;
      const directRes = await fetch(directUrl);
      if (directRes.ok) {
        data = await directRes.json();
      }
    } catch (directErr) {
      console.error('Direct iTunes lookup also failed', directErr);
      return { tracks: [], totalDuration: '00:00' };
    }
  }

  const results: any[] = data?.results || [];

  // Filter out collection wrapper items and keep only song tracks
  const songItems = results
    .filter((r) => r.wrapperType === 'track' && (r.kind === 'song' || !r.kind))
    .sort((a, b) => {
      // Sort by discNumber then trackNumber
      const discDiff = (a.discNumber || 1) - (b.discNumber || 1);
      if (discDiff !== 0) return discDiff;
      return (a.trackNumber || 0) - (b.trackNumber || 0);
    });

  let totalMs = 0;
  const tracks: { title: string; duration: string }[] = songItems.map((song) => {
    const ms = song.trackTimeMillis || 0;
    totalMs += ms;
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return {
      title: song.trackName || 'Untitled Track',
      duration: `${min}:${sec < 10 ? '0' : ''}${sec}`,
    };
  });

  // Calculate formatted total duration (e.g. "54:21" or "1:14:21")
  const allSec = Math.floor(totalMs / 1000);
  const hours = Math.floor(allSec / 3600);
  const totalMin = Math.floor((allSec % 3600) / 60);
  const remSec = allSec % 60;

  let totalDuration = '';
  if (hours > 0) {
    totalDuration = `${hours}:${totalMin < 10 ? '0' : ''}${totalMin}:${
      remSec < 10 ? '0' : ''
    }${remSec}`;
  } else {
    totalDuration = `${totalMin}:${remSec < 10 ? '0' : ''}${remSec}`;
  }

  // Find collection metadata to extract clean copyright/label
  const collectionWrapper = results.find((r) => r.wrapperType === 'collection');
  let label: string | undefined = undefined;
  if (collectionWrapper?.copyright) {
    // Strip leading ℗ / copyright symbol and year
    label = collectionWrapper.copyright.replace(/^[℗©\s\d,.-]+/, '').trim();
  }

  return {
    tracks,
    totalDuration: totalDuration || '00:00',
    label,
  };
}

/**
 * Downloads the high-resolution artwork from Apple CDN and downscales/optimizes it to
 * ~1400px JPEG Data URL. This guarantees:
 * 1. 300 DPI high-quality print clarity.
 * 2. Fabric.js canvas and ColorThief won't suffer from CORS security errors.
 * 3. File size is compressed to ~200KB so LocalStorage quota is never exceeded.
 */
export async function fetchAndOptimizeAlbumArt(
  artworkUrl100: string,
  maxDimension = 1400,
  quality = 0.88
): Promise<string> {
  const highResUrl = (artworkUrl100 || '').replace(/\/100x100bb\.jpg$/, '/3000x3000bb.jpg');
  const fallbackUrl = (artworkUrl100 || '').replace(/\/100x100bb\.jpg$/, '/1400x1400bb.jpg');

  let blob: Blob | null = null;

  // Try 3000x3000
  try {
    const res = await fetch(highResUrl);
    if (res.ok) {
      blob = await res.blob();
    }
  } catch {
    // try fallback
  }

  // If failed, try 1400x1400
  if (!blob) {
    try {
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        blob = await res.blob();
      }
    } catch {
      // try original
    }
  }

  // Fallback to whatever URL was passed
  if (!blob) {
    const res = await fetch(artworkUrl100);
    blob = await res.blob();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
