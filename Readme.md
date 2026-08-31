This is Longshen Ou's personal website, powered by Jekyll.
Site: https://www.oulongshen.xyz/
Github: https://github.com/Sonata165/sonata165.github.io
Theme: [minima](https://github.com/jekyll/minima)

Environment config:
```
# Install jekyll, and then
gem install bundler
bundle install
```

## Notes / gotchas

### Converting a PDF figure to PNG

`![]()` (and `<img>`) can only render actual image formats (PNG, JPG, SVG, GIF, WebP) — not PDFs, since browsers don't rasterize PDFs inside `<img>`. If a figure only exists as a PDF, convert it first.

`sips` (built into macOS) can convert PDF to PNG, but only at a tiny default resolution (e.g. ~244x137px) — not usable for a web figure. Instead use `qlmanage` (Quick Look), which supports a `-s` size flag for high-res output:

```bash
qlmanage -t -s 2000 -o . figure.pdf
mv figure.pdf.png figure.png
```

This renders at 2000px on the long edge, which is sharp enough for web use.

### Audio/video breaks in local dev (`jekyll serve`) but works on GitHub Pages

Symptoms, all local-only:

- an `<audio>` player gets stuck around `0:01` and never advances
- refreshing the page mid-playback leaves the audio not loading at all
- pausing before a refresh makes it auto-suspend within the first second
- seeking/scrubbing doesn't work

**Cause:** `jekyll serve` uses WEBrick, which handles HTTP `Range` requests and
aborted media connections poorly. `<audio>`/`<video>` depend on `Range` for
seeking and for resuming playback across a reload. GitHub Pages serves the site
through a CDN that handles `Range` correctly, which is why the deployed site is
always fine. **If media misbehaves only locally, suspect the dev server before
suspecting the file.**

**Fix:** serve the built site with Caddy instead of WEBrick:

```bash
brew install caddy   # one time
./serve-range.sh     # jekyll build --watch + caddy on http://localhost:4000
```

`serve-range.sh` runs `jekyll build --watch` (so edits still rebuild) and serves
`_site/` via `Caddyfile.dev`. Verified working: `Range` requests return
`206 Partial Content` with a correct `Content-Range`.

Note that `caddy file-server` alone is *not* enough. Jekyll writes
`permalink: /amt` to `_site/amt.html`, and unlike WEBrick, Caddy's plain file
server won't try the `.html` extension, so every extensionless permalink 404s.
`Caddyfile.dev` handles this with
`try_files {path} {path}.html {path}/index.html`.

### Aside: MP3 files remuxed from streaming sources

Unrelated to the dev-server issue above, but worth knowing: `.mp3` files pulled
from a YouTube/DASH stream (e.g. via `yt-dlp`) are sometimes remuxed rather than
properly encoded, and can carry leftover MP4 container metadata:

```bash
ffprobe -v error -show_format file.mp3
# TAG:MAJOR_BRAND=dash
# TAG:COMPATIBLE_BRANDS=iso6av01mp41
```

Such files may lack the Xing/LAME header browsers prefer for duration and
seeking. Re-encoding produces a clean MP3:

```bash
ffmpeg -i file.mp3 -map_metadata -1 -c:a libmp3lame -b:a 192k file_clean.mp3
```

This was *not* what caused the stuck-playback problem here (the dev server was),
so try `serve-range.sh` first before re-encoding anything.
