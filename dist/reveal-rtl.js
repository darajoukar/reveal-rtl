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
    document.querySelectorAll('link[rel="stylesheet"][href*="Vazirmatn"]').forEach((link) => doc.head.append(link.cloneNode()));
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

  // plugin/rtl.js
  var rtl_default = () => ({
    id: "rtl",
    init(deck) {
      const config = deck.getConfig();
      const options = { digits: true, ...config.rtlOptions };
      config.rtl = true;
      if (options.digits && config.slideNumber && typeof config.slideNumber !== "function") {
        config.slideNumber = (slide) => [
          toPersianDigits(`${deck.getSlidePastCount(slide) + 1} / ${deck.getTotalSlides()}`)
        ];
      }
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
