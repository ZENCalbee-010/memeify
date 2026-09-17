export class StickerLayer {
  constructor(options = {}) {
    this.id = options.id || `sticker-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.type = 'sticker';
    this.stickerType = options.stickerType || 'emoji'; // 'emoji', 'svg', 'image'
    this.content = options.content || '😂'; // emoji char or image URL
    this.x = options.x ?? 400;
    this.y = options.y ?? 400;
    this.size = options.size || 120; // default width/height
    this.rotation = options.rotation || 0; // in degrees
    this.opacity = options.opacity ?? 1;
    this.flipX = options.flipX || false;
    this.visible = options.visible ?? true;

    // Loaded image object if stickerType is 'svg' or 'image'
    this.imageElement = null;
    this.isLoaded = this.stickerType === 'emoji';

    if (this.stickerType !== 'emoji') {
      this.loadImage(this.content);
    }
  }

  loadImage(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.imageElement = img;
      this.isLoaded = true;
    };
    img.src = src;
  }

  /**
   * Hit test accounting for rotation and center positioning
   */
  containsPoint(px, py) {
    if (!this.visible) return false;

    const rad = (-this.rotation * Math.PI) / 180;
    const dx = px - this.x;
    const dy = py - this.y;

    // Inverse rotate point to align with axis
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
    const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

    const halfSize = this.size / 2;
    const padding = 10;

    return (
      localX >= -halfSize - padding &&
      localX <= halfSize + padding &&
      localY >= -halfSize - padding &&
      localY <= halfSize + padding
    );
  }

  draw(ctx, isSelected = false) {
    if (!this.visible || !ctx) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

    // Translate to center point
    ctx.translate(this.x, this.y);

    // Rotation
    if (this.rotation !== 0) {
      ctx.rotate((this.rotation * Math.PI) / 180);
    }

    // Horizontal flip
    if (this.flipX) {
      ctx.scale(-1, 1);
    }

    const half = this.size / 2;

    if (this.stickerType === 'emoji') {
      // Draw emoji with high resolution
      ctx.font = `${this.size * 0.85}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.content, 0, 0);
    } else if (this.imageElement && this.isLoaded) {
      ctx.drawImage(this.imageElement, -half, -half, this.size, this.size);
    }

    // Unflip for drawing selection box
    if (this.flipX) {
      ctx.scale(-1, 1);
    }

    if (isSelected) {
      this.drawSelectionBox(ctx, half);
    }

    ctx.restore();
  }

  drawSelectionBox(ctx, half) {
    ctx.save();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(-half - 6, -half - 6, this.size + 12, this.size + 12);

    // Corner handle markers
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;

    const corners = [
      [-half - 6, -half - 6],
      [half + 6, -half - 6],
      [-half - 6, half + 6],
      [half + 6, half + 6]
    ];

    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - 4, cy - 4, 8, 8);
      ctx.strokeRect(cx - 4, cy - 4, 8, 8);
    });

    // Rotation stem at top
    ctx.beginPath();
    ctx.moveTo(0, -half - 6);
    ctx.lineTo(0, -half - 22);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -half - 22, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();

    ctx.restore();
  }
}
