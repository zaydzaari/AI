"use client";

import { ArrowUpRight, Bot, Search, Shapes, Users, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { models, type DemoTask } from "./fixtures";
import { Dialog } from "./ui";

type SearchLink = { title: string; href: string; icon: LucideIcon };
type SearchResult = SearchLink & { section: string; detail: string };

export function WorkspaceSearch({ links, tasks, customers = [], onClose }: { links: SearchLink[]; tasks: DemoTask[]; customers?: { id: string; name: string; email: string }[]; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);
  const candidates: SearchResult[] = [
    ...links.map(link => ({ ...link, section: "Pages", detail: link.title === "Dashboard" ? "Return to your selected view" : "Workspace navigation" })),
    ...models.map(model => ({ title: model.name, href: `/models/${model.id}`, icon: Shapes, section: "Models", detail: `${model.provider} · ${model.category}` })),
    ...tasks.slice(0, 8).map(task => ({ title: task.title, href: `/agent?task=${encodeURIComponent(task.id)}`, icon: Bot, section: "Tasks", detail: task.status })),
    ...customers.map(customer => ({ title: customer.name, href: `/owner/customers/${customer.id}`, icon: Users, section: "Customers", detail: customer.email })),
  ];
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = candidates.filter(item => terms.every(term => `${item.title} ${item.section} ${item.detail}`.toLowerCase().includes(term)));
  const current = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    resultsRef.current?.querySelector(`[data-index="${current}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  function open(result: SearchResult) {
    onClose();
    router.push(result.href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      setActive((current + offset + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      open(results[current]);
    }
  }

  return <Dialog title="Search workspace" className="aw-search-dialog" onClose={onClose}>
    <div className="aw-workspace-search-input">
      <Search size={19} aria-hidden="true" />
      <input autoFocus type="search" role="combobox" aria-label="Search pages, models, and tasks" aria-autocomplete="list" aria-expanded="true" aria-controls={listId} aria-activedescendant={results.length ? `${listId}-${current}` : undefined} value={query} maxLength={120} placeholder="Search pages, models, or tasks…" onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={onKeyDown} />
    </div>
    <span className="sr-only" role="status">{results.length} {results.length === 1 ? "result" : "results"}</span>
    <div className="aw-search-results" id={listId} ref={resultsRef} role="listbox" aria-label="Search results">
      {results.map((item, index) => <div role="option" aria-selected={index === current} key={item.href} id={`${listId}-${index}`} data-index={index} className="aw-search-result" onMouseEnter={() => setActive(index)} onClick={() => open(item)}>
        <span className="aw-search-result-icon"><item.icon size={18} aria-hidden="true" /></span>
        <div><strong>{item.title}</strong><small>{item.detail}</small></div>
        <span className="aw-search-result-section">{item.section}</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </div>)}
    </div>
    {!results.length && <div className="aw-search-no-results"><strong>No matching results</strong><p>Try “billing”, “coding”, or part of a task name.</p></div>}
    <footer className="aw-search-footer"><p><kbd>↑</kbd><kbd>↓</kbd> Navigate <kbd>Enter</kbd> Open</p><span><kbd>Esc</kbd> Close</span></footer>
  </Dialog>;
}
