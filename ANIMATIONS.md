# Satzschmiede – animations with Google Flow 🎬

✅ Done: automat, hydra, huber, drache, hausmeister, wotruba, the title loop (title.mp4) and the portal (portal.mp4). **New:** the bosses and elites of acts 2 and 3 below. `build.ps1` compresses clips automatically with ffmpeg (square 480 px, no audio).

Every character already has a subtle "living portrait" effect (gentle breathing + lantern flicker), done in code. Flow videos are for a few **big moments**, where a real animation is worth the extra file size.

## How to make a clip

1. In Flow, use **Frames to Video** (image to video).
2. Upload the still image from `assets/…` as the **first frame**, and the **same image again as the last frame**. That way the clip ends where it started and loops seamlessly in the game.
3. Paste the prompt below. Keep the camera still: moving cameras don't loop.
4. Download as **MP4** (720p is plenty) and save it as `assets/video/<name>.mp4`.
5. Tell me when clips are ready. Clips only play in the hosted version (GitHub Pages) and when opening `index.html` locally. The private claude.ai link stays image-only, because videos are too big to embed.

The game crops videos to a square frame from the centre, so landscape (16:9) output is fine as long as the character stays in the middle.

---

## Priority 1 – bosses (shown during the boss fight and in their story scenes)

| Save as | First + last frame | Prompt |
|---|---|---|
| `automat.mp4` | `assets/enemies/automat.jpg` | Subtle idle animation of the ticket-machine monster. Steam puffs rhythmically from its brass vents, the glowing screen-face flickers and blinks slowly, the paper ticket tongue sways gently, the lanterns in the background flicker. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `hydra.mp4` | `assets/enemies/hydra.jpg` | Subtle idle animation of the paper hydra. Its heads sway slowly and snap their paper jaws one after another, loose forms flutter down around it, lamp light flickers. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |

## NEW – bosses of acts 2 and 3 (most impact first)

Same recipe as before: Frames to Video, the enemy image as first **and** last frame, camera still. Save under the exact name.

| Save as | First + last frame | Prompt |
|---|---|---|
| `riesenrad.mp4` | `assets/enemies/riesenrad.jpg` | Subtle idle animation of the giant Ferris-wheel monster. The wheel turns very slowly, its red cabins glow and pulse like eyes, the steel spokes flex like arms, fairground lights twinkle in the night behind it. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `rathausmann.mp4` | `assets/enemies/rathausmann.jpg` | Subtle idle animation of the giant iron knight statue. His banner flutters in the wind, moonlight glints across the armour, he shifts his weight slightly and tightens his grip on the lance, clouds drift behind the city-hall towers. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `kaese.mp4` | `assets/enemies/kaese.jpg` | Subtle idle animation of the cheese emperor on his throne. He strokes his cheesy beard and drums his fingers smugly, his fur cloak moves slightly, his golden crown glints, market lanterns flicker behind him. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `aktenberg.mp4` | `assets/enemies/aktenberg.jpg` | Subtle idle animation of the mountain-of-files monster. Folders shuffle and breathe like it is alive, loose papers flutter off its shoulders, its paperclip teeth clack, rubber-stamp fists flex, candle light flickers in the archive. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |

## NEW – elites of acts 2 and 3 (optional)

| Save as | First + last frame | Prompt |
|---|---|---|
| `watschenmann.mp4` | `assets/enemies/watschenmann.jpg` | Subtle idle animation of the grumpy wooden punching dummy. He punches his boxing gloves together, frowns and huffs, sways slightly on his base, fairground lights flicker behind him. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `standlerin.mp4` | `assets/enemies/standlerin.jpg` | Subtle idle animation of the formidable market-stall lady. She taps her ladle against her palm, raises one eyebrow, the scale beside her tips gently up and down, market lanterns flicker. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `archivar.mp4` | `assets/enemies/archivar.jpg` | Subtle idle animation of the skeletal archivist. His lantern swings slowly and casts moving shadows over the shelves, his long beard sways, his eyes glow and dim, dust motes float in the light. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |
| `sekretaer.mp4` | `assets/enemies/sekretaer.jpg` | Subtle idle animation of the many-armed secretary. His arms juggle papers and telephones in a busy loop, sheets of paper flutter around him, he glances over his glasses impatiently, desk lamp flickers. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |

## Priority 2 – story guide

| Save as | First + last frame | Prompt |
|---|---|---|
| `huber.mp4` | `assets/npc/huber.jpg` | Gentle idle animation of the elderly lady. She smiles warmly and nods slightly, the glowing word cards in her hands shimmer and pulse with soft golden light, the feather on her hat moves a little, warm café light flickers. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |

## Priority 3 – the portal into "the hidden Vienna" ✨

Plays full-screen when the hero touches Frau Huber's cards (A1 intro). Without it, the game shows a golden light burst instead.

1. **First make one extra still in Gemini** (same chat/style) and save it as `assets/bg/a1-modern.jpg`:
   > Tall 9:16 background, same painterly storybook style but **modern and ordinary**: the real Westbahnhof in Vienna today – a bright modern glass-and-steel hall, red ÖBB trains, departure boards, a few blurred commuters with phones, cool daylight. No magic, no steam, no gas lamps, no text.
2. **In Flow – Frames to Video:** first frame = `assets/bg/a1-modern.jpg`, last frame = `assets/bg/a1.jpg`. Prompt:
   > A magical transformation of a train station. Golden light bursts from a deck of glowing cards in the centre and swirls outward like a portal; as the light sweeps across, the modern glass hall morphs into an old storybook station – steel becomes ornate iron, screens become gas lanterns, steam rises, colours turn warm amber and teal. The camera stays still. Painterly storybook style. No text.
3. Save as `assets/video/portal.mp4`. It plays once (no loop needed), so it can be dramatic.

## Later (optional)

- Elite enemies: `drache.mp4` (ink breath swirling), `hausmeister.mp4` (jangling keys, grumbling).
- A title-screen loop: first a still of a glowing anvil with a hammer and flying sparks in a dark forge, then an idle loop of it.

To give another enemy a clip, add its id to the `VIDEO` list at the top of `game.js` (or ask me).
