import { describe, it, expect } from 'vitest';
import { MemeCanvas } from '../src/canvas/MemeCanvas.js';
import { TextLayer } from '../src/canvas/TextLayer.js';
import { StickerLayer } from '../src/canvas/StickerLayer.js';

describe('Phase 4: Layer Management and Visual Filters', () => {
  it('correctly reorders layers (up, down, front, back)', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);

    const l1 = new TextLayer({ id: 'l1', text: 'First' });
    const l2 = new TextLayer({ id: 'l2', text: 'Second' });
    const l3 = new TextLayer({ id: 'l3', text: 'Third' });

    meme.addLayer(l1);
    meme.addLayer(l2);
    meme.addLayer(l3);

    expect(meme.layers.map(l => l.id)).toEqual(['l1', 'l2', 'l3']);

    // Move l2 down
    meme.moveLayerDown('l2');
    expect(meme.layers.map(l => l.id)).toEqual(['l2', 'l1', 'l3']);

    // Move l2 up
    meme.moveLayerUp('l2');
    expect(meme.layers.map(l => l.id)).toEqual(['l1', 'l2', 'l3']);

    // Send l3 to back
    meme.sendToBack('l3');
    expect(meme.layers.map(l => l.id)).toEqual(['l3', 'l1', 'l2']);

    // Bring l3 to front
    meme.bringToFront('l3');
    expect(meme.layers.map(l => l.id)).toEqual(['l1', 'l2', 'l3']);
  });

  it('toggles layer visibility', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);
    const l = new TextLayer({ text: 'Visible Test' });
    meme.addLayer(l);

    expect(l.visible).toBe(true);
    meme.toggleLayerVisibility(l.id);
    expect(l.visible).toBe(false);
    meme.toggleLayerVisibility(l.id);
    expect(l.visible).toBe(true);
  });

  it('duplicates layers with position offset', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);
    const textLayer = new TextLayer({ text: 'Original', x: 200, y: 150 });
    meme.addLayer(textLayer);

    const dup = meme.duplicateLayer(textLayer.id);
    expect(dup).not.toBeNull();
    expect(dup.id).not.toBe(textLayer.id);
    expect(dup.text).toBe('Original');
    expect(dup.x).toBe(220);
    expect(dup.y).toBe(170);
    expect(meme.layers.length).toBe(2);
  });

  it('updates visual filters and applies presets', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);

    meme.setFilter('grayscale', 80);
    meme.setFilter('blur', 5);
    expect(meme.filters.grayscale).toBe(80);
    expect(meme.filters.blur).toBe(5);

    // Apply B&W preset
    meme.applyFilterPreset('bw');
    expect(meme.filters.grayscale).toBe(100);
    expect(meme.filters.contrast).toBe(130);

    // Apply Vintage preset
    meme.applyFilterPreset('vintage');
    expect(meme.filters.sepia).toBe(40);

    // Reset filters
    meme.resetFilters();
    expect(meme.filters.grayscale).toBe(0);
    expect(meme.filters.brightness).toBe(100);
    expect(meme.filters.blur).toBe(0);
  });
});
