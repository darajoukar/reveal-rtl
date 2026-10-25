# Changelog

## Unreleased

- **Slide image (PNG)** in the export menu: the current slide as shown — theme, background, pen drawing — via the browser's tab capture; the toolbar is hidden while capturing. Desktop browsers only.
- Offline HTML export now embeds slide background images (`data-background-image`, image `data-background`) and lazy images (`data-src`); the plain HTML export makes those paths absolute.
- `rtl-mirror` class: flips directional icons/images in RTL decks.
- Media demo (`demo/media.html`): backgrounds, side-by-side image and text, stretched image, SVG icons.

## 0.4.0 — 2026-10-25

- **Saved drawings**: pen strokes are stored per slide (localStorage, per deck URL), survive reloads and are drawn onto the PDF export. Strokes now use slide-box coordinates, so they stay on the slide at any window size.
- **Hijri dates**: `<time data-hijri></time>` (Umm al-Qura) in the UI language and digit style.
- **Persian text checker**: `npx reveal-rtl-lint [files…]` reports Arabic ي/ك, missing ZWNJ, mixed digit sets and Arabic-Indic digits; never edits. Runs in CI on the demos and docs.
- **Starter**: `npm create reveal-rtl my-talk` (new `create-reveal-rtl` package) writes a ready-to-open presentation in Persian, Arabic or English.

## 0.3.0 — 2026-10-25

- **Languages**: `rtlOptions.lang` = `'fa'` (default), `'ar'` or `'en'` for every built-in label — toolbar, slide list, exports, timer, keyboard help, speaker view, notes, jump-to-slide. `rtlOptions.labels` overrides single strings (`core/i18n.js`).
- **Digit styles**: `rtlOptions.digits` = `'persian'`, `'arabic'` or `'latin'` (default by language) — slide text, slide number, PDF pages, ordered lists, Jalali dates, clock and timer.
- **Themes**: `themes/parsi-light.css` and `themes/parsi-dark.css`, built from the reveal.js theme template.
- Persian/Arabic text inside code now joins correctly (script-only Vazirmatn fallback before the monospace font).
- Markdown demo (`demo/markdown.html`) and a language switcher in the demo.
- Trilingual README (English, فارسی, العربية) with screenshots; GitHub Pages landing page (`index.html`).
- `reveal-rtl/themes/*` export.

## 0.2.0 — 2026-10-25

- Slide number keeps every reveal.js format (`h.v`, `h/v`, `c`, `c/t`) with Persian digits; PDF page numbers are Persian too.
- Vazirmatn is bundled (`fonts/`, OFL) — no Google Fonts or internet needed.
- New export: "HTML آفلاین" — one file with CSS, scripts, fonts and images inlined; runs with no network.
- Keyboard help overlay (`?`) is Persian and RTL.
- Verified on all 14 reveal.js themes (automated test).
- Fix: toolbar no longer swallows Esc/arrow keys after a button click.
- Count-down timer: click the timer (or `uiOptions.duration` / `totalTime`) to set a length; yellow near the end, red and negative when over.
- Laser pointer (`Z`), pen (`D`) and erase (`E`); drawings are kept per slide and redraw on resize.
- Slide preview when hovering the slide list.
- Jump to slide (`G`) accepts Persian digits, with a Persian placeholder.
- Toolbar wraps to two rows when wider than the screen.

## 0.1.0 — 2026-10-25

First release, for reveal.js 6.

### RevealRTL (`plugin/rtl.js`, `core/rtl.css`)

- Turns on reveal.js `rtl` mode before the first render.
- Fixes theme list indentation, table alignment and the forced `sans-serif` font; Vazirmatn by default.
- Persian digits in slide text and slide number (code and `dir="ltr"` content untouched).
- Jalali dates with `<time data-jalali>`.
- RTL on-slide notes, and a mirrored speaker view with Persian labels and digits.

### RevealRTLUI (`plugin/ui.js`, `core/ui.css`)

- Slide list panel with search (`M`), first/last buttons, grid view.
- Presentation timer that survives page refresh, clock.
- Zoom in/out/reset, theme switcher (remembered).
- Notes toggle, speaker view button, fullscreen.
- Export menu: PDF (print view), JSON, Markdown, standalone HTML, speaker notes.
- Toolbar hide/show (`T`), compact layout on phones.

### Builds

- `dist/reveal-rtl.js` and `dist/reveal-rtl-ui.js` for plain `<script>` use (works from `file://`).
