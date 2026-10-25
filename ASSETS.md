# Satzschmiede – art prompts for Gemini 🎨

The game looks for images in the `assets/` folder. Anything missing falls back to an emoji, so you can add images one by one.

## The look: "the hidden Vienna"

The heroes live in today's Vienna. Frau Huber's word cards reveal a hidden, storybook layer of the city, where words come alive as monsters. So backgrounds and monsters look timeless and magical (gas lamps, brass, steam, old wood), while the heroes and their things stay modern.

## How to make them

1. Open Gemini (gemini.google.com) and start **one chat for all images**, so the style stays consistent.
2. Send the **style message** below first. Then send the prompts one at a time.
3. If an image comes out in a different style, reply: *"Same style as the earlier images, please – painterly storybook, warm lantern light."*
4. Download each image and save it as **JPG** (Gemini's download format is fine) with the **exact file name** shown, in the folder shown (e.g. `assets/enemies/taube.jpg`).
5. Run `build.ps1` afterwards. It shrinks the images so the game stays fast on your phone.

Squares (1:1) work best for characters. Backgrounds should be tall (9:16).

---

## Style message (send this first)

> I'm making a card game called "Satzschmiede" about a newcomer learning German in Vienna. Please create all images in ONE consistent style: **painterly digital illustration in a whimsical European storybook style**, visible soft brush strokes, warm lantern light, muted palette of deep teal, moss green, amber and burnt orange, gentle paper grain, cosy but slightly mysterious mood. The world is "the hidden Vienna": a magical storybook version of the city with gas lamps, brass and steam, but the heroes are modern people with modern clothes and gadgets (phones, tablets, laptops), which can glow with a little magic. Characters are centred, shown from the waist or chest up, with a simple softly blurred background in the scene's colours. No text, no letters, no logos, no frames, no watermarks. Reply "ready" and then I'll send the images one by one.

---

## Heroes → `assets/heroes/`

| File | Prompt |
|---|---|
| `rafa.jpg` | Square portrait of Rafa, a friendly Brazilian cook in his late twenties, warm brown skin, curly dark hair, short beard, rolled-up sleeves and a slightly stained apron, holding a wooden spoon like a sword, confident smile, standing at a Viennese train station at dawn. |
| `mei.jpg` | Square portrait of Mei, a Taiwanese software developer in her late twenties, black bob haircut, round glasses, cosy oversized hoodie, laptop bag across her shoulder, glowing tablet in one hand like a spellbook, curious determined expression, Viennese train station at dawn. |
| `amara.jpg` | Square portrait of Amara, a Ghanaian nurse in her early thirties, dark skin, braided hair tied up, nurse's cardigan over scrubs, small medical bag, calm strong smile, steady posture like a seasoned adventurer, Viennese train station at dawn. |

## Story characters → `assets/npc/`

| File | Prompt |
|---|---|
| `huber.jpg` | Square portrait of Frau Huber, a kind elderly Viennese lady with silver hair in a bun, a green felt hat with a small feather, a traditional Austrian jacket, holding a deck of glowing word cards out to the viewer, twinkle in her eye, cosy café light. |
| `novak.jpg` | Square portrait of Herr Novak, a tired Viennese civil servant in his fifties, moustache, reading glasses on his nose, beige cardigan, a mountain of paper forms and rubber stamps on his desk, deadpan expression, dim office with green walls. |
| `sphinx.jpg` | Square portrait of a friendly sphinx made of old books and parchment, lion body with paper wings, wearing small reading glasses, sitting on a stack of dictionaries in a candle-lit library, mysterious smile. |

| `wotruba.jpg` | Square portrait of Herr Wotruba, a jovial but shrewd Viennese corner-shop owner ("Greißler") in his sixties, round face, bushy grey moustache, flat cap, striped shirt with sleeve garters and a brown apron, leaning on a wooden counter full of jars, bread rolls and sausages, a sly haggling grin, warm lantern light. |

## A1 enemies – "Ankunft" (train station) → `assets/enemies/`

| File | Prompt |
|---|---|
| `assel.jpg` | Square image of the "Artikel-Assel": a small cute woodlouse monster whose armour plates are each painted with "der", "die", "das" style patterns (no readable text), crawling out of a crack in an old station floor, more silly than scary. |
| `taube.jpg` | Square image of the "Taschendieb-Taube": a sly Viennese pickpocket pigeon wearing a tiny flat cap and a striped scarf, clutching a stolen word card in its beak, perched on a station bench. |
| `kontrolleur.jpg` | Square image of "Der Kontrolleur": a stern ticket inspector golem in a dark uniform and peaked cap, hole-punch for a hand, glowing eyes under the cap brim, holding out his palm demanding a ticket, tram interior. |
| `regen.jpg` | Square image of the "Wiener Regenwolke": a grumpy little storm cloud with a face, wearing a bowler hat, raining on a cobblestone street with old Viennese lanterns. |
| `hausmeister.jpg` | Square image of "Der Hausmeister": a huge grumbling caretaker ogre with a broom and a giant ring of keys on his belt, blue work coat, standing in a Viennese stairwell, imposing elite enemy. |
| `automat.jpg` | Square image of "Der Fahrkartenautomat": a towering ticket-machine boss monster from a 1900s train station, brass and wood body, glowing screen-face, coin slot mouth, paper tickets spilling like a tongue, steam vents, dramatic boss lighting. |

## A2 enemies – "Das Amt" (the office) → `assets/enemies/`

| File | Prompt |
|---|---|
| `kobold.jpg` | Square image of the "Akkusativ-Kobold": a mischievous green goblin office worker in a too-big suit, hiding behind a waiting-room chair, holding a pointy fountain pen like a dagger. |
| `stempel.jpg` | Square image of the "Stempel-Spinne": a spider made of rubber stamps, each leg ending in a stamp leaving red ink marks, crawling over a desk full of papers. |
| `schlange.jpg` | Square image of the "Warteschlangen-Wurm": an endlessly long sleepy worm made of linked waiting-room chairs and queue number tickets, winding through a beige office corridor. |
| `papagei.jpg` | Square image of the "Paragrafen-Papagei": a pompous parrot in a tiny judge's robe, perched on a stack of law books, beak open mid-lecture, colourful feathers. |
| `drache.jpg` | Square image of the "Dativ-Drache": an elegant dragon made of folded official paper and wax seals, coiled around a filing cabinet, breathing a stream of glowing ink, elite enemy. |
| `hydra.jpg` | Square image of "Die Formular-Hydra": a multi-headed hydra boss made of forms, folders and paperclips, each head a crumpled form with angry eyes, rising out of a mountain of paperwork in a dim government office, dramatic boss lighting. |

## Backgrounds → `assets/bg/` (tall 9:16, no characters)

| File | Prompt |
|---|---|
| `a1.jpg` | Tall 9:16 background: the grand hall of an old Viennese train station at dawn, iron and glass roof, warm light through steam, empty platforms, a sausage stand in the distance, no people. |
| `a2.jpg` | Tall 9:16 background: a long, slightly eerie corridor inside an old Viennese government office, green-painted walls, numbered doors, waiting chairs, stacks of paper, a flickering lamp, no people. |

## The language tower → `assets/tower/` and `assets/bg/` (NEW)

The ladder screen becomes a painted tower: one tall background plus a "window" per floor showing that ladder's place.
The windows reuse the backgrounds (`assets/bg/<ladder>.jpg`), so B1–C2 also get their battle backgrounds from these.

| File | Prompt |
|---|---|
| `tower/tower.jpg` | Tall 9:16 painting of a magical Viennese clock tower seen from below at dusk, six storeys stacked on top of each other, each storey a different architectural style rising from a 1900s train station at the bottom to an old coffee house with a glowing dome at the top, a winding golden staircase spiralling up the outside, lanterns, floating word cards drifting like leaves, warm and mysterious storybook light, no text, no people. |
| `bg/b1.jpg` | Tall 9:16 background: a modern open-plan office in today's Vienna, Leopoldstadt, big windows with a view of the Danube canal, laptops, plants, a coffee machine, a whiteboard full of sticky notes, morning light, no people, no readable text. |
| `bg/b2.jpg` | Tall 9:16 background: the grand arcaded courtyard and a lecture hall of the University of Vienna, stone columns, busts of scholars, rows of wooden benches, tall windows, golden afternoon light, no people. |
| `bg/c1.jpg` | Tall 9:16 background: a busy newspaper editorial office on the Ringstraße at night, desks piled with papers, old printing press in the back, a window showing the Vienna State Opera lit up, green desk lamps, no people, no readable text. |
| `bg/c2.jpg` | Tall 9:16 background: the inside of a traditional, smoky Viennese coffee house (like Café Hawelka), dark wood panelling, old posters (unreadable), marble tables, bentwood chairs, a coat rack, warm dim light, no people. |

## Acts 2 and 3 (NEW) – each ladder becomes three acts with its own boss

| File | Prompt |
|---|---|
| `bg/a1-2.jpg` | Tall 9:16 background: the Naschmarkt in old Vienna at midday, rows of market stalls with striped awnings, mountains of vegetables, spices and cheeses, hanging sausages, cobblestones, no people. |
| `bg/a1-3.jpg` | Tall 9:16 background: the Prater amusement park in old Vienna at dusk, the giant Ferris wheel (Riesenrad) glowing in the background, carousels, lanterns, a ghost-train entrance, no people. |
| `bg/a2-2.jpg` | Tall 9:16 background: the endless archive in the cellar of a Viennese government office, towering shelves of dusty files, candle light, cobwebs, a narrow ladder, mysterious glow far away, no people. |
| `bg/a2-3.jpg` | Tall 9:16 background: the grand ballroom of Vienna City Hall (Rathaus), neo-Gothic arches, huge chandeliers, a red carpet leading to a throne-like mayor's chair, no people. |

**A1 · Act 2 – Naschmarkt** → `assets/enemies/`

| File | Prompt |
|---|---|
| `gurke.jpg` | Square image of the "Gurken-Gauner": a sneaky pickle bandit with a tiny mask and a bag of stolen coins, hiding in a jar at a market stall. |
| `schreier.jpg` | Square image of the "Marktschreier": a loud market crier made of a giant cabbage with a huge moustache, shouting through a paper megaphone. |
| `wespe.jpg` | Square image of the "Würstel-Wespe": a chubby wasp wearing a chef's hat, buzzing around a sausage stand with a mustard-dripping stinger. |
| `kraut.jpg` | Square image of the "Kraut-Golem": a hulking golem made of sauerkraut barrels and cabbages, stomping through a market. |
| `standlerin.jpg` | Square image of "Die Standlerin" (elite): a formidable market-stall lady with rolled-up sleeves, a giant scale as a shield and a ladle as a weapon, fierce but funny. |
| `kaese.jpg` | Square image of "Der Käse-Kaiser" (boss): an enormous emperor made of Emmental cheese wearing a golden crown and a fur cloak, sitting on a throne of cheese wheels, dramatic boss lighting. |

**A1 · Act 3 – Prater**

| File | Prompt |
|---|---|
| `pony.jpg` | Square image of the "Ringelspiel-Pony": a wooden carousel horse that came to life, chipped paint, golden pole still through its back, mischievous grin. |
| `watte.jpg` | Square image of the "Zuckerwatte-Geist": a fluffy pink cotton-candy ghost floating over a fairground, sticky and silly. |
| `spiegel.jpg` | Square image of the "Spiegel-Doppelgänger": a warped funhouse-mirror creature showing a distorted reflection, in a hall of mirrors. |
| `fledermaus.jpg` | Square image of the "Geisterbahn-Fledermaus": a theatrical bat from an old ghost train ride, cardboard wings, glowing red eyes, on rails. |
| `watschenmann.jpg` | Square image of "Der Watschenmann" (elite): the famous old Prater punching-dummy figure, a grumpy padded wooden man with a leather face, come to life with big fists. |
| `riesenrad.jpg` | Square image of "Das Riesenrad" (boss): the Vienna Ferris wheel come alive as a giant, its red cabins like glowing eyes, steel spokes like arms, towering over the Prater at night, dramatic boss lighting. |

**A2 · Act 2 – Das Archiv**

| File | Prompt |
|---|---|
| `aktenmaus.jpg` | Square image of the "Akten-Maus": a tiny grey mouse in a clerk's sleeve protectors, nibbling on a file, wearing glasses. |
| `staub.jpg` | Square image of the "Staub-Gespenst": a ghost made of swirling dust and loose paper, drifting between shelves. |
| `ordner.jpg` | Square image of the "Ordner-Mimic": a filing box with sharp paper teeth and a long tongue made of a ribbon, lurking on a shelf. |
| `krake.jpg` | Square image of the "Tintenfass-Krake": a small octopus living in a giant inkwell, each tentacle holding a different pen. |
| `archivar.jpg` | Square image of "Der Archivar" (elite): an ancient skeletal archivist with a long beard, a lantern and a gigantic key ring, eyes glowing, in endless shelves. |
| `aktenberg.jpg` | Square image of "Der Aktenberg" (boss): a mountain of files that rises up as a giant with a face of folders, paperclip teeth and rubber-stamp fists, dramatic boss lighting. |

**A2 · Act 3 – Das Rathaus**

| File | Prompt |
|---|---|
| `loewe.jpg` | Square image of the "Wappen-Löwe": a heraldic lion stepping out of a coat of arms, gilded and proud. |
| `walzer.jpg` | Square image of the "Ballsaal-Geist": an elegant ghost couple waltzing endlessly in a ballroom, translucent, in 1900s ball gowns and tailcoats. |
| `pfau.jpg` | Square image of the "Protokoll-Pfau": a pompous peacock whose tail feathers are official documents with wax seals. |
| `siegel.jpg` | Square image of the "Siegel-Golem": a golem made of red sealing wax, a big official seal for a face. |
| `sekretaer.jpg` | Square image of "Der Obersekretär" (elite): a towering, many-armed secretary juggling telephones, typewriters and appointment books. |
| `rathausmann.jpg` | Square image of "Der Rathausmann" (boss): the iron knight statue from the top of Vienna City Hall, come alive and gigantic, holding a banner lance, armour glinting, dramatic boss lighting. |

## Wide backgrounds for PC (optional) → `assets/bg/<name>-wide.jpg`

The backgrounds are tall (9:16) for phones. On a PC the game shows them sharp in the middle with darkened sides.
For a full-width picture on PC, make a **wide 16:9 version** – the game picks it automatically on wide screens.

**How:** in Gemini, upload the existing image and send:
> Recreate this exact scene as a wide 16:9 landscape image. Same painterly storybook style, same colours and light, same place – extend it naturally to the left and right. No people, no text.

| Original | Save the wide version as |
|---|---|
| `bg/a1.jpg` (Westbahnhof) | `bg/a1-wide.jpg` |
| `bg/a1-modern.jpg` (today's station) | `bg/a1-modern-wide.jpg` |
| `bg/a1-2.jpg` (Naschmarkt) | `bg/a1-2-wide.jpg` |
| `bg/a1-3.jpg` (Prater) | `bg/a1-3-wide.jpg` |
| `bg/a2.jpg` (Amt) | `bg/a2-wide.jpg` |
| `bg/a2-2.jpg` (Archiv) | `bg/a2-2-wide.jpg` |
| `bg/a2-3.jpg` (Rathaus) | `bg/a2-3-wide.jpg` |

**Portal video for PC (optional):** in Flow, make the portal again in **16:9** (first frame `a1-modern-wide.jpg`, last frame `a1-wide.jpg`, same prompt as in ANIMATIONS.md) and save it as `assets/video/portal-wide.mp4`.

## Encounters (NEW) → `assets/events/`

The ❓ stops on the map are now little scenes. One picture each (square, like the enemies). Until a picture exists, an emoji stands in.

| File | Prompt |
|---|---|
| `touristin.jpg` | Square image: a lost lady tourist in 1900s travelling clothes holding a big unfolded city map upside down, suitcase beside her, on a busy old Viennese train platform. Painterly storybook style, warm lantern light, no text. |
| `zeitung.jpg` | Square image: a cheeky newspaper boy in a flat cap waving a newspaper (no readable text), inside an old Viennese train station hall with steam. Painterly storybook style, warm lantern light, no text. |
| `traeger.jpg` | Square image: a strong, friendly train-station porter with a red cap and a luggage trolley piled with suitcases, offering to help, old Vienna station. Painterly storybook style, warm lantern light, no text. |
| `schaffnerin.jpg` | Square image: a stern but fair female train conductor in a 1900s uniform and cap, holding out her hand for a ticket, hole-punch in the other hand, train carriage. Painterly storybook style, warm lantern light, no text. |
| `wuerstel.jpg` | Square image: a cosy Viennese sausage stand (Würstelstand) at night with steam rising, a jolly sausage seller with a moustache holding a sausage with mustard. Painterly storybook style, warm lantern light, no text. |
| `gewuerz.jpg` | Square image: a mysterious spice merchant in a turban whispering behind a stall of colourful spice mountains and glowing jars, Naschmarkt. Painterly storybook style, warm lantern light, no text. |
| `obst.jpg` | Square image: a cheerful plump fruit-stall lady with rosy cheeks holding up three red apples, crates of fruit, striped awning, Naschmarkt. Painterly storybook style, warm lantern light, no text. |
| `dieb.jpg` | Square image: a sneaky thief in a striped shirt running off with a lady's handbag through a crowded market, the lady shouting in the background, comic and dynamic. Painterly storybook style, warm lantern light, no text. |
| `wahrsagerin.jpg` | Square image: an old fortune teller with a headscarf and golden earrings gazing into a glowing crystal ball, tent full of candles and tarot cards, Prater fairground. Painterly storybook style, warm lantern light, no text. |
| `schiessbude.jpg` | Square image: an old fairground shooting gallery booth with wooden targets, lanterns and prizes on shelves, the booth owner with a bow tie grinning, Prater. Painterly storybook style, warm lantern light, no text. |
| `langos.jpg` | Square image: a fairground stand frying lángos (flat fried dough) with garlic, a baker in a white apron holding one up, warm steam and string lights, Prater. Painterly storybook style, warm lantern light, no text. |
| `geisterbahn.jpg` | Square image: the spooky entrance of an old ghost train ride, a little cart on rails, painted skeletons and bats, a dark tunnel mouth, glowing eyes inside. Painterly storybook style, warm lantern light, no text. |
| `kaffeeautomat.jpg` | Square image: a grumpy old brass coffee machine in a government office corridor, a single coin stuck in it, a tired official in sleeve protectors looking at it. Painterly storybook style, warm lantern light, no text. |
| `wartenummer.jpg` | Square image: a waiting room in an old Viennese government office, a ticket-number dispenser and a big number display, endless rows of chairs, a yawning clerk behind a counter. Painterly storybook style, warm lantern light, no text. |
| `stempel_kollegin.jpg` | Square image: a proud female civil servant in a cardigan holding a giant rubber stamp up in the air like a trophy, piles of forms, green office walls. Painterly storybook style, warm lantern light, no text. |
| `formular.jpg` | Square image: a shifty caretaker in a blue work coat whispering and offering a crumpled official form from under his coat, dim stairwell. Painterly storybook style, warm lantern light, no text. |
| `geisterbeamter.jpg` | Square image: a translucent ghost civil servant with old-fashioned glasses and a quill, floating between towering archive shelves, holding a ledger, eerie blue light. Painterly storybook style, warm lantern light, no text. |
| `kiste.jpg` | Square image: an old dusty wooden crate with a big wax seal and a warning label (no readable text) in a cobwebbed archive corner, light falling on it. Painterly storybook style, warm lantern light, no text. |
| `archivkatze.jpg` | Square image: a sleek black cat with golden eyes sitting on a stack of old files, looking back over its shoulder as if inviting you to follow, candle-lit archive. Painterly storybook style, warm lantern light, no text. |
| `tagebuch.jpg` | Square image: an old leather diary lying open on a reading desk, pages glowing softly, a candle and an inkwell beside it, archive shelves behind. Painterly storybook style, warm lantern light, no text. |
| `ball.jpg` | Square image: an elegant gentleman in a tailcoat bowing and offering his hand for a waltz, a grand ballroom with chandeliers and dancing couples behind him, Vienna city hall. Painterly storybook style, warm lantern light, no text. |
| `buffet.jpg` | Square image: a lavish ball buffet with Sachertorte, pastries and champagne glasses, a polite waiter in white gloves presenting a tray, chandeliers. Painterly storybook style, warm lantern light, no text. |
| `wappenmaler.jpg` | Square image: a painter on a ladder painting a huge colourful coat of arms on the wall of a neo-Gothic hall, paint pots and brushes, golden accents. Painterly storybook style, warm lantern light, no text. |
| `schluessel.jpg` | Square image: a glowing golden key floating in the air behind a heavy red velvet curtain, magical sparks, mysterious and slightly dangerous. Painterly storybook style, warm lantern light, no text. |

## Map medallions (optional) → `assets/map/`

The map already has engraved ink icons. If you'd like painted ones instead, make these and they replace the icons automatically.

| File | Prompt |
|---|---|
| `fight.jpg` | Square round medallion icon, two crossed swords engraved in dark ink on aged cream parchment, thin brass ring, painterly storybook style, plain background, no text. |
| `elite.jpg` | Square round medallion icon, a menacing horned skull engraved in dark red ink on aged cream parchment, thin brass ring, painterly storybook style, plain background, no text. |
| `rest.jpg` | Square round medallion icon, a small cosy campfire with a kettle, painted on aged cream parchment, thin brass ring, painterly storybook style, plain background, no text. |
| `shop.jpg` | Square round medallion icon, a tiny old Viennese corner shop with a striped awning, painted on aged cream parchment, thin brass ring, painterly storybook style, plain background, no text. |
| `event.jpg` | Square round medallion icon, a rolled parchment scroll with a question mark seal, painted on aged cream parchment, thin brass ring, painterly storybook style, plain background, no text. |
| `gate.jpg` | Square round medallion icon, an ornate old wooden door with a keyhole glowing gold, painted on aged cream parchment, thin brass ring, painterly storybook style, plain background, no text. |

## Card frames (optional) → `assets/cards/`

Painted backgrounds for the word cards; the game draws the text on top. Make them **tall 2:3**, with a **plain, light parchment centre** (the text goes there) and decoration only around the edges.

| File | Prompt |
|---|---|
| `subj.jpg` | Tall 2:3 empty playing-card frame on aged cream parchment, ornate engraved border in slate blue with small brass corner fittings, a tiny silhouette of a person at the top edge, plain light centre for text, painterly storybook style, no text. |
| `verb.jpg` | Tall 2:3 empty playing-card frame on aged cream parchment, ornate engraved border in deep red with brass corner fittings and a small anvil-and-hammer emblem at the top edge, plain light centre for text, painterly storybook style, no text. |
| `noun.jpg` | Tall 2:3 empty playing-card frame on aged cream parchment, ornate engraved border in warm brown with brass corner fittings and a small open-book emblem at the top edge, plain light centre for text, painterly storybook style, no text. |
| `adv.jpg` | Tall 2:3 empty playing-card frame on aged cream parchment, ornate engraved border in gold with brass corner fittings and a small pocket-watch emblem at the top edge, plain light centre for text, painterly storybook style, no text. |
| `perf.jpg` | Tall 2:3 empty playing-card frame on aged cream parchment, ornate engraved border in violet with brass corner fittings and a small hourglass emblem at the top edge, plain light centre for text, painterly storybook style, no text. |

Optional, for later ladders: `b1.jpg` (a modern Viennese office), `b2.jpg` (University of Vienna lecture hall), `c1.jpg` (a newsroom on the Ringstraße), `c2.jpg` (a traditional Viennese coffee house).
