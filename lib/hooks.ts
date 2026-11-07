"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { MODELS, PROMPTS, type Variant } from "./content";

/** Streams `text` word-by-word. Restarts whenever `key` changes. */
export function useStream(text: string, key: unknown, speed = 28, active = true) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setOut(text);
      setDone(true);
      return;
    }
    setOut("");
    setDone(false);
    const parts = text.split(/(\s+)/);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(parts.slice(0, i).join(""));
      if (i >= parts.length) {
        setDone(true);
        clearInterval(t);
      }
    }, speed);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, key, active, reduce]);
  return { out, done };
}

/** Types characters one by one (for terminal-style demos). */
export function useTypewriter(text: string, speed = 18, active = true) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setN(text.length);
      return;
    }
    setN(0);
    const t = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(t);
          return v;
        }
        return v + 1;
      });
    }, speed);
    return () => clearInterval(t);
  }, [text, speed, active, reduce]);
  return { out: text.slice(0, n), done: n >= text.length };
}

/** State machine for the many "try a prompt" demos across concepts. */
export function useChatDemo(initial = 0) {
  const [index, setIndex] = useState(initial);
  const [variant, setVariant] = useState<Variant>("Standard");
  const [runId, setRunId] = useState(0);
  const p = PROMPTS[index];
  const [modelId, setModelId] = useState(p.model);
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const stream = useStream(p.response, `${index}-${modelId}-${variant}-${runId}`, 34, runId > 0);

  const choose = useCallback((i: number) => {
    setIndex(i);
    setModelId(PROMPTS[i].model);
    const m = MODELS.find((x) => x.id === PROMPTS[i].model);
    if (m && !m.variants.includes(variantRef.current)) setVariant(m.variants[0]);
    setRunId((r) => r + 1);
  }, []);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  const pickModel = useCallback((id: string) => {
    setModelId(id);
    const m = MODELS.find((x) => x.id === id);
    if (m && !m.variants.includes(variantRef.current)) setVariant(m.variants[0]);
    setRunId((r) => r + 1);
  }, []);

  return {
    index,
    prompt: p,
    model,
    variant,
    setVariant: (v: Variant) => {
      setVariant(v);
      setRunId((r) => r + 1);
    },
    choose,
    pickModel,
    rerun: () => setRunId((r) => r + 1),
    ...stream,
    // Show a complete example on arrival; stream only after an explicit action.
    out: runId === 0 ? p.response : stream.out,
    done: runId === 0 || stream.done,
  };
}

/** True once the element has entered the viewport. */
export function useInView<T extends Element>(margin = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

/** Copy-to-clipboard with a transient "copied" flag. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return { copied, copy };
}

export function usePrefersReduced() {
  return useReducedMotion() ?? false;
}
