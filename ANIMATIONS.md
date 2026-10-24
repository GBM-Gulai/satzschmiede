# Satzschmiede – animations with Google Flow 🎬

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

## Priority 2 – story guide

| Save as | First + last frame | Prompt |
|---|---|---|
| `huber.mp4` | `assets/npc/huber.jpg` | Gentle idle animation of the elderly lady. She smiles warmly and nods slightly, the glowing word cards in her hands shimmer and pulse with soft golden light, the feather on her hat moves a little, warm café light flickers. The camera stays completely still. Painterly storybook style exactly like the image. Seamless loop, no text. |

## Later (optional)

- Elite enemies: `drache.mp4` (ink breath swirling), `hausmeister.mp4` (jangling keys, grumbling).
- A title-screen loop: first a still of a glowing anvil with a hammer and flying sparks in a dark forge, then an idle loop of it.

To give another enemy a clip, add its id to the `VIDEO` list at the top of `game.js` (or ask me).
