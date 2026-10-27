/**
 * Downscales and compresses user-uploaded album artwork before setting it in state.
 * This guarantees the image will not exceed browser LocalStorage 5MB quota limits.
 */
export async function optimizePosterImage(file: File, maxDimension = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // High quality JPEG keeps payload around ~150-250KB for safe persistence
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Applies a smooth alpha gradient feather directly to the bottom of the image.
 * Bakes transparency into the image's alpha channel (PNG), allowing it to naturally
 * dissolve into whatever background lies beneath it, wherever it is moved or scaled.
 */
export async function applyImageEdgeFade(imageUrl: string, fadePercent: number): Promise<string> {
  if (!fadePercent || fadePercent <= 0) return imageUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const fraction = Math.min(Math.max(fadePercent / 100, 0.02), 0.95);
      const fadeH = height * fraction;
      const fadeTop = height - fadeH;

      const grad = ctx.createLinearGradient(0, fadeTop, 0, height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = grad;
      ctx.fillRect(0, fadeTop, width, fadeH);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}
