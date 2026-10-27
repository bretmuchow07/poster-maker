'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Textbox, Text, Rect, Group, Image as FabricImage, Gradient, FabricObject, filters } from 'fabric';
import { usePosterStore } from '@/store/posterStore';
import { applyImageEdgeFade } from '@/utils/imageUtils';
import { saveAs } from 'file-saver';

function hexToRgba(hex: string, alpha: number): string {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    if (hex.startsWith('linear-gradient')) {
        const match = hex.match(/#[a-fA-F0-9]{3,6}/);
        if (match) return hexToRgba(match[0], alpha);
        return `rgba(24, 24, 27, ${alpha})`;
    }
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    if (c.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CanvasArea() {
    const { config, metadata } = usePosterStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const prevExportTrigger = useRef<number>(config.exportTrigger);
    const cachedFadedImage = useRef<{ key: string; src: string }>({ key: '', src: '' });
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
            clipPath: new Rect({
                left: 0,
                top: 0,
                width: config.width,
                height: config.height,
                originX: 'left',
                originY: 'top',
                selectable: false,
                evented: false
            })
        });

        // Listen for direct on-canvas image & text manipulation
        const handleObjectModified = (e: any) => {
            const target = e.target;
            if (!target) return;

            if (target.name === 'poster_image') {
                const baseLeft = target.data?.baseLeft ?? (config.width / 2);
                const baseTop = target.data?.baseTop ?? 0;
                const baseScale = target.data?.baseScale ?? 1;

                const newOffsetX = Math.round((target.left || 0) - baseLeft);
                const newOffsetY = Math.round((target.top || 0) - baseTop);
                const newScale = Math.round(((target.scaleX || baseScale) / baseScale) * 100) / 100;

                usePosterStore.getState().setConfig({
                    imageOffsetX: newOffsetX,
                    imageOffsetY: newOffsetY,
                    imageScale: newScale
                });
            } else if (target.name === 'artist') {
                usePosterStore.getState().setConfig({
                    artistPosition: { left: Math.round(target.left || 0), top: Math.round(target.top || 0) }
                });
            } else if (target.name === 'album') {
                usePosterStore.getState().setConfig({
                    albumPosition: { left: Math.round(target.left || 0), top: Math.round(target.top || 0) }
                });
            } else if (target.name === 'tracklist' || target.name === 'palette_tracklist' || target.name === 'inline_tracks' || target.name === 'tracklist_col1') {
                usePosterStore.getState().setConfig({
                    tracklistPosition: { left: Math.round(target.left || 0), top: Math.round(target.top || 0) }
                });
            } else if (target.name === 'swatches_group') {
                usePosterStore.getState().setConfig({
                    swatchesPosition: { left: Math.round(target.left || 0), top: Math.round(target.top || 0) }
                });
            }
        };

        canvas.on('object:modified', handleObjectModified);
        fabricRef.current = canvas;

        return () => {
            canvas.off('object:modified', handleObjectModified);
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
            canvas.discardActiveObject();

            // Hide guides for export
            const guides = canvas.getObjects().filter(obj => (obj as any).id === 'guide');
            guides.forEach(g => {
                g.visible = false;
            });

            canvas.renderAll();
            await new Promise(resolve => setTimeout(resolve, 150));

            const { width, height } = config;
            const format = config.exportFormat || 'png';
            const quality = config.exportQuality || 1;
            const dpi = config.print?.dpi || 72;
            const multiplier = dpi === 300 ? 4 : dpi === 150 ? 2 : 1;
            const filename = `poster-${(metadata.album || 'untitled').toLowerCase().replace(/\s+/g, '-')}`;

            if (format === 'pdf') {
                const { jsPDF } = await import('jspdf');
                const imgData = canvas.toDataURL({ format: 'png', quality: 1, multiplier });

                const pdf = new jsPDF({
                    orientation: width > height ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [width * multiplier, height * multiplier]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, width * multiplier, height * multiplier);
                pdf.save(`${filename}.pdf`);
            } else {
                const dataURL = canvas.toDataURL({ format: format as any, quality, multiplier });
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
                saveAs(blob, `${filename}.${format}`);
            }

            guides.forEach(g => {
                g.visible = true;
            });
            canvas.renderAll();
        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}.`);
        }
    };

    // Trigger Export Effect with guard against auto-export on reload
    useEffect(() => {
        if (config.exportTrigger > 0 && config.exportTrigger !== prevExportTrigger.current) {
            prevExportTrigger.current = config.exportTrigger;
            handleExport();
        }
    }, [config.exportTrigger]);

    // Main Render Loop
    useEffect(() => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        canvas.setDimensions({ width: config.width, height: config.height });
        canvas.clipPath = new Rect({
            left: 0,
            top: 0,
            width: config.width,
            height: config.height,
            originX: 'left',
            originY: 'top',
            selectable: false,
            evented: false
        });
        handleBackgroundColor(canvas, config.backgroundColor);

        const renderTextAndBranding = (loadedImg?: FabricImage) => {
            // Keep the image and clear other objects
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if ((obj as any).name !== 'poster_image') {
                    canvas.remove(obj);
                }
            });

            const padding = config.padding ?? 60;
            const isModern = config.template === 'modern';
            const isSplit = config.template === 'split';
            const isMinimal = config.template === 'minimal';
            const isPalette = config.template === 'palette';

            // 1. Inset Frame Border Rule
            if (config.frameBorder?.visible) {
                const dpi = config.print?.dpi || 72;
                const pxPerMm = dpi / 25.4;
                const insetPx = (config.frameBorder.insetMm || 12) * pxPerMm;
                const strokeWidth = config.frameBorder.strokeWidth || 1.5;
                const borderRect = new Rect({
                    left: insetPx,
                    top: insetPx,
                    width: config.width - (insetPx * 2),
                    height: config.height - (insetPx * 2),
                    fill: 'transparent',
                    stroke: config.frameBorder.color || config.textColor || '#000000',
                    strokeWidth,
                    selectable: false,
                    evented: false,
                    // @ts-ignore
                    name: 'frame_border'
                });
                canvas.add(borderRect);
            }

            // Note: Image Edge Blend is baked directly into the poster image bitmap's alpha channel
            // (via applyImageEdgeFade) so it seamlessly tracks positioning, scaling, and rotation.

            // ==========================================
            // TEMPLATE: COLOR SWATCH
            // ==========================================
            if (isPalette) {
                const artBottom = config.height * 0.54;
                const contentTop = artBottom + 28;
                const availableW = config.width - padding * 2;
                const midGap = 40;
                const col1W = Math.floor((availableW - midGap) * 0.46);
                const col2W = Math.floor((availableW - midGap) * 0.54);
                const col1Left = padding;
                const col2Left = padding + col1W + midGap;

                // Column 1: Numbered Tracklist (Direct robust multiline Textbox)
                const trackFontSize = config.tracklistFontSize ?? 13;
                const tracklistLines = metadata.tracks.map((track, i) => {
                    const num = String(i + 1).padStart(2, '0');
                    return `${num}. ${track.title.toUpperCase()}`;
                }).join('\n');

                const tracklistText = new Textbox(tracklistLines, {
                    left: config.tracklistPosition?.left ?? col1Left,
                    top: config.tracklistPosition?.top ?? contentTop,
                    width: col1W,
                    fontSize: trackFontSize,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.textColor || '#000000',
                    fontWeight: config.tracklistFontWeight || 700,
                    lineHeight: 1.45,
                    selectable: true,
                    // @ts-ignore
                    name: 'palette_tracklist'
                });
                canvas.add(tracklistText);

                // Column 1 Footer: Label & Length
                const labelText = metadata.label || 'RECORD LABEL';
                const lengthText = metadata.totalDuration || '45:10';
                const trackHeight = tracklistText.height || (metadata.tracks.length * (trackFontSize + 6));
                const metaTop = Math.min(Math.max(contentTop + trackHeight + 16, config.height - padding - 45), config.height - padding - 35);

                const metaBlock = new Textbox(`LABEL: ${labelText.toUpperCase()}\nALBUM LENGTH: ${lengthText}`, {
                    left: col1Left,
                    top: metaTop,
                    width: col1W,
                    fontSize: 10,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.textColor || '#000000',
                    fontWeight: 800,
                    lineHeight: 1.3,
                    selectable: true,
                    // @ts-ignore
                    name: 'palette_meta'
                });
                canvas.add(metaBlock);

                // Column 2: Swatches, Artist, Title, Signature, Release Date
                let currentY = contentTop;

                // 5 Color Swatches (Movable Group)
                const swatches = config.paletteSwatches && config.paletteSwatches.length >= 5
                    ? config.paletteSwatches.slice(0, 5)
                    : ['#2c3e50', '#a27b5c', '#dcd7c9', '#4f709c', '#213555'];

                const swatchGap = 8;
                const swatchW = Math.floor((col2W - (4 * swatchGap)) / 5);
                const swatchH = swatchW;
                const rx = config.swatchShape === 'circle' ? swatchW / 2 : config.swatchShape === 'rounded' ? 6 : 0;

                const defaultSwatchLeft = col2Left;
                const defaultSwatchTop = currentY;
                const swatchLeft = config.swatchesPosition?.left ?? defaultSwatchLeft;
                const swatchTop = config.swatchesPosition?.top ?? defaultSwatchTop;

                const swatchRects = swatches.map((color, idx) => {
                    return new Rect({
                        left: idx * (swatchW + swatchGap),
                        top: 0,
                        width: swatchW,
                        height: swatchH,
                        fill: color,
                        rx,
                        ry: rx,
                        selectable: false,
                        evented: false,
                        // @ts-ignore
                        name: `swatch_${idx}`
                    });
                });

                const swatchGroup = new Group(swatchRects, {
                    left: swatchLeft,
                    top: swatchTop,
                    originX: 'left',
                    originY: 'top',
                    selectable: true,
                    hasControls: true,
                    lockRotation: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    // @ts-ignore
                    name: 'swatches_group'
                });
                canvas.add(swatchGroup);

                if (!config.swatchesPosition) {
                    currentY += swatchH + 20;
                }

                // Artist Name
                const artistLeft = config.artistPosition?.left ?? col2Left;
                const artistTop = config.artistPosition?.top ?? currentY;
                const artistText = new Textbox(metadata.artist.toUpperCase(), {
                    left: artistLeft,
                    top: artistTop,
                    fontSize: config.artistFontSize ?? 24,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.artistColor || config.textColor || '#000000',
                    fontWeight: config.artistFontWeight || 800,
                    width: col2W,
                    splitByGrapheme: true,
                    selectable: true,
                    // @ts-ignore
                    name: 'artist'
                });
                canvas.add(artistText);
                currentY = Math.max(currentY + (artistText.height || 30) + 8, artistTop + (artistText.height || 30) + 8);

                // Big Stacked Album Title
                const albumLeft = config.albumPosition?.left ?? col2Left;
                const albumTop = config.albumPosition?.top ?? currentY;
                const albumText = new Textbox(metadata.album.toUpperCase(), {
                    left: albumLeft,
                    top: albumTop,
                    fontSize: config.albumFontSize ?? 56,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.albumColor || config.textColor || '#000000',
                    fontWeight: config.albumFontWeight || 900,
                    lineHeight: 0.95,
                    width: col2W,
                    splitByGrapheme: true,
                    selectable: true,
                    // @ts-ignore
                    name: 'album'
                });
                canvas.add(albumText);
                currentY = Math.max(currentY + (albumText.height || 60) + 12, albumTop + (albumText.height || 60) + 12);

                // Cursive Signature / Autograph Layer
                if (config.signature?.visible) {
                    const sigText = new Textbox(config.signature.text || metadata.artist, {
                        left: col2Left,
                        top: currentY,
                        fontSize: config.signature.fontSize || 34,
                        fontFamily: config.signature.fontFamily || 'Caveat',
                        fill: config.signature.color || config.textColor || '#000000',
                        width: col2W,
                        selectable: true,
                        // @ts-ignore
                        name: 'signature'
                    });
                    canvas.add(sigText);
                    currentY += (sigText.height || 40) + 10;
                }

                // Release Date Footer
                const releaseTop = Math.min(Math.max(currentY + 10, config.height - padding - 40), config.height - padding - 30);
                const releaseText = new Textbox(`RELEASED ON\n${metadata.releaseDate || metadata.year || '2024'}`.toUpperCase(), {
                    left: col2Left,
                    top: releaseTop,
                    fontSize: 10,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.textColor || '#000000',
                    fontWeight: 800,
                    width: col2W,
                    lineHeight: 1.3,
                    selectable: true,
                    // @ts-ignore
                    name: 'release_date'
                });
                canvas.add(releaseText);

            } else {
                // ==========================================
                // TEMPLATES: MODERN, SPLIT & MINIMAL
                // ==========================================
                const albumAlign = config.albumAlign ?? (isModern ? 'center' : isMinimal ? 'center' : 'left');
                const artistAlign = config.artistAlign ?? (isModern ? 'center' : isMinimal ? 'center' : 'left');
                const trackAlign = config.tracklistAlign ?? (isModern ? 'center' : isMinimal ? 'center' : 'left');

                const getX = (align: string) => align === 'left' ? padding : align === 'right' ? config.width - padding : config.width / 2;

                // Slashed Inline Tracklist
                if (isMinimal && config.tracklistLayout === 'inline') {
                    const inlineContent = metadata.tracks.map(t => t.title.toUpperCase()).join('   /   ');
                    const inlineText = new Textbox(inlineContent, {
                        left: config.width / 2,
                        top: padding + 15,
                        width: config.width - padding * 2,
                        fontSize: 11,
                        fontFamily: config.fontFamily || 'Courier New',
                        fill: config.textColor || '#000000',
                        fontWeight: 700,
                        textAlign: 'center',
                        originX: 'center',
                        lineHeight: 1.6,
                        selectable: true,
                        // @ts-ignore
                        name: 'inline_tracks'
                    });
                    canvas.add(inlineText);
                }

                // Artist & Album Text
                const defaultPositions = {
                    modern: { artist: config.height * 0.65, album: config.height * 0.72 },
                    split: { artist: config.height * 0.54, album: config.height * 0.61 },
                    minimal: { artist: config.height * 0.78, album: config.height * 0.70 },
                };
                const templateDefaults = defaultPositions[isModern ? 'modern' : isSplit ? 'split' : 'minimal'];

                // Ghost Blur Echo Effect
                if (config.textEffect === 'blur-echo') {
                    const echoText = new Textbox(metadata.album.toUpperCase(), {
                        left: (config.albumPosition?.left ?? getX(albumAlign)) + 6,
                        top: (config.albumPosition?.top ?? templateDefaults.album) + 4,
                        fontSize: config.albumFontSize ?? (isModern ? 85 : isSplit ? 48 : 65),
                        fontFamily: config.fontFamily || 'Inter',
                        fill: config.albumColor || config.textColor || '#000000',
                        fontWeight: config.albumFontWeight || 900,
                        textAlign: albumAlign,
                        originX: albumAlign,
                        opacity: 0.25,
                        selectable: false,
                        width: config.width - padding * 2
                    });
                    canvas.add(echoText);
                }

                const artistText = new Textbox(metadata.artist.toUpperCase(), {
                    left: config.artistPosition?.left ?? getX(artistAlign),
                    top: config.artistPosition?.top ?? templateDefaults.artist,
                    fontSize: config.artistFontSize ?? (isModern ? 28 : isSplit ? 40 : 28),
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.artistColor || config.textColor || '#000000',
                    fontWeight: config.artistFontWeight || 800,
                    textAlign: artistAlign,
                    originX: artistAlign,
                    selectable: true,
                    width: config.width - padding * 2,
                    splitByGrapheme: true,
                    // @ts-ignore
                    name: 'artist'
                });

                const albumText = new Textbox(metadata.album.toUpperCase(), {
                    left: config.albumPosition?.left ?? getX(albumAlign),
                    top: config.albumPosition?.top ?? templateDefaults.album,
                    fontSize: config.albumFontSize ?? (isModern ? 85 : isSplit ? 48 : 65),
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.albumColor || config.textColor || '#000000',
                    fontWeight: config.albumFontWeight || 900,
                    textAlign: albumAlign,
                    originX: albumAlign,
                    selectable: true,
                    width: config.width - padding * 2,
                    splitByGrapheme: true,
                    // @ts-ignore
                    name: 'album'
                });

                canvas.add(artistText, albumText);

                // Signature script if enabled
                if (config.signature?.visible) {
                    const sigText = new Textbox(config.signature.text || metadata.artist, {
                        left: getX(albumAlign),
                        top: (albumText.top || templateDefaults.album) + (albumText.height || 50) + 8,
                        fontSize: config.signature.fontSize || 34,
                        fontFamily: config.signature.fontFamily || 'Caveat',
                        fill: config.signature.color || config.textColor || '#000000',
                        textAlign: albumAlign,
                        originX: albumAlign,
                        width: config.width - padding * 2,
                        selectable: true,
                        // @ts-ignore
                        name: 'signature'
                    });
                    canvas.add(sigText);
                }

                // Tracklist rendering (Single Column or 2 Balanced Columns without empty Group bugs)
                if (!(isMinimal && config.tracklistLayout === 'inline')) {
                    const isDouble = config.tracklistLayout === 'double' || metadata.tracks.length > 11;
                    const trackFontSize = config.tracklistFontSize ?? (isDouble ? 12 : 14);
                    const defaultTrackTop = isModern ? config.height * 0.81 : isSplit ? config.height * 0.69 : config.height * 0.83;
                    const trackTop = config.tracklistPosition?.top ?? defaultTrackTop;

                    if (isDouble && metadata.tracks.length > 0) {
                        const midpoint = Math.ceil(metadata.tracks.length / 2);
                        const colW = (config.width - padding * 2) * 0.46;
                        const colGap = (config.width - padding * 2) * 0.08;
                        const col1Left = padding;
                        const col2Left = padding + colW + colGap;

                        const col1Content = metadata.tracks.slice(0, midpoint).map((t, idx) => {
                            const num = String(idx + 1).padStart(2, '0');
                            return `${num}. ${t.title.toUpperCase()}`;
                        }).join('\n');

                        const col2Content = metadata.tracks.slice(midpoint).map((t, idx) => {
                            const num = String(midpoint + idx + 1).padStart(2, '0');
                            return `${num}. ${t.title.toUpperCase()}`;
                        }).join('\n');

                        const col1Text = new Textbox(col1Content, {
                            left: col1Left,
                            top: trackTop,
                            width: colW,
                            fontSize: trackFontSize,
                            fontFamily: config.fontFamily,
                            fill: config.textColor,
                            fontWeight: config.tracklistFontWeight || 600,
                            lineHeight: 1.45,
                            selectable: true,
                            // @ts-ignore
                            name: 'tracklist_col1'
                        });

                        const col2Text = new Textbox(col2Content, {
                            left: col2Left,
                            top: trackTop,
                            width: colW,
                            fontSize: trackFontSize,
                            fontFamily: config.fontFamily,
                            fill: config.textColor,
                            fontWeight: config.tracklistFontWeight || 600,
                            lineHeight: 1.45,
                            selectable: true,
                            // @ts-ignore
                            name: 'tracklist_col2'
                        });

                        canvas.add(col1Text, col2Text);
                    } else if (metadata.tracks.length > 0) {
                        const singleContent = metadata.tracks.map((t, idx) => {
                            const num = String(idx + 1).padStart(2, '0');
                            return `${num}. ${t.title.toUpperCase()}`;
                        }).join('\n');

                        const trackText = new Textbox(singleContent, {
                            left: config.tracklistPosition?.left ?? getX(trackAlign),
                            top: trackTop,
                            originX: trackAlign,
                            textAlign: trackAlign,
                            width: config.width - padding * 2,
                            fontSize: trackFontSize,
                            fontFamily: config.fontFamily,
                            fill: config.textColor,
                            fontWeight: config.tracklistFontWeight || 600,
                            lineHeight: 1.45,
                            selectable: true,
                            // @ts-ignore
                            name: 'tracklist'
                        });

                        canvas.add(trackText);
                    }
                }

                // Liner Notes (Producer & Arranger credits at bottom)
                if (config.linerNotes?.visible) {
                    const linerAlign = config.linerNotes.align || 'center';
                    const linerText = new Textbox((config.linerNotes.text || metadata.producerCredit || '').toUpperCase(), {
                        left: getX(linerAlign),
                        top: config.height - padding - 18,
                        fontSize: config.linerNotes.fontSize || 10,
                        fontFamily: config.fontFamily || 'Inter',
                        fill: config.textColor || '#000000',
                        fontWeight: 700,
                        textAlign: linerAlign,
                        originX: linerAlign,
                        width: config.width - padding * 2,
                        selectable: true,
                        // @ts-ignore
                        name: 'liner_notes'
                    });
                    canvas.add(linerText);
                }

                // Modern Template Badge: Parental Advisory + Year
                if (isModern) {
                    const infoText = new Text(`ALBUM • ${metadata.year}`, {
                        left: config.width - padding,
                        top: config.height - padding - 75,
                        fontSize: 16,
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
                        width: 95,
                        height: 48,
                        fill: 'transparent',
                        stroke: config.textColor,
                        strokeWidth: 2,
                        originX: 'right',
                        // @ts-ignore
                        name: 'pa_rect'
                    });

                    const paText = new Text('PARENTAL\nADVISORY\nEXPLICIT CONTENT', {
                        left: config.width - padding - 47,
                        top: config.height - padding - 26,
                        fontSize: 9,
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
            }

            // QR Code Rendering
            if (config.qrCode?.visible && config.qrCode.url) {
                import('qrcode').then(({ default: QRCode }) => {
                    QRCode.toDataURL(config.qrCode!.url, {
                        margin: 1,
                        width: config.qrCode!.size || 100,
                        color: {
                            dark: config.textColor || '#000000',
                            light: '#00000000'
                        }
                    }).then(qrDataUrl => {
                        FabricImage.fromURL(qrDataUrl).then(qrImg => {
                            qrImg.set({
                                left: config.width - padding - (config.qrCode!.size || 100),
                                top: config.height - padding - (config.qrCode!.size || 100) - 20,
                                selectable: true,
                                // @ts-ignore
                                name: 'qr_code'
                            });
                            canvas.add(qrImg);
                            canvas.renderAll();
                        });
                    }).catch(err => console.error('Failed to generate QR code:', err));
                });
            }

            // Print Guides
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

        // Interactive Image Loading & Setup
        if (config.backgroundImage) {
            const fadeVal = config.imageFade || 0;
            const fadeKey = `${config.backgroundImage}_${fadeVal}`;

            const getImageSrc = async (): Promise<string> => {
                if (cachedFadedImage.current.key === fadeKey && cachedFadedImage.current.src) {
                    return cachedFadedImage.current.src;
                }
                const src = await applyImageEdgeFade(config.backgroundImage!, fadeVal);
                cachedFadedImage.current = { key: fadeKey, src };
                return src;
            };

            getImageSrc().then((processedSrc) => {
                FabricImage.fromURL(processedSrc, { crossOrigin: 'anonymous' }).then((img: FabricImage) => {
                if (!img.width || !img.height) return;

                // Remove previous image object if existing
                const existing = canvas.getObjects().find(o => (o as any).name === 'poster_image');
                if (existing) canvas.remove(existing);

                const padding = config.padding ?? 60;
                let baseScale = 1;
                let baseLeft = config.width / 2;
                let baseTop = 0;
                let originX: 'center' | 'left' = 'center';
                let originY: 'top' | 'center' = 'top';

                if (config.template === 'modern') {
                    const targetH = config.height * 0.60;
                    baseScale = Math.max(config.width / img.width, targetH / img.height);
                    baseLeft = config.width / 2;
                    baseTop = 0;
                } else if (config.template === 'split') {
                    baseScale = config.width / img.width;
                    baseLeft = config.width / 2;
                    baseTop = 0;
                } else if (config.template === 'minimal') {
                    const isInline = config.tracklistLayout === 'inline';
                    const size = Math.min(config.width, config.height) * 0.44;
                    baseScale = Math.min(size / img.width, size / img.height);
                    baseLeft = config.width / 2;
                    baseTop = isInline ? config.height * 0.42 : config.height * 0.35;
                    originY = 'center';
                } else if (config.template === 'palette') {
                    const maxW = config.width - (padding * 2);
                    const maxH = config.height * 0.52;
                    baseScale = Math.min(maxW / img.width, maxH / img.height);
                    baseLeft = config.width / 2;
                    baseTop = padding;
                }

                const finalScale = baseScale * (config.imageScale ?? 1);
                const finalLeft = baseLeft + (config.imageOffsetX || 0);
                const finalTop = baseTop + (config.imageOffsetY || 0);

                img.set({
                    // @ts-ignore
                    name: 'poster_image',
                    originX,
                    originY,
                    left: finalLeft,
                    top: finalTop,
                    scaleX: finalScale,
                    scaleY: finalScale,
                    opacity: config.imageOpacity ?? 1,
                    // @ts-ignore
                    globalCompositeOperation: config.imageBlendMode || 'normal',
                    selectable: !config.imageLocked,
                    evented: !config.imageLocked,
                    lockRotation: true,
                    // @ts-ignore
                    data: { baseLeft, baseTop, baseScale }
                });

                img.setCoords();

                // Apply Image Blur Filter if configured
                if (config.imageBlur && config.imageBlur > 0) {
                    img.filters = [new filters.Blur({ blur: config.imageBlur })];
                    img.applyFilters();
                } else {
                    img.filters = [];
                    img.applyFilters();
                }

                // Insert image at base stack (underneath text and guides)
                canvas.insertAt(0, img);
                renderTextAndBranding(img);
            }).catch(err => {
                console.error("Failed to load image:", err);
                renderTextAndBranding();
            });
        }).catch(err => {
            console.error("Failed to process edge fade:", err);
            renderTextAndBranding();
        });
        } else {
            const existing = canvas.getObjects().find(o => (o as any).name === 'poster_image');
            if (existing) canvas.remove(existing);
            renderTextAndBranding();
        }

        if (config.fontFamily) {
            document.fonts.load(`12px "${config.fontFamily}"`).then(() => {
                if (fabricRef.current) {
                    renderTextAndBranding();
                }
            }).catch(e => console.error("Error loading font for canvas:", e));
        }

    }, [config, metadata]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex gap-2 bg-[var(--surface)] backdrop-blur rounded-lg p-1 border border-[var(--border-color)] z-10 shadow-sm transition-all">
                <button onClick={() => setZoom(z => Math.max(z * 0.9, 0.1))} className="p-2 hover:bg-[var(--surface2)] rounded text-[var(--text)]">-</button>
                <span className="p-2 text-xs font-mono text-[var(--text2)] min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(z * 1.1, 5))} className="p-2 hover:bg-[var(--surface2)] rounded text-[var(--text)]">+</button>
                <button onClick={() => setZoom(1)} className="p-2 hover:bg-[var(--surface2)] rounded text-[var(--text)] px-3">Fit</button>
            </div>

            <div className="w-full h-full overflow-auto flex items-center justify-center p-10">
                <div style={{
                    width: config.width * scale * zoom,
                    height: config.height * scale * zoom,
                    flexShrink: 0,
                    transition: 'width 0.1s ease-out, height 0.1s ease-out',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: config.width,
                        height: config.height,
                        transform: `scale(${scale * zoom})`,
                        transformOrigin: 'top left',
                        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
                        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
                        overflow: 'hidden'
                    }} className="dark:shadow-black/70">
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
