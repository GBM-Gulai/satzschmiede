/* Satzschmiede – heroes, the six ladders and the story scenes. */

// ---------- heroes ----------
const HEROES = {
  rafa:  { name: "Rafa", from: "Brasilien", fromEn: "Brazil", role: "Koch", roleEn: "Cook", e: "🧑🏽‍🍳",
           bonus: "Kochtalent: Sätze mit Essen oder Getränken heilen +3.", bonusEn: "Kitchen talent: sentences with food or drinks heal +3.",
           story: "Ich möchte in Wien ein Restaurant eröffnen.", storyEn: "I want to open a restaurant in Vienna.",
           magic: "Mein Kochlöffel … leuchtet ja!", magicEn: "My wooden spoon … it's glowing!" },
  mei:   { name: "Mei", from: "Taiwan", fromEn: "Taiwan", role: "Programmiererin", roleEn: "Programmer", e: "👩🏻‍💻",
           bonus: "Struktur: Ziehe jede Runde 1 Karte mehr.", bonusEn: "Structure: draw 1 extra card every turn.",
           story: "Ich habe einen neuen Job in einer Wiener Firma.", storyEn: "I have a new job at a Viennese company.",
           magic: "Mein Tablet … ist jetzt ein Zauberbuch!", magicEn: "My tablet … it's a spellbook now!" },
  amara: { name: "Amara", from: "Ghana", fromEn: "Ghana", role: "Krankenpflegerin", roleEn: "Nurse", e: "👩🏿‍⚕️",
           bonus: "Ausdauer: +12 max. Leben, nach jedem Kampf +3.", bonusEn: "Stamina: +12 max HP and +3 HP after every fight.",
           story: "Ich möchte hier im Krankenhaus arbeiten.", storyEn: "I want to work here in the hospital.",
           magic: "Meine Tasche … sie glüht!", magicEn: "My bag … it's glowing!" }
};

// Non-player characters in the story
const NPCS = {
  huber: { name: "Frau Huber", e: "👵" },
  novak: { name: "Herr Novak", e: "🧑‍💼" },
  wotruba: { name: "Herr Wotruba", e: "🧔" }   // the shopkeeper (Greißler)
};

// ---------- the six ladders ----------
// ui: language of the menus & hints – en (English), both (German + English), de (German only)
const LADDERS = [
  { id: "a1", lvl: "A1", name: "Ankunft", nameEn: "Arrival", place: "Wien, Westbahnhof", ui: "en", ready: true,
    mapTitle: "Durch den Westbahnhof", mapSub: "Find your way through the station. The ticket machine waits at the top.",
    enemies: ["assel", "taube", "kontrolleur", "regen"], easy: ["assel", "taube"], elite: "hausmeister", boss: "automat",
    start: ["ich", "du", "wir", "sehen", "finden", "haben", "laufen", "trinken", "Hund", "Katze", "Buch", "Wasser", "heute"],
    pool: ["er", "sie", "ihr", "sie_pl", "suchen", "kaufen", "nehmen", "lesen", "brauchen", "essen", "schlafen", "Pferd", "Taube", "Mann", "Frau", "Kind",
           "Freund", "Apfel", "Semmel", "Würstel", "Pizza", "Kaffee", "Milch", "Zeitung", "Stadtplan", "Fahrkarte", "Schlüssel", "Koffer", "Handy", "jetzt", "morgen", "oft"],
    riddles: [
      ["Which article? ___ Fahrkarte", ["die", "der", "das"]],
      ["„Halb acht“ means …", ["7:30", "8:30", "8:15"]],
      ["Which sentence is correct?", ["Heute fahre ich nach Wien.", "Heute ich fahre nach Wien.", "Heute nach Wien ich fahre."]],
      ["What is a „Semmel“?", ["a bread roll", "a sausage", "a tram"]],
      ["Ich sehe ___ Hund.", ["den", "der", "dem"]],
      ["„Grüß Gott“ means …", ["Hello", "Thank you", "Goodbye forever"]]
    ],
    // Trial mini-games: puzzle = sentences to rebuild; listen = [what is said, similar wrong options …]
    puzzles: ["Ich trinke heute einen Kaffee.", "Wo ist der Bahnhof?", "Heute fahre ich mit dem Zug.", "Die Katze sieht den Hund.",
              "Mein Koffer ist sehr schwer.", "Hast du eine Fahrkarte?"],
    listen: [["Ich kaufe einen Apfel.", "Ich kaufe ein Apfel.", "Ich laufe einen Apfel."],
             ["Wir fahren heute nach Wien.", "Wir fahren morgen nach Wien.", "Wir fahren heute nach Bern."],
             ["Die Fahrkarte kostet drei Euro fünfzig.", "Die Fahrkarte kostet dreizehn Euro.", "Die Fahrkarte kostet drei Euro fünfzehn."],
             ["Um halb acht kommt der Zug.", "Um acht kommt der Zug.", "Um halb neun kommt der Zug."]],
    // Haggling with Herr Wotruba: [question, [correct, wrong, wrong]]
    haggle: [["Herr Wotruba: „Das macht drei Euro fünfzig.“ How much is that?", ["3,50 €", "13,50 €", "3,15 €"]],
             ["How do you politely ask for a discount?", ["Könnten Sie mir einen Rabatt geben?", "Gib mir Rabatt!", "Rabatt, aber schnell!"]],
             ["„Das ist zu teuer!“ means …", ["That's too expensive!", "That's very cheap!", "That's my bag!"]],
             ["What do you say when you walk into a Viennese shop?", ["Grüß Gott!", "Gute Nacht!", "Tschüss!"]]] },
  { id: "a2", lvl: "A2", name: "Das Amt", nameEn: "The Office", place: "Magistratisches Bezirksamt", ui: "both", ready: true,
    mapTitle: "Durch die Gänge des Amts", mapSub: "Formulare, Stempel, Warteschlangen. Ganz oben wartet die Formular-Hydra.",
    enemies: ["kobold", "stempel", "schlange", "papagei"], easy: ["kobold", "stempel"], elite: "drache", boss: "hydra",
    start: ["ich", "du", "wir", "sehen", "haben", "gehen", "geben", "helfen", "Frau", "Hund", "Formular", "Kaffee", "gestern", "perf"],
    pool: ["er", "sie", "ihr", "sie_pl", "finden", "suchen", "kaufen", "schreiben", "brauchen", "trinken", "essen", "kommen", "fahren", "laufen", "folgen", "danken",
           "bringen", "zeigen", "erklären", "schenken", "Beamtin", "Nachbarin", "Kollege", "Kind", "Freund", "Brief", "Zeitung", "Ausweis", "Stempel", "Schnitzel",
           "Brot", "Milch", "Schlüssel", "Drache", "heute", "morgen", "perf", "perf"],
    riddles: [
      ["Ich gebe ___ Kind ein Eis.", ["dem", "das", "den"]],
      ["Perfekt: Wir ___ nach Graz gefahren.", ["sind", "haben", "werden"]],
      ["Ich helfe ___ Mann.", ["dem", "den", "der"]],
      ["Partizip II von „schreiben“:", ["geschrieben", "geschreibt", "schreibt"]],
      ["Was ist ein „Meldezettel“?", ["ein Formular für die Wohnadresse", "ein Busticket", "ein Kochrezept"]],
      ["Gestern ___ ich lange gewartet.", ["habe", "bin", "hat"]]
    ],
    puzzles: ["Ich habe gestern lange gewartet.", "Wir sind nach Graz gefahren.", "Ich gebe der Frau das Formular.",
              "Kannst du mir bitte helfen?", "Er hat dem Kind ein Buch geschenkt.", "Gestern bin ich zum Amt gegangen."],
    listen: [["Ich helfe dem Mann.", "Ich helfe den Mann.", "Ich helfe der Mann."],
             ["Wir haben lange gewartet.", "Wir haben lange gearbeitet.", "Wir sind lange gefahren."],
             ["Sie gibt dem Kind das Formular.", "Sie gibt den Kindern das Formular.", "Sie gibt dem Kind die Formulare."],
             ["Nummer dreihundertsiebenundvierzig, bitte!", "Nummer dreihundertvierundsiebzig, bitte!", "Nummer dreihundertsiebenundsechzig, bitte!"]],
    haggle: [["„Ich hätte gern …“ bedeutet …", ["I would like …", "I had …", "I hate …"]],
             ["Herr Wotruba: „Siebenundvierzig Euro.“", ["47 €", "74 €", "17 €"]],
             ["Höflich: „___ Sie mir einen Rabatt geben?“", ["Könnten", "Konnte", "Kannst"]],
             ["Was ist ein „Greißler“?", ["ein kleines Lebensmittelgeschäft", "ein Busfahrer", "ein Wiener Kuchen"]]] },
  { id: "b1", lvl: "B1", name: "Der Job", nameEn: "The Job", place: "Wien heute · ein Büro in der Leopoldstadt", ui: "de", ready: false,
    teaser: "Zurück in der Gegenwart: Modalverben, weil-Sätze und ein Chef, der nie zufrieden ist." },
  { id: "b2", lvl: "B2", name: "Die Uni", nameEn: "University", place: "Universität Wien", ui: "de", ready: false,
    teaser: "Konjunktiv II, Passiv und Debatten im Hörsaal." },
  { id: "c1", lvl: "C1", name: "Die Zeitung", nameEn: "The Newspaper", place: "Eine Redaktion am Ring", ui: "de", ready: false,
    teaser: "Nominalstil, Genitiv und der Paragraphenreiter." },
  { id: "c2", lvl: "C2", name: "Das Kaffeehaus", nameEn: "The Coffee House", place: "Café Hawelka", ui: "de", ready: false,
    teaser: "Modalpartikeln, Wiener Schmäh – und der grantigste Ober der Stadt." }
];

// ---------- story scenes ----------
// who: "narr" (narrator), "hero", an NPC id or an enemy id. {name} and {from} are replaced with the hero's name and country.
// A 4th item "en" means the line is spoken in English (the German translation is shown small underneath).
// Story: Frau Huber's word cards send newcomers into the Vienna of the past – a parallel world – to learn German (A1, A2).
// From B1 on, the hero returns to today's Vienna and uses what they learned.
const STORY = {
  a1: {
    intro: [
      ["narr", "Wien, Westbahnhof. 7:30 Uhr.", "Vienna, Westbahnhof. 7:30 a.m."],
      ["hero", "Hallo! Ich bin {name} aus {from}.", "Hi! I'm {name}, from {fromEn}.", "en"],
      ["hero", "{story}", "{storyEn}", "en"],
      ["hero", "Ich habe einen Koffer, einen Traum … und fast kein Deutsch.", "I've got a suitcase, a dream … and almost no German.", "en"],
      ["hero", "Entschuldigung … können Sie mir helfen? Wo ist … das Zentrum?", "Excuse me … could you help me? Where is … the city centre?", "en"],
      ["huber", "Oh je – Sie sprechen kein Deutsch, oder? Na, das ändern wir!", "Oh dear – you don't speak German, do you? Well, we'll change that!"],
      ["huber", "Aber Vorsicht: In Wien sind die Wörter gefährlich.", "But careful: in Vienna, words are dangerous."],
      ["huber", "Nehmen Sie diese Karten. Mit guten Sätzen kommen Sie überall durch!", "Take these cards. With good sentences you'll get through anything!"],
      ["narr", "Als {name} die Karten berührt, wirbelt goldenes Licht. Die Zeit dreht sich zurück: Gaslaternen, Dampf, Kutschen – und die Wörter werden lebendig.", "As {name} touches the cards, golden light swirls. Time turns back: gas lamps, steam, carriages – and the words come alive.", "portal"],
      ["huber", "Willkommen im Wien von früher – einer Parallelwelt. Hier lernen Sie, was Sie im Wien von heute brauchen.", "Welcome to the Vienna of the past – a parallel world. Here you'll learn what you need in today's Vienna."],
      ["huber", "Ihre Sachen kommen mit – aber hier sind sie ein bisschen … magisch.", "Your things come with you – but here they're a little … magical."],
      ["hero", "{magic}", "{magicEn}", "en"]
    ],
    // first-run tutorial fight, right after arriving in the past
    tutorial: [
      ["huber", "Schauen Sie – eine Artikel-Assel! Zeit für Ihre erste Lektion.", "Look – an article woodlouse! Time for your first lesson."],
      ["huber", "Ich helfe Ihnen. Machen Sie einfach, was ich sage.", "I'll help you. Just do what I say."]
    ],
    tutorialEnd: [
      ["huber", "Sehr gut! Mit jedem Satz werden Sie stärker.", "Very good! With every sentence you get stronger."],
      ["hero", "Ich … schaffe … das!", "I … can … do this!"],
      ["huber", "Na also! Und jetzt los – durch den Bahnhof.", "There you go! And now off you go – through the station."]
    ],
    boss: [
      ["narr", "Am Ende des Bahnhofs wartet er: der Fahrkartenautomat.", "At the end of the station he's waiting: the ticket machine."],
      ["automat", "BITTE. WÄHLEN. SIE. IHRE. SPRACHE.", "PLEASE. SELECT. YOUR. LANGUAGE."],
      ["hero", "Deutsch. Ich wähle Deutsch!", "German. I choose German!"]
    ],
    outro: [
      ["automat", "FAHRKARTE … GÜLTIG.", "TICKET … VALID."],
      ["narr", "Für einen Moment flackert das Wien von heute auf – Glas, Züge, Menschen mit Handys. Dann ist es wieder fort.", "For a moment today's Vienna flickers into view – glass, trains, people with phones. Then it's gone again."],
      ["huber", "Bravo, {name}! Aber jetzt kommt das Schwierigste: das Amt.", "Bravo, {name}! But now comes the hardest part: the registration office."],
      ["hero", "Das Amt? Wie schlimm kann das sein?", "The office? How bad can it be?"],
      ["narr", "Neue Leiter freigeschaltet: A2 – Das Amt.", "New ladder unlocked: A2 – The Office."]
    ]
  },
  a2: {
    intro: [
      ["narr", "Das Magistratische Bezirksamt. Ein Ort, an dem die Zeit stillsteht.", "The district office. A place where time stands still."],
      ["novak", "Nummer 347! … Sie brauchen einen Meldezettel. Und einen Stempel. Und noch einen Stempel.", "Number 347! … You need a registration form. And a stamp. And another stamp."],
      ["hero", "Gestern habe ich schon drei Stunden gewartet …", "Yesterday I already waited three hours …"],
      ["huber", "Hier helfen nur der Dativ – und die Vergangenheit. Erzählen Sie, was passiert ist!", "Only the Dativ helps here – and the past tense. Tell them what happened!"],
      ["narr", "Neue Karte: ⏪ Perfekt. Lege sie ans Ende des Satzes: „Ich habe den Hund gesehen.“", "New card: ⏪ Perfekt. Put it at the end of the sentence: “I have seen the dog.”"]
    ],
    boss: [
      ["narr", "Im letzten Zimmer wächst sie aus einem Berg von Papier: die Formular-Hydra.", "In the last room she grows out of a mountain of paper: the Form Hydra."],
      ["hydra", "Haben Sie das Formular B-12 ausgefüllt? Und B-13? Und B-14?", "Have you filled in form B-12? And B-13? And B-14?"],
      ["hero", "Ich habe alles ausgefüllt. Alles!", "I have filled in everything. Everything!"]
    ],
    outro: [
      ["hydra", "Der Stempel … ist … gültig …", "The stamp … is … valid …"],
      ["novak", "Willkommen in Wien, {name}. Sie sind jetzt offiziell gemeldet.", "Welcome to Vienna, {name}. You're now officially registered."],
      ["hero", "Endlich! Jetzt brauche ich nur noch … einen Job.", "Finally! Now I just need … a job."],
      ["huber", "Sie haben genug gelernt, {name}. Zeit, ins Wien von heute zurückzukehren.", "You've learned enough, {name}. Time to return to today's Vienna."],
      ["narr", "Fortsetzung folgt: B1 – zurück in der Gegenwart.", "To be continued: B1 – back in the present."]
    ]
  }
};
