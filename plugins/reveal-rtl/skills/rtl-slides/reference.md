# reveal-rtl reference (for the rtl-slides skill)

Full docs: https://github.com/darajoukar/reveal-rtl · Demo: https://darajoukar.github.io/reveal-rtl/demo/

## Settings in `Reveal.initialize({ … })`

The template already sets sensible defaults. Change only what the user asks for.

| Setting | Values | Effect |
|---|---|---|
| `rtlOptions.lang` | `'fa'` (default), `'ar'`, `'en'` | Language of every built-in label (toolbar, help, speaker view) |
| `rtlOptions.digits` | `'persian'`, `'arabic'`, `'latin'` | Digit style; default follows the language |
| `rtlOptions.labels` | `{ key: 'text' }` | Override single labels |
| `uiOptions.duration` | minutes | Timer counts down from this length |
| `uiOptions.warnAt` | minutes | When the count-down turns yellow (default 5) |
| `uiOptions.themes` | `[ { name, href } ]` | Theme menu entries |
| `slideNumber` | `'c/t'`, `'c'`, `'h.v'`, `'h/v'` | Slide number format (localized digits) |
| `scrollActivationWidth` | `null` | Keep slide-by-slide swiping on phones (already set) |

Themes (put in the `<link id="theme">` href): `themes/parsi-light.css`, `themes/parsi-dark.css` from the reveal-rtl CDN path, or any reveal.js theme (`https://cdn.jsdelivr.net/npm/reveal.js@6.0.2/dist/theme/<name>.css`, e.g. `white`, `black`, `serif`, `night`).

## Slide attributes (Markdown: `<!-- .slide: … -->` right after `---`)

| Attribute | Example |
|---|---|
| `data-background-color` | `"#1d3557"` |
| `data-background-image` | `"images/photo.jpg"` (+ `data-background-opacity="0.35"`, `data-background-size="contain"`) |
| `data-background-gradient` | `"linear-gradient(to left, #c2410c, #1d3557)"` |
| `data-menu-title` | Title shown in the slide list when the slide has no heading |
| `data-visibility="uncounted"` | Appendix slides not counted in the slide number |

Element attributes in Markdown: `<!-- .element: class="fragment" -->` after an item makes it appear on the next key press.

## Layout helpers (HTML inside the Markdown is allowed)

- Side by side: `<div class="r-hstack">…</div>` — in RTL the first child is on the right.
- Fill the slide: `<img class="r-stretch" src="…">`.
- Keep a phrase left-to-right: `<span dir="ltr">…</span>`; keep Latin digits: `class="latin-digits"`.

## Dates

`<time data-jalali></time>` (today, Persian calendar) · `<time data-jalali datetime="2025-03-21"></time>` · `<time data-hijri></time>` (Hijri, in the UI language).

## Keyboard

← next · → previous (RTL) · ↓ / ↑ vertical slides · `M` slide list · `G` jump to slide · `Esc` grid view · `S` speaker view · `F` fullscreen · `B` pause · `T` hide toolbar · `Z` laser · `D` pen · `E` erase drawing · `?` help

## Export menu (toolbar ⬇)

PDF (print view, then "Save as PDF") · PNG of the current slide with pen drawings (desktop; choose this tab when asked) · JSON · Markdown · HTML · offline single-file HTML (needs the deck opened from a web server or the published site, not `file://`) · speaker notes as text.

## Persian text checker

`npx --yes -p reveal-rtl@0.5.3 reveal-rtl-lint <files or folders>` — reports Arabic ي/ك, missing ZWNJ (after «می», before «ها/تر/ترین»), numbers mixing digit sets, Arabic-Indic digits. Elements with `lang="ar"` and code are skipped. Exit code 1 when something is found.
