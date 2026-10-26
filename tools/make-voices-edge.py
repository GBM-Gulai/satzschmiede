"""Placeholder voices: records every story line that has no recording yet with Microsoft's free neural voices (edge-tts).

Gemini sounds better but allows only ~20 lines a day on the free tier, so:
  1. python tools/make-voices-edge.py      -> every missing line gets a Microsoft voice right away (no limit)
  2. python tools/make-voices-gemini.py    -> each day, replaces Microsoft lines with Gemini (story order) until the daily limit
tools/voice-sources.json remembers which engine recorded each file ("edge" or "gemini").
Needs: pip install edge-tts, and ffmpeg on PATH.
"""
import asyncio, json, os, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib import import_module
piper_script = import_module("make-voices")   # story parsing + file naming
jobs, djb2, OUT = piper_script.jobs, piper_script.djb2, piper_script.OUT
SOURCES = Path(__file__).resolve().parent / "voice-sources.json"

# speaker -> (voice, rate, pitch). Multilingual voices read the English lines too.
VOICES = {
    "narr":        ("de-AT-JonasNeural", "-10%", "-4Hz"),
    "huber":       ("de-AT-IngridNeural", "-12%", "-3Hz"),
    "novak":       ("de-DE-KillianNeural", "-18%", "-6Hz"),
    "hero-rafa":   ("de-DE-FlorianMultilingualNeural", "-8%", "+0Hz"),
    "hero-mei":    ("de-DE-SeraphinaMultilingualNeural", "-8%", "+0Hz"),
    "hero-amara":  ("en-US-AvaMultilingualNeural", "-8%", "+0Hz"),
    "automat":     ("de-DE-ConradNeural", "-22%", "-14Hz"),
    "hydra":       ("de-DE-KillianNeural", "-15%", "-16Hz"),
    "kaese":       ("de-DE-ConradNeural", "-10%", "-6Hz"),
    "riesenrad":   ("de-DE-KillianNeural", "-20%", "-18Hz"),
    "aktenberg":   ("de-DE-ConradNeural", "-18%", "-16Hz"),
    "rathausmann": ("de-AT-JonasNeural", "-15%", "-12Hz"),
    "amsautomat":  ("de-DE-ConradNeural", "-20%", "-12Hz"),
    "meeting":     ("de-DE-KillianNeural", "-30%", "-10Hz"),
    "chef":        ("de-AT-JonasNeural", "-12%", "-8Hz"),
    "pflegedirektorin": ("de-AT-IngridNeural", "-8%", "-4Hz"),
}


def load_sources():
    return json.loads(SOURCES.read_text(encoding="utf-8")) if SOURCES.exists() else {}


def save_sources(src):
    SOURCES.write_text(json.dumps(src, indent=1, sort_keys=True), encoding="utf-8")


async def main():
    import edge_tts
    src = load_sources()
    # files recorded before this list existed came from Gemini
    for f in OUT.glob("*.mp3"):
        src.setdefault(f.stem, "gemini")
    done = 0
    for speaker, text in dict.fromkeys(jobs()):
        key = djb2(f"{speaker}|{text}")
        target = OUT / f"{key}.mp3"
        if target.exists():
            continue
        if speaker not in VOICES:
            print(f"!! no voice for '{speaker}' – add it to VOICES"); continue
        voice, rate, pitch = VOICES[speaker]
        spoken = text.replace("⏪", "").strip()
        with tempfile.TemporaryDirectory() as tmp:
            raw = os.path.join(tmp, "raw.mp3")
            try:
                await asyncio.wait_for(edge_tts.Communicate(spoken, voice, rate=rate, pitch=pitch).save(raw), timeout=30)
            except Exception as e:   # one bad line shouldn't stop the rest
                print(f"!! skipped ({type(e).__name__}): [{speaker}] {text}"); continue
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5", "-ac", "1", "-ar", "24000", "-b:a", "64k", str(target)], check=True)
        src[key] = "edge"; done += 1
        print(f"{target.name}  [{speaker} · {voice}]  {text}")
    save_sources(src)
    print(f"\n{done} placeholder lines recorded. Gemini will replace them day by day (python tools/make-voices-gemini.py).")


if __name__ == "__main__":
    asyncio.run(main())
