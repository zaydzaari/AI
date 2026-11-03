(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  if (!motion.matches) document.documentElement.classList.add("motion-ready");
  const reveals = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-in"); reveals.unobserve(entry.target); }
  }), { rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach((node) => { if (motion.matches) node.classList.add("is-in"); else reveals.observe(node); });

  // The menu is a real keyboard-accessible disclosure, including focus return.
  const menu = $("#mobile-menu"), menuButton = $(".menu-button");
  function setMenu(open, returnFocus = false) {
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) menu.querySelector("a").focus();
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => {
    if (menu.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); setMenu(false, true); }
    if (e.key === "Tab") {
      const links = [...menu.querySelectorAll("a")];
      if (!e.shiftKey && document.activeElement === links.at(-1)) { e.preventDefault(); menuButton.focus(); }
      else if (e.shiftKey && document.activeElement === menuButton) { e.preventDefault(); links.at(-1).focus(); }
    }
  });
  matchMedia("(min-width: 761px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // Time-based, damped image spring. It sleeps when settled or out of view.
  const physical = $("[data-physical]"), picture = physical.querySelector("img");
  let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, frame = 0, last = 0, visible = true;
  function resetSpring() {
    cancelAnimationFrame(frame); frame = 0;
    x = y = vx = vy = tx = ty = 0;
    picture.style.removeProperty("--px"); picture.style.removeProperty("--py");
  }
  function tick(now) {
    if (!visible || motion.matches || document.hidden) return resetSpring();
    const dt = Math.min((now - last) / 1000 || 1 / 60, .032); last = now;
    const drag = Math.exp(-22 * dt);
    vx = (vx + (tx - x) * 240 * dt) * drag;
    vy = (vy + (ty - y) * 240 * dt) * drag;
    x += vx * dt; y += vy * dt;
    picture.style.setProperty("--px", x.toFixed(3) + "px");
    picture.style.setProperty("--py", y.toFixed(3) + "px");
    frame = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > .04 ? requestAnimationFrame(tick) : 0;
  }
  function wake() { if (!frame && visible && !motion.matches) { last = performance.now(); frame = requestAnimationFrame(tick); } }
  physical.addEventListener("pointermove", (e) => {
    if (!fine.matches || motion.matches) return;
    const r = physical.getBoundingClientRect();
    tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1) * 8;
    ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1) * 5;
    wake();
  }, { passive: true });
  physical.addEventListener("pointerleave", () => { tx = ty = 0; wake(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible) resetSpring(); }).observe(physical);
  document.addEventListener("visibilitychange", () => { if (document.hidden) resetSpring(); });
  motion.addEventListener("change", (e) => { document.documentElement.classList.toggle("motion-ready", !e.matches); if (e.matches) { resetSpring(); $$("[data-reveal]").forEach((node) => node.classList.add("is-in")); } });

  // Models, code samples, receipts and estimates all share one selection.
  const ids = { core: "core-128k", unbound: "unbound-128k", forge: "forge-256k", atlas: "atlas-1m", swift: "swift-32k" };
  const suffix = { Standard: "", "Low-refusal": ":low-refusal", Abliterated: ":abliterated" };
  let model = AE.MODELS[0], mode = "Standard", language = 0, samples = [];
  const money = (n) => "$" + n.toFixed(6);
  function estimate() {
    const input = +$("#input-tokens").value, output = +$("#output-tokens").value;
    const cached = $("#cache-toggle").checked ? input * .5 : 0;
    const full = (input * model.inPrice + output * model.outPrice) / 1e6;
    const total = ((input - cached) * model.inPrice + cached * model.cached + output * model.outPrice) / 1e6;
    $("#input-value").textContent = input.toLocaleString("en-US");
    $("#output-value").textContent = output.toLocaleString("en-US");
    $("#estimate-model").textContent = model.name;
    $("#estimate-cost").textContent = money(total);
    $("#cache-saving").textContent = cached ? "Caching saves " + money(full - total) + " on this request." : "Turn on caching to compare.";
    $("#context-note").textContent = input + output > model.contextK * 1000 ? "This request exceeds " + model.name + "’s sample " + model.context + " context window. Reduce the token counts." : "";
  }
  function renderSelection() {
    if (!model.variants.includes(mode)) mode = model.variants[0];
    const name = ids[model.id] + (model.id === "unbound" ? "" : suffix[mode]);
    $$("[data-model]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.model === model.id)));
    $$("[data-temp]").forEach((b) => { b.disabled = !model.variants.includes(b.dataset.temp); b.setAttribute("aria-pressed", String(b.dataset.temp === mode)); });
    $("#pick-out").textContent = name;
    const messages = [{ role: "user", content: "Explain prompt caching in one sentence." }];
    const payload = JSON.stringify({ model: name, messages }, null, 2);
    samples = [
      `curl ${AE.BRAND.apiBase}/chat/completions \\\n  -H "Authorization: Bearer $${AE.BRAND.envKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '${payload}'`,
      `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${AE.BRAND.apiBase}",\n  apiKey: process.env.${AE.BRAND.envKey},\n});\n\nconst response = await client.chat.completions.create({\n  model: "${name}",\n  messages: [{ role: "user", content: "Hello" }],\n});\n\nconsole.log(response.choices[0].message.content);`,
      `import os\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url="${AE.BRAND.apiBase}",\n    api_key=os.environ["${AE.BRAND.envKey}"],\n)\n\nresponse = client.chat.completions.create(\n    model="${name}",\n    messages=[{"role": "user", "content": "Hello"}],\n)\n\nprint(response.choices[0].message.content)`,
    ];
    $$(".code-panel code").forEach((code, i) => { code.textContent = samples[i]; });
    $("#receipt-cost").textContent = money(((1820 - 1536) * model.inPrice + 1536 * model.cached + 412 * model.outPrice) / 1e6);
    estimate();
  }
  function choose(id) { model = AE.MODELS.find((m) => m.id === id) || model; renderSelection(); }
  $$("[data-model]").forEach((b) => b.addEventListener("click", () => choose(b.dataset.model)));
  $$("[data-temp]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.temp; renderSelection(); }));
  $$("[data-choose]").forEach((b) => b.addEventListener("click", () => {
    choose(b.dataset.choose); $("#developers").scrollIntoView({ behavior: motion.matches ? "instant" : "smooth" });
    $("[data-model='" + model.id + "']").focus({ preventScroll: true });
  }));
  ["input-tokens", "output-tokens", "cache-toggle"].forEach((id) => $("#" + id).addEventListener("input", estimate));
  renderSelection();
  const tabs = $$('[role="tab"]'), panels = $$('[role="tabpanel"]');
  function selectTab(index, focus = false) {
    language = index;
    tabs.forEach((b, i) => { b.setAttribute("aria-selected", String(i === index)); b.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index; });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(i));
    tab.addEventListener("keydown", (e) => {
      const next = e.key === "ArrowRight" ? (i + 1) % 3 : e.key === "ArrowLeft" ? (i + 2) % 3 : e.key === "Home" ? 0 : e.key === "End" ? 2 : -1;
      if (next !== -1) { e.preventDefault(); selectTab(next, true); }
    });
  });
  let copyTimer;
  $("#copy-code").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(samples[language]);
      $("#copy-status").textContent = "Copied to clipboard.";
      clearTimeout(copyTimer); copyTimer = setTimeout(() => { $("#copy-status").textContent = ""; }, 2500);
    } catch {
      const range = document.createRange(); range.selectNodeContents(panels[language]);
      const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $("#copy-status").textContent = "Code selected. Use your keyboard’s copy command.";
    }
  });
  const categories = { all: AE.MODELS.map((m) => m.id), general: ["core", "unbound"], coding: ["forge"], context: ["atlas"], fast: ["swift"] };
  $$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-filter]").forEach((other) => other.setAttribute("aria-pressed", String(other === b)));
    $$("[data-model-row]").forEach((row) => { row.hidden = !categories[b.dataset.filter].includes(row.dataset.modelRow); });
  }));

  // Concrete forms rise with natural scrolling; the slider only changes cost shadows.
  const svg = $("#build-iso"), ns = "http://www.w3.org/2000/svg";
  const el = (tag, attrs) => { const node = document.createElementNS(ns, tag); Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v)); svg.appendChild(node); return node; };
  const project = (x, y, z = 0) => [(x - y) * .866 + 110, (x + y) * .42 + 235 - z];
  const polygon = (pts) => pts.map((p) => project(...p).map((v) => v.toFixed(2)).join(",")).join(" ");
  const blocks = AE.MODELS.map((m, i) => {
    const x = 35 + i * 105, y = -i * 16, w = 40, d = 40;
    const height = 30 + Math.log(m.contextK / 32) / Math.log(1000 / 32) * 155;
    const shadow = el("polygon", { fill: "#1B2923", opacity: ".12" });
    const faces = ["#B8C0B3", "#A4AE9F", "#DADED3"].map((fill) => el("polygon", { fill, stroke: "#63745F", "stroke-width": ".65", "vector-effect": "non-scaling-stroke" }));
    const pos = project(x + 22, y + 40);
    const label = el("text", { x: pos[0] + 3, y: pos[1] + 27, fill: "#314536", "font-family": "Manrope", "font-size": "13", "text-anchor": "middle" });
    label.textContent = m.name;
    return { m, x, y, w, d, height, shadow, faces };
  });
  let elevation = motion.matches ? 1 : .15;
  function drawStructure() {
    const v = +$("#sun").value, tokens = Math.round(1000 + 31000 * v);
    const costs = AE.MODELS.map((m) => tokens * (.75 * m.inPrice + .25 * m.outPrice) / 1e6), max = Math.max(...costs);
    blocks.forEach((b, i) => {
      const { x, y, w, d } = b, h = b.height * (.12 + .88 * elevation);
      const top = [[x,y,h],[x+w,y,h],[x+w,y+d,h],[x,y+d,h]];
      b.faces[0].setAttribute("points", polygon([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,h],[x+w,y,h]]));
      b.faces[1].setAttribute("points", polygon([[x,y+d,0],[x+w,y+d,0],[x+w,y+d,h],[x,y+d,h]]));
      b.faces[2].setAttribute("points", polygon(top));
      const len = 15 + costs[i] / max * (35 + 55 * v);
      b.shadow.setAttribute("points", polygon([[x,y,0],[x+w,y,0],[x+w+len,y+d+len*.2,0],[x+len,y+d+len*.2,0]]));
    });
    $("#r-time").textContent = Math.round(tokens / 1000) + "K tokens";
    $("#r-el").textContent = AE.MODELS[costs.indexOf(Math.min(...costs))].name;
    $("#r-sh").textContent = money(costs[3]);
  }
  $("#sun").addEventListener("input", drawStructure);
  const sections = $$(".body-sections>.section"), spy = $$(".chapter-nav nav a");
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const r = $("#build").getBoundingClientRect();
    const p = motion.matches || innerWidth <= 760 ? 1 : clamp((innerHeight * .85 - r.top) / (innerHeight * .65));
    elevation = p * p * (3 - 2 * p); drawStructure();
    const current = [...sections].reverse().find((s) => s.getBoundingClientRect().top <= innerHeight * .4) || sections[0];
    spy.forEach((a) => { if (a.hash === "#" + current.id) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
  }
  const queueScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
  addEventListener("scroll", queueScroll, { passive: true }); addEventListener("resize", queueScroll);
  motion.addEventListener("change", queueScroll); updateScroll();
})();
