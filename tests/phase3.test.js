import { describe, it, expect } from 'vitest';
import { MEME_EMOJIS, MEME_STICKERS, svgToStickerUrl } from '../src/stickers/stickerData.js';
import { StickerLayer } from '../src/canvas/StickerLayer.js';
import { MemeCanvas } from '../src/canvas/MemeCanvas.js';

describe('Phase 3: Stickers and Emojis', () => {
  it('has a rich collection of meme emojis and vector stickers', () => {
    expect(MEME_EMOJIS.length).toBeGreaterThanOrEqual(10);
    expect(MEME_STICKERS.length).toBeGreaterThanOrEqual(5);

    MEME_STICKERS.forEach(s => {
      expect(s.id).toBeDefined();
      expect(s.svg).toContain('<svg');
    });

    const url = svgToStickerUrl(MEME_STICKERS[0].svg);
    expect(url.startsWith('data:image/svg+xml')).toBe(true);
  });

  it('creates an emoji StickerLayer with proper defaults', () => {
    const layer = new StickerLayer({
      stickerType: 'emoji',
      content: '🔥',
      x: 300,
      y: 250,
      size: 100
    });

    expect(layer.type).toBe('sticker');
    expect(layer.stickerType).toBe('emoji');
    expect(layer.content).toBe('🔥');
    expect(layer.size).toBe(100);
    expect(layer.rotation).toBe(0);
    expect(layer.flipX).toBe(false);
  });

  it('containsPoint accurately hit tests sticker bounds with and without rotation', () => {
    const layer = new StickerLayer({
      x: 200,
      y: 200,
      size: 100,
      rotation: 0
    });

    // Center should hit
    expect(layer.containsPoint(200, 200)).toBe(true);
    // Boundary inside (padding 10 means boundary is 200 +/- 60)
    expect(layer.containsPoint(250, 200)).toBe(true);
    // Outside boundary
    expect(layer.containsPoint(280, 200)).toBe(false);
    expect(layer.containsPoint(200, 280)).toBe(false);

    // Now test with 90 deg rotation
    layer.rotation = 90;
    expect(layer.containsPoint(200, 200)).toBe(true);
    expect(layer.containsPoint(200, 250)).toBe(true);
  });

  it('integrates StickerLayer into MemeCanvas correctly', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas, { width: 800, height: 800 });

    const sticker = new StickerLayer({
      stickerType: 'emoji',
      content: '🕶️',
      x: 400,
      y: 300,
      size: 80
    });

    meme.addLayer(sticker);
    expect(meme.layers.length).toBe(1);
    expect(meme.getActiveLayer().id).toBe(sticker.id);

    // Modify properties
    sticker.size = 140;
    sticker.rotation = 45;
    sticker.flipX = true;

    expect(sticker.size).toBe(140);
    expect(sticker.rotation).toBe(45);
    expect(sticker.flipX).toBe(true);
  });
});
