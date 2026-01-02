import React from 'react';
import { usePosterStore } from '@/store/posterStore';
import { extractDominantColors } from '@/utils/colorUtils';
import { Wand2 } from 'lucide-react';

export function Sidebar() {
    const { metadata, setMetadata, config, setConfig, addTrack, removeTrack, updateTrack } = usePosterStore();

    return (
        <div className="p-6 space-y-8 pb-20">

            {/* Section: Templates */}
            <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold">Templates</h3>
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

            {/* Section: Album Info */}
            <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold">Album Details</h3>

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
                        <div>
                            <label className="text-xs block mb-1">Label</label>
                            <input
                                type="text"
                                className="w-full rounded p-2 text-sm outline-none transition-colors"
                                value={metadata.label || ''}
                                onChange={(e) => setMetadata({ label: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold">Album Art</h3>
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
                <h3 className="text-xs uppercase tracking-wider font-bold">Style</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs block mb-1">Dimensions</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { name: 'Post', w: 1080, h: 1350 },
                                { name: 'Story', w: 1080, h: 1920 },
                                { name: 'Square', w: 1080, h: 1080 }
                            ].map(s => (
                                <button
                                    key={s.name}
                                    onClick={() => setConfig({ width: s.w, height: s.h })}
                                    className={`dimension-button px-2 py-2 text-[10px] rounded border transition-all ${config.height === s.h ? 'active' : ''}`}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs block mb-1">Typography</label>
                        <select
                            className="w-full rounded p-2 text-sm outline-none"
                            value={config.fontFamily}
                            onChange={(e) => setConfig({ fontFamily: e.target.value })}
                        >
                            {['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'].map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[var(--sidebar-border)]">
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-[10px] uppercase font-bold opacity-60">Album Size</label>
                                <span className="text-[10px]">{config.albumFontSize}px</span>
                            </div>
                            <input
                                type="range" min="20" max="200" step="1"
                                className="w-full accent-[var(--accent)]"
                                value={config.albumFontSize ?? 85}
                                onChange={(e) => setConfig({ albumFontSize: parseInt(e.target.value) })}
                            />
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1">
                                    {(['left', 'center', 'right'] as const).map(align => (
                                        <button
                                            key={align}
                                            onClick={() => setConfig({ albumAlign: align })}
                                            className={`px-2 py-0.5 text-[9px] uppercase rounded border transition-colors ${config.albumAlign === align ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--sidebar-border)] opacity-60'}`}
                                        >
                                            {align[0]}
                                        </button>
                                    ))}
                                </div>
                                <select
                                    className="text-[9px] p-0.5 rounded border border-[var(--sidebar-border)] bg-transparent outline-none"
                                    value={config.albumFontWeight || 800}
                                    onChange={(e) => setConfig({ albumFontWeight: e.target.value })}
                                >
                                    {[300, 400, 600, 700, 800, 900].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                    <label className="text-[10px] uppercase font-bold opacity-60">Album Position Y</label>
                                    <span className="text-[10px]">{Math.round((config.albumPosition?.top ?? 0) / config.height * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max={config.height} step="1"
                                    className="w-full accent-[var(--accent)]"
                                    value={config.albumPosition?.top ?? (config.template === 'modern' ? config.height * 0.72 : config.template === 'split' ? config.height * 0.62 : config.height * 0.7)}
                                    onChange={(e) => setConfig({ albumPosition: { top: parseInt(e.target.value), left: config.albumPosition?.left ?? (config.albumAlign === 'left' ? (config.padding ?? 60) : config.albumAlign === 'right' ? config.width - (config.padding ?? 60) : config.width / 2) } })}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-[10px] uppercase font-bold opacity-60">Artist Size</label>
                                <span className="text-[10px]">{config.artistFontSize}px</span>
                            </div>
                            <input
                                type="range" min="10" max="100" step="1"
                                className="w-full accent-[var(--accent)]"
                                value={config.artistFontSize ?? 28}
                                onChange={(e) => setConfig({ artistFontSize: parseInt(e.target.value) })}
                            />
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1">
                                    {(['left', 'center', 'right'] as const).map(align => (
                                        <button
                                            key={align}
                                            onClick={() => setConfig({ artistAlign: align })}
                                            className={`px-2 py-0.5 text-[9px] uppercase rounded border transition-colors ${config.artistAlign === align ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--sidebar-border)] opacity-60'}`}
                                        >
                                            {align[0]}
                                        </button>
                                    ))}
                                </div>
                                <select
                                    className="text-[9px] p-0.5 rounded border border-[var(--sidebar-border)] bg-transparent outline-none"
                                    value={config.artistFontWeight || 700}
                                    onChange={(e) => setConfig({ artistFontWeight: e.target.value })}
                                >
                                    {[300, 400, 600, 700, 800, 900].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                    <label className="text-[10px] uppercase font-bold opacity-60">Artist Position Y</label>
                                    <span className="text-[10px]">{Math.round((config.artistPosition?.top ?? 0) / config.height * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max={config.height} step="1"
                                    className="w-full accent-[var(--accent)]"
                                    value={config.artistPosition?.top ?? (config.template === 'modern' ? config.height * 0.65 : config.template === 'split' ? config.height * 0.55 : config.height * 0.6)}
                                    onChange={(e) => setConfig({ artistPosition: { top: parseInt(e.target.value), left: config.artistPosition?.left ?? (config.artistAlign === 'left' ? (config.padding ?? 60) : config.artistAlign === 'right' ? config.width - (config.padding ?? 60) : config.width / 2) } })}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-[10px] uppercase font-bold opacity-60">Track Size</label>
                                <span className="text-[10px]">{config.tracklistFontSize}px</span>
                            </div>
                            <input
                                type="range" min="8" max="40" step="1"
                                className="w-full accent-[var(--accent)]"
                                value={config.tracklistFontSize ?? 14}
                                onChange={(e) => setConfig({ tracklistFontSize: parseInt(e.target.value) })}
                            />
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1">
                                    {(['left', 'center', 'right'] as const).map(align => (
                                        <button
                                            key={align}
                                            onClick={() => setConfig({ tracklistAlign: align })}
                                            className={`px-2 py-0.5 text-[9px] uppercase rounded border transition-colors ${config.tracklistAlign === align ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--sidebar-border)] opacity-60'}`}
                                        >
                                            {align[0]}
                                        </button>
                                    ))}
                                </div>
                                <select
                                    className="text-[9px] p-0.5 rounded border border-[var(--sidebar-border)] bg-transparent outline-none"
                                    value={config.tracklistFontWeight || 600}
                                    onChange={(e) => setConfig({ tracklistFontWeight: e.target.value })}
                                >
                                    {[300, 400, 500, 600, 700, 800, 900].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                    <label className="text-[10px] uppercase font-bold opacity-60">Tracklist Position Y</label>
                                    <span className="text-[10px]">{Math.round((config.tracklistPosition?.top ?? 0) / config.height * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max={config.height} step="1"
                                    className="w-full accent-[var(--accent)]"
                                    value={config.tracklistPosition?.top ?? (config.template === 'modern' ? config.height * 0.81 : config.template === 'split' ? config.height * 0.7 : config.height * 0.8)}
                                    onChange={(e) => setConfig({ tracklistPosition: { top: parseInt(e.target.value), left: config.tracklistPosition?.left ?? (config.tracklistAlign === 'left' ? (config.padding ?? 60) : config.tracklistAlign === 'right' ? config.width - (config.padding ?? 60) : config.width / 2) } })}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-[10px] uppercase font-bold opacity-60">Indent</label>
                                <span className="text-[10px]">{config.tracklistIndent}px</span>
                            </div>
                            <input
                                type="range" min="0" max="100" step="5"
                                className="w-full accent-[var(--accent)]"
                                value={config.tracklistIndent ?? 0}
                                onChange={(e) => setConfig({ tracklistIndent: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-[10px] uppercase font-bold opacity-60">Padding</label>
                                <span className="text-[10px]">{config.padding}px</span>
                            </div>
                            <input
                                type="range" min="0" max="150" step="10"
                                className="w-full accent-[var(--accent)]"
                                value={config.padding ?? 60}
                                onChange={(e) => setConfig({ padding: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs block mb-1">Colors</label>
                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] w-12 opacity-70">Bg</span>
                                <input
                                    type="color"
                                    className="h-6 w-6 rounded cursor-pointer bg-transparent p-0 overflow-hidden"
                                    value={config.backgroundColor.startsWith('linear') ? '#000000' : config.backgroundColor}
                                    onChange={(e) => setConfig({ backgroundColor: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="flex-1 rounded p-1.5 text-xs"
                                    value={config.backgroundColor}
                                    onChange={(e) => setConfig({ backgroundColor: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] w-12 opacity-70">Main Text</span>
                                <input
                                    type="color"
                                    className="h-6 w-6 rounded cursor-pointer bg-transparent p-0 overflow-hidden"
                                    value={config.textColor}
                                    onChange={(e) => setConfig({ textColor: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="flex-1 rounded p-1.5 text-xs"
                                    value={config.textColor}
                                    onChange={(e) => setConfig({ textColor: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] w-12 opacity-70">Artist</span>
                                <input
                                    type="color"
                                    className="h-6 w-6 rounded cursor-pointer bg-transparent p-0 overflow-hidden"
                                    value={config.artistColor || config.textColor}
                                    onChange={(e) => setConfig({ artistColor: e.target.value })}
                                />
                                <button
                                    className="text-[10px] opacity-50 hover:opacity-100"
                                    onClick={() => setConfig({ artistColor: undefined })}
                                >Reset</button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] w-12 opacity-70">Album</span>
                                <input
                                    type="color"
                                    className="h-6 w-6 rounded cursor-pointer bg-transparent p-0 overflow-hidden"
                                    value={config.albumColor || config.textColor}
                                    onChange={(e) => setConfig({ albumColor: e.target.value })}
                                />
                                <button
                                    className="text-[10px] opacity-50 hover:opacity-100"
                                    onClick={() => setConfig({ albumColor: undefined })}
                                >Reset</button>
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="text-[10px] text-neutral-500 block mb-1">Gradients</label>
                            <div className="flex flex-wrap gap-1">
                                {['linear-gradient(to bottom, #000000, #434343)', 'linear-gradient(to bottom, #0f2027, #2c5364)', 'linear-gradient(to bottom, #12c2e9, #c471ed, #f64f59)', 'linear-gradient(to bottom, #FF5F6D, #FFC371)'].map((g, i) => (
                                    <button
                                        key={i}
                                        className="h-6 w-6 rounded-full border border-white/10"
                                        style={{ background: g }}
                                        onClick={() => setConfig({ backgroundColor: g })}
                                        title="Apply Gradient"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Tracks */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-bold">Tracklist</h3>
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
