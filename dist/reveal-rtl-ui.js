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
  var PERSIAN_DIGITS = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";
  function toPersianDigits(value) {
    return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[d]);
  }
  function normalizeForSearch(text) {
    return String(text).replace(/ي|ى/g, "\u06CC").replace(/ك/g, "\u06A9").replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632).replace(/‌/g, " ").toLowerCase();
  }
  function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor(totalSeconds % 3600 / 60);
    const s = String(totalSeconds % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
  }

  // plugin/ui.js
  var THEME_STORAGE_KEY = "reveal-rtl-ui:theme";
  var KEY_M = 77;
  var svg = (path) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="${path}"/></svg>`;
  var ICONS = {
    menu: svg("M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"),
    first: svg("M6 6h2v12H6zm3.5 6 8.5 6V6z"),
    last: svg("M16 6h2v12h-2zM6 18l8.5-6L6 6z"),
    play: svg("M8 5v14l11-7z"),
    pause: svg("M6 5h4v14H6zm8 0h4v14h-4z"),
    reset: svg("M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"),
    notes: svg("M4 4h16v12H8l-4 4zm3 4v2h10V8zm0 3v2h7v-2z"),
    fullscreen: svg("M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z")
  };
  var ui_default = () => ({
    id: "rtl-ui",
    init(deck) {
      if (deck.isSpeakerNotes()) return;
      const config = deck.getConfig();
      const options = {
        digits: !!config.rtl,
        themes: [],
        themeLink: "#theme",
        idle: 3e3,
        ...config.uiOptions
      };
      const digits = (text) => options.digits ? toPersianDigits(text) : String(text);
      const root = deck.getRevealElement();
      const themeLink = document.querySelector(options.themeLink);
      applyStoredTheme(themeLink, options.themes);
      const panel = createPanel();
      const toolbar = createToolbar();
      root.append(panel.element, toolbar.element);
      deck.addKeyBinding({ keyCode: KEY_M, key: "M", description: "\u0641\u0647\u0631\u0633\u062A \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627" }, () => panel.toggle());
      deck.on("ready", () => {
        panel.build();
        panel.markCurrent();
      });
      deck.on("slidechanged", () => panel.markCurrent());
      function createPanel() {
        const element = el("nav", "rtlui-panel");
        element.setAttribute("aria-label", "\u0641\u0647\u0631\u0633\u062A \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627");
        element.hidden = true;
        const search = el("input", "rtlui-search");
        search.type = "search";
        search.placeholder = "\u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627\u2026";
        search.setAttribute("aria-label", "\u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627");
        const list = el("ol", "rtlui-list");
        const empty = el("p", "rtlui-empty", "\u0646\u062A\u06CC\u062C\u0647\u200C\u0627\u06CC \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
        empty.hidden = true;
        element.append(search, list, empty);
        let items = [];
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
          list.replaceChildren();
          items = deck.getSlides().map((slide, i) => {
            const { h, v } = deck.getIndices(slide);
            const title = slide.dataset.menuTitle || slide.querySelector("h1, h2, h3")?.textContent.trim() || `\u0627\u0633\u0644\u0627\u06CC\u062F ${i + 1}`;
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
            list.append(li);
            return { slide, li, button: button2, text: normalizeForSearch(`${title} ${slide.textContent}`) };
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
        element.setAttribute("aria-label", "\u0627\u0628\u0632\u0627\u0631\u0647\u0627\u06CC \u0627\u0631\u0627\u0626\u0647");
        const menuButton = button(ICONS.menu, "\u0641\u0647\u0631\u0633\u062A \u0627\u0633\u0644\u0627\u06CC\u062F\u0647\u0627 (M)", () => panel.toggle());
        menuButton.setAttribute("aria-expanded", "false");
        const firstButton = button(ICONS.first, "\u0627\u0648\u0644\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F", () => deck.slide(0));
        const lastButton = button(ICONS.last, "\u0622\u062E\u0631\u06CC\u0646 \u0627\u0633\u0644\u0627\u06CC\u062F", () => deck.slide(Number.MAX_VALUE));
        firstButton.classList.add("rtlui-mirror");
        lastButton.classList.add("rtlui-mirror");
        let elapsed = 0;
        let running = false;
        const timerValue = el("span", "rtlui-timer", digits(formatDuration(0)));
        timerValue.setAttribute("role", "timer");
        timerValue.setAttribute("aria-label", "\u0632\u0645\u0627\u0646 \u0633\u067E\u0631\u06CC\u200C\u0634\u062F\u0647");
        const playButton = button(ICONS.play, "\u0634\u0631\u0648\u0639 \u062A\u0627\u06CC\u0645\u0631", () => {
          running = !running;
          playButton.innerHTML = running ? ICONS.pause : ICONS.play;
          playButton.setAttribute("aria-label", running ? "\u062A\u0648\u0642\u0641 \u062A\u0627\u06CC\u0645\u0631" : "\u0634\u0631\u0648\u0639 \u062A\u0627\u06CC\u0645\u0631");
          playButton.title = playButton.getAttribute("aria-label");
        });
        const resetButton = button(ICONS.reset, "\u0635\u0641\u0631 \u06A9\u0631\u062F\u0646 \u062A\u0627\u06CC\u0645\u0631", () => {
          elapsed = 0;
          timerValue.textContent = digits(formatDuration(0));
        });
        const clock = el("time", "rtlui-clock");
        const clockFormat = new Intl.DateTimeFormat(options.digits ? "fa-IR" : void 0, { hour: "2-digit", minute: "2-digit" });
        const tick = () => {
          clock.textContent = clockFormat.format(/* @__PURE__ */ new Date());
          if (running) timerValue.textContent = digits(formatDuration(++elapsed));
        };
        tick();
        setInterval(tick, 1e3);
        const groups = [
          group(menuButton),
          group(firstButton, lastButton),
          group(playButton, timerValue, resetButton),
          group(clock)
        ];
        if (options.themes.length && themeLink) groups.push(group(themeSelect()));
        const notesButton = button(ICONS.notes, "\u0646\u0645\u0627\u06CC\u0634 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627", () => {
          const show = !deck.getConfig().showNotes;
          deck.configure({ showNotes: show });
          notesButton.setAttribute("aria-pressed", String(show));
        });
        notesButton.setAttribute("aria-pressed", String(!!config.showNotes));
        const fullscreenButton = button(ICONS.fullscreen, "\u062A\u0645\u0627\u0645\u200C\u0635\u0641\u062D\u0647", () => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
        });
        groups.push(group(notesButton, fullscreenButton));
        element.append(...groups);
        element.addEventListener("keydown", (event) => event.stopPropagation());
        setupIdleHide(element);
        return {
          element,
          setMenuOpen: (open) => menuButton.setAttribute("aria-expanded", String(open))
        };
      }
      function themeSelect() {
        const select = el("select", "rtlui-theme");
        select.setAttribute("aria-label", "\u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0645");
        select.title = "\u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0645";
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
    node.title = label;
    node.setAttribute("aria-label", label);
    node.addEventListener("click", onClick);
    return node;
  }
  function group(...children) {
    const node = el("div", "rtlui-group");
    node.append(...children);
    return node;
  }
  return __toCommonJS(ui_exports);
})();
RevealRTLUI=RevealRTLUI.default;
