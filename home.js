/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — home (needs core.js)                              ║
   ╚══════════════════════════════════════════════════════════════╝ */
/* ── boot → hero ───────────────────────────────────────────────── */
const boot = $('.boot');
const BOOT_STEPS = [
  [0, 'initializing feelings…'],
  [22, 'loading empathy.dll'],
  [41, 'calibrating crush levels'],
  [63, 'mounting closure.dmg'],
  [82, 'warning: unsigned feelings detected'],
  [96, 'ok ♥']
];

function heroIn() {
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero-top > *', { y: -16, opacity: 0, duration: 1, stagger: 0.08 }, 0)
    .from('.hero-title .ln > span', { yPercent: 115, rotate: 4, duration: 1.5, stagger: 0.1 }, 0.1)
    .from('.hero-shot', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut' }, 0.15)
    .from('.hero-shot img', { scale: 1.35, duration: 2.2 }, 0.15)
    .from('.hero-bottom > *', { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.6)
    .from('.taskbar', { yPercent: 100, duration: 1 }, 0.5);
}

function runBoot() {
  const bar = $('.boot-bar i', boot);
  const pct = $('.boot-pct', boot);
  const stepEl = $('.boot-step', boot);
  const s = { v: 0 };
  let i = 0;
  gsap.timeline()
    .from('.boot-box', { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' })
    .to(s, {
      v: 100, duration: 2.6, ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(s.v);
        bar.style.width = v + '%';
        pct.textContent = String(v).padStart(3, '0') + '%';
        while (i < BOOT_STEPS.length && v >= BOOT_STEPS[i][0]) {
          stepEl.textContent = BOOT_STEPS[i][1];
          if (BOOT_STEPS[i][0] === 82) boot.classList.add('warn');
          i++;
        }
      }
    })
    .add(() => boot.classList.add('glitch'))
    .to(boot, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '+=0.45')
    .add(() => {
      boot.remove();
      body.classList.remove('is-loading');
      lenis?.start();
      heroIn();
      finish();
    }, '-=0.35');
}

// full boot only on the first visit of the session
if (calm || sessionStorage.getItem('xo-booted') || arrived) {
  boot.remove();
  body.classList.remove('is-loading');
  heroIn();
} else {
  sessionStorage.setItem('xo-booted', '1');
  lenis?.stop();
  runBoot();
}

/* ── hero: random RGB jolt + photo parallax ────────────────────── */
const heroTitle = $('.hero-title');
if (!calm) {
  (function loop() {
    setTimeout(() => {
      heroTitle.classList.add('jolt');
      setTimeout(() => heroTitle.classList.remove('jolt'), 240);
      loop();
    }, rand(2600, 5200));
  })();
}

/* ── manifesto: split into words ───────────────────────────────── */
const manifesto = $('.manifesto');
(function splitWords(node) {
  [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.append(part);
        else { const w = document.createElement('span'); w.className = 'w'; w.textContent = part; frag.append(w); }
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) {
      n.classList.add('w');
    }
  });
})(manifesto);

/* ── stats: bug counter flickers ───────────────────────────────── */
const bug = $('.stat-bug');
setInterval(() => {
  bug.classList.add('flick');
  $('b', bug).textContent = '1';
  setTimeout(() => { bug.classList.remove('flick'); $('b', bug).textContent = '0'; }, 160);
}, 3400);

/* ── corrupted product name ────────────────────────────────────── */
const badName = $('.prod-glitch');
const BAD = ['Jealousy Beta', 'J3al0usy_B3ta', 'why r u online', 'Jealousy Beta', '█████ Beta'];
let bi = 0;
setInterval(() => { bi = (bi + 1) % BAD.length; scramble(badName, BAD[bi], 500); }, 2200);

const count = $('.count');
const fmt = n => Math.floor(n).toString().padStart(8, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
ScrollTrigger.create({
  trigger: count, start: 'top 85%', once: true,
  onEnter: () => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +count.dataset.to, duration: calm ? 0 : 2.8, ease: 'expo.out',
      onUpdate: () => (count.textContent = fmt(o.v)),
      onComplete: () => { let v = +count.dataset.to; setInterval(() => (count.textContent = fmt(v += Math.round(rand(1, 9)))), 900); }
    });
  }
});

/* ── radar ─────────────────────────────────────────────────────── */
(function radar() {
  const cv = $('.radar');
  const ctx = cv.getContext('2d');
  const CITIES = ['MILANO', 'SEOUL', 'PARIS', 'TOKYO', 'LONDON', 'NYC', 'BERLIN', 'LAGOS', 'SÃO PAULO', 'MANILA', 'OSLO', 'LA'];
  const blips = CITIES.map(name => ({ name, a: rand(0, Math.PI * 2), r: rand(0.18, 0.92), glow: 0 }));
  let w, h, dpr, angle = 0, running = false;

  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size(); addEventListener('resize', size);

  const draw = () => {
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 2;
    ctx.clearRect(0, 0, w, h);

    // rings + cross
    ctx.strokeStyle = 'rgba(12,11,13,.18)'; ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

    // halftone disc
    ctx.fillStyle = 'rgba(12,11,13,.07)';
    for (let y = -R; y < R; y += 8) for (let x = -R; x < R; x += 8) if (x * x + y * y < R * R) { ctx.beginPath(); ctx.arc(cx + x, cy + y, 1, 0, 7); ctx.fill(); }

    // sweep
    const g = ctx.createConicGradient ? ctx.createConicGradient(angle - 0.9, cx, cy) : null;
    if (g) {
      g.addColorStop(0, 'rgba(255,47,191,0)');
      g.addColorStop(0.14, 'rgba(255,47,191,.45)');
      g.addColorStop(0.1401, 'rgba(255,47,191,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#ff2fbf'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R); ctx.stroke();

    // blips
    blips.forEach(b => {
      const diff = ((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      if (diff < 0.05) b.glow = 1;
      b.glow *= 0.985;
      const x = cx + Math.cos(b.a) * b.r * R, y = cy + Math.sin(b.a) * b.r * R;
      ctx.fillStyle = `rgba(255,47,191,${0.25 + b.glow * 0.75})`;
      ctx.beginPath(); ctx.arc(x, y, 4 + b.glow * 3, 0, 7); ctx.fill();
      if (b.glow > 0.05) {
        ctx.strokeStyle = `rgba(255,47,191,${b.glow * 0.6})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, 6 + (1 - b.glow) * 26, 0, 7); ctx.stroke();
        ctx.fillStyle = `rgba(12,11,13,${b.glow})`;
        ctx.font = '10px "Space Mono", monospace';
        ctx.fillText(b.name, x + 10, y - 8);
      }
    });

    angle += calm ? 0 : 0.018;
    if (running) requestAnimationFrame(draw);
  };

  new IntersectionObserver(([e]) => {
    const was = running;
    running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(draw);
  }).observe(cv);
  draw();
})();

/* ── symptoms: floating photo follows the cursor ───────────────── */
if (mouse) {
  const peek = $('.hover-peek');
  const peekImg = $('img', peek);
  watchSlot(peekImg);
  const px = gsap.quickTo(peek, 'x', { duration: 0.45, ease: 'power3' });
  const py = gsap.quickTo(peek, 'y', { duration: 0.45, ease: 'power3' });
  const pr = gsap.quickTo(peek, 'rotate', { duration: 0.6, ease: 'power3' });
  let lastX = 0;
  $$('.symptoms li').forEach(li => {
    li.addEventListener('mouseenter', () => {
      peek.dataset.file = li.dataset.img;
      peek.classList.remove('is-empty');
      peekImg.src = li.dataset.img;
      peek.classList.add('show');
    });
    li.addEventListener('mouseleave', () => peek.classList.remove('show'));
  });
  addEventListener('mousemove', e => {
    px(e.clientX); py(e.clientY);
    pr(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  });
}

/* ── symptoms: click opens a diagnosis that links into the site ── */
(function diagnosis() {
  const dx = $('.dx');
  const img = $('.dx-img img');
  watchSlot(img);
  let lastLi = null;

  const SYMPTOM_ROOM = ['ex', 'crush', 'crush', 'crush', 'me', 'me'];
  const open = li => {
    const k = $$('.symptoms li').indexOf(li);
    if (SYMPTOM_ROOM[k]) learn(SYMPTOM_ROOM[k], 1.5, `read about "${$('b', li).textContent}"`);
    lastLi = li;
    $('.hover-peek')?.classList.remove('show');
    const slot = $('.dx-img');
    slot.dataset.file = li.dataset.img;
    slot.classList.remove('is-empty');
    img.src = li.dataset.img;
    $('.dx-code').textContent = li.dataset.code;
    $('.dx-name').textContent = $('b', li).textContent;
    $('.dx-sev').textContent = $('i', li).textContent;
    $('.dx-first').textContent = li.dataset.first;
    $('.dx-desc').textContent = li.dataset.desc;
    $('.dx-treat span').textContent = li.dataset.treat;
    const go = $('.dx-go');
    go.href = li.dataset.go;
    $('span', go).textContent = li.dataset.goLabel;
    dx.classList.add('open');
    dx.setAttribute('aria-hidden', 'false');
    lenis?.stop();
    if (!calm) {
      gsap.fromTo('.dx-card', { y: 70, rotate: 2, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
      gsap.fromTo('.dx-stamp', { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.45, ease: 'power4.in' });
      scramble($('.dx-name'), $('b', li).textContent, 600);
    }
    $('.dx-x').focus();
  };
  const close = () => {
    if (!dx.classList.contains('open')) return;
    dx.classList.remove('open');
    dx.setAttribute('aria-hidden', 'true');
    lenis?.start();
    lastLi?.focus();
  };

  $$('.symptoms li').forEach(li => {
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Diagnosis: ${$('b', li).textContent}`);
    li.addEventListener('click', () => open(li));
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(li); } });
  });
  $('.dx-x').addEventListener('click', close);
  dx.addEventListener('click', e => { if (e.target === dx) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── infection card ────────────────────────────────────────────── */
(function card() {
  const bind = (inp, out, fallback) => {
    const upd = () => (out.textContent = inp.value.trim() || fallback);
    inp.addEventListener('input', upd);
    inp.addEventListener('change', upd);
  };
  bind($('#f-name'), $('#c-name'), 'Your Name');
  $('#f-name').addEventListener('change', e => mem.set('name', e.target.value.trim()));
  $('#f-by').addEventListener('change', e => mem.set('by', e.target.value.trim()));
  bind($('#f-by'), $('#c-by'), 'a certain someone');
  bind($('#f-strain'), $('#c-strain'), 'Crush 2.0');
  const d = new Date();
  $('#c-date').textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#c-no').textContent = String(Math.floor(rand(100000, 999999)));

  const idcard = $('.idcard');
  const zone = $('.card-zone');
  const stage = $('.card-stage');

  // tilt + shine follow the mouse (in place and when enlarged)
  if (mouse && !calm) {
    [zone, stage].forEach(area => {
      area.addEventListener('mousemove', e => {
        const r = area.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        const k = area === stage ? 0.6 : 1;
        gsap.to(idcard, { rotateY: x * 18 * k, rotateX: -y * 14 * k, duration: 0.5 });
        idcard.style.setProperty('--shine', `${50 + x * 100}%`);
      });
      area.addEventListener('mouseleave', () => gsap.to(idcard, { rotateX: 0, rotateY: 0, duration: 0.8 }));
    });
  }

  // click → the card flies to the center, enlarged
  gsap.registerPlugin(Flip);
  let zoomed = false;
  const zoom = open => {
    if (open === zoomed) return;
    zoomed = open;
    gsap.killTweensOf(idcard);
    gsap.set(idcard, { rotateX: 0, rotateY: 0 });
    const state = Flip.getState(idcard);
    (open ? stage : zone).appendChild(idcard);
    stage.classList.toggle('open', open);
    stage.setAttribute('aria-hidden', !open);
    open ? lenis?.stop() : lenis?.start();
    Flip.from(state, { duration: calm ? 0 : 0.85, ease: 'expo.inOut', scale: true });
    if (open) gsap.fromTo('.card-stage-x', { opacity: 0, y: -10 }, { opacity: 1, y: 0, delay: 0.4 });
  };
  idcard.addEventListener('click', e => { e.stopPropagation(); zoom(!zoomed); });
  idcard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zoom(!zoomed); } });
  stage.addEventListener('click', () => zoom(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') zoom(false); });
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL SCENES
   ══════════════════════════════════════════════════════════════ */
const mm = gsap.matchMedia();

// products: horizontal scroll on desktop, swipe on mobile
mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
  const track = $('.hx-track');
  const dist = () => track.scrollWidth - innerWidth;
  gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.hx', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: self => gsap.set('.hx-progress i', { scaleX: self.progress })
    }
  });
  gsap.from('.hx-intro > *', { y: 50, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.s-products', start: 'top 70%' } });
});

mm.add('(prefers-reduced-motion: no-preference)', () => {

  // hero leaves
  gsap.to('.hero-title', { yPercent: -25, ease: 'none', scrollTrigger: { trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-shot img', { yPercent: 12, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: true } });

  // manifesto: words light up
  const words = $$('.manifesto .w');
  ScrollTrigger.create({
    trigger: manifesto, start: 'top 75%', end: 'bottom 45%', scrub: true,
    onUpdate: self => {
      const n = Math.round(self.progress * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      $('.manifesto-last').classList.toggle('hit', self.progress > 0.98);
    }
  });

  // stats
  gsap.from('.stat', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.s-stats', start: 'top 85%' } });

  // how it works
  gsap.from('.s-how h2', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.s-how', start: 'top 75%' } });
  gsap.to('.how-line path', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.how-steps', start: 'top 80%', end: 'bottom 60%', scrub: true } });
  gsap.from('.step', { y: 60, opacity: 0, duration: 1, stagger: 0.18, ease: 'expo.out', scrollTrigger: { trigger: '.how-steps', start: 'top 80%' } });
  gsap.to('.whisper', { opacity: 1, duration: 0.1, repeat: 5, yoyo: true, scrollTrigger: { trigger: '.step-3', start: 'top 60%' } });

  // voices — the last one breaks
  gsap.from('.voice', { y: 70, opacity: 0, rotate: i => [-2, 1, 3][i], duration: 1.1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.voices', start: 'top 80%' } });
  ScrollTrigger.create({
    trigger: '.voice-bad', start: 'top 55%', once: true,
    onEnter: () => {
      const v = $('.voice-bad');
      setTimeout(() => {
        v.classList.add('hit');
        scramble($('.voice-text', v), $('.voice-text', v).dataset.dirty, 1100);
        scramble($('.voice-who', v), 'unknown — xoxo.exe', 800);
      }, 900);
    }
  });

  // BREACH — pinned tear
  const slices = $$('.tear-slice');
  const breach = gsap.timeline({ scrollTrigger: { trigger: '.s-breach', start: 'top top', end: '+=280%', scrub: 1, pin: '.breach-stage' } });
  slices.forEach((s, i) => {
    breach.to(s, { xPercent: (i % 2 ? 1 : -1) * rand(20, 70), skewX: rand(-20, 20), opacity: 0, duration: 1, ease: 'power2.in' }, rand(0, 0.4));
  });
  breach
    .to('.s-breach', { backgroundColor: '#0c0b0d', duration: 0.5 }, 0.4)
    .to('.breach-code', { opacity: 1, duration: 0.3 }, 0.7)
    .to('.big-mask', { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.7)
    .fromTo('.br-a', { opacity: 0, scale: 0, rotate: -120 }, { opacity: 1, scale: 1, rotate: 40, duration: 1, ease: 'back.out(2)' }, 1.2)
    .fromTo('.br-b', { opacity: 0, scale: 0, rotate: 90 }, { opacity: 1, scale: 1, rotate: -20, duration: 1 }, 1.4)
    .to('.breach-line', { opacity: 1, y: -20, duration: 0.6 }, 1.7)
    .to('.big-mask', { scale: 1.12, letterSpacing: '0.04em', duration: 1 }, 1.9)
    .to('.br-a', { rotate: 220, duration: 1 }, 1.9);

  // tapes skew with scroll speed
  const skew = gsap.quickTo('.tape-run', 'skewX', { duration: 0.4, ease: 'power3' });
  ScrollTrigger.create({
    trigger: '.s-tapes', start: 'top bottom', end: 'bottom top',
    onUpdate: self => skew(gsap.utils.clamp(-14, 14, self.getVelocity() / -300)),
    onLeave: () => skew(0), onLeaveBack: () => skew(0)
  });

  // chat thread builds as you scroll
  gsap.from('.chat-side > *', { y: 50, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.s-chat', start: 'top 70%' } });
  gsap.from('.thread > *', {
    opacity: 0, y: 24, scale: 0.85, transformOrigin: 'right bottom', stagger: 0.5, duration: 0.5, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.phone', start: 'top 70%', end: 'bottom 55%', scrub: 0.6 }
  });

  // desk items drop in
  gsap.from('.desk-head > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.s-desk', start: 'top 70%' } });
  gsap.from('.desk > *', { y: -140, opacity: 0, rotate: () => rand(-25, 25), duration: 1, stagger: 0.09, ease: 'bounce.out', scrollTrigger: { trigger: '.desk', start: 'top 75%' } });
  gsap.to('.d-b', { rotate: 360, duration: 12, repeat: -1, ease: 'none' });

  // collage parallax
  gsap.fromTo('.qq', { scale: 0.7, rotate: -4 }, { scale: 1.08, rotate: 2, ease: 'none', scrollTrigger: { trigger: '.s-collage', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.cl').forEach(el => gsap.to(el, { yPercent: +el.dataset.speed * -160, ease: 'none', scrollTrigger: { trigger: '.s-collage', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.cut', { scale: 0, rotate: () => rand(-40, 40), duration: 0.7, stagger: 0.15, ease: 'back.out(3)', scrollTrigger: { trigger: '.s-collage', start: 'top 40%' } });
  gsap.from('.script', { x: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.script', start: 'top 90%' } });
  gsap.to('.cl-b', { rotate: 360, duration: 16, repeat: -1, ease: 'none' });

  // radar + cases
  gsap.from('.radar-wrap', { scale: 0.7, opacity: 0, rotate: -30, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.s-radar', start: 'top 70%' } });
  gsap.from('.cases li', { x: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.cases', start: 'top 85%' } });

  // symptoms
  gsap.from('.symptoms li', { yPercent: 60, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.symptoms', start: 'top 80%' } });

  // card
  gsap.from('.card-form > *', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.s-card', start: 'top 70%' } });
  gsap.from('.idcard', { y: 120, rotate: 8, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.s-card', start: 'top 65%' } });

  // end
  gsap.from('.end-title span', { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.s-end', start: 'top 60%' } });
  gsap.from('.end-sub, .end-links', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.s-end', start: 'top 45%' } });
  gsap.from('.end-img', { scale: 0, rotate: i => [-40, 30, 20][i], duration: 1, stagger: 0.12, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.s-end', start: 'top 60%' } });
  gsap.to('.end-img', { y: i => [-80, -140, -60][i], ease: 'none', scrollTrigger: { trigger: '.s-end', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.to('.end-b1, .end-b2', { rotate: 360, duration: 14, repeat: -1, ease: 'none' });
});

// infection meter — created last so it measures after every pin above it
infectBetween('.s-breach', 'top top', '.s-end', 'top center');
finish();
