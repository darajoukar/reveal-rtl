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
  var PERSIAN_DIGITS = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";
  var SKIP_SELECTOR = 'pre, code, kbd, samp, script, style, math, svg, [dir="ltr"], .no-fa-digits';
  function toPersianDigits(value) {
    return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[d]);
  }
  function persianizeDigits(root) {
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => node.parentElement?.closest(SKIP_SELECTOR) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (/[0-9]/.test(node.nodeValue)) node.nodeValue = toPersianDigits(node.nodeValue);
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
  function formatJalali(date = /* @__PURE__ */ new Date(), options = { dateStyle: "long" }) {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", options).format(date);
  }
  function fillJalaliDates(root) {
    root.querySelectorAll("time[data-jalali]").forEach((el) => {
      const date = el.dateTime ? new Date(el.dateTime) : /* @__PURE__ */ new Date();
      if (!isNaN(date)) el.textContent = formatJalali(date);
    });
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
    ["#upcoming-slide .label", "\u0627\u0633\u0644\u0627\u06CC\u062F \u0628\u0639\u062F\u06CC"],
    [".speaker-controls-time .reset-button", "\u0628\u0631\u0627\u06CC \u0635\u0641\u0631 \u06A9\u0631\u062F\u0646 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F"],
    [".pacing-title", "\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647\u200C\u06CC \u0627\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F"],
    [".speaker-controls-notes .label", "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627"]
  ];
  var LAYOUT_NAMES = { "default": "\u067E\u06CC\u0634\u200C\u0641\u0631\u0636", "wide": "\u0639\u0631\u06CC\u0636", "tall": "\u0628\u0644\u0646\u062F", "notes-only": "\u0641\u0642\u0637 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A" };
  var LIVE_TEXT_SELECTOR = ".clock-value, .timer, .pacing";
  function applySpeakerRTL(doc, { digits = true } = {}) {
    if (!doc?.head || doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = SPEAKER_CSS;
    doc.head.append(style);
    doc.documentElement.lang = "fa";
    document.querySelectorAll('link[rel="stylesheet"][href*="rtl.css"], link[rel="stylesheet"][href*="Vazirmatn"]').forEach((link) => {
      const copy = doc.createElement("link");
      copy.rel = "stylesheet";
      copy.href = link.href;
      doc.head.append(copy);
    });
    LABELS.forEach(([selector, text]) => {
      const el = doc.querySelector(selector);
      if (el) el.textContent = text;
    });
    const timeLabel = doc.querySelector(".speaker-controls-time > .label");
    if (timeLabel?.firstChild?.nodeType === Node.TEXT_NODE) timeLabel.firstChild.nodeValue = "\u0632\u0645\u0627\u0646 ";
    const layoutSelect = doc.querySelector(".speaker-layout-dropdown");
    const layoutLabel = doc.querySelector(".speaker-layout-label");
    if (layoutSelect && layoutLabel) {
      layoutSelect.querySelectorAll("option").forEach((option) => {
        option.textContent = LAYOUT_NAMES[option.value] || option.textContent;
      });
      const syncLayoutLabel = () => {
        const text = `\u0686\u06CC\u062F\u0645\u0627\u0646: ${layoutSelect.selectedOptions[0]?.textContent || ""}`;
        if (layoutLabel.textContent !== text) layoutLabel.textContent = text;
      };
      syncLayoutLabel();
      new doc.defaultView.MutationObserver(syncLayoutLabel).observe(layoutLabel, { childList: true, characterData: true, subtree: true });
    }
    if (digits) {
      const localize = (el) => {
        const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = toPersianDigits(node.nodeValue).replace("AM", "\u0642.\u0638").replace("PM", "\u0628.\u0638");
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
  var TEXT = {
    "Keyboard Shortcuts": "\u0645\u06CC\u0627\u0646\u200C\u0628\u0631\u0647\u0627\u06CC \u0635\u0641\u062D\u0647\u200C\u06A9\u0644\u06CC\u062F",
    "KEY": "\u06A9\u0644\u06CC\u062F",
    "ACTION": "\u06A9\u0627\u0631",
    "Next slide": "\u0627\u0633\u0644\u0627\u06CC\u062F \u0628\u0639\u062F\u06CC",
    "Previous slide": "\u0627\u0633\u0644\u0627\u06CC\u062F \u0642\u0628\u0644\u06CC",
    // In RTL mode reveal.js maps left to "next" and right to "previous".
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
  function translateHelp(text) {
    return TEXT[text.trim()] ?? text;
  }
  function localizeHelp(overlay) {
    const content = overlay?.querySelector(".r-overlay-help-content");
    if (!content) return;
    content.dir = "rtl";
    content.lang = "fa";
    content.querySelectorAll(".title, th, td:nth-child(2)").forEach((el) => {
      el.textContent = translateHelp(el.textContent);
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
      const options = { digits: true, ...config.rtlOptions };
      config.rtl = true;
      if (options.digits && config.slideNumber && typeof config.slideNumber !== "function") {
        const format = config.slideNumber;
        config.slideNumber = (slide) => {
          const { h, v } = deck.getIndices(slide);
          return [toPersianDigits(formatSlideNumber(format, {
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
      if (options.digits) {
        deck.on("pdf-ready", () => document.querySelectorAll(".slide-number-pdf").forEach(persianizeDigits));
      }
      const patchJumpInput = (input) => {
        if (input.dataset.rtl) return;
        input.dataset.rtl = "1";
        input.placeholder = "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0627\u0633\u0644\u0627\u06CC\u062F (\u0634\u0645\u0627\u0631\u0647 \u06CC\u0627 \u0645\u062A\u0646)";
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
          const input = deck.getRevealElement().querySelector(".jump-to-slide-input");
          if (input) patchJumpInput(input);
        }).observe(deck.getRevealElement(), { childList: true });
      });
      deck.on("showhelp", () => localizeHelp(deck.getRevealElement().querySelector(".r-overlay-help")));
      if (!deck.isSpeakerNotes()) watchSpeakerView({ digits: options.digits });
      deck.on("ready", () => {
        const slides = deck.getSlidesElement();
        fillJalaliDates(slides);
        if (options.digits) persianizeDigits(slides);
      });
    }
  });
  return __toCommonJS(rtl_exports);
})();
RevealRTL=RevealRTL.default;
