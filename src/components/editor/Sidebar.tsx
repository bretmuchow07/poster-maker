import React from 'react';
import { usePosterStore } from '@/store/posterStore';
import { extractDominantColors } from '@/utils/colorUtils';
import { Wand2, Printer, Type, FileOutput, Tag } from 'lucide-react';
import { PRINT_PRESETS } from '@/utils/usePosterDimensions';
import { GOOGLE_FONTS } from '@/data/googleFonts';

export function Sidebar() {
    const {
        metadata, setMetadata,
        config, setConfig,
        addTrack, removeTrack, updateTrack,
        updatePrintConfig, updateLabelConfig
    } = usePosterStore();

    const applyPreset = (presetKey: string) => {
        if (presetKey === 'custom') {
            updatePrintConfig({ preset: 'custom' });
            return;
        }
        // @ts-ignore
        const preset = PRINT_PRESETS[presetKey];
        if (preset) {
            // Calculate pixels at 72 DPI (web view) for the canvas size in store
            // The scaling for print happens in CanvasArea via export logic if needed, 
            // but for "WYSIWYG" on screen, we set the canvas size.
            // However, to keep high quality for print, we might want to actually set higher resolution?
            // For now, let's stick to 72 DPI for 'screen' size in config, and export logic handles multiplier.
            // Actually, if we want correct aspect ratio, mm dimensions at 72dpi is fine.
            const dpi = 72;
            const w = Math.round((preset.widthMm / 25.4) * dpi);
            const h = Math.round((preset.heightMm / 25.4) * dpi);

            setConfig({ width: w, height: h });
            updatePrintConfig({ preset: presetKey as any });
        }
    };

    return (
        <div className="p-6 space-y-8 pb-20">

            {/* Section: Templates */}
            <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Templates</h3>
                <div className="grid grid-cols-3 gap-2">
                    {['modern', 'split', 'minimal'].map(t => (
                        <button
                            key={t}
                            onClick={() => setConfig({ template: t as any })}
                            className={`template-button px-3 py-2 text-xs rounded border capitalize transition-all ${config.template === t ? 'active' : ''}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </section>

            {/* Section: Print & Dimensions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Printer size={12} className="text-[var(--accent)]" />
                    <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Print & Size</h3>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs block mb-1">Size Preset</label>
                        <select
                            className="w-full rounded p-2 text-xs outline-none bg-[var(--input-bg)] border border-[var(--input-border)]"
                            value={config.print?.preset || 'custom'}
                            onChange={(e) => applyPreset(e.target.value)}
                        >
                            <option value="custom">Custom Dimensions</option>
                            <optgroup label="Standard Paper">
                                {Object.entries(PRINT_PRESETS).map(([key, val]) => (
                                    <option key={key} value={key}>{val.name} ({val.widthMm}x{val.heightMm}mm)</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    {config.print?.preset === 'custom' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] block mb-1 opacity-70">Width (px)</label>
                                <input
                                    type="number"
                                    className="w-full rounded p-2 text-xs outline-none bg-[var(--input-bg)] border border-[var(--input-border)]"
                                    value={config.width}
                                    onChange={(e) => setConfig({ width: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] block mb-1 opacity-70">Height (px)</label>
                                <input
                                    type="number"
                                    className="w-full rounded p-2 text-xs outline-none bg-[var(--input-bg)] border border-[var(--input-border)]"
                                    value={config.height}
                                    onChange={(e) => setConfig({ height: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-2 border-t border-[var(--sidebar-border)]">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs">Show Guides</label>
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-[10px] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.print?.showBleed ?? false}
                                    onChange={(e) => updatePrintConfig({ showBleed: e.target.checked })}
                                />
                                Bleed
                            </label>
                            <label className="flex items-center gap-2 text-[10px] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.print?.showMargins ?? false}
                                    onChange={(e) => updatePrintConfig({ showMargins: e.target.checked })}
                                />
                                Margins
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Album Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Type size={12} className="text-[var(--accent)]" />
                    <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Content</h3>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs block mb-1">Artist</label>
                        <input
                            type="text"
                            className="w-full rounded p-2 text-sm outline-none transition-colors"
                            value={metadata.artist}
                            onChange={(e) => setMetadata({ artist: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs block mb-1">Album Name</label>
                        <input
                            type="text"
                            className="w-full rounded p-2 text-sm outline-none transition-colors"
                            value={metadata.album}
                            onChange={(e) => setMetadata({ album: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs block mb-1">Year</label>
                            <input
                                type="text"
                                className="w-full rounded p-2 text-sm outline-none transition-colors"
                                value={metadata.year}
                                onChange={(e) => setMetadata({ year: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Label Info */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag size={12} className="text-[var(--accent)]" />
                        <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Label Info</h3>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.label?.visible}
                        onChange={(e) => updateLabelConfig({ visible: e.target.checked })}
                    />
                </div>

                {config.label?.visible && (
                    <div className="space-y-3 p-3 bg-[var(--sidebar-bg-secondary)] rounded-lg">
                        <div>
                            <label className="text-[10px] block mb-1 opacity-70">Label Name</label>
                            <input
                                type="text"
                                className="w-full rounded p-1.5 text-xs outline-none"
                                value={config.label?.text}
                                onChange={(e) => updateLabelConfig({ text: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] block mb-1 opacity-70">Catalog #</label>
                                <input
                                    type="text"
                                    className="w-full rounded p-1.5 text-xs outline-none"
                                    value={config.label?.catalogNumber}
                                    onChange={(e) => updateLabelConfig({ catalogNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] block mb-1 opacity-70">Year</label>
                                <input
                                    type="text"
                                    className="w-full rounded p-1.5 text-xs outline-none"
                                    value={config.label?.year}
                                    onChange={(e) => updateLabelConfig({ year: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] block mb-1 opacity-70">Position Y</label>
                            <input
                                type="range"
                                min="0" max={config.height}
                                value={config.label?.position?.top ?? 0}
                                className="w-full accent-[var(--accent)]"
                                onChange={(e) => updateLabelConfig({ position: { ...(config.label?.position ?? { left: 0, top: 0 }), top: parseInt(e.target.value) } })}
                            />
                        </div>
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Album Art</h3>
                <div>
                    <label className="text-xs block mb-1">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    if (ev.target?.result) {
                                        setConfig({ backgroundImage: ev.target.result as string });
                                    }
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    <button
                        onClick={async () => {
                            if (config.backgroundImage) {
                                const colors = await extractDominantColors(config.backgroundImage);
                                if (config.template === 'modern') {
                                    setConfig({
                                        backgroundColor: colors.suggestedGradient,
                                        textColor: colors.text,
                                        artistColor: colors.text,
                                        albumColor: colors.text
                                    });
                                } else {
                                    setConfig({
                                        backgroundColor: colors.background,
                                        textColor: colors.text,
                                        artistColor: undefined,
                                        albumColor: undefined
                                    });
                                }
                            }
                        }}
                        disabled={!config.backgroundImage}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-xs text-[var(--foreground)] py-2 rounded border border-[var(--input-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        <Wand2 size={12} />
                        Auto-Theme from Art
                    </button>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Style & Export</h3>
                <div className="space-y-3">

                    <div>
                        <label className="text-xs block mb-1">Font Family</label>
                        <select
                            className="w-full rounded p-2 text-sm outline-none bg-[var(--input-bg)] border border-[var(--input-border)] transition-colors"
                            value={config.fontFamily}
                            onChange={(e) => setConfig({ fontFamily: e.target.value })}
                        >
                            {Array.from(new Set(['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', ...GOOGLE_FONTS])).map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[var(--sidebar-border)]">
                        {/* Simplified for brevity - keeping core controls, can expand later */}
                        <div>
                            <label className="text-[10px] uppercase font-bold opacity-60 block mb-1">Text Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    className="h-8 w-8 rounded cursor-pointer p-0 border-0"
                                    value={config.textColor}
                                    onChange={(e) => setConfig({ textColor: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="flex-1 rounded p-1.5 text-xs outline-none bg-[var(--input-bg)] border border-[var(--input-border)]"
                                    value={config.textColor}
                                    onChange={(e) => setConfig({ textColor: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs block mb-1">Export Format</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['png', 'jpg', 'pdf'].map(fmt => (
                                    <button
                                        key={fmt}
                                        onClick={() => setConfig({ exportFormat: fmt as any })}
                                        className={`px-2 py-1 text-[10px] uppercase rounded border ${config.exportFormat === fmt ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--sidebar-border)] opacity-60'}`}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>

                            {config.exportFormat === 'jpg' && (
                                <div className="mt-2">
                                    <label className="text-[10px] block mb-1 opacity-70">Quality: {Math.round((config.exportQuality || 1) * 100)}%</label>
                                    <input
                                        type="range" min="0.1" max="1" step="0.1"
                                        value={config.exportQuality || 1}
                                        onChange={(e) => setConfig({ exportQuality: parseFloat(e.target.value) })}
                                        className="w-full accent-[var(--accent)]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Tracks */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Tracklist</h3>
                    <button onClick={addTrack} className="text-xs bg-[var(--button-bg)] hover:bg-[var(--button-hover)] border border-[var(--input-border)] px-2 py-1 rounded transition-colors text-[var(--foreground)]">+ Add</button>
                </div>

                <div className="space-y-2">
                    {metadata.tracks.map((track, i) => (
                        <div key={i} className="flex gap-2 items-center group">
                            <span className="track-number text-xs w-4">{i + 1}</span>
                            <input
                                type="text"
                                className="flex-1 rounded p-1.5 text-xs outline-none"
                                value={track.title}
                                onChange={(e) => updateTrack(i, { title: e.target.value })}
                            />
                            <input
                                type="text"
                                className="w-12 rounded p-1.5 text-xs outline-none text-center"
                                value={track.duration}
                                onChange={(e) => updateTrack(i, { duration: e.target.value })}
                            />
                            <button
                                onClick={() => removeTrack(i)}
                                className="remove-button opacity-0 group-hover:opacity-100 p-1"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
