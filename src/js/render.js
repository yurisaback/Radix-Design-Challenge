// HTML builders for the prototype components. Pure functions: state in, markup out.
import { EQUIPMENT, USER, SUGGESTIONS, RECENTS, NAV, BASIS, SOURCES, RESPONSE, INSUFFICIENT } from './data.js';

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ICON = {
  plus: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  up: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 16V4M5 9l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  back: '<svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  chevron: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  close: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  alert: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M10 5.8v5M10 13.6v.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

export const pill = (label, kind = 'neutral') => `<span class="pill pill--${kind}">${esc(label)}</span>`;

export const citeBtn = (label, { src = null, active = false } = {}) =>
  active
    ? `<button class="cite cite--active" data-action="cite" data-src="${src}" aria-label="Open source ${esc(label)}">${esc(label)}</button>`
    : `<button class="cite" data-action="inactive" aria-disabled="true">${esc(label)}</button>`;

export const header = (title, { back = false } = {}) => `
  <header class="header">
    ${back
      ? `<button class="icon-plain" data-action="back" aria-label="Back to answer">${ICON.back}</button>`
      : `<button class="icon-plain" data-action="menu" aria-label="Open menu"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span></button>`}
    <h1 class="t-title">${esc(title)}</h1>
    ${back ? '<span class="icon-plain" aria-hidden="true"></span>' : `<span class="avatar" role="img" aria-label="${USER.name}, ${USER.role}">${USER.name[0]}</span>`}
  </header>`;

export const ctxBar = (firmware) => `
  <div class="ctx-bar" role="status">
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
        <button class="suggest${s.start ? ' suggest--start' : ''}" data-action="suggest" data-flow="${s.flow}">
          <span class="suggest-text"><span class="t-label muted">${esc(s.tag)}${s.start ? ' · Start here' : ''}</span><span class="t-body-strong">${esc(s.text)}</span></span>
          <span class="suggest-chevron">${ICON.chevron}</span>
        </button>`).join('')}
    </div>
    <p class="t-caption muted home-note">Simulated content for a design prototype. Not manufacturer guidance.</p>
  </div>`;

export const userMsg = (text) => `<div class="msg msg-user"><div class="bubble t-body">${esc(text)}</div></div>`;

const asstLabel = '<div class="asst-label t-meta"><span class="mark" aria-hidden="true"></span>Copilot</div>';

export const typingMsg = () => `<div class="msg msg-asst" role="status" aria-label="Copilot is typing">${asstLabel}<div class="dots" aria-hidden="true"><i></i><i></i><i></i></div></div>`;

const callout = (kind, title, lines) => `
  <div class="callout callout--${kind}">
    <p class="t-body-strong callout-title">${esc(title)}</p>
    ${lines.map((l) => `<p class="t-body">${esc(l)}</p>`).join('')}
  </div>`;

const basisLine = () => `<div class="basis"><span class="t-caption">${esc(BASIS)}</span>${pill('Illustrative', 'illustrative')}</div>`;

const responseBlock = () => `
  <div class="block">
    <div class="summary">
      <p class="t-label muted">Summary</p>
      <p class="t-body-lg summary-text">${esc(RESPONSE.summary)}</p>
      <div class="summary-meta">${pill('Based on your answers', 'neutral')}${citeBtn('[1] §5.3.1', { src: 'sm-5-3-1', active: true })}</div>
      <p class="t-caption accent">Tap [1] §5.3.1 to verify the source</p>
    </div>
    ${callout('warning', 'Before you start', RESPONSE.warnings)}
    <div class="steps">
      <p class="t-label muted">Next steps</p>
      ${RESPONSE.steps.map(([t, cs], i) => `
        <div class="step"><span class="step-num t-meta">${i + 1}</span>
          <div class="step-body"><p class="t-body">${esc(t)}</p><div class="cites">${cs.map((c) => citeBtn(c)).join('')}</div></div></div>`).join('')}
    </div>
    <button class="ruled" data-action="inactive">
      <span class="ruled-text"><span class="t-body-strong">Ruled out in this conversation (2)</span><span class="t-caption muted">Based on your answers, not verified by the assistant.</span></span>${ICON.chevron}
    </button>
    ${callout('info', 'Not covered by the documents', ['Pressure sensor module repair or calibration.  [1 §8.2]'])}
    ${basisLine()}
    <div class="actions">
      <button class="btn btn--secondary" data-action="inactive">Ask a follow-up</button>
      <button class="btn btn--secondary" data-action="toast" data-msg="Simulated: this would connect you to authorized support.">Contact authorized support</button>
    </div>
    <p class="t-caption muted">Simulated content. Not manufacturer guidance. You decide whether to proceed.</p>
  </div>`;

const scheduleBlock = () => `
  <div class="block">
    <p class="t-body-lg">The preventive maintenance schedule is in the Service Manual, section 6.1.</p>
    <table class="mini-table"><thead><tr><th>Interval</th><th>Task</th></tr></thead><tbody>
      <tr><td>Every use</td><td>Visual inspection of housing, door and latch</td></tr>
      <tr><td>6 months</td><td>Cleaning (6.2), battery check (6.3)</td></tr>
      <tr><td>12 months</td><td>Performance verification (section 7)</td></tr>
    </tbody></table>
    <div class="cites">${citeBtn('[1] Service Manual Rev C §6.1', { src: 'sm-6-1', active: true })}</div>
    <p class="t-caption accent">Tap the citation to see the source</p>
    ${basisLine()}
    <p class="t-caption muted">Simulated content. Not manufacturer guidance.</p>
  </div>`;

const insufficientBlock = () => `
  <div class="block">
    <div class="banner" role="alert">
      <p class="banner-title t-title">${ICON.alert}Not enough evidence</p>
      <p class="t-body">${esc(INSUFFICIENT.message)}</p>
    </div>
    <div><p class="t-label muted">What was found</p>
      <ul class="plain-list">${INSUFFICIENT.found.map(([t, c]) => `<li class="t-body">${esc(t)}  <span class="muted">${esc(c)}</span></li>`).join('')}</ul></div>
    <div class="cites">${citeBtn('[1] §8.2', { src: 'sm-8-2', active: true })}${citeBtn('[2] §2')}</div>
    <p class="t-caption accent">Tap [1] §8.2 to see the source</p>
    <div><p class="t-label muted">What was not found</p>
      <ul class="plain-list">${INSUFFICIENT.notFound.map((t) => `<li class="t-body">${esc(t)}</li>`).join('')}</ul></div>
    <div class="actions">
      <button class="btn btn--primary" data-action="toast" data-msg="Simulated: this would connect you to authorized support.">Contact authorized support</button>
      <button class="btn btn--secondary" data-action="toast" data-msg="Simulated: this would open the official documentation.">Open official documentation</button>
      <button class="btn btn--ghost" data-action="reset">Start a new consultation</button>
    </div>
    <p class="t-caption muted">Simulated content. Not manufacturer guidance.</p>
  </div>`;

export const asstMsg = (m) => {
  const body = m.kind === 'response' ? responseBlock() : m.kind === 'schedule' ? scheduleBlock() : m.kind === 'insufficient' ? insufficientBlock() : '';
  const paras = (m.paras || []).map((p) => `<p class="t-body-lg">${esc(p)}</p>`).join('');
  const cites = m.cites && m.cites.length ? `<div class="cites">${m.cites.map((c) => citeBtn(c.label)).join('')}</div>` : '';
  const chips = m.chips && m.awaiting
    ? `<div class="chips" role="group" aria-label="Quick replies">${m.chips.map((c, i) => c.active
        ? `<button class="chip chip--active" data-action="chip" data-i="${i}">${esc(c.label)}</button>`
        : `<button class="chip chip--inactive" data-action="inactive" aria-disabled="true">${esc(c.label)}</button>`).join('')}</div>
       <p class="t-caption muted">Demo · tap the highlighted option</p>`
    : '';
  return `<div class="msg msg-asst">${asstLabel}${paras}${cites}${chips}${body}</div>`;
};

export const composer = (c) => {
  const field = c.mode === 'fill'
    ? `<button class="composer-field composer-field--fill" data-action="fill">${esc(c.placeholder)}</button>`
    : c.mode === 'ready'
      ? `<div class="composer-field composer-field--ready">${esc(c.text)}</div>`
      : `<div class="composer-field" aria-disabled="true">${esc(c.placeholder)}</div>`;
  const send = c.mode === 'ready'
    ? `<button class="icon-btn icon-btn--filled" data-action="send" aria-label="Send message">${ICON.up}</button>`
    : `<span class="icon-btn" aria-hidden="true">${ICON.up}</span>`;
  return `<footer class="composer composer--${c.mode}"><div class="composer-box"><span class="icon-btn" aria-hidden="true">${ICON.plus}</span>${field}${send}</div></footer>`;
};

export const sidebarContent = () => `
  <div class="sb-top"><span class="mark" aria-hidden="true"></span><span class="t-title">AI Technical Copilot</span>
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
  const within = firmware ? s.applies.some((a) => a === firmware) : null;
  const check = within === null
    ? `<div class="vcheck vcheck--warn t-body-strong">Firmware is not set. Confirm the pump firmware (${s.applies.join(' or ')}) before applying this source.</div>`
    : `<div class="vcheck t-body-strong">Firmware ${esc(firmware)} in your context is within “Applies to”.</div>`;
  return `
    <div class="doc-card">
      <p class="doc-title t-title">${citeBtn('[' + s.n + ']')}<span>${esc(s.title)}</span></p>
      <dl class="meta">
        <dt>Document</dt><dd>${esc(s.docId)}</dd><dt>Revision</dt><dd>${esc(s.rev)}</dd>
        <dt>Approval</dt><dd>${esc(s.approval)}</dd><dt>Applies to</dt><dd>Firmware ${s.applies.join(', ')}</dd>
        <dt>Section</dt><dd>${esc(s.section)}</dd></dl>
      ${pill('Illustrative · not manufacturer guidance', 'illustrative')}
    </div>
    ${check}
    <section class="source-text" aria-label="Source text"><p class="t-label muted">Source text · quoted from the document</p>
      <div class="quote">${s.quote.map(quoteBlock).join('')}</div></section>
    <section class="explanation" aria-label="Assistant's explanation"><p class="t-label muted">Assistant's explanation · AI-generated, not part of the source</p>
      <p class="t-body">${esc(s.explanation)}</p></section>`;
};

export const sourceView = (id, firmware) => `
  ${header('Source', { back: true })}
  <div class="source-body">${sourceBody(id, firmware)}
    <button class="btn btn--primary" data-action="back">Back to answer</button></div>`;
