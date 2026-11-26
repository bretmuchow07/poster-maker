
import { usePosterStore } from '@/store/posterStore';

export interface PresetDefinition {
    widthMm: number;
    heightMm: number;
    name: string;
    defaultPx?: { width: number; height: number };
}

export const PRINT_PRESETS: Record<string, PresetDefinition> = {
    // Vinyl & Collector Sizes
    vinyl12: { widthMm: 304.8, heightMm: 304.8, name: '12" LP Vinyl Sleeve (305 × 305 mm)', defaultPx: { width: 1080, height: 1080 } },
    vinyl7: { widthMm: 177.8, heightMm: 177.8, name: '7" 45 RPM Single (178 × 178 mm)', defaultPx: { width: 900, height: 900 } },

    // Standard Gallery & Wall Framing
    frame18x24: { widthMm: 457.2, heightMm: 609.6, name: '18 × 24" Gallery Frame (457 × 610 mm)', defaultPx: { width: 1080, height: 1440 } },
    frame24x36: { widthMm: 609.6, heightMm: 914.4, name: '24 × 36" Large Format (610 × 914 mm)', defaultPx: { width: 1080, height: 1620 } },

    // Standard ISO Posters
    a2: { widthMm: 420, heightMm: 594, name: 'A2 (420 × 594 mm)' },
    a3: { widthMm: 297, heightMm: 420, name: 'A3 (297 × 420 mm) — Most Popular' },
    a4: { widthMm: 210, heightMm: 297, name: 'A4 (210 × 297 mm)' },

    // North American Print Standards
    tabloid: { widthMm: 279.4, heightMm: 431.8, name: 'Tabloid (11 × 17 in)' },
    letter: { widthMm: 215.9, heightMm: 279.4, name: 'Letter (8.5 × 11 in)' },

    // Digital & Social Media
    instagram: { widthMm: 216, heightMm: 270, name: 'Instagram 4:5 Portrait', defaultPx: { width: 1080, height: 1350 } },
    story: { widthMm: 216, heightMm: 384, name: 'Story / Mobile Wallpaper 9:16', defaultPx: { width: 1080, height: 1920 } },
};

export function usePosterDimensions() {
    const { config } = usePosterStore();

    // Helper to convert mm to pixels at current DPI
    const mmToPx = (mm: number) => {
        const dpi = config.print.dpi || 72;
        return Math.round((mm / 25.4) * dpi);
    };

    // Helper to convert pixels to mm at current DPI
    const pxToMm = (px: number) => {
        const dpi = config.print.dpi || 72;
        return (px * 25.4) / dpi;
    };

    const getDimensions = () => {
        // If using a preset, calculate dimensions based on DPI
        if (config.print.preset !== 'custom' && PRINT_PRESETS[config.print.preset]) {
            const preset = PRINT_PRESETS[config.print.preset];
            return {
                width: mmToPx(preset.widthMm),
                height: mmToPx(preset.heightMm),
                widthMm: preset.widthMm,
                heightMm: preset.heightMm
            };
        }

        // Fallback to config pixel dimensions (assumed 72 DPI for web defaults)
        return {
            width: config.width,
            height: config.height,
            widthMm: pxToMm(config.width),
            heightMm: pxToMm(config.height)
        };
    };

    return {
        mmToPx,
        pxToMm,
        getDimensions,
        presets: PRINT_PRESETS
    };
}
