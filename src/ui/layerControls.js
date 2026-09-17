import { showToast, switchTab } from '../main.js';

export function setupLayerPanel(memeCanvas) {
  const container = document.getElementById('tab-panel-layers');
  if (!container) return;

  function renderLayerList() {
    container.innerHTML = `
      <div class="sidebar-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h2 class="section-title" style="margin-bottom: 0;">
            <span>Canvas Layers</span>
            <span style="color: var(--accent-secondary); font-size: 0.75rem;">${memeCanvas.layers.length} items</span>
          </h2>
          <div style="display: flex; gap: 4px;">
            <button id="btn-layers-front" class="btn" style="padding: 4px 8px; font-size: 0.7rem;" title="Bring selected to front">To Top</button>
            <button id="btn-layers-back" class="btn" style="padding: 4px 8px; font-size: 0.7rem;" title="Send selected to back">To Bottom</button>
          </div>
        </div>

        <div class="layers-stack" id="layers-stack-list">
          <!-- Rendered layers -->
        </div>
      </div>
    `;

    const listEl = container.querySelector('#layers-stack-list');
    if (!listEl) return;

    if (memeCanvas.layers.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
          No layers added yet. Add text or stickers from the sidebar!
        </div>
      `;
      return;
    }

    // Render layers in reverse order (topmost layer on top of the list)
    for (let i = memeCanvas.layers.length - 1; i >= 0; i--) {
      const layer = memeCanvas.layers[i];
      const isSelected = layer.id === memeCanvas.activeLayerId;
      const isTop = i === memeCanvas.layers.length - 1;
      const isBottom = i === 0;

      const item = document.createElement('div');
      item.className = `layer-item ${isSelected ? 'active' : ''} ${!layer.visible ? 'hidden-layer' : ''}`;
      item.dataset.layerId = layer.id;

      let iconHtml = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-text);"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>`;
      let title = layer.text || 'Text Layer';
      if (layer.type === 'sticker') {
        iconHtml = layer.stickerType === 'emoji' ? `<span style="font-size: 1.1rem;">${layer.content}</span>` : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-text);"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>`;
        title = layer.stickerType === 'emoji' ? `Emoji: ${layer.content}` : 'Sticker';
      }

      item.innerHTML = `
        <div class="layer-info" style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: center; width: 22px;">${iconHtml}</div>
          <span class="layer-name" style="font-size: 0.78rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${title}
          </span>
        </div>

        <div class="layer-actions" style="display: flex; align-items: center; gap: 3px;">
          <!-- Visibility -->
          <button type="button" class="btn-layer-action btn-toggle-vis" title="${layer.visible ? 'Hide layer' : 'Show layer'}">
            ${layer.visible ? 
              `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>` : 
              `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`}
          </button>
          <!-- Up -->
          <button type="button" class="btn-layer-action btn-move-up" title="Move Up" ${isTop ? 'disabled style="opacity: 0.25;"' : ''}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <!-- Down -->
          <button type="button" class="btn-layer-action btn-move-down" title="Move Down" ${isBottom ? 'disabled style="opacity: 0.25;"' : ''}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <!-- Delete -->
          <button type="button" class="btn-layer-action btn-del" title="Delete layer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      // Click row to select layer
      item.querySelector('.layer-info').addEventListener('click', () => {
        memeCanvas.setActiveLayer(layer.id);
        if (layer.type === 'text') switchTab('text');
        else if (layer.type === 'sticker') switchTab('stickers');
      });

      // Visibility
      item.querySelector('.btn-toggle-vis').addEventListener('click', (e) => {
        e.stopPropagation();
        memeCanvas.toggleLayerVisibility(layer.id);
      });

      // Move Up
      item.querySelector('.btn-move-up')?.addEventListener('click', (e) => {
        e.stopPropagation();
        memeCanvas.moveLayerUp(layer.id);
      });

      // Move Down
      item.querySelector('.btn-move-down')?.addEventListener('click', (e) => {
        e.stopPropagation();
        memeCanvas.moveLayerDown(layer.id);
      });

      // Delete
      item.querySelector('.btn-del').addEventListener('click', (e) => {
        e.stopPropagation();
        memeCanvas.removeLayer(layer.id);
        showToast('Deleted layer');
      });

      listEl.appendChild(item);
    }

    // Bring to front & send to back
    container.querySelector('#btn-layers-front')?.addEventListener('click', () => {
      if (memeCanvas.activeLayerId) {
        memeCanvas.bringToFront(memeCanvas.activeLayerId);
        showToast('Brought layer to top');
      }
    });

    container.querySelector('#btn-layers-back')?.addEventListener('click', () => {
      if (memeCanvas.activeLayerId) {
        memeCanvas.sendToBack(memeCanvas.activeLayerId);
        showToast('Sent layer to bottom');
      }
    });
  }

  // Initial render
  renderLayerList();

  // Listen for canvas changes
  memeCanvas.onChange(({ type }) => {
    if ([
      'layer-added',
      'layer-removed',
      'layers-reordered',
      'active-layer-changed',
      'layer-visibility-changed'
    ].includes(type)) {
      renderLayerList();
    }
  });
}
