export class TextLayer {
  constructor(options = {}) {
    this.id = options.id || `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.type = 'text';
    this.text = options.text || 'YOUR TEXT HERE';
    this.x = options.x ?? 400;
    this.y = options.y ?? 100;
    this.fontFamily = options.fontFamily || 'Impact';
    this.fontSize = options.fontSize || 48;
    this.fontWeight = options.fontWeight || 'bold';
    this.fillColor = options.fillColor || '#ffffff';
    this.strokeColor = options.strokeColor || '#000000';
    this.strokeWidth = options.strokeWidth ?? 4;
    this.textAlign = options.textAlign || 'center'; // 'left', 'center', 'right'
    this.opacity = options.opacity ?? 1;
    this.uppercase = options.uppercase ?? true;
    this.shadow = options.shadow ?? false;
    this.visible = options.visible ?? true;
    this.rotation = options.rotation || 0; // in degrees

    // Computed bounding box
    this.width = 0;
    this.height = 0;
    this.bounds = { x: 0, y: 0, width: 0, height: 0 };
  }

  getDisplayText() {
    return this.uppercase ? this.text.toUpperCase() : this.text;
  }

  /**
   * Split text into lines, handling explicit newlines
   */
  getLines() {
    const raw = this.getDisplayText();
    return raw.split('\n');
  }

  /**
   * Measure text dimensions and calculate bounding box
   */
  measure(ctx) {
    if (!ctx) return;
    ctx.save();
    ctx.font = `${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;
    
    const lines = this.getLines();
    const lineHeight = this.fontSize * 1.15;
    let maxLineWidth = 0;

    for (const line of lines) {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxLineWidth) {
        maxLineWidth = metrics.width;
      }
    }

    this.width = Math.max(maxLineWidth, 40);
    this.height = Math.max(lines.length * lineHeight, this.fontSize);

    // Calculate bounding box based on alignment
    let left = this.x;
    if (this.textAlign === 'center') {
      left = this.x - this.width / 2;
    } else if (this.textAlign === 'right') {
      left = this.x - this.width;
    }

    const padding = 12;
    this.bounds = {
      x: left - padding,
      y: this.y - this.fontSize - padding,
      width: this.width + padding * 2,
      height: this.height + padding * 2
    };

    ctx.restore();
  }

  /**
   * Hit test to check if point is inside layer's bounding box
   */
  containsPoint(px, py) {
    if (!this.visible) return false;
    const b = this.bounds;
    return (
      px >= b.x &&
      px <= b.x + b.width &&
      py >= b.y &&
      py <= b.y + b.height
    );
  }

  /**
   * Draw the text layer on the canvas context
   */
  draw(ctx, isSelected = false) {
    if (!this.visible || !ctx) return;

    this.measure(ctx);

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

    // Handle rotation around center of bounds
    if (this.rotation !== 0) {
      const cx = this.bounds.x + this.bounds.width / 2;
      const cy = this.bounds.y + this.bounds.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // Shadow effect if enabled
    if (this.shadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    ctx.font = `${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = 'alphabetic';

    const lines = this.getLines();
    const lineHeight = this.fontSize * 1.15;

    lines.forEach((line, index) => {
      const lineY = this.y + (index * lineHeight);

      // Stroke outline first
      if (this.strokeWidth > 0 && this.strokeColor) {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth * 2;
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 2;
        ctx.strokeText(line, this.x, lineY);
      }

      // Fill text
      ctx.fillStyle = this.fillColor;
      ctx.fillText(line, this.x, lineY);
    });

    // Draw selection frame if selected
    if (isSelected) {
      this.drawSelectionBox(ctx);
    }

    ctx.restore();
  }

  /**
   * Draw active selection indicators
   */
  drawSelectionBox(ctx) {
    const b = this.bounds;
    ctx.save();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(b.x, b.y, b.width, b.height);

    // Corner handle boxes
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;

    const corners = [
      [b.x, b.y],
      [b.x + b.width, b.y],
      [b.x, b.y + b.height],
      [b.x + b.width, b.y + b.height]
    ];

    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - 5, cy - 5, 10, 10);
      ctx.strokeRect(cx - 5, cy - 5, 10, 10);
    });

    ctx.restore();
  }
}
