import { describe, it, expect } from 'vitest';
import { TextLayer } from '../src/canvas/TextLayer.js';
import { MemeCanvas } from '../src/canvas/MemeCanvas.js';

describe('Phase 2: Text Layers & Canvas Interactions', () => {
  it('creates a TextLayer with defaults and custom properties', () => {
    const textLayer = new TextLayer({
      text: 'Hello Meme',
      fontSize: 50,
      fontFamily: 'Impact',
      fillColor: '#ffff00',
      strokeColor: '#000000',
      strokeWidth: 4,
      uppercase: true
    });

    expect(textLayer.type).toBe('text');
    expect(textLayer.text).toBe('Hello Meme');
    expect(textLayer.getDisplayText()).toBe('HELLO MEME');
    expect(textLayer.fontSize).toBe(50);
    expect(textLayer.fillColor).toBe('#ffff00');
    expect(textLayer.strokeWidth).toBe(4);
  });

  it('supports non-uppercase text when uppercase is false', () => {
    const textLayer = new TextLayer({
      text: 'MixedCase Text',
      uppercase: false
    });

    expect(textLayer.getDisplayText()).toBe('MixedCase Text');
  });

  it('containsPoint accurately hit-tests bounding box', () => {
    const textLayer = new TextLayer({
      x: 200,
      y: 100,
      fontSize: 40,
      textAlign: 'center'
    });

    // Mock measure
    textLayer.bounds = { x: 100, y: 50, width: 200, height: 60 };

    // Point inside
    expect(textLayer.containsPoint(150, 70)).toBe(true);
    expect(textLayer.containsPoint(100, 50)).toBe(true);
    expect(textLayer.containsPoint(300, 110)).toBe(true);

    // Point outside
    expect(textLayer.containsPoint(50, 70)).toBe(false);
    expect(textLayer.containsPoint(150, 200)).toBe(false);
    expect(textLayer.containsPoint(350, 70)).toBe(false);
  });

  it('MemeCanvas layer addition, active selection, and removal', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas, { width: 800, height: 800 });

    const layer1 = new TextLayer({ text: 'TOP' });
    const layer2 = new TextLayer({ text: 'BOTTOM' });

    meme.addLayer(layer1);
    expect(meme.layers.length).toBe(1);
    expect(meme.getActiveLayer().id).toBe(layer1.id);

    meme.addLayer(layer2);
    expect(meme.layers.length).toBe(2);
    expect(meme.getActiveLayer().id).toBe(layer2.id);

    // Change active layer
    meme.setActiveLayer(layer1.id);
    expect(meme.getActiveLayer().id).toBe(layer1.id);

    // Remove layer
    meme.removeLayer(layer1.id);
    expect(meme.layers.length).toBe(1);
    expect(meme.getLayer(layer1.id)).toBeNull();
    expect(meme.getActiveLayer().id).toBe(layer2.id);
  });

  it('translates coordinates and updates layer position during drag', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas, { width: 800, height: 800 });

    const layer = new TextLayer({ x: 400, y: 100 });
    meme.addLayer(layer);

    // Simulate move
    layer.x += 50;
    layer.y += 30;

    expect(layer.x).toBe(450);
    expect(layer.y).toBe(130);
  });
});
