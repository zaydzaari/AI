"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Bot, Check, MessageSquare, Shapes } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandWordmark } from "@/components/system/Brand";
import { ActionLink, Button, Field, Notice, PasswordInput, Skeleton } from "./ui";

const copy = {
  login: { title: "Sign in to Aether", description: "Preview your workspace with sample account details", action: "Sign in to demo", loading: "Checking demo details" },
  register: { title: "Create an account", description: "Walk through the Aether registration form.", action: "Preview registration", loading: "Checking the registration form" },
  reset: { title: "Reset your password", description: "Enter a sample email to preview the recovery flow.", action: "Preview reset request", loading: "Preparing a demo confirmation" },
};

type Mode = keyof typeof copy;
type Errors = { email?: string; password?: string; confirmation?: string };

export function Auth({ mode }: { mode: Mode }) {
  const formCopy = copy[mode];
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [remembered, setRemembered] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const next: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid sample email address.";
    if (mode !== "reset" && password.length < 8) next.password = "Use at least 8 characters for the sample password.";
    if (mode === "register" && (!form.get("confirmation") || password !== form.get("confirmation"))) next.confirmation = "Enter the same sample password again.";
    setErrors(next);
    if (Object.keys(next).length) { setStatus("idle"); return; }

    const shouldFail = email.toLowerCase() === "blocked@example.com";
    setRemembered(form.has("remember"));
    event.currentTarget.querySelectorAll<HTMLInputElement>('input[name="password"], input[name="confirmation"]').forEach(input => { input.value = ""; });
    setStatus("loading");
    timer.current = window.setTimeout(() => setStatus(shouldFail ? "error" : "success"), 650);
  }

  function clearError(field: keyof Errors) {
    setErrors(current => ({ ...current, [field]: undefined }));
    if (status === "error" || status === "success") setStatus("idle");
  }

  return <main className="aw aw-auth">
    <div className="aw-auth-main">
      <Link href="/" className="aw-auth-brand" aria-label="Aether home"><BrandWordmark /></Link>
      <div className="aw-auth-inner">
        <h1>{formCopy.title}</h1><p className="aw-muted">{formCopy.description}</p>
        <Notice>Demo form. Use a made-up email{mode !== "reset" && " and password"}.</Notice>
        <form className="aw-form" noValidate autoComplete="off" onSubmit={submit}>
          <fieldset disabled={status === "loading"} className="aw-form">
            <Field label="Email address" htmlFor="auth-email" error={errors.email}><input id="auth-email" name="email" type="email" autoComplete="off" maxLength={180} placeholder="mira@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "auth-email-note" : undefined} onChange={() => clearError("email")} /></Field>
            {mode !== "reset" && <Field label="Password" htmlFor="auth-password" error={errors.password}><PasswordInput id="auth-password" name="password" invalid={Boolean(errors.password)} onChange={() => clearError("password")} /></Field>}
            {mode === "register" && <Field label="Confirm password" htmlFor="auth-confirmation" error={errors.confirmation}><PasswordInput id="auth-confirmation" name="confirmation" invalid={Boolean(errors.confirmation)} onChange={() => clearError("confirmation")} /></Field>}
            {mode === "login" && <div className="aw-auth-options"><label><input type="checkbox" name="remember" /> Remember me</label><Link href="/forgot-password" className="aw-text-link">Forgot password?</Link></div>}
            <Button type="submit" tone="primary" disabled={status === "loading"} aria-busy={status === "loading"}>{status === "loading" ? formCopy.loading : formCopy.action}<ArrowRight size={17} /></Button>
          </fieldset>
        </form>
        {status === "loading" && <Skeleton label={formCopy.loading} />}
        {status === "error" && <Notice tone="error">The demo rejected that address. Try mira@example.com.</Notice>}
        {status === "success" && <div className="aw-auth-success"><Notice tone="success">{mode === "reset" ? "Reset confirmation preview complete. No email was sent." : mode === "register" ? "Registration preview complete. You can open the demo workspace." : remembered ? "Sign-in preview complete. Remember me was selected for this demo." : "Sign-in preview complete."}</Notice><ActionLink href={mode === "reset" ? "/login" : "/dashboard"} tone="primary">{mode === "reset" ? "Back to sign in" : "Continue to dashboard"}<ArrowRight size={17} /></ActionLink></div>}
        <p className="aw-auth-links">{mode === "login" ? <>New to Aether? <Link href="/register">Create an account</Link></> : <Link href="/login"><ArrowLeft size={15} /> Back to sign in</Link>}</p>
        <p className="aw-auth-hint">Use <code>blocked@example.com</code> to preview an error.</p>
      </div>
    </div>
    <aside className="aw-auth-aside">
      <div><h2>A place for your AI work.</h2><p>Try an idea in Playground, follow an agent task, or compare the models you work with.</p>
        <ul><li><MessageSquare size={20} /><span><strong>Playground</strong><small>Prompt, compare, and refine.</small></span><Check size={17} /></li><li><Bot size={20} /><span><strong>Agent</strong><small>Follow the work and review the result.</small></span><Check size={17} /></li><li><Shapes size={20} /><span><strong>Models</strong><small>Find a model that fits the task.</small></span><Check size={17} /></li></ul>
      </div>
    </aside>
  </main>;
}
