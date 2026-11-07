"use client";

import Link from "next/link";
import { ArrowLeft, Coins, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { count, models, money } from "./fixtures";
import { useBusinessDemo } from "./BusinessDemo";
import { customerUsage } from "./businessFixtures";
import { Card, ModelMark, PageTitle, Segments, Table } from "./ui";
import { CreditLedger } from "./CreditLedger";
import { useWorkspace } from "./WorkspaceShell";
import { UsageChart } from "./UsageChart";
import { formatUsageCost, getUsageAnalysis, getUsageMix, members, metrics, periods, readUsageFilters, usageHref, type UsageFilters } from "./usageAnalytics";

const metricOptions = ["Requests", "Tokens", "Cost"] as const;
const metricKeys = { Requests: "requests", Tokens: "tokens", Cost: "cost" } as const;
const groupOptions = ["By model", "By member"] as const;

export function UsageDashboard() {
  const { customers } = useBusinessDemo();
  const balance = customerUsage(customers.find(customer => customer.id === "mira")!).availableCents / 100;
  const { dashboardHref } = useWorkspace();
  const filters = readUsageFilters(useSearchParams());
  const { period, metric, model, member, group, day } = filters;
  const analysis = getUsageAnalysis(filters);
  const { daily, totals, byModel, byMember } = analysis;
  const mix = getUsageMix(analysis, group, metric);
  const costParts = [
    { id: "input", label: "Uncached input", amount: totals.uncachedCost, tokens: totals.input - totals.cached },
    { id: "cached", label: "Cached input", amount: totals.cachedCost, tokens: totals.cached },
    { id: "output", label: "Output", amount: totals.outputCost, tokens: totals.output },
  ];
  const scoped = Boolean(model || member || day);
  const rows = (group === "model"
    ? byModel.map(row => ({ ...row, id: row.model.id, name: row.model.name, sub: row.model.provider, mark: <ModelMark model={row.model} /> }))
    : byMember.map(row => ({ ...row, id: row.member.id, name: row.member.name, sub: row.member.role, mark: <span className="aw-usage-member-mark" aria-hidden="true">{row.member.initials}</span> }))
  ).sort((a, b) => b.cost - a.cost);

  function update(next: Partial<UsageFilters>) {
    window.history.replaceState(null, "", usageHref({ ...filters, ...next }));
  }

  return <div className="aw-page aw-usage-page">
    <Link className="aw-text-link aw-back-to-overview" href={dashboardHref}><ArrowLeft size={15} aria-hidden="true" /> Back to dashboard</Link>
    <PageTitle title="Usage & Billing" description="See how much the demo workspace uses and where the cost comes from" actions={<Segments label="Usage period" options={periods} value={period} onChange={period => update({ period })} />} />

    <div className="aw-usage-filters" role="group" aria-label="Usage filters">
      <span className="aw-usage-filter-title"><SlidersHorizontal size={16} aria-hidden="true" /> Filter usage</span>
      <label>Model<select value={model} onChange={event => update({ model: event.target.value })}>
        <option value="">All models</option>{models.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select></label>
      <label>Member<select value={member} onChange={event => update({ member: event.target.value })}>
        <option value="">All members</option>{members.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select></label>
      {day && <button type="button" className="aw-usage-day-chip" onClick={() => update({day: ""})} aria-label={`Clear day filter ${day}`}>{day}<X size={13} aria-hidden="true" /></button>}
      <button type="button" className="aw-text-link" aria-disabled={!scoped} onClick={() => { if (scoped) update({ model: "", member: "", day: "" }); }}>Clear filters</button>
    </div>

    <Card className="aw-overview-activity" title={day ? "Usage for this day" : "Usage over time"} detail={`${day || `${daily[0].label} – ${daily.at(-1)?.label}`}, 2026`} actions={
        <Segments label="Usage chart metric" options={metricOptions} value={metric === "cost" ? "Cost" : metrics[metric].label} onChange={label => update({ metric: metricKeys[label] })} />
      }>
        <dl className="aw-usage-totals" aria-label="Usage totals for this view">
          <div><dt>Estimated cost</dt><dd>{formatUsageCost(totals.cost)}</dd></div>
          <div><dt>Requests</dt><dd>{count(totals.requests)}</dd></div>
          <div><dt>Total tokens</dt><dd>{count(totals.input + totals.output)}</dd></div>
        </dl>
        <div className="aw-mix-toolbar">
          <p>Daily {metrics[metric].label.toLowerCase()}</p>
          <Segments label="Group usage" options={groupOptions} value={group === "model" ? "By model" : "By member"} onChange={value => update({ group: value === "By model" ? "model" : "member" })} />
        </div>
        <UsageChart key={`${period}:${model}:${member}:${day}`} mix={mix} metric={metric} group={group} hrefFor={(id, selectedDay) => filters[group] === id && (!selectedDay || selectedDay === day) ? undefined : usageHref({ ...filters, [group]: id, day: selectedDay ?? day })} />
    </Card>

    <div className="aw-overview-grid aw-usage-grid">
      <Card className="aw-usage-breakdown" title="Usage breakdown" detail={group === "member" ? "Sample members ranked by estimated cost. Select a name to filter the view." : "Models ranked by estimated cost. Select a model to filter the view."}>
        {rows.length ? <Table label={group === "model" ? "Model usage breakdown" : "Member usage breakdown"} headings={[group === "model" ? "Model" : "Member", "Est. cost", "Requests", "Input tokens", "Cached input", "Output tokens"]}>
          {rows.map(row => {
            const selected = filters[group] === row.id;
            return <tr key={row.id}>
              <td><button type="button" className="aw-usage-row-filter" aria-pressed={selected} onClick={() => update({ [group]: selected ? "" : row.id })}>
                {row.mark}<span>{row.name}<small>{row.sub}</small></span>
              </button></td>
              <td><strong>{formatUsageCost(row.cost)}</strong></td><td>{count(row.requests)}</td><td>{count(row.input)}</td><td>{count(row.cached)}</td><td>{count(row.output)}</td>
            </tr>;
          })}
        </Table> : <p className="aw-muted">No sample activity matches these filters.</p>}
      </Card>
      <Card className="aw-usage-cost" title="Cost breakdown" detail="Estimated from sample rates">
        <div className="aw-usage-cost-bar" aria-hidden="true">{costParts.map(part => <span key={part.id} data-part={part.id} style={{ flexGrow: totals.cost ? part.amount / totals.cost : 0 }} />)}</div>
        <dl className="aw-usage-cost-parts">
          {costParts.map(part => <div key={part.id}>
            <dt><span data-part={part.id} aria-hidden="true" /> <span>{part.label}<small>{count(part.tokens)} tokens</small></span></dt>
            <dd>{formatUsageCost(part.amount)}</dd>
          </div>)}
        </dl>
        <p className="aw-usage-cache"><strong>{totals.input ? `${(totals.cached / totals.input * 100).toFixed(1)}%` : "0%"}</strong> of input tokens were served from cache.</p>
        <div className="aw-usage-credit"><span>Workspace demo credit<small>Across all models and members</small></span><strong>{money(balance)}</strong></div>
      </Card>
    </div>

    <CreditLedger />
    <Card title="Invoices"><div className="aw-inline-empty"><Coins size={20} aria-hidden="true" /><p>No invoices in this demo.</p></div></Card>
  </div>;
}
