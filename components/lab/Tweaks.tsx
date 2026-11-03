"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/lib/tweaks.css";
import fonts from "@/lib/tweak-fonts.generated.json";
import type { TweaksInstance } from "@/lib/tweaks";

/**
 * Mounts the shared Aether Tweaks layer (lib/tweaks.js) on the current concept:
 * weighted hero load-in, soft hero exit and the live design panel. Re-mounts per route
 * so each concept keeps its own saved tweaks.
 */
export function Tweaks() {
  const pathname = usePathname();
  useEffect(() => {
    let inst: TweaksInstance | undefined;
    let cancelled = false;
    import("@/lib/tweaks.js").then(() => {
      const root = document.querySelector<HTMLElement>(".kit");
      if (cancelled || !root || !window.AetherTweaks) return;
      inst = window.AetherTweaks.init({ root, scope: root, fonts, key: "aether-lab-tweaks:" + pathname });
    });
    return () => {
      cancelled = true;
      inst?.destroy();
    };
  }, [pathname]);
  return null;
}
