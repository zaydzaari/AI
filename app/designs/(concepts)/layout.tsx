import "@/components/system/system.css";
import { DesignDock } from "@/components/lab/DesignDock";
import { MotionRoot } from "@/components/lab/MotionRoot";

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionRoot>
      {children}
      <DesignDock />
    </MotionRoot>
  );
}
