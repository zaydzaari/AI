"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { BrandWordmark } from "@/components/system/Brand";
import { count, demoCredit, getModel, money, usage } from "./fixtures";
import { useBusinessDemo } from "./BusinessDemo";
import { customerUsage } from "./businessFixtures";
import { Badge, Button, Card, Dialog, ModelMark, Table } from "./ui";
import { formatUsageCost } from "./usageAnalytics";

const funding = { id: "opening", date: "Oct 1", title: "Opening demo credit", change: demoCredit * 100, after: demoCredit * 100, day: null };
let runningBalance = demoCredit;
const baselineEntries = [funding, ...usage.map((day, index) => {
  const before = Math.round(runningBalance * 100);
  runningBalance -= day.cost;
  const after = Math.round(runningBalance * 100);
  return { id: `usage-${index + 1}`, date: day.label, title: "API usage", change: after - before, after, day };
})].reverse();
type LedgerEntry = (typeof baselineEntries)[number] & { detail?: string };
const signedMoney = (cents: number) => `${cents < 0 ? "−" : cents > 0 ? "+" : ""}${money(Math.abs(cents) / 100)}`;

export function CreditLedger() {
  const { customers, audit } = useBusinessDemo();
  const account = customers.find(customer => customer.id === "mira")!;
  const balance = customerUsage(account).availableCents / 100;
  const adjustments: LedgerEntry[] = audit.filter(event => event.customerId === "mira" && event.creditDeltaCents !== undefined).map(event => ({ id: event.id, date: "Just now", title: event.title, change: event.creditDeltaCents!, after: event.balanceAfterCents!, detail: event.detail, day: null }));
  const entries = [...adjustments, ...baselineEntries];
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<LedgerEntry | null>(null);
  const visible = showAll ? entries : entries.slice(0, 5);

  return <section id="credit-history" className="aw-credit-history" aria-labelledby="aw-credit-history-title">
    <div className="aw-card-head">
      <div><h2 id="aw-credit-history-title">Credit history</h2><p>Follow the demo workspace balance through October 2026.</p></div>
      <Badge>Sample ledger</Badge>
    </div>
    <div className="aw-overview-grid">
      <Card className="aw-ledger-list" title="Balance activity" detail="Open an entry to see what contributed to it">
        <Table label="Credit activity" headings={["Date", "Activity", "Change", "Balance"]}>
          {visible.map(entry => <tr key={entry.id}>
            <td>{entry.date}</td>
            <td><button type="button" className="aw-text-link" aria-label={`${entry.title} on ${entry.date}`} onClick={() => setSelected(entry)}>
              {entry.title}<ArrowUpRight size={13} aria-hidden="true" />
            </button></td>
            <td data-credit={entry.change > 0}>{signedMoney(entry.change)}</td><td><strong>{money(entry.after / 100)}</strong></td>
          </tr>)}
        </Table>
        <div className="aw-ledger-foot"><p>{visible.length} of {entries.length} entries</p><button type="button" className="aw-text-link" onClick={() => setShowAll(value => !value)}>{showAll ? "Show fewer" : "Show all entries"}</button></div>
      </Card>
      <section className="aw-overview-credit aw-ledger-balance" aria-label="Balance summary">
        <div className="aw-overview-credit-head"><h2><BrandWordmark>Available credit</BrandWordmark></h2><span>Demo only</span></div>
        <p className="aw-overview-balance">{money(balance)}</p>
        <dl><div><dt><ArrowDownLeft size={15} aria-hidden="true" /> Opening credit</dt><dd>{money(demoCredit)}</dd></div>
          <div><dt><ArrowUpRight size={15} aria-hidden="true" /> October usage</dt><dd>−{money(customerUsage(account).retailCents / 100)}</dd></div>
          {account.adjustmentCents !== 0 && <div><dt>Demo adjustments</dt><dd>{signedMoney(account.adjustmentCents)}</dd></div>}</dl>
        <p className="aw-overview-credit-limit">Workspace balance across all models and members.</p>
      </section>
    </div>
    {selected && <Dialog title={`${selected.title} · ${selected.date}`} onClose={() => setSelected(null)} className="aw-ledger-dialog">
      <dl className="aw-ledger-summary"><div><dt>Balance change</dt><dd>{signedMoney(selected.change)}</dd></div><div><dt>Balance after</dt><dd>{money(selected.after / 100)}</dd></div></dl>
      {selected.day ? <>
        <p className="aw-muted">{count(selected.day.requests)} sample requests. Model estimates use more precision than the balance, which is shown in cents.</p>
        <Table label="Models in this usage entry" headings={["Model", "Requests", "Estimated cost"]}>
          {selected.day.models.map(row => { const model = getModel(row.modelId); return <tr key={row.modelId}><td><span className="aw-table-model"><ModelMark model={model} />{model.name}</span></td><td>{count(row.requests)}</td><td>{formatUsageCost(row.cost)}</td></tr>; })}
        </Table>
      </> : <p className="aw-muted">{selected.detail ?? `The sample workspace started October with ${money(demoCredit)} in demo credit.`}</p>}
      <div className="aw-dialog-actions"><Button onClick={() => setSelected(null)}>Close</Button></div>
    </Dialog>}
  </section>;
}
