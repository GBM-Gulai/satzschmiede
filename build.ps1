# Builds two versions of the game:
#   dist/satzschmiede.html  one self-contained file (images embedded) for the private claude.ai link
#   docs/                   the web version for GitHub Pages: shrunk images, videos, offline support
# Run after changing anything:   powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-Text($rel) { [IO.File]::ReadAllText((Join-Path $root $rel), $utf8) }

# Shrink an image (longest side = $max px) and return JPEG bytes (quality 82)
function Shrink($file, $max) {
  $img = [System.Drawing.Image]::FromFile($file)
  try {
    $scale = [Math]::Min(1.0, [double]$max / [Math]::Max($img.Width, $img.Height))
    $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = "HighQualityBicubic"; $g.DrawImage($img, 0, 0, $w, $h); $g.Dispose()
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]82)
    $ms = New-Object IO.MemoryStream
    $bmp.Save($ms, $codec, $params); $bmp.Dispose()
    return , $ms.ToArray()
  } finally { $img.Dispose() }
}

# ---------- images: shrink once, use for both versions ----------
$images = @{}   # "assets/enemies/taube.jpg" -> bytes
$assetDir = Join-Path $root "assets"
if (Test-Path $assetDir) {
  Get-ChildItem $assetDir -Recurse -Include *.png, *.jpg, *.jpeg | ForEach-Object {
    $rel = "assets/" + $_.FullName.Substring($assetDir.Length + 1).Replace("\", "/")
    $rel = [IO.Path]::ChangeExtension($rel, ".jpg").ToLower()   # the game always asks for lowercase .jpg (the web is case-sensitive)
    $max = if ($rel -like "assets/bg/*") { 900 } else { 640 }
    $images[$rel] = Shrink $_.FullName $max
  }
}

# ---------- 1) one-file version ----------
$assetJs = "window.ASSET_DATA = {" + (($images.Keys | Sort-Object | ForEach-Object { '"' + $_ + '":"data:image/jpeg;base64,' + [Convert]::ToBase64String($images[$_]) + '"' }) -join ",") + "};"
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
$assetJs
$(Read-Text "data.js")
$(Read-Text "story.js")
$(Read-Text "game.js")
</script>
"@
New-Item -ItemType Directory -Force (Join-Path $root "dist") | Out-Null
[IO.File]::WriteAllText((Join-Path $root "dist\satzschmiede.html"), $out, $utf8)
"Built dist\satzschmiede.html ($([math]::Round($out.Length / 1KB)) KB, $($images.Count) images)"

# ---------- 2) web version for GitHub Pages ----------
$docs = Join-Path $root "docs"
if (Test-Path $docs) { Remove-Item $docs -Recurse -Force }
New-Item -ItemType Directory -Force $docs | Out-Null
$files = @("index.html", "style.css", "data.js", "story.js", "game.js", "manifest.webmanifest", "icon.svg")
foreach ($f in $files) { Copy-Item (Join-Path $root $f) (Join-Path $docs $f) }
foreach ($rel in $images.Keys) {
  $target = Join-Path $docs $rel.Replace("/", "\")
  New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
  [IO.File]::WriteAllBytes($target, $images[$rel])
}
# Videos: compress for phones with ffmpeg (square 480 px for characters, 720 px wide for the title; no audio).
# Compressed clips are cached in assets/video/web/ so only new or changed clips are re-encoded.
$videos = @()
$videoDir = Join-Path $assetDir "video"
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (Test-Path $videoDir) {
  $webDir = Join-Path $videoDir "web"
  New-Item -ItemType Directory -Force $webDir, (Join-Path $docs "assets\video") | Out-Null
  Get-ChildItem $videoDir -Filter *.mp4 | ForEach-Object {
    $small = Join-Path $webDir $_.Name
    if ($ffmpeg -and (-not (Test-Path $small) -or (Get-Item $small).LastWriteTime -lt $_.LastWriteTime)) {
      $vf = if ($_.BaseName -eq "title") { "scale=720:-2" } else { "crop=ih:ih,scale=480:480" }
      & $ffmpeg.Source -v error -y -i $_.FullName -an -vf $vf -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart $small
    }
    $from = if (Test-Path $small) { $small } else { $_.FullName }
    Copy-Item $from (Join-Path $docs "assets\video\$($_.Name)")
    $videos += "$($_.Name) $([math]::Round((Get-Item $from).Length / 1KB)) KB"
  }
}
# Music (CC0, assets/music/*.mp3) and recorded story voices (assets/voice/*.mp3, made by tools/make-voices.py)
$audio = @()
foreach ($dir in "music", "voice") {
  $srcDir = Join-Path $assetDir $dir
  if (Test-Path $srcDir) {
    New-Item -ItemType Directory -Force (Join-Path $docs "assets\$dir") | Out-Null
    Get-ChildItem $srcDir -Filter *.mp3 | ForEach-Object { Copy-Item $_.FullName (Join-Path $docs "assets\$dir\$($_.Name)"); $audio += "assets/$dir/$($_.Name)" }
  }
}
# Offline support: cache the game, images and audio (videos stream from the web and are not cached)
$version = "ss-" + (Get-Date -Format "yyyyMMddHHmmss")
$cacheList = (@("./") + $files + ($images.Keys | Sort-Object) + $audio | ForEach-Object { '"' + $_ + '"' }) -join ", "
$sw = @"
/* Generated by build.ps1 - offline support for Satzschmiede. */
const VERSION = "$version";
const FILES = [$cacheList];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" }))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.pathname.endsWith(".mp4")) return;   // let videos stream normally
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(e.request);
    const fresh = fetch(e.request).then(r => { if (r.ok && url.origin === location.origin) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || fresh;
  }));
});
"@
[IO.File]::WriteAllText((Join-Path $docs "sw.js"), $sw, $utf8)
[IO.File]::WriteAllText((Join-Path $docs ".nojekyll"), "", $utf8)
$size = (Get-ChildItem $docs -Recurse -File | Measure-Object Length -Sum).Sum
"Built docs\ for GitHub Pages ($([math]::Round($size / 1MB, 1)) MB, $($images.Count) images, $($videos.Count) videos, $($audio.Count) audio files, cache $version)"
$videos | ForEach-Object { "  video: $_" }
