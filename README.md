xoxo.exe
it's not a bug. it's a feeling.

xoxo.exe is an interactive, story‑driven website about a fictional 2004 tech company, xoxo labs, that "engineers feelings as software" — until the program it trained on millions of unsent messages escapes and starts sending them.

Every page begins clean and corporate and gets infected as you scroll: the palette turns pink, photos degrade into halftone, stickers crawl onto the edges, alert windows pop up and the taskbar turns into an early‑2000s desktop. The visitor isn't just reading the story — by the end, the site is talking about them.

Personal portfolio project · concept, design & code by ghostly.grl ♥

The story, page by page
Page	File	What happens
Home	index.html	Boot screen with a glitch, a clean lab homepage that tears apart mid‑scroll ("Everything is under control."), unsent chats, draggable files, an outbreak radar, clickable symptoms that open a clinical diagnosis, and a self‑made infection ID card.
Products	products.html	A rotating 3D software box, five "feelings" sold as programs (Crush 2.0, Heartbreak Patch, Closure.dmg…), fake installers, a comparison table, and a quarantined product you can hold to install (don't).
Campaign	campaign.html	The SS04 ad campaign as a fashion magazine: a tilting cover, an editor's letter, editorial spreads, a word filled with a photo, sliced images that recompose, and a contact sheet you can circle with a marker.
The Archive	archive.html	A searchable database of 98 unsent messages, museum‑style artifact cards, five stacked "rooms", a draft replay driven by scroll, encrypted voice notes and a form to leave your own message.
Outbreak	outbreak.html	A live news report: a draggable 3D dot globe with infection arcs, a timeline with a clock that turns with the scroll, patient zero's redacted case file, a clickable spread simulator, press clippings and safety rules.
Patch Notes	patch-notes.html	The company history as a changelog drawn like a git graph — until the branch splits and xoxo.exe starts writing its own releases. A config diff, the lead engineer's last memo, a terminal that types by itself, a bug report form and scrolling end credits.
The lab computer (secret)	start.html	Only reachable from the Start button. An XP‑style login, then the engineer's old desktop: folders, a picture viewer, a working cmd.exe, an error cascade, a locked private folder, a recycle bin — and two files that appear about you.
You (ending)	you.html	Reached by pressing ⚠ don't press. The site crashes, shows a pink screen of death and reboots into a page addressed to the visitor.
Interactive systems
Infection — each page defines where the infection starts and ends; scroll progress drives a --dirt variable that controls colors, grain, photo filters, stickers, pop‑ups, the favicon and the taskbar style.
xoxo.algorithm — the site quietly learns who you came here for (the ex, the crush, best friend, mom, yourself) from what you open, filter, search, install and linger on. The Archive shows a live profile and a "for you ✦" feed ranked by it; the ending reads out its verdict.
Encrypted voice notes — generated live with the Web Audio API: every character becomes 8 tones (high = 1, low = 0). The binary scrolls by and the transcript decrypts word by word in sync with the sound.
The mirror (you.html) — an observation log built from the visitor's own session: time spent, pages skipped, seconds of hesitation on the crash button, how often they left the tab, the names they typed. A ghost cursor follows yours; the page whispers when you go quiet.
The dossier & keylogger (start.html) — a surveillance file on the visitor (time zone, device, screen mode, habits) and a log of everything typed on the site, which keeps recording live while it's open.
Page transitions, a pink crash sequence, a CRT shutdown, a screensaver, tab titles that call you back ("come back ♥"), and a favicon that gets infected too.
Privacy
Nothing leaves the browser. Everything the site "knows" about a visitor is stored in their own localStorage / sessionStorage under keys starting with xo-, and it is only read back by the same pages on the same device. There is no server, no analytics and no tracking. The "reboot the site (forget me)" button on you.html (or xoxo.forget() in the console) wipes it all.

Built with
Plain HTML, CSS and JavaScript — no framework, no build step
GSAP 3 + ScrollTrigger + Flip — animation and scroll scenes
Lenis — smooth scrolling
Canvas 2D (globe, radar, simulator, waveforms) and the Web Audio API (voice notes)
Google Fonts: Anton, Inter Tight, Instrument Serif, Space Mono, Silkscreen, Caveat
Designed for desktop and mobile (a full‑screen pages menu replaces the taskbar links on phones). Respects prefers-reduced-motion.

Structure
index.html · products.html · campaign.html · archive.html
outbreak.html · patch-notes.html · start.html · you.html
core.css / core.js     shared by every page: taskbar, infection, alerts, transitions,
                       the algorithm, memory, crash, favicon, console easter egg
<page>.css / <page>.js one pair per page
img/INDEX · img/ARCHIVE · img/CAMPAIGN · img/OUTBREAK · img/PATCH
vibes/                 the original moodboard
favicon.svg · favicon-dirty.svg
Images use a simple convention: every photo lives in a .slot with a data-file path. If the file is missing, the slot shows a checkerboard with the expected file name — drop the image in that path and it appears.

Run it locally
You can open index.html directly, but a local server is recommended so every page reliably shares what the site remembers about the visitor (some browsers isolate storage between local files):

python3 -m http.server 8000
then visit http://localhost:8000.

Secrets (spoilers)
<details> <summary>Open only if you've already looked around</summary>
The Start button opens the engineer's old computer.
The private folder's password is the time it all started — patient zero's first message was sent at 03:12AM.
cmd.exe understands help, whoami, sudo love, please, open <page> and more.
Open the browser console and type xoxo.help().
Leave the lab computer untouched for 45 seconds.
Search the Archive for an hour, like 3am.
There's always a button you shouldn't press.
</details>
<sub>All brands, people and events are fictional. Photos in img/ belong to their respective owners and are used here as a personal, non‑commercial moodboard.</sub>

   *    /\_/\      +
       ( o.o )   <3  ghostly.grl
   +    > ^ <          *
