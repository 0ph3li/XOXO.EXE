/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — core (shared by every page)                       ║
   ╚══════════════════════════════════════════════════════════════╝ */
gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouse = matchMedia('(pointer: fine)').matches;
const html = document.documentElement;
const body = document.body;

/* ── smooth scroll ─────────────────────────────────────────────── */
let lenis = null;
if (!calm && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── image slots: checkerboard + filename until the photo exists ─ */
function watchSlot(img) {
  const slot = img.closest('.slot');
  img.addEventListener('error', () => slot.classList.add('is-empty'));
  img.addEventListener('load', () => slot.classList.remove('is-empty'));
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) slot.classList.add('is-empty');
}
$$('.slot img').forEach(watchSlot);
$$('.slot').forEach(sl => sl.insertAdjacentHTML('beforeend', '<span class="slot-fx" aria-hidden="true"></span>'));

// text filled with a photo
$$('.fill[data-bg]').forEach(el => {
  const probe = new Image();
  probe.onload = () => { el.style.setProperty('--bg', `url("${el.dataset.bg}")`); el.classList.add('has-bg'); };
  probe.src = el.dataset.bg;
});

/* ── scramble ──────────────────────────────────────────────────── */
const GLYPHS = '!<>-_\\/[]{}=+*^?#xo♥✦01';
function scramble(el, to, ms = 700) {
  const from = el.textContent;
  const len = Math.max(from.length, to.length);
  const t0 = performance.now();
  cancelAnimationFrame(el._raf);
  const step = now => {
    const t = Math.min((now - t0) / ms, 1);
    let out = '';
    for (let i = 0; i < len; i++) {
      const k = i / len;
      out += t === 1 || t > k + 0.25 ? (to[i] ?? '') : t > k ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : (from[i] ?? '');
    }
    el.textContent = out;
    if (t < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

/* ── taskbar: clock ────────────────────────────────────────────── */
const clock = $('.tray-clock');
const tickClock = () => {
  const d = new Date();
  clock.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
tickClock(); setInterval(tickClock, 15000);

// highlight the current page in the taskbar
const here = location.pathname.split('/').pop() || 'index.html';
$$('.task').forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === here));

/* ── tab: the icon gets infected too, and the title calls you back ── */
const favicon = document.querySelector('link[rel="icon"]');
function setFavicon(dirty) { if (favicon) favicon.href = dirty ? 'favicon-dirty.svg' : 'favicon.svg'; }
setFavicon(body.classList.contains('dirty'));
const realTitle = document.title;
const CALLS = ['come back ♥', 'are u up?', '(1) new message', 'don\'t leave me on read', 'it\'s 3AM somewhere'];
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? CALLS[(Math.random() * CALLS.length) | 0] : realTitle;
});

/* ── for whoever opens the console ─────────────────────────────── */
console.log(`%c
   *    /\\_/\\      +
       ( o.o )   <3  ghostly.grl
   +    > ^ <          *
`, 'color:#ff2fbf;font-family:monospace;font-size:13px');
console.log('%cxoxo.exe%c  you opened the console. of course you did.\ntype %cxoxo.help()%c — nobody else will know.',
  'background:#ff2fbf;color:#0c0b0d;font-weight:bold;padding:2px 6px', 'color:inherit',
  'color:#ff2fbf;font-weight:bold', 'color:inherit');
window.xoxo = {
  help() { console.log('xoxo.whoami()  ·  xoxo.drafts()  ·  xoxo.password()  ·  xoxo.start()  ·  xoxo.crash()  ·  xoxo.forget()'); return '♥'; },
  whoami() { return 'someone who reads the source code at night. hi.'; },
  drafts() { return ['are u up', 'i miss u', 'nvm', 'come back', 'we should talk', 'i think i liked u more than i said']; },
  password() { return 'the time it all started. hh:mm, no colon. (you could also just read start.js. we know.)'; },
  start() { goTo('start.html'); return 'logging on…'; },
  crash() { crash(); return 'you did this.'; },
  forget() {
    try { Object.keys(localStorage).filter(k => k.startsWith('xo-')).forEach(k => localStorage.removeItem(k)); sessionStorage.clear(); } catch (e) { /* nothing */ }
    return 'forgotten. (we still remember. but only in spirit.)';
  }
};

/* ── memory: what this visitor did (only in their own browser, read by you.html) ── */
const mem = {
  get(k, d = null) { try { const v = localStorage.getItem('xo-' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('xo-' + k, JSON.stringify(v)); } catch (e) { /* private mode: forget */ } }
};
if (!mem.get('first')) mem.set('first', Date.now());
mem.set('pages', [...new Set([...mem.get('pages', []), here])]);
setInterval(() => { if (!document.hidden) mem.set('time', mem.get('time', 0) + 5); }, 5000);
document.addEventListener('visibilitychange', () => { if (document.hidden) mem.set('leaves', mem.get('leaves', 0) + 1); });

/* ── everything typed into a field on this site (read by the lab computer) ── */
document.addEventListener('change', e => {
  const f = e.target;
  if (!f.matches || !f.matches('input[type="text"], input[type="search"], input:not([type]), textarea') || f.type === 'password') return;
  const v = f.value.trim();
  if (!v) return;
  const d = new Date();
  const typed = mem.get('typed', []);
  typed.unshift({ v: v.slice(0, 140), page: here.replace('.html', '').replace('index', 'home'), at: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
  mem.set('typed', typed.slice(0, 30));
});

/* ── xoxo.algorithm: learns who you're really here for ────────────
   every click, filter, search and pause adds weight to one of five people.
   the archive's "for you" feed and you.html read the result. */
const ALGO_ROOMS = { ex: 'the ex', crush: 'the crush', bestie: 'best friend', mom: 'mom', me: 'yourself' };
function learn(room, weight, why) {
  if (!ALGO_ROOMS[room]) return;
  const w = mem.get('algo', {});
  w[room] = Math.round(((w[room] || 0) + weight) * 10) / 10;
  mem.set('algo', w);
  if (why) mem.set('algo-why', [{ room, why }, ...mem.get('algo-why', [])].slice(0, 12));
  document.dispatchEvent(new CustomEvent('xo-learn', { detail: { room, weight, why } }));
}
function profile() {
  const w = mem.get('algo', {});
  const total = Object.keys(ALGO_ROOMS).reduce((t, k) => t + (w[k] || 0), 0);
  const share = Object.fromEntries(Object.keys(ALGO_ROOMS).map(k => [k, total ? (w[k] || 0) / total : 0]));
  const top = Object.keys(share).sort((a, b) => share[b] - share[a])[0];
  return { share, total, top: total ? top : null, confidence: Math.min(0.97, 1 - Math.exp(-total / 18)) };
}

/* ── page transitions: pink wipe between pages ─────────────────── */
const wipe = document.createElement('div');
wipe.className = 'wipe';
wipe.innerHTML = '<span class="wipe-txt">loading…</span>';
body.appendChild(wipe);

const arrived = sessionStorage.getItem('xo-wipe');
sessionStorage.removeItem('xo-wipe');
if (arrived && !calm) {
  gsap.set(wipe, { clipPath: 'inset(0 0 0 0)' });
  $('.wipe-txt', wipe).textContent = arrived;
  gsap.to(wipe, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut', delay: 0.15 });
}

function goTo(file) {
  if (calm) return (location.href = file);
  const page = file.split(/[?#]/)[0];
  const label = page === 'start.html' ? 'logging on…' : `opening ${page.replace('.html', '').replace('index', 'home')}.exe`;
  sessionStorage.setItem('xo-wipe', label);
  $('.wipe-txt', wipe).textContent = label;
  gsap.fromTo(wipe, { clipPath: 'inset(100% 0 0 0)' }, {
    clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'expo.inOut',
    onComplete: () => (location.href = file)
  });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href*=".html"]');
  if (!a || e.metaKey || e.ctrlKey || a.target === '_blank' || calm) return;
  e.preventDefault();
  goTo(a.getAttribute('href'));
});

/* ── start: opens the lab's old computer (start.html); there it logs off ── */
const startBtn = $('.start');
startBtn.addEventListener('click', () => goTo(here === 'start.html' ? 'index.html' : 'start.html'));

/* ── phones: a "pages" button in the taskbar opens a full-screen list ── */
(function pagesSheet() {
  const bar = $('.taskbar');
  const links = $$('.task', bar);
  if (!bar || !links.length) return;
  const current = links.find(a => a.getAttribute('href') === here);
  const label = current ? current.textContent : (here === 'start.html' ? 'lab computer' : here === 'you.html' ? 'you' : 'pages');

  const btn = document.createElement('button');
  btn.className = 'pages-btn';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'pages-sheet');
  btn.innerHTML = `<b>${label}</b><i>▲ pages</i>`;
  startBtn.after(btn);

  const sheet = document.createElement('div');
  sheet.className = 'pages-sheet';
  sheet.id = 'pages-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Pages');
  sheet.innerHTML = `
    <div class="ps-head"><span>xoxo.exe — all files</span><button class="ps-x">✕ close</button></div>
    <ol class="ps-list">${links.map((a, i) => `<li><a href="${a.getAttribute('href')}" class="${a === current ? 'is-on' : ''}"><span>${String(i + 1).padStart(2, '0')}</span>${a.textContent}</a></li>`).join('')}</ol>
    <div class="ps-extra"><a href="start.html" class="ps-lab">♥ the lab computer</a><button class="ps-crash">⚠ don't press</button></div>`;
  body.appendChild(sheet);

  let open = false;
  const toggle = v => {
    open = v;
    btn.setAttribute('aria-expanded', v);
    if (v) {
      sheet.classList.add('open');
      lenis?.stop();
      gsap.fromTo(sheet, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: calm ? 0 : 0.55, ease: 'expo.inOut' });
      gsap.from($$('.ps-list li', sheet), { y: 30, opacity: 0, duration: 0.5, stagger: 0.04, delay: calm ? 0 : 0.2, ease: 'expo.out' });
    } else {
      lenis?.start();
      gsap.to(sheet, { clipPath: 'inset(100% 0 0 0)', duration: calm ? 0 : 0.45, ease: 'expo.inOut', onComplete: () => sheet.classList.remove('open') });
    }
  };
  btn.addEventListener('click', () => toggle(!open));
  $('.ps-x', sheet).addEventListener('click', () => toggle(false));
  $('.ps-crash', sheet).addEventListener('click', () => { toggle(false); setTimeout(() => crash(), 400); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(false); });
})();
// coming back with the browser's back button: don't stay covered
addEventListener('pageshow', e => { if (e.persisted) gsap.set(wipe, { clipPath: 'inset(0 0 100% 0)' }); });

/* ══════════════════════════════════════════════════════════════
   INFECTION — each page decides where it starts and ends (infectBetween)
   ══════════════════════════════════════════════════════════════ */
let dirt = 0;
const trayText = $('.tray-state b');
const startLabel = $('.start-label');
const stickerBox = $('.edge-stickers');
const shown = new Set();

const SHAPES = [
  '<svg viewBox="0 0 200 200"><use href="#burst" fill="#ff2fbf"/></svg>',
  '<svg viewBox="0 0 24 24"><path fill="#ff2fbf" d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4 6.2 4c2.3 0 3.8 1.4 4.6 2.6h2.4C14 5.4 15.5 4 17.8 4 21.8 4 23.7 8.4 22 11.7 19.5 16.4 12 21 12 21z"/></svg>',
  '<svg viewBox="0 0 24 24"><path fill="#c9ff1f" d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>'
];

function syncStickers() {
  const want = Math.floor(dirt * 16);
  while (stickerBox.children.length < want) {
    const w = document.createElement('div');
    const size = rand(18, 40);
    w.innerHTML = SHAPES[stickerBox.children.length % SHAPES.length];
    const svg = w.firstChild;
    svg.style.width = svg.style.height = size + 'px';
    svg.style.left = Math.random() > 0.5 ? rand(0.3, 1.6) + 'vw' : `calc(${rand(97.6, 99.4)}vw - ${size}px)`;
    svg.style.top = rand(8, 86) + 'vh';
    stickerBox.appendChild(svg);
    gsap.from(svg, { scale: 0, rotate: rand(-180, 180), duration: 0.6, ease: 'back.out(3)' });
    if (!calm) gsap.to(svg, { rotate: '+=360', duration: rand(8, 20), repeat: -1, ease: 'none' });
  }
  while (stickerBox.children.length > want) {
    gsap.killTweensOf(stickerBox.lastChild);
    stickerBox.lastChild.remove();
  }
}

function setDirt(v) {
  dirt = gsap.utils.clamp(0, 1, v);
  html.style.setProperty('--dirt', dirt.toFixed(3));

  const isDirty = dirt > 0.04;
  if (isDirty !== body.classList.contains('dirty')) {
    body.classList.toggle('dirty', isDirty);
    setFavicon(isDirty);
    scramble(startLabel, isDirty ? startLabel.dataset.dirty : startLabel.dataset.clean, 500);
  }
  trayText.textContent =
    dirt < 0.04 ? 'all feelings stable' :
    dirt < 0.35 ? 'anomaly detected' :
    dirt < 0.75 ? 'xoxo.exe spreading' : 'system compromised ♥';

  syncStickers();
  if (dirt > 0.08) alertOnce('a');
  if (dirt > 0.45) alertOnce('b');
  if (dirt > 0.9) alertOnce('c');
}


/* ── alert windows ─────────────────────────────────────────────── */
const alertBox = $('.alerts');
let ALERTS = {
  a: ['xoxo.exe', 'xoxo.exe wants to access your <b>unsent messages</b>.', ['Allow', 'Allow anyway']],
  b: ['System Warning', 'Your feelings were modified by an unknown program. <b>This is fine.</b>', ['OK', 'ok ♥']],
  c: ['xoxo.exe ♥', 'Installation complete. <b>You can’t uninstall a feeling.</b>', ['Close', 'Stay']]
};
const useAlerts = map => (ALERTS = map);
function alertOnce(id) {
  if (shown.has(id)) return;
  shown.add(id);
  const [title, text, btns] = ALERTS[id];
  const el = document.createElement('div');
  el.className = 'alert';
  el.innerHTML = `
    <div class="alert-bar"><span>${title}</span><button aria-label="Close">✕</button></div>
    <div class="alert-body"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4 6.2 4c2.3 0 3.8 1.4 4.6 2.6h2.4C14 5.4 15.5 4 17.8 4 21.8 4 23.7 8.4 22 11.7 19.5 16.4 12 21 12 21z"/></svg><p>${text}</p></div>
    <div class="alert-act">${btns.map(b => `<button>${b}</button>`).join('')}</div>`;
  alertBox.appendChild(el);
  el.style.left = rand(16, Math.max(16, innerWidth - el.offsetWidth - 16)) + 'px';
  el.style.top = rand(40, Math.max(40, innerHeight - el.offsetHeight - 100)) + 'px';
  gsap.fromTo(el, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)' });
  draggable(el, $('.alert-bar', el));
  const dismiss = () => gsap.to(el, { scale: 0.8, opacity: 0, duration: 0.2, onComplete: () => el.remove() });
  $$('button', el).forEach(b => b.addEventListener('click', dismiss));
  if (!mouse) setTimeout(() => el.isConnected && dismiss(), 4500);
}

/* ── sparkle trail (only once infected) ────────────────────────── */
if (mouse && !calm) {
  let last = 0;
  addEventListener('mousemove', e => {
    const now = performance.now();
    if (dirt < 0.25 || now - last < 45) return;
    last = now;
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = Math.random() > 0.5 ? '✦' : '♥';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    body.appendChild(s);
    gsap.to(s, { y: rand(20, 60), x: rand(-30, 30), rotate: rand(-180, 180), scale: 0, opacity: 0, duration: rand(0.6, 1.1), ease: 'power2.out', onComplete: () => s.remove() });
  });
}

/* ── draggable ─────────────────────────────────────────────────── */
let zTop = 20;
function draggable(el, handle = el) {
  handle.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    // on phones only title bars drag; whole-object drags would steal the page scroll
    if (e.pointerType === 'touch' && handle === el) return;
    e.preventDefault();
    el.classList.add('lift');
    el.style.zIndex = ++zTop;
    const sx = e.clientX, sy = e.clientY;
    const bx = gsap.getProperty(el, 'x'), by = gsap.getProperty(el, 'y');
    gsap.to(el, { scale: 1.04, duration: 0.2 });
    const move = ev => gsap.set(el, { x: bx + ev.clientX - sx, y: by + ev.clientY - sy });
    const up = () => {
      el.classList.remove('lift');
      gsap.to(el, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  });
}
$$('.drag').forEach(el => draggable(el));

/* ── typewriter ────────────────────────────────────────────────── */
$$('.type').forEach((el, i) => {
  const text = el.dataset.text;
  if (calm) { el.textContent = text; return; }
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => {
      el.classList.add('on');
      let n = 0;
      setTimeout(function next() {
        el.textContent = text.slice(0, ++n);
        if (n < text.length) setTimeout(next, text[n - 1] === '\n' ? 260 : rand(22, 60));
        else setTimeout(() => el.classList.remove('on'), 1600);
      }, 300 + i * 450);
    }
  });
});

/* ── counters ──────────────────────────────────────────────────── */
function countUp(el, to, { dec = 0, suf = '', dur = 2 } = {}) {
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: calm ? 0 : dur, ease: 'expo.out', onUpdate: () => (el.textContent = o.v.toFixed(dec) + suf) });
}
$$('[data-count]').forEach(b => ScrollTrigger.create({
  trigger: b, start: 'top 90%', once: true,
  onEnter: () => countUp(b, +b.dataset.count, { dec: +(b.dataset.dec || 0), suf: b.dataset.suf || '' })
}));

/* ── shut down ─────────────────────────────────────────────────── */
function shutDown() {
  const crt = $('.crt-off');
  const line = document.createElement('div');
  line.className = 'crt-line';
  body.appendChild(line);
  gsap.timeline({ onComplete: () => line.remove() })
    .set(crt, { opacity: 1, pointerEvents: 'auto', clipPath: 'inset(0 0 0 0)' })
    .fromTo(line, { scaleX: 1, opacity: 0 }, { opacity: 1, duration: 0.05 })
    .to(line, { scaleX: 0, duration: 0.35, ease: 'power4.in' })
    .to(line, { opacity: 0, duration: 0.1 })
    .to('.crt-off p', { opacity: 1, duration: 0.6 }, '+=0.5')
    .to('.crt-off p', { opacity: 0, duration: 0.4 }, '+=1.6')
    .to(crt, { opacity: 0, duration: 0.5 })
    .set(crt, { pointerEvents: 'none' });
}
$$('.shutdown').forEach(b => b.addEventListener('click', shutDown));

/* ── crash: "don't press" breaks the whole site, then reboots into you.html ── */
let crashing = false;
function crash() {
  if (crashing) return;
  crashing = true;
  lenis?.stop();
  mem.set('crashed', true);
  if (calm) return (location.href = 'you.html');

  // 1. everything on screen lets go and falls
  const pieces = $$('main h1, main h2, main h3, main p, main figure, main li, main button, main a, main canvas, main .win, main .icon, .foot-row > *')
    .filter(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.width < innerWidth * 0.95; })
    .slice(0, 70);
  const tl = gsap.timeline();
  tl.to('main, .foot', { x: () => rand(-6, 6), duration: 0.05, repeat: 9, yoyo: true })
    .add(() => {
      for (let k = 0; k < 7; k++) setTimeout(() => {
        shown.delete('crash' + k);
        ALERTS['crash' + k] = ['xoxo.exe', ['not responding', 'feelings.dll is missing', 'too many feelings open', 'stack overflow: you', 'error 0312', 'cannot close: still in use', 'goodbye'][k], ['OK']];
        alertOnce('crash' + k);
      }, k * 90);
    }, 0.2)
    .to(pieces, {
      y: () => innerHeight + rand(100, 600), x: () => rand(-200, 200), rotate: () => rand(-120, 120),
      duration: () => rand(0.8, 1.5), ease: 'power2.in', stagger: { each: 0.012, from: 'random' }
    }, 0.6)
    .to('.taskbar', { y: 120, rotate: -3, duration: 0.8, ease: 'power2.in' }, 1.2)
    .add(bsod, 2.3);

  // 2. the pink screen of death, then reboot into you.html
  function bsod() {
    const scr = document.createElement('div');
    scr.className = 'bsod';
    scr.innerHTML = `<p class="bs-face">:(</p>
      <p>Your feelings ran into a problem and need to restart. We're just collecting some error info, and then we'll restart for you.</p>
      <p class="bs-pct"><b>0</b>% complete</p>
      <p class="bs-code">Stop code: FEELINGS_NOT_HANDLED<br>What failed: you.sys</p>`;
    body.appendChild(scr);
    $$('.alert').forEach(a => a.remove());
    const pct = $('.bs-pct b', scr), o = { v: 0 };
    gsap.timeline()
      .from(scr, { opacity: 0, duration: 0.15 })
      .to(o, { v: 100, duration: 3.2, ease: 'steps(12)', onUpdate: () => (pct.textContent = Math.round(o.v)) }, '+=0.4')
      .add(() => { sessionStorage.setItem('xo-wipe', 'rebooting…'); location.href = 'you.html'; }, '+=0.5');
  }
}

// the button lives in every footer
$$('.foot-small').forEach(f => {
  const b = document.createElement('button');
  b.className = 'crash-btn';
  b.innerHTML = '⚠ don\'t press';
  // how long they hovered before giving in
  let t0 = 0;
  b.addEventListener('mouseenter', () => (t0 = performance.now()));
  b.addEventListener('click', () => { if (t0) mem.set('hesitate', Math.round((performance.now() - t0) / 100) / 10); crash(); });
  f.querySelector('.shutdown')?.after(b);
});

/* ── infection range + final refresh (every page calls these last) ─ */
function infectBetween(trigger, start, endTrigger, end) {
  ScrollTrigger.create({
    trigger, start, endTrigger, end,
    onUpdate: self => setDirt(self.progress),
    onLeaveBack: () => setDirt(0)
  });
}
function finish() {
  // refresh in page order (pins push everything below them), again once fonts load
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    // arrived with #section in the link: go there once the pins are measured
    const target = location.hash && document.querySelector(location.hash);
    if (target) lenis ? lenis.scrollTo(target, { immediate: true }) : target.scrollIntoView();
  });
}
