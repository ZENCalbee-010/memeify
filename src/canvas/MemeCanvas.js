import { getTemplateById, svgToDataUrl, getTemplateUrl } from '../templates/templateData.js';
import { TextLayer } from './TextLayer.js';
import { StickerLayer } from './StickerLayer.js';

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

    // Dragging interaction state
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };

    // Listeners for change events
    this.listeners = new Set();

    // Initialize dimensions & pointer listeners
    this.updateCanvasDimensions();
    this.setupInteractions();
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
    const url = getTemplateUrl(template);
    await this.loadImageFromUrl(url);
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
   * Render individual layer
   */
  renderLayer(layer) {
    if (!this.ctx) return;
    const isSelected = layer.id === this.activeLayerId;
    layer.draw(this.ctx, isSelected);
  }

  /**
   * Add a new layer and make it active
   */
  addLayer(layer) {
    this.layers.push(layer);
    this.activeLayerId = layer.id;
    this.render();
    this.notifyChange('layer-added');
    return layer;
  }

  /**
   * Remove a layer by ID
   */
  removeLayer(layerId) {
    const idx = this.layers.findIndex(l => l.id === layerId);
    if (idx !== -1) {
      this.layers.splice(idx, 1);
      if (this.activeLayerId === layerId) {
        this.activeLayerId = this.layers.length > 0 ? this.layers[this.layers.length - 1].id : null;
      }
      this.render();
      this.notifyChange('layer-removed');
    }
  }

  /**
   * Get layer by ID
   */
  getLayer(layerId) {
    return this.layers.find(l => l.id === layerId) || null;
  }

  /**
   * Get currently active/selected layer
   */
  getActiveLayer() {
    return this.getLayer(this.activeLayerId);
  }

  /**
   * Select active layer
   */
  setActiveLayer(layerId) {
    if (this.activeLayerId !== layerId) {
      this.activeLayerId = layerId;
      this.render();
      this.notifyChange('active-layer-changed');
    }
  }

  /**
   * Move layer up one step in z-order
   */
  moveLayerUp(layerId) {
    const idx = this.layers.findIndex(l => l.id === layerId);
    if (idx !== -1 && idx < this.layers.length - 1) {
      const temp = this.layers[idx];
      this.layers[idx] = this.layers[idx + 1];
      this.layers[idx + 1] = temp;
      this.render();
      this.notifyChange('layers-reordered');
    }
  }

  /**
   * Move layer down one step in z-order
   */
  moveLayerDown(layerId) {
    const idx = this.layers.findIndex(l => l.id === layerId);
    if (idx > 0) {
      const temp = this.layers[idx];
      this.layers[idx] = this.layers[idx - 1];
      this.layers[idx - 1] = temp;
      this.render();
      this.notifyChange('layers-reordered');
    }
  }

  /**
   * Bring layer to the very top
   */
  bringToFront(layerId) {
    const idx = this.layers.findIndex(l => l.id === layerId);
    if (idx !== -1 && idx < this.layers.length - 1) {
      const [layer] = this.layers.splice(idx, 1);
      this.layers.push(layer);
      this.render();
      this.notifyChange('layers-reordered');
    }
  }

  /**
   * Send layer to the very bottom
   */
  sendToBack(layerId) {
    const idx = this.layers.findIndex(l => l.id === layerId);
    if (idx > 0) {
      const [layer] = this.layers.splice(idx, 1);
      this.layers.unshift(layer);
      this.render();
      this.notifyChange('layers-reordered');
    }
  }

  /**
   * Toggle visibility of layer
   */
  toggleLayerVisibility(layerId) {
    const layer = this.getLayer(layerId);
    if (layer) {
      layer.visible = !layer.visible;
      this.render();
      this.notifyChange('layer-visibility-changed');
    }
  }

  /**
   * Duplicate a layer
   */
  duplicateLayer(layerId) {
    const layer = this.getLayer(layerId);
    if (!layer) return null;

    let clone = null;
    if (layer.type === 'text') {
      clone = new TextLayer({
        ...layer,
        id: `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        x: layer.x + 20,
        y: layer.y + 20
      });
    } else if (layer.type === 'sticker') {
      const StickerLayerClass = layer.constructor;
      clone = new StickerLayerClass({
        ...layer,
        id: `sticker-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        x: layer.x + 20,
        y: layer.y + 20
      });
    }

    if (clone) {
      const idx = this.layers.findIndex(l => l.id === layerId);
      this.layers.splice(idx + 1, 0, clone);
      this.activeLayerId = clone.id;
      this.render();
      this.notifyChange('layer-added');
    }
    return clone;
  }

  /**
   * Set filter parameter
   */
  setFilter(filterName, value) {
    if (filterName in this.filters) {
      this.filters[filterName] = value;
      this.render();
      this.notifyChange('filters-changed');
    }
  }

  /**
   * Reset all filters to default
   */
  resetFilters() {
    this.filters = {
      grayscale: 0,
      brightness: 100,
      contrast: 100,
      blur: 0,
      sepia: 0,
      saturation: 100,
      invert: 0
    };
    this.render();
    this.notifyChange('filters-changed');
  }

  /**
   * Apply preset filters
   */
  applyFilterPreset(presetName) {
    switch (presetName) {
      case 'vintage':
        this.filters = { grayscale: 0, brightness: 95, contrast: 110, blur: 0, sepia: 40, saturation: 80, invert: 0 };
        break;
      case 'bw':
        this.filters = { grayscale: 100, brightness: 105, contrast: 130, blur: 0, sepia: 0, saturation: 0, invert: 0 };
        break;
      case 'cyber':
        this.filters = { grayscale: 0, brightness: 110, contrast: 140, blur: 0, sepia: 0, saturation: 160, invert: 0 };
        break;
      case 'soft':
        this.filters = { grayscale: 0, brightness: 105, contrast: 85, blur: 1, sepia: 10, saturation: 90, invert: 0 };
        break;
      case 'invert':
        this.filters = { grayscale: 0, brightness: 100, contrast: 100, blur: 0, sepia: 0, saturation: 100, invert: 100 };
        break;
      case 'none':
      default:
        this.resetFilters();
        return;
    }
    this.render();
    this.notifyChange('filters-changed');
  }

  /**
   * Helper to translate client coordinates to internal canvas coordinates
   */
  getCanvasCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  /**
   * Pointer & touch event interaction system for canvas dragging and selection
   */
  setupInteractions() {
    if (!this.canvas || typeof window === 'undefined') return;

    const handlePointerDown = (e) => {
      const { x, y } = this.getCanvasCoordinates(e);

      // Hit-test from topmost layer (end of array) to bottom
      let hitLayer = null;
      for (let i = this.layers.length - 1; i >= 0; i--) {
        const layer = this.layers[i];
        if (layer.visible && layer.containsPoint(x, y)) {
          hitLayer = layer;
          break;
        }
      }

      if (hitLayer) {
        this.setActiveLayer(hitLayer.id);
        this.isDragging = true;
        this.dragOffset = {
          x: x - hitLayer.x,
          y: y - hitLayer.y
        };
        this.canvas.style.cursor = 'grabbing';
      } else {
        // Deselect if clicking on empty canvas area
        this.setActiveLayer(null);
      }
    };

    const handlePointerMove = (e) => {
      const { x, y } = this.getCanvasCoordinates(e);

      if (this.isDragging && this.activeLayerId) {
        const activeLayer = this.getActiveLayer();
        if (activeLayer) {
          activeLayer.x = Math.round(x - this.dragOffset.x);
          activeLayer.y = Math.round(y - this.dragOffset.y);
          this.render();
          this.notifyChange('layer-moved');
        }
      } else {
        // Check hover
        let hovering = false;
        for (let i = this.layers.length - 1; i >= 0; i--) {
          const layer = this.layers[i];
          if (layer.visible && layer.containsPoint(x, y)) {
            hovering = true;
            break;
          }
        }
        this.canvas.style.cursor = hovering ? 'grab' : 'crosshair';
      }
    };

    const handlePointerUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
        this.notifyChange('layer-drag-end');
      }
    };

    this.canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  /**
   * Convert canvas to image Data URL
   */
  toDataURL(format = 'image/png', quality = 0.95) {
    // Temporarily clear selection box for clean export
    const prevActive = this.activeLayerId;
    this.activeLayerId = null;
    this.render();
    
    const dataUrl = this.canvas.toDataURL(format, quality);
    
    // Restore selection
    this.activeLayerId = prevActive;
    this.render();
    return dataUrl;
  }

  /**
   * Serialize current canvas state to JSON-serializable snapshot
   */
  serialize() {
    return {
      width: this.width,
      height: this.height,
      aspectRatio: this.aspectRatio,
      currentTemplateId: this.currentTemplateId,
      baseImageSrc: this.baseImageSrc,
      filters: { ...this.filters },
      activeLayerId: this.activeLayerId,
      layers: this.layers.map(layer => {
        if (layer.type === 'text') {
          return {
            type: 'text',
            id: layer.id,
            text: layer.text,
            x: layer.x,
            y: layer.y,
            fontFamily: layer.fontFamily,
            fontSize: layer.fontSize,
            fontWeight: layer.fontWeight,
            fillColor: layer.fillColor,
            strokeColor: layer.strokeColor,
            strokeWidth: layer.strokeWidth,
            textAlign: layer.textAlign,
            opacity: layer.opacity,
            uppercase: layer.uppercase,
            shadow: layer.shadow,
            visible: layer.visible,
            rotation: layer.rotation
          };
        } else if (layer.type === 'sticker') {
          return {
            type: 'sticker',
            id: layer.id,
            stickerType: layer.stickerType,
            content: layer.content,
            x: layer.x,
            y: layer.y,
            size: layer.size,
            rotation: layer.rotation,
            opacity: layer.opacity,
            flipX: layer.flipX,
            visible: layer.visible
          };
        }
        return { ...layer };
      })
    };
  }

  /**
   * Restore canvas state from serialized snapshot
   */
  async loadState(state) {
    if (!state) return;

    this.width = state.width || 800;
    this.height = state.height || 800;
    this.aspectRatio = state.aspectRatio || 'original';
    this.filters = { ...state.filters };

    // Restore base image
    if (state.baseImageSrc && state.baseImageSrc !== this.baseImageSrc) {
      await this.loadImageFromUrl(state.baseImageSrc);
    } else if (state.currentTemplateId && state.currentTemplateId !== this.currentTemplateId) {
      await this.loadTemplate(state.currentTemplateId);
    }
    this.currentTemplateId = state.currentTemplateId;

    // Reconstruct layers
    this.layers = (state.layers || []).map(layerData => {
      if (layerData.type === 'text') {
        return new TextLayer(layerData);
      } else if (layerData.type === 'sticker') {
        return new StickerLayer(layerData);
      }
      return layerData;
    });

    this.activeLayerId = state.activeLayerId;
    this.updateCanvasDimensions();
    this.render();
    this.notifyChange('state-restored');
  }
}
