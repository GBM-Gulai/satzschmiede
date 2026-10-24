"use strict";
/* Satzschmiede – a deckbuilding roguelike where German sentences are your spells.
   Content: data.js (cards, enemies, relics) and story.js (heroes, ladders, story). Images: assets/ (see ASSETS.md). */

// ---------- helpers ----------
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
const NODE = { fight: ["⚔️", "Kampf", "Fight"], elite: ["💀", "Elite", "Elite"], rest: ["🔥", "Lager", "Camp"], shop: ["🛒", "Laden", "Shop"], event: ["❓", "Rätsel", "Riddle"], boss: ["👑", "Boss", "Boss"] };
const LAYOUT = [["fight", "fight"], ["fight", "event"], ["fight", "shop", "event"], ["rest", "fight"], ["elite", "fight", "event"],
  ["event", "shop", "fight"], ["fight", "elite"], ["rest", "shop"], ["boss"]];
const forms = d => d.forms.split(" ");
const nounForm = (d, cas) => cas !== "nom" && d.nForm ? d.nForm : d.de;
const powOf = c => CARDS[c.id].pow + (c.up ? 2 : 0);
let uidSeq = 1;
const mk = (id, up = false) => ({ id, up, uid: uidSeq++ });
const ladder = () => LADDERS.find(l => l.id === (run ? run.ladder : "a1"));
const hero = () => HEROES[run.hero];

// Language of hints & menus grows with the level: A1 English, A2 both, B1+ German
function uiMode() { return run ? ladder().ui : "both"; }
function L(de, en) { const m = uiMode(); return m === "en" ? en : m === "both" ? `${de} <small class="en">(${en})</small>` : de; }
const TYPE_LABEL = () => ({ subj: L("Subjekt", "subject"), verb: L("Verb", "verb"), noun: L("Nomen", "noun"), adv: L("Zeitwort", "time"), perf: "Perfekt" });
const weakLabel = w => ({ dat: L("Dativ", "Dativ"), akk: L("Akkusativ", "Akkusativ"), inv: L("Satz beginnt mit Zeitwort", "sentence starts with a time word"),
  perfect: L("perfekte Sätze", "perfect sentences"), long: L("lange Sätze (5+ Wörter)", "long sentences (5+ words)"), perf: L("Perfekt-Sätze ⏪", "Perfekt sentences ⏪") })[w];

// ---------- images (assets/…png, embedded by build.ps1 for the one-file version) with emoji fallback ----------
const ASSET = window.ASSET_DATA || {};
const src = p => ASSET[p] || p;
window.artFail = img => img.parentNode.classList.add("noimg");
const art = (p, emoji, cls = "") => `<span class="pic ${cls}"><img src="${src(p)}" alt="" onerror="artFail(this)"><span class="pic-e">${emoji}</span></span>`;
const enemyArt = (id, cls) => art(`assets/enemies/${id}.png`, ENEMIES[id].e, cls);
const heroArt = (id, cls) => art(`assets/heroes/${id}.png`, HEROES[id].e, cls);
function setScene(id) {   // background art per ladder
  document.body.dataset.ladder = id || "";
  document.body.style.setProperty("--bg", id ? `url("${src(`assets/bg/${id}.png`)}")` : "none");
}

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
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[⏪]/g, "")), v = speechSynthesis.getVoices().find(x => x.lang.replace("_", "-").startsWith("de"));
  u.lang = v ? v.lang : "de-DE"; if (v) u.voice = v; u.rate = .9;
  speechSynthesis.speak(u);
}

// ---------- saving ----------
const SAVE = "satzschmiede-run", META = "satzschmiede-meta";
const load = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
let meta = Object.assign({ runs: 0, wins: 0, sentences: 0, perfect: 0, unlocked: 1, cleared: [] }, load(META) || {});
let run = load(SAVE), fight = null, view = "title";
if (run && !run.ladder) run = null;   // save from an older version
function save() {
  try {
    localStorage.setItem(META, JSON.stringify(meta));
    if (run) localStorage.setItem(SAVE, JSON.stringify(run)); else localStorage.removeItem(SAVE);
  } catch {}
}
if (run) uidSeq = Math.max(1, ...run.deck.map(c => c.uid + 1));
const has = r => run && run.relics.includes(r);

// ---------- run setup ----------
let pickedHero = null;
function newRun(ladderId) {
  const lad = LADDERS.find(l => l.id === ladderId), hp = 50 + (pickedHero === "amara" ? 12 : 0);
  run = {
    ladder: ladderId, hero: pickedHero, hp, maxHp: hp, gold: 60, floor: 0, relics: [],
    deck: lad.start.map(id => mk(id)), map: LAYOUT.map(opts => shuffle(opts)), path: [],
    stats: { sentences: 0, perfect: 0, mistakes: 0, dmg: 0 }
  };
  meta.runs++; save();
  setScene(ladderId);
  playStory(STORY[ladderId].intro, showMap);
}

// ---------- story scenes ----------
function fill(s) {
  const h = run && hero();
  return h ? s.replace(/\{name\}/g, h.name).replace(/\{fromEn\}/g, h.fromEn).replace(/\{from\}/g, h.from).replace(/\{storyEn\}/g, h.storyEn).replace(/\{story\}/g, h.story) : s;
}
function speaker(who) {
  if (who === "narr") return { name: "", pic: "" };
  if (who === "hero") return { name: hero().name, pic: heroArt(run.hero, "portrait") };
  if (NPCS[who]) return { name: NPCS[who].name, pic: art(`assets/npc/${who}.png`, NPCS[who].e, "portrait") };
  return { name: ENEMIES[who].name, pic: enemyArt(who, "portrait") };
}
function playStory(lines, done) {
  let i = 0;
  const ov = document.createElement("div");
  ov.className = "story";
  const show = () => {
    if (i >= lines.length) { ov.remove(); return done(); }
    const [who, de, en] = lines[i], s = speaker(who);
    ov.innerHTML = `<div class="story-pic ${who === "hero" ? "left" : "right"}">${s.pic}</div>
      <div class="story-box ${who === "narr" ? "narr" : ""}">${s.name ? `<div class="story-name">${s.name}</div>` : ""}
        <div class="story-de">${fill(de)} <button class="say" data-say aria-label="Anhören">🔊</button></div><div class="story-en">${fill(en)}</div>
        <div class="story-foot"><span>${i + 1} / ${lines.length}</span><span>${L("Tippen zum Weiterlesen", "Tap to continue")} ▸</span></div></div>
      <button class="story-skip" data-skip>${L("Überspringen", "Skip")} ⏭</button>`;
  };
  ov.onclick = e => {
    if (e.target.closest("[data-say]")) return speak(fill(lines[i][1]));
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
    <span class="pill floor">${ladder().lvl} · ${Math.min(run.floor + 1, LAYOUT.length)}/${LAYOUT.length}</span>
    <button class="pill" data-act="deck" title="Deck">🂠 ${run.deck.length}</button>
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
  view = "title"; fight = null; setScene("");
  app.innerHTML = `<main class="title"><div class="logo fraktur">Satzschmiede</div>
    <p class="tag">A deckbuilder where your <b>German sentences</b> are your weapons.<br><span class="en">Ein Deckbuilder, in dem deine deutschen Sätze deine Waffen sind.</span></p>
    <div class="anvil">⚒️</div>
    <div class="col-btns">${run ? `<button class="btn hot" data-act="continue">Continue · Weiter (${LADDERS.find(l => l.id === run.ladder).lvl}, ${run.floor + 1}/${LAYOUT.length})</button>` : ""}
      <button class="btn ${run ? "" : "hot"}" data-act="heroes">New adventure · Neues Abenteuer</button>
      <button class="btn ghost" data-act="help">How to play · Wie spielt man?</button></div>
    <div class="stats"><div><b>${meta.runs}</b>Runs</div><div><b>${meta.cleared.length}</b>Leitern</div><div><b>${meta.sentences}</b>Sätze</div><div><b>${meta.perfect}</b>perfekt</div></div></main>`;
}
function showHeroes() {
  view = "heroes";
  app.innerHTML = `<main class="panel"><h2 class="fraktur">Wer bist du?</h2><p class="sub">Choose your hero · Wähle deine Heldin oder deinen Helden</p>
    <div class="heroes">${Object.entries(HEROES).map(([id, h]) => `<button class="hero-card" data-act="pick-hero" data-h="${id}">
      ${heroArt(id, "hero-pic")}<b class="hero-name">${h.name}</b><span class="hero-role">${h.role} aus ${h.from}<small class="en">${h.roleEn} from ${h.fromEn}</small></span>
      <span class="hero-bonus">${h.bonusEn}<small class="en">${h.bonus}</small></span></button>`).join("")}</div>
    <button class="btn ghost" data-act="title">← Back</button></main>`;
}
function showTower() {
  view = "tower";
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
function showMap() {
  view = "map"; fight = null; setScene(run.ladder);
  if (run.floor >= LAYOUT.length) return ladderCleared();
  const lad = ladder();
  const rows = run.map.map((opts, f) => {
    const chosen = run.path[f];
    const nodes = opts.map((n, i) => {
      const state = f < run.floor ? (chosen === i ? "done" : "skip") : f === run.floor ? "open" : "future";
      const icon = n === "boss" ? enemyArt(lad.boss, "node-pic") : `<span class="ne">${NODE[n][0]}</span>`;
      return `<button class="node ${state} n-${n}" data-act="node" data-i="${i}" ${state === "open" ? "" : "disabled"}>${icon}<span class="nl">${L(NODE[n][1], NODE[n][2])}</span></button>`;
    }).join("");
    return `<div class="floor-row${f === run.floor ? " current" : ""}"><span class="fl">${f + 1}</span><div class="nodes">${nodes}</div></div>`;
  }).reverse().join("");
  app.innerHTML = `${topbar()}<main class="map"><h2 class="fraktur">${lad.mapTitle}</h2><p class="sub">${lad.mapSub}</p><div class="map-rows">${rows}</div></main>`;
  requestAnimationFrame(() => { const cur = $(".floor-row.current"); if (cur) cur.scrollIntoView({ block: "center" }); });
}
function enterNode(i) {
  const n = run.map[run.floor][i], lad = ladder();
  run.path[run.floor] = i; save();
  if (n === "fight") startFight(rnd(run.floor < 2 ? lad.easy : lad.enemies));
  else if (n === "elite") startFight(lad.elite);
  else if (n === "boss") playStory(STORY[run.ladder].boss, () => startFight(lad.boss));
  else if (n === "rest") showRest();
  else if (n === "shop") showShop();
  else showEvent();
}
function nextFloor() { run.floor++; save(); showMap(); }

// ---------- combat ----------
function startFight(eid) {
  const e = ENEMIES[eid], scale = e.boss ? 0 : run.floor * 2;
  fight = {
    eid, enemy: { hp: e.hp + scale, max: e.hp + scale, block: 0, str: 0, move: 0 },
    draw: shuffle(run.deck.map(c => ({ ...c }))), hand: [], discard: [], sentence: [],
    energy: 3, block: 0, turn: 0, eselUsed: false, busy: false
  };
  view = "fight";
  startTurn();
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
  fight.block = 0;
  fight.energy = 3 + (fight.turn === 1 && has("kaffee") ? 1 : 0);
  drawCards(6 + (has("duden") ? 1 : 0) + (run.hero === "mei" ? 1 : 0));
  renderFight();
}
const sentenceCards = () => fight.sentence.map(uid => fight.hand.find(c => c.uid === uid));
const sentenceCost = () => sentenceCards().reduce((s, c) => s + CARDS[c.id].cost, 0);
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
    <section class="you"><span class="pill">🛡️ ${L("Schild", "Shield")} ${fight.block}</span><span class="pill energy">⚡ ${fight.energy - sentenceCost()} / ${fight.energy}</span>
      <span class="pill dim">${L("Stapel", "Draw")} ${fight.draw.length} · ${L("Ablage", "Discard")} ${fight.discard.length}</span></section>
    <section class="forge">
      <div class="slots">${cards.length ? cards.map(c => cardHtml(c, "mini")).join("") : `<span class="empty">${L("Deine Schmiede ist leer", "Your forge is empty")}</span>`}</div>
      <div class="status ${a.ok ? "ok" : ""}">${a.msg}${a.ok && sentenceCost() > fight.energy ? ` <b>${L("Nicht genug Energie.", "Not enough energy.")}</b>` : ""}</div>
      <div class="forge-btns"><button class="btn ghost" data-act="clear" ${cards.length ? "" : "disabled"}>✕ ${L("Leeren", "Clear")}</button>
        <button class="btn hot" data-act="cast" ${canCast ? "" : "disabled"}>🔨 ${L("Schmieden", "Forge")}</button></div>
    </section>
    <section class="hand">${fight.hand.map(c => cardHtml(c, fight.sentence.includes(c.uid) ? "used" : "")).join("")}</section>
    <section class="actions"><button class="btn ghost" data-act="redraw" ${fight.energy - sentenceCost() >= 1 && !fight.busy ? "" : "disabled"}>↻ ${L("Neu ziehen", "Redraw")} (1⚡)</button>
      <button class="btn" data-act="end" ${fight.busy ? "disabled" : ""}>${L("Zug beenden", "End turn")} ⏭</button></section>
  </main>`;
}
function toggleCard(uid) {
  if (fight.busy) return;
  const i = fight.sentence.indexOf(uid);
  if (i >= 0) fight.sentence.splice(i, 1); else fight.sentence.push(uid);
  sfx("tap"); renderFight();
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
  let ov = $(".incant");
  if (!ov) { ov = document.createElement("div"); ov.className = "incant"; document.body.append(ov); }
  if (i >= steps.length) { ov.remove(); return resolve(cards, a, steps, answers); }
  const st = steps[i];
  ov.innerHTML = `<div class="incant-in"><div class="incant-h">🔨 ${L("Beschwörung", "Incantation")} ${i + 1}/${steps.length}</div>
    <div class="incant-s">${sentenceWords(cards, a, steps, answers, i, false)}</div>
    <div class="incant-q">${st.q}</div>
    <div class="incant-opts">${st.opts.map(o => `<button class="opt">${o}</button>`).join("")}</div></div>`;
  ov.querySelectorAll(".opt").forEach(b => b.onclick = () => { sfx("forge"); incant(cards, a, steps, i + 1, [...answers, b.textContent]); });
}
const plainSentence = html => html.replace(/<[^>]+>/g, "");
function resolve(cards, a, steps, answers) {
  const e = ENEMIES[fight.eid], en = fight.enemy, v = CARDS[a.verb.id];
  const notes = [];
  let mistakes = 0;
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
  if (perfect) power = Math.ceil(power * 1.5) + (has("sachertorte") ? 3 : 0);
  if (perfOk && has("meldezettel")) power += 4;
  if (run.hero === "rafa" && v.fx === "heal" && a.objs.some(o => ["food", "drink"].includes(CARDS[o.c.id].kind))) power += 3;
  const flags = { dat: a.objs.some(o => o.cas === "dat" && okOf(o.c)), akk: a.objs.some(o => o.cas === "akk" && okOf(o.c)), inv: a.inv, perfect, long: cards.filter(c => CARDS[c.id].type !== "perf").length >= 5, perf: perfOk };
  let mult = "";
  if (v.fx === "atk" && e.weak) {
    if (flags[e.weak]) { power *= 2; mult = L(" · Schwäche getroffen ×2!", " · weakness hit ×2!"); }
    else if (e.resist) { power = Math.floor(power / 2); mult = L(` · ${e.name} widersteht (½)`, ` · ${e.name} resists (½)`); }
  }
  // pay & discard
  fight.energy -= sentenceCost();
  fight.hand = fight.hand.filter(c => !fight.sentence.includes(c.uid));
  fight.discard.push(...cards); fight.sentence = [];
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
  const html = sentenceWords(cards, a, steps, answers, steps.length, true);
  fight.busy = false;
  renderFight();
  speak(plainSentence(html));
  sfx(perfect ? "ok" : "bad");
  if (v.fx === "atk") { sfx("hit"); const f = $("#foe"); if (f) { f.classList.add("hit"); floatNum(f, dmg); } }
  showResult(html, perfect, a.perf, line, notes);
  save();
  if (en.hp <= 0) setTimeout(winFight, 900);
}
function floatNum(el, n) {
  const r = el.getBoundingClientRect(), f = document.createElement("div");
  f.className = "float"; f.textContent = "-" + n;
  f.style.left = r.left + r.width / 2 + "px"; f.style.top = r.top + "px";
  document.body.append(f); setTimeout(() => f.remove(), 1000);
}
function showResult(html, perfect, perf, line, notes) {
  const old = $(".result"); if (old) old.remove();
  const r = document.createElement("div");
  r.className = "result " + (perfect ? "perfect" : "flawed");
  r.innerHTML = `<div class="r-h">${perfect ? L("✨ Perfekter Satz! ×1.5", "✨ Perfect sentence! ×1.5") : L("⚒️ Satz mit Fehlern", "⚒️ Sentence with mistakes")}${perf ? " · ⏪ Perfekt" : ""}</div>
    <div class="r-s">${html} <button class="say" aria-label="Anhören">🔊</button></div>
    <div class="r-fx">${line}</div>${notes.length ? `<ul class="r-n">${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}
    <div class="r-legend"><span class="case-nom">Nominativ</span> <span class="case-akk">Akkusativ</span> <span class="case-dat">Dativ</span></div>`;
  r.onclick = e => { if (e.target.closest(".say")) speak(plainSentence(html)); else r.remove(); };
  document.body.append(r);
  setTimeout(() => r.classList.add("fade"), notes.length ? 5500 : 3200);
  setTimeout(() => r.remove(), notes.length ? 6200 : 3900);
}
function redraw() {
  if (fight.busy || fight.energy - sentenceCost() < 1) return;
  fight.energy--; fight.sentence = [];
  const n = fight.hand.length;
  fight.discard.push(...fight.hand); fight.hand = [];
  drawCards(n); renderFight();
}
function endTurn() {
  if (fight.busy) return;
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
  if (run.hero === "amara") run.hp = Math.min(run.maxHp, run.hp + 3);
  const gold = e.boss ? 0 : e.elite ? between(40, 55) : between(14, 24);
  run.gold += gold;
  sfx("win");
  if (e.boss) { run.floor++; save(); return ladderCleared(); }
  const relic = e.elite ? rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r))) : null;
  if (relic) gainRelic(relic);
  save();
  showReward(gold, relic);
}
function gainRelic(r) { run.relics.push(r); if (r === "lederhose") { run.maxHp += 10; run.hp += 10; } }

// ---------- after-fight reward ----------
function showReward(gold, relic) {
  view = "reward";
  const picks = sample(ladder().pool, 3).map(id => mk(id));
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Sieg!</h2>
    <p class="sub">💰 +${gold} Gold${relic ? ` · ${L("Relikt", "Relic")}: ${RELICS[relic].e} <b>${RELICS[relic].name}</b> – ${RELICS[relic].text}` : ""}</p>
    <p>${L("Wähle ein neues Wort für dein Deck:", "Choose a new word for your deck:")}</p>
    <div class="choice">${picks.map(c => cardHtml(c)).join("")}</div>
    <button class="btn ghost" data-act="skip">${L("Überspringen", "Skip")}</button></main>`;
  app.querySelectorAll(".choice .card").forEach(b => b.onclick = () => { run.deck.push(picks.find(c => c.uid === +b.dataset.uid)); sfx("ok"); nextFloor(); });
}

// ---------- rest site ----------
function showRest() {
  view = "rest";
  const heal = Math.round(run.maxHp * .3);
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Lagerfeuer</h2><div class="campfire">🔥</div>
    <div class="row-btns"><button class="btn hot" data-act="rest-heal">😴 ${L("Ausruhen", "Rest")} (+${heal} ❤️)</button>
    <button class="btn" data-act="rest-up">⚒️ ${L("Ein Wort schmieden (+2 Kraft)", "Upgrade a word (+2 power)")}</button></div></main>`;
}
function pickFromDeck(title, filter, onPick) {
  view = "pick";
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">${title}</h2>
    <div class="choice wrap">${run.deck.filter(filter).map(c => cardHtml(c)).join("")}</div><button class="btn ghost" data-act="back">${L("Zurück", "Back")}</button></main>`;
  app.querySelectorAll(".choice .card").forEach(b => b.onclick = () => onPick(run.deck.find(c => c.uid === +b.dataset.uid)));
}

// ---------- shop ----------
function showShop() {
  view = "shop";
  if (!run.shop || run.shop.floor !== run.floor) {
    const relic = rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r)));
    run.shop = { floor: run.floor, cards: sample(ladder().pool, 4).map(id => ({ ...mk(id), price: between(35, 60) })), relic, relicPrice: 110, removed: false };
  }
  const s = run.shop;
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Wortladen</h2><p class="sub">„Grüß Gott! Was darf's sein?“ <span class="en">(Hello! What can I get you?)</span></p>
    <div class="choice wrap">${s.cards.map(c => `<div class="ware">${cardHtml(c, c.sold ? "used" : "")}<span class="price">${c.sold ? L("verkauft", "sold") : "💰 " + c.price}</span></div>`).join("")}</div>
    <div class="row-btns">
      ${s.relic ? `<button class="btn" data-act="buy-relic" ${run.gold >= s.relicPrice ? "" : "disabled"}>${RELICS[s.relic].e} ${RELICS[s.relic].name} – 💰 ${s.relicPrice}<small>${RELICS[s.relic].text}</small></button>` : ""}
      <button class="btn" data-act="buy-remove" ${run.gold >= 60 && !s.removed ? "" : "disabled"}>🗑️ ${L("Ein Wort entfernen", "Remove a word")} – 💰 60</button>
    </div><button class="btn hot" data-act="leave">${L("Weiter", "Continue")} ➜</button></main>`;
  app.querySelectorAll(".ware .card").forEach(b => b.onclick = () => {
    const c = s.cards.find(x => x.uid === +b.dataset.uid);
    if (c.sold || run.gold < c.price) return toast(L("Nicht genug Gold.", "Not enough gold."));
    run.gold -= c.price; c.sold = true; run.deck.push(mk(c.id)); sfx("ok"); save(); showShop();
  });
}

// ---------- riddle event ----------
function showEvent() {
  view = "event";
  const [q, opts] = rnd(ladder().riddles), right = opts[0];
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Die Sphinx der Sprache</h2>${art("assets/npc/sphinx.png", "🦁", "event-pic")}
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
  const lad = ladder(), idx = LADDERS.indexOf(lad);
  if (!meta.cleared.includes(lad.id)) meta.cleared.push(lad.id);
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
    <li><b>The verb decides the spell:</b> ⚔️ attack, 🛡️ shield or ❤️ heal. The number is its power.</li>
    <li><b>Word order:</b> the verb is always in <b>position 2</b>. Start with a time word (<i>heute</i>) and the subject moves behind the verb: <i>Heute sehe ich …</i></li>
    <li><b>Incantation:</b> when you forge, pick the right verb form and articles. Perfect sentences are ×1.5 stronger.</li>
    <li><b>⏪ Perfekt</b> (from A2): put it at the end to cast in the past tense – <i>Ich habe den Hund gesehen</i>.</li>
    <li><b>Monsters have weaknesses</b> – tap ⓘ. <b>Energy ⚡:</b> verbs and nouns cost 1; pronouns, time words and ⏪ cost 0.</li>
  </ol>`);
}
function showDeck() {
  const order = ["subj", "verb", "noun", "adv", "perf"];
  overlay(`<div class="incant-h">Deck (${run.deck.length})</div><div class="choice wrap">${[...run.deck].sort((a, b) => order.indexOf(CARDS[a.id].type) - order.indexOf(CARDS[b.id].type)).map(c => cardHtml(c)).join("")}</div>`);
}

// ---------- input ----------
app.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"), act = el && el.dataset.act, card = e.target.closest(".card");
  if (view === "fight" && card && !act) return toggleCard(+card.dataset.uid);
  if (!act) return;
  ({
    heroes: () => { if (run && !app.querySelector(".confirm")) { el.insertAdjacentHTML("afterend", `<button class="btn confirm" data-act="heroes-yes">Sure? Your current run will be lost · Sicher?</button>`); return; } showHeroes(); },
    "heroes-yes": () => { run = null; save(); showHeroes(); },
    "pick-hero": () => { pickedHero = el.dataset.h; sfx("ok"); showTower(); },
    ladder: () => newRun(el.dataset.l),
    tower: showTower,
    continue: showMap,
    help: showHelp,
    title: showTitle,
    deck: showDeck,
    relic: () => showRelic(el.dataset.r),
    node: () => enterNode(+el.dataset.i),
    clear: () => { fight.sentence = []; renderFight(); },
    cast, redraw,
    end: endTurn,
    foeinfo: () => { const en = ENEMIES[fight.eid]; toast(`${en.e} <b>${en.name}</b>: ${en.hint}`, 4200); },
    skip: nextFloor,
    "rest-heal": () => { run.hp = Math.min(run.maxHp, run.hp + Math.round(run.maxHp * .3)); sfx("ok"); nextFloor(); },
    "rest-up": () => pickFromDeck(L("Welches Wort schmieden?", "Which word to upgrade?"), c => !c.up, c => { c.up = true; sfx("forge"); toast(`⚒️ ${CARDS[c.id].de} +2`); nextFloor(); }),
    back: () => (run.map[run.floor][run.path[run.floor]] === "shop" ? showShop() : showRest()),
    "buy-relic": () => {
      const s = run.shop; if (run.gold < s.relicPrice) return;
      run.gold -= s.relicPrice; gainRelic(s.relic); showRelic(s.relic); s.relic = null; sfx("ok"); save(); showShop();
    },
    "buy-remove": () => pickFromDeck(L("Welches Wort entfernen?", "Which word to remove?"), () => true, c => {
      run.gold -= 60; run.shop.removed = true; run.deck = run.deck.filter(x => x !== c); toast(`🗑️ ${CARDS[c.id].de}`); save(); showShop();
    }),
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
