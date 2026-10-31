"""Collects every English text the game can show into lang/catalog.json (the list to translate).

Sources: L("de", "en") / LT(...) / T("en") calls in game.js (template literals become "{0}", "{1}" …),
plus the data in data.js and story.js (story lines, cards, encounters, lessons …), read by loading them in headless Chrome.
Run:  python tools/i18n-extract.py
"""
import json, os, re, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def read_js_string(src, i):
    """Parse a JS string literal starting at src[i]. Returns (key, end) – template expressions become {0}, {1} … – or (None, i)."""
    q = src[i]
    if q not in "'\"`":
        return None, i
    out, j, n = [], i + 1, 0
    while j < len(src):
        c = src[j]
        if c == "\\":
            nxt = src[j + 1]
            out.append({"n": "\n", "t": "\t"}.get(nxt, nxt)); j += 2; continue
        if c == q:
            return "".join(out), j + 1
        if q == "`" and src.startswith("${", j):
            depth, k = 1, j + 2
            while depth and k < len(src):           # skip the expression, including nested strings
                ch = src[k]
                if ch in "'\"`":
                    _, k = read_js_string(src, k); continue
                depth += ch == "{"; depth -= ch == "}"; k += 1
            out.append("{%d}" % n); n += 1; j = k; continue
        out.append(c); j += 1
    return None, i


def from_game_js():
    src = (ROOT / "game.js").read_text(encoding="utf-8")
    keys = []
    for m in re.finditer(r"(?<![\w.])(LT|L|T)\(", src):
        i = m.end()
        while src[i].isspace(): i += 1
        first, i2 = read_js_string(src, i)
        if m.group(1) == "T":
            if first is not None: keys.append(first)
            continue
        if first is None:      # L(variable, variable)
            continue
        j = i2
        while src[j] in " \n,": j += 1
        second, _ = read_js_string(src, j)
        if second is not None: keys.append(second)
    help_block = src[src.index("const HELP = ["):src.index("];", src.index("const HELP = ["))]
    k = 0
    while True:
        m = re.search(r"['\"]", help_block[k:])
        if not m: break
        s, e = read_js_string(help_block, k + m.start())
        if s: keys.append(s)
        k = e
    return keys


COLLECT = r"""
const out = [];
const add = (x, ctx) => { if (typeof x === "string" && x.trim()) out.push([x, ctx]); };
for (const [id, l] of Object.entries(STORY)) for (const [scene, lines] of Object.entries(l)) for (const ln of lines) add(ln[2], "story " + id + "/" + scene);
for (const [k, lines] of Object.entries(CAMP_TALKS)) for (const ln of lines) add(ln[2], "camp " + k);
for (const [k, a] of Object.entries(ASKS)) { add(a.ok[1], "ask " + k); add(a.no[1], "ask " + k); }
for (const [id, h] of Object.entries(HEROES)) for (const [f, v] of Object.entries(h)) if (f.endsWith("En")) add(v, "hero " + id + "." + f);
for (const [k, list] of Object.entries(ENCOUNTERS)) for (const e of list) {
  add(e.title[1], "enc " + e.id); add(e.text[1], "enc " + e.id);
  for (const c of e.choices) { add(c.label[1], "enc " + e.id); if (c.quiz) add(c.quiz.q[1], "enc " + e.id);
    for (const f of [c.effect, c.win, c.lose]) if (f && f.say) add(f.say[1], "enc " + e.id); }
}
for (const l of LADDERS) { add(l.nameEn, "ladder"); if (l.ui !== "de") { add(l.mapSub, "map " + l.id);
  for (const a of l.acts || []) if (a.mapSub) add(a.mapSub, "map " + l.id); for (const [q, o] of l.haggle || []) { add(q, "haggle"); o.forEach(x => add(x, "haggle")); } } }
for (const [id, alts] of Object.entries(HERO_BOSS)) for (const a of Object.values(alts)) add(a.hint, "boss hint");
for (const c of Object.values(CARDS)) add(c.en, "card");
for (const e of Object.values(ENEMIES)) add(e.hint, "enemy hint");
for (const r of Object.values(RELICS)) add(r.text, "relic");
for (const t of TUT) add(t.en, "tutorial");
document.body.insertAdjacentHTML("beforeend", "<pre id=out>" + JSON.stringify(out).replace(/</g, "\\u003c") + "</pre>");
"""


def from_data():
    page = f"""<!doctype html><html><head><meta charset="utf-8"></head><body><div id="app"></div>
<script src="{(ROOT / 'data.js').as_uri()}"></script><script src="{(ROOT / 'story.js').as_uri()}"></script><script src="{(ROOT / 'game.js').as_uri()}"></script>
<script>{COLLECT}</script></body></html>"""
    with tempfile.TemporaryDirectory() as tmp:
        f = Path(tmp) / "x.html"; f.write_text(page, encoding="utf-8")
        html = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--allow-file-access-from-files", f"--user-data-dir={tmp}\\prof",
                               "--virtual-time-budget=5000", "--dump-dom", f.as_uri()], capture_output=True, text=True, encoding="utf-8").stdout
    m = re.search(r'<pre id="out">(.*?)</pre>', html, re.S)
    raw = m.group(1).replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").replace("&quot;", '"')
    return json.loads(raw)


def main():
    seen, catalog = {}, []
    skip = lambda k: not re.search(r"[A-Za-z]{2}", re.sub(r"\{\w+\}|<[^>]+>", "", k))   # only placeholders, numbers or symbols
    for key in from_game_js():
        if key not in seen and not skip(key): seen[key] = "ui"; catalog.append({"en": key, "ctx": "ui"})
    for key, ctx in from_data():
        if key not in seen and not skip(key): seen[key] = ctx; catalog.append({"en": key, "ctx": ctx})
    (ROOT / "lang").mkdir(exist_ok=True)
    (ROOT / "lang" / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(c["en"].split()) for c in catalog)
    print(f"{len(catalog)} texts, {words} words → lang/catalog.json")
    by = {}
    for c in catalog: by[c["ctx"].split()[0]] = by.get(c["ctx"].split()[0], 0) + 1
    print(by)


if __name__ == "__main__":
    main()
