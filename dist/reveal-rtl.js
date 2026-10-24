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
