/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — campaign SS04 (needs core.js)                     ║
   ╚══════════════════════════════════════════════════════════════╝ */

useAlerts({
  a: ['Retouching.exe', 'The model\'s feelings could not be <b>retouched out</b>.', ['OK', 'Try harder']],
  b: ['Print Shop', 'The photos are coming out <b>pink</b>. We didn\'t add pink.', ['OK', 'Uh oh']],
  c: ['xoxo.exe ♥', 'This campaign is now <b>running on every screen</b>. Say cheese.', ['Close', '♥']]
});

/* ── cover: arrives like a magazine dropped on a table ─────────── */
gsap.timeline({ delay: calm ? 0 : 0.3 })
  .from('.cover', { y: 120, rotateX: 35, rotateZ: -6, opacity: 0, duration: calm ? 0 : 1.4, ease: 'expo.out' })
  .from('.cover .cl, .cover-burst, .cover-barcode', { opacity: 0, y: 16, duration: 0.6, stagger: 0.06 }, '-=0.6')
  .from('.cover-hint', { opacity: 0, duration: 0.8 }, '-=0.3');

// the cover leans towards the mouse, layers at different depths
if (mouse && !calm) {
  const zone = $('.c-cover'), cover = $('.cover'), layers = $$('.cover .layer');
  zone.addEventListener('mousemove', e => {
    const r = zone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(cover, { rotateY: x * 12, rotateX: -y * 10, duration: 0.6 });
    layers.forEach(l => gsap.to(l, { x: x * +l.dataset.depth, y: y * +l.dataset.depth, duration: 0.6 }));
  });
  zone.addEventListener('mouseleave', () => {
    gsap.to(cover, { rotateX: 0, rotateY: 0, duration: 0.8 });
    gsap.to(layers, { x: 0, y: 0, duration: 0.8 });
  });
}

/* ── contact sheet: outtakes you can circle ────────────────────── */
(function sheet() {
  const IMGS = [
    'INDEX/collage-1', 'ARCHIVE/hero-1', 'INDEX/symptom-3', 'OUTBREAK/time-1', 'ARCHIVE/room-crush', 'INDEX/collage-4',
    'PATCH/end-1', 'INDEX/symptom-5', 'ARCHIVE/room-bestie', 'OUTBREAK/news-3', 'INDEX/archive-3', 'PATCH/end-2'
  ].map(p => `img/${p}.jpg`);
  const box = $('.sheet');
  const count = $('.sheet-count b');
  // a hand-drawn ellipse, slightly different every time
  const loop = () => {
    const j = () => rand(-6, 6);
    return `M${20 + j()} ${50 + j()} C${18 + j()} ${8 + j()}, ${92 + j()} ${4 + j()}, ${98 + j()} ${46 + j()} S${40 + j()} ${104 + j()}, ${14 + j()} ${60 + j()} L${26 + j()} ${40 + j()}`;
  };
  box.innerHTML = IMGS.map((src, i) => `
    <button class="frame" aria-pressed="false" aria-label="Outtake ${i + 1}">
      <img src="${src}" alt="" loading="lazy">
      <svg viewBox="0 0 120 110" preserveAspectRatio="none" aria-hidden="true"><path d="${loop()}"/></svg>
      <span class="fn">${String(i + 1).padStart(2, '0')}A ▸ 03:12</span>
    </button>`).join('');
  $$('.frame', box).forEach(f => f.addEventListener('click', () => {
    const on = !f.classList.contains('pick');
    f.classList.toggle('pick', on);
    f.setAttribute('aria-pressed', on);
    if (on) $('path', f).setAttribute('d', loop());
    count.textContent = $$('.frame.pick', box).length;
    gsap.fromTo(f, { rotate: 0 }, { rotate: on ? rand(-2, 2) : 0, duration: 0.3 });
  }));
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL SCENES
   ══════════════════════════════════════════════════════════════ */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // cover closes as you scroll past it
  gsap.to('.cover', { rotateY: -24, scale: 0.86, y: -40, ease: 'none', scrollTrigger: { trigger: '.c-cover', start: 'top top', end: 'bottom top', scrub: true } });

  // editor's letter
  gsap.from('.spread', { y: 100, rotate: 1.5, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.c-letter', start: 'top 75%' } });
  gsap.from('.spread-text > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.spread', start: 'top 65%' } });
  gsap.fromTo('.spread-photo img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.spread', start: 'top bottom', end: 'bottom top', scrub: true } });

  // look 01 — full bleed
  gsap.fromTo('.lf-photo img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.look-full', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.lf-vert', { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: '.look-full', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.look-full .credit > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.look-full', start: 'top 30%' } });

  // looks 02–03 — diptych drifts apart
  gsap.from('.dip-a, .dip-b', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, stagger: 0.2, ease: 'expo.inOut', scrollTrigger: { trigger: '.look-dip', start: 'top 70%' } });
  gsap.to('.dip-b', { y: -120, ease: 'none', scrollTrigger: { trigger: '.look-dip', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.dip-line', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.dip-line', start: 'top 85%' } });

  // look 04 — the word fills with the photo
  gsap.fromTo('.mask-word', { scale: 0.55, letterSpacing: '0.2em' }, { scale: 1.05, letterSpacing: '-0.01em', ease: 'none', scrollTrigger: { trigger: '.look-mask', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.fromTo('.mask-word', { backgroundPosition: '50% 0%' }, { backgroundPosition: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.look-mask', start: 'top bottom', end: 'bottom top', scrub: true } });

  // look 05 — three strips slide into one picture
  const off = [-180, 200, -260];
  $$('.strip').forEach((s, i) => gsap.fromTo(s, { y: off[i] }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.strips', start: 'top bottom', end: 'center 55%', scrub: true } }));

  // contact sheet
  gsap.from('.sheet-head > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.c-sheet', start: 'top 75%' } });
  gsap.from('.frame', { opacity: 0, y: 20, duration: 0.6, stagger: 0.04, ease: 'power3.out', scrollTrigger: { trigger: '.sheet', start: 'top 80%' } });

  // back cover
  gsap.fromTo('.back-photo img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.c-back', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.back-ad', { x: -80, rotate: -4, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.c-back', start: 'top 40%' } });
  gsap.from('.c-next > *', { y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.c-next', start: 'top 80%' } });
});

// the glossy magazine gets infected, page by page
infectBetween('.c-looks', 'top 60%', '.c-back', 'top center');
finish();
