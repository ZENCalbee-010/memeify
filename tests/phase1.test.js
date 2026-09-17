import { describe, it, expect, beforeEach } from 'vitest';
import { BUILT_IN_TEMPLATES, getTemplateById, svgToDataUrl } from '../src/templates/templateData.js';
import { MemeCanvas } from '../src/canvas/MemeCanvas.js';

describe('Phase 1: Core Canvas and Templates', () => {
  it('should have built-in templates with valid SVG and properties', () => {
    expect(BUILT_IN_TEMPLATES.length).toBeGreaterThanOrEqual(5);

    BUILT_IN_TEMPLATES.forEach(t => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.width).toBeGreaterThan(0);
      expect(t.height).toBeGreaterThan(0);
      expect(t.svg).toContain('<svg');
      expect(t.svg).toContain('</svg>');
    });
  });

  it('getTemplateById returns the correct template', () => {
    const drake = getTemplateById('drake');
    expect(drake.id).toBe('drake');
    expect(drake.name).toBe('Drake Hotline Bling');

    const twoButtons = getTemplateById('two-buttons');
    expect(twoButtons.id).toBe('two-buttons');
  });

  it('svgToDataUrl converts svg to valid data url', () => {
    const dataUrl = svgToDataUrl('<svg viewBox="0 0 10 10"></svg>');
    expect(dataUrl.startsWith('data:image/svg+xml')).toBe(true);
  });

  it('MemeCanvas initializes with correct dimensions and context', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas, { width: 800, height: 600 });

    expect(meme.width).toBe(800);
    expect(meme.height).toBe(600);
    expect(meme.aspectRatio).toBe('original');
    expect(meme.layers).toEqual([]);
    expect(meme.filters.brightness).toBe(100);
    expect(meme.filters.contrast).toBe(100);
  });

  it('MemeCanvas handles aspect ratio switches', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas, { width: 800, height: 600 });
    
    // Mock base image
    meme.baseImage = { naturalWidth: 800, naturalHeight: 600, width: 800, height: 600 };

    meme.setAspectRatio('1:1');
    expect(meme.width).toBe(800);
    expect(meme.height).toBe(800);

    meme.setAspectRatio('16:9');
    expect(meme.width).toBe(800);
    expect(meme.height).toBe(450);
  });

  it('MemeCanvas generates filter string properly', () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);
    meme.filters.grayscale = 50;
    meme.filters.blur = 3;

    const filterStr = meme.getFilterString();
    expect(filterStr).toContain('grayscale(50%)');
    expect(filterStr).toContain('blur(3px)');
  });
});
