import { TextLayer } from '../canvas/TextLayer.js';
import { showToast } from '../main.js';

export function setupTextPanel(memeCanvas) {
  const container = document.getElementById('text-layer-controls-container');
  const btnAddTop = document.getElementById('btn-add-top-text');
  const btnAddBottom = document.getElementById('btn-add-bottom-text');
  const btnAddCustom = document.getElementById('btn-add-custom-text');

  // Add Top Text
  btnAddTop?.addEventListener('click', () => {
    const curTemplate = memeCanvas.currentTemplateId;
    const defaultText = memeCanvas.currentTemplateId ? 'TOP TEXT' : 'HEADLINE TEXT';
    
    const layer = new TextLayer({
      text: defaultText,
      x: Math.round(memeCanvas.width / 2),
      y: 90,
      fontSize: Math.round(memeCanvas.width * 0.068),
      textAlign: 'center',
      fontFamily: 'Impact',
      strokeWidth: 5,
      uppercase: true
    });
    memeCanvas.addLayer(layer);
    renderControls(container, layer, memeCanvas);
    showToast('Added Top Text layer');
  });

  // Add Bottom Text
  btnAddBottom?.addEventListener('click', () => {
    const layer = new TextLayer({
      text: 'BOTTOM TEXT',
      x: Math.round(memeCanvas.width / 2),
      y: memeCanvas.height - 50,
      fontSize: Math.round(memeCanvas.width * 0.068),
      textAlign: 'center',
      fontFamily: 'Impact',
      strokeWidth: 5,
      uppercase: true
    });
    memeCanvas.addLayer(layer);
    renderControls(container, layer, memeCanvas);
    showToast('Added Bottom Text layer');
  });

  // Add Custom Floating Text
  btnAddCustom?.addEventListener('click', () => {
    const layer = new TextLayer({
      text: 'NEW TEXT',
      x: Math.round(memeCanvas.width / 2),
      y: Math.round(memeCanvas.height / 2),
      fontSize: 42,
      textAlign: 'center',
      fontFamily: 'Montserrat',
      strokeWidth: 3,
      uppercase: false
    });
    memeCanvas.addLayer(layer);
    renderControls(container, layer, memeCanvas);
    showToast('Added Custom Text layer');
  });

  // Listen to layer selection changes on canvas
  memeCanvas.onChange(({ type }) => {
    if (['active-layer-changed', 'layer-added', 'layer-removed'].includes(type)) {
      const active = memeCanvas.getActiveLayer();
      if (active && active.type === 'text') {
        renderControls(container, active, memeCanvas);
      } else if (!active) {
        renderEmptyState(container);
      }
    }
  });
}

function renderEmptyState(container) {
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 28px 16px; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
      <div style="color: var(--text-secondary); margin-bottom: 8px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
      </div>
      <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-title); margin-bottom: 4px;">No Text Layer Selected</div>
      <div style="font-size: 0.74rem; line-height: 1.4;">Click any text on the canvas to edit, or use the buttons above to add new text.</div>
    </div>
  `;
}

export function renderControls(container, layer, memeCanvas) {
  if (!container || !layer) return;

  const fontFamilies = [
    { value: 'Impact', label: 'Impact (Classic Meme)' },
    { value: 'Montserrat', label: 'Montserrat (Bold Clean)' },
    { value: 'Space Grotesk', label: 'Space Grotesk (Tech)' },
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Arial', label: 'Arial (Neutral)' },
    { value: 'Comic Sans MS', label: 'Comic Sans (Playful)' }
  ];

  const colorPresets = ['#ffffff', '#facc15', '#38bdf8', '#ef4444', '#10b981', '#000000'];

  container.innerHTML = `
    <div class="control-group">
      <label class="control-label" for="text-layer-content">
        <span>Text Content</span>
        <span class="control-val">${layer.getDisplayText().length} chars</span>
      </label>
      <textarea id="text-layer-content" class="form-textarea" rows="2" placeholder="Enter meme text here...">${layer.text}</textarea>
    </div>

    <div class="control-group">
      <label class="control-label" for="text-font-family">Font Family</label>
      <select id="text-font-family" class="form-select">
        ${fontFamilies.map(f => `<option value="${f.value}" ${layer.fontFamily === f.value ? 'selected' : ''}>${f.label}</option>`).join('')}
      </select>
    </div>

    <div class="control-group">
      <div class="control-label">
        <label for="text-font-size">Font Size</label>
        <span class="control-val" id="text-font-size-val">${layer.fontSize}px</span>
      </div>
      <input type="range" id="text-font-size" class="range-slider" min="16" max="140" value="${layer.fontSize}" />
    </div>

    <!-- Color & Fill -->
    <div class="control-group">
      <label class="control-label">Text Color</label>
      <div class="color-picker-row">
        <div class="color-input-wrapper">
          <input type="color" id="text-fill-color" class="color-input" value="${layer.fillColor}" />
        </div>
        <div class="swatch-group">
          ${colorPresets.map(color => `
            <div class="swatch" data-color="${color}" style="background-color: ${color};" title="${color}"></div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Outline Stroke -->
    <div class="control-group">
      <div class="control-label">
        <label for="text-stroke-width">Outline Width</label>
        <span class="control-val" id="text-stroke-width-val">${layer.strokeWidth}px</span>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <div class="color-input-wrapper">
          <input type="color" id="text-stroke-color" class="color-input" value="${layer.strokeColor}" />
        </div>
        <input type="range" id="text-stroke-width" class="range-slider" min="0" max="16" value="${layer.strokeWidth}" style="flex: 1;" />
      </div>
    </div>

    <!-- Alignment & Uppercase -->
    <div class="control-group">
      <label class="control-label">Alignment & Case</label>
      <div style="display: flex; gap: 8px;">
        <div class="btn-group" style="flex: 2;">
          <button type="button" class="btn-group-item ${layer.textAlign === 'left' ? 'active' : ''}" data-align="left">Left</button>
          <button type="button" class="btn-group-item ${layer.textAlign === 'center' ? 'active' : ''}" data-align="center">Center</button>
          <button type="button" class="btn-group-item ${layer.textAlign === 'right' ? 'active' : ''}" data-align="right">Right</button>
        </div>
        <button type="button" id="btn-toggle-case" class="btn ${layer.uppercase ? 'btn-primary' : ''}" style="flex: 1; font-size: 0.75rem; padding: 6px;">
          ${layer.uppercase ? 'ALL CAPS' : 'Normal'}
        </button>
      </div>
    </div>

    <!-- Opacity & Shadow -->
    <div class="control-group">
      <div class="control-label">
        <label for="text-opacity">Opacity</label>
        <span class="control-val" id="text-opacity-val">${Math.round(layer.opacity * 100)}%</span>
      </div>
      <input type="range" id="text-opacity" class="range-slider" min="10" max="100" value="${Math.round(layer.opacity * 100)}" />
    </div>

    <div class="toggle-row" id="row-toggle-shadow">
      <span class="toggle-label">Glow / Drop Shadow</span>
      <input type="checkbox" id="text-shadow-toggle" class="checkbox-custom" ${layer.shadow ? 'checked' : ''} />
    </div>

    <!-- Quick Positions -->
    <div class="control-group" style="margin-top: 14px;">
      <label class="control-label">Snap Position</label>
      <div class="btn-group">
        <button type="button" class="btn-group-item" id="btn-snap-top">Top</button>
        <button type="button" class="btn-group-item" id="btn-snap-center">Center</button>
        <button type="button" class="btn-group-item" id="btn-snap-bottom">Bottom</button>
      </div>
    </div>

    <!-- Actions: Duplicate / Delete -->
    <div style="display: flex; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
      <button type="button" id="btn-dup-layer" class="btn" style="flex: 1; font-size: 0.78rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span>Duplicate</span>
      </button>
      <button type="button" id="btn-del-layer" class="btn btn-danger" style="flex: 1; font-size: 0.78rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        <span>Delete</span>
      </button>
    </div>
  `;

  // Attach dynamic event listeners
  const textInput = container.querySelector('#text-layer-content');
  textInput?.addEventListener('input', (e) => {
    layer.text = e.target.value;
    memeCanvas.render();
  });

  const fontSelect = container.querySelector('#text-font-family');
  fontSelect?.addEventListener('change', (e) => {
    layer.fontFamily = e.target.value;
    memeCanvas.render();
  });

  const fontSizeSlider = container.querySelector('#text-font-size');
  const fontSizeVal = container.querySelector('#text-font-size-val');
  fontSizeSlider?.addEventListener('input', (e) => {
    layer.fontSize = parseInt(e.target.value, 10);
    if (fontSizeVal) fontSizeVal.textContent = `${layer.fontSize}px`;
    memeCanvas.render();
  });

  const fillColorInput = container.querySelector('#text-fill-color');
  fillColorInput?.addEventListener('input', (e) => {
    layer.fillColor = e.target.value;
    memeCanvas.render();
  });

  container.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      layer.fillColor = swatch.dataset.color;
      if (fillColorInput) fillColorInput.value = layer.fillColor;
      memeCanvas.render();
    });
  });

  const strokeColorInput = container.querySelector('#text-stroke-color');
  strokeColorInput?.addEventListener('input', (e) => {
    layer.strokeColor = e.target.value;
    memeCanvas.render();
  });

  const strokeWidthSlider = container.querySelector('#text-stroke-width');
  const strokeWidthVal = container.querySelector('#text-stroke-width-val');
  strokeWidthSlider?.addEventListener('input', (e) => {
    layer.strokeWidth = parseInt(e.target.value, 10);
    if (strokeWidthVal) strokeWidthVal.textContent = `${layer.strokeWidth}px`;
    memeCanvas.render();
  });

  container.querySelectorAll('[data-align]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      layer.textAlign = btn.dataset.align;
      memeCanvas.render();
    });
  });

  const btnToggleCase = container.querySelector('#btn-toggle-case');
  btnToggleCase?.addEventListener('click', () => {
    layer.uppercase = !layer.uppercase;
    btnToggleCase.textContent = layer.uppercase ? 'ALL CAPS' : 'Normal';
    btnToggleCase.classList.toggle('btn-primary', layer.uppercase);
    memeCanvas.render();
  });

  const opacitySlider = container.querySelector('#text-opacity');
  const opacityVal = container.querySelector('#text-opacity-val');
  opacitySlider?.addEventListener('input', (e) => {
    layer.opacity = parseInt(e.target.value, 10) / 100;
    if (opacityVal) opacityVal.textContent = `${parseInt(e.target.value, 10)}%`;
    memeCanvas.render();
  });

  const shadowToggle = container.querySelector('#text-shadow-toggle');
  shadowToggle?.addEventListener('change', (e) => {
    layer.shadow = e.target.checked;
    memeCanvas.render();
  });

  // Snapping
  container.querySelector('#btn-snap-top')?.addEventListener('click', () => {
    layer.x = Math.round(memeCanvas.width / 2);
    layer.y = 90;
    layer.textAlign = 'center';
    memeCanvas.render();
  });

  container.querySelector('#btn-snap-center')?.addEventListener('click', () => {
    layer.x = Math.round(memeCanvas.width / 2);
    layer.y = Math.round(memeCanvas.height / 2);
    layer.textAlign = 'center';
    memeCanvas.render();
  });

  container.querySelector('#btn-snap-bottom')?.addEventListener('click', () => {
    layer.x = Math.round(memeCanvas.width / 2);
    layer.y = memeCanvas.height - 50;
    layer.textAlign = 'center';
    memeCanvas.render();
  });

  // Duplicate
  container.querySelector('#btn-dup-layer')?.addEventListener('click', () => {
    const dup = new TextLayer({
      text: layer.text,
      x: layer.x + 20,
      y: layer.y + 20,
      fontFamily: layer.fontFamily,
      fontSize: layer.fontSize,
      fontWeight: layer.fontWeight,
      fillColor: layer.fillColor,
      strokeColor: layer.strokeColor,
      strokeWidth: layer.strokeWidth,
      textAlign: layer.textAlign,
      opacity: layer.opacity,
      uppercase: layer.uppercase,
      shadow: layer.shadow
    });
    memeCanvas.addLayer(dup);
    showToast('Duplicated text layer');
  });

  // Delete
  container.querySelector('#btn-del-layer')?.addEventListener('click', () => {
    memeCanvas.removeLayer(layer.id);
    showToast('Deleted text layer');
  });
}
