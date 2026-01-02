export interface ColorAnalysis {
    background: string;
    text: string;
    topColor: string;
    bottomColor: string;
    suggestedGradient: string;
}

export async function extractDominantColors(imageUrl: string): Promise<ColorAnalysis> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                const fallback = { background: '#000000', text: '#ffffff', topColor: '#000000', bottomColor: '#000000', suggestedGradient: 'linear-gradient(to bottom, #000000, #333333)' };
                resolve(fallback);
                return;
            }

            canvas.width = 100;
            canvas.height = 100 * (img.height / img.width);
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

            resolve({ background, text, topColor, bottomColor, suggestedGradient });
        };

        img.onerror = () => {
            resolve({ background: '#000000', text: '#ffffff', topColor: '#000000', bottomColor: '#000000', suggestedGradient: 'linear-gradient(to bottom, #000000, #333333)' });
        };
    });
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

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
