// Ready-made slide outlines for `--template thesis` and `--template class`.
// {{title}} is filled with the presentation title. Slides are Markdown ("---" new slide,
// "--" vertical slide, "Note:" speaker notes).

export const TEMPLATES = {
	thesis: {
		fa: {
			title: 'عنوان پایان‌نامه',
			slides: `# {{title}}

**ارائه‌دهنده:** نام دانشجو

**استاد راهنما:** دکتر … · **استاد مشاور:** دکتر …

دانشگاه … · دانشکده‌ی …

<time data-jalali></time>

Note: خوش‌آمدگویی به هیئت داوران و معرفی کوتاه موضوع در یک جمله.

---

## فهرست مطالب

1. بیان مسئله
2. اهداف و پرسش‌ها
3. پیشینه‌ی پژوهش
4. روش پژوهش
5. یافته‌ها
6. نتیجه‌گیری و پیشنهادها

---

## بیان مسئله

- مسئله‌ی اصلی پژوهش در یک جمله
- اهمیت و ضرورت انجام پژوهش
- شکاف موجود در پژوهش‌های پیشین

Note: توضیح دهید چرا این مسئله ارزش پژوهش دارد و چه کسی از نتیجه‌ی آن سود می‌برد.

---

## اهداف و پرسش‌های پژوهش

**هدف اصلی:** …

- پرسش اول: …
- پرسش دوم: …
- فرضیه: …

---

## پیشینه‌ی پژوهش

| پژوهش | سال | یافته‌ی اصلی |
|---|---|---|
| نویسنده‌ی الف | 1398 | … |
| نویسنده‌ی ب | 1401 | … |
| نویسنده‌ی ج | 1403 | … |

Note: فقط پژوهش‌هایی را بیاورید که مستقیم به پرسش شما مربوط‌اند.

---

## روش پژوهش

- نوع پژوهش: …
- جامعه و نمونه‌ی آماری: …
- ابزار گردآوری داده‌ها: پرسش‌نامه، مصاحبه، …
- روش تحلیل داده‌ها: …

--

## مراحل اجرا

1. …
2. …
3. …

---

## یافته‌ها

| شاخص | گروه آزمایش | گروه کنترل |
|---|---|---|
| میانگین | 0 | 0 |
| انحراف معیار | 0 | 0 |

Note: جدول یا نمودار اصلی را توضیح دهید و بگویید کدام فرضیه تأیید یا رد شد.

---

## نتیجه‌گیری

- پاسخ به پرسش‌های پژوهش
- نوآوری و دستاورد اصلی
- محدودیت‌های پژوهش

---

## پیشنهادها

- پیشنهادهای کاربردی
- پیشنهاد برای پژوهش‌های آینده

---

<!-- .slide: data-visibility="uncounted" -->
## منابع

- نام‌خانوادگی، نام (سال). عنوان. محل نشر: ناشر.
- …

---

<!-- .slide: data-visibility="uncounted" -->
# با سپاس از توجه شما

پرسش و پاسخ`
		},
		ar: {
			title: 'عنوان الرسالة',
			slides: `# {{title}}

**الباحث:** الاسم · **المشرف:** د. …

الجامعة … · الكلية …

<time data-hijri></time>

Note: الترحيب بلجنة المناقشة وتقديم الموضوع في جملة واحدة.

---

## المحتويات

1. مشكلة البحث
2. الأهداف والأسئلة
3. الدراسات السابقة
4. منهجية البحث
5. النتائج
6. الخلاصة والتوصيات

---

## مشكلة البحث

- المشكلة الرئيسة في جملة واحدة
- أهمية البحث
- الفجوة في الدراسات السابقة

---

## منهجية البحث

- نوع البحث: …
- مجتمع البحث والعينة: …
- أدوات جمع البيانات: …

---

## النتائج

| المؤشر | المجموعة التجريبية | المجموعة الضابطة |
|---|---|---|
| المتوسط | 0 | 0 |

---

## الخلاصة والتوصيات

- الإجابة عن أسئلة البحث
- الإسهام الرئيس
- توصيات لأبحاث مستقبلية

---

<!-- .slide: data-visibility="uncounted" -->
# شكرًا لحسن استماعكم

الأسئلة والمناقشة`
		},
		en: {
			title: 'Thesis title',
			slides: `# {{title}}

**Presenter:** Name · **Supervisor:** Dr. …

University … · Faculty of …

Note: Welcome the committee and state the topic in one sentence.

---

## Outline

1. Problem statement
2. Aims and questions
3. Related work
4. Method
5. Results
6. Conclusion

---

## Problem statement

- The core problem in one sentence
- Why it matters
- The gap in earlier work

---

## Method

- Research type: …
- Population and sample: …
- Data collection: …

---

## Results

| Measure | Experiment | Control |
|---|---|---|
| Mean | 0 | 0 |

---

## Conclusion

- Answers to the research questions
- Main contribution
- Future work

---

<!-- .slide: data-visibility="uncounted" -->
# Thank you

Questions`
		}
	},

	class: {
		fa: {
			title: 'عنوان درس',
			slides: `# {{title}}

جلسه‌ی … · نام درس

<time data-jalali></time>

Note: حضور و غیاب و یادآوری کوتاه جلسه‌ی قبل.

---

## اهداف این جلسه

در پایان این جلسه می‌توانید:

- مفهوم اول را توضیح دهید
- مفهوم دوم را در یک مثال به کار ببرید
- تفاوت این دو را بیان کنید

---

## مفهوم اصلی

- تعریف در یک جمله
- چرا مهم است؟
- کجا به کار می‌رود؟

Note: یک مثال از زندگی روزمره بزنید.

---

## مثال

| ورودی | خروجی |
|---|---|
| … | … |
| … | … |

---

## تمرین کلاسی

1. پرسش اول <!-- .element: class="fragment" -->
2. پرسش دوم <!-- .element: class="fragment" -->
3. پرسش سوم <!-- .element: class="fragment" -->

Note: به هر گروه پنج دقیقه وقت بدهید؛ پرسش‌ها با هر بار زدن کلید یکی‌یکی ظاهر می‌شوند.

---

## جمع‌بندی

- نکته‌ی اول
- نکته‌ی دوم
- نکته‌ی سوم

---

## تکلیف جلسه‌ی بعد

- مطالعه‌ی فصل …
- حل تمرین‌های …

پرسش؟`
		},
		ar: {
			title: 'عنوان الدرس',
			slides: `# {{title}}

المحاضرة … · اسم المقرر

<time data-hijri></time>

---

## أهداف المحاضرة

- شرح المفهوم الأول
- تطبيق المفهوم الثاني في مثال
- المقارنة بينهما

---

## المفهوم الرئيس

- التعريف في جملة واحدة
- لماذا هو مهم؟
- أين يُستخدم؟

---

## تمرين صفي

1. السؤال الأول <!-- .element: class="fragment" -->
2. السؤال الثاني <!-- .element: class="fragment" -->

---

## الخلاصة والواجب

- أهم النقاط
- الواجب للمحاضرة القادمة

أسئلة؟`
		},
		en: {
			title: 'Lesson title',
			slides: `# {{title}}

Session … · Course name

---

## Today's goals

- Explain the first concept
- Apply the second in an example
- Compare the two

---

## Key concept

- Definition in one sentence
- Why it matters
- Where it is used

---

## In-class exercise

1. First question <!-- .element: class="fragment" -->
2. Second question <!-- .element: class="fragment" -->

---

## Summary and homework

- Key points
- Homework for next session

Questions?`
		}
	}
};
