"use client";

/**
 * Kit — the scroll-craft runtime shared by the v3 concepts (React port of the
 * awwwards-20-collection runtime). Call `useKit(ref)` once on a concept's root:
 * it wires reveals, staggers, magnetic spring CTAs, spotlight cards, the pinned
 * horizontal rail, scroll-spy and count-ups inside that root, and cleans up on unmount.
 * Helpers (`progress`, `fitCanvas`, `loop`, `onScroll`) power each concept's signature.
 */

import { useEffect, type RefObject } from "react";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
const isRM = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFine = () => typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;
export const reduced = isRM;

export const pointer = { x: 0, y: 0, active: false };
if (typeof window !== "undefined") {
  pointer.x = innerWidth / 2;
  pointer.y = innerHeight / 2;
  addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; }, { passive: true });
}

/** 0..1 while a tall element scrolls past a pinned viewport ("pin"), or enter→leave ("through"). */
export function progress(el: Element, mode: "pin" | "through" = "pin") {
  const r = el.getBoundingClientRect(), vh = innerHeight;
  if (mode === "through") return clamp((vh - r.top) / (vh + r.height));
  return clamp(-r.top / Math.max(1, r.height - vh));
}

/** rAF-throttled scroll + resize subscription. Returns an unsubscribe. */
export function onScroll(fn: () => void) {
  let q = false;
  const run = () => { q = false; fn(); };
  const queue = () => { if (!q) { q = true; requestAnimationFrame(run); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  fn();
  return () => { removeEventListener("scroll", queue); removeEventListener("resize", queue); };
}

export type Fit = { ctx: CanvasRenderingContext2D; w: number; h: number; dpr: number };
/** DPR-aware canvas that tracks its CSS box. */
export function fitCanvas(cv: HTMLCanvasElement, onResize?: (s: Fit) => void) {
  const ctx = cv.getContext("2d")!;
  const s: Fit = { ctx, w: 1, h: 1, dpr: 1 };
  const fit = () => {
    const r = cv.getBoundingClientRect();
    s.dpr = Math.min(devicePixelRatio || 1, 2); s.w = Math.max(1, r.width); s.h = Math.max(1, r.height);
    cv.width = Math.round(s.w * s.dpr); cv.height = Math.round(s.h * s.dpr);
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    onResize?.(s);
  };
  const ro = new ResizeObserver(fit); ro.observe(cv); fit();
  return { s, stop: () => ro.disconnect() };
}

/** rAF loop that only runs while `el` is on screen. fn(timeSeconds, dt). */
export function loop(el: Element, fn: (t: number, dt: number) => void) {
  let on = false, raf = 0, last = 0;
  const tick = (t: number) => { const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; fn(t / 1000, dt); raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(tick); }
    else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
  }, { rootMargin: "120px 0px" });
  io.observe(el);
  if (isRM()) requestAnimationFrame((t) => fn(t / 1000, 0));
  return () => { io.disconnect(); cancelAnimationFrame(raf); };
}

/** Wire the scroll-craft behaviours inside `root`. */
export function initKit(root: HTMLElement) {
  const RM = isRM(), FINE = isFine();
  const $$ = <T extends Element = HTMLElement>(s: string) => [...root.querySelectorAll<T>(s as never)] as unknown as T[];
  const offs: (() => void)[] = [];

  // Reveals (vertical-only root margin, once) and staggers (80ms, max 6).
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$("[data-stagger]").forEach((g) => [...g.children].forEach((c, i) => { (c as HTMLElement).style.setProperty("--i", String(Math.min(i, 5))); c.setAttribute("data-reveal", ""); }));
  $$("[data-reveal]").forEach((el) => (RM ? el.classList.add("is-in") : io.observe(el)));
  offs.push(() => io.disconnect());

  // Magnetic CTAs with spring physics: data-magnetic="reach,stiffness,damping,labelFactor".
  if (FINE && !RM) {
    const mags = $$("[data-magnetic]").map((el) => {
      const d = [6, 0.16, 0.74, 0.35];
      const [reach, k, damp, inner] = (el.dataset.magnetic || "").split(",").map((n, i) => (Number(n) || d[i]));
      return { el, reach: reach ?? 6, k: k ?? 0.16, damp: damp ?? 0.74, inner: inner ?? 0.35, x: 0, y: 0, vx: 0, vy: 0, label: el.querySelector<HTMLElement>("[data-magnetic-label]") };
    });
    let raf = 0;
    const tick = () => {
      let moving = false;
      for (const m of mags) {
        const r = m.el.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2 - m.x), dy = pointer.y - (r.top + r.height / 2 - m.y);
        const near = pointer.active && Math.hypot(dx / (r.width * 0.95), dy / (r.height * 1.4)) < 1;
        const tx = near ? clamp(dx / (r.width / 2), -1, 1) * m.reach : 0, ty = near ? clamp(dy / (r.height / 2), -1, 1) * m.reach : 0;
        m.vx = (m.vx + (tx - m.x) * m.k) * m.damp; m.vy = (m.vy + (ty - m.y) * m.k) * m.damp;
        m.x += m.vx; m.y += m.vy;
        m.el.style.transform = `translate3d(${m.x.toFixed(2)}px,${m.y.toFixed(2)}px,0)`;
        if (m.label) m.label.style.transform = `translate3d(${(m.x * m.inner).toFixed(2)}px,${(m.y * m.inner).toFixed(2)}px,0)`;
        m.el.classList.toggle("is-near", near);
        if (Math.abs(m.vx) + Math.abs(m.vy) + Math.abs(tx - m.x) + Math.abs(ty - m.y) > 0.05) moving = true;
      }
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("pointermove", kick, { passive: true });
    offs.push(() => { removeEventListener("pointermove", kick); cancelAnimationFrame(raf); });
  }

  // Spotlight cards (fine pointers only).
  if (FINE) {
    const h = (e: PointerEvent) => {
      const c = (e.target as Element).closest<HTMLElement>("[data-spot]");
      if (!c || !root.contains(c)) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", h, { passive: true });
    offs.push(() => root.removeEventListener("pointermove", h));
  }

  // Count-ups: data-count, data-decimals, data-prefix, data-suffix.
  $$("[data-count]").forEach((el) => {
    const to = parseFloat(el.dataset.count!), dec = Number(el.dataset.decimals || 0);
    const set = (v: number) => (el.textContent = (el.dataset.prefix || "") + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || ""));
    if (RM) return void set(to);
    set(0);
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      const t0 = performance.now();
      const step = (t: number) => { const p = clamp((t - t0) / 1400); set(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { rootMargin: "0px 0px -15% 0px" });
    o.observe(el); offs.push(() => o.disconnect());
  });

  // Pinned horizontal rail: [data-rail] > [data-rail-view] > [data-rail-track] > li.
  $$("[data-rail]").forEach((run) => {
    const view = run.querySelector<HTMLElement>("[data-rail-view]")!, track = run.querySelector<HTMLElement>("[data-rail-track]")!;
    const steps = [...track.children];
    run.style.setProperty("--steps", String(steps.length));
    const wide = matchMedia("(min-width: 900px)");
    offs.push(onScroll(() => {
      let p: number;
      if (wide.matches && !RM) {
        p = progress(run);
        const max = Math.max(0, track.scrollWidth - view.clientWidth);
        track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
      } else {
        track.style.transform = "";
        const r = run.getBoundingClientRect();
        p = clamp((innerHeight * 0.6 - r.top) / Math.max(1, r.height));
      }
      run.style.setProperty("--rp", p.toFixed(4));
      const a = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
      steps.forEach((s, i) => s.classList.toggle("is-active", i === a));
    }));
  });

  // Scroll-spy for nav links.
  const spy = $$<HTMLAnchorElement>("[data-spy] a[href^='#']");
  if (spy.length) {
    const map = new Map(spy.map((a) => [a.getAttribute("href")!.slice(1), a]));
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      spy.forEach((a) => { a.classList.remove("is-current"); a.removeAttribute("aria-current"); });
      const a = map.get(e.target.id); if (a) { a.classList.add("is-current"); a.setAttribute("aria-current", "true"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const t = document.getElementById(id); if (t) so.observe(t); });
    offs.push(() => so.disconnect());
  }

  return () => offs.forEach((f) => f());
}

export function useKit(ref: RefObject<HTMLElement | null>) {
  useEffect(() => (ref.current ? initKit(ref.current) : undefined), [ref]);
}
