<div align="center">

# reveal-rtl

**Right-to-left presentations with [reveal.js](https://revealjs.com) 6 — Persian, Arabic and more**

<span dir="rtl">**ارائه‌های راست‌به‌چپ با reveal.js** · <b lang="ar">عروض تقديمية من اليمين إلى اليسار مع reveal.js</b></span>

[![npm](https://img.shields.io/npm/v/reveal-rtl?color=c2410c)](https://www.npmjs.com/package/reveal-rtl)
[![CI](https://github.com/darajoukar/reveal-rtl/actions/workflows/ci.yml/badge.svg)](https://github.com/darajoukar/reveal-rtl/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/reveal-rtl?color=1d3557)](LICENSE)

[**Website**](https://darajoukar.github.io/reveal-rtl/) · [**Live demo**](https://darajoukar.github.io/reveal-rtl/demo/) · [Markdown demo](https://darajoukar.github.io/reveal-rtl/demo/markdown.html) · [Gallery](https://darajoukar.github.io/reveal-rtl/gallery/) · [npm](https://www.npmjs.com/package/reveal-rtl)

[English](#english) · [فارسی](#فارسی) · <a href="#العربية" lang="ar">العربية</a>

<img src="https://raw.githubusercontent.com/darajoukar/reveal-rtl/main/docs/demo.gif" alt="reveal-rtl in action: slide list search, pen, laser pointer and theme switch" width="720">

<img src="https://raw.githubusercontent.com/darajoukar/reveal-rtl/main/docs/screenshot-light.png" alt="reveal-rtl demo: Persian slide, Parsi light theme" width="49%"> <img src="https://raw.githubusercontent.com/darajoukar/reveal-rtl/main/docs/screenshot-dark.png" alt="reveal-rtl demo: slide list and toolbar, Parsi dark theme" width="49%">

</div>

---

## Quick start

Start a new presentation in one command (one `index.html`, slides in Markdown):

```bash
npm create reveal-rtl my-talk                # Persian; add -- --lang ar or -- --lang en
npm create reveal-rtl my-defense -- --template thesis   # thesis defense outline
npm create reveal-rtl lesson-3 -- --template class      # lecture outline
```

Add to an existing project:

```bash
npm install reveal.js reveal-rtl
```

Or straight from a CDN — no build step, works from `file://`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@6.0.2/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal-rtl@0.5.5/themes/parsi-light.css" id="theme">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal-rtl@0.5.5/core/rtl.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal-rtl@0.5.5/core/ui.css">

<div class="reveal"><div class="slides">
  <section><h1>سلام دنیا</h1></section>
</div></div>

<script src="https://cdn.jsdelivr.net/npm/reveal.js@6.0.2/dist/reveal.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@6.0.2/dist/plugin/notes.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal-rtl@0.5.5/dist/reveal-rtl.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal-rtl@0.5.5/dist/reveal-rtl-ui.js"></script>
<script>
  Reveal.initialize({
    slideNumber: 'c/t',
    scrollActivationWidth: null,          // keep swiping slide by slide on phones
    rtlOptions: { lang: 'fa' },           // 'fa' | 'ar' | 'en'
    plugins: [ RevealNotes, RevealRTL(), RevealRTLUI() ]
  });
</script>
```

With a bundler / ES modules:

```js
import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes';
import RevealRTL from 'reveal-rtl';
import RevealRTLUI from 'reveal-rtl/ui';
import 'reveal.js/reveal.css';
import 'reveal-rtl/rtl.css';
import 'reveal-rtl/ui.css';

Reveal.initialize({ plugins: [ RevealNotes, RevealRTL(), RevealRTLUI() ] });
```

`RevealRTLUI` (toolbar, slide list, exports) and `ui.css` are optional.

---

<a id="english"></a>

## English

### Two plugins

| Plugin | File | What it does |
|---|---|---|
| **RevealRTL** | `plugin/rtl.js` + `core/rtl.css` | Right-to-left layout and typography, localized digits, Jalali dates, localized help, notes and speaker view |
| **RevealRTLUI** | `plugin/ui.js` + `core/ui.css` | Toolbar, searchable slide list, timer, drawing tools, zoom, themes, exports |

### RevealRTL features

- Turns on reveal.js `rtl` mode before the first render (direction, arrow keys, swipe, progress bar)
- Fixes what reveal.js themes leave left-to-right: list indentation, table alignment, the forced `sans-serif` font, letter spacing
- **Vazirmatn bundled** (variable font, OFL) — works offline, no Google Fonts; change with `--rtl-font`
- **Localized digits** in slide text, slide number (every format: `h.v`, `h/v`, `c`, `c/t`), PDF page numbers and ordered lists — Persian `۱۲۳`, Arabic `١٢٣` or Latin
- Code, `pre`, `dir="ltr"` and `.latin-digits` content stays left-to-right with Latin digits; Persian/Arabic text inside code still joins correctly
- **Jalali dates**: `<time data-jalali></time>` (today) or `<time data-jalali datetime="2025-03-21"></time>`; **Hijri (lunar) dates** with `<time data-hijri></time>`, in the UI language
- Localized, RTL **keyboard help** (`?`), **on-slide notes** and **speaker view** (`S`, mirrored layout)
- **Jump to slide** (`G`) accepts Persian/Arabic digits
- Tested on all 14 reveal.js themes plus the two bundled ones

### RevealRTLUI features

- **Slide list** with search (`M`) — matches Arabic/Persian letter variants and digits; hover shows a slide preview
- First / last slide, **grid view** (overview)
- **Timer** that survives a page refresh; click it to set a length and it **counts down**, turning yellow near the end and red (negative) when over
- **Laser pointer** (`Z`), **pen** (`D`) and **erase** (`E`); drawings are kept per slide, saved across reloads and included in the PDF export
- Zoom in / out / reset, **theme switcher** (remembered), clock
- Notes on the slide, speaker view button, fullscreen
- **Export**: PDF (print view), **PNG image of the current slide with your pen drawing**, JSON, Markdown (reveal.js format, `Note:` for notes), HTML, **offline single-file HTML** (CSS, scripts, fonts, images and slide backgrounds inlined) and speaker notes as text
- Hide / show the toolbar (`T`); compact one-row layout on phones

### Options

`rtlOptions` (shared by both plugins):

| Option | Default | Description |
|---|---|---|
| `lang` | `'fa'` | Language of all built-in labels: `'fa'`, `'ar'`, `'en'` |
| `digits` | by language | `'persian'`, `'arabic'`, `'latin'`; `true` = language default, `false` = Latin |
| `labels` | — | Override single labels, e.g. `{ first: 'آغاز' }` (keys in [`core/i18n.js`](core/i18n.js)) |

`uiOptions`:

| Option | Default | Description |
|---|---|---|
| `themes` | `[]` | Theme menu entries: `{ name, href }` |
| `themeLink` | `'#theme'` | Selector of the theme `<link>` to swap |
| `duration` | `totalTime` / none | Presentation length in minutes; the timer counts down |
| `warnAt` | 5 (or 20% of a short talk) | Minutes left when the timer turns yellow |
| `idle` | `3000` | Milliseconds without mouse movement before the toolbar fades |
| `digits` | `rtlOptions.digits` | Digit style for the toolbar only |

### Keyboard

| Key | Action | Key | Action |
|---|---|---|---|
| `←` / `→` | Next / previous slide (RTL) | `M` | Slide list |
| `Esc` / `O` | Grid view | `T` | Hide / show toolbar |
| `G` | Jump to slide | `Z` | Laser pointer |
| `S` | Speaker view | `D` | Pen |
| `F` | Fullscreen | `E` | Erase this slide's drawing |
| `B` / `.` | Pause (black screen) | `?` | Keyboard help |

### Themes

Two themes built from the reveal.js theme template, tuned for Persian/Arabic: `themes/parsi-light.css` and `themes/parsi-dark.css`. Use them in place of a reveal.js theme. All 14 reveal.js themes work too.

### Images, backgrounds and icons

Use reveal.js's own features; see [`demo/media.html`](https://darajoukar.github.io/reveal-rtl/demo/media.html):

```html
<section data-background-image="images/photo.jpg" data-background-opacity="0.4">…</section>
<section data-background-gradient="linear-gradient(to left, #c2410c, #1d3557)">…</section>

<div class="r-hstack">              <!-- in RTL the first child sits on the right -->
  <ul><li>متن</li></ul>
  <img src="images/chart.svg" alt="…">
</div>
<img class="r-stretch" data-src="images/big.jpg" alt="…">   <!-- fill the slide, lazy-loaded -->

<svg class="rtl-mirror" viewBox="0 0 24 24" fill="currentColor">…</svg>   <!-- arrow points the reading direction -->
```

- `data-background-opacity` keeps text readable on photos. In Markdown: `<!-- .slide: data-background-image="images/photo.jpg" -->`.
- **`rtl-mirror`** (from `core/rtl.css`) flips directional icons/images — arrows, "next", "back" — in RTL decks only. Don't use it on clocks, logos or text.
- Inline SVG with `fill="currentColor"` follows the theme color.
- The **offline HTML** export embeds `<img>` (including `data-src`) and slide background images; background videos and iframes stay as links.
- **Image of this slide (PNG)** in the export menu saves the slide exactly as shown — theme, background and pen drawing — using the browser's screen capture (desktop browsers; choose this tab when asked).

### Writing slides in Markdown

Use reveal.js's markdown plugin and list it before `RevealRTL()`; see [`demo/markdown.html`](demo/markdown.html):

```html
<section data-markdown data-separator="^---$" data-separator-notes="^Note:">
  <textarea data-template>
## فهرست
- مورد اول
Note: یادداشت سخنران
  </textarea>
</section>
```

### Phones

Below 435px reveal.js 6 switches to a vertical scroll view; set `scrollActivationWidth: null` to keep swiping slide by slide.

### Use with Claude (Agent Skill)

The repo ships an Agent Skill, **`rtl-slides`**, that teaches Claude to build reveal-rtl presentations — correct Persian typography, speaker notes, the text check — from a request like «یک ارائه‌ی فارسی درباره‌ی … بساز».

- **Claude Code** (2.1.275+):
  ```
  /plugin install reveal-rtl --marketplace darajoukar/reveal-rtl
  ```
  or in two steps: `/plugin marketplace add darajoukar/reveal-rtl`, then `/plugin install reveal-rtl@reveal-rtl`.
- **claude.ai** (web/desktop): download [`rtl-slides-skill.zip`](https://github.com/darajoukar/reveal-rtl/releases/latest/download/rtl-slides-skill.zip) and upload it under Settings → Capabilities → Skills.
- **By hand**: copy [`plugins/reveal-rtl/skills/rtl-slides`](plugins/reveal-rtl/skills/rtl-slides) into `~/.claude/skills/`.

### Persian text checker

```bash
npx reveal-rtl-lint slides/            # files or folders; .html and .md
```

Reports Arabic `ي`/`ك` instead of Persian `ی`/`ک`, a space where a zero-width non-joiner belongs (`می رود` → `می‌رود`, `کتاب ها` → `کتاب‌ها`), numbers mixing digit sets (`۱4`) and Arabic-Indic digits in Persian text. It only reports — nothing is changed — and exits with code 1 when it finds something (handy in CI). Code, elements with another `lang` (e.g. `lang="ar"`) and text between `<!-- reveal-rtl-lint-disable -->` and `<!-- reveal-rtl-lint-enable -->` are skipped.

### Development

```bash
npm install
npm run build       # dist/ bundles and themes/ (commit both)
npm test            # unit tests
npm run test:e2e    # Playwright browser tests (desktop + mobile)
npm run lint:text   # Persian text check of the demos and docs
npm run demo        # serve the repo at http://localhost:3000/demo/
```

If Playwright's Chromium download is unavailable, use an installed browser: `PW_CHANNEL=msedge npm run test:e2e`. CI fails if `dist/` or `themes/` is out of date.

---

<a id="فارسی"></a>

## فارسی

<div dir="rtl">

<span  dir="rtl">**reveal-rtl** دو پلاگین برای ساخت ارائه‌های راست‌به‌چپ با reveal.js 6 است؛ برای فارسی ساخته شده و عربی را هم پشتیبانی می‌کند.</span>

### نصب

</div>

```bash
npm install reveal.js reveal-rtl
```

<div dir="rtl">

یا بدون نصب، مستقیم از CDN — نمونه‌ی کامل در بخش [Quick start](#quick-start) بالا. فایل HTML را می‌شود مستقیم با دابل‌کلیک باز کرد.

### پلاگین RevealRTL

- فعال شدن حالت `rtl` در reveal.js پیش از اولین نمایش (جهت، کلیدها، کشیدن انگشت، نوار پیشرفت)
- اصلاح تورفتگی فهرست‌ها، تراز جدول‌ها و فونت در تم‌های reveal.js
- **فونت وزیرمتن داخل پکیج**؛ بدون اینترنت و بدون Google Fonts (قابل تغییر با `--rtl-font`)
- **اعداد فارسی** در متن اسلاید، شماره‌ی اسلاید (همه‌ی قالب‌ها)، شماره‌ی صفحه‌های PDF و فهرست شماره‌دار؛ یا اعداد عربی یا لاتین
- کد و متن‌های `dir="ltr"` چپ‌به‌راست و با اعداد لاتین می‌مانند؛ متن فارسی داخل کد هم درست و پیوسته نمایش داده می‌شود
- **تاریخ شمسی** با `<time data-jalali></time>` و **تاریخ قمری** با `<time data-hijri></time>`
- **راهنمای کلیدها** (`?`)، **یادداشت‌ها** و **پنجره‌ی سخنران** (`S`) فارسی و راست‌به‌چپ
- **رفتن به اسلاید** (`G`) با اعداد فارسی

### پلاگین RevealRTLUI (نوار ابزار)

- **فهرست اسلایدها** با جستجو (`M`) و پیش‌نمایش با بردن موس
- اولین و آخرین اسلاید، **نمای شبکه‌ای**
- **تایمر** که با رفرش متوقف نمی‌شود؛ با کلیک روی آن مدت ارائه را بدهید تا **معکوس** بشمارد (زرد در دقایق آخر، قرمز و منفی بعد از پایان وقت)
- **نشانگر لیزری** (`Z`)، **قلم** (`D`) و **پاک کردن** (`E`)؛ نوشته‌ها برای هر اسلاید جدا، بعد از رفرش هم می‌مانند و در خروجی PDF هم می‌آیند
- بزرگ‌نمایی و کوچک‌نمایی، **انتخاب تم**، ساعت، یادداشت‌ها، پنجره‌ی سخنران، تمام‌صفحه
- **خروجی**: PDF، JSON، Markdown، HTML، **HTML آفلاین تک‌فایلی** و یادداشت‌های سخنران
- پنهان و نمایش نوار ابزار (`T`)؛ نمای فشرده روی گوشی

### تنظیمات

گزینه `rtlOptions.lang` زبان برچسب‌ها را تعیین می‌کند (`'fa'` پیش‌فرض، `'ar'`، `'en'`) و `rtlOptions.digits` نوع رقم را (`'persian'`، `'arabic'`، `'latin'`). جدول کامل تنظیمات و کلیدها در [بخش انگلیسی](#english) است.

### تم‌ها

دو تم مخصوص فارسی و عربی: **پارسی روشن** (`themes/parsi-light.css`) و **پارسی تیره** (`themes/parsi-dark.css`). همه‌ی ۱۴ تم reveal.js هم کار می‌کنند.

### عکس، پس‌زمینه و آیکن

از امکانات خود reveal.js استفاده کنید (نمونه در [`demo/media.html`](https://darajoukar.github.io/reveal-rtl/demo/media.html)):

- **پس‌زمینه‌ی اسلاید:** `data-background-image`، `data-background-color` و `data-background-gradient`؛ با `data-background-opacity` عکس کم‌رنگ می‌شود تا متن خوانا بماند.
- **عکس و متن کنار هم:** کلاس `r-hstack`؛ در راست‌به‌چپ اولین بخش سمت راست قرار می‌گیرد. `r-stretch` عکس را به اندازه‌ی اسلاید بزرگ می‌کند.
- **آیکن:** SVG با `fill="currentColor"` رنگ تم را می‌گیرد. به آیکن‌های جهت‌دار (فلش، بعدی، برگشت) کلاس **`rtl-mirror`** بدهید تا در ارائه‌ی راست‌به‌چپ قرینه شوند؛ ساعت و لوگو را قرینه نکنید.
- خروجی **HTML آفلاین** عکس‌ها و پس‌زمینه‌های اسلاید را هم داخل فایل قرار می‌دهد.
- **تصویر این اسلاید (PNG)** در منوی خروجی، اسلاید را دقیقاً همان‌طور که می‌بینید ذخیره می‌کند، همراه با نوشته‌های قلم (در مرورگر دسکتاپ؛ وقتی پرسید، همین تب را انتخاب کنید).

### نوشتن با Markdown

پلاگین markdown خود reveal.js را قبل از `RevealRTL()` بگذارید؛ نمونه در [`demo/markdown.html`](demo/markdown.html).

### موبایل

برای اینکه روی گوشی اسلاید به اسلاید (با کشیدن انگشت) کار کند، `scrollActivationWidth: null` را تنظیم کنید.

### شروع سریع

با یک دستور یک ارائه‌ی آماده‌ی فارسی بسازید (یک فایل `index.html` با اسلایدهای Markdown):

</div>

```bash
npm create reveal-rtl my-talk
npm create reveal-rtl defa -- --template thesis
npm create reveal-rtl jalase-3 -- --template class
```

<div dir="rtl">

قالب `thesis` اسلایدهای **دفاع پایان‌نامه** را آماده می‌کند (عنوان با استاد راهنما و مشاور، بیان مسئله، اهداف، پیشینه، روش، یافته‌ها، نتیجه‌گیری، منابع) و قالب `class` اسلایدهای **ارائه‌ی کلاسی** را (اهداف جلسه، مفهوم، مثال، تمرین کلاسی، جمع‌بندی، تکلیف). فقط جاهای «…» را پر کنید. نمونه‌های پرشده در [گالری](https://darajoukar.github.io/reveal-rtl/gallery/) هستند.

### استفاده با Claude

این ریپو یک Skill به اسم **`rtl-slides`** دارد که به Claude یاد می‌دهد ارائه را با reveal-rtl بسازد؛ با نیم‌فاصله و نگارش درست فارسی، یادداشت سخنران و بررسی متن. بعد از نصب کافی است بنویسید: «یک ارائه‌ی فارسی درباره‌ی … بساز».

- در **Claude Code:** دستور `/plugin install reveal-rtl --marketplace darajoukar/reveal-rtl`
- در **claude.ai:** فایل [`rtl-slides-skill.zip`](https://github.com/darajoukar/reveal-rtl/releases/latest/download/rtl-slides-skill.zip) را دانلود کنید و در Settings → Capabilities → Skills آپلود کنید.

### بررسی متن فارسی

</div>

```bash
npx reveal-rtl-lint slides/
```

<div dir="rtl">

<!-- reveal-rtl-lint-disable --> <!-- the wrong examples below are on purpose -->
این ابزار «ي» و «ك» عربی، فاصله به‌جای نیم‌فاصله (مثل «می رود» و «کتاب ها»)، عددهایی که ارقام فارسی و لاتین را قاطی کرده‌اند (مثل «۱4») و ارقام عربی در متن فارسی را گزارش می‌کند. فقط هشدار می‌دهد و چیزی را تغییر نمی‌دهد. کد و بخش‌هایی با `lang="ar"` بررسی نمی‌شوند.
<!-- reveal-rtl-lint-enable -->

</div>

---

<!-- reveal-rtl-lint-disable -->
<a id="العربية"></a>

## العربية



مشروع **reveal-rtl** يضمّ إضافتين لإنشاء عروض تقديمية من اليمين إلى اليسار باستخدام reveal.js 6، مع دعم كامل للعربية والفارسية.

### التثبيت



```bash
npm install reveal.js reveal-rtl
```

<div dir="rtl">

أو مباشرةً من CDN دون تثبيت — المثال الكامل في قسم [Quick start](#quick-start) أعلاه. اضبط اللغة العربية هكذا:

</div>

```js
Reveal.initialize({
  rtlOptions: { lang: 'ar' },   // واجهة عربية وأرقام عربية ١٢٣
  plugins: [ RevealNotes, RevealRTL(), RevealRTLUI() ]
});
```

<div dir="rtl">

### إضافة RevealRTL

- تفعيل وضع `rtl` في reveal.js قبل العرض الأول (الاتجاه، الأسهم، السحب، شريط التقدم)
- إصلاح المسافات البادئة للقوائم ومحاذاة الجداول والخط في سمات reveal.js
- **خط Vazirmatn مضمّن** يعمل دون اتصال بالإنترنت
- **أرقام عربية** (أو فارسية أو لاتينية) في نص الشرائح ورقم الشريحة وصفحات PDF والقوائم المرقمة
- الشيفرة والنصوص `dir="ltr"` تبقى من اليسار إلى اليمين بأرقام لاتينية
- **التاريخ الهجري** بوسم `<time data-hijri></time>`
- **مساعدة لوحة المفاتيح** (`?`) و**الملاحظات** و**نافذة المتحدث** (`S`) بالعربية ومن اليمين إلى اليسار
- **الانتقال إلى شريحة** (`G`) بالأرقام العربية

### إضافة RevealRTLUI (شريط الأدوات)

- **قائمة الشرائح** مع البحث (`M`) ومعاينة عند تمرير الفأرة
- الشريحة الأولى والأخيرة، **العرض الشبكي**
- **مؤقت** لا يتوقف عند إعادة التحميل؛ انقر عليه لتحديد المدة فيعدّ **تنازليًا** (أصفر قرب النهاية، أحمر وسالب بعد انتهاء الوقت)
- **مؤشر ليزر** (`Z`) و**قلم** (`D`) و**مسح** (`E`)؛ الكتابة محفوظة لكل شريحة بعد إعادة التحميل وتظهر في تصدير PDF
- التكبير والتصغير، **اختيار السمة**، الساعة، الملاحظات، نافذة المتحدث، ملء الشاشة
- **التصدير**: PDF وJSON وMarkdown وHTML و**HTML دون اتصال في ملف واحد** وملاحظات المتحدث
- إخفاء شريط الأدوات وإظهاره (`T`)؛ تخطيط مضغوط على الهاتف

</div>

### الخيارات

الخيار `rtlOptions.lang` يحدد لغة الواجهة (`'fa'` أو `'ar'` أو `'en'`) و`rtlOptions.digits` نوع الأرقام (`'persian'` أو `'arabic'` أو `'latin'`). الجداول الكاملة للخيارات والمفاتيح في [القسم الإنجليزي](#english).

<div dir="rtl">

### الاستخدام مع Claude

مهارة **`rtl-slides`** تعلّم Claude إنشاء عروض reveal-rtl. في Claude Code: `/plugin install reveal-rtl --marketplace darajoukar/reveal-rtl`؛ وفي claude.ai ارفع الملف [`rtl-slides-skill.zip`](https://github.com/darajoukar/reveal-rtl/releases/latest/download/rtl-slides-skill.zip) من Settings → Capabilities → Skills.

### الصور والخلفيات والأيقونات

- **خلفية الشريحة:** `data-background-image` و`data-background-gradient`، مع `data-background-opacity` لإبقاء النص مقروءًا.
- **صورة ونص جنبًا إلى جنب:** الصنف `r-hstack`؛ في الاتجاه من اليمين إلى اليسار يكون العنصر الأول على اليمين.
- **الأيقونات:** أضف الصنف **`rtl-mirror`** إلى الأيقونات الاتجاهية (الأسهم، التالي، الرجوع) لتنعكس تلقائيًا.
- **صورة هذه الشريحة (PNG)** في قائمة التصدير تحفظ الشريحة كما تظهر مع كتابة القلم.

### الهاتف

لكي يعمل العرض شريحةً بشريحة بالسحب على الهاتف، اضبط `scrollActivationWidth: null`.

### بداية سريعة

أنشئ عرضًا جاهزًا بالعربية بأمر واحد:

</div>

```bash
npm create reveal-rtl my-talk -- --lang ar
```

---

<div align="center">

MIT © Dara Joukar · Vazirmatn font: [SIL OFL 1.1](fonts/OFL.txt) · Built on [reveal.js](https://revealjs.com)

</div>
