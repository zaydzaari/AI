"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BellRing, Wallet } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useBusinessDemo } from "./BusinessDemo";
import { customerUsage } from "./businessFixtures";
import { count, money, plans } from "./fixtures";
import { ActionLink, Badge, Button, Card, Field, ModelMark, Notice, PageTitle, Table } from "./ui";
import { formatUsageCost } from "./usageAnalytics";

export function CustomerPanel({ customerId = "mira", preview = false }: { customerId?: string; preview?: boolean }) {
  const { customers, policies, audit, savePolicy } = useBusinessDemo();
  const customer = customers.find(item => item.id === customerId)!;
  const usage = customerUsage(customer);
  const policy = policies[customer.id];
  const [budget, setBudget] = useState((policy.budgetCents / 100).toFixed(2));
  const [threshold, setThreshold] = useState(policy.alertPercent);
  const [pause, setPause] = useState(policy.pauseAtLimit);
  const [notice, setNotice] = useState("");
  const plan = plans.find(item => item.name === customer.plan)!;
  const usedPercent = policy.budgetCents ? usage.retailCents / policy.budgetCents * 100 : usage.retailCents ? 100 : 0;
  const limitReached = usage.retailCents >= policy.budgetCents;
  const creditEvents = audit.filter(event => event.customerId === customer.id && event.creditDeltaCents !== undefined);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cents = Math.round(Number(budget) * 100);
    if (!Number.isSafeInteger(cents) || cents < 0 || cents > 1_000_000) return;
    savePolicy(customer.id, { budgetCents: cents, alertPercent: threshold, pauseAtLimit: pause });
    setNotice("Spending preferences saved in the demo.");
  }

  return <div className="aw-page aw-business-page">
    {preview && <div className="aw-customer-preview"><div><strong>Customer panel preview</strong><p>Viewing {customer.name}’s sample account.</p></div><Link className="aw-text-link" href={`/owner/customers/${customer.id}`}><ArrowLeft size={15} aria-hidden="true" /> Back to owner</Link></div>}
    <PageTitle title="Your spending" description={`${customer.name} · October 2026 · Demo account`} actions={<Badge tone={customer.status === "Active" ? "blue" : "amber"}>{customer.status}</Badge>} />
    {customer.status === "Paused" && <Notice>This sample account is paused. Its balance and usage remain available to inspect.</Notice>}
    <div className="aw-overview-grid">
      <Card title="October usage" detail="Charges, requests, and tokens use one consistent sample dataset">
        <dl className="aw-customer-totals"><div><dt>Credits consumed</dt><dd>{money(usage.retailCents / 100)}</dd></div><div><dt>Requests</dt><dd>{count(usage.requests)}</dd></div><div><dt>Input + output tokens</dt><dd title={`${count(usage.tokens)} tokens`} aria-label={`${count(usage.tokens)} tokens`}>{new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(usage.tokens)}</dd></div></dl>
        <div className="aw-customer-budget-readout"><div><strong>Monthly spending budget</strong><span>{money(usage.retailCents / 100)} / {money(policy.budgetCents / 100)}</span></div><meter min={0} max={Math.max(1, policy.budgetCents)} value={Math.min(usage.retailCents, Math.max(1, policy.budgetCents))} aria-label="Usage against monthly demo budget" /><p>{limitReached ? "The preview budget has been reached." : `${money(Math.max(0, policy.budgetCents - usage.retailCents) / 100)} remains in this preview budget.`}</p></div>
      </Card>
      <section className="aw-overview-credit aw-customer-credit" aria-label="Your available credit"><div className="aw-overview-credit-head"><h2><Wallet size={17} aria-hidden="true" /> Available credit</h2><span>Demo</span></div><p className="aw-overview-balance">{money(usage.availableCents / 100)}</p><p className="aw-overview-credit-limit">Prepaid sample credit · {customer.plan} plan preview</p><div className="aw-overview-credit-foot"><span>Opening credit {money(customer.fundedCents / 100)}</span><a href="#credit-activity">View activity <ArrowRight size={14} aria-hidden="true" /></a></div></section>
    </div>
    {usedPercent >= policy.alertPercent && <div className="aw-customer-budget-alert"><BellRing size={18} aria-hidden="true" /><div><strong>{limitReached ? "Budget limit preview" : "Spending alert preview"}</strong><p>{policy.budgetCents ? `${usedPercent.toFixed(1)}% of your monthly demo budget has been used.` : "Your demo budget is set to $0."} {policy.pauseAtLimit ? "Your selected policy would pause paid requests at the limit." : "Your selected policy would allow paid usage beyond the budget."}</p></div></div>}
    <div className="aw-overview-grid">
      <Card title="Spending preferences" detail="Preview your budget and when you would receive an alert">
        <form className="aw-form" onSubmit={save}><div className="aw-business-form-grid">
          <Field label="Monthly budget (USD)"><input type="number" required min={0} max={10000} step="0.01" value={budget} onChange={event => {setBudget(event.target.value);setNotice("");}} /></Field>
          <Field label="Alert threshold"><select value={threshold} onChange={event => {setThreshold(Number(event.target.value));setNotice("");}}>{[50, 80, 90, 100].map(value => <option key={value} value={value}>{value}% of budget</option>)}</select></Field>
        </div><label className="aw-business-checkbox"><input type="checkbox" checked={pause} onChange={event => {setPause(event.target.checked);setNotice("");}} /><span>Pause paid requests at the budget limit</span></label><p className="aw-muted">Budget behavior is simulated in this preview.</p><div className="aw-actions"><Button type="submit" tone="primary">Save demo preferences</Button>{notice && <span className="aw-muted" role="status">{notice}</span>}</div></form>
      </Card>
      <Card title="Your plan preview" detail={`${customer.plan} · ${money(plan.monthly)} proposed per month`}><p className="aw-muted">The included credit allowance is being defined. Your prepaid balance and the proposed subscription price are shown separately.</p><ul className="aw-business-plan-features">{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul><ActionLink href="/pricing">Compare proposed plans <ArrowRight size={15} aria-hidden="true" /></ActionLink></Card>
    </div>
    <Card title="Where your credits went" detail="Sample retail rates include fresh input, cached input, and output"><Table label="Your model spending" headings={["Model","Estimated charge","Requests","Input tokens","Cached input","Output tokens"]}>
      {usage.rows.map(row => <tr key={row.model.id}><td><span className="aw-table-model"><ModelMark model={row.model} />{row.model.name}</span></td><td>{formatUsageCost(row.retail)}</td><td>{count(row.requests)}</td><td>{count(row.input)}</td><td>{count(row.cached)}</td><td>{count(row.output)}</td></tr>)}
    </Table></Card>
    <section id="credit-activity" className="aw-credit-history"><Card title="Credit activity" detail="Funding, usage, and owner adjustments for this sample account"><dl className="aw-business-waterfall"><div><dt>Opening demo credit</dt><dd>+{money(customer.fundedCents / 100)}</dd></div><div><dt>October usage</dt><dd>−{money(usage.retailCents / 100)}</dd></div>{creditEvents.map(event => <div key={event.id}><dt>{event.title}<small>{event.detail}</small></dt><dd>{(event.creditDeltaCents ?? 0) >= 0 ? "+" : "−"}{money(Math.abs(event.creditDeltaCents ?? 0) / 100)}</dd></div>)}<div className="aw-business-result"><dt>Available demo credit</dt><dd>{money(usage.availableCents / 100)}</dd></div></dl></Card></section>
  </div>;
}
