# Packs the game into one self-contained file: dist/satzschmiede.html
# Images in assets/ are shrunk (max 640 px, JPEG) and embedded, so the file also works as a private claude.ai link.
# Run after changing anything:   powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Read-Text($rel) { [IO.File]::ReadAllText((Join-Path $root $rel), $utf8) }

# Shrink an image and return it as a data: URI (JPEG, quality 82)
function To-DataUri($file, $max, $trim) {
  $img = [System.Drawing.Image]::FromFile($file)
  try {
    $cx = [int]($img.Width * $trim); $cy = [int]($img.Height * $trim)
    $srcRect = New-Object System.Drawing.Rectangle $cx, $cy, ($img.Width - 2 * $cx), ($img.Height - 2 * $cy)
    $scale = [Math]::Min(1.0, [double]$max / [Math]::Max($srcRect.Width, $srcRect.Height))
    $w = [int]($srcRect.Width * $scale); $h = [int]($srcRect.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = "HighQualityBicubic"
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), $srcRect, [System.Drawing.GraphicsUnit]::Pixel); $g.Dispose()
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
    $rel = [IO.Path]::ChangeExtension($rel, ".jpg")   # the game always asks for .jpg
    $max = if ($rel -like "assets/bg/*") { 900 } else { 640 }
    $trim = 0   # paper edges are hidden by a slight zoom in style.css instead
    $assets[$rel] = To-DataUri $_.FullName $max $trim
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
