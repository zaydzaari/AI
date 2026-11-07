"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Plus, Search, Shapes, X } from "lucide-react";
import { useState } from "react";
import { count, models, money, type ModelExample } from "./fixtures";
import { ActionLink, Badge, Button, Card, Dialog, Empty, Field, ModelMark, PageTitle, Segments, Table } from "./ui";
import { formatUsageCost, usageHref } from "./usageAnalytics";

const categories = [...new Set(models.map(model => model.category))];
const providers = [...new Set(models.map(model => model.provider))];
const views = ["Table", "Cards"] as const;
const sorts = ["Catalogue order", "Lowest input price", "Lowest output price", "Largest context"] as const;
const rateLabels = ["Input", "Cached input", "Output"] as const;

export function ModelExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [context, setContext] = useState("");
  const [view, setView] = useState<(typeof views)[number]>("Table");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Catalogue order");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const query = search.trim().toLowerCase();
  const filtered = models.filter(model =>
    (!category || model.category === category) && (!provider || model.provider === provider) &&
    (!context || model.context >= Number(context)) &&
    `${model.name} ${model.provider} ${model.category} ${model.capabilities.join(" ")}`.toLowerCase().includes(query),
  );
  if (sort === "Lowest input price") filtered.sort((a, b) => a.rates[0] - b.rates[0]);
  if (sort === "Lowest output price") filtered.sort((a, b) => a.rates[2] - b.rates[2]);
  if (sort === "Largest context") filtered.sort((a, b) => b.context - a.context);
  const selected = selectedIds.map(id => models.find(model => model.id === id)).filter((model): model is ModelExample => Boolean(model));
  const filtersOn = Boolean(search || category || provider || context);

  function reset() {
    setSearch(""); setCategory(""); setProvider(""); setContext("");
  }

  function toggle(model: ModelExample) {
    setSelectedIds(ids => ids.includes(model.id) ? ids.filter(id => id !== model.id) : ids.length < 3 ? [...ids, model.id] : ids);
  }

  function compareButton(model: ModelExample) {
    const active = selectedIds.includes(model.id);
    return <Button tone="quiet" aria-pressed={active} disabled={!active && selectedIds.length >= 3} aria-label={`${active ? "Remove" : "Compare"} ${model.name}${active ? " from comparison" : ""}`} onClick={() => toggle(model)}>
      {active ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}{active ? "Added" : "Compare"}
    </Button>;
  }

  return <div className="aw-page aw-market">
    <PageTitle title="Model explorer" description="Find a model by capability, context window, or token price" actions={<Badge>Illustrative catalogue</Badge>} />
    <div className="aw-filter-bar">
      <Field label="Search models"><span className="aw-search"><Search size={17} aria-hidden /><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search names or capabilities" /></span></Field>
      <Field label="Category"><select value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(item => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Provider"><select value={provider} onChange={event => setProvider(event.target.value)}><option value="">All providers</option>{providers.map(item => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Context window"><select value={context} onChange={event => setContext(event.target.value)}><option value="">Any context size</option><option value="128000">128K and above</option><option value="200000">200K and above</option><option value="256000">256K and above</option></select></Field>
    </div>
    <div className="aw-market-toolbar">
      <div className="aw-actions"><p role="status">{filtered.length} {filtered.length === 1 ? "model" : "models"}</p>{filtersOn && <button type="button" className="aw-text-link" onClick={reset}>Reset filters</button>}</div>
      <div className="aw-actions"><label>Sort by <select value={sort} onChange={event => setSort(event.target.value as typeof sort)}>{sorts.map(item => <option key={item}>{item}</option>)}</select></label><Segments label="Catalogue layout" options={views} value={view} onChange={setView} /></div>
    </div>
    {selected.length > 0 && <div className="aw-model-compare-tray" aria-label="Comparison selection">
      <div><strong>Compare models</strong><p>{selected.length === 1 ? "Choose one or two more models." : `${selected.length} of 3 models selected`}</p></div>
      <ul>{selected.map(model => <li key={model.id}><button type="button" aria-label={`Remove ${model.name} from comparison`} onClick={() => toggle(model)}>{model.name}<X size={14} aria-hidden="true" /></button></li>)}</ul>
      <Button tone="primary" disabled={selected.length < 2} onClick={() => setShowComparison(true)}>Open comparison</Button>
    </div>}
    {!filtered.length ? <Card><Empty icon={Shapes} title="No matching models" detail="Try another search or clear a filter" action={<Button onClick={reset}>Reset filters</Button>} /></Card>
    : view === "Table" ? <Card className="aw-market-table">
      <p className="aw-market-scroll-hint">Swipe to see all rates and comparison controls.</p>
      <Table label="Model catalogue" headings={["Model", "Context", "Input / 1M", "Cached / 1M", "Output / 1M", "Compare"]}>
        {filtered.map(model => <tr key={model.id}>
          <td><Link className="aw-table-model" href={`/models/${model.id}`}><ModelMark model={model} /><span>{model.name}<small>{model.provider} · {model.category}</small></span></Link></td>
          <td>{model.context / 1000}K</td>{model.rates.map((rate, index) => <td key={rateLabels[index]}>{money(rate)}</td>)}<td>{compareButton(model)}</td>
        </tr>)}
      </Table>
    </Card> : <div className="aw-model-grid">{filtered.map(model => <Card key={model.id} className="aw-model-card">
      <div className="aw-model-card-top"><ModelMark model={model} /><div><h2>{model.name}</h2><p>{model.provider}</p></div><Badge>{model.category}</Badge></div>
      <p>{model.description}</p>
      <div className="aw-model-capabilities">{model.capabilities.map(capability => <span key={capability}>{capability}</span>)}</div>
      <dl><div><dt>Context</dt><dd>{model.context / 1000}K</dd></div><div><dt>Input / 1M</dt><dd>{money(model.rates[0])}</dd></div></dl>
      <div className="aw-market-card-foot"><Link className="aw-text-link" href={`/models/${model.id}`}>View model <ArrowRight size={16} aria-hidden="true" /></Link>{compareButton(model)}</div>
    </Card>)}</div>}
    <p className="aw-muted">Capabilities, context sizes, and rates are illustrative. The catalogue lists third-party model families.</p>
    {showComparison && <Dialog className="aw-model-compare-dialog" title="Compare models" onClose={() => setShowComparison(false)}>
      <p className="aw-muted">All prices are sample USD rates per million tokens.</p>
      <Table label="Selected model comparison" headings={["Specification", ...selected.map(model => model.name)]}>
        <tr><td>Provider</td>{selected.map(model => <td key={model.id}>{model.provider}</td>)}</tr>
        <tr><td>Context window</td>{selected.map(model => <td key={model.id}>{count(model.context)}</td>)}</tr>
        <tr><td>Maximum output</td>{selected.map(model => <td key={model.id}>{count(model.output)}</td>)}</tr>
        {rateLabels.map((label, index) => <tr key={label}><td>{label} / 1M</td>{selected.map(model => <td key={model.id}>{money(model.rates[index])}</td>)}</tr>)}
        <tr><td>Capabilities</td>{selected.map(model => <td key={model.id}>{model.capabilities.join(", ")}</td>)}</tr>
        <tr><td>Model details</td>{selected.map(model => <td key={model.id}><Link className="aw-text-link" href={`/models/${model.id}`}>View {model.name} <ArrowRight size={14} aria-hidden="true" /></Link></td>)}</tr>
      </Table>
    </Dialog>}
  </div>;
}

export function ModelDetail({ model }: { model: ModelExample }) {
  const [input, setInput] = useState(4000);
  const [output, setOutput] = useState(1000);
  const [cached, setCached] = useState(1000);
  const estimate = ((input - cached) * model.rates[0] + cached * model.rates[1] + output * model.rates[2]) / 1_000_000;
  const clamp = (value: number, max: number) => Math.min(max, Math.max(0, Math.trunc(value || 0)));

  return <div className="aw-page">
    <Link href="/models" className="aw-text-link"><ArrowLeft size={16} /> All models</Link>
    <div className="aw-model-detail-top"><ModelMark model={model} /><PageTitle title={model.name} description={`${model.provider} · ${model.category} · Illustrative model`} actions={<ActionLink href={`/playground?model=${model.id}`} tone="primary">Try in Playground <ArrowRight size={16} /></ActionLink>} /></div>
    <Card title="Overview"><p className="aw-prose">{model.description} This sample configuration is used by the Aether frontend preview.</p>
      <dl className="aw-model-specs"><div><dt>Context window</dt><dd>{count(model.context)} tokens</dd></div><div><dt>Maximum output</dt><dd>{count(model.output)} tokens</dd></div><div><dt>Provider</dt><dd>{model.provider}</dd></div></dl>
    </Card>
    <div className="aw-dashboard-grid">
      <Card title="Pricing breakdown" detail="Sample USD rates per million tokens"><dl className="aw-token-list">{rateLabels.map((label, i) => <div key={label}><dt>{label}</dt><dd>{money(model.rates[i])}</dd></div>)}</dl><Link className="aw-text-link" href={usageHref({metric:"cost", model:model.id})}>View sample model usage <ArrowRight size={15} aria-hidden="true" /></Link></Card>
      <Card title="Capabilities" detail="Illustrative configuration"><ul className="aw-check-list">{model.capabilities.map(capability => <li key={capability}><Check size={17} />{capability}</li>)}</ul></Card>
    </div>
    <Card className="aw-request-estimate" title="Estimate a request" detail="Cached tokens are part of the input total">
      <div className="aw-estimate-fields">
        <Field label="Input tokens"><input type="number" min={0} max={model.context - output} value={input} onChange={event => { const next = clamp(event.target.valueAsNumber, model.context - output); setInput(next); setCached(Math.min(next, cached)); }} /></Field>
        <Field label="Cached input tokens"><input type="number" min={0} max={input} value={cached} onChange={event => setCached(clamp(event.target.valueAsNumber, input))} /></Field>
        <Field label="Output tokens"><input type="number" min={0} max={Math.min(model.output, model.context - input)} value={output} onChange={event => setOutput(clamp(event.target.valueAsNumber, Math.min(model.output, model.context - input)))} /></Field>
        <div className="aw-estimate-result"><span>Estimated request cost</span><output>{formatUsageCost(estimate)}</output></div>
      </div>
    </Card>
  </div>;
}
