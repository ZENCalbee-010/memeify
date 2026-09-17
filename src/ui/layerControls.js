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

      let icon = '✍️';
      let title = layer.text || 'Text Layer';
      if (layer.type === 'sticker') {
        icon = layer.stickerType === 'emoji' ? layer.content : '😎';
        title = layer.stickerType === 'emoji' ? `Emoji: ${layer.content}` : 'Sticker';
      }

      item.innerHTML = `
        <div class="layer-info" style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; cursor: pointer;">
          <span style="font-size: 1.1rem;">${icon}</span>
          <span class="layer-name" style="font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${title}
          </span>
        </div>

        <div class="layer-actions" style="display: flex; align-items: center; gap: 4px;">
          <!-- Visibility -->
          <button type="button" class="btn-layer-action btn-toggle-vis" title="${layer.visible ? 'Hide layer' : 'Show layer'}">
            ${layer.visible ? '👁️' : '🙈'}
          </button>
          <!-- Up -->
          <button type="button" class="btn-layer-action btn-move-up" title="Move Up" ${isTop ? 'disabled style="opacity: 0.25;"' : ''}>
            🔼
          </button>
          <!-- Down -->
          <button type="button" class="btn-layer-action btn-move-down" title="Move Down" ${isBottom ? 'disabled style="opacity: 0.25;"' : ''}>
            🔽
          </button>
          <!-- Delete -->
          <button type="button" class="btn-layer-action btn-del" title="Delete layer">
            🗑️
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
