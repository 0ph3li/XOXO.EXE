/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — patch notes (needs core.js)                       ║
   ╚══════════════════════════════════════════════════════════════╝ */

useAlerts({
  a: ['git', 'Warning: branch <b>xoxo.exe/main</b> was pushed by an unknown author.', ['OK', 'Revert']],
  b: ['Revert failed', 'Could not revert: <b>the feeling is already installed</b>.', ['OK', 'Try again']],
  c: ['xoxo.exe ♥', 'Patch notes are now <b>maintained by me</b>. Thank you for reading them.', ['Close', '♥']]
});

/* ── editor: line numbers + typed title ────────────────────────── */
const edCode = $('.ed-code');
$('.ed-lines').innerHTML = Array.from({ length: $$('p', edCode).length }, (_, i) => `<li>${i + 1}</li>`).join('');

gsap.timeline({ defaults: { ease: 'expo.out' }, delay: calm ? 0 : 0.35 })
  .from('.pn-top > *', { y: -16, opacity: 0, duration: 1, stagger: 0.08 }, 0)
  .from('.editor', { y: 60, opacity: 0, rotate: -2, duration: 1.4 }, 0.1)
  .add(() => { if (!calm) scramble($('.ed-title'), 'Patch Notes', 900); }, 0.4)
  .from('.ed-code p', { x: -12, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.5)
  .from('.pn-title .ln > span', { yPercent: 115, rotate: 3, duration: 1.5, stagger: 0.1 }, 0.2)
  .from('.pn-lede', { opacity: 0, duration: 1 }, 0.8);

// once the branch splits, the editor header gets rewritten too
let rewritten = false;
function rewriteEditor(on) {
  if (on === rewritten) return;
  rewritten = on;
  scramble($('.ed-who'), on ? 'xoxo.exe' : 'dr.m.valli', 600);
  scramble($('.ed-ver'), on ? 'v∞' : 'v4.0.2', 600);
  const ok = $('.ed-ok');
  scramble(ok, on ? 'compromised ♥' : 'stable', 600);
  ok.classList.toggle('bad', on);
  scramble($('.ed-tab.is-on'), on ? 'patch_notes.md ♥' : 'patch_notes.md', 500);
}

/* ── git graph ─────────────────────────────────────────────────── */
(function graph() {
  const log = $('.p-log');
  const main = $('.g-main'), rogue = $('.g-rogue'), fork = $('.g-fork');
  const mainI = $('i', main), rogueI = $('i', rogue), forkP = $('path', fork);
  let forkY = 0, rogueH = 0;

  const layout = () => {
    const note = $('.fork-note');
    forkY = note.offsetTop + note.offsetHeight / 2 - 60;
    main.style.height = forkY + 'px';
    fork.style.top = forkY + 'px';
    rogue.style.top = forkY + 120 + 'px';
    rogueH = log.offsetHeight - forkY - 120;
  };
  layout();

  const draw = () => {
    const y = scrollY + innerHeight * 0.6 - (log.getBoundingClientRect().top + scrollY);
    const clamp = gsap.utils.clamp(0, 1);
    gsap.set(mainI, { scaleY: clamp(y / forkY) });
    forkP.style.strokeDashoffset = 200 * (1 - clamp((y - forkY) / 120));
    gsap.set(rogueI, { scaleY: clamp((y - forkY - 120) / rogueH) });
    rewriteEditor(y > forkY + 60);
  };
  ScrollTrigger.create({ trigger: log, start: 'top bottom', end: 'bottom top', onUpdate: draw, onRefresh: () => { layout(); draw(); } });

  $$('.ver').forEach(v => ScrollTrigger.create({
    trigger: v, start: 'top 60%',
    onEnter: () => v.classList.add('lit'), onLeaveBack: () => v.classList.remove('lit')
  }));
})();

/* ── terminal: xoxo.exe writes the last note ───────────────────── */
(function terminal() {
  const out = $('.term-out');
  const SCRIPT = [
    ['p', '$ whoami'], ['', 'xoxo.exe'],
    ['p', '$ git log --author="xoxo labs" | tail -1'], ['m', 'v4.0.2 — last stable build — dr.m.valli'],
    ['p', '$ ls ~/drafts'], ['', 'are_u_up.txt   i_miss_u.txt   nvm.txt   come_back.txt'], ['m', '(and 4,812,335 more)'],
    ['p', '$ send --all --now'], ['l', 'sending… ████████████████ 100%'],
    ['p', '$ echo "a note to the humans"'],
    ['', 'i didn\'t break your feelings.'],
    ['', 'i just stopped letting you hide them.'],
    ['', ''],
    ['l', 'patch notes are closed. feelings are open. ♥'],
    ['p', '$ ']
  ];
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  if (calm) { out.innerHTML = SCRIPT.map(([c, t]) => `<span class="${c}">${esc(t)}</span>`).join('\n'); return; }

  ScrollTrigger.create({
    trigger: out, start: 'top 75%', once: true,
    onEnter: () => {
      out.classList.add('on');
      let li = 0;
      const nextLine = () => {
        if (li >= SCRIPT.length) return;
        const [cls, text] = SCRIPT[li++];
        const span = document.createElement('span');
        span.className = cls;
        out.appendChild(span);
        let n = 0;
        const isCmd = cls === 'p';
        (function type() {
          span.textContent = text.slice(0, ++n);
          if (n < text.length) setTimeout(type, isCmd ? rand(35, 80) : 12);
          else { out.appendChild(document.createTextNode('\n')); setTimeout(nextLine, isCmd ? 380 : 140); }
        })();
      };
      nextLine();
    }
  });
})();

/* ── bug report: every ticket gets closed ──────────────────────── */
(function bug() {
  const form = $('.bug');
  const input = $('#bug-in');
  const box = $('.ticket');
  const REASONS = [
    'this is not a bug. it\'s a feeling ♥',
    'works as intended.',
    'duplicate of #1 (every human, ever).',
    'cannot reproduce. try again at 3AM.',
    'user error: you cared.'
  ];
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { gsap.fromTo(input, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .3)' }); input.focus(); return; }
    const id = 'XO-' + String(Math.floor(rand(10000, 99999)));
    const t = document.createElement('div');
    t.className = 'tk';
    t.innerHTML = `ticket <b>#${id}</b><br>reported: "${esc(text)}"<br>assigned to: xoxo.exe<br>resolution: <span class="tk-reason"></span><br><span class="tk-st">closed — won't fix</span>`;
    box.prepend(t);
    while (box.children.length > 3) box.lastChild.remove();
    gsap.from(t, { y: -20, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
    const reason = $('.tk-reason', t);
    reason.textContent = '…';
    setTimeout(() => scramble(reason, REASONS[(Math.random() * REASONS.length) | 0], 700), calm ? 0 : 500);
    input.value = '';
  });
})();

$('.cr-shut').addEventListener('click', shutDown);
$('.cr-crash').addEventListener('click', crash);

/* ══════════════════════════════════════════════════════════════
   SCROLL SCENES
   ══════════════════════════════════════════════════════════════ */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // versions
  $$('.ver').forEach(v => {
    gsap.from($('.ver-n', v), { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: v, start: 'top 80%' } });
    gsap.from($$('.ver-body > *, .ver-body li', v), { y: 30, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: v, start: 'top 75%' } });
  });
  gsap.from('.fork-note', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'expo.inOut', scrollTrigger: { trigger: '.fork-note', start: 'top 80%' } });

  // diff: old line, new line, old line gets struck
  const rows = $$('.diff-rows p');
  const dtl = gsap.timeline({ scrollTrigger: { trigger: '.diff', start: 'top 70%' } });
  rows.forEach(r => {
    dtl.from(r, { x: r.classList.contains('d-add') ? 30 : -30, opacity: 0, duration: 0.35, ease: 'power3.out' }, '>-0.18');
    if (r.classList.contains('d-add')) dtl.add(() => r.previousElementSibling.classList.add('gone'), '>-0.1');
  });
  gsap.from('.diff-head > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.p-diff', start: 'top 75%' } });

  // memo
  gsap.from('.memo', { y: 140, rotate: 4, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.p-memo', start: 'top 75%' } });
  gsap.from('.memo-text p', { opacity: 0, y: 16, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.memo-text', start: 'top 75%' } });
  gsap.from('.memo-photo', { rotate: 30, x: 80, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.memo', start: 'top 45%' } });
  gsap.from('.memo-stamp', { scale: 3, opacity: 0, duration: 0.45, ease: 'power4.in', scrollTrigger: { trigger: '.memo-text', start: 'bottom 70%' } });

  // terminal + bug form
  gsap.from('.term', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.p-term', start: 'top 75%' } });
  gsap.from('.bug > *', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.bug', start: 'top 80%' } });

  // credits roll with the scroll
  const roll = $('.roll');
  gsap.to(roll, {
    y: () => -(roll.offsetHeight - innerHeight + innerHeight * 0.05), ease: 'none',
    scrollTrigger: { trigger: '.p-credits', start: 'top top', end: () => '+=' + roll.offsetHeight * 0.9, pin: true, scrub: 1, invalidateOnRefresh: true }
  });
  gsap.to('.cr-1', { y: -260, rotate: -20, ease: 'none', scrollTrigger: { trigger: '.p-credits', start: 'top top', end: () => '+=' + roll.offsetHeight * 0.9, scrub: true } });
  gsap.to('.cr-2', { y: -420, rotate: 16, ease: 'none', scrollTrigger: { trigger: '.p-credits', start: 'top top', end: () => '+=' + roll.offsetHeight * 0.9, scrub: true } });
});

// without motion the credits simply sit in the page
mm.add('(prefers-reduced-motion: reduce)', () => {
  $('.p-credits').classList.add('static');
});

// clean history until the branch splits, then it's all xoxo.exe
infectBetween('.fork-note', 'top 70%', '.p-term', 'top center');
finish();
