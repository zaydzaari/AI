import "@fontsource-variable/plus-jakarta-sans";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { BusinessDemoProvider } from "@/components/workspace/BusinessDemo";
import "@/components/workspace/workspace.css";
import "@/components/workspace/business.css";

export const metadata = { title: { default: "Aether Workspace", template: "%s | Aether" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BusinessDemoProvider><WorkspaceShell>{children}</WorkspaceShell></BusinessDemoProvider>;
}
