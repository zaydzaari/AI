import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandWordmark } from "@/components/system/Brand";
import "./docs.css";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <div className="docs-site">
    <a className="doc-skip" href="#doc-article">Skip to article</a>
    <header className="docs-header"><div>
      <Link href="/docs" className="docs-brand" aria-label="Aether documentation"><BrandWordmark /><span>Docs</span></Link>
      <nav aria-label="Aether links">
        <Link href="/designs/agent#console">Playground</Link>
        <Link href="/designs/agent">Aether Agent <ArrowUpRight size={15} aria-hidden /></Link>
      </nav>
    </div></header>
    {children}
  </div>;
}
