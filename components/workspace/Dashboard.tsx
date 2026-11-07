"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Bot, KeyRound, MessageSquare, Plus, ShieldCheck, Wallet } from "lucide-react";
import { useEffect } from "react";
import { money } from "./fixtures";
import { useBusinessDemo } from "./BusinessDemo";
import { customerUsage } from "./businessFixtures";
import { useWorkspace } from "./WorkspaceShell";
import { ActionLink, Card, PageTitle, Segments, TaskBadge } from "./ui";
import { UsageChart } from "./UsageChart";
import { formatUsageCost, getDashboardHref, getUsageAnalysis, getUsageMix, getWeeklyChange, metrics, metricValue, periods, readUsageFilters, usageHref, type UsageFilters } from "./usageAnalytics";

const overviewMetrics = ["requests", "tokens", "cost"] as const;
const breakdowns = ["Models", "Members"] as const;

export function Dashboard() {
  const { customers } = useBusinessDemo();
  const account = customers.find(customer => customer.id === "mira")!;
  const balance = customerUsage(account).availableCents / 100;
  const demoCredit = (account.fundedCents + account.adjustmentCents) / 100;
  const { plan, tasks, keys, setDashboardHref } = useWorkspace();
  const { period, metric, group } = readUsageFilters(useSearchParams());
  const dashboardHref = getDashboardHref({ period, metric, group });
  const analysis = getUsageAnalysis({ period, model: "", member: "", group });
  const { daily, totals } = analysis;
  const mix = getUsageMix(analysis, group, metric);
  const tokens = totals.input + totals.output;
  const pendingTasks = tasks.filter(task => task.status === "Awaiting approval");
  const reviewHref = pendingTasks.length ? `/agent?task=${encodeURIComponent(pendingTasks[0].id)}` : "/agent";
  const average = {
    requests: `${(totals.requests / daily.length).toFixed(1)} per day`,
    tokens: `${Math.round(tokens / (totals.requests || 1)).toLocaleString("en-US")} per request`,
    cost: `${formatUsageCost(totals.requests ? totals.cost / totals.requests : 0)} per request`,
  };

  useEffect(() => setDashboardHref(dashboardHref), [dashboardHref, setDashboardHref]);

  function updateView(next: Partial<Pick<UsageFilters, "period" | "metric" | "group">>) {
    window.history.replaceState(null, "", getDashboardHref({ period, metric, group, ...next }));
  }

  return <div className="aw-page aw-overview">
    <PageTitle title="Workspace overview" description="Usage, credits, and agent activity for your demo workspace" actions={<ActionLink href="/agent" tone="primary"><Plus size={17} aria-hidden="true" /> New agent task</ActionLink>} />

    {pendingTasks.length > 0 && <div className="aw-overview-review">
      <ShieldCheck size={20} aria-hidden="true" />
      <div><strong>{pendingTasks.length === 1 ? "A task is ready for your review" : `${pendingTasks.length} tasks are ready for your review`}</strong><p>{pendingTasks[0].title}</p></div>
      <Link href={reviewHref} className="aw-text-link">Review task <ArrowRight size={15} aria-hidden="true" /></Link>
    </div>}

    <Card className="aw-overview-activity" title="Usage activity" detail={`${daily[0].label} – ${daily.at(-1)?.label}, 2026 · Demo data`} actions={<Segments label="Dashboard usage period" options={periods} value={period} onChange={period => updateView({ period })} />}>
          <div className="aw-overview-metrics" role="group" aria-label="Chart metric">
            {overviewMetrics.map(option => {
              const change = period === "Last 7 days" ? getWeeklyChange(option) : null;
              return <button type="button" key={option} aria-pressed={metric === option} onClick={() => updateView({ metric: option })}>
                <span>{metrics[option].label}</span><strong>{metrics[option].format(metricValue(totals, option))}</strong>
                <small>{change === null ? average[option] : `${change > 0 ? "+" : ""}${change.toFixed(1)}% vs previous 7 days`}</small>
              </button>;
            })}
          </div>
          <div className="aw-mix-toolbar">
            <p>Daily {metrics[metric].label.toLowerCase()}</p>
            <Segments label="Break down activity by" options={breakdowns} value={group === "model" ? "Models" : "Members"} onChange={value => updateView({ group: value === "Models" ? "model" : "member" })} />
          </div>
          <UsageChart key={period} mix={mix} metric={metric} group={group} hrefFor={(id, day) => usageHref({ period, metric, group, [group]: id, day })} />
          <div className="aw-overview-activity-foot">
            <p className="aw-mix-efficiency"><span><strong>{totals.input ? (totals.cached / totals.input * 100).toFixed(1) : "0"}%</strong> input cache hit</span><span><strong>{formatUsageCost(tokens ? totals.cost / tokens * 1_000_000 : 0)}</strong> / 1M tokens</span></p>
            <Link href={usageHref({ period, metric, group })} className="aw-text-link">Usage details <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
    </Card>

    <div className="aw-overview-grid">
      <div className="aw-overview-stack">
        <Card className="aw-overview-history" title="Recent agent tasks" actions={<Link className="aw-text-link" href="/agent">Task history <ArrowRight size={15} aria-hidden="true" /></Link>}>
          {tasks.length ? <ul className="aw-overview-tasks">{tasks.slice(0, 4).map(task => <li key={task.id}>
            <Link href={`/agent?task=${encodeURIComponent(task.id)}`}>
              <span className="aw-overview-task-icon"><Bot size={17} aria-hidden="true" /></span>
              <span className="aw-overview-task-name"><strong>{task.title}</strong><small>{task.time}</small></span>
              <TaskBadge status={task.status} />
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </li>)}</ul> : <p className="aw-muted">No agent tasks yet. Start a demo task to see it here.</p>}
        </Card>
      </div>
      <div className="aw-overview-stack">
      <section className="aw-overview-credit" aria-labelledby="aw-overview-credit-title">
        <div className="aw-overview-credit-head"><h2 id="aw-overview-credit-title"><Wallet size={17} aria-hidden="true" /> Demo credit</h2><span>{plan} plan</span></div>
        <p className="aw-overview-balance">{money(balance)} <span>available</span></p>
        <meter min={0} max={demoCredit} value={balance} aria-label="Available demo credit" aria-valuetext={`${money(balance)} remaining of ${money(demoCredit)}`} />
        <p className="aw-overview-credit-limit">of {money(demoCredit)} in sample credits</p>
        <div className="aw-overview-credit-foot">
          <Link href="/dashboard/api-keys">{keys.length} active demo {keys.length === 1 ? "key" : "keys"}</Link>
          <Link href="/dashboard/usage#credit-history">Credit history <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </section>
        <Card className="aw-overview-shortcuts" title="Quick access">
          <div className="aw-quick-links">
            <Link href="/playground"><span><MessageSquare size={17} aria-hidden="true" /></span><div><strong>Open Playground</strong><small>Try a prompt with a model</small></div><ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/models"><span><Bot size={17} aria-hidden="true" /></span><div><strong>Compare models</strong><small>Match context, capabilities, and price</small></div><ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/dashboard/api-keys"><span><KeyRound size={17} aria-hidden="true" /></span><div><strong>Manage API keys</strong><small>Create or revoke demo keys</small></div><ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </Card>
      </div>
    </div>
  </div>;
}
