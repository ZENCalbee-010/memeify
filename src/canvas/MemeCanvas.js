import { getTemplateById, svgToDataUrl } from '../templates/templateData.js';

export class MemeCanvas {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    
    // Virtual dimensions of the meme
    this.width = options.width || 800;
    this.height = options.height || 800;
    this.aspectRatio = 'original'; // 'original', '1:1', '4:5', '16:9', '9:16'
    
    // Base image
    this.baseImage = null;
    this.baseImageSrc = null;
    this.currentTemplateId = null;

    // Filter adjustments for the base canvas
    this.filters = {
      grayscale: 0,   // 0 - 100%
      brightness: 100, // 0 - 200%
      contrast: 100,   // 0 - 200%
      blur: 0,         // 0 - 20px
      sepia: 0,        // 0 - 100%
      saturation: 100, // 0 - 200%
      invert: 0        // 0 - 100%
    };

    // Layers (text, sticker, emoji)
    this.layers = [];
    this.activeLayerId = null;

    // Listeners for change events
    this.listeners = new Set();

    // Initialize dimensions
    this.updateCanvasDimensions();
  }

  onChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyChange(changeType = 'render') {
    for (const listener of this.listeners) {
      listener({ type: changeType, canvas: this });
    }
  }

  /**
   * Resize the physical HTML canvas taking devicePixelRatio into account
   */
  updateCanvasDimensions() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    // Reset transform and scale for DPR
    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale?.(dpr, dpr);
    }

    // CSS size
    this.canvas.style.aspectRatio = `${this.width} / ${this.height}`;
  }

  /**
   * Load an image from URL or Data URL
   */
  async loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.baseImage = img;
        this.baseImageSrc = url;
        
        // Adjust canvas resolution based on aspect ratio
        this.calculateDimensionsFromImage(img);
        this.updateCanvasDimensions();
        this.render();
        this.notifyChange('image-loaded');
        resolve(img);
      };
      img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
      img.src = url;
    });
  }

  /**
   * Load image directly from user File object
   */
  async loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentTemplateId = null;
        this.loadImageFromUrl(e.target.result).then(resolve).catch(reject);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Load built-in meme template
   */
  async loadTemplate(templateId) {
    const template = getTemplateById(templateId);
    this.currentTemplateId = template.id;
    const dataUrl = svgToDataUrl(template.svg);
    await this.loadImageFromUrl(dataUrl);
    return template;
  }

  /**
   * Calculate dimensions based on aspect ratio and base image
   */
  calculateDimensionsFromImage(img) {
    let targetW = img.naturalWidth || 800;
    let targetH = img.naturalHeight || 800;

    // Cap maximum resolution for performance and crispness
    const MAX_DIM = 1200;
    if (targetW > MAX_DIM || targetH > MAX_DIM) {
      const scale = Math.min(MAX_DIM / targetW, MAX_DIM / targetH);
      targetW = Math.round(targetW * scale);
      targetH = Math.round(targetH * scale);
    }

    if (this.aspectRatio === '1:1') {
      const size = Math.max(targetW, targetH);
      this.width = size;
      this.height = size;
    } else if (this.aspectRatio === '4:5') {
      this.width = targetW;
      this.height = Math.round(targetW * (5 / 4));
    } else if (this.aspectRatio === '16:9') {
      this.width = targetW;
      this.height = Math.round(targetW * (9 / 16));
    } else if (this.aspectRatio === '9:16') {
      this.height = targetH;
      this.width = Math.round(targetH * (9 / 16));
    } else {
      // 'original'
      this.width = targetW;
      this.height = targetH;
    }
  }

  setAspectRatio(ratio) {
    this.aspectRatio = ratio;
    if (this.baseImage) {
      this.calculateDimensionsFromImage(this.baseImage);
      this.updateCanvasDimensions();
      this.render();
      this.notifyChange('aspect-ratio');
    }
  }

  /**
   * Format CSS filter string
   */
  getFilterString() {
    const { grayscale, brightness, contrast, blur, sepia, saturation, invert } = this.filters;
    return `grayscale(${grayscale}%) brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) sepia(${sepia}%) saturate(${saturation}%) invert(${invert}%)`;
  }

  /**
   * Main render loop
   */
  render() {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.width;
    const h = this.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw background color (deep dark / neutral)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Draw base image if available
    if (this.baseImage) {
      ctx.save();
      // Apply filters
      ctx.filter = this.getFilterString();

      // Fit image into canvas maintaining aspect ratio or filling
      const imgW = this.baseImage.naturalWidth || this.baseImage.width;
      const imgH = this.baseImage.naturalHeight || this.baseImage.height;
      
      if (this.aspectRatio === 'original') {
        ctx.drawImage(this.baseImage, 0, 0, w, h);
      } else {
        // Center crop / fit
        const imgAspect = imgW / imgH;
        const canvasAspect = w / h;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > canvasAspect) {
          drawH = h;
          drawW = h * imgAspect;
          drawX = (w - drawW) / 2;
          drawY = 0;
        } else {
          drawW = w;
          drawH = w / imgAspect;
          drawX = 0;
          drawY = (h - drawH) / 2;
        }
        ctx.drawImage(this.baseImage, drawX, drawY, drawW, drawH);
      }
      ctx.restore();
    }

    // Render layers in sequential z-order (handled in Phase 2 & Phase 3)
    for (const layer of this.layers) {
      if (!layer.visible) continue;
      this.renderLayer(layer);
    }
  }

  /**
   * Placeholder hook for rendering a layer (extended in next phases)
   */
  renderLayer(layer) {
    // Extended in subsequent feature branches
  }

  /**
   * Convert canvas to image Data URL
   */
  toDataURL(format = 'image/png', quality = 0.95) {
    // Render at 1:1 pixel scale to export clean output
    return this.canvas.toDataURL(format, quality);
  }
}
