# Contributing / مشارکت

[English](#english) · [فارسی](#فارسی)

<a id="english"></a>

## English

Thanks for helping! Issues and pull requests are welcome — look for the [good first issue](https://github.com/darajoukar/reveal-rtl/labels/good%20first%20issue) label to start.

### Setup

```bash
git clone https://github.com/darajoukar/reveal-rtl.git
cd reveal-rtl
npm install
npx playwright install chromium   # or use an installed browser: PW_CHANNEL=msedge
npm run demo                      # http://localhost:3000/demo/
```

### Where things are

| Path | What |
|---|---|
| `core/` | Framework-independent logic and CSS (`rtl.js`, `i18n.js`, `export.js`, `draw.js`, `lint.js`, `speaker.js`, `help.js`) — unit-tested with `node:test` |
| `plugin/rtl.js`, `plugin/ui.js` | The two reveal.js plugins |
| `dist/`, `themes/` | Built by `npm run build` — commit them with your change |
| `tests/` | Playwright browser tests (desktop + mobile) |
| `create-reveal-rtl/` | The `npm create reveal-rtl` starter (separate npm package) |
| `demo/`, `index.html` | Demos and the GitHub Pages site |

### Before opening a pull request

```bash
npm run build
npm test
npm run test:e2e
npm run lint:text
```

- New UI text goes into all three tables in `core/i18n.js` (a unit test checks nothing is missing).
- Keep it dependency-free at runtime; reveal.js is a peer dependency.
- Small, focused pull requests are easiest to review.

<a id="فارسی"></a>

## فارسی

<div dir="rtl">

از کمک شما ممنونیم! issue و pull request همیشه خوش‌آمد است. برای شروع، issueهایی با برچسب [good first issue](https://github.com/darajoukar/reveal-rtl/labels/good%20first%20issue) را ببینید.

### راه‌اندازی

دستورهای بخش انگلیسی بالا را اجرا کنید؛ دمو روی `http://localhost:3000/demo/` باز می‌شود.

### پیش از فرستادن pull request

- اگر کد را تغییر داده‌اید، `npm run build` را اجرا کنید و پوشه‌های `dist/` و `themes/` را هم commit کنید.
- `npm test`، `npm run test:e2e` و `npm run lint:text` باید بدون خطا اجرا شوند.
- هر متن جدید رابط کاربری باید در هر سه زبان در `core/i18n.js` اضافه شود.
- pull requestهای کوچک و متمرکز سریع‌تر بررسی می‌شوند.

</div>
