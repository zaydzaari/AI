"use client";

import Link from "next/link";
import { ArrowRight, Check, KeyRound, LockKeyhole, Plus, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { initialProfile, plans, type DemoKey } from "./fixtures";
import { makeDemoKey } from "./mock";
import { useWorkspace } from "./WorkspaceShell";
import { Badge, Button, Card, CodeBlock, CopyButton, Dialog, Empty, Field, Notice, PageTitle, PasswordInput, Segments, Table } from "./ui";

type KeyDialog = { type: "create" } | { type: "created" | "revoke"; key: DemoKey };

export function ApiKeys() {
  const { keys, setKeys } = useWorkspace();
  const [dialog, setDialog] = useState<KeyDialog | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function openCreate() {
    setError("");
    setDialog({ type: "create" });
  }

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    if (!name) { setError("Enter a name for this demo key."); return; }
    const key = makeDemoKey(name, String(form.get("permission")), String(form.get("expiry")));
    setKeys(items => [key, ...items]);
    setDialog({ type: "created", key });
    setNotice("");
  }

  function revoke(key: DemoKey) {
    setKeys(items => items.filter(item => item.id !== key.id));
    setDialog(null);
    setNotice(`${key.name} was removed from this demo.`);
  }

  return <div className="aw-page">
    <PageTitle title="API Keys" description="Create and manage placeholder keys for the local workspace" actions={<Button tone="primary" onClick={openCreate}><Plus size={17} /> Create API key</Button>} />
    <Notice>All strings on this page start with <code>demo_aether_</code>. They are placeholders for testing the interface.</Notice>
    {notice && <Notice tone="success">{notice}</Notice>}
    <Card title="Workspace keys" detail={`${keys.length} active demo ${keys.length === 1 ? "key" : "keys"}`}>
      {keys.length ? <Table label="API keys" headings={["Name", "Permission", "Expires", "Last used", "Requests", "Actions"]}>
        {keys.map(key => <tr key={key.id}><td><strong>{key.name}</strong><small className="aw-table-sub"><code>demo_…{key.value.slice(-4)}</code> · {key.created}</small></td><td>{key.permission}</td><td>{key.expiry}</td><td>{key.lastUsed}</td><td>{key.requests}</td><td><div className="aw-row-actions"><CopyButton text={key.value} title={`Copy ${key.name} demo key`} /><Button tone="quiet" aria-label={`Revoke ${key.name}`} onClick={() => setDialog({ type: "revoke", key })}>Revoke</Button></div></td></tr>)}
      </Table> : <Empty icon={KeyRound} title="No demo keys yet" detail="Create a placeholder to preview permissions and usage" action={<Button tone="primary" onClick={openCreate}>Create API key</Button>} />}
    </Card>
    {dialog?.type === "create" && <Dialog key="create" title="Create a demo API key" onClose={() => setDialog(null)}>
      <form className="aw-form" onSubmit={create}>
        <Field label="API key name" htmlFor="key-name" error={error}><input id="key-name" name="name" placeholder="e.g. Local prototype" maxLength={60} aria-invalid={Boolean(error)} aria-describedby={error ? "key-name-note" : undefined} onChange={() => setError("")} /></Field>
        <Field label="Permission"><select name="permission"><option>Inference only</option><option>Read only</option><option>Full demo access</option></select></Field>
        <Field label="Expiration"><select name="expiry"><option>30 days</option><option>7 days</option><option>90 days</option></select></Field>
        <div className="aw-dialog-actions"><Button onClick={() => setDialog(null)}>Cancel</Button><Button tone="primary" type="submit">Generate placeholder</Button></div>
      </form>
    </Dialog>}
    {dialog?.type === "created" && <Dialog key="created" title="Placeholder key created" onClose={() => setDialog(null)}><p className="aw-muted">Copy this string to try the clipboard interaction.</p><CodeBlock text={dialog.key.value} label="Demo key" /><div className="aw-dialog-actions"><Button tone="primary" onClick={() => setDialog(null)}>Done</Button></div></Dialog>}
    {dialog?.type === "revoke" && <Dialog key="revoke" title="Revoke demo key?" onClose={() => setDialog(null)}><p className="aw-muted"><strong>{dialog.key.name}</strong> will be removed from the demo table.</p><div className="aw-dialog-actions"><Button onClick={() => setDialog(null)}>Cancel</Button><Button tone="danger" onClick={() => revoke(dialog.key)}>Revoke key</Button></div></Dialog>}
  </div>;
}

const billingPeriods = ["Monthly", "Yearly"] as const;
type Plan = (typeof plans)[number];
const planFeatures = [
  { label: "Personal workspace and Playground", tier: 0 },
  { label: "Model explorer", tier: 0 },
  { label: "API key management", tier: 1 },
  { label: "Model usage breakdown", tier: 1 },
  { label: "Agent approvals and task history", tier: 2 },
  { label: "Account and security preferences", tier: 3 },
];
const planMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function Pricing() {
  const [period, setPeriod] = useState<(typeof billingPeriods)[number]>("Monthly");
  const [selected, setSelected] = useState<Plan | null>(null);
  const { plan, setPlan } = useWorkspace();
  const yearly = period === "Yearly";
  const unit = yearly ? "year" : "month";
  const price = (item: Plan) => planMoney.format(item.monthly * (yearly ? 12 : 1));

  return <div className="aw-page aw-plans-page">
    <PageTitle title="Subscription plans" description="Compare the proposed plans for the Aether workspace" actions={<Segments label="Billing period" value={period} options={billingPeriods} onChange={setPeriod} />} />
    <div className="aw-plan-context"><div><strong role="status">{plan} is selected in this demo.</strong><p>Plan prices are proposals. Included credit amounts are still being defined.</p></div><Link href="/dashboard/usage#credit-history" className="aw-text-link">View demo credit <ArrowRight size={15} aria-hidden="true" /></Link></div>
    <div className="aw-plan-grid">{plans.map(item => <Card key={item.name} className={`aw-plan-card ${item.name === plan ? "aw-plan-current" : ""}`}>
      <div className="aw-plan-name"><h2>{item.name}</h2>{item.name === plan && <Badge tone="blue">Selected</Badge>}</div><p>{item.audience}</p>
      <div className="aw-plan-price"><strong>{price(item)}</strong><span> / {unit}</span></div>
      {yearly && <p className="aw-plan-credit">{planMoney.format(item.monthly)} per month × 12</p>}
      <p className="aw-plan-credit">Included credit allowance · to be defined</p>
      <Button onClick={() => setSelected(item)}>{item.name === plan ? "View plan" : "Preview plan"}</Button>
      <ul className="aw-check-list">{item.features.map(feature => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
    </Card>)}</div>
    <Card className="aw-plan-comparison" title="Compare plans" detail="Proposed access and allowances by tier"><Table label="Plan comparison" headings={["Feature", ...plans.map(item => item.name)]}>
      <tr><th scope="row">Proposed price</th>{plans.map(item => <td key={item.name} data-current={item.name === plan}><strong>{price(item)}</strong> / {unit}</td>)}</tr>
      {planFeatures.map(feature => <tr key={feature.label}><th scope="row">{feature.label}</th>{plans.map((item, index) => <td key={item.name} data-current={item.name === plan}>{index >= feature.tier ? <span className="aw-plan-included"><Check size={15} aria-hidden="true" /> Included</span> : <span className="aw-muted">—<span className="sr-only"> Outside proposed scope</span></span>}</td>)}</tr>)}
      <tr><th scope="row">Included credit allowance</th>{plans.map(item => <td key={item.name} data-current={item.name === plan}>To be defined</td>)}</tr>
    </Table></Card>
    {selected && <Dialog title={`${selected.name} plan preview`} onClose={() => setSelected(null)}>
      <p className="aw-muted">{selected.audience}</p>
      <dl className="aw-token-list aw-plan-preview-lines"><div><dt>Proposed {unit}ly price</dt><dd>{price(selected)}</dd></div><div><dt>Included credit allowance</dt><dd>To be defined</dd></div></dl>
      <p className="aw-muted">The selection applies to this local preview.</p>
      <div className="aw-dialog-actions"><Button onClick={() => setSelected(null)}>Close</Button><Button tone="primary" onClick={() => { setPlan(selected.name); setSelected(null); }}>Select demo plan</Button></div>
    </Dialog>}
  </div>;
}

export function AccountSettings() {
  const { profile, setProfile, reset } = useWorkspace();
  const [draft, setDraft] = useState(profile);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<"password" | "delete" | null>(null);
  const [passwordError, setPasswordError] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) { setError("Enter a display name."); return; }
    setProfile({ ...draft, name });
    setNotice("Preferences saved for this demo session.");
  }

  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (String(form.get("password")).length < 8) { setPasswordError("Enter a sample password with at least 8 characters."); return; }
    if (form.get("password") !== form.get("confirmation")) { setPasswordError("The sample passwords must match."); return; }
    event.currentTarget.reset();
    setDialog(null);
    setNotice("Password change preview completed. Sample values were discarded.");
  }

  return <div className="aw-page aw-settings-page">
    <PageTitle title="Settings" description="Review your demo profile, preferences, and security options" />
    {notice && <Notice tone="success">{notice}</Notice>}
    <form className="aw-settings-form" onSubmit={save}>
      <Card title="Profile" detail="How your name appears in the workspace"><div className="aw-settings-fields">
        <Field label="Display name" htmlFor="display-name" error={error}><input id="display-name" value={draft.name} onChange={event => { setDraft({ ...draft, name: event.target.value }); setError(""); }} maxLength={50} aria-invalid={Boolean(error)} aria-describedby={error ? "display-name-note" : undefined} /></Field>
        <Field label="Email preview"><input type="email" value={profile.email} readOnly /></Field>
      </div></Card>
      <Card title="Appearance" detail="Choose the background for your local workspace"><Segments label="Appearance" value={draft.appearance} options={["Light", "Soft blue"]} onChange={appearance => setDraft({ ...draft, appearance })} /></Card>
      <Card title="Notifications" detail="Preferences for the demo account"><div className="aw-settings-checks">
        {([ ["activity", "Agent task updates"], ["usage", "Usage summaries"], ["news", "Product news"] ] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={draft[key]} onChange={event => setDraft({ ...draft, [key]: event.target.checked })} />{label}</label>)}
      </div></Card>
      <div><Button type="submit" tone="primary">Save preferences</Button></div>
    </form>
    <Card title="Security" detail="Preview how account controls will look"><div className="aw-settings-row"><div><LockKeyhole size={18} /><span>Password</span></div><Button onClick={() => { setPasswordError(""); setDialog("password"); }}>Change password</Button></div><div className="aw-settings-row"><div><ShieldCheck size={18} /><span>Browser session</span></div><Badge tone="blue">Local demo</Badge></div></Card>
    <Card title="Delete demo account" detail="Reset the sample account and discard your current demo changes"><Button tone="danger" onClick={() => setDialog("delete")}>Delete demo account</Button></Card>
    {dialog === "password" && <Dialog title="Preview a password change" onClose={() => setDialog(null)}><form className="aw-form" onSubmit={changePassword}><p className="aw-muted">Use a made-up password for this preview.</p><Field label="New password" htmlFor="settings-password"><PasswordInput id="settings-password" name="password" /></Field><Field label="Confirm new password" htmlFor="settings-confirmation"><PasswordInput id="settings-confirmation" name="confirmation" /></Field>{passwordError && <Notice tone="error">{passwordError}</Notice>}<div className="aw-dialog-actions"><Button onClick={() => setDialog(null)}>Cancel</Button><Button type="submit" tone="primary">Preview change</Button></div></form></Dialog>}
    {dialog === "delete" && <Dialog title="Delete the demo account?" onClose={() => setDialog(null)}><p className="aw-muted">The workspace will return to its initial sample profile, keys, conversations, and tasks.</p><div className="aw-dialog-actions"><Button onClick={() => setDialog(null)}>Cancel</Button><Button tone="danger" onClick={() => { reset(); setDraft(initialProfile); setError(""); setDialog(null); setNotice("Demo account reset to its starting state."); }}>Reset demo account</Button></div></Dialog>}
  </div>;
}
