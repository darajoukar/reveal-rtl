# reveal-rtl plugin for Claude

This plugin adds one skill, **`rtl-slides`**, that teaches Claude to build right-to-left HTML presentations — Persian (Farsi) or Arabic, with English labels as an option — using [reveal.js](https://revealjs.com) and the open-source [reveal-rtl](https://github.com/darajoukar/reveal-rtl) plugins.

Ask in your own words, for example «یک ارائه‌ی فارسی درباره‌ی انرژی خورشیدی بساز» or "make an Arabic deck about AI for my class". Claude creates a folder with a single `index.html`: slides written in Markdown inside it, the right-to-left layout fixed for every theme, Persian or Arabic digits, Jalali or Hijri dates, the bundled Vazirmatn font, a toolbar with slide list, timer, pen and laser, speaker notes and export to PDF or PNG. It can start from a thesis-defense or lecture outline. Before handing over, Claude checks Persian text for Arabic letters, missing zero-width non-joiners and mixed digits, and tells you how to open and present the deck.

## What the skill runs and fetches

- `npx create-reveal-rtl` (from the npm registry, pinned version) to write the starter `index.html`, or it copies the bundled `template.html` when Node.js is not available.
- `npx -p reveal-rtl reveal-rtl-lint` (pinned version) to check Persian text. It only reads files and prints findings.
- The generated presentation loads reveal.js and reveal-rtl from the jsDelivr CDN when it is opened in a browser.

Nothing else is sent anywhere, and no credentials are used.

## Install

- Claude Code: `/plugin install reveal-rtl --marketplace darajoukar/reveal-rtl`
- claude.ai: upload [`rtl-slides-skill.zip`](https://github.com/darajoukar/reveal-rtl/releases/latest/download/rtl-slides-skill.zip) under Settings → Capabilities → Skills.

MIT licensed. Source, docs and demo: https://github.com/darajoukar/reveal-rtl
