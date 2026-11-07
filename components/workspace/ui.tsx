"use client";

import Link from "next/link";
import { Check, Copy, Eye, EyeOff, X, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { models, type ModelExample, type TaskStatus } from "./fixtures";

type ButtonTone = "primary" | "secondary" | "quiet" | "danger";

export function Button({ tone = "secondary", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone }) {
  return <button type={type} className={`aw-button aw-button-${tone} ${className}`} {...props} />;
}

export function ActionLink({ href, children, tone = "secondary" }: { href: string; children: ReactNode; tone?: ButtonTone }) {
  return <Link href={href} className={`aw-button aw-button-${tone}`}>{children}</Link>;
}

export function PageTitle({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <header className="aw-page-title"><div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="aw-actions">{actions}</div>}</header>;
}

export function Card({ title, detail, actions, children, className = "" }: { title?: string; detail?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`aw-card ${className}`}>
    {(title || actions) && <div className="aw-card-head"><div>{title && <h2>{title}</h2>}{detail && <p>{detail}</p>}</div>{actions}</div>}
    {children}
  </section>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "blue" | "green" | "amber" | "red" }) {
  return <span className={`aw-badge aw-badge-${tone}`}>{children}</span>;
}

export function TaskBadge({ status }: { status: TaskStatus }) {
  const tone = { Running: "blue", "Awaiting approval": "amber", Approved: "green", Rejected: "red", Completed: "green" } as const;
  return <Badge tone={tone[status]}>{status}</Badge>;
}

export function Field({ label, children, help, error, htmlFor }: { label: string; children: ReactNode; help?: string; error?: string; htmlFor?: string }) {
  return <div className="aw-field">
    {htmlFor ? <><label htmlFor={htmlFor}>{label}</label>{children}</> : <label>{label}{children}</label>}
    {(help || error) && <span className={error ? "aw-field-error" : "aw-muted"} id={htmlFor ? `${htmlFor}-note` : undefined}>{error ?? help}</span>}
  </div>;
}

export function PasswordInput({ id, name, autoComplete = "off", invalid = false, onChange }: { id: string; name: string; autoComplete?: string; invalid?: boolean; onChange?: () => void }) {
  const [show, setShow] = useState(false);
  return <div className="aw-password">
    <input id={id} name={name} type={show ? "text" : "password"} autoComplete={autoComplete} maxLength={200} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-note` : undefined} onChange={onChange} />
    <Button tone="quiet" className="aw-icon-button" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow(!show)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</Button>
  </div>;
}

export function Dialog({ title, children, onClose, className = "" }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const label = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return <dialog ref={ref} className={`aw-dialog ${className}`} aria-labelledby={label} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) ref.current?.close(); }}>
    <div className="aw-dialog-inner">
      <div className="aw-card-head"><h2 id={label}>{title}</h2><Button tone="quiet" className="aw-icon-button" aria-label="Close dialog" onClick={() => ref.current?.close()}><X size={18} /></Button></div>
      {children}
    </div>
  </dialog>;
}

export function Empty({ icon: Icon, title, detail, action }: { icon: LucideIcon; title: string; detail: string; action?: ReactNode }) {
  return <div className="aw-empty"><span className="aw-empty-icon"><Icon size={23} /></span><h2>{title}</h2><p>{detail}</p>{action}</div>;
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "success" }) {
  return <p className={`aw-notice aw-notice-${tone}`} role={tone === "error" ? "alert" : "status"}>{children}</p>;
}

export function Skeleton({ label }: { label: string }) {
  return <div className="aw-skeleton" role="status" aria-label={label}><span /><span /><span /></div>;
}

export function Segments<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return <div className="aw-segments" role="group" aria-label={label}>{options.map(option => <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div>;
}

export function Table({ label, headings, children }: { label: string; headings: string[]; children: ReactNode }) {
  return <div className="aw-table-scroll" tabIndex={0} role="region" aria-label={label}>
    <table className="aw-table"><thead><tr>{headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{children}</tbody></table>
  </div>;
}

export function ModelMark({ model }: { model: ModelExample }) {
  return <span aria-hidden className={`aw-model-mark aw-model-${model.tone}`}>{model.mark}</span>;
}

export function ModelSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return <label className="aw-model-select"><span>Model</span><select value={value} onChange={event => onChange(event.target.value)}>{models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}</select></label>;
}

export function CopyButton({ text, label = "Copy", title }: { text: string; label?: string; title?: string }) {
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const outcome = status?.text === text ? status : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus({ text, ok: true });
    } catch {
      setStatus({ text, ok: false });
    }
  }

  return <span className="aw-copy"><Button tone="quiet" onClick={copy} aria-label={title}>{outcome?.ok ? <Check size={15} /> : <Copy size={15} />}{outcome?.ok ? "Copied" : label}</Button>
    <span role="status" className={outcome?.ok === false ? "aw-field-error" : "sr-only"}>{outcome?.ok ? "Copied to clipboard." : outcome ? "Copy unavailable. Select the text to copy it." : ""}</span>
  </span>;
}

export function CodeBlock({ text, label = "Code" }: { text: string; label?: string }) {
  return <div className="aw-code"><div><span>{label}</span><CopyButton text={text} title="Copy code" /></div><pre><code>{text}</code></pre></div>;
}
