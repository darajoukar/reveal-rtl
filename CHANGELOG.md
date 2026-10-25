# Changelog

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
