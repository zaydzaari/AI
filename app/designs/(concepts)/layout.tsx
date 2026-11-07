import "@/components/system/system.css";
import "@/components/system/simple.css";
import "@/components/lab/studio.css";
import "@/components/system/refined.css";
import "@fontsource-variable/sora";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/instrument-serif";
import { StudioControls } from "@/components/lab/StudioControls";
import { StudioProvider } from "@/components/lab/StudioProvider";
import { MotionRoot } from "@/components/lab/MotionRoot";

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider><MotionRoot>
      {children}
      <StudioControls />
    </MotionRoot></StudioProvider>
  );
}
