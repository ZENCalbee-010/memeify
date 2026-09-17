import { MEME_EMOJIS, MEME_STICKERS, svgToStickerUrl } from '../stickers/stickerData.js';
import { StickerLayer } from '../canvas/StickerLayer.js';
import { showToast, switchTab } from '../main.js';

export function setupStickerPanel(memeCanvas) {
  const container = document.getElementById('tab-panel-stickers');
  if (!container) return;

  container.innerHTML = `
    <!-- Emoji Section -->
    <div class="sidebar-section">
      <h2 class="section-title">
        <span>Meme Emojis</span>
        <span style="font-size: 0.7rem; color: var(--accent-secondary); font-weight: 600;">One-click add</span>
      </h2>
      <div class="emoji-grid" id="emoji-picker-grid">
        ${MEME_EMOJIS.map(item => `
          <button type="button" class="emoji-btn" data-emoji="${item.emoji}" title="${item.name}">${item.emoji}</button>
        `).join('')}
      </div>
    </div>

    <!-- Vector Meme Stickers Section -->
    <div class="sidebar-section">
      <h2 class="section-title">
        <span>Meme Stickers</span>
        <span style="font-size: 0.7rem; color: var(--accent-secondary); font-weight: 600;">Vector Badges</span>
      </h2>
      <div class="stickers-grid" id="vector-stickers-grid">
        ${MEME_STICKERS.map(s => {
          const url = s.imageSrc || svgToStickerUrl(s.svg);
          return `
            <div class="sticker-card" data-sticker-id="${s.id}" data-url="${encodeURIComponent(url)}" title="${s.name}">
              <img src="${url}" alt="${s.name}" />
              <span>${s.name}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Custom Sticker Upload -->
    <div class="sidebar-section">
      <h2 class="section-title">Upload Custom Sticker</h2>
      <div class="upload-dropzone" id="sticker-upload-zone" style="padding: 14px;">
        <input type="file" id="sticker-file-input" class="file-input-hidden" accept="image/*" />
        <div class="upload-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        </div>
        <div class="upload-title" style="font-size: 0.8rem;">Upload PNG or SVG Sticker</div>
        <div class="upload-subtitle">Transparent backgrounds work best</div>
      </div>
    </div>

    <!-- Active Sticker Inspector -->
    <div class="sidebar-section" id="sticker-inspector-section" style="border-top: 1px solid var(--border-color); padding-top: 16px;">
      <h2 class="section-title">Selected Sticker Controls</h2>
      <div id="sticker-controls-container">
        <!-- Filled dynamically when a sticker is active -->
      </div>
    </div>
  `;

  // Attach Emoji click listeners
  container.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      const layer = new StickerLayer({
        stickerType: 'emoji',
        content: emoji,
        x: Math.round(memeCanvas.width / 2),
        y: Math.round(memeCanvas.height / 2),
        size: 120
      });
      memeCanvas.addLayer(layer);
      showToast(`Added ${emoji} sticker`);
    });
  });

  // Attach Sticker card click listeners
  container.querySelectorAll('.sticker-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = decodeURIComponent(card.dataset.url);
      const isSvg = url.startsWith('data:image/svg');
      const layer = new StickerLayer({
        stickerType: isSvg ? 'svg' : 'image',
        content: url,
        x: Math.round(memeCanvas.width / 2),
        y: Math.round(memeCanvas.height / 2),
        size: 140
      });
      memeCanvas.addLayer(layer);
      showToast(`Added ${card.title} sticker`);
    });
  });

  // Custom sticker upload
  const uploadZone = container.querySelector('#sticker-upload-zone');
  const fileInput = container.querySelector('#sticker-file-input');

  uploadZone?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const layer = new StickerLayer({
          stickerType: 'image',
          content: evt.target.result,
          x: Math.round(memeCanvas.width / 2),
          y: Math.round(memeCanvas.height / 2),
          size: 150
        });
        memeCanvas.addLayer(layer);
        showToast(`Uploaded sticker: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  });

  // Listen to layer selection
  const inspectorContainer = container.querySelector('#sticker-controls-container');
  renderEmptyStickerInspector(inspectorContainer);

  memeCanvas.onChange(({ type }) => {
    if (['active-layer-changed', 'layer-added', 'layer-removed'].includes(type)) {
      const active = memeCanvas.getActiveLayer();
      if (active && active.type === 'sticker') {
        renderStickerInspector(inspectorContainer, active, memeCanvas);
      } else if (!active || active.type !== 'sticker') {
        renderEmptyStickerInspector(inspectorContainer);
      }
    }
  });
}

function renderEmptyStickerInspector(container) {
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 18px 8px; color: var(--text-muted); font-size: 0.75rem;">
      Click any sticker on the canvas to edit its size, rotation, and opacity.
    </div>
  `;
}

function renderStickerInspector(container, layer, memeCanvas) {
  if (!container || !layer) return;

  container.innerHTML = `
    <div class="control-group">
      <div class="control-label">
        <label for="sticker-size">Size</label>
        <span class="control-val" id="sticker-size-val">${layer.size}px</span>
      </div>
      <input type="range" id="sticker-size" class="range-slider" min="30" max="360" value="${layer.size}" />
    </div>

    <div class="control-group">
      <div class="control-label">
        <label for="sticker-rotation">Rotation</label>
        <span class="control-val" id="sticker-rotation-val">${layer.rotation}°</span>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <input type="range" id="sticker-rotation" class="range-slider" min="-180" max="180" value="${layer.rotation}" style="flex: 1;" />
        <button type="button" id="btn-reset-rotation" class="btn" style="padding: 4px 8px; font-size: 0.75rem;" title="Reset Rotation">0°</button>
      </div>
    </div>

    <div class="control-group">
      <div class="control-label">
        <label for="sticker-opacity">Opacity</label>
        <span class="control-val" id="sticker-opacity-val">${Math.round(layer.opacity * 100)}%</span>
      </div>
      <input type="range" id="sticker-opacity" class="range-slider" min="10" max="100" value="${Math.round(layer.opacity * 100)}" />
    </div>

    <div style="display: flex; gap: 8px; margin-top: 10px;">
      <button type="button" id="btn-flip-x" class="btn ${layer.flipX ? 'btn-primary' : ''}" style="flex: 1; font-size: 0.76rem;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 20 4 16 8 12"/><polyline points="16 4 20 8 16 12"/><line x1="4" x2="20" y1="16" y2="16"/><line x1="20" x2="4" y1="8" y2="8"/></svg>
        <span>Flip Horizontal</span>
      </button>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
      <button type="button" id="btn-dup-sticker" class="btn" style="flex: 1; font-size: 0.78rem;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span>Duplicate</span>
      </button>
      <button type="button" id="btn-del-sticker" class="btn btn-danger" style="flex: 1; font-size: 0.78rem;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        <span>Delete</span>
      </button>
    </div>
  `;

  // Listeners
  const sizeSlider = container.querySelector('#sticker-size');
  const sizeVal = container.querySelector('#sticker-size-val');
  sizeSlider?.addEventListener('input', (e) => {
    layer.size = parseInt(e.target.value, 10);
    if (sizeVal) sizeVal.textContent = `${layer.size}px`;
    memeCanvas.render();
  });

  const rotSlider = container.querySelector('#sticker-rotation');
  const rotVal = container.querySelector('#sticker-rotation-val');
  rotSlider?.addEventListener('input', (e) => {
    layer.rotation = parseInt(e.target.value, 10);
    if (rotVal) rotVal.textContent = `${layer.rotation}°`;
    memeCanvas.render();
  });

  container.querySelector('#btn-reset-rotation')?.addEventListener('click', () => {
    layer.rotation = 0;
    if (rotSlider) rotSlider.value = 0;
    if (rotVal) rotVal.textContent = `0°`;
    memeCanvas.render();
  });

  const opacitySlider = container.querySelector('#sticker-opacity');
  const opacityVal = container.querySelector('#sticker-opacity-val');
  opacitySlider?.addEventListener('input', (e) => {
    layer.opacity = parseInt(e.target.value, 10) / 100;
    if (opacityVal) opacityVal.textContent = `${parseInt(e.target.value, 10)}%`;
    memeCanvas.render();
  });

  const flipBtn = container.querySelector('#btn-flip-x');
  flipBtn?.addEventListener('click', () => {
    layer.flipX = !layer.flipX;
    flipBtn.classList.toggle('btn-primary', layer.flipX);
    memeCanvas.render();
  });

  // Duplicate
  container.querySelector('#btn-dup-sticker')?.addEventListener('click', () => {
    const dup = new StickerLayer({
      stickerType: layer.stickerType,
      content: layer.content,
      x: layer.x + 25,
      y: layer.y + 25,
      size: layer.size,
      rotation: layer.rotation,
      opacity: layer.opacity,
      flipX: layer.flipX
    });
    memeCanvas.addLayer(dup);
    showToast('Duplicated sticker');
  });

  // Delete
  container.querySelector('#btn-del-sticker')?.addEventListener('click', () => {
    memeCanvas.removeLayer(layer.id);
    showToast('Deleted sticker');
  });
}
