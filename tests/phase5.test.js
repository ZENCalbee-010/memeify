import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemeCanvas } from '../src/canvas/MemeCanvas.js';
import { TextLayer } from '../src/canvas/TextLayer.js';
import { StickerLayer } from '../src/canvas/StickerLayer.js';
import { HistoryManager } from '../src/canvas/HistoryManager.js';
import { saveToStorage, getSavedMemes, deleteSavedMeme, loadSavedMeme } from '../src/export/exportManager.js';

describe('Phase 5: Undo/Redo, Serialization, and LocalStorage Export', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('serializes and restores complete canvas state including text and stickers', async () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas, { width: 800, height: 800 });

    const text = new TextLayer({ text: 'TOP TEXT', x: 400, y: 100, fontSize: 44 });
    const sticker = new StickerLayer({ stickerType: 'emoji', content: '👑', x: 300, y: 200, size: 80 });

    meme.addLayer(text);
    meme.addLayer(sticker);
    meme.setFilter('grayscale', 50);

    const snapshot = meme.serialize();
    expect(snapshot.layers.length).toBe(2);
    expect(snapshot.filters.grayscale).toBe(50);
    expect(snapshot.layers[0].text).toBe('TOP TEXT');
    expect(snapshot.layers[1].content).toBe('👑');

    // Create a new canvas and restore state
    const canvas2 = document.createElement('canvas');
    const meme2 = new MemeCanvas(canvas2);
    await meme2.loadState(snapshot);

    expect(meme2.layers.length).toBe(2);
    expect(meme2.layers[0].type).toBe('text');
    expect(meme2.layers[0].text).toBe('TOP TEXT');
    expect(meme2.layers[1].type).toBe('sticker');
    expect(meme2.layers[1].content).toBe('👑');
    expect(meme2.filters.grayscale).toBe(50);
  });

  it('HistoryManager handles push, undo, and redo transitions', async () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);
    const history = new HistoryManager(meme);

    // Initial state
    history.pushCurrentState();
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);

    // Add layer
    const layer1 = new TextLayer({ text: 'Step 1' });
    meme.addLayer(layer1);
    history.pushCurrentState();

    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);
    expect(meme.layers.length).toBe(1);

    // Add another layer
    const layer2 = new TextLayer({ text: 'Step 2' });
    meme.addLayer(layer2);
    history.pushCurrentState();

    expect(meme.layers.length).toBe(2);

    // Undo step 2
    await history.undo();
    expect(meme.layers.length).toBe(1);
    expect(meme.layers[0].text).toBe('Step 1');
    expect(history.canRedo()).toBe(true);

    // Redo step 2
    await history.redo();
    expect(meme.layers.length).toBe(2);
    expect(meme.layers[1].text).toBe('Step 2');
  });

  it('saves memes to localStorage, retrieves, and deletes them', async () => {
    const canvas = document.createElement('canvas');
    const meme = new MemeCanvas(canvas);
    meme.addLayer(new TextLayer({ text: 'Saved Meme Test' }));

    // Mock toDataURL for jsdom/happy-dom
    meme.canvas.toDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,mockthumb');

    const item = saveToStorage(meme, 'Cool Meme Title');
    expect(item.id).toBeDefined();
    expect(item.title).toBe('Cool Meme Title');

    const list = getSavedMemes();
    expect(list.length).toBe(1);
    expect(list[0].title).toBe('Cool Meme Title');

    // Load from storage
    const restored = await loadSavedMeme(item.id, meme);
    expect(restored.title).toBe('Cool Meme Title');

    // Delete from storage
    const remaining = deleteSavedMeme(item.id);
    expect(remaining.length).toBe(0);
    expect(getSavedMemes().length).toBe(0);
  });
});
