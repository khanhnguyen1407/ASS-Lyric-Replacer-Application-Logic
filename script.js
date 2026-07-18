/* =========================================================
   ASS Lyric Replacer — Application Logic
   Pure vanilla JS, no framework, no backend.
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. CONSTANTS & DOM REFERENCES
   --------------------------------------------------------- */

// Allowed base file names (without extension), case-insensitive
const ALLOWED_NAMES = ['phienam', 'tiengviet', 'tiengtrung'];

const dom = {
  dropzoneAss: document.getElementById('dropzone-ass'),
  dropzoneTxt: document.getElementById('dropzone-txt'),
  inputAss: document.getElementById('input-ass'),
  inputTxt: document.getElementById('input-txt'),

  metaAssName: document.getElementById('meta-ass-name'),
  metaAssSize: document.getElementById('meta-ass-size'),
  metaAssType: document.getElementById('meta-ass-type'),
  removeAss: document.getElementById('remove-ass'),

  metaTxtName: document.getElementById('meta-txt-name'),
  metaTxtSize: document.getElementById('meta-txt-size'),
  metaTxtType: document.getElementById('meta-txt-type'),
  removeTxt: document.getElementById('remove-txt'),

  convertWrap: document.getElementById('convert-wrap'),
  btnConvert: document.getElementById('btn-convert'),

  processingSection: document.getElementById('processing-section'),
  progressFill: document.getElementById('progress-fill'),
  progressPercent: document.getElementById('progress-percent'),

  resultSection: document.getElementById('result-section'),
  resultCount: document.getElementById('result-count'),
  btnDownload: document.getElementById('btn-download'),
  btnReset: document.getElementById('btn-reset'),

  step1: document.getElementById('step-1'),
  step2: document.getElementById('step-2'),
  step3: document.getElementById('step-3'),

  modalOverlay: document.getElementById('modal-overlay'),
  modalTitle: document.getElementById('modal-title'),
  modalDesc: document.getElementById('modal-desc'),
  modalClose: document.getElementById('modal-close'),

  toastContainer: document.getElementById('toast-container'),
};

// Application state
const state = {
  assFile: null,      // File object
  txtFile: null,       // File object
  outputBlobUrl: null, // generated download URL
  outputFileName: null // e.g. "phienam.ass"
};

/* ---------------------------------------------------------
   2. UTILITY FUNCTIONS
   --------------------------------------------------------- */

/** Format bytes into a human-readable string. */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Extract base name (without extension) from a filename, lowercased. */
function getBaseName(fileName) {
  const dotIndex = fileName.lastIndexOf('.');
  const base = dotIndex === -1 ? fileName : fileName.slice(0, dotIndex);
  return base.trim().toLowerCase();
}

/** Get extension (without dot), lowercased. */
function getExtension(fileName) {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex === -1 ? '' : fileName.slice(dotIndex + 1).toLowerCase();
}

/** Show a toast notification. type: 'success' | 'error' | 'info' */
function showToast(message, type = 'info', duration = 3600) {
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-exclamation',
    info: 'fa-solid fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${message}</span>`;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/** Show the error modal with a custom title/description. */
function showError(title, description) {
  dom.modalTitle.textContent = title;
  dom.modalDesc.textContent = description;
  dom.modalOverlay.classList.add('visible');
}

function hideError() {
  dom.modalOverlay.classList.remove('visible');
}

dom.modalClose.addEventListener('click', hideError);
dom.modalOverlay.addEventListener('click', (e) => {
  if (e.target === dom.modalOverlay) hideError();
});

/** Attach ripple animation to a button on click. */
function attachRipple(button) {
  button.addEventListener('click', (e) => {
    const rect = button.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
}
document.querySelectorAll('.ripple').forEach(attachRipple);

/* ---------------------------------------------------------
   3. FILE UPLOAD HANDLING (click + drag & drop)
   --------------------------------------------------------- */

/**
 * Wire a dropzone element with click-to-browse and drag & drop support.
 * @param {HTMLElement} zone - the dropzone container
 * @param {HTMLInputElement} input - the hidden file input
 * @param {'ass'|'txt'} kind - which slot this zone controls
 */
function setupDropzone(zone, input, kind) {
  // Click to open file browser (but not when clicking the remove button)
  zone.addEventListener('click', (e) => {
    if (e.target.closest('.meta-remove')) return;
    input.click();
  });

  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      input.click();
    }
  });

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      handleFileSelected(input.files[0], kind);
    }
  });

  // Drag & drop events
  ['dragenter', 'dragover'].forEach((evt) => {
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add('drag-active');
    });
  });

  ['dragleave', 'dragend'].forEach((evt) => {
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove('drag-active');
    });
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    zone.classList.remove('drag-active');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFileSelected(file, kind);
  });
}

/**
 * Validate and store a selected/dropped file.
 */
function handleFileSelected(file, kind) {
  const expectedExt = kind === 'ass' ? 'ass' : 'txt';
  const ext = getExtension(file.name);
  const base = getBaseName(file.name);

  if (ext !== expectedExt) {
    showError(
      'Sai định dạng file',
      `File bạn chọn là ".${ext || '?'}" nhưng hệ thống yêu cầu file ".${expectedExt}".\nVui lòng chọn đúng loại file.`
    );
    return;
  }

  if (!ALLOWED_NAMES.includes(base)) {
    showError(
      'Tên file không được hỗ trợ',
      `Tên file "${file.name}" không nằm trong danh sách được phép.\n\nCác tên hợp lệ cho file .${expectedExt}:\n` +
      ALLOWED_NAMES.map((n) => `• ${n}.${expectedExt}`).join('\n')
    );
    return;
  }

  if (kind === 'ass') {
    state.assFile = file;
    renderFileMeta('ass', file);
    showToast(`Đã tải lên ${file.name}`, 'success', 2400);
  } else {
    state.txtFile = file;
    renderFileMeta('txt', file);
    showToast(`Đã tải lên ${file.name}`, 'success', 2400);
  }

  updateConvertButtonVisibility();
}

/** Update the UI meta block (name / size / type) for a given slot. */
function renderFileMeta(kind, file) {
  const zone = kind === 'ass' ? dom.dropzoneAss : dom.dropzoneTxt;
  const nameEl = kind === 'ass' ? dom.metaAssName : dom.metaTxtName;
  const sizeEl = kind === 'ass' ? dom.metaAssSize : dom.metaTxtSize;
  const typeEl = kind === 'ass' ? dom.metaAssType : dom.metaTxtType;

  nameEl.textContent = file.name;
  sizeEl.textContent = formatBytes(file.size);
  typeEl.textContent = kind === 'ass' ? 'ASS Subtitle' : 'Lyric Text';

  zone.classList.add('has-file');
}

/** Remove a previously selected file and reset that slot's UI. */
function clearFile(kind) {
  const zone = kind === 'ass' ? dom.dropzoneAss : dom.dropzoneTxt;
  const input = kind === 'ass' ? dom.inputAss : dom.inputTxt;

  if (kind === 'ass') state.assFile = null;
  else state.txtFile = null;

  input.value = '';
  zone.classList.remove('has-file');
  updateConvertButtonVisibility();
}

dom.removeAss.addEventListener('click', (e) => {
  e.stopPropagation();
  clearFile('ass');
});
dom.removeTxt.addEventListener('click', (e) => {
  e.stopPropagation();
  clearFile('txt');
});

setupDropzone(dom.dropzoneAss, dom.inputAss, 'ass');
setupDropzone(dom.dropzoneTxt, dom.inputTxt, 'txt');

/** Show/enable the Convert button only when both files are present. */
function updateConvertButtonVisibility() {
  const ready = Boolean(state.assFile && state.txtFile);
  dom.convertWrap.classList.toggle('visible', ready);
  dom.btnConvert.disabled = !ready;
}

/* ---------------------------------------------------------
   4. ASS PARSING & LYRIC REPLACEMENT
   --------------------------------------------------------- */

/**
 * Read a File object as UTF-8 text.
 * @returns {Promise<string>}
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Split raw ASS text into individual lines while preserving the
 * original line-ending style (CRLF or LF) so the exported file
 * matches typical Aegisub output.
 */
function splitLines(rawText) {
  const usesCRLF = rawText.includes('\r\n');
  const lines = rawText.split(/\r\n|\n/);
  return { lines, lineEnding: usesCRLF ? '\r\n' : '\n' };
}

/**
 * Replace the Text field of a single "Dialogue:" line with newText,
 * while preserving every other field exactly as-is.
 *
 * ASS Dialogue format:
 * Dialogue: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
 * There are exactly 9 commas before the Text field begins, and the
 * Text field itself may legally contain commas — so we must only
 * split on the first 9 commas.
 */
function replaceDialogueText(line, newText) {
  // Separate the "Dialogue:" prefix from the rest
  const prefixMatch = line.match(/^(Dialogue:\s*)/i);
  const prefix = prefixMatch[1];
  const rest = line.slice(prefix.length);

  let commaCount = 0;
  let splitIndex = -1;

  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === ',') {
      commaCount++;
      if (commaCount === 9) {
        splitIndex = i;
        break;
      }
    }
  }

  // If the line is malformed (fewer than 9 commas), leave it untouched.
  if (splitIndex === -1) return line;

  const fieldsPart = rest.slice(0, splitIndex + 1); // includes trailing comma
  return prefix + fieldsPart + newText;
}

/**
 * Parse the lyric TXT content into an array of non-empty lines.
 * Blank / whitespace-only lines are skipped per spec.
 */
function parseLyricLines(rawText) {
  const { lines } = splitLines(rawText);

  return lines
    .map((l) => l.replace(/\r$/, "").trim())

    // Bỏ dòng rỗng
    .filter((l) => l.length > 0)

    // Bỏ các dòng chỉ chứa [ ... ], 【 ... 】 hoặc （ ... ）
    .filter((l) => !/^(?:\[.*\]|【.*】|（.*）)$/.test(l));
}

/**
 * Core conversion routine.
 * @returns {{ output: string, count: number }}
 * @throws {Error} with a user-facing message if line counts mismatch
 */
function buildOutputAss(assRawText, txtRawText) {
  const { lines: assLines, lineEnding } = splitLines(assRawText);
  const lyricLines = parseLyricLines(txtRawText);

  // Identify indices of Dialogue lines (in original order)
  const dialogueIndices = [];
  assLines.forEach((line, idx) => {
    if (/^Dialogue:/i.test(line.trim())) {
      dialogueIndices.push(idx);
    }
  });

  if (dialogueIndices.length === 0) {
    throw new Error(
      'Không tìm thấy dòng "Dialogue:" nào trong file .ass. Vui lòng kiểm tra lại file phụ đề.'
    );
  }

  if (dialogueIndices.length !== lyricLines.length) {
    throw new Error(
      `Số dòng không khớp:\n` +
      `• File .ass có ${dialogueIndices.length} dòng Dialogue\n` +
      `• File .txt có ${lyricLines.length} dòng lời bài hát\n\n` +
      `Vui lòng kiểm tra và đảm bảo hai file có cùng số dòng.`
    );
  }

  // Perform replacement, preserving every other line untouched
  const outLines = assLines.slice();
  dialogueIndices.forEach((lineIdx, i) => {
    outLines[lineIdx] = replaceDialogueText(assLines[lineIdx], lyricLines[i]);
  });

  return {
    output: outLines.join(lineEnding),
    count: dialogueIndices.length,
  };
}

/* ---------------------------------------------------------
   5. CONVERT FLOW (progress bar + spinner simulation)
   --------------------------------------------------------- */

function setStep(stepNumber) {
  const steps = [dom.step1, dom.step2, dom.step3];
  steps.forEach((el, idx) => {
    const n = idx + 1;
    el.classList.remove('active', 'done');
    if (n < stepNumber) el.classList.add('done');
    else if (n === stepNumber) el.classList.add('active');
  });
}

/** Animate the progress bar from 0 -> 100 over roughly `duration` ms. */
function animateProgress(duration) {
  return new Promise((resolve) => {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      dom.progressFill.style.width = pct + '%';
      dom.progressPercent.textContent = pct + '%';
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(tick);
  });
}

dom.btnConvert.addEventListener('click', async () => {
  if (!state.assFile || !state.txtFile) return;

  // Reset progress UI
  dom.progressFill.style.width = '0%';
  dom.progressPercent.textContent = '0%';
  dom.convertWrap.classList.remove('visible');
  dom.processingSection.classList.add('visible');
  dom.resultSection.classList.remove('visible');
  setStep(2);

  try {
    // Kick off the visual progress animation and the real file reads in parallel
    const progressPromise = animateProgress(1100);
    const [assText, txtText] = await Promise.all([
      readFileAsText(state.assFile),
      readFileAsText(state.txtFile),
    ]);

    // Ensure the progress bar has a chance to visually complete
    await progressPromise;

    const { output, count } = buildOutputAss(assText, txtText);

    // Build the downloadable blob (UTF-8)
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    if (state.outputBlobUrl) URL.revokeObjectURL(state.outputBlobUrl);
    state.outputBlobUrl = URL.createObjectURL(blob);

    // Output filename derived from the uploaded TXT file name
    const txtBase = getBaseName(state.txtFile.name);
    state.outputFileName = `${txtBase}.ass`;

    // Reveal result
    dom.processingSection.classList.remove('visible');
    dom.resultCount.textContent = String(count);
    dom.resultSection.classList.add('visible');
    setStep(3);

    showToast('Chuyển đổi thành công!', 'success');
  } catch (err) {
    dom.processingSection.classList.remove('visible');
    dom.convertWrap.classList.add('visible');
    setStep(1);
    showError('Không thể chuyển đổi', err.message || 'Đã xảy ra lỗi không xác định.');
    showToast('Chuyển đổi thất bại', 'error');
  }
});

/* ---------------------------------------------------------
   6. DOWNLOAD & RESET
   --------------------------------------------------------- */

dom.btnDownload.addEventListener('click', () => {
  if (!state.outputBlobUrl || !state.outputFileName) return;
  const a = document.createElement('a');
  a.href = state.outputBlobUrl;
  a.download = state.outputFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast(`Đang tải xuống ${state.outputFileName}`, 'info', 2600);
});

dom.btnReset.addEventListener('click', () => {
  clearFile('ass');
  clearFile('txt');
  dom.resultSection.classList.remove('visible');
  dom.progressFill.style.width = '0%';
  dom.progressPercent.textContent = '0%';
  setStep(1);
  if (state.outputBlobUrl) {
    URL.revokeObjectURL(state.outputBlobUrl);
    state.outputBlobUrl = null;
  }
  state.outputFileName = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------------------------------------------------------
   7. INIT
   --------------------------------------------------------- */
attachRipple(dom.btnDownload);
attachRipple(dom.btnReset);
updateConvertButtonVisibility();
setStep(1);
