import "@/components/system/system.css";
import { DesignDock } from "@/components/lab/DesignDock";
import { MotionRoot } from "@/components/lab/MotionRoot";
import { Tweaks } from "@/components/lab/Tweaks";

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionRoot>
      {children}
      <DesignDock />
      <Tweaks />
    </MotionRoot>
  );
}
