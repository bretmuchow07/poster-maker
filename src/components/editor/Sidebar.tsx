'use client';

import React, { useState } from 'react';
import { usePosterStore } from '@/store/posterStore';
import { extractDominantColors } from '@/utils/colorUtils';
import { optimizePosterImage } from '@/utils/imageUtils';
import { PRINT_PRESETS } from '@/utils/usePosterDimensions';
import { GOOGLE_FONTS, CURATED_FONT_CATEGORIES } from '@/data/googleFonts';
import {
    Wand2,
    Image as ImageIcon,
    Music,
    Type,
    Printer,
    Trash2,
    Plus,
    ClipboardList,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    ChevronRight,
    Check,
    Search,
    X,
    Palette,
    QrCode,
    Sparkles,
    PenTool,
    Columns,
    FileText,
    Lock,
    Unlock,
    RotateCcw
} from 'lucide-react';

export function Sidebar() {
    const {
        metadata, setMetadata,
        config, setConfig,
        addTrack, removeTrack, updateTrack, importTracklist,
        updatePrintConfig, updateQrCodeConfig,
        updateSignatureConfig, updateFrameBorderConfig, updateLinerNotesConfig
    } = usePosterStore();

    // Accordion active sections
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        artwork: true,
        content: true,
        typography: false,
        print: false
    });

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Quick Paste Tracklist Modal state
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

    // Font Drawer state
    const [isFontDrawerOpen, setIsFontDrawerOpen] = useState(false);
    const [fontSearch, setFontSearch] = useState('');
    const [selectedFontCategory, setSelectedFontCategory] = useState<string>('swiss');

    const handleQuickPaste = () => {
        const count = importTracklist(pasteText);
        if (count > 0) {
            setPasteFeedback(`Imported ${count} track${count > 1 ? 's' : ''} successfully!`);
            setTimeout(() => {
                setIsPasteModalOpen(false);
                setPasteText('');
                setPasteFeedback(null);
            }, 1000);
        } else {
            setPasteFeedback('Could not detect tracks. Check format and try again.');
        }
    };

    const applyPreset = (presetKey: string) => {
        if (presetKey === 'custom') {
            updatePrintConfig({ preset: 'custom' });
            return;
        }
        // @ts-ignore
        const preset = PRINT_PRESETS[presetKey];
        if (preset) {
            const dpi = 72;
            const w = Math.round((preset.widthMm / 25.4) * dpi);
            const h = Math.round((preset.heightMm / 25.4) * dpi);

            setConfig({ width: w, height: h });
            updatePrintConfig({ preset: presetKey as any });
        }
    };

    return (
        <div className="flex flex-col h-full divide-y divide-[var(--border-color)]">
            {/* ACCORDION 1: ARTWORK & PALETTE */}
            <div className="p-4">
                <button
                    onClick={() => toggleSection('artwork')}
                    className="w-full flex items-center justify-between font-semibold text-xs text-[var(--text)] tracking-wide hover:text-[var(--accent)] transition-colors select-none"
                    aria-expanded={openSections.artwork}
                >
                    <span className="flex items-center gap-2">
                        <ImageIcon size={15} className="text-[var(--accent)]" />
                        <span>Artwork & Palette</span>
                    </span>
                    {openSections.artwork ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {openSections.artwork && (
                    <div className="mt-3.5 space-y-3.5 text-xs animate-fade-in">
                        {/* Image Upload Area */}
                        <div>
                            <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Album Artwork</label>
                            <label className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--surface2)]/40 hover:bg-[var(--surface2)] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
                                <ImageIcon size={22} className="text-[var(--text3)] group-hover:text-[var(--accent)] group-hover:scale-105 transition-all mb-1.5" />
                                <span className="font-medium text-[11px] text-[var(--text)] group-hover:text-[var(--accent)]">
                                    {config.backgroundImage ? 'Replace Artwork' : 'Upload Artwork'}
                                </span>
                                <span className="text-[10px] text-[var(--text3)] mt-0.5">Auto-optimized for 300 DPI</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                const optimized = await optimizePosterImage(file);
                                                const colors = await extractDominantColors(optimized);
                                                setConfig({
                                                    backgroundImage: optimized,
                                                    paletteSwatches: colors.palette
                                                });
                                            } catch (err) {
                                                console.error('Image optimization failed:', err);
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* Magic Auto-Theme Button */}
                        {config.backgroundImage && (
                            <button
                                onClick={async () => {
                                    if (config.backgroundImage) {
                                        const colors = await extractDominantColors(config.backgroundImage);
                                        if (config.template === 'modern') {
                                            setConfig({
                                                backgroundColor: colors.suggestedGradient,
                                                textColor: colors.text,
                                                artistColor: colors.text,
                                                albumColor: colors.text,
                                                paletteSwatches: colors.palette
                                            });
                                        } else {
                                            setConfig({
                                                backgroundColor: colors.background,
                                                textColor: colors.text,
                                                artistColor: undefined,
                                                albumColor: undefined,
                                                paletteSwatches: colors.palette
                                            });
                                        }
                                    }
                                }}
                                className="btn btn-primary w-full py-2 shadow-sm flex items-center justify-center gap-2 font-medium"
                            >
                                <Wand2 size={13} />
                                <span>Auto-Theme Palette from Art</span>
                            </button>
                        )}

                        {/* 5 Extracted Studio Swatches */}
                        {config.paletteSwatches && config.paletteSwatches.length > 0 && (
                            <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-medium text-[var(--text2)]">Studio 5-Color Swatches</label>
                                    <div className="flex items-center gap-1">
                                        {config.swatchesPosition && (
                                            <button
                                                onClick={() => setConfig({ swatchesPosition: undefined })}
                                                className="px-1.5 py-0.5 text-[9px] rounded bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text2)] flex items-center gap-1 transition-colors"
                                                title="Reset Swatches Position"
                                            >
                                                <RotateCcw size={9} />
                                                <span>Reset</span>
                                            </button>
                                        )}
                                        {(['square', 'rounded', 'circle'] as const).map(shape => (
                                            <button
                                                key={shape}
                                                onClick={() => setConfig({ swatchShape: shape })}
                                                className={`px-1.5 py-0.5 text-[9px] rounded capitalize ${config.swatchShape === shape ? 'bg-[var(--accent)] text-black font-bold' : 'bg-[var(--surface2)] text-[var(--text2)]'}`}
                                            >
                                                {shape}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {config.paletteSwatches.slice(0, 5).map((swatch, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-1">
                                            <input
                                                type="color"
                                                value={swatch}
                                                onChange={(e) => {
                                                    const updated = [...(config.paletteSwatches || [])];
                                                    updated[idx] = e.target.value;
                                                    setConfig({ paletteSwatches: updated });
                                                }}
                                                className="w-full h-7 rounded cursor-pointer border border-[var(--border-color)] p-0"
                                                title={`Swatch ${idx + 1}`}
                                            />
                                            <span className="font-mono text-[8px] text-[var(--text3)] uppercase">
                                                {swatch.slice(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Image Fine-Tuning */}
                        {config.backgroundImage && (
                            <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                                {/* Interactive Tip & Lock Toggle */}
                                <div className="p-2.5 rounded-lg bg-[var(--surface2)]/60 border border-[var(--border-color)] flex items-center justify-between">
                                    <div className="text-[10px] text-[var(--text2)] leading-tight flex-1 pr-2">
                                        💡 <strong>Direct Canvas Edit:</strong> Drag or resize artwork with corner handles directly on the canvas.
                                    </div>
                                    <button
                                        onClick={() => setConfig({ imageLocked: !config.imageLocked })}
                                        className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition-colors ${config.imageLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-[var(--surface)] text-[var(--text3)] hover:text-[var(--text)] border border-[var(--border-color)]'}`}
                                        title={config.imageLocked ? "Click to Unlock Canvas Dragging" : "Click to Lock Position on Canvas"}
                                    >
                                        {config.imageLocked ? <Lock size={11} /> : <Unlock size={11} />}
                                        <span>{config.imageLocked ? 'Locked' : 'Unlocked'}</span>
                                    </button>
                                </div>

                                {/* Blur Filter Slider */}
                                <div>
                                    <div className="flex justify-between text-[11px] text-[var(--text2)] mb-1">
                                        <span className="font-medium">Image Blur</span>
                                        <span className="font-mono text-[var(--text3)]">{Math.round((config.imageBlur ?? 0) * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={config.imageBlur ?? 0}
                                        onChange={(e) => setConfig({ imageBlur: parseFloat(e.target.value) })}
                                        className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                    />
                                </div>

                                {/* Background Edge Fade / Blend Slider */}
                                <div>
                                    <div className="flex justify-between text-[11px] text-[var(--text2)] mb-1">
                                        <span className="font-medium">Edge Blend into Background</span>
                                        <span className="font-mono text-[var(--text3)]">{Math.round(config.imageFade ?? 0)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={config.imageFade ?? 0}
                                        onChange={(e) => setConfig({ imageFade: parseInt(e.target.value) || 0 })}
                                        className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                    />
                                    <span className="text-[9px] text-[var(--text3)] mt-0.5 block">
                                        Softly dissolves lower photo edge into the poster paper color
                                    </span>
                                </div>

                                {/* Blend Mode & Opacity */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="text-[11px] text-[var(--text2)] block mb-1">Ink Blend Mode</label>
                                        <select
                                            className="inp py-1 text-[11px]"
                                            value={config.imageBlendMode || 'normal'}
                                            onChange={(e) => setConfig({ imageBlendMode: e.target.value as any })}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="multiply">Multiply (Ink Press)</option>
                                            <option value="screen">Screen (Lighten)</option>
                                            <option value="overlay">Overlay (Contrast)</option>
                                            <option value="darken">Darken</option>
                                            <option value="lighten">Lighten</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] text-[var(--text2)] mb-1">
                                            <span>Opacity</span>
                                            <span className="font-mono text-[var(--text3)]">{Math.round((config.imageOpacity ?? 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.05"
                                            value={config.imageOpacity ?? 1}
                                            onChange={(e) => setConfig({ imageOpacity: parseFloat(e.target.value) })}
                                            className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer mt-1.5"
                                        />
                                    </div>
                                </div>

                                {/* Scale and Manual Shifts */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <div className="flex justify-between text-[11px] text-[var(--text2)] mb-1">
                                            <span>Scale</span>
                                            <span className="font-mono text-[var(--text3)]">{config.imageScale ?? 1}x</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.2"
                                            max="3"
                                            step="0.05"
                                            value={config.imageScale ?? 1}
                                            onChange={(e) => setConfig({ imageScale: parseFloat(e.target.value) })}
                                            className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => setConfig({ imageOffsetX: 0, imageOffsetY: 0, imageScale: 1 })}
                                            className="btn w-full py-1.5 text-[10px] flex items-center justify-center gap-1"
                                        >
                                            <RotateCcw size={11} />
                                            <span>Reset Placement</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Background Color & Text Color Quick Swatches */}
                        <div className="pt-2 border-t border-[var(--border-color)] space-y-2.5">
                            <div>
                                <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Poster Background Stock</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.backgroundColor.startsWith('#') ? config.backgroundColor : '#ffffff'}
                                        onChange={(e) => setConfig({ backgroundColor: e.target.value })}
                                        className="h-8 w-8 rounded-lg cursor-pointer border border-[var(--border-color)] p-0"
                                    />
                                    <input
                                        type="text"
                                        value={config.backgroundColor}
                                        onChange={(e) => setConfig({ backgroundColor: e.target.value })}
                                        className="inp flex-1 font-mono text-[11px]"
                                        placeholder="#ffffff or gradient"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Primary Typography Ink</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.textColor.startsWith('#') ? config.textColor : '#18181b'}
                                        onChange={(e) => setConfig({ textColor: e.target.value })}
                                        className="h-8 w-8 rounded-lg cursor-pointer border border-[var(--border-color)] p-0"
                                    />
                                    <input
                                        type="text"
                                        value={config.textColor}
                                        onChange={(e) => setConfig({ textColor: e.target.value })}
                                        className="inp flex-1 font-mono text-[11px]"
                                        placeholder="#18181b"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ACCORDION 2: ALBUM INFO & TRACKLIST */}
            <div className="p-4">
                <button
                    onClick={() => toggleSection('content')}
                    className="w-full flex items-center justify-between font-semibold text-xs text-[var(--text)] tracking-wide hover:text-[var(--accent)] transition-colors select-none"
                    aria-expanded={openSections.content}
                >
                    <span className="flex items-center gap-2">
                        <Music size={15} className="text-[var(--accent)]" />
                        <span>Album & Tracklist</span>
                    </span>
                    {openSections.content ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {openSections.content && (
                    <div className="mt-3.5 space-y-3.5 text-xs animate-fade-in">
                        {/* Core Metadata Fields */}
                        <div className="space-y-2">
                            <div>
                                <label className="text-[11px] font-medium text-[var(--text2)] block mb-1">Artist Name</label>
                                <input
                                    type="text"
                                    className="inp"
                                    placeholder="e.g. Echo Velocity"
                                    value={metadata.artist}
                                    onChange={(e) => setMetadata({ artist: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-medium text-[var(--text2)] block mb-1">Album Title</label>
                                <input
                                    type="text"
                                    className="inp"
                                    placeholder="e.g. Neo-Construct 04"
                                    value={metadata.album}
                                    onChange={(e) => setMetadata({ album: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[11px] font-medium text-[var(--text2)] block mb-1">Release Year</label>
                                    <input
                                        type="text"
                                        className="inp"
                                        placeholder="2013"
                                        value={metadata.year}
                                        onChange={(e) => setMetadata({ year: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-medium text-[var(--text2)] block mb-1">Record Label</label>
                                    <input
                                        type="text"
                                        className="inp"
                                        placeholder="Cash Money Records"
                                        value={metadata.label || ''}
                                        onChange={(e) => setMetadata({ label: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[11px] font-medium text-[var(--text2)] block mb-1">Full Release Date</label>
                                    <input
                                        type="text"
                                        className="inp"
                                        placeholder="SEPTEMBER 24, 2013"
                                        value={metadata.releaseDate || ''}
                                        onChange={(e) => setMetadata({ releaseDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-medium text-[var(--text2)] block mb-1">Album Length</label>
                                    <input
                                        type="text"
                                        className="inp"
                                        placeholder="67:22"
                                        value={metadata.totalDuration || ''}
                                        onChange={(e) => setMetadata({ totalDuration: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tracklist Layout Flow */}
                        <div className="pt-2 border-t border-[var(--border-color)]">
                            <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Tracklist Flow Mode</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { id: 'single', name: 'Single Column' },
                                    { id: 'double', name: '2 Columns' },
                                    { id: 'inline', name: 'Slashed Inline' },
                                ].map((flow) => (
                                    <button
                                        key={flow.id}
                                        onClick={() => setConfig({ tracklistLayout: flow.id as any })}
                                        className={`py-1.5 px-2 rounded-lg border text-center transition-all ${config.tracklistLayout === flow.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)] font-semibold' : 'border-[var(--border-color)] bg-[var(--surface2)]/40 text-[var(--text2)]'}`}
                                    >
                                        <div className="text-[10px]">{flow.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Liner Notes & Production Credits */}
                        <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                            <label className="flex items-center gap-2 text-[11px] text-[var(--text)] cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.linerNotes?.visible ?? false}
                                    onChange={(e) => updateLinerNotesConfig({ visible: e.target.checked })}
                                    className="rounded accent-[var(--accent)]"
                                />
                                <span className="font-medium">Show Producer Credits / Liner Notes</span>
                            </label>

                            {config.linerNotes?.visible && (
                                <textarea
                                    rows={2}
                                    className="inp text-[10px] w-full resize-none p-2"
                                    placeholder="ALL SONGS WRITTEN, PRODUCED AND ARRANGED BY..."
                                    value={config.linerNotes.text || metadata.producerCredit || ''}
                                    onChange={(e) => updateLinerNotesConfig({ text: e.target.value })}
                                />
                            )}
                        </div>

                        {/* Tracklist Items & Actions */}
                        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium text-[var(--text2)]">
                                    Tracks ({metadata.tracks.length})
                                </span>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => setIsPasteModalOpen(true)}
                                        className="btn py-1 px-2 text-[10px] flex items-center gap-1 font-medium bg-[var(--surface2)] hover:bg-[var(--surface-elevated)]"
                                    >
                                        <ClipboardList size={11} className="text-[var(--accent)]" />
                                        <span>Quick Paste</span>
                                    </button>
                                    <button
                                        onClick={addTrack}
                                        className="btn py-1 px-2 text-[10px] flex items-center gap-1 font-medium"
                                    >
                                        <Plus size={11} />
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                {metadata.tracks.map((track, index) => (
                                    <div key={index} className="flex gap-1.5 items-center bg-[var(--surface2)]/50 p-1.5 rounded-lg border border-[var(--border-color)] group hover:border-[var(--border-hover)]">
                                        <span className="font-mono text-[10px] text-[var(--text3)] w-4 text-center select-none">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <input
                                            type="text"
                                            className="inp py-1 text-[11px] flex-1 bg-transparent border-transparent hover:border-[var(--border-color)] focus:border-[var(--accent)]"
                                            value={track.title}
                                            onChange={(e) => updateTrack(index, { title: e.target.value })}
                                            placeholder="Track Title"
                                        />
                                        <input
                                            type="text"
                                            className="inp py-1 text-[10px] font-mono w-14 text-center bg-transparent border-transparent hover:border-[var(--border-color)] focus:border-[var(--accent)]"
                                            value={track.duration}
                                            onChange={(e) => updateTrack(index, { duration: e.target.value })}
                                            placeholder="3:45"
                                        />
                                        <button
                                            onClick={() => removeTrack(index)}
                                            className="p-1 text-[var(--text3)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label={`Remove track ${index + 1}`}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Streaming / Store QR Code */}
                        <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                            <label className="flex items-center gap-2 text-[11px] text-[var(--text)] cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.qrCode?.visible ?? false}
                                    onChange={(e) => updateQrCodeConfig({ visible: e.target.checked })}
                                    className="rounded accent-[var(--accent)]"
                                />
                                <span className="flex items-center gap-1.5">
                                    <QrCode size={13} className="text-[var(--accent)]" />
                                    <span className="font-medium">Streaming / Store QR Code</span>
                                </span>
                            </label>

                            {config.qrCode?.visible && (
                                <input
                                    type="url"
                                    className="inp text-[11px] w-full"
                                    placeholder="https://open.spotify.com/album/..."
                                    value={config.qrCode.url || ''}
                                    onChange={(e) => updateQrCodeConfig({ url: e.target.value })}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ACCORDION 3: TYPOGRAPHY & LAYOUT */}
            <div className="p-4">
                <button
                    onClick={() => toggleSection('typography')}
                    className="w-full flex items-center justify-between font-semibold text-xs text-[var(--text)] tracking-wide hover:text-[var(--accent)] transition-colors select-none"
                    aria-expanded={openSections.typography}
                >
                    <span className="flex items-center gap-2">
                        <Type size={15} className="text-[var(--accent)]" />
                        <span>Typography & Layout</span>
                    </span>
                    {openSections.typography ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {openSections.typography && (
                    <div className="mt-3.5 space-y-3.5 text-xs animate-fade-in">
                        {/* Visual Template Cards */}
                        <div>
                            <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Poster Template</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'modern', name: 'Swiss Modern', desc: 'Bold typography below framed artwork' },
                                    { id: 'palette', name: 'Color Swatch', desc: 'Asymmetric 2-column grid with 5 extracted swatches' },
                                    { id: 'minimal', name: 'Editorial Framing', desc: 'Framed artwork with hairline inset border & slashed tracklist' },
                                    { id: 'split', name: 'Split Studio', desc: 'Cinematic split balance with 2-col tracks' },
                                ].map((tpl) => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => setConfig({ template: tpl.id as any })}
                                        className={`p-2.5 rounded-lg border text-left transition-all ${config.template === tpl.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)] shadow-xs' : 'border-[var(--border-color)] bg-[var(--surface2)]/40 hover:border-[var(--border-hover)]'}`}
                                    >
                                        <div className="font-semibold text-[11px] text-[var(--text)]">{tpl.name}</div>
                                        <div className="text-[9px] text-[var(--text3)] mt-0.5 leading-snug">{tpl.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Selector with Curated Drawer */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[11px] font-medium text-[var(--text2)]">Primary Typeface</label>
                                <button
                                    onClick={() => setIsFontDrawerOpen(true)}
                                    className="text-[10px] text-[var(--accent)] hover:underline font-medium"
                                >
                                    Browse Curated Fonts
                                </button>
                            </div>

                            <button
                                onClick={() => setIsFontDrawerOpen(true)}
                                className="w-full inp flex items-center justify-between py-2 text-left"
                            >
                                <span className="font-medium truncate" style={{ fontFamily: config.fontFamily }}>
                                    {config.fontFamily}
                                </span>
                                <ChevronDown size={13} className="text-[var(--text3)]" />
                            </button>
                        </div>

                        {/* Artist Cursive Signature / Autograph */}
                        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                            <label className="flex items-center gap-2 text-[11px] text-[var(--text)] cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.signature?.visible ?? false}
                                    onChange={(e) => updateSignatureConfig({ visible: e.target.checked })}
                                    className="rounded accent-[var(--accent)]"
                                />
                                <span className="flex items-center gap-1.5 font-medium">
                                    <PenTool size={13} className="text-[var(--accent)]" />
                                    <span>Artist Cursive Signature / Autograph</span>
                                </span>
                            </label>

                            {config.signature?.visible && (
                                <div className="space-y-2 p-2 bg-[var(--surface2)]/40 rounded-lg border border-[var(--border-color)]">
                                    <input
                                        type="text"
                                        className="inp text-[11px] w-full"
                                        placeholder="Artist Signature / Autograph"
                                        value={config.signature.text || ''}
                                        onChange={(e) => updateSignatureConfig({ text: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            className="inp py-1 text-[11px]"
                                            value={config.signature.fontFamily || 'Caveat'}
                                            onChange={(e) => updateSignatureConfig({ fontFamily: e.target.value })}
                                        >
                                            <option value="Caveat">Caveat (Script)</option>
                                            <option value="Alex Brush">Alex Brush (Calligraphic)</option>
                                            <option value="Reenie Beanie">Reenie Beanie (Marker)</option>
                                        </select>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-[var(--text3)]">Size</span>
                                            <input
                                                type="range"
                                                min="20"
                                                max="60"
                                                value={config.signature.fontSize || 34}
                                                onChange={(e) => updateSignatureConfig({ fontSize: parseInt(e.target.value) })}
                                                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title Kinetic Echo Effect */}
                        <div className="pt-2 border-t border-[var(--border-color)]">
                            <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Album Title Visual Effect</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'none', name: 'Clean Solid' },
                                    { id: 'blur-echo', name: 'Ghost Blur Echo' },
                                ].map((eff) => (
                                    <button
                                        key={eff.id}
                                        onClick={() => setConfig({ textEffect: eff.id as any })}
                                        className={`py-1.5 px-2 rounded-lg border text-center transition-all ${config.textEffect === eff.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)] font-semibold' : 'border-[var(--border-color)] bg-[var(--surface2)]/40 text-[var(--text2)]'}`}
                                    >
                                        <div className="text-[10px]">{eff.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Granular Typography Controls */}
                        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
                            {[
                                { label: 'Artist Title', sizeKey: 'artistFontSize', weightKey: 'artistFontWeight', alignKey: 'artistAlign', defaultSize: 28 },
                                { label: 'Album Title', sizeKey: 'albumFontSize', weightKey: 'albumFontWeight', alignKey: 'albumAlign', defaultSize: 85 },
                                { label: 'Tracklist', sizeKey: 'tracklistFontSize', weightKey: 'tracklistFontWeight', alignKey: 'tracklistAlign', defaultSize: 14 },
                            ].map((item) => (
                                <div key={item.label} className="space-y-1.5 p-2 bg-[var(--surface2)]/40 rounded-lg border border-[var(--border-color)]">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-[11px] text-[var(--text)]">{item.label}</span>
                                        <span className="font-mono text-[10px] text-[var(--text3)]">
                                            {(config as any)[item.sizeKey] || item.defaultSize}px
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="160"
                                                value={(config as any)[item.sizeKey] || item.defaultSize}
                                                onChange={(e) => setConfig({ [item.sizeKey]: parseInt(e.target.value) })}
                                                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                            />
                                        </div>

                                        <select
                                            className="inp py-1 text-[11px]"
                                            value={(config as any)[item.weightKey] || 700}
                                            onChange={(e) => setConfig({ [item.weightKey]: e.target.value })}
                                        >
                                            <option value="300">Light (300)</option>
                                            <option value="400">Regular (400)</option>
                                            <option value="600">SemiBold (600)</option>
                                            <option value="700">Bold (700)</option>
                                            <option value="900">Black (900)</option>
                                        </select>
                                    </div>

                                    <div className="flex bg-[var(--surface)] border border-[var(--border-color)] rounded-md overflow-hidden">
                                        {(['left', 'center', 'right'] as const).map((align) => (
                                            <button
                                                key={align}
                                                onClick={() => setConfig({ [item.alignKey]: align })}
                                                className={`flex-1 p-1 flex justify-center hover:bg-[var(--surface2)] transition-colors ${(config as any)[item.alignKey] === align ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold' : 'text-[var(--text3)]'}`}
                                                aria-label={`Align ${item.label} ${align}`}
                                            >
                                                {align === 'left' && <AlignLeft size={13} />}
                                                {align === 'center' && <AlignCenter size={13} />}
                                                {align === 'right' && <AlignRight size={13} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ACCORDION 4: PRINT SETUP & GUIDES */}
            <div className="p-4">
                <button
                    onClick={() => toggleSection('print')}
                    className="w-full flex items-center justify-between font-semibold text-xs text-[var(--text)] tracking-wide hover:text-[var(--accent)] transition-colors select-none"
                    aria-expanded={openSections.print}
                >
                    <span className="flex items-center gap-2">
                        <Printer size={15} className="text-[var(--accent)]" />
                        <span>Print Setup & Guides</span>
                    </span>
                    {openSections.print ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {openSections.print && (
                    <div className="mt-3.5 space-y-3.5 text-xs animate-fade-in">
                        {/* Paper Preset Selector */}
                        <div>
                            <label className="text-[11px] font-medium text-[var(--text2)] block mb-1.5">Paper Preset</label>
                            <select
                                className="inp"
                                value={config.print?.preset || 'custom'}
                                onChange={(e) => applyPreset(e.target.value)}
                            >
                                <option value="custom">Custom Dimensions (px)</option>
                                <optgroup label="Standard ISO Posters">
                                    <option value="a2">A2 (420 × 594 mm)</option>
                                    <option value="a3">A3 (297 × 420 mm) — Most Popular</option>
                                    <option value="a4">A4 (210 × 297 mm)</option>
                                </optgroup>
                                <optgroup label="North American Print">
                                    <option value="tabloid">Tabloid (11 × 17 in)</option>
                                    <option value="letter">Letter (8.5 × 11 in)</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Inset Framing Border Rule */}
                        <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                            <label className="flex items-center gap-2 text-[11px] text-[var(--text)] cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.frameBorder?.visible ?? false}
                                    onChange={(e) => updateFrameBorderConfig({ visible: e.target.checked })}
                                    className="rounded accent-[var(--accent)]"
                                />
                                <span className="font-medium">Show Inset Framing Border Rule</span>
                            </label>

                            {config.frameBorder?.visible && (
                                <div className="space-y-2 p-2 bg-[var(--surface2)]/40 rounded-lg border border-[var(--border-color)]">
                                    <div className="flex justify-between text-[10px] text-[var(--text2)]">
                                        <span>Inset Margin</span>
                                        <span className="font-mono">{config.frameBorder.insetMm || 12} mm</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="6"
                                        max="30"
                                        value={config.frameBorder.insetMm || 12}
                                        onChange={(e) => updateFrameBorderConfig({ insetMm: parseInt(e.target.value) })}
                                        className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface2)] rounded-lg cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Print Guides (Bleed and Margins) */}
                        <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                            <span className="text-[11px] font-medium text-[var(--text2)] block">Print Guides</span>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[11px] text-[var(--text)] cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={config.print?.showBleed ?? false}
                                        onChange={(e) => updatePrintConfig({ showBleed: e.target.checked })}
                                        className="rounded accent-[var(--accent)]"
                                    />
                                    <span>Show 3mm Bleed Safety Line</span>
                                </label>
                                <label className="flex items-center gap-2 text-[11px] text-[var(--text)] cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={config.print?.showMargins ?? false}
                                        onChange={(e) => updatePrintConfig({ showMargins: e.target.checked })}
                                        className="rounded accent-[var(--accent)]"
                                    />
                                    <span>Show 10mm Margin Grid</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL 1: QUICK PASTE TRACKLIST */}
            {isPasteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="text-[var(--accent)]" size={18} />
                                <h3 className="font-bold text-sm text-[var(--text)]">Quick Paste Tracklist</h3>
                            </div>
                            <button
                                onClick={() => setIsPasteModalOpen(false)}
                                className="p-1 rounded text-[var(--text3)] hover:text-[var(--text)]"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-xs text-[var(--text2)] leading-relaxed">
                            Paste raw track text directly from Spotify, Apple Music, Bandcamp, or a text file. Format doesn't need to be perfect; titles and durations (e.g. <code className="bg-[var(--surface2)] px-1 py-0.5 rounded text-[11px]">3:45</code>) will be parsed automatically.
                        </p>

                        <textarea
                            rows={8}
                            className="inp font-mono text-xs w-full p-3 h-48 resize-none"
                            placeholder="1. One More Time - 5:20&#10;2. Aerodynamic - 3:27&#10;3. Digital Love - 4:58&#10;4. Harder, Better, Faster, Stronger - 3:45"
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                        />

                        {pasteFeedback && (
                            <div className="text-xs font-medium text-[var(--accent)]">
                                {pasteFeedback}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsPasteModalOpen(false)}
                                className="btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleQuickPaste}
                                disabled={!pasteText.trim()}
                                className="btn btn-primary"
                            >
                                Parse & Populate Tracklist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: CURATED FONT DRAWER */}
            {isFontDrawerOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Type className="text-[var(--accent)]" size={18} />
                                <h3 className="font-bold text-sm text-[var(--text)]">Curated Typeface Drawer</h3>
                            </div>
                            <button
                                onClick={() => setIsFontDrawerOpen(false)}
                                className="p-1 rounded text-[var(--text3)] hover:text-[var(--text)]"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-1.5 pb-1">
                            <button
                                onClick={() => setSelectedFontCategory('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedFontCategory === 'all' ? 'bg-[var(--accent)] text-black font-semibold shadow-xs' : 'bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)]'}`}
                            >
                                All Fonts
                            </button>
                            {CURATED_FONT_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedFontCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedFontCategory === cat.id ? 'bg-[var(--accent)] text-black font-semibold shadow-xs' : 'bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)]'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                            <input
                                type="text"
                                placeholder="Search by typeface name..."
                                value={fontSearch}
                                onChange={(e) => setFontSearch(e.target.value)}
                                className="inp pl-9 w-full"
                            />
                        </div>

                        {/* Font Specimen Cards */}
                        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                            {(() => {
                                const activeCat = CURATED_FONT_CATEGORIES.find(c => c.id === selectedFontCategory);
                                const fontPool = activeCat ? activeCat.fonts : GOOGLE_FONTS;
                                return fontPool.filter((fontName) => {
                                    return fontName.toLowerCase().includes(fontSearch.toLowerCase());
                                }).map((fontName) => (
                                    <button
                                        key={fontName}
                                        onClick={() => {
                                            setConfig({ fontFamily: fontName });
                                            setIsFontDrawerOpen(false);
                                        }}
                                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${config.fontFamily === fontName ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-color)] bg-[var(--surface2)]/40 hover:bg-[var(--surface2)] hover:border-[var(--border-hover)]'}`}
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                                                <span>{fontName}</span>
                                            </div>
                                            <div
                                                className="text-base text-[var(--text2)] mt-1 truncate"
                                                style={{ fontFamily: fontName }}
                                            >
                                                Music & Sound Archival Print Atelier
                                            </div>
                                        </div>
                                        {config.fontFamily === fontName && (
                                            <Check size={16} className="text-[var(--accent)] flex-shrink-0 ml-2" />
                                        )}
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
