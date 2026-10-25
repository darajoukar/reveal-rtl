# reveal-rtl

[فارسی](#فارسی) | [English](#english)

Right-to-left support plugin for [reveal.js](https://revealjs.com) 6, built for Persian presentations.

[![npm](https://img.shields.io/npm/v/reveal-rtl)](https://www.npmjs.com/package/reveal-rtl) [![CI](https://github.com/darajoukar/reveal-rtl/actions/workflows/ci.yml/badge.svg)](https://github.com/darajoukar/reveal-rtl/actions/workflows/ci.yml) · [Demo](https://darajoukar.github.io/reveal-rtl/demo/)

## Install / نصب

```bash
npm install reveal.js reveal-rtl
```

Or from a CDN, no build step (works from `file://`) — یا مستقیم از CDN، بدون نصب:

```html
<link rel="stylesheet" href="https://unpkg.com/reveal.js@6.0.2/dist/reveal.css">
<link rel="stylesheet" href="https://unpkg.com/reveal.js@6.0.2/dist/theme/white.css" id="theme">
<link rel="stylesheet" href="https://unpkg.com/reveal-rtl@0.2.0/core/rtl.css">
<link rel="stylesheet" href="https://unpkg.com/reveal-rtl@0.2.0/core/ui.css">

<script src="https://unpkg.com/reveal.js@6.0.2/dist/reveal.js"></script>
<script src="https://unpkg.com/reveal.js@6.0.2/dist/plugin/notes.js"></script>
<script src="https://unpkg.com/reveal-rtl@0.2.0/dist/reveal-rtl.js"></script>
<script src="https://unpkg.com/reveal-rtl@0.2.0/dist/reveal-rtl-ui.js"></script>
<script>
  Reveal.initialize({
    slideNumber: true,
    scrollActivationWidth: null,
    plugins: [ RevealNotes, RevealRTL(), RevealRTLUI() ]
  });
</script>
```

`RevealRTLUI` (toolbar, slide list, exports) and `ui.css` are optional.

---

## فارسی

<div dir="rtl">

پلاگینی برای ساخت ارائه‌های راست‌به‌چپ (فارسی) با reveal.js.

### ویژگی‌ها

- فعال‌سازی خودکار حالت `rtl` در reveal.js (جهت، کلیدها، نوار پیشرفت)
- اصلاح تورفتگی فهرست‌ها، جدول‌ها و تراز متن در تم‌های reveal.js
- فونت وزیرمتن داخل پکیج، بدون نیاز به اینترنت یا Google Fonts (قابل تغییر با متغیر `--rtl-font`؛ مجوز OFL در `fonts/OFL.txt`)
- تبدیل اعداد به فارسی در متن اسلایدها و شماره‌ی اسلاید (به‌جز کد)
- فهرست شماره‌دار با اعداد فارسی
- تاریخ شمسی با `<time data-jalali>`
- کد و متن‌های `dir="ltr"` همیشه چپ‌به‌راست می‌مانند
- همه‌ی قالب‌های شماره‌ی اسلاید reveal.js (`h.v`، `h/v`، `c`، `c/t`) با اعداد فارسی، از جمله شماره‌ی صفحه‌های PDF
- راهنمای کلیدها (`?`) فارسی و راست‌به‌چپ
- با هر ۱۴ تم reveal.js تست شده

### استفاده

</div>

```html
<link rel="stylesheet" href="reveal.js/dist/reveal.css">
<link rel="stylesheet" href="reveal.js/dist/theme/white.css">
<link rel="stylesheet" href="reveal-rtl/core/rtl.css">

<script type="module">
  import Reveal from 'reveal.js';
  import RevealRTL from 'reveal-rtl';

  Reveal.initialize({
    slideNumber: true,
    rtlOptions: { digits: true },
    plugins: [ RevealRTL() ]
  });
</script>
```

<div dir="rtl">

بدون ES module (مثلاً باز کردن مستقیم فایل HTML از روی دیسک) از نسخه‌ی `dist` استفاده کنید:

</div>

```html
<script src="reveal.js/dist/reveal.js"></script>
<script src="reveal-rtl/dist/reveal-rtl.js"></script>
<script>
  Reveal.initialize({ plugins: [ RevealRTL() ] });
</script>
```

<div dir="rtl">

### نوار ابزار و فهرست اسلایدها (اختیاری)

پلاگین جداگانه‌ی `RevealRTLUI` این امکانات را اضافه می‌کند:

- فهرست اسلایدها با جستجو در بالای آن (کلید `M` یا دکمه‌ی ☰). جستجو «ي/ك» عربی و اعداد فارسی را هم پیدا می‌کند.
- دکمه‌های اولین و آخرین اسلاید
- نمای شبکه‌ای اسلایدها (همان overview خود reveal.js، کلید `Esc`)
- تایمر ارائه (شروع، توقف، صفر کردن) و ساعت. تایمر با رفرش صفحه متوقف نمی‌شود.
- شمارش معکوس: با کلیک روی عدد تایمر مدت ارائه را به دقیقه وارد کنید (یا `uiOptions.duration`). در دقایق آخر زرد و بعد از پایان وقت قرمز و منفی می‌شود.
- نشانگر لیزری (`Z`)، قلم برای نوشتن روی اسلاید (`D`) و پاک کردن نوشته‌های اسلاید (`E`). نوشته‌ها برای هر اسلاید جدا نگه داشته می‌شوند.
- پیش‌نمایش اسلاید با بردن موس روی فهرست
- رفتن به اسلاید با شماره (`G`) با اعداد فارسی
- بزرگ‌نمایی، کوچک‌نمایی و بازنشانی (۵۰٪ تا ۳۰۰٪)
- انتخاب تم (انتخاب کاربر ذخیره می‌شود)
- منوی خروجی:
  - **PDF**: نمای چاپ reveal.js را در تب جدید باز می‌کند و پنجره‌ی چاپ را نشان می‌دهد؛ «Save as PDF» را انتخاب کنید.
  - **JSON**: عنوان، متن، یادداشت و Markdown هر اسلاید
  - **Markdown**: اسلایدها با جداکننده‌ی `---` و یادداشت‌ها با `Note:` (قابل استفاده با پلاگین markdown خود reveal.js)
  - **HTML**: نسخه‌ی کامل ارائه با آدرس‌های مطلق برای CSS و اسکریپت‌ها (به اینترنت/مسیر اصلی نیاز دارد)
  - **HTML آفلاین**: یک فایل تنها که CSS، اسکریپت‌ها، فونت و تصاویر داخلش است و بدون اینترنت اجرا می‌شود. باید ارائه را از سرور یا نسخه‌ی آنلاین باز کرده باشید؛ مرورگر در حالت `file://` اجازه‌ی خواندن فایل‌ها را نمی‌دهد.
  - **یادداشت‌های سخنران**: فایل متنی، به ترتیب اسلایدها
- نمایش یادداشت‌ها روی صفحه (`<aside class="notes">`)
- دکمه‌ی پنجره‌ی سخنران (اگر پلاگین `RevealNotes` بارگذاری شده باشد)
- دکمه‌ی تمام‌صفحه

نوار ابزار بعد از چند ثانیه بی‌حرکتی موس کم‌رنگ و پنهان می‌شود. با دکمه‌ی ▾ یا کلید `T` کاملاً پنهان می‌شود و فقط یک دکمه‌ی کوچک ▴ برای برگرداندنش می‌ماند؛ این انتخاب ذخیره می‌شود. نوار پیشرفت همان `progress: true` خود reveal.js است.

</div>

```html
<link rel="stylesheet" id="theme" href="reveal.js/dist/theme/white.css">
<link rel="stylesheet" href="reveal-rtl/core/ui.css">
<script src="reveal-rtl/dist/reveal-rtl-ui.js"></script>
<script>
  Reveal.initialize({
    progress: true,
    uiOptions: {
      themes: [
        { name: 'سفید', href: 'reveal.js/dist/theme/white.css' },
        { name: 'مشکی', href: 'reveal.js/dist/theme/black.css' }
      ]
    },
    plugins: [ RevealRTL(), RevealRTLUI() ]
  });
</script>
```

<div dir="rtl">

| گزینه‌ی `uiOptions` | پیش‌فرض | توضیح |
|---|---|---|
| `themes` | `[]` | تم‌های منوی انتخاب تم: `{ name, href }` |
| `themeLink` | `'#theme'` | انتخابگر تگ `<link>` تم |
| `digits` | مثل `rtl` | اعداد فارسی در تایمر و ساعت |
| `idle` | `3000` | میلی‌ثانیه تا پنهان شدن نوار ابزار |
| `duration` | `totalTime` یا خالی | مدت ارائه به دقیقه؛ تایمر معکوس می‌شمارد |
| `warnAt` | ۵ (یا ۲۰٪ مدت کوتاه) | چند دقیقه مانده به پایان، تایمر زرد شود |

عنوان هر اسلاید در فهرست از اولین `h1` تا `h3` خوانده می‌شود، یا از `data-menu-title`.

در صفحه‌های کوچک‌تر از ۶۴۰ پیکسل، ساعت، زوم، انتخاب تم، پنجره‌ی سخنران و تمام‌صفحه از نوار ابزار حذف می‌شوند تا نوار در یک خط جا شود.

### موبایل

reveal.js 6 در عرض کمتر از ۴۳۵ پیکسل خودکار به «نمای اسکرولی» می‌رود: اسلایدها زیر هم می‌آیند و کشیدن انگشت به چپ و راست کار نمی‌کند. برای ارائه‌ی اسلاید به اسلاید روی گوشی، این را خاموش کنید:

</div>

```js
Reveal.initialize({ scrollActivationWidth: null, /* ... */ });
```

<div dir="rtl">

### پنجره‌ی سخنران

پنجره‌ی سخنران reveal.js (کلید `S`) اسلاید فعلی، اسلاید بعدی، یادداشت‌ها و زمان را برای ارائه‌دهنده نشان می‌دهد. با بارگذاری پلاگین `notes` خود reveal.js، پلاگین `RevealRTL` این پنجره را خودکار راست‌به‌چپ می‌کند: چیدمان قرینه، برچسب‌های فارسی و اعداد فارسی.

</div>

```html
<script src="reveal.js/dist/plugin/notes.js"></script>
<script>
  Reveal.initialize({ plugins: [ RevealNotes, RevealRTL(), RevealRTLUI() ] });
</script>
```

<div dir="rtl">

پنجره‌ی سخنران یک pop-up است؛ اگر مرورگر آن را مسدود کرد، اجازه‌ی pop-up را برای صفحه بدهید.

برای اینکه عددی لاتین بماند، کلاس `no-fa-digits` یا `dir="ltr"` بدهید.

دمو: [demo/index.html](demo/index.html) را مستقیم در مرورگر باز کنید. بعد از تغییر کد پلاگین، `npm run build` را اجرا کنید.

</div>

---

## English

Plugin for right-to-left (Persian) presentations in reveal.js 6.

- Turns on reveal.js `rtl` mode (direction, keyboard, progress bar)
- Fixes theme list indentation, table alignment and the forced `sans-serif` font
- Vazirmatn bundled (variable font, works offline; override with `--rtl-font`; OFL license in `fonts/OFL.txt`)
- Persian digits in slide text and slide number (code is left alone)
- Jalali dates via `<time data-jalali>`
- `pre`, `code` and `dir="ltr"` content stays left-to-right
- RTL layout, Persian labels and digits in the notes plugin speaker view (`S`)
- Optional `RevealRTLUI` plugin (`plugin/ui.js` + `core/ui.css`): slide list with search (`M`), first/last buttons, grid view, timer that survives page refresh (count-down with warnings via click or `uiOptions.duration`), laser pointer (`Z`), pen (`D`) and erase (`E`), slide preview on hover, Persian go-to-slide (`G`), clock, zoom in/out/reset, theme switcher, export menu (PDF via print view, JSON, Markdown, standalone HTML, speaker notes), on-slide notes, fullscreen, and a hide/show toggle for the toolbar (`T`)

Options (`rtlOptions` in `Reveal.initialize`):

| Option | Default | Description |
|---|---|---|
| `digits` | `true` | Convert digits to Persian in slides and slide number |

Tests:

```bash
npm test                 # unit tests (node:test)
npx playwright install chromium
npm run test:e2e         # browser tests (Playwright), desktop + mobile
```

Browser tests serve reveal.js from `node_modules` and stub Google Fonts, so they run offline. If the Playwright Chromium download is unavailable, use an installed browser: `PW_CHANNEL=msedge npm run test:e2e` (or `chrome`).

CI (GitHub Actions) runs both suites and fails if `dist/` is out of date with the sources — run `npm run build` before committing.

## License

MIT
