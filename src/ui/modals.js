import { downloadImage, downloadPDF, saveToStorage, getSavedMemes, deleteSavedMeme, loadSavedMeme } from '../export/exportManager.js';
import { showToast } from '../main.js';

export function setupModals(memeCanvas) {
  // Inject modal markup into body if not already present
  let modalWrapper = document.getElementById('modals-container');
  if (!modalWrapper) {
    modalWrapper = document.createElement('div');
    modalWrapper.id = 'modals-container';
    document.body.appendChild(modalWrapper);
  }

  modalWrapper.innerHTML = `
    <!-- Export Modal Backdrop -->
    <div class="modal-backdrop" id="export-modal" style="display: none;">
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-text);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Export & Save Meme</span>
          </h2>
          <button type="button" class="btn-modal-close" id="btn-close-export">&times;</button>
        </div>

        <div class="modal-body">
          <div class="export-preview-container">
            <img id="export-preview-img" alt="Meme Preview" />
          </div>

          <div class="control-group" style="margin-top: 16px;">
            <label class="control-label" for="export-filename">Meme Title / File Name</label>
            <input type="text" id="export-filename" class="form-input" value="my-awesome-meme" />
          </div>

          <div class="control-group">
            <label class="control-label" for="export-format">Export Format</label>
            <select id="export-format" class="form-select">
              <option value="png">PNG (Lossless High Quality Image)</option>
              <option value="jpeg">JPEG (Optimized Web Image)</option>
              <option value="pdf">PDF Document (Printable Poster)</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" id="btn-save-to-storage" class="btn" style="flex: 1;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
            <span>Save to My Memes</span>
          </button>
          <button type="button" id="btn-confirm-download" class="btn btn-primary" style="flex: 1;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Saved Memes Modal Backdrop -->
    <div class="modal-backdrop" id="saved-memes-modal" style="display: none;">
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <h2 class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-text);"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
            <span>My Saved Memes Gallery</span>
          </h2>
          <button type="button" class="btn-modal-close" id="btn-close-saved">&times;</button>
        </div>

        <div class="modal-body">
          <div class="saved-memes-grid" id="saved-memes-grid">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Export Modal Open
  const btnExport = document.getElementById('btn-export-dropdown');
  const exportModal = document.getElementById('export-modal');
  const closeExport = document.getElementById('btn-close-export');
  const previewImg = document.getElementById('export-preview-img');

  btnExport?.addEventListener('click', () => {
    previewImg.src = memeCanvas.toDataURL('image/jpeg', 0.85);
    exportModal.style.display = 'flex';
  });

  closeExport?.addEventListener('click', () => {
    exportModal.style.display = 'none';
  });

  exportModal?.addEventListener('click', (e) => {
    if (e.target === exportModal) exportModal.style.display = 'none';
  });

  // Export Download Action
  document.getElementById('btn-confirm-download')?.addEventListener('click', () => {
    const filenameInput = document.getElementById('export-filename');
    const formatSelect = document.getElementById('export-format');
    const filename = filenameInput.value.trim() || 'meme';
    const format = formatSelect.value;

    try {
      if (format === 'pdf') {
        downloadPDF(memeCanvas, `${filename}.pdf`);
        showToast('Downloaded PDF document');
      } else {
        downloadImage(memeCanvas, format, 0.95, filename);
        showToast(`Downloaded ${format.toUpperCase()} image`);
      }
      exportModal.style.display = 'none';
    } catch (err) {
      console.error(err);
      showToast('Failed to export file');
    }
  });

  // Save to LocalStorage Action
  document.getElementById('btn-save-to-storage')?.addEventListener('click', () => {
    const filenameInput = document.getElementById('export-filename');
    const title = filenameInput.value.trim() || 'Untitled Meme';

    try {
      saveToStorage(memeCanvas, title);
      showToast(`Saved "${title}" to My Memes!`);
      exportModal.style.display = 'none';
    } catch (err) {
      console.error(err);
      showToast('Failed to save to local storage');
    }
  });

  // Attach Saved Memes Modal Open
  const btnSaved = document.getElementById('btn-saved-memes');
  const savedModal = document.getElementById('saved-memes-modal');
  const closeSaved = document.getElementById('btn-close-saved');

  const openSavedModal = () => {
    renderSavedMemesList();
    savedModal.style.display = 'flex';
  };

  btnSaved?.addEventListener('click', openSavedModal);
  closeSaved?.addEventListener('click', () => savedModal.style.display = 'none');
  savedModal?.addEventListener('click', (e) => {
    if (e.target === savedModal) savedModal.style.display = 'none';
  });

  function renderSavedMemesList() {
    const grid = document.getElementById('saved-memes-grid');
    if (!grid) return;

    const list = getSavedMemes();
    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="color: var(--text-secondary); margin-bottom: 12px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
          </div>
          <h3 style="font-size: 0.95rem; font-weight: 600; color: var(--text-title); margin-bottom: 4px;">No Saved Memes Yet</h3>
          <p style="font-size: 0.78rem;">Click "Export" and choose "Save to My Memes" to store your creations here.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(item => `
      <div class="saved-meme-card" data-id="${item.id}">
        <div class="saved-meme-thumb">
          <img src="${item.thumbnail}" alt="${item.title}" />
        </div>
        <div class="saved-meme-info">
          <div class="saved-meme-title">${item.title}</div>
          <div class="saved-meme-date">${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="saved-meme-actions">
          <button type="button" class="btn btn-primary btn-load-meme" style="flex: 1; padding: 5px; font-size: 0.74rem;">
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-download-saved" style="padding: 5px 8px; font-size: 0.74rem;" title="Download PNG">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
          <button type="button" class="btn btn-danger btn-delete-saved" style="padding: 5px 8px; font-size: 0.74rem;" title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    // Attach card action listeners
    grid.querySelectorAll('.saved-meme-card').forEach(card => {
      const id = card.dataset.id;
      const memeItem = list.find(m => m.id === id);

      // Edit / Load
      card.querySelector('.btn-load-meme').addEventListener('click', async () => {
        try {
          await loadSavedMeme(id, memeCanvas);
          savedModal.style.display = 'none';
          showToast(`Loaded "${memeItem.title}"`);
        } catch (err) {
          console.error(err);
          showToast('Failed to load meme');
        }
      });

      // Quick Download
      card.querySelector('.btn-download-saved').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `${memeItem.title || 'meme'}.jpg`;
        link.href = memeItem.thumbnail;
        link.click();
        showToast('Downloaded saved meme');
      });

      // Delete
      card.querySelector('.btn-delete-saved').addEventListener('click', () => {
        deleteSavedMeme(id);
        renderSavedMemesList();
        showToast('Deleted saved meme');
      });
    });
  }
}
