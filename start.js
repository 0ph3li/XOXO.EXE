/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — start.html: the lab's old computer (needs core.js) ║
   ╚══════════════════════════════════════════════════════════════╝ */

html.style.setProperty('--dirt', '.35');
const desk = $('.desktop');
const layer = $('.windows');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ══════════════════════════════════════════════════════════════
   WINDOW MANAGER
   ══════════════════════════════════════════════════════════════ */
const wins = {};
let cascade = 0;

function focusWin(el) {
  $$('.win', layer).forEach(w => w.classList.toggle('focus', w === el));
  el.style.zIndex = ++zTop;
}

function openWin(id, { title, w = 460, h, x, y, menu, status, build }) {
  if (wins[id]) {
    focusWin(wins[id]);
    gsap.fromTo(wins[id], { x: '+=0' }, { keyframes: [{ x: '-=6' }, { x: '+=12' }, { x: '-=6' }], duration: 0.25 });
    return wins[id];
  }
  const el = document.createElement('section');
  el.className = 'win';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', title);
  el.innerHTML = `
    <div class="win-bar"><b>${esc(title)}</b><button class="w-close" aria-label="Close ${esc(title)}">✕</button></div>
    ${menu ? `<div class="win-menu">${menu.map(m => `<span>${m}</span>`).join('')}</div>` : ''}
    <div class="win-body"></div>
    ${status ? `<div class="win-status">${status}</div>` : ''}`;
  const dw = desk.clientWidth, dh = desk.clientHeight;
  const width = Math.min(w, dw - 20);
  el.style.width = width + 'px';
  if (h) el.style.height = Math.min(h, dh - 20) + 'px';
  const n = cascade++ % 7;
  el.style.left = Math.max(10, Math.min(dw - width - 10, x ?? 150 + n * 30)) + 'px';
  el.style.top = Math.max(10, Math.min(dh - 120, y ?? 30 + n * 30)) + 'px';
  layer.appendChild(el);
  wins[id] = el;
  build($('.win-body', el), el);

  draggable(el, $('.win-bar', el));
  el.addEventListener('pointerdown', () => focusWin(el));
  $('.w-close', el).addEventListener('click', () => closeWin(id));
  focusWin(el);
  gsap.fromTo(el, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: calm ? 0 : 0.3, ease: 'back.out(2)' });
  return el;
}

function closeWin(id) {
  const el = wins[id];
  if (!el) return;
  delete wins[id];
  gsap.to(el, { scale: 0.9, opacity: 0, duration: calm ? 0 : 0.18, onComplete: () => el.remove() });
}

addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const top = $$('.win', layer).sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];
  const id = top && Object.keys(wins).find(k => wins[k] === top);
  if (id) closeWin(id);
});

/* ══════════════════════════════════════════════════════════════
   APPS
   ══════════════════════════════════════════════════════════════ */
const PRODUCTS = [
  { name: 'crush.exe', size: '1.2 MB', date: '01.03.2004', link: 'products.html#crush', desc: 'Butterflies on demand. Now with 40% less overthinking. Our best‑seller.' },
  { name: 'heartbreak_patch.exe', size: '860 KB', date: '01.03.2004', link: 'products.html#heartbreak', desc: 'Silent install, loud recovery. Removes 3AM texting habits.' },
  { name: 'closure.dmg', size: '4.4 MB', date: '10.03.2004', link: 'products.html#closure', desc: 'Mount, drag, forget. Known issue: reopens itself on anniversaries.' },
  { name: 'situationship_lite.exe', size: '??? KB', date: '—', link: 'products.html#situationship', desc: 'All the feelings, none of the labels. The trial never expires.' },
  { name: 'jealousy_beta.exe', size: '█████', date: '13.03.2004', lock: true }
];

const PHOTOS = [
  'INDEX/hero', 'INDEX/card', 'INDEX/collage-1', 'INDEX/collage-2', 'INDEX/collage-3', 'INDEX/collage-4',
  'INDEX/symptom-1', 'INDEX/symptom-3', 'INDEX/symptom-4', 'INDEX/symptom-5', 'INDEX/symptom-6',
  'ARCHIVE/hero-1', 'ARCHIVE/hero-2', 'ARCHIVE/hero-3', 'ARCHIVE/room-ex', 'ARCHIVE/room-crush', 'ARCHIVE/room-bestie', 'ARCHIVE/room-mom', 'ARCHIVE/room-me',
  'OUTBREAK/time-1', 'OUTBREAK/time-2', 'OUTBREAK/time-3', 'OUTBREAK/patient-zero', 'OUTBREAK/news-1', 'OUTBREAK/news-3',
  'PATCH/lab', 'PATCH/end-1', 'PATCH/end-2'
].map(p => `img/${p}.jpg`);

const DB_LINES = [
  ['the ex', 'i still have ur hoodie'], ['the crush', 'ok this is random but'], ['mom', 'can i come home for a bit'],
  ['best friend', 'we don\'t talk like we used to'], ['yourself', 'stop checking'], ['the ex', 'come back'],
  ['the crush', 'i think i liked u more than i said'], ['the ex', 'the worst part is i\'d still pick up'],
  ['mom', 'i\'m sorry i\'m not who you pictured'], ['yourself', 'you\'re allowed to be the one who leaves'],
  ['the crush', 'you only text me when you\'re bored'], ['best friend', 'you were my person']
];

const APPS = {

  feelings: () => openWin('feelings', {
    title: 'C:\\Users\\m.valli\\My Feelings', w: 560, menu: ['File', 'Edit', 'View', 'Help'], status: '5 objects · 1 hidden · double‑click to open',
    build: b => {
      b.innerHTML = `<table class="files"><thead><tr><th>Name</th><th>Size</th><th>Modified</th></tr></thead><tbody>${
        PRODUCTS.map((p, i) => `<tr class="row${p.lock ? ' lock' : ''}" data-i="${i}" tabindex="0"><td><i class="f-ic"></i>${p.name}</td><td>${p.size}</td><td>${p.date}</td></tr>`).join('')
      }</tbody></table>`;
      $$('.row', b).forEach(r => {
        const run = () => {
          const p = PRODUCTS[+r.dataset.i];
          if (p.lock) return APPS.jealousy();
          openWin('prop-' + r.dataset.i, {
            title: `${p.name} — Properties`, w: 360,
            build: pb => {
              pb.innerHTML = `<div class="dlg"><span class="dlg-ic info">♥</span><div><b>${p.name}</b><p style="margin-top:6px">${p.desc}</p></div></div>
                <div class="dlg-act"><button class="btn95 p-close">Close</button><button class="btn95 p-go">Open in Products →</button></div>`;
              $('.p-close', pb).addEventListener('click', () => closeWin('prop-' + r.dataset.i));
              $('.p-go', pb).addEventListener('click', () => goTo(p.link));
            }
          });
        };
        r.addEventListener('dblclick', run);
        r.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
        if (!mouse) r.addEventListener('click', run);
      });
    }
  }),

  photos: () => openWin('photos', {
    title: 'photos — Picture Viewer', w: 620, status: 'use ← → to browse',
    build: (b, win) => {
      let i = 0;
      b.innerHTML = `<div class="viewer-img"><img alt=""></div>
        <div class="viewer-bar"><button class="v-prev">← prev</button><span class="v-name"></span><button class="v-next">next →</button></div>
        <div class="thumbs">${PHOTOS.map((p, k) => `<img src="${p}" alt="" data-k="${k}" loading="lazy">`).join('')}</div>`;
      const img = $('.viewer-img img', b), name = $('.v-name', b), thumbs = $$('.thumbs img', b);
      const show = k => {
        i = (k + PHOTOS.length) % PHOTOS.length;
        img.src = PHOTOS[i];
        name.textContent = `${PHOTOS[i].split('/').pop()} — ${i + 1}/${PHOTOS.length}`;
        thumbs.forEach((t, n) => t.classList.toggle('on', n === i));
        thumbs[i].scrollIntoView({ block: 'nearest', inline: 'center' });
        gsap.fromTo(img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.3 });
      };
      $('.v-prev', b).addEventListener('click', () => show(i - 1));
      $('.v-next', b).addEventListener('click', () => show(i + 1));
      thumbs.forEach(t => t.addEventListener('click', () => show(+t.dataset.k)));
      win.tabIndex = -1;
      win.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
      show(0);
      win.focus();
    }
  }),

  readme: () => openWin('readme', {
    title: 'README_FIRST.txt — Notepad', w: 470, h: 420, x: Math.max(130, desk.clientWidth / 2 - 235), y: 50, menu: ['File', 'Edit', 'Format', 'Help'],
    build: b => {
      b.innerHTML = `<div class="notepad">if you're reading this, you pressed start.
nobody presses start anymore.

this is my old workstation. i left it on.
i couldn't turn it off. i tried. it says
"you can't shut down a feeling." it's right.

— the products are in My Feelings.
— the photos are from the test subjects.
  they agreed. mostly.
— do NOT open jealousy_beta.exe.
— unsent_messages.db is still recording.
— cmd.exe works. type help.

p.s. the private folder is mine.
the password is the time it all started.
four digits. if you're not me, don't.

— m.</div>`;
    }
  }),

  db: () => openWin('db', {
    title: 'unsent_messages.db — read only', w: 560, h: 380, status: '<span class="db-live">● recording</span> · 4,812,339 rows',
    build: (b, win) => {
      b.innerHTML = `<div class="db-wrap"><table class="files"><thead><tr><th>#</th><th>to</th><th>time</th><th>message</th></tr></thead><tbody></tbody></table></div>
        <div class="dlg-act"><button class="btn95 db-go">Open in The Archive →</button></div>`;
      const tb = $('tbody', b);
      let n = 4812339;
      const add = () => {
        const [to, t] = DB_LINES[(Math.random() * DB_LINES.length) | 0];
        const d = new Date();
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${(n++).toLocaleString('en-US')}</td><td>${to}</td><td>${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</td><td>${esc(t)}</td>`;
        tb.prepend(tr);
        gsap.from(tr, { backgroundColor: '#ffd3f1', duration: 1.2 });
        while (tb.children.length > 40) tb.lastChild.remove();
      };
      for (let k = 0; k < 10; k++) add();
      const timer = setInterval(() => (document.body.contains(win) ? add() : clearInterval(timer)), 1600);
      $('.db-go', b).addEventListener('click', () => goTo('archive.html#search'));
    }
  }),

  cmd: () => openWin('cmd', {
    title: 'C:\\WINDOWS\\system32\\cmd.exe', w: 560, h: 360,
    build: (b, win) => {
      b.innerHTML = `<div class="cmd"><div class="cmd-out"><span class="m">xoxo labs workstation [version 4.0.2]
(c) 2004 xoxo labs. feelings are licensed, not sold.
type "help" to begin.</span>
</div><label class="cmd-line"><span>C:\\&gt;</span><input type="text" aria-label="Command" autocomplete="off" spellcheck="false"></label></div>`;
      const out = $('.cmd-out', b), input = $('input', b), box = $('.cmd', b);
      const print = (txt, cls = '') => { out.insertAdjacentHTML('beforeend', `<span class="${cls}">${esc(txt)}</span>\n`); box.parentElement.scrollTop = 1e9; };
      const CMDS = {
        help: () => print('commands: whoami · ls · date · send · 3am · hint · sudo love · please · open <page> · clear · exit', 'l'),
        whoami: () => print('dr.m.valli\n(well. you, pretending.)'),
        ls: () => print('My Feelings/   photos/   private/ [locked]\nREADME_FIRST.txt   unsent_messages.db   jealousy_beta.exe'),
        dir: () => CMDS.ls(),
        date: () => print(`${new Date().toDateString()} — day 7,869 of the outbreak`),
        send: () => { print('sending 4,812,339 messages…', 'p'); setTimeout(() => print('just kidding. or am i ♥', 'l'), 700); },
        '3am': () => print('it\'s always 3am somewhere.', 'p'),
        hint: () => print('the private folder opens with the time it all started. hh:mm, no colon.'),
        password: () => CMDS.hint(),
        sudo: a => print(a === 'love' ? 'permission denied: love can\'t be forced. try asking nicely.' : 'sudo: nice try.', 'p'),
        please: () => { print('ok ♥', 'l'); burst(); },
        open: a => {
          const map = { home: 'index.html', products: 'products.html', campaign: 'campaign.html', archive: 'archive.html', outbreak: 'outbreak.html', patch: 'patch-notes.html', 'patch-notes': 'patch-notes.html' };
          if (map[a]) { print(`opening ${a}.exe…`, 'l'); setTimeout(() => goTo(map[a]), 400); }
          else if (APPS[a]) { print(`running ${a}…`, 'l'); APPS[a](); }
          else print('open what? try: open home · open archive · open photos', 'm');
        },
        clear: () => (out.innerHTML = ''),
        cls: () => (out.innerHTML = ''),
        exit: () => closeWin('cmd')
      };
      input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const raw = input.value.trim();
        input.value = '';
        print(`C:\\> ${raw}`, 'm');
        if (!raw) return;
        const [c, ...rest] = raw.toLowerCase().split(/\s+/);
        (CMDS[c] || (() => print(`'${raw}' is not a feeling. type help.`)))(rest.join(' '));
      });
      box.addEventListener('pointerup', () => input.focus());
      setTimeout(() => input.focus(), 50);
    }
  }),

  jealousy: () => {
    const MSGS = [
      'jealousy_beta.exe has stopped responding.', 'who is she?', 'why are they online?', 'they viewed your story but didn\'t reply.',
      'checking location…', 'checking location…', 'checking location again…', 'you said you were fine with it.', 'error: not fine.'
    ];
    MSGS.forEach((m, k) => setTimeout(() => {
      const id = 'err' + k + Date.now();
      openWin(id, {
        title: 'jealousy_beta.exe', w: 330, x: 180 + k * 26, y: 40 + k * 24,
        build: b => {
          b.innerHTML = `<div class="dlg"><span class="dlg-ic">✕</span><p>${esc(m)}</p></div><div class="dlg-act"><button class="btn95">OK</button></div>`;
          $('button', b).addEventListener('click', () => closeWin(id));
        }
      });
    }, calm ? 0 : k * 130));
    setTimeout(() => {
      const id = 'err-final';
      openWin(id, {
        title: 'jealousy_beta.exe ♥', w: 360, x: 180 + MSGS.length * 26, y: 40 + MSGS.length * 24,
        build: b => {
          b.innerHTML = `<div class="dlg"><span class="dlg-ic info">♥</span><p><b>jealousy_beta.exe is now running.</b><br>it was always running.</p></div><div class="dlg-act"><button class="btn95">close all</button></div>`;
          $('button', b).addEventListener('click', () => Object.keys(wins).filter(k => k.startsWith('err')).forEach(closeWin));
        }
      });
      gsap.fromTo(desk, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .25)' });
    }, calm ? 0 : MSGS.length * 130 + 200);
  },

  private: () => {
    if (sessionStorage.getItem('xo-private')) return openLetter();
    let tries = 0;
    openWin('pw', {
      title: 'private — Password', w: 360,
      build: b => {
        b.innerHTML = `<div class="dlg"><span class="dlg-ic info">🔒</span><div><p>This folder is protected.<br>Enter password for <b>dr.m.valli</b>:</p>
          <input class="pw" type="password" inputmode="numeric" maxlength="8" aria-label="Password"><p class="pw-err" aria-live="polite"></p></div></div>
          <div class="dlg-act"><button class="btn95 pw-cancel">Cancel</button><button class="btn95 pw-ok">OK</button></div>`;
        const input = $('.pw', b), err = $('.pw-err', b);
        const check = () => {
          const v = input.value.replace(/\D/g, '');
          if (v === '0312' || v === '312') {
            sessionStorage.setItem('xo-private', '1');
            mem.set('private', true);
            closeWin('pw');
            setTimeout(openLetter, 250);
            return;
          }
          tries++;
          input.value = '';
          err.textContent = tries >= 3 ? 'wrong. hint: patient zero, first message, what time?' : 'wrong password. the README knows.';
          gsap.fromTo(wins.pw, { x: '+=0' }, { keyframes: [{ x: '-=10' }, { x: '+=20' }, { x: '-=10' }], duration: 0.3 });
        };
        $('.pw-ok', b).addEventListener('click', check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        $('.pw-cancel', b).addEventListener('click', () => closeWin('pw'));
        setTimeout(() => input.focus(), 50);
      }
    });
  },

  you: () => crash(),

  dossier: () => openWin('dossier', {
    title: `subject_${String(mem.get('first', Date.now())).slice(-4)}.dossier`, w: 560, h: 560, x: Math.max(120, desk.clientWidth / 2 - 280), y: 24,
    status: 'this file exists only on your device. closing it won\'t change that.',
    build: (b, win) => {
      const d = new Date();
      const first = new Date(mem.get('first', Date.now()));
      const secs = mem.get('time', 0);
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown').replace(/_/g, ' ');
      const ua = navigator.userAgent;
      const os = /iPhone|iPad/.test(ua) ? 'an iPhone' : /Android/.test(ua) ? 'an Android phone' : /Mac/.test(ua) ? 'a Mac' : /Win/.test(ua) ? 'a Windows PC' : /Linux/.test(ua) ? 'a Linux machine' : 'a device we don\'t recognise';
      const dark = matchMedia('(prefers-color-scheme: dark)').matches;
      const h = d.getHours();
      const pr = profile();
      const hes = mem.get('hesitate');
      const rows = [
        ['subject', `#${String(mem.get('first', Date.now())).slice(-4)} · unaware`],
        ['first seen', `${first.toLocaleDateString('en-GB')} at ${first.toTimeString().slice(0, 5)}`],
        ['time observed', secs < 60 ? 'under a minute' : `${Math.round(secs / 60)} minutes`],
        ['location', `somewhere in ${tz}`],
        ['device', `${os}, screen ${screen.width}×${screen.height}`],
        ['language', navigator.language || 'unknown'],
        ['screen mode', dark ? 'dark. you keep the lights low.' : 'light. you like to see everything.'],
        ['currently', h < 5 || h > 23 ? `awake at ${d.toTimeString().slice(0, 5)}. again.` : `here at ${d.toTimeString().slice(0, 5)} instead of anywhere else`],
        ['left the tab', `${mem.get('leaves', 0)} times`],
        ['hesitation', hes ? `${hes}s on the button` : 'hasn\'t pressed it yet'],
        ['name given', mem.get('name') ? mem.get('name') : 'refused'],
        ['thinking about', mem.get('who') || mem.get('by') || 'undisclosed (for now)'],
        ['algorithm', pr.top ? `${Math.round(pr.confidence * 100)}% sure: ${ALGO_ROOMS[pr.top]}` : 'insufficient data. keep going.']
      ];
      b.innerHTML = `<div class="dossier">
        <div class="ds-top">
          <div class="ds-photo" aria-hidden="true"><span class="ds-bar"></span><span class="ds-cap">no photo on file.<br>we don't need one.</span></div>
          <div><p class="ds-k">xoxo labs · observation file</p><h3>SUBJECT #${String(mem.get('first', Date.now())).slice(-4)}</h3><p class="ds-stamp">ACTIVE</p></div>
        </div>
        <dl class="ds-rows">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        <p class="ds-note">notes: subject believes they are just browsing a website.</p>
        <div class="dlg-act"><button class="btn95 ds-del">Delete file</button></div>
      </div>`;
      // rows get "typed in" one by one
      if (!calm) gsap.from($$('.ds-rows dd', b), { opacity: 0, x: -8, duration: 0.25, stagger: 0.09, delay: 0.3 });
      $('.ds-del', b).addEventListener('click', () => {
        const err = 'dossier-err';
        openWin(err, {
          title: 'Error Deleting File', w: 340,
          build: eb => {
            eb.innerHTML = `<div class="dlg"><span class="dlg-ic">✕</span><p>Cannot delete <b>subject_${String(mem.get('first', Date.now())).slice(-4)}.dossier</b>:<br>the subject is still in use.</p></div><div class="dlg-act"><button class="btn95">OK</button></div>`;
            $('button', eb).addEventListener('click', () => closeWin(err));
          }
        });
        gsap.fromTo(win, { x: '+=0' }, { keyframes: [{ x: '-=8' }, { x: '+=16' }, { x: '-=8' }], duration: 0.3 });
      });
    }
  }),

  keylog: () => openWin('keylog', {
    title: 'keylogger.log — Notepad', w: 480, h: 420, menu: ['File', 'Edit', 'Format', 'Help'],
    status: '<span style="color:var(--pink)">● recording</span> · local only · type anything',
    build: (b, win) => {
      const typed = mem.get('typed', []);
      const terms = mem.get('algo-terms', []);
      const lines = [
        '# everything you typed on this site.',
        '# you thought the text boxes were empty after.',
        '',
        ...(typed.length ? typed.slice().reverse().map(t => `[${t.at}] ${t.page.padEnd(9)} "${t.v}"`) : ['[--:--] nothing yet. that\'s suspicious too.']),
        ...(terms.length ? ['', '# searched for:', ...terms.map(t => `  - ${t}`)] : []),
        '',
        '# live:',
        ''
      ];
      b.innerHTML = `<div class="notepad kl"><span class="kl-old"></span><span class="kl-live"></span><span class="kl-caret">▌</span></div>`;
      $('.kl-old', b).textContent = lines.join('\n');
      const live = $('.kl-live', b);
      const pad = $('.kl', b);
      const onKey = e => {
        if (!document.body.contains(win)) return removeEventListener('keydown', onKey);
        if (e.target.closest && e.target.closest('input, textarea')) return; // other windows' fields are their business
        const k = e.key === 'Enter' ? '⏎\n' : e.key === 'Backspace' ? '⌫' : e.key === ' ' ? '␣' : e.key.length === 1 ? e.key : '';
        if (!k) return;
        live.textContent += k;
        pad.parentElement.scrollTop = 1e9;
      };
      addEventListener('keydown', onKey);
    }
  }),

  bin: () => openWin('bin', {
    title: 'Recycle Bin', w: 400, status: '1 object',
    build: b => {
      b.innerHTML = `<div class="bin-item"><figure class="slot" data-file="img/INDEX/archive-12.jpg"><img src="img/INDEX/archive-12.jpg" alt=""></figure>
        <div><b>ex.jpg</b><small>deleted 14.02.2004 · deleted again 15.02.2004 · restored 15.02.2004 · deleted 16.02.2004</small></div></div>
        <p class="bin-msg" aria-live="polite"></p>
        <div class="dlg-act"><button class="btn95 b-restore">Restore</button><button class="btn95 b-empty">Empty Recycle Bin</button></div>`;
      const msg = $('.bin-msg', b);
      $('.b-restore', b).addEventListener('click', () => scramble(msg, 'restoring ex.jpg… no. absolutely not.', 500));
      $('.b-empty', b).addEventListener('click', () => scramble(msg, 'cannot delete "ex.jpg": the file is still in use by you.', 600));
    }
  })
};

function openLetter() {
  openWin('letter', {
    title: 'private\\draft_1993.txt', w: 540, h: 520, x: Math.max(120, desk.clientWidth / 2 - 270), y: 30,
    build: b => {
      b.innerHTML = `<div class="letter">
        <p class="l-meta">to: ███████<br>drafted: 17.06.1993 · last edited: 14.03.2004, 03:11AM<br>status: <b class="l-status">unsent</b> · rewritten 1,108 times</p>
        <p>I think about the summer we didn't take the train. I tell people it was a small thing. It wasn't.</p>
        <p>I built a machine to help people say what they mean, because I never did.</p>
        <p>If it ever sends this — and I think it will — I want you to know I'm not sorry it did.</p>
        <p>— m.</p>
        <div class="l-send"><button class="btn95 l-go">send</button><span>(you know I won't)</span></div>
      </div>`;
      $('.l-go', b).addEventListener('click', e => {
        e.target.disabled = true;
        const st = $('.l-status', b);
        scramble(st, 'sending…', 400);
        setTimeout(() => { scramble(st, 'sent by xoxo.exe — 03:12AM ♥', 700); st.style.color = 'var(--pink)'; burst(); }, 1200);
      });
    }
  });
}

// little heart burst from the middle of the screen
function burst() {
  for (let k = 0; k < 24; k++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = k % 2 ? '♥' : '✦';
    s.style.left = innerWidth / 2 + 'px';
    s.style.top = innerHeight / 2 + 'px';
    s.style.fontSize = rand(14, 30) + 'px';
    body.appendChild(s);
    const a = rand(0, Math.PI * 2), d = rand(120, 380);
    gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d, rotate: rand(-200, 200), opacity: 0, duration: rand(0.9, 1.6), ease: 'power3.out', onComplete: () => s.remove() });
  }
}

/* ══════════════════════════════════════════════════════════════
   DESKTOP: icons, lasso selection
   ══════════════════════════════════════════════════════════════ */
const icons = $$('.icon');
const select = list => icons.forEach(i => i.classList.toggle('sel', list.includes(i)));
function wireIcon(ic) {
  const run = () => APPS[ic.dataset.open]?.();
  ic.addEventListener('click', e => { select([ic]); if (!mouse) run(); e.stopPropagation(); });
  ic.addEventListener('dblclick', run);
  ic.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); run(); } });
}
icons.forEach(wireIcon);
function dropIcon(app, cls, label) {
  const ic = document.createElement('button');
  ic.className = 'icon icon-new';
  ic.dataset.open = app;
  ic.setAttribute('role', 'listitem');
  ic.innerHTML = `<span class="ic ${cls}"></span><span class="ic-lbl">${esc(label)}</span>`;
  $('.icons').appendChild(ic);
  icons.push(ic);
  wireIcon(ic);
  gsap.from(ic, { scale: 0, rotate: -30, duration: calm ? 0 : 0.6, ease: 'back.out(3)' });
  return ic;
}

// a balloon from the tray, like old windows
function balloon(title, text) {
  const b = document.createElement('div');
  b.className = 'balloon';
  b.innerHTML = `<b>${esc(title)}</b><p>${esc(text)}</p><button aria-label="Close">✕</button>`;
  body.appendChild(b);
  const bye = () => gsap.to(b, { opacity: 0, y: 10, duration: 0.3, onComplete: () => b.remove() });
  $('button', b).addEventListener('click', bye);
  gsap.from(b, { opacity: 0, y: 20, duration: calm ? 0 : 0.4, ease: 'back.out(2)' });
  setTimeout(() => b.isConnected && bye(), 7000);
}

(function lasso() {
  const box = $('.lasso');
  let sx, sy, on = false;
  desk.addEventListener('pointerdown', e => {
    if (e.target.closest('.icon, .win')) return;
    select([]);
    $$('.win', layer).forEach(w => w.classList.remove('focus'));
    const r = desk.getBoundingClientRect();
    sx = e.clientX - r.left; sy = e.clientY - r.top; on = true;
    Object.assign(box.style, { display: 'block', left: sx + 'px', top: sy + 'px', width: 0, height: 0 });
  });
  addEventListener('pointermove', e => {
    if (!on) return;
    const r = desk.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const L = Math.min(sx, x), T = Math.min(sy, y), W = Math.abs(x - sx), H = Math.abs(y - sy);
    Object.assign(box.style, { left: L + 'px', top: T + 'px', width: W + 'px', height: H + 'px' });
    select(icons.filter(ic => {
      const b = ic.getBoundingClientRect();
      const bx = b.left - r.left, by = b.top - r.top;
      return bx < L + W && bx + b.width > L && by < T + H && by + b.height > T;
    }));
  });
  addEventListener('pointerup', () => { on = false; box.style.display = 'none'; });
})();

/* ══════════════════════════════════════════════════════════════
   LOG ON → desktop
   ══════════════════════════════════════════════════════════════ */
(function logon() {
  const scr = $('.logon');
  const dots = $('.pass-dots');
  if (calm) { scr.remove(); APPS.readme(); spawnWatchFiles(); return; }
  gsap.timeline({ delay: arrived ? 0.9 : 0.3 })
    .from('.logon-left > *, .user', { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 })
    .add(() => {
      let n = 0;
      const t = setInterval(() => { dots.textContent = '●'.repeat(++n); if (n === 4) clearInterval(t); }, 150);
    }, '+=0.2')
    .to('.logon-left, .logon-right', { opacity: 0, duration: 0.4 }, '+=0.9')
    .to('.logon-welcome', { opacity: 1, duration: 0.4 })
    .to(scr, { opacity: 0, duration: 0.6 }, '+=0.6')
    .add(() => {
      scr.remove();
      gsap.from('.icon', { opacity: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
      setTimeout(APPS.readme, 500);
      setTimeout(spawnWatchFiles, 3500);
    });
})();

/* ══════════════════════════════════════════════════════════════
   SCREENSAVER after 45s of nothing
   ══════════════════════════════════════════════════════════════ */
(function saver() {
  if (calm) return;
  const scr = $('.saver'), txt = $('.saver-txt');
  let idle = 0, raf = 0, x = 50, y = 50, vx = 2.2, vy = 1.7;
  const colors = ['#ff2fbf', '#c9ff1f', '#a6f4e6', '#ffffff'];
  let ci = 0;
  const loop = () => {
    const w = innerWidth - txt.offsetWidth, h = innerHeight - txt.offsetHeight;
    x += vx; y += vy;
    if (x <= 0 || x >= w) { vx *= -1; txt.style.color = colors[ci = (ci + 1) % colors.length]; }
    if (y <= 0 || y >= h) { vy *= -1; txt.style.color = colors[ci = (ci + 1) % colors.length]; }
    txt.style.transform = `translate(${x}px, ${y}px)`;
    raf = requestAnimationFrame(loop);
  };
  const wake = () => {
    idle = 0;
    if (scr.classList.contains('on')) { scr.classList.remove('on'); cancelAnimationFrame(raf); }
  };
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, wake, { passive: true }));
  setInterval(() => {
    if (++idle === 45 && !scr.classList.contains('on')) { scr.classList.add('on'); raf = requestAnimationFrame(loop); }
  }, 1000);
})();

/* ── the lab has been keeping notes on you ─────────────────────── */
function spawnWatchFiles() {
  const id = String(mem.get('first', Date.now())).slice(-4);
  dropIcon('dossier', 'ic-txt ic-dossier', `subject_${id}.dossier`);
  balloon('New file detected', `subject_${id}.dossier was created on your desktop. Nobody here created it.`);
  setTimeout(() => {
    dropIcon('keylog', 'ic-txt ic-log', 'keylogger.log');
    balloon('keylogger.log', 'Recording. Don\'t worry, it only remembers what you type here.');
  }, calm ? 0 : 5000);
}
