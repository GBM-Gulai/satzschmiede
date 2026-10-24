"use strict";
/* Satzschmiede – a deckbuilding roguelike where German sentences are your spells. Content lives in data.js. */

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
const CASE_NAME = { nom: "Nominativ", akk: "Akkusativ", dat: "Dativ" };
const FX = { atk: { icon: "⚔️", de: "Angriff" }, blk: { icon: "🛡️", de: "Schild" }, heal: { icon: "❤️", de: "Heilung" } };
const TYPE_LABEL = { subj: "Subjekt", verb: "Verb", noun: "Nomen", adv: "Zeitwort" };
const PERSON = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
const WEAK_LABEL = { dat: "Dativ", akk: "Akkusativ", inv: "Satz beginnt mit Zeitwort", perfect: "perfekte Sätze", long: "lange Sätze (5+ Wörter)" };
const NODE = { fight: { e: "⚔️", de: "Kampf" }, elite: { e: "💀", de: "Elite" }, rest: { e: "🔥", de: "Lager" }, shop: { e: "🛒", de: "Laden" }, event: { e: "❓", de: "Rätsel" }, boss: { e: "👑", de: "Boss" } };
const LAYOUT = [["fight", "fight"], ["fight", "event"], ["fight", "shop", "event"], ["rest", "fight"], ["elite", "fight", "event"],
  ["event", "shop", "fight"], ["fight", "elite"], ["rest", "shop"], ["boss"]];
const forms = d => d.forms.split(" ");
const nounForm = (d, cas) => cas !== "nom" && d.nForm ? d.nForm : d.de;
const powOf = c => CARDS[c.id].pow + (c.up ? 2 : 0);
let uidSeq = 1;
const mk = (id, up = false) => ({ id, up, uid: uidSeq++ });

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
  const u = new SpeechSynthesisUtterance(text), v = speechSynthesis.getVoices().find(x => x.lang.replace("_", "-").startsWith("de"));
  u.lang = v ? v.lang : "de-DE"; if (v) u.voice = v; u.rate = .9;
  speechSynthesis.speak(u);
}

// ---------- saving ----------
const SAVE = "satzschmiede-run", META = "satzschmiede-meta";
const load = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
let meta = Object.assign({ runs: 0, wins: 0, best: 0, sentences: 0, perfect: 0 }, load(META) || {});
let run = load(SAVE), fight = null, view = "title";
function save() {
  try {
    localStorage.setItem(META, JSON.stringify(meta));
    if (run) localStorage.setItem(SAVE, JSON.stringify(run)); else localStorage.removeItem(SAVE);
  } catch {}
}
if (run) uidSeq = Math.max(1, ...run.deck.map(c => c.uid + 1));
const has = r => run && run.relics.includes(r);

// ---------- run setup ----------
function newRun() {
  run = {
    hp: 50, maxHp: 50, gold: 60, floor: 0, relics: [],
    deck: START_DECK.map(id => mk(id)),
    map: LAYOUT.map(opts => shuffle(opts)), path: [],
    stats: { sentences: 0, perfect: 0, mistakes: 0, dmg: 0 }
  };
  meta.runs++; save();
  showMap();
}

// ---------- top bar ----------
function topbar() {
  return `<header class="top">
    <span class="pill hp">❤️ ${run.hp}/${run.maxHp}</span>
    <span class="pill">💰 ${run.gold}</span>
    <span class="relics">${run.relics.map(r => `<button class="relic" data-act="relic" data-r="${r}" title="${esc(RELICS[r].name + ": " + RELICS[r].text)}">${RELICS[r].e}</button>`).join("")}</span>
    <span class="pill floor">Etage ${Math.min(run.floor + 1, LAYOUT.length)}/${LAYOUT.length}</span>
    <button class="pill" data-act="deck" title="Your deck">🂠 ${run.deck.length}</button>
  </header>`;
}
function toast(msg, ms = 2400) {
  const t = document.createElement("div");
  t.className = "toast"; t.innerHTML = msg;
  document.body.append(t); setTimeout(() => t.remove(), ms);
}
function showRelic(r) { toast(`${RELICS[r].e} <b>${RELICS[r].name}</b> – ${RELICS[r].text}`, 3200); }

// ---------- card rendering ----------
function cardWord(d) {
  if (d.type === "noun") return `<span class="art g-${d.g}">${d.g}</span> ${d.de}`;
  return d.de;
}
function cardHtml(c, extra = "") {
  const d = CARDS[c.id], pow = powOf(c);
  const slots = d.type === "verb" ? (d.slots.length ? d.slots.map(s => s === "dat" ? "+ wem? (Dat)" : "+ was? (Akk)").join(" ") : "ohne Objekt") : "";
  const power = d.type === "verb" ? `${FX[d.fx].icon} ${pow}` : `✦ ${pow}`;
  return `<button class="card t-${d.type}${d.type === "noun" ? " g-" + d.g : ""}${c.up ? " up" : ""} ${extra}" data-uid="${c.uid}">
    <span class="cost">${d.cost}</span><span class="ctype">${TYPE_LABEL[d.type]}${c.up ? " +" : ""}</span>
    <span class="cword">${cardWord(d)}</span><span class="cen">${esc(d.en)}</span>
    ${slots ? `<span class="cslots">${slots}</span>` : ""}<span class="cpow">${power}</span></button>`;
}

// ---------- map ----------
function showMap() {
  view = "map"; fight = null;
  if (run.floor >= LAYOUT.length) return victory();
  const rows = run.map.map((opts, f) => {
    const chosen = run.path[f];
    const nodes = opts.map((n, i) => {
      const state = f < run.floor ? (chosen === i ? "done" : "skip") : f === run.floor ? "open" : "future";
      return `<button class="node ${state} n-${n}" data-act="node" data-i="${i}" ${state === "open" ? "" : "disabled"}>
        <span class="ne">${NODE[n].e}</span><span class="nl">${NODE[n].de}</span></button>`;
    }).join("");
    return `<div class="floor-row${f === run.floor ? " current" : ""}"><span class="fl">${f + 1}</span><div class="nodes">${nodes}</div></div>`;
  }).reverse().join("");
  app.innerHTML = `${topbar()}<main class="map"><h2 class="fraktur">Der Weg zum Golem</h2>
    <p class="sub">Wähle dein nächstes Ziel. Oben wartet der Grammatik-Golem.</p><div class="map-rows">${rows}</div></main>`;
  requestAnimationFrame(() => { const cur = $(".floor-row.current"); if (cur) cur.scrollIntoView({ block: "center" }); });
}
function enterNode(i) {
  const n = run.map[run.floor][i];
  run.path[run.floor] = i; save();
  if (n === "fight") startFight(rnd(run.floor < 2 ? ["assel", "kobold", "geist"] : NORMAL_ENEMIES));
  else if (n === "elite") startFight("drache");
  else if (n === "boss") startFight("golem");
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
    energy: 3, block: 0, turn: 0, eselUsed: false, log: null, busy: false
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
  drawCards(6 + (has("duden") ? 1 : 0));
  renderFight();
}
const sentenceCards = () => fight.sentence.map(uid => fight.hand.find(c => c.uid === uid));
const sentenceCost = () => sentenceCards().reduce((s, c) => s + CARDS[c.id].cost, 0);
const intent = () => { const e = ENEMIES[fight.eid]; return e.moves[fight.enemy.move % e.moves.length]; };
function intentHtml() {
  const [k, v] = intent(), str = fight.enemy.str;
  if (k === "atk") return `⚔️ Angriff ${v + str}`;
  if (k === "blk") return `🛡️ Verteidigung ${v}`;
  if (k === "buff") return `💪 Wird stärker (+${v})`;
  return `💚 Heilt sich ${v}`;
}

// Is the sentence in the forge a valid German main clause? Returns { ok, msg, ... }
function needMsg(v) {
  if (!v.slots.length) return `„${v.de}“ braucht kein Objekt.`;
  if (v.slots.length === 2) return `„${v.de}“ braucht zwei Objekte: <b>wem?</b> (Dativ) + <b>was?</b> (Akkusativ) – in dieser Reihenfolge.`;
  return v.slots[0] === "dat" ? `„${v.de}“ braucht ein Dativ-Objekt: <b>wem?</b>` : `„${v.de}“ braucht ein Akkusativ-Objekt: <b>wen oder was?</b>`;
}
function analyze(cards) {
  if (!cards.length) return { msg: "Tippe Karten in der richtigen Reihenfolge an, um einen Satz zu schmieden." };
  const d = cards.map(c => CARDS[c.id]), verbs = d.filter(x => x.type === "verb");
  if (!verbs.length) return { msg: "Es fehlt noch ein Verb." };
  if (verbs.length > 1) return { msg: "Nur <b>ein</b> Verb pro Satz." };
  if (d[0].type === "verb") return { msg: "Das Verb steht an <b>Position 2</b> – am Anfang wäre es eine Frage." };
  const inv = d[0].type === "adv", vi = 1, si = inv ? 2 : 0;
  if (!d[vi]) return { msg: inv ? "Nach dem Zeitwort kommt sofort das <b>Verb</b>." : "Jetzt das <b>Verb</b> (Position 2)." };
  if (d[vi].type !== "verb") return { msg: inv ? "Nach dem Zeitwort kommt sofort das Verb (Position 2)." : "Das Verb muss an <b>Position 2</b> stehen." };
  const s = d[si];
  if (!s) return { msg: "Jetzt das <b>Subjekt</b>: Heute sehe <b>ich</b> …" };
  if (s.type !== "subj" && s.type !== "noun") return { msg: inv ? "Nach Zeitwort + Verb kommt das Subjekt: Heute sehe <b>ich</b> …" : "Der Satz beginnt mit dem <b>Subjekt</b> (wer?) oder einem Zeitwort." };
  const v = d[vi], objs = [];
  for (const c of cards.slice(si + 1)) {
    const x = CARDS[c.id];
    if (x.type === "subj") return { msg: "Nur <b>ein</b> Subjekt pro Satz." };
    if (x.type === "noun") objs.push(c);
  }
  if (objs.length < v.slots.length) return { msg: needMsg(v) };
  if (objs.length > v.slots.length) return { msg: v.slots.length ? `Zu viele Nomen – „${v.de}“ braucht ${v.slots.length === 1 ? "nur ein Objekt" : "zwei Objekte"}.` : `„${v.de}“ braucht kein Objekt.` };
  if (s.type === "noun" && !["person", "animal"].includes(s.kind)) return { msg: `🤨 ${cap(s.g)} ${s.de} kann nicht „${v.de}“ – das Subjekt sollte eine Person oder ein Tier sein.` };
  for (const [i, c] of objs.entries()) {
    const slot = v.slots[i], want = v.want && v.want[slot], x = CARDS[c.id];
    if (want && !want.includes(x.kind)) return { msg: `🤨 Das ergibt keinen Sinn: <b>${v.de}</b> + <b>${x.de}</b>${slot === "dat" ? " – Dativ heißt <b>wem?</b>, meist eine Person oder ein Tier." : "."}` };
  }
  return { ok: true, msg: "✓ Der Satz steht – jetzt schmieden!", inv, person: s.type === "subj" ? s.p : 2, subj: cards[si], verb: cards[vi], objs: objs.map((c, i) => ({ c, cas: v.slots[i] })) };
}

function renderFight() {
  const e = ENEMIES[fight.eid], en = fight.enemy, cards = sentenceCards(), a = analyze(cards);
  const canCast = a.ok && sentenceCost() <= fight.energy && !fight.busy;
  app.innerHTML = `${topbar()}<main class="fight">
    <section class="enemy${e.boss ? " boss" : ""}${e.elite ? " elite" : ""}">
      <div class="intent">${intentHtml()}</div>
      <div class="foe" id="foe">${e.e}</div>
      <div class="foe-name">${e.name}</div>
      <div class="bar"><i style="width:${Math.max(0, en.hp / en.max * 100)}%"></i><span>${Math.max(0, en.hp)} / ${en.max}${en.block ? ` · 🛡️ ${en.block}` : ""}${en.str ? ` · 💪 +${en.str}` : ""}</span></div>
      ${e.weak ? `<div class="weak">Schwäche: ${WEAK_LABEL[e.weak]} ×2${e.resist ? " · sonst nur halber Schaden" : ""}</div>` : ""}
      <button class="info" data-act="foeinfo" aria-label="About this enemy">ⓘ</button>
    </section>
    <section class="you"><span class="pill">🛡️ Schild ${fight.block}</span><span class="pill energy">⚡ ${fight.energy - sentenceCost()} / ${fight.energy}</span>
      <span class="pill dim">Stapel ${fight.draw.length} · Ablage ${fight.discard.length}</span></section>
    <section class="forge">
      <div class="slots">${cards.length ? cards.map(c => cardHtml(c, "mini")).join("") : `<span class="empty">Deine Schmiede ist leer</span>`}</div>
      <div class="status ${a.ok ? "ok" : ""}">${a.msg}${a.ok && sentenceCost() > fight.energy ? " <b>Nicht genug Energie.</b>" : ""}</div>
      <div class="forge-btns"><button class="btn ghost" data-act="clear" ${cards.length ? "" : "disabled"}>✕ Leeren</button>
        <button class="btn hot" data-act="cast" ${canCast ? "" : "disabled"}>🔨 Schmieden</button></div>
    </section>
    <section class="hand">${fight.hand.map(c => cardHtml(c, fight.sentence.includes(c.uid) ? "used" : "")).join("")}</section>
    <section class="actions"><button class="btn ghost" data-act="redraw" ${fight.energy - sentenceCost() >= 1 && !fight.busy ? "" : "disabled"}>↻ Neu ziehen (1⚡)</button>
      <button class="btn" data-act="end" ${fight.busy ? "disabled" : ""}>Zug beenden ⏭</button></section>
  </main>`;
}
function toggleCard(uid) {
  if (fight.busy) return;
  const i = fight.sentence.indexOf(uid);
  if (i >= 0) fight.sentence.splice(i, 1);
  else fight.sentence.push(uid);
  sfx("tap"); renderFight();
}

// ---------- casting: the incantation asks for verb forms and articles ----------
function cast() {
  const cards = sentenceCards(), a = analyze(cards);
  if (!a.ok || sentenceCost() > fight.energy) return;
  const steps = [];
  for (const c of cards) {
    const d = CARDS[c.id];
    if (c === a.verb) {
      const right = forms(d)[a.person], others = shuffle([...new Set(forms(d))].filter(f => f !== right)).slice(0, 2);
      steps.push({ c, kind: "conj", right, opts: shuffle([right, ...others]), q: `Welche Form? <b>${PERSON[a.person]}</b> + ${d.de}` });
    } else if (d.type === "noun") {
      const cas = c === a.subj ? "nom" : a.objs.find(o => o.c === c).cas;
      steps.push({ c, kind: "art", cas, right: ART[cas][d.g], opts: ARTICLES, q: `Welcher Artikel? <b>${nounForm(d, cas)}</b> als <b>${CASE_NAME[cas]}</b>${cas === "dat" ? " (wem?)" : cas === "akk" ? " (wen/was?)" : " (wer?)"}` });
    }
  }
  fight.busy = true;
  incant(cards, a, steps, 0, []);
}
function sentenceHtml(cards, a, steps, answers, upto) {
  return cards.map((c, i) => {
    const d = CARDS[c.id], si = steps.findIndex(s => s.c === c), first = i === 0;
    let w;
    if (d.type === "noun") {
      const st = steps[si], ans = answers[si], cas = st.cas;
      const art = si < upto ? `<span class="${ans === st.right ? "right" : "wrong"}">${first ? cap(ans) : ans}</span>` : si === upto ? `<span class="blank">___</span>` : `<span class="blank dim">___</span>`;
      w = `<span class="tok case-${cas}">${art} ${nounForm(d, cas)}</span>`;
    } else if (d.type === "verb") {
      const st = steps[si], ans = answers[si];
      w = `<span class="tok verb">${si < upto ? `<span class="${ans === st.right ? "right" : "wrong"}">${ans}</span>` : si === upto ? `<span class="blank">(${d.de})</span>` : `<span class="blank dim">(${d.de})</span>`}</span>`;
    } else w = `<span class="tok">${first ? cap(d.de) : d.de}</span>`;
    return w;
  }).join(" ") + ".";
}
function incant(cards, a, steps, i, answers) {
  let ov = $(".incant");
  if (!ov) { ov = document.createElement("div"); ov.className = "incant"; document.body.append(ov); }
  if (i >= steps.length) { ov.remove(); return resolve(cards, a, steps, answers); }
  const st = steps[i];
  ov.innerHTML = `<div class="incant-in"><div class="incant-h">🔨 Beschwörung ${i + 1}/${steps.length}</div>
    <div class="incant-s">${sentenceHtml(cards, a, steps, answers, i)}</div>
    <div class="incant-q">${st.q}</div>
    <div class="incant-opts">${st.opts.map(o => `<button class="opt">${o}</button>`).join("")}</div></div>`;
  ov.querySelectorAll(".opt").forEach(b => b.onclick = () => { sfx("forge"); incant(cards, a, steps, i + 1, [...answers, b.textContent]); });
}
function correctSentence(cards, a) {
  return cards.map((c, i) => {
    const d = CARDS[c.id];
    let w;
    if (d.type === "noun") { const cas = c === a.subj ? "nom" : a.objs.find(o => o.c === c).cas; w = `${ART[cas][d.g]} ${nounForm(d, cas)}`; }
    else if (d.type === "verb") w = forms(d)[a.person];
    else w = d.de;
    return i === 0 ? cap(w) : w;
  }).join(" ") + ".";
}
function resolve(cards, a, steps, answers) {
  const e = ENEMIES[fight.eid], en = fight.enemy, v = CARDS[a.verb.id];
  const notes = [];
  let mistakes = 0;
  const ok = steps.map((st, i) => {
    if (answers[i] === st.right) return true;
    if (has("esel") && !fight.eselUsed) { fight.eselUsed = true; notes.push(`🫏 Eselsbrücke rettet dich: richtig ist <b>${st.right}</b>.`); return true; }
    mistakes++;
    const d = CARDS[st.c.id];
    notes.push(st.kind === "conj" ? `${PERSON[a.person]} + ${d.de} → <b>${st.right}</b>` : `${d.de} im ${CASE_NAME[st.cas]} → <b>${st.right} ${nounForm(d, st.cas)}</b>`);
    return false;
  });
  const okOf = c => { const i = steps.findIndex(s => s.c === c); return i < 0 || ok[i]; };
  const perfect = mistakes === 0;
  let power = cards.reduce((s, c) => s + (okOf(c) ? powOf(c) : 0), 0);
  if (perfect) power = Math.ceil(power * 1.5) + (has("sachertorte") ? 3 : 0);
  const flags = { dat: a.objs.some(o => o.cas === "dat" && okOf(o.c)), akk: a.objs.some(o => o.cas === "akk" && okOf(o.c)), inv: a.inv, perfect, long: cards.length >= 5 };
  let mult = "";
  if (v.fx === "atk" && e.weak) {
    if (flags[e.weak]) { power *= 2; mult = ` · Schwäche getroffen ×2!`; }
    else if (e.resist) { power = Math.floor(power / 2); mult = ` · ${e.name} widersteht (½)`; }
  }
  // pay & discard
  fight.energy -= sentenceCost();
  fight.hand = fight.hand.filter(c => !fight.sentence.includes(c.uid));
  fight.discard.push(...cards); fight.sentence = [];
  run.stats.sentences++; meta.sentences++;
  if (perfect) { run.stats.perfect++; meta.perfect++; }
  run.stats.mistakes += mistakes;
  // effect
  let line;
  if (v.fx === "atk") {
    const absorbed = Math.min(en.block, power); en.block -= absorbed;
    const dmg = power - absorbed; en.hp -= dmg; run.stats.dmg += dmg;
    line = `⚔️ <b>${dmg}</b> Schaden${absorbed ? ` (🛡️ ${absorbed} geblockt)` : ""}${mult}`;
  } else if (v.fx === "blk") { fight.block += power; line = `🛡️ +<b>${power}</b> Schild`; }
  else { const before = run.hp; run.hp = Math.min(run.maxHp, run.hp + power); line = `❤️ +<b>${run.hp - before}</b> Leben`; }
  if (e.leech && mistakes) { en.hp = Math.min(en.max, en.hp + 4 * mistakes); notes.push(`🧛 Der Verb-Vampir trinkt deine Fehler: +${4 * mistakes} Leben.`); }
  const sentence = correctSentence(cards, a);
  fight.busy = false;
  renderFight();
  speak(sentence);
  sfx(perfect ? "ok" : "bad");
  if (v.fx === "atk") { sfx("hit"); const f = $("#foe"); if (f) { f.classList.add("hit"); floatNum(f, line.match(/<b>(\d+)<\/b>/)[1]); } }
  showResult(cards, a, perfect, line, notes, sentence);
  save();
  if (en.hp <= 0) setTimeout(winFight, 900);
}
function floatNum(el, n) {
  const r = el.getBoundingClientRect(), f = document.createElement("div");
  f.className = "float"; f.textContent = "-" + n;
  f.style.left = r.left + r.width / 2 + "px"; f.style.top = r.top + "px";
  document.body.append(f); setTimeout(() => f.remove(), 1000);
}
function showResult(cards, a, perfect, line, notes, sentence) {
  const old = $(".result"); if (old) old.remove();
  const html = cards.map((c, i) => {
    const d = CARDS[c.id];
    if (d.type === "noun") { const cas = c === a.subj ? "nom" : a.objs.find(o => o.c === c).cas; const w = `${ART[cas][d.g]} ${nounForm(d, cas)}`; return `<span class="case-${cas}">${i === 0 ? cap(w) : w}</span>`; }
    if (d.type === "verb") return `<span class="verb">${forms(d)[a.person]}</span>`;
    return i === 0 ? cap(d.de) : d.de;
  }).join(" ") + ".";
  const r = document.createElement("div");
  r.className = "result " + (perfect ? "perfect" : "flawed");
  r.innerHTML = `<div class="r-h">${perfect ? "✨ Perfekter Satz! ×1.5" : "⚒️ Satz mit Fehlern"}</div>
    <div class="r-s">${html} <button class="say" aria-label="Anhören">🔊</button></div>
    <div class="r-fx">${line}</div>${notes.length ? `<ul class="r-n">${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}
    <div class="r-legend"><span class="case-nom">Nominativ</span> <span class="case-akk">Akkusativ</span> <span class="case-dat">Dativ</span></div>`;
  r.onclick = e => { if (e.target.closest(".say")) speak(sentence); else r.remove(); };
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
  const en = fight.enemy, [k, v] = intent();
  en.block = 0;
  if (k === "atk") {
    const dmg = v + en.str, absorbed = Math.min(fight.block, dmg);
    fight.block -= absorbed; run.hp -= dmg - absorbed;
    sfx("hit"); document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 350);
    toast(`${ENEMIES[fight.eid].e} greift an: <b>${dmg - absorbed}</b> Schaden${absorbed ? ` (🛡️ ${absorbed} geblockt)` : ""}`, 1600);
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
  const gold = e.boss ? 0 : e.elite ? between(40, 55) : between(14, 24);
  run.gold += gold;
  sfx("win");
  if (e.boss) { run.floor++; save(); return victory(); }
  const relic = e.elite ? rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r))) : null;
  if (relic) { run.relics.push(relic); if (relic === "lederhose") { run.maxHp += 10; run.hp += 10; } }
  save();
  showReward(gold, relic);
}

// ---------- after-fight reward ----------
function showReward(gold, relic) {
  view = "reward";
  const picks = sample(REWARD_POOL, 3).map(id => mk(id));
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Sieg!</h2>
    <p class="sub">💰 +${gold} Gold${relic ? ` · Relikt: ${RELICS[relic].e} <b>${RELICS[relic].name}</b> – ${RELICS[relic].text}` : ""}</p>
    <p>Wähle ein neues Wort für dein Deck:</p>
    <div class="choice">${picks.map(c => cardHtml(c)).join("")}</div>
    <button class="btn ghost" data-act="skip">Überspringen</button></main>`;
  app.querySelectorAll(".choice .card").forEach(b => b.onclick = () => {
    run.deck.push(picks.find(c => c.uid === +b.dataset.uid)); sfx("ok"); nextFloor();
  });
}

// ---------- rest site ----------
function showRest() {
  view = "rest";
  const heal = Math.round(run.maxHp * .3);
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Lagerfeuer</h2><div class="campfire">🔥</div>
    <div class="row-btns"><button class="btn hot" data-act="rest-heal">😴 Ausruhen (+${heal} ❤️)</button>
    <button class="btn" data-act="rest-up">⚒️ Ein Wort schmieden (+2 Kraft)</button></div></main>`;
}
function pickFromDeck(title, filter, onPick) {
  view = "pick";
  const cards = run.deck.filter(filter);
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">${title}</h2>
    <div class="choice wrap">${cards.map(c => cardHtml(c)).join("")}</div><button class="btn ghost" data-act="back">Zurück</button></main>`;
  app.querySelectorAll(".choice .card").forEach(b => b.onclick = () => onPick(run.deck.find(c => c.uid === +b.dataset.uid)));
}

// ---------- shop ----------
function showShop() {
  view = "shop";
  if (!run.shop || run.shop.floor !== run.floor) {
    const relic = rnd(Object.keys(RELICS).filter(r => !run.relics.includes(r)));
    run.shop = { floor: run.floor, cards: sample(REWARD_POOL, 4).map(id => ({ ...mk(id), price: between(35, 60) })), relic, relicPrice: 110, removed: false };
  }
  const s = run.shop;
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Wortladen</h2><p class="sub">Der Händler nickt: „Grüß Gott! Was darf's sein?“</p>
    <div class="choice wrap">${s.cards.map(c => `<div class="ware">${cardHtml(c, c.sold ? "used" : "")}<span class="price">${c.sold ? "verkauft" : "💰 " + c.price}</span></div>`).join("")}</div>
    <div class="row-btns">
      ${s.relic ? `<button class="btn" data-act="buy-relic" ${run.gold >= s.relicPrice ? "" : "disabled"}>${RELICS[s.relic].e} ${RELICS[s.relic].name} – 💰 ${s.relicPrice}<small>${RELICS[s.relic].text}</small></button>` : ""}
      <button class="btn" data-act="buy-remove" ${run.gold >= 60 && !s.removed ? "" : "disabled"}>🗑️ Ein Wort entfernen – 💰 60</button>
    </div><button class="btn hot" data-act="leave">Weiter ➜</button></main>`;
  app.querySelectorAll(".ware .card").forEach(b => b.onclick = () => {
    const c = s.cards.find(x => x.uid === +b.dataset.uid);
    if (c.sold || run.gold < c.price) return toast("Nicht genug Gold.");
    run.gold -= c.price; c.sold = true; run.deck.push(mk(c.id)); sfx("ok"); save(); showShop();
  });
}

// ---------- riddle event ----------
function showEvent() {
  view = "event";
  const [q, opts] = rnd(RIDDLES), right = opts[0];
  app.innerHTML = `${topbar()}<main class="panel"><h2 class="fraktur">Die Sphinx der Sprache</h2><div class="campfire">🦁</div>
    <p class="sub">„Beantworte mein Rätsel – und ich belohne dich. Irrst du dich, kostet es dich Blut.“</p>
    <p class="riddle">${q}</p><div class="row-btns">${shuffle(opts).map(o => `<button class="btn opt-r">${o}</button>`).join("")}</div></main>`;
  app.querySelectorAll(".opt-r").forEach(b => b.onclick = () => {
    if (b.textContent === right) {
      const relicLeft = Object.keys(RELICS).filter(r => !run.relics.includes(r));
      if (relicLeft.length && Math.random() < .4) { const r = rnd(relicLeft); run.relics.push(r); if (r === "lederhose") { run.maxHp += 10; run.hp += 10; } toast(`✓ Richtig! Relikt: ${RELICS[r].e} <b>${RELICS[r].name}</b> – ${RELICS[r].text}`, 3500); }
      else { run.gold += 40; toast("✓ Richtig! +40 Gold"); }
      sfx("win");
    } else { run.hp = Math.max(1, run.hp - 6); toast(`✗ Falsch – richtig war „${right}“. −6 ❤️`, 3500); sfx("bad"); }
    nextFloor();
  });
}

// ---------- end screens ----------
function summary() {
  const s = run.stats;
  return `<div class="stats"><div><b>${s.sentences}</b>Sätze</div><div><b>${s.perfect}</b>perfekt</div><div><b>${s.dmg}</b>Schaden</div><div><b>${s.mistakes}</b>Fehler</div></div>`;
}
function gameOver() {
  view = "end";
  meta.best = Math.max(meta.best, run.floor + 1);
  const html = `<main class="panel end"><h2 class="fraktur">Besiegt …</h2><div class="campfire">💀</div>
    <p class="sub">Du bist auf Etage ${run.floor + 1} gefallen. Jeder Satz zählt – versuch es noch einmal!</p>${summary()}
    <button class="btn hot" data-act="title">Zum Titel</button></main>`;
  run = null; save();
  app.innerHTML = html;
}
function victory() {
  view = "end";
  meta.wins++; meta.best = LAYOUT.length;
  const html = `<main class="panel end"><h2 class="fraktur">Der Golem fällt!</h2><div class="campfire">🏆</div>
    <p class="sub">Du hast die Satzschmiede gemeistert. Leiwand!</p>${summary()}<button class="btn hot" data-act="title">Zum Titel</button></main>`;
  run = null; save();
  app.innerHTML = html;
}

// ---------- title & help ----------
function showTitle() {
  view = "title"; fight = null;
  app.innerHTML = `<main class="title"><div class="logo fraktur">Satzschmiede</div>
    <p class="tag">Ein Deckbuilder, in dem deine <b>deutschen Sätze</b> deine Waffen sind.</p>
    <div class="anvil">⚒️</div>
    <div class="col-btns">${run ? `<button class="btn hot" data-act="continue">Weiter spielen (Etage ${run.floor + 1})</button>` : ""}
      <button class="btn ${run ? "" : "hot"}" data-act="new">${run ? "Neuer Lauf" : "Neuer Lauf ⚔️"}</button>
      <button class="btn ghost" data-act="help">Wie spielt man?</button></div>
    <div class="stats"><div><b>${meta.runs}</b>Läufe</div><div><b>${meta.wins}</b>Siege</div><div><b>${meta.sentences}</b>Sätze</div><div><b>${meta.perfect}</b>perfekt</div></div></main>`;
}
function showHelp() {
  const ov = document.createElement("div");
  ov.className = "incant";
  ov.innerHTML = `<div class="incant-in help"><div class="incant-h">Wie spielt man?</div>
    <ol>
      <li><b>Deine Karten sind Wörter.</b> Tippe sie in der richtigen Reihenfolge an, um einen Satz zu bauen: <i>Ich · sehe · den Hund</i>.</li>
      <li><b>Das Verb bestimmt den Zauber:</b> ⚔️ Angriff, 🛡️ Schild oder ❤️ Heilung. Die Zahl auf der Karte ist seine Kraft.</li>
      <li><b>Wortstellung:</b> Das Verb steht an Position 2. Beginnst du mit einem Zeitwort (<i>heute</i>), kommt das Subjekt hinter das Verb: <i>Heute sehe ich …</i></li>
      <li><b>Beschwörung:</b> Beim Schmieden wählst du die richtige Verbform und die richtigen Artikel. Perfekte Sätze sind ×1.5 stark.</li>
      <li><b>Monster haben Schwächen</b> – z. B. der Dativ-Drache gegen Dativ-Sätze. Tippe auf ⓘ.</li>
      <li><b>Energie ⚡:</b> Verben und Nomen kosten 1, Pronomen und Zeitwörter 0. „Neu ziehen“ tauscht deine Hand gegen 1⚡.</li>
    </ol><button class="btn hot" data-act="close-help">Los geht's!</button></div>`;
  ov.onclick = e => { if (e.target.closest('[data-act="close-help"]') || e.target === ov) ov.remove(); };
  document.body.append(ov);
}
function showDeck() {
  const ov = document.createElement("div");
  ov.className = "incant";
  const sorted = [...run.deck].sort((a, b) => Object.keys(TYPE_LABEL).indexOf(CARDS[a.id].type) - Object.keys(TYPE_LABEL).indexOf(CARDS[b.id].type));
  ov.innerHTML = `<div class="incant-in"><div class="incant-h">Dein Deck (${run.deck.length})</div><div class="choice wrap">${sorted.map(c => cardHtml(c)).join("")}</div>
    <button class="btn" data-act="close-help">Schließen</button></div>`;
  ov.onclick = e => { if (e.target.closest('[data-act="close-help"]') || e.target === ov) ov.remove(); };
  document.body.append(ov);
}

// ---------- input ----------
app.addEventListener("click", e => {
  const act = e.target.closest("[data-act]")?.dataset.act, card = e.target.closest(".card");
  if (view === "fight" && card && !act) return toggleCard(+card.dataset.uid);
  if (!act) return;
  ({
    new: () => { if (run && !app.querySelector(".confirm")) { e.target.insertAdjacentHTML("afterend", `<button class="btn confirm" data-act="new-yes">Sicher? Der alte Lauf geht verloren.</button>`); return; } newRun(); },
    "new-yes": newRun,
    continue: showMap,
    help: showHelp,
    title: showTitle,
    deck: showDeck,
    relic: () => showRelic(e.target.closest("[data-r]").dataset.r),
    node: () => enterNode(+e.target.closest("[data-i]").dataset.i),
    clear: () => { fight.sentence = []; renderFight(); },
    cast,
    redraw,
    end: endTurn,
    foeinfo: () => { const en = ENEMIES[fight.eid]; toast(`${en.e} <b>${en.name}</b>: ${en.hint}`, 4200); },
    skip: nextFloor,
    "rest-heal": () => { run.hp = Math.min(run.maxHp, run.hp + Math.round(run.maxHp * .3)); sfx("ok"); nextFloor(); },
    "rest-up": () => pickFromDeck("Welches Wort schmieden?", c => !c.up, c => { c.up = true; sfx("forge"); toast(`⚒️ ${CARDS[c.id].de} ist jetzt stärker (+2).`); nextFloor(); }),
    back: () => (view === "pick" && run.shop && run.shop.floor === run.floor && run.map[run.floor][run.path[run.floor]] === "shop" ? showShop() : showRest()),
    "buy-relic": () => {
      const s = run.shop; if (run.gold < s.relicPrice) return;
      run.gold -= s.relicPrice; run.relics.push(s.relic); if (s.relic === "lederhose") { run.maxHp += 10; run.hp += 10; }
      showRelic(s.relic); s.relic = null; sfx("ok"); save(); showShop();
    },
    "buy-remove": () => pickFromDeck("Welches Wort entfernen?", () => true, c => {
      run.gold -= 60; run.shop.removed = true; run.deck = run.deck.filter(x => x !== c); toast(`🗑️ ${CARDS[c.id].de} entfernt.`); save(); showShop();
    }),
    leave: nextFloor
  }[act] || (() => {}))();
});
window.addEventListener("keydown", e => {
  if (view !== "fight" || $(".incant")) return;
  if (e.key === "Enter") cast();
  if (e.key === "Escape") { fight.sentence = []; renderFight(); }
  if (e.key.toLowerCase() === "e") endTurn();
});

showTitle();
if ("speechSynthesis" in window) speechSynthesis.getVoices();
