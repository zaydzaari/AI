"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**
 * Renders a page in an iframe at a fixed "virtual" viewport width,
 * scaled down to fit its container. Lets us show true desktop layouts
 * in half-width compare panes, and true mobile layouts at real size.
 */
export const ScaledFrame = forwardRef<
  HTMLIFrameElement | null,
  { src: string; virtualWidth: number; title: string; onLoad?: () => void; fit?: "contain" | "width" }
>(function ScaledFrame({ src, virtualWidth, title, onLoad, fit = "width" }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  useImperativeHandle(ref, () => frame.current as HTMLIFrameElement);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => setLoading(true), [src]);

  const scale = size.w ? Math.min(1, size.w / virtualWidth) : 1;
  const frameW = virtualWidth;
  const frameH = size.h / scale;
  const offsetX = Math.max(0, (size.w - virtualWidth * scale) / 2);

  return (
    <div ref={box} className="relative h-full w-full overflow-hidden">
      {size.w > 0 && (
        <iframe
          ref={frame}
          key={src}
          src={src}
          title={title}
          onLoad={() => {
            setLoading(false);
            onLoad?.();
          }}
          className="absolute top-0 border-0 bg-white"
          style={{
            left: offsetX,
            width: frameW,
            height: frameH,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            boxShadow: virtualWidth < 900 ? "0 30px 80px -20px rgba(0,0,0,.6)" : undefined,
            borderRadius: virtualWidth < 900 ? 28 / scale : 0,
          }}
        />
      )}
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Loading…</span>
        </div>
      )}
      {fit === "contain" ? null : null}
    </div>
  );
});
