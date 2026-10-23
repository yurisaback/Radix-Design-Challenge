// Prototype engine: scripted, fail-proof demo. One active action per turn.
import * as R from './render.js';
import { FLOWS, SOURCES } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const delay = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
const TITLES = { e214: 'E-214 · Diagnosis', maint: 'Maintenance schedule', recal: 'Pressure sensor' };
const FILL_PLACEHOLDER = 'How can I help you today?';
const FOLLOWUP_PLACEHOLDER = 'Ask a follow-up…';
const TYPING_MS = 1700;
const DEVICE = { w: 418, h: 872 };
const DESK = { w: 1440, h: 900 };

const initial = () => ({
  page: 'home', source: null, sidebar: false, sheet: false, firmware: null, findings: [], findingsOpen: true,
  messages: [], typing: false, flow: null, step: 0, title: '', waiting: 'fill', token: 0,
  ctxFresh: false, streaming: false, skip: false,
  composer: { mode: 'fill', placeholder: FILL_PLACEHOLDER, text: '', next: 'e214' },
});
let S = initial();
let announce = '';

// ---------- human-like timing ----------
// Keystrokes: irregular rhythm, longer after spaces and punctuation, rare hesitations.
function keyDelay(ch, prev) {
  let d = 28 + Math.random() * 30;
  if (ch === ' ') d += 18 + Math.random() * 32;
  if (/[,.?!]/.test(ch)) d += 110 + Math.random() * 80;
  if (prev && /[,.?!]/.test(prev)) d += 40;
  if (Math.random() < 0.03) d += 170;
  return d;
}
// Assistant text: small chunks, pauses at punctuation.
function chunkDelay(chunk) {
  let d = 22 + Math.random() * 18;
  const t = chunk.trim();
  if (/[.?!]$/.test(t)) d += 220;
  else if (/[,;:]$/.test(t)) d += 110;
  return d;
}

// ---------- rendering ----------
function renderMain(scroll = 'end') {
  const main = $('#main');
  const prev = $('#body', main);
  const prevTop = prev ? prev.scrollTop : 0;
  const home = S.page === 'home';
  const mk = (html, fresh) => (fresh ? html.replace('class="msg', 'class="msg msg--in') : html);
  const list = home ? R.homeView() : S.messages.map((m) => mk(m.role === 'user' ? R.userMsg(m.text) : R.asstMsg(m), m.fresh)).join('') + (S.typing ? mk(R.typingMsg(), true) : '');
  S.messages.forEach((m) => { m.fresh = false; });
  main.innerHTML = R.header(home ? 'Tess - AI Tech Copilot' : S.title)
    + (home ? '' : R.ctxBar(S.firmware, S.ctxFresh))
    + (!home && S.findings.length ? R.findingsPanel(S.findings, S.findingsOpen) : '')
    + `<div class="body${home ? ' body--home' : ''}" id="body">${list}</div>`
    + R.composer(S.composer);
  S.ctxFresh = false;
  const body = $('#body', main);
  if (scroll === 'end') body.scrollTo({ top: body.scrollHeight, behavior: reduce || home ? 'auto' : 'smooth' });
  else body.scrollTop = prevTop;
  syncOverlays();
}

function renderComposer() {
  const old = $('.composer');
  if (old) old.outerHTML = R.composer(S.composer);
}

function syncOverlays() {
  const app = $('#app');
  app.dataset.screen = S.source ? 'source' : S.page;
  app.dataset.sidebar = S.sidebar ? 'open' : 'closed';
  app.dataset.sheet = S.sheet ? 'open' : 'closed';
  const locked = S.sidebar || !!S.source || S.sheet;
  $('#main').toggleAttribute('inert', locked);
  $('#sidebar').toggleAttribute('inert', !S.sidebar);
  $('#sheet').toggleAttribute('inert', !S.sheet);
  $('#source').toggleAttribute('inert', !S.source);
  $('#announcer').textContent = announce;
}

// ---------- hints and toasts ----------
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
}
const HINTS = {
  suggest: ['Tap one of the suggestions to start.', null],
  chip: ['Choose the option that is blinking.', '.chip--active'],
  followup: ['Choose the suggestion that is blinking.', '.followups .chip--active'],
  cite: ['Open a citation to verify the source.', '.cite--blink'],
  fill: ['Tap the message box to continue.', '.composer--fill .composer-box'],
  send: ['Tap send to continue.', '.icon-btn--filled'],
};
function hint(kind = S.waiting) {
  if (S.streaming) return;
  const [msg, sel] = HINTS[kind] || ['This is not available right now.', null];
  toast(msg);
  if (!sel) return;
  const el = $(sel, $('#app'));
  if (!el) return;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
}

// ---------- simulated download (no file is created) ----------
let notifTimer;
function hideNotif() {
  clearTimeout(notifTimer);
  const n = $('#notif');
  n.classList.remove('is-on');
  n.dataset.state = '';
}
async function download(id) {
  const n = $('#notif');
  if (n.dataset.state === 'busy') return;
  const { file, size } = SOURCES[id];
  clearTimeout(notifTimer);
  n.innerHTML = R.notif({ state: 'progress', file, size });
  n.dataset.state = 'busy';
  n.classList.add('is-on');
  $('#announcer').textContent = `Downloading ${file}`;
  const tok = S.token;
  await delay(1400);
  if (tok !== S.token || n.dataset.state !== 'busy') return;
  n.innerHTML = R.notif({ state: 'done', file, size });
  n.dataset.state = 'done';
  $('#announcer').textContent = `Download complete: ${file}`;
  notifTimer = setTimeout(hideNotif, 3800);
}

// ---------- engine ----------
async function startFlow(id, text) {
  const tok = S.token;
  if (S.page === 'home') S.ctxFresh = true; // the assistant recognises the equipment from the first message
  S.flow = id; S.step = 0; S.page = 'chat'; S.waiting = null;
  if (!S.title) S.title = TITLES[id];
  S.messages.push({ role: 'user', text, fresh: true });
  S.composer = { mode: 'disabled', placeholder: 'Please wait…', text: '' };
  renderMain('end');
  await assistantTurn(tok);
}

async function playAssistant(el, m, tok, onReveal) {
  if (!el) { m.stream = false; onReveal?.(); return; }
  S.streaming = true;
  S.skip = false;
  const body = $('#body');
  for (const t of el.querySelectorAll('.type-me')) {
    const full = t.dataset.text;
    t.classList.add('caret');
    for (let i = 0; i < full.length;) {
      if (S.skip || reduce) { t.textContent = full; break; }
      i += 2;
      t.textContent = full.slice(0, i);
      body.scrollTop = body.scrollHeight;
      await delay(chunkDelay(full.slice(i - 2, i)));
      if (tok !== S.token) return;
    }
    t.textContent = full;
    t.classList.remove('caret');
    if (!S.skip) await delay(180);
  }
  const items = [...el.querySelectorAll('.reveal')];
  el.classList.remove('is-streaming');
  items.forEach((x, i) => { x.style.setProperty('--i', Math.min(i, 6)); x.classList.add('reveal-in'); });
  m.stream = false;
  S.streaming = false;
  S.skip = false;
  onReveal?.(); // taps are accepted from the moment the options are visible
  body.scrollTo({ top: body.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  if (items.length) await delay(Math.min(items.length, 7) * 110 + 250);
}

async function assistantTurn(tok) {
  const step = FLOWS[S.flow].steps[S.step];
  S.typing = true;
  renderMain('end');
  await delay(S.step === 0 ? 1000 : 750);
  if (tok !== S.token) return;
  S.typing = false;
  const m = step.kind
    ? { role: 'assistant', kind: step.kind, fresh: true, stream: true }
    : { role: 'assistant', paras: step.paras, cites: step.cites, chips: step.chips, awaiting: true, fresh: true, stream: true };
  S.messages.push(m);
  if (step.chips) {
    S.composer = { mode: 'disabled', placeholder: 'Choose an option above', text: '' };
    announce = `${step.paras[0]} Options: ${step.chips.map((c) => c.label).join(', ')}.`;
  } else {
    S.findingsOpen = false;
    S.composer = { mode: 'disabled', placeholder: FLOWS[S.flow].after ? FOLLOWUP_PLACEHOLDER : 'Start a new consultation to continue', text: '' };
    announce = 'The assistant answered. You can open any citation to read the source.';
  }
  renderMain('end');
  const el = [...document.querySelectorAll('#body .msg-asst')].pop();
  const ready = () => {
    if (tok !== S.token) return;
    if (step.chips) {
      S.waiting = 'chip';
    } else {
      // the follow-up is ready right after the answer; reading sources is optional
      const after = FLOWS[S.flow].after;
      S.waiting = after ? 'fill' : null;
      if (after) {
        S.composer = { mode: 'fill', placeholder: FOLLOWUP_PLACEHOLDER, text: '', next: after };
        renderComposer();
      }
    }
    $('#announcer').textContent = announce;
  };
  await playAssistant(el, m, tok, ready);
}

async function chooseChip(i) {
  if (S.waiting !== 'chip') return hint();
  const tok = S.token;
  const m = [...S.messages].reverse().find((x) => x.role === 'assistant' && x.awaiting);
  const chip = m && m.chips[i];
  if (!chip || !chip.active) return hint();
  m.awaiting = false;
  if (chip.set) {
    if (chip.set.firmware) S.firmware = chip.set.firmware;
    if (chip.set.finding) S.findings.push(chip.set.finding);
  }
  S.messages.push({ role: 'user', text: chip.label, fresh: true });
  S.waiting = null;
  S.step += 1;
  renderMain('end');
  await assistantTurn(tok);
}

function openSource(id) {
  S.opener = document.activeElement;
  S.source = id;
  $('#source').innerHTML = R.sourceView(id, S.firmware);
  syncOverlays();
  $('#source .icon-plain').focus({ preventScroll: true });
}

function closeSource() {
  S.source = null;
  syncOverlays();
  S.opener?.focus({ preventScroll: true });
}

// The demo types the scripted message into the field like a person would.
async function fillComposer() {
  if (S.composer.mode !== 'fill') return;
  const tok = S.token;
  const next = S.composer.next;
  const text = FLOWS[next].query;
  S.waiting = null;
  S.skip = false;
  S.composer = { mode: 'typing', text: '', next };
  renderComposer();
  const setText = (v) => { const f = $('.composer-field'); if (f) f.textContent = v; };
  if (!reduce) {
    // Human rhythm, scaled so any message takes about 2 s of typing (about 2.6 s with the pauses around it).
    const raw = [...text].map((ch, i) => keyDelay(ch, text[i - 1]));
    const scale = TYPING_MS / raw.reduce((a, b) => a + b, 0);
    await delay(300);
    for (let i = 1; i <= text.length; i++) {
      if (tok !== S.token) return;
      if (S.skip) break;
      setText(text.slice(0, i));
      await delay(raw[i - 1] * scale);
    }
  }
  S.skip = false;
  setText(text);
  await delay(250);
  if (tok !== S.token) return;
  S.composer = { mode: 'ready', text, next };
  S.waiting = 'send';
  renderComposer();
  $('.icon-btn--filled')?.focus({ preventScroll: true });
}

function send() {
  if (S.composer.mode !== 'ready') return hint();
  const { next, text } = S.composer;
  startFlow(next, text);
}

function reset() {
  const token = S.token + 1;
  S = initial();
  S.token = token;
  announce = 'Demo restarted.';
  hideNotif();
  $('#source').innerHTML = '';
  renderMain('keep');
  $('#body').scrollTop = 0;
}

function setSidebar(open) {
  S.sidebar = open;
  syncOverlays();
  if (open) $('#sidebar [data-action="close-menu"]').focus({ preventScroll: true });
  else $('[data-action="menu"]')?.focus({ preventScroll: true });
}

function setSheet(open) {
  S.sheet = open;
  syncOverlays();
  if (open) $('#sheet [data-action="close-attach"]').focus({ preventScroll: true });
  else $('[data-action="attach"]')?.focus({ preventScroll: true });
}

// ---------- events ----------
$('#app').addEventListener('click', (e) => {
  if (e.target.closest('.is-streaming, [data-action="skip-typing"]')) { S.skip = true; return; }
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'menu') setSidebar(true);
  else if (a === 'close-menu') setSidebar(false);
  else if (a === 'attach') setSheet(true);
  else if (a === 'close-attach' || a === 'pick') setSheet(false);
  else if (a === 'suggest') { if (S.page === 'home') startFlow(t.dataset.flow, FLOWS[t.dataset.flow].query); }
  else if (a === 'chip') chooseChip(Number(t.dataset.i));
  else if (a === 'followup') { if (S.waiting === 'fill' && !S.streaming) startFlow(t.dataset.flow, FLOWS[t.dataset.flow].query); }
  else if (a === 'hint-chip') hint('followup');
  else if (a === 'cite') openSource(t.dataset.src);
  else if (a === 'back') closeSource();
  else if (a === 'fill') fillComposer();
  else if (a === 'send') send();
  else if (a === 'reset') { setSidebar(false); reset(); }
  else if (a === 'toggle-findings') { if (S.streaming) return; S.findingsOpen = !S.findingsOpen; renderMain('keep'); $('[data-action="toggle-findings"]')?.focus({ preventScroll: true }); }
  else if (a === 'download') download(t.dataset.src);
  else if (a === 'dismiss-notif') hideNotif();
  else if (a === 'toggle-ruled') {
    if (S.streaming) return;
    const m = [...S.messages].reverse().find((x) => x.kind === 'response');
    if (m) { m.open = !m.open; renderMain('keep'); $('[data-action="toggle-ruled"]')?.focus({ preventScroll: true }); }
  }
  else if (a === 'toast') toast(t.dataset.msg);
  else if (a === 'inactive') hint();
});
$('#scrim').addEventListener('click', () => setSidebar(false));
$('#sheet-scrim').addEventListener('click', () => setSheet(false));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (S.sheet) setSheet(false);
  else if (S.sidebar) setSidebar(false);
  else if (S.source) closeSource();
});
$('#restart').addEventListener('click', reset);

// ---------- desktop preview (static, not interactive) ----------
function desktopHtml(tab) {
  const side = `<aside class="d-sidebar">${R.sidebarContent()}</aside>`;
  if (tab === 'home') {
    return `${side}<section class="d-main"><header class="header header--desk"><h1 class="t-title">Tess - AI Tech Copilot</h1></header>
      <div class="body body--home d-body"><div class="d-col">${R.homeView()}</div></div>
      ${R.composer({ mode: 'fill', placeholder: FILL_PLACEHOLDER })}</section>`;
  }
  return `${side}<section class="d-main"><header class="header header--desk"><h1 class="t-title">E-214 · Diagnosis</h1></header>${R.ctxBar('3.4.x')}
    <div class="body d-body"><div class="d-col">${R.asstMsg({ role: 'assistant', kind: 'response' })}</div></div>
    ${R.composer({ mode: 'disabled', placeholder: 'Verify the source to continue' })}</section>
    <aside class="d-source"><header class="header header--desk"><span class="cite">[1]</span><h2 class="t-title">Source</h2></header>
      <div class="source-body">${R.sourceBody('sm-5-3-1', '3.4.x')}</div></aside>`;
}
let deskTab = 'answer';
function renderDesktop() {
  $('#desk-canvas').innerHTML = desktopHtml(deskTab);
  document.querySelectorAll('[data-desk-tab]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.deskTab === deskTab)));
}
document.querySelectorAll('[data-desk-tab]').forEach((b) => b.addEventListener('click', () => { deskTab = b.dataset.deskTab; renderDesktop(); }));

// ---------- stage: view toggle and scaling ----------
function setView(view) {
  document.body.dataset.view = view;
  const btn = $('#toggle-view');
  btn.textContent = view === 'mobile' ? 'View desktop version' : 'Back to mobile (testable)';
  btn.setAttribute('aria-pressed', String(view === 'desktop'));
  $('#view-mobile').toggleAttribute('hidden', view !== 'mobile');
  $('#view-desktop').toggleAttribute('hidden', view !== 'desktop');
  if (view === 'desktop') renderDesktop();
  fit();
}
$('#toggle-view').addEventListener('click', () => setView(document.body.dataset.view === 'mobile' ? 'desktop' : 'mobile'));

function fit() {
  const narrow = matchMedia('(max-width: 520px)').matches;
  document.body.classList.toggle('is-narrow', narrow);
  const avail = innerHeight - 130;
  const sD = narrow ? 1 : Math.min(1, avail / DEVICE.h);
  const dev = $('#device');
  dev.style.transform = narrow ? 'none' : `scale(${sD})`;
  $('#device-wrap').style.width = narrow ? '100%' : `${DEVICE.w * sD}px`;
  $('#device-wrap').style.height = narrow ? '100dvh' : `${DEVICE.h * sD}px`;
  const sW = Math.min(1, (innerWidth - 48) / DESK.w, (innerHeight - 210) / (DESK.h + 44));
  $('#desk-wrap').style.width = `${DESK.w * sW}px`;
  $('#desk-wrap').style.height = `${(DESK.h + 44) * sW}px`;
  $('#desk-frame').style.transform = `scale(${sW})`;
}
addEventListener('resize', fit);

// ---------- boot ----------
$('#sidebar').innerHTML = R.sidebarContent();
$('#sheet').innerHTML = R.sheetContent();
renderMain('keep');
setView('mobile');
