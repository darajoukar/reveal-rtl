# راهنمای معرفی reveal-rtl

این فایل کارهایی را که باید خودتان انجام دهید، قدم‌به‌قدم توضیح می‌دهد. متن‌های انگلیسی آماده‌ی کپی‌اند.

---

## ۱. تصویر پیش‌نمایش (Social preview)

1. در GitHub به صفحه‌ی ریپو بروید: **Settings** (تب بالای ریپو).
2. در بخش **General** پایین بیایید تا **Social preview**.
3. **Edit → Upload an image…** و فایل `docs/social-preview.png` را انتخاب کنید.
4. لینک ریپو را در تلگرام برای خودتان بفرستید و ببینید تصویر نمایش داده می‌شود (ممکن است چند ساعت کش شده باشد).

---

## ۵. Pin کردن ریپو در پروفایل

1. به پروفایل خودتان بروید: https://github.com/darajoukar
2. در بخش **Popular repositories** روی **Customize your pins** بزنید.
3. تیک `reveal-rtl` را بزنید و **Save pins**.

---

## ۱۲. معرفی در Discussions خود reveal.js

در Discussions ریپوی reveal.js دسته‌ای به اسم **Plugins** هست که برای همین کار مناسب‌تر از Show and tell است. متن آماده:

**Title:** reveal-rtl — right-to-left (Persian/Arabic) support for reveal.js 6

**Body:**

```markdown
I built **reveal-rtl**, a pair of plugins for right-to-left presentations on reveal.js 6 (Persian, Arabic; labels also in English).

**RevealRTL** fixes what themes leave left-to-right (lists, tables, fonts), turns on `rtl` before the first render, localizes digits everywhere (slide number formats, PDF pages, ordered lists), adds Jalali/Hijri dates, a bundled Vazirmatn font, and localizes the keyboard help and the speaker view (mirrored layout).

**RevealRTLUI** (optional) adds a toolbar: searchable slide list with previews, count-down timer, laser/pen with drawings saved into the PDF, zoom, theme switcher, and exports (PDF, PNG of a slide, Markdown, JSON, offline single-file HTML).

- Demo: https://darajoukar.github.io/reveal-rtl/demo/
- Gallery: https://darajoukar.github.io/reveal-rtl/gallery/
- Repo: https://github.com/darajoukar/reveal-rtl
- `npm create reveal-rtl my-talk`

Tested on all 14 bundled themes with Playwright, plus a weekly CI run against the latest reveal.js. Feedback very welcome — especially from Hebrew/Urdu users.
```

اگر بخواهید، این پست را من از حساب GitHub شما می‌فرستم؛ فقط بگویید «پست reveal.js را بفرست».

---

## ۱۴. فهرست رسمی پلاگین‌های Anthropic

با این کار، reveal-rtl در فهرست پلاگین‌های claude.ai و Cowork دیده می‌شود و در Claude Code هم برای همان کاربرها بارگذاری می‌شود.

**پیش‌نیاز:** اشتراک پولی claude.ai (Pro یا Max از حساب خودتان). پلاگین از قبل آماده است: README داخل پوشه‌ی پلاگین، مجوز MIT، آیکن ۵۱۲×۵۱۲ و نسخه‌های دقیق در دستورهای `npx`، و `claude plugin validate --strict` بدون خطا رد می‌شود.

**قدم‌ها:**

1. اول مطمئن شوید `create-reveal-rtl` نسخه‌ی 0.3.0 روی npm منتشر شده (Skill به همین نسخه اشاره می‌کند): `npm publish ./create-reveal-rtl`
2. به https://claude.ai/directory/manage بروید و **Submit new** را بزنید.
3. **Plugin bundle** را انتخاب کنید.
4. در مرحله‌ی **Source**:
   - Repository: `https://github.com/darajoukar/reveal-rtl`
   - Branch: `main`
   - Plugin path: `plugins/reveal-rtl` (چون ریپو چند چیز دارد، مسیر پوشه‌ی پلاگین را بدهید)
5. **Validate** را بزنید. اگر یافته‌ای با برچسب **Blocking** بود، متنش را برای من بفرستید تا درستش کنم؛ بعد از push، **Re-validate** بزنید.
6. یافته‌های **Policy hold** مانع ارسال نیستند؛ احتمالاً یکی به‌خاطر اجرای `npx` (حتی با نسخه‌ی دقیق) می‌آید که بازبین بررسی می‌کند.
7. بقیه‌ی فرم را پر کنید و **Submit for review** بزنید.
8. وضعیت را در همان صفحه، تب **Versions**، دنبال کنید. بعد از تأیید، لیست عمومی می‌شود.

**توضیح کوتاه برای فرم (اگر خواست):**

> Creates right-to-left HTML presentations in Persian or Arabic with reveal.js and the reveal-rtl plugins: RTL layout for every theme, Persian/Arabic digits, Jalali/Hijri dates, bundled Vazirmatn font, toolbar with slide list, timer, pen and exports. Includes thesis-defense and lecture outlines and a Persian typography check.

---

## ۱۵. فهرست‌های Skill جامعه

فعالیت فهرست‌ها را بررسی کردم (۲۵ اکتبر ۲۰۲۶):

| فهرست | ستاره | pull requestهای ادغام‌شده | پیشنهاد |
|---|---|---|---|
| [karanb192/awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills) | ۵۶۳ | ۴۱ از ۵۰ مورد آخر | **بهترین گزینه**؛ فعال است و می‌پذیرد |
| [Chat2AnyLLM/awesome-claude-skills](https://github.com/Chat2AnyLLM/awesome-claude-skills) | ۱۵۲ | ۱۶ از ۵۰ | خودکار از ریپوی [awesome-repo-configs](https://github.com/Chat2AnyLLM/awesome-repo-configs) ساخته می‌شود؛ باید به آن فایل اضافه شد |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | ۷۷٬۸۹۷ | ۰ از ۵۰ | پربیننده ولی تقریباً چیزی ادغام نمی‌کند؛ ارزش امتحان دارد ولی امید کمی هست |
| [travisvn](https://github.com/travisvn/awesome-claude-skills) و [BehiSecc](https://github.com/BehiSecc/awesome-claude-skills) | ۱۵ و ۱۰ هزار | ۰ از ۳۰ | فعلاً ادغام نمی‌کنند |

**قدم‌ها برای karanb192** (اگر بخواهید، من انجامش می‌دهم و pull request را از حساب شما می‌فرستم):

1. ریپو را fork کنید و یک branch بسازید: `add-rtl-slides`.
2. در `README.md`، در بخش **Document & File Processing** (کنار `pptx`)، این سطر را به جدول اضافه کنید:
   ```markdown
   | [rtl-slides](https://github.com/darajoukar/reveal-rtl/tree/main/plugins/reveal-rtl/skills/rtl-slides) | Create right-to-left HTML presentations in Persian or Arabic with reveal.js (RTL layout, localized digits, Jalali/Hijri dates, toolbar, PDF/PNG export). |
   ```
3. commit با پیام `Add rtl-slides to Document & File Processing` و pull request با این توضیح:
   > Adds **rtl-slides**, a skill that builds right-to-left (Persian/Arabic) reveal.js presentations with the open-source reveal-rtl plugins. MIT, installable as a Claude Code plugin (`/plugin install reveal-rtl --marketplace darajoukar/reveal-rtl`) or as a zip for claude.ai. Tested end to end; demo: https://darajoukar.github.io/reveal-rtl/

برای Chat2AnyLLM هم همین کار، ولی به‌جای README، ریپوی `reveal-rtl` باید به فایل `skill_repos.json` در ریپوی awesome-repo-configs اضافه شود (قالب ورودی‌های قبلی همان فایل را کپی کنید).

---

## ۱۶. افزونه‌ی Quarto

[Quarto](https://quarto.org) ابزار محبوب ساخت ارائه و مقاله بین پژوهشگرهاست و خروجی ارائه‌اش (`format: revealjs`) بر پایه‌ی reveal.js است. یک افزونه‌ی Quarto به کاربران آن اجازه می‌دهد با یک خط، ارائه‌ی فارسی بسازند.

### چطور کار می‌کند

افزونه‌ی Quarto یک پوشه‌ی `_extensions/reveal-rtl/` با فایل `_extension.yml` است که پلاگین را به reveal.js معرفی می‌کند:

```yaml
title: reveal-rtl
author: Dara Joukar
version: 0.5.0
quarto-required: ">=1.5.0"
contributes:
  revealjs-plugins:
    - name: RevealRTL
      script:
        - reveal-rtl.js
      stylesheet:
        - rtl.css
    - name: RevealRTLUI
      script:
        - reveal-rtl-ui.js
      stylesheet:
        - ui.css
```

فایل‌های `dist/reveal-rtl.js`، `dist/reveal-rtl-ui.js`، `core/rtl.css`، `core/ui.css` و پوشه‌ی `fonts/` کنار آن کپی می‌شوند (مسیر فونت در `rtl.css` باید به `fonts/` همان پوشه اصلاح شود).

کاربر Quarto این‌طور استفاده می‌کند:

```bash
quarto add darajoukar/reveal-rtl
```

```yaml
---
title: "ارائه‌ی من"
lang: fa
dir: rtl
format:
  revealjs:
    slide-number: c/t
revealjs-plugins:
  - reveal-rtl
---
```

### کارهایی که باید انجام شود

1. **سازگاری با نسخه‌ی reveal.js داخل Quarto:** Quarto نسخه‌ی خودش از reveal.js را همراه دارد که ممکن است ۵ یا قدیمی‌تر باشد، نه ۶. باید تست شود که پلاگین‌ها روی آن نسخه کار می‌کنند؛ احتمالاً بیشتر بخش‌ها کار می‌کنند، ولی پنجره‌ی سخنران و خروجی PDF باید بررسی شوند.
2. **تم:** Quarto تم‌های خودش را دارد؛ `rtl.css` روی آن‌ها باید امتحان شود.
3. **انتشار:** افزونه در همین ریپو (یا یک ریپوی جدا به اسم `quarto-reveal-rtl`) قرار می‌گیرد و در [فهرست افزونه‌های Quarto](https://quarto.org/docs/extensions/) معرفی می‌شود.

اگر بخواهید، این افزونه را می‌سازم و با Quarto واقعی تست می‌کنم (Quarto باید روی سیستم نصب شود: https://quarto.org/docs/get-started/).

---

## ۱۷. Obsidian Advanced Slides

افزونه‌ی [Advanced Slides](https://github.com/MSzturc/obsidian-advanced-slides) در Obsidian یادداشت‌های Markdown را با reveal.js به ارائه تبدیل می‌کند و کاربر فارسی‌زبان زیادی دارد.

### ساده‌ترین راه (فقط ظاهر راست‌به‌چپ)

1. در Obsidian، Advanced Slides را از Community plugins نصب کنید.
2. فایل `core/rtl.css` را از ریپو بگیرید و کنار یادداشت‌هایتان، مثلاً در پوشه‌ی `css/`، بگذارید. پوشه‌ی `fonts/` را هم کنارش کپی کنید تا وزیرمتن بارگذاری شود.
3. بالای یادداشت ارائه این frontmatter را بنویسید:

```yaml
---
theme: white
css: css/rtl.css
rtl: true
---
```

4. اسلایدها را با `---` از هم جدا کنید و پیش‌نمایش ارائه را باز کنید.

### محدودیت‌ها

- Advanced Slides تنظیمات reveal.js را از frontmatter می‌خواند، ولی **پلاگین‌های جاوااسکریپت دلخواه** (مثل `RevealRTL` و نوار ابزار) را به‌سادگی بارگذاری نمی‌کند. پس در این روش جهت و فونت درست می‌شود، اما اعداد فارسی، تاریخ شمسی و نوار ابزار نه.
- اینکه کلید `rtl: true` و بارگذاری CSS در نسخه‌ی فعلی Advanced Slides دقیقاً همین‌طور کار می‌کند، باید روی Obsidian امتحان شود.

### راه کامل

خروجی HTML گرفتن از Advanced Slides و افزودن دو خط `<script>` reveal-rtl به آن، یا نوشتن ارائه مستقیم با `npm create reveal-rtl` و اسلایدهای Markdown. اگر بخواهید، یک راهنمای تست‌شده با اسکرین‌شات برای Obsidian هم می‌نویسم (به نصب Obsidian روی سیستم نیاز دارد).
