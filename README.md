# reveal-rtl

[فارسی](#فارسی) | [English](#english)

Right-to-left support plugin for [reveal.js](https://revealjs.com) 6, built for Persian presentations.

---

## فارسی

<div dir="rtl">

پلاگینی برای ساخت ارائه‌های راست‌به‌چپ (فارسی) با reveal.js.

### ویژگی‌ها

- فعال‌سازی خودکار حالت `rtl` در reveal.js (جهت، کلیدها، نوار پیشرفت)
- اصلاح تورفتگی فهرست‌ها، جدول‌ها و تراز متن در تم‌های reveal.js
- فونت وزیرمتن (قابل تغییر با متغیر `--rtl-font`)
- تبدیل اعداد به فارسی در متن اسلایدها و شماره‌ی اسلاید (به‌جز کد)
- فهرست شماره‌دار با اعداد فارسی
- تاریخ شمسی با `<time data-jalali>`
- کد و متن‌های `dir="ltr"` همیشه چپ‌به‌راست می‌مانند

### استفاده

</div>

```html
<link rel="stylesheet" href="reveal.js/dist/reveal.css">
<link rel="stylesheet" href="reveal.js/dist/theme/white.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap">
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
- بزرگ‌نمایی، کوچک‌نمایی و بازنشانی (۵۰٪ تا ۳۰۰٪)
- انتخاب تم (انتخاب کاربر ذخیره می‌شود)
- منوی خروجی:
  - **PDF**: نمای چاپ reveal.js را در تب جدید باز می‌کند و پنجره‌ی چاپ را نشان می‌دهد؛ «Save as PDF» را انتخاب کنید.
  - **JSON**: عنوان، متن، یادداشت و Markdown هر اسلاید
  - **Markdown**: اسلایدها با جداکننده‌ی `---` و یادداشت‌ها با `Note:` (قابل استفاده با پلاگین markdown خود reveal.js)
  - **HTML**: نسخه‌ی کامل ارائه با آدرس‌های مطلق برای CSS و اسکریپت‌ها
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
- Vazirmatn font by default (override with `--rtl-font`)
- Persian digits in slide text and slide number (code is left alone)
- Jalali dates via `<time data-jalali>`
- `pre`, `code` and `dir="ltr"` content stays left-to-right
- RTL layout, Persian labels and digits in the notes plugin speaker view (`S`)
- Optional `RevealRTLUI` plugin (`plugin/ui.js` + `core/ui.css`): slide list with search (`M`), first/last buttons, grid view, timer that survives page refresh, clock, zoom in/out/reset, theme switcher, export menu (PDF via print view, JSON, Markdown, standalone HTML, speaker notes), on-slide notes, fullscreen, and a hide/show toggle for the toolbar (`T`)

Options (`rtlOptions` in `Reveal.initialize`):

| Option | Default | Description |
|---|---|---|
| `digits` | `true` | Convert digits to Persian in slides and slide number |

Tests: `npm test`

## License

MIT
