// Types for lib/tweaks.js (plain JS so the static collection can inline the same file).
export {};

export type TweakFont = { name: string; url: string; style?: string; weight?: string };
export type TweaksInstance = { state: Record<string, unknown>; replay: () => void; destroy: () => void };

declare global {
  interface Window {
    AetherTweaks?: {
      init: (opts: { root?: HTMLElement; scope?: ParentNode; fonts?: TweakFont[]; key?: string }) => TweaksInstance;
    };
  }
}
