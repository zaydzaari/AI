import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { articles, docHref } from "./content";

const groups = [...new Set(articles.map(article => article.group))];

function DocsNavigation({ slug }: { slug: string }) {
  return <nav aria-label="Documentation" className="doc-nav">
    {groups.map(group => <div key={group}>
      <p>{group}</p>
      <ul role="list">{articles.filter(article => article.group === group).map(article => <li key={article.slug}>
        <Link href={docHref(article.slug)} aria-current={slug === article.slug ? "page" : undefined}>{article.title}</Link>
      </li>)}</ul>
    </div>)}
  </nav>;
}

export function DocPage({ article }: { article: (typeof articles)[number] }) {
  const index = articles.indexOf(article);
  const previous = articles[index - 1];
  const next = articles[index + 1];

  return <div className="doc-grid">
    <aside className="doc-sidebar"><DocsNavigation slug={article.slug} /></aside>
    <details key={article.slug} className="doc-mobile-menu"><summary>Browse documentation <ChevronDown size={17} aria-hidden /></summary><DocsNavigation slug={article.slug} /></details>
    <main className="doc-article" id="doc-article" tabIndex={-1}>
      <p className="doc-breadcrumb"><Link href="/docs">Docs</Link><span aria-hidden>/</span><span>{article.group}</span></p>
      <h1>{article.title}</h1>
      <p className="doc-summary">{article.summary}</p>
      <p className="doc-preview"><strong>API preview.</strong> The endpoint, model IDs and responses are examples for review.</p>
      {article.sections.map(section => <section key={section.id} id={section.id}>
        <h2>{section.title}</h2>
        {section.body}
      </section>)}
      <nav className="doc-pagination" aria-label="Previous and next pages">
        {previous && <Link href={docHref(previous.slug)} rel="prev"><ArrowLeft size={16} aria-hidden /><span><small>Previous</small>{previous.title}</span></Link>}
        {next && <Link href={docHref(next.slug)} rel="next"><span><small>Next</small>{next.title}</span><ArrowRight size={16} aria-hidden /></Link>}
      </nav>
    </main>
    <aside className="doc-outline"><nav aria-label="On this page"><p>On this page</p><ul role="list">
      {article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
    </ul></nav></aside>
  </div>;
}
