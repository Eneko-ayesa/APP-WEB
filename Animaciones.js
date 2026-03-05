/* ═══════════════════════════════════════════════
   ADAPTIVE CARD BUILDER
   Toolbar global — funciona en todos los campos
   ═══════════════════════════════════════════════ */

const canalSelect   = document.getElementById("canal");
const emailField    = document.getElementById("emailField");
const teamsRecipientField = document.getElementById("teamsRecipientField");
const editor        = document.getElementById("editor");
const tarjetaForm   = document.getElementById("tarjetaForm");
const globalToolbar = document.getElementById("globalToolbar");
const gtbInner      = document.getElementById("gtbInner");

// ── IMAGE SIZE STORE ──────────────────────────
// maps block element → { width, headerHeight }
const imgSizes = new WeakMap();

// ── SVG ICONS ─────────────────────────────────
const I = {
  bold:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6zm0 8h9a4 4 0 0 1 0 8H6z"/></svg>`,
  italic:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
  underline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
  strike:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6c-.5-1.5-2-2.5-4-2.5-2.8 0-4 1.5-4 3 0 1 .4 1.8 1.2 2.3M8 18c.6 1.2 2 2 4 2 3 0 4.5-1.5 4.5-3"/></svg>`,
  ul:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  ol:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1V3L3.5 4M3 14h2v.5H3.5v1H5V17H3M4 21l1-1.5H3" stroke-width="1.5"/></svg>`,
  quote:     `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  alignL:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>`,
  alignC:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  alignR:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>`,
  link:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  emoji:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3"/></svg>`,
  undo:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>`,
  redo:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4.95"/></svg>`,
  colorA:    `<svg viewBox="0 0 24 24"><text x="4" y="18" font-size="15" font-weight="800" font-family="sans-serif" fill="currentColor">A</text></svg>`,
  pen:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
};

const EMOJIS = ["😊","😂","🔥","✨","👍","❤️","🚀","🎉","💡","⚠️","✅","❌",
  "📢","📌","📎","🔗","💬","🗓️","📊","📈","🎯","🏆","💪","👏",
  "🌟","💎","⚡","🔒","📧","📱","💻","🛠️","⚙️","📝","🖼️","🔔"];

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
  div.setAttribute("spellcheck","true");
  // copy inline styles / data attrs if any
  inputEl.parentNode.replaceChild(div, inputEl);
  registrarCampoEditable(div);
  return div;
}

// ── CONVERT HEADER FIELDS ON LOAD ─────────────
// We wait for DOM then replace them
function initHeaderFields() {
  ["titulo","subtitulo"].forEach(id => {
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
let savedRange   = null;

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
      if (e.key === "b") { e.preventDefault(); document.execCommand("bold");      updateActiveStates(); }
      if (e.key === "i") { e.preventDefault(); document.execCommand("italic");    updateActiveStates(); }
      if (e.key === "u") { e.preventDefault(); document.execCommand("underline"); updateActiveStates(); }
      if (e.key === "k") { e.preventDefault(); openLinkDialog(); }
    }
    // prevent newline in single-line fields (titulo, subtitulo, block-titulo)
    if (e.key === "Enter" && area.dataset.singleline) e.preventDefault();
  });

  area.addEventListener("keyup",   updateActiveStates);
  area.addEventListener("mouseup", updateActiveStates);
  area.addEventListener("input",   renderPreview);
}

// ═══════════════════════════════════════════════
// TOOLBAR WIRING
// ═══════════════════════════════════════════════

// Prevent losing selection on toolbar click
gtbInner.addEventListener("mousedown", e => {
  if (!["INPUT","SELECT"].includes(e.target.tagName)) e.preventDefault();
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
    } catch(e) {}
  }
  renderPreview();
}
gtbInner.querySelector(".gtb-fs-up").addEventListener("click",   () => { if(activeEditor) activeEditor.focus(); applySize(+sizeInput.value + 2); });
gtbInner.querySelector(".gtb-fs-down").addEventListener("click", () => { if(activeEditor) activeEditor.focus(); applySize(+sizeInput.value - 2); });
sizeInput.addEventListener("change", () => { if(activeEditor) activeEditor.focus(); applySize(+sizeInput.value); });

// text color
const tcInput = gtbInner.querySelector(".gtb-text-color");
const tcDot   = gtbInner.querySelector(".gtb-text-cdot");
tcInput.addEventListener("input", function () {
  tcDot.style.background = this.value;
  if (activeEditor) { activeEditor.focus(); document.execCommand("foreColor", false, this.value); renderPreview(); }
});

// highlight
const hlInput = gtbInner.querySelector(".gtb-hl-color");
const hlDot   = gtbInner.querySelector(".gtb-hl-cdot");
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
      tcInput.value = swatch.dataset.color.replace('#','') < 'aaaaaa' ? swatch.dataset.color : swatch.dataset.color;
      renderPreview();
    }
  });
});

// link dialog
document.getElementById("globalLinkOk").addEventListener("click", confirmLink);
document.getElementById("globalLinkCancel").addEventListener("click", () => linkDialog.classList.remove("open"));
document.getElementById("globalLinkInput").addEventListener("keydown", e => {
  if (e.key === "Enter")  confirmLink();
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

document.addEventListener("mouseup",  () => setTimeout(checkFloatShow, 15));
document.addEventListener("keyup",    () => setTimeout(checkFloatShow, 15));
function checkFloatShow() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !activeEditor || !activeEditor.contains(sel.anchorNode)) {
    floatTb.classList.remove("visible"); return;
  }
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  floatTb.classList.add("visible");
  const tbW = floatTb.offsetWidth || 200, tbH = floatTb.offsetHeight || 36;
  let left = rect.left + rect.width / 2 - tbW / 2;
  let top  = rect.top  - tbH - 8 + window.scrollY;
  left = Math.max(8, Math.min(left, window.innerWidth - tbW - 8));
  if (top < window.scrollY + 8) top = rect.bottom + 8 + window.scrollY;
  floatTb.style.left = left + "px";
  floatTb.style.top  = top  + "px";
}
document.addEventListener("mousedown", e => {
  if (!floatTb.contains(e.target)) floatTb.classList.remove("visible");
});

function updateActiveStates() {
  ["bold","italic","underline","strikeThrough"].forEach(cmd => {
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
    else alert("La tarjeta debe tener al menos un bloque de contenido.");
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
  const titulo    = getFieldValue("titulo");
  const subtitulo = getFieldValue("subtitulo");
  const imagenUrl = getFieldValue("imagen").text;
  const emails    = getFieldValue("emails").text;
  const teamsRecipient = document.getElementById("teamsRecipient")?.value?.trim() || "";
  const canal     = canalSelect.value;

  const blocks = [];
  editor.querySelectorAll(".block").forEach(block => {
    const rich = block.querySelector(".rich-editor-area");
    const url  = block.querySelector("input[type='url']");
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
  ["previewCard","previewCardOutlook"].forEach(id => {
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

function buildCardHTML({ titulo, subtitulo, imagenUrl, blocks, canal }) {
  const hasContent = titulo.text || imagenUrl || blocks.some(b => b.value || b.text);
  if (!hasContent) return `<div class="card-placeholder"><div class="ph-icon">✦</div><p>Empieza a escribir en el panel izquierdo y tu tarjeta tomará forma aquí</p></div>`;

  const headerPct = imgSizes.get("header") || 100;
  const hStyle = `width:${headerPct}%;`;
  let html = imagenUrl
    ? `<div class="header-img-resize-wrap" style="${hStyle}"><img class="card-header-img" src="${esc(imagenUrl)}" onerror="this.closest('.header-img-resize-wrap').style.display='none'" alt=""><div class="resize-handle-h"></div></div>`
    : titulo.text ? `<div class="card-header-img-placeholder">${titulo.html || esc(titulo.text)}</div>` : "";

  html += `<div class="card-body">`;
  if (titulo.html)    html += `<div class="card-title">${titulo.html}</div>`;
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
    const cls   = canal === "teams" ? "badge-teams" : "badge-outlook";
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
    const label  = wrap.querySelector(".resize-label");
    if (!handle) return;

    handle.addEventListener("mousedown", e => {
      e.preventDefault(); e.stopPropagation();
      wrap.classList.add("resizing");
      const startX   = e.clientX;
      const startW   = wrap.offsetWidth;
      const blockEl  = blocks[i]?.blockEl;

      function onMove(ev) {
        const newW = Math.max(60, Math.min(startW + (ev.clientX - startX), wrap.parentElement.offsetWidth));
        wrap.style.width = newW + "px";
        if (label) label.textContent = Math.round(newW) + "px";
        if (blockEl) imgSizes.set(blockEl, { ...(imgSizes.get(blockEl)||{}), width: Math.round(newW) });
      }
      function onUp() {
        wrap.classList.remove("resizing");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup",   onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup",   onUp);
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
        const startY  = e.clientY;
        const parentW = headerWrap.parentElement?.offsetWidth || headerWrap.offsetWidth || 400;
        const startW  = parseFloat(imgSizes.get("header") || 100); // % of parent

        function onMove(ev) {
          const delta  = (ev.clientY - startY);          // px dragged
          const pctDelta = (delta / parentW) * 100;      // convert to %
          const newPct = Math.max(20, Math.min(100, startW + pctDelta));
          headerWrap.style.width = newPct + "%";
          imgSizes.set("header", newPct);
        }
        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup",   onUp);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup",   onUp);
      });
    }
  }
}

function esc(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
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
  renderPreview(); syncTabToCanal(val);
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
  const teamsEl   = document.getElementById("teamsChrome");
  const outlookEl = document.getElementById("outlookChrome");
  const screen    = document.getElementById("previewScreen");
  // Hide any side panels
  screen?.querySelectorAll(".preview-side-panel").forEach(p => p.remove());
  if (teamsEl)   teamsEl.classList.toggle("hidden", val === "outlook");
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
        aplicarPlantilla(p);
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
        document.getElementById("channelSubtabs")?.classList.remove("hidden");
        showPreviewChrome(activeChannel);
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
  const key   = currentHistTab === "borradores" ? "yako_borradores" : "yako_enviadas";
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
        cargarEstado(items2[idx].state);
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelector('.tab[data-tab="teams"]')?.classList.add("active");
        document.getElementById("channelSubtabs")?.classList.remove("hidden");
        showPreviewChrome(activeChannel);
      }
    });
  });
}

tarjetaForm.addEventListener("submit", e => { e.preventDefault(); mostrarConfirmEnvio(); });

// ═══════════════════════════════════════════════
// CONFIRMACIÓN DE ENVÍO
// ═══════════════════════════════════════════════
function mostrarConfirmEnvio() {
  const canal = canalSelect.value;
  if (!canal) { showToast("⚠️ Selecciona un canal antes de enviar", "error"); return; }

  const titulo = getFieldValue("titulo");
  if (!titulo.text) { showToast("⚠️ Añade un título antes de enviar", "error"); return; }

  const canalLabel = canal === "teams" ? "Microsoft Teams" : "Outlook";
  const canalIcon  = canal === "teams" ? "📤" : "📧";

  document.getElementById("confirmEnvioModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "confirmEnvioModal";
  modal.style.cssText = `
    position:fixed;inset:0;z-index:2000;
    background:rgba(0,0,0,.45);
    display:flex;align-items:center;justify-content:center;
    padding:24px;
  `;
  modal.style.animation = "fadeIn .15s ease";

  modal.innerHTML = `
    <div style="
      background:white;border-radius:16px;padding:32px 28px 24px;
      max-width:360px;width:100%;
      box-shadow:0 32px 80px rgba(0,0,0,.2),0 0 0 1px rgba(0,0,0,.06);
      font-family:var(--font,sans-serif);
      animation:msDropIn .2s cubic-bezier(.22,1,.36,1);
    ">
      <div style="font-size:36px;margin-bottom:14px;text-align:center">${canalIcon}</div>
      <div style="font-size:18px;font-weight:700;color:#0f0f12;margin-bottom:8px;text-align:center;letter-spacing:-.01em">
        ¿Enviar la tarjeta?
      </div>
      <p style="font-size:13px;color:#888;text-align:center;line-height:1.6;margin-bottom:24px">
        Se enviará <strong style="color:#0f0f12">"${titulo.text.slice(0,50)}${titulo.text.length>50?'…':''}"</strong>
        a través de <strong style="color:#0000D0">${canalLabel}</strong>.
        Esta acción no se puede deshacer.
      </p>
      <div style="display:flex;gap:10px">
        <button id="confirmEnvioCancel" style="
          flex:1;height:42px;border-radius:9px;
          border:1.5px solid #e0e0e0;background:white;
          font-family:inherit;font-size:13px;font-weight:600;
          color:#666;cursor:pointer;transition:background .15s;
        ">Cancelar</button>
        <button id="confirmEnvioOk" style="
          flex:1;height:42px;border-radius:9px;border:none;
          background:#0000D0;color:white;
          font-family:inherit;font-size:13px;font-weight:700;
          cursor:pointer;transition:background .15s,box-shadow .15s;
          box-shadow:0 2px 10px rgba(0,0,208,.3);
        ">Sí, enviar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  document.getElementById("confirmEnvioCancel").addEventListener("click", () => modal.remove());

  document.getElementById("confirmEnvioOk").addEventListener("click", () => {
    modal.remove();
    ejecutarEnvio();
  });
}

function ejecutarEnvio() {
  const state = getCardState();
  if (state.titulo) guardarEnviada(state);

  // Visual feedback on button
  const btn = tarjetaForm.querySelector(".btn-submit");
  if (btn) {
    const orig = btn.innerHTML;
    btn.style.background = "#107c10";
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Enviada!`;
    setTimeout(() => {
      btn.style.background = "";
      btn.innerHTML = orig;
    }, 2500);
  }
  showToast("✅ Tarjeta enviada correctamente");
}

function buildCardJSON({ titulo, subtitulo, imagenUrl, blocks }) {
  // Microsoft Adaptive Card schema v1.4
  const body = [];

  // Header image
  if (imagenUrl) {
    body.push({
      type: "Image",
      url: imagenUrl,
      size: "stretch",
      altText: titulo.text || "Imagen de cabecera"
    });
  }

  // Title container with accent color bar
  if (titulo.text) {
    body.push({
      type: "TextBlock",
      text: titulo.text,
      weight: "Bolder",
      size: "Large",
      wrap: true,
      color: "Default"
    });
  }

  // Subtitle
  if (subtitulo.text) {
    body.push({
      type: "TextBlock",
      text: subtitulo.text,
      size: "Small",
      isSubtle: true,
      wrap: true
    });
  }

  // Separator before body blocks
  if (titulo.text && blocks.some(b => b.text || b.value)) {
    body.push({ type: "Container", style: "emphasis", bleed: false, items: [], spacing: "Small" });
  }

  // Content blocks
  blocks.forEach(b => {
    if (b.tipo === "titulo" && b.text) {
      body.push({
        type: "TextBlock",
        text: b.text,
        weight: "Bolder",
        size: "Medium",
        wrap: true,
        spacing: "Medium"
      });
    } else if (b.tipo === "parrafo" && b.text) {
      // Strip HTML tags for plain text in AC
      const plain = b.text;
      body.push({
        type: "TextBlock",
        text: plain,
        wrap: true,
        spacing: "Small",
        color: "Default"
      });
    } else if (b.tipo === "imagen" && b.value) {
      body.push({
        type: "Image",
        url: b.value,
        size: "stretch",
        spacing: "Small"
      });
    }
  });

  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body
        }
      }
    ]
  };
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
        ">${outputStr.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
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
    } catch(e) {
      showToast("❌ No se pudo copiar al portapapeles", "error");
    }
  });
}

// ── INIT ──────────────────────────────────────
initHeaderFields();

// imagen y emails siguen siendo inputs normales — registrar eventos
["imagen","emails","teamsRecipient"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", renderPreview);
});

crearBloque("parrafo");
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
    imagen: ""
  },
  {
    icon: "✅", name: "Aprobación", desc: "Solicitud de visto bueno",
    titulo: "✅ Solicitud de aprobación", subtitulo: "Tu validación es necesaria",
    cuerpo: "Se requiere tu aprobación para continuar con el proceso. Por favor revisa la información adjunta y confirma tu decisión antes del viernes.",
    imagen: ""
  },
  {
    icon: "📊", name: "Reporte", desc: "Resumen de resultados",
    titulo: "📊 Reporte semanal", subtitulo: "Resultados del equipo — Semana 12",
    cuerpo: "A continuación el resumen de los indicadores clave de esta semana. Los resultados muestran una tendencia positiva en los principales KPIs del departamento.",
    imagen: ""
  },
  {
    icon: "🎉", name: "Evento", desc: "Invitación o convocatoria",
    titulo: "🎉 Estás invitado", subtitulo: "No te lo pierdas",
    cuerpo: "Te invitamos a participar en nuestro próximo evento. Será una oportunidad única para conectar con el equipo y conocer los planes de la empresa para el próximo trimestre.",
    imagen: ""
  },
  {
    icon: "⚠️", name: "Alerta", desc: "Aviso urgente",
    titulo: "⚠️ Aviso urgente", subtitulo: "Requiere atención inmediata",
    cuerpo: "Se ha detectado una situación que requiere tu atención inmediata. Por favor toma las medidas necesarias y confirma la recepción de este mensaje.",
    imagen: ""
  },
  {
    icon: "🏆", name: "Reconocimiento", desc: "Felicitación de logro",
    titulo: "🏆 ¡Felicitaciones!", subtitulo: "Has alcanzado un hito importante",
    cuerpo: "Nos complace reconocer tu excelente trabajo y dedicación. Tu contribución ha sido fundamental para el éxito del equipo. ¡Sigue así!",
    imagen: ""
  },
  {
    icon: "📅", name: "Recordatorio", desc: "Aviso de fecha / tarea",
    titulo: "📅 Recordatorio", subtitulo: "No olvides esta fecha",
    cuerpo: "Te recordamos que el próximo miércoles vence el plazo para entregar los informes trimestrales. Asegúrate de tener todo listo con antelación.",
    imagen: ""
  },
  {
    icon: "🚀", name: "Lanzamiento", desc: "Nuevo producto o feature",
    titulo: "🚀 Nuevo lanzamiento", subtitulo: "Ya disponible para todos",
    cuerpo: "Con mucho orgullo anunciamos el lanzamiento de nuestra nueva funcionalidad. Está disponible desde hoy para todos los usuarios. ¡Esperamos que la disfrutes!",
    imagen: ""
  }
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
    else alert("La tarjeta debe tener al menos un bloque de contenido.");
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
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch(e) { return []; }
}
function setStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

function getCardState() {
  const tituloEl = document.getElementById("titulo");
  const subEl    = document.getElementById("subtitulo");
  const imgEl    = document.getElementById("imagen");
  const canalEl  = document.getElementById("canal");
  const emailsEl = document.getElementById("emails");
  const teamsEl  = document.getElementById("teamsRecipient");

  const blocks = [];
  document.getElementById("editor").querySelectorAll(".block").forEach(block => {
    const rich = block.querySelector(".rich-editor-area");
    const url  = block.querySelector("input[type='url']");
    if (rich && rich.dataset.singleline) blocks.push({ tipo: "titulo",   html: rich.innerHTML });
    else if (rich)                         blocks.push({ tipo: "parrafo", html: rich.innerHTML });
    else if (url)                          blocks.push({ tipo: "imagen",  value: url.value });
  });

  return {
    titulo:    tituloEl?.innerText?.trim() || "",
    subtitulo: subEl?.innerText?.trim()    || "",
    imagen:    imgEl?.value?.trim()        || "",
    canal:     canalEl?.value              || "",
    emails:    emailsEl?.value             || "",
    teamsRecipient: teamsEl?.value         || "",
    blocks
  };
}

function guardarBorrador() {
  const state = getCardState();
  if (!state.titulo) { alert("Añade al menos un título para guardar el borrador."); return; }
  const borradores = getStorage("yako_borradores");
  const nuevo = { id: Date.now(), fecha: new Date().toLocaleString("es-ES"), tipo: "borrador", state };
  borradores.unshift(nuevo);
  setStorage("yako_borradores", borradores.slice(0, 20)); // max 20
  alert("✅ Borrador guardado correctamente.");
}

function guardarEnviada(state) {
  const enviadas = getStorage("yako_enviadas");
  enviadas.unshift({ id: Date.now(), fecha: new Date().toLocaleString("es-ES"), tipo: "enviada", state });
  setStorage("yako_enviadas", enviadas.slice(0, 30));
}

function cargarEstado(state) {
  const tituloEl = document.getElementById("titulo");
  const subEl    = document.getElementById("subtitulo");
  const imgEl    = document.getElementById("imagen");
  const canalEl  = document.getElementById("canal");
  const emailsEl = document.getElementById("emails");
  const teamsEl  = document.getElementById("teamsRecipient");

  if (tituloEl) tituloEl.innerHTML = state.titulo || "";
  if (subEl)    subEl.innerHTML    = state.subtitulo || "";
  if (imgEl)    imgEl.value        = state.imagen || "";
  if (canalEl)  { canalEl.value = state.canal || ""; canalEl.dispatchEvent(new Event("change")); }
  if (emailsEl) emailsEl.value     = state.emails || "";
  if (teamsEl)  teamsEl.value      = state.teamsRecipient || "";

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
  // panel is inline, no modal to close
}

function renderHistPanel() {
  const panel = document.getElementById("histPanel");
  const key   = currentHistTab === "borradores" ? "yako_borradores" : "yako_enviadas";
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
      const idx    = +btn.dataset.i;
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
// FEATURE: GENERACIÓN CON IA
// ═══════════════════════════════════════════════
let iaSelectedLang = "es";

document.querySelectorAll(".ia-lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ia-lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    iaSelectedLang = btn.dataset.lang;
  });
});

const LANG_NAMES = { es:"español", en:"English", fr:"français", de:"Deutsch", pt:"português" };

document.getElementById("iaGenerateBtn").addEventListener("click", async () => {
  const prompt  = document.getElementById("iaPrompt").value.trim();
  if (!prompt) { alert("Escribe una descripción para generar la tarjeta."); return; }

  const btn    = document.getElementById("iaGenerateBtn");
  const status = document.getElementById("iaStatus");
  btn.disabled = true;
  document.getElementById("iaBtnText").textContent = "✨ Generando…";
  status.textContent = "La IA está creando tu tarjeta…";
  status.className = "ia-status";

  const langName = LANG_NAMES[iaSelectedLang] || "español";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Eres un asistente que crea tarjetas adaptativas para Microsoft Teams y Outlook.

El usuario quiere: "${prompt}"

Responde SOLO con un JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
  "titulo": "Título corto y llamativo con emoji",
  "subtitulo": "Subtítulo conciso",
  "cuerpo": "Contenido del cuerpo en 2-3 frases. Tono profesional.",
  "canal": "teams"
}

El idioma de salida debe ser: ${langName}
El campo "canal" puede ser "teams" o "outlook" según el contexto.`
        }]
      })
    });

    const data = await res.json();
    const text = data.content?.map(c => c.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Apply to form
    const tituloEl = document.getElementById("titulo");
    const subEl    = document.getElementById("subtitulo");
    const canalEl  = document.getElementById("canal");
    if (tituloEl) tituloEl.textContent = parsed.titulo || "";
    if (subEl)    subEl.textContent    = parsed.subtitulo || "";
    if (canalEl && parsed.canal) { canalEl.value = parsed.canal; canalEl.dispatchEvent(new Event("change")); }

    // Set body block
    const editorEl = document.getElementById("editor");
    editorEl.innerHTML = "";
    const block = crearBloqueConTexto("parrafo", parsed.cuerpo || "");
    editorEl.appendChild(block);
    renderPreview();

    status.textContent = "✅ ¡Tarjeta generada! Puedes editarla libremente.";
    status.classList.remove("error");
    setTimeout(() => cerrarModal("modalIA"), 1500);
  } catch(e) {
    status.textContent = "❌ Error al generar. Revisa tu conexión e inténtalo de nuevo.";
    status.classList.add("error");
  } finally {
    btn.disabled = false;
    document.getElementById("iaBtnText").textContent = "✨ Generar tarjeta";
  }
});

// ═══════════════════════════════════════════════
// FEATURE: MULTI-IDIOMA
// ═══════════════════════════════════════════════
let langSelected = new Set(["es"]);

document.querySelectorAll(".lang-sel-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    if (lang === "es") return; // always keep ES (source)
    if (langSelected.has(lang)) {
      langSelected.delete(lang);
      btn.classList.remove("active");
    } else {
      langSelected.add(lang);
      btn.classList.add("active");
    }
  });
});

document.getElementById("langTranslateBtn").addEventListener("click", async () => {
  const state   = getCardState();
  const tituloTxt  = state.titulo;
  const subTxt     = state.subtitulo;
  const cuerpoHtml = (state.blocks[0]?.html) || "";
  const cuerpoTxt  = (state.blocks[0]?.html || "").replace(/<[^>]+>/g, "");

  if (!tituloTxt && !cuerpoTxt) { alert("Rellena al menos el título antes de traducir."); return; }

  const area       = document.getElementById("langContentArea");
  const btn        = document.getElementById("langTranslateBtn");
  btn.disabled     = true;
  btn.textContent  = "🌍 Traduciendo…";
  area.innerHTML   = '<div style="text-align:center;padding:30px;color:var(--ms-ink-3)">⏳ Generando traducciones…</div>';

  // Always show ES source
  const results = [{ lang: "es", flag: "🇪🇸", titulo: tituloTxt, subtitulo: subTxt, cuerpo: cuerpoTxt }];

  const toTranslate = [...langSelected].filter(l => l !== "es");
  const LANG_LABELS = { es:"Español", en:"English", fr:"Français", de:"Deutsch", pt:"Português" };
  const FLAGS       = { es:"🇪🇸", en:"🇬🇧", fr:"🇫🇷", de:"🇩🇪", pt:"🇵🇹" };

  for (const lang of toTranslate) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{
            role: "user",
            content: `Traduce al ${LANG_NAMES[lang]} el siguiente contenido de una tarjeta corporativa.
Responde SOLO con JSON sin markdown:
{
  "titulo": "...",
  "subtitulo": "...",
  "cuerpo": "..."
}

Título: ${tituloTxt}
Subtítulo: ${subTxt}
Cuerpo: ${cuerpoTxt}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      results.push({ lang, flag: FLAGS[lang], titulo: parsed.titulo, subtitulo: parsed.subtitulo, cuerpo: parsed.cuerpo });
    } catch(e) {
      results.push({ lang, flag: FLAGS[lang], titulo: "Error", subtitulo: "", cuerpo: "No se pudo traducir." });
    }
  }

  // Render results
  area.innerHTML = results.map(r => `
    <div class="lang-result-item" data-lang="${r.lang}">
      <div class="lang-result-header">
        <span>${r.flag} ${LANG_LABELS[r.lang] || r.lang}</span>
        ${r.lang !== "es" ? `<button class="lang-copy-btn" data-lang="${r.lang}">📋 Usar esta versión</button>` : "<span style='font-size:10px;color:var(--ms-ink-3)'>Original</span>"}
      </div>
      <div class="lang-result-body">
        <div class="lang-field-row"><label>Título</label><input type="text" value="${(r.titulo||"").replace(/"/g,"&quot;")}" data-field="titulo" data-lang="${r.lang}"></div>
        <div class="lang-field-row"><label>Subtítulo</label><input type="text" value="${(r.subtitulo||"").replace(/"/g,"&quot;")}" data-field="subtitulo" data-lang="${r.lang}"></div>
        <div class="lang-field-row"><label>Cuerpo</label><textarea rows="3" data-field="cuerpo" data-lang="${r.lang}">${r.cuerpo||""}</textarea></div>
      </div>
    </div>`).join("");

  area.querySelectorAll(".lang-copy-btn").forEach(b => {
    b.addEventListener("click", () => {
      const lang = b.dataset.lang;
      const item = area.querySelector(`.lang-result-item[data-lang="${lang}"]`);
      const titulo    = item.querySelector("[data-field='titulo']").value;
      const subtitulo = item.querySelector("[data-field='subtitulo']").value;
      const cuerpo    = item.querySelector("[data-field='cuerpo']").value;
      const tituloEl  = document.getElementById("titulo");
      const subEl     = document.getElementById("subtitulo");
      if (tituloEl) tituloEl.textContent = titulo;
      if (subEl)    subEl.textContent    = subtitulo;
      const editorEl = document.getElementById("editor");
      editorEl.innerHTML = "";
      editorEl.appendChild(crearBloqueConTexto("parrafo", cuerpo));
      renderPreview();
      cerrarModal("modalLang");
    });
  });

  btn.disabled    = false;
  btn.textContent = "🌍 Traducir seleccionados";
});

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
document.getElementById("btnIA")?.addEventListener("click", () => {
  document.getElementById("iaStatus").className = "ia-status hidden";
  abrirModal("modalIA");
});
document.getElementById("btnLang")?.addEventListener("click", () => {
  document.getElementById("langContentArea").innerHTML = "";
  abrirModal("modalLang");
});

// Wire close buttons
document.getElementById("cerrarModalPlantillas")?.addEventListener("click", () => cerrarModal("modalPlantillas"));
document.getElementById("cerrarModalHistorial")?.addEventListener("click",  () => cerrarModal("modalHistorial"));
document.getElementById("cerrarModalIA")?.addEventListener("click",         () => cerrarModal("modalIA"));
document.getElementById("cerrarModalLang")?.addEventListener("click",       () => cerrarModal("modalLang"));

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
  addCharCounter("titulo",    80, "Título");
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
window.guardarBorrador = function() {
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
  "Pulsa ✨ para generar con IA",
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
    cat: "Equipo",
    items: [
      { id: "eq1", label: "Reunión de equipo",    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
      { id: "eq2", label: "Colaboración",         url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80" },
      { id: "eq3", label: "Presentación",         url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80" },
      { id: "eq4", label: "Trabajo en equipo",    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" },
    ]
  },
  {
    cat: "Oficina",
    items: [
      { id: "of1", label: "Espacio de trabajo",   url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
      { id: "of2", label: "Sala de reuniones",    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e23?w=800&q=80" },
      { id: "of3", label: "Escritorio moderno",   url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80" },
      { id: "of4", label: "Zona colaborativa",    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80" },
    ]
  },
  {
    cat: "Tecnología",
    items: [
      { id: "te1", label: "Laptop y datos",       url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
      { id: "te2", label: "Código",               url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80" },
      { id: "te3", label: "Dashboard",            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
      { id: "te4", label: "Conectividad",         url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
    ]
  },
  {
    cat: "Abstracto",
    items: [
      { id: "ab1", label: "Gradiente azul",       url: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80" },
      { id: "ab2", label: "Geometría",            url: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80" },
      { id: "ab3", label: "Minimalista",          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
      { id: "ab4", label: "Textura clara",        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
    ]
  }
];

// ── UPLOADED IMAGES (base64, session only) ─────
let uploadedImages = [];
try {
  const saved = localStorage.getItem("yako_uploaded_imgs");
  if (saved) uploadedImages = JSON.parse(saved);
} catch(e) {}

function saveUploadedImages() {
  try { localStorage.setItem("yako_uploaded_imgs", JSON.stringify(uploadedImages.slice(0, 20))); } catch(e) {}
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
  const grid    = panel.querySelector("#uploadedImgsGrid");
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
ensurePreviewPanel = function(type) {
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