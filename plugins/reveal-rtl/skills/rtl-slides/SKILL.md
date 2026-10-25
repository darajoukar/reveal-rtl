---
name: rtl-slides
description: Create right-to-left HTML presentations (Persian/Farsi, Arabic) with reveal.js and the reveal-rtl plugins — correct RTL layout, Persian or Arabic digits, Jalali/Hijri dates, bundled Vazirmatn font, toolbar, speaker notes, PDF/PNG export. Use when the user asks for slides, a presentation, a deck or a talk in Persian or Arabic, or an RTL reveal.js presentation.
when_to_use: >-
  Requests like «ارائه بساز», «اسلاید فارسی», «پاورپوینت فارسی», «عرض تقديمي بالعربية», Persian slides,
  RTL presentation, reveal.js in Farsi, or a thesis defense or class presentation in Persian or Arabic.
license: MIT
---

# Right-to-left presentations with reveal-rtl

Produce one self-contained `index.html` (slides written in Markdown inside it) that opens with a double-click, from disk, with no build step. reveal-rtl: https://github.com/darajoukar/reveal-rtl

## 1. Settle the basics

From the request (ask only if it is unclear): **language** — `fa` (default), `ar` or `en` labels; **title**; **audience and length** (≈1 slide per minute); **folder** to create (default `my-presentation`). Write the slide text in the language the user writes in.

## 2. Create the deck

Preferred, when Node.js is available:

```bash
npx --yes create-reveal-rtl@0.3.0 <folder> --lang fa --title "<title>"
```

Add `--template thesis` for a thesis defense (title page with supervisor, problem, aims, related work, method, results, conclusion, references) or `--template class` for a lecture (goals, concept, example, in-class exercise with fragments, summary, homework). Then replace the outline's placeholders (…) with the user's content.

Without Node: copy [template.html](template.html) to `<folder>/index.html` and replace the placeholders: `{{lang}}` → `fa`/`ar`/`en`, `{{title}}` → the title (HTML-escaped), `{{version}}` → `0.5`, `{{slides}}` → the Markdown slides from step 3.

Both give the same file. Never edit anything outside the `<textarea data-template>` unless the user asks for a setting (see [reference.md](reference.md)).

## 3. Write the slides (Markdown inside the textarea)

- `---` on its own line starts a new slide; `--` a vertical (sub) slide; `Note:` starts speaker notes for that slide.
- First slide: `# Title`, a subtitle line, and `<time data-jalali></time>` (Persian date) or `<time data-hijri></time>` (Hijri date).
- Then `## Heading` per slide. One idea per slide, at most 5–6 short bullets. Prefer a table or a short numbered list over long paragraphs.
- Code in fenced blocks (```js …```); it stays left-to-right with Latin digits automatically.
- Digits: write normally (Latin is fine) — the plugin shows them as Persian/Arabic digits in the slides; code and `dir="ltr"` elements are left alone.
- Images and backgrounds: `![alt](images/x.jpg)`; per-slide background with a comment line under the slide separator:
  `<!-- .slide: data-background-image="images/x.jpg" data-background-opacity="0.35" -->`
- Directional icons (arrows, next/back): add `class="rtl-mirror"`. Never mirror clocks, logos or text.
- Add `Note:` with 1–3 sentences of talking points to the main slides when the user wants a talk, not just a handout.

### Persian typography (must follow)

- Persian letters «ی» and «ک», never Arabic «ي» / «ك» (in Arabic decks, use Arabic letters).
- Zero-width non-joiner (U+200C, نیم‌فاصله), not a space: «می‌شود»، «نمی‌دانم»، «کتاب‌ها»، «بزرگ‌ترین»، «خانه‌ی».
- Persian punctuation: «،» «؛» «؟» and guillemets «…».
- Don't mix digit sets inside one number.

## 4. Check

Run the Persian text checker and fix everything it reports (it only reports, never edits):

```bash
npx --yes -p reveal-rtl@0.5.3 reveal-rtl-lint <folder>
```

Skip this step for Arabic or English decks (it checks Persian rules). If you can open a browser, open `<folder>/index.html` and look at a few slides.

## 5. Hand over

Tell the user, briefly, in their language:

- Open `index.html` in a browser (double-click). ← / → change slides; `M` slide list and search; `S` speaker view; `F` fullscreen; `?` all keys.
- The toolbar (bottom) has the timer (click it to set a count-down), pen `D` / laser `Z`, themes, and the export menu: PDF, PNG of the current slide with drawings, Markdown, offline single-file HTML.
- To change text, edit the Markdown inside `index.html`.

For options (language, digits, themes, duration), keyboard list and less common features, read [reference.md](reference.md).
