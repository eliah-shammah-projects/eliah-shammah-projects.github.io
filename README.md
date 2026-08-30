# Personal site — Eliahu Netanel Shammah

Static portfolio site. Plain HTML + CSS + a small vanilla JS file — no build step,
no dependencies, ready for GitHub Pages.

```
index.html
css/style.css
js/main.js
assets/
  cv/        eliahu-shammah-cv.pdf
  img/       portrait.jpg, kehila.jpg, favicon.svg, og-image.jpg
  video/     psych-ai-chat.mp4, cashflow.mp4, world-cup.mp4
```

## Run locally

Open `index.html` in a browser, or serve it (needed for video autoplay to behave
like production):

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Assets

All in place — about 7 MB total.

| File | Notes |
|---|---|
| `assets/cv/eliahu-shammah-cv.pdf` | 1 page, 52 KB |
| `assets/img/portrait.jpg` | 1066×1066, already B&W (CSS also applies `grayscale(1)`) |
| `assets/video/*.mp4` | four screencasts, 1912×884, 1.4–2.0 MB each |
| `assets/img/<project>.jpg` | poster frame for each video, pulled at 2s |

Optional and still missing: `assets/img/og-image.jpg` (1200×630) for the social
preview card. Without it, links shared on LinkedIn/WhatsApp show no thumbnail.

Videos are `muted loop playsinline` and only play while on screen.

### Replacing a video

The screen recorder exports Matroska, which browsers won't play in `<video>`.
The stream inside is already H.264, so it only needs a container swap — no
re-encode, no quality loss:

```bash
ffmpeg -i new.mkv -c:v copy -an -movflags +faststart assets/video/<name>.mp4
```

`-an` drops audio (the site is muted), `+faststart` moves the index to the front
so playback can begin before the file finishes downloading.

ffmpeg here came from `pip install imageio-ffmpeg` — a Python package that ships
the binary, so nothing was installed system-wide. Path:

```bash
python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"
```

If the new recording isn't ~2.16:1, update `aspect-ratio` on `.media` in
`css/style.css` to match, or it will be cropped.

## Links

Every project card links to its repo (`View Code`) and nothing else — by design.

There are deliberately **no live demo links**. Psych AI Chat and CashFlow both
call paid LLM APIs (Claude, Groq), and a publicly reachable chat endpoint with no
auth is an open invitation to burn credits. The demo videos carry that weight
instead.

If you ever want to expose one, do it with a spend cap on the API key and
per-IP rate limiting in Nginx first — then add the button back in
`.project__actions`.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/eliah-shammah-projects/eliah-shammah-projects.github.io.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.

For `<user>.github.io` as the URL, name the repo exactly `<user>.github.io`.
`.nojekyll` is included so Jekyll doesn't touch the files.

## Design system

| Token | Value | Use |
|---|---|---|
| paper | `#FAFAF8` | background |
| ink | `#1C1F26` | primary text |
| accent | `#5B7A8C` | links, badges, terminal |
| muted | `#8A8F98` | secondary text |
| rule | `#E8E6E0` | borders, dividers |

Type: Cormorant Garamond (display, 300) · Inter (body) · JetBrains Mono
(labels, badges, terminal). All tokens live at the top of `css/style.css`.

## Pending

- [ ] **Skills section is undercooked** — Eliahu is rewriting the content. Needs
      more life than a flat list of tags: grouping is right, presentation isn't.
      Ideas not yet tried: brand marks per tool, proficiency weighting, grouping
      by what each tool is *used for* rather than by category.
- [ ] **Logos** for Or Yossef, Or Israel Community, Mego/ORT in the Experience
      timeline. Need transparent PNGs, 200px+ tall; will be greyscaled and
      levelled to a common optical height.
- [x] ~~Repo name~~ — `eliah-shammah-projects.github.io`
- [x] ~~`og:image` absolute URL~~
- [ ] **CV** predates the site, so it has no link back to it. Add
      `https://eliah-shammah-projects.github.io` to the CV, re-export, and
      replace `assets/cv/eliahu-shammah-cv.pdf`.
- [ ] Open questions for Eliahu: duotone strength on the portrait (now `.42`),
      and whether two dark bands is one too many.

### Cache busting

`style.css` and `main.js` are linked with `?v=N`. Bump N whenever either
changes, or returning visitors keep the old copy.
