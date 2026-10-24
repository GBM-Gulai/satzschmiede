"""Records every German story line in story.js with Gemini text-to-speech -> assets/voice/<key>.mp3

Much more natural than the free offline voices: each character gets a voice and a description of how to speak.
Needs: your Gemini API key in tools/gemini-key.txt (never uploaded – see .gitignore) and ffmpeg on PATH.
Run after changing story text:        python tools/make-voices-gemini.py
Re-record everything (e.g. new style): python tools/make-voices-gemini.py --all
The file name key must match voiceKey in game.js: djb2 hash of "<speaker>|<German text>" (shared with make-voices.py).
"""
import base64, json, subprocess, sys, tempfile, time, os, urllib.request, urllib.error
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib import import_module
piper_script = import_module("make-voices")   # reuse story parsing + file naming
jobs, djb2, OUT = piper_script.jobs, piper_script.djb2, piper_script.OUT

MODEL = "gemini-3.8-flash-tts"
KEY_FILE = Path(__file__).resolve().parent / "gemini-key.txt"
CACHE = Path(__file__).resolve().parent / "voice-cache"   # raw batch recordings (git-ignored)

# speaker -> (prebuilt voice, how to speak). Tweak a style and re-run with --all to hear the change.
VOICES = {
    "narr":       ("Charon",   "a calm, warm storyteller reading a fairy tale aloud, unhurried, clear German"),
    "huber":      ("Sulafat",  "a warm, kind, slightly mischievous elderly Viennese lady with a gentle Austrian accent, speaking slowly and clearly"),
    "novak":      ("Algenib",  "a bored, tired Viennese civil servant who has said this a thousand times today, flat and monotone, with a small sigh"),
    "hero-rafa":  ("Puck",     "a cheerful, warm young man, a little nervous but determined, speaking German clearly and a bit slowly like a learner"),
    "hero-mei":   ("Leda",     "a curious, bright young woman, determined and upbeat, speaking German clearly and a bit slowly like a learner"),
    "hero-amara": ("Kore",     "a calm, confident, kind young woman, speaking German clearly and a bit slowly like a learner"),
    "automat":    ("Alnilam",  "a grumpy old ticket machine: flat, mechanical and robotic, staccato, every word clipped and separate"),
    "hydra":      ("Gacrux",   "a huge menacing monster made of paperwork: deep, booming and theatrical, slow and threatening"),
}


def find_audio(obj):
    """The audio is base64 in a 'data' field somewhere in the response (steps[].content[].data)."""
    if isinstance(obj, dict):
        if isinstance(obj.get("data"), str) and len(obj["data"]) > 1000:
            return obj["data"]
        obj = list(obj.values())
    if isinstance(obj, list):
        for v in obj:
            found = find_audio(v)
            if found:
                return found
    return None


def tts(key, text, voice, style):
    body = {
        "model": MODEL,
        "input": [{"type": "user_input", "content": [{"type": "text", "text": text,
                                                      "annotations": [{"type": "speech_metadata", "style": style}]}]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": voice}]},
    }
    req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/interactions", data=json.dumps(body).encode(),
                                 headers={"x-goog-api-key": key, "Content-Type": "application/json"})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = find_audio(json.load(r))
                if not data:
                    raise RuntimeError("no audio in response")
                return base64.b64decode(data)
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 503) and attempt < 5:
                wait = 10 * (attempt + 1)
                print(f"   … {e.code}, waiting {wait}s"); time.sleep(wait); continue
            raise SystemExit(f"Gemini error {e.code}: {msg}")


def silences(wav):
    log = subprocess.run(["ffmpeg", "-i", wav, "-af", "silencedetect=noise=-40dB:d=0.18", "-f", "null", "-"], capture_output=True, text=True).stderr
    starts = [float(x.split("silence_start: ")[1].split()[0]) for x in log.splitlines() if "silence_start: " in x]
    ends = [float(x.split("silence_end: ")[1].split()[0]) for x in log.splitlines() if "silence_end: " in x]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], capture_output=True, text=True).stdout)
    return list(zip(starts, ends + [dur] * (len(starts) - len(ends)))), dur


def plan_cuts(texts, wav):
    """Pick n-1 pauses that best match where each line should end (by its share of the characters), preferring long pauses.
    Returns (cut times, worst relative deviation) or (None, None)."""
    sil, dur = silences(wav)
    lead = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    tail = sil[-1][0] if sil and sil[-1][1] >= dur - 0.05 else dur
    cands = [((s + e) / 2, e - s) for s, e in sil if s > lead and e < tail]
    n = len(texts)
    if len(cands) < n - 1:
        return None, None
    weights = [len(t) + 6 for t in texts]   # +6 ≈ the pause each line carries
    total, acc, expected = sum(weights), 0, []
    for w in weights[:-1]:
        acc += w; expected.append(lead + (tail - lead) * acc / total)
    span = tail - lead
    # dynamic programming over candidates in time order: cost = squared distance from the expected cut − bonus for long pauses
    INF = float("inf")
    best = [[INF] * len(cands) for _ in range(n - 1)]
    prev = [[-1] * len(cands) for _ in range(n - 1)]
    cost = lambda k, j: ((cands[j][0] - expected[k]) / span) ** 2 * 40 - min(cands[j][1], 1.5)
    for j in range(len(cands)):
        best[0][j] = cost(0, j)
    for k in range(1, n - 1):
        for j in range(len(cands)):
            for i in range(j):
                if best[k - 1][i] + cost(k, j) < best[k][j]:
                    best[k][j], prev[k][j] = best[k - 1][i] + cost(k, j), i
    j = min(range(len(cands)), key=lambda x: best[n - 2][x])
    if best[n - 2][j] == INF:
        return None, None
    cuts = []
    for k in range(n - 2, -1, -1):
        cuts.append(cands[j][0]); j = prev[k][j]
    cuts.reverse()
    bounds = [lead] + cuts + [tail]
    worst = max(abs((bounds[i + 1] - bounds[i]) / span - weights[i] / total) / (weights[i] / total) for i in range(n))
    return cuts, worst


def split_at_pauses(wav, texts, outdir):
    """Cut a recording of several lines into one wav per line. Returns the paths, or None if the cut looks unreliable."""
    n = len(texts)
    cuts, worst = plan_cuts(texts, wav)
    if cuts is None or worst > 0.6:
        print(f"   cut plan rejected (worst length deviation {worst})"); return None
    bounds = [0.0] + cuts + [None]
    parts = []
    for i in range(n):
        part = os.path.join(outdir, f"part{i}.wav")
        rng = ["-ss", f"{bounds[i]:.3f}"] + (["-to", f"{bounds[i + 1]:.3f}"] if bounds[i + 1] else [])
        trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, *rng, "-af", trim, part], check=True)
        parts.append(part)
    return parts


def batch(key, todo):
    """One request per speaker: all their lines with long pauses in between, then cut apart (saves free-tier requests)."""
    by_speaker = {}
    for speaker, text in todo:
        by_speaker.setdefault(speaker, []).append(text)
    for speaker, texts in by_speaker.items():
        voice, style = VOICES[speaker]
        joined = " <long pause> <long pause> ".join(t.replace("⏪", "").strip() for t in texts)
        # raw batch recordings are kept, so a bad cut can be redone offline without spending daily requests
        cache = CACHE / f"{speaker}-{djb2(joined)}.wav"
        if cache.exists():
            audio = cache.read_bytes(); print(f"   {speaker}: using saved recording")
        else:
            audio = tts(key, joined, voice, style + ". Leave a clear, long pause between the sentences.")
            CACHE.mkdir(exist_ok=True); cache.write_bytes(audio)
        with tempfile.TemporaryDirectory() as tmp:
            wav = os.path.join(tmp, "all.wav")
            Path(wav).write_bytes(audio)
            parts = split_at_pauses(wav, texts, tmp) if len(texts) > 1 else [wav]
            if not parts:
                print(f"!! {speaker}: couldn't find {len(texts) - 1} pauses – those lines keep their old recording"); continue
            for text, part in zip(texts, parts):
                target = OUT / f"{djb2(f'{speaker}|{text}')}.mp3"
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", part, "-af", "loudnorm=I=-16:TP=-1.5",
                                "-ac", "1", "-ar", "24000", "-b:a", "64k", str(target)], check=True)
                print(f"{target.name}  [{speaker} · {voice}, batch]  {text}")
        time.sleep(3)


def main():
    if not KEY_FILE.exists() or not KEY_FILE.read_text().strip():
        raise SystemExit(f"Put your Gemini API key into {KEY_FILE} first (from https://aistudio.google.com/apikey).")
    key = KEY_FILE.read_text().strip()
    redo = "--all" in sys.argv
    if "--lite" in sys.argv:
        global MODEL
        MODEL = "gemini-3.8-flash-lite-tts"
    if "--batch" in sys.argv:   # only lines whose file is older than --since <unix time> (or missing)
        since = float(sys.argv[sys.argv.index("--since") + 1]) if "--since" in sys.argv else 1e18
        todo = [(s, t) for s, t in dict.fromkeys(jobs()) if s in VOICES and
                (not (OUT / f"{djb2(f'{s}|{t}')}.mp3").exists() or (OUT / f"{djb2(f'{s}|{t}')}.mp3").stat().st_mtime < since)]
        print(f"{len(todo)} lines to record in batches")
        return batch(key, todo)
    done = skipped = 0
    for speaker, text in dict.fromkeys(jobs()):
        if speaker not in VOICES:
            print(f"!! no voice for '{speaker}' – add it to VOICES"); continue
        target = OUT / f"{djb2(f'{speaker}|{text}')}.mp3"
        if target.exists() and not redo:
            skipped += 1; continue
        voice, style = VOICES[speaker]
        audio = tts(key, text.replace("⏪", "").strip(), voice, style)
        with tempfile.TemporaryDirectory() as tmp:
            raw = os.path.join(tmp, "line.wav")
            Path(raw).write_bytes(audio)
            fmt = [] if audio[:4] == b"RIFF" else ["-f", "s16le", "-ar", "24000", "-ac", "1"]   # WAV, or raw PCM as fallback
            subprocess.run(["ffmpeg", "-v", "error", "-y", *fmt, "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5",
                            "-ac", "1", "-ar", "24000", "-b:a", "64k", str(target)], check=True)
        done += 1
        print(f"{target.name}  [{speaker} · {voice}]  {text}")
        time.sleep(1.5)   # stay well inside rate limits
    print(f"\n{done} recorded, {skipped} already existed -> {OUT}")


if __name__ == "__main__":
    main()
