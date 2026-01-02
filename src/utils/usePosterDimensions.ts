
import { usePosterStore } from '@/store/posterStore';

export const PRINT_PRESETS = {
    a4: { widthMm: 210, heightMm: 297, name: 'A4' },
    a3: { widthMm: 297, heightMm: 420, name: 'A3' },
    a2: { widthMm: 420, heightMm: 594, name: 'A2' },
    letter: { widthMm: 215.9, heightMm: 279.4, name: 'Letter' },
    tabloid: { widthMm: 279.4, heightMm: 431.8, name: 'Tabloid' },
    instagram: { widthMm: 108, heightMm: 135, name: 'Instagram Portrait' },
    square: { widthMm: 210, heightMm: 210, name: 'Square' },
    print: { widthMm: 180, heightMm: 240, name: 'Print Standard' },
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
