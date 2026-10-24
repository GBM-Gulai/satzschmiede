# Satzschmiede ⚒️

**Play:** https://gbm-gulai.github.io/satzschmiede/ (on a phone: *Add to Home Screen*)

A deckbuilding roguelike (Slay the Spire style) where **German sentences are your spells**.

- Your cards are words: pronouns, verbs, nouns and time words.
- Build a correct sentence to cast it: the verb decides the effect (⚔️ attack, 🛡️ shield, ❤️ heal).
- Word order matters (verb in position 2), and when you cast you choose the right verb form and articles (Nominativ / Akkusativ / Dativ).
- Grammar monsters have weaknesses (Dativ-Drache, Zeitgeist …), there's a map with fights, elites, rest sites, a shop, riddles, relics and a boss.

**Story:** choose one of 3 heroes, newcomers in Vienna, and climb six ladders from A1 to C2. Each ladder has its own setting, enemies, boss and grammar. A1 (Ankunft) and A2 (Das Amt, with the ⏪ Perfekt card) are playable; B1–C2 are coming. Hints are in English at A1, bilingual at A2 and German from B1.

**Art:** see `ASSETS.md` for the Gemini prompt pack. Save images into `assets/`; missing images fall back to emojis.

Play: open `index.html` in a browser. `build.ps1` packs everything into `dist/satzschmiede.html`.

Content: `data.js` (cards, enemies, relics), `story.js` (heroes, ladders, story scenes, riddles). Engine: `game.js`.

`build.ps1` also writes `docs/`, the web version served by GitHub Pages (shrunk images, videos, offline support). Commit `docs/` after building to publish.

**Music & voices:** CC0 music from OpenGameArt (`assets/music/CREDITS.md`). Story lines are recorded with Piper TTS and CC0 German voices: `python tools/make-voices.py` (needs `pip install piper-tts`, ffmpeg and the voice models in `tools/voices/`, see the script). Re-run it after changing story text.
