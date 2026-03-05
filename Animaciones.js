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
  if (!hasContent) return `<div class="card-placeholder"><div class="ph-icon">✦</div><p>Tu tarjeta aparecerá aquí mientras la diseñas</p></div>`;

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

tarjetaForm.addEventListener("submit", async e => {
  e.preventDefault();

  const bloques = [];
  editor.querySelectorAll(".block").forEach(block => {
    const campoRich = block.querySelector(".rich-editor-area");
    const inputUrl  = block.querySelector("input[type='url']");
    if (campoRich && campoRich.dataset.singleline) {
      bloques.push({ tipo: "titulo",  html: campoRich.innerHTML, text: campoRich.innerText.trim() });
    } else if (campoRich) {
      bloques.push({ tipo: "parrafo", html: campoRich.innerHTML, text: campoRich.innerText.trim() });
    } else if (inputUrl) {
      bloques.push({ tipo: "imagen",  value: inputUrl.value.trim() });
    }
  });

  const datosEnvio = new FormData();
  datosEnvio.append("titulo",         document.getElementById("titulo")?.innerText.trim()         ?? "");
  datosEnvio.append("subtitulo",      document.getElementById("subtitulo")?.innerText.trim()      ?? "");
  datosEnvio.append("imagen",         document.getElementById("imagen")?.value.trim()             ?? "");
  datosEnvio.append("canal",          canalSelect.value);
  datosEnvio.append("emails",         document.getElementById("emails")?.value.trim()             ?? "");
  datosEnvio.append("teamsRecipient", document.getElementById("teamsRecipient")?.value.trim()     ?? "");
  datosEnvio.append("bloques",        JSON.stringify(bloques));

  const botonEnviar = tarjetaForm.querySelector(".btn-submit");
  const spanBtn = botonEnviar.querySelector("span");
  const textoOriginal = spanBtn.textContent;
  botonEnviar.disabled = true;
  spanBtn.textContent = "Enviando…";

  try {
    const respuesta = await fetch("formulario.php", { method: "POST", body: datosEnvio });
    const resultado = await respuesta.json();

    spanBtn.textContent      = resultado.ok ? "✅ " + resultado.mensaje : "⚠️ " + resultado.mensaje;
    botonEnviar.style.background = resultado.ok ? "#22c55e" : "#ef4444";

    if (resultado.ok) {
      const state = getCardState();
      if (state.titulo) guardarEnviada(state);
    }
  } catch (err) {
    spanBtn.textContent      = "❌ Error de conexión";
    botonEnviar.style.background = "#ef4444";
  }

  setTimeout(() => {
    botonEnviar.disabled         = false;
    spanBtn.textContent          = textoOriginal;
    botonEnviar.style.background = "";
  }, 4000);
});

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

// Override form submit to also save to history
const origSubmit = tarjetaForm.onsubmit;
tarjetaForm.addEventListener("submit", e => {
  const state = getCardState();
  if (state.titulo) guardarEnviada(state);
});