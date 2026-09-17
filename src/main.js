import { MemeCanvas } from './canvas/MemeCanvas.js';
import { BUILT_IN_TEMPLATES, svgToDataUrl, getTemplateById } from './templates/templateData.js';
import { setupTextPanel } from './ui/textControls.js';
import { TextLayer } from './canvas/TextLayer.js';

// Global state
let memeCanvas = null;

// Helper to display toast notifications
export function showToast(message, duration = 2500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Populate Built-in Templates
function initTemplateGallery() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;

  grid.innerHTML = '';

  BUILT_IN_TEMPLATES.forEach((tmpl) => {
    const card = document.createElement('div');
    card.className = `template-card ${tmpl.id === 'drake' ? 'active' : ''}`;
    card.dataset.templateId = tmpl.id;
    card.id = `template-card-${tmpl.id}`;

    const dataUrl = svgToDataUrl(tmpl.svg);

    card.innerHTML = `
      <div class="template-thumbnail">
        <img src="${dataUrl}" alt="${tmpl.name}" loading="lazy" />
      </div>
      <div class="template-name">${tmpl.name}</div>
    `;

    card.addEventListener('click', async () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      try {
        await memeCanvas.loadTemplate(tmpl.id);
        updateViewportBadges();

        // If no text layers exist, populate default template texts
        if (memeCanvas.layers.filter(l => l.type === 'text').length === 0) {
          applyTemplateTexts(tmpl);
        }

        showToast(`Loaded template: ${tmpl.name}`);
      } catch (err) {
        console.error(err);
        showToast('Failed to load template');
      }
    });

    grid.appendChild(card);
  });

  const countBadge = document.getElementById('template-count-badge');
  if (countBadge) {
    countBadge.textContent = `${BUILT_IN_TEMPLATES.length} templates`;
  }
}

// Update Viewport Info Badges
function updateViewportBadges() {
  const dimBadge = document.getElementById('canvas-dim-badge');
  const tmplBadge = document.getElementById('canvas-template-badge');

  if (dimBadge && memeCanvas) {
    dimBadge.textContent = `${memeCanvas.width} × ${memeCanvas.height} px`;
  }

  if (tmplBadge && memeCanvas) {
    const cur = BUILT_IN_TEMPLATES.find(t => t.id === memeCanvas.currentTemplateId);
    tmplBadge.textContent = cur ? cur.name : (memeCanvas.baseImageSrc ? 'Custom Upload' : 'Custom Canvas');
  }
}

// Setup Upload Dropzone
function setupUploadDropzone() {
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('image-file-input');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  });

  // Drag and drop support
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    } else {
      showToast('Please upload a valid image file');
    }
  });

  // Allow dragging onto whole canvas wrapper as well!
  const canvasWrapper = document.getElementById('canvas-wrapper');
  if (canvasWrapper) {
    canvasWrapper.addEventListener('dragover', (e) => e.preventDefault());
    canvasWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    });
  }
}

async function handleImageFile(file) {
  try {
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
    await memeCanvas.loadImageFromFile(file);
    updateViewportBadges();
    showToast(`Uploaded: ${file.name}`);
  } catch (err) {
    console.error(err);
    showToast('Failed to read image file');
  }
}

// Setup Aspect Ratio Buttons
function setupAspectRatios() {
  const container = document.getElementById('aspect-ratio-controls');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.aspect-btn');
    if (!btn) return;

    container.querySelectorAll('.aspect-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const ratio = btn.dataset.ratio;
    memeCanvas.setAspectRatio(ratio);
    updateViewportBadges();
    showToast(`Aspect ratio set to ${ratio}`);
  });
}

// Setup Tab Switching
function setupTabs() {
  const tabsNav = document.getElementById('sidebar-tabs');
  if (!tabsNav) return;

  tabsNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const tabKey = btn.dataset.tab;

    // Toggle nav active state
    tabsNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Toggle tab panels
    document.querySelectorAll('.tab-content').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-panel-${tabKey}`);
    });
  });
}

export function switchTab(tabKey) {
  const tabsNav = document.getElementById('sidebar-tabs');
  if (!tabsNav) return;

  tabsNav.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabKey);
  });

  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-panel-${tabKey}`);
  });
}

export function applyTemplateTexts(tmpl) {
  if (!memeCanvas) return;
  
  if (tmpl.defaultTopText) {
    memeCanvas.addLayer(new TextLayer({
      text: tmpl.defaultTopText,
      x: Math.round(memeCanvas.width / 2),
      y: 90,
      fontSize: Math.round(memeCanvas.width * 0.065),
      textAlign: 'center',
      fontFamily: 'Impact',
      strokeWidth: 5,
      uppercase: true
    }));
  }

  if (tmpl.defaultBottomText) {
    memeCanvas.addLayer(new TextLayer({
      text: tmpl.defaultBottomText,
      x: Math.round(memeCanvas.width / 2),
      y: memeCanvas.height - 50,
      fontSize: Math.round(memeCanvas.width * 0.065),
      textAlign: 'center',
      fontFamily: 'Impact',
      strokeWidth: 5,
      uppercase: true
    }));
  }
}

// Initialize Application
async function init() {
  const canvasEl = document.getElementById('meme-canvas');
  if (!canvasEl) return;

  memeCanvas = new MemeCanvas(canvasEl, { width: 800, height: 800 });

  // Expose on window for testing and subagents
  window.memeCanvas = memeCanvas;

  setupTabs();
  initTemplateGallery();
  setupUploadDropzone();
  setupAspectRatios();
  setupTextPanel(memeCanvas);

  // When a text layer is selected by clicking on canvas, switch to Text tab
  memeCanvas.onChange(({ type }) => {
    if (type === 'active-layer-changed') {
      const active = memeCanvas.getActiveLayer();
      if (active && active.type === 'text') {
        switchTab('text');
      }
    }
  });

  // Load default template: Drake Hotline Bling
  try {
    const tmpl = await memeCanvas.loadTemplate('drake');
    updateViewportBadges();
    applyTemplateTexts(tmpl);
  } catch (err) {
    console.error('Failed to load initial template', err);
  }

  // Reset button
  const resetBtn = document.getElementById('btn-reset-canvas');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      memeCanvas.layers = [];
      const tmpl = await memeCanvas.loadTemplate('drake');
      document.querySelectorAll('.template-card').forEach(c => {
        c.classList.toggle('active', c.dataset.templateId === 'drake');
      });
      applyTemplateTexts(tmpl);
      updateViewportBadges();
      showToast('Canvas reset to default template');
    });
  }

  console.log('MemeCraft Studio initialized.');
}

window.addEventListener('DOMContentLoaded', init);
