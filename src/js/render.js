// HTML builders for the prototype components. Pure functions: state in, markup out.
// Elements marked .type-me are typed out by app.js; elements marked .reveal fade in after the text.
import { EQUIPMENT, USER, SUGGESTIONS, RECENTS, NAV, BASIS, CITE, SOURCES, RESPONSE, INSUFFICIENT } from './data.js';

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ICON = {
  plus: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  up: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 16V4M5 9l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  back: '<svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  chevron: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  close: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  download: '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M10 3.5v9M6 9l4 4 4-4M4 16h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  file: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6.5 3h7l4.5 4.5V20a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/><path d="M13.5 3v4.5H18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/></svg>',
  check: '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  camera: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4.5 8.5a1.5 1.5 0 0 1 1.5-1.5h1.6l1.1-1.7a1 1 0 0 1 .85-.45h4.9a1 1 0 0 1 .85.45L16.4 7H18a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/><circle cx="12" cy="12.8" r="3.2" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
  photos: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="4" y="4.5" width="16" height="15" rx="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="9" cy="10" r="1.6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="m5 17 4.5-4.5 3 3 2.5-2.5L19 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  files: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6.5 3h7l4.5 4.5V20a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/><path d="M13.5 3v4.5H18M12 17v-5.5M9.7 13.7 12 11.4l2.3 2.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  history: '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M3.5 10a6.5 6.5 0 1 0 2-4.7M3.5 3.8v3h3M10 6.5V10l2.5 1.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  alert: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M10 5.8v5M10 13.6v.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

// paragraph typed out by the engine while streaming (s = true), otherwise plain text
const tp = (cls, text, s) => `<p class="${cls} type-me" data-text="${esc(text)}">${s ? '' : esc(text)}</p>`;

export const pill = (label, kind = 'neutral') => `<span class="pill pill--${kind}">${esc(label)}</span>`;

// Every citation opens its source at the cited section. The one that blinks softly is the suggested next step.
export const citeBtn = (id, { primary = false } = {}) =>
  `<button class="cite${primary ? ' cite--blink' : ''}" data-action="cite" data-src="${id}" aria-label="Open source ${esc(CITE[id])}">${esc(CITE[id])}</button>`;
const citeList = (ids, opts) => `<div class="cites">${ids.map((id, i) => citeBtn(id, i === 0 ? opts : {})).join('')}</div>`;

export const header = (title, { back = false } = {}) => `
  <header class="header">
    ${back
      ? `<button class="icon-plain" data-action="back" aria-label="Back to conversation">${ICON.back}</button>`
      : `<button class="icon-plain" data-action="menu" aria-label="Open menu"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span></button>`}
    <h1 class="t-title">${esc(title)}</h1>
    ${back ? '<span class="icon-plain" aria-hidden="true"></span>' : `<span class="avatar" role="img" aria-label="${USER.name}, ${USER.role}">${USER.name[0]}</span>`}
  </header>`;

export const ctxBar = (firmware, fresh = false) => `
  <div class="ctx-bar${fresh ? ' ctx-bar--in' : ''}" role="status">
    <span class="dot" aria-hidden="true"></span>
    <span class="t-caption ctx-name">${esc(EQUIPMENT)}</span>
    ${firmware ? pill('Firmware ' + firmware, 'info') : pill('Firmware: not set', 'warning')}
  </div>`;

export const findingsPanel = (list, open) => `
  <section class="findings" aria-label="Findings so far">
    <button class="findings-head" data-action="toggle-findings" aria-expanded="${open}">
      <span class="t-body-strong">Findings so far</span>${pill(list.length, 'info')}
      <span class="t-caption findings-toggle">${open ? 'Hide' : 'Show'}</span>
    </button>
    ${open ? `<ul class="findings-list">${list.map(([k, v]) => `<li><span class="dot dot--sm" aria-hidden="true"></span><span class="t-caption finding-key">${esc(k)}</span><span class="t-body-strong">${esc(v)}</span></li>`).join('')}</ul>` : ''}
  </section>`;

export const homeView = () => `
  <div class="home">
    <h2 class="t-display">What are you working on, ${USER.name}?</h2>
    <p class="t-body muted">Ask about an error code, a procedure or a specification. Every answer shows its sources.</p>
    <p class="t-label muted">Suggested</p>
    <div class="suggest-list">
      ${SUGGESTIONS.map((s) => `
        <button class="suggest" data-action="suggest" data-flow="${s.flow}">
          <span class="suggest-text"><span class="t-label muted suggest-tag">${s.resume ? ICON.history : ''}${esc(s.tag)}</span><span class="t-body-strong">${esc(s.text)}</span></span>
          <span class="suggest-chevron">${ICON.chevron}</span>
        </button>`).join('')}
    </div>
  </div>`;

export const userMsg = (text) => `<div class="msg msg-user"><div class="bubble t-body">${esc(text)}</div></div>`;

const asstLabel = '<div class="asst-label t-meta"><span class="mark" aria-hidden="true"></span>Tess</div>';

export const typingMsg = () => `<div class="msg msg-asst" role="status" aria-label="Tess is typing">${asstLabel}<div class="dots" aria-hidden="true"><i></i><i></i><i></i></div></div>`;

const callout = (kind, title, lines) => `
  <div class="callout callout--${kind}">
    <p class="t-body-strong callout-title">${esc(title)}</p>
    ${lines.map(([text, ids]) => `<div class="callout-line"><p class="t-body">${esc(text)}</p>${citeList(ids)}</div>`).join('')}
  </div>`;

const basisLine = () => `<div class="basis reveal"><span class="t-caption">${esc(BASIS)}</span></div>`;

const responseBlock = (s, open) => `
  <div class="block">
    <div class="summary">
      <p class="t-label muted">Summary</p>
      ${tp('t-body-lg summary-text', RESPONSE.summary, s)}
      <div class="summary-meta reveal">${pill('Based on your answers', 'neutral')}${citeBtn('sm-5-3-1')}</div>
    </div>
    <div class="reveal">${callout('warning', 'Before you start', RESPONSE.warnings)}</div>
    <div class="steps reveal">
      <p class="t-label muted">Next steps</p>
      ${RESPONSE.steps.map(([t, cs], i) => `
        <div class="step"><span class="step-num t-meta">${i + 1}</span>
          <div class="step-body"><p class="t-body">${esc(t)}</p>${citeList(cs)}</div></div>`).join('')}
    </div>
    <div class="ruled-wrap reveal">
      <button class="ruled" data-action="toggle-ruled" aria-expanded="${open}">
        <span class="ruled-text"><span class="t-body-strong">Ruled out in this conversation (${RESPONSE.ruledOut.length})</span><span class="t-caption muted">Based on your answers, not verified by the assistant.</span></span><span class="ruled-chevron">${ICON.chevron}</span>
      </button>
      ${open ? `<ul class="ruled-list">${RESPONSE.ruledOut.map(([t, ids]) => `<li><p class="t-body">${esc(t)}</p>${citeList(ids)}</li>`).join('')}</ul>` : ''}
    </div>
    <div class="reveal">${callout('info', 'Not covered by the documents', RESPONSE.notCovered)}</div>
    ${basisLine()}
    <div class="followups reveal">
      <p class="t-label muted">Suggested follow-ups</p>
      ${RESPONSE.followups.map((f) => f.flow
        ? `<button class="chip chip--wide chip--active" data-action="followup" data-flow="${f.flow}">${esc(f.text)}</button>`
        : `<button class="chip chip--wide" data-action="hint-chip" aria-disabled="true">${esc(f.text)}</button>`).join('')}
    </div>
    <div class="actions reveal">
      <button class="btn btn--secondary" data-action="toast" data-msg="Connecting you to authorized support…">Contact authorized support</button>
    </div>
  </div>`;

const scheduleBlock = (s) => `
  <div class="block">
    ${tp('t-body-lg', 'The preventive maintenance schedule is in the Service Manual, section 6.1.', s)}
    <table class="mini-table reveal"><thead><tr><th>Interval</th><th>Task</th></tr></thead><tbody>
      <tr><td>Every use</td><td>Visual inspection of housing, door and latch</td></tr>
      <tr><td>6 months</td><td>Cleaning (6.2), battery check (6.3)</td></tr>
      <tr><td>12 months</td><td>Performance verification (section 7)</td></tr>
    </tbody></table>
    <div class="cites reveal">${citeBtn('sm-6-1')}</div>
    ${basisLine()}
  </div>`;

const insufficientBlock = (s) => `
  <div class="block">
    <div class="banner" role="alert">
      <p class="banner-title t-title">${ICON.alert}Not enough evidence</p>
      ${tp('t-body', INSUFFICIENT.message, s)}
    </div>
    <div class="reveal"><p class="t-label muted">What was found</p>
      <ul class="plain-list">${INSUFFICIENT.found.map(([t, id], i) => `<li><div class="found-item"><p class="t-body">${esc(t)}</p>${citeList([id])}</div></li>`).join('')}</ul></div>
    <div class="reveal"><p class="t-label muted">What was not found</p>
      <ul class="plain-list">${INSUFFICIENT.notFound.map((t) => `<li class="t-body">${esc(t)}</li>`).join('')}</ul></div>
    <div class="actions reveal">
      <button class="btn btn--primary" data-action="toast" data-msg="Connecting you to authorized support…">Contact authorized support</button>
      <button class="btn btn--secondary" data-action="toast" data-msg="Opening the official documentation…">Open official documentation</button>
      <button class="btn btn--ghost" data-action="reset">Start a new consultation</button>
    </div>
  </div>`;

export const asstMsg = (m) => {
  const s = !!m.stream;
  const body = m.kind === 'response' ? responseBlock(s, !!m.open) : m.kind === 'schedule' ? scheduleBlock(s) : m.kind === 'insufficient' ? insufficientBlock(s) : '';
  const paras = (m.paras || []).map((p) => tp('t-body-lg', p, s)).join('');
  const cites = m.cites && m.cites.length ? `<div class="cites reveal">${m.cites.map((c) => citeBtn(c)).join('')}</div>` : '';
  const chips = m.chips && m.awaiting
    ? `<div class="chips reveal" role="group" aria-label="Quick replies">${m.chips.map((c, i) => c.active
        ? `<button class="chip chip--active" data-action="chip" data-i="${i}">${esc(c.label)}</button>`
        : `<button class="chip chip--inactive" data-action="inactive" aria-disabled="true">${esc(c.label)}</button>`).join('')}</div>`
    : '';
  return `<div class="msg msg-asst${s ? ' is-streaming' : ''}">${asstLabel}${paras}${cites}${chips}${body}</div>`;
};

export const composer = (c) => {
  const field = c.mode === 'fill'
    ? `<button class="composer-field composer-field--fill" data-action="fill">${esc(c.placeholder)}</button>`
    : c.mode === 'ready' || c.mode === 'typing'
      ? `<div class="composer-field composer-field--ready"${c.mode === 'typing' ? ' data-action="skip-typing"' : ''}>${esc(c.text)}</div>`
      : `<div class="composer-field" aria-disabled="true">${esc(c.placeholder)}</div>`;
  const send = c.mode === 'ready'
    ? `<button class="icon-btn icon-btn--filled" data-action="send" aria-label="Send message">${ICON.up}</button>`
    : c.mode === 'typing'
      ? `<span class="icon-btn icon-btn--filled" aria-hidden="true">${ICON.up}</span>`
      : `<span class="icon-btn" aria-hidden="true">${ICON.up}</span>`;
  return `<footer class="composer composer--${c.mode}"><div class="composer-box"><button class="icon-btn" data-action="attach" aria-label="Add to session">${ICON.plus}</button>${field}${send}</div></footer>`;
};

export const sheetContent = () => `
  <span class="sheet-handle" aria-hidden="true"></span>
  <div class="sheet-head">
    <button class="icon-plain" data-action="close-attach" aria-label="Close">${ICON.close}</button>
    <h2 class="sheet-title">Add to session</h2>
    <span class="icon-plain" aria-hidden="true"></span>
  </div>
  <div class="sheet-grid">
    <button class="tile" data-action="pick"><span class="tile-ic">${ICON.camera}</span><span class="t-body">Camera</span></button>
    <button class="tile" data-action="pick"><span class="tile-ic">${ICON.photos}</span><span class="t-body">Photos</span></button>
    <button class="tile" data-action="pick"><span class="tile-ic">${ICON.files}</span><span class="t-body">Files</span></button>
  </div>`;

export const sidebarContent = () => `
  <div class="sb-top"><span class="mark" aria-hidden="true"></span><span class="t-title">Tess - AI Tech Copilot</span>
    <button class="icon-plain" data-action="close-menu" aria-label="Close menu">${ICON.close}</button></div>
  <button class="btn btn--secondary sb-new" data-action="reset"><span aria-hidden="true">+</span> New consultation</button>
  <div class="sb-search t-body muted">Search consultations</div>
  <nav class="sb-nav" aria-label="Library">${NAV.map((n) => `<button class="sb-item" data-action="inactive"><span class="sb-ic" aria-hidden="true"></span><span class="t-body">${esc(n)}</span></button>`).join('')}</nav>
  <div class="sb-recents">${RECENTS.map((g) => `
    <p class="t-label muted">${esc(g.group)}</p>
    ${g.items.map(([t, e]) => `<button class="recent" data-action="inactive"><span class="t-body-strong">${esc(t)}</span><span class="t-caption muted">${esc(e)}</span></button>`).join('')}`).join('')}</div>
  <div class="sb-profile"><span class="avatar avatar--lg" aria-hidden="true">${USER.name[0]}</span>
    <span class="sb-user"><span class="t-body-strong">${USER.name}</span><span class="t-caption muted">${USER.role}</span></span><span class="muted" aria-hidden="true">···</span></div>`;

const quoteBlock = (q) => {
  if (q.table) return `<table class="qtable"><thead><tr>${q.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${q.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  if (q.bullets) return `<ul class="qlist">${q.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
  return q.lines.map((l) => `<p>${esc(l)}</p>`).join('');
};

export const sourceBody = (id, firmware) => {
  const s = SOURCES[id];
  // "3.x" covers every 3.* firmware, "3.4.x" only itself
  const covers = (a, fw) => a === fw || (a.split('.').length === 2 && fw.startsWith(a.slice(0, -1)));
  const within = firmware ? s.applies.some((a) => covers(a, firmware)) : null;
  const check = within === null
    ? `<div class="vcheck vcheck--warn t-body-strong">Firmware is not set. Confirm the pump firmware (${s.applies.join(' or ')}) before applying this source.</div>`
    : `<div class="vcheck t-body-strong">Firmware ${esc(firmware)} in your context is within “Applies to”.</div>`;
  return `
    <div class="doc-card">
      <p class="doc-title t-title"><span class="cite">[${s.n}]</span><span>${esc(s.title)}</span></p>
      <dl class="meta">
        <dt>Document</dt><dd>${esc(s.docId)}</dd><dt>Revision</dt><dd>${esc(s.rev)}</dd>
        <dt>Approval</dt><dd>${esc(s.approval)}</dd><dt>Applies to</dt><dd>Firmware ${s.applies.join(', ')}</dd>
        <dt>Section</dt><dd>${esc(s.section)}</dd></dl>
      <button class="link" data-action="download" data-src="${id}">${ICON.download}<span>Download full manual · PDF · ${esc(s.size)}</span></button>
    </div>
    ${check}
    <section class="source-text" aria-label="Source text"><p class="t-label muted">Source text · quoted from the document</p>
      <div class="quote">${s.quote.map(quoteBlock).join('')}</div></section>
    <section class="explanation" aria-label="Assistant's explanation"><p class="t-label muted">Assistant's explanation · AI-generated, not part of the source</p>
      <p class="t-body">${esc(s.explanation)}</p></section>`;
};

// OS-style notification for the download of a manual
export const notif = ({ state, file, size }) => `
  <button class="notif-card" data-action="dismiss-notif" aria-label="Dismiss notification">
    <span class="notif-icon">${state === 'done' ? ICON.check : ICON.file}</span>
    <span class="notif-text">
      <span class="notif-head"><span>Downloads</span><span>now</span></span>
      <span class="notif-title">${state === 'done' ? 'Download complete' : 'Downloading…'}</span>
      <span class="notif-body">${esc(file)} · ${esc(size)}</span>
      ${state === 'done' ? '' : '<span class="notif-bar"><i></i></span>'}
    </span>
  </button>`;

export const sourceView = (id, firmware) => `
  ${header('Source', { back: true })}
  <div class="source-body">${sourceBody(id, firmware)}</div>
  <footer class="source-footer"><button class="btn btn--primary" data-action="back">Back to conversation</button></footer>`;
