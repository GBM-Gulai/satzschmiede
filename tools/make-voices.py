"""Records every German story line in story.js with Piper (free, offline neural TTS) -> assets/voice/<key>.mp3

Voices (all CC0): Thorsten (narrator), Thorsten emotional (moods for characters), Kerstin (female voices).
Run after changing story text:   python tools/make-voices.py
Needs: pip install piper-tts, ffmpeg on PATH, voice models in tools/voices/ (see VOICES below).
The file name key must match voiceKey() in game.js: djb2 hash of "<speaker>|<German text>".
"""
import re, subprocess, wave, tempfile, os
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
VOICE_DIR = ROOT / "tools" / "voices"
OUT = ROOT / "assets" / "voice"
OUT.mkdir(parents=True, exist_ok=True)

MODELS = {
    "thorsten": "de_DE-thorsten-high.onnx",
    "emo": "de_DE-thorsten_emotional-medium.onnx",   # speakers: amused 0, angry 1, disgusted 2, drunk 3, neutral 4, sleepy 5, surprised 6, whisper 7
    "kerstin": "de_DE-kerstin-low.onnx",
}
ROBOT = "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75"
# speaker -> (model, emotion speaker id, length_scale (higher = slower), pitch factor, extra ffmpeg filter)
VOICES = {
    "narr":        ("thorsten", None, 1.05, 1.00, ""),
    "huber":       ("kerstin",  None, 1.12, 0.93, ""),
    "novak":       ("emo",      5,    1.08, 0.98, ""),
    "hero-rafa":   ("emo",      4,    1.00, 1.03, ""),
    "hero-mei":    ("kerstin",  None, 1.00, 1.08, ""),
    "hero-amara":  ("kerstin",  None, 1.04, 0.97, ""),
    "automat":     ("thorsten", None, 1.25, 0.92, ROBOT + ",aecho=0.8:0.7:40:0.3"),
    "hydra":       ("emo",      1,    1.05, 0.82, "aecho=0.8:0.8:60|120:0.35|0.2"),
}


def djb2(s: str) -> str:
    h = 5381
    for ch in s:
        h = (h * 33 + ord(ch)) & 0xFFFFFFFF
    return format(h, "x")


def parse():
    src = (ROOT / "story.js").read_text(encoding="utf-8")
    heroes = {}
    block = src[src.index("const HEROES"):src.index("const NPCS")]
    for m in re.finditer(r'(\w+):\s*\{(.*?)\}', block, re.S):
        fields = dict(re.findall(r'(\w+): "([^"]*)"', m.group(2)))
        if "name" in fields:
            heroes[m.group(1)] = fields
    story = src[src.index("const STORY"):]
    lines = re.findall(r'\["(\w+)",\s*"((?:[^"\\]|\\.)*)",\s*"(?:[^"\\]|\\.)*"(?:,\s*"\w+")?\]', story)   # optional 4th item = effect marker
    return heroes, lines


def fill(text, h):
    for field in ("name", "from", "story", "magic"):
        text = text.replace("{" + field + "}", h.get(field, ""))
    return text


def jobs():
    heroes, lines = parse()
    for who, de in lines:
        needs_hero = who == "hero" or "{" in de
        for hid, h in (heroes.items() if needs_hero else [(None, None)]):
            text = fill(de, h) if h else de
            speaker = f"hero-{hid}" if who == "hero" else who
            yield speaker, text


def main():
    loaded = {k: PiperVoice.load(str(VOICE_DIR / f)) for k, f in MODELS.items()}
    done = skipped = 0
    for speaker, text in dict.fromkeys(jobs()):   # unique, keeps order
        if speaker not in VOICES:
            print(f"!! no voice for speaker '{speaker}' – add it to VOICES"); continue
        key = djb2(f"{speaker}|{text}")
        target = OUT / f"{key}.mp3"
        if target.exists():
            skipped += 1; continue
        model, sid, length, pitch, extra = VOICES[speaker]
        voice = loaded[model]
        spoken = text.replace("⏪", "").replace("…", ", ").strip()
        with tempfile.TemporaryDirectory() as tmp:
            wav = os.path.join(tmp, "line.wav")
            with wave.open(wav, "wb") as wf:
                voice.synthesize_wav(spoken, wf, syn_config=SynthesisConfig(speaker_id=sid, length_scale=length))
            rate = voice.config.sample_rate
            filters = [f"asetrate={int(rate * pitch)}", f"aresample={rate}", f"atempo={1 / pitch:.4f}"] if pitch != 1 else []
            if extra: filters.append(extra)
            filters.append("loudnorm=I=-16:TP=-1.5")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", ",".join(filters), "-ac", "1", "-ar", "24000", "-b:a", "48k", str(target)], check=True)
        done += 1
        print(f"{key}.mp3  [{speaker}]  {text}")
    print(f"\n{done} recorded, {skipped} already existed -> {OUT}")


if __name__ == "__main__":
    main()
