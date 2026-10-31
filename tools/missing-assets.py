"""Writes MISSING-ASSETS.md: every image/video from the prompt files that is not in assets/ yet, with its prompt.
Run again after adding files:  python tools/missing-assets.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
SOURCES = ["ASSETS-B1.md", "ASSETS.md", "ANIMATIONS.md"]
# not needed (yet): wide PC versions of old backgrounds are optional, B2+ is not built
SKIP = re.compile(r"^(tower/|bg/(b2|c1|c2)\.jpg)")


def rows(doc):
    """(section, relative path, prompt) for every table row that names a file."""
    text = (ROOT / doc).read_text(encoding="utf-8")
    section, folder = "", ""
    for line in text.splitlines():
        h = re.match(r"#+ (.*)", line) or re.match(r"\*\*(.+?)\*\*", line)
        if h and not line.startswith("|"):
            section = h.group(1).strip()
            m = re.search(r"`assets/([a-z/]+?)/?`", line)
            if m: folder = m.group(1).strip("/")
            continue
        m = re.match(r"\|(?: ☐ \|)? `([^`]+\.(?:jpg|mp4))` \|(.*)\|\s*$", line)
        if not m:
            continue
        name, rest = m.group(1), [c.strip() for c in m.group(2).split("|")]
        prompt = rest[-1]
        frame = rest[0] if len(rest) > 1 else ""
        if name.startswith("assets/"):
            rel = name[len("assets/"):]
        elif "/" in name:
            rel = name
        elif name.endswith(".mp4"):
            rel = "video/" + name
        else:
            rel = f"{folder}/{name}" if folder else name
        yield section, rel, prompt, frame


def main():
    seen, missing = set(), []
    for doc in SOURCES:
        if not (ROOT / doc).exists():
            continue
        for section, rel, prompt, frame in rows(doc):
            if rel in seen or SKIP.match(rel):
                continue
            seen.add(rel)
            if not (ASSETS / rel).exists():
                missing.append((doc, section, rel, prompt, frame))

    groups = [
        ("🔴 1 · B1 – needed for the new level", lambda m: m[0] == "ASSETS-B1.md" and not m[2].endswith(".mp4")),
        ("🟠 2 · Older levels – still missing", lambda m: m[0] == "ASSETS.md" and "-wide" not in m[2]),
        ("🟡 3 · Optional videos (Flow)", lambda m: m[2].endswith(".mp4")),
        ("⚪ 4 · Optional wide PC backgrounds", lambda m: "-wide" in m[2]),
    ]
    out = [f"# Satzschmiede – missing pictures and videos ({len(missing)})", "",
           "Generated from the prompt files by comparing them with the `assets/` folder – **everything listed here is not in the game yet**.",
           "Regenerate after adding files: `python tools/missing-assets.py` (or ask Claude).", "",
           "**How:** use the *style message* at the top of `ASSETS-B1.md` (modern Vienna) or `ASSETS.md` (old Vienna) in a Gemini chat, then send the prompts one by one.",
           "Save each file at the exact path shown (lowercase). Gemini's long file names are fine too – Claude can rename them.", ""]
    used = set()
    for title, test in groups:
        items = [m for m in missing if test(m) and m[2] not in used]
        if not items:
            continue
        out += [f"## {title} ({len(items)})", "", "| ☐ | Save as | Prompt |", "|---|---|---|"]
        for doc, section, rel, prompt, frame in items:
            used.add(rel)
            extra = f" **First + last frame:** {frame}." if frame and rel.endswith(".mp4") else ""
            out.append(f"| ☐ | `assets/{rel}` | {prompt}{extra} |")
        out.append("")
    rest = [m for m in missing if m[2] not in used]
    if rest:
        out += [f"## Other ({len(rest)})", "", "| ☐ | Save as | Prompt |", "|---|---|---|"] + [f"| ☐ | `assets/{m[2]}` | {m[3]} |" for m in rest] + [""]
    (ROOT / "MISSING-ASSETS.md").write_text("\n".join(out), encoding="utf-8")
    print(f"{len(missing)} missing → MISSING-ASSETS.md")
    for title, test in groups:
        print(f"  {title}: {sum(1 for m in missing if test(m))}")


if __name__ == "__main__":
    main()
