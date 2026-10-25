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
  function getSlideTitle(slide, index) {
    const explicit = slide.getAttribute("data-menu-title");
    if (explicit) return explicit;
    const heading = findFirst(slide, (node) => /^H[1-3]$/.test(node.nodeName));
    return heading ? collapse(textOf(heading)) : `\u0627\u0633\u0644\u0627\u06CC\u062F ${index + 1}`;
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
  function slidesToJSON(slides, title) {
    return JSON.stringify({
      title,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      slideCount: slides.length,
      slides: slides.map(({ element, h, v }, i) => ({
        number: i + 1,
        indices: { h, v },
        title: getSlideTitle(element, i),
        text: collapse(textOf(element)),
        notes: getSlideNotes(element),
        markdown: htmlToMarkdown(element)
      }))
    }, null, 2);
  }
  function slidesToNotesText(slides, title) {
    const parts = slides.map(({ element }, i) => {
      const notes = getSlideNotes(element);
      return `${i + 1}. ${getSlideTitle(element, i)}
${notes || "\u2014"}`;
    });
    return `\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0633\u062E\u0646\u0631\u0627\u0646: ${title}

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
  var KEY_M = 77;
  var KEY_T = 84;
  var ZOOM_STEP = 0.1;
  var ZOOM_MIN = 0.5;
  var ZOOM_MAX = 3;
  var PRINT_PARAM = "rtlui-print";
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
        digits: !!config.rtl,
        themes: [],
        themeLink: "#theme",
        idle: 3e3,
        ...config.uiOptions
      };
      const digits = (text) => options.digits ? toPersianDigits(text) : String(text);
      const root = deck.getRevealElement();
      const themeLink = document.querySelector(options.themeLink);
      const pageSnapshot = document.documentElement.cloneNode(true);
      if (deck.isPrintView()) {
        if (new URLSearchParams(location.search).has(PRINT_PARAM)) {
          deck.on("pdf-ready", () => document.fonts.ready.then(() => setTimeout(() => window.print(), 500)));
        }
        return;
      }
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
        const list2 = el("ol", "rtlui-list");
        const empty = el("p", "rtlui-empty", "\u0646\u062A\u06CC\u062C\u0647\u200C\u0627\u06CC \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
        empty.hidden = true;
        element.append(search, list2, empty);
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
          list2.replaceChildren();
          items = deck.getSlides().map((slide, i) => {
            const { h, v } = deck.getIndices(slide);
            const title = getSlideTitle(slide, i);
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
        const gridButton = button(ICONS.grid, "\u0646\u0645\u0627\u06CC \u0634\u0628\u06A9\u0647\u200C\u0627\u06CC (Esc)", () => deck.toggleOverview());
        const syncGrid = () => gridButton.setAttribute("aria-pressed", String(deck.isOverview()));
        syncGrid();
        deck.on("overviewshown", syncGrid);
        deck.on("overviewhidden", syncGrid);
        const timer = readTimer();
        const isRunning = () => timer.startedAt !== null;
        const elapsedSeconds = () => timer.base + (isRunning() ? (Date.now() - timer.startedAt) / 1e3 : 0);
        const timerValue = el("span", "rtlui-timer");
        timerValue.setAttribute("role", "timer");
        timerValue.setAttribute("aria-label", "\u0632\u0645\u0627\u0646 \u0633\u067E\u0631\u06CC\u200C\u0634\u062F\u0647");
        const renderTimer = () => {
          timerValue.textContent = digits(formatDuration(Math.floor(elapsedSeconds())));
        };
        const playButton = button(ICONS.play, "\u0634\u0631\u0648\u0639 \u062A\u0627\u06CC\u0645\u0631", () => {
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
          setLabel(playButton, isRunning() ? "\u062A\u0648\u0642\u0641 \u062A\u0627\u06CC\u0645\u0631" : "\u0634\u0631\u0648\u0639 \u062A\u0627\u06CC\u0645\u0631");
        };
        renderPlayButton();
        const resetButton = button(ICONS.reset, "\u0635\u0641\u0631 \u06A9\u0631\u062F\u0646 \u062A\u0627\u06CC\u0645\u0631", () => {
          timer.base = 0;
          if (isRunning()) timer.startedAt = Date.now();
          saveTimer(timer);
          renderTimer();
        });
        const clock = el("time", "rtlui-clock");
        const clockFormat = new Intl.DateTimeFormat(options.digits ? "fa-IR" : void 0, { hour: "2-digit", minute: "2-digit" });
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
        setLabel(zoomReset, "\u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC \u0628\u0632\u0631\u06AF\u200C\u0646\u0645\u0627\u06CC\u06CC");
        const setZoom = (value) => {
          zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 10) / 10));
          root.style.setProperty("--rtlui-zoom", zoom);
          zoomReset.textContent = digits(`${Math.round(zoom * 100)}%`);
        };
        zoomReset.addEventListener("click", () => setZoom(1));
        setZoom(1);
        groups.push(wideOnly(group(
          button(ICONS.zoomIn, "\u0628\u0632\u0631\u06AF\u200C\u0646\u0645\u0627\u06CC\u06CC", () => setZoom(zoom + ZOOM_STEP)),
          zoomReset,
          button(ICONS.zoomOut, "\u06A9\u0648\u0686\u06A9\u200C\u0646\u0645\u0627\u06CC\u06CC", () => setZoom(zoom - ZOOM_STEP))
        )));
        if (options.themes.length && themeLink) groups.push(wideOnly(group(themeSelect())));
        groups.push(group(exportMenu()));
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
        const noteControls = [notesButton];
        if (deck.hasPlugin("notes")) {
          noteControls.push(wideOnly(button(ICONS.speaker, "\u067E\u0646\u062C\u0631\u0647\u200C\u06CC \u0633\u062E\u0646\u0631\u0627\u0646 (S)", () => deck.getPlugin("notes").open())));
        }
        groups.push(group(...noteControls, wideOnly(fullscreenButton)));
        const hideButton = button(ICONS.hide, "\u067E\u0646\u0647\u0627\u0646 \u06A9\u0631\u062F\u0646 \u0646\u0648\u0627\u0631 \u0627\u0628\u0632\u0627\u0631 (T)", () => setHidden(true));
        groups.push(group(hideButton));
        element.append(...groups);
        const showButton = button(ICONS.show, "\u0646\u0645\u0627\u06CC\u0634 \u0646\u0648\u0627\u0631 \u0627\u0628\u0632\u0627\u0631 (T)", () => setHidden(false));
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
        deck.addKeyBinding({ keyCode: KEY_T, key: "T", description: "\u067E\u0646\u0647\u0627\u0646/\u0646\u0645\u0627\u06CC\u0634 \u0646\u0648\u0627\u0631 \u0627\u0628\u0632\u0627\u0631" }, () => setHidden(!root.classList.contains("rtlui-hidden")));
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
        const trigger = button(ICONS.export, "\u062E\u0631\u0648\u062C\u06CC \u06AF\u0631\u0641\u062A\u0646", () => setOpen(menu.hidden));
        trigger.setAttribute("aria-haspopup", "menu");
        trigger.setAttribute("aria-expanded", "false");
        const menu = el("div", "rtlui-menu");
        menu.setAttribute("role", "menu");
        menu.setAttribute("aria-label", "\u062E\u0631\u0648\u062C\u06CC \u06AF\u0631\u0641\u062A\u0646");
        menu.hidden = true;
        const title = document.title || "presentation";
        const fileName = (ext) => `${safeFileName(title)}.${ext}`;
        const slides = () => deck.getSlides().map((element) => ({ element, ...deck.getIndices(element) }));
        const items = [
          ["PDF (\u0686\u0627\u067E)", exportPDF],
          ["JSON", () => download(fileName("json"), slidesToJSON(slides(), title), "application/json")],
          ["\u0645\u062A\u0646 Markdown", () => download(fileName("md"), slidesToMarkdown(slides()), "text/markdown")],
          ["HTML", () => download(fileName("html"), standaloneHTML(pageSnapshot.cloneNode(true), document.baseURI), "text/html")],
          ["\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0633\u062E\u0646\u0631\u0627\u0646", () => download(`${safeFileName(title)}-notes.txt`, slidesToNotesText(slides(), title), "text/plain")]
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
      function exportPDF() {
        const url = new URL(location.href);
        url.searchParams.set("print-pdf", "");
        url.searchParams.set(PRINT_PARAM, "");
        url.hash = "";
        if (!window.open(url.href, "_blank")) location.href = url.href;
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
  var timerStorageKey = () => `${TIMER_STORAGE_KEY}:${location.pathname}`;
  function readTimer() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(timerStorageKey()));
      const validStart = stored?.startedAt === null || Number.isFinite(stored?.startedAt) && stored.startedAt <= Date.now();
      if (Number.isFinite(stored?.base) && stored.base >= 0 && validStart) return stored;
    } catch (e) {
    }
    return { base: 0, startedAt: null };
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
