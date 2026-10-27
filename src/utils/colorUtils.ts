export interface ColorAnalysis {
    background: string;
    text: string;
    topColor: string;
    bottomColor: string;
    suggestedGradient: string;
    palette: string[]; // 5 dominant distinct hex colors
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

export async function extractDominantColors(imageUrl: string): Promise<ColorAnalysis> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                const fallback = {
                    background: '#000000',
                    text: '#ffffff',
                    topColor: '#000000',
                    bottomColor: '#000000',
                    suggestedGradient: 'linear-gradient(to bottom, #000000, #333333)',
                    palette: ['#2c3e50', '#c0392b', '#ecf0f1', '#3498db', '#2980b9']
                };
                resolve(fallback);
                return;
            }

            canvas.width = 100;
            canvas.height = Math.max(20, Math.floor(100 * (img.height / img.width)));
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            // Analyze Top area (first 20%)
            const topColor = getAverageColor(imageData, 0, Math.floor(canvas.height * 0.2), canvas.width);
            // Analyze Bottom area (last 20%)
            const bottomColor = getAverageColor(imageData, Math.floor(canvas.height * 0.8), canvas.height, canvas.width);
            // Analyze Whole image
            const background = getAverageColor(imageData, 0, canvas.height, canvas.width);

            // Determine text color based on brightness of the main background
            const rgb = hexToRgb(background);
            const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
            const text = (yiq >= 128) ? '#000000' : '#ffffff';

            const suggestedGradient = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;

            // Extract 5-swatch palette using median-cut quantization
            const palette = quantizePalette(imageData, 5);

            resolve({ background, text, topColor, bottomColor, suggestedGradient, palette });
        };

        img.onerror = () => {
            resolve({
                background: '#000000',
                text: '#ffffff',
                topColor: '#000000',
                bottomColor: '#000000',
                suggestedGradient: 'linear-gradient(to bottom, #000000, #333333)',
                palette: ['#2c3e50', '#c0392b', '#ecf0f1', '#3498db', '#2980b9']
            });
        };
    });
}

function quantizePalette(imageData: Uint8ClampedArray, count = 5): string[] {
    const pixels: RGB[] = [];
    for (let i = 0; i < imageData.length; i += 16) {
        if (imageData[i + 3] > 128) {
            pixels.push({
                r: imageData[i],
                g: imageData[i + 1],
                b: imageData[i + 2],
            });
        }
    }
    if (pixels.length === 0) {
        return ['#2c3e50', '#c0392b', '#ecf0f1', '#3498db', '#2980b9'];
    }

    let boxes: RGB[][] = [pixels];
    while (boxes.length < count * 2) {
        let maxRange = -1;
        let boxIndexToSplit = -1;
        let channelToSplit: 'r' | 'g' | 'b' = 'r';

        for (let bIdx = 0; bIdx < boxes.length; bIdx++) {
            const box = boxes[bIdx];
            if (box.length < 4) continue;
            let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
            for (const p of box) {
                if (p.r < minR) minR = p.r;
                if (p.r > maxR) maxR = p.r;
                if (p.g < minG) minG = p.g;
                if (p.g > maxG) maxG = p.g;
                if (p.b < minB) minB = p.b;
                if (p.b > maxB) maxB = p.b;
            }
            const rangeR = maxR - minR;
            const rangeG = maxG - minG;
            const rangeB = maxB - minB;
            const largest = Math.max(rangeR, rangeG, rangeB);

            if (largest > maxRange) {
                maxRange = largest;
                boxIndexToSplit = bIdx;
                channelToSplit = largest === rangeR ? 'r' : largest === rangeG ? 'g' : 'b';
            }
        }

        if (boxIndexToSplit === -1 || maxRange <= 8) break;

        const targetBox = boxes[boxIndexToSplit];
        targetBox.sort((a, b) => a[channelToSplit] - b[channelToSplit]);
        const median = Math.floor(targetBox.length / 2);
        boxes.splice(boxIndexToSplit, 1, targetBox.slice(0, median), targetBox.slice(median));
    }

    const averageColors = boxes
        .filter(b => b.length > 0)
        .map(box => {
            let sumR = 0, sumG = 0, sumB = 0;
            for (const p of box) {
                sumR += p.r;
                sumG += p.g;
                sumB += p.b;
            }
            const r = Math.round(sumR / box.length);
            const g = Math.round(sumG / box.length);
            const b = Math.round(sumB / box.length);
            return {
                hex: rgbToHex(r, g, b),
                weight: box.length
            };
        });

    averageColors.sort((a, b) => b.weight - a.weight);

    const result: string[] = [];
    for (const c of averageColors) {
        if (!result.includes(c.hex)) {
            result.push(c.hex);
        }
        if (result.length >= count) break;
    }

    while (result.length < count) {
        result.push(result[0] || '#444444');
    }
    return result;
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getAverageColor(data: Uint8ClampedArray, startRow: number, endRow: number, width: number): string {
    let r = 0, g = 0, b = 0;
    let count = 0;

    for (let row = startRow; row < endRow; row++) {
        for (let col = 0; col < width; col++) {
            const i = (row * width + col) * 4;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
    }

    if (count === 0) return '#000000';

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
