var RevealRTLUI = (() => {
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

  // plugin/ui.js
  var ui_exports = {};
  __export(ui_exports, {
    default: () => ui_default
  });

  // core/rtl.js
  var DIGITS = { persian: "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9", arabic: "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669" };
  function localizeDigits(value, style = "persian") {
    const set = DIGITS[style];
    return set ? String(value).replace(/[0-9]/g, (d) => set[d]) : String(value);
  }
  function toLatinDigits(text) {
    return String(text).replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632);
  }
  function normalizeForSearch(text) {
    return toLatinDigits(text).replace(/ي|ى/g, "\u06CC").replace(/ك/g, "\u06A9").replace(/‌/g, " ").toLowerCase();
  }
  function timerDisplay(elapsedSeconds, durationSeconds, warnAtSeconds) {
    const elapsed = Math.floor(elapsedSeconds);
    if (!durationSeconds) return { text: formatDuration(elapsed), state: "normal" };
    const remaining = durationSeconds - elapsed;
    if (remaining < 0) return { text: "-" + formatDuration(-remaining), state: "over" };
    return { text: formatDuration(remaining), state: remaining <= warnAtSeconds ? "warn" : "normal" };
  }
  function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor(totalSeconds % 3600 / 60);
    const s = String(totalSeconds % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
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
  var DIGIT_LOCALES = { persian: "fa-IR", arabic: "ar-EG", latin: "en-GB" };
  function resolveLocale({ lang, digits, labels } = {}) {
    const code = LOCALES[lang] ? lang : "fa";
    const style = digits === false ? "latin" : ["persian", "arabic", "latin"].includes(digits) ? digits : DEFAULT_DIGITS[code];
    const table2 = { ...LOCALES[code], ...labels };
    const t = (key, vars = {}) => (table2[key] ?? key).replace(/\{(\w+)\}/g, (m, name) => vars[name] ?? m);
    return { lang: code, digits: style, t };
  }

  // core/draw.js
  var PEN_COLOR = "#e53935";
  var PEN_WIDTH = 4;
  function drawStrokes(ctx, strokes, box, scale = 1) {
    ctx.strokeStyle = PEN_COLOR;
    ctx.lineWidth = PEN_WIDTH * scale;
    ctx.lineCap = ctx.lineJoin = "round";
    strokes.forEach((points) => {
      if (!points.length) return;
      ctx.beginPath();
      points.forEach(([x, y], i) => {
        const px = box.x + x * box.width, py = box.y + y * box.height;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      if (points.length === 1) ctx.lineTo(box.x + points[0][0] * box.width + 0.1, box.y + points[0][1] * box.height);
      ctx.stroke();
    });
  }
  function loadStrokes(storageKey) {
    const strokes = /* @__PURE__ */ new Map();
    try {
      const data = JSON.parse(localStorage.getItem(storageKey));
      for (const [key, list2] of Object.entries(data || {})) {
        if (!/^\d+\/\d+$/.test(key) || !Array.isArray(list2)) continue;
        const valid = list2.filter((points) => Array.isArray(points) && points.every((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)));
        if (valid.length) strokes.set(key, valid);
      }
    } catch (e) {
    }
    return strokes;
  }
  function saveStrokes(storageKey, strokes) {
    try {
      if (strokes.size) localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(strokes)));
      else localStorage.removeItem(storageKey);
    } catch (e) {
    }
  }
  function createDrawingLayer(root, { getSlideKey, getSlideBox, storageKey }) {
    const canvas = document.createElement("canvas");
    canvas.className = "rtlui-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const laser = document.createElement("div");
    laser.className = "rtlui-laser";
    laser.hidden = true;
    root.append(canvas, laser);
    const ctx = canvas.getContext("2d");
    const strokes = loadStrokes(storageKey);
    let tool = null;
    let current = null;
    function box() {
      const ratio = window.devicePixelRatio || 1;
      const c = canvas.getBoundingClientRect(), s = getSlideBox();
      return { x: (s.left - c.left) * ratio, y: (s.top - c.top) * ratio, width: s.width * ratio, height: s.height * ratio };
    }
    const point = (event) => {
      const s = getSlideBox();
      return [(event.clientX - s.left) / s.width, (event.clientY - s.top) / s.height];
    };
    const lineScale = () => (window.devicePixelRatio || 1) * getSlideBox().width / root.querySelector(".slides").offsetWidth;
    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      redraw();
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStrokes(ctx, strokes.get(getSlideKey()) || [], box(), lineScale());
    }
    canvas.addEventListener("pointerdown", (event) => {
      if (tool !== "pen") return;
      canvas.setPointerCapture(event.pointerId);
      current = [point(event)];
      const key = getSlideKey();
      if (!strokes.has(key)) strokes.set(key, []);
      strokes.get(key).push(current);
      drawStrokes(ctx, [current], box(), lineScale());
      event.preventDefault();
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!current) return;
      current.push(point(event));
      drawStrokes(ctx, [current.slice(-2)], box(), lineScale());
    });
    const endStroke = () => {
      if (!current) return;
      current = null;
      saveStrokes(storageKey, strokes);
    };
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);
    root.addEventListener("pointermove", (event) => {
      if (tool !== "laser") return;
      const r = root.getBoundingClientRect();
      laser.style.translate = `${event.clientX - r.left}px ${event.clientY - r.top}px`;
      laser.hidden = false;
    });
    root.addEventListener("pointerleave", () => {
      laser.hidden = true;
    });
    new ResizeObserver(resize).observe(canvas);
    return {
      get tool() {
        return tool;
      },
      setTool(next) {
        tool = tool === next ? null : next;
        root.classList.toggle("rtlui-pen", tool === "pen");
        root.classList.toggle("rtlui-laser-on", tool === "laser");
        if (tool !== "laser") laser.hidden = true;
        current = null;
        return tool;
      },
      clear() {
        strokes.delete(getSlideKey());
        saveStrokes(storageKey, strokes);
        redraw();
      },
      redraw
    };
  }
  function drawStrokesOnPrintPages(storageKey, { slideWidth, slideHeight, margin }) {
    const strokes = loadStrokes(storageKey);
    if (!strokes.size) return;
    const pageWidth = Math.floor(slideWidth * (1 + margin));
    const pageHeight = Math.floor(slideHeight * (1 + margin));
    document.querySelectorAll(".pdf-page").forEach((page) => {
      const key = page.querySelector("section[data-rtlui-key]")?.dataset.rtluiKey;
      if (!strokes.has(key)) return;
      const canvas = document.createElement("canvas");
      canvas.className = "rtlui-print-canvas";
      canvas.width = pageWidth * 2;
      canvas.height = pageHeight * 2;
      Object.assign(canvas.style, { position: "absolute", left: 0, top: 0, width: `${pageWidth}px`, height: `${pageHeight}px`, zIndex: 10, pointerEvents: "none" });
      const box = { x: pageWidth - slideWidth, y: pageHeight - slideHeight, width: slideWidth * 2, height: slideHeight * 2 };
      drawStrokes(canvas.getContext("2d"), strokes.get(key), box, 2);
      page.append(canvas);
    });
  }

  // core/export.js
  var BLOCK_TAGS = /* @__PURE__ */ new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "UL", "OL", "PRE", "BLOCKQUOTE", "TABLE", "SECTION", "DIV", "FIGURE", "HR"]);
  var isElement = (node) => node.nodeType === 1;
  var isNotes = (node) => isElement(node) && node.nodeName === "ASIDE" && /\bnotes\b/.test(node.getAttribute("class") || "");
  var children = (node) => Array.from(node.childNodes || []);
  function textOf(node) {
    if (node.nodeType === 3) return node.nodeValue;
    if (isNotes(node)) return "";
    return children(node).map(textOf).join("");
  }
  var collapse = (text) => text.replace(/\s+/g, " ").trim();
  function getSlideTitle(slide, index, t) {
    const explicit = slide.getAttribute("data-menu-title");
    if (explicit) return explicit;
    const heading = findFirst(slide, (node) => /^H[1-3]$/.test(node.nodeName));
    if (heading) return collapse(textOf(heading));
    return t ? t("slideN", { n: index + 1 }) : `\u0627\u0633\u0644\u0627\u06CC\u062F ${index + 1}`;
  }
  function findFirst(node, test) {
    for (const child of children(node)) {
      if (!isElement(child) || isNotes(child)) continue;
      if (test(child)) return child;
      const found = findFirst(child, test);
      if (found) return found;
    }
    return null;
  }
  function getSlideNotes(slide) {
    const notes = [];
    const walk = (node) => children(node).forEach((child) => {
      if (isNotes(child)) notes.push(collapse(children(child).map(textOf).join("")));
      else if (isElement(child)) walk(child);
    });
    walk(slide);
    const attr = slide.getAttribute("data-notes");
    if (attr) notes.push(attr);
    return notes.join("\n");
  }
  function inline(node) {
    if (node.nodeType === 3) return node.nodeValue.replace(/\s+/g, " ");
    if (!isElement(node) || isNotes(node)) return "";
    const inner = () => children(node).map(inline).join("");
    switch (node.nodeName) {
      case "STRONG":
      case "B":
        return wrap("**", inner());
      case "EM":
      case "I":
        return wrap("*", inner());
      case "CODE":
        return "`" + textOf(node) + "`";
      case "BR":
        return "  \n";
      case "A":
        return `[${inner().trim()}](${node.getAttribute("href") || ""})`;
      case "IMG":
        return `![${node.getAttribute("alt") || ""}](${node.getAttribute("src") || ""})`;
      default:
        return inner();
    }
  }
  function wrap(mark, text) {
    const trimmed = text.trim();
    return trimmed ? mark + trimmed + mark : "";
  }
  function list(node, depth) {
    const ordered = node.nodeName === "OL";
    let n = 0;
    return children(node).filter((li) => li.nodeName === "LI").map((li) => {
      n++;
      const own = children(li).filter((c) => c.nodeName !== "UL" && c.nodeName !== "OL").map(inline).join("").trim();
      const nested = children(li).filter((c) => c.nodeName === "UL" || c.nodeName === "OL").map((c) => list(c, depth + 1)).join("");
      return `${"  ".repeat(depth)}${ordered ? n + "." : "-"} ${own}
${nested}`;
    }).join("");
  }
  function table(node) {
    const rows = [];
    const collect = (el2) => children(el2).forEach((c) => {
      if (c.nodeName === "TR") rows.push(children(c).filter((cell) => /^T[HD]$/.test(cell.nodeName)).map((cell) => collapse(inline(cell)).replace(/\|/g, "\\|")));
      else if (isElement(c)) collect(c);
    });
    collect(node);
    if (!rows.length) return "";
    const line = (cells) => `| ${cells.join(" | ")} |
`;
    return line(rows[0]) + line(rows[0].map(() => "---")) + rows.slice(1).map(line).join("") + "\n";
  }
  function block(node) {
    if (node.nodeType === 3) {
      const text2 = collapse(node.nodeValue);
      return text2 ? text2 + "\n\n" : "";
    }
    if (!isElement(node) || isNotes(node)) return "";
    const name = node.nodeName;
    if (/^H[1-6]$/.test(name)) return `${"#".repeat(+name[1])} ${collapse(inline(node))}

`;
    switch (name) {
      case "P": {
        const text2 = inline(node).trim();
        return text2 ? text2 + "\n\n" : "";
      }
      case "UL":
      case "OL":
        return list(node, 0) + "\n";
      case "PRE": {
        const code = findFirst(node, (c) => c.nodeName === "CODE");
        const lang = ((code?.getAttribute("class") || "").match(/language-(\S+)/) || [])[1] || "";
        return "```" + lang + "\n" + textOf(node).replace(/\n$/, "") + "\n```\n\n";
      }
      case "BLOCKQUOTE":
        return blocks(node).trim().split("\n").map((l) => "> " + l).join("\n") + "\n\n";
      case "TABLE":
        return table(node);
      case "HR":
        return "***\n\n";
      case "SCRIPT":
      case "STYLE":
        return "";
    }
    if (children(node).some((c) => BLOCK_TAGS.has(c.nodeName))) return blocks(node);
    const text = inline(node).trim();
    return text ? text + "\n\n" : "";
  }
  function blocks(node) {
    return children(node).map(block).join("");
  }
  function htmlToMarkdown(node) {
    return blocks(node).replace(/\n{3,}/g, "\n\n").trim();
  }
  function slidesToMarkdown(slides) {
    return slides.map(({ element }) => {
      const notes = getSlideNotes(element);
      return htmlToMarkdown(element) + (notes ? `

Note: ${notes}` : "");
    }).join("\n\n---\n\n") + "\n";
  }
  function slidesToJSON(slides, title, t) {
    return JSON.stringify({
      title,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      slideCount: slides.length,
      slides: slides.map(({ element, h, v }, i) => ({
        number: i + 1,
        indices: { h, v },
        title: getSlideTitle(element, i, t),
        text: collapse(textOf(element)),
        notes: getSlideNotes(element),
        markdown: htmlToMarkdown(element)
      }))
    }, null, 2);
  }
  function slidesToNotesText(slides, title, t) {
    const parts = slides.map(({ element }, i) => {
      const notes = getSlideNotes(element);
      return `${i + 1}. ${getSlideTitle(element, i, t)}
${notes || "\u2014"}`;
    });
    const heading = t ? t("notesFileTitle") : "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0633\u062E\u0646\u0631\u0627\u0646";
    return `${heading}: ${title}

${parts.join("\n\n")}
`;
  }
  function standaloneHTML(docClone, baseURI) {
    docClone.querySelectorAll("[src], link[href]").forEach((el2) => {
      const attr = el2.hasAttribute("src") ? "src" : "href";
      const value = el2.getAttribute(attr);
      if (value && !/^(data:|blob:|#)/.test(value)) {
        try {
          el2.setAttribute(attr, new URL(value, baseURI).href);
        } catch (e) {
        }
      }
    });
    return "<!doctype html>\n" + docClone.outerHTML;
  }
  var CSS_IMPORT = /@import\s+(?:url\(\s*)?(['"]?)([^'")\s;]+)\1\s*\)?[^;]*;/g;
  var CSS_URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
  async function toDataURL(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
    return `data:${blob.type || "application/octet-stream"};base64,${btoa(binary)}`;
  }
  async function fetchOk(url, fetchFn) {
    const response = await fetchFn(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response;
  }
  async function inlineCss(css, cssURL, fetchFn = fetch, failed = [], depth = 0) {
    if (depth > 5) return css;
    const imports = [...css.matchAll(CSS_IMPORT)];
    for (const [rule, , href] of imports) {
      const url = new URL(href, cssURL).href;
      try {
        const imported = await (await fetchOk(url, fetchFn)).text();
        css = css.replace(rule, await inlineCss(imported, url, fetchFn, failed, depth + 1));
      } catch (e) {
        failed.push(url);
      }
    }
    const cache = /* @__PURE__ */ new Map();
    for (const [, , href] of css.matchAll(CSS_URL)) {
      if (/^(data:|#)/.test(href) || cache.has(href)) continue;
      const url = new URL(href, cssURL).href;
      if (failed.includes(url)) continue;
      try {
        cache.set(href, await toDataURL(await (await fetchOk(url, fetchFn)).blob()));
      } catch (e) {
        failed.push(url);
      }
    }
    return css.replace(CSS_URL, (match, quote, href) => {
      if (cache.has(href)) return `url("${cache.get(href)}")`;
      return /^(data:|#)/.test(href) ? match : `url("${new URL(href, cssURL).href}")`;
    });
  }
  async function offlineHTML(docClone, baseURI, fetchFn = fetch) {
    const failed = [];
    const doc = docClone.ownerDocument;
    for (const link of docClone.querySelectorAll('link[rel="stylesheet"][href]')) {
      const url = new URL(link.getAttribute("href"), baseURI).href;
      try {
        const style = doc.createElement("style");
        if (link.media) style.media = link.media;
        style.textContent = await inlineCss(await (await fetchOk(url, fetchFn)).text(), url, fetchFn, failed);
        link.replaceWith(style);
      } catch (e) {
        failed.push(url);
      }
    }
    for (const script of docClone.querySelectorAll("script[src]")) {
      const url = new URL(script.getAttribute("src"), baseURI).href;
      try {
        const code = await (await fetchOk(url, fetchFn)).text();
        const inline2 = doc.createElement("script");
        inline2.textContent = code.replace(/<\/script/gi, "<\\/script");
        script.replaceWith(inline2);
      } catch (e) {
        failed.push(url);
      }
    }
    for (const img of docClone.querySelectorAll('img[src]:not([src^="data:"])')) {
      const url = new URL(img.getAttribute("src"), baseURI).href;
      try {
        img.setAttribute("src", await toDataURL(await (await fetchOk(url, fetchFn)).blob()));
      } catch (e) {
        failed.push(url);
      }
    }
    return { html: standaloneHTML(docClone, baseURI), failed: [...new Set(failed)] };
  }
  function safeFileName(title) {
    return (title || "").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-").slice(0, 80) || "presentation";
  }
  function download(fileName, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }

  // plugin/ui.js
  var THEME_STORAGE_KEY = "reveal-rtl-ui:theme";
  var TIMER_STORAGE_KEY = "reveal-rtl-ui:timer";
  var TOOLBAR_STORAGE_KEY = "reveal-rtl-ui:toolbar-hidden";
  var DRAWINGS_STORAGE_KEY = "reveal-rtl-ui:drawings";
  var KEY_M = 77;
  var KEY_T = 84;
  var KEY_D = 68;
  var KEY_E = 69;
  var KEY_Z = 90;
  var ZOOM_STEP = 0.1;
  var ZOOM_MIN = 0.5;
  var ZOOM_MAX = 3;
  var PRINT_PARAM = "rtlui-print";
  var PREVIEW_WIDTH = 260;
  var canHover = typeof matchMedia === "function" && matchMedia("(hover: hover)").matches;
  var svg = (path) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="${path}"/></svg>`;
  var ICONS = {
    menu: svg("M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"),
    first: svg("M6 6h2v12H6zm3.5 6 8.5 6V6z"),
    last: svg("M16 6h2v12h-2zM6 18l8.5-6L6 6z"),
    play: svg("M8 5v14l11-7z"),
    pause: svg("M6 5h4v14H6zm8 0h4v14h-4z"),
    reset: svg("M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"),
    notes: svg("M4 4h16v12H8l-4 4zm3 4v2h10V8zm0 3v2h7v-2z"),
    speaker: svg("M3 4h18v12H3zm2 2v8h14V6zm3 12h8v2H8z"),
    grid: svg("M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"),
    zoomIn: svg("M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM9 7h2v2h2v2h-2v2H9v-2H7V9h2z"),
    zoomOut: svg("M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM7 9h6v2H7z"),
    export: svg("M11 3h2v9.2l3.3-3.3 1.4 1.4-5.7 5.7-5.7-5.7 1.4-1.4 3.3 3.3zM4 18h16v2H4z"),
    laser: svg("M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 1h2v4h-2zm0 18h2v4h-2zM1 11h4v2H1zm18 0h4v2h-4z"),
    pen: svg("M3 17.2V21h3.8l11-11-3.8-3.8zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8z"),
    erase: svg("M16.2 3.6 21 8.4a1.5 1.5 0 0 1 0 2.1L12.5 19H20v2H8l-4.6-4.6a1.5 1.5 0 0 1 0-2.1L14.1 3.6a1.5 1.5 0 0 1 2.1 0zM6.5 13.4 4.6 15.3 8.3 19h2.5l1.3-1.3z"),
    hide: svg("M7 10l5 5 5-5z"),
    show: svg("M7 14l5-5 5 5z"),
    fullscreen: svg("M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z")
  };
  var ui_default = () => ({
    id: "rtl-ui",
    init(deck) {
      if (deck.isSpeakerNotes()) return;
      const config = deck.getConfig();
      const options = {
        themes: [],
        themeLink: "#theme",
        idle: 3e3,
        ...config.uiOptions
      };
      const locale = resolveLocale({ ...config.rtlOptions, ..."digits" in options ? { digits: options.digits } : {} });
      const { t } = locale;
      const digits = (text) => localizeDigits(text, locale.digits);
      const root = deck.getRevealElement();
      const themeLink = document.querySelector(options.themeLink);
      const pageSnapshot = document.documentElement.cloneNode(true);
      const drawingsKey = `${DRAWINGS_STORAGE_KEY}:${location.pathname}`;
      if (deck.isPrintView()) {
        [...root.querySelectorAll(".slides > section")].forEach((section, h) => {
          const children2 = section.querySelectorAll(":scope > section");
          if (children2.length) children2.forEach((child, v) => {
            child.dataset.rtluiKey = `${h}/${v}`;
          });
          else section.dataset.rtluiKey = `${h}/0`;
        });
        deck.on("pdf-ready", () => {
          const size = deck.getComputedSlideSize();
          drawStrokesOnPrintPages(drawingsKey, { slideWidth: size.width, slideHeight: size.height, margin: config.margin });
          if (new URLSearchParams(location.search).has(PRINT_PARAM)) {
            document.fonts.ready.then(() => setTimeout(() => window.print(), 500));
          }
        });
        return;
      }
      applyStoredTheme(themeLink, options.themes);
      const drawing = createDrawingLayer(root, {
        getSlideKey: () => {
          const { h, v } = deck.getIndices();
          return `${h}/${v}`;
        },
        getSlideBox: () => deck.getSlidesElement().getBoundingClientRect(),
        storageKey: drawingsKey
      });
      deck.on("slidechanged", () => drawing.redraw());
      const panel = createPanel();
      const toolbar = createToolbar();
      root.append(panel.element, toolbar.element);
      deck.addKeyBinding({ keyCode: KEY_M, key: "M", description: t("slideList") }, () => panel.toggle());
      deck.on("ready", () => {
        panel.build();
        panel.markCurrent();
      });
      deck.on("slidechanged", () => panel.markCurrent());
      function createPanel() {
        const element = el("nav", "rtlui-panel");
        element.setAttribute("aria-label", t("slideList"));
        element.hidden = true;
        const search = el("input", "rtlui-search");
        search.type = "search";
        search.placeholder = t("search");
        search.setAttribute("aria-label", t("searchLabel"));
        const list2 = el("ol", "rtlui-list");
        const empty = el("p", "rtlui-empty", t("noResults"));
        empty.hidden = true;
        const preview = el("div", "rtlui-preview");
        preview.setAttribute("aria-hidden", "true");
        preview.hidden = true;
        const stage = el("div", "rtlui-preview-stage");
        if (config.rtl) stage.dir = "rtl";
        preview.append(stage);
        element.append(search, list2, empty, preview);
        let items = [];
        function showPreview(item) {
          const scale = PREVIEW_WIDTH / config.width;
          const clone = item.slide.cloneNode(true);
          clone.removeAttribute("style");
          clone.removeAttribute("id");
          clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
          clone.querySelectorAll("aside.notes, script, iframe, video, audio").forEach((node) => node.remove());
          clone.querySelectorAll(".fragment").forEach((node) => node.classList.add("visible"));
          stage.style.width = `${config.width}px`;
          stage.style.height = `${config.height}px`;
          stage.style.scale = scale;
          stage.replaceChildren(clone);
          preview.style.width = `${PREVIEW_WIDTH}px`;
          preview.style.height = `${Math.round(config.height * scale)}px`;
          const top = item.button.getBoundingClientRect().top - element.getBoundingClientRect().top;
          preview.style.top = `${Math.max(8, Math.min(top, element.clientHeight - config.height * scale - 8))}px`;
          preview.hidden = false;
        }
        const hidePreview = () => {
          preview.hidden = true;
          stage.replaceChildren();
        };
        list2.addEventListener("mouseleave", hidePreview);
        search.addEventListener("input", () => {
          const query = normalizeForSearch(search.value.trim());
          let visible = 0;
          items.forEach((item) => {
            const match = !query || item.text.includes(query);
            item.li.hidden = !match;
            if (match) visible++;
          });
          empty.hidden = visible > 0;
        });
        search.addEventListener("keydown", (event) => {
          if (event.key === "Enter") items.find((item) => !item.li.hidden)?.button.click();
          if (event.key === "Escape") toggle(false);
        });
        function build() {
          list2.replaceChildren();
          items = deck.getSlides().map((slide, i) => {
            const { h, v } = deck.getIndices(slide);
            const title = getSlideTitle(slide, i, t);
            const li = el("li");
            const button2 = el("button", "rtlui-item");
            button2.type = "button";
            button2.append(el("span", "rtlui-item-number", digits(i + 1)), el("span", "rtlui-item-title", title));
            if (v > 0) button2.classList.add("rtlui-item-vertical");
            button2.addEventListener("click", () => {
              deck.slide(h, v);
              toggle(false);
            });
            li.append(button2);
            list2.append(li);
            const item = { slide, li, button: button2, text: normalizeForSearch(`${title} ${slide.textContent}`) };
            if (canHover) button2.addEventListener("mouseenter", () => showPreview(item));
            return item;
          });
        }
        function markCurrent() {
          const current = deck.getCurrentSlide();
          items.forEach((item) => {
            const active = item.slide === current;
            item.button.classList.toggle("rtlui-item-current", active);
            if (active) item.button.setAttribute("aria-current", "true");
            else item.button.removeAttribute("aria-current");
          });
        }
        function toggle(open = element.hidden) {
          element.hidden = !open;
          if (!open) hidePreview();
          toolbar?.setMenuOpen(open);
          if (open) {
            search.focus();
            items.find((item) => item.button.classList.contains("rtlui-item-current"))?.button.scrollIntoView({ block: "nearest" });
          } else if (element.contains(document.activeElement)) {
            document.activeElement.blur();
          }
        }
        return { element, build, markCurrent, toggle };
      }
      function createToolbar() {
        const element = el("div", "rtlui-toolbar");
        element.setAttribute("role", "toolbar");
        element.setAttribute("aria-label", t("toolbar"));
        const menuButton = button(ICONS.menu, `${t("slideList")} (M)`, () => panel.toggle());
        menuButton.setAttribute("aria-expanded", "false");
        const firstButton = button(ICONS.first, t("first"), () => deck.slide(0));
        const lastButton = button(ICONS.last, t("last"), () => deck.slide(Number.MAX_VALUE));
        firstButton.classList.add("rtlui-mirror");
        lastButton.classList.add("rtlui-mirror");
        const gridButton = button(ICONS.grid, `${t("grid")} (Esc)`, () => deck.toggleOverview());
        const syncGrid = () => gridButton.setAttribute("aria-pressed", String(deck.isOverview()));
        syncGrid();
        deck.on("overviewshown", syncGrid);
        deck.on("overviewhidden", syncGrid);
        const timer = readTimer(options.duration ? options.duration * 60 : config.totalTime || null);
        const isRunning = () => timer.startedAt !== null;
        const elapsedSeconds = () => timer.base + (isRunning() ? (Date.now() - timer.startedAt) / 1e3 : 0);
        const warnAt = () => options.warnAt ? options.warnAt * 60 : Math.min(300, Math.round(timer.duration * 0.2));
        const timerValue = el("button", "rtlui-button rtlui-timer");
        timerValue.type = "button";
        const renderTimer = () => {
          const { text, state } = timerDisplay(elapsedSeconds(), timer.duration, warnAt());
          timerValue.textContent = digits(text);
          timerValue.classList.toggle("rtlui-timer-warn", state === "warn");
          timerValue.classList.toggle("rtlui-timer-over", state === "over");
          setLabel(timerValue, timer.duration ? t("timerRemaining", { m: digits(timer.duration / 60) }) : t("timerElapsed"));
        };
        timerValue.addEventListener("click", () => {
          const current = timer.duration ? digits(timer.duration / 60) : "";
          const answer = window.prompt(t("timerPrompt"), current);
          if (answer === null) return;
          const minutes = parseFloat(toLatinDigits(answer.trim()));
          timer.duration = minutes > 0 ? Math.round(minutes * 60) : null;
          saveTimer(timer);
          renderTimer();
        });
        const playButton = button(ICONS.play, t("play"), () => {
          if (isRunning()) {
            timer.base = elapsedSeconds();
            timer.startedAt = null;
          } else {
            timer.startedAt = Date.now();
          }
          saveTimer(timer);
          renderPlayButton();
        });
        const renderPlayButton = () => {
          playButton.innerHTML = isRunning() ? ICONS.pause : ICONS.play;
          setLabel(playButton, isRunning() ? t("pause") : t("play"));
        };
        renderPlayButton();
        const resetButton = button(ICONS.reset, t("resetTimer"), () => {
          timer.base = 0;
          if (isRunning()) timer.startedAt = Date.now();
          saveTimer(timer);
          renderTimer();
        });
        const clock = el("time", "rtlui-clock");
        const clockFormat = new Intl.DateTimeFormat(DIGIT_LOCALES[locale.digits], { hour: "2-digit", minute: "2-digit" });
        const tick = () => {
          clock.textContent = clockFormat.format(/* @__PURE__ */ new Date());
          renderTimer();
        };
        tick();
        setInterval(tick, 1e3);
        const groups = [
          group(menuButton),
          group(firstButton, lastButton, gridButton),
          group(playButton, timerValue, resetButton),
          wideOnly(group(clock))
        ];
        let zoom = 1;
        const zoomReset = el("button", "rtlui-button rtlui-zoom-value");
        zoomReset.type = "button";
        setLabel(zoomReset, t("zoomReset"));
        const setZoom = (value) => {
          zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 10) / 10));
          root.style.setProperty("--rtlui-zoom", zoom);
          zoomReset.textContent = digits(`${Math.round(zoom * 100)}%`);
        };
        zoomReset.addEventListener("click", () => setZoom(1));
        setZoom(1);
        groups.push(wideOnly(group(
          button(ICONS.zoomIn, t("zoomIn"), () => setZoom(zoom + ZOOM_STEP)),
          zoomReset,
          button(ICONS.zoomOut, t("zoomOut"), () => setZoom(zoom - ZOOM_STEP))
        )));
        if (options.themes.length && themeLink) groups.push(wideOnly(group(themeSelect())));
        groups.push(group(exportMenu()));
        const notesButton = button(ICONS.notes, t("showNotes"), () => {
          const show = !deck.getConfig().showNotes;
          deck.configure({ showNotes: show });
          notesButton.setAttribute("aria-pressed", String(show));
        });
        notesButton.setAttribute("aria-pressed", String(!!config.showNotes));
        const fullscreenButton = button(ICONS.fullscreen, t("fullscreen"), () => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
        });
        const noteControls = [notesButton];
        if (deck.hasPlugin("notes")) {
          noteControls.push(wideOnly(button(ICONS.speaker, `${t("speakerView")} (S)`, () => deck.getPlugin("notes").open())));
        }
        const laserButton = button(ICONS.laser, `${t("laser")} (Z)`, () => toggleTool("laser"));
        const penButton = button(ICONS.pen, `${t("pen")} (D)`, () => toggleTool("pen"));
        const eraseButton = button(ICONS.erase, `${t("erase")} (E)`, () => drawing.clear());
        const toggleTool = (name) => {
          const active = drawing.setTool(name);
          laserButton.setAttribute("aria-pressed", String(active === "laser"));
          penButton.setAttribute("aria-pressed", String(active === "pen"));
        };
        laserButton.setAttribute("aria-pressed", "false");
        penButton.setAttribute("aria-pressed", "false");
        deck.addKeyBinding({ keyCode: KEY_Z, key: "Z", description: t("laser") }, () => toggleTool("laser"));
        deck.addKeyBinding({ keyCode: KEY_D, key: "D", description: t("pen") }, () => toggleTool("pen"));
        deck.addKeyBinding({ keyCode: KEY_E, key: "E", description: t("erase") }, () => drawing.clear());
        groups.push(wideOnly(group(laserButton, penButton, eraseButton)));
        groups.push(group(...noteControls, wideOnly(fullscreenButton)));
        const hideButton = button(ICONS.hide, `${t("hideToolbar")} (T)`, () => setHidden(true));
        groups.push(group(hideButton));
        element.append(...groups);
        const showButton = button(ICONS.show, `${t("showToolbar")} (T)`, () => setHidden(false));
        showButton.classList.add("rtlui-show");
        root.append(showButton);
        const setHidden = (hidden) => {
          const focusWasInside = element.contains(document.activeElement) || showButton === document.activeElement;
          root.classList.toggle("rtlui-hidden", hidden);
          element.inert = hidden;
          try {
            localStorage.setItem(TOOLBAR_STORAGE_KEY, hidden ? "1" : "");
          } catch (e) {
          }
          if (focusWasInside) (hidden ? showButton : hideButton).focus();
        };
        let storedHidden = false;
        try {
          storedHidden = localStorage.getItem(TOOLBAR_STORAGE_KEY) === "1";
        } catch (e) {
        }
        setHidden(storedHidden);
        deck.addKeyBinding({ keyCode: KEY_T, key: "T", description: t("toggleToolbar") }, () => setHidden(!root.classList.contains("rtlui-hidden")));
        element.addEventListener("keydown", (event) => {
          const target = event.target;
          if (target.matches("select") || target.closest(".rtlui-menu") || target.matches("button") && (event.key === "Enter" || event.key === " ")) {
            event.stopPropagation();
          }
        });
        setupIdleHide(element);
        return {
          element,
          setMenuOpen: (open) => menuButton.setAttribute("aria-expanded", String(open))
        };
      }
      function exportMenu() {
        const wrapper = el("div", "rtlui-menu-wrapper");
        const trigger = button(ICONS.export, t("export"), () => setOpen(menu.hidden));
        trigger.setAttribute("aria-haspopup", "menu");
        trigger.setAttribute("aria-expanded", "false");
        const menu = el("div", "rtlui-menu");
        menu.setAttribute("role", "menu");
        menu.setAttribute("aria-label", t("export"));
        menu.hidden = true;
        const title = document.title || "presentation";
        const fileName = (ext) => `${safeFileName(title)}.${ext}`;
        const slides = () => deck.getSlides().map((element) => ({ element, ...deck.getIndices(element) }));
        const items = [
          [t("exportPDF"), exportPDF],
          [t("exportJSON"), () => download(fileName("json"), slidesToJSON(slides(), title, t), "application/json")],
          [t("exportMarkdown"), () => download(fileName("md"), slidesToMarkdown(slides()), "text/markdown")],
          [t("exportHTML"), () => download(fileName("html"), standaloneHTML(pageSnapshot.cloneNode(true), document.baseURI), "text/html")],
          [t("exportOffline"), exportOfflineHTML],
          [t("exportNotes"), () => download(`${safeFileName(title)}-notes.txt`, slidesToNotesText(slides(), title, t), "text/plain")]
        ].map(([label, action]) => {
          const item = el("button", "rtlui-menu-item", label);
          item.type = "button";
          item.setAttribute("role", "menuitem");
          item.tabIndex = -1;
          item.addEventListener("click", () => {
            setOpen(false);
            trigger.focus();
            action();
          });
          menu.append(item);
          return item;
        });
        function setOpen(open) {
          menu.hidden = !open;
          trigger.setAttribute("aria-expanded", String(open));
          if (open) items[0].focus();
        }
        menu.addEventListener("keydown", (event) => {
          const i = items.indexOf(document.activeElement);
          if (event.key === "ArrowDown") items[(i + 1) % items.length].focus();
          else if (event.key === "ArrowUp") items[(i - 1 + items.length) % items.length].focus();
          else if (event.key === "Escape") {
            setOpen(false);
            trigger.focus();
          } else return;
          event.preventDefault();
        });
        document.addEventListener("click", (event) => {
          if (!menu.hidden && !wrapper.contains(event.target)) setOpen(false);
        });
        wrapper.append(trigger, menu);
        return wrapper;
      }
      async function exportOfflineHTML() {
        const title = document.title || "presentation";
        root.classList.add("rtlui-busy");
        try {
          const { html, failed } = await offlineHTML(pageSnapshot.cloneNode(true), document.baseURI);
          download(`${safeFileName(title)}-offline.html`, html, "text/html");
          if (failed.length) {
            const hint = location.protocol === "file:" ? "\n" + t("offlineFileHint") : "";
            window.alert(`${t("offlineFailed", { n: digits(failed.length) })}
${failed.join("\n")}${hint}`);
          }
        } finally {
          root.classList.remove("rtlui-busy");
        }
      }
      function exportPDF() {
        const url = new URL(location.href);
        url.searchParams.set("print-pdf", "");
        url.searchParams.set(PRINT_PARAM, "");
        url.hash = "";
        if (!window.open(url.href, "_blank")) location.href = url.href;
      }
      function themeSelect() {
        const select = el("select", "rtlui-theme");
        select.setAttribute("aria-label", t("theme"));
        select.title = t("theme");
        const current = themeLink.getAttribute("href");
        options.themes.forEach((theme) => {
          const option = el("option", "", theme.name);
          option.value = theme.href;
          option.selected = theme.href === current;
          select.append(option);
        });
        select.addEventListener("change", () => {
          themeLink.setAttribute("href", select.value);
          try {
            localStorage.setItem(THEME_STORAGE_KEY, select.value);
          } catch (e) {
          }
        });
        return select;
      }
      function setupIdleHide(element) {
        let timeout;
        const wake = () => {
          root.classList.remove("rtlui-idle");
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (!element.matches(":hover, :focus-within") && panel.element.hidden) root.classList.add("rtlui-idle");
          }, options.idle);
        };
        document.addEventListener("mousemove", wake);
        element.addEventListener("focusin", wake);
        wake();
      }
    }
  });
  var timerStorageKey = () => `${TIMER_STORAGE_KEY}:${location.pathname}`;
  function readTimer(defaultDuration) {
    const fresh = { base: 0, startedAt: null, duration: defaultDuration };
    try {
      const stored = JSON.parse(sessionStorage.getItem(timerStorageKey()));
      const validStart = stored?.startedAt === null || Number.isFinite(stored?.startedAt) && stored.startedAt <= Date.now();
      if (Number.isFinite(stored?.base) && stored.base >= 0 && validStart) {
        const validDuration = stored.duration === null || Number.isFinite(stored.duration) && stored.duration > 0;
        return { base: stored.base, startedAt: stored.startedAt, duration: "duration" in stored && validDuration ? stored.duration : defaultDuration };
      }
    } catch (e) {
    }
    return fresh;
  }
  function saveTimer(timer) {
    try {
      sessionStorage.setItem(timerStorageKey(), JSON.stringify(timer));
    } catch (e) {
    }
  }
  function applyStoredTheme(themeLink, themes) {
    if (!themeLink) return;
    let stored = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
    }
    if (stored && themes.some((theme) => theme.href === stored)) themeLink.setAttribute("href", stored);
  }
  function el(tag, className = "", text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== void 0) node.textContent = text;
    return node;
  }
  function button(icon, label, onClick) {
    const node = el("button", "rtlui-button");
    node.innerHTML = icon;
    node.type = "button";
    setLabel(node, label);
    node.addEventListener("click", onClick);
    return node;
  }
  function wideOnly(node) {
    node.classList.add("rtlui-wide-only");
    return node;
  }
  function setLabel(node, label) {
    node.title = label;
    node.setAttribute("aria-label", label);
  }
  function group(...children2) {
    const node = el("div", "rtlui-group");
    node.append(...children2);
    return node;
  }
  return __toCommonJS(ui_exports);
})();
RevealRTLUI=RevealRTLUI.default;
