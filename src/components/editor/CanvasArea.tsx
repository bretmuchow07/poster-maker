'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Textbox, Group, Text, Rect, Image as FabricImage, Gradient, FabricObject } from 'fabric';
import { usePosterStore } from '@/store/posterStore';
import { saveAs } from 'file-saver';

export function CanvasArea() {
    const { config, metadata } = usePosterStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [scale, setScale] = useState(1);
    const [zoom, setZoom] = useState(1);

    // Initialize Canvas
    useEffect(() => {
        if (!canvasRef.current || fabricRef.current) return;
        const canvas = new Canvas(canvasRef.current, {
            width: config.width,
            height: config.height,
            backgroundColor: config.backgroundColor,
            preserveObjectStacking: true,
            selection: true,
        });
        fabricRef.current = canvas;
        return () => {
            canvas.dispose();
            fabricRef.current = null;
        };
    }, []);

    // Handle Auto-Scale
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            const padding = 60;
            const sX = (clientWidth - padding) / config.width;
            const sY = (clientHeight - padding) / config.height;
            setScale(Math.min(sX, sY, 0.9));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        const ro = new ResizeObserver(handleResize);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => {
            window.removeEventListener('resize', handleResize);
            ro.disconnect();
        };
    }, [config.width, config.height]);

    // Zoom Handlers
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                setZoom(z => Math.min(Math.max(z * delta, 0.1), 5));
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
                e.preventDefault();
                setZoom(z => Math.min(z * 1.1, 5));
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === '-')) {
                e.preventDefault();
                setZoom(z => Math.max(z * 0.9, 0.1));
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === '0')) {
                e.preventDefault();
                setZoom(1);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Export Handler
    const handleExport = async () => {
        if (!fabricRef.current) {
            console.error('Canvas not initialized');
            return;
        }

        const canvas = fabricRef.current;

        try {
            // Deselect any active objects
            canvas.discardActiveObject();

            // Hide guides for export
            const guides = canvas.getObjects().filter(obj => (obj as any).id === 'guide');
            guides.forEach(g => {
                g.visible = false;
            });

            canvas.renderAll();

            // Wait for render to complete
            await new Promise(resolve => setTimeout(resolve, 150));

            const { width, height } = config;
            const format = config.exportFormat || 'png';
            const quality = config.exportQuality || 1;
            const multiplier = 2; // High res export

            const filename = `poster-${(metadata.album || 'untitled').toLowerCase().replace(/\s+/g, '-')}`;

            if (format === 'pdf') {
                const { jsPDF } = await import('jspdf');

                // Use Fabric.js canvas for high-quality export
                const imgData = canvas.toDataURL({ format: 'png', quality: 1, multiplier: multiplier });

                const pdf = new jsPDF({
                    orientation: width > height ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [width * multiplier, height * multiplier]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, width * multiplier, height * multiplier);
                pdf.save(`${filename}.pdf`);

                console.log('PDF exported successfully');
            } else {
                // Use Fabric.js canvas for high-quality export
                const dataURL = canvas.toDataURL({ format: format as any, quality: quality, multiplier: multiplier });

                // Convert DataURL to Blob
                const arr = dataURL.split(',');
                // @ts-ignore
                const mime = arr[0].match(/:(.*?);/)?.[1] || (format === 'jpg' ? 'image/jpeg' : 'image/png');
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });

                // Trigger download
                saveAs(blob, `${filename}.${format}`);

                console.log(`${format.toUpperCase()} exported successfully`);
            }

            // Restore guides
            guides.forEach(g => {
                g.visible = true;
            });
            canvas.renderAll();

        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);

            // Restore guides in case of error
            try {
                const guides = canvas.getObjects().filter(obj => (obj as any).id === 'guide');
                guides.forEach(g => {
                    g.visible = true;
                });
                canvas.renderAll();
            } catch (e) {
                console.error('Failed to restore guides:', e);
            }
        }
    };

    // Trigger Export Effect
    useEffect(() => {
        if (config.exportTrigger > 0) handleExport();
    }, [config.exportTrigger]);

    // Main Render Loop
    useEffect(() => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;

        // 1. Sync Dimensions and Background
        canvas.setDimensions({ width: config.width, height: config.height });

        const renderTextAndBranding = () => {
            // Clear all objects except background image
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj !== canvas.backgroundImage) {
                    canvas.remove(obj);
                }
            });

            const padding = config.padding ?? 60;
            const isModern = config.template === 'modern';
            const isSplit = config.template === 'split';
            const isMinimal = config.template === 'minimal';

            // 2. Create Artist and Album Objects
            const albumAlign = config.albumAlign ?? (isModern ? 'center' : 'left');
            const artistAlign = config.artistAlign ?? (isModern ? 'center' : 'left');
            const trackAlign = config.tracklistAlign ?? (isModern ? 'center' : 'left');

            const artistText = new Textbox(metadata.artist.toUpperCase(), {
                // @ts-ignore
                name: 'artist',
                fontFamily: config.fontFamily || 'Inter',
                fill: config.artistColor || config.textColor || '#000000',
                fontWeight: config.artistFontWeight || 700,
                textAlign: artistAlign,
                originX: artistAlign,
                selectable: true,
                width: config.width - padding * 2,
                splitByGrapheme: true
            });

            const albumText = new Textbox(metadata.album.toUpperCase(), {
                // @ts-ignore
                name: 'album',
                fontFamily: config.fontFamily || 'Inter',
                fill: config.albumColor || config.textColor || '#000000',
                fontWeight: config.albumFontWeight || 800,
                textAlign: albumAlign,
                originX: albumAlign,
                selectable: true,
                width: config.width - padding * 2,
                splitByGrapheme: true
            });

            // Position based on template or overrides
            const defaultPositions = {
                modern: { artist: config.height * 0.65, album: config.height * 0.72 },
                split: { artist: config.height * 0.55, album: config.height * 0.62 },
                minimal: { artist: config.height * 0.6, album: config.height * 0.7 }
            };

            const templateDefaults = defaultPositions[isModern ? 'modern' : isSplit ? 'split' : 'minimal'];

            // Common Horizontal Position
            const getX = (align: string) => align === 'left' ? padding : align === 'right' ? config.width - padding : config.width / 2;

            artistText.set({
                top: config.artistPosition?.top ?? templateDefaults.artist,
                left: config.artistPosition?.left ?? getX(artistAlign),
                fontSize: config.artistFontSize ?? (isModern ? 28 : isSplit ? 60 : 80)
            });
            albumText.set({
                top: config.albumPosition?.top ?? templateDefaults.album,
                left: config.albumPosition?.left ?? getX(albumAlign),
                fontSize: config.albumFontSize ?? (isModern ? 85 : isSplit ? 40 : 30)
            });
            artistText.set({ left: getX(artistAlign) });
            albumText.set({ left: getX(albumAlign) });

            // Prevent text overlapping image
            if (isModern && canvas.backgroundImage) {
                const img = canvas.backgroundImage;
                const imageBottom = (img.top || 0) + (img.height || 0) * (img.scaleY || 1);
                const minGap = 10;
                if (artistText.top < imageBottom + minGap) {
                    artistText.set({ top: imageBottom + minGap });
                }
                if (albumText.top < imageBottom + minGap) {
                    albumText.set({ top: imageBottom + minGap });
                }
            }

            canvas.add(artistText, albumText);

            // Prevent overlapping: adjust positions if necessary
            const artistBounds = artistText.getBoundingRect();
            const albumBounds = albumText.getBoundingRect();
            const minGap = 10; // minimum gap between elements

            if (albumBounds.top < artistBounds.top + artistBounds.height + minGap) {
                albumText.set({ top: artistBounds.top + artistBounds.height + minGap });
                albumText.setCoords();
            }

            // 3. Tracklist Logic
            const trackFontSize = isModern ? (config.tracklistFontSize ?? 14) : 24;
            const spacing = trackFontSize + 4;
            const indent = config.tracklistIndent ?? 0;

            const trackTexts = metadata.tracks.map((track, i) => {
                const num = String(i + 1).padStart(2, '0');
                const trackWidth = isModern && metadata.tracks.length > 11
                    ? (config.width - padding * 2) * 0.45
                    : (config.width - padding * 2);

                return new Textbox(`${num}. ${track.title.toUpperCase()}`, {
                    fontSize: trackFontSize,
                    fontFamily: config.fontFamily,
                    fill: config.textColor,
                    fontWeight: config.tracklistFontWeight || 600,
                    top: i * spacing,
                    left: indent,
                    width: trackWidth,
                    splitByGrapheme: true
                });
            });

            if (trackTexts.length > 0) {
                let trackGroup;
                if (isModern && trackTexts.length > 11) {
                    const midpoint = Math.ceil(trackTexts.length / 2);
                    const col1 = trackTexts.slice(0, midpoint);
                    const col2 = trackTexts.slice(midpoint).map((t, idx) => {
                        t.set({ top: idx * spacing, left: (config.width - padding * 2) * 0.5 + indent });
                        return t;
                    });
                    // @ts-ignore
                    trackGroup = new Group([...col1, ...col2], { name: 'tracklist', selectable: true });
                } else {
                    // @ts-ignore
                    trackGroup = new Group(trackTexts, { name: 'tracklist', selectable: true });
                }

                const defaultTrackTop = isModern ? config.height * 0.81 : isSplit ? config.height * 0.7 : config.height * 0.8;
                trackGroup.set({
                    top: config.tracklistPosition?.top ?? defaultTrackTop,
                    left: config.tracklistPosition?.left ?? getX(trackAlign),
                    originX: trackAlign
                });
                canvas.add(trackGroup);

                // Prevent tracklist overlapping album
                const albumBounds = albumText.getBoundingRect();
                const trackBounds = trackGroup.getBoundingRect();
                if (trackBounds.top < albumBounds.top + albumBounds.height + minGap) {
                    trackGroup.set({ top: albumBounds.top + albumBounds.height + minGap });
                    trackGroup.setCoords();
                }
            }

            // 4. Branding (Modern Only)
            if (isModern) {
                const infoText = new Text(`ALBUM • ${metadata.year}`, {
                    left: config.width - padding,
                    top: config.height - padding - 75,
                    fontSize: 18,
                    fontFamily: config.fontFamily,
                    fill: config.textColor,
                    fontWeight: 800,
                    originX: 'right',
                    // @ts-ignore
                    name: 'metadata_info'
                });

                const paRect = new Rect({
                    left: config.width - padding,
                    top: config.height - padding - 50,
                    width: 100,
                    height: 50,
                    fill: 'transparent',
                    stroke: config.textColor,
                    strokeWidth: 2,
                    originX: 'right',
                    // @ts-ignore
                    name: 'pa_rect'
                });

                const paText = new Text('PARENTAL\nADVISORY\nEXPLICIT CONTENT', {
                    left: config.width - padding - 50,
                    top: config.height - padding - 25,
                    fontSize: 10,
                    fontFamily: 'Arial Black',
                    fill: config.textColor,
                    fontWeight: 900,
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    // @ts-ignore
                    name: 'pa_text'
                });
                canvas.add(infoText, paRect, paText);
            }

            // 5. Label Info Block
            if (config.label?.visible) {
                const { text = '', catalogNumber = '', year = '', position, width, align = 'left' } = config.label;

                const labelTitle = new Textbox((text || '').toUpperCase(), {
                    fontSize: 12,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.textColor || '#000000',
                    fontWeight: 700,
                    width: width,
                    textAlign: align,
                    splitByGrapheme: true
                });

                const labelMeta = new Textbox(`${catalogNumber} • ${year}`, {
                    fontSize: 10,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.textColor || '#000000',
                    fontWeight: 400,
                    top: 14,
                    width: width,
                    textAlign: align,
                    splitByGrapheme: true
                });

                const labelGroup = new Group([labelTitle, labelMeta], {
                    left: position.left,
                    top: position.top,
                    name: 'label_info',
                    selectable: true,
                } as any);

                canvas.add(labelGroup);
            }

            // 6. Print Guides
            if (config.print) {
                const { showBleed, showMargins, bleedMm, marginMm, dpi } = config.print;
                const pxPerMm = (dpi || 72) / 25.4;
                const bleedPx = (bleedMm || 3) * pxPerMm;
                const marginPx = (marginMm || 10) * pxPerMm;

                if (showBleed) {
                    const bleedRect = new Rect({
                        left: bleedPx,
                        top: bleedPx,
                        width: config.width - (bleedPx * 2),
                        height: config.height - (bleedPx * 2),
                        fill: 'transparent',
                        stroke: 'cyan',
                        strokeWidth: 1,
                        strokeDashArray: [5, 5],
                        selectable: false,
                        evented: false,
                        // @ts-ignore
                        id: 'guide'
                    });
                    canvas.add(bleedRect);
                }

                if (showMargins) {
                    const marginRect = new Rect({
                        left: marginPx,
                        top: marginPx,
                        width: config.width - (marginPx * 2),
                        height: config.height - (marginPx * 2),
                        fill: 'transparent',
                        stroke: 'magenta',
                        strokeWidth: 1,
                        strokeDashArray: [5, 5],
                        selectable: false,
                        evented: false,
                        // @ts-ignore
                        id: 'guide'
                    });
                    canvas.add(marginRect);
                }
            }
            canvas.renderAll();
        };

        // Image Loading and Background Handling
        if (config.backgroundImage) {
            FabricImage.fromURL(config.backgroundImage, { crossOrigin: 'anonymous' }).then((img: FabricObject) => {
                if (!img.width || !img.height) return;
                img.set({ clipPath: undefined, scaleX: 1, scaleY: 1, angle: 0 });

                if (config.template === 'modern') {
                    const targetH = config.height * 0.60;
                    const s = Math.max(config.width / img.width, targetH / img.height);
                    img.set({ scaleX: s, scaleY: s, originX: 'center', originY: 'top', left: config.width / 2, top: 0 });
                } else if (config.template === 'split') {
                    const s = config.width / img.width;
                    img.set({ scaleX: s, scaleY: s, originX: 'center', originY: 'top', left: config.width / 2, top: 0 });
                } else if (config.template === 'minimal') {
                    const size = Math.min(config.width, config.height) * 0.4;
                    const s = Math.min(size / img.width, size / img.height);
                    img.set({ scaleX: s, scaleY: s, originX: 'center', originY: 'center', left: config.width / 2, top: config.height * 0.3 });
                }

                canvas.backgroundImage = img;
                handleBackgroundColor(canvas, config.backgroundColor);
                renderTextAndBranding();
            }).catch(err => {
                console.error("Failed to load background image:", err);
                canvas.backgroundImage = undefined;
                handleBackgroundColor(canvas, config.backgroundColor);
                renderTextAndBranding();
            });
        } else {
            canvas.backgroundImage = undefined;
            handleBackgroundColor(canvas, config.backgroundColor);
            renderTextAndBranding();
        }

        // Ensure font is loaded, then re-render to correct metrics
        if (config.fontFamily) {
            document.fonts.load(`12px "${config.fontFamily}"`).then(() => {
                // We only re-render if the component is still mounted and canvas exists
                if (fabricRef.current) {
                    renderTextAndBranding();
                }
            }).catch(e => console.error("Error loading font for canvas:", e));
        }

    }, [config, metadata]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-[#f0f1f3] dark:bg-neutral-900/50 relative overflow-hidden">
            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex gap-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur rounded-lg p-1 border border-neutral-200 dark:border-neutral-700 z-10 shadow-sm">
                <button onClick={() => setZoom(z => Math.max(z * 0.9, 0.1))} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 rounded text-neutral-700 dark:text-white">-</button>
                <span className="p-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(z * 1.1, 5))} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 rounded text-neutral-700 dark:text-white">+</button>
                <button onClick={() => setZoom(1)} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 rounded text-neutral-700 dark:text-white px-3">Fit</button>
            </div>

            <div className="w-full h-full overflow-auto flex items-center justify-center p-10">
                <div style={{
                    width: config.width * scale * zoom,
                    height: config.height * scale * zoom,
                    flexShrink: 0,
                    transition: 'width 0.1s ease-out, height 0.1s ease-out'
                }}>
                    <div style={{
                        width: config.width,
                        height: config.height,
                        transform: `scale(${scale * zoom})`,
                        transformOrigin: 'top left',
                        boxShadow: '0 0 50px rgba(0,0,0,0.1)',
                        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
                    }} className="hover:shadow-2xl dark:shadow-black/50">
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function handleBackgroundColor(canvas: Canvas, colorStr: string) {
    if (colorStr.startsWith('linear-gradient')) {
        const match = colorStr.match(/linear-gradient\((.*)\)/);
        if (!match) return;
        const parts = match[1].split(',').map(s => s.trim());
        let coords = { x1: 0, y1: 0, x2: 0, y2: canvas.height || 0 };
        let colorsStartIdx = 0;

        if (parts[0].startsWith('to ')) {
            colorsStartIdx = 1;
            const dir = parts[0];
            if (dir.includes('right')) coords = { x1: 0, y1: 0, x2: canvas.width || 0, y2: 0 };
            else if (dir.includes('bottom right')) coords = { x1: 0, y1: 0, x2: canvas.width || 0, y2: canvas.height || 0 };
        }

        const colorStops: any[] = [];
        const colorParts = parts.slice(colorsStartIdx);
        colorParts.forEach((c, i) => {
            colorStops.push({ offset: i / (colorParts.length - 1), color: c });
        });

        canvas.backgroundColor = new Gradient({
            type: 'linear',
            coords: coords,
            colorStops: colorStops
        });
    } else {
        canvas.backgroundColor = colorStr;
    }
}
