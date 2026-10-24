/* Satzschmiede – game content. Add cards, enemies, relics and riddles here. */

// ---------- word cards ----------
// subj: pronoun subject (p = person index ich du er/sie wir ihr sie)
// verb: forms "ich du er wir ihr sie", slots = objects it needs in order (dat before akk), fx = atk | blk | heal
//       want = which kinds of nouns fit each slot (sense check), subj = which noun kinds can be the subject
// noun: g = article, kind = person | animal | thing | food | drink | read
// adv:  time/frequency word – may start the sentence (then the subject goes after the verb)
const CARDS = {
  ich:   { type: "subj", de: "ich", en: "I", p: 0, cost: 0, pow: 1 },
  du:    { type: "subj", de: "du", en: "you", p: 1, cost: 0, pow: 1 },
  er:    { type: "subj", de: "er", en: "he", p: 2, cost: 0, pow: 1 },
  sie:   { type: "subj", de: "sie", en: "she", p: 2, cost: 0, pow: 1 },
  wir:   { type: "subj", de: "wir", en: "we", p: 3, cost: 0, pow: 2 },
  ihr:   { type: "subj", de: "ihr", en: "you (all)", p: 4, cost: 0, pow: 2 },
  sie_pl:{ type: "subj", de: "sie", en: "they", p: 5, cost: 0, pow: 2 },

  sehen:   { type: "verb", de: "sehen", en: "see", forms: "sehe siehst sieht sehen seht sehen", slots: ["akk"], fx: "atk", cost: 1, pow: 4 },
  finden:  { type: "verb", de: "finden", en: "find", forms: "finde findest findet finden findet finden", slots: ["akk"], fx: "atk", cost: 1, pow: 4, want: { akk: ["thing", "food", "drink", "read", "animal"] } },
  suchen:  { type: "verb", de: "suchen", en: "look for", forms: "suche suchst sucht suchen sucht suchen", slots: ["akk"], fx: "atk", cost: 1, pow: 5 },
  kaufen:  { type: "verb", de: "kaufen", en: "buy", forms: "kaufe kaufst kauft kaufen kauft kaufen", slots: ["akk"], fx: "atk", cost: 1, pow: 6, want: { akk: ["thing", "food", "drink", "read"] } },
  nehmen:  { type: "verb", de: "nehmen", en: "take", forms: "nehme nimmst nimmt nehmen nehmt nehmen", slots: ["akk"], fx: "atk", cost: 1, pow: 7, want: { akk: ["thing", "food", "drink", "read"] } },
  lesen:   { type: "verb", de: "lesen", en: "read", forms: "lese liest liest lesen lest lesen", slots: ["akk"], fx: "atk", cost: 1, pow: 6, want: { akk: ["read"] } },
  haben:   { type: "verb", de: "haben", en: "have", forms: "habe hast hat haben habt haben", slots: ["akk"], fx: "blk", cost: 1, pow: 5 },
  brauchen:{ type: "verb", de: "brauchen", en: "need", forms: "brauche brauchst braucht brauchen braucht brauchen", slots: ["akk"], fx: "blk", cost: 1, pow: 6 },
  trinken: { type: "verb", de: "trinken", en: "drink", forms: "trinke trinkst trinkt trinken trinkt trinken", slots: ["akk"], fx: "heal", cost: 1, pow: 3, want: { akk: ["drink"] } },
  essen:   { type: "verb", de: "essen", en: "eat", forms: "esse isst isst essen esst essen", slots: ["akk"], fx: "heal", cost: 1, pow: 4, want: { akk: ["food"] } },
  laufen:  { type: "verb", de: "laufen", en: "run", forms: "laufe läufst läuft laufen lauft laufen", slots: [], fx: "blk", cost: 1, pow: 4 },
  schlafen:{ type: "verb", de: "schlafen", en: "sleep", forms: "schlafe schläfst schläft schlafen schlaft schlafen", slots: [], fx: "heal", cost: 1, pow: 3 },
  helfen:  { type: "verb", de: "helfen", en: "help", forms: "helfe hilfst hilft helfen helft helfen", slots: ["dat"], fx: "blk", cost: 1, pow: 6, want: { dat: ["person", "animal"] } },
  folgen:  { type: "verb", de: "folgen", en: "follow", forms: "folge folgst folgt folgen folgt folgen", slots: ["dat"], fx: "atk", cost: 1, pow: 7, want: { dat: ["person", "animal"] } },
  danken:  { type: "verb", de: "danken", en: "thank", forms: "danke dankst dankt danken dankt danken", slots: ["dat"], fx: "heal", cost: 1, pow: 5, want: { dat: ["person"] } },
  geben:   { type: "verb", de: "geben", en: "give", forms: "gebe gibst gibt geben gebt geben", slots: ["dat", "akk"], fx: "atk", cost: 1, pow: 9, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },
  zeigen:  { type: "verb", de: "zeigen", en: "show", forms: "zeige zeigst zeigt zeigen zeigt zeigen", slots: ["dat", "akk"], fx: "blk", cost: 1, pow: 9, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },
  schenken:{ type: "verb", de: "schenken", en: "give (as a gift)", forms: "schenke schenkst schenkt schenken schenkt schenken", slots: ["dat", "akk"], fx: "heal", cost: 1, pow: 7, want: { dat: ["person", "animal"], akk: ["thing", "food", "drink", "read"] } },

  Hund:     { type: "noun", de: "Hund", g: "der", en: "dog", kind: "animal", cost: 1, pow: 3 },
  Katze:    { type: "noun", de: "Katze", g: "die", en: "cat", kind: "animal", cost: 1, pow: 3 },
  Pferd:    { type: "noun", de: "Pferd", g: "das", en: "horse", kind: "animal", cost: 1, pow: 4 },
  Drache:   { type: "noun", de: "Drache", g: "der", en: "dragon", kind: "animal", cost: 1, pow: 6, nForm: "Drachen" },
  Mann:     { type: "noun", de: "Mann", g: "der", en: "man", kind: "person", cost: 1, pow: 3 },
  Frau:     { type: "noun", de: "Frau", g: "die", en: "woman", kind: "person", cost: 1, pow: 3 },
  Kind:     { type: "noun", de: "Kind", g: "das", en: "child", kind: "person", cost: 1, pow: 3 },
  Lehrerin: { type: "noun", de: "Lehrerin", g: "die", en: "teacher", kind: "person", cost: 1, pow: 4 },
  Freund:   { type: "noun", de: "Freund", g: "der", en: "friend", kind: "person", cost: 1, pow: 4 },
  Apfel:    { type: "noun", de: "Apfel", g: "der", en: "apple", kind: "food", cost: 1, pow: 3 },
  Brot:     { type: "noun", de: "Brot", g: "das", en: "bread", kind: "food", cost: 1, pow: 3 },
  Pizza:    { type: "noun", de: "Pizza", g: "die", en: "pizza", kind: "food", cost: 1, pow: 4 },
  Schnitzel:{ type: "noun", de: "Schnitzel", g: "das", en: "schnitzel", kind: "food", cost: 1, pow: 5 },
  Kaffee:   { type: "noun", de: "Kaffee", g: "der", en: "coffee", kind: "drink", cost: 1, pow: 3 },
  Milch:    { type: "noun", de: "Milch", g: "die", en: "milk", kind: "drink", cost: 1, pow: 3 },
  Wasser:   { type: "noun", de: "Wasser", g: "das", en: "water", kind: "drink", cost: 1, pow: 3 },
  Buch:     { type: "noun", de: "Buch", g: "das", en: "book", kind: "read", cost: 1, pow: 3 },
  Zeitung:  { type: "noun", de: "Zeitung", g: "die", en: "newspaper", kind: "read", cost: 1, pow: 4 },
  Brief:    { type: "noun", de: "Brief", g: "der", en: "letter", kind: "read", cost: 1, pow: 4 },
  Schlüssel:{ type: "noun", de: "Schlüssel", g: "der", en: "key", kind: "thing", cost: 1, pow: 4 },
  Tasche:   { type: "noun", de: "Tasche", g: "die", en: "bag", kind: "thing", cost: 1, pow: 3 },
  Handy:    { type: "noun", de: "Handy", g: "das", en: "phone", kind: "thing", cost: 1, pow: 3 },
  Schwert:  { type: "noun", de: "Schwert", g: "das", en: "sword", kind: "thing", cost: 1, pow: 6 },

  heute:  { type: "adv", de: "heute", en: "today", cost: 0, pow: 2 },
  jetzt:  { type: "adv", de: "jetzt", en: "now", cost: 0, pow: 2 },
  morgen: { type: "adv", de: "morgen", en: "tomorrow", cost: 0, pow: 3 },
  oft:    { type: "adv", de: "oft", en: "often", cost: 0, pow: 3 },
  immer:  { type: "adv", de: "immer", en: "always", cost: 0, pow: 4 }
};

const START_DECK = ["ich", "du", "wir", "sehen", "finden", "haben", "laufen", "trinken", "Hund", "Katze", "Buch", "Wasser", "heute"];
const REWARD_POOL = Object.keys(CARDS).filter(k => !["ich", "du"].includes(k));

// ---------- enemies ----------
// moves cycle in order: atk = damage, blk = enemy block, buff = +strength (adds to future attacks), heal
// weak: double damage from sentences with: dat | akk | inv (starts with a time word) | perfect | long (5+ words)
// resist: half damage unless the weakness applies
const ENEMIES = {
  assel:   { name: "Artikel-Assel", e: "🐛", hp: 18, moves: [["atk", 5], ["atk", 6], ["blk", 4]], hint: "A weak little bug. Good for practising." },
  kobold:  { name: "Akkusativ-Kobold", e: "👺", hp: 24, moves: [["atk", 6], ["blk", 5], ["atk", 8]], weak: "akk", hint: "Weak to Akkusativ objects (den, die, das)." },
  geist:   { name: "Zeitgeist", e: "👻", hp: 26, moves: [["atk", 7], ["atk", 4], ["buff", 2]], weak: "inv", resist: true, hint: "Only fears sentences that START with a time word (Heute sehe ich …)." },
  uhu:     { name: "Umlaut-Uhu", e: "🦉", hp: 28, moves: [["blk", 6], ["atk", 7], ["atk", 7]], weak: "perfect", hint: "Takes double damage from perfect sentences." },
  vampir:  { name: "Verb-Vampir", e: "🧛", hp: 30, moves: [["atk", 6], ["atk", 6], ["heal", 6]], weak: "long", leech: true, hint: "Heals 4 every time you make a grammar mistake. Weak to long sentences (5+ words)." },
  drache:  { name: "Dativ-Drache", e: "🐉", hp: 48, moves: [["atk", 9], ["blk", 8], ["atk", 13], ["buff", 2]], weak: "dat", resist: true, elite: true, hint: "Elite. Only Dativ really hurts it (dem, der …)." },
  golem:   { name: "Grammatik-Golem", e: "🗿", hp: 95, moves: [["blk", 10], ["atk", 10], ["atk", 14], ["buff", 3], ["atk", 18]], weak: "perfect", boss: true, hint: "Boss. Perfect sentences deal double damage." }
};
const NORMAL_ENEMIES = ["assel", "kobold", "geist", "uhu", "vampir"];

// ---------- relics ----------
const RELICS = {
  kaffee:      { name: "Kaffee", e: "☕", text: "+1 energy on the first turn of each fight." },
  duden:       { name: "Duden", e: "📕", text: "Draw 1 extra card each turn." },
  esel:        { name: "Eselsbrücke", e: "🫏", text: "Your first grammar mistake in each fight counts as correct." },
  lederhose:   { name: "Lederhose", e: "🩳", text: "+10 max HP." },
  brezel:      { name: "Brezel", e: "🥨", text: "Heal 4 HP after every fight." },
  sachertorte: { name: "Sachertorte", e: "🍰", text: "Perfect sentences give +3 extra power." }
};

// ---------- riddle events ----------
const RIDDLES = [
  ["Welches Wort passt? „Ich gebe ___ Kind ein Eis.“", ["dem", "das", "den"]],
  ["„Halb acht“ bedeutet …", ["7:30", "8:30", "8:15"]],
  ["Welcher Satz ist richtig?", ["Heute gehe ich ins Kino.", "Heute ich gehe ins Kino.", "Heute ins Kino ich gehe."]],
  ["Was ist ein „Paradeiser“?", ["eine Tomate", "eine Kartoffel", "ein Vogel"]],
  ["Perfekt von „fahren“: Wir ___ nach Graz gefahren.", ["sind", "haben", "werden"]],
  ["Welcher Artikel? ___ Zeitung", ["die", "der", "das"]],
  ["Ich helfe ___ Mann.", ["dem", "den", "der"]],
  ["„Leiwand“ bedeutet …", ["super", "langweilig", "teuer"]]
];
