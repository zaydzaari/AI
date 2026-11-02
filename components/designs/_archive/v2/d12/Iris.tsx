"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * A real camera-iris: N blades, each covering the half-plane outside a line
 * tangent to a circle of radius r. Their union leaves an N-gon aperture.
 * Uses native SVG transform attributes for exact geometry.
 */
export function Iris({ open, blades = 9, size = 1000, color = "#ECE6DA", edge = "#0E0D0C" }: { open: MotionValue<number>; blades?: number; size?: number; color?: string; edge?: string }) {
  const R = size / 2;
  const [p, setP] = useState(open.get());
  useMotionValueEvent(open, "change", (v) => setP(v));
  const r = R * 0.05 + (R * 1.45 - R * 0.05) * p * p;
  const spin = p * 70;
  const W = R * 3;
  return (
    <svg viewBox={`${-R} ${-R} ${size} ${size}`} className="h-full w-full" aria-hidden>
      <defs>
        <clipPath id="d12-housing">
          <circle r={R} />
        </clipPath>
      </defs>
      <g clipPath="url(#d12-housing)">
        {Array.from({ length: blades }).map((_, i) => {
          const shade = [1, 0.965, 0.93][i % 3];
          return (
            <g key={i} transform={`rotate(${(i * 360) / blades + spin}) translate(0 ${-r}) rotate(14)`}>
              <path d={`M ${-W} 0 L ${W} 0 L ${W} ${-W} L ${-W} ${-W} Z`} fill={color} style={{ filter: `brightness(${shade})` }} />
              <line x1={-W} y1={0} x2={W} y2={0} stroke={edge} strokeWidth={1.2} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
