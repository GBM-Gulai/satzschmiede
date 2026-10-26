"use strict";
/* Satzschmiede – a deckbuilding roguelike where German sentences are your spells.
   Content: data.js (cards, enemies, relics) and story.js (heroes, ladders, story). Images: assets/ (see ASSETS.md). */

// ---------- helpers ----------
// A new version (service worker update, see the end of the file) is applied only on the title screen, never mid-game
let updateReady = false;
const applyUpdate = () => { if (updateReady && view === "title" && !document.querySelector(".story, .incant, .portal")) { updateReady = false; location.reload(); return true; } return false; };
const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const between = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const cap = s => s[0].toUpperCase() + s.slice(1);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ART = { nom: { der: "der", die: "die", das: "das" }, akk: { der: "den", die: "die", das: "das" }, dat: { der: "dem", die: "der", das: "dem" } };
const ARTICLES = ["der", "die", "das", "den", "dem"];
const AUX = { haben: "habe hast hat haben habt haben".split(" "), sein: "bin bist ist sind seid sind".split(" ") };
const CASE_NAME = { nom: "Nominativ", akk: "Akkusativ", dat: "Dativ" };
const FX = { atk: { icon: "⚔️" }, blk: { icon: "🛡️" }, heal: { icon: "❤️" } };
const PERSON = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
const NODE = { fight: ["⚔️", "Kampf", "Fight"], elite: ["💀", "Elite", "Elite"], rest: ["🔥", "Lager", "Camp"], shop: ["🛒", "Laden", "Shop"], event: ["❓", "Rätsel", "Riddle"], gate: ["🚪", "Prüfung", "Trial"], boss: ["👑", "Boss", "Boss"] };
// gate = a mandatory trial (mini-game) that everyone has to pass
const LAYOUT = [["fight", "fight"], ["fight", "fight", "event"], ["fight", "shop", "event"], ["gate"], ["fight", "rest", "fight"], ["elite", "fight", "event"],
  ["fight", "event", "fight"], ["gate"], ["rest", "shop", "fight"], ["boss"]];
const forms = d => d.forms.split(" ");
const nounForm = (d, cas) => cas !== "nom" && d.nForm ? d.nForm : d.de;
const powOf = c => CARDS[c.id].pow + (c.up ? 2 : 0);
let uidSeq = 1;
const mk = (id, up = false) => ({ id, up, uid: uidSeq++ });
const ladder = () => LADDERS.find(l => l.id === (run ? run.ladder : "a1"));
// Pronouns are always at hand (the pronoun bar), so they never sit in the deck or show up as rewards
const PRONOUNS = ["ich", "du", "er", "sie", "wir", "ihr", "sie_pl"];
const deckable = id => CARDS[id] && CARDS[id].type !== "subj";
const rewardPool = () => ladder().pool.filter(deckable);
// Each ladder has three acts; act 1 uses the ladder's own enemies, later acts override them
const ACTS = 3;
const stage = () => { const lad = ladder(); return { ...lad, ...((lad.acts || [])[run ? run.act || 0 : 0] || {}) }; };
const actLabel = () => run && run.act ? ` · ${L("Akt", "Act")} ${run.act + 1}` : "";
const HAND = 5;            // cards drawn each turn
const FIELD_SLOTS = 3;     // verbs on the field
const VERB_TURNS = 3;      // a field verb stays this many turns, then goes back to the discard pile
const DEALT = 2;           // pronouns dealt each turn
const POWER_CHARGE = 3;    // perfect sentences needed to recharge the hero power
const powerNeed = () => has("glocke") ? 2 : POWER_CHARGE;
const placeLimit = () => fight.turn === 1 ? 2 : 1;   // verbs you may put on the field this turn (2 on the opening turn)
const hero = () => HEROES[run.hero];

// Language of hints & menus grows with the level: A1 English, A2 both, B1+ German
function uiMode() { return run ? ladder().ui : "both"; }
function L(de, en) { const m = uiMode(); return m === "en" ? en : m === "both" ? `${de} <small class="en">(${en})</small>` : de; }
const TYPE_LABEL = () => ({ subj: L("Subjekt", "subject"), verb: L("Verb", "verb"), noun: L("Nomen", "noun"), adv: L("Zeitwort", "time"), perf: "Perfekt" });
const weakLabel = w => ({ dat: L("Dativ", "Dativ"), akk: L("Akkusativ", "Akkusativ"), inv: L("Satz beginnt mit Zeitwort", "sentence starts with a time word"),
  perfect: L("perfekte Sätze", "perfect sentences"), long: L("lange Sätze (5+ Wörter)", "long sentences (5+ words)"), perf: L("Perfekt-Sätze ⏪", "Perfekt sentences ⏪") })[w];

// ---------- images (assets/…jpg, embedded by build.ps1 for the one-file version) with emoji fallback ----------
// Optional looping videos (assets/video/<id>.mp4, e.g. made with Google Flow) play over the picture; if missing, the picture stays.
const ASSET = window.ASSET_DATA || {};
const src = p => ASSET[p] || p;
const VIDEO = ["automat", "hydra", "huber", "drache", "hausmeister", "wotruba", "kaese", "riesenrad", "aktenberg", "rathausmann", "standlerin", "watschenmann", "archivar", "sekretaer"];   // ids that may have a clip in assets/video/
window.artFail = img => img.parentNode.classList.add("noimg");
// Screens are redrawn often (every card tap). Videos are kept in a cache and moved into each new screen,
// so they keep playing instead of restarting: renders only contain <video data-src> placeholders.
const vidCache = new Map();
function vidFail(v) {
  v.classList.add("dead");
  const t = v.closest(".title-vid"); if (t) t.outerHTML = `<div class="anvil">⚒️</div>`;
}
function wireVideos() {
  document.querySelectorAll("video[data-src]").forEach(ph => {
    const s = ph.dataset.src;
    let v = vidCache.get(s);
    if (!v) {
      v = document.createElement("video");
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute("playsinline", ""); v.preload = "auto"; v.src = s;
      v.addEventListener("error", () => vidFail(v));
      vidCache.set(s, v);
    }
    if (v.classList.contains("dead")) { ph.replaceWith(document.createComment("")); const t = ph.closest && ph.closest(".title-vid"); if (t) vidFail(v); return; }
    ph.replaceWith(v);
    v.play().catch(() => {});
  });
}
new MutationObserver(wireVideos).observe(document.body, { childList: true, subtree: true });
const art = (p, emoji, cls = "", video = "") => `<span class="pic ${cls}"><img src="${src(p)}" alt="" onerror="artFail(this)">` +
  (video && !window.ASSET_DATA ? `<video data-src="${video}"></video>` : "") + `<span class="pic-e">${emoji}</span></span>`;
const clip = id => VIDEO.includes(id) ? `assets/video/${id}.mp4` : "";
const enemyArt = (id, cls) => art(`assets/enemies/${id}.jpg`, ENEMIES[id].e, cls, cls === "foe-pic" || cls === "portrait" ? clip(id) : "");
const heroArt = (id, cls) => art(`assets/heroes/${id}.jpg`, HEROES[id].e, cls);
for (const t of ["subj", "verb", "noun", "adv", "perf"]) document.documentElement.style.setProperty(`--card-${t}`, `url("${src(`assets/cards/${t}.jpg`)}")`);
// today's Vienna before the portal (first frame of portal.mp4) and the painted language tower
document.documentElement.style.setProperty("--bg-modern", `url("${src("assets/bg/a1-modern.jpg")}")`);
document.documentElement.style.setProperty("--bg-tower", `url("${src("assets/tower/tower.jpg")}")`);
// Wide screens (PC) use assets/bg/<name>-wide.jpg when it exists; phones keep the portrait paintings
const isWide = () => matchMedia("(min-aspect-ratio: 6/5)").matches;
const imgOk = {};
function probe(p, cb) {
  if (p in imgOk) return cb(imgOk[p]);
  const i = new Image();
  i.onload = () => cb(imgOk[p] = true); i.onerror = () => cb(imgOk[p] = false);
  i.src = src(p);
}
function setScene(id, bg = id) {   // background art per ladder (or per act)
  document.body.dataset.ladder = id || "";
  document.body.dataset.scene = bg || "";
  document.body.style.setProperty("--bg", bg ? `url("${src(`assets/bg/${bg}.jpg`)}"), url("${src(`assets/bg/${id}.jpg`)}")` : "none");
  document.body.classList.remove("wide-bg"); document.body.style.removeProperty("--bg-w");
  if (bg) probe(`assets/bg/${bg}-wide.jpg`, ok => {
    if (!ok || document.body.dataset.scene !== bg) return;
    document.body.style.setProperty("--bg-w", `url("${src(`assets/bg/${bg}-wide.jpg`)}")`);
    document.body.classList.add("wide-bg");
  });
}
probe("assets/bg/a1-modern-wide.jpg", ok => { if (ok) { document.documentElement.style.setProperty("--bg-modern-w", `url("${src("assets/bg/a1-modern-wide.jpg")}")`); document.documentElement.classList.add("modern-wide"); } });

// ---------- sound & speech ----------
let ac;
function tone(f, t, d, type = "sine", v = .12) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d);
}
function sfx(kind) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t = ac.currentTime;
    if (kind === "hit") { tone(220, t, .12, "square", .08); tone(110, t + .05, .2, "sawtooth", .06); }
    else if (kind === "ok") { tone(660, t, .1); tone(880, t + .07, .14); }
    else if (kind === "bad") tone(150, t, .22, "sawtooth", .07);
    else if (kind === "win") [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * .1, .25));
    else if (kind === "forge") { tone(1200, t, .05, "triangle", .08); tone(1800, t + .04, .08, "triangle", .05); }
    else tone(500, t, .04, "triangle", .04);
  } catch {}
}
// The device's own voice, used for sentences forged in fights (they're different every time).
// Picks the most natural-sounding German voice the device has.
// Voice names give away the gender on most devices (Windows, Android, iOS, Chrome)
const FEMALE_VOICE = /female|frau|katja|hedda|ingrid|seraphina|amala|leni|anna|marlene|vicki|petra|helena|sabine|zira|susan|hazel|sonia|libby|aria|jenny|ava|emma|samantha|karen|moira|tessa|serena|kate|google deutsch|google uk english female/i;
const MALE_VOICE = /male|mann|stefan|conrad|killian|jonas|florian|hans|markus|daniel|george|ryan|guy|davis|andrew|brian|christopher|eric|thomas|oliver|arthur|fred|alex|google uk english male/i;
const voiceGender = v => FEMALE_VOICE.test(v.name) ? "f" : MALE_VOICE.test(v.name) ? "m" : "";
// Picks the most natural-sounding voice for a language, preferring the speaker's gender
function bestVoice(lang = "de", gender = "") {
  const score = v => (/natural|neural|online|premium|enhanced|wavenet/i.test(v.name) ? 10 : 0) + (/google/i.test(v.name) ? 5 : 0) + (v.localService ? 0 : 2) + (/AT/.test(v.lang) ? 1 : 0)
    + (gender && voiceGender(v) === gender ? 30 : 0);
  return speechSynthesis.getVoices().filter(v => v.lang.replace("_", "-").toLowerCase().startsWith(lang)).sort((a, b) => score(b) - score(a))[0];
}
const bestGermanVoice = () => bestVoice("de");
// gender: "m" or "f" for story characters, so Rafa never gets a female device voice
function speak(text, force, english, gender = "") {
  if (!("speechSynthesis" in window) || (!meta.voice && !force)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[⏪]/g, "")), v = bestVoice(english ? "en" : "de", gender);
  u.lang = v ? v.lang : english ? "en-GB" : "de-DE"; if (v) u.voice = v; u.rate = .92;
  // no voice of the right gender on this device: shift the pitch instead
  if (gender && (!v || voiceGender(v) !== gender)) u.pitch = gender === "m" ? .7 : 1.15;
  speechSynthesis.speak(u);
}
const speakerGender = who => who === "hero" ? HEROES[run.hero].g : who === "huber" ? "f" : "m";

// ---------- music & story voice-over ----------
// Music: CC0 tracks in assets/music (see CREDITS.md), crossfaded per screen. Story lines: recorded with Piper (tools/make-voices.py),
// file name = djb2("<speaker>|<German text>"). The one-file version has no audio files and falls back to the device voice.
const HAS_AUDIO = !window.ASSET_DATA;
let wantTrack = null, current = null, master = null, voiceSrc = null;
const buffers = {};
const djb2 = str => { let x = 5381; for (let i = 0; i < str.length; i++) x = (x * 33 + str.charCodeAt(i)) >>> 0; return x.toString(16); };
function audioCtx() { return ac = ac || new (window.AudioContext || window.webkitAudioContext)(); }
function buffer(url) {
  return buffers[url] = buffers[url] || fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(b => audioCtx().decodeAudioData(b));
}
function music(name) {   // inn | battle | boss
  wantTrack = name;
  if (!HAS_AUDIO) return;
  if (!meta.music) return stopMusic();
  const ctx = audioCtx();
  if (ctx.state !== "running" || (current && current.name === name)) return;
  if (!master) { master = ctx.createGain(); master.gain.value = .32; master.connect(ctx.destination); }
  stopMusic(1.2);
  const g = ctx.createGain(), me = { name, gain: g, src: null };
  g.gain.value = 0; g.connect(master); current = me;
  buffer(`assets/music/${name}.mp3`).then(buf => {
    if (current !== me) return;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(g); src.start(); me.src = src;
    g.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.6);
  }).catch(() => {});
}
function stopMusic(fade = .4) {
  if (!current) return;
  const old = current, t = ac.currentTime; current = null;
  old.gain.gain.cancelScheduledValues(t); old.gain.gain.setValueAtTime(old.gain.gain.value, t); old.gain.gain.linearRampToValueAtTime(0, t + fade);
  setTimeout(() => { try { if (old.src) old.src.stop(); } catch {} }, fade * 1000 + 100);
}
function duck(on) { if (master) master.gain.setTargetAtTime(on ? .1 : .32, ac.currentTime, .25); }
function stopLine() { if (voiceSrc) { try { voiceSrc.stop(); } catch {} voiceSrc = null; } if ("speechSynthesis" in window) speechSynthesis.cancel(); duck(false); }
function playLine(who, text, english) {   // story voice-over, starts automatically
  stopLine();
  if (!meta.voice) return;
  if (!HAS_AUDIO) return speak(text, false, english, speakerGender(who));
  const speakerId = who === "hero" ? "hero-" + run.hero : who, ctx = audioCtx();
  buffer(`assets/voice/${djb2(speakerId + "|" + text)}.mp3`).then(buf => {
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination);
    src.onended = () => { if (voiceSrc === src) { voiceSrc = null; duck(false); } };
    voiceSrc = src; duck(true); src.start();
  }).catch(() => speak(text, false, english, speakerGender(who)));
}
// Browsers only allow sound after the first tap – start the wanted track then
document.addEventListener("pointerdown", () => { const ctx = audioCtx(); if (ctx.state !== "running") ctx.resume().then(() => { if (wantTrack) music(wantTrack); }); }, true);
const soundBtn = kind => kind === "music" ? `<button class="pill" data-act="music" title="Music">${meta.music ? "🎵" : "🔇"}</button>`
  : `<button class="pill" data-act="voice" title="Voices">${meta.voice ? "🗣️" : "🤐"}</button>`;
function toggleSound(kind) {
  meta[kind] = !meta[kind]; save();
  if (kind === "music") { if (meta.music) music(wantTrack || "inn"); else stopMusic(); }
  else if (!meta.voice) stopLine();
  document.querySelectorAll(`[data-act="${kind}"]`).forEach(b => { b.outerHTML = soundBtn(kind); });
  toast(kind === "music" ? (meta.music ? "🎵 Musik an" : "🔇 Musik aus") : (meta.voice ? "🗣️ Stimmen an" : "🤐 Stimmen aus"), 1200);
}

// ---------- saving ----------
const SAVE = "satzschmiede-run", META = "satzschmiede-meta";
const load = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
let meta = Object.assign({ runs: 0, wins: 0, sentences: 0, perfect: 0, unlocked: 1, cleared: [], music: true, voice: true, tutorial: false, collection: {}, slots: 12, mistakes: {} }, load(META) || {});
let run = load(SAVE), fight = null, view = "title";
if (run && !run.ladder) run = null;   // save from an older version
function save() {
  try {
    localStorage.setItem(META, JSON.stringify(meta));
    if (run) localStorage.setItem(SAVE, JSON.stringify(run)); else localStorage.removeItem(SAVE);
  } catch {}
}
if (run) { uidSeq = Math.max(1, ...run.deck.map(c => c.uid + 1)); run.act = run.act || 0; }
const has = r => run && run.relics.includes(r);

// ---------- Fehlerheft: every wrong form is remembered until you get it right again ----------
// keys: "conj|sehen|1" (du + sehen), "art|Hund|akk", "aux|gehen", "part|sehen"
// Irregular (strong) forms earn extra power: du siehst, er läuft, gesehen …
function regularStem(d) { return d.de.replace(/e?n$/, ""); }
function isStrongForm(d, p) {
  const st = regularStem(d), e = /[dt]$/.test(st) ? ["e", "est", "et", "en", "et", "en"] : ["e", "st", "t", "en", "t", "en"];
  return forms(d)[p] !== st + e[p];
}
function isStrongPart(d) {
  const st = regularStem(d), t = /[dt]$/.test(st) ? "et" : "t";
  return d.part !== "ge" + st + t && d.part !== st + t;
}
function stepKey(st, a) {
  if (st.kind === "conj") return `conj|${st.c.id}|${a.person}`;
  if (st.kind === "art") return `art|${st.c.id}|${st.cas}`;
  return `${st.kind}|${a.verb.id}`;
}
function noteMistake(key) { meta.mistakes[key] = Math.min(5, (meta.mistakes[key] || 0) + 1); }
function noteRight(key) { if (meta.mistakes[key] && --meta.mistakes[key] <= 0) delete meta.mistakes[key]; }
const mistakeCount = () => Object.keys(meta.mistakes).length;
// Pronouns you get wrong with the verbs at hand are dealt more often
function dealPronouns() {
  const verbs = [...fight.field.filter(Boolean), ...fight.hand].filter(c => CARDS[c.id].type === "verb").map(c => c.id);
  const weight = id => 1 + 2 * verbs.reduce((n, v) => n + (meta.mistakes[`conj|${v}|${CARDS[id].p}`] || 0), 0);
  const pool = [...PRONOUNS], out = [];
  while (out.length < (has("wuerfel") ? 3 : DEALT) && pool.length) {
    let r = Math.random() * pool.reduce((n, id) => n + weight(id), 0), i = 0;
    while ((r -= weight(pool[i])) > 0 && i < pool.length - 1) i++;
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}
// A quiz question for one Fehlerheft entry
function reviewQuestion(key) {
  const [kind, id, x] = key.split("|"), d = CARDS[id];
  if (!d) return null;
  if (kind === "conj") { const right = forms(d)[+x]; return { q: `<b>${PERSON[+x]}</b> + ${d.de} → ?`, right, opts: shuffle([right, ...shuffle([...new Set(forms(d))].filter(f => f !== right)).slice(0, 2)]) }; }
  if (kind === "art") return { q: L(`<b>${nounForm(d, x)}</b> im ${CASE_NAME[x]}`, `<b>${nounForm(d, x)}</b> in the ${CASE_NAME[x]}`), right: ART[x][d.g], opts: ARTICLES };
  if (kind === "aux") return { q: L(`<b>${d.de}</b>: Perfekt mit …?`, `<b>${d.de}</b>: Perfekt with …?`), right: d.aux, opts: ["haben", "sein"] };
  return { q: L(`Partizip II von <b>${d.de}</b>?`, `Past participle of <b>${d.de}</b>?`), right: d.part, opts: shuffle([d.part, ...fakeParts(d)]) };
}
// Camp option: redo up to 5 of your mistakes, +5 HP for each one you now get right
function showReview(keys = null, i = 0, healed = 0) {
  view = "review";
  keys = keys || Object.entries(meta.mistakes).sort((a, b) => b[1] - a[1]).map(([k]) => k).filter(reviewQuestion).slice(0, 5);
  if (i >= keys.length) {
    app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Fehlerheft</h2><p class="sub">❤️ +${healed} · ${L(`Noch ${mistakeCount()} Einträge im Heft.`, `${mistakeCount()} entries left in the notebook.`)}</p>
      <button class="btn hot" data-act="skip">${L("Weiter", "Continue")} ➜</button></main>`;
    return save();
  }
  const r = reviewQuestion(keys[i]);
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Fehlerheft</h2><p class="sub">${L("Diese Formen waren falsch. Jetzt richtig = +5 ❤️", "You got these wrong before. Right now = +5 ❤️")} · ${i + 1} / ${keys.length}</p>
    <div class="gate-task">${r.q}</div><div class="incant-opts">${r.opts.map(o => `<button class="opt">${o}</button>`).join("")}</div></main>`;
  app.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const good = b.textContent === r.right;
    if (good) { noteRight(keys[i]); run.hp = Math.min(run.maxHp, run.hp + 5); healed += 5; sfx("ok"); }
    else { sfx("bad"); toast(L(`Richtig ist: <b>${r.right}</b>`, `The right answer: <b>${r.right}</b>`), 1800); }
    b.classList.add(good ? "right" : "wrong");
    setTimeout(() => showReview(keys, i + 1, healed), good ? 500 : 1400);
  });
}

// ---------- word collection: grows across runs; each run you pack a bag from it ----------
const MAX_COPIES = 3, MAX_SLOTS = 20;
// Words of this ladder and all ladders below it (so A1 runs never get ⏪ Perfekt)
function allowedIds(lad) {
  const upto = LADDERS.slice(0, LADDERS.indexOf(lad) + 1);
  return new Set(upto.flatMap(l => [...l.start, ...l.pool, ...(l.starter || [])]).filter(deckable));
}
// The first time a ladder is played its starter words join the collection
function grantStarter(lad) {
  const counts = {};
  for (const id of [...lad.start, ...(lad.starter || [])].filter(deckable)) counts[id] = (counts[id] || 0) + 1;
  for (const [id, n] of Object.entries(counts)) meta.collection[id] = Math.max(meta.collection[id] || 0, n);
}
function collect(id) {
  const had = meta.collection[id] || 0;
  if (had < MAX_COPIES) meta.collection[id] = had + 1;
  save();
  if (!had) toast(L(`📚 Neu in deiner Sammlung: <b>${CARDS[id].de}</b>`, `📚 New in your collection: <b>${CARDS[id].de}</b>`), 1800);
}
// Every owned copy that may be packed for this ladder, e.g. ["sehen#0", "perf#0", "perf#1"]
function ownedCopies(lad) {
  const ok = allowedIds(lad), order = ["verb", "noun", "adv", "perf"];
  return Object.entries(meta.collection).filter(([id]) => ok.has(id))
    .sort(([a], [b]) => order.indexOf(CARDS[a].type) - order.indexOf(CARDS[b].type) || CARDS[a].de.localeCompare(CARDS[b].de))
    .flatMap(([id, n]) => Array.from({ length: n }, (_, k) => `${id}#${k}`));
}
// A sensible bag: the ladder's start words first, then about 40 % verbs
function recommendedBag(lad) {
  const owned = ownedCopies(lad), bag = [], isVerb = key => CARDS[key.split("#")[0]].type === "verb";
  const add = key => { if (bag.length < meta.slots && !bag.includes(key) && owned.includes(key)) bag.push(key); };
  const seen = {};
  for (const id of lad.start.filter(deckable)) { seen[id] = (seen[id] || 0); add(`${id}#${seen[id]++}`); }
  const rest = shuffle(owned.filter(k => !bag.includes(k)));
  for (const k of rest.filter(isVerb)) if (bag.filter(isVerb).length < Math.round(meta.slots * .4)) add(k);
  for (const k of rest) add(k);
  return bag;
}
const bagCheck = bag => {
  const types = bag.map(k => CARDS[k.split("#")[0]].type);
  if (types.filter(t => t === "verb").length < 3) return L("Pack mindestens 3 Verben ein.", "Pack at least 3 verbs.");
  if (!types.includes("noun")) return L("Pack auch Nomen ein.", "Pack some nouns too.");
  if (bag.length < 8) return L("Pack mindestens 8 Wörter ein.", "Pack at least 8 words.");
  return "";
};
function showPack() {
  music("inn");
  view = "pack";
  const lad = ladder(), owned = ownedCopies(lad);
  run.bag = run.bag || recommendedBag(lad);
  const bag = run.bag, problem = bagCheck(bag), T = TYPE_LABEL();
  const groups = ["verb", "noun", "adv", "perf"].map(t => {
    const keys = owned.filter(k => CARDS[k.split("#")[0]].type === t);
    if (!keys.length) return "";
    return `<h3 class="pack-h">${T[t]} <small>${keys.filter(k => bag.includes(k)).length} / ${keys.length}</small></h3>
      <div class="pack-grid">${keys.map(k => cardHtml({ id: k.split("#")[0], uid: k }, "mini" + (bag.includes(k) ? " packed" : ""))).join("")}</div>`;
  }).join("");
  app.innerHTML = `${topbar()}<main class="panel pack"><h2 class="fraktur">${L("Pack deine Tasche", "Pack your bag")}</h2>
    <p class="sub">${L("Wähle die Wörter für diesen Lauf. Neue Wörter, die du findest, bleiben für immer in deiner Sammlung.", "Choose the words for this run. New words you find stay in your collection forever.")}</p>
    <div class="bag-meter">${Array.from({ length: meta.slots }, (_, i) => `<i class="${i < bag.length ? "full" : ""}"></i>`).join("")}<b>${bag.length} / ${meta.slots}</b></div>
    <div class="row-btns"><button class="btn ghost" data-act="bag-auto">✨ ${L("Empfohlen", "Recommended")}</button><button class="btn ghost" data-act="bag-clear">✕ ${L("Leeren", "Clear")}</button></div>
    ${groups}
    <p class="status ${problem ? "" : "ok"}">${problem || L(`📚 Sammlung: ${owned.length} Wörter`, `📚 Collection: ${owned.length} words`)}</p>
    <button class="btn hot" data-act="bag-go" ${problem ? "disabled" : ""}>${L("Los geht's", "Let's go")} ➜</button></main>`;
  app.querySelectorAll(".pack-grid .card").forEach(b => b.onclick = () => {
    const k = b.dataset.uid, i = bag.indexOf(k);
    if (i >= 0) bag.splice(i, 1);
    else if (bag.length < meta.slots) bag.push(k);
    else return toast(L("Deine Tasche ist voll.", "Your bag is full."), 1400);
    sfx("tap"); showPack();
  });
}
function startClimb() {
  run.deck = run.bag.map(k => mk(k.split("#")[0]));
  run.packed = true; save();
  showMap();
}

// ---------- run setup ----------
let pickedHero = null;
function newRun(ladderId) {
  const lad = LADDERS.find(l => l.id === ladderId), hp = 50;
  run = {
    ladder: ladderId, hero: pickedHero, hp, maxHp: hp, gold: 60, floor: 0, act: 0, relics: [],
    deck: [], packed: false, map: LAYOUT.map(opts => shuffle(opts)), path: [],
    stats: { sentences: 0, perfect: 0, mistakes: 0, dmg: 0 }
  };
  grantStarter(lad);
  run.deck = recommendedBag(lad).map(k => mk(k.split("#")[0]));   // the tutorial plays with the recommended bag
  meta.runs++; save();
  setScene(ladderId);
  playStory(STORY[ladderId].intro, () => offerTutorial(lad));
}

// ---------- story scenes ----------
function fill(s) {
  const h = run && hero();
  return h ? s.replace(/\{name\}/g, h.name).replace(/\{fromEn\}/g, h.fromEn).replace(/\{from\}/g, h.from).replace(/\{storyEn\}/g, h.storyEn).replace(/\{story\}/g, h.story).replace(/\{magicEn\}/g, h.magicEn).replace(/\{magic\}/g, h.magic) : s;
}
function speaker(who) {
  if (who === "narr") return { name: "", pic: "" };
  if (who === "hero") return { name: hero().name, pic: heroArt(run.hero, "portrait") };
  if (NPCS[who]) return { name: NPCS[who].name, pic: art(`assets/npc/${who}.jpg`, NPCS[who].e, "portrait", clip(who)) };
  return { name: ENEMIES[who].name, pic: enemyArt(who, "portrait") };
}
// The moment the hero steps into "the hidden Vienna": a golden light burst, or assets/video/portal.mp4 if it exists
function portal() {
  const ov = document.createElement("div");
  ov.className = "portal";
  ov.innerHTML = `<div class="portal-burst"></div>` + (HAS_AUDIO ? `<video src="assets/video/portal${isWide() ? "-wide" : ""}.mp4" autoplay muted playsinline></video>` : "");
  document.body.append(ov); sfx("win");
  const v = ov.querySelector("video"), close = () => { ov.classList.add("out"); setTimeout(() => ov.remove(), 700); };
  if (v) {
    v.onplaying = () => ov.classList.add("has-video"); v.onended = close;
    // no wide clip yet: fall back to the portrait one, then to the light burst
    v.onerror = () => { if (v.src.includes("-wide")) { v.src = "assets/video/portal.mp4"; v.play().catch(() => {}); } else setTimeout(close, 1900); };
  }
  else setTimeout(close, 1900);
  ov.onclick = close;
}
function playStory(lines, done) {
  let i = 0;
  const portalAt = lines.findIndex(l => l[3] === "portal");
  const ov = document.createElement("div");
  ov.className = "story";
  const show = () => {
    if (i >= lines.length) { stopLine(); ov.remove(); return done(); }
    const [who, de, en, fx] = lines[i], s = speaker(who), english = fx === "en";
    ov.classList.toggle("modern", portalAt >= 0 && i < portalAt);   // the ordinary, modern city before the portal
    if (fx === "portal") portal();
    ov.innerHTML = `<div class="story-pic ${who === "hero" ? "left" : "right"}">${s.pic}</div>
      <div class="story-box ${who === "narr" ? "narr" : ""}">${s.name ? `<div class="story-name">${s.name}</div>` : ""}
        <div class="story-de">${fill(english ? en : de)} <button class="say" data-say aria-label="Anhören">🔊</button></div><div class="story-en">${english ? "🇩🇪 " : ""}${fill(english ? de : en)}</div>
        <div class="story-foot"><span>${i + 1} / ${lines.length}</span><span>${L("Tippen zum Weiterlesen", "Tap to continue")} ▸</span></div></div>
      <button class="story-skip" data-skip>${L("Überspringen", "Skip")} ⏭</button>`;
    playLine(who, fill(english ? en : de), english);
  };
  ov.onclick = e => {
    if (e.target.closest("[data-say]")) return playLine(lines[i][0], fill(lines[i][lines[i][3] === "en" ? 2 : 1]), lines[i][3] === "en");
    if (e.target.closest("[data-skip]")) i = lines.length; else i++;
    sfx("tap"); show();
  };
  document.body.append(ov);
  show();
}

// ---------- top bar ----------
function topbar() {
  return `<header class="top">
    <span class="hero-chip">${heroArt(run.hero, "mini-pic")}<b>${hero().name}</b></span>
    <span class="pill hp">❤️ ${run.hp}/${run.maxHp}</span>
    <span class="pill">💰 ${run.gold}</span>
    <span class="relics">${run.relics.map(r => `<button class="relic" data-act="relic" data-r="${r}" title="${esc(RELICS[r].name + ": " + RELICS[r].text)}">${RELICS[r].e}</button>`).join("")}</span>
    <span class="pill floor">${ladder().lvl}${actLabel()} · ${Math.min(run.floor + 1, LAYOUT.length)}/${LAYOUT.length}</span>
    <button class="pill" data-act="deck" title="Deck">🂠 ${run.deck.length}</button>${soundBtn("music")}${soundBtn("voice")}
  </header>`;
}
function toast(msg, ms = 2400) {
  const t = document.createElement("div");
  t.className = "toast"; t.innerHTML = msg;
  document.body.append(t); setTimeout(() => t.remove(), ms);
}
function showRelic(r) { toast(`${RELICS[r].e} <b>${RELICS[r].name}</b> – ${RELICS[r].text}`, 3200); }

// ---------- card rendering ----------
function cardWord(d) { return d.type === "noun" ? `<span class="art g-${d.g}">${d.g}</span> ${d.de}` : d.de; }
function cardHtml(c, extra = "") {
  const d = CARDS[c.id], pow = powOf(c), T = TYPE_LABEL();
  const slots = d.type === "verb" ? (d.slots.length ? d.slots.map(s => s === "dat" ? L("+ wem? (Dat)", "+ to whom? (Dat)") : L("+ was? (Akk)", "+ what? (Akk)")).join(" ") : L("ohne Objekt", "no object"))
    : d.type === "perf" ? L("ans Satzende", "goes last") : "";
  const power = d.type === "verb" ? `${FX[d.fx].icon} ${pow}` : `✦ ${pow}`;
  return `<button class="card t-${d.type}${d.type === "noun" ? " g-" + d.g : ""}${c.up ? " up" : ""} ${extra}" data-uid="${c.uid}">
    <span class="cost">${d.cost}</span><span class="ctype">${T[d.type]}${c.up ? " +" : ""}</span>
    <span class="cword">${cardWord(d)}</span><span class="cen">${esc(d.en)}</span>
    ${slots ? `<span class="cslots">${slots}</span>` : ""}<span class="cpow">${power}</span></button>`;
}

// ---------- title, hero choice, ladder tower ----------
function showTitle() {
  if (applyUpdate()) return;
  music("inn");
  view = "title"; fight = null; setScene("");
  app.innerHTML = `<main class="title"><div class="logo fraktur">Satzschmiede</div>
    <p class="tag">A deckbuilder where your <b>German sentences</b> are your weapons.<br><span class="en">Ein Deckbuilder, in dem deine deutschen Sätze deine Waffen sind.</span></p>
    ${window.ASSET_DATA ? `<div class="anvil">⚒️</div>` : `<div class="title-vid"><video data-src="assets/video/title.mp4"></video></div>`}
    <div class="col-btns">${run ? `<button class="btn hot" data-act="continue">Continue · Weiter (${LADDERS.find(l => l.id === run.ladder).lvl}${actLabel()}, ${run.floor + 1}/${LAYOUT.length})</button>` : ""}
      <button class="btn ${run ? "" : "hot"}" data-act="heroes">New adventure · Neues Abenteuer</button>
      <button class="btn ghost" data-act="help">How to play · Wie spielt man?</button></div>
    <div class="sound-row">${soundBtn("music")} ${soundBtn("voice")}</div>
    <div class="stats"><div><b>${meta.runs}</b>Runs</div><div><b>${meta.cleared.length}</b>Leitern</div><div><b>${meta.sentences}</b>Sätze</div><div><b>${meta.perfect}</b>perfekt</div><div><b>${mistakeCount()}</b>📖 Fehlerheft</div></div></main>`;
}
function showHeroes() {
  view = "heroes";
  app.innerHTML = `<main class="panel"><h2 class="fraktur">Wer bist du?</h2><p class="sub">Choose your hero · Wähle deine Heldin oder deinen Helden</p>
    <div class="heroes">${Object.entries(HEROES).map(([id, h]) => `<button class="hero-card" data-act="pick-hero" data-h="${id}">
      ${heroArt(id, "hero-pic")}<b class="hero-name">${h.name}</b><span class="hero-role">${h.role} aus ${h.from}<small class="en">${h.roleEn} from ${h.fromEn}</small></span>
      <span class="hero-bonus">✨ <b>${h.powerEn}</b> – ${h.powerTextEn}<small class="en">${h.power}: ${h.powerText}</small></span></button>`).join("")}</div>
    <button class="btn ghost" data-act="title">← Back</button></main>`;
}
function showTower() {
  view = "tower";
  setScene(""); document.body.style.setProperty("--bg", "var(--bg-tower)");
  const rows = [...LADDERS].reverse().map(l => {
    const i = LADDERS.indexOf(l), open = l.ready && i < meta.unlocked, done = meta.cleared.includes(l.id);
    return `<button class="rung ${open ? "open" : "locked"}${done ? " done" : ""}" data-act="ladder" data-l="${l.id}" ${open ? "" : "disabled"}>
      <span class="rung-lvl">${l.lvl}</span><span class="rung-txt"><b>${l.name}</b> <small class="en">${l.nameEn}</small><span>${l.place}</span>
      ${!l.ready ? `<em>Bald verfügbar · coming soon – ${l.teaser}</em>` : !open ? `<em>🔒 Besiege zuerst ${LADDERS[i - 1].lvl} · beat ${LADDERS[i - 1].lvl} first</em>` : ""}</span>
      <span class="rung-state">${done ? "✓" : open ? "▶" : "🔒"}</span></button>`;
  }).join("");
  app.innerHTML = `<main class="panel"><h2 class="fraktur">Die Sprachleiter</h2>
    <p class="sub">Six ladders from A1 to C2 · Sechs Leitern von A1 bis C2. ${heroArt(pickedHero, "mini-pic")} <b>${HEROES[pickedHero].name}</b></p>
    <div class="tower">${rows}</div><button class="btn ghost" data-act="heroes">← Held wechseln · change hero</button></main>`;
}

// ---------- map ----------
// Engraved ink icons for the map medallions (paths after Lucide, ISC licence). Painted ones in assets/map/<type>.jpg win if present.
const ICON = {
  fight: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  elite: '<path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="12" r="1.3"/><path d="m12.5 17-.5-1-.5 1h1z"/>',
  rest: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  shop: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2V7"/>',
  event: '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M11 8.5a2 2 0 0 1 3.9.6c0 1.3-2 1.9-2 1.9"/><path d="M12.9 13.5h.01"/>',
  gate: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.56v16.16a1 1 0 0 1-1.24.97L5 20V5.56a2 2 0 0 1 1.52-1.94l4-1A2 2 0 0 1 13 4.56Z"/>'
};
const iconSvg = n => `<svg class="ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`;
// Ink lines between the medallions: red for the route taken, dotted for the ways ahead
function drawMapLines() {
  const box = $(".map-rows"); if (!box) return;
  const r0 = box.getBoundingClientRect(), pos = el => { const r = el.querySelector(".medal").getBoundingClientRect(); return [r.left + r.width / 2 - r0.left, r.top + r.height / 2 - r0.top]; };
  const floors = run.map.map((_, f) => [...box.querySelectorAll(`.floor-row[data-f="${f}"] .node`)]);
  let lines = "";
  for (let f = 0; f < floors.length - 1; f++) {
    const a = floors[f], b = floors[f + 1];
    a.forEach((na, i) => b.forEach((nb, j) => {
      const near = Math.abs((a.length > 1 ? i / (a.length - 1) : .5) - (b.length > 1 ? j / (b.length - 1) : .5)) <= .5;
      const taken = run.path[f] === i && run.path[f + 1] === j, next = f === run.floor - 1 && run.path[f] === i;
      if ((f < run.floor - 1 && !taken) || (!near && !taken && !next)) return;
      const [x1, y1] = pos(na), [x2, y2] = pos(nb), my = (y1 + y2) / 2;
      lines += `<path class="${taken ? "taken" : next ? "next" : "ahead"}" d="M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}"/>`;
    }));
  }
  box.querySelector(".map-lines").innerHTML = lines;
}
function showMap() {
  music("inn");
  view = "map"; fight = null;
  if (run.floor >= LAYOUT.length) return ladderCleared();
  const lad = stage();
  setScene(run.ladder, lad.bg);
  const rows = run.map.map((opts, f) => {
    const chosen = run.path[f];
    const nodes = opts.map((n, i) => {
      const state = f < run.floor ? (chosen === i ? "done" : "skip") : f === run.floor ? "open" : "future";
      const icon = n === "boss" ? enemyArt(lad.boss, "medal-pic") : art(`assets/map/${n}.jpg`, iconSvg(n), "medal-pic");
      const nudge = ((f * 7 + i * 13) % 5 - 2) * 6;   // a little hand-drawn wobble
      return `<button class="node ${state} n-${n}" data-act="node" data-i="${i}" ${state === "open" ? "" : "disabled"} style="translate:${nudge}px 0">
        <span class="medal">${icon}${state === "done" ? `<span class="seal">✓</span>` : ""}</span><span class="nl">${L(NODE[n][1], NODE[n][2])}</span></button>`;
    }).join("");
    return `<div class="floor-row${f === run.floor ? " current" : ""}" data-f="${f}"><span class="fl">${f + 1}</span><div class="nodes">${nodes}</div></div>`;
  }).reverse().join("");
  app.innerHTML = `${topbar()}<main class="map"><h2 class="fraktur">${lad.mapTitle}</h2><p class="sub">${lad.mapSub}</p>
    <div class="map-scroll"><div class="map-rows"><svg class="map-lines"></svg>${rows}</div></div></main>`;
  requestAnimationFrame(() => { drawMapLines(); const cur = $(".floor-row.current"); if (cur) cur.scrollIntoView({ block: "center" }); });
}
function enterNode(i) {
  const n = run.map[run.floor][i], lad = stage();
  run.path[run.floor] = i; save();
  if (n === "fight") startFight(rnd(run.floor < 2 ? lad.easy : lad.enemies));
  else if (n === "elite") startFight(lad.elite);
  else if (n === "boss") { music("boss"); playStory(STORY[run.ladder][["boss", "boss2", "boss3"][run.act || 0]] || [], () => startFight(lad.boss)); }
  else if (n === "rest") showRest();
  else if (n === "shop") showShop();
  else if (n === "gate") showGate();
  else showEvent();
}
function nextFloor() { run.floor++; save(); showMap(); }

// ---------- combat ----------
function startFight(eid) {
  music(ENEMIES[eid].boss ? "boss" : "battle");
  const e = ENEMIES[eid], act = run.act || 0, scale = e.boss ? 0 : run.floor * 2 + act * 5;
  const hp = Math.round((e.hp + scale) * (!e.boss && !e.elite && act ? 1.3 : 1));
  fight = {
    eid, enemy: { hp, max: hp, block: 0, str: e.boss ? 0 : act, move: 0 },
    draw: shuffle(run.deck.filter(c => deckable(c.id)).map(c => ({ ...c }))), hand: [], discard: [], sentence: [],
    bar: [], field: Array(FIELD_SLOTS).fill(null), tapped: [], placed: false, placing: null,
    energy: 3, block: 0, turn: 0, eselUsed: false, busy: false, charge: powerNeed(), boost: 0, reveal: false, streak: 0, combos: [], recycled: false, tapped2: [], castThisTurn: false
  };
  view = "fight";
  startTurn();
}
// ---------- tutorial: Frau Huber coaches the very first fight ----------
// Each step glows one card or button; other taps are ignored until the step is done.
// info steps point at a part of the screen and wait for "OK"; card/act steps wait for that tap
const TUT = [
  { info: ".intent", de: "Oben siehst du, was das Monster als Nächstes macht: <b>Angriff 5</b>. Du bist zuerst dran!",
    en: "At the top you see what the monster does next: <b>Attack 5</b>. You go first!" },
  { info: ".energy-orbs", de: "Das ist deine <b>Energie ⚡</b>: 3 pro Zug. Die rote Zahl auf einer Karte ist ihr Preis. Verben und Nomen kosten 1, Pronomen und kurze Zeitwörter wie <b>heute</b> 0.",
    en: "This is your <b>energy ⚡</b>: 3 per turn. The red number on a card is its cost. Verbs and nouns cost 1, pronouns and short time words like <b>heute</b> 0." },
  { card: "sehen", at: "hand", de: "Verben kommen aufs <b>Feld</b> – ein Verb pro Zug, gratis. Tippe auf <b>sehen</b>.",
    en: "Verbs go on the <b>field</b> – one verb per turn, for free. Tap <b>sehen</b> (to see)." },
  { info: ".vtile", de: "Ein Verb bleibt <b>3 Züge</b> auf dem Feld (die Sanduhr-Punkte). Danach geht es zurück in deinen Stapel. Du hast 3 Plätze.",
    en: "A verb stays on the field for <b>3 turns</b> (the hourglass dots). Then it goes back to your deck. You have 3 slots." },
  { info: ".pron-bar", de: "Jeden Zug bekommst du <b>2 Pronomen</b>. Heute: <b>ich</b> und <b>du</b>. Achtung: Die Verbform hängt vom Pronomen ab!",
    en: "Each turn you're dealt <b>2 pronouns</b>. Today: <b>ich</b> and <b>du</b>. Careful: the verb form depends on the pronoun!" },
  { card: "ich", at: "bar", de: "Ein Satz beginnt mit dem Subjekt – wer? Tippe auf <b>ich</b>.", en: "A sentence starts with the subject – who? Tap <b>ich</b> (I)." },
  { card: "sehen", at: "field", de: "Jetzt das Verb vom Feld – es steht immer an <b>Position 2</b>.", en: "Now the verb from the field – it always goes in <b>position 2</b>." },
  { card: "Hund", at: "hand", de: "Was siehst du? „sehen“ braucht ein Objekt (+ was?). Tippe auf <b>Hund</b>.", en: "What do you see? “sehen” needs an object (+ what?). Tap <b>Hund</b> (dog)." },
  { act: "cast", de: "Der Satz steht – und kostet 2 ⚡ (siehst du die leuchtenden Kugeln?). Jetzt <b>schmieden</b>!",
    en: "The sentence is ready – and costs 2 ⚡ (see the glowing orbs?). Now <b>forge</b> it!" },
  { info: ".enemy .bar", de: "Treffer! Ein <b>perfekter Satz</b> (alles richtig) wirkt <b>×1,5</b>. Fehler machen ihn schwächer – aber du lernst die richtige Form.",
    en: "Hit! A <b>perfect sentence</b> (everything right) is <b>×1.5</b> stronger. Mistakes make it weaker – but you learn the right form." },
  { info: ".enemy .info", de: "Viele Monster haben eine <b>Schwäche</b> (×2), zum Beispiel Akkusativ oder Sätze mit Zeitwort. Tippe im Kampf auf ⓘ.",
    en: "Many monsters have a <b>weakness</b> (×2), e.g. Akkusativ or sentences starting with a time word. Tap ⓘ in a fight to see it." },
  { info: ".power-btn", de: "Und das ist deine <b>Spezialkraft</b>. Sie ist am Anfang bereit – danach laden <b>3 perfekte Sätze</b> sie wieder auf. Perfekte Sätze in Serie werden außerdem immer stärker 🔥.",
    en: "And this is your <b>special power</b>. It starts ready – after that, <b>3 perfect sentences</b> recharge it. Perfect sentences in a row also get stronger and stronger 🔥." },
  { act: "end", de: "Jedes Verb wirkt nur einmal pro Zug – <b>sehen</b> ruht jetzt. Übrige Energie verfällt. Beende deinen Zug.",
    en: "Each verb works only once per turn – <b>sehen</b> is resting now. Leftover energy is lost. End your turn." },
  { card: "laufen", at: "hand", de: "Autsch! Neuer Zug: neue Karten, neue Pronomen (<b>ich</b>, <b>wir</b>). <b>laufen</b> gibt 🛡️ Schild gegen Angriffe. Leg es aufs Feld.",
    en: "Ouch! New turn: new cards, new pronouns (<b>ich</b>, <b>wir</b>). <b>laufen</b> (to run) gives 🛡️ shield against attacks. Put it on the field." },
  { card: "heute", at: "hand", free: true, de: "Zwei Verben! Profi-Tipp: Beginne mit einem Zeitwort – das Verb bleibt an Position 2: <b>Heute sehe ich …</b> Besiege die Assel!",
    en: "Two verbs! Pro tip: start with a time word – the verb stays in position 2: <b>Heute sehe ich …</b> (Today I see …). Defeat the woodlouse!" }
];
// Before every run: a practice round with Frau Huber, or skip it
function offerTutorial(lad) {
  const ov = document.createElement("div");
  ov.className = "incant tut-offer";
  ov.innerHTML = `<div class="incant-in"><div class="gate-host">${art("assets/npc/huber.jpg", NPCS.huber.e, "event-pic")}
    <p class="sub"><b>${NPCS.huber.name}:</b> ${L("Möchten Sie eine Übungsrunde mit mir? Ich erkläre Ihnen alles.", "Would you like a practice round with me? I'll explain everything.")}</p></div>
    <div class="col-btns"><button class="btn ${meta.tutorial ? "" : "hot"}" data-tut="yes">🎓 ${L("Ja, zeig es mir", "Yes, show me")}</button>
    <button class="btn ${meta.tutorial ? "hot" : "ghost"}" data-tut="no">${L("Überspringen", "Skip")} ⏭</button></div></div>`;
  ov.onclick = e => {
    const b = e.target.closest("[data-tut]"); if (!b) return;
    ov.remove(); sfx("tap");
    if (b.dataset.tut === "yes") playStory(STORY.a1.tutorial, startTutorial); else showPack();
  };
  document.body.append(ov);
}
function startTutorial() {
  startFight("assel");
  // fixed hands and pronouns: turn 1 = sehen Hund Buch Wasser haben + ich/du, turn 2 = laufen heute Katze trinken finden + ich/wir
  const take = id => { const i = fight.draw.findIndex(c => c.id === id); return i < 0 ? mk(id) : fight.draw.splice(i, 1)[0]; };
  fight.draw.push(...fight.hand); fight.hand = [];
  const hand = ["sehen", "Hund", "Buch", "Wasser", "haben"].map(take), next = ["laufen", "heute", "Katze", "trinken", "finden"].map(take).reverse();
  fight.hand = hand; fight.draw = [...fight.draw, ...next];
  fight.bar = ["ich", "du"].map(id => mk(id)); fight.tutBars = [["ich", "wir"]];
  fight.tut = 0;
  renderFight();
}
const tutStep = () => fight && fight.tut != null ? TUT[fight.tut] : null;
function tutAdvance(kind, id) {
  const st = tutStep();
  if (st && !st.free && !st.info && (st.act === kind || (st.card === id && st.at === kind))) fight.tut++;
}
// While a guided step is active, only its target may be tapped
function tutBlocks(el, card) {
  const st = tutStep();
  if (!st || st.free) return false;
  if (st.info) return !(el && el.dataset.act === "tut-ok");
  if (st.card) { const c = card && !el && allCards().find(c => c.uid === +card.dataset.uid); return !(c && c.id === st.card && zoneOf(c) === st.at); }
  return !(el && el.dataset.act === st.act);
}
function tutHint(st) {
  if (!tutStep()) return "";
  if (st.kind === "conj") return L(`Mit <b>ich</b> endet das Verb auf <b>-e</b>: ich ${st.right}.`, `With <b>ich</b> (I) the verb ends in <b>-e</b>: ich ${st.right}.`);
  if (st.kind === "art" && st.cas === "akk") return L(`<b>${CARDS[st.c.id].de}</b> ist ${CARDS[st.c.id].g}. Akkusativ (wen/was?): der → <b>den</b>, die und das bleiben.`,
    `<b>${CARDS[st.c.id].de}</b> is ${CARDS[st.c.id].g}. Akkusativ (who/what?): der → <b>den</b>; die and das stay the same.`);
  return "";
}
function tutCoach() {
  const st = tutStep();
  if (!st) return "";
  return `<div class="coach">${art("assets/npc/huber.jpg", NPCS.huber.e, "coach-pic")}<div><b>${NPCS.huber.name}</b> <small>${fight.tut + 1} / ${TUT.length}</small><div>${L(st.de, st.en)}</div>
    ${st.info ? `<button class="btn hot tut-ok" data-act="tut-ok">OK ▸</button>` : ""}</div></div>`;
}
function tutGlow() {
  const st = tutStep();
  if (!st) return;
  if (st.info) { const t = app.querySelector(st.info); if (t) { t.classList.add("tut-glow"); requestAnimationFrame(() => t.scrollIntoView({ block: "nearest" })); } return; }
  const zone = { bar: fight.bar, field: fight.field.filter(Boolean), hand: fight.hand }[st.at];
  const el = st.card ? (() => { const c = zone.find(c => c.id === st.card && !fight.sentence.includes(c.uid)); return c && app.querySelector(`[data-uid="${c.uid}"]`); })()
    : app.querySelector(`[data-act="${st.act}"]`);
  if (el) el.classList.add("tut-glow");
}
function drawCards(n) {
  for (let i = 0; i < n; i++) {
    if (!fight.draw.length) { fight.draw = shuffle(fight.discard); fight.discard = []; }
    if (!fight.draw.length) return;
    fight.hand.push(fight.draw.pop());
  }
}
function startTurn() {
  fight.turn++;
  // verbs age: after VERB_TURNS turns on the field they go back to the discard pile
  fight.field.forEach((c, i) => { if (c && fight.turn > 1 && --c.turns <= 0) { fight.field[i] = null; fight.discard.push(c); toast(L(`⌛ <b>${CARDS[c.id].de}</b> verlässt das Feld.`, `⌛ <b>${CARDS[c.id].de}</b> leaves the field.`), 1600); } });
  fight.block = 0; fight.tapped = []; fight.tapped2 = []; fight.placed = 0; fight.placing = null; fight.recycled = false; fight.castThisTurn = false;
  if (fight.turn === 1 && has("heuriger")) fight.block = 6;
  fight.energy = 3 + (run.act || 0) + (fight.turn === 1 && has("kaffee") ? 1 : 0);   // +1 max energy for every act cleared
  drawCards(HAND + (has("duden") ? 1 : 0));
  fight.bar = (fight.tutBars && fight.tutBars.length ? fight.tutBars.shift() : dealPronouns()).map(id => mk(id));
  // never stuck: with no verb on the field and none in hand, fetch one from the piles
  const isVerb = c => CARDS[c.id].type === "verb";
  if (!fight.field.some(Boolean) && !fight.hand.some(isVerb)) {
    for (const pile of [fight.draw, fight.discard]) { const i = pile.findIndex(isVerb); if (i >= 0) { fight.hand.push(pile.splice(i, 1)[0]); break; } }
  }
  renderFight();
}
// A sentence can use pronouns from the bar, verbs from the field and words from the hand
const allCards = () => [...fight.bar, ...fight.field.filter(Boolean), ...fight.hand];
const zoneOf = c => fight.bar.includes(c) ? "bar" : fight.field.includes(c) ? "field" : "hand";
const sentenceCards = () => fight.sentence.map(uid => allCards().find(c => c.uid === uid));
const sentenceCost = () => sentenceCards().reduce((s, c) => s + CARDS[c.id].cost + (fight.tapped.includes(c.uid) ? 1 : 0), 0);
const canRecast = uid => (run.act || 0) >= 1 && fight.tapped.includes(uid) && !fight.tapped2.includes(uid);   // act 2+: a second cast for +1 ⚡
const intent = () => { const e = ENEMIES[fight.eid]; return e.moves[fight.enemy.move % e.moves.length]; };
function intentHtml() {
  const [k, v] = intent(), str = fight.enemy.str;
  if (k === "atk") return `⚔️ ${L("Angriff", "Attack")} ${v + str}`;
  if (k === "blk") return `🛡️ ${L("Verteidigung", "Defend")} ${v}`;
  if (k === "buff") return `💪 ${L("Wird stärker", "Powers up")} +${v}`;
  return `💚 ${L("Heilt sich", "Heals")} ${v}`;
}

// Is the sentence in the forge a valid German main clause? Returns { ok, msg, ... }
function needMsg(v) {
  if (!v.slots.length) return L(`„${v.de}“ braucht kein Objekt.`, `“${v.de}” takes no object.`);
  if (v.slots.length === 2) return L(`„${v.de}“ braucht zwei Objekte: <b>wem?</b> (Dativ) + <b>was?</b> (Akkusativ) – in dieser Reihenfolge.`,
    `“${v.de}” needs two objects: <b>to whom?</b> (Dativ) + <b>what?</b> (Akkusativ) – in that order.`);
  return v.slots[0] === "dat" ? L(`„${v.de}“ braucht ein Dativ-Objekt: <b>wem?</b>`, `“${v.de}” needs a Dativ object: <b>to whom?</b>`)
    : L(`„${v.de}“ braucht ein Akkusativ-Objekt: <b>wen oder was?</b>`, `“${v.de}” needs an Akkusativ object: <b>who or what?</b>`);
}
function analyze(cards) {
  if (!cards.length) return { msg: L("Tippe Karten in der richtigen Reihenfolge an, um einen Satz zu schmieden.", "Tap cards in the right order to forge a sentence.") };
  const d = cards.map(c => CARDS[c.id]), verbs = d.filter(x => x.type === "verb"), perfs = d.filter(x => x.type === "perf");
  if (perfs.length > 1) return { msg: L("Nur eine ⏪ Perfekt-Karte pro Satz.", "Only one ⏪ Perfekt card per sentence.") };
  const perf = perfs.length === 1;
  if (perf && d[d.length - 1].type !== "perf") return { msg: L("⏪ Perfekt gehört ans <b>Ende</b> – das Partizip steht am Satzende (… den Hund <b>gesehen</b>).", "⏪ Perfekt goes <b>last</b> – the participle sits at the end (… den Hund <b>gesehen</b>).") };
  if (!verbs.length) return { msg: L("Es fehlt noch ein Verb.", "You still need a verb.") };
  if (verbs.length > 1) return { msg: L("Nur <b>ein</b> Verb pro Satz.", "Only <b>one</b> verb per sentence.") };
  if (d[0].type === "verb") return { msg: L("Das Verb steht an <b>Position 2</b> – am Anfang wäre es eine Frage.", "The verb goes in <b>position 2</b> – at the start it would be a question.") };
  if (d[0].type === "perf") return { msg: L("⏪ Perfekt gehört ans Ende.", "⏪ Perfekt goes last.") };
  const inv = d[0].type === "adv", vi = 1, si = inv ? 2 : 0;
  if (!d[vi]) return { msg: inv ? L("Nach dem Zeitwort kommt sofort das <b>Verb</b>.", "After the time word comes the <b>verb</b>.") : L("Jetzt das <b>Verb</b> (Position 2).", "Now the <b>verb</b> (position 2).") };
  if (d[vi].type !== "verb") return { msg: inv ? L("Nach dem Zeitwort kommt sofort das Verb (Position 2).", "Right after the time word comes the verb (position 2).") : L("Das Verb muss an <b>Position 2</b> stehen.", "The verb must be in <b>position 2</b>.") };
  const s = d[si];
  if (!s || s.type === "perf") return { msg: L("Jetzt das <b>Subjekt</b>: Heute sehe <b>ich</b> …", "Now the <b>subject</b>: Heute sehe <b>ich</b> …") };
  if (s.type !== "subj" && s.type !== "noun") return { msg: inv ? L("Nach Zeitwort + Verb kommt das Subjekt: Heute sehe <b>ich</b> …", "After time word + verb comes the subject: Heute sehe <b>ich</b> …") : L("Der Satz beginnt mit dem <b>Subjekt</b> (wer?) oder einem Zeitwort.", "Start with the <b>subject</b> (who?) or a time word.") };
  const v = d[vi], objs = [];
  for (const c of cards.slice(si + 1)) {
    const x = CARDS[c.id];
    if (x.type === "subj") return { msg: L("Nur <b>ein</b> Subjekt pro Satz.", "Only <b>one</b> subject per sentence.") };
    if (x.type === "noun") objs.push(c);
  }
  if (objs.length < v.slots.length) return { msg: needMsg(v) };
  if (objs.length > v.slots.length) return { msg: v.slots.length ? L(`Zu viele Nomen – „${v.de}“ braucht ${v.slots.length === 1 ? "nur ein Objekt" : "zwei Objekte"}.`, `Too many nouns – “${v.de}” needs ${v.slots.length === 1 ? "only one object" : "two objects"}.`) : needMsg(v) };
  if (s.type === "noun" && !["person", "animal"].includes(s.kind)) return { msg: L(`🤨 ${cap(s.g)} ${s.de} kann nicht „${v.de}“ – das Subjekt sollte eine Person oder ein Tier sein.`, `🤨 ${cap(s.g)} ${s.de} can't “${v.de}” – the subject should be a person or an animal.`) };
  for (const [i, c] of objs.entries()) {
    const slot = v.slots[i], want = v.want && v.want[slot], x = CARDS[c.id];
    if (want && !want.includes(x.kind)) return { msg: L(`🤨 Das ergibt keinen Sinn: <b>${v.de}</b> + <b>${x.de}</b>${slot === "dat" ? " – Dativ heißt <b>wem?</b>, meist eine Person oder ein Tier." : "."}`,
      `🤨 That makes no sense: <b>${v.de}</b> + <b>${x.de}</b>${slot === "dat" ? " – Dativ means <b>to whom?</b>, usually a person or an animal." : "."}`) };
  }
  return { ok: true, msg: L("✓ Der Satz steht – jetzt schmieden!", "✓ Sentence ready – forge it!"), inv, perf, person: s.type === "subj" ? s.p : 2,
    subj: cards[si], verb: cards[vi], perfCard: perf ? cards[cards.length - 1] : null, objs: objs.map((c, i) => ({ c, cas: v.slots[i] })) };
}

function renderFight() {
  const e = ENEMIES[fight.eid], en = fight.enemy, cards = sentenceCards(), a = analyze(cards);
  if (!cards.length && !fight.field.some(Boolean)) a.msg = L("Lege zuerst ein Verb aus deiner Hand aufs Feld.", "First put a verb from your hand on the field.");
  if (fight.placing) a.msg = L("Das Feld ist voll – tippe auf ein Verb, um es auszutauschen.", "The field is full – tap a verb to swap it out.");
  const canCast = a.ok && sentenceCost() <= fight.energy && !fight.busy;
  app.innerHTML = `${topbar()}<main class="fight">
    <section class="enemy${e.boss ? " boss" : ""}${e.elite ? " elite" : ""}">
      <div class="intent">${intentHtml()}</div>
      <div class="foe" id="foe">${enemyArt(fight.eid, "foe-pic")}</div>
      <div class="foe-name">${e.name}</div>
      <div class="bar"><i style="width:${Math.max(0, en.hp / en.max * 100)}%"></i><span>${Math.max(0, en.hp)} / ${en.max}${en.block ? ` · 🛡️ ${en.block}` : ""}${en.str ? ` · 💪 +${en.str}` : ""}</span></div>
      ${e.weak ? `<div class="weak">${L("Schwäche", "Weakness")}: ${weakLabel(e.weak)} ×2${e.resist ? L(" · sonst nur halber Schaden", " · otherwise half damage") : ""}</div>` : ""}
      <button class="info" data-act="foeinfo" aria-label="About this enemy">ⓘ</button>
    </section>
    <section class="you"><span class="pill">🛡️ ${L("Schild", "Shield")} ${fight.block}</span>
      <button class="power-btn${fight.charge < powerNeed() ? " used" : ""}" data-act="power" ${fight.charge < powerNeed() || fight.busy ? "disabled" : ""}>${heroArt(run.hero, "power-pic")}<span>✨ ${L(hero().power, hero().powerEn)}<small>${fight.charge >= powerNeed() ? L("bereit!", "ready!") : L("lädt mit perfekten Sätzen", "charges with perfect sentences")}
        <span class="pw-pips">${Array.from({ length: powerNeed() }, (_, i) => `<i class="${i < fight.charge ? "on" : ""}"></i>`).join("")}</span></small></span></button>
      <span class="pill dim">${L("Stapel", "Draw")} ${fight.draw.length} · ${L("Ablage", "Discard")} ${fight.discard.length}</span></section>
    <section class="forge">
      <div class="slots">${cards.length ? cards.map(c => cardHtml(c, "mini")).join("") : `<span class="empty">${L("Deine Schmiede ist leer", "Your forge is empty")}</span>`}</div>
      <div class="status ${a.ok ? "ok" : ""}">${a.msg}${a.ok && sentenceCost() > fight.energy ? ` <b>${L("Nicht genug Energie.", "Not enough energy.")}</b>` : ""}</div>
      ${fight.streak ? `<div class="streak">🔥 ${L("Serie", "Streak")} ${fight.streak} · ${L("nächster perfekter Satz", "next perfect sentence")} ×${Math.min(2, 1.5 + .1 * fight.streak).toFixed(1)}</div>` : ""}
      <div class="energy-orbs" title="${L("Energie", "Energy")}">${Array.from({ length: Math.max(3, fight.energy) }, (_, i) => {
        const left = fight.energy - sentenceCost();
        return `<i class="${i < left ? "full" : i < fight.energy ? "spend" : "empty"}">⚡</i>`;
      }).join("")}<span>${fight.energy - sentenceCost()} / ${fight.energy} ${L("Energie", "energy")}</span></div>
      <div class="forge-btns"><button class="btn ghost" data-act="clear" ${cards.length ? "" : "disabled"}>✕ ${L("Leeren", "Clear")}</button>
        <button class="btn hot" data-act="cast" ${canCast ? "" : "disabled"}>🔨 ${L("Schmieden", "Forge")}</button></div>
    </section>
    <section class="field">
      <div class="pron-bar">${fight.bar.map(c => `<button class="pron${fight.sentence.includes(c.uid) ? " used" : ""}" data-uid="${c.uid}"><b>${CARDS[c.id].de}</b><small>${esc(CARDS[c.id].en)}</small></button>`).join("")}</div>
      <div class="verb-field">${fight.field.map(c => c ? verbTile(c) : `<div class="vslot">${L("Verb-Platz", "Verb slot")}</div>`).join("")}</div>
    </section>
    <section class="hand">${fight.hand.map(c => cardHtml(c, (fight.sentence.includes(c.uid) ? "used" : "") + (CARDS[c.id].type === "verb" ? " to-field" + (fight.placing === c.uid ? " placing" : "") : ""))
      .replace("data-uid", `data-field="${fight.placed >= placeLimit() ? (fight.recycled ? "–" : L("♻️ recyceln", "♻️ recycle")) : L("aufs Feld", "to field")}" data-uid`)).join("")}</section>
    <section class="actions"><button class="btn ghost" data-act="redraw" ${fight.energy - sentenceCost() >= 1 && !fight.busy ? "" : "disabled"}>↻ ${L("Neu ziehen", "Redraw")} (1⚡)</button>
      <button class="btn" data-act="end" ${fight.busy ? "disabled" : ""}>${L("Zug beenden", "End turn")} ⏭</button></section>
  </main>`;
  if (fight.tut != null && !fight.busy) { app.querySelector(".fight").insertAdjacentHTML("afterbegin", tutCoach()); tutGlow(); }
}
// A verb on the field: a compact tile with its power, object slots and the turns it has left
function verbTile(c) {
  const d = CARDS[c.id], rest = fight.tapped.includes(c.uid) && !canRecast(c.uid), again = canRecast(c.uid);
  const need = d.slots.length ? d.slots.map(s => s === "dat" ? L("+ wem?", "+ to whom?") : L("+ was?", "+ what?")).join(" ") : L("ohne Objekt", "no object");
  return `<button class="vtile${rest ? " tapped" : ""}${fight.sentence.includes(c.uid) ? " used" : ""}${fight.placing ? " swap" : ""}" data-uid="${c.uid}">
    <span class="cost">${d.cost}</span><b>${d.de}</b><span class="vt-en">${esc(d.en)} · ${need}</span>
    <span class="vt-pow">${FX[d.fx].icon} ${powOf(c)}</span>
    <span class="vt-charges" title="${L("Züge übrig", "turns left")}">⌛ ${Array.from({ length: VERB_TURNS }, (_, i) => `<i class="${i < c.turns ? "on" : ""}"></i>`).join("")}</span>
    ${rest ? `<span class="vt-rest">${L("ruht bis zum nächsten Zug", "resting until next turn")}</span>` : again ? `<span class="vt-rest again">${L("nochmal für +1 ⚡", "again for +1 ⚡")}</span>` : ""}</button>`;
}
function toggleCard(uid) {
  if (fight.busy) return;
  const c = allCards().find(c => c.uid === uid); if (!c) return;
  const zone = zoneOf(c), i = fight.sentence.indexOf(uid);
  if (zone === "hand" && CARDS[c.id].type === "verb") return playVerb(c);
  if (zone === "field" && fight.placing) return placeVerb(fight.hand.find(x => x.uid === fight.placing), fight.field.indexOf(c));
  if (i >= 0) fight.sentence.splice(i, 1);
  else {
    if (zone === "field" && fight.tapped.includes(uid) && !canRecast(uid)) return toast((run.act || 0) >= 1 ? L("Dieses Verb hast du in diesem Zug schon zweimal benutzt.", "You've already used this verb twice this turn.") : L("Dieses Verb hast du in diesem Zug schon benutzt.", "You've already used this verb this turn."), 1600);
    fight.sentence.push(uid); tutAdvance(zone, c.id);
  }
  sfx("tap"); renderFight();
}
// Verbs work like lands: one per turn goes from the hand onto the field (free) and stays for the whole fight
// The hero's special power: once per fight
function usePower() {
  if (fight.busy || fight.charge < powerNeed()) return;
  fight.charge = 0;
  const h = hero();
  if (run.hero === "rafa") fight.boost = 2;
  else if (run.hero === "mei") fight.reveal = true;
  else { run.hp = Math.min(run.maxHp, run.hp + 10); fight.block += 6; }
  sfx("win"); toast(`✨ <b>${L(h.power, h.powerEn)}</b> – ${L(h.powerText, h.powerTextEn)}`, 2200);
  tutAdvance("power"); renderFight();
}
function playVerb(c) {
  if (fight.placing === c.uid) { fight.placing = null; return renderFight(); }
  if (fight.placed >= placeLimit()) {
    // can't place it this turn: recycle it instead (discard + draw a new card), once per turn
    if (fight.recycled) return toast(L("Nur ein Verb pro Zug aufs Feld – und du hast schon recycelt.", "Only one verb per turn onto the field – and you've already recycled."), 1800);
    fight.recycled = true; fight.hand = fight.hand.filter(x => x !== c); fight.discard.push(c); drawCards(1);
    sfx("tap"); toast(L(`♻️ <b>${CARDS[c.id].de}</b> recycelt – neue Karte gezogen.`, `♻️ <b>${CARDS[c.id].de}</b> recycled – new card drawn.`), 1600);
    return renderFight();
  }
  const slot = fight.field.indexOf(null);
  if (slot < 0) { fight.placing = c.uid; sfx("tap"); return renderFight(); }   // field full: the next tap on a field verb swaps it
  placeVerb(c, slot);
}
function placeVerb(c, slot) {
  const old = fight.field[slot];
  if (old) { fight.discard.push(old); fight.sentence = fight.sentence.filter(u => u !== old.uid); }
  c.turns = VERB_TURNS;
  fight.field[slot] = c; fight.hand = fight.hand.filter(x => x !== c);
  fight.placed++; fight.placing = null;
  sfx("forge"); tutAdvance("hand", c.id); renderFight();
}

// ---------- casting: the incantation asks for verb forms and articles ----------
function fakeParts(d) {
  const stem = d.de.replace(/e?n$/, "");
  return [...new Set(["ge" + stem + "t", "ge" + stem + "en", d.de])].filter(x => x !== d.part).slice(0, 2);
}
function cast() {
  const cards = sentenceCards(), a = analyze(cards);
  if (!a.ok || sentenceCost() > fight.energy) return;
  const steps = [];
  for (const c of cards) {
    const d = CARDS[c.id];
    if (c === a.verb && !a.perf) {
      const right = forms(d)[a.person], others = shuffle([...new Set(forms(d))].filter(f => f !== right)).slice(0, 2);
      steps.push({ c, kind: "conj", right, opts: shuffle([right, ...others]), q: L(`Welche Form? <b>${PERSON[a.person]}</b> + ${d.de}`, `Which form? <b>${PERSON[a.person]}</b> + ${d.de}`) });
    } else if (c === a.verb) {
      const right = AUX[d.aux][a.person], other = AUX[d.aux === "haben" ? "sein" : "haben"][a.person];
      const third = AUX[d.aux].find(f => f !== right) || AUX[d.aux][0];
      steps.push({ c, kind: "aux", right, opts: shuffle([...new Set([right, other, third])]), q: L(`Perfekt: <b>haben</b> oder <b>sein</b>? (${PERSON[a.person]} + ${d.de})`, `Perfekt: <b>haben</b> or <b>sein</b>? (${PERSON[a.person]} + ${d.de})`) });
    } else if (c === a.perfCard) {
      const v = CARDS[a.verb.id];
      steps.push({ c, kind: "part", right: v.part, opts: shuffle([v.part, ...fakeParts(v)]), q: L(`Partizip II von <b>${v.de}</b>?`, `Past participle of <b>${v.de}</b>?`) });
    } else if (d.type === "noun") {
      const cas = c === a.subj ? "nom" : a.objs.find(o => o.c === c).cas;
      steps.push({ c, kind: "art", cas, right: ART[cas][d.g], opts: ARTICLES,
        q: L(`Welcher Artikel? <b>${nounForm(d, cas)}</b> als <b>${CASE_NAME[cas]}</b>`, `Which article? <b>${nounForm(d, cas)}</b> as <b>${CASE_NAME[cas]}</b>`) + (cas === "dat" ? L(" (wem?)", " (to whom?)") : cas === "akk" ? L(" (wen/was?)", " (who/what?)") : L(" (wer?)", " (who?)")) });
    }
  }
  fight.busy = true;
  tutAdvance("cast");
  incant(cards, a, steps, 0, []);
}
// Builds the sentence word by word: blanks for pending choices, the player's answers (right/wrong), or the correct forms (final)
function sentenceWords(cards, a, steps, answers, upto, final) {
  return cards.map((c, i) => {
    const d = CARDS[c.id], si = steps.findIndex(s => s.c === c), first = i === 0;
    const slot = (inner, cls) => `<span class="tok ${cls || ""}">${inner}</span>`;
    const pick = (fallback) => {
      if (final) return steps[si].right;
      if (si < upto) return `<span class="${answers[si] === steps[si].right ? "right" : "wrong"}">${answers[si]}</span>`;
      return `<span class="blank${si === upto ? "" : " dim"}">${fallback}</span>`;
    };
    if (d.type === "noun") {
      const cas = c === a.subj ? "nom" : a.objs.find(o => o.c === c).cas, art = pick("___");
      return slot(`${first && final ? cap(art) : art} ${nounForm(d, cas)}`, `case-${cas}`);
    }
    if (d.type === "verb") return slot(pick(a.perf ? "(haben/sein)" : `(${d.de})`), "verb");
    if (d.type === "perf") return slot(pick(`(${CARDS[a.verb.id].de} → ?)`), "verb");
    return slot(first ? cap(d.de) : d.de);
  }).join(" ") + ".";
}
function incant(cards, a, steps, i, answers) {
  let ov = $(".incant:not(.tut-offer)");
  if (!ov) { ov = document.createElement("div"); ov.className = "incant"; document.body.append(ov); }
  if (i >= steps.length) { ov.remove(); fight.reveal = false; return resolve(cards, a, steps, answers); }
  const st = steps[i];
  ov.innerHTML = `<div class="incant-in"><div class="incant-h">🔨 ${L("Beschwörung", "Incantation")} ${i + 1}/${steps.length}</div>
    <div class="incant-s">${sentenceWords(cards, a, steps, answers, i, false)}</div>
    <div class="incant-q">${st.q}${meta.mistakes[stepKey(st, a)] ? ` <span class="fh-tag">📖 ${L("im Fehlerheft", "in your notebook")}</span>` : ""}</div>${tutHint(st) ? `<div class="coach small">${art("assets/npc/huber.jpg", NPCS.huber.e, "coach-pic")}<div>${tutHint(st)}</div></div>` : ""}
    <div class="incant-opts">${st.opts.map(o => `<button class="opt${fight.reveal && o === st.right ? " reveal" : ""}">${o}</button>`).join("")}</div></div>`;
  ov.querySelectorAll(".opt").forEach(b => b.onclick = () => { sfx("forge"); incant(cards, a, steps, i + 1, [...answers, b.textContent]); });
}
const plainSentence = html => html.replace(/<[^>]+>/g, "");
function resolve(cards, a, steps, answers) {
  const e = ENEMIES[fight.eid], en = fight.enemy, v = CARDS[a.verb.id];
  const notes = [];
  let mistakes = 0;
  steps.forEach((st, i) => (answers[i] === st.right ? noteRight : noteMistake)(stepKey(st, a)));
  const ok = steps.map((st, i) => {
    if (answers[i] === st.right) return true;
    if (has("esel") && !fight.eselUsed) { fight.eselUsed = true; notes.push(L(`🫏 Eselsbrücke rettet dich: richtig ist <b>${st.right}</b>.`, `🫏 Eselsbrücke saves you: the right answer is <b>${st.right}</b>.`)); return true; }
    mistakes++;
    const d = CARDS[st.c.id];
    if (st.kind === "conj") notes.push(`${PERSON[a.person]} + ${d.de} → <b>${st.right}</b>`);
    else if (st.kind === "aux") notes.push(L(`${v.de} bildet das Perfekt mit <b>${v.aux}</b> → ${PERSON[a.person]} <b>${st.right}</b>`, `${v.de} forms the Perfekt with <b>${v.aux}</b> → ${PERSON[a.person]} <b>${st.right}</b>`) + (v.aux === "sein" ? L(" (Bewegung)", " (movement)") : ""));
    else if (st.kind === "part") notes.push(`${v.de} → <b>${st.right}</b>`);
    else notes.push(L(`${d.de} im ${CASE_NAME[st.cas]} → <b>${st.right} ${nounForm(d, st.cas)}</b>`, `${d.de} in the ${CASE_NAME[st.cas]} → <b>${st.right} ${nounForm(d, st.cas)}</b>`));
    return false;
  });
  const okOf = c => { const i = steps.findIndex(s => s.c === c); return i < 0 || ok[i]; };
  const perfect = mistakes === 0;
  let power = cards.reduce((s, c) => s + (okOf(c) ? powOf(c) : 0), 0);
  const perfOk = a.perf && okOf(a.verb) && okOf(a.perfCard);
  const bonus = [], strong = has("grammatik") ? 4 : 2;   // [points, label]
  if (!a.perf && okOf(a.verb) && isStrongForm(v, a.person)) bonus.push([strong, `${PERSON[a.person]} ${forms(v)[a.person]}`]);
  if (perfOk && isStrongPart(v)) bonus.push([strong, v.part]);
  for (const o of a.objs) if (o.cas === "dat" && okOf(o.c)) bonus.push([2 + (has("dativamulett") ? 3 : 0), "Dativ"]);
  const combo = `${a.person}|${a.verb.id}`;
  if (okOf(a.verb) && !fight.combos.includes(combo)) { fight.combos.push(combo); bonus.push([2, L("neue Kombi", "new combo")]); }
  if (has("fiaker") && !fight.castThisTurn) bonus.push([3, "Fiaker"]);
  const bonusPts = bonus.reduce((t, b) => t + b[0], 0);
  power += bonusPts;
  // perfect streak: ×1.5, then ×1.6, ×1.7 … (max ×2) for perfect sentences in a row; a mistake resets it
  const streakMult = perfect ? Math.min(2, 1.5 + .1 * fight.streak) : 1;
  if (perfect) { power = Math.ceil(power * streakMult) + (has("sachertorte") ? 3 : 0); fight.streak++; fight.charge = Math.min(powerNeed(), fight.charge + 1); }
  else fight.streak = has("opernkarte") ? Math.max(0, fight.streak - 1) : 0;
  if (perfOk && has("meldezettel")) power += 4;
  if (fight.boost) { power = Math.ceil(power * 1.5); fight.boost--; notes.push(L("🍳 Doppelte Portion: +50 %!", "🍳 Double helping: +50 %!")); }
  if (v.fx === "heal" && has("schnitzel")) power += 4;
  const flags = { dat: a.objs.some(o => o.cas === "dat" && okOf(o.c)), akk: a.objs.some(o => o.cas === "akk" && okOf(o.c)), inv: a.inv, perfect, long: cards.filter(c => CARDS[c.id].type !== "perf").length >= 5, perf: perfOk };
  let mult = "";
  if (v.fx === "atk" && e.weak) {
    if (flags[e.weak]) { power *= 2; mult = L(" · Schwäche getroffen ×2!", " · weakness hit ×2!"); }
    else if (e.resist) { power = Math.floor(power / 2); mult = L(` · ${e.name} widersteht (½)`, ` · ${e.name} resists (½)`); }
  }
  // pay & discard
  fight.energy -= sentenceCost();
  const used = cards.filter(c => fight.hand.includes(c));
  fight.hand = fight.hand.filter(c => !used.includes(c));
  fight.discard.push(...used); fight.sentence = [];
  if (fight.field.includes(a.verb)) (fight.tapped.includes(a.verb.uid) ? fight.tapped2 : fight.tapped).push(a.verb.uid);
  run.stats.sentences++; meta.sentences++;
  if (perfect) { run.stats.perfect++; meta.perfect++; }
  run.stats.mistakes += mistakes;
  // effect
  let line, dmg = 0;
  if (v.fx === "atk") {
    const absorbed = Math.min(en.block, power); en.block -= absorbed;
    dmg = power - absorbed; en.hp -= dmg; run.stats.dmg += dmg;
    line = `⚔️ <b>${dmg}</b> ${L("Schaden", "damage")}${absorbed ? ` (🛡️ ${absorbed})` : ""}${mult}`;
  } else if (v.fx === "blk") { fight.block += power; line = `🛡️ +<b>${power}</b> ${L("Schild", "shield")}`; }
  else { const before = run.hp; run.hp = Math.min(run.maxHp, run.hp + power); line = `❤️ +<b>${run.hp - before}</b> ${L("Leben", "HP")}`; }
  if (e.leech && mistakes) { en.hp = Math.min(en.max, en.hp + 4 * mistakes); notes.push(L(`${e.e} ${e.name} lebt von deinen Fehlern: +${4 * mistakes}.`, `${e.e} ${e.name} feeds on your mistakes: +${4 * mistakes} HP.`)); }
  if (bonus.length) line += ` <span class="r-bonus">💪 +${bonusPts}: ${bonus.map(b => b[1]).join(", ")}</span>`;
  if (flags.long && has("atem")) { fight.block += 5; line += ` · 🌬️ +5 ${L("Schild", "shield")}`; }
  if (a.inv && has("taschenuhr")) { drawCards(1); line += ` · ⏱️ +1 ${L("Karte", "card")}`; }
  fight.castThisTurn = true;
  const html = sentenceWords(cards, a, steps, answers, steps.length, true);
  fight.busy = false;
  renderFight();
  speak(plainSentence(html));
  sfx(perfect ? "ok" : "bad");
  if (v.fx === "atk") { sfx("hit"); const f = $("#foe"); if (f) { f.classList.add("hit"); floatNum(f, dmg); } }
  showResult(html, perfect, a.perf, line, notes, streakMult);
  save();
  if (en.hp <= 0) setTimeout(winFight, 900);
}
function floatNum(el, n) {
  const r = el.getBoundingClientRect(), f = document.createElement("div");
  f.className = "float"; f.textContent = "-" + n;
  f.style.left = r.left + r.width / 2 + "px"; f.style.top = r.top + "px";
  document.body.append(f); setTimeout(() => f.remove(), 1000);
}
function showResult(html, perfect, perf, line, notes, mult = 1.5) {
  const old = $(".result"); if (old) old.remove();
  const r = document.createElement("div");
  r.className = "result " + (perfect ? "perfect" : "flawed");
  r.innerHTML = `<div class="r-h">${perfect ? L(`✨ Perfekter Satz! ×${String(mult).replace(".", ",")}`, `✨ Perfect sentence! ×${mult}`) + (fight && fight.streak > 1 ? ` · 🔥 ${L("Serie", "streak")} ${fight.streak}` : "") : L("⚒️ Satz mit Fehlern", "⚒️ Sentence with mistakes")}${perf ? " · ⏪ Perfekt" : ""}</div>
    <div class="r-s">${html} <button class="say" aria-label="Anhören">🔊</button></div>
    <div class="r-fx">${line}</div>${notes.length ? `<ul class="r-n">${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}
    <div class="r-legend"><span class="case-nom">Nominativ</span> <span class="case-akk">Akkusativ</span> <span class="case-dat">Dativ</span></div>`;
  r.onclick = e => { if (e.target.closest(".say")) speak(plainSentence(html), true); else r.remove(); };
  document.body.append(r);
  setTimeout(() => r.classList.add("fade"), notes.length ? 5500 : 3200);
  setTimeout(() => r.remove(), notes.length ? 6200 : 3900);
}
function redraw() {
  if (fight.busy || fight.energy - sentenceCost() < 1) return;
  fight.energy--; fight.sentence = []; fight.placing = null;
  const n = fight.hand.length;
  fight.discard.push(...fight.hand); fight.hand = [];
  drawCards(n); renderFight();
}
function endTurn() {
  if (fight.busy) return;
  tutAdvance("end");
  fight.busy = true; fight.sentence = [];
  fight.discard.push(...fight.hand); fight.hand = [];
  renderFight();
  setTimeout(enemyTurn, 450);
}
function enemyTurn() {
  const en = fight.enemy, [k, v] = intent(), e = ENEMIES[fight.eid];
  en.block = 0;
  if (k === "atk") {
    const dmg = v + en.str, absorbed = Math.min(fight.block, dmg);
    fight.block -= absorbed; run.hp -= dmg - absorbed;
    sfx("hit"); document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 350);
    toast(`${e.e} ${e.name}: <b>${dmg - absorbed}</b> ${L("Schaden", "damage")}${absorbed ? ` (🛡️ ${absorbed})` : ""}`, 1600);
  } else if (k === "blk") en.block += v;
  else if (k === "buff") en.str += v;
  else en.hp = Math.min(en.max, en.hp + v);
  en.move++;
  fight.busy = false;
  if (run.hp <= 0) return gameOver();
  save();
  startTurn();
}
function winFight() {
  const e = ENEMIES[fight.eid];
  if (has("brezel")) run.hp = Math.min(run.maxHp, run.hp + 4);
  const gold = e.boss ? 0 : e.elite ? between(32, 44) : between(11, 19);
  run.gold += gold;
  sfx("win");
  if (e.boss && (run.act || 0) < ACTS - 1 && (ladder().acts || [])[(run.act || 0) + 1]) return actCleared();
  if (e.boss) { run.floor++; save(); return ladderCleared(); }
  if (fight.tut != null) { meta.tutorial = true; save(); return playStory(STORY.a1.tutorialEnd, showPack); }
  const relic = e.elite ? rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r))) : null;
  if (relic) gainRelic(relic);
  save();
  showReward(gold, relic);
}
// Between acts: a story scene, then heal, gold and a relic before the next map
function actCleared() {
  const done = (run.act || 0) + 1, heal = Math.round((run.maxHp - run.hp) * .6), relic = rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r)));
  run.act = done; run.floor = 0; run.path = []; run.map = LAYOUT.map(opts => shuffle(opts)); run.shop = null; run.gate = null; run.enc = null;
  run.hp += heal; run.gold += 30; if (relic) gainRelic(relic);
  save();
  playStory(STORY[run.ladder][`act${done}End`] || [], () => {
    music("inn"); view = "act";
    app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">${L(`Akt ${done} geschafft!`, `Act ${done} cleared!`)}</h2>
      <p class="sub">⚡ +1 ${L("max. Energie", "max energy")} · ❤️ +${heal} · 💰 +30${relic ? ` · ${RELICS[relic].e} <b>${RELICS[relic].name}</b> – ${RELICS[relic].text}` : ""}</p>
      <p>${L(`Weiter geht's: <b>${stage().name}</b>`, `Next up: <b>${stage().name}</b>`)}</p>
      <button class="btn hot" data-act="continue">${L("Weiter", "Continue")} ➜</button></main>`;
  });
}
function gainRelic(r) { run.relics.push(r); if (r === "lederhose") { run.maxHp += 10; run.hp += 10; } }

// ---------- after-fight reward ----------
function showReward(gold, relic) {
  music("inn");
  view = "reward";
  const picks = sample(rewardPool(), 3).map(id => mk(id));
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Sieg!</h2>
    <p class="sub">💰 +${gold} Gold${relic ? ` · ${L("Relikt", "Relic")}: ${RELICS[relic].e} <b>${RELICS[relic].name}</b> – ${RELICS[relic].text}` : ""}</p>
    <p>${L("Wähle ein neues Wort für dein Deck:", "Choose a new word for your deck:")}</p>
    <div class="choice">${picks.map(c => cardHtml(c)).join("")}</div>
    <button class="btn ghost" data-act="skip">${L("Überspringen", "Skip")}</button></main>`;
  app.querySelectorAll(".choice .card").forEach(b => b.onclick = () => { const c = picks.find(c => c.uid === +b.dataset.uid); run.deck.push(c); collect(c.id); sfx("ok"); nextFloor(); });
}

// ---------- rest site ----------
function showRest() {
  view = "rest";
  const heal = Math.round(run.maxHp * .3);
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Lagerfeuer</h2><div class="campfire">🔥</div>
    <div class="row-btns"><button class="btn hot" data-act="rest-heal">😴 ${L("Ausruhen", "Rest")} (+${heal} ❤️)</button>
    <button class="btn" data-act="rest-up">⚒️ ${L("Ein Wort schmieden (+2 Kraft)", "Upgrade a word (+2 power)")}</button>
    <button class="btn" data-act="rest-review" ${mistakeCount() ? "" : "disabled"}>📖 ${mistakeCount() ? L(`Fehlerheft üben (${mistakeCount()}) – +5 ❤️ pro richtige Antwort`, `Practise your mistakes (${mistakeCount()}) – +5 ❤️ per right answer`) : L("Fehlerheft leer – stark!", "No mistakes to practise – great!")}</button></div></main>`;
}
function pickFromDeck(title, filter, onPick) {
  view = "pick";
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">${title}</h2>
    <div class="choice wrap">${run.deck.filter(filter).map(c => cardHtml(c)).join("")}</div><button class="btn ghost" data-act="back">${L("Zurück", "Back")}</button></main>`;
  app.querySelectorAll(".choice .card").forEach(b => b.onclick = () => onPick(run.deck.find(c => c.uid === +b.dataset.uid)));
}

// ---------- shop ----------
// Prices after haggling: solved → 30 % off, wrong answer → 10 % more
const shopPrice = base => Math.round(base * (run.shop.mult || 1));
function showShop(haggling) {
  view = "shop";
  if (!run.shop || run.shop.floor !== run.floor) {
    const relic = rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r)));
    run.shop = { floor: run.floor, cards: sample(rewardPool(), 4).map(id => ({ ...mk(id), price: between(35, 60) })), relic, relicPrice: 150, removed: false, mult: 1, haggled: false };
  }
  const s = run.shop, rm = shopPrice(60);
  const mood = s.mult < 1 ? L("„Na gut, weil Sie so höflich sind: 30 % billiger!“", "“Alright, because you're so polite: 30 % off!”")
    : s.mult > 1 ? L("„Also bitte! Jetzt kostet alles mehr.“", "“Excuse me! Now everything costs more.”") : L("„Grüß Gott! Was darf's sein?“", "“Grüß Gott! What can I get you?”");
  let haggle = "";
  if (haggling && !s.haggled) {
    const [q, opts] = rnd(ladder().haggle);
    haggle = `<div class="haggle"><p class="riddle">${q}</p><div class="row-btns">${shuffle(opts).map(o => `<button class="btn opt-h" data-ok="${o === opts[0] ? 1 : 0}">${o}</button>`).join("")}</div></div>`;
  }
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Wotrubas Greißlerei</h2>
    <div class="gate-host">${art("assets/npc/wotruba.jpg", NPCS.wotruba.e, "event-pic", clip("wotruba"))}<p class="sub"><b>Herr Wotruba:</b> ${mood}</p></div>
    ${s.haggled ? "" : haggle || `<button class="btn" data-act="haggle">🗣️ ${L("Feilschen – löse ein Rätsel für 30 % Rabatt", "Haggle – solve a riddle for 30 % off")}</button>`}
    <div class="choice wrap">${s.cards.map(c => `<div class="ware">${cardHtml(c, c.sold ? "used" : "")}<span class="price">${c.sold ? L("verkauft", "sold") : "💰 " + shopPrice(c.price)}</span></div>`).join("")}</div>
    <div class="row-btns">
      ${s.relic ? `<button class="btn" data-act="buy-relic" ${run.gold >= shopPrice(s.relicPrice) ? "" : "disabled"}>${RELICS[s.relic].e} ${RELICS[s.relic].name} – 💰 ${shopPrice(s.relicPrice)}<small>${RELICS[s.relic].text}</small></button>` : ""}
      <button class="btn" data-act="buy-remove" ${run.gold >= rm && !s.removed ? "" : "disabled"}>🗑️ ${L("Ein Wort entfernen", "Remove a word")} – 💰 ${rm}</button>
    </div><button class="btn hot" data-act="leave">${L("Weiter", "Continue")} ➜</button></main>`;
  app.querySelectorAll(".opt-h").forEach(b => b.onclick = () => {
    const ok = b.dataset.ok === "1";
    s.haggled = true; s.mult = ok ? .7 : 1.1; sfx(ok ? "win" : "bad"); save();
    toast(ok ? L("✓ Gut gefeilscht! Alles 30 % billiger.", "✓ Well haggled! Everything 30 % off.") : L("✗ Herr Wotruba ist beleidigt: +10 %.", "✗ Herr Wotruba is offended: +10 %."), 2600);
    showShop();
  });
  app.querySelectorAll(".ware .card").forEach(b => b.onclick = () => {
    const c = s.cards.find(x => x.uid === +b.dataset.uid), price = shopPrice(c.price);
    if (c.sold || run.gold < price) return toast(L("Nicht genug Gold.", "Not enough gold."));
    run.gold -= price; c.sold = true; run.deck.push(mk(c.id)); collect(c.id); sfx("ok"); save(); showShop();
  });
}

// ---------- trials: mandatory mini-games, hosted by Frau Huber ----------
const pickBy = (seed, list) => list[Math.floor(seed * list.length) % list.length];
function shuffled(list) { let o = shuffle(list); for (let n = 0; n < 6 && o.join() === list.join(); n++) o = shuffle(list); return o; }
let gateState = null;
function showGate() {
  view = "gate";
  if (!run.gate || run.gate.floor !== run.floor) {
    const types = ["puzzle", "sort"].concat("speechSynthesis" in window || HAS_AUDIO ? ["listen"] : []);
    run.gate = { floor: run.floor, type: rnd(types), seed: Math.random(), done: false };
    gateState = null; save();
  }
  if (run.gate.done) return gateReward();
  ({ puzzle: gatePuzzle, sort: gateSort, listen: gateListen })[run.gate.type]();
}
function gateFrame(title, task, body) {
  app.innerHTML = `${topbar()}<main class="panel gate"><h2 class="fraktur">${L("Prüfung", "Trial")}: ${title}</h2>
    <div class="gate-host">${art("assets/npc/huber.jpg", NPCS.huber.e, "event-pic")}<p class="sub"><b>Frau Huber:</b> „${L("Bevor Sie weitergehen: Zeigen Sie mir, was Sie gelernt haben!", "Before you go on: show me what you've learned!")}“</p></div>
    <p class="gate-task">${task}</p>${body}<p class="sub small">${L("Jeder Fehler kostet 3 ❤️ – aufgeben gilt nicht.", "Each mistake costs 3 ❤️ – no skipping.")}</p></main>`;
}
function gateMiss(msg) {
  run.hp = Math.max(1, run.hp - 3); run.stats.mistakes++;
  sfx("bad"); document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 350);
  toast(`✗ ${msg} −3 ❤️`, 2200); save();
}
function gateWin() { run.gate.done = true; sfx("win"); save(); setTimeout(gateReward, 700); }
function gateReward() {
  view = "gate";
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">${L("Bestanden!", "Passed!")}</h2>${art("assets/npc/huber.jpg", NPCS.huber.e, "event-pic")}
    <p class="sub"><b>Frau Huber:</b> „${L("Sehr gut! Nehmen Sie eine Belohnung.", "Very good! Take a reward.")}“</p>
    <div class="row-btns"><button class="btn hot" data-act="gate-up">⚒️ ${L("Ein Wort schmieden (+2 Kraft)", "Upgrade a word (+2 power)")}</button>
    <button class="btn" data-act="gate-gold">💰 +30 Gold</button></div></main>`;
}
// 1) Satz-Puzzle: rebuild a sentence from shuffled words
function gatePuzzle() {
  const target = pickBy(run.gate.seed, stage().puzzles), punct = target.slice(-1), words = target.slice(0, -1).split(" ");
  gateState = gateState || { order: shuffled(words.map((w, i) => i)), placed: [] };
  const g = gateState, left = g.order.filter(i => !g.placed.includes(i));
  gateFrame("Satz-Puzzle", L("Bring die Wörter in die richtige Reihenfolge.", "Put the words in the right order."),
    `<div class="gate-line">${g.placed.map(i => `<button class="chip-w placed" data-i="${i}">${words[i]}</button>`).join("")}<span class="punct">${punct}</span></div>
     <div class="gate-chips">${left.map(i => `<button class="chip-w" data-i="${i}">${words[i]}</button>`).join("")}</div>`);
  app.querySelectorAll(".chip-w").forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    if (b.classList.contains("placed")) g.placed = g.placed.filter(x => x !== i); else g.placed.push(i);
    sfx("tap");
    if (g.placed.length === words.length) {
      if (g.placed.map(x => words[x]).join(" ") === words.join(" ")) { speak(target, true); return gateWin(); }
      gateMiss(L("Noch nicht ganz.", "Not quite.")); g.placed = [];
    }
    gatePuzzle();
  });
}
// 2) Artikel-Sortierer: der / die / das
function gateSort() {
  if (!gateState) {
    const nouns = [...new Set(ladder().start.concat(ladder().pool))].filter(id => CARDS[id] && CARDS[id].type === "noun");
    gateState = { nouns: sample(nouns, 6 + 2 * (run.act || 0)), done: {}, sel: null };
  }
  const g = gateState, open = g.nouns.filter(id => !g.done[id]);
  const bin = a => `<button class="bin g-${a}" data-a="${a}"><b>${a}</b>${g.nouns.filter(id => g.done[id] && CARDS[id].g === a).map(id => `<span>${CARDS[id].de}</span>`).join("")}</button>`;
  gateFrame("Artikel-Sortierer", L("Tippe ein Wort an, dann den richtigen Artikel.", "Tap a word, then the right article."),
    `<div class="gate-chips">${open.map(id => `<button class="chip-w${g.sel === id ? " sel" : ""}" data-id="${id}">${CARDS[id].de}<small>${CARDS[id].en}</small></button>`).join("")}</div>
     <div class="bins">${bin("der")}${bin("die")}${bin("das")}</div>`);
  app.querySelectorAll(".chip-w").forEach(b => b.onclick = () => { g.sel = b.dataset.id; sfx("tap"); gateSort(); });
  app.querySelectorAll(".bin").forEach(b => b.onclick = () => {
    if (!g.sel) return toast(L("Wähle zuerst ein Wort.", "Pick a word first."), 1400);
    const id = g.sel; g.sel = null;
    if (CARDS[id].g === b.dataset.a) { g.done[id] = true; sfx("ok"); speak(`${CARDS[id].g} ${CARDS[id].de}`, true); }
    else gateMiss(L(`${CARDS[id].de} ist nicht „${b.dataset.a}“.`, `${CARDS[id].de} isn't “${b.dataset.a}”.`));
    if (g.nouns.every(n => g.done[n])) return gateWin();
    gateSort();
  });
}
// 3) Hörrätsel: which sentence did you hear?
function gateListen() {
  const item = pickBy(run.gate.seed, ladder().listen);
  gateState = gateState || { opts: shuffle(item), wrong: [] };
  const g = gateState;
  gateFrame("Hörrätsel", L("Hör genau zu: Welchen Satz hörst du?", "Listen carefully: which sentence do you hear?"),
    `<button class="btn hot play" data-play>🔊 ${L("Anhören", "Listen")}</button>
     <div class="col-btns wide">${g.opts.map(o => `<button class="btn opt-l" ${g.wrong.includes(o) ? "disabled" : ""}>${o}</button>`).join("")}</div>`);
  const play = () => speak(item[0], true);
  app.querySelector("[data-play]").onclick = play;
  if (!g.played) { g.played = true; setTimeout(play, 400); }
  app.querySelectorAll(".opt-l").forEach(b => b.onclick = () => {
    if (b.textContent === item[0]) return gateWin();
    g.wrong.push(b.textContent); gateMiss(L("Das war es nicht – hör noch einmal.", "That wasn't it – listen again.")); gateListen();
  });
}

// ---------- riddle event ----------
// ---------- encounters (❓ stops): an illustrated scene with choices; the Sphinx riddle is the fallback ----------
const encPool = () => ENCOUNTERS[`${run.ladder}-${run.act || 0}`] || [];
const T2 = pair => L(pair[0], pair[1]);
// scene text: always German, with the English underneath until B1
const DE2 = pair => uiMode() === "de" ? pair[0] : `${pair[0]}<small class="en-sub">${pair[1]}</small>`;
function costText(c) { return c ? ` <small>(${c.gold ? `💰 ${c.gold}` : ""}${c.hp ? `❤️ −${c.hp}` : ""})</small>` : ""; }
function showEncounter() {
  view = "event";
  run.seenEnc = run.seenEnc || [];
  // a remembered encounter must belong to this floor *and* this act's pool (floors restart at 1 in every act)
  if (!run.enc || run.enc.floor !== run.floor || !encPool().some(e => e.id === run.enc.id)) {
    const fresh = encPool().filter(e => !run.seenEnc.includes(e.id));
    const pick = rnd(fresh.length ? fresh : encPool());
    run.enc = { floor: run.floor, id: pick.id }; run.seenEnc.push(pick.id); save();
  }
  const enc = encPool().find(e => e.id === run.enc.id);
  app.innerHTML = `${topbar()}<main class="panel encounter"><h2 class="fraktur">${T2(enc.title)}</h2>
    <div class="enc-pic">${art(`assets/events/${enc.id}.jpg`, enc.e, "enc-img")}</div>
    <p class="enc-text">${DE2(enc.text)}</p>
    <div class="col-btns wide">${enc.choices.map((c, i) => {
      const poor = c.cost && c.cost.gold > run.gold, frail = c.cost && c.cost.hp >= run.hp;
      return `<button class="btn${i === 0 ? " hot" : ""}" data-ch="${i}" ${poor || frail ? "disabled" : ""}>${c.quiz ? "🗣️ " : ""}${T2(c.label)}${costText(c.cost)}</button>`;
    }).join("")}</div></main>`;
  app.querySelectorAll("[data-ch]").forEach(b => b.onclick = () => chooseEncounter(enc, enc.choices[+b.dataset.ch]));
}
function chooseEncounter(enc, ch) {
  if (ch.cost) { run.gold -= ch.cost.gold || 0; run.hp -= ch.cost.hp || 0; }
  if (!ch.quiz) return encounterOutcome(enc, ch.effect || {});
  const q = ch.quiz, right = q.opts[0];
  app.innerHTML = `${topbar()}<main class="panel encounter"><h2 class="fraktur">${T2(enc.title)}</h2>
    <div class="enc-pic small">${art(`assets/events/${enc.id}.jpg`, enc.e, "enc-img")}</div>
    <p class="riddle">${DE2(q.q)}</p>
    <div class="col-btns wide">${shuffle(q.opts).map(o => `<button class="btn opt-e">${o}</button>`).join("")}</div></main>`;
  app.querySelectorAll(".opt-e").forEach(b => b.onclick = () => {
    const good = b.textContent === right;
    sfx(good ? "ok" : "bad");
    if (good) speak(right);
    encounterOutcome(enc, good ? ch.win : ch.lose, good ? null : right);
  });
}
// Apply an outcome and show what happened; word upgrades/removals open the deck picker afterwards
function encounterOutcome(enc, fx, rightAnswer) {
  fx = fx || {};
  const got = [];
  if (fx.gold) { run.gold += fx.gold; got.push(`💰 +${fx.gold}`); }
  if (fx.maxHp) { run.maxHp += fx.maxHp; run.hp += fx.maxHp; got.push(`❤️ +${fx.maxHp} max`); }
  if (fx.hp) { const before = run.hp; run.hp = Math.max(1, Math.min(run.maxHp, run.hp + fx.hp)); got.push(fx.hp > 0 ? `❤️ +${run.hp - before}` : `💔 ${run.hp - before}`); }
  if (fx.card || fx.rare) {
    const id = fx.card && fx.card !== "pool" ? fx.card : rnd(rewardPool()), c = mk(id, !!fx.rare);
    run.deck.push(c); collect(id); got.push(`🂠 ${CARDS[id].de}${fx.rare ? " +" : ""}`);
  }
  if (fx.relic) { const r = rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r))); if (r) { gainRelic(r); got.push(`${RELICS[r].e} ${RELICS[r].name}`); } else { run.gold += 40; got.push("💰 +40"); } }
  save();
  const next = fx.upgrade ? "enc-upgrade" : fx.remove ? "enc-remove" : "skip";
  app.innerHTML = `${topbar()}<main class="panel encounter"><h2 class="fraktur">${T2(enc.title)}</h2>
    <div class="enc-pic small">${art(`assets/events/${enc.id}.jpg`, enc.e, "enc-img")}</div>
    ${rightAnswer ? `<p class="sub">${L("Richtig wäre:", "The right answer:")} <b>${rightAnswer}</b></p>` : ""}
    ${fx.say ? `<p class="enc-text">${DE2(fx.say)}</p>` : ""}${got.length ? `<p class="enc-got">${got.join(" · ")}</p>` : ""}
    <button class="btn hot" data-act="${next}">${fx.upgrade ? L("Wort wählen", "Choose a word") : fx.remove ? L("Wort entfernen", "Remove a word") : L("Weiter", "Continue")} ➜</button></main>`;
}
function showEvent() {
  if (encPool().length) return showEncounter();
  view = "event";
  const [q, opts] = rnd(ladder().riddles), right = opts[0];
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Die Sphinx der Sprache</h2>${art("assets/npc/sphinx.jpg", "🦁", "event-pic")}
    <p class="sub">„Beantworte mein Rätsel – und ich belohne dich.“ <span class="en">(Answer my riddle and I'll reward you. A wrong answer costs 6 HP.)</span></p>
    <p class="riddle">${q}</p><div class="row-btns">${shuffle(opts).map(o => `<button class="btn opt-r">${o}</button>`).join("")}</div></main>`;
  app.querySelectorAll(".opt-r").forEach(b => b.onclick = () => {
    if (b.textContent === right) {
      const left = Object.keys(RELICS).filter(r => !run.relics.includes(r));
      if (left.length && Math.random() < .4) { const r = rnd(left); gainRelic(r); toast(`✓ ${L("Richtig!", "Correct!")} ${RELICS[r].e} <b>${RELICS[r].name}</b> – ${RELICS[r].text}`, 3500); }
      else { run.gold += 40; toast(`✓ ${L("Richtig!", "Correct!")} +40 Gold`); }
      sfx("win");
    } else { run.hp = Math.max(1, run.hp - 6); toast(`✗ ${L("Falsch – richtig war", "Wrong – the answer was")} „${right}“. −6 ❤️`, 3500); sfx("bad"); }
    nextFloor();
  });
}

// ---------- end of a ladder ----------
function summary() {
  const s = run.stats;
  return `<div class="stats"><div><b>${s.sentences}</b>${L("Sätze", "sentences")}</div><div><b>${s.perfect}</b>${L("perfekt", "perfect")}</div><div><b>${s.dmg}</b>${L("Schaden", "damage")}</div><div><b>${s.mistakes}</b>${L("Fehler", "mistakes")}</div></div>`;
}
function ladderCleared() {
  music("inn");
  const lad = ladder(), idx = LADDERS.indexOf(lad);
  if (!meta.cleared.includes(lad.id)) { meta.cleared.push(lad.id); meta.slots = Math.min(MAX_SLOTS, meta.slots + 2); toast(L(`🎒 Deine Tasche wächst: ${meta.slots} Plätze`, `🎒 Your bag grows: ${meta.slots} slots`), 2600); }
  meta.unlocked = Math.max(meta.unlocked, idx + 2); meta.wins++;
  save();
  playStory(STORY[lad.id].outro, () => {
    view = "end";
    const html = `<main class="panel end"><h2 class="fraktur">${lad.lvl} geschafft!</h2>${heroArt(run.hero, "end-pic")}
      <p class="sub">${L(`${hero().name} hat die Leiter „${lad.name}“ erklommen.`, `${hero().name} has climbed the “${lad.name}” ladder.`)}</p>${summary()}
      <button class="btn hot" data-act="tower">${L("Zur Sprachleiter", "To the language tower")}</button></main>`;
    pickedHero = run.hero; run = null; save();
    app.innerHTML = html;
  });
}
function gameOver() {
  stopMusic(1.5);
  view = "end";
  const html = `<main class="panel end"><h2 class="fraktur">Besiegt …</h2>${heroArt(run.hero, "end-pic dead")}
    <p class="sub">${L(`Gefallen auf Etage ${run.floor + 1} von ${ladder().lvl}. Jeder Satz zählt – versuch es noch einmal!`, `Defeated on floor ${run.floor + 1} of ${ladder().lvl}. Every sentence counts – try again!`)}</p>${summary()}
    <button class="btn hot" data-act="title">${L("Zum Titel", "Back to title")}</button></main>`;
  run = null; save();
  app.innerHTML = html;
}

// ---------- help & deck ----------
function overlay(html) {
  const ov = document.createElement("div");
  ov.className = "incant";
  ov.innerHTML = `<div class="incant-in">${html}<button class="btn hot" data-close>OK</button></div>`;
  ov.onclick = e => { if (e.target.closest("[data-close]") || e.target === ov) ov.remove(); };
  document.body.append(ov);
}
function showHelp() {
  overlay(`<div class="incant-h">How to play</div><ol class="help">
    <li><b>Your cards are German words.</b> Tap them in order to build a sentence: <i>Ich · sehe · den Hund</i>.</li>
    <li><b>Each turn you're dealt 2 pronouns</b> (ich, du, wir …). <b>Verbs go on the field:</b> one per turn, for free. A field verb casts once per turn (from act 2: a second time for +1 ⚡) and stays 3 turns (3 slots).</li>
    <li><b>Energy ⚡:</b> 3 per turn (+1 for every act cleared) – the red seal on a card is its cost. <b>✨ Special power:</b> ready at the start of a fight, then 3 perfect sentences recharge it.</li>
    <li><b>🔥 Streaks:</b> perfect sentences in a row grow stronger (×1.5 → ×1.6 → … ×2). <b>New combos</b> (a pronoun + verb you haven't used this fight) give +2. On the first turn you may place 2 verbs; a verb you can't place can be ♻️ recycled once per turn.</li>
    <li><b>The verb decides the spell:</b> ⚔️ attack, 🛡️ shield or ❤️ heal. The number is its power.</li>
    <li><b>Word order:</b> the verb is always in <b>position 2</b>. Start with a time word (<i>heute</i>) and the subject moves behind the verb: <i>Heute sehe ich …</i></li>
    <li><b>Incantation:</b> when you forge, pick the right verb form and articles. Perfect sentences are ×1.5 stronger.</li>
    <li><b>⏪ Perfekt</b> (from A2): put it at the end to cast in the past tense – <i>Ich habe den Hund gesehen</i>.</li>
    <li><b>🚪 Trials</b> (floors 4 and 8): Frau Huber's mini-games – you must pass them to go on. <b>🛒 Shop:</b> haggle with Herr Wotruba for 30 % off.</li>
    <li><b>Monsters have weaknesses</b> – tap ⓘ. <b>Energy ⚡:</b> verbs, nouns and strong time words (morgen, immer …) cost 1; pronouns, heute/jetzt and ⏪ cost 0.</li>
    <li><b>💪 Strong forms:</b> irregular verb forms (du <i>siehst</i>, er <i>läuft</i>, <i>gesehen</i>) and Dativ objects give +2 power. <b>📖 Fehlerheft:</b> every mistake is saved – practise them at the camp to heal.</li>
  </ol>`);
}
function showDeck() {
  const order = ["subj", "verb", "noun", "adv", "perf"];
  overlay(`<div class="incant-h">Deck (${run.deck.length})</div><div class="choice wrap">${[...run.deck].sort((a, b) => order.indexOf(CARDS[a.id].type) - order.indexOf(CARDS[b.id].type)).map(c => cardHtml(c)).join("")}</div>`);
}

// ---------- input ----------
addEventListener("resize", () => { if (view === "map") drawMapLines(); });
app.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"), act = el && el.dataset.act, card = e.target.closest(".card, .pron, .vtile");
  if (view === "fight" && (el || card) && act !== "music" && act !== "voice" && tutBlocks(el, card)) { const g = $(".tut-glow"); if (g) { g.classList.remove("nudge"); void g.offsetWidth; g.classList.add("nudge"); } return; }
  if (view === "fight" && card && !act) return toggleCard(+card.dataset.uid);
  if (!act) return;
  ({
    heroes: () => { if (run && !app.querySelector(".confirm")) { el.insertAdjacentHTML("afterend", `<button class="btn confirm" data-act="heroes-yes">Sure? Your current run will be lost · Sicher?</button>`); return; } showHeroes(); },
    "heroes-yes": () => { run = null; save(); showHeroes(); },
    "pick-hero": () => { pickedHero = el.dataset.h; sfx("ok"); showTower(); },
    ladder: () => newRun(el.dataset.l),
    tower: showTower,
    continue: () => run.packed === false ? showPack() : showMap(),
    help: showHelp,
    title: showTitle,
    deck: showDeck,
    music: () => toggleSound("music"),
    voice: () => toggleSound("voice"),
    relic: () => showRelic(el.dataset.r),
    node: () => enterNode(+el.dataset.i),
    clear: () => { fight.sentence = []; renderFight(); },
    cast, redraw,
    power: usePower,
    "tut-ok": () => { fight.tut++; renderFight(); },
    end: endTurn,
    foeinfo: () => { const en = ENEMIES[fight.eid]; toast(`${en.e} <b>${en.name}</b>: ${en.hint}`, 4200); },
    skip: nextFloor,
    "rest-review": () => showReview(),
    "rest-heal": () => { run.hp = Math.min(run.maxHp, run.hp + Math.round(run.maxHp * .3)); sfx("ok"); nextFloor(); },
    "rest-up": () => pickFromDeck(L("Welches Wort schmieden?", "Which word to upgrade?"), c => !c.up, c => { c.up = true; sfx("forge"); toast(`⚒️ ${CARDS[c.id].de} +2`); nextFloor(); }),
    back: () => ({ shop: showShop, gate: gateReward, event: nextFloor }[run.map[run.floor][run.path[run.floor]]] || showRest)(),
    "enc-upgrade": () => pickFromDeck(L("Welches Wort schmieden?", "Which word to upgrade?"), c => !c.up, c => { c.up = true; sfx("forge"); toast(`⚒️ ${CARDS[c.id].de} +2`); nextFloor(); }),
    "enc-remove": () => pickFromDeck(L("Welches Wort entfernen?", "Which word to remove?"), () => true, c => { run.deck = run.deck.filter(x => x !== c); toast(`🗑️ ${CARDS[c.id].de}`); save(); nextFloor(); }),
    "buy-relic": () => {
      const s = run.shop, price = shopPrice(s.relicPrice); if (run.gold < price) return;
      run.gold -= price; gainRelic(s.relic); showRelic(s.relic); s.relic = null; sfx("ok"); save(); showShop();
    },
    "buy-remove": () => pickFromDeck(L("Welches Wort entfernen?", "Which word to remove?"), () => true, c => {
      run.gold -= shopPrice(60); run.shop.removed = true; run.deck = run.deck.filter(x => x !== c); toast(`🗑️ ${CARDS[c.id].de}`); save(); showShop();
    }),
    haggle: () => showShop(true),
    "bag-auto": () => { run.bag = recommendedBag(ladder()); sfx("ok"); showPack(); },
    "bag-clear": () => { run.bag = []; showPack(); },
    "bag-go": () => { if (!bagCheck(run.bag)) { sfx("ok"); startClimb(); } },
    "gate-gold": () => { run.gold += 30; sfx("ok"); nextFloor(); },
    "gate-up": () => pickFromDeck(L("Welches Wort schmieden?", "Which word to upgrade?"), c => !c.up, c => { c.up = true; sfx("forge"); toast(`⚒️ ${CARDS[c.id].de} +2`); nextFloor(); }),
    leave: nextFloor
  }[act] || (() => {}))();
});
window.addEventListener("keydown", e => {
  if (view !== "fight" || $(".incant") || $(".story")) return;
  if (e.key === "Enter") cast();
  if (e.key === "Escape") { fight.sentence = []; renderFight(); }
});

showTitle();
if ("speechSynthesis" in window) speechSynthesis.getVoices();

// Installable app + offline mode on the hosted version (GitHub Pages).
// A new version never interrupts play: it's applied on the title screen (right away if you're there, otherwise the next time you get there).
if ("serviceWorker" in navigator && location.protocol === "https:" && !window.ASSET_DATA) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
  if (navigator.serviceWorker.controller) navigator.serviceWorker.addEventListener("controllerchange", () => { updateReady = true; applyUpdate(); });
}
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
