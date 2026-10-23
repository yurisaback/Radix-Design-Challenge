// Prototype engine: scripted, fail-proof demo. One active action per turn.
import * as R from './render.js';
import { FLOWS } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const delay = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
const TITLES = { e214: 'E-214 · Diagnosis', maint: 'Maintenance schedule', recal: 'Pressure sensor' };
const FILL_PLACEHOLDER = 'Tap to fill the demo message';
const DEVICE = { w: 418, h: 872 };
const DESK = { w: 1440, h: 900 };

const initial = () => ({
  page: 'home', source: null, sidebar: false, firmware: null, findings: [], findingsOpen: true,
  messages: [], typing: false, flow: null, step: 0, title: '', waiting: 'suggest', token: 0,
  composer: { mode: 'fill', placeholder: FILL_PLACEHOLDER, text: '', next: 'e214' },
});
let S = initial();
let announce = '';

// ---------- rendering ----------
function renderMain(scroll = 'end') {
  const main = $('#main');
  const prev = $('#body', main);
  const prevTop = prev ? prev.scrollTop : 0;
  const home = S.page === 'home';
  const mk = (html, fresh) => (fresh ? html.replace('class="msg', 'class="msg msg--in') : html);
  const list = home ? R.homeView() : S.messages.map((m) => mk(m.role === 'user' ? R.userMsg(m.text) : R.asstMsg(m), m.fresh)).join('') + (S.typing ? mk(R.typingMsg(), true) : '');
  S.messages.forEach((m) => { m.fresh = false; });
  main.innerHTML = R.header(home ? 'AI Technical Copilot' : S.title)
    + R.ctxBar(S.firmware)
    + (!home && S.findings.length ? R.findingsPanel(S.findings, S.findingsOpen) : '')
    + `<div class="body${home ? ' body--home' : ''}" id="body">${list}</div>`
    + R.composer(S.composer);
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
  const locked = S.sidebar || !!S.source;
  $('#main').toggleAttribute('inert', locked);
  $('#sidebar').toggleAttribute('inert', !S.sidebar);
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
  suggest: ['Demo: tap the highlighted suggestion to start.', '.suggest--start'],
  chip: ['Demo: tap the highlighted option.', '.chip--active'],
  cite: ['Demo: tap the highlighted citation to verify the source.', '.cite--active'],
  fill: ['Demo: tap the message box to fill it.', '.composer-field--fill'],
  send: ['Demo: tap send.', '.icon-btn--filled'],
};
function hint() {
  const [msg, sel] = HINTS[S.waiting] || ['This is illustrative content in the prototype.', null];
  toast(msg);
  if (!sel) return;
  const el = $(sel, $('#app'));
  if (!el) return;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
}

// ---------- engine ----------
async function startFlow(id, text) {
  const tok = S.token;
  S.flow = id; S.step = 0; S.page = 'chat'; S.waiting = null;
  if (!S.title) S.title = TITLES[id];
  S.messages.push({ role: 'user', text, fresh: true });
  S.composer = { mode: 'disabled', placeholder: 'Please wait…', text: '' };
  renderMain('end');
  await assistantTurn(tok);
}

async function assistantTurn(tok) {
  const step = FLOWS[S.flow].steps[S.step];
  S.typing = true;
  renderMain('end');
  await delay(S.step === 0 ? 900 : 700);
  if (tok !== S.token) return;
  S.typing = false;
  const m = step.kind
    ? { role: 'assistant', kind: step.kind, fresh: true }
    : { role: 'assistant', paras: step.paras, cites: step.cites, chips: step.chips, awaiting: true, fresh: true };
  S.messages.push(m);
  if (step.chips) {
    S.waiting = 'chip';
    S.composer = { mode: 'disabled', placeholder: 'Choose an option above', text: '' };
    announce = `${step.paras[0]} Options: ${step.chips.map((c) => c.label).join(', ')}.`;
  } else {
    S.waiting = 'cite';
    S.findingsOpen = false;
    S.composer = { mode: 'disabled', placeholder: step.kind === 'insufficient' ? 'Start a new consultation to continue' : 'Verify the source to continue', text: '' };
    announce = 'The assistant answered. Tap the highlighted citation to verify the source.';
  }
  renderMain('end');
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
  S.source = id;
  $('#source').innerHTML = R.sourceView(id, S.firmware);
  syncOverlays();
  $('#source .icon-plain').focus();
}

function closeSource() {
  S.source = null;
  if (S.waiting === 'cite') {
    const after = FLOWS[S.flow].after;
    if (after) {
      S.waiting = 'fill';
      S.composer = { mode: 'fill', placeholder: FILL_PLACEHOLDER, text: '', next: after };
    } else {
      S.waiting = null;
    }
  }
  renderMain('keep');
  const cite = $('.cite--active');
  if (cite) cite.focus({ preventScroll: true });
}

async function fillComposer() {
  if (S.composer.mode !== 'fill') return;
  const tok = S.token;
  const text = FLOWS[S.composer.next].query;
  const next = S.composer.next;
  S.waiting = null;
  S.composer = { mode: 'typing', text: '', next };
  renderComposer();
  const step = reduce ? text.length : 2;
  for (let i = step; i < text.length + step; i += step) {
    S.composer.text = text.slice(0, i);
    renderComposer();
    await delay(22);
    if (tok !== S.token) return;
  }
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
  $('#source').innerHTML = '';
  renderMain('keep');
  $('#body').scrollTop = 0;
}

function setSidebar(open) {
  S.sidebar = open;
  syncOverlays();
  if (open) $('#sidebar [data-action="close-menu"]').focus();
  else $('[data-action="menu"]')?.focus();
}

// ---------- events ----------
$('#app').addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'menu') setSidebar(true);
  else if (a === 'close-menu') setSidebar(false);
  else if (a === 'suggest') { if (S.page === 'home') startFlow(t.dataset.flow, FLOWS[t.dataset.flow].query); }
  else if (a === 'chip') chooseChip(Number(t.dataset.i));
  else if (a === 'cite') openSource(t.dataset.src);
  else if (a === 'back') closeSource();
  else if (a === 'fill') fillComposer();
  else if (a === 'send') send();
  else if (a === 'reset') { setSidebar(false); reset(); }
  else if (a === 'toggle-findings') { S.findingsOpen = !S.findingsOpen; renderMain('keep'); $('[data-action="toggle-findings"]')?.focus(); }
  else if (a === 'toast') toast(t.dataset.msg);
  else if (a === 'inactive') hint();
});
$('#scrim').addEventListener('click', () => setSidebar(false));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (S.sidebar) setSidebar(false);
  else if (S.source) closeSource();
});
$('#restart').addEventListener('click', reset);

// ---------- desktop preview (static, not interactive) ----------
function desktopHtml(tab) {
  const side = `<aside class="d-sidebar">${R.sidebarContent()}</aside>`;
  const composer = (c) => R.composer(c);
  if (tab === 'home') {
    return `${side}<section class="d-main"><header class="header header--desk"><h1 class="t-title">AI Technical Copilot</h1></header>${R.ctxBar(null)}
      <div class="body body--home d-body"><div class="d-col">${R.homeView()}</div></div>
      ${composer({ mode: 'fill', placeholder: FILL_PLACEHOLDER })}</section>`;
  }
  return `${side}<section class="d-main"><header class="header header--desk"><h1 class="t-title">E-214 · Diagnosis</h1></header>${R.ctxBar('3.4.x')}
    <div class="body d-body"><div class="d-col">${R.asstMsg({ role: 'assistant', kind: 'response' })}</div></div>
    ${composer({ mode: 'disabled', placeholder: 'Verify the source to continue' })}</section>
    <aside class="d-source"><header class="header header--desk"><span class="cite cite--active">[1]</span><h2 class="t-title">Source</h2></header>
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
  const avail = innerHeight - 110;
  const sD = narrow ? 1 : Math.min(1, avail / DEVICE.h);
  const dev = $('#device');
  dev.style.transform = narrow ? 'none' : `scale(${sD})`;
  $('#device-wrap').style.width = narrow ? '100%' : `${DEVICE.w * sD}px`;
  $('#device-wrap').style.height = narrow ? '100dvh' : `${DEVICE.h * sD}px`;
  const sW = Math.min(1, (innerWidth - 48) / DESK.w, (innerHeight - 190) / (DESK.h + 44));
  $('#desk-wrap').style.width = `${DESK.w * sW}px`;
  $('#desk-wrap').style.height = `${(DESK.h + 44) * sW}px`;
  $('#desk-frame').style.transform = `scale(${sW})`;
}
addEventListener('resize', fit);

// ---------- boot ----------
$('#sidebar').innerHTML = R.sidebarContent();
renderMain('keep');
setView('mobile');
