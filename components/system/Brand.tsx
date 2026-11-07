import { ArrowUpRight } from "lucide-react";

/** Two routes join a single thread: Aether's small, repeatable brand device. */
export function BrandWordmark({ children = "Aether" }: { children?: React.ReactNode }) {
  return <span className="aether-wordmark"><svg className="aether-glyph" width="26" height="24" viewBox="0 0 26 24" fill="none" aria-hidden="true"><path d="M3 5h4c5 0 5 7 10 7h5M3 19h4c5 0 5-7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="22" cy="12" r="2" fill="currentColor"/></svg><span>{children}</span></span>;
}

export function HeaderAccess() {
  return <a href="#start" className="refined-header-access">Get access <ArrowUpRight size={15} aria-hidden="true"/></a>;
}
