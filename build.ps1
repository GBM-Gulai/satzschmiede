# Packs the game into one self-contained file: dist/satzschmiede.html
# Images in assets/ are shrunk (max 640 px, JPEG) and embedded, so the file also works as a private claude.ai link.
# Run after changing anything:   powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-Text($rel) { [IO.File]::ReadAllText((Join-Path $root $rel), $utf8) }

# Shrink an image and return it as a data: URI (JPEG, quality 82)
function To-DataUri($file, $max) {
  $img = [System.Drawing.Image]::FromFile($file)
  try {
    $scale = [Math]::Min(1, $max / [Math]::Max($img.Width, $img.Height))
    $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = "HighQualityBicubic"; $g.DrawImage($img, 0, 0, $w, $h); $g.Dispose()
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]82)
    $ms = New-Object IO.MemoryStream
    $bmp.Save($ms, $codec, $params); $bmp.Dispose()
    return "data:image/jpeg;base64," + [Convert]::ToBase64String($ms.ToArray())
  } finally { $img.Dispose() }
}

$assets = @{}
$assetDir = Join-Path $root "assets"
if (Test-Path $assetDir) {
  Get-ChildItem $assetDir -Recurse -Include *.png, *.jpg, *.jpeg | ForEach-Object {
    $rel = "assets/" + $_.FullName.Substring($assetDir.Length + 1).Replace("\", "/")
    $rel = [IO.Path]::ChangeExtension($rel, ".png")   # the game always asks for .png
    $max = if ($rel -like "assets/bg/*") { 900 } else { 640 }
    $assets[$rel] = To-DataUri $_.FullName $max
  }
}
$assetJs = "window.ASSET_DATA = {" + (($assets.Keys | Sort-Object | ForEach-Object { '"' + $_ + '":"' + $assets[$_] + '"' }) -join ",") + "};"

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
"Built dist\satzschmiede.html ($([math]::Round($out.Length / 1KB)) KB, $($assets.Count) images)"
