/* Satzschmiede – heroes, the six ladders and the story scenes. */

// ---------- heroes ----------
const HEROES = {
  rafa:  { g: "m", name: "Rafa", from: "Brasilien", fromEn: "Brazil", role: "Koch", roleEn: "Cook", e: "🧑🏽‍🍳",
           power: "Doppelte Portion", powerEn: "Double helping", powerText: "Deine nächsten 2 Sätze wirken +50 %.", powerTextEn: "Your next 2 sentences get +50 % power.",
           story: "Ich möchte in Wien ein Restaurant eröffnen.", storyEn: "I want to open a restaurant in Vienna.",
           magic: "Mein Kochlöffel … leuchtet ja!", magicEn: "My wooden spoon … it's glowing!" ,
           b1need: "Für Ihr Restaurant brauchen Sie einen Businessplan – und einen Kredit von der Bank.",
           b1needEn: "For your restaurant you need a business plan – and a loan from the bank.",
           b1plan: "Mein eigenes Restaurant in Wien … dafür muss ich einen Plan schreiben!",
           b1planEn: "My own restaurant in Vienna … for that I have to write a plan!",
           b1termin: "Ich brauche einen Termin, weil ich ein Restaurant eröffnen will!",
           b1terminEn: "I need an appointment because I want to open a restaurant!",
           b1act2: "Bravo! Das Gründerprogramm hat Sie aufgenommen. Jetzt schreiben Sie Ihren Businessplan – in einem Büro in der Leopoldstadt.",
           b1act2En: "Bravo! The start-up programme has accepted you. Now you write your business plan – in an office in the Leopoldstadt.",
           b1act2narr: "Akt 2: Das Büro. Zahlen, Tabellen und ein Businessplan.",
           b1act2narrEn: "Act 2: the office. Numbers, spreadsheets and a business plan.",
           b1act3: "Morgen ist Ihr großer Tag: Sie präsentieren Ihren Businessplan bei der Bank.",
           b1act3En: "Tomorrow is your big day: you present your business plan at the bank.",
           b1act3name: "Die Präsentation",
           b1act3title: "Die Präsentation bei der Bank",
           b1boss: "der Bankdirektor",
           b1bossIntro: "Im Besprechungsraum der Bank sitzt er mit verschränkten Armen: der Bankdirektor.",
           b1bossIntroEn: "In the bank's meeting room he sits with folded arms: the bank director.",
           b1bossQ: "Überzeugen Sie mich. Warum sollte die Bank Ihnen einen Kredit geben?",
           b1bossQEn: "Convince me. Why should the bank give you a loan?",
           b1answer: "Weil mein Schnitzel das beste in Wien ist – und weil ich jeden Tag besser Deutsch spreche!",
           b1answerEn: "Because my schnitzel is the best in Vienna – and because I speak better German every day!",
           b1yes: "Hm. Überzeugend. Sie bekommen den Kredit.",
           b1yesEn: "Hm. Convincing. You get the loan.",
           b1joy: "Ich bekomme den Kredit! Mein Restaurant wird Wirklichkeit!",
           b1joyEn: "I'm getting the loan! My restaurant is becoming reality!" },
  mei:   { g: "f", name: "Mei", from: "Taiwan", fromEn: "Taiwan", role: "Programmiererin", roleEn: "Programmer", e: "👩🏻‍💻",
           power: "Wörterbuch-App", powerEn: "Dictionary app", powerText: "Bei deiner nächsten Beschwörung leuchten die richtigen Antworten.", powerTextEn: "In your next incantation the right answers light up.",
           story: "Ich habe einen neuen Job in einer Wiener Firma.", storyEn: "I have a new job at a Viennese company.",
           magic: "Mein Tablet … ist jetzt ein Zauberbuch!", magicEn: "My tablet … it's a spellbook now!" ,
           b1need: "Sie brauchen einen Job.",
           b1needEn: "You need a job.",
           b1plan: "Ich suche eine Stelle in einer Wiener Firma.",
           b1planEn: "I'm looking for a position at a Viennese company.",
           b1termin: "Ich brauche einen Termin, weil ich eine Arbeit suche!",
           b1terminEn: "I need an appointment because I'm looking for a job!",
           b1act2: "Bravo! Und schauen Sie: Eine Firma in der Leopoldstadt lädt Sie ein.",
           b1act2En: "Bravo! And look: a company in the Leopoldstadt is inviting you.",
           b1act2narr: "Akt 2: Das Büro. Erster Arbeitstag.",
           b1act2narrEn: "Act 2: the office. First day at work.",
           b1act3: "Morgen ist Ihr großer Tag: Sie präsentieren Ihr Projekt vor dem Chef.",
           b1act3En: "Tomorrow is your big day: you present your project to the boss.",
           b1act3name: "Die Präsentation",
           b1act3title: "Die große Präsentation",
           b1boss: "der Chef",
           b1bossIntro: "Im Konferenzraum sitzt er mit verschränkten Armen: der Chef.",
           b1bossIntroEn: "In the conference room he sits with folded arms: the boss.",
           b1bossQ: "Überzeugen Sie mich. Warum sollte ich Sie behalten?",
           b1bossQEn: "Convince me. Why should I keep you?",
           b1answer: "Weil ich hart arbeite – und weil ich jeden Tag besser Deutsch spreche!",
           b1answerEn: "Because I work hard – and because I speak better German every day!",
           b1yes: "Hm. Nicht schlecht. Sie bekommen den Vertrag.",
           b1yesEn: "Hm. Not bad. You get the contract.",
           b1joy: "Ich habe einen Job in Wien! Ich kann es nicht glauben!",
           b1joyEn: "I have a job in Vienna! I can't believe it!" },
  amara: { g: "f", name: "Amara", from: "Ghana", fromEn: "Ghana", role: "Krankenpflegerin", roleEn: "Nurse", e: "👩🏿‍⚕️",
           power: "Erste Hilfe", powerEn: "First aid", powerText: "Heile 10 Leben und erhalte 6 Schild.", powerTextEn: "Heal 10 HP and gain 6 shield.",
           story: "Ich möchte hier im Krankenhaus arbeiten.", storyEn: "I want to work here in the hospital.",
           magic: "Meine Tasche … sie glüht!", magicEn: "My bag … it's glowing!" ,
           b1need: "Ihr Diplom muss in Österreich anerkannt werden – erst dann dürfen Sie im Krankenhaus arbeiten.",
           b1needEn: "Your diploma has to be recognised in Austria – only then may you work at the hospital.",
           b1plan: "Ich will endlich wieder als Krankenpflegerin arbeiten!",
           b1planEn: "I finally want to work as a nurse again!",
           b1termin: "Ich brauche einen Termin, weil ich mein Diplom anerkennen lassen muss!",
           b1terminEn: "I need an appointment because I have to get my diploma recognised!",
           b1act2: "Bravo! Ihre Unterlagen sind komplett. Jetzt geht es in die Verwaltung des Krankenhauses.",
           b1act2En: "Bravo! Your documents are complete. Now it's off to the hospital's administration.",
           b1act2narr: "Akt 2: Das Büro. Formulare, Formulare, Formulare.",
           b1act2narrEn: "Act 2: the office. Forms, forms, forms.",
           b1act3: "Morgen ist Ihr großer Tag: das Vorstellungsgespräch bei der Pflegedirektorin.",
           b1act3En: "Tomorrow is your big day: the job interview with the head of nursing.",
           b1act3name: "Das Vorstellungsgespräch",
           b1act3title: "Das Vorstellungsgespräch",
           b1boss: "die Pflegedirektorin",
           b1bossIntro: "Im Büro der Pflegedirektion sitzt sie hinter einem Berg von Akten: die Pflegedirektorin.",
           b1bossIntroEn: "In the nursing director's office she sits behind a pile of files: the head of nursing.",
           b1bossQ: "Erzählen Sie mir: Warum sollten wir gerade Sie nehmen?",
           b1bossQEn: "Tell me: why should we take you, of all people?",
           b1answer: "Weil ich Menschen helfen will – und weil ich jeden Tag besser Deutsch spreche!",
           b1answerEn: "Because I want to help people – and because I speak better German every day!",
           b1yes: "Wunderbar. Sie können am Montag anfangen.",
           b1yesEn: "Wonderful. You can start on Monday.",
           b1joy: "Ich darf wieder als Krankenpflegerin arbeiten – in Wien!",
           b1joyEn: "I can work as a nurse again – in Vienna!" }
};

// The B1 final boss depends on the hero's goal: Mei's boss, Rafa's bank director, Amara's head of nursing.
// voice = speaker id for the recorded lines (tools/make-voices*.py know the same mapping)
const HERO_BOSS = {
  chef: { rafa: { name: "Der Bankdirektor", hint: "Final boss of B1. Decides about your restaurant loan – explain WHY: sentences with weil / dass deal double damage." },
          amara: { name: "Die Pflegedirektorin", e: "👩‍⚕️", img: "pflegedirektorin", voice: "pflegedirektorin",
                   hint: "Final boss of B1. Your job interview – explain WHY: sentences with weil / dass deal double damage." } }
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
    // acts 2 and 3 (act 1 uses the fields above)
    acts: [{}, { name: "Der Naschmarkt", bg: "a1-2", mapTitle: "Über den Naschmarkt", mapSub: "Stalls, smells and swindlers. The Cheese Emperor sits behind the last stall.",
                 enemies: ["gurke", "schreier", "wespe", "kraut"], easy: ["gurke", "wespe"], elite: "standlerin", boss: "kaese",
                 puzzles: ["Ich kaufe heute drei rote Äpfel.", "Was kostet ein Kilo Tomaten?", "Am Samstag gehen wir auf den Markt.", "Der Käse riecht sehr stark.", "Kann ich mit Karte bezahlen?", "Morgen koche ich eine große Suppe."] },
               { name: "Der Prater", bg: "a1-3", mapTitle: "Durch den Prater", mapSub: "Carousels, ghost trains – and a giant wheel that turns all by itself.",
                 enemies: ["pony", "watte", "spiegel", "fledermaus"], easy: ["pony", "fledermaus"], elite: "watschenmann", boss: "riesenrad",
                 puzzles: ["Am Abend fahren wir mit dem Riesenrad.", "Die Kinder lachen in der Geisterbahn.", "Ich habe keine Angst vor Gespenstern.", "Heute Abend essen wir Langos im Prater.", "Wie viel kostet eine Fahrt?", "Mein Freund gewinnt einen großen Teddybären."] }],
    start: ["ich", "du", "wir", "sehen", "finden", "haben", "laufen", "trinken", "Hund", "Katze", "Buch", "Wasser", "heute"],
    starter: ["kaufen", "essen", "Mann", "Apfel", "jetzt"],   // extra words in the collection from the very first run
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
    acts: [{}, { name: "Das Archiv", bg: "a2-2", mapTitle: "Hinab ins Archiv", mapSub: "Staub, Akten, Dunkelheit. Ganz unten wartet der Aktenberg.",
                 enemies: ["aktenmaus", "staub", "ordner", "krake"], easy: ["aktenmaus", "krake"], elite: "archivar", boss: "aktenberg",
                 puzzles: ["Ich habe meine Akte im Keller gefunden.", "Gestern hat mir der Beamte nicht geholfen.", "Wir sind zwei Stunden im Archiv geblieben.", "Hast du das Formular schon unterschrieben?", "Die Katze ist mir in den Keller gefolgt.", "Er hat dem Archivar einen Brief gegeben."] },
               { name: "Das Rathaus", bg: "a2-3", mapTitle: "Hinauf ins Rathaus", mapSub: "Ballsaal, Wappen, Siegel. Auf dem Turm wartet der Rathausmann.",
                 enemies: ["loewe", "walzer", "pfau", "siegel"], easy: ["loewe", "walzer"], elite: "sekretaer", boss: "rathausmann",
                 puzzles: ["Ich habe dem Bürgermeister das Formular gezeigt.", "Am Samstag sind wir auf den Ball gegangen.", "Der Kellner hat uns eine Torte gebracht.", "Wann haben Sie den Antrag abgegeben?", "Wir haben die ganze Nacht Walzer getanzt.", "Endlich hat mir jemand die Regeln erklärt."] }],
    start: ["ich", "du", "wir", "sehen", "haben", "gehen", "geben", "helfen", "Frau", "Hund", "Formular", "Kaffee", "gestern", "perf"],
    starter: ["kommen", "zeigen", "Brief", "Beamtin", "perf"],
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
  { id: "b1", lvl: "B1", name: "Der Job", nameEn: "The Job", place: "Wien heute · ein Büro in der Leopoldstadt", ui: "de", ready: true, energy: 4, hand: 6, hp: 60,
    teaser: "Zurück in der Gegenwart: Modalverben, weil-Sätze und ein Chef, der nie zufrieden ist.",
    mapTitle: "Beim AMS", mapSub: "Wartenummern, Formulare, Beratung. Ganz am Ende wartet der Termin-Automat.",
    enemies: ["lurch", "absage", "phantom", "troll"], easy: ["lurch", "absage"], elite: "beraterin", boss: "amsautomat",
    acts: [{ bg: "b1-1" },
           { name: "Das Büro", bg: "b1", mapTitle: "Im Büro", mapSub: "Drucker, E-Mails, Kaffeemaschine. Und dann: das Endlos-Meeting.",
             enemies: ["druckerdaemon", "mailflut", "kaffeekobold", "dauerredner"], easy: ["druckerdaemon", "kaffeekobold"], elite: "hotline", boss: "meeting",
             puzzles: ["Ich kann den Bericht heute nicht drucken.", "Der Chef will, dass wir länger bleiben.", "Wir dürfen im Büro keinen Alkohol trinken.",
                       "Obwohl ich müde bin, beantworte ich alle E-Mails.", "Kannst du mir bitte die Datei schicken?", "Ich trinke Kaffee, weil das Meeting lange dauert."] },
           { name: "{b1act3name}", bg: "b1-3", mapTitle: "{b1act3title}", mapSub: "Lampenfieber, Folien, Beamer. Ganz oben wartet {b1boss}.",
             enemies: ["lampenfieber", "folienkobold", "beamer", "deadline"], easy: ["lampenfieber", "deadline"], elite: "konkurrent", boss: "chef",
             puzzles: ["Morgen soll ich das Projekt präsentieren.", "Ich bin nervös, weil der Chef zuhört.", "Wenn die Präsentation gut läuft, bekomme ich mehr Gehalt.",
                       "Wir müssen die Folien noch einmal besprechen.", "Der Kunde möchte den Vertrag sofort unterschreiben.", "Obwohl der Beamer kaputt ist, präsentiere ich weiter."] }],
    start: ["arbeiten", "schreiben", "drucken", "telefonieren", "Bericht", "Email", "Chef", "Kollegin", "Termin", "müssen", "weil", "heute"],
    starter: ["können", "dass", "lesen", "beantworten", "Lebenslauf", "Projekt", "Kunde"],
    pool: ["er", "sie", "wir", "ihr", "vergessen", "besprechen", "verdienen", "präsentieren", "schicken", "warten", "beantworten", "kaufen", "finden", "suchen",
           "geben", "zeigen", "erklären", "helfen", "Kunde", "Chefin", "Vertrag", "Lebenslauf", "Bewerbung", "Präsentation", "Drucker", "Gehalt", "Projekt",
           "Laptop", "Kaffee", "Zeitung", "Brief", "dürfen", "sollen", "wollen", "möchten", "dass", "wenn", "obwohl", "morgen", "jetzt", "perf"],
    riddles: [
      ["Welcher Satz ist richtig?", ["Ich muss heute arbeiten.", "Ich muss arbeiten heute.", "Ich heute muss arbeiten."]],
      ["Welcher Satz ist richtig?", ["Ich bleibe zu Hause, weil ich krank bin.", "Ich bleibe zu Hause, weil ich bin krank.", "Ich bleibe zu Hause, weil bin ich krank."]],
      ["„Ich darf hier nicht rauchen“ heißt …", ["I'm not allowed to smoke here.", "I don't want to smoke here.", "I must not smoke here tomorrow."]]
    ],
    puzzles: ["Ich muss heute meinen Lebenslauf schreiben.", "Kann ich morgen einen Termin bekommen?", "Ich lerne Deutsch, weil ich hier arbeiten will.",
              "Wir müssen das Formular bis Freitag abgeben.", "Ich glaube, dass ich die Stelle bekomme.", "Wenn ich Zeit habe, schreibe ich Bewerbungen."],
    listen: [["Ich muss um neun Uhr im Büro sein.", "Ich muss um zehn Uhr im Büro sein.", "Ich kann um neun Uhr im Büro sein."],
             ["Der Termin ist am Dienstag.", "Der Termin ist am Donnerstag.", "Die Termine sind am Dienstag."],
             ["Ich arbeite hier, weil es mir gefällt.", "Ich arbeite hier, wenn es mir gefällt.", "Ich arbeite hier, obwohl es mir gefällt."],
             ["Das Gehalt beträgt zweitausend Euro.", "Das Gehalt beträgt zweihundert Euro.", "Das Gehalt beträgt zwölftausend Euro."]],
    haggle: [["Herr Wotruba: „Das macht zwölf Euro neunzig.“ Wie viel ist das?", ["12,90 €", "20,90 €", "12,19 €"]],
             ["Wie fragst du höflich nach einem Rabatt?", ["Könnten Sie mir vielleicht einen Rabatt geben?", "Ich will Rabatt!", "Du gibst mir Rabatt."]],
             ["„Das ist mir zu teuer, weil …“ – was passt?", ["… ich noch kein Gehalt bekomme.", "… ich bekomme noch kein Gehalt.", "… bekomme ich noch kein Gehalt."]],
             ["Was sagst du, wenn du nur schauen willst?", ["Ich schaue mich nur um, danke.", "Ich kaufe alles!", "Geben Sie mir das!"]]] },
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
      ["huber", "Schauen Sie – eine Artikel-Assel! Zeit für eine Übungsrunde.", "Look – an article woodlouse! Time for a practice round."],
      ["huber", "Ich erkläre Ihnen alles. Machen Sie einfach, was ich sage.", "I'll explain everything. Just do what I say."]
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
    act1End: [
      ["automat", "FAHRKARTE … GÜLTIG.", "TICKET … VALID."],
      ["huber", "Gut gemacht, {name}! Mit der Fahrkarte kommen Sie weiter – zum Naschmarkt.", "Well done, {name}! With the ticket you can go on – to the Naschmarkt."],
      ["narr", "Akt 2: Der Naschmarkt. Hier riecht alles nach Essen – und nach Ärger.", "Act 2: the Naschmarkt. Everything here smells of food – and of trouble."]
    ],
    boss2: [
      ["narr", "Hinter dem letzten Stand thront er: der Käse-Kaiser.", "Behind the last stall he sits on his throne: the Cheese Emperor."],
      ["kaese", "Wer nicht kauft, der zahlt!", "Whoever doesn't buy, pays!"],
      ["hero", "Ich kaufe nichts. Ich kämpfe!", "I'm not buying anything. I'm fighting!"]
    ],
    act2End: [
      ["kaese", "Mein … Reich … zerbröselt …", "My … empire … is crumbling …"],
      ["huber", "Es wird dunkel. Der Prater wartet – und das Riesenrad dreht sich von allein.", "It's getting dark. The Prater is waiting – and the giant wheel turns all by itself."],
      ["narr", "Akt 3: Der Prater.", "Act 3: the Prater."]
    ],
    boss3: [
      ["narr", "Das Riesenrad erwacht. Seine Gondeln leuchten wie Augen.", "The giant wheel wakes up. Its cabins glow like eyes."],
      ["riesenrad", "Steig ein – oder dreh dich für immer im Kreis!", "Get in – or go round in circles forever!"],
      ["hero", "Ich habe keine Angst!", "I'm not afraid!"]
    ],
    outro: [
      ["riesenrad", "Die Fahrt … ist … zu Ende …", "The ride … is … over …"],
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
    act1End: [
      ["hydra", "Der Stempel … ist … gültig …", "The stamp … is … valid …"],
      ["novak", "Gültig, ja. Aber Ihre Akte liegt im Archiv. Im Keller.", "Valid, yes. But your file is in the archive. In the cellar."],
      ["narr", "Akt 2: Das Archiv. Hier unten hat seit hundert Jahren niemand aufgeräumt.", "Act 2: the archive. Nobody has tidied up down here for a hundred years."]
    ],
    boss2: [
      ["narr", "Ganz unten bewegt sich etwas: der Aktenberg.", "Right at the bottom something moves: the mountain of files."],
      ["aktenberg", "Ich habe Ihre Akte. Ich habe ALLE Akten!", "I have your file. I have ALL the files!"],
      ["hero", "Ich habe Ihnen schon alles gegeben!", "I've already given you everything!"]
    ],
    act2End: [
      ["aktenberg", "Nehmen … Sie … Ihre … Akte …", "Take … your … file …"],
      ["novak", "Jetzt fehlt nur noch die Unterschrift. Im Rathaus. Ganz oben.", "Now all that's missing is the signature. In the city hall. Right at the top."],
      ["narr", "Akt 3: Das Rathaus.", "Act 3: the city hall."]
    ],
    boss3: [
      ["narr", "Auf dem Turm erwacht der eiserne Ritter: der Rathausmann.", "On the tower the iron knight awakes: the Rathausmann."],
      ["rathausmann", "Wer hier unterschreiben will, muss erzählen, was er erlebt hat!", "Whoever wants to sign here must tell what they have been through!"],
      ["hero", "Ich habe viel erlebt. Hören Sie zu!", "I've been through a lot. Listen!"]
    ],
    outro: [
      ["rathausmann", "Unterschrieben … und … gestempelt …", "Signed … and … stamped …"],
      ["novak", "Willkommen in Wien, {name}. Sie sind jetzt offiziell gemeldet.", "Welcome to Vienna, {name}. You're now officially registered."],
      ["hero", "Endlich! Jetzt brauche ich nur noch … einen Job.", "Finally! Now I just need … a job."],
      ["huber", "Sie haben genug gelernt, {name}. Zeit, ins Wien von heute zurückzukehren.", "You've learned enough, {name}. Time to return to today's Vienna."],
      ["narr", "Neue Leiter freigeschaltet: B1 – Der Job. Zurück in der Gegenwart!", "New ladder unlocked: B1 – The Job. Back in the present!"]
    ]
  },
  b1: {
    intro: [
      ["narr", "Das Licht verblasst. {name} steht wieder am Westbahnhof – im Wien von heute. Handys, Rolltreppen, Lärm.", "The light fades. {name} is back at Westbahnhof – in today's Vienna. Phones, escalators, noise."],
      ["hero", "Ich bin zurück! Und ich verstehe … fast alles!", "I'm back! And I understand … almost everything!"],
      ["huber", "Sehr gut, {name}. Aber jetzt kommt das echte Leben: {b1need}", "Very good, {name}. But now comes real life: {b1needEn}"],
      ["hero", "{b1plan}", "{b1planEn}"],
      ["huber", "Im Wien von heute sind die Sätze länger. Sie brauchen Modalverben: Ich muss eine Arbeit finden. Das zweite Verb steht am Ende.", "In today's Vienna the sentences are longer. You need modal verbs: Ich muss eine Arbeit finden. The second verb goes at the end."],
      ["huber", "Und Nebensätze: Ich lerne Deutsch, weil ich hier arbeiten will. Nach weil steht das Verb ganz am Ende.", "And subordinate clauses: Ich lerne Deutsch, weil ich hier arbeiten will. After weil the verb goes to the very end."],
      ["hero", "Modalverben und Nebensätze … Ich kann das schaffen!", "Modal verbs and subordinate clauses … I can do this!"],
      ["narr", "Erste Station: das AMS, das Arbeitsmarktservice. Die Wartenummer: 347.", "First stop: the AMS, the public employment service. Queue number: 347."]
    ],
    boss: [
      ["narr", "Am Ende des Gangs blinkt er: der Termin-Automat.", "At the end of the corridor it blinks: the appointment machine."],
      ["amsautomat", "IHR TERMIN WURDE VERSCHOBEN. BITTE BEGRÜNDEN SIE IHR ANLIEGEN.", "YOUR APPOINTMENT HAS BEEN POSTPONED. PLEASE STATE YOUR REASON."],
      ["hero", "{b1termin}", "{b1terminEn}"]
    ],
    act1End: [
      ["amsautomat", "TERMIN … BESTÄTIGT.", "APPOINTMENT … CONFIRMED."],
      ["huber", "{b1act2}", "{b1act2En}"],
      ["narr", "{b1act2narr}", "{b1act2narrEn}"]
    ],
    boss2: [
      ["narr", "Um neun Uhr hat es begonnen. Um fünf Uhr läuft es noch immer: das Endlos-Meeting.", "It started at nine. At five it's still going: the endless meeting."],
      ["meeting", "Nächster Punkt auf der Tagesordnung: Punkt siebenundvierzig von dreihundertzwölf.", "Next item on the agenda: item 47 of 312."],
      ["hero", "Ich muss jetzt etwas sagen, sonst dauert das ewig!", "I have to say something now, otherwise this will take forever!"]
    ],
    act2End: [
      ["meeting", "Das Meeting … ist … beendet.", "The meeting … is … over."],
      ["huber", "{b1act3}", "{b1act3En}"],
      ["narr", "Akt 3: {b1act3name}.", "Act 3: {b1act3name}."]
    ],
    boss3: [
      ["narr", "{b1bossIntro}", "{b1bossIntroEn}"],
      ["chef", "{b1bossQ}", "{b1bossQEn}"],
      ["hero", "{b1answer}", "{b1answerEn}"]
    ],
    outro: [
      ["chef", "{b1yes}", "{b1yesEn}"],
      ["hero", "{b1joy}", "{b1joyEn}"],
      ["huber", "Ich wusste, dass Sie es schaffen, {name}.", "I knew you would make it, {name}."],
      ["narr", "Fortsetzung folgt: B2 – die Universität.", "To be continued: B2 – the university."]
    ]
  }
};

// ---------- encounters: the ❓ stops on the map, 4 per act ----------
// Each: a picture (assets/events/<id>.jpg), a short scene and choices. A choice can cost gold or HP, ask a German question
// (quiz: right answer first in opts) with win/lose outcomes, or simply give an effect.
// Effects: gold, hp (+ heals / − hurts), maxHp, card ("pool" = random word, or a word id), rare (upgraded random word), upgrade, remove, relic.
const ENCOUNTERS = {
  "a1-0": [
    { id: "touristin", e: "🧳", title: ["Die verirrte Touristin", "The lost tourist"], who: "Touristin",
      text: ["Eine Frau mit Stadtplan sieht dich verzweifelt an: „Entschuldigung … wo ist Bahnsteig 3?“", "A woman with a city map looks at you, desperate: “Excuse me … where is platform 3?”"],
      choices: [
        { label: ["Helfen", "Help her"], quiz: { q: ["Welche Antwort passt?", "Which answer fits?"], opts: ["Er ist dort drüben, links.", "Ich heiße Bahnsteig.", "Ich bin drei Jahre alt."] },
          win: { gold: 25, say: ["„Danke schön!“ Sie gibt dir ein Trinkgeld.", "“Thank you!” She gives you a tip."] },
          lose: { say: ["Sie schaut dich verwirrt an und geht weiter.", "She looks at you, confused, and walks on."] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] },
    { id: "zeitung", e: "📰", title: ["Der Zeitungsverkäufer", "The newspaper seller"], who: "Zeitungsverkäufer",
      text: ["„Extrablatt! Extrablatt!“ Ein Junge hält dir eine Zeitung hin. Die Schlagzeile: „Heute Sonne in ganz Wien!“", "“Extra! Extra!” A boy holds out a newspaper. The headline: “Sunshine all over Vienna today!”"],
      choices: [
        { label: ["Die Schlagzeile lesen", "Read the headline"], quiz: { q: ["Wie ist das Wetter heute?", "What's the weather like today?"], opts: ["sonnig", "regnerisch", "es schneit"] },
          win: { gold: 15, say: ["„Richtig! Du liest ja schon Zeitung!“", "“Right! You're already reading the paper!”"] },
          lose: { say: ["Draußen scheint die Sonne. Hm.", "Outside, the sun is shining. Hm."] } },
        { label: ["Eine Zeitung kaufen", "Buy a newspaper"], cost: { gold: 10 }, effect: { card: "Zeitung", say: ["Neues Wort: die Zeitung.", "New word: die Zeitung."] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] },
    { id: "traeger", e: "🧑‍🔧", title: ["Der Gepäckträger", "The porter"], who: "Gepäckträger",
      text: ["„Schwerer Koffer, was? Ich trage ihn für Sie – für 20 Gold.“", "“Heavy suitcase, eh? I'll carry it for you – for 20 gold.”"],
      choices: [
        { label: ["Bezahlen und ausruhen", "Pay and rest"], cost: { gold: 20 }, effect: { hp: 14, say: ["Du gehst mit leichten Schritten weiter.", "You walk on with a spring in your step."] } },
        { label: ["Selbst tragen", "Carry it yourself"], quiz: { q: ["„Mein Koffer ist ___ schwer.“", "“My suitcase is ___ heavy.”"], opts: ["sehr", "sehen", "seid"] },
          win: { maxHp: 4, say: ["Du trägst ihn selbst – und wirst stärker. +4 max. Leben.", "You carry it yourself – and get stronger. +4 max HP."] },
          lose: { hp: -4, say: ["Uff. Dein Rücken tut weh.", "Oof. Your back hurts."] } }] },
    { id: "schaffnerin", e: "🎫", title: ["Die Schaffnerin", "The conductor"], who: "Schaffnerin",
      text: ["Eine strenge Schaffnerin stellt sich dir in den Weg: „Ihre Fahrkarte, bitte!“", "A stern conductor blocks your way: “Your ticket, please!”"],
      choices: [
        { label: ["Die Fahrkarte zeigen", "Show your ticket"], quiz: { q: ["Was sagst du, wenn du ihr die Karte gibst?", "What do you say as you hand it over?"], opts: ["Bitte schön.", "Gute Nacht.", "Wie bitte?"] },
          win: { upgrade: true, say: ["„Sehr höflich!“ Sie stempelt ein Wort in deinem Deck – es wird stärker.", "“Very polite!” She stamps a word in your deck – it gets stronger."] },
          lose: { hp: -6, say: ["„Unhöflich! Strafe!“", "“Rude! That's a fine!”"] } },
        { label: ["Weglaufen", "Run away"], effect: { hp: -3, say: ["Du entkommst – aber stolperst über einen Koffer.", "You escape – but trip over a suitcase."] } }] }
  ],
  "a1-1": [
    { id: "wuerstel", e: "🌭", title: ["Der Würstelstand", "The sausage stand"], who: "Würstelmann",
      text: ["Es riecht herrlich. Der Würstelmann wischt sich die Hände ab: „Was darf's sein?“", "It smells wonderful. The sausage man wipes his hands: “What'll it be?”"],
      choices: [
        { label: ["Auf Deutsch bestellen", "Order in German"], quiz: { q: ["Wie bestellst du richtig? (die Wurst)", "How do you order correctly? (die Wurst)"], opts: ["Eine Burenwurst, bitte!", "Ein Burenwurst, bitte!", "Einen Burenwurst, bitte!"] },
          win: { hp: 16, say: ["„Bitte sehr – mit extra Senf!“ Du fühlst dich wie neu.", "“Here you go – with extra mustard!” You feel brand new."] },
          lose: { hp: 5, say: ["Er lacht – aber du bekommst trotzdem eine Wurst.", "He laughs – but you still get a sausage."] } },
        { label: ["Einfach zeigen und zahlen", "Just point and pay"], cost: { gold: 10 }, effect: { hp: 10, say: ["Lecker, auch ohne Worte.", "Tasty, even without words."] } }] },
    { id: "gewuerz", e: "🌶️", title: ["Der Gewürzhändler", "The spice merchant"], who: "Gewürzhändler",
      text: ["„Psst! Eine magische Gewürzmischung aus dem Orient. Nur 35 Gold. Sie werden es nicht bereuen!“", "“Psst! A magical spice blend from the Orient. Only 35 gold. You won't regret it!”"],
      choices: [
        { label: ["Kaufen", "Buy it"], cost: { gold: 35 }, effect: { relic: true, say: ["Die Mischung funkelt in deiner Tasche.", "The blend sparkles in your bag."] } },
        { label: ["„Nein, danke.“", "“No, thank you.”"], effect: {} }] },
    { id: "obst", e: "🍎", title: ["Der Obststand", "The fruit stall"], who: "Obstverkäuferin",
      text: ["„Drei Äpfel kosten zwei Euro, Schatzi. Und sechs Äpfel?“", "“Three apples cost two euros, love. And six apples?”"],
      choices: [
        { label: ["Rechnen", "Do the maths"], quiz: { q: ["Sechs Äpfel kosten …", "Six apples cost …"], opts: ["vier Euro", "sechs Euro", "zwei Euro"] },
          win: { card: "Apfel", gold: 10, say: ["„Richtig! Ein Apfel geht aufs Haus.“", "“Right! One apple's on the house.”"] },
          lose: { say: ["„Nein, nein … Mathe ist nicht dein Ding, oder?“", "“No, no … maths isn't your thing, is it?”"] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] },
    { id: "dieb", e: "👜", title: ["Haltet den Dieb!", "Stop, thief!"], who: "Marktfrau",
      text: ["Eine Frau ruft: „Hilfe! Der Mann da …“ – sie zeigt auf einen Gauner mit ihrer Tasche.", "A woman shouts: “Help! That man …” – she points at a crook running off with her bag."],
      choices: [
        { label: ["Für sie rufen", "Shout for her"], quiz: { q: ["„Er hat ___ Tasche!“ (die Tasche, ihre)", "“He has ___ bag!” (die Tasche, hers)"], opts: ["ihre", "ihren", "ihr"] },
          win: { gold: 30, say: ["Alle drehen sich um, der Dieb lässt die Tasche fallen. Die Frau belohnt dich.", "Everyone turns, the thief drops the bag. The woman rewards you."] },
          lose: { hp: -5, say: ["Niemand versteht dich – und der Dieb rempelt dich um.", "Nobody understands you – and the thief knocks you over."] } },
        { label: ["Nicht einmischen", "Stay out of it"], effect: {} }] }
  ],
  "a1-2": [
    { id: "wahrsagerin", e: "🔮", title: ["Die Wahrsagerin", "The fortune teller"], who: "Wahrsagerin",
      text: ["In einem Zelt voller Kerzen flüstert eine alte Frau: „Ich sehe deine Zukunft … für 15 Gold.“", "In a tent full of candles an old woman whispers: “I see your future … for 15 gold.”"],
      choices: [
        { label: ["Zuhören", "Listen"], cost: { gold: 15 }, quiz: { q: ["Sie sagt: „Morgen ___ du Glück.“", "She says: “Tomorrow you ___ luck.”"], opts: ["hast", "habe", "hat"] },
          win: { rare: true, say: ["„Deine Zukunft ist hell!“ Ein starkes Wort erscheint in deinem Deck.", "“Your future is bright!” A strong word appears in your deck."] },
          lose: { say: ["Die Kristallkugel wird dunkel. Dein Geld ist weg.", "The crystal ball goes dark. Your money is gone."] } },
        { label: ["Lieber nicht", "Better not"], effect: {} }] },
    { id: "schiessbude", e: "🎯", title: ["Die Schießbude", "The shooting gallery"], who: "Budenbesitzer",
      text: ["„Drei Schuss, zehn Gold! Triff das richtige Ziel und gewinne!“ Auf den Zielscheiben stehen Wörter.", "“Three shots, ten gold! Hit the right target and win!” The targets have words on them."],
      choices: [
        { label: ["Schießen", "Shoot"], cost: { gold: 10 }, quiz: { q: ["Triff das <b>Verb</b>!", "Hit the <b>verb</b>!"], opts: ["schießen", "der Schuss", "schnell"] },
          win: { upgrade: true, say: ["Treffer! Du darfst ein Wort schmieden.", "Bullseye! You may upgrade a word."] },
          lose: { say: ["Daneben!", "Missed!"] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] },
    { id: "langos", e: "🥯", title: ["Der Lángos-Stand", "The lángos stand"], who: "Lángos-Bäcker",
      text: ["Frittiertes Brot mit Knoblauch – dein Magen knurrt laut.", "Fried bread with garlic – your stomach growls loudly."],
      choices: [
        { label: ["Sagen, dass du Hunger hast", "Say you're hungry"], quiz: { q: ["„Ich ___ Hunger!“", "“I'm hungry!”"], opts: ["habe", "bin", "mache"] },
          win: { hp: 16, say: ["„Na dann, guten Appetit!“", "“Well then, enjoy!”"] },
          lose: { hp: 4, say: ["„Du BIST Hunger? Komisch.“ Er gibt dir trotzdem ein Stück.", "“You ARE hunger? Strange.” He gives you a piece anyway."] } },
        { label: ["Kaufen (8 Gold)", "Buy one (8 gold)"], cost: { gold: 8 }, effect: { hp: 10 } }] },
    { id: "geisterbahn", e: "👻", title: ["Die Geisterbahn", "The ghost train"], who: "Geisterbahn",
      text: ["Ein Wagen wartet vor dem dunklen Tunnel. Ein Schild: „Nur für Mutige. Schätze im Inneren!“", "A car waits in front of the dark tunnel. A sign: “Only for the brave. Treasure inside!”"],
      choices: [
        { label: ["Einsteigen", "Get in"], cost: { hp: 8 }, effect: { rare: true, gold: 20, say: ["Gespenster, Spinnen, Schreie – und am Ende: ein Schatz!", "Ghosts, spiders, screams – and at the end: treasure!"] } },
        { label: ["Zu gruselig", "Too spooky"], effect: {} }] }
  ],
  "b1-0": [
    { id: "wartezimmer", e: "🪑", title: ["Im Wartezimmer", "In the waiting room"], who: "Mann",
      text: ["Ein Mann neben dir seufzt: „Wie lange warten Sie schon?“", "A man next to you sighs: “How long have you been waiting?”"],
      choices: [
        { label: ["Antworten", "Answer"], quiz: { q: ["Was sagst du?", "What do you say?"], opts: ["Ich warte schon seit zwei Stunden.", "Ich warte schon für zwei Stunden.", "Ich warte seit zwei Stunden schon morgen."] },
          win: { hp: 10, gold: 10, say: ["Ihr plaudert – die Zeit vergeht schneller. Er schenkt dir sein Wartezimmer-Kipferl.", "You chat – time passes faster. He gives you his waiting-room croissant."] },
          lose: { say: ["Er schaut dich verwirrt an und schläft wieder ein.", "He looks at you, confused, and falls asleep again."] } },
        { label: ["Weiterlesen", "Keep reading"], effect: {} }] },
    { id: "bewerbungsfoto", e: "📸", title: ["Das Bewerbungsfoto", "The application photo"], who: "Fotograf",
      text: ["Ein Fotograf im Gang: „Professionelle Bewerbungsfotos! Nur 20 Gold. Lächeln, bitte!“", "A photographer in the corridor: “Professional application photos! Only 20 gold. Smile, please!”"],
      choices: [
        { label: ["Foto machen", "Have a photo taken"], cost: { gold: 20 }, effect: { upgrade: true, say: ["Klick! Mit dem Foto wirkt deine Bewerbung viel stärker.", "Click! With the photo your application looks much stronger."] } },
        { label: ["Nein, danke", "No, thanks"], effect: {} }] },
    { id: "telefon", e: "📱", title: ["Ein Anruf", "A phone call"], who: "Firma",
      text: ["Dein Handy klingelt: „Guten Tag, hier ist die Firma Huber & Söhne. Haben Sie Zeit für ein Gespräch?“", "Your phone rings: “Hello, this is the company Huber & Sons. Do you have time for an interview?”"],
      choices: [
        { label: ["Einen Termin ausmachen", "Make an appointment"], quiz: { q: ["Welche Antwort ist richtig?", "Which answer is right?"], opts: ["Ja, ich habe morgen um zehn Uhr Zeit.", "Ja, ich habe Zeit morgen um zehn Uhr.", "Ja, morgen ich habe um zehn Uhr Zeit."] },
          win: { gold: 25, say: ["„Wunderbar, dann bis morgen!“ Sie zahlen sogar die Fahrtkosten.", "“Wonderful, see you tomorrow!” They even pay your travel costs."] },
          lose: { say: ["„Äh … wir melden uns.“ Klick.", "“Uh … we'll get back to you.” Click."] } },
        { label: ["Nicht abheben", "Don't answer"], effect: {} }] },
    { id: "jobmesse", e: "🎪", title: ["Die Jobmesse", "The job fair"], who: "Personalchefin",
      text: ["An einem Stand fragt eine Personalchefin: „Was möchten Sie bei uns machen?“", "At a stand an HR manager asks: “What would you like to do with us?”"],
      choices: [
        { label: ["Antworten (Modalverb)", "Answer (modal verb)"], quiz: { q: ["Was sagst du?", "What do you say?"], opts: ["Ich möchte im Büro arbeiten.", "Ich möchte im Büro arbeite.", "Ich möchte arbeiten im Büro."] },
          win: { rare: true, say: ["„Sehr gut!“ Sie gibt dir eine Visitenkarte – und ein starkes Wort.", "“Very good!” She gives you a business card – and a strong word."] },
          lose: { say: ["„Danke, der Nächste bitte!“", "“Thank you, next please!”"] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] }
  ],
  "b1-1": [
    { id: "kaffeekueche", e: "🫖", title: ["In der Kaffeeküche", "In the office kitchen"], who: "Kollegin",
      text: ["Eine Kollegin sieht dich an: „Warum bist du so müde?“", "A colleague looks at you: “Why are you so tired?”"],
      choices: [
        { label: ["Antworten (weil)", "Answer (weil)"], quiz: { q: ["Was sagst du?", "What do you say?"], opts: ["Weil ich gestern lange gearbeitet habe.", "Weil ich habe gestern lange gearbeitet.", "Weil gestern ich lange gearbeitet habe."] },
          win: { hp: 14, say: ["„Oje! Hier, nimm meinen Kaffee.“", "“Oh dear! Here, take my coffee.”"] },
          lose: { hp: 4, say: ["Sie lacht – und gibt dir trotzdem einen Keks.", "She laughs – and gives you a biscuit anyway."] } },
        { label: ["Einfach Kaffee trinken", "Just drink coffee"], effect: { hp: 6 } }] },
    { id: "druckerstau", e: "🖨️", title: ["Papierstau!", "Paper jam!"], who: "Drucker",
      text: ["Der Drucker piept, blinkt und frisst dein Dokument. Du rufst die IT an.", "The printer beeps, blinks and eats your document. You call IT."],
      choices: [
        { label: ["Das Problem erklären", "Explain the problem"], quiz: { q: ["Was sagst du der IT?", "What do you tell IT?"], opts: ["Der Drucker funktioniert nicht.", "Der Drucker funktionieren nicht.", "Der Drucker nicht funktioniert."] },
          win: { upgrade: true, say: ["„Ah, verstanden – schon repariert!“ Dein Wort kommt schärfer aus dem Drucker.", "“Ah, got it – fixed!” Your word comes out of the printer sharper."] },
          lose: { say: ["„Haben Sie ihn schon aus- und wieder eingeschaltet?“", "“Have you tried turning it off and on again?”"] } },
        { label: ["Gegen den Drucker treten", "Kick the printer"], effect: { hp: -4, gold: 15, say: ["Au! Aber aus dem Drucker fallen ein paar Münzen.", "Ouch! But a few coins fall out of the printer."] } }] },
    { id: "geburtstag", e: "🎂", title: ["Ein Geburtstag im Büro", "A birthday at the office"], who: "Kollege",
      text: ["Ein Kollege hat Geburtstag. Auf dem Tisch steht eine riesige Torte.", "A colleague has his birthday. There's a huge cake on the table."],
      choices: [
        { label: ["Gratulieren", "Congratulate"], quiz: { q: ["Was sagst du?", "What do you say?"], opts: ["Alles Gute zum Geburtstag!", "Gute Besserung!", "Frohe Ostern!"] },
          win: { hp: 12, say: ["„Danke! Nimm ein großes Stück!“", "“Thanks! Take a big piece!”"] },
          lose: { say: ["Alle schauen dich komisch an. Keine Torte für dich.", "Everyone looks at you strangely. No cake for you."] } },
        { label: ["Ein Geschenk kaufen (10 Gold)", "Buy a present (10 gold)"], cost: { gold: 10 }, effect: { maxHp: 4, hp: 8, say: ["Er freut sich riesig – und du bekommst das größte Stück.", "He's delighted – and you get the biggest piece."] } }] },
    { id: "homeoffice", e: "🏠", title: ["Homeoffice?", "Working from home?"], who: "Chefin",
      text: ["Die Chefin kommt vorbei. Morgen willst du von zu Hause arbeiten. Du musst fragen.", "The boss comes by. Tomorrow you want to work from home. You have to ask."],
      choices: [
        { label: ["Höflich fragen (Modalverb)", "Ask politely (modal verb)"], quiz: { q: ["Wie fragst du?", "How do you ask?"], opts: ["Darf ich morgen von zu Hause arbeiten?", "Darf ich morgen von zu Hause arbeite?", "Ich darf morgen von zu Hause arbeiten?"] },
          win: { remove: true, say: ["„Natürlich!“ Zu Hause räumst du auf – ein Wort fliegt aus deinem Deck.", "“Of course!” At home you tidy up – a word leaves your deck."] },
          lose: { say: ["„Wie bitte? Kommen Sie morgen lieber ins Büro.“", "“Pardon? Better come to the office tomorrow.”"] } },
        { label: ["Lieber nicht fragen", "Better not ask"], effect: {} }] }
  ],
  "b1-2": [
    { id: "teepause", e: "🍵", title: ["Kurz vor der Präsentation", "Just before the presentation"], who: "Kollegin",
      text: ["Deine Kollegin bringt dir einen Tee: „Ich glaube, … du das schaffst.“", "Your colleague brings you a tea: “I think … you can do it.”"],
      choices: [
        { label: ["Den Satz ergänzen", "Complete the sentence"], quiz: { q: ["Welches Wort fehlt?", "Which word is missing?"], opts: ["dass", "weil", "obwohl"] },
          win: { hp: 14, say: ["„Genau! Ich glaube, dass du das schaffst.“ Du fühlst dich ruhiger.", "“Exactly! I think that you can do it.” You feel calmer."] },
          lose: { hp: 4, say: ["Sie lächelt trotzdem. Der Tee hilft ein bisschen.", "She smiles anyway. The tea helps a little."] } },
        { label: ["Tief durchatmen", "Take a deep breath"], effect: { hp: 6 } }] },
    { id: "folienfehler", e: "📝", title: ["Ein Fehler auf der Folie", "A mistake on the slide"], who: "Folie",
      text: ["Auf deiner wichtigsten Folie steht: „Unser Projekt … sehr erfolgreich.“ Ein Wort fehlt!", "Your most important slide says: “Our project … very successful.” A word is missing!"],
      choices: [
        { label: ["Schnell korrigieren", "Fix it quickly"], quiz: { q: ["Welches Wort fehlt?", "Which word is missing?"], opts: ["ist", "sind", "bin"] },
          win: { upgrade: true, say: ["Perfekt korrigiert – eines deiner Wörter wird stärker.", "Perfectly fixed – one of your words gets stronger."] },
          lose: { say: ["Der Fehler bleibt. Niemand sagt etwas … hoffentlich.", "The mistake stays. Nobody says anything … hopefully."] } },
        { label: ["Ignorieren", "Ignore it"], effect: {} }] },
    { id: "kundenfrage", e: "🤝", title: ["Die Frage des Kunden", "The customer's question"], who: "Kunde",
      text: ["Ein wichtiger Kunde hebt die Hand: „Wann können Sie liefern?“", "An important customer raises his hand: “When can you deliver?”"],
      choices: [
        { label: ["Antworten (Modalverb)", "Answer (modal verb)"], quiz: { q: ["Was sagst du?", "What do you say?"], opts: ["Wir können nächste Woche liefern.", "Wir können liefern nächste Woche.", "Wir liefern können nächste Woche."] },
          win: { gold: 30, say: ["„Ausgezeichnet!“ Der Kunde unterschreibt sofort – du bekommst einen Bonus.", "“Excellent!” The customer signs right away – you get a bonus."] },
          lose: { hp: -4, say: ["„Aha …“ Der Kunde runzelt die Stirn. Unangenehm.", "“I see …” The customer frowns. Awkward."] } },
        { label: ["An die Kollegin weitergeben", "Pass it to your colleague"], effect: {} }] },
    { id: "fahrstuhl", e: "🛗", title: ["Im Fahrstuhl mit dem Chef", "In the lift with the boss"], who: "Chef",
      text: ["Die Fahrstuhltür geht zu. Neben dir: der Chef. Er fragt: „Wie war Ihr Wochenende?“", "The lift door closes. Next to you: the boss. He asks: “How was your weekend?”"],
      choices: [
        { label: ["Small Talk wagen", "Try some small talk"], quiz: { q: ["Was sagst du?", "What do you say?"], opts: ["Es war sehr schön, danke!", "Es ist sehr schön, danke morgen!", "Ich war schön."] },
          win: { relic: true, say: ["Er lächelt sogar. Beim Aussteigen gibt er dir etwas: „Für Sie. Viel Glück!“", "He even smiles. Getting out, he gives you something: “For you. Good luck!”"] },
          lose: { hp: -5, say: ["Peinliche Stille bis zum zwölften Stock.", "Awkward silence up to the twelfth floor."] } },
        { label: ["Schweigen und aufs Handy schauen", "Stay silent and look at your phone"], effect: {} }] }
  ],
  "a2-0": [
    { id: "kaffeeautomat", e: "☕", title: ["Der Kaffeeautomat", "The coffee machine"], who: "Kaffeeautomat",
      text: ["Du wirfst eine Münze ein. Der Automat brummt – und nichts passiert. Ein Beamter fragt: „Was ist passiert?“", "You put in a coin. The machine hums – and nothing happens. An official asks: “What happened?”"],
      choices: [
        { label: ["Erklären (Perfekt)", "Explain (Perfekt)"], quiz: { q: ["Was ist passiert?", "What happened?"], opts: ["Der Automat hat mein Geld genommen.", "Der Automat hat mein Geld genehmt.", "Der Automat ist mein Geld genommen."] },
          win: { gold: 20, hp: 6, say: ["Er gibt dir dein Geld zurück – und einen Kaffee.", "He gives you your money back – and a coffee."] },
          lose: { say: ["„Wie bitte?“ Er zuckt mit den Schultern.", "“Pardon?” He shrugs."] } },
        { label: ["Gegen den Automaten treten", "Kick the machine"], effect: { hp: -3, gold: 12, say: ["Au! Aber ein paar Münzen fallen heraus.", "Ouch! But a few coins fall out."] } }] },
    { id: "wartenummer", e: "🔢", title: ["Die Wartenummer", "The queue number"], who: "Herr Novak",
      text: ["Du ziehst Nummer 347. Auf der Anzeige steht: 112. Herr Novak gähnt hinter seinem Schalter.", "You draw number 347. The display shows: 112. Herr Novak yawns behind his counter."],
      choices: [
        { label: ["Höflich fragen", "Ask politely"], quiz: { q: ["Wie fragst du höflich?", "How do you ask politely?"], opts: ["Könnten Sie mir bitte helfen?", "Helfen Sie mir!", "Du hilfst mir jetzt!"] },
          win: { remove: true, say: ["„Na gut …“ Er streicht ein Wort aus deinem Deck – Platz für Besseres.", "“Oh, all right …” He crosses a word out of your deck – room for better ones."] },
          lose: { say: ["„Nummer 347? Warten Sie.“", "“Number 347? Wait.”"] } },
        { label: ["Warten und dösen", "Wait and doze"], effect: { hp: 10, say: ["Drei Stunden später bist du gut ausgeruht.", "Three hours later you're well rested."] } }] },
    { id: "stempel_kollegin", e: "🖋️", title: ["Die Kollegin mit dem Stempel", "The colleague with the stamp"], who: "Beamtin",
      text: ["Eine Beamtin hält ihren Stempel in die Luft: „Wem geben Sie das Formular?“", "An official holds her stamp in the air: “To whom are you giving the form?”"],
      choices: [
        { label: ["Antworten (Dativ)", "Answer (Dativ)"], quiz: { q: ["„Ich gebe ___ Beamtin das Formular.“", "“I give the form to the official.”"], opts: ["der", "die", "dem"] },
          win: { upgrade: true, say: ["*STEMPEL!* Ein Wort in deinem Deck wird offiziell stärker.", "*STAMP!* A word in your deck becomes officially stronger."] },
          lose: { hp: -5, say: ["„Falsches Formular!“ Sie stempelt dir auf die Hand.", "“Wrong form!” She stamps your hand."] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] },
    { id: "formular", e: "📋", title: ["Das verlorene Formular", "The lost form"], who: "Hausmeister",
      text: ["Der Hausmeister flüstert: „Ich habe ein ausgefülltes Formular B-12 gefunden. 25 Gold, und es gehört Ihnen.“", "The caretaker whispers: “I found a filled-in form B-12. 25 gold and it's yours.”"],
      choices: [
        { label: ["Kaufen", "Buy it"], cost: { gold: 25 }, effect: { maxHp: 6, say: ["Mit dem Formular fühlst du dich sicherer. +6 max. Leben.", "With the form you feel safer. +6 max HP."] } },
        { label: ["„Das ist doch illegal!“", "“That's illegal!”"], effect: {} }] }
  ],
  "a2-1": [
    { id: "geisterbeamter", e: "🕯️", title: ["Der Geisterbeamte", "The ghost clerk"], who: "Geisterbeamter",
      text: ["Ein durchsichtiger Beamter schwebt zwischen den Regalen: „Für das Protokoll: Was haben Sie gestern gemacht?“", "A see-through clerk floats between the shelves: “For the record: what did you do yesterday?”"],
      choices: [
        { label: ["Antworten (Perfekt)", "Answer (Perfekt)"], quiz: { q: ["Was haben Sie gestern gemacht?", "What did you do yesterday?"], opts: ["Ich habe gearbeitet.", "Ich bin gearbeitet.", "Ich habe arbeitet."] },
          win: { rare: true, say: ["„Korrekt protokolliert.“ Er schenkt dir ein seltenes Wort.", "“Correctly recorded.” He gives you a rare word."] },
          lose: { hp: -6, say: ["„Fehler im Protokoll!“ Ein kalter Wind fährt durch dich.", "“Error in the record!” A cold wind blows through you."] } },
        { label: ["Schnell weiter", "Hurry on"], effect: {} }] },
    { id: "kiste", e: "📦", title: ["Die verstaubte Kiste", "The dusty box"], who: "Kiste",
      text: ["In einer Ecke steht eine Kiste mit der Aufschrift „1899 – NICHT ÖFFNEN“.", "In a corner there's a box labelled “1899 – DO NOT OPEN”."],
      choices: [
        { label: ["Öffnen", "Open it"], cost: { hp: 6 }, effect: { gold: 40, say: ["Eine Staubwolke – und alte Goldmünzen!", "A cloud of dust – and old gold coins!"] } },
        { label: ["Lieber nicht", "Better not"], effect: {} }] },
    { id: "archivkatze", e: "🐈‍⬛", title: ["Die Archivkatze", "The archive cat"], who: "Archivkatze",
      text: ["Eine schwarze Katze sieht dich an und läuft in einen Gang. Sie kennt den Weg.", "A black cat looks at you and walks into a corridor. It knows the way."],
      choices: [
        { label: ["Ihr folgen (Dativ)", "Follow it (Dativ)"], quiz: { q: ["„Ich folge ___ Katze.“", "“I follow the cat.”"], opts: ["der", "die", "den"] },
          win: { hp: 12, gold: 10, say: ["Sie führt dich zu einem warmen Plätzchen – und ein paar Münzen.", "It leads you to a warm spot – and a few coins."] },
          lose: { say: ["Du verlierst sie aus den Augen.", "You lose sight of it."] } },
        { label: ["Weitergehen", "Walk on"], effect: {} }] },
    { id: "tagebuch", e: "📔", title: ["Das alte Tagebuch", "The old diary"], who: "Tagebuch",
      text: ["Auf einem Pult liegt ein Tagebuch. Du liest: „Am 3. Mai 1900 bin ich nach Wien gekommen.“", "A diary lies on a desk. You read: “On 3 May 1900 I came to Vienna.”"],
      choices: [
        { label: ["Verstehen", "Understand it"], quiz: { q: ["Was ist passiert?", "What happened?"], opts: ["Jemand ist nach Wien gekommen.", "Jemand hat Wien verlassen.", "Jemand kommt morgen nach Wien."] },
          win: { card: "perf", say: ["Die Seite leuchtet: eine neue ⏪ Perfekt-Karte!", "The page glows: a new ⏪ Perfekt card!"] },
          lose: { say: ["Die Buchstaben verschwimmen.", "The letters blur."] } },
        { label: ["Zuklappen", "Close it"], effect: {} }] }
  ],
  "a2-2": [
    { id: "ball", e: "💃", title: ["Der Rathausball", "The city hall ball"], who: "Tänzer",
      text: ["Walzermusik. Ein eleganter Herr verbeugt sich vor dir: „Darf ich bitten?“", "Waltz music. An elegant gentleman bows to you: “Darf ich bitten?”"],
      choices: [
        { label: ["Verstehen", "Understand"], quiz: { q: ["„Darf ich bitten?“ heißt …", "“Darf ich bitten?” means …"], opts: ["Darf ich um diesen Tanz bitten?", "Darf ich bezahlen?", "Darf ich gehen?"] },
          win: { maxHp: 6, hp: 6, say: ["Ihr tanzt einen Walzer – du fühlst dich leicht wie eine Feder.", "You dance a waltz – you feel light as a feather."] },
          lose: { say: ["Du gibst ihm deine Geldbörse. Er schaut verwirrt.", "You hand him your wallet. He looks confused."] } },
        { label: ["Am Rand stehen", "Stay on the side"], effect: {} }] },
    { id: "buffet", e: "🍰", title: ["Das Buffet", "The buffet"], who: "Kellner",
      text: ["Torten, Brötchen, Sekt – ein Kellner fragt: „Was hätten Sie gern?“", "Cakes, rolls, sparkling wine – a waiter asks: “What would you like?”"],
      choices: [
        { label: ["Bestellen", "Order"], quiz: { q: ["„Ich hätte gern ___ Stück Torte.“ (das Stück)", "“I'd like a piece of cake.” (das Stück)"], opts: ["ein", "einen", "eine"] },
          win: { hp: 16, say: ["„Sehr gern!“ Die Sachertorte ist himmlisch.", "“With pleasure!” The Sachertorte is heavenly."] },
          lose: { hp: 5, say: ["Er bringt dir … eine Gurke. Besser als nichts.", "He brings you … a pickle. Better than nothing."] } },
        { label: ["Trinkgeld geben (15 Gold)", "Tip generously (15 gold)"], cost: { gold: 15 }, effect: { hp: 20, say: ["Der Kellner bringt dir das Beste vom Buffet.", "The waiter brings you the best of the buffet."] } }] },
    { id: "wappenmaler", e: "🎨", title: ["Der Wappenmaler", "The coat-of-arms painter"], who: "Wappenmaler",
      text: ["Ein Maler arbeitet an einem riesigen Wappen: „Ich zeige es gleich dem Bürgermeister!“", "A painter is working on a huge coat of arms: “I'm about to show it to the mayor!”"],
      choices: [
        { label: ["Den Satz wiederholen (Dativ)", "Repeat the sentence (Dativ)"], quiz: { q: ["„Ich zeige ___ Bürgermeister das Wappen.“", "“I show the coat of arms to the mayor.”"], opts: ["dem", "den", "der"] },
          win: { upgrade: true, say: ["„Bravo!“ Er malt ein goldenes Zeichen auf eines deiner Wörter.", "“Bravo!” He paints a golden mark on one of your words."] },
          lose: { say: ["Er hört dich nicht – er malt weiter.", "He doesn't hear you – he keeps painting."] } },
        { label: ["Ein Bild kaufen (20 Gold)", "Buy a painting (20 gold)"], cost: { gold: 20 }, effect: { upgrade: true } }] },
    { id: "schluessel", e: "🗝️", title: ["Der geheimnisvolle Schlüssel", "The mysterious key"], who: "Schlüssel",
      text: ["Hinter einem Vorhang schwebt ein goldener Schlüssel. Er glüht. Wer ihn nimmt, zahlt einen Preis.", "Behind a curtain a golden key floats. It glows. Whoever takes it pays a price."],
      choices: [
        { label: ["Nehmen", "Take it"], cost: { hp: 10 }, effect: { relic: true, say: ["Der Schlüssel brennt in deiner Hand – und verwandelt sich in ein Relikt.", "The key burns in your hand – and turns into a relic."] } },
        { label: ["Liegen lassen", "Leave it"], effect: {} }] }
  ]
};
