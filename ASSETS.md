# Satzschmiede – art prompts for Gemini 🎨

The game looks for images in the `assets/` folder. Anything missing falls back to an emoji, so you can add images one by one.

## How to make them

1. Open Gemini (gemini.google.com) and start **one chat for all images**, so the style stays consistent.
2. Send the **style message** below first. Then send the prompts one at a time.
3. If an image comes out in a different style, reply: *"Same style as the earlier images, please – painterly storybook, warm lantern light."*
4. Download each image and save it as **JPG** (Gemini's download format is fine) with the **exact file name** shown, in the folder shown (e.g. `assets/enemies/taube.jpg`).
5. Run `build.ps1` afterwards. It shrinks the images so the game stays fast on your phone.

Squares (1:1) work best for characters. Backgrounds should be tall (9:16).

---

## Style message (send this first)

> I'm making a card game called "Satzschmiede" about a newcomer learning German in Vienna. Please create all images in ONE consistent style: **painterly digital illustration in a whimsical European storybook style**, visible soft brush strokes, warm lantern light, muted palette of deep teal, moss green, amber and burnt orange, gentle paper grain, cosy but slightly mysterious mood. Characters are centred, shown from the waist or chest up, with a simple softly blurred background in the scene's colours. No text, no letters, no logos, no frames, no watermarks. Reply "ready" and then I'll send the images one by one.

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

Optional, for later ladders: `b1.jpg` (a modern Viennese office), `b2.jpg` (University of Vienna lecture hall), `c1.jpg` (a newsroom on the Ringstraße), `c2.jpg` (a traditional Viennese coffee house).
