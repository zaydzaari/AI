"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { useCopy } from "@/lib/hooks";

/** Plain, readable model index; each concept supplies its own type and palette. */
export function ModelList({ title = "Choose your model." }: { title?: string }) {
  return (
    <section id="models" data-section className="sys-section simple-models">
      <div className="sys-container simple-model-layout">
        <div className="sys-head">
          <h2 className="sys-h2">{title}</h2>
          <p className="sys-small">Illustrative model names and specifications.</p>
        </div>
        <dl>
          {MODELS.map((m) => (
            <div key={m.id} className="simple-model-row">
              <dt>{m.name}</dt>
              <dd>{m.role}</dd>
              <dd className="sys-mono simple-context">{m.context}<span className="sr-only"> context window</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A product example in the hero instead of an abstract animation. */
export function APIExample() {
  const [selected, setSelected] = useState("forge");
  const { copied, copy } = useCopy();
  const model = MODELS.find((m) => m.id === selected)!;
  const suffix = selected === "unbound" ? ":abliterated" : "";
  const modelId = `${model.id}-${model.context.toLowerCase()}${suffix}`;
  const code = `const client = new OpenAI({\n  baseURL: "${BRAND.apiBase}",\n  apiKey: process.env.${BRAND.envKey},\n});\n\nconst response = await client.chat.completions.create({\n  model: "${modelId}",\n  messages: [{ role: "user", content: "Hello" }],\n});`;
  return (
    <div data-hero-part="visual" className="simple-api">
      <div className="simple-api-bar">
        <label htmlFor="simple-api-model">Model</label>
        <select id="simple-api-model" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button type="button" aria-label="Copy API example" onClick={() => copy(code)}>
          {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="sys-mono"><code>{code}</code></pre>
      <p className="sys-small">Example request · placeholder endpoint</p>
    </div>
  );
}

export function QuickStart() {
  return (
    <section id="product" data-section className="sys-section simple-explainer">
      <div className="sys-container">
        <h2 className="sys-h2">Keep the conversation.<br />Change the model.</h2>
        <div>
          <p className="sys-body">Start with a question. Switch to a coding model when you need a diff, or a longer-context model when you have more to read. Your thread stays together.</p>
          <a className="simple-text-link" href="#models">Explore the model families <span aria-hidden>↗</span></a>
          <p className="sys-small simple-note">{MOCK_NOTE}.</p>
        </div>
      </div>
    </section>
  );
}
