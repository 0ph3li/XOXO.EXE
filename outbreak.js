/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — outbreak (needs core.js)                          ║
   ╚══════════════════════════════════════════════════════════════╝ */

useAlerts({
  a: ['Emergency Alert', 'xoxo.exe detected <b>in your area</b>. Avoid your drafts folder.', ['OK', 'Too late']],
  b: ['Public Notice', 'Do not reply to messages sent after 03:12AM. <b>Especially your own.</b>', ['Understood', 'lol']],
  c: ['xoxo.exe ♥', 'Your device has been <b>added to the outbreak map</b>. Say hi to Milano.', ['Close', 'hi']]
});

const fmtN = n => Math.floor(n).toLocaleString('en-US');

/* ── intro ─────────────────────────────────────────────────────── */
gsap.timeline({ defaults: { ease: 'expo.out' }, delay: calm ? 0 : 0.35 })
  .from('.breaking', { yPercent: -100, duration: 0.9 }, 0)
  .from('.o-title .ln > span', { yPercent: 115, rotate: 3, duration: 1.5, stagger: 0.1 }, 0.1)
  .from('.live-copy .kicker, .o-lede, .live-stats > div', { y: 24, opacity: 0, duration: 1, stagger: 0.07 }, 0.4)
  .from('.globe-wrap', { scale: 0.6, opacity: 0, rotate: -20, duration: 1.8 }, 0.2);

/* ── live counters ─────────────────────────────────────────────── */
(function counters() {
  const c = $('.o-count'), s = $('.o-sent'), r = $('.o-replies');
  let inf = 23918477, sent = 61204090, rep = 12;
  if (calm) return;
  setInterval(() => {
    inf += Math.round(rand(2, 14)); sent += Math.round(rand(6, 40));
    c.textContent = fmtN(inf); s.textContent = fmtN(sent);
    if (Math.random() < 0.02) { r.textContent = ++rep; gsap.fromTo(r, { color: '#c9ff1f' }, { color: '#fff', duration: 1.5 }); }
  }, 700);
})();

/* ── the globe ─────────────────────────────────────────────────── */
(function globe() {
  const wrap = $('.globe-wrap');
  const cv = $('.globe');
  const ctx = cv.getContext('2d');
  const feed = $('.globe-feed');

  const CITIES = [
    ['MILANO', 45.46, 9.19, 'are u up'], ['SEOUL', 37.57, 126.98, 'i saw ur story'], ['PARIS', 48.86, 2.35, 'come back'],
    ['TOKYO', 35.68, 139.69, 'nvm'], ['LONDON', 51.5, -0.12, 'we should talk'], ['NEW YORK', 40.71, -74, 'happy birthday btw'],
    ['BERLIN', 52.52, 13.4, 'u up?'], ['LOS ANGELES', 34.05, -118.24, 'i miss us'], ['SÃO PAULO', -23.55, -46.63, 'why did you leave'],
    ['LAGOS', 6.52, 3.38, 'are we okay'], ['MANILA', 14.6, 120.98, 'i still think about it'], ['SYDNEY', -33.87, 151.21, 'goodnight x'],
    ['MEXICO CITY', 19.43, -99.13, 'te extraño'], ['MUMBAI', 19.08, 72.88, 'call me'], ['OSLO', 59.91, 10.75, 'sorry']
  ];
  const toXYZ = (lat, lon) => {
    const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return [-Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)];
  };
  const START = ['MILANO', 'PARIS', 'LONDON', 'SEOUL', 'BERLIN'];
  const cities = CITIES.map(([name, lat, lon, msg]) => ({ name, msg, p: toXYZ(lat, lon), on: START.includes(name) ? 1 : 0 }));

  // dots evenly spread over the sphere
  const N = innerWidth < 760 ? 700 : 1300;
  const pts = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = g * i;
    pts.push({ p: [Math.cos(t) * r, y, Math.sin(t) * r], inf: 0 });
  }
  // seed infection around Milano
  cities.filter(c => c.on).forEach(c => pts.forEach(d => { if (dist(d.p, c.p) < (c.name === 'MILANO' ? 0.2 : 0.11)) d.inf = 1; }));
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

  let rotY = -0.2, rotX = 0.35, vel = 0.0022, dragging = false, lx = 0, ly = 0;
  const arcs = [];
  let w, h, R, dpr;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    w = r.width; h = r.height; R = Math.min(w, h) * 0.42;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size(); addEventListener('resize', size);

  const project = p => {
    const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
    let x = p[0] * cy - p[2] * sy, z = p[0] * sy + p[2] * cy, y = p[1];
    const y2 = y * cx - z * sx; z = y * sx + z * cx;
    return [w / 2 + x * R, h / 2 - y2 * R, z];
  };

  // new infections: a city lights up and an arc flies there
  let ci = 3;
  function launch() {
    const from = cities.filter(c => c.on)[(Math.random() * cities.filter(c => c.on).length) | 0];
    const to = cities[ci % cities.length];
    ci++;
    arcs.push({ a: from.p, b: to.p, t: 0, to });
    feed.textContent = `${new Date().toTimeString().slice(0, 8)} — ${from.name} → ${to.name}: "${to.msg}"`;
  }
  if (!calm) setInterval(launch, 1600);
  launch();

  function slerp(a, b, t) {
    const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    if (d < 1e-4) return a;
    const s = Math.sin(d), k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
    const lift = 1 + Math.sin(Math.PI * t) * 0.25 * d;
    return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
  }

  let running = false;
  function frame() {
    if (!dragging) rotY += calm ? 0 : vel;
    ctx.clearRect(0, 0, w, h);

    // glow behind the sphere
    const grd = ctx.createRadialGradient(w / 2, h / 2, R * 0.6, w / 2, h / 2, R * 1.35);
    grd.addColorStop(0, 'rgba(255,47,191,.10)'); grd.addColorStop(1, 'rgba(255,47,191,0)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, R, 0, Math.PI * 2); ctx.stroke();

    // slow spread between neighbours
    if (!calm) for (let k = 0; k < 3; k++) {
      const src = pts[(Math.random() * N) | 0];
      if (src.inf) pts.forEach(d => { if (!d.inf && dist(d.p, src.p) < 0.09 && Math.random() < 0.5) d.inf = 0.01; });
    }

    pts.forEach(d => {
      const [x, y, z] = project(d.p);
      if (d.inf && d.inf < 1) d.inf = Math.min(1, d.inf + 0.04);
      const front = z > 0;
      if (d.inf) {
        ctx.fillStyle = front ? `rgba(255,47,191,${0.5 + d.inf * 0.5})` : 'rgba(255,47,191,.18)';
        ctx.beginPath(); ctx.arc(x, y, front ? 1.9 : 1.2, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = front ? `rgba(255,255,255,${0.25 + z * 0.5})` : 'rgba(255,255,255,.07)';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    });

    // arcs
    for (let i = arcs.length - 1; i >= 0; i--) {
      const a = arcs[i];
      a.t += calm ? 1 : 0.012;
      const head = Math.min(1, a.t), tail = Math.max(0, a.t - 0.45);
      ctx.strokeStyle = '#ff2fbf'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let k = 0; k <= 24; k++) {
        const tt = tail + (head - tail) * (k / 24);
        const [x, y] = project(slerp(a.a, a.b, tt));
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      if (a.t >= 1 && !a.to.on) {
        a.to.on = 1;
        pts.forEach(d => { if (dist(d.p, a.to.p) < 0.08) d.inf = 0.01; });
      }
      if (tail >= 1) arcs.splice(i, 1);
    }

    // cities
    ctx.font = '10px "Space Mono", monospace';
    cities.forEach(c => {
      const [x, y, z] = project(c.p);
      if (z <= 0.05) return;
      ctx.fillStyle = c.on ? '#ff2fbf' : 'rgba(255,255,255,.6)';
      ctx.beginPath(); ctx.arc(x, y, c.on ? 4 : 2.5, 0, 7); ctx.fill();
      if (c.on) {
        const pulse = (performance.now() / 900 + c.p[0]) % 1;
        ctx.strokeStyle = `rgba(255,47,191,${1 - pulse})`;
        ctx.beginPath(); ctx.arc(x, y, 4 + pulse * 16, 0, 7); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        ctx.fillText(c.name, x + 8, y - 6);
      }
    });

    if (running) requestAnimationFrame(frame);
  }

  new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(frame);
  }).observe(cv);

  wrap.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; wrap.setPointerCapture(e.pointerId); });
  wrap.addEventListener('pointermove', e => {
    if (!dragging) return;
    rotY += (e.clientX - lx) * 0.006;
    rotX = gsap.utils.clamp(-1.1, 1.1, rotX + (e.clientY - ly) * 0.004);
    lx = e.clientX; ly = e.clientY;
    if (calm) frame();
  });
  ['pointerup', 'pointercancel'].forEach(ev => wrap.addEventListener(ev, () => (dragging = false)));
})();

/* ── timeline clock ────────────────────────────────────────────── */
(function clock() {
  const ticks = $('.c-ticks');
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0;
    const r1 = big ? 80 : 86, r2 = 92;
    ticks.insertAdjacentHTML('beforeend', `<line class="${big ? 'big' : ''}" x1="${100 + Math.sin(a) * r1}" y1="${100 - Math.cos(a) * r1}" x2="${100 + Math.sin(a) * r2}" y2="${100 - Math.cos(a) * r2}"/>`);
  }
  const hH = $('.c-h'), hM = $('.c-m'), lbl = $('.clock-time'), day = $('.clock-day');
  const now = new Date();
  // minutes since night 1, 00:00 — one stop per event
  const STOPS = [192, 194, 280, 1440 + 1382, 6 * 1440 + 192, 7 * 1440 + now.getHours() * 60 + now.getMinutes()];
  const set = p => {
    const f = p * (STOPS.length - 1), i = Math.min(STOPS.length - 2, Math.floor(f));
    const m = STOPS[i] + (STOPS[i + 1] - STOPS[i]) * (f - i);
    const mm = m % 60, hh = Math.floor(m / 60) % 24;
    gsap.set(hM, { rotation: mm * 6, svgOrigin: '100 100' });
    gsap.set(hH, { rotation: (hh % 12) * 30 + mm * 0.5, svgOrigin: '100 100' });
    lbl.textContent = `${String(hh).padStart(2, '0')}:${String(Math.floor(mm)).padStart(2, '0')}`;
    day.textContent = p > 0.97 ? 'now' : `night ${Math.floor(m / 1440) + 1}`;
  };
  set(0);
  ScrollTrigger.create({ trigger: '.timeline', start: 'top 55%', end: 'bottom 60%', scrub: 0.5, onUpdate: s => set(s.progress) });
  $$('.t-ev').forEach(ev => ScrollTrigger.create({ trigger: ev, start: 'top 55%', onToggle: s => ev.classList.toggle('lit', s.isActive || s.progress > 0), end: 'max' }));
})();

/* ── case file: redactions ─────────────────────────────────────── */
$$('.rx').forEach(rx => {
  rx.setAttribute('tabindex', '0');
  rx.setAttribute('role', 'button');
  rx.setAttribute('aria-label', 'Reveal redacted text');
  const open = () => { rx.classList.add('open'); scramble(rx.nextElementSibling, rx.nextElementSibling.textContent, 500); };
  const close = () => rx.classList.remove('open');
  rx.addEventListener('mouseenter', open);
  rx.addEventListener('click', open);
  rx.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  rx.nextElementSibling.addEventListener('mouseleave', close);
});

/* ── spread simulator ──────────────────────────────────────────── */
(function sim() {
  const cv = $('.sim');
  const ctx = cv.getContext('2d');
  const nEl = $('.sim-n'), totEl = $('.sim-total'), hint = $('.sim-hint');
  const LINES = ['are u up', 'i miss u', 'nvm', 'come back', 'hi', 'we should talk', '♥', 'who is this', 'lol', 'sorry'];
  const GAP = 16;
  let cols, rows, cells, w, h, dpr, count = 0, bubbles = [], running = false, last = 0;

  const setup = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.floor(w / GAP); rows = Math.floor(h / GAP);
    cells = new Float32Array(cols * rows);
    count = 0; bubbles = [];
    totEl.textContent = fmtN(cols * rows);
    nEl.textContent = 0;
  };
  setup();
  addEventListener('resize', () => { setup(); draw(); });

  const infect = (i, j) => {
    if (i < 0 || j < 0 || i >= cols || j >= rows) return;
    const k = j * cols + i;
    if (cells[k]) return;
    cells[k] = 0.01; count++;
    if (Math.random() < 0.012) bubbles.push({ x: i * GAP, y: j * GAP, t: 0, s: LINES[(Math.random() * LINES.length) | 0] });
  };

  cv.addEventListener('click', e => {
    const r = cv.getBoundingClientRect();
    const i = Math.floor((e.clientX - r.left) / GAP), j = Math.floor((e.clientY - r.top) / GAP);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) infect(i + a, j + b);
    bubbles.push({ x: i * GAP, y: j * GAP, t: 0, s: 'are u up' });
    hint.classList.add('gone');
    if (!running) { running = true; requestAnimationFrame(loop); }
  });
  $('.sim-reset').addEventListener('click', () => { setup(); hint.classList.remove('gone'); draw(); });

  function step() {
    const next = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (cells[j * cols + i] < 0.3) continue;
      if (Math.random() < 0.3) next.push([i + ((Math.random() * 3) | 0) - 1, j + ((Math.random() * 3) | 0) - 1]);
    }
    next.forEach(([i, j]) => infect(i, j));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const ox = (w - cols * GAP) / 2 + 3, oy = (h - rows * GAP) / 2 + 2;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const v = cells[j * cols + i];
      const x = ox + i * GAP, y = oy + j * GAP;
      if (v) {
        ctx.fillStyle = `rgba(255,47,191,${0.35 + v * 0.65})`;
        ctx.fillRect(x - v, y - v, 8 + v * 2, 12 + v * 2);
      } else {
        ctx.fillStyle = '#2a272e';
        ctx.fillRect(x, y, 8, 12);
      }
    }
    ctx.font = '11px "Space Mono", monospace';
    bubbles.forEach(b => {
      const a = b.t < 0.2 ? b.t / 0.2 : 1 - (b.t - 0.2) / 0.8;
      const tw = ctx.measureText(b.s).width + 14;
      const x = ox + b.x - tw / 2 + 4, y = oy + b.y - 24 - b.t * 20;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = '#fff'; ctx.fillRect(x, y, tw, 18);
      ctx.fillStyle = '#0c0b0d'; ctx.fillText(b.s, x + 7, y + 13);
      ctx.globalAlpha = 1;
    });
  }

  function loop(t) {
    if (t - last > 70) {
      last = t;
      step();
      for (let k = 0; k < cells.length; k++) if (cells[k] && cells[k] < 1) cells[k] = Math.min(1, cells[k] + 0.08);
      bubbles.forEach(b => (b.t += 0.02));
      bubbles = bubbles.filter(b => b.t < 1);
      nEl.textContent = fmtN(count);
    }
    draw();
    if (count < cols * rows || bubbles.length) requestAnimationFrame(loop);
    else running = false;
  }
  draw();
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL SCENES
   ══════════════════════════════════════════════════════════════ */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // timeline entries
  $$('.t-ev').forEach(ev => gsap.from(ev.children, { y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: ev, start: 'top 75%' } }));
  $$('.t-img').forEach(im => gsap.fromTo($('img', im), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // folder slides in and the stamp slams
  gsap.from('.folder', { y: 120, rotate: 4, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.o-case', start: 'top 75%' } });
  gsap.from('.case-stamp', { scale: 3, opacity: 0, duration: 0.45, ease: 'power4.in', scrollTrigger: { trigger: '.folder', start: 'top 40%' } });
  gsap.from('.case-data dt, .case-data dd', { x: 20, opacity: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out', scrollTrigger: { trigger: '.case-data', start: 'top 80%' } });

  // simulator + news
  gsap.from('.sim-head > *, .sim-box', { y: 50, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.o-sim', start: 'top 70%' } });
  gsap.from('.news-title, .o-news > .kicker', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.o-news', start: 'top 75%' } });
  $$('.clip-n').forEach(c => {
    gsap.from(c, { y: 100, opacity: 0, rotate: '+=8', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 92%' } });
    gsap.to(c, { yPercent: +c.dataset.speed * -100, ease: 'none', scrollTrigger: { trigger: '.clips', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // rank + rules + next
  gsap.from('.rank li', { x: -60, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.rank', start: 'top 80%' } });
  gsap.from('.rank-head > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.o-rank', start: 'top 75%' } });
  gsap.from('.rule', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.rules', start: 'top 80%' } });
  gsap.from('.o-next > *', { y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.o-next', start: 'top 80%' } });
});

// already infected when you arrive — it only gets worse
setDirt(0.3);
ScrollTrigger.create({ trigger: 'main', start: 'top top', end: 'bottom bottom', onUpdate: s => setDirt(0.3 + s.progress * 0.7) });
finish();
