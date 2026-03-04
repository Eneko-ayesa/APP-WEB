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
  this.value === "outlook" ? emailField.classList.remove("hidden") : emailField.classList.add("hidden");
  renderPreview(); syncTabToCanal(this.value);
});
function syncTabToCanal(val) {
  if (!val) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === val));
  document.getElementById("teamsChrome").classList.toggle("hidden", val === "outlook");
  document.getElementById("outlookChrome").classList.toggle("hidden", val !== "outlook");
}
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("teamsChrome").classList.toggle("hidden", tab.dataset.tab === "outlook");
    document.getElementById("outlookChrome").classList.toggle("hidden", tab.dataset.tab !== "outlook");
  });
});

tarjetaForm.addEventListener("submit", async e => {
  e.preventDefault();

  // Recoger los bloques dinámicos del editor y serializarlos
  const bloques = [];
  editor.querySelectorAll(".block").forEach(block => {
    const campoRich  = block.querySelector(".rich-editor-area");
    const inputUrl   = block.querySelector("input[type='url']");

    if (campoRich && campoRich.dataset.singleline) {
      bloques.push({ tipo: "titulo",  html: campoRich.innerHTML, text: campoRich.innerText.trim() });
    } else if (campoRich) {
      bloques.push({ tipo: "parrafo", html: campoRich.innerHTML, text: campoRich.innerText.trim() });
    } else if (inputUrl) {
      bloques.push({ tipo: "imagen",  value: inputUrl.value.trim() });
    }
  });

  // Construir el FormData con todos los campos del formulario
  const datosEnvio = new FormData();
  datosEnvio.append("titulo",    document.getElementById("titulo")?.innerText.trim()    ?? "");
  datosEnvio.append("subtitulo", document.getElementById("subtitulo")?.innerText.trim() ?? "");
  datosEnvio.append("imagen",    document.getElementById("imagen")?.value.trim()        ?? "");
  datosEnvio.append("canal",     canalSelect.value);
  datosEnvio.append("emails",    document.getElementById("emails")?.value.trim()        ?? "");
  datosEnvio.append("bloques",   JSON.stringify(bloques));

  // Feedback visual en el botón mientras se envía
  const botonEnviar        = tarjetaForm.querySelector(".btn-submit");
  const textoBotonOriginal = botonEnviar.querySelector("span").textContent;
  botonEnviar.disabled = true;
  botonEnviar.querySelector("span").textContent = "Enviando…";

  try {
    const respuesta = await fetch("formulario.php", { method: "POST", body: datosEnvio });
    const resultado = await respuesta.json();

    botonEnviar.querySelector("span").textContent = resultado.ok ? "✅ " + resultado.mensaje : "⚠️ " + resultado.mensaje;
    botonEnviar.style.background = resultado.ok ? "#22c55e" : "#ef4444";
  } catch (errorConexion) {
    botonEnviar.querySelector("span").textContent = "❌ Error de conexión";
    botonEnviar.style.background = "#ef4444";
  }

  // Restaurar el botón a su estado original tras 4 segundos
  setTimeout(() => {
    botonEnviar.disabled = false;
    botonEnviar.querySelector("span").textContent = textoBotonOriginal;
    botonEnviar.style.background = "";
  }, 4000);
});

// ── INIT ──────────────────────────────────────
initHeaderFields();

// imagen y emails siguen siendo inputs normales — registrar eventos
["imagen","emails"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", renderPreview);
});

crearBloque("parrafo");