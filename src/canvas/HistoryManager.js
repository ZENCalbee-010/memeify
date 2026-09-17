export class HistoryManager {
  constructor(memeCanvas, maxHistory = 30) {
    this.memeCanvas = memeCanvas;
    this.maxHistory = maxHistory;
    this.undoStack = [];
    this.redoStack = [];
    this.isApplying = false;

    // Listen to changes to auto-record snapshots (debounced or on significant events)
    this.setupListeners();
    this.setupShortcuts();
  }

  setupListeners() {
    this.memeCanvas.onChange(({ type }) => {
      // Don't record during undo/redo or continuous dragging
      if (this.isApplying || type === 'layer-moved' || type === 'render') return;

      if ([
        'layer-added',
        'layer-removed',
        'layers-reordered',
        'layer-drag-end',
        'filters-changed',
        'aspect-ratio',
        'image-loaded'
      ].includes(type)) {
        this.pushCurrentState();
      }
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Avoid triggering when user is typing in textarea or input
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.redo();
      }
    });
  }

  snapshot() {
    return this.memeCanvas.serialize();
  }

  pushCurrentState() {
    if (this.isApplying) return;

    const snap = this.snapshot();
    const last = this.undoStack[this.undoStack.length - 1];
    if (last && JSON.stringify(last) === JSON.stringify(snap)) {
      return; // Ignore duplicate state
    }

    this.undoStack.push(snap);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.notifyButtons();
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  async undo() {
    if (!this.canUndo()) return false;

    this.isApplying = true;
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);

    const prevState = this.undoStack[this.undoStack.length - 1];
    await this.memeCanvas.loadState(prevState);

    this.isApplying = false;
    this.notifyButtons();
    return true;
  }

  async redo() {
    if (!this.canRedo()) return false;

    this.isApplying = true;
    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);

    await this.memeCanvas.loadState(nextState);

    this.isApplying = false;
    this.notifyButtons();
    return true;
  }

  notifyButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');

    if (btnUndo) btnUndo.disabled = !this.canUndo();
    if (btnRedo) btnRedo.disabled = !this.canRedo();
  }
}
