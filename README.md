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

Options (`rtlOptions` in `Reveal.initialize`):

| Option | Default | Description |
|---|---|---|
| `digits` | `true` | Convert digits to Persian in slides and slide number |

Tests: `npm test`

## License

MIT
