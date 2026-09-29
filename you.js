/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — you.html: the last page is about the visitor       ║
   ║  everything here is read from their own browser (mem, core.js) ║
   ╚══════════════════════════════════════════════════════════════╝ */

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const visitorName = mem.get('name');
const mine = mem.get('archive-mine', []);

/* ── 01 hello: typed, line by line ─────────────────────────────── */
(function hello() {
  const LINES = [
    [visitorName ? `hi, ${visitorName}.` : 'hi.', 70],
    [mem.get('crashed') ? 'you pressed the button. of course you did.' : 'you found the last page.', 40],
    ['this page isn\'t about the lab. or patient zero. or the girls in the photos. it\'s about', 28],
    ['you.', 140]
  ];
  const els = $$('.hl');
  if (calm) { LINES.forEach(([t], i) => (els[i].textContent = t)); gsap.set('.y-scroll', { opacity: 1 }); return; }
  let li = 0;
  const next = () => {
    if (li >= LINES.length) return gsap.to('.y-scroll', { opacity: 1, duration: 1, delay: 0.4 });
    const [text, speed] = LINES[li];
    const el = els[li++];
    el.classList.add('typing');
    let n = 0;
    (function type() {
      el.textContent = text.slice(0, ++n);
      if (n < text.length) setTimeout(type, speed + rand(-10, 20));
      else { el.classList.remove('typing'); setTimeout(next, 700); }
    })();
  };
  setTimeout(next, arrived ? 1100 : 500);
})();

/* ── 02 mirror: what it noticed, one line at a time ───────────── */
const PAGES = [['index.html', 'the home page'], ['products.html', 'the products'], ['campaign.html', 'the campaign'], ['archive.html', 'the archive'], ['outbreak.html', 'the outbreak'], ['patch-notes.html', 'the patch notes'], ['start.html', 'the lab computer']];
function mirrorLines() {
  const seen = mem.get('pages', []);
  const secs = mem.get('time', 0);
  const mins = Math.round(secs / 60);
  const missed = PAGES.filter(([p]) => !seen.includes(p)).map(([, l]) => l);
  const hes = mem.get('hesitate');
  const leaves = mem.get('leaves', 0);
  const who = mem.get('who') || mem.get('by');
  const last = mine[0];
  const d = new Date(), h = d.getHours();
  const hhmm = `${String(h).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const night = h < 5 || h >= 23;
  const phone = matchMedia('(pointer: coarse)').matches;

  return [
    secs < 60 ? 'you\'ve been here <b>less than a minute</b>. that\'s all it took.' : `you've been here for <b>${mins} minute${mins === 1 ? '' : 's'}</b>. we counted every one.`,
    missed.length ? `you never opened <b>${missed[0]}</b>. some doors you just don't open.` : 'you opened <b>every</b> file. you always need to know everything, don\'t you.',
    hes ? `you hovered over the button for <b>${hes} seconds</b> before pressing it. you knew what it would do.` :
      mem.get('crashed') ? 'you pressed the button <b>without hesitating</b>. that\'s new for you.' : 'you didn\'t press the button. <b>someone had to.</b>',
    leaves ? `you left this site <b>${leaves} time${leaves === 1 ? '' : 's'}</b>. to check something. <b>or someone.</b>` : 'you never looked away. <b>not once.</b>',
    visitorName ? `you told us your name was <b>${esc(visitorName)}</b>. we believed you.` : 'you never told us your name. <b>we noticed.</b>',
    who ? `you wrote <b>${esc(who)}</b> without thinking. do they know you think about them?` : 'you didn\'t write anyone\'s name. <b>but you thought one.</b>',
    last ? `you wrote <b>"${esc(last.t)}"</b> and let us keep it. you never sent it to them.` : 'you didn\'t leave anything in the archive. <b>you keep it all in.</b>',
    `it's <b>${hhmm}</b>. ` + (night ? 'you should be asleep.' : 'and you chose to spend it here.') + (phone ? ' phone close to your face.' : ' the room behind you is quiet.'),
    (() => {
      const pr = profile();
      if (!pr.top) return 'the algorithm tried to figure out who you came here for. <b>you didn\'t give it anything.</b> that says a lot too.';
      return `the algorithm is <b>${Math.round(pr.confidence * 100)}%</b> sure you came here for <b>${ALGO_ROOMS[pr.top]}</b>. (${Math.round(pr.share[pr.top] * 100)}% of everything you did.)`;
    })(),
    'some of this was a guess. <b>none of it was wrong</b>, was it?',
    'we were never the virus. <b>we\'re what you didn\'t say.</b>'
  ];
}

(function mirror() {
  const box = $('.m-lines');
  const lines = mirrorLines();
  box.innerHTML = lines.map((l, i) => `<p class="m-line${i === lines.length - 1 ? ' m-last' : ''}"><span>${l}</span></p>`).join('');
  $('.m-tot').textContent = String(lines.length).padStart(2, '0');
  const els = $$('.m-line', box);
  const num = $('.m-n');

  if (calm) {
    gsap.set(els, { opacity: 1, position: 'relative' });
    box.style.height = 'auto';
    return;
  }

  // scroll = time: each line surfaces, holds, and sinks away
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.y-mirror', start: 'top top', end: `+=${lines.length * 110}%`, pin: '.mirror-stage', scrub: 0.6,
      onUpdate: s => { num.textContent = String(Math.min(lines.length, Math.floor(s.progress * lines.length) + 1)).padStart(2, '0'); }
    }
  });
  els.forEach((el, i) => {
    tl.fromTo(el, { opacity: 0, y: 50, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' })
      .add(() => { el.classList.remove('jolt'); void el.offsetWidth; el.classList.add('jolt'); })
      .to({}, { duration: 1 });
    if (i < els.length - 1) tl.to(el, { opacity: 0, y: -50, filter: 'blur(14px)', duration: 0.8, ease: 'power2.in' });
  });
})();

/* ── someone else's cursor, a little behind yours ──────────────── */
(function ghost() {
  if (calm || !mouse) return;
  const g = $('.ghost');
  const gx = gsap.quickTo(g, 'x', { duration: 1.4, ease: 'power2.out' });
  const gy = gsap.quickTo(g, 'y', { duration: 1.4, ease: 'power2.out' });
  addEventListener('mousemove', e => { gx(e.clientX + 26); gy(e.clientY + 18); });
  ScrollTrigger.create({ trigger: '.y-mirror', start: 'top 60%', end: 'bottom 40%', onToggle: s => g.classList.toggle('on', s.isActive) });
})();

/* ── it notices when you go quiet, or leave and come back ─────── */
(function whispers() {
  const w = $('.whisper');
  const say = text => {
    gsap.killTweensOf(w);
    w.textContent = text;
    gsap.timeline().to(w, { opacity: 1, duration: 0.4 }).to(w, { opacity: 0, duration: 0.8 }, '+=2.6');
  };
  let idle = 0, said = false;
  ['pointermove', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { idle = 0; said = false; }, { passive: true }));
  setInterval(() => {
    if (++idle >= 9 && !said && !document.hidden) { said = true; say(['still there?', 'we can wait.', 'you stopped moving.', 'take your time.'][(Math.random() * 4) | 0]); }
  }, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) say(['you left. we waited.', 'welcome back. were you checking on them?', 'we saw you go.'][(Math.random() * 3) | 0]);
  });
})();

/* ── 04 the question ───────────────────────────────────────────── */
(function ask() {
  const input = $('#who'), phone = $('.ask-phone'), say = $('#say'), log = $('.ap-log'), bodyEl = $('.ap-body');
  if (mem.get('who')) input.value = mem.get('who');

  const confirm = () => {
    const who = input.value.trim();
    if (!who) { gsap.fromTo(input, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .3)' }); input.focus(); return; }
    mem.set('who', who);
    $('.ap-name').textContent = who;
    phone.classList.add('on');
    phone.setAttribute('aria-hidden', 'false');
    log.textContent = '';
    gsap.fromTo(phone, { rotate: 4, y: 30 }, { rotate: 0, y: 0, duration: 0.8, ease: 'back.out(1.6)' });
    setTimeout(() => say.focus(), 300);
  };
  $('.ask-go').addEventListener('click', confirm);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });

  $('.ap-send').addEventListener('click', () => {
    const text = say.value.trim();
    if (!text) return scramble(log, 'type something first. or don\'t — that\'s how they end up in the archive.', 600);
    const b = document.createElement('p');
    b.className = 'msg-bubble';
    b.style.cssText = 'align-self:flex-end;max-width:80%;background:var(--pink);color:var(--ink);padding:9px 13px;border-radius:18px 18px 6px 18px;font-size:15px;margin-top:6px';
    b.textContent = text;
    bodyEl.appendChild(b);
    say.value = '';
    gsap.from(b, { scale: 0.6, opacity: 0, transformOrigin: 'right bottom', duration: 0.4, ease: 'back.out(2)' });
    scramble(log, 'sending…', 300);
    setTimeout(() => scramble(log, 'not delivered. we can\'t send it for you. that part was always yours ♥', 800), 1300);
  });

  $('.ap-del').addEventListener('click', () => {
    const text = say.value;
    if (!text.trim()) return scramble(log, 'nothing to delete. you didn\'t even start.', 500);
    let n = text.length;
    const who = input.value.trim();
    (function back() {
      say.value = text.slice(0, --n);
      if (n > 0) return setTimeout(back, calm ? 0 : 28);
      // deleted messages go where they always go
      const list = mem.get('archive-mine', []);
      list.unshift({ r: 'me', t: text.trim(), to: who, no: 4812340 + list.length });
      mem.set('archive-mine', list.slice(0, 30));
      scramble(log, 'see? easy. that\'s how 4,812,339 of them ended up in the archive. yours is there now too.', 900);
    })();
  });
})();

/* ── 05 goodbye ────────────────────────────────────────────────── */
$('.bye-reboot').addEventListener('click', () => {
  try {
    Object.keys(localStorage).filter(k => k.startsWith('xo-')).forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch (e) { /* nothing to forget */ }
  goTo('index.html');
});

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.ask-copy > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.y-ask', start: 'top 70%' } });

  // uninstall, then the goodbye
  const steps = ['removing feelings…', 'removing unsent_messages.db…', 'removing 3AM…', 'error: 1 feeling could not be removed', 'done. mostly.'];
  const stepEl = $('.bye-step');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.y-bye', start: 'top 60%' } });
  tl.to('.bye-bar i', {
    scaleX: 1, duration: 3.2, ease: 'steps(16)',
    onUpdate() { const k = Math.min(steps.length - 1, Math.floor(this.progress() * steps.length)); if (stepEl.textContent !== steps[k]) scramble(stepEl, steps[k], 300); }
  })
    .from('.bye-text p', { y: 30, opacity: 0, duration: 1, stagger: 0.5, ease: 'expo.out' }, '+=0.3')
    .from('.bye-sign span', { scale: 0.4, opacity: 0, duration: 1.2, ease: 'back.out(1.6)' }, '+=0.2')
    .from('.bye-sign em, .bye-links', { y: 20, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.4');
});

finish();
