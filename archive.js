/* ╔══════════════════════════════════════════════════════════════╗
   ║  xoxo.exe — the archive (needs core.js)                       ║
   ╚══════════════════════════════════════════════════════════════╝ */
gsap.registerPlugin(Flip);

// r = room: ex · crush · bestie · mom · me
const MESSAGES = [
  { r: 'ex', t: 'i still have ur hoodie', at: '03:12AM', d: 14 },
  { r: 'ex', t: 'do you ever think about the car ride', at: '01:47AM', d: 6 },
  { r: 'ex', t: 'congrats on the new girl. she seems nice. i hate it', at: '11:20PM', d: 9 },
  { r: 'ex', t: 'i drove past your house today. by accident. twice', at: '02:02AM', d: 4 },
  { r: 'ex', t: 'are u up', at: '03:12AM', d: 31 },
  { r: 'ex', t: 'i deleted all our photos. i have them in a hidden folder', at: '04:40AM', d: 3 },
  { r: 'ex', t: 'that song came on and i had to leave the store', at: '06:15PM', d: 2 },
  { r: 'ex', t: 'happy birthday. i hope it rains', at: '00:01AM', d: 11 },
  { r: 'crush', t: 'i think i liked u more than i said', at: '01:02AM', d: 14 },
  { r: 'crush', t: 'what song is that on ur story', at: '10:41PM', d: 5 },
  { r: 'crush', t: 'ok this is random but', at: '12:59AM', d: 22 },
  { r: 'crush', t: 'you looked really good today. that\'s it. bye', at: '09:03PM', d: 8 },
  { r: 'crush', t: 'do you want to get coffee. or not. or yes', at: '02:30PM', d: 17 },
  { r: 'crush', t: 'i made you a playlist. it\'s 4 hours long. sorry', at: '03:33AM', d: 3 },
  { r: 'crush', t: 'hi', at: '11:11PM', d: 40 },
  { r: 'bestie', t: 'i\'m sorry i missed your birthday', at: '08:10PM', d: 7 },
  { r: 'bestie', t: 'we don\'t talk like we used to', at: '01:15AM', d: 5 },
  { r: 'bestie', t: 'i saw the photos. i wasn\'t invited. it\'s fine', at: '12:40AM', d: 12 },
  { r: 'bestie', t: 'remember when we said we\'d move to tokyo', at: '02:22AM', d: 2 },
  { r: 'bestie', t: 'you were right about him. don\'t say it', at: '03:04AM', d: 6 },
  { r: 'bestie', t: 'i miss being annoying together', at: '10:02PM', d: 3 },
  { r: 'mom', t: 'you were right about him', at: '04:10AM', d: 4 },
  { r: 'mom', t: 'can i come home for a bit', at: '11:47PM', d: 9 },
  { r: 'mom', t: 'i love you. that\'s it. that\'s the message', at: '07:30PM', d: 1 },
  { r: 'mom', t: 'i\'m not eating well but i\'m fine', at: '01:58AM', d: 5 },
  { r: 'mom', t: 'sorry for what i said at christmas', at: '09:12PM', d: 13 },
  { r: 'me', t: 'you\'re doing better than you think', at: '05:05AM', d: 2 },
  { r: 'me', t: 'stop checking', at: '03:12AM', d: 1 },
  { r: 'me', t: 'note to self: you deserved more', at: '02:14AM', d: 3 },
  { r: 'me', t: 'drink water. block him. in that order', at: '12:00PM', d: 1 },
  { r: 'me', t: 'you don\'t have to be okay today', at: '04:44AM', d: 2 },
  { r: 'ex', t: 'i\'m not mad anymore. i\'m just sad. which is worse', at: '03:50AM', d: 8 },
  { r: 'crush', t: 'is it weird that i remember your coffee order', at: '08:08AM', d: 6 },
  { r: 'bestie', t: 'call me when you can. or when you want', at: '06:40PM', d: 4 },
  { r: 'ex', t: 'come back', at: '04:04AM', d: 27 },
  { r: 'crush', t: 'nvm', at: '02:22AM', d: 19 },

  // the heavier ones
  { r: 'ex', t: 'you made me feel crazy for noticing things that were actually happening', at: '03:40AM', d: 12 },
  { r: 'ex', t: 'i hope she never finds out who you are when nobody\'s watching', at: '01:13AM', d: 21 },
  { r: 'ex', t: 'you said forever like it was a small word', at: '04:21AM', d: 5 },
  { r: 'ex', t: 'i wasted my best year on you and you didn\'t even notice it was my best', at: '02:58AM', d: 9 },
  { r: 'ex', t: 'the worst part is i\'d still pick up', at: '03:12AM', d: 16 },
  { r: 'ex', t: 'you never apologized. you just waited until i got tired', at: '12:37AM', d: 7 },
  { r: 'ex', t: 'i\'m not over you. i\'m over waiting for you to be someone else', at: '05:02AM', d: 10 },
  { r: 'ex', t: 'you ruined my favorite song and you don\'t even like music', at: '11:48PM', d: 3 },
  { r: 'crush', t: 'i know you don\'t feel the same. i just needed to say it to someone, even a draft', at: '02:44AM', d: 8 },
  { r: 'crush', t: 'you laughed at my joke and i thought about it for a week', at: '10:10PM', d: 4 },
  { r: 'crush', t: 'you called me "such a good friend". i went home and cried', at: '01:31AM', d: 6 },
  { r: 'crush', t: 'i\'m tired of being the one who almost', at: '03:03AM', d: 13 },
  { r: 'crush', t: 'you only text me when you\'re bored and i always answer', at: '12:12AM', d: 9 },
  { r: 'crush', t: 'i wore that dress for you. you didn\'t look once', at: '02:05AM', d: 5 },
  { r: 'bestie', t: 'you talk about me when i leave the room. i know because you talk about everyone', at: '01:44AM', d: 11 },
  { r: 'bestie', t: 'i needed you that night and you left me on read', at: '04:08AM', d: 7 },
  { r: 'bestie', t: 'we\'re not fighting. we\'re just becoming strangers slowly', at: '11:36PM', d: 4 },
  { r: 'bestie', t: 'you picked him over me and then called me when he left', at: '02:39AM', d: 10 },
  { r: 'bestie', t: 'i still have the bracelet. i don\'t wear it. i can\'t throw it away either', at: '12:58AM', d: 3 },
  { r: 'bestie', t: 'you were my person. i don\'t think i was yours', at: '03:26AM', d: 8 },
  { r: 'mom', t: 'i\'m not okay and i don\'t know how to say it without you worrying', at: '02:17AM', d: 14 },
  { r: 'mom', t: 'i wish you had asked me how i was instead of how my grades were', at: '12:44AM', d: 9 },
  { r: 'mom', t: 'i\'m sorry i\'m not who you pictured', at: '03:59AM', d: 6 },
  { r: 'mom', t: 'i heard you crying in the kitchen. i didn\'t come in. i\'m sorry', at: '01:09AM', d: 5 },
  { r: 'mom', t: 'can you tell me i did a good job. even if it\'s not true', at: '11:22PM', d: 3 },
  { r: 'me', t: 'you keep going back to people who made you feel small', at: '04:30AM', d: 2 },
  { r: 'me', t: 'nobody is coming to save you. get up anyway', at: '06:06AM', d: 1 },
  { r: 'me', t: 'you\'re allowed to be the one who leaves', at: '02:50AM', d: 4 },
  { r: 'me', t: 'you begged for the bare minimum and called it love', at: '03:15AM', d: 3 },
  { r: 'me', t: 'it wasn\'t your fault. read it again. it wasn\'t your fault', at: '05:55AM', d: 1 },
  { r: 'me', t: 'stop rewriting the past so they come out as the good guy', at: '01:20AM', d: 2 },
  { r: 'me', t: 'one day this will just be a story. not today though', at: '04:47AM', d: 2 },

  // more: some funny, some strange, some that hurt
  { r: 'ex', t: 'your spotify is still logged in on my laptop. i see everything you listen to. you\'re not okay either', at: '02:26AM', d: 11 },
  { r: 'ex', t: 'i kept the receipt from our first dinner. it says 2 cokes. it was the best night of my life', at: '12:19AM', d: 4 },
  { r: 'ex', t: 'i\'m dating someone nice now. i hate how much i have to explain myself to someone nice', at: '01:57AM', d: 8 },
  { r: 'ex', t: 'you were right. i was too much. i just wish you\'d said it before i gave you everything', at: '03:44AM', d: 15 },
  { r: 'ex', t: 'my dog still waits by the door at 7. i don\'t have the heart to tell him', at: '07:02PM', d: 3 },
  { r: 'ex', t: 'block me properly. this half thing is killing me', at: '03:12AM', d: 6 },
  { r: 'crush', t: 'i learned the lyrics to your favorite band. i don\'t even like them', at: '11:03PM', d: 5 },
  { r: 'crush', t: 'i sat next to you on purpose. every single time', at: '09:47PM', d: 7 },
  { r: 'crush', t: 'your hand touched mine when you passed the lighter and i\'ve thought about it for 3 days', at: '02:11AM', d: 10 },
  { r: 'crush', t: 'i\'m not busy. i said i was busy because i didn\'t want to look like i was waiting', at: '08:36PM', d: 12 },
  { r: 'crush', t: 'if you ever need someone to hate your ex with, i\'m available. very available', at: '12:34AM', d: 9 },
  { r: 'crush', t: 'i think about kissing you in the most normal situations. like at the supermarket', at: '01:19AM', d: 14 },
  { r: 'bestie', t: 'you told her my secret. i know because she looked at me differently', at: '11:58PM', d: 6 },
  { r: 'bestie', t: 'i\'m proud of you and a little jealous and i hate that both are true', at: '10:44PM', d: 5 },
  { r: 'bestie', t: 'you became a different person and i was supposed to be happy for you', at: '02:40AM', d: 8 },
  { r: 'bestie', t: 'i still have our group chat pinned. it\'s been dead for two years', at: '01:08AM', d: 2 },
  { r: 'bestie', t: 'thank you for that night in the bathroom. you don\'t even remember it. i always will', at: '04:16AM', d: 3 },
  { r: 'mom', t: 'i became you. i catch myself sighing the way you sigh', at: '11:31PM', d: 4 },
  { r: 'mom', t: 'please stop asking when i\'m getting married. i can barely text back', at: '09:55PM', d: 7 },
  { r: 'mom', t: 'i still have the voicemail you left on my 18th birthday. i listen to it when it\'s bad', at: '03:38AM', d: 1 },
  { r: 'mom', t: 'i know you did your best. i\'m just not sure your best was enough', at: '02:03AM', d: 18 },
  { r: 'mom', t: 'teach me the lasagna recipe before it\'s too late. i mean it', at: '06:20PM', d: 2 },
  { r: 'me', t: 'you are not hard to love. you were just loved by people who were bad at it', at: '03:27AM', d: 3 },
  { r: 'me', t: 'stop performing okay for people who never asked', at: '12:51AM', d: 2 },
  { r: 'me', t: 'you don\'t miss him. you miss who you were before you knew better', at: '04:09AM', d: 5 },
  { r: 'me', t: 'eat something. something real. not just coffee and spite', at: '01:40PM', d: 1 },
  { r: 'me', t: 'you\'re 23 and you think it\'s too late. it\'s not. it\'s barely started', at: '05:21AM', d: 2 },
  { r: 'me', t: 'the version of you from 2019 would be so proud. and so scared', at: '02:48AM', d: 4 },
  { r: 'me', t: 'why do you always apologize for taking up space', at: '11:14PM', d: 3 },
  { r: 'me', t: 'it\'s 3AM. nothing you decide right now is real. go to sleep', at: '03:00AM', d: 1 }
];
const ROOM_NAME = { ex: 'the ex', crush: 'the crush', bestie: 'best friend', mom: 'mom', me: 'yourself' };
const ROOM_IMG = r => `img/ARCHIVE/room-${r}.jpg`;

useAlerts({
  a: ['unsent_messages.db', 'The archive is <b>being read by another program</b>.', ['OK', 'Who?']],
  b: ['xoxo.exe', 'xoxo.exe has <b>started sending archived messages</b>. Please stay calm.', ['Stop', 'Stop!!']],
  c: ['Messages ♥', '<b>2,318 messages delivered</b> on your behalf. You\'re welcome.', ['Undo', 'ok']]
});

// messages this visitor archived (kept only in this browser)
let mine = [];
try { mine = JSON.parse(localStorage.getItem('xo-archive-mine') || '[]'); } catch (e) { mine = []; }

const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtN = n => n.toLocaleString('en-US');
let total = 4812339 + mine.length;

/* ── hero: message rain ────────────────────────────────────────── */
(function rain() {
  const box = $('.rain');
  const cols = innerWidth < 760 ? 4 : 9;
  for (let c = 0; c < cols; c++) {
    const col = document.createElement('div');
    col.className = 'rain-col';
    const list = gsap.utils.shuffle(MESSAGES.slice()).slice(0, 16);
    const lines = list.map(m => `<p class="${Math.random() < 0.12 ? 'hot' : ''}">${esc(m.t)}</p>`).join('');
    col.innerHTML = `<div class="rain-run" style="animation-duration:${rand(40, 90).toFixed(0)}s">${lines}${lines}</div>`;
    box.appendChild(col);
  }
})();

const heroNum = $('.a-num');
heroNum.textContent = fmtN(total);
if (!calm) setInterval(() => { total += Math.round(rand(0, 3)); heroNum.textContent = fmtN(total); }, 1400);

gsap.timeline({ defaults: { ease: 'expo.out' }, delay: calm ? 0 : 0.35 })
  .from('.a-top > *', { y: -16, opacity: 0, duration: 1, stagger: 0.08 }, 0)
  .from('.a-title .ln > span', { yPercent: 115, rotate: 3, duration: 1.5, stagger: 0.1 }, 0.1)
  .from('.a-hero-center .kicker, .a-count', { opacity: 0, y: 20, duration: 1 }, 0.5)
  .from('.a-float', { scale: 0, rotate: () => rand(-40, 40), duration: 1.1, stagger: 0.12, ease: 'back.out(1.7)' }, 0.6)
  .from('.rain', { opacity: 0, duration: 2 }, 0);

/* ── search ────────────────────────────────────────────────────── */
const q = $('#q');
const results = $('.results');
const hits = $('#hits');
const noRes = $('.no-results');
let room = 'all';

function allMessages() {
  return [...mine.map(m => ({ ...m, mine: true })), ...MESSAGES];
}

/* ── the "for you" feed ────────────────────────────────────────── */
const hashStr = t => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
function forYou(list) {
  const { share, total } = profile();
  const terms = mem.get('algo-terms', []);
  const seedDay = new Date().getDate();
  return list.map(m => {
    const hit = terms.find(t => m.t.toLowerCase().includes(t));
    const affinity = total ? share[m.r] || 0 : 0.2;
    const noise = ((Math.abs(hashStr(m.t) + seedDay) % 100) / 100) * 0.35;
    const score = affinity * 3 + (hit ? 1.4 : 0) + (m.d || 1) / 40 + noise + (m.mine ? 2 : 0);
    const why = m.mine ? 'you wrote this' :
      hit ? `because you searched "${hit}"` :
      affinity > 0.3 ? `because you keep coming back to ${ROOM_NAME[m.r]}` :
      total ? 'people like you lingered on this' : 'trending at 03:12AM';
    return { ...m, _score: score, _why: why };
  }).sort((a, b) => b._score - a._score);
}

/* ── the panel: what it learned, live ──────────────────────────── */
const algoBox = $('.algo');
function renderAlgo(pulse) {
  const { share, top, confidence } = profile();
  $('.algo-conf').textContent = Math.round(confidence * 100);
  $('.algo-bars').innerHTML = Object.keys(ALGO_ROOMS).map(k =>
    `<div class="ab${k === top ? ' top' : ''}"><span>${ALGO_ROOMS[k]}<b>${Math.round(share[k] * 100)}%</b></span><i><em style="transform:scaleX(${share[k]})"></em></i></div>`).join('');
  const why = mem.get('algo-why', []).slice(0, 3);
  $('.algo-why').innerHTML = why.length
    ? 'because you ' + why.map(w => `<b>${esc(w.why)}</b>`).join(' · ')
    : 'it doesn\'t know you yet. open a message. search something. linger.';
  if (pulse && !calm) { algoBox.classList.add('pulse'); setTimeout(() => algoBox.classList.remove('pulse'), 500); }
}
renderAlgo();
let reRank = 0;
document.addEventListener('xo-learn', () => {
  renderAlgo(true);
  if (room === 'foryou') { clearTimeout(reRank); reRank = setTimeout(() => render(true), 600); }
});

// searches teach it too (once you stop typing)
let searchT = 0;
q.addEventListener('input', () => {
  clearTimeout(searchT);
  searchT = setTimeout(() => {
    const term = q.value.trim().toLowerCase();
    if (term.length < 3) return;
    const found = MESSAGES.filter(m => m.t.toLowerCase().includes(term));
    if (!found.length) return;
    const counts = {};
    found.forEach(m => (counts[m.r] = (counts[m.r] || 0) + 1));
    const r = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    mem.set('algo-terms', [term, ...mem.get('algo-terms', []).filter(t => t !== term)].slice(0, 6));
    learn(r, 1, `searched "${term}"`);
  }, 900);
});

// lingering on a card for a while counts
let hoverT = 0;
results.addEventListener('mouseover', e => {
  const card = e.target.closest('.msgcard');
  clearTimeout(hoverT);
  if (!card) return;
  hoverT = setTimeout(() => { const m = results._list[+card.dataset.i]; if (m && !m.mine) learn(m.r, 0.5, `lingered on "${m.t.slice(0, 28)}${m.t.length > 28 ? '…' : ''}"`); }, 1600);
});
results.addEventListener('mouseleave', () => clearTimeout(hoverT));

// show a page of results at a time (long lists are endless on phones)
const PAGE = innerWidth < 760 ? 10 : 24;
let limit = PAGE;
const more = document.createElement('button');
more.className = 'more-btn';
results.after(more);
more.addEventListener('click', () => { limit += PAGE; render(true); });

function render(keepLimit) {
  if (keepLimit !== true) limit = PAGE;
  const term = q.value.trim().toLowerCase();
  // "3am", "11pm"… also finds messages written at that hour
  const hour = term.match(/^(\d{1,2})\s?(am|pm)$/);
  const atHour = m => hour && m.at && +m.at.slice(0, 2) === +hour[1] && m.at.slice(-2).toLowerCase() === hour[2];
  let list = allMessages().filter(m => (room === 'all' || room === 'foryou' || m.r === room) && (!term || m.t.toLowerCase().includes(term) || atHour(m)));
  if (room === 'foryou') list = forYou(list);
  const before = $$('.msgcard', results).length;
  results.innerHTML = list.slice(0, limit).map((m, i) => {
    let text = esc(m.t);
    if (term) text = text.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), s => `<mark>${s}</mark>`);
    return `<button class="msgcard${m.mine ? ' mine' : ''}" data-i="${i}">
      <p class="mc-text">"${text}"</p>
      <p class="mc-meta"><span>to: ${esc(m.mine ? m.to || 'someone' : ROOM_NAME[m.r])}</span><b>${m.mine ? 'yours' : m.at}</b></p>
      ${room === 'foryou' && m._why ? `<span class="mc-why">✦ ${esc(m._why)}</span>` : ''}
    </button>`;
  }).join('');
  results._list = list;
  hits.textContent = list.length;
  noRes.classList.toggle('show', list.length === 0);
  const left = list.length - Math.min(limit, list.length);
  more.hidden = left <= 0;
  more.textContent = `show ${Math.min(PAGE, left)} more · ${left} left unsent`;
  const fresh = $$('.msgcard', results).slice(keepLimit === true ? before : 0);
  if (!calm) gsap.from(fresh, { y: 20, opacity: 0, duration: 0.5, stagger: 0.015, ease: 'power3.out' });
  ScrollTrigger.refresh();
}

q.addEventListener('input', () => render());
$$('.rf').forEach(b => b.addEventListener('click', () => {
  room = b.dataset.r;
  if (ALGO_ROOMS[room]) learn(room, 2, `filtered by ${ALGO_ROOMS[room]}`);
  $$('.rf').forEach(x => x.classList.toggle('is-on', x === b));
  render();
}));
results.addEventListener('click', e => {
  const card = e.target.closest('.msgcard');
  if (card) openViewer(results._list[+card.dataset.i]);
});

// the placeholder types suggestions by itself
(function ghostType() {
  const words = ['are u up', 'hoodie', 'sorry', 'birthday', 'come back', 'playlist', 'mom'];
  let w = 0, n = 0, dir = 1;
  const tick = () => {
    if (document.activeElement !== q && !q.value) {
      n += dir;
      q.placeholder = words[w].slice(0, n) + (n ? '' : '');
      if (n === words[w].length) { dir = -1; return setTimeout(tick, 1400); }
      if (n === 0) { dir = 1; w = (w + 1) % words.length; }
    }
    setTimeout(tick, dir > 0 ? 110 : 45);
  };
  calm ? (q.placeholder = 'are u up') : tick();
})();

// links from the home diagnosis: archive.html?q=3AM or ?room=me
(function fromLink() {
  const params = new URLSearchParams(location.search);
  if (params.get('q')) q.value = params.get('q');
  const r = params.get('room');
  if (r && $(`.rf[data-r="${r}"]`)) {
    room = r;
    $$('.rf').forEach(x => x.classList.toggle('is-on', x.dataset.r === r));
  }
})();

render();

/* ── viewer: one message as a museum artifact ──────────────────── */
const viewer = $('.viewer');
const sendBtn = $('.send-anyway');
const sendLog = $('.send-log');
let viewing = null;

function openViewer(m) {
  viewing = m;
  if (!m.mine) learn(m.r, 3, `opened a message to ${ROOM_NAME[m.r]}`);
  const img = $('.viewer-img img');
  const src = ROOM_IMG(m.r || 'me');
  $('.viewer-img').dataset.file = src;
  $('.viewer-img').classList.remove('is-empty');
  img.src = src;
  $('.viewer-id b').textContent = String(Math.abs([...m.t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % 1000000).padStart(6, '0');
  $('.viewer-msg').textContent = `"${m.t}"`;
  $('.vm-to').textContent = m.mine ? (m.to || 'someone') : ROOM_NAME[m.r];
  $('.vm-time').textContent = m.mine ? 'just now' : m.at;
  $('.vm-drafts').textContent = m.mine ? 'once' : `${m.d} time${m.d > 1 ? 's' : ''}`;
  $('.vm-status').textContent = 'unsent';
  sendBtn.disabled = false;
  sendLog.textContent = '';
  sendLog.classList.remove('err');
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
  lenis?.stop();
  gsap.fromTo('.viewer-card', { y: 60, rotate: -2, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: calm ? 0 : 0.6, ease: 'expo.out' });
  $('.viewer-x').focus();
}
function closeViewer() {
  if (!viewer.classList.contains('open')) return;
  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  lenis?.start();
}
$('.viewer-x').addEventListener('click', closeViewer);
viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeViewer(); });

const ENDINGS = [
  ['failed: recipient changed their number in 2019.', true],
  ['delivered. read 03:12AM. no reply.', false],
  ['failed: you have been blocked. (you knew that)', true],
  ['xoxo.exe intercepted your message. it will send it later, at the worst moment ♥', true]
];
sendBtn.addEventListener('click', () => {
  sendBtn.disabled = true;
  const steps = ['connecting…', 'finding recipient…', 'are you sure?', 'sending…'];
  const [end, bad] = ENDINGS[(Math.random() * ENDINGS.length) | 0];
  const tl = gsap.timeline();
  steps.forEach(s => tl.add(() => scramble(sendLog, s, 300)).to({}, { duration: calm ? 0 : 0.7 }));
  tl.add(() => {
    scramble(sendLog, end, 500);
    sendLog.classList.toggle('err', bad);
    $('.vm-status').textContent = bad ? 'unsent (still)' : 'read';
  });
});

/* ── rooms: "browse room" jumps to search with that filter ─────── */
$$('.room').forEach((r, i) => r.style.setProperty('--i', i));
$$('.room-open').forEach(b => b.addEventListener('click', () => {
  learn(b.dataset.r, 1, `browsed the room "${ALGO_ROOMS[b.dataset.r]}"`);
  $(`.rf[data-r="${b.dataset.r}"]`).click();
  lenis ? lenis.scrollTo('#search', { duration: 1.6 }) : $('#search').scrollIntoView({ behavior: 'smooth' });
}));

/* ── draft replay ──────────────────────────────────────────────── */
const DRAFTS = [
  'hey',
  'hey :)',
  'hey how are you',
  'hey, long time',
  'hey stranger',
  'i saw something that reminded me of you',
  'i saw a hoodie like yours today',
  'do you still have my charger',
  'happy birthday btw',
  'happy birthday!! hope ur doing well',
  'i miss you',
  'i miss us',
  'i think i liked u more than i said',
  'i think i liked you more than i said.',
  ''
];
const FRAMES = (() => {
  const out = [];
  let s = '';
  DRAFTS.forEach((d, i) => {
    let k = 0;
    while (k < s.length && k < d.length && s[k] === d[k]) k++;
    while (s.length > k) { s = s.slice(0, -1); out.push({ s, i }); }
    while (s.length < d.length) { s = d.slice(0, s.length + 1); out.push({ s, i }); }
    for (let h = 0; h < 8; h++) out.push({ s, i });
  });
  return out;
})();

const typed = $('.c-typed');
const draftLbl = $('.c-draft');
const cClock = $('.c-clock');
const cSend = $('.c-send');
const cStatus = $('.c-status');
const versions = $('.versions');
versions.innerHTML = DRAFTS.slice(0, -1).map((d, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(d)}</li>`).join('');
const vItems = $$('li', versions);

function showFrame(p) {
  const f = FRAMES[Math.min(FRAMES.length - 1, Math.floor(p * FRAMES.length))];
  typed.textContent = f.s;
  cSend.classList.toggle('ready', f.s.length > 0);
  const last = f.i === DRAFTS.length - 1;
  draftLbl.textContent = last ? 'deleted — never sent' : `draft ${String(f.i + 1).padStart(2, '0')} / ${DRAFTS.length - 1}`;
  cStatus.textContent = last ? 'last seen just now' : 'typing…';
  const mins = 62 + Math.floor(p * 130); // 01:02 → 03:12
  cClock.textContent = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}AM`;
  vItems.forEach((li, i) => { li.classList.toggle('shown', i <= f.i); li.classList.toggle('now', i === f.i); });
}
showFrame(calm ? 0.93 : 0);

/* ── voice notes: encrypted. you hear the data before the words ── */
let actx = null;
function audioCtx() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
// every character becomes 8 tones: high = 1, low = 0 (like an old modem)
function playBits(text, bad) {
  const ac = audioCtx();
  const bytes = [...new TextEncoder().encode(text)];
  const BIT = bad ? 0.011 : 0.013, GAP = 0.006;
  const osc = ac.createOscillator();
  osc.type = bad ? 'sawtooth' : 'square';
  const filt = ac.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = bad ? 2200 : 3000;
  const gain = ac.createGain();
  gain.gain.value = 0;
  let chain = osc.connect(filt);
  if (bad) { // xoxo.exe's note is dirtier: a little distortion
    const shaper = ac.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 6); }
    shaper.curve = curve;
    chain = chain.connect(shaper);
  }
  chain.connect(gain).connect(ac.destination);
  const t0 = ac.currentTime + 0.05;
  let t = t0;
  bytes.forEach(byte => {
    for (let i = 7; i >= 0; i--) {
      const bit = (byte >> i) & 1;
      const f = bit ? (bad ? 1500 + Math.random() * 400 : 1400) : (bad ? 480 + Math.random() * 240 : 650);
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(bad ? 0.035 : 0.045, t);
      t += BIT;
    }
    gain.gain.setValueAtTime(0, t);
    t += GAP;
  });
  osc.start(t0);
  osc.stop(t + 0.05);
  return {
    bytes, duration: t - t0,
    stop: () => { try { gain.gain.cancelScheduledValues(ac.currentTime); gain.gain.setValueAtTime(0, ac.currentTime); osc.stop(); } catch (e) { /* already stopped */ } }
  };
}

(function voice() {
  const notes = $$('.vn');
  const NOTE_ROOM = ['ex', 'crush', 'mom', null];
  const CIPHER = '█▓▒░#%&@$*';
  let current = null;

  notes.forEach((vn, idx) => {
    const cv = $('.vn-wave', vn);
    const ctx = cv.getContext('2d');
    const tr = $('.vn-tr', vn);
    const text = vn.dataset.t;
    const bad = vn.classList.contains('vn-bad');
    const words = text.split(' ');
    // where each word starts, in characters (to decrypt them in sync with the sound)
    const starts = [];
    words.reduce((pos, w) => { starts.push(pos); return pos + w.length + 1; }, 0);
    const lock = w => [...w].map(() => CIPHER[(Math.random() * CIPHER.length) | 0]).join('');
    tr.innerHTML = words.map(w => `<span>${esc(lock(w))}</span>`).join(' ');
    const spans = $$('span', tr);
    const bitsEl = document.createElement('p');
    bitsEl.className = 'vn-bits';
    bitsEl.setAttribute('aria-hidden', 'true');
    bitsEl.textContent = 'encrypted · press play to decode';
    tr.before(bitsEl);
    // real length of the sound: 8 tones + a pause per byte
    if (!bad) {
      const secs = Math.round(new TextEncoder().encode(text).length * (8 * 0.013 + 0.006));
      $('.vn-dur', vn).textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    }

    let seed = idx * 97 + 13;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const bars = Array.from({ length: 90 }, (_, i) => 0.18 + rnd() * 0.82 * Math.abs(Math.sin(i / 6 + idx)));
    const hot = '#ff2fbf';
    const cold = bad ? '#3a363f' : '#d6d3da';

    const draw = (p = 0, jitter = 0) => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const n = Math.max(20, Math.floor(w / 5));
      const bw = w / n;
      for (let i = 0; i < n; i++) {
        const v = bars[Math.floor((i / n) * bars.length)];
        const near = p > 0 && Math.abs(i / n - p) < 0.05;
        const bh = Math.max(3, v * h * (near ? 1 + jitter : 1));
        ctx.fillStyle = i / n <= p ? hot : cold;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(i * bw + 1, (h - bh) / 2, bw - 2, bh, 2) : ctx.rect(i * bw + 1, (h - bh) / 2, bw - 2, bh);
        ctx.fill();
      }
    };
    draw();
    addEventListener('resize', () => draw(vn._p || 0));

    const stop = () => {
      vn._tw?.kill();
      vn._snd?.stop();
      vn.classList.remove('playing');
      $('.vn-play span', vn).textContent = '▶';
    };
    vn._stop = stop;

    $('.vn-play', vn).addEventListener('click', () => {
      if (vn.classList.contains('playing')) return stop();
      if (current && current !== vn) current._stop();
      current = vn;
      if (NOTE_ROOM[idx]) learn(NOTE_ROOM[idx], 2, `listened to a voice note for ${ALGO_ROOMS[NOTE_ROOM[idx]]}`);
      vn.classList.add('playing');
      $('.vn-play span', vn).textContent = '❚❚';
      spans.forEach((s, i) => { s.classList.remove('on'); s.textContent = lock(words[i]); });

      let snd = null;
      try { snd = calm ? null : playBits(text, bad); } catch (e) { snd = null; }
      vn._snd = snd;
      const bytes = snd ? snd.bytes : [...new TextEncoder().encode(text)];
      const dur = snd ? snd.duration : (calm ? 0.01 : bytes.length * 0.11);
      let shown = -1;
      const o = { p: 0 };
      vn._tw = gsap.to(o, {
        p: 1, duration: dur, ease: 'none',
        onUpdate: () => {
          vn._p = o.p;
          draw(o.p, Math.random() * 0.35);
          const ci = Math.min(bytes.length - 1, Math.floor(o.p * bytes.length));
          // the binary scrolls past…
          bitsEl.textContent = bytes.slice(Math.max(0, ci - 5), ci + 1).map(b => b.toString(2).padStart(8, '0')).join(' ') + '  → ' + (text[ci] === ' ' ? '␣' : text[ci] || '');
          // …and each word unlocks once its letters have been heard
          spans.forEach((s, i) => {
            if (i > shown && starts[i] + words[i].length <= ci + 1) {
              s.classList.add('on');
              scramble(s, words[i], 260);
              shown = i;
            }
          });
        },
        onComplete: () => {
          stop();
          spans.forEach((s, i) => { s.classList.add('on'); s.textContent = words[i]; });
          bitsEl.textContent = `decrypted · ${bytes.length} bytes · ${bytes.length * 8} bits`;
        }
      });
    });
  });
})();

/* ── donate: your message shreds into the archive ──────────────── */
(function donate() {
  const form = $('.donate-form');
  const ta = $('#d-msg');
  const to = $('#d-to');
  const len = $('.df-len b');
  const shreds = $('.shreds');
  const done = $('.donate-done');

  ta.addEventListener('input', () => (len.textContent = ta.value.length));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = ta.value.trim();
    if (!text) {
      gsap.fromTo(form, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .3)' });
      ta.focus();
      return;
    }

    // lay the letters over the textarea, then let them fall apart
    const fr = form.getBoundingClientRect();
    const tr = ta.getBoundingClientRect();
    const mirror = document.createElement('div');
    const cs = getComputedStyle(ta);
    Object.assign(mirror.style, {
      position: 'absolute', left: tr.left - fr.left + 'px', top: tr.top - fr.top + 'px', width: tr.width + 'px',
      font: cs.font, lineHeight: cs.lineHeight, padding: cs.padding, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: cs.color
    });
    mirror.innerHTML = [...ta.value].map(c => `<span style="display:inline-block;white-space:pre">${esc(c)}</span>`).join('');
    shreds.appendChild(mirror);
    ta.value = '';
    len.textContent = 0;

    gsap.to($$('span', mirror), {
      y: () => rand(120, 420), x: () => rand(-120, 120), rotate: () => rand(-160, 160),
      opacity: 0, duration: calm ? 0 : 1.4, ease: 'power2.in', stagger: { each: 0.008, from: 'random' },
      onComplete: () => mirror.remove()
    });

    total += 1;
    heroNum.textContent = fmtN(total);
    const no = total;
    mine.unshift({ r: 'me', t: text, to: to.value.trim(), no });
    learn('me', 3, to.value.trim() ? `wrote something for ${to.value.trim()}` : 'wrote something for yourself');
    try { localStorage.setItem('xo-archive-mine', JSON.stringify(mine.slice(0, 30))); } catch (err) { /* private mode: keep it for this visit */ }
    to.value = '';
    render();
    done.innerHTML = '';
    setTimeout(() => { done.innerHTML = `archived as artifact <b>no. ${fmtN(no)}</b>. nobody will read it ♥`; gsap.from(done, { opacity: 0, y: 10, duration: 0.6 }); }, calm ? 0 : 900);
  });
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL SCENES
   ══════════════════════════════════════════════════════════════ */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // hero floats drift away
  $$('.a-float').forEach((f, i) => gsap.to(f, { y: [-160, -260, -120][i], rotate: `+=${[-10, 12, -8][i]}`, ease: 'none', scrollTrigger: { trigger: '.a-hero', start: 'top top', end: 'bottom top', scrub: true } }));
  gsap.to('.a-hero-center', { yPercent: -20, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.a-hero', start: 'top top', end: 'bottom top', scrub: true } });

  // search
  gsap.from('.search-head > *, .searchbar, .rf', { y: 40, opacity: 0, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.a-search', start: 'top 75%' } });

  // rooms: each card shrinks back as the next one lands on it
  gsap.from('.rooms-intro > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.rooms-intro', start: 'top 80%' } });
  const rooms = $$('.room');
  rooms.forEach((r, i) => {
    const next = rooms[i + 1];
    if (!next) return;
    gsap.to(r, { scale: 0.92, filter: 'brightness(.45)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 15%', scrub: true } });
  });
  rooms.forEach(r => gsap.from($$('.room-quotes li', r), { x: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 60%' } }));

  // voice
  gsap.from('.voice-head > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.a-voice', start: 'top 75%' } });
  gsap.from('.vn', { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.vnotes', start: 'top 85%' } });

  // donate + next
  gsap.from('.donate-copy > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.a-donate', start: 'top 70%' } });
  gsap.from('.donate-form', { y: 80, rotate: 3, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.a-donate', start: 'top 65%' } });
  gsap.from('.a-next > *', { y: 60, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.a-next', start: 'top 80%' } });

  // draft replay — pinned, scroll = keyboard
  ScrollTrigger.create({
    trigger: '.a-drafts', start: 'top top', end: '+=420%', pin: '.drafts-stage', scrub: true,
    onUpdate: self => showFrame(self.progress)
  });
  gsap.from('.drafts-copy > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.a-drafts', start: 'top 60%' } });
});

infectBetween('.a-search', 'top 60%', '.a-donate', 'top center');
finish();
