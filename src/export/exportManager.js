import { jsPDF } from 'jspdf';

const STORAGE_KEY = 'memecraft_saved_memes';

/**
 * Trigger file download from data URL or blob
 */
function triggerDownload(url, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export canvas as PNG or JPEG image
 */
export function downloadImage(memeCanvas, format = 'png', quality = 0.95, filename = 'meme') {
  const mimeType = format === 'jpeg' || format === 'jpg' ? 'image/jpeg' : 'image/png';
  const ext = format === 'jpeg' || format === 'jpg' ? 'jpg' : 'png';
  const dataUrl = memeCanvas.toDataURL(mimeType, quality);
  triggerDownload(dataUrl, `${filename}.${ext}`);
}

/**
 * Export canvas as high quality PDF poster
 */
export function downloadPDF(memeCanvas, filename = 'meme.pdf') {
  const dataUrl = memeCanvas.toDataURL('image/jpeg', 0.95);
  const w = memeCanvas.width;
  const h = memeCanvas.height;

  // Determine orientation
  const orientation = w >= h ? 'landscape' : 'portrait';
  
  // Create jsPDF instance using point units
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [w, h]
  });

  pdf.addImage(dataUrl, 'JPEG', 0, 0, w, h);
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/**
 * LocalStorage Management for Saved Memes Gallery
 */
export function getSavedMemes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read from localStorage', err);
    return [];
  }
}

export function saveToStorage(memeCanvas, title = 'Untitled Meme') {
  try {
    const saved = getSavedMemes();
    const thumbnail = memeCanvas.toDataURL('image/jpeg', 0.7);
    const item = {
      id: `meme-${Date.now()}`,
      title: title || 'Untitled Meme',
      createdAt: new Date().toISOString(),
      thumbnail,
      state: memeCanvas.serialize()
    };

    // Prepend to list
    saved.unshift(item);
    // Keep max 20 saved memes
    if (saved.length > 20) {
      saved.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return item;
  } catch (err) {
    console.error('Failed to save to localStorage', err);
    throw err;
  }
}

export function deleteSavedMeme(id) {
  try {
    const saved = getSavedMemes().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return saved;
  } catch (err) {
    console.error('Failed to delete meme from localStorage', err);
    return [];
  }
}

export async function loadSavedMeme(id, memeCanvas) {
  const saved = getSavedMemes();
  const meme = saved.find(m => m.id === id);
  if (meme && meme.state) {
    await memeCanvas.loadState(meme.state);
    return meme;
  }
  throw new Error('Meme not found');
}
