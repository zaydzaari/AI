"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeExample({ label, code }: { label: string; code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return <div className="doc-code">
    <div className="doc-code-bar">
      <span>{label}</span>
      <button type="button" onClick={copyCode} aria-label={`Copy ${label} example`}>
        {status === "copied" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
        {status === "copied" ? "Copied" : "Copy"}
      </button>
    </div>
    <pre><code>{code}</code></pre>
    <span role="status" className={status === "failed" ? "doc-copy-error" : "sr-only"}>{status === "copied" ? "Copied to clipboard." : status === "failed" ? "Copy was unavailable. Select the code to copy it manually." : ""}</span>
  </div>;
}
