# Packs the game into one self-contained file: dist/satzschmiede.html
# Run after changing anything:   powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-Text($rel) { [IO.File]::ReadAllText((Join-Path $root $rel), $utf8) }

$index = Read-Text "index.html"
$fonts = [regex]::Match($index, '<link href="https://fonts\.googleapis\.com[^>]*>').Value
$out = @"
<title>Satzschmiede</title>
$fonts
<style>
$(Read-Text "style.css")
</style>
<div id="app"></div>
<script>
$(Read-Text "data.js")
$(Read-Text "game.js")
</script>
"@
New-Item -ItemType Directory -Force (Join-Path $root "dist") | Out-Null
[IO.File]::WriteAllText((Join-Path $root "dist\satzschmiede.html"), $out, $utf8)
"Built dist\satzschmiede.html ($([math]::Round($out.Length / 1KB)) KB)"
