'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Textbox, Text, Rect, Circle, Group, Line, Image as FabricImage, Gradient, FabricObject, filters } from 'fabric';
import { usePosterStore } from '@/store/posterStore';
import { applyImageEdgeFade } from '@/utils/imageUtils';
import { computeAutoFitTitleFontSize } from '@/utils/typographyUtils';
import { saveAs } from 'file-saver';
import { Trash2, Hand } from 'lucide-react';

const ELEMENT_LABELS: Record<string, string> = {
    poster_image: 'Artwork',
    artist: 'Artist Name',
    album: 'Album Title',
    tracklist: 'Tracklist',
    palette_tracklist: 'Tracklist',
    inline_tracks: 'Tracklist',
    swatches_group: 'Color Swatches',
    signature: 'Signature',
    liner_notes: 'Liner Notes',
    palette_meta: 'Label Info',
    label: 'Label Info',
    release_date: 'Release Date',
    metadata_info: 'Album Year',
    matrix_stamp: 'Matrix Stamp',
    qr_code: 'QR Code',
    parental_advisory: 'Parental Advisory',
};

const HIDDEN_KEY_MAP: Record<string, string> = {
    artist: 'artist',
    album: 'album',
    tracklist: 'tracklist',
    palette_tracklist: 'tracklist',
    inline_tracks: 'tracklist',
    swatches_group: 'swatches',
    palette_meta: 'label',
    label: 'label',
    release_date: 'release_date',
    metadata_info: 'release_date',
};

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
    const lastLoadedImageKey = useRef<string>('');
    const isInternalModification = useRef<boolean>(false);
    const handleObjectModifiedRef = useRef<((e: any) => void) | null>(null);
    const [scale, setScale] = useState(1);
    const [zoom, setZoom] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const isSpacePressedRef = useRef(false);
    const isPanningRef = useRef(false);
    const panStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number }>({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
    const [selectedName, setSelectedName] = useState<string | null>(null);

    const removeCanvasObject = (objName: string) => {
        const store = usePosterStore.getState();
        const canvas = fabricRef.current;

        if (objName === 'poster_image') {
            store.setConfig({
                backgroundImage: undefined,
                imageOffsetX: 0,
                imageOffsetY: 0,
                imageScale: 1,
            });
        } else if (objName === 'signature') {
            store.updateSignatureConfig({ visible: false });
        } else if (objName === 'liner_notes') {
            store.updateLinerNotesConfig({ visible: false });
        } else if (objName === 'matrix_stamp') {
            store.updateMatrixStampConfig({ visible: false });
        } else if (objName === 'qr_code') {
            store.updateQrCodeConfig({ visible: false });
        } else if (objName === 'parental_advisory') {
            store.setConfig({ showParentalAdvisory: false });
        } else {
            const hiddenKey = HIDDEN_KEY_MAP[objName];
            if (hiddenKey) {
                const currentHidden = store.config.hiddenElements || [];
                if (!currentHidden.includes(hiddenKey)) {
                    store.setConfig({ hiddenElements: [...currentHidden, hiddenKey] });
                }
            }
        }

        if (canvas) {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
        }
        setSelectedName(null);
    };
    const removeCanvasObjectRef = useRef(removeCanvasObject);
    removeCanvasObjectRef.current = removeCanvasObject;

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

            const currentConfig = usePosterStore.getState().config;

            if (target.name === 'poster_image') {
                const baseLeft = target.data?.baseLeft ?? (currentConfig.width / 2);
                const baseTop = target.data?.baseTop ?? 0;
                const baseScale = target.data?.baseScale ?? 1;

                const newOffsetX = Math.round((target.left || 0) - baseLeft);
                const newOffsetY = Math.round((target.top || 0) - baseTop);
                const currentScale = target.scaleX || baseScale;
                const newScale = Math.max(0.1, Math.round((currentScale / baseScale) * 100) / 100);

                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    imageOffsetX: newOffsetX,
                    imageOffsetY: newOffsetY,
                    imageScale: newScale
                });
            } else if (target.name === 'artist') {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.artistFontSize || 28;
                const newFontSize = Math.max(8, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                target.set({
                    fontSize: newFontSize,
                    width: newWidth,
                    scaleX: 1,
                    scaleY: 1
                });
                if ((target as any).initDimensions) (target as any).initDimensions();
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    artistPosition: { left: newLeft, top: newTop, width: newWidth },
                    artistFontSize: newFontSize
                });
            } else if (target.name === 'album') {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.albumFontSize || 65;
                const newFontSize = Math.max(12, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                target.set({
                    fontSize: newFontSize,
                    width: newWidth,
                    scaleX: 1,
                    scaleY: 1
                });
                if ((target as any).initDimensions) (target as any).initDimensions();
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    albumPosition: { left: newLeft, top: newTop, width: newWidth },
                    albumFontSize: newFontSize,
                    autoFitTitle: false
                });
            } else if (
                target.name === 'tracklist' ||
                target.name === 'palette_tracklist' ||
                target.name === 'inline_tracks'
            ) {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.tracklistFontSize || 13;
                const newFontSize = Math.max(8, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                if ((target as any).fontSize) {
                    target.set({
                        fontSize: newFontSize,
                        width: newWidth,
                        scaleX: 1,
                        scaleY: 1
                    });
                    if ((target as any).initDimensions) (target as any).initDimensions();
                } else if ((target as any).type === 'group') {
                    const group = target as Group;
                    group.getObjects().forEach((child: any) => {
                        if (child.fontSize) {
                            child.set({ fontSize: newFontSize });
                            if (child.initDimensions) child.initDimensions();
                        }
                    });
                    target.set({ scaleX: 1, scaleY: 1 });
                }
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    tracklistPosition: { left: newLeft, top: newTop, width: newWidth },
                    tracklistFontSize: newFontSize
                });
            } else if (target.name === 'swatches_group') {
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                target.set({ scaleX: 1, scaleY: 1 });
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    swatchesPosition: { left: newLeft, top: newTop }
                });
            } else if (target.name === 'signature') {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.signature?.fontSize || 34;
                const newFontSize = Math.max(10, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                target.set({
                    fontSize: newFontSize,
                    width: newWidth,
                    scaleX: 1,
                    scaleY: 1
                });
                if ((target as any).initDimensions) (target as any).initDimensions();
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().updateSignatureConfig({
                    fontSize: newFontSize
                });
                usePosterStore.getState().setConfig({
                    signaturePosition: { left: newLeft, top: newTop, width: newWidth }
                });
            } else if (target.name === 'liner_notes') {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.linerNotes?.fontSize || 10;
                const newFontSize = Math.max(6, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                target.set({
                    fontSize: newFontSize,
                    width: newWidth,
                    scaleX: 1,
                    scaleY: 1
                });
                if ((target as any).initDimensions) (target as any).initDimensions();
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().updateLinerNotesConfig({
                    fontSize: newFontSize
                });
                usePosterStore.getState().setConfig({
                    linerNotesPosition: { left: newLeft, top: newTop, width: newWidth }
                });
            } else if (target.name === 'palette_meta' || target.name === 'label') {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.labelFontSize || 10;
                const newFontSize = Math.max(6, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                target.set({
                    fontSize: newFontSize,
                    width: newWidth,
                    scaleX: 1,
                    scaleY: 1
                });
                if ((target as any).initDimensions) (target as any).initDimensions();
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    labelPosition: { left: newLeft, top: newTop, width: newWidth },
                    labelFontSize: newFontSize
                });
            } else if (target.name === 'release_date' || target.name === 'metadata_info') {
                const scaleFactor = target.scaleY || target.scaleX || 1;
                const currentFontSize = (target as any).fontSize || currentConfig.releaseDateFontSize || 10;
                const newFontSize = Math.max(6, Math.round(currentFontSize * scaleFactor));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                const newWidth = Math.round((target.width || 0) * (target.scaleX || 1));

                target.set({
                    fontSize: newFontSize,
                    width: newWidth,
                    scaleX: 1,
                    scaleY: 1
                });
                if ((target as any).initDimensions) (target as any).initDimensions();
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    releaseDatePosition: { left: newLeft, top: newTop, width: newWidth },
                    releaseDateFontSize: newFontSize
                });
            } else if (target.name === 'matrix_stamp') {
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                target.set({ scaleX: 1, scaleY: 1 });
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    matrixStampPosition: { left: newLeft, top: newTop }
                });
            } else if (target.name === 'qr_code') {
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                target.set({ scaleX: 1, scaleY: 1 });
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    qrCodePosition: { left: newLeft, top: newTop }
                });
            } else if (target.name === 'parental_advisory') {
                const newScale = Math.max(0.4, Math.min(3, Math.round((target.scaleX || 1) * 100) / 100));
                const newLeft = Math.round(target.left || 0);
                const newTop = Math.round(target.top || 0);
                target.set({ scaleX: newScale, scaleY: newScale });
                target.setCoords();
                canvas.requestRenderAll();

                isInternalModification.current = true;
                usePosterStore.getState().setConfig({
                    parentalAdvisoryPosition: { left: newLeft, top: newTop },
                    parentalAdvisoryScale: newScale
                });
            }

            // Clean up any lingering smart guides
            const guides = canvas.getObjects().filter((o: any) => (o as any).name === 'smart_guide');
            if (guides.length > 0) {
                guides.forEach(g => canvas.remove(g));
            }
        };

        // Magnetic smart snapping engine on movement
        const handleObjectMoving = (e: any) => {
            const target = e.target;
            if (!target || (target as any).name === 'smart_guide' || (target as any).id === 'guide') return;

            const currentConfig = usePosterStore.getState().config;
            const canvasWidth = currentConfig.width;
            const canvasHeight = currentConfig.height;
            const padding = currentConfig.padding ?? 60;
            const SNAP_TOLERANCE = 8;

            // Remove existing smart guides
            const existingGuides = canvas.getObjects().filter((o: any) => (o as any).name === 'smart_guide');
            existingGuides.forEach(g => canvas.remove(g));

            const targetW = (target.width || 0) * (target.scaleX || 1);
            const targetH = (target.height || 0) * (target.scaleY || 1);

            let targetCenterX: number;
            if (target.originX === 'center') {
                targetCenterX = target.left || 0;
            } else {
                targetCenterX = (target.left || 0) + targetW / 2;
            }

            let targetCenterY: number;
            if (target.originY === 'center') {
                targetCenterY = target.top || 0;
            } else {
                targetCenterY = (target.top || 0) + targetH / 2;
            }

            let snappedX = false;

            // 1. Horizontal Snap to Canvas Center (Vertical Guide)
            const canvasCenterX = canvasWidth / 2;
            if (Math.abs(targetCenterX - canvasCenterX) < SNAP_TOLERANCE) {
                if (target.originX === 'center') {
                    target.set({ left: canvasCenterX });
                } else {
                    target.set({ left: canvasCenterX - targetW / 2 });
                }
                snappedX = true;
                const vGuide = new Line([canvasCenterX, 0, canvasCenterX, canvasHeight], {
                    stroke: '#f59e0b',
                    strokeWidth: 1.5,
                    strokeDashArray: [4, 4],
                    selectable: false,
                    evented: false,
                    // @ts-ignore
                    name: 'smart_guide'
                });
                canvas.add(vGuide);
            }

            // 2. Snap to Left Margin
            const leftMargin = padding;
            if (!snappedX) {
                const targetLeftEdge = target.originX === 'center' ? (target.left || 0) - targetW / 2 : (target.left || 0);
                if (Math.abs(targetLeftEdge - leftMargin) < SNAP_TOLERANCE) {
                    if (target.originX === 'center') {
                        target.set({ left: leftMargin + targetW / 2 });
                    } else {
                        target.set({ left: leftMargin });
                    }
                    snappedX = true;
                    const vGuide = new Line([leftMargin, 0, leftMargin, canvasHeight], {
                        stroke: '#06b6d4',
                        strokeWidth: 1.5,
                        strokeDashArray: [4, 4],
                        selectable: false,
                        evented: false,
                        // @ts-ignore
                        name: 'smart_guide'
                    });
                    canvas.add(vGuide);
                }
            }

            // 3. Snap to Right Margin
            const rightMargin = canvasWidth - padding;
            if (!snappedX) {
                const targetRightEdge = target.originX === 'center' ? (target.left || 0) + targetW / 2 : (target.left || 0) + targetW;
                if (Math.abs(targetRightEdge - rightMargin) < SNAP_TOLERANCE) {
                    if (target.originX === 'center') {
                        target.set({ left: rightMargin - targetW / 2 });
                    } else {
                        target.set({ left: rightMargin - targetW });
                    }
                    snappedX = true;
                    const vGuide = new Line([rightMargin, 0, rightMargin, canvasHeight], {
                        stroke: '#06b6d4',
                        strokeWidth: 1.5,
                        strokeDashArray: [4, 4],
                        selectable: false,
                        evented: false,
                        // @ts-ignore
                        name: 'smart_guide'
                    });
                    canvas.add(vGuide);
                }
            }

            // 4. Snap to Sibling Left Alignment
            if (!snappedX) {
                const targetLeft = target.originX === 'center' ? (target.left || 0) - targetW / 2 : (target.left || 0);
                const siblings = canvas.getObjects().filter((o: any) =>
                    o !== target &&
                    (o as any).selectable &&
                    (o as any).name &&
                    (o as any).name !== 'smart_guide' &&
                    (o as any).name !== 'poster_image'
                );

                for (const sib of siblings) {
                    const sibW = (sib.width || 0) * (sib.scaleX || 1);
                    const sibLeft = sib.originX === 'center' ? (sib.left || 0) - sibW / 2 : (sib.left || 0);
                    if (Math.abs(targetLeft - sibLeft) < SNAP_TOLERANCE) {
                        if (target.originX === 'center') {
                            target.set({ left: sibLeft + targetW / 2 });
                        } else {
                            target.set({ left: sibLeft });
                        }
                        snappedX = true;
                        const vGuide = new Line([sibLeft, 0, sibLeft, canvasHeight], {
                            stroke: '#a855f7',
                            strokeWidth: 1,
                            strokeDashArray: [3, 3],
                            selectable: false,
                            evented: false,
                            // @ts-ignore
                            name: 'smart_guide'
                        });
                        canvas.add(vGuide);
                        break;
                    }
                }
            }

            // 5. Vertical Snap to Canvas Center (Horizontal Guide)
            const canvasCenterY = canvasHeight / 2;
            if (Math.abs(targetCenterY - canvasCenterY) < SNAP_TOLERANCE) {
                if (target.originY === 'center') {
                    target.set({ top: canvasCenterY });
                } else {
                    target.set({ top: canvasCenterY - targetH / 2 });
                }
                const hGuide = new Line([0, canvasCenterY, canvasWidth, canvasCenterY], {
                    stroke: '#f59e0b',
                    strokeWidth: 1.5,
                    strokeDashArray: [4, 4],
                    selectable: false,
                    evented: false,
                    // @ts-ignore
                    name: 'smart_guide'
                });
                canvas.add(hGuide);
            }

            target.setCoords();
            canvas.requestRenderAll();
        };

        const handleMouseUp = () => {
            const guides = canvas.getObjects().filter((o: any) => (o as any).name === 'smart_guide');
            if (guides.length > 0) {
                guides.forEach(g => canvas.remove(g));
                canvas.requestRenderAll();
            }
        };

        const syncSelection = () => {
            const active = canvas.getActiveObject() as any;
            setSelectedName(active?.name || null);
        };

        handleObjectModifiedRef.current = handleObjectModified;
        canvas.on('object:moving', handleObjectMoving);
        canvas.on('mouse:up', handleMouseUp);
        canvas.on('object:modified', handleObjectModified);
        canvas.on('selection:created', syncSelection);
        canvas.on('selection:updated', syncSelection);
        canvas.on('selection:cleared', syncSelection);
        fabricRef.current = canvas;

        return () => {
            canvas.off('object:moving', handleObjectMoving);
            canvas.off('mouse:up', handleMouseUp);
            canvas.off('object:modified', handleObjectModified);
            canvas.off('selection:created', syncSelection);
            canvas.off('selection:updated', syncSelection);
            canvas.off('selection:cleared', syncSelection);
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
            const activeEl = document.activeElement as HTMLElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
                return;
            }

            // Spacebar hand-tool panning activation
            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault();
                isSpacePressedRef.current = true;
                setIsSpacePressed(true);
                return;
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
                e.preventDefault();
                setZoom(z => Math.min(z * 1.1, 5));
                return;
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === '-')) {
                e.preventDefault();
                setZoom(z => Math.max(z * 0.9, 0.1));
                return;
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === '0')) {
                e.preventDefault();
                setZoom(1);
                return;
            }

            const canvas = fabricRef.current;
            if (!canvas) return;
            const activeObj = canvas.getActiveObject();

            // Escape to clear active selection
            if (e.key === 'Escape') {
                if (activeObj) {
                    canvas.discardActiveObject();
                    canvas.requestRenderAll();
                    setSelectedName(null);
                }
                return;
            }

            // Delete / Backspace to remove selected canvas item
            if ((e.key === 'Delete' || e.key === 'Backspace') && activeObj && (activeObj as any).name) {
                e.preventDefault();
                removeCanvasObjectRef.current((activeObj as any).name);
                return;
            }

            // Keyboard Arrow Nudging (1px or 10px with Shift)
            if (activeObj && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                let dx = 0;
                let dy = 0;
                if (e.key === 'ArrowLeft') dx = -step;
                if (e.key === 'ArrowRight') dx = step;
                if (e.key === 'ArrowUp') dy = -step;
                if (e.key === 'ArrowDown') dy = step;

                activeObj.set({
                    left: (activeObj.left || 0) + dx,
                    top: (activeObj.top || 0) + dy
                });
                activeObj.setCoords();
                canvas.requestRenderAll();
                if (handleObjectModifiedRef.current) {
                    handleObjectModifiedRef.current({ target: activeObj });
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                isSpacePressedRef.current = false;
                setIsSpacePressed(false);
                isPanningRef.current = false;
                setIsPanning(false);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isPanningRef.current && scrollContainerRef.current) {
                const dx = e.clientX - panStartRef.current.x;
                const dy = e.clientY - panStartRef.current.y;
                scrollContainerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
                scrollContainerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
            }
        };

        const handleMouseUp = () => {
            if (isPanningRef.current) {
                isPanningRef.current = false;
                setIsPanning(false);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
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
            const guides = canvas.getObjects().filter(obj => (obj as any).id === 'guide' || (obj as any).name === 'smart_guide');
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
            const filename = `pressroom-${(metadata.album || 'untitled').toLowerCase().replace(/\s+/g, '-')}`;

            if (format === 'svg') {
                const svgData = canvas.toSVG({
                    suppressPreamble: false,
                    width: `${width}px`,
                    height: `${height}px`,
                    viewBox: {
                        x: 0,
                        y: 0,
                        width,
                        height
                    }
                });
                const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                saveAs(blob, `${filename}.svg`);
            } else if (format === 'pdf') {
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
                if ((g as any).name !== 'smart_guide') {
                    g.visible = true;
                } else {
                    canvas.remove(g);
                }
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

        // Skip full re-render if modification happened directly on the canvas
        if (isInternalModification.current) {
            isInternalModification.current = false;
            return;
        }

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
            const activeName = (canvas.getActiveObject() as any)?.name;

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
            const isCosmos = config.template === 'cosmos';
            const hidden = new Set(config.hiddenElements || []);
            let tracklistBottom = 0;

            const commonSelectable = {
                selectable: true,
                editable: false,
                lockRotation: true,
                padding: 6,
                borderColor: '#f59e0b',
                cornerColor: '#ffffff',
                cornerStrokeColor: '#f59e0b',
                cornerStyle: 'circle' as const,
                cornerSize: 8,
                transparentCorners: false,
            };

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
                    originX: 'left',
                    originY: 'top',
                    selectable: false,
                    evented: false,
                    // @ts-ignore
                    name: 'frame_border'
                });
                canvas.add(borderRect);
            }

            // ==========================================
            // TEMPLATE: COLOR SWATCH (PALETTE)
            // ==========================================
            if (isPalette) {
                const artBottom = config.height * 0.54;
                const contentTop = artBottom + 28;
                const availableW = config.width - padding * 2;
                const midGap = 40;
                const trackIndent = config.tracklistIndent || 0;
                const baseCol1W = Math.floor((availableW - midGap) * 0.46);
                const col2W = Math.floor((availableW - midGap) * 0.54);
                const defaultCol1Left = padding + trackIndent;
                const col1Left = config.tracklistPosition?.left ?? defaultCol1Left;
                const col1W = Math.max(80, config.tracklistPosition?.width ?? (baseCol1W - (config.tracklistPosition?.left !== undefined ? 0 : trackIndent)));
                const col2Left = padding + baseCol1W + midGap;

                // Column 1: Numbered Tracklist
                const trackFontSize = config.tracklistFontSize ?? 13;
                const isVinylSides = config.tracklistLayout === 'vinyl-sides';
                let tracklistLines: string;
                if (isVinylSides && metadata.tracks.length > 0) {
                    const midpoint = Math.ceil(metadata.tracks.length / 2);
                    const sideA = metadata.tracks.slice(0, midpoint).map((t, idx) => `A${idx + 1}.  ${t.title.toUpperCase()}`).join('\n');
                    const sideB = metadata.tracks.slice(midpoint).map((t, idx) => `B${idx + 1}.  ${t.title.toUpperCase()}`).join('\n');
                    tracklistLines = `SIDE A\n${sideA}\n\nSIDE B\n${sideB}`;
                } else {
                    tracklistLines = metadata.tracks.map((track, i) => {
                        const num = String(i + 1).padStart(2, '0');
                        return `${num}. ${track.title.toUpperCase()}`;
                    }).join('\n');
                }

                const tracklistText = new Textbox(tracklistLines, {
                    ...commonSelectable,
                    left: col1Left,
                    top: config.tracklistPosition?.top ?? contentTop,
                    width: col1W,
                    fontSize: trackFontSize,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.textColor || '#000000',
                    fontWeight: config.tracklistFontWeight || 700,
                    lineHeight: 1.45,
                    textAlign: config.tracklistAlign || 'left',
                    originX: 'left',
                    originY: 'top',
                    // @ts-ignore
                    name: 'palette_tracklist'
                });
                if (!hidden.has('tracklist')) {
                    canvas.add(tracklistText);
                }

                // Column 1 Footer: Label & Length
                const labelText = metadata.label || 'RECORD LABEL';
                const lengthText = metadata.totalDuration || '45:10';
                const trackHeight = hidden.has('tracklist') ? 0 : (tracklistText.height || (metadata.tracks.length * (trackFontSize + 6)));
                const metaTop = Math.min(Math.max(contentTop + trackHeight + 16, config.height - padding - 45), config.height - padding - 35);
                tracklistBottom = metaTop + 35;

                if (!hidden.has('label')) {
                    const metaBlock = new Textbox(`LABEL: ${labelText.toUpperCase()}\nALBUM LENGTH: ${lengthText}`, {
                        ...commonSelectable,
                        left: config.labelPosition?.left ?? col1Left,
                        top: config.labelPosition?.top ?? metaTop,
                        width: config.labelPosition?.width ?? col1W,
                        fontSize: config.labelFontSize ?? 10,
                        fontFamily: config.fontFamily || 'Inter',
                        fill: config.textColor || '#000000',
                        fontWeight: 800,
                        lineHeight: 1.3,
                        textAlign: config.label?.align || 'left',
                        originX: 'left',
                        originY: 'top',
                        // @ts-ignore
                        name: 'palette_meta'
                    });
                    canvas.add(metaBlock);
                }

                // Column 2: Swatches, Artist, Title, Signature, Release Date
                const swatches = config.paletteSwatches && config.paletteSwatches.length >= 5
                    ? config.paletteSwatches.slice(0, 5)
                    : ['#2c3e50', '#a27b5c', '#dcd7c9', '#4f709c', '#213555'];

                const swatchGap = 8;
                const swatchW = Math.floor((col2W - (4 * swatchGap)) / 5);
                const swatchH = swatchW;
                const rx = config.swatchShape === 'circle' ? swatchW / 2 : config.swatchShape === 'rounded' ? 6 : 0;

                const defaultSwatchLeft = col2Left;
                const defaultSwatchTop = contentTop;
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
                    ...commonSelectable,
                    left: swatchLeft,
                    top: swatchTop,
                    originX: 'left',
                    originY: 'top',
                    hasControls: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    // @ts-ignore
                    name: 'swatches_group'
                });
                if (!hidden.has('swatches')) {
                    canvas.add(swatchGroup);
                }

                // Artist Name
                const defaultArtistY = contentTop + swatchH + 20;
                const artistLeft = config.artistPosition?.left ?? col2Left;
                const artistTop = config.artistPosition?.top ?? defaultArtistY;
                const artistText = new Textbox(metadata.artist.toUpperCase(), {
                    ...commonSelectable,
                    left: artistLeft,
                    top: artistTop,
                    fontSize: config.artistFontSize ?? 24,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.artistColor || config.textColor || '#000000',
                    fontWeight: config.artistFontWeight || 800,
                    textAlign: config.artistAlign || 'left',
                    width: config.artistPosition?.width ?? col2W,
                    splitByGrapheme: false,
                    originX: 'left',
                    originY: 'top',
                    // @ts-ignore
                    name: 'artist'
                });
                if (!hidden.has('artist')) {
                    canvas.add(artistText);
                }

                // Big Stacked Album Title
                const defaultAlbumY = artistTop + (hidden.has('artist') ? 0 : (artistText.height || 30) + 8);
                const albumLeft = config.albumPosition?.left ?? col2Left;
                const albumTop = config.albumPosition?.top ?? defaultAlbumY;
                const albumWidth = config.albumPosition?.width ?? col2W;

                const basePaletteAlbumSize = config.albumFontSize ?? 56;
                const effectivePaletteAlbumFontSize = config.autoFitTitle !== false
                    ? computeAutoFitTitleFontSize({
                        text: metadata.album.toUpperCase(),
                        availableWidth: albumWidth,
                        maxLines: 2,
                        baseFontSize: basePaletteAlbumSize,
                        minFontSize: 28,
                        fontFamily: config.fontFamily || 'Inter',
                        fontWeight: config.albumFontWeight || 900
                    })
                    : basePaletteAlbumSize;

                const albumText = new Textbox(metadata.album.toUpperCase(), {
                    ...commonSelectable,
                    left: albumLeft,
                    top: albumTop,
                    fontSize: effectivePaletteAlbumFontSize,
                    fontFamily: config.fontFamily || 'Inter',
                    fill: config.albumColor || config.textColor || '#000000',
                    fontWeight: config.albumFontWeight || 900,
                    lineHeight: 0.95,
                    textAlign: config.albumAlign || 'left',
                    width: albumWidth,
                    splitByGrapheme: false,
                    originX: 'left',
                    originY: 'top',
                    // @ts-ignore
                    name: 'album'
                });
                if (!hidden.has('album')) {
                    canvas.add(albumText);
                }

                // Cursive Signature / Autograph Layer
                let currentY = albumTop + (hidden.has('album') ? 0 : (albumText.height || 60) + 12);
                if (config.signature?.visible) {
                    const defaultSigY = currentY;
                    const sigText = new Textbox(config.signature.text || metadata.artist, {
                        ...commonSelectable,
                        left: config.signaturePosition?.left ?? col2Left,
                        top: config.signaturePosition?.top ?? defaultSigY,
                        fontSize: config.signature.fontSize || 34,
                        fontFamily: config.signature.fontFamily || 'Caveat',
                        fill: config.signature.color || config.textColor || '#000000',
                        textAlign: config.albumAlign || 'left',
                        width: config.signaturePosition?.width ?? col2W,
                        originX: 'left',
                        originY: 'top',
                        // @ts-ignore
                        name: 'signature'
                    });
                    canvas.add(sigText);
                    currentY += (sigText.height || 40) + 10;
                }

                // Release Date Footer
                const releaseTop = Math.min(Math.max(currentY + 10, config.height - padding - 40), config.height - padding - 30);
                const releaseTextWidth = (config.qrCode?.visible && config.qrCodePosition === undefined)
                    ? Math.max(100, col2W - 85 - 16)
                    : (config.releaseDatePosition?.width ?? col2W);
                if (!hidden.has('release_date')) {
                    const releaseText = new Textbox(`RELEASED ON\n${metadata.releaseDate || metadata.year || '2024'}`.toUpperCase(), {
                        ...commonSelectable,
                        left: config.releaseDatePosition?.left ?? col2Left,
                        top: config.releaseDatePosition?.top ?? releaseTop,
                        fontSize: config.releaseDateFontSize ?? 10,
                        fontFamily: config.fontFamily || 'Inter',
                        fill: config.textColor || '#000000',
                        fontWeight: 800,
                        width: releaseTextWidth,
                        lineHeight: 1.3,
                        textAlign: config.albumAlign || 'left',
                        originX: 'left',
                        originY: 'top',
                        // @ts-ignore
                        name: 'release_date'
                    });
                    canvas.add(releaseText);
                }

            } else {
                // ==========================================
                // TEMPLATES: MODERN, SPLIT, MINIMAL & COSMOS
                // ==========================================
                const albumAlign = config.albumAlign ?? (isModern ? 'center' : isMinimal ? 'center' : 'left');
                const artistAlign = config.artistAlign ?? (isModern ? 'center' : isMinimal ? 'center' : 'left');
                const trackAlign = config.tracklistAlign ?? (isModern ? 'center' : isMinimal ? 'center' : 'left');

                // Slashed Inline Tracklist (Minimal archetype)
                if (isMinimal && config.tracklistLayout === 'inline' && !hidden.has('tracklist')) {
                    const inlineContent = metadata.tracks.map(t => t.title.toUpperCase()).join('   /   ');
                    const trackIndent = config.tracklistIndent || 0;
                    const defaultInlineLeft = padding + trackIndent;
                    const inlineLeft = config.tracklistPosition?.left ?? defaultInlineLeft;
                    const inlineWidth = Math.max(100, config.tracklistPosition?.width ?? (config.width - padding * 2 - (config.tracklistPosition?.left !== undefined ? 0 : trackIndent * 2)));
                    const inlineText = new Textbox(inlineContent, {
                        ...commonSelectable,
                        left: inlineLeft,
                        top: config.tracklistPosition?.top ?? (padding + 15),
                        width: inlineWidth,
                        fontSize: config.tracklistFontSize ?? 11,
                        fontFamily: config.fontFamily || 'Courier New',
                        fill: config.textColor || '#000000',
                        fontWeight: 700,
                        textAlign: 'center',
                        originX: 'left',
                        originY: 'top',
                        lineHeight: 1.6,
                        // @ts-ignore
                        name: 'inline_tracks'
                    });
                    canvas.add(inlineText);
                }

                // Default Vertical Offsets
                const defaultPositions = {
                    modern: { artist: config.height * 0.65, album: config.height * 0.72 },
                    split: { artist: config.height * 0.54, album: config.height * 0.61 },
                    minimal: { artist: config.height * 0.78, album: config.height * 0.70 },
                    cosmos: { artist: config.height * 0.57, album: config.height * 0.62 },
                };
                const templateDefaults = defaultPositions[isModern ? 'modern' : isSplit ? 'split' : isMinimal ? 'minimal' : isCosmos ? 'cosmos' : 'modern'];

                // Cosmos Top Eyebrow with 8-dot cluster logo
                if (isCosmos) {
                    const dotClusterX = padding;
                    const dotClusterY = padding + 14;
                    const dotSpacing = 6;
                    const dotPositions = [
                        [-1, -1], [0, -1], [1, -1],
                        [-1,  0],          [1,  0],
                        [-1,  1], [0,  1], [1,  1]
                    ];
                    dotPositions.forEach(([dx, dy]) => {
                        const dot = new Circle({
                            left: dotClusterX + 10 + dx * dotSpacing,
                            top: dotClusterY + 6 + dy * dotSpacing,
                            radius: 1.6,
                            fill: config.textColor || '#0d0d0d',
                            selectable: false,
                            evented: false,
                            originX: 'center',
                            originY: 'center',
                        });
                        canvas.add(dot);
                    });

                    const stampText = new Text(`PRESSROOM ARCHIVE • ${metadata.year || '2026'}`, {
                        left: dotClusterX + 28,
                        top: dotClusterY,
                        fontSize: 11,
                        fontFamily: config.fontFamily || 'Fraunces',
                        fill: config.textColor || '#0d0d0d',
                        fontWeight: 600,
                        originX: 'left',
                        originY: 'top',
                        selectable: false,
                        // @ts-ignore
                        name: 'cosmos_stamp'
                    });
                    canvas.add(stampText);

                    const regNote = new Text(`300 DPI • ARCHIVAL LINEN`, {
                        left: config.width - padding,
                        top: dotClusterY,
                        fontSize: 10,
                        fontFamily: 'JetBrains Mono',
                        fill: '#9a9796',
                        originX: 'right',
                        originY: 'top',
                        selectable: false,
                        // @ts-ignore
                        name: 'cosmos_reg'
                    });
                    canvas.add(regNote);
                }

                const artistLeft = config.artistPosition?.left ?? padding;
                const artistWidth = config.artistPosition?.width ?? (config.width - padding * 2);
                const artistText = new Textbox(isCosmos ? metadata.artist : metadata.artist.toUpperCase(), {
                    ...commonSelectable,
                    left: artistLeft,
                    top: config.artistPosition?.top ?? templateDefaults.artist,
                    fontSize: config.artistFontSize ?? (isModern ? 28 : isSplit ? 40 : isCosmos ? 20 : 28),
                    fontFamily: config.fontFamily || (isCosmos ? 'Fraunces' : 'Inter'),
                    fill: config.artistColor || config.textColor || '#000000',
                    fontWeight: config.artistFontWeight || (isCosmos ? 400 : 800),
                    textAlign: artistAlign,
                    originX: 'left',
                    originY: 'top',
                    width: artistWidth,
                    splitByGrapheme: false,
                    // @ts-ignore
                    name: 'artist'
                });

                const albumLeft = config.albumPosition?.left ?? padding;
                const albumWidth = config.albumPosition?.width ?? (config.width - padding * 2);

                const baseStandardAlbumSize = config.albumFontSize ?? (isModern ? 85 : isSplit ? 48 : isCosmos ? 62 : 65);
                const effectiveStandardAlbumFontSize = config.autoFitTitle !== false
                    ? computeAutoFitTitleFontSize({
                        text: isCosmos ? metadata.album : metadata.album.toUpperCase(),
                        availableWidth: albumWidth,
                        maxLines: 2,
                        baseFontSize: baseStandardAlbumSize,
                        minFontSize: isSplit ? 28 : 36,
                        fontFamily: config.fontFamily || (isCosmos ? 'Fraunces' : 'Inter'),
                        fontWeight: config.albumFontWeight || (isCosmos ? 300 : 900),
                        isCosmos
                    })
                    : baseStandardAlbumSize;

                // Ghost Blur Echo Effect
                if (config.textEffect === 'blur-echo' && !hidden.has('album')) {
                    const echoText = new Textbox(metadata.album.toUpperCase(), {
                        left: (config.albumPosition?.left ?? padding) + 6,
                        top: (config.albumPosition?.top ?? templateDefaults.album) + 4,
                        fontSize: effectiveStandardAlbumFontSize,
                        fontFamily: config.fontFamily || 'Inter',
                        fill: config.albumColor || config.textColor || '#000000',
                        fontWeight: config.albumFontWeight || 900,
                        textAlign: albumAlign,
                        originX: 'left',
                        originY: 'top',
                        opacity: 0.25,
                        selectable: false,
                        evented: false,
                        width: albumWidth
                    });
                    canvas.add(echoText);
                }

                const albumText = new Textbox(isCosmos ? metadata.album : metadata.album.toUpperCase(), {
                    ...commonSelectable,
                    left: albumLeft,
                    top: config.albumPosition?.top ?? templateDefaults.album,
                    fontSize: effectiveStandardAlbumFontSize,
                    fontFamily: config.fontFamily || (isCosmos ? 'Fraunces' : 'Inter'),
                    fill: config.albumColor || config.textColor || '#000000',
                    fontWeight: config.albumFontWeight || (isCosmos ? 300 : 900),
                    lineHeight: isCosmos ? 0.95 : 1.15,
                    charSpacing: isCosmos ? -35 : 0,
                    textAlign: albumAlign,
                    originX: 'left',
                    originY: 'top',
                    width: albumWidth,
                    splitByGrapheme: false,
                    // @ts-ignore
                    name: 'album'
                });

                if (!hidden.has('artist')) canvas.add(artistText);
                if (!hidden.has('album')) canvas.add(albumText);

                // Signature script if enabled
                if (config.signature?.visible) {
                    const defaultSigTop = (albumText.top || templateDefaults.album) + (albumText.height || 50) + 8;
                    const sigLeft = config.signaturePosition?.left ?? padding;
                    const sigWidth = config.signaturePosition?.width ?? (config.width - padding * 2);
                    const sigText = new Textbox(config.signature.text || metadata.artist, {
                        ...commonSelectable,
                        left: sigLeft,
                        top: config.signaturePosition?.top ?? defaultSigTop,
                        fontSize: config.signature.fontSize || 34,
                        fontFamily: config.signature.fontFamily || 'Caveat',
                        fill: config.signature.color || config.textColor || '#000000',
                        textAlign: albumAlign,
                        originX: 'left',
                        originY: 'top',
                        width: sigWidth,
                        // @ts-ignore
                        name: 'signature'
                    });
                    canvas.add(sigText);
                }

                // Tracklist rendering (Single Column, 2 Balanced Columns, or Vinyl Side A / Side B)
                if (!(isMinimal && config.tracklistLayout === 'inline') && !hidden.has('tracklist')) {
                    const isVinylSides = config.tracklistLayout === 'vinyl-sides';
                    const isDouble = config.tracklistLayout === 'double' || (config.tracklistLayout !== 'single' && metadata.tracks.length > 11);
                    const trackFontSize = config.tracklistFontSize ?? (isDouble || isVinylSides ? 12 : 14);
                    const defaultTrackTop = isModern ? config.height * 0.81 : isSplit ? config.height * 0.69 : isCosmos ? config.height * 0.74 : config.height * 0.83;
                    const trackTop = config.tracklistPosition?.top ?? defaultTrackTop;
                    const trackIndent = config.tracklistIndent || 0;
                    const defaultTrackLeft = padding + trackIndent;
                    const trackLeft = config.tracklistPosition?.left ?? defaultTrackLeft;
                    const maxTrackWidth = (config.width - padding * 2) - (config.tracklistPosition?.left !== undefined ? 0 : trackIndent);
                    const trackWidth = Math.max(100, config.tracklistPosition?.width ?? maxTrackWidth);

                    if ((isVinylSides || isDouble) && metadata.tracks.length > 0) {
                        const midpoint = Math.ceil(metadata.tracks.length / 2);
                        const colGap = Math.round(trackWidth * 0.08);
                        const colW = Math.floor((trackWidth - colGap) / 2);
                        const col1Left = 0;
                        const col2Left = colW + colGap;

                        let col1Content: string;
                        let col2Content: string;

                        if (isVinylSides) {
                            const sideA = metadata.tracks.slice(0, midpoint).map((t, idx) => {
                                return `A${idx + 1}.  ${t.title.toUpperCase()}`;
                            }).join('\n');
                            const sideB = metadata.tracks.slice(midpoint).map((t, idx) => {
                                return `B${idx + 1}.  ${t.title.toUpperCase()}`;
                            }).join('\n');
                            col1Content = `SIDE A\n${sideA}`;
                            col2Content = `SIDE B\n${sideB}`;
                        } else {
                            col1Content = metadata.tracks.slice(0, midpoint).map((t, idx) => {
                                const num = String(idx + 1).padStart(2, '0');
                                return `${num}. ${t.title.toUpperCase()}`;
                            }).join('\n');

                            col2Content = metadata.tracks.slice(midpoint).map((t, idx) => {
                                const num = String(midpoint + idx + 1).padStart(2, '0');
                                return `${num}. ${t.title.toUpperCase()}`;
                            }).join('\n');
                        }

                        const col1Text = new Textbox(col1Content, {
                            left: col1Left,
                            top: 0,
                            width: colW,
                            fontSize: trackFontSize,
                            fontFamily: config.fontFamily,
                            fill: config.textColor,
                            fontWeight: config.tracklistFontWeight || 600,
                            lineHeight: 1.45,
                            selectable: false,
                            originX: 'left',
                            originY: 'top'
                        });

                        const col2Text = new Textbox(col2Content, {
                            left: col2Left,
                            top: 0,
                            width: colW,
                            fontSize: trackFontSize,
                            fontFamily: config.fontFamily,
                            fill: config.textColor,
                            fontWeight: config.tracklistFontWeight || 600,
                            lineHeight: 1.45,
                            selectable: false,
                            originX: 'left',
                            originY: 'top'
                        });

                        const trackGroup = new Group([col1Text, col2Text], {
                            ...commonSelectable,
                            left: trackLeft,
                            top: trackTop,
                            originX: 'left',
                            originY: 'top',
                            // @ts-ignore
                            name: 'tracklist'
                        });

                        canvas.add(trackGroup);
                        tracklistBottom = trackTop + (trackGroup.height || (Math.ceil(metadata.tracks.length / 2) * (trackFontSize * 1.5 + 4)));
                    } else if (metadata.tracks.length > 0) {
                        const singleContent = metadata.tracks.map((t, idx) => {
                            const num = String(idx + 1).padStart(2, '0');
                            return `${num}. ${t.title.toUpperCase()}`;
                        }).join('\n');

                        const trackText = new Textbox(singleContent, {
                            ...commonSelectable,
                            left: trackLeft,
                            top: trackTop,
                            originX: 'left',
                            originY: 'top',
                            textAlign: trackAlign,
                            width: trackWidth,
                            fontSize: trackFontSize,
                            fontFamily: config.fontFamily,
                            fill: config.textColor,
                            fontWeight: config.tracklistFontWeight || 600,
                            lineHeight: 1.45,
                            // @ts-ignore
                            name: 'tracklist'
                        });

                        canvas.add(trackText);
                        tracklistBottom = trackTop + (trackText.height || (metadata.tracks.length * (trackFontSize * 1.5 + 4)));
                    }
                }

                // Liner Notes (Producer & Arranger credits at bottom)
                if (config.linerNotes?.visible) {
                    const linerAlign = config.linerNotes.align || 'center';
                    const defaultLinerTop = config.height - padding - 18;
                    const linerLeft = config.linerNotesPosition?.left ?? padding;
                    const linerWidth = config.linerNotesPosition?.width ?? (config.width - padding * 2);
                    const linerText = new Textbox((config.linerNotes.text || metadata.producerCredit || '').toUpperCase(), {
                        ...commonSelectable,
                        left: linerLeft,
                        top: config.linerNotesPosition?.top ?? defaultLinerTop,
                        fontSize: config.linerNotes.fontSize || 10,
                        fontFamily: config.fontFamily || 'Inter',
                        fill: config.textColor || '#000000',
                        fontWeight: 700,
                        textAlign: linerAlign,
                        originX: 'left',
                        originY: 'top',
                        width: linerWidth,
                        // @ts-ignore
                        name: 'liner_notes'
                    });
                    canvas.add(linerText);
                }

                // Modern Template Year Badge
                if (isModern && !hidden.has('release_date')) {
                    const defaultInfoLeft = config.width - padding;
                    const defaultInfoTop = config.height - padding - 94;
                    const infoLeft = config.releaseDatePosition?.left ?? defaultInfoLeft;
                    const infoTop = config.releaseDatePosition?.top ?? defaultInfoTop;
                    const infoFontSize = config.releaseDateFontSize ?? 16;

                    const infoText = new Text(`ALBUM • ${metadata.year}`, {
                        ...commonSelectable,
                        left: infoLeft,
                        top: infoTop,
                        fontSize: infoFontSize,
                        fontFamily: config.fontFamily,
                        fill: config.textColor,
                        fontWeight: 800,
                        originX: config.releaseDatePosition?.left !== undefined ? 'left' : 'right',
                        originY: 'top',
                        // @ts-ignore
                        name: 'metadata_info'
                    });
                    canvas.add(infoText);
                }

                // Cosmos Template Swatches
                if (isCosmos && config.paletteSwatches && config.paletteSwatches.length > 0) {
                    const swatchSize = 22;
                    const swatchGap = 10;
                    const swatches = config.paletteSwatches.slice(0, 5);
                    const swatchesY = config.height - padding - swatchSize - 6;

                    swatches.forEach((color, idx) => {
                        const swatchRect = new Rect({
                            left: padding + idx * (swatchSize + swatchGap),
                            top: swatchesY,
                            width: swatchSize,
                            height: swatchSize,
                            rx: 6,
                            ry: 6,
                            fill: color,
                            stroke: 'rgba(13, 13, 13, 0.15)',
                            strokeWidth: 1,
                            selectable: false,
                            evented: false,
                            // @ts-ignore
                            name: `cosmos_swatch_${idx}`
                        });
                        canvas.add(swatchRect);
                    });
                }
            }

            // Authentic RIAA Parental Advisory Explicit Content Tag (Movable & Resizable)
            const showPA = config.showParentalAdvisory ?? isModern;
            if (showPA) {
                const paStyle = config.parentalAdvisoryStyle || 'classic';
                const solidPosterBg = config.backgroundColor?.startsWith('#')
                    ? config.backgroundColor
                    : (config.backgroundColor?.match(/#[a-fA-F0-9]{3,6}/)?.[0] || '#ffffff');
                const paBg = paStyle === 'inverted' ? '#000000' : paStyle === 'match-ink' ? solidPosterBg : '#ffffff';
                const paInk = paStyle === 'inverted' ? '#ffffff' : paStyle === 'match-ink' ? (config.textColor || '#000000') : '#000000';
                const paBarText = paBg;

                const paWidth = 112;
                const paHeight = 70;
                const paScale = config.parentalAdvisoryScale ?? 1;
                const defaultPaLeft = config.width - padding - paWidth * paScale;
                const defaultPaTop = config.height - padding - paHeight * paScale;

                const paOuter = new Rect({
                    left: 0,
                    top: 0,
                    width: paWidth,
                    height: paHeight,
                    fill: paBg,
                    stroke: paInk,
                    strokeWidth: 2.5,
                    originX: 'left',
                    originY: 'top',
                    selectable: false,
                    evented: false,
                });

                const paParental = new Text('PARENTAL', {
                    left: paWidth / 2,
                    top: 12.5,
                    fontSize: 13.5,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fill: paInk,
                    fontWeight: 900,
                    charSpacing: 45,
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                });

                const paMiddleBar = new Rect({
                    left: 4,
                    top: 22,
                    width: paWidth - 8,
                    height: 26,
                    fill: paInk,
                    originX: 'left',
                    originY: 'top',
                    selectable: false,
                    evented: false,
                });

                const paAdvisory = new Text('ADVISORY', {
                    left: paWidth / 2,
                    top: 35.5,
                    fontSize: 16,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fill: paBarText,
                    fontWeight: 900,
                    charSpacing: 20,
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                });

                const paExplicit = new Text('EXPLICIT CONTENT', {
                    left: paWidth / 2,
                    top: 58.5,
                    fontSize: 8.8,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fill: paInk,
                    fontWeight: 900,
                    charSpacing: 15,
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                });

                const paGroup = new Group([paOuter, paParental, paMiddleBar, paAdvisory, paExplicit], {
                    ...commonSelectable,
                    left: config.parentalAdvisoryPosition?.left ?? defaultPaLeft,
                    top: config.parentalAdvisoryPosition?.top ?? defaultPaTop,
                    scaleX: paScale,
                    scaleY: paScale,
                    originX: 'left',
                    originY: 'top',
                    // @ts-ignore
                    name: 'parental_advisory'
                });
                canvas.add(paGroup);
            }

            // Vinyl Runout Groove Matrix Stamp
            if (config.matrixStamp?.visible) {
                const labelPrefix = metadata.label ? metadata.label.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '') : 'PR';
                const defaultStamp = `MATRIX: ${labelPrefix}-${metadata.year || '2024'}-01 • STEREO • ${config.matrixStamp.speed || '33⅓ RPM'} ARCHIVAL MASTER`;
                const stampContent = config.matrixStamp.text?.trim() || defaultStamp;
                const defaultMatrixTop = config.height - Math.round(padding * 0.45) - 8;

                const matrixText = new Text(stampContent.toUpperCase(), {
                    ...commonSelectable,
                    left: config.matrixStampPosition?.left ?? padding,
                    top: config.matrixStampPosition?.top ?? defaultMatrixTop,
                    fontSize: 8.5,
                    fontFamily: 'JetBrains Mono',
                    fill: config.textColor || '#000000',
                    opacity: 0.42,
                    charSpacing: 70,
                    originX: 'left',
                    originY: 'top',
                    // @ts-ignore
                    name: 'matrix_stamp'
                });
                canvas.add(matrixText);
            }

            // QR Code Rendering with Dynamic Smart Clearance
            if (config.qrCode?.visible && config.qrCode.url) {
                const anchor = config.qrCodeAnchor || 'auto';
                const baseSize = config.qrCode.size || 76;
                const isDense = tracklistBottom > (config.height - padding - baseSize - 18);

                let qrSize = baseSize;
                let defaultQrLeft = config.width - padding - qrSize;
                let defaultQrTop = config.height - padding - qrSize - 8;

                if (anchor === 'bottom-left') {
                    defaultQrLeft = padding;
                    defaultQrTop = config.height - padding - qrSize - 8;
                } else if (anchor === 'bottom-right') {
                    defaultQrLeft = config.width - padding - qrSize;
                    defaultQrTop = config.height - padding - qrSize - 8;
                } else if (anchor === 'badge-dock') {
                    qrSize = Math.min(qrSize, 64);
                    defaultQrLeft = config.width - padding - qrSize;
                    defaultQrTop = config.height - Math.round(padding * 0.45) - qrSize;
                } else {
                    // 'auto' Dynamic Clearance
                    if (isPalette) {
                        // In Palette, Column 2 has generous room on lower right beside release date
                        defaultQrLeft = config.width - padding - qrSize;
                        defaultQrTop = config.height - padding - qrSize - 6;
                    } else if (isModern) {
                        // In Modern, right side has Parental Advisory badge, so anchor cleanly on bottom left
                        defaultQrLeft = padding;
                        defaultQrTop = config.height - padding - qrSize - 8;
                    } else if (isDense) {
                        // Dense tracklist: scale to compact 64px badge and ensure clearance
                        qrSize = Math.min(qrSize, 64);
                        defaultQrLeft = config.width - padding - qrSize;
                        defaultQrTop = Math.max(tracklistBottom + 12, config.height - padding - qrSize - 4);
                        if (defaultQrTop + qrSize > config.height - 12) {
                            // If bottom edge reached, shift to bottom left
                            defaultQrLeft = padding;
                            defaultQrTop = config.height - padding - qrSize - 8;
                        }
                    } else {
                        defaultQrLeft = config.width - padding - qrSize;
                        defaultQrTop = config.height - padding - qrSize - 8;
                    }
                }

                import('qrcode').then(({ default: QRCode }) => {
                    QRCode.toDataURL(config.qrCode!.url, {
                        margin: 1,
                        width: qrSize,
                        color: {
                            dark: config.textColor || '#000000',
                            light: '#00000000'
                        }
                    }).then(qrDataUrl => {
                        FabricImage.fromURL(qrDataUrl).then(qrImg => {
                            qrImg.set({
                                left: config.qrCodePosition?.left ?? defaultQrLeft,
                                top: config.qrCodePosition?.top ?? defaultQrTop,
                                selectable: true,
                                lockRotation: true,
                                borderColor: '#f59e0b',
                                cornerColor: '#ffffff',
                                cornerStrokeColor: '#f59e0b',
                                cornerStyle: 'circle' as const,
                                cornerSize: 8,
                                transparentCorners: false,
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

            // Preserve active object selection if one was selected before re-render
            if (activeName) {
                const newActiveObj = canvas.getObjects().find(o => (o as any).name === activeName);
                if (newActiveObj && (newActiveObj as any).selectable) {
                    canvas.setActiveObject(newActiveObj);
                }
            }

            canvas.renderAll();
        };

        // Interactive Image Loading & Setup
        const currentImageKey = `${config.backgroundImage || ''}_${config.imageFade || 0}_${config.imageBlur || 0}`;
        const existingImg = canvas.getObjects().find(o => (o as any).name === 'poster_image') as FabricImage | undefined;

        if (config.backgroundImage) {
            if (existingImg && existingImg.width && existingImg.height && lastLoadedImageKey.current === currentImageKey) {
                // In-memory instant transform update without reloading from URL
                const padding = config.padding ?? 60;
                let baseScale = 1;
                let baseLeft = config.width / 2;
                let baseTop = 0;
                let originX: 'center' | 'left' = 'center';
                let originY: 'top' | 'center' = 'top';

                if (config.template === 'modern') {
                    const targetH = config.height * 0.60;
                    baseScale = Math.max(config.width / existingImg.width, targetH / existingImg.height);
                    baseLeft = config.width / 2;
                    baseTop = 0;
                } else if (config.template === 'split') {
                    baseScale = config.width / existingImg.width;
                    baseLeft = config.width / 2;
                    baseTop = 0;
                } else if (config.template === 'minimal') {
                    const isInline = config.tracklistLayout === 'inline';
                    const size = Math.min(config.width, config.height) * 0.44;
                    baseScale = Math.min(size / existingImg.width, size / existingImg.height);
                    baseLeft = config.width / 2;
                    baseTop = isInline ? config.height * 0.42 : config.height * 0.35;
                    originY = 'center';
                } else if (config.template === 'palette') {
                    const maxW = config.width - (padding * 2);
                    const maxH = config.height * 0.52;
                    baseScale = Math.min(maxW / existingImg.width, maxH / existingImg.height);
                    baseLeft = config.width / 2;
                    baseTop = padding;
                } else if (config.template === 'cosmos') {
                    const maxW = config.width - (padding * 2.2);
                    const maxH = config.height * 0.46;
                    baseScale = Math.min(maxW / existingImg.width, maxH / existingImg.height);
                    baseLeft = config.width / 2;
                    baseTop = padding + 54;
                }

                const finalScale = baseScale * (config.imageScale ?? 1);
                const finalLeft = baseLeft + (config.imageOffsetX || 0);
                const finalTop = baseTop + (config.imageOffsetY || 0);

                existingImg.set({
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
                    borderColor: '#f59e0b',
                    cornerColor: '#ffffff',
                    cornerStrokeColor: '#f59e0b',
                    cornerStyle: 'circle',
                    cornerSize: 9,
                    transparentCorners: false,
                    // @ts-ignore
                    data: { baseLeft, baseTop, baseScale }
                });
                existingImg.setCoords();
                renderTextAndBranding(existingImg);
            } else {
                const fadeVal = config.imageFade || 0;
                const getImageSrc = async (): Promise<string> => {
                    if (cachedFadedImage.current.key === currentImageKey && cachedFadedImage.current.src) {
                        return cachedFadedImage.current.src;
                    }
                    const src = await applyImageEdgeFade(config.backgroundImage!, fadeVal);
                    cachedFadedImage.current = { key: currentImageKey, src };
                    return src;
                };

                getImageSrc().then((processedSrc) => {
                    FabricImage.fromURL(processedSrc, { crossOrigin: 'anonymous' }).then((img: FabricImage) => {
                        if (!img.width || !img.height) return;

                        lastLoadedImageKey.current = currentImageKey;

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
                        } else if (config.template === 'cosmos') {
                            const maxW = config.width - (padding * 2.2);
                            const maxH = config.height * 0.46;
                            baseScale = Math.min(maxW / img.width, maxH / img.height);
                            baseLeft = config.width / 2;
                            baseTop = padding + 54;
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
                            borderColor: '#f59e0b',
                            cornerColor: '#ffffff',
                            cornerStrokeColor: '#f59e0b',
                            cornerStyle: 'circle',
                            cornerSize: 9,
                            transparentCorners: false,
                            // @ts-ignore
                            data: { baseLeft, baseTop, baseScale }
                        });
                        img.setCoords();

                        if (config.imageBlur && config.imageBlur > 0) {
                            img.filters = [new filters.Blur({ blur: config.imageBlur })];
                            img.applyFilters();
                        } else {
                            img.filters = [];
                            img.applyFilters();
                        }

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
            }
        } else {
            const existing = canvas.getObjects().find(o => (o as any).name === 'poster_image');
            if (existing) canvas.remove(existing);
            lastLoadedImageKey.current = '';
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
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-[var(--studio-canvas-bg)] relative overflow-hidden transition-colors duration-300">
            {/* Hand Tool Spacebar Pill */}
            {isSpacePressed && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--surface)] text-[var(--text)] border border-[var(--border-color)] rounded-full text-xs shadow-xl z-30 flex items-center gap-1.5 animate-fade-in pointer-events-none select-none">
                    <Hand size={13} className="text-[var(--accent)]" />
                    <span className="font-semibold">Hand Tool</span>
                    <span className="text-[var(--text2)]">• Drag to Pan Canvas</span>
                </div>
            )}

            {/* Selected Canvas Element Action Pill */}
            {selectedName && !isSpacePressed && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--surface)]/95 backdrop-blur text-[var(--text)] border border-[var(--border-color)] rounded-full text-xs shadow-xl z-30 flex items-center gap-2.5 animate-fade-in select-none">
                    <span className="font-semibold text-[var(--text)]">
                        {ELEMENT_LABELS[selectedName] || 'Selected Item'}
                    </span>
                    <span className="h-3.5 w-px bg-[var(--border-color)]" />
                    <button
                        type="button"
                        onClick={() => removeCanvasObject(selectedName)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                        title="Remove selected item from canvas (Delete / Backspace)"
                    >
                        <Trash2 size={12} />
                        <span>Remove</span>
                        <kbd className="ml-0.5 px-1 py-0.2 text-[9px] font-mono rounded bg-[var(--surface2)] text-[var(--text3)] border border-[var(--border-color)]">
                            Del
                        </kbd>
                    </button>
                </div>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex gap-1.5 bg-[var(--surface)] backdrop-blur rounded-xl p-1 border border-[var(--border-color)] z-10 shadow-lg transition-all select-none">
                <button
                    onClick={() => setZoom(z => Math.max(z * 0.9, 0.1))}
                    className="p-2 hover:bg-[var(--surface2)] rounded-lg text-[var(--text)] text-xs font-bold"
                    title="Zoom Out (Ctrl+-)"
                >
                    -
                </button>
                <button
                    onClick={() => setZoom(1)}
                    className="px-2.5 py-1.5 text-xs font-mono text-[var(--text2)] hover:text-[var(--accent)] hover:bg-[var(--surface2)] rounded-lg min-w-[3.5rem] text-center transition-colors cursor-pointer"
                    title="Click to reset zoom to 100% (Ctrl+0)"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <button
                    onClick={() => setZoom(z => Math.min(z * 1.1, 5))}
                    className="p-2 hover:bg-[var(--surface2)] rounded-lg text-[var(--text)] text-xs font-bold"
                    title="Zoom In (Ctrl++)"
                >
                    +
                </button>
                <button
                    onClick={() => setZoom(1)}
                    className="px-2.5 py-1.5 hover:bg-[var(--surface2)] rounded-lg text-[var(--text)] text-xs font-medium"
                    title="Fit to Viewport (Ctrl+0)"
                >
                    Fit
                </button>
            </div>

            <div
                ref={scrollContainerRef}
                onMouseDown={(e) => {
                    if (isSpacePressedRef.current || e.button === 1) {
                        e.preventDefault();
                        isPanningRef.current = true;
                        setIsPanning(true);
                        if (scrollContainerRef.current) {
                            panStartRef.current = {
                                x: e.clientX,
                                y: e.clientY,
                                scrollLeft: scrollContainerRef.current.scrollLeft,
                                scrollTop: scrollContainerRef.current.scrollTop
                            };
                        }
                    }
                }}
                className={`w-full h-full overflow-auto flex items-center justify-center p-10 select-none ${isPanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : ''}`}
            >
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
                        boxShadow: 'var(--shadow-canvas)',
                        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
                        overflow: 'hidden'
                    }}>
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
