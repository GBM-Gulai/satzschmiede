/* Satzschmiede – cards, enemies, relics, riddles. The story, heroes and ladders live in story.js. */

// ---------- word cards ----------
// subj: pronoun subject (p = person index ich du er/sie wir ihr sie)
// verb: forms "ich du er wir ihr sie", slots = objects it needs in order (dat before akk), fx = atk | blk | heal
//       aux + part = Perfekt (haben/sein + Partizip II); want = which kinds of nouns fit each slot (sense check)
// noun: g = article, kind = person | animal | thing | food | drink | read; nForm = form in Akk/Dat (der Kollege → den Kollegen)
// adv:  time word – may start the sentence (then the subject goes after the verb)
// perf: ⏪ Perfekt – goes at the end and turns the sentence into the past tense
const CARDS = {
  ich:   { type: "subj", de: "ich", en: "I", p: 0, cost: 0, pow: 1 },
  du:    { type: "subj", de: "du", en: "you", p: 1, cost: 0, pow: 1 },
  er:    { type: "subj", de: "er", en: "he", p: 2, cost: 0, pow: 1 },
  sie:   { type: "subj", de: "sie", en: "she", p: 2, cost: 0, pow: 1 },
  wir:   { type: "subj", de: "wir", en: "we", p: 3, cost: 0, pow: 2 },
  ihr:   { type: "subj", de: "ihr", en: "you (all)", p: 4, cost: 0, pow: 2 },
  sie_pl:{ type: "subj", de: "sie", en: "they", p: 5, cost: 0, pow: 2 },

  sehen:    { type: "verb", de: "sehen", en: "see", forms: "sehe siehst sieht sehen seht sehen", aux: "haben", part: "gesehen", slots: ["akk"], fx: "atk", cost: 1, pow: 4 },
  finden:   { type: "verb", de: "finden", en: "find", forms: "finde findest findet finden findet finden", aux: "haben", part: "gefunden", slots: ["akk"], fx: "atk", cost: 1, pow: 4, want: { akk: ["thing", "food", "drink", "read", "animal"] } },
  suchen:   { type: "verb", de: "suchen", en: "look for", forms: "suche suchst sucht suchen sucht suchen", aux: "haben", part: "gesucht", slots: ["akk"], fx: "atk", cost: 1, pow: 5 },
  kaufen:   { type: "verb", de: "kaufen", en: "buy", forms: "kaufe kaufst kauft kaufen kauft kaufen", aux: "haben", part: "gekauft", slots: ["akk"], fx: "atk", cost: 1, pow: 6, want: { akk: ["thing", "food", "drink", "read"] } },
  nehmen:   { type: "verb", de: "nehmen", en: "take", forms: "nehme nimmst nimmt nehmen nehmt nehmen", aux: "haben", part: "genommen", slots: ["akk"], fx: "atk", cost: 1, pow: 7, want: { akk: ["thing", "food", "drink", "read"] } },
  lesen:    { type: "verb", de: "lesen", en: "read", forms: "lese liest liest lesen lest lesen", aux: "haben", part: "gelesen", slots: ["akk"], fx: "atk", cost: 1, pow: 6, want: { akk: ["read"] } },
  schreiben:{ type: "verb", de: "schreiben", en: "write", forms: "schreibe schreibst schreibt schreiben schreibt schreiben", aux: "haben", part: "geschrieben", slots: ["akk"], fx: "atk", cost: 1, pow: 7, want: { akk: ["read"] } },
  haben:    { type: "verb", de: "haben", en: "have", forms: "habe hast hat haben habt haben", aux: "haben", part: "gehabt", slots: ["akk"], fx: "blk", cost: 1, pow: 5 },
  brauchen: { type: "verb", de: "brauchen", en: "need", forms: "brauche brauchst braucht brauchen braucht brauchen", aux: "haben", part: "gebraucht", slots: ["akk"], fx: "blk", cost: 1, pow: 6 },
  trinken:  { type: "verb", de: "trinken", en: "drink", forms: "trinke trinkst trinkt trinken trinkt trinken", aux: "haben", part: "getrunken", slots: ["akk"], fx: "heal", cost: 1, pow: 3, want: { akk: ["drink"] } },
  essen:    { type: "verb", de: "essen", en: "eat", forms: "esse isst isst essen esst essen", aux: "haben", part: "gegessen", slots: ["akk"], fx: "heal", cost: 1, pow: 4, want: { akk: ["food"] } },
  laufen:   { type: "verb", de: "laufen", en: "run", forms: "laufe läufst läuft laufen lauft laufen", aux: "sein", part: "gelaufen", slots: [], fx: "blk", cost: 1, pow: 4 },
  gehen:    { type: "verb", de: "gehen", en: "go", forms: "gehe gehst geht gehen geht gehen", aux: "sein", part: "gegangen", slots: [], fx: "blk", cost: 1, pow: 5 },
  kommen:   { type: "verb", de: "kommen", en: "come", forms: "komme kommst kommt kommen kommt kommen", aux: "sein", part: "gekommen", slots: [], fx: "atk", cost: 1, pow: 5 },
  fahren:   { type: "verb", de: "fahren", en: "drive / ride", forms: "fahre fährst fährt fahren fahrt fahren", aux: "sein", part: "gefahren", slots: [], fx: "atk", cost: 1, pow: 6 },
  schlafen: { type: "verb", de: "schlafen", en: "sleep", forms: "schlafe schläfst schläft schlafen schlaft schlafen", aux: "haben", part: "geschlafen", slots: [], fx: "heal", cost: 1, pow: 3 },
  helfen:   { type: "verb", de: "helfen", en: "help", forms: "helfe hilfst hilft helfen helft helfen", aux: "haben", part: "geholfen", slots: ["dat"], fx: "blk", cost: 1, pow: 6, want: { dat: ["person", "animal"] } },
  folgen:   { type: "verb", de: "folgen", en: "follow", forms: "folge folgst folgt folgen folgt folgen", aux: "sein", part: "gefolgt", slots: ["dat"], fx: "atk", cost: 1, pow: 7, want: { dat: ["person", "animal"] } },
  danken:   { type: "verb", de: "danken", en: "thank", forms: "danke dankst dankt danken dankt danken", aux: "haben", part: "gedankt", slots: ["dat"], fx: "heal", cost: 1, pow: 5, want: { dat: ["person"] } },
  geben:    { type: "verb", de: "geben", en: "give", forms: "gebe gibst gibt geben gebt geben", aux: "haben", part: "gegeben", slots: ["dat", "akk"], fx: "atk", cost: 1, pow: 9, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },
  bringen:  { type: "verb", de: "bringen", en: "bring", forms: "bringe bringst bringt bringen bringt bringen", aux: "haben", part: "gebracht", slots: ["dat", "akk"], fx: "atk", cost: 1, pow: 10, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },
  zeigen:   { type: "verb", de: "zeigen", en: "show", forms: "zeige zeigst zeigt zeigen zeigt zeigen", aux: "haben", part: "gezeigt", slots: ["dat", "akk"], fx: "blk", cost: 1, pow: 9, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },
  erklären: { type: "verb", de: "erklären", en: "explain", forms: "erkläre erklärst erklärt erklären erklärt erklären", aux: "haben", part: "erklärt", slots: ["dat", "akk"], fx: "blk", cost: 1, pow: 10, want: { dat: ["person"], akk: ["read", "thing"] } },
  schenken: { type: "verb", de: "schenken", en: "give (as a gift)", forms: "schenke schenkst schenkt schenken schenkt schenken", aux: "haben", part: "geschenkt", slots: ["dat", "akk"], fx: "heal", cost: 1, pow: 7, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },

  Hund:      { type: "noun", de: "Hund", g: "der", en: "dog", kind: "animal", cost: 1, pow: 3 },
  Katze:     { type: "noun", de: "Katze", g: "die", en: "cat", kind: "animal", cost: 1, pow: 3 },
  Pferd:     { type: "noun", de: "Pferd", g: "das", en: "horse", kind: "animal", cost: 1, pow: 4 },
  Taube:     { type: "noun", de: "Taube", g: "die", en: "pigeon", kind: "animal", cost: 1, pow: 3 },
  Drache:    { type: "noun", de: "Drache", g: "der", en: "dragon", kind: "animal", cost: 1, pow: 6, nForm: "Drachen" },
  Mann:      { type: "noun", de: "Mann", g: "der", en: "man", kind: "person", cost: 1, pow: 3 },
  Frau:      { type: "noun", de: "Frau", g: "die", en: "woman", kind: "person", cost: 1, pow: 3 },
  Kind:      { type: "noun", de: "Kind", g: "das", en: "child", kind: "person", cost: 1, pow: 3 },
  Freund:    { type: "noun", de: "Freund", g: "der", en: "friend", kind: "person", cost: 1, pow: 4 },
  Lehrerin:  { type: "noun", de: "Lehrerin", g: "die", en: "teacher", kind: "person", cost: 1, pow: 4 },
  Beamtin:   { type: "noun", de: "Beamtin", g: "die", en: "civil servant", kind: "person", cost: 1, pow: 5 },
  Nachbarin: { type: "noun", de: "Nachbarin", g: "die", en: "neighbour", kind: "person", cost: 1, pow: 4 },
  Kollege:   { type: "noun", de: "Kollege", g: "der", en: "colleague", kind: "person", cost: 1, pow: 5, nForm: "Kollegen" },
  Apfel:     { type: "noun", de: "Apfel", g: "der", en: "apple", kind: "food", cost: 1, pow: 3 },
  Brot:      { type: "noun", de: "Brot", g: "das", en: "bread", kind: "food", cost: 1, pow: 3 },
  Semmel:    { type: "noun", de: "Semmel", g: "die", en: "bread roll (AT)", kind: "food", cost: 1, pow: 3 },
  Würstel:   { type: "noun", de: "Würstel", g: "das", en: "sausage (AT)", kind: "food", cost: 1, pow: 4 },
  Pizza:     { type: "noun", de: "Pizza", g: "die", en: "pizza", kind: "food", cost: 1, pow: 4 },
  Schnitzel: { type: "noun", de: "Schnitzel", g: "das", en: "schnitzel", kind: "food", cost: 1, pow: 5 },
  Kaffee:    { type: "noun", de: "Kaffee", g: "der", en: "coffee", kind: "drink", cost: 1, pow: 3 },
  Milch:     { type: "noun", de: "Milch", g: "die", en: "milk", kind: "drink", cost: 1, pow: 3 },
  Wasser:    { type: "noun", de: "Wasser", g: "das", en: "water", kind: "drink", cost: 1, pow: 3 },
  Buch:      { type: "noun", de: "Buch", g: "das", en: "book", kind: "read", cost: 1, pow: 3 },
  Zeitung:   { type: "noun", de: "Zeitung", g: "die", en: "newspaper", kind: "read", cost: 1, pow: 4 },
  Brief:     { type: "noun", de: "Brief", g: "der", en: "letter", kind: "read", cost: 1, pow: 4 },
  Stadtplan: { type: "noun", de: "Stadtplan", g: "der", en: "city map", kind: "read", cost: 1, pow: 4 },
  Formular:  { type: "noun", de: "Formular", g: "das", en: "form", kind: "read", cost: 1, pow: 5 },
  Fahrkarte: { type: "noun", de: "Fahrkarte", g: "die", en: "ticket", kind: "thing", cost: 1, pow: 4 },
  Schlüssel: { type: "noun", de: "Schlüssel", g: "der", en: "key", kind: "thing", cost: 1, pow: 4 },
  Tasche:    { type: "noun", de: "Tasche", g: "die", en: "bag", kind: "thing", cost: 1, pow: 3 },
  Koffer:    { type: "noun", de: "Koffer", g: "der", en: "suitcase", kind: "thing", cost: 1, pow: 4 },
  Handy:     { type: "noun", de: "Handy", g: "das", en: "phone", kind: "thing", cost: 1, pow: 3 },
  Ausweis:   { type: "noun", de: "Ausweis", g: "der", en: "ID card", kind: "thing", cost: 1, pow: 5 },
  Stempel:   { type: "noun", de: "Stempel", g: "der", en: "stamp", kind: "thing", cost: 1, pow: 5 },
  Schwert:   { type: "noun", de: "Schwert", g: "das", en: "sword", kind: "thing", cost: 1, pow: 6 },

  heute:   { type: "adv", de: "heute", en: "today", cost: 0, pow: 2 },
  jetzt:   { type: "adv", de: "jetzt", en: "now", cost: 0, pow: 2 },
  morgen:  { type: "adv", de: "morgen", en: "tomorrow", cost: 0, pow: 3 },
  oft:     { type: "adv", de: "oft", en: "often", cost: 0, pow: 3 },
  immer:   { type: "adv", de: "immer", en: "always", cost: 0, pow: 4 },
  gestern: { type: "adv", de: "gestern", en: "yesterday", cost: 0, pow: 3 },

  perf:    { type: "perf", de: "⏪ Perfekt", en: "past tense", cost: 0, pow: 4 }
};

// ---------- enemies ----------
// moves cycle in order: atk = damage, blk = enemy block, buff = +strength, heal
// weak: double damage from sentences with: dat | akk | inv (starts with a time word) | perfect | long (5+ words) | perf (Perfekt)
// resist: half damage unless the weakness applies · leech: heals 4 per grammar mistake
const ENEMIES = {
  // A1 – Ankunft
  assel:       { name: "Artikel-Assel", e: "🐛", hp: 18, moves: [["atk", 5], ["atk", 6], ["blk", 4]], hint: "Lives in the cracks of the station floor. A gentle warm-up." },
  taube:       { name: "Taschendieb-Taube", e: "🐦", hp: 20, moves: [["atk", 4], ["atk", 7], ["blk", 3]], weak: "akk", hint: "Steals your words. Weak to Akkusativ objects (den, die, das)." },
  kontrolleur: { name: "Der Kontrolleur", e: "👮", hp: 24, moves: [["atk", 6], ["blk", 5], ["atk", 8]], weak: "perfect", hint: "„Fahrkarte, bitte!“ Only perfect sentences impress him (×2)." },
  regen:       { name: "Wiener Regenwolke", e: "🌧️", hp: 22, moves: [["atk", 7], ["atk", 4], ["buff", 2]], weak: "inv", resist: true, hint: "Only sentences that START with a time word get through (Heute sehe ich …)." },
  hausmeister: { name: "Der Hausmeister", e: "🧹", hp: 44, moves: [["atk", 8], ["blk", 8], ["atk", 12], ["buff", 2]], weak: "long", elite: true, hint: "Elite. Grumbles at short answers – weak to long sentences (5+ words)." },
  automat:     { name: "Der Fahrkartenautomat", e: "🎫", hp: 85, moves: [["blk", 10], ["atk", 9], ["atk", 12], ["buff", 3], ["atk", 16]], weak: "perfect", boss: true, hint: "Boss. BITTE. WÄHLEN. SIE. Perfect sentences deal double damage." },
  // A2 – Das Amt
  kobold:      { name: "Akkusativ-Kobold", e: "👺", hp: 26, moves: [["atk", 7], ["blk", 5], ["atk", 9]], weak: "akk", hint: "Hides in the waiting room. Weak to Akkusativ objects." },
  stempel:     { name: "Stempel-Spinne", e: "🕷️", hp: 28, moves: [["blk", 6], ["atk", 8], ["atk", 8]], weak: "perf", hint: "Stamps everything twice. Weak to Perfekt sentences (⏪)." },
  schlange:    { name: "Warteschlangen-Wurm", e: "🐍", hp: 32, moves: [["blk", 7], ["atk", 7], ["atk", 9]], weak: "long", hint: "Endless and slow. Weak to long sentences (5+ words)." },
  papagei:     { name: "Paragrafen-Papagei", e: "🦜", hp: 28, moves: [["atk", 7], ["atk", 7], ["heal", 6]], weak: "dat", leech: true, hint: "Repeats your mistakes and heals from them (+4 each). Weak to Dativ." },
  drache:      { name: "Dativ-Drache", e: "🐉", hp: 52, moves: [["atk", 10], ["blk", 9], ["atk", 14], ["buff", 2]], weak: "dat", resist: true, elite: true, hint: "Elite. Only Dativ really hurts it (dem, der …)." },
  hydra:       { name: "Die Formular-Hydra", e: "🐲", hp: 110, moves: [["blk", 12], ["atk", 10], ["buff", 3], ["atk", 13], ["atk", 18]], weak: "perf", boss: true, hint: "Boss. Grows new paper heads. Tell her what happened – Perfekt sentences deal double damage." }
};

// ---------- relics ----------
const RELICS = {
  kaffee:      { name: "Kaffee", e: "☕", text: "+1 energy on the first turn of each fight." },
  duden:       { name: "Duden", e: "📕", text: "Draw 1 extra card each turn." },
  esel:        { name: "Eselsbrücke", e: "🫏", text: "Your first grammar mistake in each fight counts as correct." },
  lederhose:   { name: "Lederhose", e: "🩳", text: "+10 max HP." },
  brezel:      { name: "Brezel", e: "🥨", text: "Heal 4 HP after every fight." },
  sachertorte: { name: "Sachertorte", e: "🍰", text: "Perfect sentences give +3 extra power." },
  meldezettel: { name: "Meldezettel", e: "📄", text: "Perfekt sentences give +4 extra power." }
};
