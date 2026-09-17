import { showToast } from '../main.js';

export function setupFilterPanel(memeCanvas) {
  const container = document.getElementById('tab-panel-filters');
  if (!container) return;

  function renderFilterControls() {
    const f = memeCanvas.filters;

    container.innerHTML = `
      <!-- Presets -->
      <div class="sidebar-section">
        <h2 class="section-title">
          <span>Filter Presets</span>
          <button type="button" id="btn-reset-filters" class="btn" style="font-size: 0.7rem; padding: 2px 8px;">Reset</button>
        </h2>
        <div class="filter-presets-grid" id="filter-presets-grid">
          <button type="button" class="btn filter-preset-btn" data-preset="none">Default</button>
          <button type="button" class="btn filter-preset-btn" data-preset="bw">B&W Dramatic</button>
          <button type="button" class="btn filter-preset-btn" data-preset="vintage">Vintage</button>
          <button type="button" class="btn filter-preset-btn" data-preset="cyber">Cyberpunk</button>
          <button type="button" class="btn filter-preset-btn" data-preset="soft">Dreamy Soft</button>
          <button type="button" class="btn filter-preset-btn" data-preset="invert">Invert</button>
        </div>
      </div>

      <!-- Fine Adjustments -->
      <div class="sidebar-section">
        <h2 class="section-title">Fine Adjustments</h2>

        <!-- Brightness -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-brightness">Brightness</label>
            <span class="control-val" id="filter-brightness-val">${f.brightness}%</span>
          </div>
          <input type="range" id="filter-brightness" class="range-slider" min="20" max="200" value="${f.brightness}" />
        </div>

        <!-- Contrast -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-contrast">Contrast</label>
            <span class="control-val" id="filter-contrast-val">${f.contrast}%</span>
          </div>
          <input type="range" id="filter-contrast" class="range-slider" min="20" max="200" value="${f.contrast}" />
        </div>

        <!-- Grayscale -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-grayscale">Grayscale</label>
            <span class="control-val" id="filter-grayscale-val">${f.grayscale}%</span>
          </div>
          <input type="range" id="filter-grayscale" class="range-slider" min="0" max="100" value="${f.grayscale}" />
        </div>

        <!-- Blur -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-blur">Blur</label>
            <span class="control-val" id="filter-blur-val">${f.blur}px</span>
          </div>
          <input type="range" id="filter-blur" class="range-slider" min="0" max="15" value="${f.blur}" />
        </div>

        <!-- Sepia -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-sepia">Sepia</label>
            <span class="control-val" id="filter-sepia-val">${f.sepia}%</span>
          </div>
          <input type="range" id="filter-sepia" class="range-slider" min="0" max="100" value="${f.sepia}" />
        </div>

        <!-- Saturation -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-saturation">Saturation</label>
            <span class="control-val" id="filter-saturation-val">${f.saturation}%</span>
          </div>
          <input type="range" id="filter-saturation" class="range-slider" min="0" max="200" value="${f.saturation}" />
        </div>

        <!-- Invert -->
        <div class="control-group">
          <div class="control-label">
            <label for="filter-invert">Invert Colors</label>
            <span class="control-val" id="filter-invert-val">${f.invert}%</span>
          </div>
          <input type="range" id="filter-invert" class="range-slider" min="0" max="100" value="${f.invert}" />
        </div>
      </div>
    `;

    // Presets
    container.querySelectorAll('.filter-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        memeCanvas.applyFilterPreset(btn.dataset.preset);
        syncFilterInputs();
        showToast(`Applied filter: ${btn.textContent}`);
      });
    });

    // Reset button
    container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
      memeCanvas.resetFilters();
      syncFilterInputs();
      showToast('Filters reset to default');
    });

    // Slider inputs
    const setupSlider = (id, prop, unit) => {
      const slider = container.querySelector(`#filter-${id}`);
      const val = container.querySelector(`#filter-${id}-val`);
      slider?.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        if (val) val.textContent = `${v}${unit}`;
        memeCanvas.setFilter(prop, v);
      });
    };

    setupSlider('brightness', 'brightness', '%');
    setupSlider('contrast', 'contrast', '%');
    setupSlider('grayscale', 'grayscale', '%');
    setupSlider('blur', 'blur', 'px');
    setupSlider('sepia', 'sepia', '%');
    setupSlider('saturation', 'saturation', '%');
    setupSlider('invert', 'invert', '%');
  }

  function syncFilterInputs() {
    const f = memeCanvas.filters;
    const update = (id, v, unit) => {
      const el = container.querySelector(`#filter-${id}`);
      const val = container.querySelector(`#filter-${id}-val`);
      if (el) el.value = v;
      if (val) val.textContent = `${v}${unit}`;
    };

    update('brightness', f.brightness, '%');
    update('contrast', f.contrast, '%');
    update('grayscale', f.grayscale, '%');
    update('blur', f.blur, 'px');
    update('sepia', f.sepia, '%');
    update('saturation', f.saturation, '%');
    update('invert', f.invert, '%');
  }

  // Initial render
  renderFilterControls();

  // Listen to filter changes from outside (e.g. undo/redo)
  memeCanvas.onChange(({ type }) => {
    if (type === 'filters-changed') {
      syncFilterInputs();
    }
  });
}
