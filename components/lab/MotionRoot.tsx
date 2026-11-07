"use client";

import { MotionConfig } from "motion/react";
import { useStudio } from "./StudioProvider";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  const { settings } = useStudio();
  return <MotionConfig reducedMotion={settings.motion === "off" ? "always" : "user"}>{children}</MotionConfig>;
}
