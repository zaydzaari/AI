"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, Search, ShieldCheck, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useBusinessDemo } from "./BusinessDemo";
import { businessSummary, candidateRoutes, customerUsage, operatingExpenses, operatingTargetCents, ownerUsageMix, type DemoCustomer } from "./businessFixtures";
import { count, money, plans } from "./fixtures";
import { ActionLink, Badge, Button, Card, Dialog, Field, ModelMark, Notice, PageTitle, Table } from "./ui";
import { UsageChart } from "./UsageChart";
import { formatUsageCost } from "./usageAnalytics";

const dollars = (cents: number) => money(cents / 100);

export function CustomerStatus({ status }: { status: DemoCustomer["status"] }) {
  return <Badge tone={status === "Active" ? "green" : "amber"}>{status}</Badge>;
}

export function CustomerIdentity({ customer }: { customer: DemoCustomer }) {
  return <span className="aw-business-identity"><span className="aw-avatar">{customer.name.split(" ").map(part => part[0]).join("")}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></span>;
}

function BusinessMetrics({ items }: { items: { label: string; value: string; note: string }[] }) {
  return <dl className="aw-business-metrics">{items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd><small>{item.note}</small></div>)}</dl>;
}

function EconomicsBreakdown() {
  const { customers } = useBusinessDemo();
  const totals = businessSummary(customers);
  return <dl className="aw-business-waterfall">
    <div><dt>Customer usage charges</dt><dd>{dollars(totals.usageCents)}</dd></div>
    <div><dt>Hypothetical upstream inference</dt><dd>−{dollars(totals.upstreamCents)}</dd></div>
    <div><dt>Sample processing fees</dt><dd>−{dollars(totals.processingCents)}</dd></div>
    <div className="aw-business-subtotal"><dt>Usage contribution</dt><dd>{dollars(totals.contributionCents)}</dd></div>
    {operatingExpenses.map(item => <div key={item.id}><dt>{item.label}</dt><dd>−{dollars(item.cents)}</dd></div>)}
    <div className="aw-business-result"><dt>Operating estimate before tax</dt><dd>{dollars(totals.operatingCents)}</dd></div>
  </dl>;
}

export function OwnerOverview() {
  const { customers, audit } = useBusinessDemo();
  const totals = businessSummary(customers);
  const mix = ownerUsageMix(customers);
  const largest = [...totals.accounts].sort((a, b) => b.retailCents - a.retailCents).slice(0, 4);

  return <div className="aw-page aw-business-page">
    <PageTitle title="Business overview" description="October 2026 · Customer usage, supplier estimates, and operating costs" actions={<ActionLink href="/owner/customers" tone="primary"><Users size={16} aria-hidden="true" /> View customers</ActionLink>} />
    <Notice>Owner demo. Customer records, supplier costs, and business results use sample data</Notice>
    <BusinessMetrics items={[
      { label: "Sample customers", value: count(customers.length), note: `${customers.filter(customer => customer.status === "Active").length} active in this demo` },
      { label: "Usage charges", value: dollars(totals.usageCents), note: "Credits consumed this month" },
      { label: "Upstream estimate", value: dollars(totals.upstreamCents), note: "Hypothetical supplier rates" },
      { label: "Operating estimate", value: dollars(totals.operatingCents), note: "After sample expenses · before tax" },
    ]} />
    <Card className="aw-overview-activity" title="Customer usage by model" detail="Illustrative October charges across all sample accounts">
      <UsageChart mix={mix} metric="cost" group="model" hrefFor={() => undefined} />
    </Card>
    <div className="aw-overview-grid">
      <Card title="Customers by usage" actions={<Link className="aw-text-link" href="/owner/customers">All customers <ArrowRight size={15} aria-hidden="true" /></Link>}>
        <ul className="aw-business-customer-list">{largest.map(({ customer, retailCents }) => <li key={customer.id}><Link href={`/owner/customers/${customer.id}`}><CustomerIdentity customer={customer} /><strong>{dollars(retailCents)}</strong><ArrowRight size={15} aria-hidden="true" /></Link></li>)}</ul>
      </Card>
      <Card title="Monthly operating goal" detail="A planning target from the company brief">
        <p className="aw-business-goal">{dollars(totals.operatingCents)}<span> / $1,000 per month</span></p>
        <meter min={0} max={operatingTargetCents} value={Math.max(0, totals.operatingCents)} aria-label="Illustrative operating estimate against goal" />
        <p className="aw-muted">This scenario excludes subscription receipts while included-credit allowances are being defined.</p>
        <Link className="aw-text-link" href="/owner/economics">Inspect the calculation <ArrowRight size={15} aria-hidden="true" /></Link>
      </Card>
    </div>
    <Card title="Owner activity" detail="Actions made in this preview session">
      {audit.length ? <ul className="aw-business-audit">{audit.slice(0, 5).map(event => <li key={event.id}><ShieldCheck size={16} aria-hidden="true" /><div><strong>{event.title}</strong><p>{customers.find(customer => customer.id === event.customerId)?.name} · {event.detail}</p></div><small>{event.time}</small></li>)}</ul> : <p className="aw-muted">No owner actions yet. Open a customer to preview a credit adjustment or account pause.</p>}
    </Card>
  </div>;
}

export function OwnerCustomers() {
  const { customers } = useBusinessDemo();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const filtered = customers.filter(customer => `${customer.name} ${customer.email}`.toLowerCase().includes(query.trim().toLowerCase()) && (!status || status === customer.status) && (!plan || plan === customer.plan));
  return <div className="aw-page aw-business-page">
    <PageTitle title="Customers" description="Inspect each sample account, its usage, available credit, and spending preferences" actions={<Badge>Demo accounts</Badge>} />
    <div className="aw-business-filters">
      <Field label="Search customers"><span className="aw-search"><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name or email" /></span></Field>
      <Field label="Account status"><select value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option><option>Active</option><option>Paused</option></select></Field>
      <Field label="Customer plan"><select value={plan} onChange={event => setPlan(event.target.value)}><option value="">All plans</option>{plans.map(item => <option key={item.name}>{item.name}</option>)}</select></Field>
    </div>
    <p className="aw-muted" role="status">{filtered.length} sample {filtered.length === 1 ? "customer" : "customers"}</p>
    <Card className="aw-business-customers-table"><Table label="Sample customers" headings={["Customer", "Available credit", "Usage charges", "Plan", "Status", "Details"]}>
      {filtered.map(customer => { const usage = customerUsage(customer); return <tr key={customer.id}>
        <td><Link href={`/owner/customers/${customer.id}`}><CustomerIdentity customer={customer} /></Link></td><td>{dollars(usage.availableCents)}</td><td>{dollars(usage.retailCents)}</td><td>{customer.plan}</td><td><CustomerStatus status={customer.status} /></td>
        <td><Link className="aw-text-link" href={`/owner/customers/${customer.id}`} aria-label={`View ${customer.name}`}>View <ArrowRight size={14} aria-hidden="true" /></Link></td>
      </tr>; })}
    </Table>{!filtered.length && <div className="aw-inline-empty"><p>No sample accounts match.</p><Button tone="quiet" onClick={() => {setQuery("");setStatus("");setPlan("");}}>Reset filters</Button></div>}</Card>
  </div>;
}

export function OwnerCustomerDetail({ customerId }: { customerId: string }) {
  const { customers, policies, audit, adjustCredit, changeStatus } = useBusinessDemo();
  const customer = customers.find(item => item.id === customerId)!;
  const usage = customerUsage(customer);
  const policy = policies[customer.id];
  const [dialog, setDialog] = useState<"credit" | "status" | null>(null);
  const [amount, setAmount] = useState("10");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const events = audit.filter(event => event.customerId === customer.id);

  function open(type: "credit" | "status") { setDialog(type); setReason(""); setError(""); setAmount("10"); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cents = Math.round(Number(amount) * 100);
    if (!reason.trim()) { setError("Add a reason for the demo activity log."); return; }
    if (dialog === "credit" && (!Number.isFinite(cents) || !cents || Math.abs(cents) > 100_000 || usage.availableCents + cents < 0)) { setError("Enter an adjustment between −$1,000 and $1,000 that keeps the balance at or above zero."); return; }
    if (dialog === "credit") adjustCredit(customer.id, cents, reason);
    else changeStatus(customer.id, customer.status === "Active" ? "Paused" : "Active", reason);
    setNotice(dialog === "credit" ? "Credit updated in the demo. Open the customer preview to see the same balance." : "Account status updated in the demo.");
    setDialog(null);
  }

  return <div className="aw-page aw-business-page">
    <Link className="aw-text-link" href="/owner/customers"><ArrowLeft size={15} aria-hidden="true" /> All customers</Link>
    <PageTitle title={customer.name} description={`${customer.email} · Joined ${customer.joined}`} actions={<ActionLink href={`/preview/customer/${customer.id}`} tone="primary"><Eye size={16} aria-hidden="true" /> Preview customer panel</ActionLink>} />
    {notice && <Notice tone="success">{notice}</Notice>}
    <BusinessMetrics items={[
      {label:"Available credit",value:dollars(usage.availableCents),note:"Prepaid sample balance"},
      {label:"October usage",value:dollars(usage.retailCents),note:`${count(usage.requests)} sample requests`},
      {label:"Plan preview",value:customer.plan,note:"Credit allowance pending definition"},
      {label:"Monthly budget",value:dollars(policy.budgetCents),note:`Alert threshold ${policy.alertPercent}%`},
    ]} />
    <div className="aw-overview-grid">
      <Card title="Usage by model" detail="Customer charges use the sample retail rates"><Table label="Customer model usage" headings={["Model","Requests","Customer charge","Upstream estimate"]}>
        {usage.rows.map(row => <tr key={row.model.id}><td><span className="aw-table-model"><ModelMark model={row.model} />{row.model.name}</span></td><td>{count(row.requests)}</td><td>{formatUsageCost(row.retail)}</td><td>{formatUsageCost(row.upstream)}</td></tr>)}
      </Table></Card>
      <Card title="Account controls" detail="Changes affect the connected demo account"><div className="aw-business-controls"><CustomerStatus status={customer.status} /><p className="aw-muted">Credit adjustments carry a reason and appear in the owner activity log.</p><Button onClick={() => open("credit")}>Adjust demo credit</Button><Button onClick={() => open("status")}>{customer.status === "Active" ? "Pause demo account" : "Resume demo account"}</Button></div></Card>
    </div>
    <Card title="Account activity">{events.length ? <ul className="aw-business-audit">{events.map(event => <li key={event.id}><ShieldCheck size={16} aria-hidden="true" /><div><strong>{event.title}</strong><p>{event.detail}</p></div><small>{event.time}</small></li>)}</ul> : <p className="aw-muted">No changes to this sample account yet.</p>}</Card>
    {dialog && <Dialog title={dialog === "credit" ? `Adjust ${customer.name}’s demo credit` : `${customer.status === "Active" ? "Pause" : "Resume"} ${customer.name} in demo`} onClose={() => setDialog(null)}>
      <form className="aw-form" onSubmit={submit}>
        {dialog === "credit" && <Field label="Credit adjustment (USD)" help="Use a positive amount to add credit or a negative amount to remove it"><input type="number" min={-1000} max={1000} step="0.01" required value={amount} onChange={event => setAmount(event.target.value)} /></Field>}
        <Field label="Reason"><textarea required maxLength={200} rows={3} value={reason} onChange={event => setReason(event.target.value)} placeholder="Explain this demo adjustment" /></Field>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="aw-dialog-actions"><Button onClick={() => setDialog(null)}>Cancel</Button><Button type="submit" tone="primary">Apply demo change</Button></div>
      </form>
    </Dialog>}
  </div>;
}

export function OwnerEconomics() {
  const { customers } = useBusinessDemo();
  const totals = businessSummary(customers);
  return <div className="aw-page aw-business-page">
    <PageTitle title="Unit economics" description="Inspect how illustrative usage charges turn into a contribution and an operating estimate" />
    <Notice>Planning example. Supplier rates, processing fees, and expenses are hypothetical.</Notice>
    <div className="aw-overview-grid"><Card title="From usage to operating estimate" detail="October 2026 · before tax"><EconomicsBreakdown /></Card>
      <div className="aw-overview-stack"><Card title="Cash and available credit"><dl className="aw-token-list"><div><dt>Sample prepaid funding</dt><dd>{dollars(totals.fundedCents)}</dd></div><div><dt>Outstanding customer credit</dt><dd>{dollars(totals.remainingCreditCents)}</dd></div></dl><p className="aw-muted">Prepaid funding and consumed credits are shown separately. Owner adjustments change available customer credit, not usage charges.</p></Card>
      <Card title="Assumptions"><ul className="aw-business-assumptions"><li>Upstream estimate is 58% of the sample retail charge.</li><li>Processing example is 2.9% plus $0.30 for each initial sample funding.</li><li>Subscription receipts are excluded until included-credit allowances are defined.</li><li>Taxes and future refund costs are outside this estimate.</li></ul></Card></div>
    </div>
  </div>;
}

export function OwnerModelRoutes() {
  return <div className="aw-page aw-business-page"><PageTitle title="Model routes" description="See the third-party model, candidate supply route, and sample retail prices together" />
    <Notice>Launch candidates. Supplier agreements and route capabilities are pending verification. Upstream rates below are hypothetical planning inputs.</Notice>
    <Card><Table label="Candidate model routes" headings={["Underlying model","Supply status","Input / 1M","Cached / 1M","Output / 1M","Upstream input estimate"]}>
      {candidateRoutes.map(route => <tr key={route.model.id}><td><span className="aw-table-model"><ModelMark model={route.model} /><span>{route.model.name}<small className="aw-table-sub">{route.model.provider}</small></span></span></td><td><Badge tone="amber">{route.agreement}</Badge></td>{route.model.rates.map((rate,index) => <td key={index}>{money(rate)}</td>)}<td>{formatUsageCost(route.upstreamRates[0])} / 1M</td></tr>)}
    </Table></Card><p className="aw-muted">These are third-party model families. Candidate routes have no live provider connection in this preview.</p>
  </div>;
}
