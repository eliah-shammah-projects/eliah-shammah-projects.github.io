# eliah-shammah-projects.github.io

Personal portfolio site - **https://eliah-shammah-projects.github.io**

Static HTML, CSS and one small vanilla JavaScript file. No framework, no build
step, no dependencies. The whole site is about 7 MB and deploys straight from
`main` via GitHub Pages.

## Structure

```
index.html          one page, seven sections
css/style.css       design tokens at the top, then base -> layout -> components
js/main.js          ~130 lines: mobile menu, scroll reveal, video playback
assets/
  cv/               CV as PDF
  img/              portrait, poster frames, social preview, favicon
  icons/            contact icons
  video/            four project screencasts
.nojekyll           serve files as-is, no Jekyll processing
```

## Running it locally

```bash
python -m http.server 8000
# -> http://localhost:8000
```

Opening `index.html` directly works too, but serving it over HTTP matches
production - video autoplay in particular behaves differently on `file://`.

## Design system

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FAFAF8` | page background |
| `--band` | `#EDEBE3` | alternating section bands |
| `--ink` | `#1C1F26` | primary text, dark bands |
| `--accent` | `#5B7A8C` | links, badges, detail |
| `--muted` | `#8A8F98` | secondary text |
| `--rule` | `#E8E6E0` | borders and dividers |

Type: Cormorant Garamond for display, Inter for body, JetBrains Mono for
labels and badges.

Sections alternate paper -> band -> dark so no two neighbours share a tone. A
dark band re-declares the colour tokens for its own subtree rather than
restyling each component, so badges, borders, tags and buttons invert on their
own - switching a section's background is a single class in the markup.

## Notes

**No live demo links.** Two of the four projects call paid LLM APIs (Claude,
Groq). A publicly reachable endpoint with no authentication is an open
invitation to burn credits, so the demos are shown as video instead. Exposing
one would mean a spend cap on the key and per-IP rate limiting first.

**Videos.** The screen recorder exports Matroska, which browsers will not play
in a `<video>` element. The stream inside is already H.264, so it only needs a
container swap - no re-encode, no quality loss:

```bash
ffmpeg -i new.mkv -c:v copy -an -movflags +faststart assets/video/<name>.mp4
```

`-an` drops audio (the site is muted) and `+faststart` moves the index to the
front so playback can begin before the file finishes downloading. Recordings
are 2.16:1; `aspect-ratio` on `.media` matches, so nothing is cropped.

**Cache busting.** `style.css` and `main.js` are linked with `?v=N`. Bump N
when either changes, or returning visitors keep the old copy.

## Deploying

Push to `main`. GitHub Pages rebuilds automatically, live in about a minute.
