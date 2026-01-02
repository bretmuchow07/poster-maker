'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Canvas, Textbox, Group, Text, Rect, Image as FabricImage, Gradient, FabricObject } from 'fabric';
import { usePosterStore } from '@/store/posterStore';

export function CanvasArea() {
    const { config, metadata } = usePosterStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [scale, setScale] = useState(1);

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

    // Handle Scale
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

    // Main Render Loop
    useEffect(() => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        // 1. Sync Dimensions and Background
        canvas.setDimensions({ width: config.width, height: config.height });

        const renderTextAndBranding = () => {
            // Clear all objects except background image
            const objects = canvas.getObjects();
            objects.forEach(obj => canvas.remove(obj));

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
                fontFamily: config.fontFamily,
                fill: config.artistColor || config.textColor,
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
                fontFamily: config.fontFamily,
                fill: config.albumColor || config.textColor,
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
            canvas.renderAll();
        };

        // 5. Image Loading
        if (config.backgroundImage) {
            FabricImage.fromURL(config.backgroundImage).then((img: FabricObject) => {
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
            });
        } else {
            canvas.backgroundImage = undefined;
            handleBackgroundColor(canvas, config.backgroundColor);
            renderTextAndBranding();
        }
    }, [config, metadata]);

    const handleExport = () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        canvas.discardActiveObject();
        canvas.renderAll();
        const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2, quality: 1 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `poster-${metadata.album.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.click();
    };

    useEffect(() => {
        if (config.exportTrigger > 0) handleExport();
    }, [config.exportTrigger]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-neutral-900/50">
            <div style={{ width: config.width, height: config.height, transform: `scale(${scale})`, transformOrigin: 'center center', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                <canvas ref={canvasRef} />
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
