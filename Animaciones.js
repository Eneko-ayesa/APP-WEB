/* ═══════════════════════════════════════════════
   ADAPTIVE CARD BUILDER
   Toolbar global — funciona en todos los campos
   ═══════════════════════════════════════════════ */

const canalSelect = document.getElementById("canal");
const emailField = document.getElementById("emailField");
const teamsRecipientField = document.getElementById("teamsRecipientField");
const editor = document.getElementById("editor");
const tarjetaForm = document.getElementById("tarjetaForm");
const globalToolbar = document.getElementById("globalToolbar");
const gtbInner = document.getElementById("gtbInner");

// ── IMAGE SIZE STORE ──────────────────────────
// maps block element → { width, headerHeight }
const imgSizes = new WeakMap();

// ── SVG ICONS ─────────────────────────────────
const I = {
  bold: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6zm0 8h9a4 4 0 0 1 0 8H6z"/></svg>`,
  italic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
  underline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
  strike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6c-.5-1.5-2-2.5-4-2.5-2.8 0-4 1.5-4 3 0 1 .4 1.8 1.2 2.3M8 18c.6 1.2 2 2 4 2 3 0 4.5-1.5 4.5-3"/></svg>`,
  ul: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  ol: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1V3L3.5 4M3 14h2v.5H3.5v1H5V17H3M4 21l1-1.5H3" stroke-width="1.5"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  alignL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>`,
  alignC: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  alignR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  emoji: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4.95"/></svg>`,
  colorA: `<svg viewBox="0 0 24 24"><text x="4" y="18" font-size="15" font-weight="800" font-family="sans-serif" fill="currentColor">A</text></svg>`,
  pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
};

const EMOJIS = ["😊", "😂", "🔥", "✨", "👍", "❤️", "🚀", "🎉", "💡", "⚠️", "✅", "❌",
  "📢", "📌", "📎", "🔗", "💬", "🗓️", "📊", "📈", "🎯", "🏆", "💪", "👏",
  "🌟", "💎", "⚡", "🔒", "📧", "📱", "💻", "🛠️", "⚙️", "📝", "🖼️", "🔔"];

// ═══════════════════════════════════════════════
// CONVERT HEADER INPUTS → CONTENTEDITABLE
// titulo, subtitulo mantienen su ID pero pasan a div
// ═══════════════════════════════════════════════
function convertirInputAEditable(inputEl, claseExtra = "") {
  const div = document.createElement("div");
  div.contentEditable = "true";
  div.dataset.placeholder = inputEl.placeholder || "";
  div.dataset.name = inputEl.name || inputEl.id || "";
  div.id = inputEl.id;
  div.className = inputEl.className + " rich-field " + claseExtra;
  div.setAttribute("spellcheck", "true");
  // copy inline styles / data attrs if any
  inputEl.parentNode.replaceChild(div, inputEl);
  registrarCampoEditable(div);
  return div;
}

// ── CONVERT HEADER FIELDS ON LOAD ─────────────
// We wait for DOM then replace them
function initHeaderFields() {
  ["titulo", "subtitulo"].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.tagName === "INPUT") convertirInputAEditable(el);
  });
}

// ═══════════════════════════════════════════════
// BUILD GLOBAL TOOLBAR
// ═══════════════════════════════════════════════
gtbInner.innerHTML = `
  <select class="btb-select gtb-font" title="Tipografía">
    <option value="'Metropolis','DM Sans',sans-serif">Metropolis</option>
    <option value="'DM Sans',sans-serif">DM Sans</option>
    <option value="'Lora',serif">Lora</option>
    <option value="'Syne',sans-serif">Syne</option>
    <option value="'DM Mono',monospace">Mono</option>
    <option value="Georgia,serif">Georgia</option>
  </select>
  <div class="btb-size-wrap">
    <button type="button" class="btb-fs gtb-fs-down" title="Reducir">−</button>
    <input  class="btb-size gtb-size-input" type="number" value="14" min="8" max="72">
    <button type="button" class="btb-fs gtb-fs-up" title="Aumentar">+</button>
  </div>
  <div class="btb-sep"></div>
  <button type="button" class="btb-btn" data-cmd="bold"          title="Negrita (Ctrl+B)">${I.bold}</button>
  <button type="button" class="btb-btn" data-cmd="italic"        title="Cursiva (Ctrl+I)">${I.italic}</button>
  <button type="button" class="btb-btn" data-cmd="underline"     title="Subrayado (Ctrl+U)">${I.underline}</button>
  <button type="button" class="btb-btn" data-cmd="strikeThrough" title="Tachado">${I.strike}</button>
  <div class="btb-sep"></div>
  <div class="btb-color-wrap">
    <button type="button" class="btb-color-btn" title="Color texto">
      ${I.colorA}<span class="btb-cdot gtb-text-cdot" style="background:#111"></span>
    </button>
    <input class="btb-color-input gtb-text-color" type="color" value="#111111">
  </div>
  <div class="btb-color-wrap">
    <button type="button" class="btb-color-btn" title="Resaltar texto">
      ${I.pen}<span class="btb-cdot gtb-hl-cdot" style="background:#fef08a"></span>
    </button>
    <input class="btb-color-input gtb-hl-color" type="color" value="#fef08a">
  </div>

  <!-- Yako brand color palette -->
  <div class="btb-sep"></div>
  <div class="yako-palette" title="Paleta de colores Yako">
    <button type="button" class="palette-swatch" data-color="#0000D0" title="Azul eléctrico" style="background:#0000D0"></button>
    <button type="button" class="palette-swatch" data-color="#FF3184" title="Magenta" style="background:#FF3184"></button>
    <button type="button" class="palette-swatch" data-color="#000000" title="Negro" style="background:#000000"></button>
    <button type="button" class="palette-swatch" data-color="#FFFFFF" title="Blanco" style="background:#FFFFFF;border:1px solid #c8c6c4"></button>
    <button type="button" class="palette-swatch" data-color="#323130" title="Gris oscuro" style="background:#323130"></button>
    <button type="button" class="palette-swatch" data-color="#605e5c" title="Gris medio" style="background:#605e5c"></button>
  </div>
  <div class="btb-sep"></div>
  <div class="yako-palette" id="yakoPalette">
    <button type="button" class="palette-swatch" data-color="#0000D0" title="Azul eléctrico Yako" style="background:#0000D0"></button>
    <button type="button" class="palette-swatch" data-color="#FF3184" title="Magenta Yako" style="background:#FF3184"></button>
    <button type="button" class="palette-swatch" data-color="#000000" title="Negro" style="background:#000000"></button>
    <button type="button" class="palette-swatch white-swatch" data-color="#FFFFFF" title="Blanco" style="background:#FFFFFF"></button>
    <button type="button" class="palette-swatch" data-color="#323130" title="Gris oscuro" style="background:#323130"></button>
    <button type="button" class="palette-swatch" data-color="#605e5c" title="Gris medio" style="background:#605e5c"></button>
  </div>
  <div class="btb-sep"></div>
  <button type="button" class="btb-btn" data-cmd="insertUnorderedList" title="Lista">${I.ul}</button>
  <button type="button" class="btb-btn" data-cmd="insertOrderedList"   title="Lista numerada">${I.ol}</button>
  <button type="button" class="btb-btn" data-cmd="formatBlock" data-val="blockquote" title="Cita">${I.quote}</button>
  <div class="btb-sep"></div>
  <button type="button" class="btb-btn" data-cmd="justifyLeft"   title="Izquierda">${I.alignL}</button>
  <button type="button" class="btb-btn" data-cmd="justifyCenter" title="Centro">${I.alignC}</button>
  <button type="button" class="btb-btn" data-cmd="justifyRight"  title="Derecha">${I.alignR}</button>
  <div class="btb-sep"></div>
  <button type="button" class="btb-btn gtb-link-btn" title="Enlace (Ctrl+K)">${I.link}</button>
  <div class="btb-emoji-wrap">
    <button type="button" class="btb-btn gtb-emoji-btn" title="Emojis">${I.emoji}</button>
    <div class="btb-emoji-panel gtb-emoji-panel"></div>
  </div>
  <div class="btb-sep"></div>
  <button type="button" class="btb-btn" data-cmd="undo" title="Deshacer">${I.undo}</button>
  <button type="button" class="btb-btn" data-cmd="redo" title="Rehacer">${I.redo}</button>
`;

globalToolbar.classList.add("tb-idle");

// ── LINK DIALOG ───────────────────────────────
const linkDialog = document.createElement("div");
linkDialog.className = "btb-link-dialog";
linkDialog.innerHTML = `
  <div class="btb-link-box">
    <h3>🔗 Insertar enlace</h3>
    <input type="url" id="globalLinkInput" placeholder="https://…">
    <div class="btb-link-actions">
      <button class="btb-btn-cancel" id="globalLinkCancel">Cancelar</button>
      <button class="btb-btn-ok"     id="globalLinkOk">Insertar</button>
    </div>
  </div>
`;
document.body.appendChild(linkDialog);

// ── FLOAT MINI TOOLBAR ────────────────────────
const floatTb = document.createElement("div");
floatTb.className = "btb-float";
floatTb.innerHTML = `
  <button class="btb-btn" data-cmd="bold">${I.bold}</button>
  <button class="btb-btn" data-cmd="italic">${I.italic}</button>
  <button class="btb-btn" data-cmd="underline">${I.underline}</button>
  <button class="btb-btn" data-cmd="strikeThrough">${I.strike}</button>
  <div class="btb-sep"></div>
  <button class="btb-btn" id="floatLinkBtn" title="Enlace">${I.link}</button>
`;
document.body.appendChild(floatTb);

let activeEditor = null;
let savedRange = null;

// ═══════════════════════════════════════════════
// REGISTER ANY CONTENTEDITABLE AS EDITABLE FIELD
// ═══════════════════════════════════════════════
function registrarCampoEditable(area) {
  area.addEventListener("focus", () => {
    activeEditor = area;
    globalToolbar.classList.remove("tb-idle");
    updateActiveStates();
    // update hint label
    const nombre = area.dataset.name || area.dataset.placeholder || "campo";
    const hint = globalToolbar.querySelector(".gtb-hint span.gtb-field-name");
    if (hint) hint.textContent = nombre;
  });

  area.addEventListener("blur", () => {
    setTimeout(() => {
      const focused = document.activeElement;
      const inToolbar = gtbInner.contains(focused) || linkDialog.contains(focused);
      if (!inToolbar) globalToolbar.classList.add("tb-idle");
    }, 150);
  });

  area.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") { e.preventDefault(); document.execCommand("bold"); updateActiveStates(); }
      if (e.key === "i") { e.preventDefault(); document.execCommand("italic"); updateActiveStates(); }
      if (e.key === "u") { e.preventDefault(); document.execCommand("underline"); updateActiveStates(); }
      if (e.key === "k") { e.preventDefault(); openLinkDialog(); }
    }
    // prevent newline in single-line fields (titulo, subtitulo, block-titulo)
    if (e.key === "Enter" && area.dataset.singleline) e.preventDefault();
  });

  area.addEventListener("keyup", updateActiveStates);
  area.addEventListener("mouseup", updateActiveStates);
  area.addEventListener("input", () => { renderPreview(); actualizarBotonEnviar(); });
}

// ═══════════════════════════════════════════════
// TOOLBAR WIRING
// ═══════════════════════════════════════════════

// Prevent losing selection on toolbar click
gtbInner.addEventListener("mousedown", e => {
  if (!["INPUT", "SELECT"].includes(e.target.tagName)) e.preventDefault();
});

// execCommand buttons
gtbInner.querySelectorAll(".btb-btn[data-cmd]").forEach(btn => {
  btn.addEventListener("mousedown", e => {
    e.preventDefault();
    if (activeEditor) { activeEditor.focus(); document.execCommand(btn.dataset.cmd, false, btn.dataset.val || null); }
    updateActiveStates(); renderPreview();
  });
});

// font family
gtbInner.querySelector(".gtb-font").addEventListener("change", function () {
  if (activeEditor) { activeEditor.focus(); document.execCommand("fontName", false, this.value); renderPreview(); }
});

// font size
const sizeInput = gtbInner.querySelector(".gtb-size-input");
function applySize(s) {
  s = Math.min(72, Math.max(8, s)); sizeInput.value = s;
  if (!activeEditor) return;
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    try {
      const span = document.createElement("span");
      span.style.fontSize = s + "px";
      sel.getRangeAt(0).surroundContents(span);
    } catch (e) { }
  }
  renderPreview();
}
gtbInner.querySelector(".gtb-fs-up").addEventListener("click", () => { if (activeEditor) activeEditor.focus(); applySize(+sizeInput.value + 2); });
gtbInner.querySelector(".gtb-fs-down").addEventListener("click", () => { if (activeEditor) activeEditor.focus(); applySize(+sizeInput.value - 2); });
sizeInput.addEventListener("change", () => { if (activeEditor) activeEditor.focus(); applySize(+sizeInput.value); });

// text color
const tcInput = gtbInner.querySelector(".gtb-text-color");
const tcDot = gtbInner.querySelector(".gtb-text-cdot");
tcInput.addEventListener("input", function () {
  tcDot.style.background = this.value;
  if (activeEditor) { activeEditor.focus(); document.execCommand("foreColor", false, this.value); renderPreview(); }
});

// highlight
const hlInput = gtbInner.querySelector(".gtb-hl-color");
const hlDot = gtbInner.querySelector(".gtb-hl-cdot");
hlInput.addEventListener("input", function () {
  hlDot.style.background = this.value;
  if (activeEditor) { activeEditor.focus(); document.execCommand("hiliteColor", false, this.value); renderPreview(); }
});


// ── YAKO PALETTE CLICK HANDLERS ──────────────
gtbInner.querySelectorAll(".palette-swatch").forEach(swatch => {
  swatch.addEventListener("mousedown", e => {
    e.preventDefault();
    if (activeEditor) {
      activeEditor.focus();
      const color = swatch.dataset.color;
      document.execCommand("foreColor", false, color);
      // sync the color dot on the A button
      tcDot.style.background = color;
      renderPreview();
    }
  });
});

// link
gtbInner.querySelector(".gtb-link-btn").addEventListener("click", openLinkDialog);
document.getElementById("floatLinkBtn").addEventListener("click", openLinkDialog);

// emoji
const emojiPanel = gtbInner.querySelector(".gtb-emoji-panel");
EMOJIS.forEach(em => {
  const btn = document.createElement("button");
  btn.type = "button"; btn.textContent = em;
  btn.addEventListener("click", () => {
    if (activeEditor) { activeEditor.focus(); document.execCommand("insertText", false, em); }
    emojiPanel.classList.remove("open"); renderPreview();
  });
  emojiPanel.appendChild(btn);
});
gtbInner.querySelector(".gtb-emoji-btn").addEventListener("click", e => {
  e.stopPropagation(); emojiPanel.classList.toggle("open");
});
document.addEventListener("click", e => {
  if (!gtbInner.querySelector(".btb-emoji-wrap").contains(e.target)) emojiPanel.classList.remove("open");
});


// ── YAKO PALETTE SWATCHES ─────────────────────
gtbInner.querySelectorAll(".palette-swatch").forEach(swatch => {
  swatch.addEventListener("mousedown", e => {
    e.preventDefault();
    if (activeEditor) {
      activeEditor.focus();
      document.execCommand("foreColor", false, swatch.dataset.color);
      // update text color dot to show selected color
      tcDot.style.background = swatch.dataset.color;
      tcInput.value = swatch.dataset.color.replace('#', '') < 'aaaaaa' ? swatch.dataset.color : swatch.dataset.color;
      renderPreview();
    }
  });
});

// link dialog
document.getElementById("globalLinkOk").addEventListener("click", confirmLink);
document.getElementById("globalLinkCancel").addEventListener("click", () => linkDialog.classList.remove("open"));
document.getElementById("globalLinkInput").addEventListener("keydown", e => {
  if (e.key === "Enter") confirmLink();
  if (e.key === "Escape") linkDialog.classList.remove("open");
});
function openLinkDialog() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) savedRange = sel.getRangeAt(0).cloneRange();
  document.getElementById("globalLinkInput").value = "";
  linkDialog.classList.add("open");
  setTimeout(() => document.getElementById("globalLinkInput").focus(), 50);
}
function confirmLink() {
  const url = document.getElementById("globalLinkInput").value.trim();
  if (url && savedRange && activeEditor) {
    const sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(savedRange);
    activeEditor.focus(); document.execCommand("createLink", false, url);
  }
  linkDialog.classList.remove("open");
}

// float toolbar
floatTb.querySelectorAll(".btb-btn[data-cmd]").forEach(btn => {
  btn.addEventListener("mousedown", e => {
    e.preventDefault();
    if (activeEditor) { activeEditor.focus(); document.execCommand(btn.dataset.cmd, false, null); }
    updateActiveStates(); renderPreview();
  });
});

document.addEventListener("mouseup", () => setTimeout(checkFloatShow, 15));
document.addEventListener("keyup", () => setTimeout(checkFloatShow, 15));
function checkFloatShow() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !activeEditor || !activeEditor.contains(sel.anchorNode)) {
    floatTb.classList.remove("visible"); return;
  }
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  floatTb.classList.add("visible");
  const tbW = floatTb.offsetWidth || 200, tbH = floatTb.offsetHeight || 36;
  let left = rect.left + rect.width / 2 - tbW / 2;
  let top = rect.top - tbH - 8 + window.scrollY;
  left = Math.max(8, Math.min(left, window.innerWidth - tbW - 8));
  if (top < window.scrollY + 8) top = rect.bottom + 8 + window.scrollY;
  floatTb.style.left = left + "px";
  floatTb.style.top = top + "px";
}
document.addEventListener("mousedown", e => {
  if (!floatTb.contains(e.target)) floatTb.classList.remove("visible");
});

function updateActiveStates() {
  ["bold", "italic", "underline", "strikeThrough"].forEach(cmd => {
    const on = document.queryCommandState(cmd);
    document.querySelectorAll(`[data-cmd="${cmd}"]`).forEach(b => b.classList.toggle("active", on));
  });
}

// ═══════════════════════════════════════════════
// BLOCK BUILDER
// ═══════════════════════════════════════════════
function crearRichEditor(placeholder, singleLine = false) {
  const area = document.createElement("div");
  area.className = "rich-editor-area";
  area.contentEditable = "true";
  area.dataset.placeholder = placeholder || "Escribe aquí…";
  area.dataset.name = placeholder || "campo";
  if (singleLine) area.dataset.singleline = "true";
  registrarCampoEditable(area);
  return area;
}

function crearBloque(tipo, referencia = null, posicion = "abajo") {
  const block = document.createElement("div");
  block.classList.add("block");

  if (tipo === "parrafo") {
    const area = crearRichEditor("Escribe el párrafo…");
    const topBtn = document.createElement("button");
    topBtn.type = "button"; topBtn.className = "add-btn add-top"; topBtn.title = "Añadir arriba"; topBtn.textContent = "+";
    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.className = "btn-delete"; delBtn.title = "Eliminar"; delBtn.textContent = "✕";
    const lbl = document.createElement("label"); lbl.textContent = "Párrafo";
    const botBtn = document.createElement("button");
    botBtn.type = "button"; botBtn.className = "add-btn add-bottom"; botBtn.title = "Añadir abajo"; botBtn.textContent = "+";
    block.appendChild(topBtn); block.appendChild(delBtn);
    block.appendChild(lbl); block.appendChild(area); block.appendChild(botBtn);

  } else if (tipo === "titulo") {
    // Título de bloque → también contenteditable, single line
    const area = crearRichEditor("Título de bloque…", true);
    area.classList.add("rich-editor-area--single");
    const topBtn = document.createElement("button");
    topBtn.type = "button"; topBtn.className = "add-btn add-top"; topBtn.title = "Añadir arriba"; topBtn.textContent = "+";
    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.className = "btn-delete"; delBtn.title = "Eliminar"; delBtn.textContent = "✕";
    const lbl = document.createElement("label"); lbl.textContent = "Título";
    const botBtn = document.createElement("button");
    botBtn.type = "button"; botBtn.className = "add-btn add-bottom"; botBtn.title = "Añadir abajo"; botBtn.textContent = "+";
    block.appendChild(topBtn); block.appendChild(delBtn);
    block.appendChild(lbl); block.appendChild(area); block.appendChild(botBtn);

  } else if (tipo === "imagen") {
    block.innerHTML = `
      <button type="button" class="add-btn add-top"    title="Añadir arriba">+</button>
      <button type="button" class="btn-delete"         title="Eliminar">✕</button>
      <label>URL de imagen</label>
      <input type="url" placeholder="https://…">
      <button type="button" class="add-btn add-bottom" title="Añadir abajo">+</button>
    `;
    block.querySelector("input").addEventListener("input", renderPreview);
  }

  if (!referencia) editor.appendChild(block);
  else posicion === "arriba"
    ? referencia.parentNode.insertBefore(block, referencia)
    : referencia.parentNode.insertBefore(block, referencia.nextSibling);

  block.querySelector(".btn-delete").addEventListener("click", () => {
    if (editor.querySelectorAll(".block").length > 1) { block.remove(); renderPreview(); }
    else mostrarErrorValidacion("Contenido requerido", "La tarjeta necesita al menos un bloque de contenido.", "Añade un bloque de texto o imagen desde el editor.");
  });
  block.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      mostrarDropdown(block, btn.classList.contains("add-top") ? "arriba" : "abajo", btn);
    });
  });

  renderPreview();
}

function mostrarDropdown(bloqueRef, posicion, btnPulsado) {
  eliminarDropdownExistente();
  const dd = document.createElement("div");
  dd.classList.add("dropdown");
  dd.style.top = btnPulsado.classList.contains("add-top") ? "-96px" : "32px";
  dd.innerHTML = `
    <button type="button" data-tipo="parrafo">📝 Párrafo</button>
    <button type="button" data-tipo="titulo"><b>T</b> Título</button>
    <button type="button" data-tipo="imagen">🖼️ Imagen</button>
  `;
  btnPulsado.parentElement.appendChild(dd);
  dd.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation(); crearBloque(btn.dataset.tipo, bloqueRef, posicion); dd.remove();
    });
  });
  setTimeout(() => document.addEventListener("click", eliminarDropdownExistente, { once: true }), 0);
}
function eliminarDropdownExistente() { document.querySelector(".dropdown")?.remove(); }

// ═══════════════════════════════════════════════
// LIVE PREVIEW
// ═══════════════════════════════════════════════
function getFieldValue(id) {
  const el = document.getElementById(id);
  if (!el) return { html: "", text: "" };
  if (el.contentEditable === "true") return { html: el.innerHTML, text: el.innerText.trim() };
  return { html: "", text: el.value?.trim() || "" };
}

function renderPreview() {
  const titulo = getFieldValue("titulo");
  const subtitulo = getFieldValue("subtitulo");
  const imagenUrl = getFieldValue("imagen").text;
  const emails = getFieldValue("emails").text;
  const teamsRecipient = document.getElementById("teamsRecipient")?.value?.trim() || "";
  const canal = canalSelect.value;

  const blocks = [];
  editor.querySelectorAll(".block").forEach(block => {
    const rich = block.querySelector(".rich-editor-area");
    const url = block.querySelector("input[type='url']");
    if (rich && rich.dataset.singleline) {
      blocks.push({ tipo: "titulo", html: rich.innerHTML, text: rich.innerText.trim() });
    } else if (rich) {
      blocks.push({ tipo: "parrafo", html: rich.innerHTML, text: rich.innerText.trim() });
    } else if (url) {
      const saved = imgSizes.get(block) || {};
      blocks.push({ tipo: "imagen", value: url.value.trim(), width: saved.width || null, blockEl: block });
    }
  });

  const cardHTML = buildCardHTML({ titulo, subtitulo, imagenUrl, blocks, canal });
  ["previewCard", "previewCardOutlook"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = cardHTML;
      initResizableImages(el, blocks);
    }
  });
  const subEl = document.getElementById("previewSubject");
  if (subEl) subEl.textContent = titulo.text || "—";
  const emEl = document.getElementById("previewEmails");
  if (emEl) emEl.textContent = emails || "—";

  // Update Teams recipient preview
  const teamsRecipientEl = document.getElementById("previewTeamsRecipient");
  const teamsRecipientBar = document.getElementById("teamsRecipientBar");
  if (teamsRecipientEl) {
    teamsRecipientEl.textContent = teamsRecipient || "—";
  }
  // Show/hide recipient bar based on whether teams recipient has been filled
  if (teamsRecipientBar) {
    teamsRecipientBar.style.display = (canal === "teams" && teamsRecipient) ? "flex" : "none";
  }
  // Update sidebar channel name
  const channelNameEl = document.getElementById("previewTeamsChannel");
  if (channelNameEl && teamsRecipient) {
    channelNameEl.textContent = teamsRecipient;
  } else if (channelNameEl) {
    channelNameEl.textContent = "General";
  }
}

function buildCardHTML({ titulo, subtitulo, imagenUrl, blocks, canal, forModal = false }) {
  const hasContent = titulo.text || imagenUrl || blocks.some(b => b.value || b.text);
  if (!hasContent) return `<div class="card-placeholder"><div class="ph-icon">✦</div><p>Empieza a escribir en el panel izquierdo y tu tarjeta tomará forma aquí</p></div>`;

  const headerPct = imgSizes.get("header") || 100;
  const hStyle = `width:${headerPct}%;`;
  let html = imagenUrl
    ? forModal
      ? `<img src="${esc(imagenUrl)}" style="width:100%;display:block;object-fit:cover;max-height:180px;" alt="">`
      : `<div class="header-img-resize-wrap" style="${hStyle}"><img class="card-header-img" src="${esc(imagenUrl)}" onerror="this.closest('.header-img-resize-wrap').style.display='none'" alt=""><div class="resize-handle-h"></div></div>`
    : titulo.text ? `<div class="card-header-img-placeholder">${titulo.html || esc(titulo.text)}</div>` : "";

  html += `<div class="card-body">`;
  if (titulo.html) html += `<div class="card-title">${titulo.html}</div>`;
  if (subtitulo.html) html += `<div class="card-subtitle">${subtitulo.html}</div>`;

  blocks.forEach(b => {
    if (b.tipo === "titulo" && b.text)
      html += `<div class="card-block"><div class="card-block-title">${b.html}</div></div>`;
    else if (b.tipo === "parrafo" && b.html)
      html += `<div class="card-block"><div class="card-block-text">${b.html}</div></div>`;
    else if (b.tipo === "imagen" && b.value)
      html += `<div class="card-block"><img class="card-block-img" src="${esc(b.value)}"
        onerror="this.outerHTML='<div class=\\'card-block-img-err\\'>🖼️ URL no válida</div>'" alt=""></div>`;
  });

  if (canal) {
    const cls = canal === "teams" ? "badge-teams" : "badge-outlook";
    const label = canal === "teams" ? "📤 Microsoft Teams" : "📧 Outlook";
    html += `<span class="card-channel-badge ${cls}">${label}</span>`;
  }
  return html + `</div>`;
}


// ═══════════════════════════════════════════════
// RESIZABLE IMAGES IN PREVIEW
// ═══════════════════════════════════════════════
function initResizableImages(cardEl, blocks) {
  // ── block images ──
  cardEl.querySelectorAll(".img-resize-wrap").forEach((wrap, i) => {
    const handle = wrap.querySelector(".resize-handle");
    const label = wrap.querySelector(".resize-label");
    if (!handle) return;

    handle.addEventListener("mousedown", e => {
      e.preventDefault(); e.stopPropagation();
      wrap.classList.add("resizing");
      const startX = e.clientX;
      const startW = wrap.offsetWidth;
      const blockEl = blocks[i]?.blockEl;

      function onMove(ev) {
        const newW = Math.max(60, Math.min(startW + (ev.clientX - startX), wrap.parentElement.offsetWidth));
        wrap.style.width = newW + "px";
        if (label) label.textContent = Math.round(newW) + "px";
        if (blockEl) imgSizes.set(blockEl, { ...(imgSizes.get(blockEl) || {}), width: Math.round(newW) });
      }
      function onUp() {
        wrap.classList.remove("resizing");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });

  // ── header image (scale by width %) ──
  const headerWrap = cardEl.querySelector(".header-img-resize-wrap");
  if (headerWrap) {
    const hHandle = headerWrap.querySelector(".resize-handle-h");
    if (hHandle) {
      hHandle.addEventListener("mousedown", e => {
        e.preventDefault(); e.stopPropagation();
        // dragging DOWN = bigger, UP = smaller
        // we scale the img element's width as % of parent
        const startY = e.clientY;
        const parentW = headerWrap.parentElement?.offsetWidth || headerWrap.offsetWidth || 400;
        const startW = parseFloat(imgSizes.get("header") || 100); // % of parent

        function onMove(ev) {
          const delta = (ev.clientY - startY);          // px dragged
          const pctDelta = (delta / parentW) * 100;      // convert to %
          const newPct = Math.max(20, Math.min(100, startW + pctDelta));
          headerWrap.style.width = newPct + "%";
          imgSizes.set("header", newPct);
        }
        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    }
  }
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── CANAL / TABS ──────────────────────────────
canalSelect.addEventListener("change", function () {
  const val = this.value;
  // Outlook: show email field
  val === "outlook" ? emailField.classList.remove("hidden") : emailField.classList.add("hidden");
  // Teams: show teams recipient field
  if (teamsRecipientField) {
    val === "teams" ? teamsRecipientField.classList.remove("hidden") : teamsRecipientField.classList.add("hidden");
  }
  renderPreview(); syncTabToCanal(val); actualizarBotonEnviar();
});
// Current active channel (teams or outlook)
let activeChannel = "teams";

function syncTabToCanal(val) {
  if (!val) return;
  activeChannel = val;
  // Activate "Vista previa" tab
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
  // Update channel sub-tab
  document.querySelectorAll(".channel-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === val));
  showPreviewChrome(val);
}

function showPreviewChrome(val) {
  const teamsEl = document.getElementById("teamsChrome");
  const outlookEl = document.getElementById("outlookChrome");
  const screen = document.getElementById("previewScreen");
  // Hide any side panels
  screen?.querySelectorAll(".preview-side-panel").forEach(p => p.remove());
  if (teamsEl) teamsEl.classList.toggle("hidden", val === "outlook");
  if (outlookEl) outlookEl.classList.toggle("hidden", val !== "outlook");
  // Show channel subtabs
  document.getElementById("channelSubtabs")?.classList.remove("hidden");
}

// Main tabs: Vista previa / Plantillas / Historial
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const val = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    if (val === "plantillas") {
      document.getElementById("channelSubtabs")?.classList.add("hidden");
      ensurePreviewPanel("plantillas");
      return;
    }
    if (val === "historial") {
      document.getElementById("channelSubtabs")?.classList.add("hidden");
      ensurePreviewPanel("historial");
      return;
    }
    if (val === "imagenes") {
      document.getElementById("channelSubtabs")?.classList.add("hidden");
      ensurePreviewPanel("imagenes");
      return;
    }
    // "teams" tab = Vista previa — restore chrome
    showPreviewChrome(activeChannel);
  });
});

// Channel sub-tabs (Teams / Outlook)
document.querySelectorAll(".channel-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const val = tab.dataset.tab;
    activeChannel = val;
    document.querySelectorAll(".channel-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    // Also sync canal select
    const canalEl = document.getElementById("canal");
    if (canalEl && canalEl.value !== val) { canalEl.value = val; canalEl.dispatchEvent(new Event("change")); }
    showPreviewChrome(val);
  });
});

function ensurePreviewPanel(type) {
  const screen = document.getElementById("previewScreen");
  screen.querySelectorAll(".app-chrome").forEach(c => c.classList.add("hidden"));
  let panel = screen.querySelector(".preview-side-panel");
  if (panel) panel.remove();
  panel = document.createElement("div");
  panel.className = "preview-side-panel active";

  if (type === "plantillas") {
    panel.innerHTML = `<div class="panel-section-hdr">
      <h2>✦ Plantillas predefinidas</h2>
      <p>Selecciona una para rellenar el formulario automáticamente</p>
    </div>
    <div class="tpl-grid" id="tplGridInline"></div>`;
    screen.appendChild(panel);
    const grid = panel.querySelector("#tplGridInline");
    PLANTILLAS.forEach(p => {
      const card = document.createElement("div");
      card.className = "tpl-card";
      card.innerHTML = `<span class="tpl-icon">${p.icon}</span><div class="tpl-name">${p.name}</div><div class="tpl-desc">${p.desc}</div>`;
      card.addEventListener("click", () => {
        mostrarPreviewPlantilla({
          titulo:    p.titulo,
          subtitulo: p.subtitulo,
          imagenUrl: p.imagen || "",
          blocks:    [{ tipo: "parrafo", html: p.cuerpo, text: p.cuerpo }],
          canal:     "",
          badge:     p.icon + " " + p.name,
          btnLabel:  "Usar plantilla",
          onConfirm: () => {
            aplicarPlantilla(p);
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
            document.getElementById("channelSubtabs")?.classList.remove("hidden");
            showPreviewChrome(activeChannel);
          }
        });
      });
      grid.appendChild(card);
    });
  } else if (type === "historial") {
    panel.innerHTML = `<div class="panel-section-hdr">
      <h2>🕑 Historial y Borradores</h2>
      <p>Carga borradores guardados o revisa tarjetas enviadas</p>
    </div>
    <div class="hist-tabs" id="histTabsInline">
      <button class="hist-tab active" data-htab="borradores">📝 Borradores</button>
      <button class="hist-tab" data-htab="enviadas">✅ Enviadas</button>
    </div>
    <div id="histPanelInline"></div>`;
    screen.appendChild(panel);
    panel.querySelectorAll(".hist-tab").forEach(t => {
      t.addEventListener("click", () => {
        panel.querySelectorAll(".hist-tab").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        currentHistTab = t.dataset.htab;
        renderHistPanelInline();
      });
    });
    renderHistPanelInline();
  }
}

function renderHistPanelInline() {
  const panel = document.getElementById("histPanelInline");
  if (!panel) return;
  const key = currentHistTab === "borradores" ? "yako_borradores" : "yako_enviadas";
  const items = getStorage(key);
  if (!items.length) {
    panel.innerHTML = `<div class="hist-empty"><div class="hist-empty-icon">${currentHistTab === "borradores" ? "📝" : "✅"}</div><p>${currentHistTab === "borradores" ? "No tienes borradores guardados." : "No hay tarjetas enviadas."}</p></div>`;
    return;
  }
  panel.innerHTML = `<div class="hist-list">${items.map((item, i) => `
    <div class="hist-item">
      <div class="hist-dot ${item.state?.canal || "teams"}"></div>
      <div class="hist-info">
        <div class="hist-title">${item.state?.titulo || "(sin título)"}</div>
        <div class="hist-meta">${item.state?.canal === "outlook" ? "Outlook" : "Teams"} · ${item.fecha}</div>
      </div>
      <span class="hist-badge ${item.tipo === "borrador" ? "hist-badge--draft" : "hist-badge--sent"}">${item.tipo === "borrador" ? "Borrador" : "✓ Enviada"}</span>
      <div class="hist-actions">
        ${currentHistTab === "borradores" ? `<button class="hist-btn" data-action="cargar" data-i="${i}">📂</button>` : `<button class="hist-btn" data-action="clonar" data-i="${i}">🔁</button>`}
        <button class="hist-btn hist-btn--del" data-action="borrar" data-i="${i}">🗑</button>
      </div>
    </div>`).join("")}</div>`;
  panel.querySelectorAll(".hist-btn[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.i;
      const items2 = getStorage(key);
      if (btn.dataset.action === "borrar") {
        items2.splice(idx, 1);
        setStorage(key, items2);
        renderHistPanelInline();
      } else {
        const estado = items2[idx].state;
        const esBorrador = btn.dataset.action === "cargar";
        mostrarPreviewPlantilla({
          titulo:    estado.titulo    || "",
          subtitulo: estado.subtitulo || "",
          imagenUrl: estado.imagen || estado.imagenUrl || "",
          blocks:    estado.blocks    || [],
          canal:     estado.canal     || "",
          badge:     esBorrador ? "📂 Borrador guardado" : "🔁 Tarjeta enviada",
          btnLabel:  esBorrador ? "Cargar borrador" : "Reutilizar tarjeta",
          onConfirm: () => {
            cargarEstado(estado);
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
            document.getElementById("channelSubtabs")?.classList.remove("hidden");
            showPreviewChrome(activeChannel);
          }
        });
      }
    });
  });
}

tarjetaForm.addEventListener("submit", e => { e.preventDefault(); mostrarConfirmEnvio(); });

// ═══════════════════════════════════════════════
// CONFIRMACIÓN DE ENVÍO
// ═══════════════════════════════════════════════

function mostrarErrorValidacion(titulo, mensaje, ayuda) {
  document.getElementById("errorValidacionModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "errorValidacionModal";
  modal.style.cssText = [
    "position:fixed","inset:0","z-index:3000",
    "background:rgba(0,0,0,.5)",
    "display:flex","align-items:center","justify-content:center",
    "padding:24px","animation:fadeInBg .2s ease"
  ].join(";");

  modal.innerHTML =
    '<div style="background:#fff;border-radius:20px;max-width:400px;width:100%;' +
    'box-shadow:0 40px 100px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06);' +
    'font-family:var(--sans,sans-serif);animation:msDropIn .25s cubic-bezier(.22,1,.36,1);' +
    'overflow:hidden;text-align:center;">' +
    '<div style="background:linear-gradient(135deg,#d97706 0%,#f59e0b 100%);padding:28px 24px 24px;">' +
    '<div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.2);' +
    'display:flex;align-items:center;justify-content:center;margin:0 auto 12px;' +
    'border:2px solid rgba(255,255,255,.4);">' +
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"' +
    ' style="animation:checkPop .3s .1s cubic-bezier(.22,1,.36,1) both">' +
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>' +
    '<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>' +
    '<div style="color:white;font-size:18px;font-weight:700;">' + titulo + '</div></div>' +
    '<div style="padding:22px 26px 8px;">' +
    '<p style="font-size:14px;font-weight:600;color:#1a1a2e;margin:0 0 10px;">' + mensaje + '</p>' +
    '<div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;' +
    'padding:12px 14px;text-align:left;font-size:13px;color:#78350f;line-height:1.5;">' +
    '<strong>&#128161; ¿Qué hacer?</strong><br>' + ayuda + '</div></div>' +
    '<div style="padding:8px 26px 26px;">' +
    '<button id="errorValidacionClose" style="width:100%;height:44px;border-radius:12px;border:none;' +
    'background:#0000D0;color:white;font-family:inherit;font-size:14px;font-weight:700;' +
    'cursor:pointer;box-shadow:0 4px 14px rgba(0,0,208,.3);transition:background .15s,transform .1s;">' +
    'Entendido</button></div></div>';

  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
  const btn = document.getElementById("errorValidacionClose");
  btn.addEventListener("click", () => modal.remove());
  btn.addEventListener("mouseenter", () => { btn.style.background="#0000aa"; btn.style.transform="translateY(-1px)"; });
  btn.addEventListener("mouseleave", () => { btn.style.background="#0000D0"; btn.style.transform=""; });
}

function mostrarConfirmEnvio() {
  const canal = canalSelect.value;
  if (!canal) { mostrarErrorValidacion("Canal no seleccionado", "Debes elegir un canal de envío antes de continuar.", "Selecciona <strong>Microsoft Teams</strong> o <strong>Outlook</strong> en el campo canal."); return; }

  const titulo = getFieldValue("titulo");
  if (!titulo.text) { mostrarErrorValidacion("Título requerido", "La tarjeta necesita un título para poder enviarse.", "Escribe un título en el campo <strong>01 · Título</strong> del formulario."); return; }

  const canalLabel = canal === "teams" ? "Microsoft Teams" : "Outlook";
  const canalIcon = canal === "teams" ? "📤" : "📧";
  const canalBadgeClass = canal === "teams" ? "badge-teams" : "badge-outlook";

  // Captura el HTML de la tarjeta actual
  const previewSrc = document.getElementById("previewCard") || document.getElementById("previewCardOutlook");
  const previewHTML = previewSrc ? previewSrc.innerHTML : "";

  document.getElementById("confirmEnvioModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "confirmEnvioModal";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:2000;
    background:rgba(0,0,0,.5);
    display:flex;align-items:center;justify-content:center;
    padding:24px;
  `;

  modal.innerHTML = `
    <div style="
      background:white;border-radius:16px;
      max-width:480px;width:100%;
      box-shadow:0 32px 80px rgba(0,0,0,.22),0 0 0 1px rgba(0,0,0,.06);
      font-family:var(--font,sans-serif);
      animation:msDropIn .2s cubic-bezier(.22,1,.36,1);
      overflow:hidden;
    ">
      <!-- Header -->
      <div style="
        padding:20px 24px 16px;
        border-bottom:1px solid #f0f0f0;
        display:flex;align-items:center;gap:12px;
      ">
        <span style="font-size:22px">${canalIcon}</span>
        <div>
          <div style="font-size:15px;font-weight:700;color:#0f0f12;letter-spacing:-.01em">¿Enviar la tarjeta?</div>
          <div style="font-size:12px;color:#999;margin-top:2px">Vía <strong style="color:#0000D0">${canalLabel}</strong></div>
        </div>
        <button id="confirmEnvioClose" style="
          margin-left:auto;background:none;border:none;
          font-size:18px;color:#bbb;cursor:pointer;line-height:1;padding:4px;
        ">✕</button>
      </div>

      <!-- Card preview -->
      <div style="
        margin:16px 20px;
        border:1.5px solid #e8e8e8;border-radius:10px;
        overflow:hidden;max-height:340px;overflow-y:auto;
        background:#fafafa;
        scrollbar-width:thin;
      ">
        <div id="confirmPreviewCard" style="pointer-events:none;user-select:none;">
          ${previewHTML}
        </div>
      </div>

      <!-- Footer buttons -->
      <div style="
        padding:12px 20px 20px;
        display:flex;gap:10px;
      ">
        <button id="confirmEnvioCancel" style="
          flex:1;height:42px;border-radius:9px;
          border:1.5px solid #e0e0e0;background:white;
          font-family:inherit;font-size:13px;font-weight:600;
          color:#666;cursor:pointer;transition:background .15s;
        ">Cancelar</button>
        <button id="confirmEnvioOk" style="
          flex:2;height:42px;border-radius:9px;border:none;
          background:#0000D0;color:white;
          font-family:inherit;font-size:14px;font-weight:700;
          cursor:pointer;transition:background .15s,box-shadow .15s;
          box-shadow:0 2px 10px rgba(0,0,208,.3);
          display:flex;align-items:center;justify-content:center;gap:8px;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Sí, enviar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
  document.getElementById("confirmEnvioClose").addEventListener("click", () => modal.remove());
  document.getElementById("confirmEnvioCancel").addEventListener("click", () => modal.remove());
  document.getElementById("confirmEnvioOk").addEventListener("click", () => {
    modal.remove();
    dispararEnvioATeams();
  });
}

function ejecutarEnvio() {
  try {
    const state = getCardState();
    if (state.titulo) {
      guardarEnviada(state);
      const histPanel = document.getElementById("histPanelInline");
      if (histPanel) {
        currentHistTab = "enviadas";
        document.querySelectorAll(".hist-tab").forEach(t => {
          t.classList.toggle("active", t.dataset.htab === "enviadas");
        });
        renderHistPanelInline();
      }
    }
    mostrarEnvioExito(state);
  } catch (err) {
    mostrarEnvioError(err);
  }
}

function mostrarEnvioError(err) {
  document.getElementById("envioErrorModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "envioErrorModal";
  modal.style.cssText = [
    "position:fixed", "inset:0", "z-index:3000",
    "background:rgba(0,0,0,.55)",
    "display:flex", "align-items:center", "justify-content:center",
    "padding:24px", "animation:fadeInBg .2s ease"
  ].join(";");

  const errMsg = (err && err.message) ? err.message : "Error desconocido";

  modal.innerHTML =
    '<div style="background:#fff;border-radius:20px;max-width:420px;width:100%;' +
    'box-shadow:0 40px 100px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.06);' +
    'font-family:var(--sans,sans-serif);animation:msDropIn .25s cubic-bezier(.22,1,.36,1);' +
    'overflow:hidden;text-align:center;">' +

    // Red header
    '<div style="background:linear-gradient(135deg,#b91c1c 0%,#ef4444 100%);padding:32px 24px 28px;">' +
    '<div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.2);' +
    'display:flex;align-items:center;justify-content:center;margin:0 auto 14px;' +
    'border:2px solid rgba(255,255,255,.4);">' +
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" ' +
    'style="animation:checkPop .3s .15s cubic-bezier(.22,1,.36,1) both">' +
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>' +
    '<div style="color:white;font-size:20px;font-weight:700;">Error al enviar</div>' +
    '<div style="color:rgba(255,255,255,.8);font-size:13px;margin-top:6px;">No se ha podido enviar la tarjeta</div>' +
    '</div>' +

    // Body
    '<div style="padding:24px 28px 8px;">' +
    '<div style="background:#fff5f5;border:1.5px solid #fecaca;border-radius:10px;' +
    'padding:14px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:12px;text-align:left;">' +
    '<span style="font-size:20px;flex-shrink:0;">&#9888;&#65039;</span>' +
    '<div>' +
    '<div style="font-size:12px;color:#dc2626;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">Detalle del error</div>' +
    '<div style="font-size:13px;color:#7f1d1d;line-height:1.5;word-break:break-word;">' + errMsg + '</div>' +
    '</div></div>' +
    '<p style="font-size:13px;color:#666;line-height:1.6;margin:0 0 20px;">' +
    'Comprueba tu conexion e intentalo de nuevo. Si el problema persiste, contacta con el administrador.' +
    '</p></div>' +

    // Buttons
    '<div style="padding:0 28px 28px;display:flex;gap:10px;">' +
    '<button id="envioErrorClose" style="flex:1;height:46px;border-radius:12px;' +
    'border:1.5px solid #e0e0e0;background:white;font-family:inherit;font-size:14px;' +
    'font-weight:600;color:#666;cursor:pointer;">Cancelar</button>' +
    '<button id="envioErrorRetry" style="flex:2;height:46px;border-radius:12px;border:none;' +
    'background:#0000D0;color:white;font-family:inherit;font-size:14px;font-weight:700;' +
    'cursor:pointer;box-shadow:0 4px 16px rgba(0,0,208,.3);' +
    'display:flex;align-items:center;justify-content:center;gap:8px;">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
    '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>' +
    'Reintentar</button>' +
    '</div></div>';

  document.body.appendChild(modal);

  document.getElementById("envioErrorClose").addEventListener("click", () => modal.remove());

  const retryBtn = document.getElementById("envioErrorRetry");
  retryBtn.addEventListener("click", () => { modal.remove(); ejecutarEnvio(); });
  retryBtn.addEventListener("mouseenter", () => { retryBtn.style.background = "#0000aa"; retryBtn.style.transform = "translateY(-1px)"; });
  retryBtn.addEventListener("mouseleave", () => { retryBtn.style.background = "#0000D0"; retryBtn.style.transform = ""; });
}

function mostrarEnvioExito(state) {
  document.getElementById("envioExitoModal")?.remove();

  const canal      = state?.canal === "outlook" ? "Outlook" : "Microsoft Teams";
  const canalIcon  = state?.canal === "outlook" ? "📧" : "📤";
  const tituloCard = state?.titulo || "Tu tarjeta";

  const modal = document.createElement("div");
  modal.id = "envioExitoModal";
  modal.style.cssText = `
    position:fixed; inset:0; z-index:3000;
    background:rgba(0,0,0,.55);
    display:flex; align-items:center; justify-content:center;
    padding:24px;
    animation: fadeInBg .2s ease;
  `;

  modal.innerHTML = `
    <div style="
      background:#fff; border-radius:20px;
      max-width:420px; width:100%;
      box-shadow:0 40px 100px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.06);
      font-family:var(--sans,'Segoe UI',sans-serif);
      animation:msDropIn .25s cubic-bezier(.22,1,.36,1);
      overflow:hidden;
      text-align:center;
    ">
      <!-- Cabecera verde -->
      <div style="
        background:linear-gradient(135deg,#0a7c15 0%,#12a01e 100%);
        padding:32px 24px 28px;
        position:relative;
      ">
        <!-- Icono check animado -->
        <div style="
          width:64px; height:64px; border-radius:50%;
          background:rgba(255,255,255,.2);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 14px;
          border:2px solid rgba(255,255,255,.4);
        ">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            style="animation:checkPop .3s .15s cubic-bezier(.22,1,.36,1) both">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div style="color:white; font-size:20px; font-weight:700; letter-spacing:-.01em;">¡Tarjeta enviada!</div>
        <div style="color:rgba(255,255,255,.8); font-size:13px; margin-top:6px;">${canalIcon} Enviada vía <strong>${canal}</strong></div>
      </div>

      <!-- Cuerpo -->
      <div style="padding:24px 28px 8px;">
        <div style="
          background:#f4f4f4; border-radius:10px;
          padding:14px 16px; margin-bottom:20px;
          display:flex; align-items:center; gap:12px;
          text-align:left;
        ">
          <span style="font-size:22px">✉️</span>
          <div>
            <div style="font-size:12px; color:#999; font-weight:600; text-transform:uppercase; letter-spacing:.04em; margin-bottom:2px;">Tarjeta</div>
            <div style="font-size:14px; font-weight:600; color:#1a1a2e;">${tituloCard}</div>
          </div>
        </div>
        <p style="font-size:13px; color:#666; line-height:1.6; margin:0 0 20px;">
          Tu tarjeta adaptativa se ha enviado correctamente. Puedes consultarla en el <strong>historial</strong> en cualquier momento.
        </p>
      </div>

      <!-- Botón cerrar -->
      <div style="padding:0 28px 28px;">
        <button id="envioExitoClose" style="
          width:100%; height:46px; border-radius:12px; border:none;
          background:#0000D0; color:white;
          font-family:inherit; font-size:15px; font-weight:700;
          cursor:pointer;
          box-shadow:0 4px 16px rgba(0,0,208,.3);
          transition:background .15s, transform .1s;
          display:flex; align-items:center; justify-content:center; gap:8px;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Aceptar
        </button>
      </div>
    </div>

    <style>
      @keyframes checkPop {
        from { opacity:0; transform:scale(.5) rotate(-20deg); }
        to   { opacity:1; transform:scale(1) rotate(0deg); }
      }
      @keyframes fadeInBg {
        from { opacity:0; }
        to   { opacity:1; }
      }
    </style>
  `;

  document.body.appendChild(modal);

  const closeBtn = document.getElementById("envioExitoClose");
  closeBtn.addEventListener("mouseenter", () => { closeBtn.style.background = "#0000aa"; closeBtn.style.transform = "translateY(-1px)"; });
  closeBtn.addEventListener("mouseleave", () => { closeBtn.style.background = "#0000D0"; closeBtn.style.transform = ""; });
  closeBtn.addEventListener("click", () => modal.remove());
}

function buildCardJSON({ titulo, subtitulo, imagenUrl, blocks }) {
  const body = [];
 
  // 1. Imagen de cabecera (altText de texto fijo)
  if (imagenUrl) {
    body.push({
      type: "Image",
      url: imagenUrl.trim(),
      size: "stretch",
      altText: "Imagen de cabecera" // Texto duro, a prueba de fallos
    });
  }

 
  // 2. Contenedor del título
  if (titulo && titulo.text) {
    body.push({
      type: "TextBlock",
      text: titulo.text.trim(),
      weight: "Bolder",
      size: "Large",
      wrap: true
    });
  }

 
  // 3. Subtítulo
  if (subtitulo && subtitulo.text) {
    body.push({
      type: "TextBlock",
      text: subtitulo.text.trim(),
      size: "Small",
      isSubtle: true,
      wrap: true
    });
  }

 
  // 4. Bloques de contenido dinámicos
  if (blocks && blocks.length > 0) {
    // Separador (solo visual)
    body.push({ type: "Container", style: "emphasis", bleed: false, items: [], spacing: "Small" });

 
    blocks.forEach(b => {
      if (b.tipo === "titulo" && b.text) {
        body.push({
          type: "TextBlock", text: b.text.trim(), weight: "Bolder", size: "Medium", wrap: true, spacing: "Medium"
        });
      } else if (b.tipo === "parrafo" && b.text) {
        body.push({
          type: "TextBlock", text: b.text.trim(), wrap: true, spacing: "Small"
        });
      } else if (b.tipo === "imagen" && b.value) {
        body.push({
          type: "Image", url: b.value.trim(), size: "stretch", spacing: "Small", 
          type: "Image", url: b.value.trim(), size: "stretch", spacing: "Small",
          altText: "Imagen del contenido" // Texto duro, a prueba de fallos
        });
      }
    });
  }
 
  // Envoltorio limpio y sin variables nulas
  return {
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          fallbackText: "Nueva tarjeta de Teams",
          body: body
        }
      }
    ]
  };
}

  // Envoltorio limpio y sin variables nulas
async function dispararEnvioATeams() {
    // 1. Recoger destinatarios (Blindado con ?.)
    const inputDestinatarios = document.getElementById('teamsRecipient')?.value || ""; 
    const destinatariosArray = inputDestinatarios
        .split(',')
        .map(email => email.trim())
        .filter(email => email !== "");

    // ════════ 2. ¡LA MAGIA CON DATOS REALES (INMORTAL)! ════════
    
    // Leemos los elementos. Usamos ?. para que si tus compañeros 
    // han cambiado el ID en el HTML, el código no explote, sino que devuelva "".
    const textoTitulo = document.getElementById("titulo")?.innerText || document.getElementById("titulo")?.value || "";
    const textoSubtitulo = document.getElementById("subtitulo")?.innerText || document.getElementById("subtitulo")?.value || "";
    const urlImagen = document.getElementById("imagen")?.value || null;

    // Recorremos los bloques dinámicos
    const blocks = [];
    const editorContenedor = document.getElementById("editor");
    
    if (editorContenedor) {
        editorContenedor.querySelectorAll(".block").forEach(block => {
            const rich = block.querySelector(".rich-editor-area");
            const url = block.querySelector("input[type='url']");
            
            if (rich) {
                const texto = rich.innerText || "";
                if (rich.dataset.singleline) {
                    blocks.push({ tipo: "titulo", text: String(texto) });
                } else {
                    blocks.push({ tipo: "parrafo", text: String(texto) });
                }
            } else if (url) {
                blocks.push({ tipo: "imagen", value: String(url.value || "") });
            }
        });
    }

    const datosReales = {
        titulo: { text: String(textoTitulo) },       
        subtitulo: { text: String(textoSubtitulo) }, 
        imagenUrl: urlImagen,
        blocks: blocks
    };

    const mensajeCompleto = buildCardJSON(datosReales);
    const tarjetaVisual = mensajeCompleto.attachments[0].content;
    // ════════════════════════════════════════════════

    // 3. Feedback visual
    const botonEnviar = document.getElementById('btnEnviar');
    const textoOriginal = botonEnviar ? botonEnviar.innerText : "Enviar";
    if (botonEnviar) {
        botonEnviar.innerText = "Enviando...";
        botonEnviar.disabled = true;
    }

    // 4. Llamada al servidor
    try {
        const respuesta = await fetch('http://localhost:3000/api/enviar-teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destinatarios: destinatariosArray,
                tarjeta: tarjetaVisual
            })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            mostrarEnvioExito(getCardState());
        } else {
            throw new Error(data.error || "El servidor devolvió un error desconocido");
        }
    } catch (error) {
        mostrarEnvioError(error);
    } finally {
        if (botonEnviar) {
            botonEnviar.innerText = textoOriginal;
            botonEnviar.disabled = false;
        }
    }
}

function buildOutlookHTML({ titulo, subtitulo, imagenUrl, blocks }) {
  // Clean, table-based HTML safe for Outlook rendering engine
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin:0; padding:0; background:#f3f2f1; font-family:'Segoe UI',Arial,sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; background:#ffffff; border-radius:4px; overflow:hidden; }
  .header  { background:#0000D0; color:white; padding:20px 24px; font-size:18px; font-weight:700; line-height:1.3; }
  .header-img { width:100%; display:block; }
  .body    { padding:20px 24px; }
  .subtitle{ font-size:13px; color:#605e5c; margin-bottom:16px; }
  .block-title { font-size:14px; font-weight:700; color:#201f1e; margin:16px 0 4px; }
  .block-text  { font-size:14px; color:#323130; line-height:1.6; margin:0 0 10px; }
  .block-img   { width:100%; display:block; margin:10px 0; border-radius:2px; }
  .footer  { padding:12px 24px; background:#f3f2f1; font-size:11px; color:#a19f9d; border-top:1px solid #edebe9; }
</style>
</head>
<body>
<div class="wrapper">`;

  if (imagenUrl) {
    html += `<img class="header-img" src="${esc(imagenUrl)}" alt="">`;
  } else if (titulo.text) {
    html += `<div class="header">${titulo.text}</div>`;
  }

  html += `<div class="body">`;
  if (titulo.text && imagenUrl) html += `<h1 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0000D0">${titulo.text}</h1>`;
  if (subtitulo.text) html += `<p class="subtitle">${subtitulo.text}</p>`;

  blocks.forEach(b => {
    if (b.tipo === "titulo" && b.text)
      html += `<div class="block-title">${b.html || b.text}</div>`;
    else if (b.tipo === "parrafo" && b.text)
      html += `<div class="block-text">${b.html || b.text}</div>`;
    else if (b.tipo === "imagen" && b.value)
      html += `<img class="block-img" src="${esc(b.value)}" alt="">`;
  });

  html += `</div>
<div class="footer">Enviado con Yako Card Builder</div>
</div>
</body>
</html>`;
  return html;
}

function mostrarModalOutput(isTeams, outputStr) {
  // Remove existing if any
  document.getElementById("outputModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "outputModal";
  modal.className = "modal-overlay";
  modal.style.cssText = "position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn .2s ease";

  modal.innerHTML = `
    <div class="modal-box modal-box--wide" style="max-width:680px;display:flex;flex-direction:column;max-height:85vh">
      <div class="modal-header">
        <span class="modal-title">${isTeams ? "📤 JSON — Microsoft Teams" : "📧 HTML — Outlook"}</span>
        <button class="modal-close" id="cerrarOutputModal">✕</button>
      </div>
      <div style="padding:12px 24px 8px;display:flex;align-items:center;gap:10px;flex-shrink:0">
        <p style="font-size:12px;color:#888;flex:1;font-style:italic">
          ${isTeams
      ? "Envía este JSON a tu webhook de Teams (Power Automate, Bot Framework, etc.)"
      : "Copia este HTML para usarlo en el cuerpo del correo de Outlook"}
        </p>
        <button id="copyOutputBtn" style="
          padding:8px 18px;border-radius:8px;border:1.5px solid #0000D0;
          background:#f0f0ff;color:#0000D0;font-family:var(--font,sans-serif);
          font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0;
          transition:background .15s
        ">📋 Copiar</button>
      </div>
      <div style="padding:0 24px 24px;flex:1;overflow:auto;min-height:0">
        <pre id="outputCode" style="
          background:#0f0f18;color:#e2e8f0;padding:20px;border-radius:10px;
          font-family:'Cascadia Code','DM Mono',monospace;font-size:12px;
          line-height:1.7;overflow:auto;white-space:pre-wrap;word-break:break-all;
          margin:0;border:1px solid #1e1e2e
        ">${outputStr.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("cerrarOutputModal").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  document.getElementById("copyOutputBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(outputStr);
      const btn = document.getElementById("copyOutputBtn");
      btn.textContent = "✅ Copiado";
      btn.style.background = "#e8f5e8";
      btn.style.borderColor = "#107c10";
      btn.style.color = "#107c10";
      setTimeout(() => {
        btn.textContent = "📋 Copiar";
        btn.style.background = "#f0f0ff";
        btn.style.borderColor = "#0000D0";
        btn.style.color = "#0000D0";
      }, 2000);
    } catch (e) {
      showToast("❌ No se pudo copiar al portapapeles", "error");
    }
  });
}

// ── INIT ──────────────────────────────────────
initHeaderFields();

// imagen y emails siguen siendo inputs normales — registrar eventos
["imagen", "emails", "teamsRecipient"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", renderPreview);
});

crearBloque("parrafo");

// ── VALIDACIÓN DEL BOTÓN ENVIAR ───────────────
function actualizarBotonEnviar() {
  const btnEnviar = document.querySelector(".btn-submit");
  if (!btnEnviar) return;
  const tituloEl = document.getElementById("titulo");
  const canalEl  = document.getElementById("canal");
  const tituloOk = tituloEl && tituloEl.textContent.trim().length > 0;
  const canalOk  = canalEl  && canalEl.value.trim().length > 0;
  btnEnviar.disabled = !(tituloOk && canalOk);
}

// Estado inicial: botón desactivado
setTimeout(actualizarBotonEnviar, 250);
// ═══════════════════════════════════════════════
// FEATURE: DEVICE TOGGLE (móvil / escritorio)
// ═══════════════════════════════════════════════
document.querySelectorAll(".device-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".device-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const screen = document.getElementById("previewScreen");
    if (btn.dataset.device === "mobile") {
      screen.classList.add("mobile-view");
    } else {
      screen.classList.remove("mobile-view");
    }
  });
});

// ═══════════════════════════════════════════════
// FEATURE: PLANTILLAS PREDEFINIDAS
// ═══════════════════════════════════════════════
const PLANTILLAS = [
  {
    icon: "📢", name: "Anuncio", desc: "Comunicado general",
    titulo: "📢 Anuncio importante", subtitulo: "Por favor lee con atención",
    cuerpo: "Querido equipo, queremos informarte sobre una novedad importante que afecta a toda la organización. A partir del próximo lunes se implementará el nuevo proceso.",
    imagen: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "✅", name: "Aprobación", desc: "Solicitud de visto bueno",
    titulo: "✅ Solicitud de aprobación", subtitulo: "Tu validación es necesaria",
    cuerpo: "Se requiere tu aprobación para continuar con el proceso. Por favor revisa la información adjunta y confirma tu decisión antes del viernes.",
    imagen: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "📊", name: "Reporte", desc: "Resumen de resultados",
    titulo: "📊 Reporte semanal", subtitulo: "Resultados del equipo — Semana 12",
    cuerpo: "A continuación el resumen de los indicadores clave de esta semana. Los resultados muestran una tendencia positiva en los principales KPIs del departamento.",
    imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🎉", name: "Evento", desc: "Invitación o convocatoria",
    titulo: "🎉 Estás invitado", subtitulo: "No te lo pierdas",
    cuerpo: "Te invitamos a participar en nuestro próximo evento. Será una oportunidad única para conectar con el equipo y conocer los planes de la empresa para el próximo trimestre.",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "⚠️", name: "Alerta", desc: "Aviso urgente",
    titulo: "⚠️ Aviso urgente", subtitulo: "Requiere atención inmediata",
    cuerpo: "Se ha detectado una situación que requiere tu atención inmediata. Por favor toma las medidas necesarias y confirma la recepción de este mensaje.",
    imagen: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🏆", name: "Reconocimiento", desc: "Felicitación de logro",
    titulo: "🏆 ¡Felicitaciones!", subtitulo: "Has alcanzado un hito importante",
    cuerpo: "Nos complace reconocer tu excelente trabajo y dedicación. Tu contribución ha sido fundamental para el éxito del equipo. ¡Sigue así!",
    imagen: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "📅", name: "Recordatorio", desc: "Aviso de fecha / tarea",
    titulo: "📅 Recordatorio", subtitulo: "No olvides esta fecha",
    cuerpo: "Te recordamos que el próximo miércoles vence el plazo para entregar los informes trimestrales. Asegúrate de tener todo listo con antelación.",
    imagen: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🚀", name: "Lanzamiento", desc: "Nuevo producto o feature",
    titulo: "🚀 Nuevo lanzamiento", subtitulo: "Ya disponible para todos",
    cuerpo: "Con mucho orgullo anunciamos el lanzamiento de nuestra nueva funcionalidad. Está disponible desde hoy para todos los usuarios. ¡Esperamos que la disfrutes!",
    imagen: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "📋", name: "Acta de reunión", desc: "Resumen y acuerdos",
    titulo: "📋 Acta de reunión", subtitulo: "Resumen de acuerdos y próximos pasos",
    cuerpo: "A continuación se detallan los principales acuerdos alcanzados durante la reunión de hoy. Por favor revisa los puntos asignados y confirma tu disponibilidad para los próximos pasos.",
    imagen: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🎓", name: "Formación", desc: "Convocatoria formativa",
    titulo: "🎓 Nueva formación disponible", subtitulo: "Inscríbete antes de que se agoten las plazas",
    cuerpo: "Hemos habilitado un nuevo curso de formación para el equipo. La participación es voluntaria pero muy recomendada. Las plazas son limitadas, así que inscríbete cuanto antes.",
    imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "💡", name: "Propuesta", desc: "Idea o iniciativa nueva",
    titulo: "💡 Nueva propuesta", subtitulo: "Tu opinión nos importa",
    cuerpo: "Queremos compartir contigo una nueva propuesta que estamos valorando. Nos gustaría conocer tu opinión antes de tomar una decisión final. Puedes enviarnos tu feedback antes del viernes.",
    imagen: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🔧", name: "Mantenimiento", desc: "Aviso de interrupción",
    titulo: "🔧 Mantenimiento programado", subtitulo: "Interrupción del servicio",
    cuerpo: "Te informamos de que el próximo domingo realizaremos tareas de mantenimiento en los sistemas. El servicio estará interrumpido entre las 2:00 y las 6:00 h. Disculpa las molestias.",
    imagen: "https://images.unsplash.com/photo-1581092921461-39b9d08e47ce?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🤝", name: "Bienvenida", desc: "Incorporación al equipo",
    titulo: "🤝 ¡Bienvenido/a al equipo!", subtitulo: "Nos alegra tenerte con nosotros",
    cuerpo: "Es un placer darte la bienvenida a nuestra organización. En los próximos días recibirás toda la información necesaria para comenzar. No dudes en preguntar cualquier cosa al equipo.",
    imagen: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "📈", name: "Resultados", desc: "Informe de desempeño",
    titulo: "📈 Resultados del trimestre", subtitulo: "Balance y objetivos alcanzados",
    cuerpo: "Cerramos el trimestre con resultados muy positivos. Hemos superado los objetivos marcados en las principales áreas de negocio. Gracias a todo el equipo por el esfuerzo y dedicación.",
    imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🗳️", name: "Encuesta", desc: "Solicitud de feedback",
    titulo: "🗳️ Tu opinión importa", subtitulo: "Encuesta interna — 5 minutos",
    cuerpo: "Hemos preparado una breve encuesta para conocer tu experiencia y mejorar nuestros procesos. Solo te llevará 5 minutos. Tus respuestas son anónimas y muy valiosas para nosotros.",
    imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "💸", name: "Solo para Unai", desc: "Mensaje muy importante",
    titulo: "💸 Recordatorio urgente", subtitulo: "Atención: esto es solo para ti",
    cuerpo: "#UnaiPaganos 😘",
    imagen: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🌍", name: "Sostenibilidad", desc: "Iniciativa verde",
    titulo: "🌍 Compromiso con el planeta", subtitulo: "Nuestra iniciativa de sostenibilidad",
    cuerpo: "Como parte de nuestro compromiso medioambiental, lanzamos una nueva iniciativa para reducir nuestra huella de carbono. Te invitamos a participar y a compartir tus ideas con el equipo.",
    imagen: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🔒", name: "Seguridad", desc: "Aviso de ciberseguridad",
    titulo: "🔒 Aviso de seguridad", subtitulo: "Acción requerida por tu parte",
    cuerpo: "Hemos detectado actividad inusual en algunos accesos. Te pedimos que actualices tu contraseña y actives la verificación en dos pasos antes del próximo lunes. Gracias por tu colaboración.",
    imagen: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "💰", name: "Presupuesto", desc: "Aprobación de gastos",
    titulo: "💰 Revisión presupuestaria", subtitulo: "Cierre del ejercicio — acción necesaria",
    cuerpo: "Nos acercamos al cierre del ejercicio y necesitamos que revises y valides los presupuestos pendientes de tu área. Por favor envía tu confirmación antes del día 25 del mes en curso.",
    imagen: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "🏅", name: "Reto mensual", desc: "Desafío del equipo",
    titulo: "🏅 Reto del mes", subtitulo: "¿Aceptas el desafío?",
    cuerpo: "Este mes os lanzamos un nuevo reto para el equipo. El objetivo es mejorar nuestros tiempos de respuesta al cliente en un 15%. El equipo ganador recibirá un reconocimiento especial.",
    imagen: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=300&fit=crop&auto=format"
  },
  {
    icon: "📣", name: "Cambio org.", desc: "Reestructuración interna",
    titulo: "📣 Cambio organizativo", subtitulo: "Nueva estructura a partir del 1 de enero",
    cuerpo: "Queremos comunicarte un cambio en la estructura organizativa de nuestra área. A partir del próximo mes entrarán en vigor los nuevos organigramas. Recibirás más información en los próximos días.",
    imagen: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=300&fit=crop&auto=format"
  },

];

// tplGrid is now rendered inline in ensurePreviewPanel("plantillas")
// No global render needed here

function aplicarPlantilla(p) {
  // Título
  const tituloEl = document.getElementById("titulo");
  if (tituloEl) { tituloEl.textContent = p.titulo; }
  // Subtítulo
  const subEl = document.getElementById("subtitulo");
  if (subEl) { subEl.textContent = p.subtitulo; }
  // Imagen
  const imgEl = document.getElementById("imagen");
  if (imgEl) imgEl.value = p.imagen || "";
  // Limpiar bloques y crear uno con el cuerpo
  const editorEl = document.getElementById("editor");
  editorEl.innerHTML = "";
  const block = crearBloqueConTexto("parrafo", p.cuerpo);
  editorEl.appendChild(block);
  renderPreview();
  actualizarBotonEnviar();
}

function crearBloqueConTexto(tipo, texto) {
  const block = document.createElement("div");
  block.classList.add("block");
  const area = crearRichEditor("Escribe el párrafo…");
  area.textContent = texto;
  const topBtn = document.createElement("button");
  topBtn.type = "button"; topBtn.className = "add-btn add-top"; topBtn.title = "Añadir arriba"; topBtn.textContent = "+";
  const delBtn = document.createElement("button");
  delBtn.type = "button"; delBtn.className = "btn-delete"; delBtn.title = "Eliminar"; delBtn.textContent = "✕";
  const lbl = document.createElement("label"); lbl.textContent = "Párrafo";
  const botBtn = document.createElement("button");
  botBtn.type = "button"; botBtn.className = "add-btn add-bottom"; botBtn.title = "Añadir abajo"; botBtn.textContent = "+";
  block.appendChild(topBtn); block.appendChild(delBtn);
  block.appendChild(lbl); block.appendChild(area); block.appendChild(botBtn);
  delBtn.addEventListener("click", () => {
    if (document.getElementById("editor").querySelectorAll(".block").length > 1) { block.remove(); renderPreview(); }
    else mostrarErrorValidacion("Contenido requerido", "La tarjeta necesita al menos un bloque de contenido.", "Añade un bloque de texto o imagen desde el editor.");
  });
  block.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      mostrarDropdown(block, btn.classList.contains("add-top") ? "arriba" : "abajo", btn);
    });
  });
  return block;
}

// ═══════════════════════════════════════════════
// FEATURE: HISTORIAL Y BORRADORES (localStorage)
// ═══════════════════════════════════════════════
let currentHistTab = "borradores";

function getStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; }
}
function setStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { }
}

function getCardState() {
  const tituloEl = document.getElementById("titulo");
  const subEl = document.getElementById("subtitulo");
  const imgEl = document.getElementById("imagen");
  const canalEl = document.getElementById("canal");
  const emailsEl = document.getElementById("emails");
  const teamsEl = document.getElementById("teamsRecipient");

  const blocks = [];
  document.getElementById("editor").querySelectorAll(".block").forEach(block => {
    const rich = block.querySelector(".rich-editor-area");
    const url = block.querySelector("input[type='url']");
    if (rich && rich.dataset.singleline) blocks.push({ tipo: "titulo", html: rich.innerHTML });
    else if (rich) blocks.push({ tipo: "parrafo", html: rich.innerHTML });
    else if (url) blocks.push({ tipo: "imagen", value: url.value });
  });

  return {
    titulo: tituloEl?.innerText?.trim() || "",
    subtitulo: subEl?.innerText?.trim() || "",
    imagen: imgEl?.value?.trim() || "",
    canal: canalEl?.value || "",
    emails: emailsEl?.value || "",
    teamsRecipient: teamsEl?.value || "",
    blocks
  };
}

function guardarBorrador() {
  const state = getCardState();
  if (!state.titulo) { mostrarErrorValidacion("Título requerido", "El borrador necesita un título para guardarse.", "Escribe un título en el campo <strong>01 · Título</strong>."); return; }
  const borradores = getStorage("yako_borradores");
  const nuevo = { id: Date.now(), fecha: new Date().toLocaleString("es-ES"), tipo: "borrador", state };
  borradores.unshift(nuevo);
  setStorage("yako_borradores", borradores.slice(0, 20)); // max 20
  mostrarEnvioExito && showToast("✅ Borrador guardado");
}

function guardarEnviada(state) {
  const enviadas = getStorage("yako_enviadas");
  enviadas.unshift({ id: Date.now(), fecha: new Date().toLocaleString("es-ES"), tipo: "enviada", state });
  setStorage("yako_enviadas", enviadas.slice(0, 30));
}

function cargarEstado(state) {
  const tituloEl = document.getElementById("titulo");
  const subEl = document.getElementById("subtitulo");
  const imgEl = document.getElementById("imagen");
  const canalEl = document.getElementById("canal");
  const emailsEl = document.getElementById("emails");
  const teamsEl = document.getElementById("teamsRecipient");

  if (tituloEl) tituloEl.innerHTML = state.titulo || "";
  if (subEl) subEl.innerHTML = state.subtitulo || "";
  if (imgEl) imgEl.value = state.imagen || "";
  if (canalEl) { canalEl.value = state.canal || ""; canalEl.dispatchEvent(new Event("change")); }
  if (emailsEl) emailsEl.value = state.emails || "";
  if (teamsEl) teamsEl.value = state.teamsRecipient || "";

  // Rebuild blocks
  const editorEl = document.getElementById("editor");
  editorEl.innerHTML = "";
  (state.blocks || []).forEach(b => {
    if (b.tipo === "imagen") {
      crearBloque("imagen");
      const last = editorEl.lastElementChild;
      if (last) { const inp = last.querySelector("input[type='url']"); if (inp) inp.value = b.value || ""; }
    } else if (b.tipo === "titulo") {
      const block = crearBloqueConTexto("titulo", "");
      const area = block.querySelector(".rich-editor-area");
      if (area) area.innerHTML = b.html || "";
      editorEl.appendChild(block);
    } else {
      const block = crearBloqueConTexto("parrafo", "");
      const area = block.querySelector(".rich-editor-area");
      if (area) area.innerHTML = b.html || "";
      editorEl.appendChild(block);
    }
  });

  renderPreview();
  actualizarBotonEnviar();
  // panel is inline, no modal to close
}

function renderHistPanel() {
  const panel = document.getElementById("histPanel");
  const key = currentHistTab === "borradores" ? "yako_borradores" : "yako_enviadas";
  const items = getStorage(key);

  if (!items.length) {
    panel.innerHTML = `<div class="hist-empty"><div class="hist-empty-icon">${currentHistTab === "borradores" ? "📝" : "✅"}</div><p>${currentHistTab === "borradores" ? "No tienes borradores guardados." : "No hay tarjetas enviadas."}</p></div>`;
    return;
  }

  panel.innerHTML = `<div class="hist-list">${items.map((item, i) => `
    <div class="hist-item" data-i="${i}">
      <div class="hist-dot ${item.state?.canal || "teams"}"></div>
      <div class="hist-info">
        <div class="hist-title">${item.state?.titulo || "(sin título)"}</div>
        <div class="hist-meta">${item.state?.canal === "outlook" ? "Outlook" : "Teams"} · ${item.fecha}</div>
      </div>
      <span class="hist-badge ${item.tipo === "borrador" ? "hist-badge--draft" : "hist-badge--sent"}">${item.tipo === "borrador" ? "Borrador" : "✓ Enviada"}</span>
      <div class="hist-actions">
        ${currentHistTab === "borradores" ? `<button class="hist-btn" data-action="cargar" data-i="${i}">📂 Cargar</button>` : `<button class="hist-btn" data-action="clonar" data-i="${i}">🔁 Clonar</button>`}
        <button class="hist-btn hist-btn--del" data-action="borrar" data-i="${i}">🗑</button>
      </div>
    </div>`).join("")}</div>`;

  panel.querySelectorAll(".hist-btn[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.i;
      const items2 = getStorage(key);
      if (btn.dataset.action === "borrar") {
        items2.splice(idx, 1);
        setStorage(key, items2);
        renderHistPanel();
      } else {
        cargarEstado(items2[idx].state);
      }
    });
  });
}

// ═══════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════
function abrirModal(id) {
  document.getElementById(id)?.classList.remove("hidden");
}
function cerrarModal(id) {
  document.getElementById(id)?.classList.add("hidden");
}

// Wire open buttons (plantillas/historial are now inline in preview panel)

// Wire close buttons
document.getElementById("cerrarModalPlantillas")?.addEventListener("click", () => cerrarModal("modalPlantillas"));
document.getElementById("cerrarModalHistorial")?.addEventListener("click", () => cerrarModal("modalHistorial"));

// Close on overlay click
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.add("hidden");
  });
});

// Hist tabs
document.querySelectorAll(".hist-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".hist-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentHistTab = tab.dataset.htab;
    renderHistPanel();
  });
});

// Save draft button
document.getElementById("btnGuardarBorrador")?.addEventListener("click", guardarBorrador);

// History save is now handled inside mostrarOutputPanel()

// ═══════════════════════════════════════════════
// UX IMPROVEMENTS v3
// ═══════════════════════════════════════════════

// ── CHAR COUNTERS ─────────────────────────────
function addCharCounter(fieldId, max, label) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  const counter = document.createElement("div");
  counter.className = "char-counter";
  counter.dataset.fieldId = fieldId;
  el.parentNode.insertBefore(counter, el.nextSibling);

  function update() {
    const len = (el.innerText || el.value || "").trim().length;
    const pct = len / max;
    counter.textContent = `${len} / ${max}`;
    counter.className = "char-counter" + (pct >= 1 ? " limit" : pct >= .8 ? " warn" : "");
  }
  el.addEventListener("input", update);
  update();
}

// Wait until header fields are converted to contenteditable
setTimeout(() => {
  addCharCounter("titulo", 80, "Título");
  addCharCounter("subtitulo", 140, "Subtítulo");
}, 200);

// ── SEND BUTTON FEEDBACK (handled in mostrarOutputPanel) ──────────────────────

// Spin keyframe via JS (inject once)
if (!document.getElementById("spinStyle")) {
  const s = document.createElement("style");
  s.id = "spinStyle";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}

// ── DRAFT SAVED TOAST ─────────────────────────
function showToast(msg, type = "success") {
  const existing = document.querySelector(".yako-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "yako-toast";
  toast.innerHTML = msg;
  toast.style.cssText = `
    position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%) translateY(8px);
    background: ${type === "success" ? "#0f0f12" : "#d13438"};
    color: white; padding: 10px 20px; border-radius: 100px;
    font-family: var(--font, sans-serif); font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,.25); z-index: 9999;
    opacity: 0; transition: opacity .2s, transform .2s;
    letter-spacing: .01em; white-space: nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(8px)";
    setTimeout(() => toast.remove(), 220);
  }, 2500);
}

// Override guardarBorrador to use toast instead of alert
const _origGuardarBorrador = guardarBorrador;
window.guardarBorrador = function () {
  const state = getCardState();
  if (!state.titulo) { showToast("Añade un título antes de guardar", "error"); return; }
  const borradores = getStorage("yako_borradores");
  const nuevo = { id: Date.now(), fecha: new Date().toLocaleString("es-ES"), tipo: "borrador", state };
  borradores.unshift(nuevo);
  setStorage("yako_borradores", borradores.slice(0, 20));
  showToast("✓ Borrador guardado");
};
document.getElementById("btnGuardarBorrador").removeEventListener("click", guardarBorrador);
document.getElementById("btnGuardarBorrador").addEventListener("click", () => window.guardarBorrador());

// ── KEYBOARD SHORTCUT: Ctrl+S → save draft ────
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    window.guardarBorrador();
  }
});

// ── PLACEHOLDER COPY — rotate helpful tips ────
const TIPS = [
  "Tu tarjeta aparecerá aquí en tiempo real",
  "Escribe un título para empezar",
  "Prueba una plantilla para comenzar rápido",
  "Tu mensaje merece una gran presentación",
  "Cada gran comunicado empieza con una idea",
  "Convierte tu mensaje en algo memorable",
  "Las mejores noticias merecen la mejor tarjeta",
  "Un buen comunicado transforma la cultura del equipo",
  "Prueba una plantilla para empezar rápido 👆"
];
let tipIdx = 0;
setInterval(() => {
  const ph = document.querySelector(".card-placeholder p");
  if (!ph) return;
  tipIdx = (tipIdx + 1) % TIPS.length;
  ph.style.opacity = "0";
  setTimeout(() => { ph.textContent = TIPS[tipIdx]; ph.style.opacity = "1"; }, 300);
}, 4000);
const phEl = document.querySelector(".card-placeholder p");
if (phEl) phEl.style.transition = "opacity .3s";

// ═══════════════════════════════════════════════
// FEATURE: BIBLIOTECA DE IMÁGENES
// ═══════════════════════════════════════════════

// ── CORPORATE IMAGE LIBRARY ───────────────────
const IMG_LIBRARY = [
  {
    cat: "Cabeceras",
    items: [
      { id: "eq1", label: "Cabecera 1", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/Cabecera-Ayesa%20v1.png?csf=1&web=1&e=nd33p6" },
      { id: "eq2", label: "Cabecera 2", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/Cabecera-Ayesa%20v2.jpg?csf=1&web=1&e=b9Yt8O" },
      { id: "eq3", label: "Cabecera 3", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/Cabecera-Ayesa%20v3.jpg?csf=1&web=1&e=518p6f" },
    ]
  },
  {
    cat: "Generecias",
    items: [
      { id: "of1", label: "Generica 1", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_generico_1.jpg?csf=1&web=1&e=BbXRcr" },
      { id: "of2", label: "Generica 2", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_generico_2.jpg?csf=1&web=1&e=gv57hg" },
      { id: "of3", label: "Generica 3", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_generico_3.jpg?csf=1&web=1&e=mLUcxY" },
    ]
  },
  {
    cat: "Proyectos",
    items: [
      { id: "te1", label: "Puente", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_ing_1.jpg?csf=1&web=1&e=wzJ44M" },
      { id: "te2", label: "Edificio", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_ing_2.jpg?csf=1&web=1&e=5Aw8jg" },
      { id: "te3", label: "Bernabeu", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_ing_3.jpg?csf=1&web=1&e=IPLZ51" },
      { id: "te4", label: "Tren", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_ing_4.jpg?csf=1&web=1&e=kuGihb" },
      { id: "te5", label: "Torre", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams_ing_5.jpg?csf=1&web=1&e=6l0RJL" },
    ]
  },
  {
    cat: "Fondos",
    items: [
      { id: "ab1", label: "Gradiente azul", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams10.jpg?csf=1&web=1&e=gQ1rmF" },
      { id: "ab2", label: "Geometría", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams11.jpg?csf=1&web=1&e=BVLL8u" },
      { id: "ab3", label: "Minimalista", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams12.jpg?csf=1&web=1&e=Sh5f46" },
      { id: "ab4", label: "Textura clara", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams2.jpg?csf=1&web=1&e=UgvRnc" },
      { id: "ab5", label: "Textura clara", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams4.jpg?csf=1&web=1&e=Pog9j3" },
      { id: "ab6", label: "Textura clara", url: "https://grupoayesaa41015322.sharepoint.com/:i:/r/sites/DonBot/Documentos%20compartidos/General/Imagenes/teams5.jpg?csf=1&web=1&e=ZOrlMj" },
    ]
  }
];

// ── UPLOADED IMAGES (base64, session only) ─────
let uploadedImages = [];
try {
  const saved = localStorage.getItem("yako_uploaded_imgs");
  if (saved) uploadedImages = JSON.parse(saved);
} catch (e) { }

function saveUploadedImages() {
  try { localStorage.setItem("yako_uploaded_imgs", JSON.stringify(uploadedImages.slice(0, 20))); } catch (e) { }
}

// ── INSERT IMAGE DIALOG ────────────────────────
function mostrarInsertDialog(imgUrl, imgLabel) {
  document.getElementById("insertImgDialog")?.remove();

  const dialog = document.createElement("div");
  dialog.id = "insertImgDialog";
  dialog.style.cssText = `
    position:fixed; inset:0; z-index:2000;
    background:rgba(0,0,0,.5);
    display:flex; align-items:center; justify-content:center;
    padding:24px; animation:fadeIn .15s ease;
  `;
  dialog.innerHTML = `
    <div style="
      background:white; border-radius:16px; padding:28px;
      max-width:380px; width:100%;
      box-shadow:0 32px 80px rgba(0,0,0,.2);
      font-family:var(--font,sans-serif);
    ">
      <div style="font-family:var(--display,'DM Serif Display',serif);font-size:17px;font-style:italic;color:#0f0f12;margin-bottom:6px">
        Insertar imagen
      </div>
      <div style="font-size:12px;color:#999;margin-bottom:18px">${imgLabel}</div>
      <img src="${imgUrl}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:20px;border:1px solid #eee">
      <div style="display:flex;flex-direction:column;gap:8px">
        <button id="insertToHeader" style="
          padding:11px 16px;border-radius:8px;border:none;cursor:pointer;
          background:#0000D0;color:white;font-family:inherit;font-size:13px;font-weight:600;
          display:flex;align-items:center;gap:8px;
          transition:background .15s;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
          Usar como imagen de cabecera
        </button>
        <button id="insertToBlock" style="
          padding:11px 16px;border-radius:8px;cursor:pointer;
          background:white;color:#0000D0;font-family:inherit;font-size:13px;font-weight:600;
          border:1.5px solid rgba(0,0,208,.3);
          display:flex;align-items:center;gap:8px;
          transition:background .15s;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Insertar como bloque de imagen
        </button>
        <button id="insertCancel" style="
          padding:9px 16px;border-radius:8px;border:none;cursor:pointer;
          background:transparent;color:#aaa;font-family:inherit;font-size:13px;
          margin-top:2px;
        ">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // Insert as header
  document.getElementById("insertToHeader").addEventListener("click", () => {
    const imgEl = document.getElementById("imagen");
    if (imgEl) { imgEl.value = imgUrl; imgEl.dispatchEvent(new Event("input")); }
    dialog.remove();
    // Switch back to preview tab
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
    document.getElementById("channelSubtabs")?.classList.remove("hidden");
    showPreviewChrome(activeChannel);
    showToast("✅ Imagen de cabecera actualizada");
  });

  // Insert as block
  document.getElementById("insertToBlock").addEventListener("click", () => {
    const editorEl = document.getElementById("editor");
    crearBloque("imagen");
    const lastBlock = editorEl.lastElementChild;
    if (lastBlock) {
      const inp = lastBlock.querySelector("input[type='url']");
      if (inp) { inp.value = imgUrl; inp.dispatchEvent(new Event("input")); }
    }
    dialog.remove();
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
    document.getElementById("channelSubtabs")?.classList.remove("hidden");
    showPreviewChrome(activeChannel);
    showToast("✅ Bloque de imagen añadido");
  });

  document.getElementById("insertCancel").addEventListener("click", () => dialog.remove());
  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.remove(); });
}

// ── RENDER IMAGES PANEL ────────────────────────
function renderImagenesPanel(panel) {
  panel.innerHTML = `
    <div class="panel-section-hdr">
      <h2>🖼️ Biblioteca de imágenes</h2>
      <p>Imágenes corporativas o sube las tuyas propias</p>
    </div>

    <!-- Upload area -->
    <div class="img-upload-zone" id="imgUploadZone">
      <input type="file" id="imgFileInput" accept="image/*" multiple style="display:none">
      <div class="img-upload-inner" id="imgUploadInner">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>Arrastra imágenes aquí o <label for="imgFileInput" style="color:var(--ms-blue);cursor:pointer;font-weight:600;text-decoration:underline">selecciona archivos</label></span>
        <span style="font-size:11px;color:#bbb">PNG, JPG, WebP · Máx. 5MB por imagen</span>
      </div>
    </div>

    <!-- Uploaded images -->
    <div id="uploadedImgsSection" style="${uploadedImages.length ? '' : 'display:none'}">
      <div class="img-cat-header">
        <span>Mis imágenes</span>
        <button class="img-clear-btn" id="clearUploaded">Borrar todas</button>
      </div>
      <div class="img-grid" id="uploadedImgsGrid"></div>
    </div>

    <!-- Corporate library -->
    ${IMG_LIBRARY.map(cat => `
      <div class="img-cat-header"><span>${cat.cat}</span></div>
      <div class="img-grid">
        ${cat.items.map(img => `
          <div class="img-thumb" data-url="${img.url}" data-label="${img.label}" title="${img.label}">
            <img src="${img.url}" alt="${img.label}" loading="lazy">
            <div class="img-thumb-overlay"><span>${img.label}</span></div>
          </div>
        `).join("")}
      </div>
    `).join("")}
  `;

  // Render uploaded images
  renderUploadedGrid(panel);

  // Wire library thumbs
  panel.querySelectorAll(".img-thumb[data-url]").forEach(thumb => {
    thumb.addEventListener("click", () => {
      mostrarInsertDialog(thumb.dataset.url, thumb.dataset.label);
    });
  });

  // File input change
  const fileInput = panel.querySelector("#imgFileInput");
  fileInput.addEventListener("change", e => handleFiles(e.target.files, panel));

  // Drag & drop
  const zone = panel.querySelector("#imgUploadZone");
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault(); zone.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files, panel);
  });

  // Clear uploaded
  panel.querySelector("#clearUploaded")?.addEventListener("click", () => {
    uploadedImages = [];
    saveUploadedImages();
    renderUploadedGrid(panel);
  });
}

function renderUploadedGrid(panel) {
  const section = panel.querySelector("#uploadedImgsSection");
  const grid = panel.querySelector("#uploadedImgsGrid");
  if (!section || !grid) return;

  if (!uploadedImages.length) { section.style.display = "none"; return; }
  section.style.display = "";

  grid.innerHTML = uploadedImages.map((img, i) => `
    <div class="img-thumb" data-url="${img.url}" data-label="${img.label}" title="${img.label}" style="position:relative">
      <img src="${img.url}" alt="${img.label}">
      <div class="img-thumb-overlay"><span>${img.label}</span></div>
      <button class="img-del-btn" data-i="${i}" title="Eliminar">✕</button>
    </div>
  `).join("");

  grid.querySelectorAll(".img-thumb").forEach(thumb => {
    thumb.addEventListener("click", e => {
      if (e.target.closest(".img-del-btn")) return;
      mostrarInsertDialog(thumb.dataset.url, thumb.dataset.label);
    });
  });

  grid.querySelectorAll(".img-del-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      uploadedImages.splice(+btn.dataset.i, 1);
      saveUploadedImages();
      renderUploadedGrid(panel);
    });
  });
}

function handleFiles(files, panel) {
  const MAX = 5 * 1024 * 1024;
  Array.from(files).forEach(file => {
    if (!file.type.startsWith("image/")) { showToast("⚠️ Solo se admiten imágenes", "error"); return; }
    if (file.size > MAX) { showToast(`⚠️ ${file.name} supera los 5MB`, "error"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      uploadedImages.unshift({ url: e.target.result, label: file.name.replace(/\.[^.]+$/, "") });
      saveUploadedImages();
      renderUploadedGrid(panel);
      showToast(`✅ ${file.name} subida`);
    };
    reader.readAsDataURL(file);
  });
}

// ── PATCH ensurePreviewPanel for "imagenes" ────
const _origEnsure = ensurePreviewPanel;
ensurePreviewPanel = function (type) {
  if (type !== "imagenes") { _origEnsure(type); return; }

  const screen = document.getElementById("previewScreen");
  screen.querySelectorAll(".app-chrome").forEach(c => c.classList.add("hidden"));
  let panel = screen.querySelector(".preview-side-panel");
  if (panel) panel.remove();
  panel = document.createElement("div");
  panel.className = "preview-side-panel active";
  screen.appendChild(panel);
  renderImagenesPanel(panel);
};
// ═══════════════════════════════════════════════
// TOPBAR USER MENU
// ═══════════════════════════════════════════════
(function initUserMenu() {
  const rawName = sessionStorage.getItem("yako_user") || "Usuario";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initials = rawName.slice(0, 2).toUpperCase();

  const nameEl = document.getElementById("topbarUserName");
  const avatarEl = document.getElementById("topbarAvatar");
  const dNameEl = document.getElementById("topbarDName");
  const dEmailEl = document.getElementById("topbarDEmail");
  const btn = document.getElementById("topbarUserBtn");
  const dropdown = document.getElementById("topbarDropdown");
  const logoutBtn = document.getElementById("topbarLogout");

  if (nameEl) nameEl.textContent = displayName;
  if (avatarEl) avatarEl.textContent = initials;
  if (dNameEl) dNameEl.textContent = displayName;
  if (dEmailEl) dEmailEl.textContent = rawName.includes("@") ? rawName : rawName + "@ayesa.com";

  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      btn.classList.toggle("open", open);
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
      btn.classList.remove("open");
    });

    dropdown.addEventListener("click", (e) => e.stopPropagation());
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("yako_auth");
      sessionStorage.removeItem("yako_user");
      window.location.href = "login.html";
    });
  }
})();

document.getElementById("btnLimpiar").addEventListener("click", () => {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position:fixed; inset:0; z-index:2000;
    background:rgba(0,0,0,.45);
    display:flex; align-items:center; justify-content:center;
  `;

  modal.innerHTML = `
  <div style="
  background:white; border-radius:16px; padding:32px 28px 24px;
  max-width:340px; width:100%;
  box-shadow: 0 32px 80px rgba(0,0,0,.2);
  font-family:var(--font, sans-serif);
  text-align:center;
  ">
  <div style="font-size:36px; margin-bottom:14px">🗑️</div>
  <div style="font-size:17px; font-weight:700; color:#0f0f12; margin-bottom:10px">
    ¿Limpiar formualario?
  </div>
  <p style="font-size:13px; color:#888; line-height:1.6; margin-bottom:24px">
    Se borrarán todos los campos. Esta acción no se puede deshacer.
  </p>
  <div style="display:flex; gap:10px;">
        <button id="limpiarCancel" style="
          flex:1; height:42px; border-radius:9px;
          border:1.5px solid #e0e0e0; background:white;
          font-family:inherit; font-size:13px; font-weight:600;
          color:#666; cursor:pointer;
          ">Cancelar</button>
        <button id="limpiarOK" style="
          flex:1; height:42px; border-radius:9px; border:none;
          background:#d13438; color:white;
          font-family:inherit; font-size:13px; font-weight:700;
          cursor:pointer;
          ">Sí, limpiar</button>
        </div>
      </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("limpiarCancel").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  document.getElementById("limpiarOK").addEventListener("click", () => {
    modal.remove();

    document.getElementById("titulo").textContent = "";
    document.getElementById("subtitulo").textContent = "";
    document.getElementById("canal").value = "";

    const editor = document.getElementById("editor") = "";
    editor.innerHTML = "";
    crearBloque("parrafo");
    document.getElementById("canal").value = "";

    renderPreview();
    actualizarBotonEnviar();
  });
});

function mostrarPreviewPlantilla({titulo, subtitulo, imagenUrl, blocks, canal, badge, btnLabel, onConfirm}) {
  document.getElementById("popupPreviewModal")?.remove();

  const previewHTML = buildCardHTML({
    titulo: {text: titulo, html: titulo},
    subtitulo: {text: subtitulo, html: subtitulo},
    imagenUrl: imagenUrl || "",
    blocks: blocks || [],
    canal: canal || "",
    forModal: true
  });

  const modal = document.createElement("div");
  modal.id = "popupPreviewModal";
  modal.style.cssText = `
  position:fixed; inset:0; z-index:2000;
  background:rgba(0,0,0,.5);
  display:flex; align-items:center; justify-content:center;
  padding: 24px;
  `;

  modal.innerHTML = `
    <div style="
      background:white; border-radius:16px;
      max-width:500px; width:100%;
      box-shadow:0 32px 80px rgba(0,0,0,.22);
      font-family:var(--font,sans-serif);
      animation:msDropIn .2s cubic-bezier(.22,1,.36,1);
      overflow:hidden;
    ">
      <div style="
        padding:18px 22px 14px;
        border-bottom:1px solid #f0f0f0;
        display:flex; align-items:center; justify-content:space-between;
      ">
        <div style="font-size:14px; font-weight:700; color:#0f0f12">${badge || "Vista previa"}</div>
        <button id="popupPreviewClose" style="
          background:none; border:none; font-size:18px;
          color:#bbb; cursor:pointer;
        ">✕</button>
      </div>

      <div style="
        margin:16px 20px;
        border:1.5px solid #e8e8e8; border-radius:10px;<
        overflow:hidden; max-height:360px; overflow-y:auto;
        background:#fafafa;
      ">
        <div style="pointer-events:none;">${previewHTML}</div>
      </div>

      <div style="padding:8px 20px 20px; display:flex; gap:10px;">
        <button id="popupPreviewCancel" style="
          flex:1; height:42px; border-radius:9px;
          border:1.5px solid #e0e0e0; background:white;
          font-family:inherit; font-size:13px; font-weight:600;
          color:#666; cursor:pointer;
        ">Cancelar</button>
        <button id="popupPreviewOk" style="
          flex:2; height:42px; border-radius:9px; border:none;
          background:#0000D0; color:white;
          font-family:inherit; font-size:14px; font-weight:700;
          cursor:pointer;
        ">${btnLabel || "Usar"}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
  document.getElementById("popupPreviewClose").addEventListener("click", () => modal.remove());
  document.getElementById("popupPreviewCancel").addEventListener("click", () => modal.remove());
  document.getElementById("popupPreviewOk").addEventListener("click", () => {
    modal.remove();
    onConfirm();
  });

}