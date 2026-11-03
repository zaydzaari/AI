/*
 * Aether Tweaks: a live design panel plus the "weighted" hero motion, shared by the
 * 20-site collection (inlined by awwwards-20-collection/_build/lib.mjs) and the Next.js
 * lab (imported by components/lab/Tweaks.tsx).
 *
 *   AetherTweaks.init({ root, fonts, key, defaults })
 *     root      element that owns the design tokens (documentElement, or the lab's .kit root)
 *     fonts     [{ name, url, weight, style }] extra faces the font menus can load on demand
 *     key       localStorage key for this page's tweaks
 *
 * It does three things, following the iterate-don't-one-shot workflow:
 *   1. Hero load-in: the hero's parts arrive one by one with a heavy ease (pure CSS in tweaks.css).
 *   2. Hero exit: as the hero scrolls away its copy fades and lifts (--hx), so the move into
 *      the body is gradual instead of a hard cut.
 *   3. Tweaks: a panel that rewrites the design tokens live (type, colour, motion, texture),
 *      remembers them per page and copies them as JSON to paste back into a prompt.
 * Reduced motion disables 1 and 2. Every storage access is wrapped: the page works without it.
 */
(function () {
  if (typeof window === "undefined" || window.AetherTweaks) return;

  var EASES = {
    Heavy: "cubic-bezier(0.16, 1, 0.3, 1)",
    Expo: "cubic-bezier(0.19, 1, 0.22, 1)",
    Soft: "cubic-bezier(0.33, 1, 0.68, 1)",
    Snappy: "cubic-bezier(0.5, 0, 0.1, 1)",
  };

  // Control schema. type: range | color | select | toggle. css: the custom property it drives.
  var GROUPS = [
    ["Type", [
      { id: "fontDisplay", label: "Heading font", type: "select", css: "--font-display", font: true },
      { id: "fontBody", label: "Body font", type: "select", css: "--font-body", font: true },
      { id: "h1", label: "Headline size", type: "range", css: "--tw-h1", min: 0.7, max: 1.3, step: 0.01, def: 1, fmt: "x" },
      { id: "h1ls", label: "Headline tracking", type: "range", css: "--tw-h1ls", min: -0.06, max: 0.04, step: 0.005, def: -0.04, unit: "em" },
      { id: "h1w", label: "Headline weight", type: "range", css: "--h1-weight", min: 200, max: 900, step: 50, def: null },
      { id: "body", label: "Body size", type: "range", css: "--tw-body", min: 0.85, max: 1.25, step: 0.01, def: 1, fmt: "x" },
    ]],
    ["Colour", [
      { id: "accent", label: "Accent (10)", type: "color", css: "--accent" },
      { id: "bg", label: "Background (60)", type: "color", css: "--bg-primary" },
      { id: "bg2", label: "Surface (30)", type: "color", css: "--bg-secondary" },
      { id: "text", label: "Text", type: "color", css: "--text-primary" },
      { id: "muted", label: "Muted text", type: "color", css: "--text-muted" },
    ]],
    ["Motion", [
      { id: "load", label: "Hero load-in", type: "toggle", def: false },
      { id: "ldur", label: "Load duration", type: "range", css: "--tw-load-dur", min: 0.3, max: 2.4, step: 0.05, def: 1, unit: "s" },
      { id: "lstg", label: "Load stagger", type: "range", css: "--tw-load-stg", min: 0, max: 400, step: 10, def: 110, unit: "ms" },
      { id: "ldist", label: "Load distance", type: "range", css: "--tw-load-dist", min: 0, max: 120, step: 2, def: 28, unit: "px" },
      { id: "lblur", label: "Load blur", type: "range", css: "--tw-load-blur", min: 0, max: 20, step: 1, def: 6, unit: "px" },
      { id: "ease", label: "Weight", type: "select", css: "--tw-ease", options: Object.keys(EASES), def: "Heavy" },
      { id: "rdist", label: "Reveal distance", type: "range", css: "--tw-rd", min: 0, max: 100, step: 2, def: 14, unit: "px" },
      { id: "rdur", label: "Reveal duration", type: "range", css: "--tw-dur", min: 0.3, max: 2.5, step: 0.05, def: 1, fmt: "x" },
      { id: "rstg", label: "Reveal stagger", type: "range", css: "--tw-stg", min: 0, max: 240, step: 10, def: 80, unit: "ms" },
      { id: "exit", label: "Hero exit fade", type: "range", min: 0, max: 1, step: 0.05, def: 0 },
    ]],
  ];

  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  };

  function toHex(c) {
    var m = /rgba?\(([^)]+)\)/.exec(c || "");
    if (!m) return /^#[0-9a-f]{6}/i.test(c || "") ? c.slice(0, 7) : "#888888";
    return "#" + m[1].split(/[ ,/]+/).slice(0, 3).map(function (v) { return ("0" + Math.round(+v).toString(16)).slice(-2); }).join("");
  }

  function heroMotion(scope, getExit) {
    var hero = scope.querySelector("[data-hero]");
    var noop = { replay: function () {}, stop: function () {} };
    if (!hero) return noop;
    var parts = [].slice.call(hero.querySelectorAll("[data-hero-part]"));
    var q = false, on = false;
    // Exit: inline opacity/translate only while the hero is leaving, so at rest the
    // page's own styles (and stacking) are untouched.
    var exit = function () {
      q = false;
      var r = hero.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.85))) * getExit();
      // Off screen (or back at rest) the hero keeps its own styles: the fade is a transition, not a state.
      if (p <= 0.001 || r.bottom <= 0) {
        if (on) { parts.forEach(function (el) { el.style.removeProperty("opacity"); el.style.removeProperty("translate"); }); on = false; }
        return;
      }
      on = true;
      parts.forEach(function (el) {
        var vis = el.getAttribute("data-hero-part") === "visual";
        el.style.opacity = String(1 - p * (vis ? 0.5 : 1));
        if (!vis) el.style.translate = "0 " + (-48 * p).toFixed(1) + "px";
      });
    };
    var onScrollFn = function () { if (!q) { q = true; requestAnimationFrame(exit); } };
    if (!RM) { addEventListener("scroll", onScrollFn, { passive: true }); exit(); }
    return {
      // Switching between two identical keyframe names restarts the CSS entrance.
      replay: function () { hero.classList.toggle("tw-again"); },
      stop: function () { removeEventListener("scroll", onScrollFn); },
    };
  }

  function init(opts) {
    opts = opts || {};
    var root = opts.root || document.documentElement;
    var scope = opts.scope || document;
    var key = opts.key || "aether-tweaks:" + location.pathname;
    var fonts = opts.fonts || [];
    var state;
    var motion = heroMotion(scope, function () { return state ? +state.exit : 0.85; });
    var hero = scope.querySelector("[data-hero]");

    // Defaults come from the page's own tokens, so Reset returns to the design as built.
    var cs = getComputedStyle(root);
    var base = {};
    GROUPS.forEach(function (g) { g[1].forEach(function (c) {
      if (c.type === "color") base[c.id] = toHex(cs.getPropertyValue(c.css).trim());
      else if (c.font) base[c.id] = cs.getPropertyValue(c.css).trim();
      else if (c.id === "h1w") base[c.id] = parseFloat(cs.getPropertyValue("--h1-weight")) || 500;
      else base[c.id] = c.def;
    }); });
    state = Object.assign({}, base, store.get(key) || {});
    var loaded = {};

    function loadFont(name) {
      var f = fonts.filter(function (x) { return x.name === name; })[0];
      if (!f || loaded[name] || !window.FontFace) return Promise.resolve();
      loaded[name] = true;
      var face = new FontFace(f.name, "url(" + f.url + ")", { weight: f.weight || "100 900", style: f.style || "normal" });
      return face.load().then(function (ff) { document.fonts.add(ff); }).catch(function () {});
    }

    function apply() {
      GROUPS.forEach(function (g) { g[1].forEach(function (c) {
        var v = state[c.id];
        if (!c.css) return;
        var changed = v !== base[c.id];
        if (!changed) { root.style.removeProperty(c.css); return; }
        if (c.font) { var fam = /["',]/.test(v) ? v : '"' + v + '", ' + base[c.id]; root.style.setProperty(c.css, fam); loadFont(String(v).replace(/["']/g, "").split(",")[0].trim()); return; }
        if (c.id === "ease") { root.style.setProperty(c.css, EASES[v] || v); return; }
        root.style.setProperty(c.css, c.unit ? v + c.unit : String(v));
      }); });
      if (hero) hero.classList.toggle("tw-noload", state.load === false);
      store.set(key, diff());
    }
    function diff() {
      var d = {};
      Object.keys(state).forEach(function (k) { if (state[k] !== base[k]) d[k] = state[k]; });
      return d;
    }

    // —— panel UI ——
    var wrap = document.createElement("div");
    wrap.setAttribute("data-tweaks", "");
    wrap.className = "tw-wrap";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tw-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "tw-panel");
    btn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h8M13 4h1M2 12h3M8 12h6" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="11.5" cy="4" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="12" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>Tweaks</span>';
    var panel = document.createElement("div");
    panel.className = "tw-panel";
    panel.id = "tw-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Design tweaks");
    panel.hidden = true;

    var fontNames = fonts.map(function (f) { return f.name; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
    var html = '<div class="tw-head"><b>Tweaks</b><span>Changes apply live and stay on this page.</span></div>';
    GROUPS.forEach(function (g) {
      html += '<fieldset class="tw-group"><legend>' + g[0] + "</legend>";
      g[1].forEach(function (c) {
        var id = "tw-" + c.id, v = state[c.id];
        html += '<div class="tw-row"><label for="' + id + '">' + c.label + "</label>";
        if (c.type === "range") html += '<input id="' + id + '" data-k="' + c.id + '" type="range" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" value="' + v + '"><output for="' + id + '"></output>';
        else if (c.type === "color") html += '<input id="' + id + '" data-k="' + c.id + '" type="color" value="' + v + '"><output for="' + id + '"></output>';
        else if (c.type === "toggle") html += '<input id="' + id + '" data-k="' + c.id + '" type="checkbox"' + (v !== false ? " checked" : "") + "><output></output>";
        else {
          var opts2 = c.font ? ["Site default"].concat(fontNames) : c.options;
          html += '<select id="' + id + '" data-k="' + c.id + '">' + opts2.map(function (o) {
            var val = o === "Site default" ? base[c.id] : o;
            return '<option value="' + String(val).replace(/"/g, "&quot;") + '"' + (val === v ? " selected" : "") + ">" + o + "</option>";
          }).join("") + "</select><output></output>";
        }
        html += "</div>";
      });
      html += "</fieldset>";
    });
    html += '<div class="tw-actions"><button type="button" data-act="replay">Replay load-in</button><button type="button" data-act="copy">Copy settings</button><button type="button" data-act="reset">Reset</button></div><p class="tw-note" aria-live="polite"></p>';
    panel.innerHTML = html;
    wrap.appendChild(panel);
    wrap.appendChild(btn);
    // The panel lives on <body>, outside a scoped token root, so it takes the page's font explicitly.
    wrap.style.fontFamily = cs.getPropertyValue("--font-body").trim() || getComputedStyle(document.body).fontFamily;
    document.body.appendChild(wrap);

    var note = panel.querySelector(".tw-note");
    function show(c, input) {
      var out = input.parentElement.querySelector("output");
      if (!out) return;
      var v = state[c.id];
      out.textContent = c.type === "range" ? (c.fmt === "x" ? (+v).toFixed(2) + "×" : (+v).toFixed(c.step < 0.01 ? 3 : c.step < 1 ? 2 : 0) + (c.unit || "")) : c.type === "color" ? String(v).toUpperCase() : "";
    }
    var all = {};
    GROUPS.forEach(function (g) { g[1].forEach(function (c) { all[c.id] = c; }); });
    panel.querySelectorAll("[data-k]").forEach(function (input) {
      var c = all[input.getAttribute("data-k")];
      show(c, input);
      input.addEventListener("input", function () {
        state[c.id] = c.type === "range" ? +input.value : c.type === "toggle" ? input.checked : input.value;
        show(c, input);
        apply();
      });
    });
    panel.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-act]");
      if (!a) return;
      var act = a.getAttribute("data-act");
      if (act === "replay") { motion.replay(); scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); }
      if (act === "reset") {
        state = Object.assign({}, base); store.del(key); apply();
        panel.querySelectorAll("[data-k]").forEach(function (input) {
          var c = all[input.getAttribute("data-k")], v = state[c.id];
          if (c.type === "toggle") input.checked = v !== false; else input.value = v;
          show(c, input);
        });
        note.textContent = "Back to the design as built.";
      }
      if (act === "copy") {
        var text = JSON.stringify({ page: location.pathname, tweaks: diff() }, null, 2);
        var done = function () { note.textContent = "Copied. Paste it into your next prompt to bake these in."; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { note.textContent = text; });
        else note.textContent = text;
      }
    });
    function toggle(open) {
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { var f = panel.querySelector("input,select"); f && f.focus(); }
    }
    btn.addEventListener("click", function () { toggle(panel.hidden); });
    var onKey = function (e) {
      if (e.key === "Escape" && !panel.hidden) { toggle(false); btn.focus(); }
      if (e.key === "T" && e.shiftKey && !/input|select|textarea/i.test((e.target && e.target.tagName) || "")) toggle(panel.hidden);
    };
    addEventListener("keydown", onKey);
    apply();
    return {
      state: state,
      replay: motion.replay,
      destroy: function () {
        removeEventListener("keydown", onKey);
        motion.stop();
        wrap.remove();
        GROUPS.forEach(function (g) { g[1].forEach(function (c) { if (c.css) root.style.removeProperty(c.css); }); });
      },
    };
  }

  window.AetherTweaks = { init: init, EASES: EASES };
})();
