/**
 * Typography utilities for archival music posters.
 * Dynamically computes optimal font sizes to prevent awkward line breaks and container overflows.
 */

export interface AutoFitOptions {
  text: string;
  availableWidth: number;
  maxLines?: number;
  baseFontSize: number;
  minFontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  isCosmos?: boolean;
}

/**
 * Calculates the largest font size (<= baseFontSize) where `text` fits within `availableWidth`
 * without any single word overflowing and without exceeding `maxLines`.
 */
export function computeAutoFitTitleFontSize({
  text,
  availableWidth,
  maxLines = 2,
  baseFontSize,
  minFontSize = 24,
  fontFamily = 'Inter',
  fontWeight = 800,
  isCosmos = false
}: AutoFitOptions): number {
  const cleanText = text.trim();
  if (!cleanText || availableWidth <= 0) return baseFontSize;

  const words = cleanText.split(/\s+/);
  if (words.length === 0) return baseFontSize;

  let ctx: CanvasRenderingContext2D | null = null;
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
  }

  const measure = (size: number, str: string): number => {
    if (ctx) {
      ctx.font = `${fontWeight} ${size}px "${fontFamily}", sans-serif`;
      return ctx.measureText(str).width;
    }
    // Heuristic optical fallback
    const charRatio = isCosmos ? 0.58 : 0.64;
    return str.length * size * charRatio;
  };

  let candidate = baseFontSize;

  while (candidate > minFontSize) {
    // 1. Ensure no individual word overflows the container width (with safety margin)
    const maxWordW = Math.max(...words.map(w => measure(candidate, w)));
    if (maxWordW > availableWidth - 10) {
      candidate -= 2;
      continue;
    }

    // 2. Measure line count when wrapped at availableWidth
    let lineCount = 1;
    let currentLineW = 0;
    const spaceW = measure(candidate, ' ');

    for (let i = 0; i < words.length; i++) {
      const wordW = measure(candidate, words[i]);
      if (currentLineW === 0) {
        currentLineW = wordW;
      } else if (currentLineW + spaceW + wordW <= availableWidth) {
        currentLineW += spaceW + wordW;
      } else {
        lineCount++;
        currentLineW = wordW;
      }
    }

    if (lineCount <= maxLines) {
      return candidate;
    }

    candidate -= 2;
  }

  return Math.max(minFontSize, candidate);
}
