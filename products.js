/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — products (needs core.js)                          ║
   ╚══════════════════════════════════════════════════════════════╝ */
gsap.registerPlugin(Flip);

const PRODUCTS = [
  { name: 'Crush 2.0',          tag: 'butterflies, on demand.',          img: 'img/INDEX/product-crush.jpg' },
  { name: 'Heartbreak Patch',   tag: 'silent install. loud recovery.',   img: 'img/INDEX/product-heartbreak.jpg' },
  { name: 'Closure.dmg',        tag: 'mount, drag, forget.',             img: 'img/INDEX/product-closure.jpg' },
  { name: 'Situationship Lite', tag: 'all the feelings, none of the labels.', img: 'img/INDEX/product-situationship.jpg' },
  { name: 'Jealousy Beta',      tag: 'do not install.',                  img: 'img/INDEX/product-jealosy.jpg' }
];

useAlerts({
  a: ['Closure.dmg', 'Closure.dmg could not be ejected because <b>it is still in use</b>.', ['OK', 'Force eject']],
  b: ['Situationship Lite', 'Your trial has expired. Your trial has not expired. <b>What are we?</b>', ['haha', 'k']],
  c: ['Jealousy Beta ♥', 'Jealousy Beta is <b>already installed</b>. It was always installed.', ['Close', 'Check again']]
});

/* ── intro ─────────────────────────────────────────────────────── */
gsap.timeline({ defaults: { ease: 'expo.out' }, delay: calm ? 0 : 0.35 })
  .from('.shelf-top > *', { y: -16, opacity: 0, duration: 1, stagger: 0.08 }, 0)
  .from('.shelf-title .ln > span', { yPercent: 115, rotate: 4, duration: 1.5, stagger: 0.1 }, 0.1)
  .from('.shelf-lede, .pick', { y: 20, opacity: 0, duration: 1, stagger: 0.05 }, 0.45)
  .from('.box', { y: -260, rotateX: 60, rotateZ: -20, opacity: 0, duration: 1.8, ease: 'bounce.out' }, 0.3)
  .from('.box-floor', { scale: 0, opacity: 0, duration: 1.2 }, 0.9);

/* ── the 3D box ────────────────────────────────────────────────── */
(function softwareBox() {
  const zone = $('.box-zone');
  const box = $('.box');
  const rot = { y: -28, x: -8 };
  let dragging = false, idle = true, lastX = 0, lastY = 0, vel = 0;

  const render = () => gsap.set(box, { rotateY: rot.y, rotateX: rot.x });
  render();

  gsap.ticker.add(() => {
    if (dragging) return;
    if (idle && !calm) rot.y += 0.25;
    else { rot.y += vel; vel *= 0.94; if (Math.abs(vel) < 0.05) idle = true; }
    rot.x += (-8 - rot.x) * 0.05;
    render();
  });

  zone.addEventListener('pointerdown', e => {
    dragging = true; idle = false; vel = 0;
    lastX = e.clientX; lastY = e.clientY;
    zone.setPointerCapture(e.pointerId);
  });
  zone.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    rot.y += dx * 0.5; rot.x = gsap.utils.clamp(-40, 40, rot.x - dy * 0.3);
    vel = dx * 0.5;
    lastX = e.clientX; lastY = e.clientY;
    render();
  });
  const release = () => { dragging = false; };
  zone.addEventListener('pointerup', release);
  zone.addEventListener('pointercancel', release);

  // choose a product: the box spins and changes skin halfway
  const artImg = $('.box-art img', box);
  const picks = $$('.pick');
  picks.forEach(btn => btn.addEventListener('click', () => {
    const p = PRODUCTS[+btn.dataset.i];
    picks.forEach(b => b.classList.toggle('is-on', b === btn));
    box.classList.toggle('is-bad', btn.classList.contains('pick-bad'));
    idle = false; vel = 0;
    const from = rot.y;
    gsap.to(rot, {
      y: from + 360, duration: calm ? 0 : 1.1, ease: 'expo.inOut',
      onUpdate() {
        render();
        if (!this._swapped && this.progress() > 0.45) {
          this._swapped = true;
          artImg.src = p.img;
          $('.box-art', box).dataset.file = p.img;
          $('.box-name', box).textContent = p.name;
          $('.box-tag', box).textContent = p.tag;
          $('.spine-name', box).textContent = p.name;
        }
      },
      onComplete: () => { idle = true; }
    });
  }));
})();

/* ── filters ───────────────────────────────────────────────────── */
const tiles = $$('.tile');
$$('.flt').forEach(btn => btn.addEventListener('click', () => {
  $$('.flt').forEach(b => b.classList.toggle('is-on', b === btn));
  const f = btn.dataset.f;
  const state = Flip.getState(tiles);
  tiles.forEach(t => t.classList.toggle('is-out', f !== 'all' && t.dataset.k !== f));
  Flip.from(state, {
    duration: calm ? 0 : 0.7, ease: 'expo.inOut', scale: true, absolute: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }),
    onLeave: els => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.4 })
  });
}));

// tiles jump to their chapter with the smooth scroll
tiles.forEach(t => t.addEventListener('click', e => {
  const target = $(t.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(target, { offset: -10, duration: 1.6 }) : target.scrollIntoView({ behavior: 'smooth' });
}));

/* ── installer window ──────────────────────────────────────────── */
const STEPS = {
  'Crush 2.0': ['copying butterflies.dll', 'registering blush.sys', 'indexing their playlists', 'rereading 1 (one) message 41 times'],
  'Heartbreak Patch': ['backing up self_esteem.exe', 'removing 3am_texts.bat', 'hiding their story', 'keeping the hoodie'],
  'Closure.dmg': ['mounting disk image', 'dragging ex to trash', 'emptying trash…', 'error: file is in use by "you"'],
  'Situationship Lite': ['extending free trial', 'loading mixed_signals.db', 'waiting for a reply', 'still waiting']
};
let installing = false;
const INSTALL_ROOM = { 'Crush 2.0': 'crush', 'Heartbreak Patch': 'ex', 'Closure.dmg': 'ex', 'Situationship Lite': 'crush' };
function install(name) {
  if (installing) return;
  installing = true;
  learn(INSTALL_ROOM[name], 2, `installed ${name}`);
  const w = document.createElement('div');
  w.className = 'installer';
  w.setAttribute('role', 'dialog');
  w.setAttribute('aria-label', `Installing ${name}`);
  w.innerHTML = `
    <div class="inst-bar"><span>${name} Setup</span><button aria-label="Close">✕</button></div>
    <div class="inst-body">
      <span class="inst-cd"></span>
      <div><p class="inst-title">Installing ${name}…</p><p class="inst-step">preparing feelings</p></div>
      <div class="inst-prog">${'<i></i>'.repeat(26)}</div>
    </div>
    <div class="inst-act"><button class="inst-no">Cancel</button><button class="inst-ok" disabled>Finish</button></div>`;
  body.appendChild(w);
  draggable(w, $('.inst-bar', w));

  const blocks = $$('.inst-prog i', w);
  const stepEl = $('.inst-step', w);
  const steps = STEPS[name] || ['installing'];
  const close = () => gsap.to(w, { opacity: 0, scale: 0.9, duration: 0.25, onComplete: () => { w.remove(); installing = false; } });

  const tl = gsap.timeline();
  tl.fromTo(w, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' });
  blocks.forEach((b, i) => {
    tl.to(b, { opacity: 1, duration: 0.01 }, `+=${calm ? 0 : rand(0.04, 0.16)}`);
    if (i % Math.ceil(blocks.length / steps.length) === 0) tl.add(() => scramble(stepEl, steps[Math.floor(i / Math.ceil(blocks.length / steps.length))], 400));
  });
  tl.add(() => {
    $('.inst-title', w).textContent = `${name} was installed.`;
    scramble(stepEl, 'restart your heart to apply changes ♥', 500);
    $('.inst-cd', w).style.animationPlayState = 'paused';
    const ok = $('.inst-ok', w);
    ok.disabled = false;
    ok.textContent = 'Restart heart';
    $('.inst-no', w).textContent = 'Later';
  });

  $('.inst-bar button', w).addEventListener('click', () => { tl.kill(); close(); });
  $('.inst-no', w).addEventListener('click', () => { tl.kill(); close(); });
  $('.inst-ok', w).addEventListener('click', () => {
    close();
    // tiny "restart": the page blinks off and on
    gsap.timeline()
      .to('main', { filter: 'brightness(0)', duration: 0.12 })
      .to('main', { filter: 'brightness(3) saturate(0)', duration: 0.06 })
      .to('main', { filter: 'none', duration: 0.5 });
  });
}
$$('.install').forEach(b => b.addEventListener('click', () => install(b.dataset.name)));

/* ── compare table: highlight a whole column on hover ──────────── */
const table = $('.cmp');
table.addEventListener('mouseover', e => {
  const cell = e.target.closest('td, thead th');
  $$('.hot', table).forEach(c => c.classList.remove('hot'));
  if (!cell || cell.cellIndex === 0) return;
  $$('tr', table).forEach(r => r.cells[cell.cellIndex]?.classList.add('hot'));
});
table.addEventListener('mouseleave', () => $$('.hot', table).forEach(c => c.classList.remove('hot')));

/* ── quarantine: the name keeps breaking ───────────────────────── */
const qName = $('.q-name');
const Q_NAMES = ['Jealousy Beta', 'J3AL0USY_B3TA', 'WHO IS SHE', 'Jealousy Beta', 'WHY R U ONLINE'];
let qi = 0;
if (!calm) setInterval(() => { qi = (qi + 1) % Q_NAMES.length; scramble(qName, Q_NAMES[qi], 500); }, 2400);

// RGB ghosts jitter
if (!calm) {
  const jitter = () => {
    gsap.to('.q-g1', { x: rand(-14, 14), y: rand(-6, 6), duration: 0.08 });
    gsap.to('.q-g2', { x: rand(-14, 14), y: rand(-6, 6), duration: 0.08 });
    gsap.delayedCall(rand(0.08, 0.6), jitter);
  };
  jitter();
}

/* ── hold to install (don't) ───────────────────────────────────── */
(function hold() {
  const btn = $('.hold');
  const ring = $('.hold-ring circle');
  const txt = $('.hold-txt');
  const LEN = 339.3;
  let tw = null, done = false;

  const start = e => {
    if (done) return;
    e.preventDefault();
    btn.classList.add('pressing');
    tw = gsap.to(ring, {
      strokeDashoffset: 0, duration: calm ? 0.2 : 2.2, ease: 'none',
      onUpdate() { gsap.set('main', { x: rand(-1, 1) * this.progress() * 4, y: rand(-1, 1) * this.progress() * 3 }); },
      onComplete: flood
    });
  };
  const stop = () => {
    if (done || !tw) return;
    btn.classList.remove('pressing');
    tw.kill();
    gsap.to(ring, { strokeDashoffset: LEN, duration: 0.5, ease: 'power2.out' });
    gsap.to('main', { x: 0, y: 0, duration: 0.3 });
  };

  function flood() {
    done = true;
    mem.set('jealousy', true);
    learn('ex', 3, 'installed jealousy beta');
    btn.classList.remove('pressing');
    gsap.set('main', { x: 0, y: 0 });
    txt.innerHTML = 'installed<br><small>(you did it)</small>';
    body.classList.add('shake');
    setDirt(1);
    gsap.timeline()
      .to('.flood', { clipPath: 'circle(150% at 50% 50%)', duration: 1.1, ease: 'expo.inOut' })
      .from('.flood p', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(2)' }, '-=0.4')
      .to('.flood', { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'expo.inOut' }, '+=1.4')
      .add(() => body.classList.remove('shake'));
  }

  btn.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL SCENES
   ══════════════════════════════════════════════════════════════ */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {

  // index
  gsap.from('.index-head > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.p-index', start: 'top 75%' } });
  gsap.from('.tile', { y: 80, opacity: 0, rotate: i => [-3, 2, -2, 3, -4][i], duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.tiles', start: 'top 85%' } });

  // chapters
  $$('.chap').forEach(chap => {
    const img = $('.chap-img', chap);
    gsap.to(img, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: chap, start: 'top 80%', end: 'top 10%', scrub: true } });
    gsap.fromTo($('img', img), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: chap, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($$('.chap-body > *', chap), { y: 50, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: $('.chap-body', chap), start: 'top 75%' } });
    gsap.from($$('.feat li', chap), { x: -30, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: $('.feat', chap), start: 'top 85%' } });

    // the later chapters glitch on arrival
    if (+chap.dataset.lvl > 0) {
      const name = $('.chap-name', chap);
      const real = name.textContent;
      ScrollTrigger.create({
        trigger: chap, start: 'top 55%',
        onEnter: () => { scramble(name, real.replace(/[aeio]/g, c => ({ a: '4', e: '3', i: '1', o: '0' }[c])), 400); setTimeout(() => scramble(name, real, 600), 700); }
      });
    }
  });

  // leaks flicker in
  $$('.leak').forEach(l => gsap.fromTo(l, { opacity: 0 }, { opacity: 1, duration: 0.08, repeat: 7, yoyo: true, scrollTrigger: { trigger: l, start: 'top 70%' } }));

  // compare
  gsap.from('.p-compare h2, .p-compare .kicker', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.p-compare', start: 'top 70%' } });
  gsap.from('.cmp tr', { y: 20, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.cmp', start: 'top 80%' } });

  // quarantine
  gsap.from('.q-media', { clipPath: 'inset(50% 50% 50% 50%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.q-grid', start: 'top 70%' } });
  gsap.from('.q-stamp', { scale: 3, opacity: 0, duration: 0.5, ease: 'power4.in', scrollTrigger: { trigger: '.q-grid', start: 'top 45%' } });
  gsap.from('.q-body > *', { y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.q-body', start: 'top 75%' } });
  gsap.fromTo('.q-tape-a', { rotate: 0 }, { rotate: -2, ease: 'none', scrollTrigger: { trigger: '.p-quarantine', start: 'top bottom', end: 'bottom top', scrub: true } });

  // next
  gsap.from('.p-next > *', { y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.p-next', start: 'top 80%' } });
});

// clean on top, infected from the beta products down to the quarantine
infectBetween('#closure', 'top 60%', '.p-quarantine', 'top 30%');
finish();
