var RevealRTL = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugin/rtl.js
  var rtl_exports = {};
  __export(rtl_exports, {
    default: () => rtl_default
  });

  // core/rtl.js
  var DIGITS = { persian: "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9", arabic: "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669" };
  var SKIP_SELECTOR = 'pre, code, kbd, samp, script, style, math, svg, [dir="ltr"], .no-fa-digits, .latin-digits';
  function localizeDigits(value, style = "persian") {
    const set = DIGITS[style];
    return set ? String(value).replace(/[0-9]/g, (d) => set[d]) : String(value);
  }
  function localizeDigitsIn(root, style = "persian") {
    if (!DIGITS[style]) return;
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => node.parentElement?.closest(SKIP_SELECTOR) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (/[0-9]/.test(node.nodeValue)) node.nodeValue = localizeDigits(node.nodeValue, style);
    }
  }
  function toLatinDigits(text) {
    return String(text).replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632);
  }
  function formatSlideNumber(format, s) {
    if (typeof format !== "string") format = "h.v";
    if (!/c/.test(format) && s.horizontalCount === 1) format = "c";
    const offset = s.uncounted ? 0 : 1;
    switch (format) {
      case "c":
        return String(s.pastCount + offset);
      case "c/t":
        return `${s.pastCount + offset} / ${s.total}`;
      default: {
        const sep = format === "h/v" ? "/" : ".";
        return s.vertical ? `${s.h + offset}${sep}${s.v + 1}` : String(s.h + offset);
      }
    }
  }
  var NUMBERING = { persian: "arabext", arabic: "arab", latin: "latn" };
  function formatJalali(date = /* @__PURE__ */ new Date(), options = { dateStyle: "long" }, digits = "persian") {
    return new Intl.DateTimeFormat(`fa-IR-u-ca-persian-nu-${NUMBERING[digits] || "arabext"}`, options).format(date);
  }
  var HIJRI_LOCALES = { fa: "fa-IR", ar: "ar-SA", en: "en-US" };
  function formatHijri(date = /* @__PURE__ */ new Date(), lang = "ar", digits = "arabic", options = { dateStyle: "long" }) {
    const locale = HIJRI_LOCALES[lang] || HIJRI_LOCALES.ar;
    return new Intl.DateTimeFormat(`${locale}-u-ca-islamic-umalqura-nu-${NUMBERING[digits] || "arab"}`, options).format(date);
  }
  function fillJalaliDates(root, digits = "persian", lang = "fa") {
    root.querySelectorAll("time[data-jalali], time[data-hijri]").forEach((el) => {
      const date = el.dateTime ? new Date(el.dateTime) : /* @__PURE__ */ new Date();
      if (isNaN(date)) return;
      el.textContent = el.hasAttribute("data-hijri") ? formatHijri(date, lang, digits) : formatJalali(date, void 0, digits);
    });
  }

  // core/i18n.js
  var fa = {
    slideN: "\u0627\u0633\u0644\u0627\u06CC\u062F {n}",
    slideList: "\u0641\u0647\u0631\u0633\u062A \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627",
    search: "\u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627\u2026",
    searchLabel: "\u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627",
    noResults: "\u0646\u062A\u06CC\u062C\u0647\u200C\u0627\u06CC \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F",
    toolbar: "\u0627\u0628\u0632\u0627\u0631\u0647\u0627\u06CC \u0627\u0631\u0627\u0626\u0647",
    first: "\u0627\u0648\u0644\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F",
    last: "\u0622\u062E\u0631\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F",
    grid: "\u0646\u0645\u0627\u06CC \u0634\u0628\u06A9\u0647\u200C\u0627\u06CC",
    play: "\u0634\u0631\u0648\u0639 \u062A\u0627\u06CC\u0645\u0631",
    pause: "\u062A\u0648\u0642\u0641 \u062A\u0627\u06CC\u0645\u0631",
    resetTimer: "\u0635\u0641\u0631 \u06A9\u0631\u062F\u0646 \u062A\u0627\u06CC\u0645\u0631",
    timerElapsed: "\u0632\u0645\u0627\u0646 \u0633\u067E\u0631\u06CC\u200C\u0634\u062F\u0647\u061B \u0628\u0631\u0627\u06CC \u062A\u0639\u06CC\u06CC\u0646 \u0645\u062F\u062A \u0627\u0631\u0627\u0626\u0647 (\u0634\u0645\u0627\u0631\u0634 \u0645\u0639\u06A9\u0648\u0633) \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F",
    timerRemaining: "\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647 \u0627\u0632 {m} \u062F\u0642\u06CC\u0642\u0647\u061B \u0628\u0631\u0627\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0645\u062F\u062A \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F",
    timerPrompt: "\u0645\u062F\u062A \u0627\u0631\u0627\u0626\u0647 \u0628\u0647 \u062F\u0642\u06CC\u0642\u0647 (\u062E\u0627\u0644\u06CC = \u0634\u0645\u0627\u0631\u0634 \u0631\u0648 \u0628\u0647 \u062C\u0644\u0648):",
    zoomIn: "\u0628\u0632\u0631\u06AF\u200C\u0646\u0645\u0627\u06CC\u06CC",
    zoomOut: "\u06A9\u0648\u0686\u06A9\u200C\u0646\u0645\u0627\u06CC\u06CC",
    zoomReset: "\u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC \u0628\u0632\u0631\u06AF\u200C\u0646\u0645\u0627\u06CC\u06CC",
    theme: "\u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0645",
    export: "\u062E\u0631\u0648\u062C\u06CC \u06AF\u0631\u0641\u062A\u0646",
    exportPDF: "PDF (\u0686\u0627\u067E)",
    exportJSON: "JSON",
    exportMarkdown: "\u0645\u062A\u0646 Markdown",
    exportHTML: "HTML",
    exportOffline: "HTML \u0622\u0641\u0644\u0627\u06CC\u0646 (\u06CC\u06A9 \u0641\u0627\u06CC\u0644)",
    exportNotes: "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0633\u062E\u0646\u0631\u0627\u0646",
    exportImage: "\u062A\u0635\u0648\u06CC\u0631 \u0627\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F (PNG)",
    imageUnsupported: "\u0627\u06CC\u0646 \u0645\u0631\u0648\u0631\u06AF\u0631 \u06AF\u0631\u0641\u062A\u0646 \u062A\u0635\u0648\u06CC\u0631 \u0627\u0632 \u0635\u0641\u062D\u0647 \u0631\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u06A9\u0646\u062F.",
    imageHint: "\u062F\u0631 \u067E\u0646\u062C\u0631\u0647\u200C\u0627\u06CC \u06A9\u0647 \u0628\u0627\u0632 \u0645\u06CC\u200C\u0634\u0648\u062F\u060C \u0647\u0645\u06CC\u0646 \u062A\u0628 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.",
    notesFileTitle: "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0633\u062E\u0646\u0631\u0627\u0646",
    offlineFailed: "{n} \u0641\u0627\u06CC\u0644 \u062F\u0627\u062E\u0644 \u062E\u0631\u0648\u062C\u06CC \u0642\u0631\u0627\u0631 \u0646\u06AF\u0631\u0641\u062A \u0648 \u0647\u0646\u0648\u0632 \u0628\u0647 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A \u06CC\u0627 \u0645\u0633\u06CC\u0631 \u0627\u0635\u0644\u06CC \u0646\u06CC\u0627\u0632 \u062F\u0627\u0631\u062F:",
    offlineFileHint: "\u0628\u0631\u0627\u06CC \u062E\u0631\u0648\u062C\u06CC \u0622\u0641\u0644\u0627\u06CC\u0646 \u06A9\u0627\u0645\u0644\u060C \u0627\u0631\u0627\u0626\u0647 \u0631\u0627 \u0627\u0632 \u06CC\u06A9 \u0633\u0631\u0648\u0631 (\u0645\u062B\u0644\u0627\u064B npm run demo) \u06CC\u0627 \u0646\u0633\u062E\u0647\u200C\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F.",
    showNotes: "\u0646\u0645\u0627\u06CC\u0634 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627",
    speakerView: "\u067E\u0646\u062C\u0631\u0647\u200C\u06CC \u0633\u062E\u0646\u0631\u0627\u0646",
    fullscreen: "\u062A\u0645\u0627\u0645\u200C\u0635\u0641\u062D\u0647",
    laser: "\u0646\u0634\u0627\u0646\u06AF\u0631 \u0644\u06CC\u0632\u0631\u06CC",
    pen: "\u0642\u0644\u0645",
    erase: "\u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u0646\u0648\u0634\u062A\u0647\u200C\u0647\u0627\u06CC \u0627\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F",
    hideToolbar: "\u067E\u0646\u0647\u0627\u0646 \u06A9\u0631\u062F\u0646 \u0646\u0648\u0627\u0631 \u0627\u0628\u0632\u0627\u0631",
    showToolbar: "\u0646\u0645\u0627\u06CC\u0634 \u0646\u0648\u0627\u0631 \u0627\u0628\u0632\u0627\u0631",
    toggleToolbar: "\u067E\u0646\u0647\u0627\u0646/\u0646\u0645\u0627\u06CC\u0634 \u0646\u0648\u0627\u0631 \u0627\u0628\u0632\u0627\u0631",
    notes: "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627",
    jump: "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0627\u0633\u0644\u0627\u06CC\u062F (\u0634\u0645\u0627\u0631\u0647 \u06CC\u0627 \u0645\u062A\u0646)",
    upcoming: "\u0627\u0633\u0644\u0627\u06CC\u062F \u0628\u0639\u062F\u06CC",
    time: "\u0632\u0645\u0627\u0646",
    clickToReset: "\u0628\u0631\u0627\u06CC \u0635\u0641\u0631 \u06A9\u0631\u062F\u0646 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F",
    pacing: "\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647\u200C\u06CC \u0627\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F",
    layout: "\u0686\u06CC\u062F\u0645\u0627\u0646",
    layoutDefault: "\u067E\u06CC\u0634\u200C\u0641\u0631\u0636",
    layoutWide: "\u0639\u0631\u06CC\u0636",
    layoutTall: "\u0628\u0644\u0646\u062F",
    layoutNotesOnly: "\u0641\u0642\u0637 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A",
    am: "\u0642.\u0638",
    pm: "\u0628.\u0638",
    // Keyboard help overlay (reveal.js English strings → translation)
    "Keyboard Shortcuts": "\u0645\u06CC\u0627\u0646\u200C\u0628\u0631\u0647\u0627\u06CC \u0635\u0641\u062D\u0647\u200C\u06A9\u0644\u06CC\u062F",
    "KEY": "\u06A9\u0644\u06CC\u062F",
    "ACTION": "\u06A9\u0627\u0631",
    "Next slide": "\u0627\u0633\u0644\u0627\u06CC\u062F \u0628\u0639\u062F\u06CC",
    "Previous slide": "\u0627\u0633\u0644\u0627\u06CC\u062F \u0642\u0628\u0644\u06CC",
    "Navigate left": "\u0686\u067E: \u0627\u0633\u0644\u0627\u06CC\u062F \u0628\u0639\u062F\u06CC",
    "Navigate right": "\u0631\u0627\u0633\u062A: \u0627\u0633\u0644\u0627\u06CC\u062F \u0642\u0628\u0644\u06CC",
    "Navigate up": "\u0628\u0627\u0644\u0627",
    "Navigate down": "\u067E\u0627\u06CC\u06CC\u0646",
    "Navigate without fragments": "\u062C\u0627\u0628\u0647\u200C\u062C\u0627\u06CC\u06CC \u0628\u062F\u0648\u0646 \u0645\u0631\u0627\u062D\u0644 (fragment)",
    "Jump to first/last slide": "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0627\u0648\u0644\u06CC\u0646/\u0622\u062E\u0631\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F",
    "Pause": "\u0645\u06A9\u062B (\u0635\u0641\u062D\u0647\u200C\u06CC \u0633\u06CC\u0627\u0647)",
    "Fullscreen": "\u062A\u0645\u0627\u0645\u200C\u0635\u0641\u062D\u0647",
    "Jump to slide": "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0627\u0633\u0644\u0627\u06CC\u062F \u0628\u0627 \u0634\u0645\u0627\u0631\u0647",
    "Slide overview": "\u0646\u0645\u0627\u06CC \u06A9\u0644\u06CC \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627",
    "Speaker notes view": "\u067E\u0646\u062C\u0631\u0647\u200C\u06CC \u0633\u062E\u0646\u0631\u0627\u0646"
  };
  var ar = {
    slideN: "\u0627\u0644\u0634\u0631\u064A\u062D\u0629 {n}",
    slideList: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0634\u0631\u0627\u0626\u062D",
    search: "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0634\u0631\u0627\u0626\u062D\u2026",
    searchLabel: "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0634\u0631\u0627\u0626\u062D",
    noResults: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C",
    toolbar: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0639\u0631\u0636",
    first: "\u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0623\u0648\u0644\u0649",
    last: "\u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0623\u062E\u064A\u0631\u0629",
    grid: "\u0639\u0631\u0636 \u0634\u0628\u0643\u064A",
    play: "\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u0624\u0642\u062A",
    pause: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0624\u0642\u062A",
    resetTimer: "\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0645\u0624\u0642\u062A",
    timerElapsed: "\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u0646\u0642\u0636\u064A\u061B \u0627\u0646\u0642\u0631 \u0644\u062A\u062D\u062F\u064A\u062F \u0645\u062F\u0629 \u0627\u0644\u0639\u0631\u0636 (\u0639\u062F\u0651 \u062A\u0646\u0627\u0632\u0644\u064A)",
    timerRemaining: "\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0645\u0646 {m} \u062F\u0642\u064A\u0642\u0629\u061B \u0627\u0646\u0642\u0631 \u0644\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u062F\u0629",
    timerPrompt: "\u0645\u062F\u0629 \u0627\u0644\u0639\u0631\u0636 \u0628\u0627\u0644\u062F\u0642\u0627\u0626\u0642 (\u0641\u0627\u0631\u063A = \u0639\u062F\u0651 \u062A\u0635\u0627\u0639\u062F\u064A):",
    zoomIn: "\u062A\u0643\u0628\u064A\u0631",
    zoomOut: "\u062A\u0635\u063A\u064A\u0631",
    zoomReset: "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0643\u0628\u064A\u0631",
    theme: "\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0633\u0645\u0629",
    export: "\u062A\u0635\u062F\u064A\u0631",
    exportPDF: "PDF (\u0637\u0628\u0627\u0639\u0629)",
    exportJSON: "JSON",
    exportMarkdown: "\u0646\u0635 Markdown",
    exportHTML: "HTML",
    exportOffline: "HTML \u062F\u0648\u0646 \u0627\u062A\u0635\u0627\u0644 (\u0645\u0644\u0641 \u0648\u0627\u062D\u062F)",
    exportNotes: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0645\u062A\u062D\u062F\u062B",
    exportImage: "\u0635\u0648\u0631\u0629 \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 (PNG)",
    imageUnsupported: "\u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0644\u0627 \u064A\u062F\u0639\u0645 \u0627\u0644\u062A\u0642\u0627\u0637 \u0635\u0648\u0631\u0629 \u0644\u0644\u0634\u0627\u0634\u0629.",
    imageHint: "\u0641\u064A \u0627\u0644\u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u062A\u064A \u0633\u062A\u0638\u0647\u0631\u060C \u0627\u062E\u062A\u0631 \u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u0628\u0648\u064A\u0628 \u0647\u0630\u0647.",
    notesFileTitle: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0645\u062A\u062D\u062F\u062B",
    offlineFailed: "\u0644\u0645 \u064A\u064F\u0636\u0645\u064E\u0651\u0646 {n} \u0645\u0644\u0641 \u0641\u064A \u0627\u0644\u062A\u0635\u062F\u064A\u0631 \u0648\u0645\u0627 \u0632\u0627\u0644 \u064A\u062D\u062A\u0627\u062C \u0625\u0644\u0649 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0623\u0648 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0623\u0635\u0644\u064A:",
    offlineFileHint: "\u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u062A\u0635\u062F\u064A\u0631 \u0643\u0627\u0645\u0644 \u062F\u0648\u0646 \u0627\u062A\u0635\u0627\u0644\u060C \u0627\u0641\u062A\u062D \u0627\u0644\u0639\u0631\u0636 \u0645\u0646 \u062E\u0627\u062F\u0645 (\u0645\u062B\u0644 npm run demo) \u0623\u0648 \u0645\u0646 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629.",
    showNotes: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",
    speakerView: "\u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u062B",
    fullscreen: "\u0645\u0644\u0621 \u0627\u0644\u0634\u0627\u0634\u0629",
    laser: "\u0645\u0624\u0634\u0631 \u0644\u064A\u0632\u0631",
    pen: "\u0642\u0644\u0645",
    erase: "\u0645\u0633\u062D \u0643\u062A\u0627\u0628\u0629 \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u064A\u062D\u0629",
    hideToolbar: "\u0625\u062E\u0641\u0627\u0621 \u0634\u0631\u064A\u0637 \u0627\u0644\u0623\u062F\u0648\u0627\u062A",
    showToolbar: "\u0625\u0638\u0647\u0627\u0631 \u0634\u0631\u064A\u0637 \u0627\u0644\u0623\u062F\u0648\u0627\u062A",
    toggleToolbar: "\u0625\u062E\u0641\u0627\u0621/\u0625\u0638\u0647\u0627\u0631 \u0634\u0631\u064A\u0637 \u0627\u0644\u0623\u062F\u0648\u0627\u062A",
    notes: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A",
    jump: "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0634\u0631\u064A\u062D\u0629 (\u0631\u0642\u0645 \u0623\u0648 \u0646\u0635)",
    upcoming: "\u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629",
    time: "\u0627\u0644\u0648\u0642\u062A",
    clickToReset: "\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u0635\u0641\u064A\u0631",
    pacing: "\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0644\u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u064A\u062D\u0629",
    layout: "\u0627\u0644\u062A\u062E\u0637\u064A\u0637",
    layoutDefault: "\u0627\u0641\u062A\u0631\u0627\u0636\u064A",
    layoutWide: "\u0639\u0631\u064A\u0636",
    layoutTall: "\u0637\u0648\u064A\u0644",
    layoutNotesOnly: "\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0641\u0642\u0637",
    am: "\u0635",
    pm: "\u0645",
    "Keyboard Shortcuts": "\u0627\u062E\u062A\u0635\u0627\u0631\u0627\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0641\u0627\u062A\u064A\u062D",
    "KEY": "\u0627\u0644\u0645\u0641\u062A\u0627\u062D",
    "ACTION": "\u0627\u0644\u0625\u062C\u0631\u0627\u0621",
    "Next slide": "\u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629",
    "Previous slide": "\u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
    "Navigate left": "\u064A\u0633\u0627\u0631: \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629",
    "Navigate right": "\u064A\u0645\u064A\u0646: \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
    "Navigate up": "\u0623\u0639\u0644\u0649",
    "Navigate down": "\u0623\u0633\u0641\u0644",
    "Navigate without fragments": "\u0627\u0644\u062A\u0646\u0642\u0644 \u062F\u0648\u0646 \u0627\u0644\u0645\u0631\u0627\u062D\u0644 (fragment)",
    "Jump to first/last slide": "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u0627\u0644\u0623\u0648\u0644\u0649/\u0627\u0644\u0623\u062E\u064A\u0631\u0629",
    "Pause": "\u0625\u064A\u0642\u0627\u0641 \u0645\u0624\u0642\u062A (\u0634\u0627\u0634\u0629 \u0633\u0648\u062F\u0627\u0621)",
    "Fullscreen": "\u0645\u0644\u0621 \u0627\u0644\u0634\u0627\u0634\u0629",
    "Jump to slide": "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0634\u0631\u064A\u062D\u0629 \u0628\u0631\u0642\u0645\u0647\u0627",
    "Slide overview": "\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0627\u0626\u062D",
    "Speaker notes view": "\u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u062B"
  };
  var en = {
    slideN: "Slide {n}",
    slideList: "Slide list",
    search: "Search slides\u2026",
    searchLabel: "Search slides",
    noResults: "No results",
    toolbar: "Presentation tools",
    first: "First slide",
    last: "Last slide",
    grid: "Grid view",
    play: "Start timer",
    pause: "Pause timer",
    resetTimer: "Reset timer",
    timerElapsed: "Elapsed time; click to set a presentation length (count-down)",
    timerRemaining: "Time left of {m} minutes; click to change",
    timerPrompt: "Presentation length in minutes (empty = count up):",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomReset: "Reset zoom",
    theme: "Theme",
    export: "Export",
    exportPDF: "PDF (print)",
    exportJSON: "JSON",
    exportMarkdown: "Markdown text",
    exportHTML: "HTML",
    exportOffline: "Offline HTML (single file)",
    exportNotes: "Speaker notes",
    exportImage: "Image of this slide (PNG)",
    imageUnsupported: "This browser cannot capture the screen.",
    imageHint: "In the dialog that opens, choose this tab.",
    notesFileTitle: "Speaker notes",
    offlineFailed: "{n} file(s) could not be embedded and still need the internet or the original location:",
    offlineFileHint: "For a complete offline export, open the deck from a server (e.g. npm run demo) or the published site.",
    showNotes: "Show notes",
    speakerView: "Speaker view",
    fullscreen: "Fullscreen",
    laser: "Laser pointer",
    pen: "Pen",
    erase: "Erase drawing on this slide",
    hideToolbar: "Hide toolbar",
    showToolbar: "Show toolbar",
    toggleToolbar: "Hide/show toolbar",
    notes: "Notes",
    jump: "Jump to slide (number or text)",
    upcoming: "Upcoming",
    time: "Time",
    clickToReset: "Click to reset",
    pacing: "Time left for this slide",
    layout: "Layout",
    layoutDefault: "Default",
    layoutWide: "Wide",
    layoutTall: "Tall",
    layoutNotesOnly: "Notes only",
    am: "AM",
    pm: "PM",
    // reveal.js help is already English; only the RTL-specific arrow meaning changes.
    "Navigate left": "Left: next slide",
    "Navigate right": "Right: previous slide"
  };
  var LOCALES = { fa, ar, en };
  var DEFAULT_DIGITS = { fa: "persian", ar: "arabic", en: "latin" };
  function resolveLocale({ lang, digits, labels } = {}) {
    const code = LOCALES[lang] ? lang : "fa";
    const style = digits === false ? "latin" : ["persian", "arabic", "latin"].includes(digits) ? digits : DEFAULT_DIGITS[code];
    const table = { ...LOCALES[code], ...labels };
    const t = (key, vars = {}) => (table[key] ?? key).replace(/\{(\w+)\}/g, (m, name) => vars[name] ?? m);
    return { lang: code, digits: style, t };
  }

  // core/speaker.js
  var STYLE_ID = "reveal-rtl-speaker";
  var SPEAKER_CSS = `
body, #speaker-controls, .speaker-controls-notes .value {
	direction: rtl;
	font-family: var(--rtl-font, 'Vazirmatn', 'Sahel', Tahoma, sans-serif);
}
.speaker-controls-time .label, .speaker-controls-notes .label { text-transform: none; }

/* Mirror the layouts: current slide on the right. */
body[data-speaker-layout] #current-slide { left: auto; right: 0; padding-right: 6px; padding-left: 0; }
body[data-speaker-layout] #upcoming-slide { right: auto; left: 0; }
body[data-speaker-layout] #speaker-controls { right: auto; left: 0; }
body[data-speaker-layout="wide"] #current-slide { padding: 6px; }
body[data-speaker-layout="wide"] #upcoming-slide { left: auto; right: 50%; }
body[data-speaker-layout="tall"] #current-slide { padding: 6px; }
body[data-speaker-layout="tall"] #upcoming-slide { left: auto; right: 0; }
body[data-speaker-layout="tall"] #speaker-controls { left: auto; right: 45%; }
#current-slide .label, #upcoming-slide .label { left: auto; right: 10px; }
#speaker-layout { right: auto; left: 10px; }

.speaker-controls-time .reset-button { float: left; }
.speaker-controls-time .timer { float: right; }
.speaker-controls-time .clock { float: left; text-align: left; }
.speaker-controls-time .timer, .pacing { direction: ltr; unicode-bidi: isolate; }
.speaker-controls-time .timer { text-align: right; }
`;
  var LABELS = [
    ["#upcoming-slide .label", "upcoming"],
    [".speaker-controls-time .reset-button", "clickToReset"],
    [".pacing-title", "pacing"],
    [".speaker-controls-notes .label", "notes"]
  ];
  var LAYOUT_KEYS = { "default": "layoutDefault", "wide": "layoutWide", "tall": "layoutTall", "notes-only": "layoutNotesOnly" };
  var LIVE_TEXT_SELECTOR = ".clock-value, .timer, .pacing";
  function applySpeakerRTL(doc, locale = resolveLocale()) {
    const { t, lang, digits } = locale;
    if (!doc?.head || doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = SPEAKER_CSS;
    doc.head.append(style);
    doc.documentElement.lang = lang;
    document.querySelectorAll('link[rel="stylesheet"][href*="rtl.css"], link[rel="stylesheet"][href*="Vazirmatn"]').forEach((link) => {
      const copy = doc.createElement("link");
      copy.rel = "stylesheet";
      copy.href = link.href;
      doc.head.append(copy);
    });
    LABELS.forEach(([selector, key]) => {
      const el = doc.querySelector(selector);
      if (el) el.textContent = t(key);
    });
    const timeLabel = doc.querySelector(".speaker-controls-time > .label");
    if (timeLabel?.firstChild?.nodeType === Node.TEXT_NODE) timeLabel.firstChild.nodeValue = `${t("time")} `;
    const layoutSelect = doc.querySelector(".speaker-layout-dropdown");
    const layoutLabel = doc.querySelector(".speaker-layout-label");
    if (layoutSelect && layoutLabel) {
      layoutSelect.querySelectorAll("option").forEach((option) => {
        if (LAYOUT_KEYS[option.value]) option.textContent = t(LAYOUT_KEYS[option.value]);
      });
      const syncLayoutLabel = () => {
        const text = `${t("layout")}: ${layoutSelect.selectedOptions[0]?.textContent || ""}`;
        if (layoutLabel.textContent !== text) layoutLabel.textContent = text;
      };
      syncLayoutLabel();
      new doc.defaultView.MutationObserver(syncLayoutLabel).observe(layoutLabel, { childList: true, characterData: true, subtree: true });
    }
    if (digits !== "latin" || lang !== "en") {
      const localize = (el) => {
        const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = localizeDigits(node.nodeValue, digits).replace("AM", t("am")).replace("PM", t("pm"));
          if (node.nodeValue !== text) node.nodeValue = text;
        }
      };
      doc.querySelectorAll(LIVE_TEXT_SELECTOR).forEach((el) => {
        localize(el);
        new doc.defaultView.MutationObserver(() => localize(el)).observe(el, { childList: true, characterData: true, subtree: true });
      });
    }
  }
  function watchSpeakerView(options) {
    window.addEventListener("message", (event) => {
      if (typeof event.data !== "string" || !event.data.includes("reveal-notes")) return;
      let doc;
      try {
        doc = event.source.document;
      } catch (e) {
        return;
      }
      applySpeakerRTL(doc, options);
    });
  }

  // core/help.js
  function localizeHelp(overlay, t, lang = "fa") {
    const content = overlay?.querySelector(".r-overlay-help-content");
    if (!content) return;
    content.dir = "rtl";
    content.lang = lang;
    content.querySelectorAll(".title, th, td:nth-child(2)").forEach((el) => {
      el.textContent = t(el.textContent.trim());
    });
    content.querySelectorAll("td:first-child").forEach((el) => {
      el.dir = "ltr";
    });
  }

  // plugin/rtl.js
  var rtl_default = () => ({
    id: "rtl",
    init(deck) {
      const config = deck.getConfig();
      const locale = resolveLocale(config.rtlOptions);
      const { t, digits } = locale;
      const localized = (value) => localizeDigits(value, digits);
      config.rtl = true;
      const root = deck.getRevealElement();
      root.lang = locale.lang;
      root.dataset.rtlDigits = digits;
      root.style.setProperty("--rtl-notes-label", JSON.stringify(t("notes")));
      if (digits !== "latin" && config.slideNumber && typeof config.slideNumber !== "function") {
        const format = config.slideNumber;
        config.slideNumber = (slide) => {
          const { h, v } = deck.getIndices(slide);
          return [localized(formatSlideNumber(format, {
            h,
            v,
            vertical: deck.isVerticalSlide(slide),
            pastCount: deck.getSlidePastCount(slide),
            total: deck.getTotalSlides(),
            uncounted: slide?.dataset.visibility === "uncounted",
            horizontalCount: deck.getHorizontalSlides().length
          }))];
        };
      }
      deck.on("pdf-ready", () => document.querySelectorAll(".slide-number-pdf").forEach((el) => localizeDigitsIn(el, digits)));
      const patchJumpInput = (input) => {
        if (input.dataset.rtl) return;
        input.dataset.rtl = "1";
        input.placeholder = t("jump");
        input.dir = "rtl";
        const native = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        Object.defineProperty(input, "value", {
          get() {
            return toLatinDigits(native.get.call(this));
          },
          set(value) {
            native.set.call(this, value);
          }
        });
      };
      deck.on("ready", () => {
        new MutationObserver(() => {
          const input = root.querySelector(".jump-to-slide-input");
          if (input) patchJumpInput(input);
        }).observe(root, { childList: true });
      });
      deck.on("showhelp", () => localizeHelp(root.querySelector(".r-overlay-help"), t, locale.lang));
      if (!deck.isSpeakerNotes()) watchSpeakerView(locale);
      deck.on("ready", () => {
        const slides = deck.getSlidesElement();
        fillJalaliDates(slides, digits, locale.lang);
        localizeDigitsIn(slides, digits);
      });
    }
  });
  return __toCommonJS(rtl_exports);
})();
RevealRTL=RevealRTL.default;
